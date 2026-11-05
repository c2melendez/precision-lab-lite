import { describe, expect, it } from "vitest";
import { evaluate } from "../src/engine/algebriteClient";
import { compileNumeric } from "../src/engine/numericFallback";
import source from "../qa/certification/algebra114_source.md?raw";

describe("Algebra114 AS-PF-07 odd rational numerator and quadratic factors", () => {
  it("matches the exact source row, preserves both linear numerators and quadratic denominators, and uses independent oracles", () => {
    expect(source).toContain("| AS-PF-07 | N3 | \\(\\frac{x}{(x^{2}+1)(x^{2}+4)}\\) | \\(\\frac{x}{3(x^{2}+1)}-\\frac{x}{3(x^{2}+4)}\\) |");

    const actual = evaluate("partfrac(x/((x^2+1)*(x^2+4)),x)");
    expect(actual).not.toContain("partfrac(");
    expect(actual.replace(/\s+/g, "")).toBe("x/(3*(x^2+1))-x/(3*(x^2+4))");

    const compact = actual.replace(/\s+/g, "");
    expect(compact).toContain("x/(3*(x^2+1))");
    expect(compact).toContain("-x/(3*(x^2+4))");

    for (const x of [-5, -2, -1, 0, 1, 2, 5]) {
      const substituted = actual.replace(/\bx\b/g, "(" + x + ")");
      let numericResult;
      try {
        numericResult = evaluate(substituted);
      } catch (error) {
        throw new Error("AS-PF-07 substitution x=" + x + " input=" + substituted + ": " + String(error));
      }
      const value = compileNumeric(numericResult, "__no_var__")(0);
      const expectedDecomposition = (x / 3) * (1 / (x * x + 1) - 1 / (x * x + 4));
      const expectedOriginal = x / ((x * x + 1) * (x * x + 4));
      expect(value).toBeCloseTo(expectedDecomposition, 9);
      expect(value).toBeCloseTo(expectedOriginal, 9);
    }
  });
});
