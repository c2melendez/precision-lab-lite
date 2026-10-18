import { describe, expect, it } from "vitest";
import { parseExpression } from "../src/engine/parsing";
import { evaluate } from "../src/engine/algebriteClient";
import fixture from "../qa/certification/algebra114_source.md?raw";

describe("Algebra114 AS-SIM-03 multiply powers of the same base", () => {
  it("preserves the N1 source and checks the x^5 oracle", () => {
    expect(fixture).toContain("| AS-SIM-03 | N1 | \\(x^{2}x^{3}\\) | \\(x^{5}\\) |");
    const observed = parseExpression("x^2*x^3").algebrite;
    const expected = parseExpression("x^5").algebrite;
    for (const x of [-3, -1, 0, 2, 5]) {
      const substitute = (expr: string) => expr.replace(/x/g, "(" + x + ")");
      const actual = Number(evaluate(substitute(observed)));
      const oracle = Number(evaluate(substitute(expected)));
      expect(Number.isFinite(actual)).toBe(true);
      expect(actual).toBeCloseTo(oracle, 9);
    }
  });
});
