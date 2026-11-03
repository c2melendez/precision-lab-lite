import { describe, expect, it } from "vitest";
import { evaluate } from "../src/engine/algebriteClient";
import { compileNumeric } from "../src/engine/numericFallback";
import source from "../qa/certification/algebra114_source.md?raw";

describe("Algebra114 AS-FAC-04 difference of cubes", () => {
  it("matches the exact source identity, returns a factorized product, and uses an independent oracle", () => {
    expect(source).toContain("| AS-FAC-04 | N2 | \\(x^{3}-1\\) | \\((x-1)(x^{2}+x+1)\\) |");

    const factored = evaluate("factor(x^3-1)");
    expect(factored).not.toContain("factor(");
    expect(factored).toContain("*");
    expect(factored).not.toContain("x^3");

    for (const x of [-4, -1, 0, 1, 2, 4, 6]) {
      const substituted = factored.replace(/\bx\b/g, "(" + x + ")");
      const actual = compileNumeric(evaluate(substituted), "__no_var__")(0);
      const expected = (x - 1) * (x * x + x + 1);
      expect(actual).toBeCloseTo(expected, 9);
    }
  });
});
