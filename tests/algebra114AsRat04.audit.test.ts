import { describe, expect, it } from "vitest";
import { evaluate } from "../src/engine/algebriteClient";
import { compileNumeric } from "../src/engine/numericFallback";
import source from "../qa/certification/algebra114_source.md?raw";

describe("Algebra114 AS-RAT-04 cube-root rationalization", () => {
  it("matches the exact source row and rationalizes 1/cuberoot(2) to cuberoot(4)/2", () => {
    expect(source).toContain("| AS-RAT-04 | N2 | \\(\\frac{1}{\\sqrt[3]{2}}\\) | \\(\\frac{\\sqrt[3]{4}}{2}\\) |");

    const actual = evaluate("1/(2^(1/3))");
    const compact = actual.replace(/\s+/g, "");
    expect(compact).toBe("4^(1/3)/2");
    expect(compact).not.toContain("1/(2^(1/3))");

    const value = compileNumeric(actual, "__no_var__")(0);
    const independentExpected = Math.cbrt(4) / 2;
    expect(value).toBeGreaterThan(0);
    expect(value).toBeCloseTo(independentExpected, 12);
    expect(value * value * value).toBeCloseTo(0.5, 12);
    expect(independentExpected * independentExpected * independentExpected).toBeCloseTo(0.5, 12);
  });
});
