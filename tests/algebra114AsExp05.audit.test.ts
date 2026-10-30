import { describe, expect, it } from "vitest";
import { parseExpression } from "../src/engine/parsing";
import { expand, evaluate } from "../src/engine/algebriteClient";
import { compileNumeric } from "../src/engine/numericFallback";
import source from "../qa/certification/algebra114_source.md?raw";

describe("Algebra114 AS-EXP-05 difference of cubes", () => {
  it("expands the original product with an independent arithmetic oracle", () => {
    expect(source).toContain("| AS-EXP-05 | N2 | \\((x-1)(x^{2}+x+1)\\) | \\(x^{3}-1\\) |");
    const original = parseExpression("(x-1)*(x^2+x+1)").algebrite;
    const expanded = expand(original);
    expect(expanded.replace(/\s+/g, "")).toBe("x^3-1");

    for (const x of [-4, -1, 0, 1, 2, 5]) {
      const substituted = expanded.replace(/x/g, "(" + x + ")");
      const actual = compileNumeric(evaluate(substituted), "__no_var__")(0);
      const expected = x * x * x - 1;
      expect(actual).toBeCloseTo(expected, 9);
    }
  });
});
