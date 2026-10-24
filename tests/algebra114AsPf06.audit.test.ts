import { describe, expect, it } from "vitest";
import { evaluate } from "../src/engine/algebriteClient";
import { compileNumeric } from "../src/engine/numericFallback";
import source from "../qa/certification/algebra114_source.md?raw";

describe("Algebra114 AS-PF-06 two irreducible quadratics", () => {
  it("decomposes 1/((x²+1)(x²+4)) into two exact terms", () => {
    expect(source).toContain("| AS-PF-06 | N3 |");
    const actual = evaluate("partfrac(1/((x^2+1)*(x^2+4)),x)");
    expect(actual).not.toContain("partfrac(");
    expect(actual.replace(/\s+/g, "")).toBe("1/(3*(x^2+1))-1/(3*(x^2+4))");
    for (const x of [-5,-2,-1,0,1,2,5]) {
      const substituted = actual.replace(/x/g, "(" + x + ")");
      const value = compileNumeric(substituted, "__no_var__")(0);
      expect(value).toBeCloseTo(1/((x*x+1)*(x*x+4)), 9);
    }
  });
});
