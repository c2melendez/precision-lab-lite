import { describe, expect, it } from "vitest";
import { evaluate } from "../src/engine/algebriteClient";
import { compileNumeric } from "../src/engine/numericFallback";
import source from "../qa/certification/algebra114_source.md?raw";

describe("Algebra114 AS-FAC-08 Sophie Germain identity", () => {
  it("factors original x^4+4 as two quadratic real factors", () => {
    expect(source).toContain("| AS-FAC-08 | N3 |");
    const factored = evaluate("factor(x^4+4)");
    expect(factored).not.toContain("factor(");
    expect(factored.replace(/\\s/g, "")).not.toBe("x^4+4");
    for (const x of [-4, -2, -1, 0, 1, 2, 3, 4]) {
      const observed = compileNumeric(evaluate(factored.replace(/x/g, "(" + x + ")")), "__no_var__")(0);
      expect(observed).toBeCloseTo((x*x - 2*x + 2)*(x*x + 2*x + 2), 9);
    }
  });
});
