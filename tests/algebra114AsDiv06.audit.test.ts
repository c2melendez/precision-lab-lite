import { describe, expect, it } from "vitest";
import { evaluate } from "../src/engine/algebriteClient";
import { compileNumeric } from "../src/engine/numericFallback";
import source from "../qa/certification/algebra114_source.md?raw";

describe("Algebra114 AS-DIV-06 original cubic division by an irreducible quadratic", () => {
  it("preserves quotient x+1, zero remainder and the polynomial identity", () => {
    expect(source).toContain("| AS-DIV-06 | N3 |");
    const result = evaluate("(x^3+1)/(x^2-x+1)");
    const numeric = compileNumeric(result, "x");
    for (const x of [-3, -1, 0, 1, 2, 4]) {
      expect(numeric(x)).toBeCloseTo(x+1, 9);
      expect(numeric(x)).toBeCloseTo((x**3+1)/(x*x-x+1), 9);
      expect(x**3+1-(x*x-x+1)*(x+1)).toBe(0);
    }
  });
});
