import { describe, expect, it } from "vitest";
import { parseExpression } from "../src/engine/parsing";
import { expand, evaluate } from "../src/engine/algebriteClient";
import { compileNumeric } from "../src/engine/numericFallback";
import source from "../qa/certification/algebra114_source.md?raw";

describe("Algebra114 AS-EXP-10 negative product expansion", () => {
  it("expands original -(x-1)(x+2) to -x^2-x+2", () => {
    expect(source).toContain("| AS-EXP-10 | N3 |");
    const expanded = expand(parseExpression("-(x-1)*(x+2)").algebrite);
    const oracle = parseExpression("-x^2-x+2").algebrite;
    for (const x of [-4,-2,-1,0,1,3,5]) {
      const numeric = (expr: string) => compileNumeric(evaluate(expr.replace(/x/g, "(" + x + ")")), "__no_var__")(0);
      expect(numeric(expanded)).toBeCloseTo(numeric(oracle), 9);
    }
  });
});
