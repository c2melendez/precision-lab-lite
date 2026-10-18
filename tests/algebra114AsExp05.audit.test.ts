import { describe, expect, it } from "vitest";
import { parseExpression } from "../src/engine/parsing";
import { expand, evaluate } from "../src/engine/algebriteClient";
import { compileNumeric } from "../src/engine/numericFallback";
import source from "../qa/certification/algebra114_source.md?raw";

describe("Algebra114 AS-EXP-05 difference of cubes", () => {
  it("expands original (x-1)(x^2+x+1) to x^3-1", () => {
    expect(source).toContain("| AS-EXP-05 | N2 |");
    const original = parseExpression("(x-1)*(x^2+x+1)").algebrite;
    const expanded = expand(original);
    const oracle = parseExpression("x^3-1").algebrite;
    for (const x of [-4,-1,0,1,2,5]) {
      const numeric = (expr: string) => compileNumeric(evaluate(expr.replace(/x/g, "(" + x + ")")), "__no_var__")(0);
      expect(numeric(expanded)).toBeCloseTo(numeric(oracle), 9);
    }
  });
});
