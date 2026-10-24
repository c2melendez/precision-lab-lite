import { describe, expect, it } from "vitest";
import { evaluate } from "../src/engine/algebriteClient";
import { compileNumeric } from "../src/engine/numericFallback";
import source from "../qa/certification/algebra114_source.md?raw";

describe("Algebra114 AS-FAC-10 sum of cubes two variables", () => {
  it("factors original x^3+y^3 into linear and quadratic factors", () => {
    expect(source).toContain("| AS-FAC-10 | N3 |");
    const factored = evaluate("factor(x^3+y^3)");
    expect(factored).not.toContain("factor(");
    expect(factored.replace(/\s/g, "")).not.toBe("x^3+y^3");
    for (const x of [-3,-1,0,1,2,4]) {
      for (const y of [-2,0,1,3]) {
        const substituted = factored.replace(/x/g, "(" + x + ")").replace(/y/g, "(" + y + ")");
        const actual = compileNumeric(evaluate(substituted), "__no_var__")(0);
        expect(actual).toBeCloseTo((x+y)*(x*x-x*y+y*y), 9);
      }
    }
  });
});
