import { config } from '../config.js';
import {
  generateGeminiTutorResponse,
  generateGeminiVisionTranscription,
  generateGeminiQuiz,
  isGeminiConfigured
} from './providers/gemini.js';
import {
  buildSystemTutorPrompt,
  buildVisionTranscriptionPrompt,
  buildQuizGenerationPrompt,
  PromptContext
} from './prompts/tutorPrompts.js';
import {
  getMockTutorResponse,
  getMockVisionTranscription,
  getMockQuiz
} from './mockTutor.js';
import { TutorResponse, VisionTranscription, QuizGeneration } from './schemas/tutorResponse.js';

export interface RouteTutorRequestOptions {
  question: string;
  context: PromptContext;
  forceComplexModel?: boolean;
  apiKey?: string;
}

export interface RouteVisionRequestOptions {
  imageBase64: string;
  mimeType: string;
  subject: string;
  grade: number;
  fileName?: string;
  apiKey?: string;
}

export interface ModelExecutionResult<T> {
  data: T;
  modelUsed: string;
  isDemo: boolean;
  timestamp: string;
  executionTimeMs: number;
}

export class ModelRouter {
  /**
   * Route and process text-based tutoring requests
   */
  public static async routeTextTutor(
    options: RouteTutorRequestOptions
  ): Promise<ModelExecutionResult<TutorResponse>> {
    const startTime = Date.now();

    // 1. Check if Gemini is configured with a valid API key
    if (!isGeminiConfigured(options.apiKey)) {
      const mockResult = getMockTutorResponse(
        options.question,
        options.context.subject,
        options.context.grade,
        options.context.language
      );
      return {
        data: mockResult,
        modelUsed: 'Learnova-Socratic-Engine (Zero-Config Offline Mode)',
        isDemo: true,
        timestamp: new Date().toISOString(),
        executionTimeMs: Date.now() - startTime
      };
    }

    // 2. Determine target model based on complexity and prompt length
    let targetModel = config.gemini.modelText;
    if (options.forceComplexModel || options.question.length > 500) {
      targetModel = config.gemini.modelPro;
    }

    const systemPrompt = buildSystemTutorPrompt(options.context);

    try {
      const tutorResponse = await generateGeminiTutorResponse({
        model: targetModel,
        systemPrompt,
        userPrompt: options.question,
        apiKey: options.apiKey
      });

      return {
        data: tutorResponse,
        modelUsed: targetModel,
        isDemo: false,
        timestamp: new Date().toISOString(),
        executionTimeMs: Date.now() - startTime
      };
    } catch (err: any) {
      console.warn(`Primary model (${targetModel}) error: ${err.message}. Triggering graceful Socratic fallback.`);

      const mockResult = getMockTutorResponse(
        options.question,
        options.context.subject,
        options.context.grade,
        options.context.language
      );
      return {
        data: mockResult,
        modelUsed: 'Learnova-Socratic-Engine (Offline/Quota Graceful Fallback)',
        isDemo: true,
        timestamp: new Date().toISOString(),
        executionTimeMs: Date.now() - startTime
      };
    }
  }

  /**
   * Route and process vision / handwriting / diagram requests
   */
  public static async routeVision(
    options: RouteVisionRequestOptions
  ): Promise<ModelExecutionResult<VisionTranscription>> {
    const startTime = Date.now();

    if (!isGeminiConfigured(options.apiKey)) {
      const mockVision = getMockVisionTranscription(options.subject, options.fileName);
      return {
        data: mockVision,
        modelUsed: 'Learnova-Vision-Lab (Zero-Config Offline Mode)',
        isDemo: true,
        timestamp: new Date().toISOString(),
        executionTimeMs: Date.now() - startTime
      };
    }

    const visionModel = config.gemini.modelVision;
    const prompt = buildVisionTranscriptionPrompt(options.subject, options.grade);

    try {
      const visionResult = await generateGeminiVisionTranscription({
        model: visionModel,
        prompt,
        imageBase64: options.imageBase64,
        mimeType: options.mimeType,
        apiKey: options.apiKey
      });

      return {
        data: visionResult,
        modelUsed: visionModel,
        isDemo: false,
        timestamp: new Date().toISOString(),
        executionTimeMs: Date.now() - startTime
      };
    } catch (err: any) {
      console.warn(`Vision model (${visionModel}) error: ${err.message}. Using safe fallback.`);
      const mockVision = getMockVisionTranscription(options.subject, options.fileName);
      return {
        data: mockVision,
        modelUsed: 'Learnova-Vision (Safe Fallback Engine)',
        isDemo: true,
        timestamp: new Date().toISOString(),
        executionTimeMs: Date.now() - startTime
      };
    }
  }

  /**
   * Route and generate adaptive topic quizzes
   */
  public static async routeQuiz(
    topicId: string,
    topicTitle: string,
    subject: string,
    grade: number,
    language: string,
    apiKey?: string
  ): Promise<ModelExecutionResult<QuizGeneration>> {
    const startTime = Date.now();

    if (!isGeminiConfigured(apiKey)) {
      const mockQuiz = getMockQuiz(topicId, topicTitle, grade);
      return {
        data: mockQuiz,
        modelUsed: 'Learnova-Quiz-Engine (Curriculum Bank Offline Mode)',
        isDemo: true,
        timestamp: new Date().toISOString(),
        executionTimeMs: Date.now() - startTime
      };
    }

    const prompt = buildQuizGenerationPrompt(topicTitle, grade, subject, language, 3);

    try {
      const quizResult = await generateGeminiQuiz({
        model: config.gemini.modelText,
        systemPrompt: "You are an expert STEM curriculum assessment designer.",
        userPrompt: prompt,
        apiKey
      });

      return {
        data: quizResult,
        modelUsed: config.gemini.modelText,
        isDemo: false,
        timestamp: new Date().toISOString(),
        executionTimeMs: Date.now() - startTime
      };
    } catch (err: any) {
      console.warn(`Quiz generation model error: ${err.message}. Using curriculum seed quiz.`);
      const mockQuiz = getMockQuiz(topicId, topicTitle, grade);
      return {
        data: mockQuiz,
        modelUsed: 'Learnova-Quiz (Curriculum Bank Fallback)',
        isDemo: true,
        timestamp: new Date().toISOString(),
        executionTimeMs: Date.now() - startTime
      };
    }
  }
}
