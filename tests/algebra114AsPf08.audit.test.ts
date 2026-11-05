import { describe, expect, it } from "vitest";
import { evaluate } from "../src/engine/algebriteClient";
import { compileNumeric } from "../src/engine/numericFallback";
import source from "../qa/certification/algebra114_source.md?raw";

describe("Algebra114 AS-PF-08 improper rational fraction", () => {
  it("matches the exact source row, preserves original exclusions, and uses independent arithmetic oracles", () => {
    expect(source).toContain("| AS-PF-08 | N3 | \\(\\frac{x^{4}}{x^{2}-1}\\) | \\(x^{2}+1+\\frac{1}{2(x-1)}-\\frac{1}{2(x+1)}\\), con \\(x\\neq\\pm1\\) |");

    const actual = evaluate("partfrac(x^4/(x^2-1),x)");
    expect(actual).not.toContain("partfrac(");
    expect(actual.replace(/\s+/g, "")).toBe("x^2+1+1/(2*(x-1))-1/(2*(x+1))");

    const compact = actual.replace(/\s+/g, "");
    expect(compact).toContain("x^2+1");
    expect(compact).toContain("1/(2*(x-1))");
    expect(compact).toContain("-1/(2*(x+1))");

    const originalDenominator = (x: number) => x * x - 1;
    expect(originalDenominator(-1)).toBe(0);
    expect(originalDenominator(1)).toBe(0);

    for (const x of [-5, -3, -2, 0, 2, 3, 5]) {
      expect(originalDenominator(x)).not.toBe(0);
      const substituted = actual.replace(/\bx\b/g, "(" + x + ")");
      let numericResult;
      try {
        numericResult = evaluate(substituted);
      } catch (error) {
        throw new Error("AS-PF-08 substitution x=" + x + " input=" + substituted + ": " + String(error));
      }
      const value = compileNumeric(numericResult, "__no_var__")(0);
      const expectedDecomposition = x * x + 1 + 1 / (2 * (x - 1)) - 1 / (2 * (x + 1));
      const expectedOriginal = (x * x * x * x) / (x * x - 1);
      expect(value).toBeCloseTo(expectedDecomposition, 9);
      expect(value).toBeCloseTo(expectedOriginal, 9);
    }
  });
});
