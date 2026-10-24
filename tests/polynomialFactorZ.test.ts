import { describe, expect, it } from "vitest";
import { evaluate } from "../src/engine/algebriteClient";
import { factorUnivariateIntegerText, verifyFactorResult } from "../src/engine/polynomialFactorZ";

const run = (s: string) => evaluate(s);
const same = (a: string, b: string) => evaluate(`(${a})-(${b})`).replace(/\s+/g, "") === "0";

describe("polynomialFactorZ verified univariate factorization", () => {
  it("factors x^6-1 completely and equivalently", () => {
    const f = factorUnivariateIntegerText("x^6-1", run);
    expect(f).not.toBeNull();
    expect(same(f as string, "x^6-1")).toBe(true);
    expect((f as string).split(")*(").length).toBe(4);
  });

  it("factors other integer cases equivalently", () => {
    for (const [input, expected] of [
      ["x^4-1", "(x-1)*(x+1)*(x^2+1)"],
      ["x^4+4", "(x^2-2*x+2)*(x^2+2*x+2)"],
      ["x^3+27", "(x+3)*(x^2-3*x+9)"],
      ["2*x^2-2", "2*(x-1)*(x+1)"],
    ] as const) {
      const f = factorUnivariateIntegerText(input, run);
      expect(f).not.toBeNull();
      expect(same(f as string, input)).toBe(true);
      expect(same(f as string, expected)).toBe(true);
    }
  });

  it("keeps irreducible integer polynomials equivalent", () => {
    const f = factorUnivariateIntegerText("x^4+1", run);
    expect(f).not.toBeNull();
    expect(same(f as string, "x^4+1")).toBe(true);
  });

  it("rejects non-polynomial, multivariate or non-integer inputs", () => {
    expect(factorUnivariateIntegerText("1/x", run)).toBeNull();
    expect(factorUnivariateIntegerText("sqrt(x)", run)).toBeNull();
    expect(factorUnivariateIntegerText("x*y", run)).toBeNull();
    expect(factorUnivariateIntegerText("3", run)).toBeNull();
  });

  it("keeps a correct Algebrite factorization unchanged", () => {
    expect(verifyFactorResult("factor(x^2-9)", "(x-3)*(x+3)", run)).toBe("(x-3)*(x+3)");
  });

  it("replaces a non-equivalent factorization with a verified one", () => {
    const wrong = "(x-1)*(x+1)*(x^2+x+1)*(x^2+1)";
    const fixed = verifyFactorResult("factor(x^6-1)", wrong, run);
    expect(fixed).not.toBe(wrong);
    expect(same(fixed, "x^6-1")).toBe(true);
  });

  it("keeps real radical factorizations that are not integer polynomials", () => {
    const real = "(x^2-2^(1/2)*x+1)*(x^2+2^(1/2)*x+1)";
    expect(verifyFactorResult("factor(x^4+1)", real, run)).toBe(real);
  });

  it("ignores inputs that are not a single factor call", () => {
    expect(verifyFactorResult("x^2-1", "x^2-1", run)).toBe("x^2-1");
    expect(verifyFactorResult("factor(x^2-1)+factor(x)", "(x-1)*(x+1)", run)).toBe("(x-1)*(x+1)");
  });
});
