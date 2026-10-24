import { describe, expect, it } from "vitest";
import { evaluate } from "../src/engine/algebriteClient";
import { compileNumeric } from "../src/engine/numericFallback";
import source from "../qa/certification/algebra114_source.md?raw";

describe("Algebra114 AS-RAT-08 nested radical denesting", () => {
  it("returns sqrt(3)+sqrt(2) for original sqrt(5+2sqrt(6))", () => {
    expect(source).toContain("| AS-RAT-08 | N3 |");
    const actual = evaluate("sqrt(5+2*sqrt(6))");
    expect(actual.replace(/\s+/g, "")).toBe("sqrt(3)+sqrt(2)");
    expect(compileNumeric(actual, "__none__")(0)).toBeCloseTo(Math.sqrt(5+2*Math.sqrt(6)),9);
  });
});
