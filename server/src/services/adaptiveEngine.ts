import { DataStore, TopicProgress, Topic } from './dataStore.js';

export interface MasteryEvaluationResult {
  topicId: string;
  previousMastery: number;
  newMastery: number;
  newStatus: 'not_started' | 'in_progress' | 'needs_revision' | 'mastered';
  identifiedWeakConcepts: string[];
  recommendation: {
    recommendedTopicId: string;
    recommendedTopicTitle: string;
    reason: string;
    actionType: 'prerequisite_review' | 'concept_practice' | 'advance_topic';
  };
}

export class AdaptiveEngine {
  /**
   * Process quiz submission, update mastery, and generate explainable recommendation
   */
  public static evaluateQuizAttempt(
    topicOrParams: string | { topicId: string; score: number; totalQuestions: number; wrongConcepts?: string[] },
    maybeScore?: number,
    maybeTotal?: number,
    maybeWrong?: string[]
  ): MasteryEvaluationResult {
    let topicId: string;
    let score: number;
    let totalQuestions: number;
    let wrongConcepts: string[];

    if (typeof topicOrParams === 'object' && topicOrParams !== null) {
      topicId = topicOrParams.topicId;
      score = Number(topicOrParams.score) || 0;
      totalQuestions = Number(topicOrParams.totalQuestions) || 1;
      wrongConcepts = Array.isArray(topicOrParams.wrongConcepts) ? topicOrParams.wrongConcepts : [];
    } else {
      topicId = String(topicOrParams);
      score = Number(maybeScore) || 0;
      totalQuestions = Number(maybeTotal) || 1;
      wrongConcepts = Array.isArray(maybeWrong) ? maybeWrong : [];
    }

    const store = DataStore.getInstance();
    const existing = store.progress[topicId] || {
      topicId,
      status: 'not_started',
      masteryScore: 0.0,
      attemptsCount: 0,
      correctCount: 0,
      lastPracticedAt: new Date().toISOString()
    };

    const previousMastery = existing.masteryScore;
    const attemptAccuracy = score / Math.max(totalQuestions, 1);

    // Transparent, explainable mastery scoring formula:
    // Weighted moving average: 60% historical mastery + 40% latest performance
    let updatedMastery = existing.attemptsCount === 0
      ? attemptAccuracy
      : (existing.masteryScore * 0.6) + (attemptAccuracy * 0.4);

    updatedMastery = Math.min(1.0, Math.max(0.0, parseFloat(updatedMastery.toFixed(3))));

    // Determine status thresholds
    let newStatus: 'not_started' | 'in_progress' | 'needs_revision' | 'mastered';
    if (updatedMastery >= 0.85) {
      newStatus = 'mastered';
    } else if (attemptAccuracy < 0.6 || wrongConcepts.length >= 2) {
      newStatus = 'needs_revision';
    } else {
      newStatus = 'in_progress';
    }

    const updatedProgress: TopicProgress = {
      topicId,
      status: newStatus,
      masteryScore: updatedMastery,
      attemptsCount: existing.attemptsCount + 1,
      correctCount: existing.correctCount + score,
      lastMistakeConcept: wrongConcepts[0] || existing.lastMistakeConcept,
      lastPracticedAt: new Date().toISOString()
    };

    store.updateTopicProgress(updatedProgress);

    // Determine next recommendation based on prerequisite graph and current performance
    const currentTopic = store.topics.find(t => t.id === topicId);
    let recommendation: MasteryEvaluationResult['recommendation'];

    if (newStatus === 'needs_revision') {
      // Find prerequisite or target reinforcement
      const prereqName = currentTopic?.prerequisites[0];
      const prereqTopic = prereqName ? store.topics.find(t => t.title.toLowerCase().includes(prereqName.toLowerCase())) : null;

      if (prereqTopic && (store.progress[prereqTopic.id]?.masteryScore || 0) < 0.8) {
        recommendation = {
          recommendedTopicId: prereqTopic.id,
          recommendedTopicTitle: prereqTopic.title,
          reason: `Review prerequisite "${prereqTopic.title}" to strengthen fundamentals before retrying ${currentTopic?.title || 'this topic'}.`,
          actionType: 'prerequisite_review'
        };
      } else {
        recommendation = {
          recommendedTopicId: topicId,
          recommendedTopicTitle: currentTopic?.title || topicId,
          reason: `Targeted practice needed on: "${wrongConcepts[0] || 'core concepts'}". Socratic tutor will guide you through worked examples.`,
          actionType: 'concept_practice'
        };
      }
    } else if (newStatus === 'mastered') {
      // Advance to the next topic in the subject syllabus
      const nextTopic = store.topics.find(t => t.subjectId === currentTopic?.subjectId && t.orderIndex === (currentTopic?.orderIndex || 0) + 1);
      if (nextTopic) {
        recommendation = {
          recommendedTopicId: nextTopic.id,
          recommendedTopicTitle: nextTopic.title,
          reason: `Congratulations! You've mastered ${currentTopic?.title}. Advance to "${nextTopic.title}".`,
          actionType: 'advance_topic'
        };
      } else {
        recommendation = {
          recommendedTopicId: topicId,
          recommendedTopicTitle: currentTopic?.title || topicId,
          reason: `Outstanding work! You've completed the curriculum sequence for ${currentTopic?.subjectId}. Try practice challenge questions!`,
          actionType: 'concept_practice'
        };
      }
    } else {
      recommendation = {
        recommendedTopicId: topicId,
        recommendedTopicTitle: currentTopic?.title || topicId,
        reason: `Good progress (${Math.round(updatedMastery * 100)}% mastery). Complete another practice exercise to solidify understanding.`,
        actionType: 'concept_practice'
      };
    }

    return {
      topicId,
      previousMastery,
      newMastery: updatedMastery,
      newStatus,
      identifiedWeakConcepts: wrongConcepts,
      recommendation
    };
  }

  /**
   * Compute full personalized roadmap across subjects
   */
  public static getPersonalizedLearningPath(subjectFilter?: string) {
    const store = DataStore.getInstance();
    const filteredTopics = subjectFilter
      ? store.topics.filter(t => t.subjectId === subjectFilter)
      : store.topics;

    return filteredTopics.map(topic => {
      const progress = store.progress[topic.id] || {
        topicId: topic.id,
        status: 'not_started',
        masteryScore: 0.0,
        attemptsCount: 0,
        correctCount: 0,
        lastPracticedAt: null
      };

      let recommendationNote = '';
      if (progress.status === 'needs_revision') {
        recommendationNote = `Needs revision: ${progress.lastMistakeConcept || 'Prior quiz errors detected'}`;
      } else if (progress.status === 'mastered') {
        recommendationNote = 'Concept mastered! Ready for advanced problems.';
      } else if (progress.status === 'in_progress') {
        recommendationNote = 'Currently in progress. Keep up the momentum!';
      } else {
        recommendationNote = 'Ready to begin.';
      }

      return {
        ...topic,
        progress,
        recommendationNote
      };
    });
  }
}
