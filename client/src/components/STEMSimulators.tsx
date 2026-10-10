import React, { useState, useEffect } from 'react';
import { MathRenderer } from './MathRenderer.js';
import { Sparkles, Play, RotateCcw, Compass, Atom, Zap } from './icons.js';

export const STEMSimulators: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'math' | 'physics' | 'chemistry'>('math');

  // ==========================================
  // 1. MATH: Parabola Explorer (y = ax^2 + bx + c)
  // ==========================================
  const [a, setA] = useState<number>(1);
  const [b, setB] = useState<number>(-2);
  const [c, setC] = useState<number>(-3);

  // Math calculations
  const discriminant = b * b - 4 * a * c;
  const vertexX = a !== 0 ? -b / (2 * a) : 0;
  const vertexY = a !== 0 ? a * vertexX * vertexX + b * vertexX + c : c;
  let root1: number | null = null;
  let root2: number | null = null;
  if (a !== 0 && discriminant >= 0) {
    root1 = (-b + Math.sqrt(discriminant)) / (2 * a);
    root2 = (-b - Math.sqrt(discriminant)) / (2 * a);
  }

  // SVG Points Generator for Parabola (-8 to +8)
  const generateParabolaPath = () => {
    const points: string[] = [];
    const width = 360;
    const height = 240;
    const scaleX = width / 16; // -8 to 8
    const scaleY = height / 16; // -8 to 8
    const centerX = width / 2;
    const centerY = height / 2;

    for (let x = -8; x <= 8; x += 0.25) {
      const y = a * x * x + b * x + c;
      const screenX = centerX + x * scaleX;
      const screenY = centerY - y * scaleY;
      if (screenY >= -50 && screenY <= height + 50) {
        points.push(`${screenX},${screenY}`);
      }
    }
    return points.join(' ');
  };

  // ==========================================
  // 2. PHYSICS: Projectile Motion Laboratory
  // ==========================================
  const [velocity, setVelocity] = useState<number>(30); // m/s
  const [angleDeg, setAngleDeg] = useState<number>(45); // degrees
  const [gravity, setGravity] = useState<number>(9.8); // Earth default
  const [isLaunching, setIsLaunching] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(1); // 0 to 1 animation

  const angleRad = (angleDeg * Math.PI) / 180;
  const maxHeight = (velocity * velocity * Math.sin(angleRad) ** 2) / (2 * gravity);
  const totalRange = (velocity * velocity * Math.sin(2 * angleRad)) / gravity;
  const flightTime = (2 * velocity * Math.sin(angleRad)) / gravity;

  const launchProjectile = () => {
    setIsLaunching(true);
    setProgress(0);
    const start = Date.now();
    const duration = 1500; // 1.5s visual animation

    const frame = () => {
      const elapsed = Date.now() - start;
      const t = Math.min(1, elapsed / duration);
      setProgress(t);
      if (t < 1) {
        requestAnimationFrame(frame);
      } else {
        setIsLaunching(false);
      }
    };
    requestAnimationFrame(frame);
  };

  // Generate Projectile Curve Points
  const generateProjectilePath = () => {
    const width = 360;
    const height = 200;
    const maxR = Math.max(totalRange, 50);
    const maxH = Math.max(maxHeight, 20);

    const points: string[] = [];
    const steps = 40;
    for (let i = 0; i <= steps * progress; i++) {
      const t = (i / steps) * flightTime;
      const x = velocity * Math.cos(angleRad) * t;
      const y = velocity * Math.sin(angleRad) * t - 0.5 * gravity * t * t;

      const screenX = 20 + (x / maxR) * (width - 40);
      const screenY = height - 20 - (y / maxH) * (height - 50);
      points.push(`${screenX},${screenY}`);
    }
    return points.join(' ');
  };

  // Current projectile dot coordinate
  const currentT = progress * flightTime;
  const currentX = velocity * Math.cos(angleRad) * currentT;
  const currentY = velocity * Math.sin(angleRad) * currentT - 0.5 * gravity * currentT * currentT;
  const maxR = Math.max(totalRange, 50);
  const maxH = Math.max(maxHeight, 20);
  const ballScreenX = 20 + (currentX / maxR) * (360 - 40);
  const ballScreenY = 200 - 20 - (Math.max(0, currentY) / maxH) * (200 - 50);

  // ==========================================
  // 3. CHEMISTRY: Reaction Balancer & Elements
  // ==========================================
  const [reactionInput, setReactionInput] = useState<string>('Fe + O2 -> Fe2O3');
  const [selectedElement, setSelectedElement] = useState<string>('Fe');

  const elementDatabase: Record<string, { name: string; z: number; mass: number; valence: string; summary: string }> = {
    H: { name: 'Hydrogen', z: 1, mass: 1.008, valence: '1', summary: 'Lightest element, highly combustible gas, forms water with Oxygen.' },
    C: { name: 'Carbon', z: 6, mass: 12.011, valence: '4 (Tetravalent)', summary: 'Basis of organic life, diamond, and graphite allotropes.' },
    N: { name: 'Nitrogen', z: 7, mass: 14.007, valence: '3, 5', summary: '78% of Earth’s atmosphere, essential for amino acids and proteins.' },
    O: { name: 'Oxygen', z: 8, mass: 15.999, valence: '2', summary: 'Supports combustion and cellular respiration, forms oxides.' },
    Na: { name: 'Sodium', z: 11, mass: 22.990, valence: '1+', summary: 'Alkali metal, reacts vigorously with water, essential dietary ion.' },
    Cl: { name: 'Chlorine', z: 17, mass: 35.453, valence: '1-', summary: 'Halogen, strong disinfectant, combines with sodium to form table salt.' },
    Fe: { name: 'Iron', z: 26, mass: 55.845, valence: '2+, 3+', summary: 'Transition metal, core component of hemoglobin and structural steel.' },
    Cu: { name: 'Copper', z: 29, mass: 63.546, valence: '1+, 2+', summary: 'Excellent electrical and thermal conductor, forms bronze and brass.' },
  };

  const reactionLibrary: Record<string, { balanced: string; explanation: string; atoms: { element: string; count: number }[] }> = {
    'Fe + O2 -> Fe2O3': {
      balanced: '4\\text{Fe} + 3\\text{O}_2 \\rightarrow 2\\text{Fe}_2\\text{O}_3',
      explanation: '4 Iron atoms react with 3 Oxygen gas molecules to yield 2 units of Iron(III) oxide (Rust).',
      atoms: [{ element: 'Fe', count: 4 }, { element: 'O', count: 6 }]
    },
    'H2 + O2 -> H2O': {
      balanced: '2\\text{H}_2 + \\text{O}_2 \\rightarrow 2\\text{H}_2\\text{O}',
      explanation: '2 molecules of Hydrogen gas burn with 1 molecule of Oxygen to synthesize 2 molecules of Water.',
      atoms: [{ element: 'H', count: 4 }, { element: 'O', count: 2 }]
    },
    'CH4 + O2 -> CO2 + H2O': {
      balanced: '\\text{CH}_4 + 2\\text{O}_2 \\rightarrow \\text{CO}_2 + 2\\text{H}_2\\text{O}',
      explanation: 'Complete combustion of Methane: 1 Methane + 2 Oxygen produce 1 Carbon dioxide + 2 Water vapor.',
      atoms: [{ element: 'C', count: 1 }, { element: 'H', count: 4 }, { element: 'O', count: 4 }]
    },
    'N2 + H2 -> NH3': {
      balanced: '\\text{N}_2 + 3\\text{H}_2 \\rightarrow 2\\text{NH}_3',
      explanation: 'The Haber-Bosch Process: 1 Nitrogen gas + 3 Hydrogen gas synthesize 2 Ammonia molecules.',
      atoms: [{ element: 'N', count: 2 }, { element: 'H', count: 6 }]
    },
    'Al + HCl -> AlCl3 + H2': {
      balanced: '2\\text{Al} + 6\\text{HCl} \\rightarrow 2\\text{AlCl}_3 + 3\\text{H}_2',
      explanation: 'Aluminium displaces Hydrogen in Hydrochloric acid to form Aluminium chloride salt and Hydrogen gas.',
      atoms: [{ element: 'Al', count: 2 }, { element: 'H', count: 6 }, { element: 'Cl', count: 6 }]
    }
  };

  const currentBalanced = reactionLibrary[reactionInput] || reactionLibrary['Fe + O2 -> Fe2O3'];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl">
      {/* Header & Simulator Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-brand-100 dark:bg-brand-900/40 text-brand-600 dark:text-brand-400 rounded-lg">
              <Sparkles className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Learnova Interactive STEM Labs
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time visual physics, dynamic mathematical curves, and stoichiometric chemistry simulators
          </p>
        </div>

        {/* Tab Pills */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab('math')}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'math'
                ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Math: Parabola Explorer</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('physics')}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'physics'
                ? 'bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Physics: Projectile Cannon</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('chemistry')}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'chemistry'
                ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Atom className="w-3.5 h-3.5" />
            <span>Chemistry: Balancer</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 1. MATH SIMULATOR: QUADRATIC PARABOLA EXPLORER            */}
      {/* ======================================================== */}
      {activeTab === 'math' && (
        <div className="mt-5 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls & Metrics */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Current Quadratic Equation
                </span>
                <span className="text-xs font-mono px-2 py-0.5 bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 rounded font-semibold">
                  Standard Form
                </span>
              </div>
              <div className="text-center py-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                <MathRenderer
                  math={`y = ${a !== 1 ? (a === -1 ? '-' : a) : ''}x^2 ${b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`}x ${c >= 0 ? `+ ${c}` : `- ${Math.abs(c)}`}`}
                  displayMode
                />
              </div>
            </div>

            {/* Sliders */}
            <div className="space-y-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span className="text-slate-700 dark:text-slate-300">Curvature Coefficient (a): {a}</span>
                  <span className="text-slate-400">{a > 0 ? 'Opens Up (∪)' : a < 0 ? 'Opens Down (∩)' : 'Linear'}</span>
                </div>
                <input
                  type="range"
                  min="-3"
                  max="3"
                  step="0.5"
                  value={a}
                  onChange={(e) => setA(Number(e.target.value) || 0.5)}
                  className="w-full accent-brand-600"
                />
              </div>

              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span className="text-slate-700 dark:text-slate-300">Shift Coefficient (b): {b}</span>
                  <span className="text-slate-400">Vertex X = {vertexX.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="-6"
                  max="6"
                  step="0.5"
                  value={b}
                  onChange={(e) => setB(Number(e.target.value))}
                  className="w-full accent-brand-600"
                />
              </div>

              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span className="text-slate-700 dark:text-slate-300">Y-Intercept (c): {c}</span>
                  <span className="text-slate-400">At x = 0, y = {c}</span>
                </div>
                <input
                  type="range"
                  min="-8"
                  max="8"
                  step="1"
                  value={c}
                  onChange={(e) => setC(Number(e.target.value))}
                  className="w-full accent-brand-600"
                />
              </div>
            </div>

            {/* Key Computed Properties */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Discriminant (Δ)</span>
                <span className={`font-bold font-mono text-sm ${discriminant > 0 ? 'text-emerald-500' : discriminant === 0 ? 'text-amber-500' : 'text-rose-500'}`}>
                  {discriminant.toFixed(1)}
                </span>
                <span className="block text-[10px] text-slate-500">
                  {discriminant > 0 ? '2 Real Roots' : discriminant === 0 ? '1 Real Root' : 'Complex Roots'}
                </span>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Vertex Coordinates</span>
                <span className="font-bold font-mono text-sm text-brand-500">
                  ({vertexX.toFixed(1)}, {vertexY.toFixed(1)})
                </span>
                <span className="block text-[10px] text-slate-500">
                  {a > 0 ? 'Global Minimum' : 'Global Maximum'}
                </span>
              </div>
            </div>
          </div>

          {/* SVG Coordinate Graph */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center bg-slate-950 p-4 rounded-2xl border border-slate-800 shadow-inner">
            <div className="w-full flex items-center justify-between text-xs text-slate-400 mb-2 px-2">
              <span className="font-mono text-[11px] text-brand-400">f(x) Coordinate Canvas</span>
              <span>Grid: -8 to +8</span>
            </div>

            <div className="relative w-full max-w-[380px] h-[260px] bg-slate-900 rounded-xl overflow-hidden border border-slate-800">
              <svg viewBox="0 0 360 240" className="w-full h-full">
                {/* Grid lines */}
                {Array.from({ length: 17 }).map((_, i) => (
                  <React.Fragment key={i}>
                    <line x1={i * 22.5} y1="0" x2={i * 22.5} y2="240" stroke="#334155" strokeWidth="0.5" strokeDasharray="2,2" />
                    <line x1="0" y1={i * 15} x2="360" y2={i * 15} stroke="#334155" strokeWidth="0.5" strokeDasharray="2,2" />
                  </React.Fragment>
                ))}

                {/* Main Axes */}
                <line x1="0" y1="120" x2="360" y2="120" stroke="#94a3b8" strokeWidth="1.5" />
                <line x1="180" y1="0" x2="180" y2="240" stroke="#94a3b8" strokeWidth="1.5" />

                {/* Parabola Curve */}
                <polyline
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="3"
                  strokeLinecap="round"
                  points={generateParabolaPath()}
                />

                {/* Vertex Point */}
                <circle
                  cx={180 + vertexX * (360 / 16)}
                  cy={120 - vertexY * (240 / 16)}
                  r="5"
                  fill="#f43f5e"
                  stroke="#ffffff"
                  strokeWidth="2"
                />

                {/* Real Roots Points */}
                {root1 !== null && (
                  <circle cx={180 + root1 * (360 / 16)} cy="120" r="4" fill="#34d399" />
                )}
                {root2 !== null && (
                  <circle cx={180 + root2 * (360 / 16)} cy="120" r="4" fill="#34d399" />
                )}
              </svg>
            </div>

            <div className="mt-3 text-center text-xs text-slate-400">
              {root1 !== null && root2 !== null ? (
                <span>Roots: <strong className="text-emerald-400 font-mono">x₁ = {root1.toFixed(2)}</strong>, <strong className="text-emerald-400 font-mono">x₂ = {root2.toFixed(2)}</strong></span>
              ) : (
                <span className="text-rose-400">Parabola does not intersect the x-axis (No Real Roots)</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. PHYSICS SIMULATOR: PROJECTILE CANNON                  */}
      {/* ======================================================== */}
      {activeTab === 'physics' && (
        <div className="mt-5 grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 space-y-4 text-xs">
            {/* Sliders */}
            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span className="text-slate-700 dark:text-slate-300">Launch Velocity (v₀): {velocity} m/s</span>
                  <span className="text-amber-500 font-mono">{(velocity * 3.6).toFixed(0)} km/h</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="60"
                  value={velocity}
                  onChange={(e) => setVelocity(Number(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </div>

              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span className="text-slate-700 dark:text-slate-300">Elevation Angle (θ): {angleDeg}°</span>
                  <span className="text-amber-500 font-mono">{angleDeg === 45 ? 'Max Range Angle (45°)' : `${angleDeg}°`}</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="80"
                  value={angleDeg}
                  onChange={(e) => setAngleDeg(Number(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </div>

              {/* Gravitational Field Preset */}
              <div>
                <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Planetary Gravity Environment:
                </span>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { label: 'Earth (9.8)', g: 9.8 },
                    { label: 'Moon (1.6)', g: 1.62 },
                    { label: 'Mars (3.7)', g: 3.71 }
                  ].map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => setGravity(p.g)}
                      className={`py-1 px-2 rounded-lg font-medium border text-[11px] transition-all ${
                        gravity === p.g
                          ? 'bg-amber-500 text-white border-amber-500 font-bold shadow-sm'
                          : 'bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-amber-400'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Readout Telemetry */}
            <div className="grid grid-cols-3 gap-2">
              <div className="p-3 bg-amber-50 dark:bg-amber-950/20 rounded-xl border border-amber-200 dark:border-amber-900/50">
                <span className="text-amber-800 dark:text-amber-300 block text-[10px] font-medium">Max Height (H)</span>
                <span className="font-bold font-mono text-sm text-amber-700 dark:text-amber-200">
                  {maxHeight.toFixed(1)} m
                </span>
              </div>
              <div className="p-3 bg-indigo-50 dark:bg-indigo-950/20 rounded-xl border border-indigo-200 dark:border-indigo-900/50">
                <span className="text-indigo-800 dark:text-indigo-300 block text-[10px] font-medium">Total Range (R)</span>
                <span className="font-bold font-mono text-sm text-indigo-700 dark:text-indigo-200">
                  {totalRange.toFixed(1)} m
                </span>
              </div>
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl border border-emerald-200 dark:border-emerald-900/50">
                <span className="text-emerald-800 dark:text-emerald-300 block text-[10px] font-medium">Flight Time (T)</span>
                <span className="font-bold font-mono text-sm text-emerald-700 dark:text-emerald-200">
                  {flightTime.toFixed(2)} s
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={launchProjectile}
              disabled={isLaunching}
              className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-bold rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{isLaunching ? 'Projectile in Flight...' : 'Fire Cannon!'}</span>
            </button>
          </div>

          {/* Physics Trajectory Canvas */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center bg-slate-950 p-4 rounded-2xl border border-slate-800 shadow-inner">
            <div className="w-full flex items-center justify-between text-xs text-slate-400 mb-2 px-2">
              <span className="font-mono text-[11px] text-amber-400">Trajectory Field (Kinematics)</span>
              <span>Apex = {maxHeight.toFixed(1)}m</span>
            </div>

            <div className="relative w-full max-w-[380px] h-[220px] bg-slate-900 rounded-xl overflow-hidden border border-slate-800">
              <svg viewBox="0 0 360 200" className="w-full h-full">
                {/* Ground */}
                <line x1="0" y1="180" x2="360" y2="180" stroke="#475569" strokeWidth="2" />
                <rect x="0" y="180" width="360" height="20" fill="#1e293b" />

                {/* Trajectory Guide Arc */}
                <polyline
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="2.5"
                  strokeDasharray="4,4"
                  points={generateProjectilePath()}
                />

                {/* Projectile Cannon Base */}
                <circle cx="20" cy="180" r="8" fill="#64748b" />

                {/* Flying Ball */}
                <circle
                  cx={ballScreenX}
                  cy={ballScreenY}
                  r="6"
                  fill="#fbbf24"
                  stroke="#ffffff"
                  strokeWidth="2"
                />
              </svg>
            </div>
            <p className="mt-2 text-xs text-slate-400 text-center">
              Formula: <MathRenderer math="y(x) = x\\tan\\theta - \\frac{g x^2}{2 v_0^2 \\cos^2\\theta}" inline />
            </p>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. CHEMISTRY SIMULATOR: REACTION BALANCER & ELEMENTS     */}
      {/* ======================================================== */}
      {activeTab === 'chemistry' && (
        <div className="mt-5 grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 space-y-4 text-xs">
            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="font-bold text-slate-700 dark:text-slate-300 block">
                Select Reaction to Balance:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {Object.keys(reactionLibrary).map((rxn) => (
                  <button
                    key={rxn}
                    type="button"
                    onClick={() => setReactionInput(rxn)}
                    className={`px-2.5 py-1.5 rounded-lg font-mono text-[11px] border transition-all ${
                      reactionInput === rxn
                        ? 'bg-emerald-600 text-white border-emerald-600 font-bold shadow-sm'
                        : 'bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:border-emerald-500'
                    }`}
                  >
                    {rxn}
                  </button>
                ))}
              </div>
            </div>

            {/* Balanced Output Card */}
            <div className="bg-emerald-50 dark:bg-emerald-950/20 p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/50">
              <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 block mb-1 uppercase tracking-wider">
                Stoichiometrically Balanced Equation
              </span>
              <div className="py-2 text-center bg-white dark:bg-slate-900 rounded-lg border border-emerald-200 dark:border-emerald-800/60 shadow-inner">
                <MathRenderer math={currentBalanced.balanced} displayMode />
              </div>
              <p className="mt-2 text-emerald-700 dark:text-emerald-300 text-xs">
                {currentBalanced.explanation}
              </p>
            </div>

            {/* Atom Balance Table */}
            <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-2">
                Conservation of Mass (Atom Count per Side):
              </span>
              <div className="grid grid-cols-2 gap-2">
                {currentBalanced.atoms.map((a) => (
                  <div key={a.element} className="flex justify-between p-2 bg-white dark:bg-slate-700 rounded-lg">
                    <span className="font-bold text-slate-800 dark:text-white">Element {a.element}:</span>
                    <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">{a.count} Atoms on both sides</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Element Inspector */}
          <div className="lg:col-span-6 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs space-y-3">
            <span className="font-bold text-slate-700 dark:text-slate-300 block">
              Quick Periodic Table Inspector (Click Element):
            </span>
            <div className="grid grid-cols-4 gap-2">
              {Object.keys(elementDatabase).map((sym) => (
                <button
                  key={sym}
                  type="button"
                  onClick={() => setSelectedElement(sym)}
                  className={`p-2 rounded-xl text-center border transition-all ${
                    selectedElement === sym
                      ? 'bg-brand-600 text-white border-brand-600 font-bold shadow-md scale-105'
                      : 'bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 hover:border-brand-500 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <span className="text-[10px] block opacity-75">{elementDatabase[sym].z}</span>
                  <span className="text-base font-extrabold block">{sym}</span>
                  <span className="text-[10px] block truncate">{elementDatabase[sym].name}</span>
                </button>
              ))}
            </div>

            {/* Detailed Selected Element Card */}
            {selectedElement && elementDatabase[selectedElement] && (
              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {elementDatabase[selectedElement].name} ({selectedElement})
                    </h4>
                    <span className="text-[11px] text-slate-500">Atomic Number: {elementDatabase[selectedElement].z}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-slate-500 block">Standard Atomic Mass</span>
                    <span className="font-mono font-bold text-brand-600 dark:text-brand-400">
                      {elementDatabase[selectedElement].mass} u
                    </span>
                  </div>
                </div>
                <div className="mt-2 text-slate-600 dark:text-slate-400">
                  <p className="mb-1"><strong>Valence State:</strong> {elementDatabase[selectedElement].valence}</p>
                  <p>{elementDatabase[selectedElement].summary}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
