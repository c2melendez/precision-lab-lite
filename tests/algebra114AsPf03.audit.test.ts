import { describe, expect, it } from "vitest";
import { evaluate } from "../src/engine/algebriteClient";
import { compileNumeric } from "../src/engine/numericFallback";
import source from "../qa/certification/algebra114_source.md?raw";

describe("Algebra114 AS-PF-03 irreducible quadratic denominator", () => {
  it("decomposes the original (x+1)/(x*(x^2+1)) into partial fractions", () => {
    expect(source).toContain("| AS-PF-03 | N2 |");
    const actual = evaluate("partfrac((x+1)/(x*(x^2+1)),x)");
    expect(actual).not.toContain("partfrac(");
    expect(actual).not.toBe("(x+1)/(x*(x^2+1))");
    for (const x of [-4, -2, -1, -0.5, 0.5, 1, 2, 4]) {
      const substitute = actual.replace(/x/g, "(" + x + ")");
      const result = compileNumeric(evaluate(substitute), "__no_var__")(0);
      expect(result).toBeCloseTo(1/x+(1-x)/(x*x+1), 9);
    }
  });
});
