import {describe, expect, it} from 'vitest';
import {parseExpression} from '../src/engine/parsing';
import {compileNumeric} from '../src/engine/numericFallback';
import {calcDefiniteIntegral, calcDerivative, calcIndefiniteIntegral, calcLimit} from '../src/engine/stepEngine/calculus';
import {evalLatexAt} from './support/latexNumeric';

/**
 * The Calculus keyboard inserts a complete operator template
 * (`\frac{d}{dx}(...)`, `\int ...\,dx`, `\int_a^b ...\,dx`, `\lim_{x\to a} ...`).
 * These tests drive the same path the UI uses: parse the literal LaTeX and
 * hand the parsed text to the engine, then verify the answer numerically
 * against an independent closed form.
 */

const uiPath = (latex: string) => parseExpression(latex, 'RAD');

function numericDerivative(fn: (x: number) => number, at: number, h = 1e-6): number {
  return (fn(at + h) - fn(at - h)) / (2 * h);
}

function toPlainNumber(text: string): number {
  return Number(text.replace(/[^0-9eE+\-.]/g, '') || 'NaN');
}

describe('Calculus literal operator channel', () => {
  it('differentiates the d/dx template instead of the unevaluated call', () => {
    const parsed = uiPath(String.raw`\frac{d}{dx}\left(x^{2}\right)`);
    expect(parsed.algebrite).toMatch(/^d\(/);
    const result = calcDerivative(parsed.algebrite, 'x', 1);
    for (const point of [-3, -0.5, 0.5, 3]) {
      expect(evalLatexAt(result.resultLatex, point)).toBeCloseTo(2 * point, 10);
    }
  });

  it('differentiates a product inside the d/dx template', () => {
    const parsed = uiPath(String.raw`\frac{d}{dx}\left(x\sin x\right)`);
    const result = calcDerivative(parsed.algebrite, 'x', 1);
    for (const point of [-2, -0.5, 0.5, 2]) {
      expect(evalLatexAt(result.resultLatex, point)).toBeCloseTo(Math.sin(point) + point * Math.cos(point), 8);
    }
  });

  it('integrates the indefinite template once, not twice', () => {
    const parsed = uiPath(String.raw`\int x^{2}\,dx`);
    expect(parsed.algebrite).toMatch(/^integral\(/);
    const result = calcIndefiniteIntegral(parsed.algebrite, 'x');
    // Regression: the previous behaviour returned 1/12*x^4 (a double integral).
    expect(result.resultLatex.replace(/\s/g, '')).not.toContain('x^4');
    const antiderivative = compileNumeric(result.resultLatex.replace(/\+\s*C$/, '').trim(), 'x');
    for (const point of [-2, -0.5, 0.5, 2]) {
      expect(numericDerivative(antiderivative, point)).toBeCloseTo(point * point, 6);
    }
  });

  it('integrates the sin template to -cos, not to -sin', () => {
    const parsed = uiPath(String.raw`\int\sin x\,dx`);
    const result = calcIndefiniteIntegral(parsed.algebrite, 'x');
    const antiderivative = compileNumeric(result.resultLatex.replace(/\+\s*C$/, '').trim(), 'x');
    for (const point of [-2, -0.5, 0.5, 2]) {
      expect(numericDerivative(antiderivative, point)).toBeCloseTo(Math.sin(point), 6);
    }
  });

  it('evaluates the definite template with its own bounds', () => {
    const square = uiPath(String.raw`\int_{0}^{1}x^{2}\,dx`);
    const cube = calcDefiniteIntegral(square.algebrite, 'x', 9, 9); // bounds come from the literal
    expect(toPlainNumber(cube.resultLatex)).toBeCloseTo(1 / 3, 5);

    const sine = uiPath(String.raw`\int_{0}^{\pi}\sin x\,dx`);
    const area = calcDefiniteIntegral(sine.algebrite, 'x', 9, 9);
    expect(toPlainNumber(area.resultLatex)).toBeCloseTo(2, 5);
  });

  it('refuses a definite template with a non-finite bound instead of guessing', () => {
    expect(() => calcDefiniteIntegral('defintegral((1/(x^(2))),1,oo,x)', 'x', 1, 10)).toThrow(
      /no es un número real finito/,
    );
  });

  it('evaluates the limit template at the literal point', () => {
    const parsed = uiPath(String.raw`\lim_{x\to 0}\frac{\sin x}{x}`);
    const result = calcLimit(parsed.algebrite, 'x', '9', 9, 'both'); // point comes from the literal
    expect(Number(result.resultLatex.replace(/[^0-9eE+\-.]/g, ''))).toBeCloseTo(1, 10);
  });

  it('evaluates the limit template at positive infinity', () => {
    const parsed = uiPath(String.raw`\lim_{x\to\infty}\frac{1}{x}`);
    const result = calcLimit(parsed.algebrite, 'x', '0', 0, 'both');
    expect(result.resultLatex).toBe('0');
  });

  it('keeps plain operands working (regression)', () => {
    expect(evalLatexAt(calcDerivative('x^2', 'x', 1).resultLatex, 3)).toBeCloseTo(6, 10);
    const antiderivative = compileNumeric(calcIndefiniteIntegral('x^2', 'x').resultLatex.replace(/\+\s*C$/, '').trim(), 'x');
    expect(numericDerivative(antiderivative, 2)).toBeCloseTo(4, 6);
    expect(toPlainNumber(calcDefiniteIntegral('x^2', 'x', 0, 1).resultLatex)).toBeCloseTo(1 / 3, 5);
    expect(Number(calcLimit('sin(x)/x', 'x', '0', 0).resultLatex.replace(/[^0-9eE+\-.]/g, ''))).toBeCloseTo(1, 10);
  });

  it('refuses an unapplied function instead of inventing a result', () => {
    expect(() => calcDerivative('sech*x', 'x', 1)).toThrow(/debe escribirse aplicada/);
    expect(() => calcIndefiniteIntegral('sech^(2)*x', 'x')).toThrow(/debe escribirse aplicada/);
    expect(() => calcDerivative('d*x/sqrt(x^(2)-1)', 'x', 1)).toThrow(/debe escribirse aplicada/);
  });
});
