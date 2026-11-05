import { describe, expect, it } from "vitest";
import { evaluate } from "../src/engine/algebriteClient";
import { compileNumeric } from "../src/engine/numericFallback";
import source from "../qa/certification/algebra114_source.md?raw";

describe("Algebra114 AS-RAT-07 nested radical denesting", () => {
  it("matches the exact source row and validates the denested form with an independent square-root oracle", () => {
    expect(source).toContain("| AS-RAT-07 | N3 | \\(\\sqrt{2+\\sqrt{3}}\\) | \\(\\frac{\\sqrt{6}+\\sqrt{2}}{2}\\) |");

    const original = "sqrt(2+sqrt(3))";
    const actual = evaluate(original);
    const compact = actual.replace(/\s+/g, "");
    expect(compact).toBe("(sqrt(6)+sqrt(2))/2");

    const value = compileNumeric(actual, "__no_var__")(0);
    const rootTwo = Math.sqrt(2);
    const rootThree = Math.sqrt(3);
    const rootSix = Math.sqrt(6);
    const independentDenested = (rootSix + rootTwo) / 2;
    const independentOriginal = Math.sqrt(2 + rootThree);

    expect(value).toBeGreaterThan(0);
    expect(value).toBeCloseTo(independentDenested, 11);
    expect(value).toBeCloseTo(independentOriginal, 11);
    expect(value * value).toBeCloseTo(2 + rootThree, 11);
    expect(independentDenested * independentDenested).toBeCloseTo(2 + rootThree, 11);
  });
});
