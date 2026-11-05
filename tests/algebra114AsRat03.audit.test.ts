import { describe, expect, it } from "vitest";
import { evaluate } from "../src/engine/algebriteClient";
import { compileNumeric } from "../src/engine/numericFallback";
import source from "../qa/certification/algebra114_source.md?raw";

describe("Algebra114 AS-RAT-03 two-radical conjugate", () => {
  it("matches the exact source row and rationalizes to sqrt(3)-sqrt(2) with an independent conjugate oracle", () => {
    expect(source).toContain("| AS-RAT-03 | N2 | \\(\\frac{1}{\\sqrt{2}+\\sqrt{3}}\\) | \\(\\sqrt{3}-\\sqrt{2}\\) |");

    const result = evaluate("1/(sqrt(2)+sqrt(3))");
    const compact = result.replace(/\s+/g, "");
    expect(compact).toBe("sqrt(3)-sqrt(2)");
    expect(compact).not.toContain("1/(sqrt(2)+sqrt(3))");

    const value = compileNumeric(result, "__no_var__")(0);
    const rootTwo = Math.sqrt(2);
    const rootThree = Math.sqrt(3);
    const independentExpected = rootThree - rootTwo;
    expect(value).toBeGreaterThan(0);
    expect(value).toBeCloseTo(independentExpected, 12);
    expect(value * (rootThree + rootTwo)).toBeCloseTo(1, 12);
    expect((rootThree - rootTwo) * (rootThree + rootTwo)).toBeCloseTo(1, 12);
  });
});
