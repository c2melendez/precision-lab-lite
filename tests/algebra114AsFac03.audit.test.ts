import { describe, expect, it } from "vitest";
import { evaluate } from "../src/engine/algebriteClient";
import { compileNumeric } from "../src/engine/numericFallback";
import source from "../qa/certification/algebra114_source.md?raw";

describe("Algebra114 AS-FAC-03 nonmonic trinomial", () => {
  it("matches the exact source identity, returns a factorized product, and uses an independent oracle", () => {
    expect(source).toContain("| AS-FAC-03 | N2 | \\(6x^{2}-11x+3\\) | \\((3x-1)(2x-3)\\) |");

    const factored = evaluate("factor(6*x^2-11*x+3)");
    expect(factored).not.toContain("factor(");
    expect(factored).toContain("*");
    expect(factored).not.toContain("x^2");

    for (const x of [-4, -1, 0, 1, 2, 4, 6]) {
      const substituted = factored.replace(/\bx\b/g, "(" + x + ")");
      const actual = compileNumeric(evaluate(substituted), "__no_var__")(0);
      const expected = (3 * x - 1) * (2 * x - 3);
      expect(actual).toBeCloseTo(expected, 9);
    }
  });
});
