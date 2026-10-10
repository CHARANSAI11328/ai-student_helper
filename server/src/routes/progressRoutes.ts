import { Router, Request, Response } from 'express';
import { DataStore } from '../services/dataStore.js';

export const progressRouter = Router();

// GET /api/progress - Comprehensive student learning metrics
progressRouter.get('/', (_req: Request, res: Response) => {
  const store = DataStore.getInstance();
  const progressList = Object.values(store.progress);

  const masteredCount = progressList.filter(p => p.status === 'mastered').length;
  const inProgressCount = progressList.filter(p => p.status === 'in_progress').length;
  const needsRevisionCount = progressList.filter(p => p.status === 'needs_revision').length;

  const totalAttempts = store.quizAttempts.reduce((acc, q) => acc + q.totalQuestions, 0);
  const totalCorrect = store.quizAttempts.reduce((acc, q) => acc + q.score, 0);
  const overallAccuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;

  // Subject-wise mastery averages
  const subjectScores: Record<string, { total: number; count: number }> = {
    math: { total: 0, count: 0 },
    physics: { total: 0, count: 0 },
    chemistry: { total: 0, count: 0 }
  };

  store.topics.forEach(topic => {
    const prog = store.progress[topic.id];
    if (prog) {
      subjectScores[topic.subjectId].total += prog.masteryScore;
      subjectScores[topic.subjectId].count += 1;
    }
  });

  const subjectMastery = {
    math: subjectScores.math.count > 0 ? Math.round((subjectScores.math.total / subjectScores.math.count) * 100) : 0,
    physics: subjectScores.physics.count > 0 ? Math.round((subjectScores.physics.total / subjectScores.physics.count) * 100) : 0,
    chemistry: subjectScores.chemistry.count > 0 ? Math.round((subjectScores.chemistry.total / subjectScores.chemistry.count) * 100) : 0
  };

  const weakTopics = progressList
    .filter(p => p.status === 'needs_revision')
    .map(p => {
      const topic = store.topics.find(t => t.id === p.topicId);
      return {
        topicId: p.topicId,
        title: topic?.title || p.topicId,
        subjectId: topic?.subjectId || 'math',
        masteryScore: p.masteryScore,
        lastMistakeConcept: p.lastMistakeConcept
      };
    });

  return res.json({
    success: true,
    stats: {
      streakCount: store.profile.streakCount,
      totalStudyMinutes: store.profile.totalStudyMinutes,
      xpPoints: store.profile.xpPoints,
      overallAccuracy,
      masteredCount,
      inProgressCount,
      needsRevisionCount,
      subjectMastery,
      weakTopics,
      recentQuizzes: store.quizAttempts.slice(0, 5)
    }
  });
});

// GET /api/progress/achievements - Unlocked and available achievements
progressRouter.get('/achievements', (_req: Request, res: Response) => {
  const store = DataStore.getInstance();
  const achievements = store.achievements.map(a => ({
    ...a,
    isUnlocked: store.unlockedAchievementIds.has(a.id)
  }));

  return res.json({
    success: true,
    achievements,
    totalUnlocked: store.unlockedAchievementIds.size
  });
});
