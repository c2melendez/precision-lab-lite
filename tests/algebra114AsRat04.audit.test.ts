import { describe, expect, it } from "vitest";
import { evaluate } from "../src/engine/algebriteClient";
import { compileNumeric } from "../src/engine/numericFallback";
import source from "../qa/certification/algebra114_source.md?raw";

describe("Algebra114 AS-RAT-04 cube-root rationalization", () => {
  it("returns cube root of four over two, not a radical denominator", () => {
    expect(source).toContain("| AS-RAT-04 | N2 |");
    const actual = evaluate("1/(2^(1/3))");
    expect(actual.replace(/\s+/g, "")).toBe("4^(1/3)/2");
    expect(compileNumeric(actual, "__none__")(0)).toBeCloseTo(1/Math.cbrt(2), 9);
  });
});
