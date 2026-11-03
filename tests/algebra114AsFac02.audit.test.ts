import { describe, expect, it } from "vitest";
import { evaluate } from "../src/engine/algebriteClient";
import { compileNumeric } from "../src/engine/numericFallback";
import source from "../qa/certification/algebra114_source.md?raw";

describe("Algebra114 AS-FAC-02 quadratic factoring", () => {
  it("matches the exact source identity, returns a factorized product, and uses an independent oracle", () => {
    expect(source).toContain("| AS-FAC-02 | N1 | \\(x^{2}+5x+6\\) | \\((x+2)(x+3)\\) |");

    const factored = evaluate("factor(x^2+5*x+6)");
    expect(factored).not.toContain("factor(");
    expect(factored).toContain("*");
    expect(factored).not.toContain("x^2");

    for (const x of [-6, -3, -2, -1, 0, 2, 4]) {
      const substituted = factored.replace(/\bx\b/g, "(" + x + ")");
      const actual = compileNumeric(evaluate(substituted), "__no_var__")(0);
      const expected = (x + 2) * (x + 3);
      expect(actual).toBeCloseTo(expected, 9);
    }
  });
});
