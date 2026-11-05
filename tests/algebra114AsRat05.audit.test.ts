import { describe, expect, it } from "vitest";
import { evaluate } from "../src/engine/algebriteClient";
import { compileNumeric } from "../src/engine/numericFallback";
import source from "../qa/certification/algebra114_source.md?raw";

describe("Algebra114 AS-RAT-05 cube-root plus one rationalization", () => {
  it("matches the exact source row and returns the cubic conjugate form with an independent Math.cbrt oracle", () => {
    expect(source).toContain("| AS-RAT-05 | N2 | \\(\\frac{1}{\\sqrt[3]{2}+1}\\) | \\(\\frac{\\sqrt[3]{4}-\\sqrt[3]{2}+1}{3}\\) |");

    const actual = evaluate("1/(2^(1/3)+1)");
    const compact = actual.replace(/\s+/g, "");
    expect(compact).toBe("(4^(1/3)-2^(1/3)+1)/3");
    expect(compact).not.toContain("1/(2^(1/3)+1)");

    const value = compileNumeric(actual, "__no_var__")(0);
    const rootTwo = Math.cbrt(2);
    const rootFour = Math.cbrt(4);
    const independentExpected = (rootFour - rootTwo + 1) / 3;
    expect(value).toBeGreaterThan(0);
    expect(value).toBeCloseTo(independentExpected, 12);
    expect(value * (rootTwo + 1)).toBeCloseTo(1, 12);
    expect(independentExpected * (rootTwo + 1)).toBeCloseTo(1, 12);
  });
});
