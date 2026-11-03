import { describe, expect, it } from "vitest";
import { evaluate } from "../src/engine/algebriteClient";
import { compileNumeric } from "../src/engine/numericFallback";
import source from "../qa/certification/algebra114_source.md?raw";

describe("Algebra114 AS-FAC-06 three linear factors", () => {
  it("matches the exact source identity, returns three linear factors, and uses an independent oracle", () => {
    expect(source).toContain("| AS-FAC-06 | N2 | \\(x^{3}-6x^{2}+11x-6\\) | \\((x-1)(x-2)(x-3)\\) |");

    const factored = evaluate("factor(x^3-6*x^2+11*x-6)");
    expect(factored).not.toContain("factor(");
    expect((factored.match(/\*/g) ?? []).length).toBeGreaterThanOrEqual(2);
    expect(factored).not.toContain("x^3");

    for (const x of [-4, -1, 0, 1, 2, 3, 4]) {
      const substituted = factored.replace(/\bx\b/g, "(" + x + ")");
      const actual = compileNumeric(evaluate(substituted), "__no_var__")(0);
      const expected = (x - 1) * (x - 2) * (x - 3);
      expect(actual).toBeCloseTo(expected, 9);
    }
  });
});
