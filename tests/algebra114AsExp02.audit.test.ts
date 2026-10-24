import { describe, expect, it } from "vitest";
import { parseExpression } from "../src/engine/parsing";
import { expand, evaluate } from "../src/engine/algebriteClient";
import { compileNumeric } from "../src/engine/numericFallback";
import source from "../qa/certification/algebra114_source.md?raw";

describe("Algebra114 AS-EXP-02 binomial square", () => {
  it("expands original (x+2)^2 to x^2+4x+4", () => {
    expect(source).toContain("| AS-EXP-02 | N1 |");
    const original = parseExpression("(x+2)^2").algebrite;
    const expanded = expand(original);
    const oracle = parseExpression("x^2+4*x+4").algebrite;
    for (const x of [-4,-2,-1,0,3]) {
      const numeric = (expr: string) => compileNumeric(evaluate(expr.replace(/x/g, "(" + x + ")")), "__no_var__")(0);
      expect(numeric(expanded)).toBeCloseTo(numeric(oracle), 9);
    }
  });
});
