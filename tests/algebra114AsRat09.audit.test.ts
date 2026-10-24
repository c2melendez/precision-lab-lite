import { describe, expect, it } from "vitest";
import { evaluate } from "../src/engine/algebriteClient";
import { compileNumeric } from "../src/engine/numericFallback";
import source from "../qa/certification/algebra114_source.md?raw";

describe("Algebra114 AS-RAT-09 variable radical denominator", () => {
  it("rationalizes the original conjugate quotient on its restricted real domain", () => {
    expect(source).toContain("| AS-RAT-09 | N3 |");
    const original = "1/(sqrt(x)+sqrt(y))";
    const result = evaluate(original);
    expect(result.replace(/\s+/g, "")).toBe("(sqrt(x)-sqrt(y))/(x-y)");
    for (const [x, y] of [[4, 1], [1, 4], [9, 0], [0, 16], [0.25, 2]]) {
      expect(x).toBeGreaterThanOrEqual(0);
      expect(y).toBeGreaterThanOrEqual(0);
      expect(x).not.toBe(y);
      const resolved = result.replace(/x/g, "(" + x + ")").replace(/y/g, "(" + y + ")");
      expect(compileNumeric(resolved, "__none__")(0)).toBeCloseTo(1/(Math.sqrt(x)+Math.sqrt(y)), 9);
    }
  });
});
