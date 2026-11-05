import { describe, expect, it } from "vitest";
import { evaluate } from "../src/engine/algebriteClient";
import { compileNumeric } from "../src/engine/numericFallback";
import source from "../qa/certification/algebra114_source.md?raw";

describe("Algebra114 AS-RAT-08 nested radical denesting", () => {
  it("matches the exact source row and checks the positive denested root with an independent oracle", () => {
    expect(source).toContain("| AS-RAT-08 | N3 | \\(\\sqrt{5+2\\sqrt{6}}\\) | \\(\\sqrt{3}+\\sqrt{2}\\) |");

    const original = "sqrt(5+2*sqrt(6))";
    const actual = evaluate(original);
    const compact = actual.replace(/\s+/g, "");
    expect(compact).toBe("sqrt(3)+sqrt(2)");

    const value = compileNumeric(actual, "__no_var__")(0);
    const rootTwo = Math.sqrt(2);
    const rootThree = Math.sqrt(3);
    const rootSix = Math.sqrt(6);
    const independentDenested = rootThree + rootTwo;
    const independentOriginal = Math.sqrt(5 + 2 * rootSix);

    expect(value).toBeGreaterThan(0);
    expect(value).toBeCloseTo(independentDenested, 11);
    expect(value).toBeCloseTo(independentOriginal, 11);
    expect(value * value).toBeCloseTo(5 + 2 * rootSix, 11);
    expect(independentDenested * independentDenested).toBeCloseTo(5 + 2 * rootSix, 11);
  });
});
