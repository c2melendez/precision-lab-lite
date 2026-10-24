import { describe, expect, it } from "vitest";
import { evaluate } from "../src/engine/algebriteClient";
import { compileNumeric } from "../src/engine/numericFallback";
import source from "../qa/certification/algebra114_source.md?raw";

describe("Algebra114 AS-PF-08 improper rational fraction", () => {
  it("decomposes x^4/(x^2-1) preserving the original x != ±1 domain", () => {
    expect(source).toContain("| AS-PF-08 | N3 |");
    const actual = evaluate("partfrac(x^4/(x^2-1),x)");
    expect(actual).not.toContain("partfrac(");
    expect(actual.replace(/\s+/g, "")).toBe("x^2+1+1/(2*(x-1))-1/(2*(x+1))");
    const originalDomain = (x: number) => x*x - 1 !== 0;
    expect(originalDomain(-1)).toBe(false);
    expect(originalDomain(1)).toBe(false);
    for (const x of [-5,-3,-2,0,2,3,5]) {
      expect(originalDomain(x)).toBe(true);
      const value = compileNumeric(actual.replace(/x/g, "(" + x + ")"), "__no_var__")(0);
      expect(value).toBeCloseTo(x**4/(x*x-1), 9);
    }
  });
});
