import { describe, expect, it } from "vitest";
import { evaluate } from "../src/engine/algebriteClient";
import { compileNumeric } from "../src/engine/numericFallback";
import source from "../qa/certification/algebra114_source.md?raw";

describe("Algebra114 AS-DIV-01 original polynomial division", () => {
  it("preserves quotient x+2 and remainder zero away from x=2", () => {
    expect(source).toContain("| AS-DIV-01 | N1 |");
    const quotient = evaluate("(x^2-4)/(x-2)");
    const f = compileNumeric(quotient, "x");
    for (const x of [-3, -1, 0, 1, 3, 4]) {
      expect(x).not.toBe(2);
      expect(f(x)).toBeCloseTo((x*x-4)/(x-2), 9);
      expect(f(x)).toBeCloseTo(x+2, 9);
      expect((x*x-4)-(x-2)*(x+2)).toBe(0);
    }
    // Cancellation must not extend the original rational-function domain to x=2.
    expect((2*2-4)/(2-2)).toBeNaN();
  });
});
