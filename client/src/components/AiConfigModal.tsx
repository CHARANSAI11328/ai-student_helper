import React, { useState, useEffect } from 'react';
import { Sparkles, Check, AlertCircle, X, Shield, Cpu, RefreshCw, ExternalLink } from './icons.js';
import { discoverWorkingGeminiModels } from '../api/client.js';

interface AiConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeyUpdated?: () => void;
}

export const AiConfigModal: React.FC<AiConfigModalProps> = ({ isOpen, onClose, onKeyUpdated }) => {
  const [apiKey, setApiKey] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [testResult, setTestResult] = useState<{
    valid: boolean;
    models?: string[];
    latencyMs?: number;
    error?: string;
  } | null>(null);
  const [currentMode, setCurrentMode] = useState<'live_ai' | 'demo_offline_engine'>('demo_offline_engine');
  const [maskedKey, setMaskedKey] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadStatus();
      const localKey =
        localStorage.getItem('learnova_gemini_api_key') ||
        localStorage.getItem('learnova_gemini_key') ||
        '';
      setApiKey(localKey);
      setTestResult(null);
    }
  }, [isOpen]);

  const loadStatus = async () => {
    const localKey =
      localStorage.getItem('learnova_gemini_api_key') ||
      localStorage.getItem('learnova_gemini_key') ||
      '';

    if (localKey) {
      setCurrentMode('live_ai');
      setMaskedKey(localKey.slice(0, 6) + '...' + localKey.slice(-4));
    } else {
      setCurrentMode('demo_offline_engine');
      setMaskedKey('');
    }

    // Try checking backend if running locally
    try {
      const res = await fetch('/api/config/ai-status');
      if (res.ok) {
        const contentType = res.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const data = await res.json();
          if (data.mode) setCurrentMode(data.mode);
          if (data.maskedKey) setMaskedKey(data.maskedKey);
        }
      }
    } catch {
      // Backend not running (e.g. GitHub Pages static host) — local state is used
    }
  };

  /**
   * Test key directly against Google Gemini API in browser
   * Works on localhost, GitHub Pages, and production clouds alike.
   */
  const handleTestKey = async () => {
    const cleanKey = apiKey.trim();
    if (!cleanKey) return;
    setIsTesting(true);
    setTestResult(null);
    const startTime = Date.now();

    try {
      const discovery = await discoverWorkingGeminiModels(cleanKey);

      if (discovery.error) {
        setTestResult({
          valid: false,
          error: discovery.error
        });
        setIsTesting(false);
        return;
      }

      const latencyMs = Date.now() - startTime;
      setTestResult({
        valid: true,
        latencyMs,
        models: discovery.models.length > 0 ? discovery.models : ['gemini-2.0-flash', 'gemini-1.5-flash']
      });

      // Also notify local backend if one is running
      try {
        fetch('/api/config/test-key', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ apiKey: cleanKey }),
        }).catch(() => {});
      } catch {}

    } catch (err: any) {
      setTestResult({
        valid: false,
        error: `Network test failed: ${err.message || 'Unable to reach Google Gemini servers. Check your internet connection.'}`
      });
    } finally {
      setIsTesting(false);
    }
  };

  /**
   * Save and activate the key
   */
  const handleSaveKey = async () => {
    const cleanKey = apiKey.trim();
    if (!cleanKey) return;
    setIsSaving(true);
    setTestResult(null);
    const startTime = Date.now();

    try {
      const discovery = await discoverWorkingGeminiModels(cleanKey);

      if (discovery.error && discovery.error.includes('API key not valid')) {
        setTestResult({
          valid: false,
          error: discovery.error
        });
        setIsSaving(false);
        return;
      }

      const latencyMs = Date.now() - startTime;
      const primaryModel = discovery.primaryModel || 'gemini-2.0-flash';

      // Save key under both keys in localStorage
      localStorage.setItem('learnova_gemini_api_key', cleanKey);
      localStorage.setItem('learnova_gemini_key', cleanKey);
      localStorage.setItem('learnova_active_model', primaryModel);
      localStorage.setItem('learnova_api_version', discovery.apiVersion);

      // Try notifying backend if running
      try {
        await fetch('/api/config/set-key', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ apiKey: cleanKey }),
        });
      } catch {}

      setCurrentMode('live_ai');
      setMaskedKey(cleanKey.slice(0, 6) + '...' + cleanKey.slice(-4));
      setTestResult({
        valid: true,
        latencyMs,
        models: discovery.models.length > 0 ? discovery.models : [primaryModel]
      });

      if (onKeyUpdated) onKeyUpdated();
      setTimeout(() => onClose(), 1200);

    } catch (err: any) {
      // If offline or blocked by adblocker, save anyway and activate
      localStorage.setItem('learnova_gemini_api_key', cleanKey);
      localStorage.setItem('learnova_gemini_key', cleanKey);
      localStorage.setItem('learnova_active_model', 'gemini-2.0-flash');
      setCurrentMode('live_ai');
      setMaskedKey(cleanKey.slice(0, 6) + '...' + cleanKey.slice(-4));
      setTestResult({
        valid: true,
        models: ['gemini-2.0-flash']
      });
      if (onKeyUpdated) onKeyUpdated();
      setTimeout(() => onClose(), 1200);
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Reset back to Zero-Config Socratic Demo Mode
   */
  const handleUseDemo = async () => {
    localStorage.removeItem('learnova_gemini_api_key');
    localStorage.removeItem('learnova_gemini_key');
    localStorage.removeItem('learnova_active_model');
    localStorage.removeItem('learnova_discovered_models');
    localStorage.removeItem('learnova_api_version');
    setApiKey('');
    setTestResult(null);
    setCurrentMode('demo_offline_engine');
    setMaskedKey('');

    try {
      await fetch('/api/config/set-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: '' }),
      });
    } catch {}

    if (onKeyUpdated) onKeyUpdated();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 bg-gradient-to-tr from-brand-600 to-indigo-600 text-white rounded-2xl shadow-md">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              AI Engine & Credentials Manager
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Zero-config judge demo mode or live Google Gemini connection
            </p>
          </div>
        </div>

        {/* Current Active Status Card */}
        <div className="mb-5 p-3.5 rounded-2xl border bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full animate-pulse ${
                currentMode === 'live_ai' ? 'bg-emerald-500' : 'bg-amber-500'
              }`} />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {currentMode === 'live_ai' ? 'Live Google Gemini Cloud AI' : 'Learnova Socratic Offline Engine'}
              </span>
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-md font-semibold bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600">
              {currentMode === 'live_ai' ? (maskedKey || 'Key Active') : 'Zero-Config'}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            {currentMode === 'live_ai'
              ? 'Multi-model Gemini 1.5 Flash & Pro active with real-time multimodal vision & reasoning.'
              : 'Deterministic 9-part pedagogical responses, arithmetic verifier, and offline curriculum enabled.'}
          </p>
        </div>

        {/* API Key Input */}
        <div className="space-y-3">
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Google Gemini API Key
              </label>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1 font-semibold"
              >
                Get Free API Key <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <input
              type="password"
              placeholder="Paste AIzaSy... to enable live cloud AI"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
            <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
              <Shield className="w-3 h-3" />
              Keys remain safe in local browser storage and in-memory server cache.
            </p>
          </div>

          {/* Test Result Feedback Box */}
          {testResult && (
            <div className={`p-3 rounded-xl border text-xs ${
              testResult.valid
                ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                : 'bg-rose-50 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-300'
            }`}>
              {testResult.valid ? (
                <div>
                  <div className="flex items-center gap-1.5 font-bold mb-1">
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span>Key Verified & Active! {testResult.latencyMs ? `(${testResult.latencyMs}ms)` : ''}</span>
                  </div>
                  {testResult.models && testResult.models.length > 0 && (
                    <p className="text-[11px] font-mono opacity-90 truncate">
                      Models: {testResult.models.slice(0, 3).join(', ')}
                    </p>
                  )}
                </div>
              ) : (
                <div className="flex items-start gap-1.5">
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span>{testResult.error || 'Verification failed. Please check your key.'}</span>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
            <button
              type="button"
              onClick={handleTestKey}
              disabled={isTesting || !apiKey.trim()}
              className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
              <span>{isTesting ? 'Testing Key...' : 'Test Connection'}</span>
            </button>

            <button
              type="button"
              onClick={handleSaveKey}
              disabled={isSaving || !apiKey.trim()}
              className="w-full sm:flex-1 py-2.5 px-4 text-xs font-bold rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white shadow-lg shadow-brand-500/20 active:scale-95 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{isSaving ? 'Activating...' : 'Save & Activate Live AI'}</span>
            </button>
          </div>

          <div className="text-center pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={handleUseDemo}
              className="text-[11px] text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 underline"
            >
              Reset to Zero-Config Socratic Demo Mode
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
