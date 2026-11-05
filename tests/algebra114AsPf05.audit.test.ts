import { describe, expect, it } from "vitest";
import { evaluate } from "../src/engine/algebriteClient";
import { compileNumeric } from "../src/engine/numericFallback";
import source from "../qa/certification/algebra114_source.md?raw";

describe("Algebra114 AS-PF-05 improper rational and original domain exclusions", () => {
  it("matches the exact source row, preserves x != ±1, and checks the quotient with independent arithmetic", () => {
    expect(source).toContain("| AS-PF-05 | N3 | \\(\\frac{x^{3}+1}{x^{2}-1}\\) | \\(x+\\frac{1}{x-1}\\), con \\(x\\neq\\pm1\\) |");

    const original = "(x^3+1)/(x^2-1)";
    const actual = evaluate("partfrac(" + original + ",x)");
    expect(actual).not.toContain("partfrac(");
    expect(actual.replace(/\s+/g, "")).toBe("x+1/(x-1)");

    const originalDenominator = (x: number) => x * x - 1;
    expect(originalDenominator(-1)).toBe(0);
    expect(originalDenominator(1)).toBe(0);
    expect(originalDenominator(0)).not.toBe(0);

    for (const x of [-4, -2, 0, 2, 3, 5]) {
      expect(originalDenominator(x)).not.toBe(0);
      const substituted = actual.replace(/\bx\b/g, "(" + x + ")");
      let numericResult;
      try {
        numericResult = evaluate(substituted);
      } catch (error) {
        throw new Error("AS-PF-05 substitution x=" + x + " input=" + substituted + ": " + String(error));
      }
      const value = compileNumeric(numericResult, "__no_var__")(0);
      const expectedSimplified = x + 1 / (x - 1);
      const expectedOriginal = (x * x * x + 1) / (x * x - 1);
      expect(value).toBeCloseTo(expectedSimplified, 9);
      expect(value).toBeCloseTo(expectedOriginal, 9);
    }
  });
});
