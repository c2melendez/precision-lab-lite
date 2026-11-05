import { describe, expect, it } from "vitest";
import { evaluate } from "../src/engine/algebriteClient";
import { compileNumeric } from "../src/engine/numericFallback";
import source from "../qa/certification/algebra114_source.md?raw";

describe("Algebra114 AS-PF-04 distinct real poles", () => {
  it("matches the exact source row, preserves both simple poles and coefficients, and uses an independent oracle", () => {
    expect(source).toContain("| AS-PF-04 | N2 | \\(\\frac{2x+3}{x^{2}-4}\\) | \\(\\frac{7}{4(x-2)}+\\frac{1}{4(x+2)}\\) |");

    const actual = evaluate("partfrac((2*x+3)/(x^2-4),x)");
    expect(actual).not.toContain("partfrac(");
    expect(actual.replace(/\s+/g, "")).not.toBe("(2*x+3)/(x^2-4)");

    const compact = actual.replace(/\s+/g, "");
    expect(compact).toBe("7/(4*(x-2))+1/(4*(x+2))");
    expect(compact).toContain("7/(4*(x-2))");
    expect(compact).toContain("1/(4*(x+2))");

    for (const x of [-5, -3, -1, 0, 1, 3, 5, 6]) {
      const substituted = actual.replace(/\bx\b/g, "(" + x + ")");
      let numericResult;
      try {
        numericResult = evaluate(substituted);
      } catch (error) {
        throw new Error("AS-PF-04 substitution x=" + x + " input=" + substituted + ": " + String(error));
      }
      const value = compileNumeric(numericResult, "__no_var__")(0);
      const expected = (2 * x + 3) / (x * x - 4);
      expect(value).toBeCloseTo(expected, 9);
    }
  });
});
