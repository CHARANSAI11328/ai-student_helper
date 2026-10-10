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
  Award
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
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }

      addToast(`Quiz submitted! Scored ${score} / ${quizData.questions.length}`, 'success');
    } catch {
      addToast('Failed to submit quiz score.', 'error');
    }
  };

  const currentQ = quizData?.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === (quizData?.questions.length || 0) - 1;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* HEADER & TOPIC SELECTOR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
            Adaptive Socratic Quizzes
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            {t.quiz.title}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Topic Dropdown */}
          <select
            value={selectedTopicId}
            onChange={(e) => setSelectedTopicId(e.target.value)}
            className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold focus:outline-none"
          >
            {topics.map((tItem) => (
              <option key={tItem.id} value={tItem.id}>
                {tItem.subjectId.toUpperCase()}: {tItem.title}
              </option>
            ))}
          </select>

          {/* Timed Toggle */}
          <button
            onClick={() => setIsTimed(!isTimed)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
              isTimed
                ? 'bg-amber-100 border-amber-300 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                : 'bg-slate-100 border-slate-200 text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300'
            }`}
          >
            <Clock className="h-3.5 w-3.5" />
            <span>{isTimed ? `${timeLeft}s` : 'Timed'}</span>
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="p-12 text-center text-slate-500 space-y-2">
          <Sparkles className="h-8 w-8 animate-spin mx-auto text-brand-500" />
          <p className="text-sm font-semibold">Generating adaptive STEM questions...</p>
        </div>
      )}

      {/* QUIZ INTERACTIVE CARD */}
      {!isLoading && quizData && currentQ && !isSubmitted && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          
          {/* Progress Header */}
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold uppercase tracking-wider">
              Question {currentQuestionIndex + 1} of {quizData.questions.length}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 font-bold uppercase text-[10px]">
              {currentQ.difficulty} • Concept: {currentQ.concept}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-brand-500 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / quizData.questions.length) * 100}%` }}
            />
          </div>

          {/* Question Text with KaTeX */}
          <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
            <MathRenderer content={currentQ.question} />
          </div>

          {/* Socratic Hint */}
          {currentQ.hint && (
            <div className="p-3 bg-amber-50/70 dark:bg-amber-950/30 rounded-xl border border-amber-200/60 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-300 flex items-start gap-2">
              <Lightbulb className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <strong>Hint:</strong> {currentQ.hint}
              </div>
            </div>
          )}

          {/* Multiple Choice Options */}
          <div className="space-y-3 pt-2">
            {currentQ.options.map((option, optIdx) => {
              const isSelected = selectedAnswers[currentQuestionIndex] === optIdx;
              const hasAnswered = selectedAnswers[currentQuestionIndex] !== undefined;
              const isCorrect = optIdx === currentQ.correctAnswerIndex;

              return (
                <button
                  key={optIdx}
                  onClick={() => handleSelectOption(currentQuestionIndex, optIdx)}
                  className={`w-full p-4 rounded-2xl text-left text-sm font-medium border transition-all flex items-center justify-between ${
                    hasAnswered
                      ? isCorrect
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-950 dark:bg-emerald-950/60 dark:text-emerald-100 dark:border-emerald-700'
                        : isSelected
                        ? 'bg-rose-50 border-rose-400 text-rose-950 dark:bg-rose-950/60 dark:text-rose-100 dark:border-rose-700'
                        : 'bg-white dark:bg-slate-800/40 opacity-40 border-slate-200 dark:border-slate-800'
                      : isSelected
                      ? 'bg-brand-50 border-brand-500 text-brand-900 dark:bg-brand-950 dark:text-white'
                      : 'bg-white dark:bg-slate-800 hover:border-slate-400 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <MathRenderer content={option} />
                  {hasAnswered && isCorrect && <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 ml-2" />}
                  {hasAnswered && isSelected && !isCorrect && <XCircle className="h-5 w-5 text-rose-500 shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>

          {/* Instant Socratic Explanation on Selection */}
          {showExplanation[currentQuestionIndex] && (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm space-y-1.5 animate-fadeIn">
              <span className="font-bold text-slate-900 dark:text-white block">
                {selectedAnswers[currentQuestionIndex] === currentQ.correctAnswerIndex
                  ? '🎉 ' + t.quiz.correct
                  : '💡 ' + t.quiz.incorrect}
              </span>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                <MathRenderer content={currentQ.explanation} />
              </p>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentQuestionIndex === 0}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 disabled:opacity-30"
            >
              Previous
            </button>

            {isLastQuestion ? (
              <button
                onClick={handleSubmitQuiz}
                disabled={Object.keys(selectedAnswers).length < quizData.questions.length}
                className="px-6 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs transition-colors shadow-sm disabled:opacity-50"
              >
                Submit Quiz & Update Mastery
              </button>
            ) : (
              <button
                onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                className="px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold text-xs transition-colors flex items-center gap-1.5"
              >
                <span>Next Question</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

        </div>
      )}

      {/* POST-QUIZ ADAPTIVE EVALUATION RESULTS CARD */}
      {isSubmitted && submissionResult && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-md space-y-6 animate-fadeIn">
          
          <div className="text-center space-y-2">
            <div className="h-16 w-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 mx-auto">
              <Award className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Quiz Evaluation Complete!
            </h2>
            <p className="text-sm text-slate-500">
              Your mastery status and learning path have been updated.
            </p>
          </div>

          {/* Mastery Delta Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-xs text-slate-400 uppercase font-bold">New Mastery</span>
              <p className="text-2xl font-extrabold text-brand-600 dark:text-brand-400 mt-1">
                {Math.round(submissionResult.newMastery * 100)}%
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-xs text-slate-400 uppercase font-bold">Topic Status</span>
              <p className="text-lg font-extrabold text-slate-900 dark:text-white uppercase mt-1">
                {submissionResult.newStatus.replace('_', ' ')}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-xs text-slate-400 uppercase font-bold">XP Earned</span>
              <p className="text-2xl font-extrabold text-amber-500 mt-1">
                +80 XP
              </p>
            </div>
          </div>

          {/* Explainable Recommendation Banner */}
          {submissionResult.recommendation && (
            <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-200">
                {t.quiz.recommendedTopic}
              </span>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                {submissionResult.recommendation.recommendedTopicTitle}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {submissionResult.recommendation.reason}
              </p>
            </div>
          )}

          {/* Retake or Continue Actions */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => handleLoadQuiz(selectedTopicId)}
              className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Retake Quiz</span>
            </button>

            <Link
              to="/learning-path"
              className="px-6 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs transition-colors flex items-center gap-2 shadow-sm"
            >
              <span>View Updated Learning Path</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

        </div>
      )}

    </div>
  );
};
