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
  Layers
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* HEADER */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 text-xs font-semibold">
          <BookOpen className="h-3.5 w-3.5" />
          <span>Curriculum Knowledge Bank</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {t.nav.learningHub}
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
          Explore structured chapters, interactive formula sheets, and worked examples across Class 9 & 10 Mathematics, Physics, and Chemistry.
        </p>
      </div>

      {/* SUBJECT SWITCHER TABS */}
      <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
        <button
          onClick={() => setActiveSubject('math')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs transition-all ${
            activeSubject === 'math'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
          }`}
        >
          <Calculator className="h-4 w-4" />
          <span>{t.subjects.math}</span>
        </button>

        <button
          onClick={() => setActiveSubject('physics')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs transition-all ${
            activeSubject === 'physics'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
          }`}
        >
          <Atom className="h-4 w-4" />
          <span>{t.subjects.physics}</span>
        </button>

        <button
          onClick={() => setActiveSubject('chemistry')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs transition-all ${
            activeSubject === 'chemistry'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
          }`}
        >
          <FlaskConical className="h-4 w-4" />
          <span>{t.subjects.chemistry}</span>
        </button>
      </div>

      {/* INTERACTIVE STEM LABS SIMULATORS */}
      <div id="simulators">
        <STEMSimulators />
      </div>

      {/* TWO-COLUMN LAYOUT: TOPICS LIST & DETAILED TOPIC VIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* TOPICS SIDEBAR */}
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block px-1">
            Chapter Syllabus (Grade 9 & 10)
          </span>

          <div className="space-y-2">
            {topics.map((tItem) => {
              const isSelected = selectedTopic?.id === tItem.id;
              const status = tItem.progress?.status || 'not_started';

              return (
                <div
                  key={tItem.id}
                  onClick={() => setSelectedTopic(tItem)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-white dark:bg-slate-800 border-brand-500 shadow-md ring-1 ring-brand-500'
                      : 'bg-white/70 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-semibold text-slate-500">
                      Unit {tItem.orderIndex} • Class {tItem.grade}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        status === 'mastered'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : status === 'needs_revision'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : status === 'in_progress'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      }`}
                    >
                      {status === 'mastered' ? 'Mastered' : status === 'needs_revision' ? 'Needs Revision' : status === 'in_progress' ? 'In Progress' : 'Not Started'}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 dark:text-white mt-1.5">
                    {tItem.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                    {tItem.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* TOPIC DETAIL & FORMULA SHEET */}
        {selectedTopic && (
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
              <div>
                <span className="text-xs font-semibold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
                  Class {selectedTopic.grade} STEM Curriculum
                </span>
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                  {selectedTopic.title}
                </h2>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <Link
                  to={`/quiz?topic=${selectedTopic.id}`}
                  className="px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Start Practice Quiz</span>
                </Link>

                <Link
                  to={`/tutor?q=${encodeURIComponent(`Explain key concepts and derivations for ${selectedTopic.title} step by step`)}`}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-xs transition-colors flex items-center gap-1.5"
                >
                  <Sparkles className="h-4 w-4 text-brand-500" />
                  <span>Ask AI Tutor</span>
                </Link>
              </div>
            </div>

            {/* Overview & Prerequisites */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Chapter Overview & Prerequisites
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {selectedTopic.description}
              </p>
              {selectedTopic.prerequisites.length > 0 && (
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="font-semibold">Prerequisites:</span>
                  {selectedTopic.prerequisites.map((p, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {p}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* FORMULA QUICK-REFERENCE SHEET (WITH KATEX) */}
            {selectedTopic.keyFormulas && selectedTopic.keyFormulas.length > 0 && (
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Layers className="h-4 w-4 text-brand-500" />
                  <span>Key Formulas & Governing Laws</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedTopic.keyFormulas.map((formula, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2"
                    >
                      <span className="text-xs font-bold text-brand-700 dark:text-brand-300">
                        {formula.name}
                      </span>
                      <MathRenderer content={`$$${formula.latex}$$`} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Worked Example */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Worked Socratic Example
              </h3>
              <div className="p-4 rounded-2xl bg-brand-50/40 dark:bg-slate-800/40 border border-brand-100 dark:border-slate-700 text-xs space-y-2">
                <p className="font-semibold text-slate-800 dark:text-slate-200">
                  Sample Problem:
                </p>
                <p className="text-slate-600 dark:text-slate-400">
                  How does this topic apply to real exam questions? Ask Learnova to generate dynamic variations adapted to your current mastery level.
                </p>
                <Link
                  to={`/tutor?q=${encodeURIComponent(`Show me a worked example problem on ${selectedTopic.title} with complete steps.`)}`}
                  className="inline-flex items-center gap-1 font-semibold text-brand-600 dark:text-brand-400 hover:underline pt-1"
                >
                  <span>Solve worked example with AI Tutor</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
};
