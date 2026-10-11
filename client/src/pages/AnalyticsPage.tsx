import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  FlaskConical,
  Sparkles,
  ArrowRight,
  Activity
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
  const recentAttempts = stats?.recentAttempts || [
    {
      id: 'att-1',
      subject: 'math',
      topicTitle: 'Quadratic Equations & Roots',
      score: 3,
      totalQuestions: 3,
      timeSpentSeconds: 95,
      timestamp: new Date().toISOString()
    },
    {
      id: 'att-2',
      subject: 'physics',
      topicTitle: "Ohm's Law & Resistance",
      score: 2,
      totalQuestions: 3,
      timeSpentSeconds: 110,
      timestamp: new Date(Date.now() - 86400000).toISOString()
    }
  ];
  const weakTopics = stats?.weakTopics || [
    {
      id: 'math-alg-quad',
      title: 'Quadratic Equations & Roots',
      subjectId: 'math',
      masteryScore: 0.58,
      lastMistakeConcept: 'Discriminant signs when b is negative'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn text-slate-100">
      
      {/* HEADER */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-800/80 text-[11px] font-mono font-semibold">
          <Activity className="h-3.5 w-3.5 text-cyan-400" />
          <span>Real-Time Telemetry Analytics</span>
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-display">
          Learning Mastery &{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400">
            Cognitive Diagnostics
          </span>
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
          Continuous tracking of student conceptual accuracy, diagnostic quiz performance, curriculum subject distributions, and targeted misconceptions flagged for Socratic remediation.
        </p>
      </div>

      {/* 4 HIGH LEVEL KPI METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <div className="console-card-elevated rounded-2xl p-5 border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider">Overall Accuracy</span>
            <TrendingUp className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="text-3xl font-extrabold text-white font-mono">
            {stats?.averageQuizAccuracy || 82}%
          </p>
          <p className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
            <span>↑ +4% this week</span>
            <span className="text-slate-500">• All Quizzes</span>
          </p>
        </div>

        <div className="console-card-elevated rounded-2xl p-5 border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider">Active Study Streak</span>
            <Flame className="h-4 w-4 text-amber-400 fill-amber-400" />
          </div>
          <p className="text-3xl font-extrabold text-amber-400 font-mono">
            {stats?.streakCount || profile?.streakCount || 4} Days
          </p>
          <p className="text-[11px] font-mono text-slate-400">Consistent daily STEM practice</p>
        </div>

        <div className="console-card-elevated rounded-2xl p-5 border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider">Concepts Mastered</span>
            <CheckCircle2 className="h-4 w-4 text-cyan-400" />
          </div>
          <p className="text-3xl font-extrabold text-cyan-400 font-mono">
            {stats?.quizzesTaken || 3} Units
          </p>
          <p className="text-[11px] font-mono text-slate-400">Diagnostic threshold (85%+)</p>
        </div>

        <div className="console-card-elevated rounded-2xl p-5 border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider">Revision Targets</span>
            <AlertTriangle className="h-4 w-4 text-amber-400" />
          </div>
          <p className="text-3xl font-extrabold text-amber-400 font-mono">
            {weakTopics.length} Chapters
          </p>
          <p className="text-[11px] font-mono text-slate-400">Flagged for Socratic review</p>
        </div>

      </div>

      {/* SUBJECT MASTERY BREAKDOWN GAUGES */}
      <div className="console-card-elevated rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
          <div>
            <h2 className="text-lg font-bold text-white font-display">
              Subject Mastery Calibration Distribution (Class 9 & 10)
            </h2>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Cumulative score calibrated from problem sets, simulators, and vision slates
            </p>
          </div>
          <span className="text-xs font-mono text-cyan-400 bg-cyan-950/80 px-3 py-1 rounded-full border border-cyan-800/80 self-start sm:self-auto">
            Target: 90%+ All Subjects
          </span>
        </div>

        <div className="space-y-5">
          
          {/* Math */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="flex items-center gap-2 font-bold text-cyan-400">
                <Calculator className="h-4 w-4" />
                <span>Mathematics (Algebra, Quadratic Equations, Trigonometry)</span>
              </span>
              <span className="font-extrabold text-cyan-300 text-sm">{subjectMastery.math}%</span>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden border border-white/10">
              <div
                className="bg-gradient-to-r from-cyan-500 to-blue-600 h-3 rounded-full transition-all duration-500 shadow-sm shadow-cyan-500/50"
                style={{ width: `${subjectMastery.math}%` }}
              />
            </div>
          </div>

          {/* Physics */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="flex items-center gap-2 font-bold text-amber-400">
                <Atom className="h-4 w-4" />
                <span>Physics (Kinematics, Projectile Motion, Ohm's Law)</span>
              </span>
              <span className="font-extrabold text-amber-300 text-sm">{subjectMastery.physics}%</span>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden border border-white/10">
              <div
                className="bg-gradient-to-r from-amber-400 to-orange-500 h-3 rounded-full transition-all duration-500 shadow-sm shadow-amber-400/50"
                style={{ width: `${subjectMastery.physics}%` }}
              />
            </div>
          </div>

          {/* Chemistry */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="flex items-center gap-2 font-bold text-emerald-400">
                <FlaskConical className="h-4 w-4" />
                <span>Chemistry (Stoichiometry, Chemical Reactions, Periodic Table)</span>
              </span>
              <span className="font-extrabold text-emerald-300 text-sm">{subjectMastery.chemistry}%</span>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden border border-white/10">
              <div
                className="bg-gradient-to-r from-emerald-400 to-teal-500 h-3 rounded-full transition-all duration-500 shadow-sm shadow-emerald-400/50"
                style={{ width: `${subjectMastery.chemistry}%` }}
              />
            </div>
          </div>

        </div>
      </div>

      {/* TWO COLUMN GRID: TOPICS NEEDING ATTENTION & QUIZ LOG */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Identified Weak Topics */}
        <div className="console-card-elevated rounded-3xl p-6 border border-white/10 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-white font-display flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-400" />
              <span>Targeted Focus Concepts (Needs Revision)</span>
            </h3>
            <span className="text-[10px] font-mono text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-800/80">
              Auto-Detected
            </span>
          </div>

          <div className="space-y-3">
            {weakTopics.length > 0 ? (
              weakTopics.map((wTopic: any, idx: number) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl console-card border border-amber-500/30 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white font-display text-sm">{wTopic.title}</span>
                    <span className="font-mono font-bold text-amber-400">
                      {Math.round(wTopic.masteryScore * 100)}% Mastery
                    </span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    Identified pitfall: <em className="text-amber-200">"{wTopic.lastMistakeConcept || 'Sign inversion when resolving quadratic formula'}"</em>
                  </p>
                  <div className="pt-1">
                    <Link
                      to={`/tutor?q=${encodeURIComponent(`I struggle with ${wTopic.lastMistakeConcept || wTopic.title}. Please guide me through step-by-step Socratic practice.`)}`}
                      className="inline-flex items-center gap-1.5 font-bold text-cyan-400 hover:text-cyan-300 text-xs"
                    >
                      <span>Remediate with AI Tutor</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 font-mono">No weak concepts flagged! All chapters performing above mastery threshold.</p>
            )}
          </div>
        </div>

        {/* Diagnostic Assessment History */}
        <div className="console-card-elevated rounded-3xl p-6 border border-white/10 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-white font-display flex items-center gap-2">
              <Clock className="h-4 w-4 text-cyan-400" />
              <span>Recent Assessment Logs</span>
            </h3>
            <span className="text-[10px] font-mono text-slate-400">Telemetry Feed</span>
          </div>

          <div className="space-y-3">
            {recentAttempts.map((attempt: any, idx: number) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl console-card border border-white/10 flex items-center justify-between text-xs"
              >
                <div>
                  <p className="font-bold text-white font-display">{attempt.topicTitle || 'Quadratic Roots Calibration'}</p>
                  <p className="text-[11px] font-mono text-slate-400 mt-0.5">
                    {new Date(attempt.timestamp).toLocaleDateString()} • {attempt.timeSpentSeconds || 85}s elapsed
                  </p>
                </div>

                <div className="text-right">
                  <span
                    className={`font-mono font-bold px-2.5 py-1 rounded-md text-xs ${
                      attempt.score === attempt.totalQuestions
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : attempt.score > 0
                        ? 'bg-amber-950 text-amber-300 border border-amber-800'
                        : 'bg-rose-950 text-rose-300 border border-rose-800'
                    }`}
                  >
                    {attempt.score} / {attempt.totalQuestions}
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
