import { describe, expect, it } from "vitest";
import { evaluate } from "../src/engine/algebriteClient";
import { compileNumeric } from "../src/engine/numericFallback";
import source from "../qa/certification/algebra114_source.md?raw";

describe("Algebra114 AS-RAT-05 cube-root plus one rationalization", () => {
  it("returns original rationalized cubic conjugate expression", () => {
    expect(source).toContain("| AS-RAT-05 | N2 |");
    const actual = evaluate("1/(2^(1/3)+1)");
    expect(actual.replace(/\s+/g, "")).toBe("(4^(1/3)-2^(1/3)+1)/3");
    expect(compileNumeric(actual, "__none__")(0)).toBeCloseTo(1/(Math.cbrt(2)+1), 9);
  });
});
