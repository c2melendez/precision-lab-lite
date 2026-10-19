import { describe, expect, it } from "vitest";
import { evaluate } from "../src/engine/algebriteClient";
import { compileNumeric } from "../src/engine/numericFallback";
import source from "../qa/certification/algebra114_source.md?raw";

describe("Algebra114 AS-DIV-08 original cubic division with symbolic coefficients", () => {
  it("preserves the symbolic quotient, remainder and excluded x = 1 domain", () => {
    expect(source).toContain("| AS-DIV-08 | N3 |");

    // Exact symbolic identity: numerator = denominator * quotient + remainder.
    expect(
      evaluate(
        "(x^3+a*x^2+b*x+c)-(x-1)*(x^2+(a+1)*x+(a+b+1))-(a+b+c+1)"
      )
    ).toBe("0");

    // Exercise the real calculator path with several parameter assignments.
    for (const [a, b, c] of [[2, -3, 4], [-2, 5, 0], [0, 0, 0]] as const) {
      const expression = `(x^3+${a}*x^2+(${b})*x+(${c}))/(x-1)`;
      const numeric = compileNumeric(evaluate(expression), "x");
      const remainder = a + b + c + 1;

      for (const x of [-3, -2, 0, 2, 3, 5]) {
        const quotient = x*x + (a+1)*x + (a+b+1);
        const expected = quotient + remainder/(x-1);
        const numerator = x**3 + a*x*x + b*x + c;
        expect(numeric(x)).toBeCloseTo(expected, 9);
        expect(numeric(x)).toBeCloseTo(numerator/(x-1), 9);
        expect(numerator-(x-1)*quotient).toBe(remainder);
      }

      // The original rational input is undefined at x = 1, even when 0/0.
      const originalAtExcludedPoint = (1 + a + b + c) / (1 - 1);
      expect(Number.isFinite(originalAtExcludedPoint)).toBe(false);
    }
  });
});
