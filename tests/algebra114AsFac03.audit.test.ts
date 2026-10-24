import { describe, expect, it } from "vitest";
import { evaluate } from "../src/engine/algebriteClient";
import { compileNumeric } from "../src/engine/numericFallback";
import source from "../qa/certification/algebra114_source.md?raw";

describe("Algebra114 AS-FAC-03 nonmonic trinomial", () => {
  it("factors original 6x^2-11x+3 against (3x-1)(2x-3)", () => {
    expect(source).toContain("| AS-FAC-03 | N2 |");
    const factored = evaluate("factor(6*x^2-11*x+3)");
    expect(factored).not.toContain("factor(");
    for (const x of [-4,-1,0,1,2,4]) {
      const actual = compileNumeric(evaluate(factored.replace(/x/g, "(" + x + ")")), "__no_var__")(0);
      expect(actual).toBeCloseTo((3*x-1)*(2*x-3), 9);
    }
  });
});
