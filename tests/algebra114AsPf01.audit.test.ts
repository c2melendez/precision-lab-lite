import { describe, expect, it } from "vitest";
import { evaluate } from "../src/engine/algebriteClient";
import { compileNumeric } from "../src/engine/numericFallback";
import source from "../qa/certification/algebra114_source.md?raw";

describe("Algebra114 AS-PF-01 partial fractions, engine scope", () => {
  it("decomposes (3x+5)/((x+1)(x+2)) into distinct simple poles", () => {
    expect(source).toContain("| AS-PF-01 | N2 |");
    const result = evaluate("partfrac((3*x+5)/((x+1)*(x+2)),x)");
    expect(result).not.toContain("partfrac(");
    expect(result).not.toContain("(3*x+5)/((x+1)*(x+2))");
    for (const x of [-4, -3, 0, 1, 3]) {
      const value = compileNumeric(evaluate(result.replace(/x/g, "(" + x + ")")), "__no_var__")(0);
      expect(value).toBeCloseTo(2/(x+1)+1/(x+2), 9);
    }
  });
});
