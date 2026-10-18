import { describe, expect, it } from "vitest";
import { evaluate } from "../src/engine/algebriteClient";
import { compileNumeric } from "../src/engine/numericFallback";
import source from "../qa/certification/algebra114_source.md?raw";

describe("Algebra114 AS-FAC-07 four linear factors", () => {
  it("factors original x^4-5x^2+4 into four real linear factors", () => {
    expect(source).toContain("| AS-FAC-07 | N2 |");
    const factored = evaluate("factor(x^4-5*x^2+4)");
    expect(factored).not.toContain("factor(");
    expect(factored.replace(/\\s/g, "")).not.toBe("x^4-5*x^2+4");
    for (const x of [-4, -2, -1, 0, 1, 2, 3, 4]) {
      const observed = compileNumeric(evaluate(factored.replace(/x/g, "(" + x + ")")), "__no_var__")(0);
      expect(observed).toBeCloseTo((x-1)*(x+1)*(x-2)*(x+2), 9);
    }
  });
});
