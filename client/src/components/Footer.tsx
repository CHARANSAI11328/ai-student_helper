import React from 'react';
import { Heart, ShieldCheck, Sparkles, Wifi } from 'lucide-react';
import { useApp } from '../context/AppContext.js';

export const Footer: React.FC = () => {
  const { t } = useApp();

  return (
    <footer className="border-t border-white/10 bg-slate-950 py-12 text-xs text-slate-400 mt-auto transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="h-7 w-7 rounded-lg bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20 border border-white/15">
                <Sparkles className="h-3.5 w-3.5 text-cyan-200" />
              </div>
              <span className="font-extrabold text-white text-base font-display">
                Learnova<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400">AI</span>
              </span>
            </div>
            <p className="max-w-md text-slate-300 leading-relaxed font-normal">
              An intelligent Socratic learning companion designed specifically for school students (Grades 6–12) in Mathematics, Physics, and Chemistry. Built to guide conceptual understanding without encouraging passive copying.
            </p>
            <div className="flex items-center gap-3 pt-1 font-mono">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-300 bg-emerald-950/80 border border-emerald-800 px-2.5 py-0.5 rounded-full">
                <ShieldCheck className="h-3 w-3 text-emerald-400" /> Child-Safe AI Tutor
              </span>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-cyan-300 bg-cyan-950/80 border border-cyan-800 px-2.5 py-0.5 rounded-full">
                <Wifi className="h-3 w-3 text-cyan-400" /> Low-Bandwidth & Offline Ready
              </span>
            </div>
          </div>

          <div>
            <h4 className="font-mono font-bold text-white mb-3 text-xs uppercase tracking-wider text-cyan-400">
              STEM Subjects
            </h4>
            <ul className="space-y-1.5 text-slate-300">
              <li><span className="hover:text-cyan-400 cursor-pointer transition-colors">{t.subjects.math} (Algebra, Geometry, AP)</span></li>
              <li><span className="hover:text-cyan-400 cursor-pointer transition-colors">{t.subjects.physics} (Mechanics, Circuits, Optics)</span></li>
              <li><span className="hover:text-cyan-400 cursor-pointer transition-colors">{t.subjects.chemistry} (Reactions, Acids, Bonding)</span></li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono font-bold text-white mb-3 text-xs uppercase tracking-wider text-purple-400">
              Multilingual & Voice
            </h4>
            <ul className="space-y-1.5 text-slate-300">
              <li><span>English (Curriculum standard)</span></li>
              <li><span>తెలుగు (Telugu explanations)</span></li>
              <li><span>हिन्दी (Hindi explanations)</span></li>
              <li><span>Voice Dictation & Read-Aloud</span></li>
            </ul>
          </div>

        </div>

        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px] text-slate-400">
          <p>
            © {new Date().getFullYear()} Learnova AI. Designed for National & State Board STEM Curriculums.
          </p>
          <p className="flex items-center gap-1.5">
            Crafted with <Heart className="h-3 w-3 text-rose-500 fill-rose-500" /> for equitable school education.
          </p>
        </div>
      </div>
    </footer>
  );
};
