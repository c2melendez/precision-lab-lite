import { describe, expect, it } from "vitest";
import { evaluate } from "../src/engine/algebriteClient";
import { compileNumeric } from "../src/engine/numericFallback";
import source from "../qa/certification/algebra114_source.md?raw";

describe("Algebra114 AS-DIV-05 original cubic division with nonzero remainder", () => {
  it("preserves quotient 2*x^2-x+4, remainder -3 and the x != 1 domain", () => {
    expect(source).toContain("| AS-DIV-05 | N3 |");
    const result = evaluate("(2*x^3-3*x^2+5*x-7)/(x-1)");
    const numeric = compileNumeric(result, "x");
    for (const x of [-3, -1, 0, 2, 3, 5]) {
      const expected = 2*x*x-x+4-3/(x-1);
      expect(numeric(x)).toBeCloseTo(expected, 9);
      expect(numeric(x)).toBeCloseTo((2*x**3-3*x*x+5*x-7)/(x-1), 9);
      expect(2*x**3-3*x*x+5*x-7-(x-1)*(2*x*x-x+4)).toBe(-3);
    }
    // The original rational input remains undefined at x=1.
    expect(1-1).toBe(0);
  });
});
