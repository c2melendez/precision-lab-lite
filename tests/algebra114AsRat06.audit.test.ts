import { describe, expect, it } from "vitest";
import { evaluate } from "../src/engine/algebriteClient";
import { compileNumeric } from "../src/engine/numericFallback";
import source from "../qa/certification/algebra114_source.md?raw";

describe("Algebra114 AS-RAT-06 variable radical conjugate", () => {
  it("rationalizes the variable difference quotient on the original restricted domain", () => {
    expect(source).toContain("| AS-RAT-06 | N2 |");
    const original = "(sqrt(x+h)-sqrt(x))/h";
    const actual = evaluate(original);
    expect(actual.replace(/\s+/g, "")).toBe("1/(sqrt(x+h)+sqrt(x))");
    for (const [x,h] of [[1,1],[4,0.5],[9,-2],[0.25,2]]) {
      expect(x).toBeGreaterThan(0);
      expect(h).toBeGreaterThan(-x);
      expect(h).not.toBe(0);
      const value = compileNumeric(actual.replace(/x/g, "(" + x + ")").replace(/h/g, "(" + h + ")"), "__none__")(0);
      expect(value).toBeCloseTo((Math.sqrt(x+h)-Math.sqrt(x))/h, 9);
    }
  });
});
