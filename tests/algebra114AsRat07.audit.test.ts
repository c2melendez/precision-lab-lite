import { describe, expect, it } from "vitest";
import { evaluate } from "../src/engine/algebriteClient";
import { compileNumeric } from "../src/engine/numericFallback";
import source from "../qa/certification/algebra114_source.md?raw";

describe("Algebra114 AS-RAT-07 nested radical denesting", () => {
  it("returns the audited denested form for the original expression", () => {
    expect(source).toContain("| AS-RAT-07 | N3 |");
    const original = "sqrt(2+sqrt(3))";
    const actual = evaluate(original);
    expect(actual.replace(/\s+/g, "")).toBe("(sqrt(6)+sqrt(2))/2");
    expect(compileNumeric(actual, "__none__")(0)).toBeCloseTo(
      Math.sqrt(2 + Math.sqrt(3)),
      9,
    );
  });
});
