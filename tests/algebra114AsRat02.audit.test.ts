import { describe, expect, it } from "vitest";
import { evaluate } from "../src/engine/algebriteClient";
import { compileNumeric } from "../src/engine/numericFallback";
import source from "../qa/certification/algebra114_source.md?raw";

describe("Algebra114 AS-RAT-02 conjugate rationalization", () => {
  it("returns sqrt(2)-1 for the original radical denominator", () => {
    expect(source).toContain("| AS-RAT-02 | N1 |");
    const actual = evaluate("1/(sqrt(2)+1)");
    expect(actual.replace(/\s+/g, "")).toBe("sqrt(2)-1");
    expect(compileNumeric(actual, "__none__")(0)).toBeCloseTo(1/(Math.sqrt(2)+1), 9);
  });
});
