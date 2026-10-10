import React from 'react';
import katex from 'katex';

interface MathRendererProps {
  content?: string;
  math?: string;
  className?: string;
  displayMode?: boolean;
  inline?: boolean;
}

export const MathRenderer: React.FC<MathRendererProps> = ({
  content,
  math,
  className = '',
  displayMode = false,
  inline = false,
}) => {
  const rawText = content || math || '';
  if (!rawText) return null;

  // Pure formula rendering
  if (displayMode || inline) {
    try {
      const html = katex.renderToString(rawText.trim(), {
        displayMode: displayMode && !inline,
        throwOnError: false,
      });
      if (inline) {
        return <span className={`inline-block px-1 align-baseline font-serif ${className}`} dangerouslySetInnerHTML={{ __html: html }} />;
      }
      return <div className={`overflow-x-auto py-2 ${className}`} dangerouslySetInnerHTML={{ __html: html }} />;
    } catch {
      return <code className={`block p-2 bg-slate-100 dark:bg-slate-800 rounded font-mono ${className}`}>{rawText}</code>;
    }
  }

  // Parse mixed markdown and inline/block LaTeX formulas
  const renderMixedContent = (text: string) => {
    // Regex splits by $$...$$ (block math) or $...$ (inline math)
    const regex = /(\$\$[\s\S]*?\$\$|\$[^$\n]+?\$)/g;
    const parts = text.split(regex);

    return parts.map((part, index) => {
      if (part.startsWith('$$') && part.endsWith('$$')) {
        const mathExpr = part.slice(2, -2).trim();
        try {
          const html = katex.renderToString(mathExpr, { displayMode: true, throwOnError: false });
          return (
            <div
              key={index}
              className="my-3 overflow-x-auto py-1 text-center font-serif text-slate-800 dark:text-slate-100"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        } catch {
          return <code key={index} className="block my-2 font-mono text-xs bg-slate-100 dark:bg-slate-800 p-2 rounded">{mathExpr}</code>;
        }
      } else if (part.startsWith('$') && part.endsWith('$') && part.length > 2) {
        const mathExpr = part.slice(1, -1).trim();
        try {
          const html = katex.renderToString(mathExpr, { displayMode: false, throwOnError: false });
          return (
            <span
              key={index}
              className="inline-block px-1 align-baseline font-serif text-slate-800 dark:text-slate-100"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        } catch {
          return <code key={index} className="font-mono text-xs bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">{mathExpr}</code>;
        }
      }

      // Handle plain text line breaks and bold/italics simply
      return (
        <span key={index} className="whitespace-pre-line leading-relaxed">
          {part}
        </span>
      );
    });
  };

  return <div className={`math-content text-slate-800 dark:text-slate-200 ${className}`}>{renderMixedContent(rawText)}</div>;
};
