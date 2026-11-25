import {describe, expect, it} from 'vitest';
import {calcDefiniteIntegral} from '../src/engine/stepEngine/calculus';

describe('improper integral of reciprocal integer powers', () => {
  it.each([
    ['1/x^2', -1, 1], ['1/x^2', 1, -1], ['1/x^2', 0, 1],
    ['1/(x^2)', -1, 1], ['1/x^3', -1, 1], ['1/x', -1, 1],
  ] as const)('rejects %s on %s..%s', (expr, lo, hi) => {
    expect(() => calcDefiniteIntegral(expr, 'x', lo, hi)).toThrowError(expect.objectContaining({code: 'DOMAIN_ERROR'}));
  });
  it.each([[1, 2, 0.5], [-2, -1, 0.5], [2, 1, -0.5]] as const)(
    'evaluates 1/x^2 safely on %s..%s', (lo, hi, result) => {
      expect(Number(calcDefiniteIntegral('1/x^2', 'x', lo, hi).resultLatex)).toBeCloseTo(result, 5);
    },
  );
});
