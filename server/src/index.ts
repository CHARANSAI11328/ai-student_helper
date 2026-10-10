import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from './config.js';
import { tutorRouter } from './routes/tutorRoutes.js';
import { quizRouter } from './routes/quizRoutes.js';
import { learningRouter } from './routes/learningRoutes.js';
import { progressRouter } from './routes/progressRoutes.js';
import { notesRouter } from './routes/notesRoutes.js';
import { profileRouter } from './routes/profileRoutes.js';
import { configRouter } from './routes/configRoutes.js';
import { isGeminiConfigured } from './ai/providers/gemini.js';

const app = express();

// Security Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(cors({
  origin: '*', // Allow frontend development port
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-gemini-api-key']
}));

// Body Parsers
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Rate Limiter
const apiLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests from this IP, please try again after 15 minutes.' }
});

app.use('/api/', apiLimiter);

// Health & System Status Endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'Learnova AI Backend',
    version: '1.0.0',
    geminiConfigured: isGeminiConfigured(),
    defaultModelText: config.gemini.modelText,
    defaultModelVision: config.gemini.modelVision,
    mode: isGeminiConfigured() ? 'live_ai' : 'demo_offline_engine',
    timestamp: new Date().toISOString()
  });
});

// Mount Feature API Routers
app.use('/api/config', configRouter);
app.use('/api/tutor', tutorRouter);
app.use('/api/quiz', quizRouter);
app.use('/api/learning', learningRouter);
app.use('/api/progress', progressRouter);
app.use('/api/notes', notesRouter);
app.use('/api/profile', profileRouter);

// Centralized Error Handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled server error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    type: err.name || 'ServerError'
  });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(config.port, () => {
    console.log(`=======================================================`);
    console.log(`🚀 Learnova AI Backend running on http://localhost:${config.port}`);
    console.log(`🤖 AI Status: ${isGeminiConfigured() ? 'LIVE GEMINI API CONNECTED' : 'DEMO MODE (Socratic Mock Engine Active)'}`);
    console.log(`📚 Ready to serve school students in Math, Physics & Chemistry`);
    console.log(`=======================================================`);
  });
}

export default app;
