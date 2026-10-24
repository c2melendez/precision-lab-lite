import { describe, expect, it } from "vitest";
import { parseExpression } from "../src/engine/parsing";
import { expand, evaluate } from "../src/engine/algebriteClient";
import { compileNumeric } from "../src/engine/numericFallback";
import source from "../qa/certification/algebra114_source.md?raw";

describe("Algebra114 AS-EXP-08 three linear factors", () => {
  it("expands original (x+2)(x-3)(x+1) to x^3-7x-6", () => {
    expect(source).toContain("| AS-EXP-08 | N3 |");
    const expanded = expand(parseExpression("(x+2)*(x-3)*(x+1)").algebrite);
    const oracle = parseExpression("x^3-7*x-6").algebrite;
    for (const x of [-4,-2,-1,0,3,5]) {
      const numeric = (expr: string) => compileNumeric(evaluate(expr.replace(/x/g, "(" + x + ")")), "__no_var__")(0);
      expect(numeric(expanded)).toBeCloseTo(numeric(oracle), 9);
    }
  });
});
