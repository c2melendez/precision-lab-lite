import { describe, expect, it } from "vitest";
import { parseExpression } from "../src/engine/parsing";
import { expand, evaluate } from "../src/engine/algebriteClient";
import { compileNumeric } from "../src/engine/numericFallback";
import source from "../qa/certification/algebra114_source.md?raw";

describe("Algebra114 AS-EXP-07 cube of linear expression", () => {
  it("expands the source polynomial with an independent arithmetic oracle", () => {
    expect(source).toContain("| AS-EXP-07 | N2 | \\((2x-3)^{3}\\) | \\(8x^{3}-36x^{2}+54x-27\\) |");
    const expanded = expand(parseExpression("(2*x-3)^3").algebrite);
    const normalizedTerms = expanded
      .replace(/\s+/g, "")
      .replace(/-/g, "+-")
      .split("+")
      .filter(Boolean)
      .sort();
    expect(normalizedTerms).toEqual(["8*x^3", "-36*x^2", "54*x", "-27"].sort());

    for (const x of [-3, -1, 0, 2, 5]) {
      const substituted = expanded.replace(/x/g, "(" + x + ")");
      const actual = compileNumeric(evaluate(substituted), "__no_var__")(0);
      const expected = 8 * x * x * x - 36 * x * x + 54 * x - 27;
      expect(actual).toBeCloseTo(expected, 9);
    }
  });
});
