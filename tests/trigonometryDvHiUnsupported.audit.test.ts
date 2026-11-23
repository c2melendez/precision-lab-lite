import { describe, expect, it } from 'vitest';
import { calcDerivative } from '../src/engine/stepEngine/calculus';

describe('TR324 inverse hyperbolic derivatives: unresolved output', () => {
  it.each([
    ['DV-HI-01', 'asinh(x)'], ['DV-HI-02', 'acosh(x)'],
    ['DV-HI-03', 'atanh(x)'], ['DV-HI-04', 'acoth(x)'],
    ['DV-HI-05', 'asech(x)'], ['DV-HI-06', 'acsch(x)'],
    ['DV-HI-07', 'asinh(2*x)'], ['DV-HI-08', 'acosh(3*x)'],
    ['DV-HI-09', 'atanh(x^2)'],
    ['DV-HI-10', 'x*asinh(x)-sqrt(x^2+1)'],
  ])('%s reports unsupported instead of claiming a symbolic result', (_id, expression) => {
    expect(() => calcDerivative(expression, 'x', 1)).toThrow();
    try {
      calcDerivative(expression, 'x', 1);
    } catch (error) {
      expect(error).toMatchObject({ code: 'UNSUPPORTED_OPERATION' });
    }
  });

  it('retains ordinary symbolic derivatives', () => {
    expect(calcDerivative('sinh(x)', 'x', 1).resultLatex).toBe('cosh(x)');
    expect(calcDerivative('x^2', 'x', 2).resultLatex).toBe('2');
  });
});
