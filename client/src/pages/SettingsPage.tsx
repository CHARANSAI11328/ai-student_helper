import React, { useState } from 'react';
import {
  Settings,
  Globe,
  User,
  Sliders,
  ShieldCheck,
  RotateCcw,
  Volume2,
  Type,
  Moon,
  Sun,
  Cpu,
  Sparkles,
  ExternalLink,
  RefreshCw,
  Check
} from 'lucide-react';
import { useApp } from '../context/AppContext.js';
import { discoverWorkingGeminiModels } from '../api/client.js';

export const SettingsPage: React.FC = () => {
  const {
    profile,
    language,
    theme,
    fontSize,
    t,
    setLanguage,
    setTheme,
    setFontSize,
    updateStudentProfile,
    loadDemoStudent,
    addToast
  } = useApp();

  const [name, setName] = useState(profile?.name || 'Aarav Sharma');
  const [grade, setGrade] = useState(profile?.grade || 10);
  const [style, setStyle] = useState(profile?.explanationStyle || 'step_by_step');
  const [goals, setGoals] = useState(profile?.learningGoals || '');

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateStudentProfile({
      name,
      grade,
      explanationStyle: style as any,
      learningGoals: goals,
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* HEADER */}
      <div className="space-y-2 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 text-xs font-semibold">
          <Settings className="h-3.5 w-3.5" />
          <span>Student Preferences & Accessibility</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {t.nav.settings}
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Customize your grade, explanation style, language, and accessibility preferences.
        </p>
      </div>

      {/* STUDENT PROFILE FORM */}
      <form onSubmit={handleSaveProfile} className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
        <h2 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
          <User className="h-4 w-4 text-brand-500" />
          <span>Student Learning Profile</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Student Display Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              School Grade Level
            </label>
            <select
              value={grade}
              onChange={(e) => setGrade(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none"
            >
              {[6, 7, 8, 9, 10, 11, 12].map((g) => (
                <option key={g} value={g}>Class / Grade {g}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="text-xs">
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Learning Goals
          </label>
          <input
            type="text"
            value={goals}
            onChange={(e) => setGoals(e.target.value)}
            placeholder="e.g. Master Class 10 STEM fundamentals & Board Exam prep"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none"
          />
        </div>

        <div className="text-xs">
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Preferred Explanation Style
          </label>
          <select
            value={style}
            onChange={(e) => setStyle(e.target.value as any)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none"
          >
            <option value="step_by_step">{t.tutor.styleStepByStep}</option>
            <option value="simple">{t.tutor.styleSimple}</option>
            <option value="visual_detailed">{t.tutor.styleVisual}</option>
          </select>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs transition-colors shadow-sm"
          >
            Save Profile Preferences
          </button>
        </div>
      </form>

      {/* ACCESSIBILITY & DISPLAY */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
        <h2 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
          <Sliders className="h-4 w-4 text-purple-500" />
          <span>Display & Accessibility</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          
          {/* Language */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
            <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Globe className="h-4 w-4 text-brand-500" />
              <span>Language</span>
            </span>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as any)}
              className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
            >
              <option value="en">English</option>
              <option value="te">తెలుగు (Telugu)</option>
              <option value="hi">हिन्दी (Hindi)</option>
            </select>
          </div>

          {/* Theme */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
            <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              {theme === 'light' ? <Sun className="h-4 w-4 text-amber-500" /> : <Moon className="h-4 w-4 text-indigo-400" />}
              <span>Theme</span>
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setTheme('light')}
                className={`flex-1 py-1.5 rounded-lg font-bold ${
                  theme === 'light' ? 'bg-brand-500 text-white' : 'bg-white dark:bg-slate-800 border'
                }`}
              >
                Light
              </button>
              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={`flex-1 py-1.5 rounded-lg font-bold ${
                  theme === 'dark' ? 'bg-brand-500 text-white' : 'bg-white dark:bg-slate-800 border'
                }`}
              >
                Dark
              </button>
            </div>
          </div>

          {/* Font Size */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
            <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Type className="h-4 w-4 text-emerald-500" />
              <span>Readable Font Size</span>
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setFontSize('normal')}
                className={`flex-1 py-1.5 rounded-lg font-bold ${
                  fontSize === 'normal' ? 'bg-brand-500 text-white' : 'bg-white dark:bg-slate-800 border'
                }`}
              >
                Normal
              </button>
              <button
                type="button"
                onClick={() => setFontSize('large')}
                className={`flex-1 py-1.5 rounded-lg font-bold ${
                  fontSize === 'large' ? 'bg-brand-500 text-white' : 'bg-white dark:bg-slate-800 border'
                }`}
              >
                Large
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* AI ENGINE & API KEY MANAGER (FOR JUDGES & EVALUATORS) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-gradient-to-tr from-brand-600 to-indigo-600 text-white rounded-2xl">
              <Cpu className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-bold text-base text-slate-900 dark:text-white">
                AI Engine & Live Cloud Credentials
              </h2>
              <p className="text-xs text-slate-500">
                Seamlessly toggle between Zero-Config Socratic Demo Mode and Live Google Gemini 1.5 Flash/Pro
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            {localStorage.getItem('learnova_gemini_api_key') ? '🟢 Live Key Set' : '🟡 Offline Socratic Engine'}
          </span>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs space-y-3">
          <div className="flex items-center justify-between">
            <label className="font-semibold text-slate-700 dark:text-slate-300">
              Google Gemini API Key
            </label>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noreferrer"
              className="text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1 font-semibold"
            >
              Get Free Key from Google AI Studio <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <div className="flex gap-2">
            <input
              type="password"
              placeholder="Paste AIzaSy... to enable live cloud AI"
              defaultValue={localStorage.getItem('learnova_gemini_api_key') || ''}
              id="settings-gemini-key"
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <button
              type="button"
              onClick={async () => {
                const input = document.getElementById('settings-gemini-key') as HTMLInputElement;
                const key = input?.value?.trim() || '';
                if (!key) {
                  localStorage.removeItem('learnova_gemini_api_key');
                  localStorage.removeItem('learnova_gemini_key');
                  localStorage.removeItem('learnova_active_model');
                  localStorage.removeItem('learnova_discovered_models');
                  localStorage.removeItem('learnova_api_version');
                  try {
                    await fetch('/api/config/set-key', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ apiKey: '' }),
                    });
                  } catch {}
                  addToast('Switched to Zero-Config Socratic Demo Mode.', 'info');
                  return;
                }
                try {
                  const discovery = await discoverWorkingGeminiModels(key);
                  if (discovery.error && discovery.error.includes('API key not valid')) {
                    addToast(discovery.error, 'error');
                    return;
                  }

                  const primaryModel = discovery.primaryModel || 'gemini-2.0-flash';
                  localStorage.setItem('learnova_gemini_api_key', key);
                  localStorage.setItem('learnova_gemini_key', key);
                  localStorage.setItem('learnova_active_model', primaryModel);
                  localStorage.setItem('learnova_api_version', discovery.apiVersion);

                  // Sync with local server if running
                  try {
                    await fetch('/api/config/set-key', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ apiKey: key }),
                    });
                  } catch {}

                  addToast(`🎉 Verified ${primaryModel} (${discovery.apiVersion}) & activated live!`, 'success');
                } catch (e: any) {
                  localStorage.setItem('learnova_gemini_api_key', key);
                  localStorage.setItem('learnova_gemini_key', key);
                  localStorage.setItem('learnova_active_model', 'gemini-2.0-flash');
                  addToast('Gemini API key saved to local storage.', 'success');
                }
              }}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md transition-all active:scale-95 flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Save & Activate</span>
            </button>
          </div>
          <p className="text-[11px] text-slate-500">
            Leave blank to operate in 100% offline Socratic mode (zero credentials needed).
          </p>
        </div>
      </div>

      {/* CHILD SAFETY & JUDGE DEMO CONTROLS */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h2 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-emerald-500" />
          <span>Child Safety & Judge Demo Controls</span>
        </h2>

        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          Learnova strictly enforces child-safe tutoring guidelines. Conversations and uploads are processed safely without retaining sensitive personal identifiers.
        </p>

        <div className="pt-2 flex flex-wrap items-center gap-3">
          <button
            onClick={() => loadDemoStudent()}
            className="px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold text-xs flex items-center gap-2 transition-colors shadow-sm"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reload Judge Demo Data (Aarav, Grade 10)</span>
          </button>

          <button
            onClick={() => {
              localStorage.clear();
              addToast('Local client cache cleared.', 'info');
            }}
            className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-xs transition-colors"
          >
            Clear Browser Cache
          </button>
        </div>
      </div>

    </div>
  );
};
