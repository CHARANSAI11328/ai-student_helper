import { z } from 'zod';

// Educational structured explanation schema (9 pedagogical components)
export const TutorResponseSchema = z.object({
  questionIntent: z.string().describe("Clear summary of what the problem is asking for"),
  requiredConcepts: z.array(z.string()).describe("List of scientific or mathematical concepts needed"),
  stepByStepReasoning: z.array(z.object({
    stepNumber: z.number(),
    title: z.string(),
    explanation: z.string(),
    mathExpression: z.string().optional().describe("LaTeX or KaTeX formula if applicable"),
  })).describe("Sequential logical steps to reach the solution"),
  finalAnswer: z.string().describe("Clear, concise final answer with correct units and notation"),
  whyMethodWorks: z.string().describe("Conceptual explanation of why this theorem/method is valid"),
  realWorldAnalogy: z.string().describe("Everyday intuitive analogy or practical application"),
  commonMistakes: z.string().describe("Frequent error students make on this type of problem"),
  understandingCheckQuestion: z.object({
    question: z.string(),
    options: z.array(z.string()),
    correctOptionIndex: z.number(),
    explanation: z.string(),
  }).describe("A quick follow-up question to test student's conceptual grasp"),
  suggestedNextTopic: z.string().describe("Recommended next concept or practice problem"),
});

export type TutorResponse = z.infer<typeof TutorResponseSchema>;

// Vision & OCR extraction response schema
export const VisionTranscriptionSchema = z.object({
  extractedText: z.string().describe("Full transcription of handwritten notes, text, or equations"),
  identifiedSubject: z.enum(['math', 'physics', 'chemistry', 'general']),
  equationsDetected: z.array(z.string()).describe("LaTeX strings of detected mathematical or chemical formulas"),
  diagramElements: z.array(z.string()).optional().describe("Labels, circuit components, or geometric shapes detected"),
  confidenceLevel: z.enum(['high', 'medium', 'low', 'unreadable']),
  uncertaintyNotes: z.string().optional().describe("Notes on smudged ink, ambiguous symbols, or illegible parts"),
  clarificationNeeded: z.boolean().describe("Whether the student should clarify handwriting before solving"),
  suggestedClarificationQuestion: z.string().optional(),
});

export type VisionTranscription = z.infer<typeof VisionTranscriptionSchema>;

// Quiz Generation schema
export const QuizItemSchema = z.object({
  id: z.string(),
  concept: z.string(),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  question: z.string(),
  options: z.array(z.string()),
  correctAnswerIndex: z.number(),
  explanation: z.string(),
  hint: z.string().optional(),
});

export const QuizGenerationSchema = z.object({
  topicId: z.string(),
  title: z.string(),
  questions: z.array(QuizItemSchema),
});

export type QuizItem = z.infer<typeof QuizItemSchema>;
export type QuizGeneration = z.infer<typeof QuizGenerationSchema>;
