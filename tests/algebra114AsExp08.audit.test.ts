import { describe, expect, it } from "vitest";
import { parseExpression } from "../src/engine/parsing";
import { expand, evaluate } from "../src/engine/algebriteClient";
import { compileNumeric } from "../src/engine/numericFallback";
import source from "../qa/certification/algebra114_source.md?raw";

describe("Algebra114 AS-EXP-08 three linear factors", () => {
  it("expands the source product with an independent arithmetic oracle", () => {
    expect(source).toContain("| AS-EXP-08 | N3 | \\((x+2)(x-3)(x+1)\\) | \\(x^{3}-7x-6\\) |");
    const expanded = expand(parseExpression("(x+2)*(x-3)*(x+1)").algebrite);
    const normalizedTerms = expanded
      .replace(/\s+/g, "")
      .replace(/-/g, "+-")
      .split("+")
      .filter(Boolean)
      .sort();
    expect(normalizedTerms).toEqual(["x^3", "-7*x", "-6"].sort());

    for (const x of [-4, -2, -1, 0, 3, 5]) {
      const substituted = expanded.replace(/x/g, "(" + x + ")");
      const actual = compileNumeric(evaluate(substituted), "__no_var__")(0);
      const expected = x * x * x - 7 * x - 6;
      expect(actual).toBeCloseTo(expected, 9);
    }
  });
});
