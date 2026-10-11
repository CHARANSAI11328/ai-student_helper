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
      
      {/* 1. WELCOME COMMAND CONSOLE & REAL-TIME TELEMETRY */}
      <div className="console-card-elevated rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden border-white/10 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-medium">
              <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
              <span>GRADE {profile?.grade || 10} CBSE/ICSE · ADAPTIVE TELEMETRY</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-display text-white">
              Welcome back, {profile?.name || 'Aarav'}
            </h1>
            <p className="text-slate-300 text-sm max-w-xl font-normal">
              "{profile?.learningGoals || 'Master Class 10 Board Exam STEM fundamentals and score 95%+'}"
            </p>
          </div>

          {/* Precision Stat Pills */}
          <div className="grid grid-cols-3 gap-3 text-center font-mono">
            <div className="console-card rounded-2xl p-3 border-white/10 hover:border-amber-500/30 transition-colors">
              <div className="flex items-center justify-center gap-1.5 text-amber-400 mb-1">
                <Flame className="h-4 w-4 fill-amber-400" />
                <span className="font-extrabold text-xl">{stats?.streakCount || profile?.streakCount || 4}d</span>
              </div>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider">{t.common.streak}</p>
            </div>

            <div className="console-card rounded-2xl p-3 border-white/10 hover:border-cyan-500/30 transition-colors">
              <div className="flex items-center justify-center gap-1.5 text-cyan-400 mb-1">
                <Clock className="h-4 w-4" />
                <span className="font-extrabold text-xl">{stats?.totalStudyMinutes || profile?.totalStudyMinutes || 185}m</span>
              </div>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider">{t.common.minutes}</p>
            </div>

            <div className="console-card rounded-2xl p-3 border-white/10 hover:border-purple-500/30 transition-colors">
              <div className="flex items-center justify-center gap-1.5 text-purple-400 mb-1">
                <Award className="h-4 w-4" />
                <span className="font-extrabold text-xl">{stats?.xpPoints || profile?.xpPoints || 420}</span>
              </div>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider">{t.common.points}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. RAPID INQUIRY SEARCH BAR */}
      <form onSubmit={handleQuickAsk} className="relative group">
        <input
          type="text"
          value={quickQuery}
          onChange={(e) => setQuickQuery(e.target.value)}
          placeholder={t.tutor.inputPlaceholder}
          className="w-full pl-12 pr-32 py-4 rounded-2xl console-card border-white/10 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 text-sm shadow-xl transition-all"
        />
        <Search className="h-5 w-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-cyan-400 transition-colors" />
        <button
          type="submit"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs transition-all shadow-md shadow-cyan-500/20 active:scale-95"
        >
          {t.common.askTutor}
        </button>
      </form>

      {/* 3. OBSERVABLE ADAPTIVE TUTORING ALERT: WEAK CONCEPTS NEEDING REVISION */}
      {weakTopics.length > 0 && (
        <div className="rounded-2xl p-5 border border-amber-500/30 bg-amber-950/20 console-card space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm font-mono">
              <AlertTriangle className="h-4 w-4 text-amber-400" />
              <span>Adaptive Telemetry Alert · Prerequisite Knowledge Gap Detected</span>
            </div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Personalized Loop
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-200">
            Based on your recent quiz responses, the adaptive engine identified difficulty in{' '}
            <strong className="text-amber-300 font-semibold">{weakTopics[0].title}</strong>:{' '}
            <em className="text-slate-300">"{weakTopics[0].lastMistakeConcept || 'Prerequisite confusion'}"</em>.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Link
              to={`/quiz?topic=${weakTopics[0].topicId}`}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
            >
              <span>Practice Targeted Quiz</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>

            <Link
              to={`/tutor?q=${encodeURIComponent(`Explain ${weakTopics[0].title} focusing on ${weakTopics[0].lastMistakeConcept || 'basics'} step by step`)}`}
              className="px-4 py-2 rounded-xl console-card border-amber-500/30 text-amber-300 text-xs font-semibold hover:bg-amber-950/40 transition-colors"
            >
              Ask AI Tutor for Socratic Explanation
            </Link>
          </div>
        </div>
      )}

      {/* 4. SUBJECT-WISE MASTERY CARDS (SCIENTIFIC GAUGES) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white font-display">
              Subject Mastery Index
            </h2>
            <span className="font-mono text-xs text-slate-400">(Grades 9 & 10 STEM)</span>
          </div>
          <Link to="/learning-hub" className="text-xs font-semibold text-cyan-400 hover:underline flex items-center gap-1">
            <span>View All Chapters & Labs</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Math Card */}
          <div className="console-card-elevated rounded-2xl p-6 border-white/10 hover:border-blue-500/40 transition-all space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-blue-950/80 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <Calculator className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">{t.subjects.math}</h3>
                  <p className="text-[11px] font-mono text-slate-400">5 Syllabus Units</p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800">
                {subjectMastery.math}% Mastery
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-white/5">
              <div
                className="bg-gradient-to-r from-blue-500 to-cyan-400 h-2 rounded-full transition-all duration-500 shadow-sm shadow-blue-500/50"
                style={{ width: `${subjectMastery.math}%` }}
              />
            </div>

            <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Next Recommended:</span>
              <Link to="/quiz?topic=math-alg-quad" className="font-semibold text-cyan-400 hover:underline">
                Quadratic Roots →
              </Link>
            </div>
          </div>

          {/* Physics Card */}
          <div className="console-card-elevated rounded-2xl p-6 border-white/10 hover:border-purple-500/40 transition-all space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-purple-950/80 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  <Atom className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">{t.subjects.physics}</h3>
                  <p className="text-[11px] font-mono text-slate-400">4 Syllabus Units</p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-purple-400 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800">
                {subjectMastery.physics}% Mastery
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-white/5">
              <div
                className="bg-gradient-to-r from-purple-500 to-indigo-400 h-2 rounded-full transition-all duration-500 shadow-sm shadow-purple-500/50"
                style={{ width: `${subjectMastery.physics}%` }}
              />
            </div>

            <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Next Recommended:</span>
              <Link to="/quiz?topic=phys-elec-circuits" className="font-semibold text-purple-400 hover:underline">
                Electricity & Ohm's Law →
              </Link>
            </div>
          </div>

          {/* Chemistry Card */}
          <div className="console-card-elevated rounded-2xl p-6 border-white/10 hover:border-emerald-500/40 transition-all space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <FlaskConical className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">{t.subjects.chemistry}</h3>
                  <p className="text-[11px] font-mono text-slate-400">4 Syllabus Units</p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                {subjectMastery.chemistry}% Mastery
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-white/5">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-2 rounded-full transition-all duration-500 shadow-sm shadow-emerald-500/50"
                style={{ width: `${subjectMastery.chemistry}%` }}
              />
            </div>

            <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Next Recommended:</span>
              <Link to="/quiz?topic=chem-acids-bases" className="font-semibold text-emerald-400 hover:underline">
                Acids & Bases →
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* 5. TWO COLUMN GRID: RECENT SESSIONS & ACHIEVEMENTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recent Quizzes */}
        <div className="console-card-elevated rounded-2xl p-6 border-white/10 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-cyan-400" />
              <span>Recent Diagnostic Quizzes</span>
            </h3>
            <Link to="/quiz" className="text-xs font-semibold text-cyan-400 hover:underline">
              Take Diagnostic →
            </Link>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="p-3.5 console-card rounded-xl flex items-center justify-between border-white/5">
              <div>
                <p className="font-bold text-slate-100">Quadratic Equations Diagnostic</p>
                <p className="text-rose-400 text-[11px] mt-0.5 font-sans">Missed: Negative discriminant sign rule</p>
              </div>
              <div className="text-right">
                <span className="px-2 py-1 rounded bg-rose-950 border border-rose-800 text-rose-300 font-bold">1 / 3</span>
                <p className="text-[10px] text-slate-500 mt-0.5">4h ago</p>
              </div>
            </div>

            <div className="p-3.5 console-card rounded-xl flex items-center justify-between border-white/5">
              <div>
                <p className="font-bold text-slate-100">Electricity & Ohm's Law</p>
                <p className="text-amber-400 text-[11px] mt-0.5 font-sans">Review: Parallel resistor reciprocals</p>
              </div>
              <div className="text-right">
                <span className="px-2 py-1 rounded bg-amber-950 border border-amber-800 text-amber-300 font-bold">2 / 3</span>
                <p className="text-[10px] text-slate-500 mt-0.5">8h ago</p>
              </div>
            </div>

            <div className="p-3.5 console-card rounded-xl flex items-center justify-between border-white/5">
              <div>
                <p className="font-bold text-slate-100">Chemical Reactions & Balancing</p>
                <p className="text-emerald-400 text-[11px] mt-0.5 font-sans">Perfect: Law of Conservation of Mass</p>
              </div>
              <div className="text-right">
                <span className="px-2 py-1 rounded bg-emerald-950 border border-emerald-800 text-emerald-300 font-bold">3 / 3</span>
                <p className="text-[10px] text-slate-500 mt-0.5">Yesterday</p>
              </div>
            </div>
          </div>
        </div>

        {/* Unlocked Badges */}
        <div className="console-card-elevated rounded-2xl p-6 border-white/10 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Award className="h-4 w-4 text-amber-400" />
              <span>Earned Achievements & Streaks</span>
            </h3>
            <span className="text-xs font-mono text-slate-400">2 / 5 Unlocked</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl console-card border-amber-500/30 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-amber-950/80 border border-amber-500/40 text-amber-400 flex items-center justify-center font-bold">
                <Flame className="h-5 w-5 fill-amber-400" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">3-Day Fire</h4>
                <p className="text-[10px] text-slate-400 font-mono">Active study streak</p>
              </div>
            </div>

            <div className="p-3 rounded-xl console-card border-purple-500/30 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-purple-950/80 border border-purple-500/40 text-purple-400 flex items-center justify-center font-bold">
                <Sparkles className="h-5 w-5 text-purple-300" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Curious Step</h4>
                <p className="text-[10px] text-slate-400 font-mono">First Socratic question</p>
              </div>
            </div>

            <div className="p-3 rounded-xl console-card border-white/5 opacity-50 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-slate-900 border border-white/10 text-slate-500 flex items-center justify-center font-bold">
                <Camera className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-300">Vision Pioneer</h4>
                <p className="text-[10px] text-slate-500 font-mono">Use Vision Lab</p>
              </div>
            </div>

            <div className="p-3 rounded-xl console-card border-white/5 opacity-50 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-slate-900 border border-white/10 text-slate-500 flex items-center justify-center font-bold">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-300">Quiz Ace</h4>
                <p className="text-[10px] text-slate-500 font-mono">Score 100%</p>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
