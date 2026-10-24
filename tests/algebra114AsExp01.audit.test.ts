import { describe, expect, it } from "vitest";
import { parseExpression } from "../src/engine/parsing";
import { expand, evaluate } from "../src/engine/algebriteClient";
import { compileNumeric } from "../src/engine/numericFallback";
import source from "../qa/certification/algebra114_source.md?raw";

describe("Algebra114 AS-EXP-01 difference of squares", () => {
  it("expands original product and matches x^2-1 at signed samples", () => {
    expect(source).toContain("| AS-EXP-01 | N1 |");
    const original = parseExpression("(x+1)*(x-1)").algebrite;
    const expanded = expand(original);
    const oracle = parseExpression("x^2-1").algebrite;
    for (const x of [-3, -1, 0, 1, 4]) {
      const numeric = (expr: string) => compileNumeric(evaluate(expr.replace(/x/g, "(" + x + ")")), "__no_var__")(0);
      expect(numeric(expanded)).toBeCloseTo(numeric(oracle), 9);
    }
  });
});
