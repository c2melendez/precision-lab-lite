import { describe, expect, it } from "vitest";
import { evaluate } from "../src/engine/algebriteClient";
import { compileNumeric } from "../src/engine/numericFallback";
import source from "../qa/certification/algebra114_source.md?raw";

describe("Algebra114 AS-DIV-04 original quartic division with remainder", () => {
  it("preserves quotient x^2+x, remainder 1 and the polynomial identity", () => {
    expect(source).toContain("| AS-DIV-04 | N3 |");
    const result = evaluate("(x^4+x^3+x^2+x+1)/(x^2+1)");
    const numeric = compileNumeric(result, "x");
    for (const x of [-3, -1, 0, 1, 2, 4]) {
      const expected = x*x+x+1/(x*x+1);
      expect(numeric(x)).toBeCloseTo(expected, 9);
      expect(numeric(x)).toBeCloseTo((x**4+x**3+x*x+x+1)/(x*x+1), 9);
      expect(x**4+x**3+x*x+x+1-(x*x+1)*(x*x+x)).toBe(1);
    }
  });
});
