import { describe, expect, it } from "vitest";
import { parseExpression } from "../src/engine/parsing";
import { expand, evaluate } from "../src/engine/algebriteClient";
import { compileNumeric } from "../src/engine/numericFallback";
import source from "../qa/certification/algebra114_source.md?raw";

describe("Algebra114 AS-EXP-09 three-variable trinomial square", () => {
  it("expands original (a+b+c)^2 to six-term identity", () => {
    expect(source).toContain("| AS-EXP-09 | N3 |");
    const expanded = expand(parseExpression("(a+b+c)^2").algebrite);
    const oracle = parseExpression("a^2+b^2+c^2+2*a*b+2*a*c+2*b*c").algebrite;
    for (const [a,b,c] of [[1,2,3],[-2,3,5],[0,-1,2],[-3,-4,-5],[1,-1,0]]) {
      const numeric = (expr: string) => compileNumeric(evaluate(expr.replace(/\ba\b/g, "(" + a + ")").replace(/\bb\b/g, "(" + b + ")").replace(/\bc\b/g, "(" + c + ")")), "__no_var__")(0);
      expect(numeric(expanded)).toBeCloseTo(numeric(oracle), 9);
    }
  });
});
