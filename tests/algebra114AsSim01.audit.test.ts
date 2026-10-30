import { describe, expect, it } from "vitest";
import { parseExpression } from "../src/engine/parsing";
import { evaluate } from "../src/engine/algebriteClient";
import fixture from "../qa/certification/algebra114_source.md?raw";

describe("Algebra114 AS-SIM-01 combine like terms", () => {
  it("preserves the source oracle and checks the simplified expression independently", () => {
    expect(fixture).toContain("| AS-SIM-01 | N1 | \\(3x+2y-x+5y\\) | \\(2x+7y\\) |");

    const parsed = parseExpression("3x+2y-x+5y").algebrite;
    const simplified = evaluate(parsed);
    expect(simplified.replace(/\\s+/g, "")).toBe("2*x+7*y");

    // Independent arithmetic oracle: expected values are computed in JS,
    // not by asking Algebrite to evaluate the expected symbolic expression.
    for (const [x, y] of [[2,  3], [-5, 7], [0, -4], [11, 0], [-3, -4]]) {
      const substituted = simplified
        .replace(/\\bx\\b/g, "(" + x + ")")
        .replace(/\\by\\b/g, "(" + y + ")");
      const actual = Number(evaluate(substituted));
      const expected = 2 * x + 7 * y;
      expect(Number.isFinite(actual), String([x, y])).toBe(true);
      expect(actual, String([x, y])).toBeCloseTo(expected, 9);
    }
  });
});
