import { describe, expect, it } from "vitest";
import { evaluate } from "../src/engine/algebriteClient";
import { compileNumeric } from "../src/engine/numericFallback";
import source from "../qa/certification/algebra114_source.md?raw";

describe("Algebra114 AS-PF-03 irreducible quadratic denominator", () => {
  it("matches the exact source row, preserves the irreducible quadratic term, and uses an independent oracle", () => {
    expect(source).toContain("| AS-PF-03 | N2 | \\(\\frac{x+1}{x(x^{2}+1)}\\) | \\(\\frac{1}{x}+\\frac{1-x}{x^{2}+1}\\) |");

    const actual = evaluate("partfrac((x+1)/(x*(x^2+1)),x)");
    expect(actual).not.toContain("partfrac(");
    expect(actual.replace(/\s+/g, "")).not.toBe("(x+1)/(x*(x^2+1))");

    const compact = actual.replace(/\s+/g, "");
    expect(compact).toBe("1/x+(1-x)/(x^2+1)");
    expect(compact).toContain("1/x");
    expect(compact).toContain("(1-x)/(x^2+1)");

    for (const x of [-5, -4, -2, -1, 1, 2, 4, 6]) {
      const substituted = actual.replace(/\bx\b/g, "(" + x + ")");
      let numericResult;
      try {
        numericResult = evaluate(substituted);
      } catch (error) {
        throw new Error("AS-PF-03 substitution x=" + x + " input=" + substituted + ": " + String(error));
      }
      const value = compileNumeric(numericResult, "__no_var__")(0);
      const expected = 1 / x + (1 - x) / (x * x + 1);
      expect(value).toBeCloseTo(expected, 9);
    }
  });
});
