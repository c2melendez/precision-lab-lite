import { describe, expect, it } from "vitest";
import { evaluate } from "../src/engine/algebriteClient";
import { compileNumeric } from "../src/engine/numericFallback";
import source from "../qa/certification/algebra114_source.md?raw";

describe("Algebra114 AS-RAT-10 original nested denominator conjugate", () => {
  it("rationalizes sqrt(3)/(sqrt(2)+sqrt(3)) as 3-sqrt(6)", () => {
    expect(source).toContain("| AS-RAT-10 | N3 |");
    const original = "sqrt(3)/(sqrt(2)+sqrt(3))";
    const actual = evaluate(original);
    expect(actual.replace(/\s+/g, "")).toBe("3-sqrt(6)");
    expect(compileNumeric(actual, "__none__")(0)).toBeCloseTo(
      Math.sqrt(3)/(Math.sqrt(2)+Math.sqrt(3)), 9
    );
  });
});
