import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../../config.js';
import { TutorResponse, TutorResponseSchema, VisionTranscription, VisionTranscriptionSchema, QuizGeneration, QuizGenerationSchema } from '../schemas/tutorResponse.js';

let genAI: GoogleGenerativeAI | null = null;
let dynamicApiKey: string = '';

export function setDynamicApiKey(key: string) {
  dynamicApiKey = key.trim();
  genAI = null; // Reset cached client
}

export function getActiveApiKey(): string {
  return dynamicApiKey || config.gemini.apiKey || '';
}

export function getGeminiClient(customKey?: string): GoogleGenerativeAI | null {
  const activeKey = customKey || getActiveApiKey();
  if (!activeKey) {
    return null;
  }
  if (!genAI || customKey) {
    const client = new GoogleGenerativeAI(activeKey);
    if (!customKey) genAI = client;
    return client;
  }
  return genAI;
}

export function isGeminiConfigured(customKey?: string): boolean {
  const activeKey = customKey || getActiveApiKey();
  return Boolean(activeKey && activeKey.trim().length > 0);
}

export async function validateGeminiKey(key: string): Promise<{ valid: boolean; models: string[]; error?: string }> {
  if (!key || key.trim().length === 0) {
    return { valid: false, models: [], error: 'API key cannot be empty.' };
  }
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key.trim()}`);
    const data = await res.json() as any;
    if (data.error) {
      return { valid: false, models: [], error: data.error.message || 'Invalid API key.' };
    }
    const modelNames: string[] = (data.models || [])
      .map((m: any) => m.name.replace('models/', ''))
      .filter((name: string) => name.includes('gemini'));
    return { valid: true, models: modelNames };
  } catch (err: any) {
    return { valid: false, models: [], error: `Network error verifying key: ${err.message}` };
  }
}

export interface GenerateTextOptions {
  model?: string;
  systemPrompt: string;
  userPrompt: string;
  temperature?: number;
  apiKey?: string;
}

export interface GenerateVisionOptions {
  model?: string;
  prompt: string;
  imageBase64: string;
  mimeType: string;
  apiKey?: string;
}

const FALLBACK_MODELS = ['gemini-1.5-flash', 'gemini-1.5-flash-8b', 'gemini-2.0-flash', 'gemini-1.5-pro'];

export async function generateGeminiTutorResponse(options: GenerateTextOptions): Promise<TutorResponse> {
  const client = getGeminiClient(options.apiKey);
  if (!client) {
    throw new Error('GEMINI_API_KEY is not configured.');
  }

  const candidateModels = [
    options.model || config.gemini.modelText,
    ...FALLBACK_MODELS.filter(m => m !== (options.model || config.gemini.modelText))
  ];

  let lastError: any = null;

  for (const modelId of candidateModels) {
    try {
      const model = client.getGenerativeModel({
        model: modelId,
        generationConfig: {
          temperature: options.temperature ?? config.gemini.temperature,
          responseMimeType: 'application/json',
        },
        systemInstruction: options.systemPrompt,
      });

      const result = await model.generateContent(options.userPrompt);
      const responseText = result.response.text();

      const parsed = JSON.parse(responseText);
      return TutorResponseSchema.parse(parsed);
    } catch (err: any) {
      lastError = err;
      // If error is 404 or unsupported model, try next candidate
      if (err.message && (err.message.includes('404') || err.message.includes('not found') || err.message.includes('supported methods'))) {
        continue;
      }
      throw err;
    }
  }

  throw lastError || new Error('No candidate Gemini model succeeded.');
}

export async function generateGeminiVisionTranscription(options: GenerateVisionOptions): Promise<VisionTranscription> {
  const client = getGeminiClient(options.apiKey);
  if (!client) {
    throw new Error('GEMINI_API_KEY is not configured.');
  }

  const candidateModels = [
    options.model || config.gemini.modelVision,
    ...FALLBACK_MODELS.filter(m => m !== (options.model || config.gemini.modelVision))
  ];

  const partImage = {
    inlineData: {
      data: options.imageBase64,
      mimeType: options.mimeType,
    },
  };

  let lastError: any = null;

  for (const modelId of candidateModels) {
    try {
      const model = client.getGenerativeModel({
        model: modelId,
        generationConfig: {
          temperature: 0.2,
          responseMimeType: 'application/json',
        },
      });

      const result = await model.generateContent([options.prompt, partImage]);
      const responseText = result.response.text();

      const parsed = JSON.parse(responseText);
      return VisionTranscriptionSchema.parse(parsed);
    } catch (err: any) {
      lastError = err;
      if (err.message && (err.message.includes('404') || err.message.includes('not found') || err.message.includes('supported methods'))) {
        continue;
      }
      throw err;
    }
  }

  throw lastError || new Error('No candidate Gemini vision model succeeded.');
}

export async function generateGeminiQuiz(options: GenerateTextOptions): Promise<QuizGeneration> {
  const client = getGeminiClient(options.apiKey);
  if (!client) {
    throw new Error('GEMINI_API_KEY is not configured.');
  }

  const candidateModels = [
    options.model || config.gemini.modelText,
    ...FALLBACK_MODELS.filter(m => m !== (options.model || config.gemini.modelText))
  ];

  let lastError: any = null;

  for (const modelId of candidateModels) {
    try {
      const model = client.getGenerativeModel({
        model: modelId,
        generationConfig: {
          temperature: 0.4,
          responseMimeType: 'application/json',
        },
        systemInstruction: options.systemPrompt,
      });

      const result = await model.generateContent(options.userPrompt);
      const responseText = result.response.text();

      const parsed = JSON.parse(responseText);
      return QuizGenerationSchema.parse(parsed);
    } catch (err: any) {
      lastError = err;
      if (err.message && (err.message.includes('404') || err.message.includes('not found') || err.message.includes('supported methods'))) {
        continue;
      }
      throw err;
    }
  }

  throw lastError || new Error('No candidate Gemini quiz model succeeded.');
}
