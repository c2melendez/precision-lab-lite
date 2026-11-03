import { describe, expect, it } from "vitest";
import { evaluate } from "../src/engine/algebriteClient";
import { compileNumeric } from "../src/engine/numericFallback";
import source from "../qa/certification/algebra114_source.md?raw";

describe("Algebra114 AS-FAC-07 four linear factors", () => {
  it("matches the exact source identity, returns four linear factors, and uses an independent oracle", () => {
    expect(source).toContain("| AS-FAC-07 | N2 | \\(x^{4}-5x^{2}+4\\) | \\((x-1)(x+1)(x-2)(x+2)\\) |");

    const factored = evaluate("factor(x^4-5*x^2+4)");
    expect(factored).not.toContain("factor(");
    expect((factored.match(/\*/g) ?? []).length).toBeGreaterThanOrEqual(3);
    expect(factored).not.toContain("x^4");

    for (const x of [-4, -2, -1, 0, 1, 2, 3, 4]) {
      const substituted = factored.replace(/\bx\b/g, "(" + x + ")");
      const actual = compileNumeric(evaluate(substituted), "__no_var__")(0);
      const expected = (x - 1) * (x + 1) * (x - 2) * (x + 2);
      expect(actual).toBeCloseTo(expected, 9);
    }
  });
});
