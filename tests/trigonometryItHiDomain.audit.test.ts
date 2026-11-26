import { describe, it, expect } from 'vitest';
import { calcDefiniteIntegral } from '../src/engine/stepEngine/calculus';
import { ErrorCode } from '../src/types';

/**
 * TR324 IT-HI domain guards on definite integrals of inverse-hyperbolic
 * primitives. The FTC must not be applied across the real-domain boundary;
 * a formal antiderivative would otherwise yield a misleading finite value.
 */
describe('IT-HI domain guards on definite integrals', () => {
  describe('acosh domain [1, +∞)', () => {
    it('rejects an interval that starts below 1', () => {
      expect(() => calcDefiniteIntegral('acosh(x)', 'x', 0, 2)).toThrow(
        expect.objectContaining({ code: ErrorCode.DOMAIN_ERROR }),
      );
    });
    it('rejects a fully sub-domain interval', () => {
      expect(() => calcDefiniteIntegral('acosh(x)', 'x', -1, 0.5)).toThrow(
        expect.objectContaining({ code: ErrorCode.DOMAIN_ERROR }),
      );
    });
    it('accepts an interval inside the domain', () => {
      const result = calcDefiniteIntegral('acosh(x)', 'x', 1, 2);
      expect(Number.isFinite(parseFloat(result.resultLatex))).toBe(true);
    });
    it('accepts inverted limits still inside the domain', () => {
      const result = calcDefiniteIntegral('acosh(x)', 'x', 3, 1.5);
      expect(Number.isFinite(parseFloat(result.resultLatex))).toBe(true);
    });
  });

  describe('atanh domain (-1, 1)', () => {
    it('rejects an interval that reaches +1', () => {
      expect(() => calcDefiniteIntegral('atanh(x)', 'x', 0, 1)).toThrow(
        expect.objectContaining({ code: ErrorCode.DOMAIN_ERROR }),
      );
    });
    it('rejects an interval that reaches -1', () => {
      expect(() => calcDefiniteIntegral('atanh(x)', 'x', -1, 0)).toThrow(
        expect.objectContaining({ code: ErrorCode.DOMAIN_ERROR }),
      );
    });
    it('rejects an interval that crosses the domain', () => {
      expect(() => calcDefiniteIntegral('atanh(x)', 'x', -2, 2)).toThrow(
        expect.objectContaining({ code: ErrorCode.DOMAIN_ERROR }),
      );
    });
    it('accepts a strict interior interval', () => {
      const result = calcDefiniteIntegral('atanh(x)', 'x', -0.5, 0.5);
      expect(Number.isFinite(parseFloat(result.resultLatex))).toBe(true);
    });
  });

  describe('arcoth domain |x| > 1 (via atanh(1/x))', () => {
    it('rejects an interval that intersects [-1, 1]', () => {
      expect(() => calcDefiniteIntegral('atanh(1/(x))', 'x', 0, 2)).toThrow(
        expect.objectContaining({ code: ErrorCode.DOMAIN_ERROR }),
      );
    });
    it('rejects an interval that touches the pole at 1', () => {
      expect(() => calcDefiniteIntegral('atanh(1/(x))', 'x', 1, 3)).toThrow(
        expect.objectContaining({ code: ErrorCode.DOMAIN_ERROR }),
      );
    });
    it('accepts an interval entirely above 1', () => {
      const result = calcDefiniteIntegral('atanh(1/(x))', 'x', 2, 4);
      expect(Number.isFinite(parseFloat(result.resultLatex))).toBe(true);
    });
    it('accepts an interval entirely below -1', () => {
      const result = calcDefiniteIntegral('atanh(1/(x))', 'x', -4, -2);
      expect(Number.isFinite(parseFloat(result.resultLatex))).toBe(true);
    });
  });
});
