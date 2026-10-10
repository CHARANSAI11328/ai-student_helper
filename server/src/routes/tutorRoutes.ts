import { Router, Request, Response } from 'express';
import multer from 'multer';
import { ModelRouter } from '../ai/modelRouter.js';
import { MathVerifier } from '../services/mathVerifier.js';
import { DataStore } from '../services/dataStore.js';

const upload = multer({
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only JPG, PNG, WEBP, and GIF images are allowed.'));
    }
  }
});

export const tutorRouter = Router();

// POST /api/tutor/ask - Socratic text tutoring
tutorRouter.post('/ask', async (req: Request, res: Response) => {
  try {
    const {
      question,
      subject = 'math',
      grade = 10,
      language = 'en',
      style = 'step_by_step',
      forceComplexModel = false
    } = req.body;

    const apiKey = (req.headers['x-gemini-api-key'] || req.body.apiKey) as string | undefined;

    if (!question || typeof question !== 'string' || question.trim().length === 0) {
      return res.status(400).json({ error: 'Question text is required.' });
    }

    const store = DataStore.getInstance();
    const weakTopics = Object.values(store.progress)
      .filter(p => p.status === 'needs_revision')
      .map(p => p.lastMistakeConcept || p.topicId);

    const result = await ModelRouter.routeTextTutor({
      question,
      context: {
        grade: Number(grade),
        subject,
        language,
        explanationStyle: style,
        studentName: store.profile.name,
        priorWeakConcepts: weakTopics
      },
      forceComplexModel: Boolean(forceComplexModel),
      apiKey
    });

    // Run deterministic verification if simple arithmetic/quadratic is detected
    let verification = null;
    if (question.match(/[\d\.]+\s*[\+\-\*\/]\s*[\d\.]+/)) {
      const match = question.match(/([\d\.]+\s*[\+\-\*\/]\s*[\d\.]+)/);
      if (match) {
        verification = MathVerifier.verifyArithmetic(match[1], result.data.finalAnswer);
      }
    }

    // Update study time and unlock First Curious Step achievement
    store.profile.totalStudyMinutes += 3;
    store.unlockAchievement('ach-first-step');
    if (subject === 'math') {
      store.unlockAchievement('ach-math-solver');
    }

    return res.json({
      success: true,
      explanation: result.data,
      verification,
      metadata: {
        modelUsed: result.modelUsed,
        isDemo: result.isDemo,
        executionTimeMs: result.executionTimeMs,
        timestamp: result.timestamp
      }
    });
  } catch (err: any) {
    console.error('Tutor ask route error:', err);
    return res.status(500).json({
      error: 'Failed to generate tutoring response.',
      details: err.message
    });
  }
});

// POST /api/tutor/analyze-image - Multimodal Vision Lab
tutorRouter.post('/analyze-image', upload.single('image'), async (req: Request, res: Response) => {
  try {
    let base64Data = '';
    let mimeType = 'image/png';
    let fileName = 'upload.png';

    if (req.file) {
      base64Data = req.file.buffer.toString('base64');
      mimeType = req.file.mimetype;
      fileName = req.file.originalname;
    } else if (req.body.imageBase64) {
      base64Data = req.body.imageBase64.replace(/^data:image\/\w+;base64,/, '');
      mimeType = req.body.mimeType || 'image/png';
      fileName = req.body.fileName || 'canvas.png';
    } else {
      return res.status(400).json({ error: 'Image file or imageBase64 string is required.' });
    }

    const {
      subject = 'math',
      grade = 10,
      mode = 'solve' // 'transcribe_only' | 'solve'
    } = req.body;

    const apiKey = (req.headers['x-gemini-api-key'] || req.body.apiKey) as string | undefined;

    const visionResult = await ModelRouter.routeVision({
      imageBase64: base64Data,
      mimeType,
      subject,
      grade: Number(grade),
      fileName,
      apiKey
    });

    const store = DataStore.getInstance();
    store.unlockAchievement('ach-vision-lab');

    // If student requested immediate solution and image is readable
    let fullExplanation = null;
    if (mode === 'solve' && visionResult.data.extractedText && !visionResult.data.clarificationNeeded) {
      const tutorResult = await ModelRouter.routeTextTutor({
        question: visionResult.data.extractedText,
        context: {
          grade: Number(grade),
          subject,
          language: store.profile.language,
          explanationStyle: store.profile.explanationStyle
        },
        apiKey
      });
      fullExplanation = tutorResult.data;
    }

    return res.json({
      success: true,
      transcription: visionResult.data,
      solution: fullExplanation,
      metadata: {
        modelUsed: visionResult.modelUsed,
        isDemo: visionResult.isDemo,
        executionTimeMs: visionResult.executionTimeMs,
        timestamp: visionResult.timestamp
      }
    });
  } catch (err: any) {
    console.error('Vision analysis error:', err);
    return res.status(500).json({
      error: 'Failed to analyze uploaded image.',
      details: err.message
    });
  }
});
