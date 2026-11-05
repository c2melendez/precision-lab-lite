import { describe, expect, it } from "vitest";
import { evaluate } from "../src/engine/algebriteClient";
import { compileNumeric } from "../src/engine/numericFallback";
import source from "../qa/certification/algebra114_source.md?raw";

describe("Algebra114 AS-PF-06 two irreducible quadratics", () => {
  it("matches the exact source row, preserves both quadratic denominators, and uses an independent oracle", () => {
    expect(source).toContain("| AS-PF-06 | N3 | \\(\\frac{1}{(x^{2}+1)(x^{2}+4)}\\) | \\(\\frac{1}{3}\\left(\\frac{1}{x^{2}+1}-\\frac{1}{x^{2}+4}\\right)\\) |");

    const actual = evaluate("partfrac(1/((x^2+1)*(x^2+4)),x)");
    expect(actual).not.toContain("partfrac(");
    expect(actual.replace(/\s+/g, "")).toBe("1/(3*(x^2+1))-1/(3*(x^2+4))");

    const compact = actual.replace(/\s+/g, "");
    expect(compact).toContain("x^2+1");
    expect(compact).toContain("x^2+4");
    expect(compact).toContain("1/(3*");
    expect(compact).toContain("-1/(3*");

    for (const x of [-5, -2, -1, 0, 1, 2, 5]) {
      const substituted = actual.replace(/\bx\b/g, "(" + x + ")");
      let numericResult;
      try {
        numericResult = evaluate(substituted);
      } catch (error) {
        throw new Error("AS-PF-06 substitution x=" + x + " input=" + substituted + ": " + String(error));
      }
      const value = compileNumeric(numericResult, "__no_var__")(0);
      const expectedDecomposition = (1 / 3) * (1 / (x * x + 1) - 1 / (x * x + 4));
      const expectedOriginal = 1 / ((x * x + 1) * (x * x + 4));
      expect(value).toBeCloseTo(expectedDecomposition, 9);
      expect(value).toBeCloseTo(expectedOriginal, 9);
    }
  });
});
