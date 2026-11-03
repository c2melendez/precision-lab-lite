import { describe, expect, it } from "vitest";
import { evaluate } from "../src/engine/algebriteClient";
import { compileNumeric } from "../src/engine/numericFallback";
import source from "../qa/certification/algebra114_source.md?raw";

describe("Algebra114 AS-FAC-09 real irrational factorization", () => {
  it("matches the exact source identity, returns two real quadratic factors, and uses an independent oracle", () => {
    expect(source).toContain("| AS-FAC-09 | N3 | \\(x^{4}+1\\) sobre \\(\\mathbb{R}\\) | \\((x^{2}+\\sqrt{2}x+1)(x^{2}-\\sqrt{2}x+1)\\) |");

    const factored = evaluate("factor(x^4+1)");
    expect(factored).not.toContain("factor(");
    expect((factored.match(/\*/g) ?? []).length).toBeGreaterThanOrEqual(1);
    expect((factored.match(/x\^2/g) ?? []).length).toBeGreaterThanOrEqual(2);
    expect(factored).not.toContain("x^4");

    const rootTwo = Math.sqrt(2);
    for (const x of [-3, -2, -1, 0, 1, 2, 3]) {
      const substituted = factored.replace(/\bx\b/g, "(" + x + ")");
      const actual = compileNumeric(evaluate(substituted), "__no_var__")(0);
      const expected = (x * x + rootTwo * x + 1) * (x * x - rootTwo * x + 1);
      expect(actual).toBeCloseTo(expected, 9);
    }
  });
});
