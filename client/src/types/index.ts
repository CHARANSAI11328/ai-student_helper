export interface StudentProfile {
  id: string;
  name: string;
  grade: number;
  language: 'en' | 'te' | 'hi' | string;
  strongSubjects: string[];
  weakSubjects: string[];
  learningGoals: string;
  explanationStyle: 'simple' | 'step_by_step' | 'visual_detailed';
  confidenceLevel: 'beginner' | 'moderate' | 'confident';
  streakCount: number;
  totalStudyMinutes: number;
  xpPoints: number;
  lastActiveDate: string;
}

export interface Subject {
  id: 'math' | 'physics' | 'chemistry';
  name: string;
  description: string;
  colorCode: string;
  iconName: string;
  topicCount: number;
}

export interface Formula {
  name: string;
  latex: string;
}

export interface Topic {
  id: string;
  subjectId: 'math' | 'physics' | 'chemistry';
  grade: number;
  title: string;
  slug: string;
  orderIndex: number;
  description: string;
  prerequisites: string[];
  keyFormulas: Formula[];
  progress?: TopicProgress;
  recommendationNote?: string;
}

export interface TopicProgress {
  topicId: string;
  status: 'not_started' | 'in_progress' | 'needs_revision' | 'mastered';
  masteryScore: number;
  attemptsCount: number;
  correctCount: number;
  lastMistakeConcept?: string;
  lastPracticedAt?: string | null;
}

export interface StepReasoning {
  stepNumber: number;
  title: string;
  explanation: string;
  mathExpression?: string;
}

export interface UnderstandingCheckQuestion {
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

export interface TutorExplanation {
  questionIntent: string;
  requiredConcepts: string[];
  stepByStepReasoning: StepReasoning[];
  finalAnswer: string;
  whyMethodWorks: string;
  realWorldAnalogy: string;
  commonMistakes: string;
  understandingCheckQuestion: UnderstandingCheckQuestion;
  suggestedNextTopic: string;
}

export interface VisionTranscription {
  extractedText: string;
  identifiedSubject: 'math' | 'physics' | 'chemistry' | 'general';
  equationsDetected: string[];
  diagramElements?: string[];
  confidenceLevel: 'high' | 'medium' | 'low' | 'unreadable';
  uncertaintyNotes?: string;
  clarificationNeeded: boolean;
  suggestedClarificationQuestion?: string;
}

export interface QuizQuestion {
  id: string;
  concept: string;
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  hint?: string;
}

export interface QuizGeneration {
  topicId: string;
  title: string;
  questions: QuizQuestion[];
}

export interface QuizAttempt {
  id: string;
  studentId: string;
  subject: string;
  topicId: string;
  topicTitle: string;
  score: number;
  totalQuestions: number;
  timeSpentSeconds: number;
  weakConcepts: string[];
  createdAt: string;
}

export interface SavedNote {
  id: string;
  studentId: string;
  title: string;
  subject: string;
  topicId?: string;
  contentMarkdown: string;
  isPinned: boolean;
  createdAt: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  badgeIcon: string;
  xpReward: number;
  category: string;
  isUnlocked?: boolean;
}

export interface SystemHealth {
  status: string;
  service: string;
  geminiConfigured: boolean;
  mode: 'live_ai' | 'demo_offline_engine';
  defaultModelText: string;
  defaultModelVision: string;
}
