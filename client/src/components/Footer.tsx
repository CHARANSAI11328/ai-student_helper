import React from 'react';
import { Heart, ShieldCheck, Sparkles, Wifi } from 'lucide-react';
import { useApp } from '../context/AppContext.js';

export const Footer: React.FC = () => {
  const { t } = useApp();

  return (
    <footer className="border-t border-slate-200 bg-white py-8 text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 mt-auto transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-md bg-gradient-to-br from-brand-500 to-indigo-600 flex items-center justify-center text-white">
                <Sparkles className="h-3.5 w-3.5" />
              </div>
              <span className="font-bold text-slate-900 dark:text-white text-sm">
                Learnova AI
              </span>
            </div>
            <p className="max-w-md text-slate-600 dark:text-slate-400 leading-relaxed">
              An intelligent Socratic learning companion designed specifically for school students (Grades 6–12) in Mathematics, Physics, and Chemistry. Built to guide conceptual understanding without encouraging passive copying.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md">
                <ShieldCheck className="h-3 w-3" /> Child-Safe AI Tutor
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded-md">
                <Wifi className="h-3 w-3" /> Low-Bandwidth & Offline Ready
              </span>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-2 text-xs uppercase tracking-wider">
              STEM Subjects
            </h4>
            <ul className="space-y-1.5">
              <li><span className="hover:text-brand-500 cursor-pointer">{t.subjects.math} (Algebra, Geometry, AP)</span></li>
              <li><span className="hover:text-brand-500 cursor-pointer">{t.subjects.physics} (Mechanics, Circuits, Optics)</span></li>
              <li><span className="hover:text-brand-500 cursor-pointer">{t.subjects.chemistry} (Reactions, Acids, Bonding)</span></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-2 text-xs uppercase tracking-wider">
              Multilingual & Voice
            </h4>
            <ul className="space-y-1.5">
              <li><span>English (Curriculum standard)</span></li>
              <li><span>తెలుగు (Telugu explanations)</span></li>
              <li><span>हिन्दी (Hindi explanations)</span></li>
              <li><span>Voice Dictation & Read-Aloud</span></li>
            </ul>
          </div>

        </div>

        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px]">
            © {new Date().getFullYear()} Learnova AI. Designed for National & State Board STEM Curriculums.
          </p>
          <p className="flex items-center gap-1 text-[11px]">
            Crafted with <Heart className="h-3 w-3 text-rose-500 fill-rose-500" /> for equitable school education.
          </p>
        </div>
      </div>
    </footer>
  );
};
