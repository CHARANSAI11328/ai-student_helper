import { Router, Request, Response } from 'express';
import { ModelRouter } from '../ai/modelRouter.js';
import { AdaptiveEngine } from '../services/adaptiveEngine.js';
import { DataStore, QuizAttempt } from '../services/dataStore.js';

export const quizRouter = Router();

// POST /api/quiz/generate - Generate topic quiz
quizRouter.post('/generate', async (req: Request, res: Response) => {
  try {
    const { topicId } = req.body;
    const apiKey = (req.headers['x-gemini-api-key'] || req.body.apiKey) as string | undefined;
    const store = DataStore.getInstance();
    const topic = store.topics.find(t => t.id === topicId) || store.topics[0];

    const result = await ModelRouter.routeQuiz(
      topic.id,
      topic.title,
      topic.subjectId,
      topic.grade,
      store.profile.language,
      apiKey
    );

    return res.json({
      success: true,
      quiz: result.data,
      metadata: {
        modelUsed: result.modelUsed,
        isDemo: result.isDemo
      }
    });
  } catch (err: any) {
    console.error('Quiz generation error:', err);
    return res.status(500).json({ error: 'Failed to generate quiz.', details: err.message });
  }
});

// POST /api/quiz/submit - Submit quiz responses & trigger adaptive mastery evaluation
quizRouter.post('/submit', async (req: Request, res: Response) => {
  try {
    const {
      topicId,
      score,
      totalQuestions,
      timeSpentSeconds = 60,
      wrongConcepts = []
    } = req.body;

    if (!topicId || score === undefined || !totalQuestions) {
      return res.status(400).json({ error: 'topicId, score, and totalQuestions are required.' });
    }

    const store = DataStore.getInstance();
    const topic = store.topics.find(t => t.id === topicId);

    // Save quiz attempt
    const attempt: QuizAttempt = {
      id: `quiz-att-${Date.now()}`,
      studentId: store.profile.id,
      subject: topic?.subjectId || 'math',
      topicId,
      score: Number(score),
      totalQuestions: Number(totalQuestions),
      timeSpentSeconds: Number(timeSpentSeconds),
      timestamp: new Date().toISOString()
    };
    store.quizAttempts.unshift(attempt);

    // Run transparent adaptive mastery algorithm
    const evaluation = AdaptiveEngine.evaluateQuizAttempt({
      studentId: store.profile.id,
      topicId,
      score: Number(score),
      totalQuestions: Number(totalQuestions),
      timeSpentSeconds: Number(timeSpentSeconds),
      wrongConcepts: Array.isArray(wrongConcepts) ? wrongConcepts : []
    });

    // Check achievement unlock
    if (score === totalQuestions) {
      store.unlockAchievement('ach-quiz-master');
    }

    return res.json({
      success: true,
      evaluation,
      profile: store.profile,
      attempt
    });
  } catch (err: any) {
    console.error('Quiz submission error:', err);
    return res.status(500).json({ error: 'Failed to process quiz submission.', details: err.message });
  }
});
