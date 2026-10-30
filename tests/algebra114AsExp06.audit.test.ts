import { describe, expect, it } from "vitest";
import { parseExpression } from "../src/engine/parsing";
import { expand, evaluate } from "../src/engine/algebriteClient";
import { compileNumeric } from "../src/engine/numericFallback";
import source from "../qa/certification/algebra114_source.md?raw";

describe("Algebra114 AS-EXP-06 binomial cube", () => {
  it("expands the original cube with an independent arithmetic oracle", () => {
    expect(source).toContain("| AS-EXP-06 | N2 | \\((x+y)^{3}\\) | \\(x^{3}+3x^{2}y+3xy^{2}+y^{3}\\) |");
    const original = parseExpression("(x+y)^3").algebrite;
    const expanded = expand(original);
    const normalizedTerms = expanded.replace(/\s+/g, "").split("+").sort();
    expect(normalizedTerms).toEqual(["x^3", "y^3", "3*x*y^2", "3*x^2*y"].sort());

    for (const [x, y] of [[2, 3], [-2, 3], [0, 5], [-3, -4], [1, -1]]) {
      const substituted = expanded.replace(/x/g, "(" + x + ")").replace(/y/g, "(" + y + ")");
      const actual = compileNumeric(evaluate(substituted), "__no_var__")(0);
      const expected = (x + y) * (x + y) * (x + y);
      expect(actual).toBeCloseTo(expected, 9);
    }
  });
});
