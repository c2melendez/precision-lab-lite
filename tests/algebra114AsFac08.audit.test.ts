import { describe, expect, it } from "vitest";
import { evaluate } from "../src/engine/algebriteClient";
import { compileNumeric } from "../src/engine/numericFallback";
import source from "../qa/certification/algebra114_source.md?raw";

describe("Algebra114 AS-FAC-08 Sophie Germain identity", () => {
  it("matches the exact source identity, returns two real quadratic factors, and uses an independent oracle", () => {
    expect(source).toContain("| AS-FAC-08 | N3 | \\(x^{4}+4\\) | \\((x^{2}-2x+2)(x^{2}+2x+2)\\) |");

    const factored = evaluate("factor(x^4+4)");
    expect(factored).not.toContain("factor(");
    expect((factored.match(/\*/g) ?? []).length).toBeGreaterThanOrEqual(1);
    expect((factored.match(/x\^2/g) ?? []).length).toBeGreaterThanOrEqual(2);
    expect(factored).not.toContain("x^4");

    for (const x of [-4, -2, -1, 0, 1, 2, 3, 4]) {
      const substituted = factored.replace(/\bx\b/g, "(" + x + ")");
      const actual = compileNumeric(evaluate(substituted), "__no_var__")(0);
      const expected = (x * x - 2 * x + 2) * (x * x + 2 * x + 2);
      expect(actual).toBeCloseTo(expected, 9);
    }
  });
});
