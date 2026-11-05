import { describe, expect, it } from "vitest";
import { evaluate } from "../src/engine/algebriteClient";
import { compileNumeric } from "../src/engine/numericFallback";
import source from "../qa/certification/algebra114_source.md?raw";

describe("Algebra114 AS-RAT-01 denominator rationalization", () => {
  it("matches the exact source row and returns the positive rationalized form sqrt(2)/2", () => {
    expect(source).toContain("| AS-RAT-01 | N1 | \\(\\frac{1}{\\sqrt{2}}\\) | \\(\\frac{\\sqrt{2}}{2}\\) |");

    const actual = evaluate("1/sqrt(2)");
    const compact = actual.replace(/\s+/g, "");
    expect(compact).toMatch(/^(sqrt\(2\)\/2|2\^\(1\/2\)\/2|1\/2\*2\^\(1\/2\))$/);
    expect(compact).not.toMatch(/^1\/sqrt\(2\)$/);

    const value = compileNumeric(actual, "__no_var__")(0);
    const independentExpected = Math.sqrt(2) / 2;
    expect(value).toBeGreaterThan(0);
    expect(value).toBeCloseTo(independentExpected, 12);
    expect(value * value).toBeCloseTo(0.5, 12);
  });
});
