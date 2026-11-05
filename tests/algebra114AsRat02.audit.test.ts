import { describe, expect, it } from "vitest";
import { evaluate } from "../src/engine/algebriteClient";
import { compileNumeric } from "../src/engine/numericFallback";
import source from "../qa/certification/algebra114_source.md?raw";

describe("Algebra114 AS-RAT-02 conjugate rationalization", () => {
  it("matches the exact source row and returns sqrt(2)-1 with an independent conjugate oracle", () => {
    expect(source).toContain("| AS-RAT-02 | N1 | \\(\\frac{1}{\\sqrt{2}+1}\\) | \\(\\sqrt{2}-1\\) |");

    const actual = evaluate("1/(sqrt(2)+1)");
    const compact = actual.replace(/\s+/g, "");
    expect(compact).toBe("sqrt(2)-1");
    expect(compact).not.toContain("1/(sqrt(2)+1)");

    const value = compileNumeric(actual, "__no_var__")(0);
    const rootTwo = Math.sqrt(2);
    const independentExpected = rootTwo - 1;
    expect(value).toBeGreaterThan(0);
    expect(value).toBeCloseTo(independentExpected, 12);
    expect((value * (rootTwo + 1))).toBeCloseTo(1, 12);
    expect((rootTwo - 1) * (rootTwo + 1)).toBeCloseTo(1, 12);
  });
});
