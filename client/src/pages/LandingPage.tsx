import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Camera,
  Layers,
  Map,
  CheckCircle2,
  Brain,
  Globe,
  Mic,
  ArrowRight,
  ShieldCheck,
  Check,
  X,
  Calculator,
  Atom,
  FlaskConical,
  Flame,
  Award
} from 'lucide-react';
import { useApp } from '../context/AppContext.js';
import { MathRenderer } from '../components/MathRenderer.js';

export const LandingPage: React.FC = () => {
  const { t, loadDemoStudent } = useApp();
  const navigate = useNavigate();

  const [sandboxQuestion, setSandboxQuestion] = useState('Solve 2x^2 - 7x + 3 = 0 using the quadratic formula');
  const [sandboxAnswerVisible, setSandboxAnswerVisible] = useState(false);

  const handleStartTour = async () => {
    await loadDemoStudent();
    navigate('/dashboard');
  };

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50/50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-950 py-16 sm:py-24 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            
            {/* Mission Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100 text-brand-800 dark:bg-brand-950/80 dark:text-brand-300 text-xs font-semibold mb-6 shadow-sm border border-brand-200 dark:border-brand-800">
              <Sparkles className="h-3.5 w-3.5 text-brand-500" />
              <span>National Hackathon Challenge — Educational AI for School Students</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight sm:leading-none">
              A Personal AI Teacher That Explains the <span className="text-brand-500 bg-clip-text text-transparent bg-gradient-to-r from-brand-500 to-indigo-600">"Why"</span>, Not Just Answers.
            </h1>

            {/* Subtitle */}
            <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              Empowering Grades 6–12 school children in <strong className="text-slate-800 dark:text-slate-100 font-semibold">Mathematics, Physics & Chemistry</strong> through step-by-step Socratic guidance, handwriting OCR, native multilingual voice, and an observable adaptive learning loop.
            </p>

            {/* Call to Actions */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={handleStartTour}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-brand-500 to-indigo-600 text-white font-semibold text-sm shadow-lg shadow-brand-500/25 hover:from-brand-600 hover:to-indigo-700 transition-all flex items-center gap-2 group cursor-pointer"
              >
                <span>Launch Interactive Judge Demo</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <Link
                to="/tutor"
                className="px-6 py-3.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 font-semibold text-sm transition-all flex items-center gap-2 shadow-sm"
              >
                <Brain className="h-4 w-4 text-brand-500" />
                <span>Open AI Tutor Workspace</span>
              </Link>
            </div>

            {/* Trust Pills */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Child-Safe Pedagogy (No Cheating)
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" /> English, Telugu & Hindi
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Low-Bandwidth / Offline PWA
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* INTERACTIVE SANDBOX PREVIEW */}
      <section className="py-12 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Try Learnova's Socratic Step-by-Step Breakdown
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Select a sample problem to preview the structured 9-part pedagogical breakdown.
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex flex-wrap gap-2 mb-4">
              <button
                onClick={() => {
                  setSandboxQuestion('Solve 2x^2 - 7x + 3 = 0 using the quadratic formula');
                  setSandboxAnswerVisible(true);
                }}
                className="text-xs px-3 py-1.5 rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 font-medium hover:bg-blue-200 transition-colors"
              >
                📐 Math: Quadratic Roots ($2x^2 - 7x + 3 = 0$)
              </button>
              <button
                onClick={() => {
                  setSandboxQuestion('Two resistors 6Ω and 3Ω are in parallel across 12V. Find total resistance and current.');
                  setSandboxAnswerVisible(true);
                }}
                className="text-xs px-3 py-1.5 rounded-lg bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 font-medium hover:bg-purple-200 transition-colors"
              >
                ⚡ Physics: Parallel Circuits (6Ω & 3Ω across 12V)
              </button>
              <button
                onClick={() => {
                  setSandboxQuestion('Balance the reaction: Fe + H2O -> Fe3O4 + H2 step by step');
                  setSandboxAnswerVisible(true);
                }}
                className="text-xs px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-medium hover:bg-emerald-200 transition-colors"
              >
                🧪 Chemistry: Balancing Iron Oxidation ($Fe + H_2O \rightarrow Fe_3O_4 + H_2$)
              </button>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <input
                type="text"
                value={sandboxQuestion}
                onChange={(e) => setSandboxQuestion(e.target.value)}
                className="flex-1 px-4 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <button
                onClick={() => setSandboxAnswerVisible(true)}
                className="px-5 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold text-xs transition-colors"
              >
                Explain Socratic Way
              </button>
            </div>

            {/* Socratic Output Card */}
            {sandboxAnswerVisible && (
              <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                    Step-by-Step Pedagogical Breakdown
                  </span>
                  <span className="text-[11px] font-medium text-slate-500">
                    Grade 10 Context
                  </span>
                </div>

                {sandboxQuestion.includes('2x^2') ? (
                  <div className="space-y-3 text-sm">
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-white text-xs uppercase text-slate-400">1. Problem Intent:</h4>
                      <p className="text-slate-700 dark:text-slate-300 mt-0.5">Find roots of quadratic equation $2x^2 - 7x + 3 = 0$ using algebraic principles.</p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold text-slate-900 dark:text-white text-xs uppercase text-slate-400">2. Derivation Steps:</h4>
                      <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-lg space-y-1.5">
                        <p className="font-medium text-xs text-brand-700 dark:text-brand-300">Step 1: Identify coefficients</p>
                        <MathRenderer content="$a = 2,\; b = -7,\; c = 3$" />
                      </div>
                      <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-lg space-y-1.5">
                        <p className="font-medium text-xs text-brand-700 dark:text-brand-300">Step 2: Compute Discriminant ($D = b^2 - 4ac$)</p>
                        <MathRenderer content="$$D = (-7)^2 - 4(2)(3) = 49 - 24 = 25 > 0$$" />
                        <p className="text-xs text-slate-500">Since $D &gt; 0$, there are two real distinct roots.</p>
                      </div>
                      <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-lg space-y-1.5">
                        <p className="font-medium text-xs text-brand-700 dark:text-brand-300">Step 3: Apply Quadratic Formula</p>
                        <MathRenderer content="$$x = \frac{-(-7) \pm \sqrt{25}}{2(2)} = \frac{7 \pm 5}{4}$$" />
                        <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">Roots: $x_1 = 3$ and $x_2 = \frac{1}{2}$</p>
                      </div>
                    </div>

                    <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-lg border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300">
                      <strong>⚠️ Common Mistake:</strong> Evaluating $-b$ as $-7$ when $b = -7$. Remember: $-(-7) = +7$.
                    </div>
                  </div>
                ) : sandboxQuestion.includes('resistors') ? (
                  <div className="space-y-3 text-sm">
                    <p className="font-semibold text-slate-900 dark:text-white">Parallel Resistance Formula:</p>
                    <MathRenderer content="$$\frac{1}{R_{eq}} = \frac{1}{6} + \frac{1}{3} = \frac{3}{6} = \frac{1}{2}\,\Omega^{-1} \implies R_{eq} = 2\,\Omega$$" />
                    <p className="font-semibold text-slate-900 dark:text-white">Total Current (Ohm's Law $I = V / R$):</p>
                    <MathRenderer content="$$I = \frac{12\,\text{V}}{2\,\Omega} = 6\,\text{A}$$" />
                  </div>
                ) : (
                  <div className="space-y-3 text-sm">
                    <p className="font-semibold text-slate-900 dark:text-white">Balanced Chemical Equation:</p>
                    <MathRenderer content="$$3\text{Fe} + 4\text{H}_2\text{O} \rightarrow \text{Fe}_3\text{O}_4 + 4\text{H}_2$$" />
                    <p className="text-xs text-slate-500">Conservation of mass verified: Fe: 3=3, H: 8=8, O: 4=4.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CORE DIFFERENTIATING PILLARS */}
      <section className="py-16 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
              Why Learnova AI Wins in Education
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm">
              Engineered to meet pedagogical guidelines and solve the real problems of school education.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Pillar 1 */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-xl bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-5">
                <Camera className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Multimodal Vision Lab
              </h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Accepts smartphone photos of messy handwritten equations, textbook problems, and scientific diagrams. Extracted LaTeX equations are editable so students verify transcription before solving.
              </p>
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <Link to="/vision-lab" className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1">
                  Try Vision & Handwriting Lab →
                </Link>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-xl bg-purple-100 dark:bg-purple-950 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-5">
                <Map className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Observable Adaptive Engine
              </h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Not a black box. When a student misses a question in a quiz, Learnova pinpoints the exact prerequisite gap (e.g. negative discriminant signs), marks the topic for revision, and adapts the roadmap.
              </p>
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <Link to="/learning-path" className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1">
                  View Personalized Roadmap →
                </Link>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-5">
                <Globe className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Native Multilingual & Voice
              </h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Full support for English, Telugu (తెలుగు), and Hindi (हिन्दी). The AI explains concepts naturally in native languages while strictly preserving international mathematical notation ($E=mc^2$).
              </p>
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <Link to="/tutor" className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1">
                  Experience Voice & Multilingual →
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* COMPARISON TABLE: CHATBOT VS LEARNOVA */}
      <section className="py-16 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Generic AI Chatbot vs. Learnova AI
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Why traditional chatbots fail in school learning and how Learnova fixes it.
            </p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200">
                <tr>
                  <th className="p-3.5 font-semibold">Educational Capability</th>
                  <th className="p-3.5 font-semibold text-slate-500">Generic Chatbot</th>
                  <th className="p-3.5 font-semibold text-brand-600 dark:text-brand-400">Learnova AI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-600 dark:text-slate-300">
                <tr>
                  <td className="p-3.5 font-medium">Socratic Guidance</td>
                  <td className="p-3.5 text-rose-500 flex items-center gap-1"><X className="h-4 w-4" /> Dumps direct answer</td>
                  <td className="p-3.5 text-emerald-600 font-semibold"><Check className="h-4 w-4 inline" /> 9-step pedagogical breakdown</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-medium">Handwriting Uncertainty</td>
                  <td className="p-3.5 text-rose-500"><X className="h-4 w-4 inline" /> Hallucinates illegible ink</td>
                  <td className="p-3.5 text-emerald-600 font-semibold"><Check className="h-4 w-4 inline" /> Flags ambiguity & prompts student</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-medium">Math & Formula Rendering</td>
                  <td className="p-3.5 text-rose-500"><X className="h-4 w-4 inline" /> Raw unrendered text</td>
                  <td className="p-3.5 text-emerald-600 font-semibold"><Check className="h-4 w-4 inline" /> Crisp KaTeX mathematical typesetting</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-medium">Adaptive Mastery Loop</td>
                  <td className="p-3.5 text-rose-500"><X className="h-4 w-4 inline" /> Zero memory of weak topics</td>
                  <td className="p-3.5 text-emerald-600 font-semibold"><Check className="h-4 w-4 inline" /> Tracks mistakes & adapts syllabus</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-medium">Offline & Low Bandwidth</td>
                  <td className="p-3.5 text-rose-500"><X className="h-4 w-4 inline" /> Completely broken offline</td>
                  <td className="p-3.5 text-emerald-600 font-semibold"><Check className="h-4 w-4 inline" /> Service Worker & cached notes/formulas</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="py-16 bg-gradient-to-r from-brand-500 to-indigo-600 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-3xl font-extrabold">
            Ready to Experience the Future of STEM Education?
          </h2>
          <p className="text-brand-100 max-w-xl mx-auto text-sm sm:text-base">
            Explore the live student dashboard, test your knowledge in the quiz center, and see the adaptive engine adjust recommendations in real time.
          </p>
          <div className="pt-2">
            <button
              onClick={handleStartTour}
              className="px-8 py-3.5 rounded-xl bg-white text-brand-700 font-bold text-sm shadow-xl hover:bg-slate-100 transition-all cursor-pointer"
            >
              Start Exploring Learnova AI Now
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
