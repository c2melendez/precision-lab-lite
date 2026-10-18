import { describe, expect, it } from "vitest";
import { evaluate } from "../src/engine/algebriteClient";

describe("Algebra114 AS-FAC-01", () => {
  it("checks factoring the original difference of squares", () => {
    const result = evaluate("factor(x^2-9)");
    expect(result).not.toContain("factor(");
    expect(evaluate(result.replace(/x/g, "(0)"))).toBe(evaluate("0^2-9"));
    expect(evaluate(result.replace(/x/g, "(4)"))).toBe(evaluate("4^2-9"));
  });
});
