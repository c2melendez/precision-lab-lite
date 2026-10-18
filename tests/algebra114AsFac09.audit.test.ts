import { describe, expect, it } from "vitest";
import { evaluate } from "../src/engine/algebriteClient";
import { compileNumeric } from "../src/engine/numericFallback";
import source from "../qa/certification/algebra114_source.md?raw";

describe("Algebra114 AS-FAC-09 real irrational factorization", () => {
  it("returns two real quadratic factors rather than unfactored x^4+1", () => {
    expect(source).toContain("| AS-FAC-09 | N3 |");
    const factored = evaluate("factor(x^4+1)");
    const normalized = factored.replace(/\\s/g, "");
    expect(normalized).not.toBe("x^4+1");
    expect(normalized).not.toContain("factor(");
    // Numeric equivalence must not substitute for a genuine factorized output.
    for (const x of [-3, -2, -1, 0, 1, 2, 3]) {
      const value = compileNumeric(evaluate(factored.replace(/x/g, "(" + x + ")")), "__no_var__")(0);
      const rt2 = Math.sqrt(2);
      expect(value).toBeCloseTo((x*x + rt2*x + 1)*(x*x - rt2*x + 1), 9);
    }
  });
});
