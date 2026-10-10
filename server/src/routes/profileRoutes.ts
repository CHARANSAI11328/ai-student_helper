import { Router, Request, Response } from 'express';
import { DataStore } from '../services/dataStore.js';

export const profileRouter = Router();

// GET /api/profile - Retrieve student profile
profileRouter.get('/', (_req: Request, res: Response) => {
  const store = DataStore.getInstance();
  return res.json({ success: true, profile: store.profile });
});

// PATCH /api/profile - Update student preferences
profileRouter.patch('/', (req: Request, res: Response) => {
  try {
    const store = DataStore.getInstance();
    const allowedFields = [
      'name',
      'grade',
      'language',
      'strongSubjects',
      'weakSubjects',
      'learningGoals',
      'explanationStyle',
      'confidenceLevel'
    ];

    const updates: any = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    const updated = store.updateProfile(updates);
    return res.json({ success: true, profile: updated });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to update profile.', details: err.message });
  }
});

// POST /api/profile/demo - Reset or load Judge Demo Profile
profileRouter.post('/demo', (_req: Request, res: Response) => {
  const store = DataStore.getInstance();
  store.resetDemoData();
  return res.json({
    success: true,
    message: 'Judge Demo Profile and sample curriculum data restored.',
    profile: store.profile
  });
});
