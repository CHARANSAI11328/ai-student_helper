import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Sparkles,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Copy,
  Bookmark,
  Check,
  RotateCcw,
  BookOpen,
  HelpCircle,
  AlertCircle,
  Lightbulb,
  FileQuestion,
  Calculator,
  Atom,
  FlaskConical,
  Upload,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext.js';
import { askTutor, saveNote, AskTutorResponse } from '../api/client.js';
import { MathRenderer } from '../components/MathRenderer.js';
import { BlackboardCanvas } from '../components/BlackboardCanvas.js';
import { TutorExplanation } from '../types/index.js';

interface Message {
  id: string;
  sender: 'student' | 'tutor';
  text: string;
  explanation?: TutorExplanation;
  modelUsed?: string;
  isDemo?: boolean;
  imagePreview?: string;
  timestamp: string;
}

export const TutorPage: React.FC = () => {
  const { profile, language, t, addToast } = useApp();
  const [searchParams] = useSearchParams();

  const [subject, setSubject] = useState<'math' | 'physics' | 'chemistry'>('math');
  const [grade, setGrade] = useState<number>(profile?.grade || 10);
  const [style, setStyle] = useState<'simple' | 'step_by_step' | 'visual_detailed'>('step_by_step');
  const [questionInput, setQuestionInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [savedNoteIds, setSavedNoteIds] = useState<Set<string>>(new Set());
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<'chat' | 'slate'>('chat');

  // Voice Speech-to-Text & Speech-to-Speech
  const [isRecording, setIsRecording] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const speechRecognitionRef = useRef<any>(null);

  // Selected check question answer states
  const [selectedOptions, setSelectedOptions] = useState<Record<string, number>>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Initial greeting message
  useEffect(() => {
    const initialQuery = searchParams.get('q');
    if (initialQuery) {
      setQuestionInput(initialQuery);
    }

    if (messages.length === 0) {
      setMessages([
        {
          id: 'msg-welcome',
          sender: 'tutor',
          text: `Hello ${profile?.name || 'there'}! I'm your Socratic STEM tutor. What concept in Mathematics, Physics, or Chemistry would you like to explore together today?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  }, [searchParams]);

  // Handle Speech Recognition (Web Speech API)
  const toggleSpeechRecognition = () => {
    if (isRecording) {
      if (speechRecognitionRef.current) {
        speechRecognitionRef.current.stop();
      }
      setIsRecording(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      addToast('Voice recognition is not supported in this browser.', 'error');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = language === 'te' ? 'te-IN' : language === 'hi' ? 'hi-IN' : 'en-US';

      recognition.onstart = () => setIsRecording(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setQuestionInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsRecording(false);
      };
      recognition.onerror = () => {
        setIsRecording(false);
        addToast('Could not capture audio. Please check microphone permissions.', 'error');
      };
      recognition.onend = () => setIsRecording(false);

      speechRecognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsRecording(false);
      addToast('Microphone initialization failed.', 'error');
    }
  };

  // Text-to-Speech (Web Speech API Synthesis)
  const handleReadAloud = (textToRead: string) => {
    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    if (!('speechSynthesis' in window)) {
      addToast('Text-to-speech is not supported in this browser.', 'error');
      return;
    }

    // Strip LaTeX syntax for cleaner pronunciation
    const cleanSpeech = textToRead
      .replace(/\$\$/g, '')
      .replace(/\$/g, '')
      .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '$1 over $2')
      .replace(/\\pm/g, 'plus or minus')
      .replace(/\\sqrt\{([^}]+)\}/g, 'square root of $1')
      .replace(/\\rightarrow/g, 'yields');

    const utterance = new SpeechSynthesisUtterance(cleanSpeech);
    utterance.lang = language === 'te' ? 'te-IN' : language === 'hi' ? 'hi-IN' : 'en-US';
    utterance.rate = 0.95;

    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    setIsPlayingAudio(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleAskQuestion = async (customText?: string) => {
    const textToSubmit = customText || questionInput;
    if (!textToSubmit.trim() || isLoading) return;

    const studentMessage: Message = {
      id: `student-${Date.now()}`,
      sender: 'student',
      text: textToSubmit,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, studentMessage]);
    setQuestionInput('');
    setIsLoading(true);

    try {
      const response: AskTutorResponse = await askTutor({
        question: textToSubmit,
        subject,
        grade,
        language,
        style,
      });

      const tutorMessage: Message = {
        id: `tutor-${Date.now()}`,
        sender: 'tutor',
        text: response.explanation.finalAnswer,
        explanation: response.explanation,
        modelUsed: response.metadata.modelUsed,
        isDemo: response.metadata.isDemo,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, tutorMessage]);
    } catch (err: any) {
      addToast(err.message || 'Failed to get answer. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (msgId: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(msgId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSaveToNotes = async (msg: Message) => {
    if (!msg.explanation) return;
    try {
      const title = `${subject.toUpperCase()}: ${msg.explanation.questionIntent.slice(0, 40)}...`;
      const markdown = `## ${msg.explanation.questionIntent}\n\n**Final Answer:** ${msg.explanation.finalAnswer}\n\n### Step-by-Step Breakdown:\n` +
        msg.explanation.stepByStepReasoning.map((s) => `1. **${s.title}**: ${s.explanation} ${s.mathExpression ? `\n   $$${s.mathExpression}$$` : ''}`).join('\n') +
        `\n\n**Why it works:** ${msg.explanation.whyMethodWorks}\n\n**Common Mistake to avoid:** ${msg.explanation.commonMistakes}`;

      await saveNote({
        title,
        subject,
        contentMarkdown: markdown,
      });

      setSavedNoteIds((prev) => new Set(prev).add(msg.id));
      addToast(t.tutor.savedToNotes, 'success');
    } catch {
      addToast('Failed to save note.', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 h-[calc(100vh-4rem)] flex flex-col gap-4">
      
      {/* TOP CONFIGURATION STRIP */}
      <div className="console-card-elevated rounded-2xl p-4 border-white/10 shadow-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
        
        {/* Subject Tabs */}
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1">Domain:</span>
          <button
            onClick={() => setSubject('math')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold border transition-all ${
              subject === 'math'
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                : 'console-card text-slate-400 hover:text-slate-200 border-white/5'
            }`}
          >
            <Calculator className="h-3.5 w-3.5" />
            <span>{t.subjects.math}</span>
          </button>

          <button
            onClick={() => setSubject('physics')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold border transition-all ${
              subject === 'physics'
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.15)]'
                : 'console-card text-slate-400 hover:text-slate-200 border-white/5'
            }`}
          >
            <Atom className="h-3.5 w-3.5" />
            <span>{t.subjects.physics}</span>
          </button>

          <button
            onClick={() => setSubject('chemistry')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold border transition-all ${
              subject === 'chemistry'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                : 'console-card text-slate-400 hover:text-slate-200 border-white/5'
            }`}
          >
            <FlaskConical className="h-3.5 w-3.5" />
            <span>{t.subjects.chemistry}</span>
          </button>
        </div>

        {/* Grade & Style Context */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-[11px] font-bold text-slate-400">{t.common.grade}:</span>
            <select
              value={grade}
              onChange={(e) => setGrade(Number(e.target.value))}
              className="px-2.5 py-1 rounded-xl border border-white/10 bg-slate-900 text-slate-200 font-semibold focus:outline-none focus:border-cyan-500/50"
            >
              {[6, 7, 8, 9, 10, 11, 12].map((g) => (
                <option key={g} value={g}>Class {g}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="font-mono text-[11px] font-bold text-slate-400 hidden sm:inline">Pedagogy:</span>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value as any)}
              className="px-2.5 py-1 rounded-xl border border-white/10 bg-slate-900 text-slate-200 font-semibold focus:outline-none focus:border-cyan-500/50"
            >
              <option value="step_by_step">{t.tutor.styleStepByStep}</option>
              <option value="simple">{t.tutor.styleSimple}</option>
              <option value="visual_detailed">{t.tutor.styleVisual}</option>
            </select>
          </div>

          {/* Workspace Mode: Chat vs Scratchpad Slate */}
          <div className="flex items-center gap-1 console-card p-1 rounded-xl border border-white/10">
            <button
              type="button"
              onClick={() => setActiveWorkspaceTab('chat')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeWorkspaceTab === 'chat'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Dialogue Feed
            </button>
            <button
              type="button"
              onClick={() => setActiveWorkspaceTab('slate')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeWorkspaceTab === 'slate'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Blackboard Canvas
            </button>
          </div>
        </div>

      </div>

      {/* OPTIONAL SLATE SCRATCHPAD VIEW */}
      {activeWorkspaceTab === 'slate' && (
        <div className="animate-fadeIn">
          <BlackboardCanvas
            title="Socratic Blackboard Scratchpad"
            subtitle="Work through equations, sketch geometry, or test formulas with your stylus or mouse. Click 'Solve Drawing' to send to tutor."
            onCaptureImage={(_dataUrl) => {
              setActiveWorkspaceTab('chat');
              handleAskQuestion('Please analyze and explain the solution to my handwritten blackboard drawing step-by-step.');
            }}
          />
        </div>
      )}

      {/* CHAT STREAM CONTAINER */}
      <div className={`flex-1 overflow-y-auto console-card rounded-3xl p-4 sm:p-6 border-white/10 space-y-6 shadow-2xl ${activeWorkspaceTab === 'slate' ? 'hidden' : ''}`}>
        
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'student' ? 'items-end' : 'items-start'}`}
          >
            {/* Student Message Bubble */}
            {msg.sender === 'student' ? (
              <div className="max-w-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-medium rounded-2xl rounded-tr-sm px-5 py-3 shadow-lg shadow-cyan-500/20 text-sm space-y-1">
                <p className="leading-relaxed">{msg.text}</p>
                <p className="text-[10px] text-slate-900/70 text-right font-mono">{msg.timestamp}</p>
              </div>
            ) : (
              /* Structured Socratic Pedagogical Response Card */
              <div className="w-full max-w-4xl console-card-elevated rounded-3xl border-white/10 shadow-2xl p-6 sm:p-7 space-y-5 animate-fadeIn">
                
                {/* Header with Model Badge & Quick Controls */}
                <div className="flex items-center justify-between border-b border-white/10 pb-3 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-lg bg-gradient-to-tr from-cyan-500 to-purple-600 text-white flex items-center justify-center font-bold text-xs shadow-md shadow-cyan-500/20">
                      L
                    </div>
                    <span className="font-bold text-white font-display">
                      Learnova Socratic Tutor
                    </span>
                    <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-800/80">
                      {msg.modelUsed || 'AI Engine'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Read Aloud Button */}
                    <button
                      onClick={() => handleReadAloud(msg.explanation ? `${msg.explanation.questionIntent}. Final Answer: ${msg.explanation.finalAnswer}` : msg.text)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-white/5 transition-colors"
                      title={isPlayingAudio ? t.common.stopAudio : t.common.listen}
                    >
                      {isPlayingAudio ? <VolumeX className="h-4 w-4 text-cyan-400" /> : <Volume2 className="h-4 w-4" />}
                    </button>

                    {/* Copy Answer */}
                    <button
                      onClick={() => handleCopy(msg.id, msg.explanation ? msg.explanation.finalAnswer : msg.text)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-white/5 transition-colors"
                      title={t.common.copy}
                    >
                      {copiedId === msg.id ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                    </button>

                    {/* Save to Notes */}
                    {msg.explanation && (
                      <button
                        onClick={() => handleSaveToNotes(msg)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          savedNoteIds.has(msg.id)
                            ? 'text-brand-500'
                            : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                        title={t.common.save}
                      >
                        <Bookmark className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* If simple message without full 9-step schema */}
                {!msg.explanation ? (
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {msg.text}
                  </p>
                ) : (
                  <div className="space-y-5 text-sm">
                    
                    {/* 1. What the Question is Asking */}
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1">
                        <HelpCircle className="h-3.5 w-3.5 text-brand-500" />
                        <span>{t.tutor.whatIsAsking}</span>
                      </h4>
                      <p className="text-slate-800 dark:text-slate-200 font-medium">
                        {msg.explanation.questionIntent}
                      </p>
                    </div>

                    {/* 2. Concepts Required */}
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1">
                        <BookOpen className="h-3.5 w-3.5 text-indigo-500" />
                        <span>{t.tutor.conceptsNeeded}</span>
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.explanation.requiredConcepts.map((concept, idx) => (
                          <span
                            key={idx}
                            className="text-xs px-2.5 py-1 rounded-lg bg-indigo-950/70 text-indigo-300 font-mono border border-indigo-500/30"
                          >
                            {concept}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* 3. Step-by-Step Derivation */}
                    <div>
                      <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 mb-2.5 flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>{t.tutor.stepByStepReasoning}</span>
                      </h4>
                      <div className="space-y-3">
                        {msg.explanation.stepByStepReasoning.map((step) => (
                          <div
                            key={step.stepNumber}
                            className="p-4 rounded-2xl console-card border-white/10 space-y-2"
                          >
                            <div className="flex items-center gap-2">
                              <span className="h-6 w-6 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-[11px] font-mono font-bold flex items-center justify-center">
                                {step.stepNumber}
                              </span>
                              <h5 className="font-bold text-xs text-white font-display">
                                {step.title}
                              </h5>
                            </div>
                            <p className="text-slate-300 leading-relaxed text-xs sm:text-sm pl-8">
                              {step.explanation}
                            </p>
                            {step.mathExpression && (
                              <div className="pl-8 pt-1">
                                <MathRenderer content={`$$${step.mathExpression}$$`} />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 4. Final Answer Box */}
                    <div className="p-5 rounded-2xl console-card-elevated border-emerald-500/40 bg-emerald-950/30 shadow-[0_0_25px_rgba(16,185,129,0.1)]">
                      <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-300 mb-1 flex items-center gap-1.5">
                        <Check className="h-4 w-4" />
                        <span>{t.tutor.finalAnswer}</span>
                      </h4>
                      <div className="text-base font-bold text-white mt-1">
                        <MathRenderer content={msg.explanation.finalAnswer} />
                      </div>
                    </div>

                    {/* 5. Why the Method Works & 6. Real World Analogy */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-2xl console-card border-white/10">
                        <h4 className="text-xs font-mono font-bold text-amber-300 mb-1 flex items-center gap-1.5">
                          <Lightbulb className="h-3.5 w-3.5 text-amber-400" />
                          <span>{t.tutor.whyMethodWorks}</span>
                        </h4>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {msg.explanation.whyMethodWorks}
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl console-card border-white/10">
                        <h4 className="text-xs font-mono font-bold text-cyan-300 mb-1 flex items-center gap-1.5">
                          <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                          <span>{t.tutor.realWorldAnalogy}</span>
                        </h4>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {msg.explanation.realWorldAnalogy}
                        </p>
                      </div>
                    </div>

                    {/* 7. Common Mistake to Avoid */}
                    <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-xs text-rose-200 flex items-start gap-2.5">
                      <AlertCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-rose-300 font-mono">{t.tutor.commonMistake}: </strong>
                        <span>{msg.explanation.commonMistakes}</span>
                      </div>
                    </div>

                    {/* 8. Quick Understanding Check Question (Interactive inside card!) */}
                    {msg.explanation.understandingCheckQuestion && (
                      <div className="p-5 rounded-2xl console-card-elevated border-cyan-500/30 space-y-3">
                        <h4 className="text-xs font-mono font-bold text-cyan-300 flex items-center gap-1.5">
                          <FileQuestion className="h-4 w-4 text-cyan-400" />
                          <span>{t.tutor.checkUnderstanding}</span>
                        </h4>
                        <p className="text-xs sm:text-sm font-medium text-white">
                          {msg.explanation.understandingCheckQuestion.question}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                          {msg.explanation.understandingCheckQuestion.options.map((opt, optIdx) => {
                            const isSelected = selectedOptions[msg.id] === optIdx;
                            const isCorrect = optIdx === msg.explanation!.understandingCheckQuestion.correctOptionIndex;
                            const hasAnswered = selectedOptions[msg.id] !== undefined;

                            return (
                              <button
                                key={optIdx}
                                onClick={() => {
                                  setSelectedOptions((prev) => ({ ...prev, [msg.id]: optIdx }));
                                  if (isCorrect) {
                                    confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
                                    addToast('🌟 Brilliant! +25 XP awarded for passing concept check!', 'success');
                                  }
                                }}
                                disabled={hasAnswered}
                                className={`p-3 rounded-xl text-xs text-left font-medium border transition-all ${
                                  hasAnswered
                                    ? isCorrect
                                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200 shadow-sm'
                                      : isSelected
                                      ? 'bg-rose-950/80 border-rose-500 text-rose-200'
                                      : 'console-card opacity-40 border-white/5 text-slate-500'
                                    : 'console-card border-white/10 hover:border-cyan-500/50 text-slate-200 hover:text-white'
                                }`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>

                        {selectedOptions[msg.id] !== undefined && (
                          <div className="pt-2 text-xs font-mono font-medium text-slate-300">
                            <strong className={selectedOptions[msg.id] === msg.explanation.understandingCheckQuestion.correctOptionIndex ? 'text-emerald-400' : 'text-amber-400'}>
                              {selectedOptions[msg.id] === msg.explanation.understandingCheckQuestion.correctOptionIndex ? '✓ Correct verification: ' : '💡 Analysis: '}
                            </strong>
                            <span>{msg.explanation.understandingCheckQuestion.explanation}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* 9. Suggested Next Topic & Practice Button */}
                    <div className="pt-3 flex flex-wrap items-center justify-between gap-3 text-xs border-t border-white/10">
                      <div className="text-slate-400 font-mono text-[11px]">
                        <span>{t.tutor.suggestedNext}: </span>
                        <strong className="text-white font-sans">{msg.explanation.suggestedNextTopic}</strong>
                      </div>

                      <button
                        onClick={() => handleAskQuestion(`Give me a practice problem on "${msg.explanation!.suggestedNextTopic}" and guide me step-by-step.`)}
                        className="px-4 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold transition-all"
                      >
                        {t.tutor.practiceSimilar} →
                      </button>
                    </div>

                  </div>
                )}

              </div>
            )}
          </div>
        ))}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-center gap-3 p-4 rounded-2xl console-card border-white/10 text-xs text-slate-300 max-w-sm animate-pulse">
            <Sparkles className="h-4 w-4 text-cyan-400 animate-spin" />
            <span className="font-mono">Synthesizing Socratic explanation...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* INPUT CONTROLS BAR */}
      <div className="console-card-elevated rounded-3xl p-3 sm:p-4 border-white/10 shadow-2xl space-y-2.5">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAskQuestion();
          }}
          className="flex items-center gap-2.5"
        >
          {/* Voice Input Toggle Button */}
          <button
            type="button"
            onClick={toggleSpeechRecognition}
            className={`p-3 rounded-2xl border transition-all ${
              isRecording
                ? 'bg-rose-500 text-white border-rose-400 animate-pulse shadow-lg shadow-rose-500/40'
                : 'border-white/10 text-slate-400 hover:text-white hover:bg-white/5 console-card'
            }`}
            title={isRecording ? 'Listening... click to stop' : 'Click to speak question'}
          >
            {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </button>

          {/* Question Text Input */}
          <input
            type="text"
            value={questionInput}
            onChange={(e) => setQuestionInput(e.target.value)}
            placeholder={t.tutor.inputPlaceholder}
            disabled={isLoading}
            className="flex-1 px-4 py-3 rounded-2xl border border-white/10 bg-slate-950/90 text-slate-100 placeholder:text-slate-500 text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 shadow-inner"
          />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!questionInput.trim() || isLoading}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs transition-all disabled:opacity-40 shadow-lg shadow-cyan-500/25 active:scale-95 flex items-center gap-1.5 cursor-pointer"
          >
            <span>{t.common.submit}</span>
            <Send className="h-3.5 w-3.5" />
          </button>
        </form>

        {/* Quick Suggestion Pills */}
        <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400 pt-1">
          <span className="font-mono text-slate-500">Fast Prompts:</span>
          <button
            onClick={() => handleAskQuestion('Find roots of 2x^2 - 7x + 3 = 0 using quadratic formula')}
            className="px-2.5 py-1 rounded-xl console-card border-white/10 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 font-mono transition-all"
          >
            2x² - 7x + 3 = 0
          </button>
          <button
            onClick={() => handleAskQuestion('How to calculate equivalent resistance for 6 ohm and 3 ohm in parallel?')}
            className="px-2.5 py-1 rounded-xl console-card border-white/10 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 font-mono transition-all"
          >
            Parallel Resistors
          </button>
          <button
            onClick={() => handleAskQuestion('Balance chemical equation: Fe + H2O -> Fe3O4 + H2')}
            className="px-2.5 py-1 rounded-xl console-card border-white/10 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 font-mono transition-all"
          >
            Balance Fe + H₂O
          </button>
          {language === 'te' && (
            <button
              onClick={() => handleAskQuestion('2x^2 - 7x + 3 = 0 వర్గ సమీకరణం యొక్క మూలాలను కనుగొనండి')}
              className="px-2.5 py-1 rounded-xl console-card border-white/10 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 font-mono transition-all"
            >
              తెలుగు వర్గ మూలాలు
            </button>
          )}
        </div>
      </div>

    </div>
  );
};
