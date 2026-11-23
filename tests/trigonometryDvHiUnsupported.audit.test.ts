import { describe, expect, it } from 'vitest';
import Algebrite from 'algebrite';
import { derivative } from '../src/engine/algebriteClient';
import { calcDerivative } from '../src/engine/stepEngine/calculus';
import { rewriteReciprocalFunctions } from '../src/engine/parsing';

// Independent real-valued oracles; Algebrite is used only for substitution.
const cases: [string, string, number[], (x: number) => number][] = [
  ['DV-HI-01','asinh(x)',[-2,0,2], x => 1/Math.sqrt(x*x+1)],
  ['DV-HI-02','acosh(x)',[1.1,2,5], x => 1/Math.sqrt(x*x-1)],
  ['DV-HI-03','atanh(x)',[-0.8,0,0.8], x => 1/(1-x*x)],
  ['DV-HI-04','acoth(x)',[-2,-1.1,1.1,2], x => 1/(1-x*x)],
  ['DV-HI-05','asech(x)',[0.1,0.5,0.9], x => -1/(x*Math.sqrt(1-x*x))],
  ['DV-HI-06','acsch(x)',[-2,-1,1,2], x => -1/(Math.abs(x)*Math.sqrt(1+x*x))],
  ['DV-HI-07','asinh(2*x)',[-1,0,1], x => 2/Math.sqrt(4*x*x+1)],
  ['DV-HI-08','acosh(3*x)',[0.4,1,2], x => 3/Math.sqrt(9*x*x-1)],
  ['DV-HI-09','atanh(x^2)',[-0.8,0,0.8], x => 2*x/(1-x**4)],
  ['DV-HI-10','x*asinh(x)-sqrt(x^2+1)',[-2,0,2], x => Math.asinh(x)],
];

describe('TR324 inverse hyperbolic derivatives', () => {
  it.each(cases)('%s computes on the original real domain', (_id, expression, points, oracle) => {
    const result = derivative(rewriteReciprocalFunctions(expression), 'x', 1);
    expect(result).not.toMatch(/\bd\s*\(/);
    expect(calcDerivative(expression, 'x', 1).confidence).toBe('SYMBOLIC');
    for (const point of points) {
      const actual = parseFloat(Algebrite.run(`float(subst(${point},x,${result}))`));
      expect(Number.isFinite(actual)).toBe(true);
      // Algebrite's float string is rounded to six decimal places.
      expect(actual).toBeCloseTo(oracle(point), 5);
    }
  });
  it('rejects unsupported derivatives instead of claiming success', () => {
    expect(() => calcDerivative('unknownFunction(x)', 'x', 1)).toThrow();
    try { calcDerivative('unknownFunction(x)', 'x', 1); }
    catch (error) { expect(error).toMatchObject({code: 'UNSUPPORTED_OPERATION'}); }
  });
});
