import { describe, expect, it } from "vitest";
import { evaluate } from "../src/engine/algebriteClient";
import { compileNumeric } from "../src/engine/numericFallback";
import source from "../qa/certification/algebra114_source.md?raw";

describe("Algebra114 AS-PF-05 improper rational and exclusions", () => {
  it("returns x+1/(x-1) while preserving original excluded x = ±1", () => {
    expect(source).toContain("| AS-PF-05 | N3 |");
    const original = "(x^3+1)/(x^2-1)";
    const domain = (x: number) => x*x-1 !== 0;
    expect(domain(-1)).toBe(false);
    expect(domain(1)).toBe(false);
    const actual = evaluate("partfrac(" + original + ",x)");
    expect(actual).not.toContain("partfrac(");
    expect(actual.replace(/\s+/g, "")).toBe("x+1/(x-1)");
    for (const x of [-4,-2,0,2,3,5]) {
      expect(domain(x)).toBe(true);
      const value = compileNumeric(actual.replace(/x/g, "(" + x + ")"), "__no_var__")(0);
      expect(value).toBeCloseTo((x*x*x+1)/(x*x-1),9);
    }
  });
});
