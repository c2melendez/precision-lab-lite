import { describe, expect, it } from "vitest";
import { evaluate } from "../src/engine/algebriteClient";
import { compileNumeric } from "../src/engine/numericFallback";
import source from "../qa/certification/algebra114_source.md?raw";

describe("Algebra114 AS-RAT-03 two-radical conjugate", () => {
  it("rationalizes 1/(sqrt(2)+sqrt(3)) to sqrt(3)-sqrt(2)", () => {
    expect(source).toContain("| AS-RAT-03 | N2 |");
    const result = evaluate("1/(sqrt(2)+sqrt(3))");
    expect(result.replace(/\s+/g, "")).toBe("sqrt(3)-sqrt(2)");
    expect(compileNumeric(result, "__none__")(0)).toBeCloseTo(1/(Math.sqrt(2)+Math.sqrt(3)), 9);
  });
});
