import React, { useRef, useState, useEffect } from 'react';
import { Sparkles, Trash2, RotateCcw, Download, Check } from './icons.js';

interface BlackboardCanvasProps {
  onCaptureImage?: (base64Image: string) => void;
  title?: string;
  subtitle?: string;
}

export const BlackboardCanvas: React.FC<BlackboardCanvasProps> = ({
  onCaptureImage,
  title = 'Digital Slate & Equation Scratchpad',
  subtitle = 'Write equations, draw geometric diagrams, or sketch physics forces with your stylus or mouse'
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#ffffff'); // White chalk
  const [lineWidth, setLineWidth] = useState(3);
  const [showGrid, setShowGrid] = useState(true);
  const [history, setHistory] = useState<ImageData[]>([]);
  const [copiedNotice, setCopiedNotice] = useState(false);

  const colors = [
    { name: 'White Chalk', hex: '#ffffff' },
    { name: 'Math Cyan', hex: '#38bdf8' },
    { name: 'Physics Amber', hex: '#fbbf24' },
    { name: 'Chemistry Emerald', hex: '#34d399' },
    { name: 'Formula Coral', hex: '#f87171' },
    { name: 'Eraser', hex: '#1e293b' }, // Matches dark slate bg
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set high resolution for crisp drawing
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);

    // Initial background
    ctx.fillStyle = '#0f172a'; // Deep blackboard slate
    ctx.fillRect(0, 0, rect.width, rect.height);

    saveState();
  }, []);

  const saveState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory((prev) => [...prev.slice(-10), imgData]);
  };

  const undo = () => {
    if (history.length <= 1) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const newHistory = [...history];
    newHistory.pop(); // Remove current
    const previous = newHistory[newHistory.length - 1];
    ctx.putImageData(previous, 0, 0);
    setHistory(newHistory);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, rect.width, rect.height);
    saveState();
  };

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    if ('touches' in e) {
      const touch = e.touches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = color;
    ctx.lineWidth = color === '#1e293b' ? lineWidth * 4 : lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      saveState();
    }
  };

  const captureAndSend = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    if (onCaptureImage) {
      onCaptureImage(dataUrl);
    }
    setCopiedNotice(true);
    setTimeout(() => setCopiedNotice(false), 2500);
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `learnova-scratchpad-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl text-white">
      {/* Blackboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span className="text-emerald-400">✏️</span> {title}
          </h3>
          <p className="text-xs text-slate-400">{subtitle}</p>
        </div>

        {/* Toolbar Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Colors */}
          <div className="flex items-center gap-1.5 bg-slate-800/80 p-1 rounded-lg border border-slate-700">
            {colors.map((c) => (
              <button
                key={c.name}
                type="button"
                onClick={() => setColor(c.hex)}
                className={`w-6 h-6 rounded-full border-2 transition-transform ${
                  color === c.hex ? 'scale-110 border-white ring-2 ring-brand-500' : 'border-slate-600 hover:scale-105'
                }`}
                style={{ backgroundColor: c.hex }}
                title={c.name}
              />
            ))}
          </div>

          {/* Stroke Width */}
          <div className="flex items-center gap-1 bg-slate-800/80 px-2 py-1 rounded-lg border border-slate-700 text-xs">
            <span className="text-slate-400">Size:</span>
            <input
              type="range"
              min="1"
              max="10"
              value={lineWidth}
              onChange={(e) => setLineWidth(Number(e.target.value))}
              className="w-16 accent-brand-500"
            />
          </div>

          {/* Grid Toggle */}
          <button
            type="button"
            onClick={() => setShowGrid(!showGrid)}
            className={`text-xs px-2.5 py-1.5 rounded-lg border font-medium transition-colors ${
              showGrid
                ? 'bg-brand-600/30 border-brand-500 text-brand-300'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
            }`}
          >
            Grid {showGrid ? 'ON' : 'OFF'}
          </button>

          {/* Undo */}
          <button
            type="button"
            onClick={undo}
            disabled={history.length <= 1}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 disabled:opacity-40 rounded-lg text-slate-300 transition-colors"
            title="Undo"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Clear */}
          <button
            type="button"
            onClick={clearCanvas}
            className="p-1.5 bg-slate-800 hover:bg-red-900/40 border border-slate-700 hover:border-red-600/50 rounded-lg text-slate-300 hover:text-red-300 transition-colors"
            title="Clear Blackboard"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Blackboard Canvas Container */}
      <div
        className="relative my-3 rounded-xl overflow-hidden border-2 border-slate-700 bg-slate-950 shadow-inner"
        style={{ height: '320px', cursor: 'crosshair' }}
      >
        {/* Subtle Math Grid Overlay */}
        {showGrid && (
          <div
            className="absolute inset-0 pointer-events-none opacity-15"
            style={{
              backgroundImage: `linear-gradient(to right, #94a3b8 1px, transparent 1px), linear-gradient(to bottom, #94a3b8 1px, transparent 1px)`,
              backgroundSize: '24px 24px',
            }}
          />
        )}

        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full h-full block touch-none"
        />

        <div className="absolute bottom-2 left-3 pointer-events-none text-[11px] text-slate-500 flex items-center gap-1 font-mono">
          <span>Learnova Blackboard Slate</span>
          <span>•</span>
          <span>Touch & Pen Enabled</span>
        </div>
      </div>

      {/* Blackboard Footer Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <button
          type="button"
          onClick={downloadImage}
          className="text-xs flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors py-1.5 px-2.5 rounded-lg hover:bg-slate-800"
        >
          <Download className="w-3.5 h-3.5" /> Save PNG
        </button>

        <div className="flex items-center gap-2">
          {onCaptureImage && (
            <button
              type="button"
              onClick={captureAndSend}
              className="text-xs flex items-center gap-2 font-semibold bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white px-4 py-2 rounded-xl shadow-lg shadow-brand-500/20 active:scale-95 transition-all"
            >
              {copiedNotice ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Transcribing Blackboard...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Solve This Drawing with AI</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
