import {describe, expect, it} from 'vitest';
import {calcDefiniteIntegral} from '../src/engine/stepEngine/calculus';

describe('definite integrals: nonfinite output', () => {
  it.each([['1/x', 0, 1], ['1/x', 1, 0], ['1/(x-1)', 0, 1]] as const)(
    'rejects nonfinite result for %s on %s..%s', (expr, lo, hi) => {
      expect(() => calcDefiniteIntegral(expr, 'x', lo, hi)).toThrowError(expect.objectContaining({code: 'DOMAIN_ERROR'}));
    },
  );
  it('keeps finite real results', () => {
    expect(parseFloat(calcDefiniteIntegral('x^2', 'x', 0, 1).resultLatex)).toBeCloseTo(1/3, 5);
  });
  it('does not reject a finite complex result merely for being complex', () => {
    expect(calcDefiniteIntegral('sqrt(x)', 'x', -2, -1).resultLatex).toContain('i');
  });
});
