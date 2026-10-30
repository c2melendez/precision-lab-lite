import { describe, expect, it } from "vitest";
import { parseExpression } from "../src/engine/parsing";
import { expand, evaluate } from "../src/engine/algebriteClient";
import { compileNumeric } from "../src/engine/numericFallback";
import source from "../qa/certification/algebra114_source.md?raw";

describe("Algebra114 AS-EXP-03 product of linear binomials", () => {
  it("expands the original product with an independent arithmetic oracle", () => {
    expect(source).toContain("| AS-EXP-03 | N2 | \\((2x-1)(3x+4)\\) | \\(6x^{2}+5x-4\\) |");
    const original = parseExpression("(2*x-1)*(3*x+4)").algebrite;
    const expanded = expand(original);
    expect(expanded.replace(/\\s+/g, "")).toBe("6*x^2+5*x-4");

    for (const x of [-4, -1, 0, 2, 5]) {
      const substituted = expanded.replace(/x/g, "(" + x + ")");
      const actual = compileNumeric(evaluate(substituted), "__no_var__")(0);
      const expected = 6 * x * x + 5 * x - 4;
      expect(actual).toBeCloseTo(expected, 9);
    }
  });
});
