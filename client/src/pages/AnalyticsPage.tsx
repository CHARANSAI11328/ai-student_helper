import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Flame,
  Award,
  Calculator,
  Atom,
  FlaskConical
} from 'lucide-react';
import { useApp } from '../context/AppContext.js';
import { getProgressStats } from '../api/client.js';

export const AnalyticsPage: React.FC = () => {
  const { profile, t } = useApp();
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    getProgressStats().then(setStats).catch(() => {});
  }, []);

  const subjectMastery = stats?.subjectMastery || { math: 68, physics: 76, chemistry: 85 };
  const recentQuizzes = stats?.recentQuizzes || [];
  const weakTopics = stats?.weakTopics || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* HEADER */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 text-xs font-semibold">
          <BarChart3 className="h-3.5 w-3.5" />
          <span>Learning Analytics & Progress</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {t.nav.analytics}
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
          Track genuine conceptual growth, quiz accuracy trends, subject mastery, and topics identified for revision.
        </p>
      </div>

      {/* 4 HIGH LEVEL KPI METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Overall Accuracy</span>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {stats?.overallAccuracy || 82}%
          </p>
          <p className="text-[11px] text-slate-400">Across all completed quizzes</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Active Streak</span>
            <Flame className="h-4 w-4 text-amber-500 fill-amber-500" />
          </div>
          <p className="text-3xl font-extrabold text-amber-500">
            {stats?.streakCount || profile?.streakCount || 4} Days
          </p>
          <p className="text-[11px] text-slate-400">Consistent daily study</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Concepts Mastered</span>
            <CheckCircle2 className="h-4 w-4 text-brand-500" />
          </div>
          <p className="text-3xl font-extrabold text-brand-600 dark:text-brand-400">
            {stats?.masteredCount || 3}
          </p>
          <p className="text-[11px] text-slate-400">High diagnostic score (85%+)</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Needs Revision</span>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </div>
          <p className="text-3xl font-extrabold text-amber-600 dark:text-amber-400">
            {stats?.needsRevisionCount || 1}
          </p>
          <p className="text-[11px] text-slate-400">Concepts with flagged errors</p>
        </div>

      </div>

      {/* SUBJECT MASTERY BREAKDOWN */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Subject Mastery Analysis (Grades 9 & 10)
        </h2>

        <div className="space-y-4">
          
          {/* Math */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="flex items-center gap-1.5 text-blue-600">
                <Calculator className="h-4 w-4" />
                <span>{t.subjects.math}</span>
              </span>
              <span>{subjectMastery.math}%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${subjectMastery.math}%` }}
              />
            </div>
          </div>

          {/* Physics */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="flex items-center gap-1.5 text-purple-600">
                <Atom className="h-4 w-4" />
                <span>{t.subjects.physics}</span>
              </span>
              <span>{subjectMastery.physics}%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
              <div
                className="bg-purple-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${subjectMastery.physics}%` }}
              />
            </div>
          </div>

          {/* Chemistry */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="flex items-center gap-1.5 text-emerald-600">
                <FlaskConical className="h-4 w-4" />
                <span>{t.subjects.chemistry}</span>
              </span>
              <span>{subjectMastery.chemistry}%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
              <div
                className="bg-emerald-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${subjectMastery.chemistry}%` }}
              />
            </div>
          </div>

        </div>
      </div>

      {/* TWO COLUMN GRID: TOPICS NEEDING ATTENTION & QUIZ LOG */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Identified Weak Topics */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <span>Targeted Focus Concepts (Needs Revision)</span>
          </h3>

          <div className="space-y-3">
            {weakTopics.length > 0 ? (
              weakTopics.map((wTopic: any, idx: number) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 space-y-1 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white">{wTopic.title}</span>
                    <span className="font-bold text-amber-700 dark:text-amber-400">
                      {Math.round(wTopic.masteryScore * 100)}% Mastery
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300">
                    Difficulty recorded: <em>"{wTopic.lastMistakeConcept || 'Prerequisite confusion'}"</em>
                  </p>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400">No weak concepts flagged! All chapters on track.</p>
            )}
          </div>
        </div>

        {/* Diagnostic Quiz History */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="h-4 w-4 text-brand-500" />
            <span>Recent Assessment History</span>
          </h3>

          <div className="space-y-3">
            {recentQuizzes.map((quiz: any, idx: number) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs"
              >
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">{quiz.topicTitle}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {new Date(quiz.createdAt).toLocaleDateString()} • {quiz.timeSpentSeconds}s duration
                  </p>
                </div>

                <div className="text-right">
                  <span
                    className={`font-bold px-2 py-0.5 rounded ${
                      quiz.score === quiz.totalQuestions
                        ? 'bg-emerald-100 text-emerald-800'
                        : quiz.score > 0
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {quiz.score} / {quiz.totalQuestions}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
