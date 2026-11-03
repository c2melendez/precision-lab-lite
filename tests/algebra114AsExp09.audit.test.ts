import { describe, expect, it } from "vitest";
import { parseExpression } from "../src/engine/parsing";
import { expand, evaluate } from "../src/engine/algebriteClient";
import { compileNumeric } from "../src/engine/numericFallback";
import source from "../qa/certification/algebra114_source.md?raw";

describe("Algebra114 AS-EXP-09 three-variable trinomial square", () => {
  it("matches the exact source identity and an independent arithmetic oracle", () => {
    expect(source).toContain("| AS-EXP-09 | N3 | \\((a+b+c)^{2}\\) | \\(a^{2}+b^{2}+c^{2}+2ab+2ac+2bc\\) |");

    const expanded = expand(parseExpression("(a+b+c)^2").algebrite);
    const normalizedTerms = expanded
      .replace(/\\s+/g, "")
      .replace(/-/g, "+-")
      .split("+")
      .filter(Boolean)
      .sort();
    expect(normalizedTerms).toEqual([
      "a^2",
      "b^2",
      "c^2",
      "2*a*b",
      "2*a*c",
      "2*b*c",
    ].sort());

    const substitutions = [
      [1, 2, 3],
      [-2, 3, 5],
      [0, -1, 2],
      [-3, -4, -5],
      [1, -1, 0],
      [4, -2, 1],
    ] as const;

    for (const [a, b, c] of substitutions) {
      const substituted = expanded
        .replace(/\\ba\\b/g, "(" + a + ")")
        .replace(/\\bb\\b/g, "(" + b + ")")
        .replace(/\\bc\\b/g, "(" + c + ")");
      const actual = compileNumeric(evaluate(substituted), "__no_var__")(0);
      const expected = (a + b + c) * (a + b + c);
      expect(actual).toBeCloseTo(expected, 9);
    }
  });
});
