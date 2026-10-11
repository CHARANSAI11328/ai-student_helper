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
 * - LLM trailing commas and control characters
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

  try {
    return JSON.parse(clean);
  } catch (initialErr) {
    // Attempt repairs for common LLM JSON glitches (trailing commas, unescaped control chars)
    try {
      const repaired = clean
        .replace(/,\s*([\]}])/g, '$1') // remove trailing commas before ] or }
        .replace(/[\u0000-\u001F\u007F-\u009F]/g, (c) => (c === '\n' || c === '\r' || c === '\t' ? c : ''));
      return JSON.parse(repaired);
    } catch {
      throw initialErr;
    }
  }
}

/**
 * Discovers and prioritizes working Gemini models for the user's specific API key.
 * Queries Google's ListModels endpoint across v1 and v1beta.
 * Automatically scores and prioritizes models based on speed, vision capability, and current Google availability.
 */
export async function discoverWorkingGeminiModels(apiKey: string): Promise<{
  models: string[];
  apiVersion: 'v1' | 'v1beta';
  primaryModel: string;
  error?: string;
}> {
  const cleanKey = (apiKey || '').trim();
  if (!cleanKey) {
    return {
      models: [],
      apiVersion: 'v1beta',
      primaryModel: 'gemini-1.5-flash',
      error: 'No API key provided'
    };
  }

  // 1. Check local cache (keyed by first 8 chars of key to refresh when user enters a new key)
  const cacheKey = `learnova_models_${cleanKey.slice(0, 8)}`;
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed.models) && parsed.models.length > 0 && parsed.timestamp && (Date.now() - parsed.timestamp < 3600000)) {
        return {
          models: parsed.models,
          apiVersion: parsed.apiVersion || 'v1beta',
          primaryModel: parsed.models[0],
        };
      }
    }
  } catch {}

  // 2. Query Google ListModels endpoints (try v1beta and v1)
  const apiVersions: ('v1beta' | 'v1')[] = ['v1beta', 'v1'];
  let discoveredNames: string[] = [];
  let successfulVersion: 'v1' | 'v1beta' = 'v1beta';
  let apiErrorMessage = '';

  for (const ver of apiVersions) {
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/${ver}/models?key=${cleanKey}`);
      const data = await res.json();

      if (data.error) {
        apiErrorMessage = data.error.message || `API Error (${data.error.status || data.error.code})`;
        // If it's an explicit key validation failure or permission denied, preserve error message
        if (data.error.code === 400 || data.error.status === 'INVALID_ARGUMENT' || data.error.code === 403) {
          break;
        }
        continue;
      }

      if (Array.isArray(data.models) && data.models.length > 0) {
        // Filter for models that support generateContent
        const validModels = data.models
          .filter((m: any) => {
            const methods = m.supportedGenerationMethods || [];
            return methods.includes('generateContent') || methods.includes('generateMessage');
          })
          .map((m: any) => (m.name || '').replace(/^models\//, ''))
          .filter((name: string) => name.toLowerCase().includes('gemini'));

        if (validModels.length > 0) {
          discoveredNames = validModels;
          successfulVersion = ver;
          break;
        }
      }
    } catch (err: any) {
      apiErrorMessage = err.message || 'Network request failed';
    }
  }

  // 3. Smart Sorting: Prioritize newest, fastest, and most quota-generous models
  const scoreModel = (name: string): number => {
    const n = name.toLowerCase();
    if (n.includes('2.0-flash') && !n.includes('lite')) return 100;
    if (n.includes('1.5-flash-latest')) return 95;
    if (n.includes('1.5-flash') && !n.includes('8b')) return 90;
    if (n.includes('2.0-flash-lite')) return 85;
    if (n.includes('1.5-flash-8b')) return 80;
    if (n.includes('2.5-flash')) return 75;
    if (n.includes('2.0-pro')) return 70;
    if (n.includes('1.5-pro-latest')) return 65;
    if (n.includes('1.5-pro')) return 60;
    if (n.includes('gemini-pro')) return 50;
    return 10;
  };

  if (discoveredNames.length > 0) {
    discoveredNames.sort((a, b) => scoreModel(b) - scoreModel(a));
  } else {
    // Resilient fallback candidate list if ListModels was blocked by CORS or network, but key is valid
    discoveredNames = [
      'gemini-2.0-flash',
      'gemini-1.5-flash',
      'gemini-1.5-flash-latest',
      'gemini-1.5-flash-8b',
      'gemini-1.5-pro',
      'gemini-pro'
    ];
  }

  // 4. Cache in localStorage for snappy subsequent calls
  try {
    localStorage.setItem(cacheKey, JSON.stringify({
      models: discoveredNames,
      apiVersion: successfulVersion,
      timestamp: Date.now()
    }));
    localStorage.setItem('learnova_discovered_models', JSON.stringify(discoveredNames));
    localStorage.setItem('learnova_api_version', successfulVersion);
    localStorage.setItem('learnova_active_model', discoveredNames[0]);
  } catch {}

  return {
    models: discoveredNames,
    apiVersion: successfulVersion,
    primaryModel: discoveredNames[0],
    error: discoveredNames.length > 0 && !apiErrorMessage.includes('API key not valid') ? undefined : apiErrorMessage
  };
}

export async function checkApiHealth(): Promise<SystemHealth> {
  const key = getStoredApiKey();
  const cachedModel = localStorage.getItem('learnova_active_model') || 'gemini-2.0-flash';
  try {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) throw new Error('Unreachable');
    return await res.json();
  } catch {
    return {
      status: 'ok',
      service: 'Learnova AI (Client PWA Mode)',
      version: '1.0.0',
      geminiConfigured: Boolean(key),
      defaultModelText: cachedModel,
      defaultModelVision: cachedModel,
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
    // Dynamic Model Discovery: Determine which models and API versions are active for this key
    const discovery = await discoverWorkingGeminiModels(apiKey);
    const candidateModels = discovery.models.length > 0
      ? discovery.models
      : ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-1.5-flash-latest', 'gemini-1.5-flash-8b', 'gemini-1.5-pro', 'gemini-pro'];

    // Try discovered API version first, then fallback to alternate version (v1 <-> v1beta)
    const apiVersionsToTry: ('v1' | 'v1beta')[] = discovery.apiVersion === 'v1' ? ['v1', 'v1beta'] : ['v1beta', 'v1'];

    let modelSucceeded = false;

    for (const modelName of candidateModels) {
      if (modelSucceeded) break;
      const cleanName = modelName.replace(/^models\//, '');

      for (const apiVer of apiVersionsToTry) {
        try {
          const geminiRes = await fetch(
            `https://generativelanguage.googleapis.com/${apiVer}/models/${cleanName}:generateContent?key=${apiKey}`,
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
                modelSucceeded = true;
                // Cache active working model
                try {
                  localStorage.setItem('learnova_active_model', cleanName);
                  localStorage.setItem('learnova_api_version', apiVer);
                } catch {}

                return {
                  success: true,
                  explanation: parsed,
                  metadata: {
                    modelUsed: `Google ${cleanName} (${apiVer} Live AI)`,
                    isDemo: false,
                    executionTimeMs: Date.now() - startTime,
                    timestamp: new Date().toISOString()
                  }
                };
              }
            }
          } else {
            const errData = await geminiRes.json().catch(() => ({}));
            const errMsg = errData.error?.message || `HTTP ${geminiRes.status}`;
            directErrorMessage = errMsg;

            // If API key is explicitly invalid, stop wasting queries
            if (errMsg.toLowerCase().includes('api key not valid') || errData.error?.code === 400) {
              break;
            }

            // If 404 (model not found on this version), try the other API version or next model
            if (geminiRes.status === 404) {
              continue;
            }

            // If rate-limited (429), note quota exhaustion and proceed to next candidate model
            if (geminiRes.status === 429) {
              directErrorMessage = `Rate limit on ${cleanName}; trying next model...`;
              break;
            }
          }
        } catch (err: any) {
          directErrorMessage = err.message || 'Network error';
        }
      }

      // Stop trying other models if key is completely invalid
      if (directErrorMessage.toLowerCase().includes('api key not valid')) {
        break;
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
        const discovery = await discoverWorkingGeminiModels(apiKey);
        const visionModels = discovery.models.length > 0
          ? discovery.models
          : ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-1.5-flash-latest'];
        const apiVersionsToTry: ('v1' | 'v1beta')[] = discovery.apiVersion === 'v1' ? ['v1', 'v1beta'] : ['v1beta', 'v1'];

        for (const modelName of visionModels) {
          const cleanName = modelName.replace(/^models\//, '');
          let visionSucceeded = false;

          for (const apiVer of apiVersionsToTry) {
            try {
              const visionRes = await fetch(
                `https://generativelanguage.googleapis.com/${apiVer}/models/${cleanName}:generateContent?key=${apiKey}`,
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

                  visionSucceeded = true;
                  return {
                    success: true,
                    transcription: parsedTranscription,
                    solution,
                    metadata: {
                      modelUsed: `Google ${cleanName} (${apiVer} Vision Live)`,
                      isDemo: false,
                      executionTimeMs: Date.now() - startTime,
                    }
                  };
                }
              }
            } catch (vErr) {
              // Try next version/model
            }
          }

          if (visionSucceeded) break;
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
