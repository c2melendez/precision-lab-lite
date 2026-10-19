import { describe, expect, it } from "vitest";
import { evaluate } from "../src/engine/algebriteClient";
import { parseExpression } from "../src/engine/parsing";
import source from "../qa/certification/algebra114_source.md?raw";

describe("Algebra114 AS-AVS-02 real absolute-value product", () => {
  it("rewrites the original |xy| as |x||y| over the reals", () => {
    expect(source).toContain("| AS-AVS-02 | N2 | \\(|xy|\\) | \\(|x||y|\\) |");
    const parsed = parseExpression("|xy|");
    expect(parsed.isEquation).toBe(false);
    const actual = evaluate(parsed.algebrite).replace(/\s+/g, "");
    expect(actual).toBe("abs(x)*abs(y)");
    for (const [x, y] of [[-3, 2], [-1, -4], [0, 5], [2, 7], [-2.5, -0.5]]) {
      const numeric = evaluate(
        actual.replace(/x/g, `(${x})`).replace(/y/g, `(${y})`),
      );
      expect(Number(numeric)).toBeCloseTo(Math.abs(x) * Math.abs(y), 9);
    }
  });
});
