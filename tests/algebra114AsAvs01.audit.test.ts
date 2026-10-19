import { describe, expect, it } from "vitest";
import { evaluate } from "../src/engine/algebriteClient";
import { parseExpression } from "../src/engine/parsing";
import source from "../qa/certification/algebra114_source.md?raw";

describe("Algebra114 AS-AVS-01 real absolute-value square", () => {
  it("reduces the original |x|^2 to x^2", () => {
    expect(source).toContain("| AS-AVS-01 | N1 | \\(|x|^{2}\\) | \\(x^{2}\\) |");
    const parsed = parseExpression("|x|^2");
    expect(parsed.isEquation).toBe(false);
    const actual = evaluate(parsed.algebrite).replace(/\s+/g, "");
    expect(actual).not.toMatch(/abs\(/i);
    expect(evaluate(`simplify((${actual})-(x^2))`).replace(/\s+/g, "")).toBe("0");
    for (const x of [-5, -1, 0, 2, 7]) {
      const numeric = evaluate(actual.replace(/x/g, `(${x})`));
      expect(Number(numeric)).toBeCloseTo(x * x, 9);
    }
  });
});
