import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Google Gemini API Configuration
  gemini: {
    apiKey: process.env.GEMINI_API_KEY || '',
    modelText: process.env.GEMINI_MODEL_TEXT || 'gemini-1.5-flash',
    modelVision: process.env.GEMINI_MODEL_VISION || 'gemini-1.5-flash',
    modelPro: process.env.GEMINI_MODEL_PRO || 'gemini-1.5-pro',
    temperature: parseFloat(process.env.GEMINI_TEMPERATURE || '0.3'),
  },

  // Security & Rate Limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
  },

  // Storage / Database
  supabase: {
    url: process.env.SUPABASE_URL || '',
    serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  },
};
