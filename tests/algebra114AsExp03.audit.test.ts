import { describe, expect, it } from "vitest";
import { parseExpression } from "../src/engine/parsing";
import { expand, evaluate } from "../src/engine/algebriteClient";
import { compileNumeric } from "../src/engine/numericFallback";
import source from "../qa/certification/algebra114_source.md?raw";

describe("Algebra114 AS-EXP-03 product of linear binomials", () => {
  it("expands (2x-1)(3x+4) to 6x^2+5x-4", () => {
    expect(source).toContain("| AS-EXP-03 | N2 |");
    const original = parseExpression("(2*x-1)*(3*x+4)").algebrite;
    const expanded = expand(original);
    const oracle = parseExpression("6*x^2+5*x-4").algebrite;
    for (const x of [-4,-1,0,2,5]) {
      const numeric = (expr: string) => compileNumeric(evaluate(expr.replace(/x/g, "(" + x + ")")), "__no_var__")(0);
      expect(numeric(expanded)).toBeCloseTo(numeric(oracle), 9);
    }
  });
});
