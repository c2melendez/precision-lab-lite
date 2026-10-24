import { describe, expect, it } from "vitest";
import { parseExpression } from "../src/engine/parsing";
import { evaluate } from "../src/engine/algebriteClient";
import fixture from "../qa/certification/algebra114_source.md?raw";

describe("Algebra114 AS-SIM-02 power of a power", () => {
  it("preserves original N1 oracle and checks x^6 on representative values", () => {
    expect(fixture).toContain("| AS-SIM-02 | N1 | \\((x^{2})^{3}\\) | \\(x^{6}\\) |");
    const parsed = parseExpression("(x^2)^3").algebrite;
    const oracle = parseExpression("x^6").algebrite;
    for (const x of [-3, -1, 0, 2, 5]) {
      const substitute = (expression: string) => expression.replace(/x/g, "(" + x + ")");
      const actual = Number(evaluate(substitute(parsed)));
      const expected = Number(evaluate(substitute(oracle)));
      expect(Number.isFinite(actual), String(x)).toBe(true);
      expect(actual, String(x)).toBeCloseTo(expected, 9);
    }
  });
});
