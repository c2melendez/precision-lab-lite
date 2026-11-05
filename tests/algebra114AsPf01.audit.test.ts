import { describe, expect, it } from "vitest";
import { evaluate } from "../src/engine/algebriteClient";
import { compileNumeric } from "../src/engine/numericFallback";
import source from "../qa/certification/algebra114_source.md?raw";

describe("Algebra114 AS-PF-01 partial fractions, engine scope", () => {
  it("matches the exact source row, returns two distinct simple poles, and uses an independent oracle", () => {
    expect(source).toContain("| AS-PF-01 | N2 | \\(\\frac{3x+5}{(x+1)(x+2)}\\) | \\(\\frac{2}{x+1}+\\frac{1}{x+2}\\) |");

    const result = evaluate("partfrac((3*x+5)/((x+1)*(x+2)),x)");
    expect(result).not.toContain("partfrac(");
    expect(result).not.toContain("(3*x+5)/((x+1)*(x+2))");

    const compact = result.replace(/\s+/g, "");
    expect(compact.match(/\//g)?.length ?? 0).toBeGreaterThanOrEqual(2);
    expect(compact).toMatch(/(?:x\+1|1\+x)/);
    expect(compact).toMatch(/(?:x\+2|2\+x)/);

    for (const x of [-5, -4, -3, 0, 1, 3, 4, 5, 6]) {
      const substituted = result.replace(/\bx\b/g, "(" + x + ")");
      let numericResult;
      try {
        numericResult = evaluate(substituted);
      } catch (error) {
        throw new Error("AS-PF-01 substitution x=" + x + " input=" + substituted + ": " + String(error));
      }
      const actual = compileNumeric(numericResult, "__no_var__")(0);
      const expected = 2 / (x + 1) + 1 / (x + 2);
      expect(actual).toBeCloseTo(expected, 9);
    }
  });
});
