import { describe, expect, it } from "vitest";
import { parseExpression } from "../src/engine/parsing";
import { expand, evaluate } from "../src/engine/algebriteClient";
import { compileNumeric } from "../src/engine/numericFallback";
import source from "../qa/certification/algebra114_source.md?raw";

describe("Algebra114 AS-EXP-02 binomial square", () => {
  it("expands the original square with an independent arithmetic oracle", () => {
    expect(source).toContain("| AS-EXP-02 | N1 | \\((x+2)^{2}\\) | \\(x^{2}+4x+4\\) |");
    const original = parseExpression("(x+2)^2").algebrite;
    const expanded = expand(original);
    expect(expanded.replace(/\s+/g, "")).toBe("x^2+4*x+4");

    for (const x of [-4, -2, -1, 0, 3]) {
      const substituted = expanded.replace(/x/g, "(" + x + ")");
      const actual = compileNumeric(evaluate(substituted), "__no_var__")(0);
      const expected = x * x + 4 * x + 4;
      expect(actual).toBeCloseTo(expected, 9);
    }
  });
});
