import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Sparkles,
  BookOpen,
  Camera,
  Layers,
  Map,
  CheckCircle2,
  BarChart3,
  Bookmark,
  Settings,
  Flame,
  Globe,
  Sun,
  Moon,
  Wifi,
  WifiOff,
  Menu,
  X,
  Cpu,
  Zap,
  ChevronDown,
  GraduationCap,
  Star,
  RotateCcw
} from './icons.js';
import { useApp } from '../context/AppContext.js';
import { AiConfigModal } from './AiConfigModal.js';

export const Navbar: React.FC = () => {
  const {
    profile,
    language,
    theme,
    isOnline,
    systemHealth,
    t,
    setLanguage,
    setTheme,
    loadDemoStudent,
    refreshHealth,
    addToast
  } = useApp();

  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [learnDropdownOpen, setLearnDropdownOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const learnRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
      if (learnRef.current && !learnRef.current.contains(event.target as Node)) {
        setLearnDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
    setLearnDropdownOpen(false);
  }, [location.pathname]);

  const isLiveAI = systemHealth?.geminiConfigured;
  const isLearnActive = location.pathname === '/learning-hub' || location.pathname === '/learning-path';

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/85 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/85 transition-colors shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-2 sm:gap-4">
            
            {/* 1. BRAND IDENTITY */}
            <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
              <div className="relative h-10 w-10 rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-brand-500/25 group-hover:scale-105 group-hover:shadow-brand-500/40 transition-all duration-300">
                <Sparkles className="h-5 w-5 animate-pulse" />
                <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 border border-white dark:border-slate-900"></span>
                </span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 dark:text-white">
                    Learnova<span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-indigo-500">AI</span>
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-brand-50 text-brand-700 dark:bg-brand-950/70 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
                    STEM
                  </span>
                </div>
                <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 hidden sm:block">
                  Class 6–12 Socratic Tutor
                </span>
              </div>
            </Link>

            {/* 2. DESKTOP NAVIGATION (CLEAN SEGMENTED TABS) */}
            <nav className="hidden lg:flex items-center gap-1 text-xs font-medium">
              
              {/* Dashboard */}
              <Link
                to="/dashboard"
                className={`flex items-center gap-1.5 px-2.5 xl:px-3 py-2 rounded-xl transition-all duration-200 ${
                  location.pathname === '/dashboard'
                    ? 'bg-brand-50 text-brand-700 font-semibold dark:bg-brand-950/70 dark:text-brand-300 shadow-sm border border-brand-200/60 dark:border-brand-800/60'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/60'
                }`}
              >
                <Layers className="h-3.5 w-3.5" />
                <span>{t.nav.dashboard}</span>
              </Link>

              {/* AI Tutor (Hero Star Button with Radiant Glow) */}
              <Link
                to="/tutor"
                className={`relative flex items-center gap-1.5 px-3 xl:px-3.5 py-2 rounded-xl transition-all duration-200 ${
                  location.pathname === '/tutor'
                    ? 'bg-gradient-to-r from-brand-500 to-indigo-600 text-white font-semibold shadow-md shadow-brand-500/25 scale-[1.02]'
                    : 'bg-brand-50/70 text-brand-700 dark:bg-brand-950/40 dark:text-brand-300 hover:bg-brand-100/80 dark:hover:bg-brand-900/40 border border-brand-200/60 dark:border-brand-800/60'
                }`}
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span className="font-semibold">{t.nav.tutor}</span>
                <span className="text-[9px] font-bold px-1 py-0.2 rounded bg-amber-400 text-slate-950">
                  AI
                </span>
              </Link>

              {/* Vision Lab */}
              <Link
                to="/vision-lab"
                className={`flex items-center gap-1.5 px-2.5 xl:px-3 py-2 rounded-xl transition-all duration-200 ${
                  location.pathname === '/vision-lab'
                    ? 'bg-brand-50 text-brand-700 font-semibold dark:bg-brand-950/70 dark:text-brand-300 shadow-sm border border-brand-200/60 dark:border-brand-800/60'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/60'
                }`}
              >
                <Camera className="h-3.5 w-3.5" />
                <span className="hidden xl:inline">Vision & Slate</span>
                <span className="xl:hidden">Vision Lab</span>
              </Link>

              {/* Learn & Simulate Dropdown */}
              <div className="relative" ref={learnRef}>
                <button
                  type="button"
                  onClick={() => setLearnDropdownOpen(!learnDropdownOpen)}
                  className={`flex items-center gap-1.5 px-2.5 xl:px-3 py-2 rounded-xl transition-all duration-200 ${
                    isLearnActive
                      ? 'bg-brand-50 text-brand-700 font-semibold dark:bg-brand-950/70 dark:text-brand-300 shadow-sm border border-brand-200/60 dark:border-brand-800/60'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/60'
                  }`}
                >
                  <BookOpen className="h-3.5 w-3.5" />
                  <span>Learn</span>
                  <span className="hidden xl:inline">& Labs</span>
                  <span className="text-[9px] px-1 py-0.2 rounded bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-semibold hidden sm:inline">
                    Labs
                  </span>
                  <ChevronDown className={`h-3 w-3 text-slate-400 transition-transform ${learnDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {learnDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-64 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-slate-800 shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <Link
                      to="/learning-hub"
                      onClick={() => setLearnDropdownOpen(false)}
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors group"
                    >
                      <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 group-hover:scale-105 transition-transform">
                        <BookOpen className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-slate-900 dark:text-white">
                          Subject Chapters & Labs
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                          Formulas + STEM Simulators (Parabola, Cannon, Chemistry)
                        </div>
                      </div>
                    </Link>

                    <Link
                      to="/learning-path"
                      onClick={() => setLearnDropdownOpen(false)}
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors group mt-1"
                    >
                      <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 group-hover:scale-105 transition-transform">
                        <Map className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-slate-900 dark:text-white">
                          Adaptive Learning Tree
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                          Visual syllabus graph & prerequisite paths
                        </div>
                      </div>
                    </Link>
                  </div>
                )}
              </div>

              {/* Practice & Quizzes */}
              <Link
                to="/quiz"
                className={`flex items-center gap-1.5 px-2.5 xl:px-3 py-2 rounded-xl transition-all duration-200 ${
                  location.pathname === '/quiz'
                    ? 'bg-brand-50 text-brand-700 font-semibold dark:bg-brand-950/70 dark:text-brand-300 shadow-sm border border-brand-200/60 dark:border-brand-800/60'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/60'
                }`}
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                <span>{t.nav.quizCenter}</span>
              </Link>

              {/* Notes & Revision Sheets */}
              <Link
                to="/notes"
                className={`flex items-center gap-1.5 px-2.5 xl:px-3 py-2 rounded-xl transition-all duration-200 ${
                  location.pathname === '/notes'
                    ? 'bg-brand-50 text-brand-700 font-semibold dark:bg-brand-950/70 dark:text-brand-300 shadow-sm border border-brand-200/60 dark:border-brand-800/60'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/60'
                }`}
              >
                <Bookmark className="h-3.5 w-3.5" />
                <span className="hidden xl:inline">Notes & Cheat Sheets</span>
                <span className="xl:hidden">Notes</span>
              </Link>

              {/* Analytics */}
              <Link
                to="/analytics"
                className={`flex items-center gap-1.5 px-2.5 xl:px-3 py-2 rounded-xl transition-all duration-200 ${
                  location.pathname === '/analytics'
                    ? 'bg-brand-50 text-brand-700 font-semibold dark:bg-brand-950/70 dark:text-brand-300 shadow-sm border border-brand-200/60 dark:border-brand-800/60'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/60'
                }`}
              >
                <BarChart3 className="h-3.5 w-3.5" />
                <span>Analytics</span>
              </Link>

            </nav>

            {/* 3. RIGHT CONTROLS: CONSOLIDATED STUDENT COMMAND CAPSULE */}
            <div className="flex items-center gap-2 sm:gap-3">
              
              {/* AI Engine Status Pill (Interactive Ping & Modal Launcher) */}
              <button
                type="button"
                onClick={() => setAiModalOpen(true)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border shadow-sm transition-all duration-200 hover:scale-105 active:scale-95 ${
                  isLiveAI
                    ? 'bg-gradient-to-r from-purple-50 to-indigo-50 text-purple-700 border-purple-200 dark:from-purple-950/50 dark:to-indigo-950/50 dark:text-purple-300 dark:border-purple-800'
                    : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800'
                }`}
                title="Click to test API Key or configure Gemini models"
              >
                <span className="relative flex h-2 w-2">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    isLiveAI ? 'bg-purple-400' : 'bg-amber-400'
                  }`}></span>
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${
                    isLiveAI ? 'bg-purple-600' : 'bg-amber-500'
                  }`}></span>
                </span>
                <span className="hidden sm:inline">
                  {isLiveAI ? 'Live Gemini 1.5' : 'Socratic AI'}
                </span>
                <span className="sm:hidden">
                  {isLiveAI ? 'Gemini' : 'AI'}
                </span>
                <Zap className="h-3 w-3 text-amber-500 fill-amber-400" />
              </button>

              {/* Student Profile Capsule Button (Opens Profile & Settings Dropdown) */}
              <div className="relative" ref={profileRef}>
                <button
                  type="button"
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 p-1 sm:pl-2.5 sm:pr-2 sm:py-1 rounded-full bg-slate-100/90 hover:bg-slate-200/80 dark:bg-slate-800/80 dark:hover:bg-slate-700/80 border border-slate-200/80 dark:border-slate-700/80 transition-all duration-200 hover:shadow-sm"
                  title="Student Profile, Language, Theme & Judge Demo"
                >
                  {/* Streak Flame Pill */}
                  <div className="hidden md:flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100/80 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 text-[11px] font-bold">
                    <Flame className="h-3 w-3 text-amber-500 fill-amber-500" />
                    <span>{profile?.streakCount || 4}d</span>
                  </div>

                  {/* Student Name & Grade */}
                  <div className="hidden sm:flex flex-col text-left">
                    <span className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                      {profile?.name ? profile.name.split(' ')[0] : 'Aarav'}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                      Class {profile?.grade || 10} STEM
                    </span>
                  </div>

                  {/* Avatar Circle */}
                  <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-brand-500 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-inner">
                    {profile?.name ? profile.name.charAt(0) : 'A'}
                  </div>

                  <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transition-transform hidden sm:block ${
                    profileDropdownOpen ? 'rotate-180' : ''
                  }`} />
                </button>

                {/* Floating Student Profile & Settings Dropdown Card */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-80 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-slate-800 shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    
                    {/* Header info */}
                    <div className="flex items-center gap-3 pb-3 border-b border-slate-200/80 dark:border-slate-800/80">
                      <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-brand-500 to-indigo-600 text-white flex items-center justify-center font-bold text-base shadow-md">
                        {profile?.name ? profile.name.charAt(0) : 'A'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                            {profile?.name || 'Aarav Sharma'}
                          </h4>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                            Class {profile?.grade || 10}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          CBSE · Mathematics & Science
                        </p>
                      </div>
                    </div>

                    {/* Stats Ribbon */}
                    <div className="grid grid-cols-3 gap-2 py-3 border-b border-slate-200/80 dark:border-slate-800/80 text-center">
                      <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                        <div className="flex items-center justify-center gap-1 text-amber-500 text-xs font-bold">
                          <Flame className="h-3.5 w-3.5 fill-amber-500" />
                          <span>{profile?.streakCount || 4} Days</span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">Study Streak</div>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                        <div className="flex items-center justify-center gap-1 text-indigo-500 text-xs font-bold">
                          <Star className="h-3.5 w-3.5 fill-indigo-400" />
                          <span>{profile?.xpPoints || 380} XP</span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">Earned XP</div>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                        <div className="text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                          {profile?.totalStudyMinutes || 185}m
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">Time Spent</div>
                      </div>
                    </div>

                    {/* Quick Language Switcher Pills */}
                    <div className="pt-3">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                          <Globe className="h-3.5 w-3.5 text-brand-500" />
                          <span>Tutor Language</span>
                        </span>
                        <span className="text-[10px] text-slate-400">Scientific KaTeX kept</span>
                      </div>
                      <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800">
                        <button
                          type="button"
                          onClick={() => setLanguage('en')}
                          className={`py-1 text-xs font-semibold rounded-lg transition-all ${
                            language === 'en'
                              ? 'bg-white text-brand-600 dark:bg-slate-700 dark:text-white shadow-sm'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                          }`}
                        >
                          English
                        </button>
                        <button
                          type="button"
                          onClick={() => setLanguage('te')}
                          className={`py-1 text-xs font-semibold rounded-lg transition-all ${
                            language === 'te'
                              ? 'bg-white text-brand-600 dark:bg-slate-700 dark:text-white shadow-sm'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                          }`}
                        >
                          తెలుగు
                        </button>
                        <button
                          type="button"
                          onClick={() => setLanguage('hi')}
                          className={`py-1 text-xs font-semibold rounded-lg transition-all ${
                            language === 'hi'
                              ? 'bg-white text-brand-600 dark:bg-slate-700 dark:text-white shadow-sm'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                          }`}
                        >
                          हिन्दी
                        </button>
                      </div>
                    </div>

                    {/* Theme & Network Mode Row */}
                    <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-200/80 dark:border-slate-800/80">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-600 dark:text-slate-400">Theme</span>
                        <div className="flex items-center p-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60">
                          <button
                            type="button"
                            onClick={() => setTheme('light')}
                            className={`p-1 rounded-md transition-all ${
                              theme === 'light' ? 'bg-white text-amber-500 shadow-sm' : 'text-slate-400'
                            }`}
                            title="Light mode"
                          >
                            <Sun className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setTheme('dark')}
                            className={`p-1 rounded-md transition-all ${
                              theme === 'dark' ? 'bg-slate-700 text-indigo-400 shadow-sm' : 'text-slate-400'
                            }`}
                            title="Dark mode"
                          >
                            <Moon className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Online status indicator */}
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                        {isOnline ? (
                          <>
                            <Wifi className="h-3.5 w-3.5 text-emerald-500" />
                            <span className="text-emerald-600 dark:text-emerald-400 font-medium text-[11px]">Online</span>
                          </>
                        ) : (
                          <>
                            <WifiOff className="h-3.5 w-3.5 text-amber-500" />
                            <span className="text-amber-600 dark:text-amber-400 font-medium text-[11px]">Offline PWA</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Quick Actions (Judge Demo Reset & Settings link) */}
                    <div className="pt-3 mt-3 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-col gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          loadDemoStudent();
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-gradient-to-r from-brand-500 to-indigo-600 text-white font-semibold text-xs shadow-md shadow-brand-500/20 hover:from-brand-600 hover:to-indigo-700 transition-all active:scale-[0.98]"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        <span>Reload Judge Demo Data</span>
                      </button>

                      <Link
                        to="/settings"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
                      >
                        <Settings className="h-3.5 w-3.5" />
                        <span>All Account & Accessibility Settings</span>
                      </Link>
                    </div>

                  </div>
                )}
              </div>

              {/* Mobile Hamburger Toggle Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800 transition-colors"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>

            </div>

          </div>
        </div>

        {/* 4. MOBILE SLIDING DRAWER SHEET */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl p-4 animate-in slide-in-from-top-4 duration-200 shadow-2xl">
            
            {/* Student mini card */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-brand-50 to-indigo-50 dark:from-brand-950/40 dark:to-indigo-950/40 border border-brand-200/60 dark:border-brand-800/60 mb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-brand-500 text-white flex items-center justify-center font-bold text-sm">
                  {profile?.name ? profile.name.charAt(0) : 'A'}
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">
                    {profile?.name || 'Aarav Sharma'}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Class {profile?.grade || 10} · CBSE STEM
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-100/70 dark:bg-amber-950/60 px-2.5 py-1 rounded-full">
                <Flame className="h-3.5 w-3.5 fill-amber-500" />
                <span>{profile?.streakCount || 4}d</span>
              </div>
            </div>

            {/* Categorized Mobile Navigation Grid */}
            <div className="space-y-4">
              
              {/* Category 1: AI Studios */}
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1 px-1">
                  AI Learning Studios
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/tutor"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 p-2.5 rounded-xl bg-brand-500 text-white font-semibold text-xs shadow-md shadow-brand-500/20"
                  >
                    <Sparkles className="h-4 w-4" />
                    <span>AI Tutor Workspace</span>
                  </Link>

                  <Link
                    to="/vision-lab"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-xs"
                  >
                    <Camera className="h-4 w-4 text-brand-500" />
                    <span>Vision & Slate</span>
                  </Link>
                </div>
              </div>

              {/* Category 2: Curriculum & Labs */}
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1 px-1">
                  Curriculum, Labs & Quizzes
                </div>
                <div className="space-y-1">
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300"
                  >
                    <div className="flex items-center gap-2.5">
                      <Layers className="h-4 w-4 text-indigo-500" />
                      <span>{t.nav.dashboard}</span>
                    </div>
                  </Link>

                  <Link
                    to="/learning-hub"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300"
                  >
                    <div className="flex items-center gap-2.5">
                      <BookOpen className="h-4 w-4 text-brand-500" />
                      <span>Subject Chapters & STEM Simulators</span>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-bold">
                      Labs
                    </span>
                  </Link>

                  <Link
                    to="/learning-path"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300"
                  >
                    <div className="flex items-center gap-2.5">
                      <Map className="h-4 w-4 text-emerald-500" />
                      <span>Adaptive Learning Tree</span>
                    </div>
                  </Link>

                  <Link
                    to="/quiz"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300"
                  >
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      <span>{t.nav.quizCenter}</span>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Category 3: Revision & Analytics */}
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1 px-1">
                  Study Tools & Settings
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/notes"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300"
                  >
                    <Bookmark className="h-4 w-4 text-amber-500" />
                    <span>Saved Notes & Print</span>
                  </Link>

                  <Link
                    to="/analytics"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300"
                  >
                    <BarChart3 className="h-4 w-4 text-purple-500" />
                    <span>Analytics</span>
                  </Link>
                </div>
              </div>

              {/* Language Switcher in Mobile Drawer */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-2">
                  Select Language:
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setLanguage('en')}
                    className={`py-2 text-xs font-semibold rounded-xl border ${
                      language === 'en'
                        ? 'bg-brand-500 text-white border-brand-500 shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    English
                  </button>
                  <button
                    type="button"
                    onClick={() => setLanguage('te')}
                    className={`py-2 text-xs font-semibold rounded-xl border ${
                      language === 'te'
                        ? 'bg-brand-500 text-white border-brand-500 shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    తెలుగు
                  </button>
                  <button
                    type="button"
                    onClick={() => setLanguage('hi')}
                    className={`py-2 text-xs font-semibold rounded-xl border ${
                      language === 'hi'
                        ? 'bg-brand-500 text-white border-brand-500 shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    हिन्दी
                  </button>
                </div>
              </div>

              {/* Quick Actions Footer in Mobile Drawer */}
              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setAiModalOpen(true);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-800 font-semibold text-xs"
                >
                  <Cpu className="h-4 w-4" />
                  <span>Configure Gemini AI Engine Key</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    loadDemoStudent();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-indigo-600 text-white font-semibold text-xs shadow-md shadow-brand-500/20"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Reload Judge Demo Profile</span>
                </button>
              </div>

            </div>

          </div>
        )}
      </header>

      {/* AI Key & Engine Config Modal */}
      <AiConfigModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        onKeyUpdated={() => refreshHealth && refreshHealth()}
      />
    </>
  );
};
