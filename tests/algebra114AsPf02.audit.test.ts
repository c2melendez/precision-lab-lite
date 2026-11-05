import { describe, expect, it } from "vitest";
import { evaluate } from "../src/engine/algebriteClient";
import { compileNumeric } from "../src/engine/numericFallback";
import source from "../qa/certification/algebra114_source.md?raw";

describe("Algebra114 AS-PF-02 repeated pole", () => {
  it("matches the exact source row, preserves the simple and repeated poles, and uses an independent oracle", () => {
    expect(source).toContain("| AS-PF-02 | N2 | \\(\\frac{1}{x(x-1)^{2}}\\) | \\(\\frac{1}{x}-\\frac{1}{x-1}+\\frac{1}{(x-1)^{2}}\\) |");

    const result = evaluate("partfrac(1/(x*(x-1)^2),x)");
    expect(result).not.toContain("partfrac(");
    expect(result.replace(/\s+/g, "")).not.toBe("1/(x*(x-1)^2)");

    const compact = result.replace(/\s+/g, "");
    expect(compact.match(/\//g)?.length ?? 0).toBeGreaterThanOrEqual(3);
    expect(compact).toContain("1/x");
    expect(compact).toContain("1/(x-1)");
    expect(compact).toMatch(/1\/\(x-1\)\^2/);

    for (const x of [-5, -4, -2, -1, 2, 3, 5, 7]) {
      const substituted = result.replace(/\bx\b/g, "(" + x + ")");
      let numericResult;
      try {
        numericResult = evaluate(substituted);
      } catch (error) {
        throw new Error("AS-PF-02 substitution x=" + x + " input=" + substituted + ": " + String(error));
      }
      const actual = compileNumeric(numericResult, "__no_var__")(0);
      const expected = 1 / x - 1 / (x - 1) + 1 / ((x - 1) * (x - 1));
      expect(actual).toBeCloseTo(expected, 9);
    }
  });
});
