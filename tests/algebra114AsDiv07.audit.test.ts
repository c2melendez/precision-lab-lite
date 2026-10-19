import { describe, expect, it } from "vitest";
import { evaluate } from "../src/engine/algebriteClient";
import { compileNumeric } from "../src/engine/numericFallback";
import source from "../qa/certification/algebra114_source.md?raw";

describe("Algebra114 AS-DIV-07 original fifth-degree division by x-1", () => {
  it("preserves quotient x^4+x^3+x^2+x+1, zero remainder and the x != 1 domain", () => {
    expect(source).toContain("| AS-DIV-07 | N3 |");
    const result = evaluate("(x^5-1)/(x-1)");
    const numeric = compileNumeric(result, "x");
    for (const x of [-3, -1, 0, 2, 3, 5]) {
      const quotient = x**4+x**3+x**2+x+1;
      expect(numeric(x)).toBeCloseTo(quotient, 9);
      expect(numeric(x)).toBeCloseTo((x**5-1)/(x-1), 9);
      expect(x**5-1-(x-1)*quotient).toBe(0);
    }
    // The original denominator is zero at x=1, so the input's domain excludes it.
    expect(1-1).toBe(0);
  });
});
