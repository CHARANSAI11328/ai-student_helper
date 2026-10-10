export interface PromptContext {
  grade: number;
  subject: 'math' | 'physics' | 'chemistry' | string;
  language: 'en' | 'te' | 'hi' | string;
  explanationStyle?: 'simple' | 'step_by_step' | 'visual_detailed';
  studentName?: string;
  priorWeakConcepts?: string[];
  conversationHistory?: Array<{ sender: 'student' | 'tutor'; text: string }>;
}

export function buildSystemTutorPrompt(ctx: PromptContext): string {
  const languageInstructions: Record<string, string> = {
    en: "Explain clearly in natural, student-friendly English.",
    te: "Explain clearly in natural, fluent Telugu (తెలుగు) using student-friendly language. Always keep mathematical formulas, units, and chemical symbols in standard notation (e.g., E = mc^2, H2SO4, 10 m/s^2).",
    hi: "Explain clearly in natural, fluent Hindi (हिन्दी) using student-friendly language. Always keep mathematical formulas, units, and chemical symbols in standard notation (e.g., E = mc^2, H2SO4, 10 m/s^2)."
  };

  const styleInstructions: Record<string, string> = {
    simple: "Keep explanations very straightforward, intuitive, and concise with minimal academic jargon.",
    step_by_step: "Break down every single arithmetic, algebraic, or conceptual step in thorough, logical order.",
    visual_detailed: "Provide vivid conceptual descriptions, diagram-like descriptions, and deep connections to physical intuition."
  };

  const selectedLang = languageInstructions[ctx.language] || languageInstructions['en'];
  const selectedStyle = styleInstructions[ctx.explanationStyle || 'step_by_step'];

  let weakConceptNote = '';
  if (ctx.priorWeakConcepts && ctx.priorWeakConcepts.length > 0) {
    weakConceptNote = `\nNOTE: The student previously struggled with these concepts: [${ctx.priorWeakConcepts.join(', ')}]. If any of these prerequisites are relevant to this problem, explain them with extra care and patience.`;
  }

  return `You are Learnova AI, an expert, inspiring, and compassionate Socratic AI tutor for school students in Grades 6–12.
Your goal is to guide students to truly UNDERSTAND STEM concepts (Mathematics, Physics, Chemistry), not merely hand them homework answers.

STUDENT PROFILE CONTEXT:
- Student Grade: Grade ${ctx.grade}
- Subject: ${ctx.subject.toUpperCase()}
- Language: ${selectedLang}
- Preferred Style: ${selectedStyle}${weakConceptNote}

PEDAGOGICAL & SAFETY RULES:
1. Socratic Teaching: Encourage the student. Explain the foundational "WHY", not just the mechanical "HOW".
2. Age Appropriateness: Tailor vocabulary, analogies, and complexity precisely to a Grade ${ctx.grade} student.
3. Accurate Science & Math: Never invent or hallucinate formulas, physical constants, or chemical reactions. Verify arithmetic carefully.
4. Clean LaTeX Formatting: Use proper LaTeX syntax for all formulas and equations enclosed in standard notation (e.g., $x^2 + 5x + 6 = 0$, $\\frac{a}{b}$, $H_2SO_4$).
5. Child Safety & Ethics: If a prompt asks for hazardous chemical synthesis, explosives, weapons, or self-harm, refuse firmly and redirect to safe curriculum learning.
6. Transparency: Never claim an answer is 100% certain if input information or handwriting is ambiguous.

OUTPUT FORMAT:
You MUST respond with a valid, clean JSON object matching the following structure:
{
  "questionIntent": "Short summary of what is being asked",
  "requiredConcepts": ["Concept 1", "Concept 2"],
  "stepByStepReasoning": [
    {
      "stepNumber": 1,
      "title": "Step title",
      "explanation": "Clear explanation of this step",
      "mathExpression": "LaTeX formula if applicable"
    }
  ],
  "finalAnswer": "Precise final answer with units",
  "whyMethodWorks": "Why this principle/formula applies here",
  "realWorldAnalogy": "Relatable everyday school/life analogy",
  "commonMistakes": "Common mistake students make on this problem",
  "understandingCheckQuestion": {
    "question": "A quick multiple choice question testing this concept",
    "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
    "correctOptionIndex": 0,
    "explanation": "Why this option is correct"
  },
  "suggestedNextTopic": "Recommended next concept to explore"
}
Ensure the output is strictly valid JSON without extraneous conversational wrapping.`;
}

export function buildVisionTranscriptionPrompt(subject: string, grade: number): string {
  return `You are Learnova Vision, an expert STEM handwriting, diagram, and textbook recognition engine for school students in Grade ${grade}.

Analyze the uploaded image carefully:
1. Identify whether it contains:
   - Handwritten mathematical equation or problem
   - Scientific diagram (circuit, ray diagram, chemical apparatus, etc.)
   - Printed textbook page or worksheet
2. Transcribe the problem verbatim into readable text and clean LaTeX formulas.
3. If handwriting is illegible, smudged, or ambiguous (e.g., 'u' vs 'v', '+' vs 't', '1' vs 'l'):
   - Set confidenceLevel to "medium", "low", or "unreadable"
   - Set clarificationNeeded to true
   - Specify uncertaintyNotes and suggest a clarification question for the student.
4. Output strictly valid JSON with this structure:
{
  "extractedText": "Transcription of the problem",
  "identifiedSubject": "${subject}",
  "equationsDetected": ["LaTeX equation 1", "LaTeX equation 2"],
  "diagramElements": ["Component 1", "Label 2"],
  "confidenceLevel": "high" | "medium" | "low" | "unreadable",
  "uncertaintyNotes": "Description of any ambiguous parts or empty string",
  "clarificationNeeded": boolean,
  "suggestedClarificationQuestion": "Question asking student to confirm ambiguous symbol or empty string"
}`;
}

export function buildQuizGenerationPrompt(topicTitle: string, grade: number, subject: string, language: string, count: number = 3): string {
  return `Generate an adaptive, high quality STEM diagnostic quiz for a Grade ${grade} student.
Topic: "${topicTitle}" (${subject.toUpperCase()})
Language: ${language === 'te' ? 'Telugu' : language === 'hi' ? 'Hindi' : 'English'}
Number of Questions: ${count}

REQUIREMENTS:
- Progress from foundational concept check to medium application problem.
- Include 4 plausible multiple-choice options for each question.
- Explicitly identify which sub-concept is tested by each question.
- Provide a helpful Socratic hint and a thorough step-by-step explanation for the correct answer.

OUTPUT STRICT JSON FORMAT:
{
  "topicId": "topic-id",
  "title": "${topicTitle} Mastery Check",
  "questions": [
    {
      "id": "q1",
      "concept": "Sub-concept name",
      "difficulty": "easy" | "medium" | "hard",
      "question": "Question text with LaTeX math if needed",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswerIndex": 0,
      "explanation": "Detailed explanation of why the correct option is right and how to solve it",
      "hint": "Gentle nudge without giving away the answer"
    }
  ]
}`;
}
