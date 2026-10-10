import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Flame,
  Clock,
  Award,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Calculator,
  Atom,
  FlaskConical,
  TrendingUp,
  Search
} from 'lucide-react';
import { useApp } from '../context/AppContext.js';
import { getProgressStats } from '../api/client.js';

export const DashboardPage: React.FC = () => {
  const { profile, t } = useApp();
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>(null);
  const [quickQuery, setQuickQuery] = useState('');

  useEffect(() => {
    getProgressStats().then(setStats).catch(() => {});
  }, []);

  const handleQuickAsk = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickQuery.trim()) {
      navigate(`/tutor?q=${encodeURIComponent(quickQuery)}`);
    }
  };

  const subjectMastery = stats?.subjectMastery || { math: 68, physics: 76, chemistry: 85 };
  const weakTopics = stats?.weakTopics || [
    {
      topicId: 'math-alg-quad',
      title: 'Quadratic Equations',
      subjectId: 'math',
      masteryScore: 0.45,
      lastMistakeConcept: 'Discriminant signs when b is negative'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* WELCOME BANNER & QUICK STATS */}
      <div className="bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur text-white text-xs font-semibold">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Grade {profile?.grade || 10} Personalized Dashboard</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {profile?.name || 'Aarav'}! 👋
            </h1>
            <p className="text-brand-100 text-sm max-w-xl">
              "{profile?.learningGoals || 'Master Class 10 Board Exam STEM fundamentals and score 95%+'}"
            </p>
          </div>

          {/* Stat Pills */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-white/10 backdrop-blur rounded-2xl p-3 border border-white/10">
              <div className="flex items-center justify-center gap-1 text-amber-300 mb-1">
                <Flame className="h-4 w-4 fill-amber-300" />
                <span className="font-extrabold text-lg">{stats?.streakCount || profile?.streakCount || 4}</span>
              </div>
              <p className="text-[11px] text-white/80">{t.common.streak}</p>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-2xl p-3 border border-white/10">
              <div className="flex items-center justify-center gap-1 text-blue-200 mb-1">
                <Clock className="h-4 w-4" />
                <span className="font-extrabold text-lg">{stats?.totalStudyMinutes || profile?.totalStudyMinutes || 185}</span>
              </div>
              <p className="text-[11px] text-white/80">{t.common.minutes}</p>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-2xl p-3 border border-white/10">
              <div className="flex items-center justify-center gap-1 text-yellow-300 mb-1">
                <Award className="h-4 w-4" />
                <span className="font-extrabold text-lg">{stats?.xpPoints || profile?.xpPoints || 420}</span>
              </div>
              <p className="text-[11px] text-white/80">{t.common.points}</p>
            </div>
          </div>
        </div>
      </div>

      {/* QUICK QUESTION BAR */}
      <form onSubmit={handleQuickAsk} className="relative">
        <input
          type="text"
          value={quickQuery}
          onChange={(e) => setQuickQuery(e.target.value)}
          placeholder={t.tutor.inputPlaceholder}
          className="w-full pl-12 pr-32 py-3.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
        />
        <Search className="h-5 w-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold text-xs transition-colors"
        >
          {t.common.askTutor}
        </button>
      </form>

      {/* OBSERVABLE ADAPTIVE TUTORING ALERT: WEAK CONCEPTS NEEDING REVISION */}
      {weakTopics.length > 0 && (
        <div className="bg-amber-50 dark:bg-amber-950/40 rounded-2xl p-5 border border-amber-200 dark:border-amber-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-sm">
              <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <span>Adaptive Alert: Needs Revision</span>
            </div>
            <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200">
              Personalized Loop
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
            Based on your recent quiz responses, the adaptive engine identified difficulty in{' '}
            <strong className="text-amber-900 dark:text-amber-200 font-semibold">{weakTopics[0].title}</strong>:{' '}
            <em>"{weakTopics[0].lastMistakeConcept || 'Prerequisite confusion'}"</em>.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Link
              to={`/quiz?topic=${weakTopics[0].topicId}`}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5"
            >
              <span>Practice Targeted Quiz</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>

            <Link
              to={`/tutor?q=${encodeURIComponent(`Explain ${weakTopics[0].title} focusing on ${weakTopics[0].lastMistakeConcept || 'basics'} step by step`)}`}
              className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-300 text-xs font-semibold hover:bg-amber-50 transition-colors"
            >
              Ask AI Tutor for Socratic Explanation
            </Link>
          </div>
        </div>
      )}

      {/* SUBJECT-WISE MASTERY CARDS */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Subject Progress (Grades 9 & 10 STEM)
          </h2>
          <Link to="/learning-hub" className="text-xs font-semibold text-brand-600 hover:underline">
            View All Chapters →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Math Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-10 w-10 rounded-xl bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-blue-600">
                  <Calculator className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">{t.subjects.math}</h3>
                  <p className="text-[11px] text-slate-500">5 Syllabus Units</p>
                </div>
              </div>
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                {subjectMastery.math}% Mastery
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${subjectMastery.math}%` }}
              />
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-500">Next Recommended:</span>
              <Link to="/quiz?topic=math-alg-quad" className="font-semibold text-blue-600 hover:underline">
                Quadratic Roots →
              </Link>
            </div>
          </div>

          {/* Physics Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-10 w-10 rounded-xl bg-purple-100 dark:bg-purple-950 flex items-center justify-center text-purple-600">
                  <Atom className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">{t.subjects.physics}</h3>
                  <p className="text-[11px] text-slate-500">4 Syllabus Units</p>
                </div>
              </div>
              <span className="text-xs font-bold text-purple-600 dark:text-purple-400">
                {subjectMastery.physics}% Mastery
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-purple-600 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${subjectMastery.physics}%` }}
              />
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-500">Next Recommended:</span>
              <Link to="/quiz?topic=phys-elec-circuits" className="font-semibold text-purple-600 hover:underline">
                Electricity & Ohm's Law →
              </Link>
            </div>
          </div>

          {/* Chemistry Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-10 w-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600">
                  <FlaskConical className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">{t.subjects.chemistry}</h3>
                  <p className="text-[11px] text-slate-500">4 Syllabus Units</p>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                {subjectMastery.chemistry}% Mastery
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-emerald-600 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${subjectMastery.chemistry}%` }}
              />
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-500">Next Recommended:</span>
              <Link to="/quiz?topic=chem-acids-bases" className="font-semibold text-emerald-600 hover:underline">
                Acids & Bases →
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* TWO COLUMN GRID: RECENT SESSIONS & ACHIEVEMENTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recent Quizzes */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-brand-500" />
              <span>Recent Diagnostic Quizzes</span>
            </h3>
            <Link to="/quiz" className="text-xs font-semibold text-brand-600 hover:underline">
              Take a Quiz →
            </Link>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-100">Quadratic Equations Diagnostic</p>
                <p className="text-rose-500 text-[11px] mt-0.5">Missed: Negative discriminant sign rule</p>
              </div>
              <div className="text-right">
                <span className="px-2 py-1 rounded bg-rose-100 text-rose-700 font-bold">1 / 3</span>
                <p className="text-[10px] text-slate-400 mt-0.5">4 hours ago</p>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-100">Electricity & Ohm's Law</p>
                <p className="text-amber-500 text-[11px] mt-0.5">Review: Parallel resistor reciprocals</p>
              </div>
              <div className="text-right">
                <span className="px-2 py-1 rounded bg-amber-100 text-amber-700 font-bold">2 / 3</span>
                <p className="text-[10px] text-slate-400 mt-0.5">8 hours ago</p>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-100">Chemical Reactions & Balancing</p>
                <p className="text-emerald-500 text-[11px] mt-0.5">Perfect: Law of Conservation of Mass</p>
              </div>
              <div className="text-right">
                <span className="px-2 py-1 rounded bg-emerald-100 text-emerald-700 font-bold">3 / 3</span>
                <p className="text-[10px] text-slate-400 mt-0.5">Yesterday</p>
              </div>
            </div>
          </div>
        </div>

        {/* Unlocked Badges */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="h-4 w-4 text-amber-500" />
              <span>Earned Achievements & Streaks</span>
            </h3>
            <span className="text-xs text-slate-400">2 / 5 Unlocked</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
                🔥
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">3-Day Fire</h4>
                <p className="text-[10px] text-slate-500">Active study streak</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
                ✨
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Curious Step</h4>
                <p className="text-[10px] text-slate-500">First Socratic question</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 opacity-60 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-500 flex items-center justify-center font-bold">
                📸
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Vision Pioneer</h4>
                <p className="text-[10px] text-slate-400">Locked: Use Vision Lab</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 opacity-60 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-500 flex items-center justify-center font-bold">
                🏆
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Quiz Ace</h4>
                <p className="text-[10px] text-slate-400">Locked: Score 100%</p>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
