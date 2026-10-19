import { describe, expect, it } from "vitest";
import { evaluate } from "../src/engine/algebriteClient";
import { compileNumeric } from "../src/engine/numericFallback";
import source from "../qa/certification/algebra114_source.md?raw";

describe("Algebra114 AS-RAT-01 denominator rationalization", () => {
  it("returns the original rationalized form sqrt(2)/2", () => {
    expect(source).toContain("| AS-RAT-01 | N1 |");
    const actual = evaluate("1/sqrt(2)");
    expect(actual.replace(/\s+/g, "")).toMatch(/^(sqrt\(2\)\/2|2\^\(1\/2\)\/2|1\/2\*2\^\(1\/2\))$/);
    const numeric = compileNumeric(actual, "__no_var__")(0);
    expect(numeric).toBeCloseTo(Math.sqrt(2)/2, 9);
  });
});
