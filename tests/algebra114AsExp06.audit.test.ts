import { describe, it, expect } from "vitest";
import { parseExpression } from "../src/engine/parsing";
import { expand, evaluate } from "../src/engine/algebriteClient";
import { compileNumeric } from "../src/engine/numericFallback";

describe("Algebra114 AS-EXP-06", () => {
  it("checks original binomial cube expansion", () => {
    const expanded = expand(parseExpression("(x+y)^3").algebrite);
    const expected = parseExpression("x^3+3*x^2*y+3*x*y^2+y^3").algebrite;
    for (const [x,y] of [[2,3],[-2,3],[0,5],[-3,-4],[1,-1]]) {
      const calc = (s: string) => compileNumeric(evaluate(s.replace(/x/g,"("+x+")").replace(/y/g,"("+y+")")), "__no_var__")(0);
      expect(calc(expanded)).toBeCloseTo(calc(expected),9);
    }
  });
});
