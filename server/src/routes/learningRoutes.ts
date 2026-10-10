import { Router, Request, Response } from 'express';
import { DataStore } from '../services/dataStore.js';
import { AdaptiveEngine } from '../services/adaptiveEngine.js';

export const learningRouter = Router();

// GET /api/learning/subjects - List subjects
learningRouter.get('/subjects', (_req: Request, res: Response) => {
  const subjects = [
    {
      id: 'math',
      name: 'Mathematics',
      description: 'Master algebra, geometry, trigonometry, and calculus through step-by-step problem solving.',
      colorCode: '#2563eb',
      iconName: 'Calculator',
      topicCount: 5
    },
    {
      id: 'physics',
      name: 'Physics',
      description: 'Explore mechanics, energy, electromagnetism, and modern physics through visual concepts.',
      colorCode: '#7c3aed',
      iconName: 'Atom',
      topicCount: 4
    },
    {
      id: 'chemistry',
      name: 'Chemistry',
      description: 'Understand atomic structure, chemical reactions, periodic table, and organic compounds.',
      colorCode: '#059669',
      iconName: 'FlaskConical',
      topicCount: 4
    }
  ];

  return res.json({ success: true, subjects });
});

// GET /api/learning/topics - List all curriculum topics
learningRouter.get('/topics', (req: Request, res: Response) => {
  const store = DataStore.getInstance();
  const subject = req.query.subject as string | undefined;
  const grade = req.query.grade ? Number(req.query.grade) : undefined;

  let topics = store.topics;
  if (subject) {
    topics = topics.filter(t => t.subjectId === subject);
  }
  if (grade) {
    topics = topics.filter(t => t.grade === grade);
  }

  const enhancedTopics = topics.map(t => {
    const progress = store.progress[t.id];
    return {
      ...t,
      progress: progress || {
        topicId: t.id,
        status: 'not_started',
        masteryScore: 0,
        attemptsCount: 0,
        correctCount: 0
      }
    };
  });

  return res.json({ success: true, topics: enhancedTopics });
});

// GET /api/learning/path - Personalized adaptive learning roadmap
learningRouter.get('/path', (req: Request, res: Response) => {
  const subject = req.query.subject as string | undefined;
  const roadmap = AdaptiveEngine.getPersonalizedLearningPath(subject);
  return res.json({ success: true, roadmap });
});
