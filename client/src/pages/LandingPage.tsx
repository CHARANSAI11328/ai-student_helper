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
  Award,
  Zap,
  Terminal,
  Cpu,
  BookOpen,
  HelpCircle,
  Sliders,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../context/AppContext.js';
import { MathRenderer } from '../components/MathRenderer.js';
import { HeroCanvasPhysics } from '../components/HeroCanvasPhysics.js';

export const LandingPage: React.FC = () => {
  const { t, loadDemoStudent } = useApp();
  const navigate = useNavigate();

  const [sandboxQuestion, setSandboxQuestion] = useState('Solve 2x^2 - 7x + 3 = 0 using the quadratic formula');
  const [sandboxAnswerVisible, setSandboxAnswerVisible] = useState(true);
  const [activeSubjectTab, setActiveSubjectTab] = useState<'math' | 'physics' | 'chemistry'>('math');

  const handleStartTour = async () => {
    await loadDemoStudent();
    navigate('/dashboard');
  };

  const sampleProblems = {
    math: {
      label: 'Algebraic Roots',
      query: 'Solve 2x^2 - 7x + 3 = 0 using the quadratic formula',
      icon: Calculator,
      tag: 'Grade 10 Mathematics',
      intent: 'Find roots of quadratic equation 2x^2 - 7x + 3 = 0 using algebraic discriminant analysis.',
      steps: [
        {
          title: 'Extract Standard Coefficients',
          formula: 'ax^2 + bx + c = 0 \\implies a = 2,\\; b = -7,\\; c = 3',
          desc: 'Compare the equation with the standard quadratic form.'
        },
        {
          title: 'Evaluate Discriminant (D = b² - 4ac)',
          formula: 'D = (-7)^2 - 4(2)(3) = 49 - 24 = 25 > 0',
          desc: 'Since D > 0 and a perfect square, two distinct rational roots exist.'
        },
        {
          title: 'Apply Quadratic Formula',
          formula: 'x = \\frac{-(-7) \\pm \\sqrt{25}}{2(2)} = \\frac{7 \\pm 5}{4}',
          desc: 'Split into positive and negative branches to yield x₁ = 3 and x₂ = 1/2.'
        }
      ],
      finalAnswer: 'x = 3 \\quad \\text{and} \\quad x = \\frac{1}{2}',
      mistake: 'Evaluating -b as -7 instead of -(-7) = +7 when b is negative.',
      analogy: 'The discriminant acts like a traffic signal: D > 0 is green (2 roots), D = 0 is yellow (1 repeated root), D < 0 is red (no real roots).'
    },
    physics: {
      label: 'Parallel Circuits',
      query: 'Two resistors 6Ω and 3Ω are in parallel across 12V. Find total resistance and current.',
      icon: Atom,
      tag: 'Grade 10 Physics (Electricity)',
      intent: 'Calculate equivalent parallel resistance and circuit current using Ohm\'s Law.',
      steps: [
        {
          title: 'Calculate Equivalent Resistance (1/Req)',
          formula: '\\frac{1}{R_{eq}} = \\frac{1}{6\\,\\Omega} + \\frac{1}{3\\,\\Omega} = \\frac{1 + 2}{6} = \\frac{3}{6} = \\frac{1}{2}\\,\\Omega^{-1}',
          desc: 'In parallel circuits, reciprocal resistances add together.'
        },
        {
          title: 'Invert to Find Req',
          formula: 'R_{eq} = 2\\,\\Omega',
          desc: 'Notice equivalent resistance (2Ω) is strictly less than each branch resistor (3Ω, 6Ω).'
        },
        {
          title: 'Apply Ohm\'s Law (I = V / R)',
          formula: 'I = \\frac{12\\,\\text{V}}{2\\,\\Omega} = 6\\,\\text{A}',
          desc: 'The total current drawn from the 12V source is 6 Amperes.'
        }
      ],
      finalAnswer: 'R_{eq} = 2\\,\\Omega, \\quad I_{total} = 6\\,\\text{A}',
      mistake: 'Forgetting to take the reciprocal at the end and concluding Req = 0.5Ω.',
      analogy: 'Opening a second checkout lane at a grocery store always speeds up customer traffic (lowers overall resistance).'
    },
    chemistry: {
      label: 'Chemical Balancing',
      query: 'Balance the reaction: Fe + H2O -> Fe3O4 + H2 step by step',
      icon: FlaskConical,
      tag: 'Grade 10 Chemistry (Reactions)',
      intent: 'Balance the oxidation of iron by steam according to the Law of Conservation of Mass.',
      steps: [
        {
          title: 'Balance Iron (Fe) Atoms',
          formula: '3\\text{Fe} + \\text{H}_2\\text{O} \\rightarrow \\text{Fe}_3\\text{O}_4 + \\text{H}_2',
          desc: 'Fe3O4 has 3 iron atoms on the right, requiring coefficient 3 for Fe on the left.'
        },
        {
          title: 'Balance Oxygen (O) Atoms',
          formula: '3\\text{Fe} + 4\\text{H}_2\\text{O} \\rightarrow \\text{Fe}_3\\text{O}_4 + \\text{H}_2',
          desc: 'Fe3O4 contains 4 oxygens, requiring 4 molecules of H2O.'
        },
        {
          title: 'Balance Hydrogen (H) Atoms',
          formula: '3\\text{Fe} + 4\\text{H}_2\\text{O} \\rightarrow \\text{Fe}_3\\text{O}_4 + 4\\text{H}_2',
          desc: '4H2O has 8 hydrogen atoms; balance with 4H2 on the right side.'
        }
      ],
      finalAnswer: '3\\text{Fe} + 4\\text{H}_2\\text{O} \\rightarrow \\text{Fe}_3\\text{O}_4 + 4\\text{H}_2',
      mistake: 'Changing chemical subscripts (e.g. writing Fe3 or H8O4) instead of stoichiometric coefficients.',
      analogy: 'Baking a cake: you cannot alter the recipe molecule, you only change the number of cups of flour.'
    }
  };

  const currentProblem = sampleProblems[activeSubjectTab];

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-black">
      
      {/* ═══════════════════════════════════════════════════════════════════
          1. HERO SECTION WITH INTERACTIVE CANVAS PHYSICS & SPECTRAL GLOW
         ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden border-b border-white/10 bg-obsidian-grid py-20 lg:py-28">
        
        {/* Interactive HTML5 Gravitational Particle Canvas */}
        <HeroCanvasPhysics />

        {/* Spectral Glow Wells */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-cyan-600/20 via-purple-600/20 to-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -top-24 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 left-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          {/* Scientific Telemetry Badge */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-medium mb-8 backdrop-blur-xl shadow-lg shadow-cyan-950/50">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span className="tracking-wide uppercase text-[11px]">CBSE & ICSE STEM · SOCRATIC PEDAGOGICAL AI</span>
            <span className="px-1.5 py-0.5 rounded bg-cyan-950 text-[10px] text-cyan-300 font-bold border border-cyan-800">
              CLASS 6–12
            </span>
          </div>

          {/* Main Cinematic Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1] max-w-4xl mx-auto">
            A Personal AI Teacher That Explains the{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent underline decoration-cyan-500/30 decoration-wavy decoration-2">
              "Why"
            </span>
            , Not Just Answers.
          </h1>

          {/* Subtitle with Editorial Clarity */}
          <p className="mt-6 text-base sm:text-xl text-slate-300/90 leading-relaxed max-w-2xl mx-auto font-normal">
            Empowering school students across <strong className="text-white font-semibold">Mathematics, Physics & Chemistry</strong> through step-by-step Socratic inquiry, handwriting OCR, native multilingual voice, and an observable adaptive curriculum loop.
          </p>

          {/* Call to Actions (Tactile Glowing Console Buttons) */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={handleStartTour}
              className="relative group px-7 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-white font-semibold text-sm shadow-xl shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2.5 cursor-pointer overflow-hidden border border-white/20"
            >
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              <Sparkles className="h-4 w-4 text-cyan-200 animate-pulse" />
              <span>Launch Interactive Judge Demo</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <Link
              to="/tutor"
              className="px-6 py-4 rounded-2xl console-card hover:border-cyan-500/40 text-slate-200 hover:text-white font-semibold text-sm transition-all flex items-center gap-2.5 hover:shadow-lg hover:shadow-slate-900/50"
            >
              <Brain className="h-4 w-4 text-cyan-400" />
              <span>Open AI Tutor Workspace</span>
            </Link>
          </div>

          {/* Real-time Telemetry Ribbons */}
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto text-left font-mono text-xs">
            <div className="console-card p-3 rounded-xl border-white/5 flex items-center gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <div>
                <div className="text-[10px] text-slate-400 uppercase">Pedagogy</div>
                <div className="font-semibold text-slate-200">Zero-Cheating</div>
              </div>
            </div>

            <div className="console-card p-3 rounded-xl border-white/5 flex items-center gap-2.5">
              <Camera className="h-4 w-4 text-cyan-400 shrink-0" />
              <div>
                <div className="text-[10px] text-slate-400 uppercase">Vision Lab</div>
                <div className="font-semibold text-slate-200">Handwriting OCR</div>
              </div>
            </div>

            <div className="console-card p-3 rounded-xl border-white/5 flex items-center gap-2.5">
              <Globe className="h-4 w-4 text-purple-400 shrink-0" />
              <div>
                <div className="text-[10px] text-slate-400 uppercase">Languages</div>
                <div className="font-semibold text-slate-200">EN · TE · HI</div>
              </div>
            </div>

            <div className="console-card p-3 rounded-xl border-white/5 flex items-center gap-2.5">
              <Zap className="h-4 w-4 text-amber-400 shrink-0" />
              <div>
                <div className="text-[10px] text-slate-400 uppercase">Availability</div>
                <div className="font-semibold text-slate-200">Offline PWA</div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          2. INTERACTIVE SOCRATIC BREAKDOWN INSTRUMENT (LIVE WORKBENCH)
         ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-slate-950 relative border-b border-white/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-semibold uppercase tracking-wider mb-2">
                <Sliders className="h-4 w-4" />
                <span>Instrument 01 · Socratic Decomposition Engine</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Inspect a Live 9-Step Pedagogical Derivation
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Notice how Learnova isolates parameters, checks prerequisite principles, and explains the intuition before rendering the solution.
              </p>
            </div>

            {/* Subject Selector Tabs */}
            <div className="flex p-1 rounded-xl console-card border-white/10 self-start md:self-auto">
              <button
                onClick={() => {
                  setActiveSubjectTab('math');
                  setSandboxQuestion(sampleProblems.math.query);
                  setSandboxAnswerVisible(true);
                }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeSubjectTab === 'math'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Calculator className="h-3.5 w-3.5" />
                <span>Math</span>
              </button>

              <button
                onClick={() => {
                  setActiveSubjectTab('physics');
                  setSandboxQuestion(sampleProblems.physics.query);
                  setSandboxAnswerVisible(true);
                }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeSubjectTab === 'physics'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Atom className="h-3.5 w-3.5" />
                <span>Physics</span>
              </button>

              <button
                onClick={() => {
                  setActiveSubjectTab('chemistry');
                  setSandboxQuestion(sampleProblems.chemistry.query);
                  setSandboxAnswerVisible(true);
                }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeSubjectTab === 'chemistry'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <FlaskConical className="h-3.5 w-3.5" />
                <span>Chemistry</span>
              </button>
            </div>
          </div>

          {/* Scientific Console Card */}
          <div className="console-card-elevated rounded-3xl p-6 sm:p-8 border-white/10 shadow-2xl relative overflow-hidden">
            
            {/* Header bar */}
            <div className="flex flex-wrap items-center justify-between pb-5 border-b border-white/10 gap-2">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-rose-500/80" />
                <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                <span className="font-mono text-xs text-slate-400 ml-2">
                  Console telemetry // {currentProblem.tag}
                </span>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-cyan-950 text-cyan-300 font-mono text-[11px] border border-cyan-800">
                KaTeX Formula Typesetting Active
              </span>
            </div>

            {/* Input display */}
            <div className="mt-5 p-4 rounded-2xl bg-black/40 border border-white/5 flex items-center gap-3">
              <Terminal className="h-5 w-5 text-cyan-400 shrink-0" />
              <div className="flex-1 font-mono text-sm text-slate-200 overflow-x-auto">
                {sandboxQuestion}
              </div>
              <button
                onClick={() => setSandboxAnswerVisible(!sandboxAnswerVisible)}
                className="px-3.5 py-1.5 rounded-xl bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 font-semibold text-xs border border-cyan-500/30 transition-colors"
              >
                {sandboxAnswerVisible ? 'Collapse' : 'Decompose'}
              </button>
            </div>

            {/* Socratic Breakdown Body */}
            {sandboxAnswerVisible && (
              <div className="mt-6 space-y-6 animate-fadeIn">
                
                {/* 1. Problem Intent */}
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 space-y-1">
                  <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                    <span>01. Student Problem Intent</span>
                  </div>
                  <p className="text-sm text-slate-200">
                    {currentProblem.intent}
                  </p>
                </div>

                {/* 2. Step-by-Step Derivation */}
                <div className="space-y-3">
                  <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Sliders className="h-3.5 w-3.5 text-purple-400" />
                    <span>02. Socratic Derivation Steps</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {currentProblem.steps.map((st, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-slate-900/80 border border-white/5 space-y-2 flex flex-col justify-between hover:border-cyan-500/30 transition-all">
                        <div>
                          <div className="flex items-center justify-between text-xs font-semibold text-cyan-300">
                            <span>Step 0{idx + 1}</span>
                            <span className="text-[10px] font-mono text-slate-500">Verified</span>
                          </div>
                          <h4 className="text-xs font-bold text-white mt-1">{st.title}</h4>
                        </div>
                        <div className="p-2.5 rounded-xl bg-black/50 border border-white/5 text-center">
                          <MathRenderer content={`$$${st.formula}$$`} />
                        </div>
                        <p className="text-[11px] text-slate-400 leading-tight">
                          {st.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Conclusive Result */}
                <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400">
                      03. Conclusive Verified Answer
                    </span>
                    <div className="mt-1 text-base text-emerald-200 font-bold">
                      <MathRenderer content={`$$${currentProblem.finalAnswer}$$`} />
                    </div>
                  </div>
                  <Link
                    to="/tutor"
                    className="self-start sm:self-auto px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1"
                  >
                    <span>Ask Your Own in AI Tutor</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>

                {/* 4. Exam Pitfall & Intuition Analogy Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 text-xs text-amber-200 space-y-1">
                    <div className="font-bold font-mono uppercase text-amber-400 flex items-center gap-1.5 text-[11px]">
                      <span>⚠️ Common Exam Mistake to Avoid</span>
                    </div>
                    <p className="leading-relaxed text-amber-200/90">{currentProblem.mistake}</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 text-xs text-indigo-200 space-y-1">
                    <div className="font-bold font-mono uppercase text-indigo-400 flex items-center gap-1.5 text-[11px]">
                      <span>💡 Everyday Intuitive Analogy</span>
                    </div>
                    <p className="leading-relaxed text-indigo-200/90">{currentProblem.analogy}</p>
                  </div>
                </div>

              </div>
            )}

          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          3. CORE ARCHITECTURAL PILLARS (THE THREE SCIENTIFIC INSTRUMENTS)
         ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-obsidian-grid relative border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-cyan-400 font-mono text-xs font-semibold uppercase tracking-wider">
              Engineered For National Hackathon Excellence
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 tracking-tight">
              Why Learnova Outperforms Traditional Chatbots
            </h2>
            <p className="text-slate-400 mt-3 text-sm sm:text-base">
              Generic LLMs guess answers and hallucinate messy handwritten equations. Learnova acts like an accredited teacher equipped with verified scientific instruments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Instrument 01: Multimodal Vision & Slate */}
            <div className="console-card-elevated p-7 rounded-3xl border-white/10 hover:border-cyan-500/40 transition-all group flex flex-col justify-between">
              <div>
                <div className="h-12 w-12 rounded-2xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-cyan-500/30 transition-all">
                  <Camera className="h-6 w-6" />
                </div>
                <div className="text-xs font-mono text-cyan-400 uppercase font-semibold">Instrument 01</div>
                <h3 className="text-xl font-bold text-white mt-1">
                  Vision Lab & Digital Slate
                </h3>
                <p className="mt-3 text-sm text-slate-300 leading-relaxed">
                  Accepts smartphone snapshots of messy student handwriting, textbook problems, and blackboard diagrams. Extracted equations are converted into editable LaTeX with confidence scoring before solving.
                </p>
              </div>
              <div className="mt-6 pt-5 border-t border-white/10">
                <Link
                  to="/vision-lab"
                  className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 group-hover:translate-x-1 transition-transform"
                >
                  <span>Launch Vision Lab & Slate</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            {/* Instrument 02: Observable Adaptive Learning Graph */}
            <div className="console-card-elevated p-7 rounded-3xl border-white/10 hover:border-purple-500/40 transition-all group flex flex-col justify-between">
              <div>
                <div className="h-12 w-12 rounded-2xl bg-purple-950/80 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-purple-500/30 transition-all">
                  <Map className="h-6 w-6" />
                </div>
                <div className="text-xs font-mono text-purple-400 uppercase font-semibold">Instrument 02</div>
                <h3 className="text-xl font-bold text-white mt-1">
                  Observable Knowledge Tree
                </h3>
                <p className="mt-3 text-sm text-slate-300 leading-relaxed">
                  Not a black box. When a student misses a problem in a diagnostic quiz, Learnova traces the root prerequisite failure (e.g. negative discriminant sign error), flags the concept, and dynamically adapts the syllabus roadmap.
                </p>
              </div>
              <div className="mt-6 pt-5 border-t border-white/10">
                <Link
                  to="/learning-path"
                  className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1.5 group-hover:translate-x-1 transition-transform"
                >
                  <span>Explore Adaptive Knowledge Tree</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            {/* Instrument 03: Native Multilingual & Voice */}
            <div className="console-card-elevated p-7 rounded-3xl border-white/10 hover:border-emerald-500/40 transition-all group flex flex-col justify-between">
              <div>
                <div className="h-12 w-12 rounded-2xl bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-emerald-500/30 transition-all">
                  <Globe className="h-6 w-6" />
                </div>
                <div className="text-xs font-mono text-emerald-400 uppercase font-semibold">Instrument 03</div>
                <h3 className="text-xl font-bold text-white mt-1">
                  Multilingual Voice Engine
                </h3>
                <p className="mt-3 text-sm text-slate-300 leading-relaxed">
                  Complete native spoken voice explanations in English, Telugu (తెలుగు), and Hindi (हिन्दी). The AI speaks conversational native dialects while strictly keeping international mathematical notation ($E=mc^2$) intact.
                </p>
              </div>
              <div className="mt-6 pt-5 border-t border-white/10">
                <Link
                  to="/tutor"
                  className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 group-hover:translate-x-1 transition-transform"
                >
                  <span>Experience Spoken Multilingual Voice</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          4. STEM INTERACTIVE SIMULATORS PREVIEW SPOTLIGHT
         ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-slate-950 relative border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="console-card-elevated rounded-3xl p-8 sm:p-10 border-white/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-500/30 text-indigo-300 text-xs font-mono font-medium mb-4">
                  <Sliders className="h-3.5 w-3.5 text-indigo-400" />
                  <span>Interactive STEM Laboratories</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white">
                  Real-time Physics, Geometry & Chemistry Simulators
                </h3>
                <p className="mt-3 text-slate-300 text-sm leading-relaxed">
                  Students don't just read theory; they touch and manipulate equations. Drag parabola vertex coefficients ($y=ax^2+bx+c$), launch projectile cannons with velocity and angle vectors, and watch chemical atoms balance dynamically in real time.
                </p>

                <div className="mt-6 flex flex-wrap gap-2.5">
                  <span className="px-3 py-1 rounded-xl bg-slate-900 border border-white/10 font-mono text-xs text-blue-300">
                    📐 Parabola Explorer
                  </span>
                  <span className="px-3 py-1 rounded-xl bg-slate-900 border border-white/10 font-mono text-xs text-purple-300">
                    ⚡ Projectile Motion Cannon
                  </span>
                  <span className="px-3 py-1 rounded-xl bg-slate-900 border border-white/10 font-mono text-xs text-emerald-300">
                    🧪 Stoichiometry Balancer
                  </span>
                </div>

                <div className="mt-8">
                  <Link
                    to="/learning-hub"
                    className="px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 transition-all inline-flex items-center gap-2"
                  >
                    <span>Launch STEM Simulators</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              {/* Graphic Wireframe Card */}
              <div className="p-6 rounded-2xl bg-black/60 border border-white/10 font-mono text-xs space-y-4 shadow-inner">
                <div className="flex items-center justify-between text-slate-400 border-b border-white/10 pb-3">
                  <span className="text-cyan-400 font-bold">Kinematic Parabola Model</span>
                  <span>t = 1.42s · v₀ = 30 m/s</span>
                </div>
                <div className="h-40 rounded-xl bg-slate-900/90 border border-white/5 relative flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-obsidian-grid-dense opacity-60" />
                  <svg className="w-full h-full p-4" viewBox="0 0 300 120">
                    <path
                      d="M 20 100 Q 150 10 280 100"
                      fill="none"
                      stroke="#06b6d4"
                      strokeWidth="3"
                      strokeDasharray="4 2"
                    />
                    <circle cx="150" cy="55" r="5" fill="#8b5cf6" />
                    <text x="160" y="55" fill="#8b5cf6" fontSize="10">Vertex Max (h=22.9m)</text>
                  </svg>
                </div>
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>θ = 45.0°</span>
                  <span className="text-emerald-400 font-bold">Range R = 91.8 m</span>
                  <span>g = 9.8 m/s²</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          5. TELEMETRY COMPARISON MATRIX: CHATBOT VS. LEARNOVA AI
         ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-slate-950 relative border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12">
            <span className="text-cyan-400 font-mono text-xs font-semibold uppercase tracking-wider">
              Telemetry Verification
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Generic LLM Chatbots vs. Learnova AI Socratic Engine
            </h2>
            <p className="text-slate-400 text-sm mt-2">
              Why traditional chatbots fail student exams and how Learnova safeguards pedagogy.
            </p>
          </div>

          <div className="console-card-elevated rounded-2xl border-white/10 overflow-hidden shadow-2xl">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-900/90 text-slate-300 font-mono text-xs border-b border-white/10">
                <tr>
                  <th className="p-4 font-semibold">Pedagogical Capability</th>
                  <th className="p-4 font-semibold text-slate-500">Generic Chatbots</th>
                  <th className="p-4 font-semibold text-cyan-400">Learnova AI Engine</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4 font-medium text-white">Socratic Inquiry (No Direct Cheating)</td>
                  <td className="p-4 text-rose-400 flex items-center gap-1.5 font-mono">
                    <X className="h-4 w-4" /> Dumps final answer directly
                  </td>
                  <td className="p-4 text-emerald-400 font-semibold font-mono">
                    <Check className="h-4 w-4 inline mr-1 text-emerald-400" /> 9-step conceptual breakdown
                  </td>
                </tr>

                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4 font-medium text-white">Handwriting Uncertainty Handling</td>
                  <td className="p-4 text-rose-400 font-mono">
                    <X className="h-4 w-4 inline mr-1" /> Hallucinates messy strokes
                  </td>
                  <td className="p-4 text-emerald-400 font-semibold font-mono">
                    <Check className="h-4 w-4 inline mr-1" /> Flags ambiguity & prompts student
                  </td>
                </tr>

                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4 font-medium text-white">Mathematical Typography</td>
                  <td className="p-4 text-rose-400 font-mono">
                    <X className="h-4 w-4 inline mr-1" /> Broken plaintext formula strings
                  </td>
                  <td className="p-4 text-emerald-400 font-semibold font-mono">
                    <Check className="h-4 w-4 inline mr-1" /> Razor-sharp KaTeX typesetting
                  </td>
                </tr>

                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4 font-medium text-white">Observable Prerequisite Engine</td>
                  <td className="p-4 text-rose-400 font-mono">
                    <X className="h-4 w-4 inline mr-1" /> Stateless, zero student memory
                  </td>
                  <td className="p-4 text-emerald-400 font-semibold font-mono">
                    <Check className="h-4 w-4 inline mr-1" /> Traces knowledge gap to roots
                  </td>
                </tr>

                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4 font-medium text-white">Low-Bandwidth Rural School Support</td>
                  <td className="p-4 text-rose-400 font-mono">
                    <X className="h-4 w-4 inline mr-1" /> Completely crashes without internet
                  </td>
                  <td className="p-4 text-emerald-400 font-semibold font-mono">
                    <Check className="h-4 w-4 inline mr-1" /> Deterministic Offline PWA engine
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          6. FINAL CALL TO ACTION (THE LAUNCH CONSOLE)
         ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-24 relative overflow-hidden bg-obsidian-grid">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-950/20 to-purple-950/30 pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-mono text-xs">
            <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
            <span>Ready for Immediate Judge Demonstration</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Step Into the Future of School Learning
          </h2>

          <p className="text-slate-300 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            Experience the personalized dashboard, test the handwritten vision OCR slate, or simulate physics and chemistry in real time.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={handleStartTour}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-white font-bold text-sm shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-105 active:scale-95 transition-all cursor-pointer border border-white/20"
            >
              Launch Interactive Judge Demo
            </button>

            <Link
              to="/tutor"
              className="px-8 py-4 rounded-2xl console-card hover:border-cyan-500/40 text-white font-bold text-sm transition-all"
            >
              Open AI Tutor Workspace
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
