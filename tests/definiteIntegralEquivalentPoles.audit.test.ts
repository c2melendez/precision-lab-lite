import {describe, expect, it} from 'vitest';
import {calcDefiniteIntegral} from '../src/engine/stepEngine/calculus';

describe('equivalent reciprocal-square forms', () => {
  const forms = ['(1/x)^2', 'x^(-2)', '1/(x*x)', '1/(x)^2'];
  it.each(forms)('rejects %s across its pole', (expression) => {
    expect(() => calcDefiniteIntegral(expression, 'x', -1, 1)).toThrowError(expect.objectContaining({code:'DOMAIN_ERROR'}));
    expect(() => calcDefiniteIntegral(expression, 'x', 1, -1)).toThrowError(expect.objectContaining({code:'DOMAIN_ERROR'}));
  });
  it.each(forms)('keeps finite integrals of %s away from zero', (expression) => {
    expect(parseFloat(calcDefiniteIntegral(expression, 'x', 1, 2).resultLatex)).toBeCloseTo(0.5, 5);
  });
});
