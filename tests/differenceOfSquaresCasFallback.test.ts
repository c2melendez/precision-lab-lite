import { describe, expect, it } from "vitest";
import { evaluate } from "../src/engine/algebriteClient";
import { differenceOfSquaresFactored, verifyFactorResult } from "../src/engine/polynomialFactorZ";

// AS-B-21: exceptions and inconclusive CAS answers must never replace the
// unfactored result with an unverified candidate. When the two-quadratic
// candidate is verified by the CAS, it must be kept.

const INNER = "(x^2+1)^2-4*x^2";
const ORIGINAL = "x^4-2*x^2+1";
const CANDIDATE = "(x^2+1-2*x)*(x^2+1+2*x)";
const FACTORED = "(x-1)^2*(x+1)^2";
const INPUT = `factor(${INNER})`;

// Exact equivalence-check strings built by polynomialFactorZ.ts.
const isFactoredCheck = (s: string) => s === `(${FACTORED})-(${INNER})`;
const isSquaresCheck = (s: string) => s === `(${CANDIDATE})-(${INNER})`;
const isAnyInnerCheck = (s: string) => s.endsWith(`-(${INNER})`);
const isLeftSampling = (s: string) => s === "(0)^2+1-2*(0)";

type Failure = "throw" | "inconclusive" | "nonzero";
type Rule = { match: (s: string) => boolean; failure: Failure };

/** Real CAS, except calls matched by a rule fail in the given way. */
function casWith(rules: Rule[]): (s: string) => string {
  return (s) => {
    const rule = rules.find((r) => r.match(s));
    if (!rule) return evaluate(s);
    if (rule.failure === "throw") throw new Error("CAS no disponible (simulado)");
    if (rule.failure === "nonzero") return "2"; // comprueba y no es equivalente
    return s; // sin simplificar: no es "0", así que no prueba equivalencia
  };
}

describe("AS-B-21 CAS inconclusive results keep the two-quadratic candidate", () => {
  it("keeps the verified candidate when the factored check is inconclusive", () => {
    const run = casWith([{ match: isFactoredCheck, failure: "inconclusive" }]);
    expect(verifyFactorResult(INPUT, ORIGINAL, run)).toBe(CANDIDATE);
  });

  it("keeps the verified candidate when the factored check is non-equivalent", () => {
    const run = casWith([{ match: isFactoredCheck, failure: "nonzero" }]);
    expect(verifyFactorResult(INPUT, ORIGINAL, run)).toBe(CANDIDATE);
  });

  it("returns the original result when the candidate check is inconclusive", () => {
    const run = casWith([
      { match: isFactoredCheck, failure: "inconclusive" },
      { match: isSquaresCheck, failure: "inconclusive" },
    ]);
    expect(verifyFactorResult(INPUT, ORIGINAL, run)).toBe(ORIGINAL);
  });

  it("returns the original result when the candidate check is non-equivalent", () => {
    const run = casWith([
      { match: isFactoredCheck, failure: "nonzero" },
      { match: isSquaresCheck, failure: "nonzero" },
    ]);
    expect(verifyFactorResult(INPUT, ORIGINAL, run)).toBe(ORIGINAL);
  });

  it("returns the original result when the candidate check throws", () => {
    const run = casWith([
      { match: isFactoredCheck, failure: "inconclusive" },
      { match: isSquaresCheck, failure: "throw" },
    ]);
    expect(() => verifyFactorResult(INPUT, ORIGINAL, run)).not.toThrow();
    expect(verifyFactorResult(INPUT, ORIGINAL, run)).toBe(ORIGINAL);
  });

  it("never replaces an already-factored result that the CAS cannot verify", () => {
    const run = casWith([{ match: isAnyInnerCheck, failure: "inconclusive" }]);
    expect(verifyFactorResult(INPUT, FACTORED, run)).toBe(FACTORED);
  });

  it("differenceOfSquaresFactored returns null on an inconclusive factored check", () => {
    const run = casWith([{ match: isFactoredCheck, failure: "inconclusive" }]);
    expect(differenceOfSquaresFactored(INNER, run)).toBeNull();
  });

  it("differenceOfSquaresFactored returns null on a non-equivalent factored check", () => {
    const run = casWith([{ match: isFactoredCheck, failure: "nonzero" }]);
    expect(differenceOfSquaresFactored(INNER, run)).toBeNull();
  });

  it("differenceOfSquaresFactored propagates a CAS exception to its caller", () => {
    const run = casWith([{ match: isFactoredCheck, failure: "throw" }]);
    expect(() => differenceOfSquaresFactored(INNER, run)).toThrow("CAS no disponible");
  });

  // AS-B-21: a CAS exception in the factored step does not skip the independent
  // candidate check, so the verified candidate is still kept.
  it("a CAS exception in the factored check still keeps the verified candidate", () => {
    const run = casWith([{ match: isFactoredCheck, failure: "throw" }]);
    expect(verifyFactorResult(INPUT, ORIGINAL, run)).toBe(CANDIDATE);
  });

  it("a CAS exception while sampling a factor still keeps the verified candidate", () => {
    const run = casWith([{ match: isLeftSampling, failure: "throw" }]);
    expect(verifyFactorResult(INPUT, ORIGINAL, run)).toBe(CANDIDATE);
  });
});
