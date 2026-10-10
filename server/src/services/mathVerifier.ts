export interface VerificationResult {
  isVerifiable: boolean;
  computedValue?: string;
  isConsistent?: boolean;
  notes?: string;
}

/**
 * Deterministic math & science calculation verification
 * Pure TypeScript implementation for robust, zero-dependency evaluation
 */
export class MathVerifier {
  public static verifyArithmetic(expression: string, claimedAnswer: string): VerificationResult {
    try {
      const sanitized = expression
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/\\times/g, '*')
        .replace(/\\div/g, '/')
        .replace(/\\frac\{(\d+)\}\{(\d+)\}/g, '($1/$2)')
        .replace(/[^0-9\+\-\*\/\(\)\.\s]/g, ''); // sanitize strictly to numbers and basic operators

      if (!sanitized.trim()) {
        return { isVerifiable: false, notes: 'Non-numeric expression.' };
      }

      // Safe arithmetic evaluator without arbitrary code execution
      const evaluated = Function(`'use strict'; return (${sanitized});`)();
      if (typeof evaluated !== 'number' || isNaN(evaluated) || !isFinite(evaluated)) {
        return { isVerifiable: false, notes: 'Could not evaluate to finite number.' };
      }

      const computedStr = String(parseFloat(evaluated.toFixed(4)));
      const claimedNumbers = claimedAnswer.match(/[-+]?[0-9]*\.?[0-9]+/g);

      let isConsistent = claimedAnswer.includes(computedStr);
      if (!isConsistent && claimedNumbers) {
        for (const numStr of claimedNumbers) {
          if (Math.abs(parseFloat(numStr) - evaluated) < 1e-3) {
            isConsistent = true;
            break;
          }
        }
      }

      return {
        isVerifiable: true,
        computedValue: computedStr,
        isConsistent,
        notes: isConsistent
          ? 'Calculation verified deterministically.'
          : `Discrepancy detected: computed ${computedStr} vs claimed ${claimedAnswer}`
      };
    } catch {
      return {
        isVerifiable: false,
        notes: 'Expression cannot be evaluated symbolically.'
      };
    }
  }

  public static verifyQuadraticRoots(a: number, b: number, c: number): { discriminant: number; roots: number[]; nature: string } {
    const d = b * b - 4 * a * c;
    if (d < 0) {
      return { discriminant: d, roots: [], nature: 'Complex / No real roots' };
    }
    if (d === 0) {
      return { discriminant: d, roots: [-b / (2 * a)], nature: 'Real and equal roots' };
    }
    const r1 = (-b + Math.sqrt(d)) / (2 * a);
    const r2 = (-b - Math.sqrt(d)) / (2 * a);
    return { discriminant: d, roots: [r1, r2], nature: 'Real and distinct roots' };
  }

  public static verifyOhmsLaw(voltage?: number, current?: number, resistance?: number): { missingKey: string; calculatedValue: number } | null {
    if (voltage === undefined && current !== undefined && resistance !== undefined) {
      return { missingKey: 'voltage', calculatedValue: current * resistance };
    }
    if (current === undefined && voltage !== undefined && resistance !== undefined) {
      return { missingKey: 'current', calculatedValue: voltage / resistance };
    }
    if (resistance === undefined && voltage !== undefined && current !== undefined) {
      return { missingKey: 'resistance', calculatedValue: voltage / current };
    }
    return null;
  }
}
