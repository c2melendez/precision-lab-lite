import { describe, expect, it } from "vitest";
import { evaluate } from "../src/engine/algebriteClient";
import { compileNumeric } from "../src/engine/numericFallback";
import source from "../qa/certification/algebra114_source.md?raw";

describe("Algebra114 AS-PF-04 distinct real poles", () => {
  it("decomposes (2x+3)/(x²-4) into exact terms with poles at ±2", () => {
    expect(source).toContain("| AS-PF-04 | N2 |");
    const actual = evaluate("partfrac((2*x+3)/(x^2-4),x)");
    expect(actual).not.toContain("partfrac(");
    expect(actual.replace(/\s+/g, "")).toBe("7/(4*(x-2))+1/(4*(x+2))");
    for (const x of [-5, -3, -1, 0, 1, 3, 6]) {
      const substituted = actual.replace(/x/g, "(" + x + ")");
      const value = compileNumeric(substituted, "__no_var__")(0);
      expect(value).toBeCloseTo((2*x+3)/(x*x-4), 9);
    }
  });
});
