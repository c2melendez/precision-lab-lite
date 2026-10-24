import { describe, expect, it } from "vitest";
import { evaluate } from "../src/engine/algebriteClient";
import { compileNumeric } from "../src/engine/numericFallback";
import source from "../qa/certification/algebra114_source.md?raw";

describe("Algebra114 AS-FAC-12 alternating three-variable identity", () => {
  it("factors x²(y-z)+y²(z-x)+z²(x-y) and preserves the sign", () => {
    expect(source).toContain("| AS-FAC-12 | N3 |");
    const original = "x^2*(y-z)+y^2*(z-x)+z^2*(x-y)";
    const factored = evaluate("factor(" + original + ")");
    expect(factored).not.toContain("factor(");
    expect(factored.replace(/\s/g, "")).not.toBe(original);
    for (const [x,y,z] of [[1,2,3], [3,1,2], [0,2,5], [-1,3,0], [4,4,2], [1,2,2]]) {
      const substituted = factored.replace(/x/g, "(" + x + ")").replace(/y/g, "(" + y + ")").replace(/z/g, "(" + z + ")");
      const result = compileNumeric(evaluate(substituted), "__no_var__")(0);
      expect(result).toBeCloseTo((x-y)*(x-z)*(y-z), 9);
    }
  });
});
