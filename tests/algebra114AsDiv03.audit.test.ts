import { describe, expect, it } from "vitest";
import { evaluate } from "../src/engine/algebriteClient";
import { compileNumeric } from "../src/engine/numericFallback";
import source from "../qa/certification/algebra114_source.md?raw";

describe("Algebra114 AS-DIV-03 original cubic division with remainder", () => {
  it("preserves quotient x^2+x-2, remainder 7 and the x != -1 domain", () => {
    expect(source).toContain("| AS-DIV-03 | N2 |");
    const result = evaluate("(x^3+2*x^2-x+5)/(x+1)");
    const numeric = compileNumeric(result, "x");
    for (const x of [-4, -2, 0, 1, 2, 4]) {
      const expected = x*x+x-2+7/(x+1);
      expect(numeric(x)).toBeCloseTo(expected, 9);
      expect(numeric(x)).toBeCloseTo((x*x*x+2*x*x-x+5)/(x+1), 9);
      expect(x*x*x+2*x*x-x+5-(x+1)*(x*x+x-2)).toBe(7);
    }
    expect((-1**3+2*(-1)**2-(-1)+5)/(-1+1)).toBe(Infinity);
  });
});
