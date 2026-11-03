import { describe, expect, it } from "vitest";
import { parseExpression } from "../src/engine/parsing";
import { expand, evaluate } from "../src/engine/algebriteClient";
import { compileNumeric } from "../src/engine/numericFallback";
import source from "../qa/certification/algebra114_source.md?raw";

describe("Algebra114 AS-EXP-10 negative product expansion", () => {
  it("matches the exact source identity and an independent arithmetic oracle", () => {
    expect(source).toContain("| AS-EXP-10 | N3 | \\(-(x-1)(x+2)\\) | \\(-x^{2}-x+2\\) |");

    const expanded = expand(parseExpression("-(x-1)*(x+2)").algebrite);
    const normalizedTerms = expanded
      .replace(/\s+/g, "")
      .replace(/-/g, "+-")
      .split("+")
      .filter(Boolean)
      .sort();

    expect(normalizedTerms).toEqual(["-x^2", "-x", "2"].sort());

    for (const x of [-4, -2, -1, 0, 1, 3, 5]) {
      const substituted = expanded.replace(/\bx\b/g, "(" + x + ")");
      const actual = compileNumeric(evaluate(substituted), "__no_var__")(0);
      const expected = -(x - 1) * (x + 2);
      expect(actual).toBeCloseTo(expected, 9);
    }
  });
});
