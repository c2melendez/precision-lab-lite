import {describe, expect, it} from 'vitest';
import Algebrite from 'algebrite';
import {gunzipSync} from 'node:zlib';
import {readFileSync} from 'node:fs';
import {calcDefiniteIntegral, calcIndefiniteIntegral} from '../src/engine/stepEngine/calculus';
import {parseExpression} from '../src/engine/parsing';

/**
 * IT-D-08 and IT-D-14 from the frozen trigonometric matrix:
 *
 *   | IT-D-08 | `\int\cot x\,dx`     | `\ln\lvert\sin x\rvert+C` |
 *   | IT-D-14 | `\int\sec^{3}x\,dx`  | `\frac{1}{2}\left(\sec x\tan x+\ln\lvert\sec x+\tan x\rvert\right)+C` |
 *
 * Algebrite has no table entry for either integrand. The engine now returns a
 * self-verified antiderivative (its derivative must reduce to the integrand).
 * Verification here is independent: numeric differentiation of the returned
 * antiderivative against closed-form values, plus a definite integral compared
 * with a value computed in JavaScript, not with an engine string.
 */

const matrixText = gunzipSync(
  readFileSync(new URL('../qa/certification/legacy_sources/ejercicios_trigonometria.md.gz', import.meta.url)),
).toString();

function realNumber(value: string): number {
  const text = value.trim();
  if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?(?:\.\.\.)?$/i.test(text)) {
    throw new Error(`Not a real number: ${text}`);
  }
  return parseFloat(text);
}

function derivativeAt(latex: string, variable: string, point: number): number {
  const derivative = Algebrite.run(`d(${latex},${variable})`);
  return realNumber(Algebrite.run(`float(subst(${point},${variable},${derivative}))`));
}

const cot = (x: number) => 1 / Math.tan(x);
const secCubed = (x: number) => 1 / Math.cos(x) ** 3;

describe('IT-D-08 and IT-D-14 antiderivatives', () => {
  it('anchors both IDs to the frozen matrix rows', () => {
    expect(matrixText.split('\n').some((line) => line.includes('| IT-D-08 |'))).toBe(true);
    expect(matrixText.split('\n').some((line) => line.includes('| IT-D-14 |'))).toBe(true);
  });

  it('IT-D-08 returns an antiderivative whose derivative is cot', () => {
    const result = calcIndefiniteIntegral('(cos(x)/sin(x))', 'x');
    for (const x of [-1.1, -0.6, 0.6, 1.1]) {
      expect(derivativeAt(result.resultLatex, 'x', x)).toBeCloseTo(cot(x), 5);
    }
  });

  it('IT-D-14 returns an antiderivative whose derivative is sec^3', () => {
    const result = calcIndefiniteIntegral('(1/cos(x))^3', 'x');
    for (const x of [-1.1, -0.6, 0.6, 1.1]) {
      expect(derivativeAt(result.resultLatex, 'x', x)).toBeCloseTo(secCubed(x), 5);
    }
  });

  it('supports a different variable for both rules', () => {
    const cotY = calcIndefiniteIntegral('(cos(y)/sin(y))', 'y');
    const secY = calcIndefiniteIntegral('(1/cos(y))^3', 'y');
    for (const y of [-0.6, 0.6]) {
      expect(derivativeAt(cotY.resultLatex, 'y', y)).toBeCloseTo(1 / Math.tan(y), 5);
      expect(derivativeAt(secY.resultLatex, 'y', y)).toBeCloseTo(1 / Math.cos(y) ** 3, 5);
    }
  });

  it('drives the literal integral templates through the UI channel', () => {
    const cotLiteral = parseExpression(String.raw`\int\cot x\,dx`, 'RAD');
    expect(cotLiteral.algebrite).toMatch(/^integral\(/);
    const cotResult = calcIndefiniteIntegral(cotLiteral.algebrite, 'x');
    for (const x of [-1.1, 0.6, 1.1]) {
      expect(derivativeAt(cotResult.resultLatex, 'x', x)).toBeCloseTo(cot(x), 5);
    }

    const secLiteral = parseExpression(String.raw`\int\sec^{3}x\,dx`, 'RAD');
    expect(secLiteral.algebrite).toMatch(/^integral\(/);
    const secResult = calcIndefiniteIntegral(secLiteral.algebrite, 'x');
    for (const x of [-1.1, 0.6, 1.1]) {
      expect(derivativeAt(secResult.resultLatex, 'x', x)).toBeCloseTo(secCubed(x), 5);
    }
  });

  it('evaluates definite integrals against independently computed values', () => {
    // ∫_{π/6}^{π/4} cot = ln(sin(π/4)) - ln(sin(π/6)).
    const cotExpected = Math.log(Math.sin(Math.PI / 4)) - Math.log(Math.sin(Math.PI / 6));
    const cotValue = realNumber(
      calcDefiniteIntegral('(cos(x)/sin(x))', 'x', Math.PI / 6, Math.PI / 4).resultLatex,
    );
    expect(cotValue).toBeCloseTo(cotExpected, 4);

    // ∫_0^{π/6} sec^3 = ½(sec·tan + ln|sec+tan|) at π/6, which is 0 at 0.
    const a = Math.PI / 6;
    const secExpected = (1 / Math.cos(a)) * Math.tan(a) / 2 + Math.log(1 / Math.cos(a) + Math.tan(a)) / 2;
    const secValue = realNumber(calcDefiniteIntegral('(1/cos(x))^3', 'x', 0, a).resultLatex);
    expect(secValue).toBeCloseTo(secExpected, 4);
  });
});
