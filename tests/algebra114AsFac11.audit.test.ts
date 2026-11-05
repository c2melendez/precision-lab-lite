import { describe, expect, it } from "vitest";
import { evaluate } from "../src/engine/algebriteClient";
import { compileNumeric } from "../src/engine/numericFallback";
import source from "../qa/certification/algebra114_source.md?raw";

describe("Algebra114 AS-FAC-11 grouping", () => {
  it("matches the exact source identity, preserves the linear and quadratic factors, and uses an independent oracle", () => {
    expect(source).toContain("| AS-FAC-11 | N3 | \\(x^{3}+x^{2}+x+1\\) | \\((x+1)(x^{2}+1)\\) |");

    const factored = evaluate("factor(x^3+x^2+x+1)");
    expect(factored).not.toContain("factor(");

    const compact = factored.replace(/\\s+/g, "");
    expect(compact).toContain("*");
    expect(compact).toMatch(/(?:x\\+1|1\\+x)/);
    expect(compact).toMatch(/(?:x\\^2\\+1|1\\+x\\^2)/);
    expect(compact).not.toContain("x^3");
    expect(compact).not.toContain("x^2+x+1");

    for (const x of [-4, -2, -1, 0, 1, 3, 5]) {
      const substituted = factored.replace(/\\bx\\b/g, "(" + x + ")");
      const actual = compileNumeric(evaluate(substituted), "__no_var__")(0);
      const expected = (x + 1) * (x * x + 1);
      expect(actual).toBeCloseTo(expected, 9);
    }
  });
});
