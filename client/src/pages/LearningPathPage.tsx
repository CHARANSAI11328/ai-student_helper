import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Map,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  ArrowRight,
  Calculator,
  Atom,
  FlaskConical,
  Compass,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../context/AppContext.js';
import { getLearningPath } from '../api/client.js';
import { Topic } from '../types/index.js';

export const LearningPathPage: React.FC = () => {
  const { t } = useApp();
  const [subjectFilter, setSubjectFilter] = useState<string>('');
  const [roadmap, setRoadmap] = useState<Topic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);

  useEffect(() => {
    getLearningPath(subjectFilter || undefined).then((data) => {
      setRoadmap(data);
      if (data.length > 0 && !selectedTopic) {
        setSelectedTopic(data[0]);
      }
    }).catch(() => {});
  }, [subjectFilter]);

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'mastered':
        return {
          label: 'Mastered',
          bg: 'bg-emerald-950/80 text-emerald-300 border-emerald-800/80',
          dotBg: 'bg-emerald-400',
          icon: CheckCircle2
        };
      case 'needs_revision':
        return {
          label: 'Needs Revision',
          bg: 'bg-amber-950/80 text-amber-300 border-amber-800/80',
          dotBg: 'bg-amber-400',
          icon: AlertTriangle
        };
      case 'in_progress':
        return {
          label: 'In Progress',
          bg: 'bg-cyan-950/80 text-cyan-300 border-cyan-800/80',
          dotBg: 'bg-cyan-400',
          icon: Clock
        };
      default:
        return {
          label: 'Not Started',
          bg: 'bg-white/5 text-slate-400 border-white/10',
          dotBg: 'bg-slate-500',
          icon: Sparkles
        };
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn text-slate-100">
      
      {/* HEADER */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-800/80 text-[11px] font-mono font-semibold">
          <Map className="h-3.5 w-3.5" />
          <span>Dynamic Pedagogical Trajectory</span>
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-display">
          Adaptive Knowledge Graph &{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400">
            Skill Sequence
          </span>
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
          Your personalized syllabus dependency tree recalculates dynamically as you solve quizzes. Topics adapt intelligently between <strong className="text-emerald-400 font-mono">Mastered</strong>, <strong className="text-cyan-400 font-mono">In Progress</strong>, and <strong className="text-amber-400 font-mono">Needs Revision</strong>.
        </p>
      </div>

      {/* FILTER BUTTONS (OBSIDIAN SEGMENTED STRIP) */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4 text-xs font-semibold">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1 sm:pb-0">
          <button
            onClick={() => setSubjectFilter('')}
            className={`px-3.5 py-2 rounded-xl transition-all font-mono text-xs ${
              subjectFilter === ''
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/25'
                : 'console-card text-slate-300 hover:text-white border-white/10'
            }`}
          >
            All Tracks ({roadmap.length})
          </button>
          <button
            onClick={() => setSubjectFilter('math')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all font-mono text-xs ${
              subjectFilter === 'math'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/25'
                : 'console-card text-slate-300 hover:text-white border-white/10'
            }`}
          >
            <Calculator className="h-3.5 w-3.5" />
            <span>Math</span>
          </button>
          <button
            onClick={() => setSubjectFilter('physics')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all font-mono text-xs ${
              subjectFilter === 'physics'
                ? 'bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-400/25'
                : 'console-card text-slate-300 hover:text-white border-white/10'
            }`}
          >
            <Atom className="h-3.5 w-3.5" />
            <span>Physics</span>
          </button>
          <button
            onClick={() => setSubjectFilter('chemistry')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all font-mono text-xs ${
              subjectFilter === 'chemistry'
                ? 'bg-emerald-400 text-slate-950 font-bold shadow-md shadow-emerald-400/25'
                : 'console-card text-slate-300 hover:text-white border-white/10'
            }`}
          >
            <FlaskConical className="h-3.5 w-3.5" />
            <span>Chemistry</span>
          </button>
        </div>

        <span className="text-slate-400 text-[11px] font-mono hidden sm:block">
          ⚡ Interactive Graph • Select any node to inspect telemetry
        </span>
      </div>

      {/* ROADMAP TREE & DETAIL SIDE PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ROADMAP NODE LIST */}
        <div className="lg:col-span-7 space-y-4 relative">
          {roadmap.map((topic, index) => {
            const statusInfo = getStatusBadge(topic.progress?.status);
            const StatusIcon = statusInfo.icon;
            const isSelected = selectedTopic?.id === topic.id;
            const masteryPct = Math.round((topic.progress?.masteryScore || 0) * 100);

            return (
              <div
                key={topic.id}
                onClick={() => setSelectedTopic(topic)}
                className={`relative p-5 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'console-card-elevated border-cyan-500/50 shadow-xl shadow-cyan-500/10 ring-1 ring-cyan-500/30 scale-[1.01]'
                    : 'console-card border-white/10 hover:border-white/25'
                }`}
              >
                {/* Neon Connecting Fiber Line */}
                {index < roadmap.length - 1 && (
                  <div className="absolute left-9 bottom-[-17px] w-0.5 h-4 bg-gradient-to-b from-cyan-500/40 via-indigo-500/40 to-purple-500/40 z-0" />
                )}

                <div className="flex items-start justify-between gap-4 relative z-10">
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 border ${statusInfo.bg}`}
                    >
                      <StatusIcon className="h-4 w-4" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                          {topic.subjectId.toUpperCase()} • UNIT {topic.orderIndex}
                        </span>
                        <span
                          className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${statusInfo.bg}`}
                        >
                          {statusInfo.label}
                        </span>
                      </div>

                      <h3 className="font-bold text-base text-white font-display mt-1.5 flex items-center gap-1.5">
                        <span>{topic.title}</span>
                        {isSelected && <ChevronRight className="h-4 w-4 text-cyan-400" />}
                      </h3>

                      <p className="text-xs text-slate-400 mt-1 line-clamp-1 leading-relaxed">
                        {topic.description}
                      </p>

                      {/* Explainable Recommendation Note */}
                      {topic.recommendationNote && (
                        <p className="text-xs font-semibold text-cyan-400 mt-2 flex items-center gap-1.5">
                          <Sparkles className="h-3.5 w-3.5 text-cyan-300" />
                          <span>{topic.recommendationNote}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Mastery Percentage Readout */}
                  <div className="text-right shrink-0">
                    <span className={`font-mono font-extrabold text-base ${
                      masteryPct >= 80 ? 'text-emerald-400' : masteryPct >= 50 ? 'text-cyan-400' : 'text-slate-400'
                    }`}>
                      {masteryPct}%
                    </span>
                    <p className="text-[10px] font-mono text-slate-500 uppercase">Mastery</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* SELECTED TOPIC INSPECTOR PANEL */}
        {selectedTopic && (
          <div className="lg:col-span-5 console-card-elevated border-white/10 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 sticky top-20">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 block mb-1">
                Diagnostic Node Inspection
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white font-display">
                {selectedTopic.title}
              </h2>
            </div>

            {/* Status Breakdown Telemetry */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 space-y-2.5 text-xs font-mono shadow-inner">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Current Node State:</span>
                <span className="font-bold text-white uppercase text-[11px] px-2 py-0.5 rounded bg-white/5 border border-white/10">
                  {selectedTopic.progress?.status || 'Not Started'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Mastery Calibration:</span>
                <span className="font-bold text-cyan-400 text-sm">
                  {Math.round((selectedTopic.progress?.masteryScore || 0) * 100)}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Assessment Questions:</span>
                <span className="font-bold text-slate-200">
                  {selectedTopic.progress?.attemptsCount || 0} attempted
                </span>
              </div>
            </div>

            {/* Explainable Why This Is Recommended */}
            <div className="space-y-1.5 text-xs">
              <h4 className="font-bold text-white font-display text-xs flex items-center gap-1.5">
                <Compass className="h-3.5 w-3.5 text-cyan-400" />
                <span>Pedagogical Recommendation Rationale:</span>
              </h4>
              <p className="text-slate-300 leading-relaxed bg-white/5 p-3.5 rounded-xl border border-white/10">
                {selectedTopic.progress?.status === 'needs_revision'
                  ? `Recent diagnostic errors in "${selectedTopic.progress.lastMistakeConcept || 'core principles'}" flagged this topic for immediate review.`
                  : selectedTopic.progress?.status === 'mastered'
                  ? 'Demonstrated high conceptual fluency (85%+ accuracy). Ready for advanced challenge questions.'
                  : 'Core prerequisite chapter required for Board Exam STEM mastery.'}
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-2.5 pt-2">
              <Link
                to={`/quiz?topic=${selectedTopic.id}`}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-500/25 active:scale-95"
              >
                <span>Launch Diagnostic Quiz</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>

              <Link
                to={`/tutor?q=${encodeURIComponent(`Teach me ${selectedTopic.title} step by step`)}`}
                className="w-full py-3 px-4 rounded-xl console-card border border-white/15 hover:border-cyan-500/40 text-cyan-300 font-semibold text-xs flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                <span>Explore with Socratic Tutor</span>
              </Link>
            </div>

          </div>
        )}

      </div>

    </div>
  );
};
