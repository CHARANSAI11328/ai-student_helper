import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calculator,
  Atom,
  FlaskConical,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Layers,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../context/AppContext.js';
import { getTopics } from '../api/client.js';
import { Topic } from '../types/index.js';
import { MathRenderer } from '../components/MathRenderer.js';
import { STEMSimulators } from '../components/STEMSimulators.js';

export const LearningHubPage: React.FC = () => {
  const { t } = useApp();
  const [activeSubject, setActiveSubject] = useState<'math' | 'physics' | 'chemistry'>('math');
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);

  useEffect(() => {
    getTopics(activeSubject).then((data) => {
      setTopics(data);
      if (data.length > 0) {
        setSelectedTopic(data[0]);
      }
    }).catch(() => {});
  }, [activeSubject]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn text-slate-100">
      
      {/* HEADER WITH EDITORIAL BADGE */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-800/80 text-[11px] font-mono font-semibold">
          <BookOpen className="h-3.5 w-3.5" />
          <span>Curriculum Knowledge Vault</span>
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-display">
          STEM Subject Chapters &{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400">
            Interactive Formulae
          </span>
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
          Structured syllabus chapters, interactive formula sheets, governing scientific laws, and worked Socratic derivations across Class 9 & 10 Mathematics, Physics, and Chemistry.
        </p>
      </div>

      {/* SUBJECT SWITCHER TABS (OBSIDIAN SEGMENTED CAPSULES) */}
      <div className="flex items-center gap-2.5 pb-2 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveSubject('math')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs transition-all shrink-0 ${
            activeSubject === 'math'
              ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/25 font-display'
              : 'console-card text-slate-300 hover:text-white border-white/10 hover:border-white/20'
          }`}
        >
          <Calculator className="h-4 w-4" />
          <span>{t.subjects.math} (Algebra & Geometry)</span>
        </button>

        <button
          onClick={() => setActiveSubject('physics')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs transition-all shrink-0 ${
            activeSubject === 'physics'
              ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/25 font-display'
              : 'console-card text-slate-300 hover:text-white border-white/10 hover:border-white/20'
          }`}
        >
          <Atom className="h-4 w-4" />
          <span>{t.subjects.physics} (Mechanics & Circuits)</span>
        </button>

        <button
          onClick={() => setActiveSubject('chemistry')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs transition-all shrink-0 ${
            activeSubject === 'chemistry'
              ? 'bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-400/25 font-display'
              : 'console-card text-slate-300 hover:text-white border-white/10 hover:border-white/20'
          }`}
        >
          <FlaskConical className="h-4 w-4" />
          <span>{t.subjects.chemistry} (Stoichiometry & Bonding)</span>
        </button>
      </div>

      {/* INTERACTIVE STEM LABS SIMULATORS */}
      <div id="simulators" className="pt-2">
        <STEMSimulators />
      </div>

      {/* TWO-COLUMN LAYOUT: TOPICS LIST & DETAILED TOPIC VIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-2">
        
        {/* TOPICS SIDEBAR */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
              Syllabus Units (Class 9 & 10)
            </span>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded-full border border-cyan-800/80">
              {topics.length} Chapters
            </span>
          </div>

          <div className="space-y-2.5">
            {topics.map((tItem) => {
              const isSelected = selectedTopic?.id === tItem.id;
              const status = tItem.progress?.status || 'not_started';

              return (
                <div
                  key={tItem.id}
                  onClick={() => setSelectedTopic(tItem)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'console-card-elevated border-cyan-500/50 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-500/30'
                      : 'console-card border-white/10 hover:border-white/25'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono text-slate-400">
                      Unit {tItem.orderIndex} • Class {tItem.grade}
                    </span>
                    <span
                      className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        status === 'mastered'
                          ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/80'
                          : status === 'needs_revision'
                          ? 'bg-amber-950/80 text-amber-300 border border-amber-800/80'
                          : status === 'in_progress'
                          ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-800/80'
                          : 'bg-white/5 text-slate-400 border border-white/10'
                      }`}
                    >
                      {status === 'mastered' ? 'Mastered' : status === 'needs_revision' ? 'Needs Revision' : status === 'in_progress' ? 'In Progress' : 'Not Started'}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-white font-display mt-2 flex items-center justify-between">
                    <span>{tItem.title}</span>
                    {isSelected && <ChevronRight className="h-4 w-4 text-cyan-400 shrink-0" />}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                    {tItem.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* TOPIC DETAIL & FORMULA SHEET */}
        {selectedTopic && (
          <div className="lg:col-span-8 console-card-elevated border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
              <div>
                <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider block mb-1">
                  Class {selectedTopic.grade} STEM Curriculum Spec
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
                  {selectedTopic.title}
                </h2>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  to={`/quiz?topic=${selectedTopic.id}`}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs transition-all flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 active:scale-95"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Start Practice Quiz</span>
                </Link>

                <Link
                  to={`/tutor?q=${encodeURIComponent(`Explain key concepts and derivations for ${selectedTopic.title} step by step`)}`}
                  className="px-4 py-2.5 rounded-xl console-card border border-white/15 hover:border-cyan-500/40 text-cyan-300 font-semibold text-xs transition-all flex items-center gap-1.5 active:scale-95"
                >
                  <Sparkles className="h-4 w-4 text-cyan-400" />
                  <span>Ask AI Tutor</span>
                </Link>
              </div>
            </div>

            {/* Overview & Prerequisites */}
            <div className="space-y-3">
              <h3 className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                Chapter Overview & Core Fundamentals
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                {selectedTopic.description}
              </p>
              {selectedTopic.prerequisites && selectedTopic.prerequisites.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 pt-1">
                  <span className="font-mono text-[10px] uppercase text-slate-500">Prerequisites:</span>
                  {selectedTopic.prerequisites.map((p, idx) => (
                    <span key={idx} className="px-2.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-300 font-mono text-[11px]">
                      {p}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* FORMULA QUICK-REFERENCE SHEET (WITH KATEX) */}
            {selectedTopic.keyFormulas && selectedTopic.keyFormulas.length > 0 && (
              <div className="space-y-3 pt-2">
                <h3 className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5 text-cyan-400" />
                  <span>Key Formulas & Governing Mathematical Laws</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {selectedTopic.keyFormulas.map((formula, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 space-y-2 hover:border-cyan-500/30 transition-colors shadow-inner"
                    >
                      <span className="text-xs font-mono font-bold text-cyan-300 block">
                        {formula.name}
                      </span>
                      <div className="py-2 overflow-x-auto scrollbar-none text-center">
                        <MathRenderer math={formula.latex} displayMode />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Worked Socratic Example */}
            <div className="space-y-3 pt-2">
              <h3 className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                Worked Socratic Problem Deep-Dive
              </h3>
              <div className="p-5 rounded-2xl console-card border border-indigo-500/30 text-xs space-y-2.5 relative overflow-hidden">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-indigo-400 animate-ping"></span>
                  <p className="font-bold text-white font-display text-sm">
                    Exemplar Application Problem:
                  </p>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  How does this theorem apply to real exam problems? Have Learnova deconstruct this topic using the 9-part pedagogical schema, including intuitive analogies and common calculation pitfalls.
                </p>
                <div className="pt-2">
                  <Link
                    to={`/tutor?q=${encodeURIComponent(`Show me a worked example problem on ${selectedTopic.title} with complete steps.`)}`}
                    className="inline-flex items-center gap-1.5 font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    <span>Derive step-by-step with Socratic Tutor</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
};
