import { describe, expect, it } from "vitest";
import { evaluate } from "../src/engine/algebriteClient";
import { compileNumeric } from "../src/engine/numericFallback";
import source from "../qa/certification/algebra114_source.md?raw";

describe("Algebra114 AS-PF-02 repeated pole", () => {
  it("decomposes original 1/(x*(x-1)^2) into three exact partial terms", () => {
    expect(source).toContain("| AS-PF-02 | N2 |");
    const result = evaluate("partfrac(1/(x*(x-1)^2),x)");
    expect(result).not.toContain("partfrac(");
    expect(result).not.toBe("1/(x*(x-1)^2)");
    for (const x of [-4, -2, -1, 0.5, 2, 3, 5]) {
      const substituted = result.replace(/x/g, "(" + x + ")");
      const actual = compileNumeric(evaluate(substituted), "__no_var__")(0);
      const expected = 1/x - 1/(x-1) + 1/((x-1)*(x-1));
      expect(actual).toBeCloseTo(expected, 9);
    }
  });
});
