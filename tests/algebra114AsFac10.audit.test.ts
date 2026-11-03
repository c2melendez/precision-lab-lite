import { describe, expect, it } from "vitest";
import { evaluate } from "../src/engine/algebriteClient";
import { compileNumeric } from "../src/engine/numericFallback";
import source from "../qa/certification/algebra114_source.md?raw";

describe("Algebra114 AS-FAC-10 sum of cubes two variables", () => {
  it("matches the exact source identity, returns linear and quadratic factors, and uses an independent oracle", () => {
    expect(source).toContain("| AS-FAC-10 | N3 | \\(x^{3}+y^{3}\\) | \\((x+y)(x^{2}-xy+y^{2})\\) |");

    const factored = evaluate("factor(x^3+y^3)");
    expect(factored).not.toContain("factor(");
    expect((factored.match(/\*/g) ?? []).length).toBeGreaterThanOrEqual(2);
    expect(factored).toContain("x^2");
    expect(factored).toContain("y^2");
    expect(factored).toContain("x*y");
    expect(factored).not.toContain("x^3");
    expect(factored).not.toContain("y^3");

    for (const x of [-3, -1, 0, 1, 2, 4]) {
      for (const y of [-2, 0, 1, 3]) {
        const substituted = factored
          .replace(/\bx\b/g, "(" + x + ")")
          .replace(/\by\b/g, "(" + y + ")");
        const actual = compileNumeric(evaluate(substituted), "__no_var__")(0);
        const expected = (x + y) * (x * x - x * y + y * y);
        expect(actual).toBeCloseTo(expected, 9);
      }
    }
  });
});
