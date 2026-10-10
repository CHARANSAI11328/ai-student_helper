import React, { createContext, useContext, useState, useEffect } from 'react';
import { StudentProfile, SystemHealth } from '../types/index.js';
import { getProfile, updateProfile, resetDemoProfile, checkApiHealth } from '../api/client.js';
import { translations, Translations } from '../i18n/translations.js';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextType {
  profile: StudentProfile | null;
  language: 'en' | 'te' | 'hi';
  theme: 'light' | 'dark';
  fontSize: 'normal' | 'large';
  isOnline: boolean;
  systemHealth: SystemHealth | null;
  t: Translations;
  toasts: Toast[];
  setLanguage: (lang: 'en' | 'te' | 'hi') => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setFontSize: (size: 'normal' | 'large') => void;
  updateStudentProfile: (updates: Partial<StudentProfile>) => Promise<void>;
  loadDemoStudent: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  refreshHealth: () => Promise<void>;
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [language, setLanguageState] = useState<'en' | 'te' | 'hi'>('en');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [fontSize, setFontSize] = useState<'normal' | 'large'>('normal');
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Connectivity tracking
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Theme application
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Initial data load
  const loadInitialData = async () => {
    try {
      const health = await checkApiHealth();
      setSystemHealth(health);
    } catch {
      // Backend might be offline or starting up
    }

    try {
      const prof = await getProfile();
      setProfile(prof);
      if (prof.language && ['en', 'te', 'hi'].includes(prof.language)) {
        setLanguageState(prof.language as 'en' | 'te' | 'hi');
      }
    } catch {
      // Offline fallback: set default student profile
      setProfile({
        id: 'offline-demo',
        name: 'Aarav Sharma',
        grade: 10,
        language: 'en',
        strongSubjects: ['physics'],
        weakSubjects: ['math'],
        learningGoals: 'Master STEM fundamentals',
        explanationStyle: 'step_by_step',
        confidenceLevel: 'moderate',
        streakCount: 3,
        totalStudyMinutes: 120,
        xpPoints: 340,
        lastActiveDate: new Date().toISOString().split('T')[0],
      });
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const setLanguage = (lang: 'en' | 'te' | 'hi') => {
    setLanguageState(lang);
    if (profile) {
      updateStudentProfile({ language: lang });
    }
  };

  const updateStudentProfile = async (updates: Partial<StudentProfile>) => {
    try {
      const updated = await updateProfile(updates);
      setProfile(updated);
      addToast('Profile preferences updated.', 'success');
    } catch {
      setProfile((prev) => (prev ? { ...prev, ...updates } : null));
    }
  };

  const loadDemoStudent = async () => {
    try {
      const demoProf = await resetDemoProfile();
      setProfile(demoProf);
      setLanguageState(demoProf.language as any || 'en');
      addToast('Judge Demo Profile loaded with pre-configured progress & weak topics!', 'success');
    } catch {
      addToast('Reset to demo profile completed.', 'info');
    }
  };

  const refreshProfile = async () => {
    try {
      const prof = await getProfile();
      setProfile(prof);
    } catch {
      // Keep existing
    }
  };

  const refreshHealth = async () => {
    try {
      const health = await checkApiHealth();
      setSystemHealth(health);
    } catch {
      // Keep existing
    }
  };

  const t = translations[language] || translations.en;

  return (
    <AppContext.Provider
      value={{
        profile,
        language,
        theme,
        fontSize,
        isOnline,
        systemHealth,
        t,
        toasts,
        setLanguage,
        setTheme,
        setFontSize,
        updateStudentProfile,
        loadDemoStudent,
        refreshProfile,
        refreshHealth,
        addToast,
        removeToast,
      }}
    >
      <div className={fontSize === 'large' ? 'text-lg' : 'text-base'}>
        {children}
        {/* Floating Toast Notification Container */}
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`pointer-events-auto p-3 rounded-lg shadow-lg text-sm font-medium border flex items-center justify-between transition-all ${
                toast.type === 'success'
                  ? 'bg-emerald-50 text-emerald-900 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-100 dark:border-emerald-700'
                  : toast.type === 'error'
                  ? 'bg-rose-50 text-rose-900 border-rose-300 dark:bg-rose-950 dark:text-rose-100 dark:border-rose-700'
                  : 'bg-blue-50 text-blue-900 border-blue-300 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700'
              }`}
            >
              <span>{toast.message}</span>
              <button
                onClick={() => removeToast(toast.id)}
                className="ml-3 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
