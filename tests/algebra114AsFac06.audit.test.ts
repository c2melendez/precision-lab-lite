import { describe, expect, it } from "vitest";
import { evaluate } from "../src/engine/algebriteClient";
import { compileNumeric } from "../src/engine/numericFallback";
import source from "../qa/certification/algebra114_source.md?raw";

describe("Algebra114 AS-FAC-06 three linear factors", () => {
  it("factors original x^3-6x^2+11x-6 into three linear factors", () => {
    expect(source).toContain("| AS-FAC-06 | N2 |");
    const factored = evaluate("factor(x^3-6*x^2+11*x-6)");
    expect(factored).not.toContain("factor(");
    for (const x of [-4,-1,0,1,2,3,4]) {
      const observed = compileNumeric(evaluate(factored.replace(/x/g, "(" + x + ")")), "__no_var__")(0);
      expect(observed).toBeCloseTo((x-1)*(x-2)*(x-3), 9);
    }
    expect(factored.replace(/\\s/g, "")).not.toBe("x^3-6*x^2+11*x-6");
  });
});
