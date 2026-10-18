import { describe, expect, it } from "vitest";
import { evaluate } from "../src/engine/algebriteClient";
import { compileNumeric } from "../src/engine/numericFallback";
import source from "../qa/certification/algebra114_source.md?raw";

describe("Algebra114 AS-FAC-05 sum of cubes", () => {
  it("factors original x^3+1 against (x+1)(x^2-x+1)", () => {
    expect(source).toContain("| AS-FAC-05 | N2 |");
    const factored = evaluate("factor(x^3+1)");
    expect(factored).not.toContain("factor(");
    for (const x of [-4, -1, 0, 1, 2, 4]) {
      const observed = compileNumeric(evaluate(factored.replace(/x/g, "(" + x + ")")), "__no_var__")(0);
      expect(observed).toBeCloseTo((x+1)*(x*x-x+1), 9);
    }
  });
});
