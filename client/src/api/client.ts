import {
  StudentProfile,
  Subject,
  Topic,
  TutorExplanation,
  VisionTranscription,
  QuizGeneration,
  SavedNote,
  Achievement,
  SystemHealth
} from '../types/index.js';
import {
  fallbackProfile,
  fallbackSubjects,
  fallbackTopics,
  getFallbackTutorExplanation,
  getFallbackVisionTranscription,
  getFallbackQuiz
} from './offlineFallback.js';

const API_BASE = '/api';

// Helper for local storage persistence during static / GitHub Pages hosting
function getLocalItem<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(`learnova_${key}`);
    return raw ? JSON.parse(raw) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setLocalItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(`learnova_${key}`, JSON.stringify(value));
  } catch {}
}

export function getStoredApiKey(): string {
  const key =
    localStorage.getItem('learnova_gemini_api_key') ||
    localStorage.getItem('learnova_gemini_key') ||
    '';
  return key.trim();
}

/**
 * Resilient JSON extractor that safely handles:
 * - Markdown fences (```json ... ``` or ``` ... ```)
 * - Leading / trailing conversational preambles
 * - Newline anomalies
 */
export function extractJsonFromText(rawText: string): any {
  if (!rawText || !rawText.trim()) {
    throw new Error('Received empty response from Gemini model');
  }

  let clean = rawText.trim();

  // 1. Strip markdown fences if present
  if (clean.includes('```')) {
    clean = clean.replace(/```(?:json)?\s*([\s\S]*?)\s*```/gi, '$1').trim();
  }

  // 2. Isolate JSON object between the outermost '{' and '}'
  const firstBrace = clean.indexOf('{');
  const lastBrace = clean.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    clean = clean.substring(firstBrace, lastBrace + 1);
  }

  return JSON.parse(clean);
}

export async function checkApiHealth(): Promise<SystemHealth> {
  try {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) throw new Error('Unreachable');
    return await res.json();
  } catch {
    const key = getStoredApiKey();
    return {
      status: 'ok',
      service: 'Learnova AI (Client PWA Mode)',
      version: '1.0.0',
      geminiConfigured: Boolean(key),
      defaultModelText: 'gemini-1.5-flash',
      defaultModelVision: 'gemini-1.5-flash',
      mode: key ? 'live_ai' : 'offline_socratic',
      timestamp: new Date().toISOString()
    };
  }
}

export async function getProfile(): Promise<StudentProfile> {
  try {
    const res = await fetch(`${API_BASE}/profile`);
    if (!res.ok) throw new Error('Unreachable');
    const data = await res.json();
    return data.profile;
  } catch {
    return getLocalItem<StudentProfile>('profile', fallbackProfile);
  }
}

export async function updateProfile(updates: Partial<StudentProfile>): Promise<StudentProfile> {
  try {
    const res = await fetch(`${API_BASE}/profile`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Unreachable');
    const data = await res.json();
    return data.profile;
  } catch {
    const current = getLocalItem<StudentProfile>('profile', fallbackProfile);
    const updated = { ...current, ...updates };
    setLocalItem('profile', updated);
    return updated;
  }
}

export async function resetDemoProfile(): Promise<StudentProfile> {
  try {
    const res = await fetch(`${API_BASE}/profile/demo`, { method: 'POST' });
    if (!res.ok) throw new Error('Unreachable');
    const data = await res.json();
    return data.profile;
  } catch {
    setLocalItem('profile', fallbackProfile);
    return fallbackProfile;
  }
}

export interface AskTutorParams {
  question: string;
  subject: string;
  grade: number;
  language?: string;
  style?: string;
  forceComplexModel?: boolean;
}

export interface AskTutorResponse {
  success: boolean;
  explanation: TutorExplanation;
  verification?: any;
  metadata: {
    modelUsed: string;
    isDemo: boolean;
    executionTimeMs: number;
    timestamp: string;
  };
}

export async function askTutor(params: AskTutorParams): Promise<AskTutorResponse> {
  const startTime = Date.now();
  const apiKey = getStoredApiKey();

  // 1. First attempt: Dedicated Backend Proxy (if running locally or hosted on Express)
  try {
    const res = await fetch(`${API_BASE}/tutor/ask`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(apiKey ? { 'x-gemini-api-key': apiKey } : {})
      },
      body: JSON.stringify(params),
    });
    if (res.ok) {
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const data = await res.json();
        if (data.explanation) return data;
      }
    }
  } catch {
    // Backend offline / GitHub Pages mode — proceed to Direct Google Gemini integration
  }

  // 2. Second attempt: Direct Client-to-Gemini Call using student's API key
  let directErrorMessage = '';
  if (apiKey) {
    // Priority order of models to maximize success rate across Google AI quotas
    const candidateModels = ['gemini-1.5-flash', 'gemini-2.0-flash', 'gemini-1.5-pro'];

    for (const modelName of candidateModels) {
      try {
        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{
                parts: [{
                  text: `You are an elite, child-friendly Socratic STEM tutor for Grade ${params.grade} school students in ${params.subject}.
Language mode: ${params.language || 'English'} (keep mathematical formulas strictly in standard LaTeX notation).
Question: "${params.question}".

Break down the problem using this structured 9-part pedagogical schema and return ONLY raw JSON:
{
  "questionIntent": "Short 1-sentence summary of the learning goal",
  "requiredConcepts": ["Concept 1", "Concept 2"],
  "stepByStepReasoning": [
    {"stepNumber": 1, "title": "Identify Given Parameters", "explanation": "Clear explanation", "mathExpression": "$LaTeX formula$"},
    {"stepNumber": 2, "title": "Apply Governing Law", "explanation": "Step calculation", "mathExpression": "$LaTeX formula$"}
  ],
  "finalAnswer": "The conclusive answer with units",
  "whyMethodWorks": "Pedagogical explanation of why this physical or mathematical theorem applies",
  "realWorldAnalogy": "Everyday intuitive analogy relatable for a school student",
  "commonMistakes": "Key conceptual pitfall to avoid during exams",
  "understandingCheckQuestion": {
    "question": "A quick multiple-choice check question",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswerIndex": 0,
    "explanation": "Why this option is correct"
  },
  "suggestedNextTopic": "Suggested next topic to study"
}`
                }]
              }],
              generationConfig: {
                temperature: 0.3,
                maxOutputTokens: 2048
              }
            })
          }
        );

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          const rawText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            const parsed = extractJsonFromText(rawText);
            // Ensure essential fields exist
            if (parsed.stepByStepReasoning && parsed.finalAnswer) {
              return {
                success: true,
                explanation: parsed,
                metadata: {
                  modelUsed: `Google ${modelName} (Direct Live AI)`,
                  isDemo: false,
                  executionTimeMs: Date.now() - startTime,
                  timestamp: new Date().toISOString()
                }
              };
            }
          }
        } else {
          const errData = await geminiRes.json().catch(() => ({}));
          directErrorMessage = errData.error?.message || `HTTP ${geminiRes.status}`;
          console.warn(`[Learnova AI] Model ${modelName} call status ${geminiRes.status}:`, directErrorMessage);
        }
      } catch (err: any) {
        directErrorMessage = err.message || 'Network error';
        console.warn(`[Learnova AI] Failed attempt on ${modelName}:`, err);
      }
    }
  }

  // 3. Fallback: Deterministic Socratic Curriculum Engine
  const explanation = getFallbackTutorExplanation(
    params.question,
    params.subject,
    params.grade,
    params.language || 'en'
  );

  return {
    success: true,
    explanation,
    metadata: {
      modelUsed: directErrorMessage
        ? `Socratic Engine (API note: ${directErrorMessage.slice(0, 45)}...)`
        : 'Learnova Socratic Engine (Deterministic Offline Mode)',
      isDemo: true,
      executionTimeMs: Date.now() - startTime,
      timestamp: new Date().toISOString(),
    },
  };
}

export interface AnalyzeImageParams {
  imageFile?: File;
  imageBase64?: string;
  mimeType?: string;
  subject: string;
  grade: number;
  mode?: 'transcribe_only' | 'solve';
}

export interface AnalyzeImageResponse {
  success: boolean;
  transcription: VisionTranscription;
  solution?: TutorExplanation | null;
  metadata: {
    modelUsed: string;
    isDemo: boolean;
    executionTimeMs: number;
  };
}

export async function analyzeImage(params: AnalyzeImageParams): Promise<AnalyzeImageResponse> {
  const startTime = Date.now();
  const apiKey = getStoredApiKey();

  // 1. Try Backend Proxy if available
  try {
    let body: FormData | string;
    const headers: Record<string, string> = {};
    if (apiKey) headers['x-gemini-api-key'] = apiKey;

    if (params.imageFile) {
      const formData = new FormData();
      formData.append('image', params.imageFile);
      formData.append('subject', params.subject);
      formData.append('grade', String(params.grade));
      formData.append('mode', params.mode || 'solve');
      body = formData;
    } else {
      headers['Content-Type'] = 'application/json';
      body = JSON.stringify({
        imageBase64: params.imageBase64,
        mimeType: params.mimeType,
        subject: params.subject,
        grade: params.grade,
        mode: params.mode || 'solve',
      });
    }

    const res = await fetch(`${API_BASE}/tutor/analyze-image`, {
      method: 'POST',
      headers,
      body,
    });

    if (res.ok) {
      const data = await res.json();
      if (data.transcription) return data;
    }
  } catch {
    // Backend offline / GitHub Pages mode
  }

  // 2. Direct Browser Gemini Vision Call with API Key
  if (apiKey && (params.imageBase64 || params.imageFile)) {
    try {
      let rawBase64 = '';
      let mimeType = params.mimeType || 'image/jpeg';

      if (params.imageBase64) {
        const parts = params.imageBase64.split(',');
        if (parts.length > 1) {
          rawBase64 = parts[1];
          const match = parts[0].match(/:(.*?);/);
          if (match) mimeType = match[1];
        } else {
          rawBase64 = params.imageBase64;
        }
      } else if (params.imageFile) {
        rawBase64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const result = reader.result as string;
            resolve(result.split(',')[1] || '');
          };
          reader.onerror = reject;
          reader.readAsDataURL(params.imageFile!);
        });
        mimeType = params.imageFile.type || 'image/jpeg';
      }

      if (rawBase64) {
        const visionRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{
                parts: [
                  {
                    inlineData: {
                      mimeType: mimeType,
                      data: rawBase64,
                    }
                  },
                  {
                    text: `Analyze this student STEM handwriting or diagram. Transcribe any equations into clean LaTeX. Return strictly raw JSON:
{
  "extractedText": "The transcribed equation or question in LaTeX format",
  "confidence": 0.95,
  "requiresClarification": false,
  "clarificationPrompt": "",
  "boundingBoxes": []
}`
                  }
                ]
              }],
              generationConfig: {
                temperature: 0.1,
                maxOutputTokens: 1024
              }
            })
          }
        );

        if (visionRes.ok) {
          const vData = await visionRes.json();
          const vText = vData.candidates?.[0]?.content?.parts?.[0]?.text;
          if (vText) {
            const parsedTranscription: VisionTranscription = extractJsonFromText(vText);
            let solution: TutorExplanation | null = null;
            if (params.mode !== 'transcribe_only' && parsedTranscription.extractedText) {
              const tutorResp = await askTutor({
                question: parsedTranscription.extractedText,
                subject: params.subject,
                grade: params.grade,
                language: 'en'
              });
              solution = tutorResp.explanation;
            }

            return {
              success: true,
              transcription: parsedTranscription,
              solution,
              metadata: {
                modelUsed: 'Google Gemini 1.5 Flash Vision (Live Browser)',
                isDemo: false,
                executionTimeMs: Date.now() - startTime,
              }
            };
          }
        }
      }
    } catch (visionErr) {
      console.warn('[Learnova Vision] Direct browser vision call failed:', visionErr);
    }
  }

  // 3. Fallback: Curated Test OCR Transcriptions
  const transcription = getFallbackVisionTranscription(params.subject);
  const solution = params.mode === 'transcribe_only'
    ? null
    : getFallbackTutorExplanation(transcription.extractedText, params.subject, params.grade, 'en');

  return {
    success: true,
    transcription,
    solution,
    metadata: {
      modelUsed: 'Learnova Vision Engine (Curated Sample Mode)',
      isDemo: true,
      executionTimeMs: Date.now() - startTime,
    },
  };
}

export async function getSubjects(): Promise<Subject[]> {
  try {
    const res = await fetch(`${API_BASE}/learning/subjects`);
    if (!res.ok) throw new Error('Unreachable');
    const data = await res.json();
    return data.subjects;
  } catch {
    return fallbackSubjects;
  }
}

export async function getTopics(subject?: string, grade?: number): Promise<Topic[]> {
  try {
    const params = new URLSearchParams();
    if (subject) params.append('subject', subject);
    if (grade) params.append('grade', String(grade));
    const res = await fetch(`${API_BASE}/learning/topics?${params.toString()}`);
    if (!res.ok) throw new Error('Unreachable');
    const data = await res.json();
    return data.topics;
  } catch {
    let filtered = fallbackTopics;
    if (subject) filtered = filtered.filter(t => t.subjectId === subject);
    if (grade) filtered = filtered.filter(t => t.gradeLevel === grade);
    return filtered;
  }
}

export async function getLearningPath(subject?: string): Promise<Topic[]> {
  try {
    const params = new URLSearchParams();
    if (subject) params.append('subject', subject);
    const res = await fetch(`${API_BASE}/learning/path?${params.toString()}`);
    if (!res.ok) throw new Error('Unreachable');
    const data = await res.json();
    return data.roadmap;
  } catch {
    const savedProgress = getLocalItem<Record<string, any>>('progress', {
      'math-alg-quad': {
        topicId: 'math-alg-quad',
        status: 'needs_revision',
        masteryScore: 0.58,
        attemptsCount: 3,
        correctCount: 2,
        lastMistakeConcept: 'Discriminant signs when b is negative'
      },
      'phys-elec-ohm': {
        topicId: 'phys-elec-ohm',
        status: 'mastered',
        masteryScore: 0.92,
        attemptsCount: 4,
        correctCount: 4,
        lastMistakeConcept: null
      },
      'chem-rxn-eq': {
        topicId: 'chem-rxn-eq',
        status: 'in_progress',
        masteryScore: 0.70,
        attemptsCount: 2,
        correctCount: 2,
        lastMistakeConcept: null
      }
    });

    let filtered = fallbackTopics;
    if (subject) filtered = filtered.filter(t => t.subjectId === subject);

    return filtered.map(t => ({
      ...t,
      progress: savedProgress[t.id] || {
        topicId: t.id,
        status: 'not_started',
        masteryScore: 0,
        attemptsCount: 0,
        correctCount: 0,
        lastPracticedAt: null
      },
      recommendationNote: savedProgress[t.id]?.status === 'needs_revision'
        ? 'Needs revision on negative discriminant signs'
        : savedProgress[t.id]?.status === 'mastered'
        ? 'Concept mastered! Ready for advanced exercises.'
        : 'Ready to study.'
    }));
  }
}

export async function generateQuiz(topicId: string): Promise<QuizGeneration> {
  try {
    const res = await fetch(`${API_BASE}/quiz/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topicId }),
    });
    if (!res.ok) throw new Error('Unreachable');
    const data = await res.json();
    return data.quiz;
  } catch {
    return getFallbackQuiz(topicId);
  }
}

export async function submitQuiz(
  topicId: string,
  score: number,
  totalQuestions: number,
  timeSpentSeconds: number,
  wrongConcepts: string[]
): Promise<any> {
  try {
    const res = await fetch(`${API_BASE}/quiz/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        topicId,
        score,
        totalQuestions,
        timeSpentSeconds,
        wrongConcepts,
      }),
    });
    if (!res.ok) throw new Error('Unreachable');
    return await res.json();
  } catch {
    const accuracy = score / Math.max(totalQuestions, 1);
    const newStatus = accuracy >= 0.85 ? 'mastered' : accuracy < 0.6 ? 'needs_revision' : 'in_progress';
    
    // Update local storage progress
    const progress = getLocalItem<Record<string, any>>('progress', {});
    progress[topicId] = {
      topicId,
      status: newStatus,
      masteryScore: Math.round(accuracy * 100) / 100,
      attemptsCount: (progress[topicId]?.attemptsCount || 0) + 1,
      correctCount: (progress[topicId]?.correctCount || 0) + score,
      lastMistakeConcept: wrongConcepts[0] || null,
      lastPracticedAt: new Date().toISOString()
    };
    setLocalItem('progress', progress);

    return {
      success: true,
      evaluation: {
        topicId,
        newMastery: progress[topicId].masteryScore,
        newStatus,
        identifiedWeakConcepts: wrongConcepts,
        recommendation: {
          recommendedTopicId: topicId,
          recommendedTopicTitle: 'Quadratic Equations & Roots',
          reason: newStatus === 'needs_revision'
            ? 'Review negative discriminant signs with Socratic step-by-step guidance'
            : 'Excellent work! Practice challenge questions.',
          actionType: newStatus === 'needs_revision' ? 'concept_practice' : 'advance_topic'
        }
      }
    };
  }
}

export async function getProgressStats(): Promise<any> {
  try {
    const res = await fetch(`${API_BASE}/progress`);
    if (!res.ok) throw new Error('Unreachable');
    const data = await res.json();
    return data.stats;
  } catch {
    return {
      overallMastery: 76,
      streakCount: 4,
      totalStudyMinutes: 185,
      xpPoints: 380,
      quizzesTaken: 8,
      averageQuizAccuracy: 78,
      subjectMastery: {
        math: 68,
        physics: 76,
        chemistry: 85,
      },
      weakTopics: [
        {
          id: 'math-alg-quad',
          title: 'Quadratic Equations & Roots',
          subjectId: 'math',
          masteryScore: 0.58,
          lastMistakeConcept: 'Discriminant signs when b is negative'
        }
      ],
      recentAttempts: [
        {
          id: 'att-1',
          subject: 'math',
          topicId: 'math-alg-quad',
          score: 1,
          totalQuestions: 3,
          timeSpentSeconds: 140,
          timestamp: new Date().toISOString()
        }
      ]
    };
  }
}

export async function getAchievements(): Promise<{ achievements: Achievement[]; totalUnlocked: number }> {
  try {
    const res = await fetch(`${API_BASE}/progress/achievements`);
    if (!res.ok) throw new Error('Unreachable');
    return await res.json();
  } catch {
    return {
      totalUnlocked: 3,
      achievements: [
        {
          id: 'ach-first-step',
          title: 'First Step to Mastery',
          description: 'Completed your first Socratic problem derivation.',
          icon: 'Award',
          unlockedAt: '2026-10-08T10:00:00Z',
          category: 'learning'
        },
        {
          id: 'ach-streak-3',
          title: 'Dedication Streak',
          description: 'Maintained a 3-day active learning streak.',
          icon: 'Flame',
          unlockedAt: '2026-10-09T08:30:00Z',
          category: 'consistency'
        },
        {
          id: 'ach-lab-explorer',
          title: 'STEM Laboratory Explorer',
          description: 'Experimented with interactive Physics and Math simulators.',
          icon: 'Zap',
          unlockedAt: '2026-10-09T14:15:00Z',
          category: 'mastery'
        }
      ]
    };
  }
}

export async function getSavedNotes(subject?: string): Promise<SavedNote[]> {
  try {
    const params = new URLSearchParams();
    if (subject) params.append('subject', subject);
    const res = await fetch(`${API_BASE}/notes?${params.toString()}`);
    if (!res.ok) throw new Error('Unreachable');
    const data = await res.json();
    return data.notes;
  } catch {
    const defaultNotes: SavedNote[] = [
      {
        id: 'note-quad-cheat',
        studentId: 'student-aarav-10',
        title: 'Quadratic Equations & Discriminant Summary',
        subject: 'math',
        topicId: 'math-alg-quad',
        contentMarkdown: `### Standard Quadratic Equation
$$ax^2 + bx + c = 0$$

### Quadratic Formula
$$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$

### Nature of Roots Classification
- **$D > 0$**: Two distinct real roots.
- **$D = 0$**: Two equal repeated real roots: $x = -\\frac{b}{2a}$.
- **$D < 0$**: No real roots (two complex conjugate roots).

> **Crucial Pitfall:** When $b = -7$, evaluating $-b$ becomes $-(-7) = +7$. Never write $-7$!`,
        isPinned: true,
        createdAt: '2026-10-08T14:00:00Z',
        updatedAt: '2026-10-08T14:00:00Z'
      },
      {
        id: 'note-ohm-law',
        studentId: 'student-aarav-10',
        title: "Ohm's Law & Electrical Resistivity",
        subject: 'physics',
        topicId: 'phys-elec-ohm',
        contentMarkdown: `### Ohm's Law
$$V = I \\cdot R$$
- Potential difference ($V$) in Volts
- Electric current ($I$) in Amperes
- Resistance ($R$) in Ohms ($\\Omega$)

### Factors Affecting Resistance
$$R = \\rho \\frac{l}{A}$$
- Directly proportional to length ($l$)
- Inversely proportional to area of cross-section ($A$)
- Depends on material resistivity ($\\rho$) and temperature`,
        isPinned: true,
        createdAt: '2026-10-09T11:00:00Z',
        updatedAt: '2026-10-09T11:00:00Z'
      }
    ];

    const notes = getLocalItem<SavedNote[]>('notes', defaultNotes);
    return subject ? notes.filter(n => n.subject === subject) : notes;
  }
}

export async function saveNote(note: {
  title: string;
  subject: string;
  topicId?: string;
  contentMarkdown: string;
  isPinned?: boolean;
}): Promise<SavedNote> {
  try {
    const res = await fetch(`${API_BASE}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(note),
    });
    if (!res.ok) throw new Error('Unreachable');
    const data = await res.json();
    return data.note;
  } catch {
    const notes = getLocalItem<SavedNote[]>('notes', []);
    const newNote: SavedNote = {
      id: `note-${Date.now()}`,
      studentId: 'student-aarav-10',
      title: note.title,
      subject: note.subject,
      topicId: note.topicId,
      contentMarkdown: note.contentMarkdown,
      isPinned: note.isPinned || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    notes.unshift(newNote);
    setLocalItem('notes', notes);
    return newNote;
  }
}

export async function deleteNote(id: string): Promise<void> {
  try {
    const res = await fetch(`${API_BASE}/notes/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Unreachable');
  } catch {
    const notes = getLocalItem<SavedNote[]>('notes', []);
    const filtered = notes.filter(n => n.id !== id);
    setLocalItem('notes', filtered);
  }
}
