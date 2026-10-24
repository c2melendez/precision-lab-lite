import { describe, expect, it } from "vitest";
import { parseExpression } from "../src/engine/parsing";
import { evaluate } from "../src/engine/algebriteClient";
import fixture from "../qa/certification/algebra114_source.md?raw";

describe("Algebra114 AS-SIM-04 product raised to third power", () => {
  it("preserves original source and checks (xy)^3 = x^3y^3", () => {
    expect(fixture).toContain("| AS-SIM-04 | N1 | \\((xy)^{3}\\) | \\(x^{3}y^{3}\\) |");
    const observed = parseExpression("(x*y)^3").algebrite;
    const oracle = parseExpression("x^3*y^3").algebrite;
    for (const [x, y] of [[2, 3], [-2, 3], [0, 7], [5, -1], [-3, -4]]) {
      const substitute = (expr: string) => expr.replace(/x/g, "(" + x + ")").replace(/y/g, "(" + y + ")");
      const result = Number(evaluate(substitute(observed)));
      const expected = Number(evaluate(substitute(oracle)));
      expect(Number.isFinite(result)).toBe(true);
      expect(result).toBeCloseTo(expected, 9);
    }
  });
});
