import { describe, expect, it } from "vitest";
import { evaluate } from "../src/engine/algebriteClient";
import { compileNumeric } from "../src/engine/numericFallback";
import source from "../qa/certification/algebra114_source.md?raw";

describe("Algebra114 AS-DIV-02 original cubic division", () => {
  it("has quotient x^2+2*x+4, zero remainder and preserves x != 2", () => {
    expect(source).toContain("| AS-DIV-02 | N2 |");
    const result = evaluate("(x^3-8)/(x-2)");
    const numeric = compileNumeric(result, "x");
    for (const x of [-4, -1, 0, 1, 3, 5]) {
      expect(numeric(x)).toBeCloseTo(x*x+2*x+4, 9);
      expect(numeric(x)).toBeCloseTo((x*x*x-8)/(x-2), 9);
      expect(x*x*x-8-(x-2)*(x*x+2*x+4)).toBe(0);
    }
    expect((2**3-8)/(2-2)).toBeNaN();
  });
});
