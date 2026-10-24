import { describe, expect, it } from "vitest";
import { parseExpression } from "../src/engine/parsing";
import { expand, evaluate } from "../src/engine/algebriteClient";
import { compileNumeric } from "../src/engine/numericFallback";
import source from "../qa/certification/algebra114_source.md?raw";

describe("Algebra114 AS-EXP-07 cube of linear expression", () => {
  it("expands original (2x-3)^3 to 8x^3-36x^2+54x-27", () => {
    expect(source).toContain("| AS-EXP-07 | N2 |");
    const expanded = expand(parseExpression("(2*x-3)^3").algebrite);
    const oracle = parseExpression("8*x^3-36*x^2+54*x-27").algebrite;
    for (const x of [-3,-1,0,2,5]) {
      const numeric = (expr: string) => compileNumeric(evaluate(expr.replace(/x/g, "(" + x + ")")), "__no_var__")(0);
      expect(numeric(expanded)).toBeCloseTo(numeric(oracle), 9);
    }
  });
});
