import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  ArrowRight,
  RotateCcw,
  BookOpen,
  HelpCircle,
  Lightbulb,
  Award,
  Zap,
  Target
} from 'lucide-react';
import { useApp } from '../context/AppContext.js';
import { generateQuiz, submitQuiz, getTopics } from '../api/client.js';
import { QuizGeneration, Topic } from '../types/index.js';
import { MathRenderer } from '../components/MathRenderer.js';

export const QuizCenterPage: React.FC = () => {
  const { profile, t, addToast, refreshProfile } = useApp();
  const [searchParams] = useSearchParams();

  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopicId, setSelectedTopicId] = useState<string>('math-alg-quad');
  const [quizData, setQuizData] = useState<QuizGeneration | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Active quiz state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showExplanation, setShowExplanation] = useState<Record<number, boolean>>({});
  const [isTimed, setIsTimed] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<any>(null);

  useEffect(() => {
    getTopics().then((data) => {
      setTopics(data);
      const paramTopic = searchParams.get('topic');
      if (paramTopic) {
        setSelectedTopicId(paramTopic);
      } else if (data.length > 0) {
        setSelectedTopicId(data[0].id);
      }
    }).catch(() => {});
  }, [searchParams]);

  // Load or generate quiz when selectedTopicId changes
  useEffect(() => {
    if (selectedTopicId) {
      handleLoadQuiz(selectedTopicId);
    }
  }, [selectedTopicId]);

  // Timer countdown
  useEffect(() => {
    let timer: any;
    if (isTimed && !isSubmitted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isTimed && timeLeft === 0 && !isSubmitted) {
      handleSubmitQuiz();
    }
    return () => clearInterval(timer);
  }, [isTimed, timeLeft, isSubmitted]);

  const handleLoadQuiz = async (topicId: string) => {
    setIsLoading(true);
    setIsSubmitted(false);
    setSelectedAnswers({});
    setShowExplanation({});
    setCurrentQuestionIndex(0);
    setTimeLeft(120);

    try {
      const data = await generateQuiz(topicId);
      setQuizData(data);
    } catch {
      addToast('Failed to load quiz. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectOption = (qIdx: number, optIdx: number) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
    // Immediately show instant feedback
    setShowExplanation((prev) => ({ ...prev, [qIdx]: true }));
  };

  const handleSubmitQuiz = async () => {
    if (!quizData || isSubmitted) return;

    let score = 0;
    const wrongConcepts: string[] = [];

    quizData.questions.forEach((q, idx) => {
      const chosen = selectedAnswers[idx];
      if (chosen === q.correctAnswerIndex) {
        score += 1;
      } else {
        wrongConcepts.push(q.concept);
      }
    });

    setIsSubmitted(true);
    try {
      const res = await submitQuiz(
        quizData.topicId,
        score,
        quizData.questions.length,
        isTimed ? (120 - timeLeft) : 60,
        wrongConcepts
      );
      setSubmissionResult(res.evaluation);
      await refreshProfile();

      // Confetti celebratory burst on high score
      if (score >= quizData.questions.length * 0.7) {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      }

      addToast(`Diagnostic complete! Scored ${score} / ${quizData.questions.length}`, 'success');
    } catch {
      addToast('Failed to submit quiz score.', 'error');
    }
  };

  const currentQ = quizData?.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === (quizData?.questions.length || 0) - 1;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn text-slate-100">
      
      {/* HEADER & TOPIC SELECTOR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-800/80 text-[11px] font-mono font-semibold">
            <Target className="h-3.5 w-3.5 text-cyan-400" />
            <span>Adaptive Diagnostic Assessment</span>
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display">
            Concept Mastery Calibration Deck
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Topic Dropdown */}
          <select
            value={selectedTopicId}
            onChange={(e) => setSelectedTopicId(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl border border-white/15 bg-slate-950 text-slate-200 font-mono text-xs focus:ring-2 focus:ring-cyan-500 focus:outline-none"
          >
            {topics.map((tItem) => (
              <option key={tItem.id} value={tItem.id} className="bg-slate-900 text-white">
                {tItem.subjectId.toUpperCase()}: {tItem.title}
              </option>
            ))}
          </select>

          {/* Timed Toggle */}
          <button
            onClick={() => setIsTimed(!isTimed)}
            className={`px-3 py-2.5 rounded-xl text-xs font-mono font-semibold border transition-all flex items-center gap-1.5 ${
              isTimed
                ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-md shadow-amber-400/20'
                : 'console-card text-slate-300 border-white/10 hover:border-white/20'
            }`}
          >
            <Clock className="h-3.5 w-3.5" />
            <span>{isTimed ? `${timeLeft}s` : 'Timed Mode'}</span>
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="p-16 text-center space-y-3 console-card-elevated rounded-3xl border border-white/10">
          <Sparkles className="h-8 w-8 animate-spin mx-auto text-cyan-400" />
          <p className="text-sm font-bold text-white font-display">Synthesizing Adaptive Diagnostic Questions...</p>
          <p className="text-xs text-slate-400 font-mono">Calibrating difficulty against syllabus parameters</p>
        </div>
      )}

      {/* QUIZ INTERACTIVE CARD */}
      {!isLoading && quizData && currentQ && !isSubmitted && (
        <div className="console-card-elevated rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl space-y-6">
          
          {/* Progress Header */}
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-cyan-400"></span>
              Question {currentQuestionIndex + 1} of {quizData.questions.length}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 font-mono font-bold uppercase text-[10px] text-slate-300">
              Level: {currentQ.difficulty} • Concept: {currentQ.concept}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-white/5">
            <div
              className="bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-300 shadow-sm shadow-cyan-500/50"
              style={{ width: `${((currentQuestionIndex + 1) / quizData.questions.length) * 100}%` }}
            />
          </div>

          {/* Question Text with KaTeX */}
          <div className="text-base sm:text-lg font-bold text-white font-display leading-relaxed p-4 bg-slate-950/80 rounded-2xl border border-white/10 shadow-inner">
            <MathRenderer math={currentQ.question} displayMode={false} />
          </div>

          {/* Socratic Hint */}
          {currentQ.hint && (
            <div className="p-3.5 bg-amber-950/40 rounded-xl border border-amber-800/60 text-xs text-amber-200 flex items-start gap-2.5">
              <Lightbulb className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="font-mono uppercase text-amber-400 text-[10px]">Socratic Hint:</strong>{' '}
                <span className="text-amber-100">{currentQ.hint}</span>
              </div>
            </div>
          )}

          {/* Multiple Choice Options */}
          <div className="space-y-3 pt-1">
            {currentQ.options.map((option, optIdx) => {
              const isSelected = selectedAnswers[currentQuestionIndex] === optIdx;
              const hasAnswered = selectedAnswers[currentQuestionIndex] !== undefined;
              const isCorrect = optIdx === currentQ.correctAnswerIndex;

              return (
                <button
                  key={optIdx}
                  onClick={() => handleSelectOption(currentQuestionIndex, optIdx)}
                  className={`w-full p-4 rounded-2xl text-left text-sm font-medium border transition-all flex items-center justify-between active:scale-[0.99] ${
                    hasAnswered
                      ? isCorrect
                        ? 'bg-emerald-950/80 border-emerald-500 text-emerald-100 shadow-lg shadow-emerald-500/20'
                        : isSelected
                        ? 'bg-rose-950/80 border-rose-500 text-rose-100 shadow-lg shadow-rose-500/20'
                        : 'console-card opacity-30 border-white/5 text-slate-400'
                      : isSelected
                      ? 'bg-cyan-950/80 border-cyan-400 text-white shadow-lg shadow-cyan-500/20'
                      : 'console-card border-white/10 hover:border-cyan-400/50 text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="h-6 w-6 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center font-mono text-xs font-bold text-slate-400 shrink-0">
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <MathRenderer math={option} inline />
                  </div>
                  {hasAnswered && isCorrect && <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 ml-2" />}
                  {hasAnswered && isSelected && !isCorrect && <XCircle className="h-5 w-5 text-rose-400 shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>

          {/* Instant Socratic Explanation on Selection */}
          {showExplanation[currentQuestionIndex] && (
            <div className="p-4 rounded-2xl console-card border border-white/15 text-xs sm:text-sm space-y-1.5 animate-fadeIn">
              <span className="font-bold text-white font-display block">
                {selectedAnswers[currentQuestionIndex] === currentQ.correctAnswerIndex
                  ? '🎉 ' + t.quiz.correct + ' — Excellent conceptual deduction!'
                  : '💡 ' + t.quiz.incorrect + ' — Review derivation below:'}
              </span>
              <div className="text-slate-300 leading-relaxed pt-1">
                <MathRenderer math={currentQ.explanation} />
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <button
              onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentQuestionIndex === 0}
              className="px-4 py-2.5 rounded-xl text-xs font-mono font-semibold text-slate-400 hover:text-white disabled:opacity-20 transition-colors"
            >
              ← Previous Question
            </button>

            {isLastQuestion ? (
              <button
                onClick={handleSubmitQuiz}
                disabled={Object.keys(selectedAnswers).length < quizData.questions.length}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold font-display text-xs transition-all shadow-lg shadow-cyan-500/25 disabled:opacity-40 active:scale-95"
              >
                Submit Calibration & Update Mastery
              </button>
            ) : (
              <button
                onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs transition-all flex items-center gap-1.5 shadow-md shadow-cyan-500/20 active:scale-95"
              >
                <span>Next Question</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

        </div>
      )}

      {/* POST-QUIZ ADAPTIVE EVALUATION RESULTS PODIUM */}
      {isSubmitted && submissionResult && (
        <div className="console-card-elevated rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl space-y-6 animate-fadeIn">
          
          <div className="text-center space-y-2.5">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white mx-auto shadow-xl shadow-cyan-500/30 border border-white/20">
              <Award className="h-8 w-8" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
              Diagnostic Calibration Complete!
            </h2>
            <p className="text-sm text-slate-400 font-mono">
              Your syllabus telemetry has been updated in the adaptive engine.
            </p>
          </div>

          {/* Mastery Delta Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-2xl console-card border border-white/10">
              <span className="text-[10px] text-slate-400 uppercase font-mono font-bold block mb-1">Updated Mastery</span>
              <p className="text-3xl font-extrabold text-cyan-400 font-mono">
                {Math.round(submissionResult.newMastery * 100)}%
              </p>
            </div>

            <div className="p-4 rounded-2xl console-card border border-white/10">
              <span className="text-[10px] text-slate-400 uppercase font-mono font-bold block mb-1">Topic Classification</span>
              <p className="text-lg font-extrabold text-white uppercase font-mono mt-1">
                {submissionResult.newStatus.replace('_', ' ')}
              </p>
            </div>

            <div className="p-4 rounded-2xl console-card border border-white/10">
              <span className="text-[10px] text-slate-400 uppercase font-mono font-bold block mb-1">Experience Gained</span>
              <p className="text-3xl font-extrabold text-amber-400 font-mono">
                +80 XP
              </p>
            </div>
          </div>

          {/* Explainable Recommendation Banner */}
          {submissionResult.recommendation && (
            <div className="p-5 rounded-2xl bg-cyan-950/60 border border-cyan-800/80 space-y-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-cyan-300" />
                Adaptive Recommendation Target
              </span>
              <h4 className="font-bold text-base text-white font-display">
                {submissionResult.recommendation.recommendedTopicTitle}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {submissionResult.recommendation.reason}
              </p>
            </div>
          )}

          {/* Retake or Continue Actions */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => handleLoadQuiz(selectedTopicId)}
              className="px-5 py-2.5 rounded-xl console-card border border-white/15 hover:border-white/30 text-slate-200 font-semibold text-xs flex items-center gap-2 active:scale-95 transition-all"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Retake Diagnostic</span>
            </button>

            <Link
              to="/learning-path"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs transition-all flex items-center gap-2 shadow-lg shadow-cyan-500/25 active:scale-95"
            >
              <span>Inspect Adaptive Roadmap</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

        </div>
      )}

    </div>
  );
};
