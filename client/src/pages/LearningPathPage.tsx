import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Map,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  ArrowRight,
  Filter,
  Calculator,
  Atom,
  FlaskConical
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
          bg: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200',
          icon: CheckCircle2
        };
      case 'needs_revision':
        return {
          label: 'Needs Revision',
          bg: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-200',
          icon: AlertTriangle
        };
      case 'in_progress':
        return {
          label: 'In Progress',
          bg: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-200',
          icon: Clock
        };
      default:
        return {
          label: 'Not Started',
          bg: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200',
          icon: Sparkles
        };
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* HEADER */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 text-xs font-semibold">
          <Map className="h-3.5 w-3.5" />
          <span>Dynamic Pedagogical Roadmap</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {t.nav.learningPath}
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
          Your adaptive learning sequence automatically recalculates when you complete quizzes. Topics adapt between <em>Mastered</em>, <em>In Progress</em>, and <em>Needs Revision</em>.
        </p>
      </div>

      {/* FILTER BUTTONS */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4 text-xs font-semibold">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSubjectFilter('')}
            className={`px-3.5 py-2 rounded-xl transition-all ${
              subjectFilter === ''
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            All Subjects ({roadmap.length})
          </button>
          <button
            onClick={() => setSubjectFilter('math')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all ${
              subjectFilter === 'math'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            <Calculator className="h-3.5 w-3.5" />
            <span>Mathematics</span>
          </button>
          <button
            onClick={() => setSubjectFilter('physics')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all ${
              subjectFilter === 'physics'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            <Atom className="h-3.5 w-3.5" />
            <span>Physics</span>
          </button>
          <button
            onClick={() => setSubjectFilter('chemistry')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all ${
              subjectFilter === 'chemistry'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            <FlaskConical className="h-3.5 w-3.5" />
            <span>Chemistry</span>
          </button>
        </div>

        <span className="text-slate-500 text-xs">
          Interactive Node Tree • Click any topic node
        </span>
      </div>

      {/* ROADMAP TREE & DETAIL SIDE PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* ROADMAP NODE LIST */}
        <div className="lg:col-span-2 space-y-4">
          {roadmap.map((topic, index) => {
            const statusInfo = getStatusBadge(topic.progress?.status);
            const StatusIcon = statusInfo.icon;
            const isSelected = selectedTopic?.id === topic.id;

            return (
              <div
                key={topic.id}
                onClick={() => setSelectedTopic(topic)}
                className={`relative p-5 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white dark:bg-slate-800 border-brand-500 shadow-md ring-2 ring-brand-500/20'
                    : 'bg-white/80 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                {/* Node Connection Line */}
                {index < roadmap.length - 1 && (
                  <div className="absolute left-9 bottom-[-17px] w-0.5 h-4 bg-slate-300 dark:bg-slate-700 z-0" />
                )}

                <div className="flex items-start justify-between gap-4 relative z-10">
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 border ${statusInfo.bg}`}
                    >
                      <StatusIcon className="h-4 w-4" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          {topic.subjectId.toUpperCase()} • UNIT {topic.orderIndex}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusInfo.bg}`}
                        >
                          {statusInfo.label}
                        </span>
                      </div>

                      <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white mt-1">
                        {topic.title}
                      </h3>

                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                        {topic.description}
                      </p>

                      {/* Explainable Recommendation Note */}
                      {topic.recommendationNote && (
                        <p className="text-xs font-semibold text-brand-600 dark:text-brand-400 mt-2 flex items-center gap-1">
                          <Sparkles className="h-3.5 w-3.5" />
                          <span>{topic.recommendationNote}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Mastery Percentage Ring / Stat */}
                  <div className="text-right shrink-0">
                    <span className="font-extrabold text-sm text-slate-800 dark:text-slate-200">
                      {Math.round((topic.progress?.masteryScore || 0) * 100)}%
                    </span>
                    <p className="text-[10px] text-slate-400">Mastery</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* SELECTED TOPIC INSPECTOR PANEL */}
        {selectedTopic && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5 sticky top-20">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Topic Diagnostic Insight
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                {selectedTopic.title}
              </h2>
            </div>

            {/* Status Breakdown */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Current Status:</span>
                <span className="font-bold text-slate-900 dark:text-white uppercase">
                  {selectedTopic.progress?.status || 'Not Started'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Mastery Score:</span>
                <span className="font-bold text-brand-600 dark:text-brand-400">
                  {Math.round((selectedTopic.progress?.masteryScore || 0) * 100)}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Questions Attempted:</span>
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  {selectedTopic.progress?.attemptsCount || 0}
                </span>
              </div>
            </div>

            {/* Explainable Why This Is Recommended */}
            <div className="space-y-1 text-xs">
              <h4 className="font-bold text-slate-800 dark:text-slate-200">
                Why This Is In Your Path:
              </h4>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {selectedTopic.progress?.status === 'needs_revision'
                  ? `Recent quiz mistakes in "${selectedTopic.progress.lastMistakeConcept || 'core rules'}" flagged this topic for focused practice.`
                  : selectedTopic.progress?.status === 'mastered'
                  ? 'You have demonstrated solid mastery. Feel free to review or tackle advanced exercises.'
                  : 'Core syllabus topic required for Board Exam curriculum.'}
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-2">
              <Link
                to={`/quiz?topic=${selectedTopic.id}`}
                className="w-full py-2.5 px-4 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <span>Take Diagnostic Quiz</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>

              <Link
                to={`/tutor?q=${encodeURIComponent(`Teach me ${selectedTopic.title} step by step`)}`}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <Sparkles className="h-3.5 w-3.5 text-brand-500" />
                <span>Ask Socratic Tutor</span>
              </Link>
            </div>

          </div>
        )}

      </div>

    </div>
  );
};
