import { describe, expect, it } from "vitest";
import { evaluate } from "../src/engine/algebriteClient";
import { differenceOfSquaresCandidate, verifyFactorResult } from "../src/engine/polynomialFactorZ";

const run = (s: string) => evaluate(s);

describe("AS-B-21 bounded difference-of-squares safeguard", () => {
  it("builds the two-quadratic candidate for (P)^2 - K*x^2", () => {
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

  it("returns the exact collapsed form (x-1)^2*(x+1)^2 after CAS verification", () => {
    const out = verifyFactorResult("factor((x^2+1)^2-4*x^2)", "x^4-2*x^2+1", run);
    expect(out).toBe("(x-1)^2*(x+1)^2");
    expect(evaluate(`(${out})-((x^2+1)^2-4*x^2)`).trim()).toBe("0");
  });

  it("keeps irreducible quadratic pieces as a canonical product", () => {
    const out = verifyFactorResult("factor((x^2+2)^2-4*x^2)", "x^4+4", run);
    expect(out).toBe("(x^2-2*x+2)*(x^2+2*x+2)");
    expect(evaluate(`(${out})-((x^2+2)^2-4*x^2)`).trim()).toBe("0");
  });

  it("multivariable input falls back to the two-quadratic candidate", () => {
    const inner = "(x^2+y^2)^2-4*x^2";
    const out = verifyFactorResult(`factor(${inner})`, "x^4+2*x^2*y^2+y^4-4*x^2", run);
    expect(out).toBe("(x^2+y^2-2*x)*(x^2+y^2+2*x)");
    expect(evaluate(`(${out})-(${inner})`).trim()).toBe("0");
  });

  it("regression: verifyFactorResult keeps x^2+1 and x^2-2 unchanged", () => {
    expect(verifyFactorResult("factor(x^2+1)", "x^2+1", run)).toBe("x^2+1");
    expect(verifyFactorResult("factor(x^2-2)", "x^2-2", run)).toBe("x^2-2");
  });
});
