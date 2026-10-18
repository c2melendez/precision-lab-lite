import { describe, expect, it } from "vitest";
import { evaluate } from "../src/engine/algebriteClient";
import { compileNumeric } from "../src/engine/numericFallback";
import source from "../qa/certification/algebra114_source.md?raw";

describe("Algebra114 AS-FAC-11 grouping", () => {
  it("factors original x^3+x^2+x+1 into (x+1)(x^2+1)", () => {
    expect(source).toContain("| AS-FAC-11 | N3 |");
    const factored = evaluate("factor(x^3+x^2+x+1)");
    expect(factored).not.toContain("factor(");
    expect(factored.replace(/\s/g, "")).not.toBe("x^3+x^2+x+1");
    for (const x of [-4,-2,-1,0,1,3,5]) {
      const result = evaluate(factored.replace(/x/g, "(" + x + ")"));
      const actual = compileNumeric(result, "__no_var__")(0);
      expect(actual).toBeCloseTo((x+1)*(x*x+1), 9);
    }
  });
});
