import { describe, expect, it } from "vitest";
import { evaluate } from "../src/engine/algebriteClient";
import { differenceOfSquaresCandidate, verifyFactorResult } from "../src/engine/polynomialFactorZ";

describe("AS-B-21 bounded difference-of-squares safeguard", () => {
  it("builds the factors for (P)^2 - K*x^2 with K a perfect square", () => {
    expect(differenceOfSquaresCandidate("(x^2+1)^2-4*x^2")).toBe("(x^2+1-2*x)*(x^2+1+2*x)");
  });

  it("regression: x^2+1 and x^2-2 are not matched by the rule", () => {
    expect(differenceOfSquaresCandidate("x^2+1")).toBeNull();
    expect(differenceOfSquaresCandidate("x^2-2")).toBeNull();
  });

  it("rejects a non-square coefficient", () => {
    expect(differenceOfSquaresCandidate("(x^2+1)^2-3*x^2")).toBeNull();
  });

  it("regression: x^2+1 and x^2-2 keep a single factor through evaluate", () => {
    expect(evaluate("factor(x^2+1)").replace(/\s+/g, "")).not.toMatch(/\)\*\(/);
    expect(evaluate("factor(x^2-2)").replace(/\s+/g, "")).not.toMatch(/\)\*\(/);
  });

  it("replaces an unfactored equivalent result only after the CAS confirms equivalence", () => {
    const original = "factor((x^2+1)^2-4*x^2)";
    const out = verifyFactorResult(original, "x^4-2*x^2+1", (s) => evaluate(s));
    expect(out).toBe("(x^2+1-2*x)*(x^2+1+2*x)");
    expect(evaluate(`(${out})-((x^2+1)^2-4*x^2)`).trim()).toBe("0");
  });
});
