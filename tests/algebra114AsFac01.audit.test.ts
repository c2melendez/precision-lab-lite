import { describe, expect, it } from "vitest";
import { evaluate } from "../src/engine/algebriteClient";
import { compileNumeric } from "../src/engine/numericFallback";
import source from "../qa/certification/algebra114_source.md?raw";

describe("Algebra114 AS-FAC-01 difference of squares", () => {
  it("matches the source row, returns a factorized product, and uses an independent arithmetic oracle", () => {
    expect(source).toContain("| AS-FAC-01 | N1 | \\(x^{2}-9\\) | \\((x-3)(x+3)\\) |");

    const factored = evaluate("factor(x^2-9)");
    expect(factored).not.toContain("factor(");
    expect(factored).toContain("*");
    expect(factored).not.toContain("x^2");

    for (const x of [-5, -3, -2, 0, 3, 4, 7]) {
      const substituted = factored.replace(/\bx\b/g, "(" + x + ")");
      const actual = compileNumeric(evaluate(substituted), "__no_var__")(0);
      const expected = (x - 3) * (x + 3);
      expect(actual).toBeCloseTo(expected, 9);
    }
  });
});
