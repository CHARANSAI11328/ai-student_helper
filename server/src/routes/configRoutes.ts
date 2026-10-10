import { Router, Request, Response } from 'express';
import { isGeminiConfigured, getActiveApiKey, setDynamicApiKey, validateGeminiKey } from '../ai/providers/gemini.js';
import { config } from '../config.js';

export const configRouter = Router();

// GET /api/config/ai-status
configRouter.get('/ai-status', async (_req: Request, res: Response) => {
  const activeKey = getActiveApiKey();
  const configured = isGeminiConfigured();

  let maskedKey = '';
  if (configured && activeKey) {
    maskedKey = activeKey.length > 8 ? `${activeKey.slice(0, 6)}...${activeKey.slice(-4)}` : '••••••••';
  }

  return res.json({
    geminiConfigured: configured,
    maskedKey,
    activeModelText: config.gemini.modelText,
    activeModelVision: config.gemini.modelVision,
    mode: configured ? 'live_ai' : 'demo_offline_engine'
  });
});

// POST /api/config/test-key - Test a key without persisting
configRouter.post('/test-key', async (req: Request, res: Response) => {
  const { apiKey } = req.body;
  if (!apiKey || typeof apiKey !== 'string' || apiKey.trim().length === 0) {
    return res.status(400).json({ valid: false, error: 'API key is required.' });
  }

  const startTime = Date.now();
  const result = await validateGeminiKey(apiKey.trim());
  const latencyMs = Date.now() - startTime;

  return res.json({
    ...result,
    latencyMs
  });
});

// POST /api/config/set-key - Set the active API key in memory
configRouter.post('/set-key', async (req: Request, res: Response) => {
  const { apiKey } = req.body;
  if (!apiKey || typeof apiKey !== 'string') {
    return res.status(400).json({ error: 'API key string is required.' });
  }

  const trimmed = apiKey.trim();
  const validation = await validateGeminiKey(trimmed);

  if (!validation.valid) {
    return res.status(400).json({
      error: validation.error || 'The provided Gemini API key could not be validated by Google AI Studio.',
      valid: false
    });
  }

  setDynamicApiKey(trimmed);

  return res.json({
    success: true,
    message: 'Gemini API key successfully validated and activated!',
    models: validation.models,
    mode: 'live_ai'
  });
});
