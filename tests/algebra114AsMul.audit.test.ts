import { describe, expect, it } from "vitest";
import { evaluate } from "../src/engine/algebriteClient";
import { extractDomainConditions } from "../src/engine/domainConditions";
import { compileNumeric } from "../src/engine/numericFallback";
import source from "../qa/certification/algebra114_source.md?raw";

// Algebra114 AS-MUL-01..06 (block K). Engine is called directly in Algebrite
// syntax, as in AS-FAC. The contract form is the oracle; numeric agreement
// over several (x,y,z) triples only proves the engine does not return a
// wrong value. The bundled Algebrite has no multivariate factor/gcd and no
// assumption input, so AS-MUL-02..06 contract forms are registered as
// capability gaps (it.fails / it.todo) instead of being fabricated by
// exact-input rewrites. See MANUAL_CAPABILITY_GAPS.md (AS-MUL).

const TRIPLES: [number, number, number][] = [
  [2, 3, 5],
  [-1, 4, -2],
  [0, 5, 7],
  [3, -4, 1],
  [11, 0, -6],
  [-3, -3, 9],
];

const compact = (s: string) => s.replace(/\s+/g, "");

function valueAt(expr: string, x: number, y: number, z: number): number {
  const substituted = expr
    .replace(/\bx\b/g, `(${x})`)
    .replace(/\by\b/g, `(${y})`)
    .replace(/\bz\b/g, `(${z})`);
  return compileNumeric(substituted, "__no_var__")(0);
}

function expectEquivalent(result: string, oracle: (x: number, y: number, z: number) => number,
  skip: (x: number, y: number, z: number) => boolean = () => false) {
  let checked = 0;
  for (const [x, y, z] of TRIPLES) {
    if (skip(x, y, z)) continue;
    expect(valueAt(result, x, y, z)).toBeCloseTo(oracle(x, y, z), 9);
    checked += 1;
  }
  expect(checked).toBeGreaterThanOrEqual(4);
}

describe("Algebra114 AS-MUL multivariable, symmetry and assumptions", () => {
  it("AS-MUL-01 expands (x+y)(x-y)+z^2 to exactly x^2-y^2+z^2", () => {
    expect(source).toContain("| AS-MUL-01 |");
    const result = evaluate("(x+y)*(x-y)+z^2");
    expect(compact(result)).toBe("x^2-y^2+z^2");
    expectEquivalent(result, (x, y, z) => x * x - y * y + z * z);
  });

  it("AS-MUL-02 factor() never returns a wrong value for x^2+2xy+y^2-z^2", () => {
    expect(source).toContain("| AS-MUL-02 |");
    const result = evaluate("factor(x^2+2*x*y+y^2-z^2)");
    expect(result).not.toContain("factor(");
    expectEquivalent(result, (x, y, z) => (x + y - z) * (x + y + z));
  });

  it.fails("AS-MUL-02 GAP: multivariate factorization (x+y-z)(x+y+z)", () => {
    const result = compact(evaluate("factor(x^2+2*x*y+y^2-z^2)"));
    expect(result).toContain("(x+y-z)");
    expect(result).toContain("(x+y+z)");
  });

  // Algebrite factor() does not terminate in a bounded time on this input.
  it.todo("AS-MUL-03 GAP: factor x^3+y^3+z^3-3xyz into (x+y+z)(x^2+y^2+z^2-xy-yz-zx)");

  it("AS-MUL-04 keeps the original denominator x^2-y^2 as a domain condition", () => {
    expect(source).toContain("| AS-MUL-04 |");
    const conditions = extractDomainConditions("(x-y)/(x^2-y^2)");
    const hasDenominator = conditions.some(
      (c: any) => c.kind === "denominator" && c.operator === "!=" &&
        compact(c.expressionAlgebrite).includes("x^2-y^2"),
    );
    expect(hasDenominator, JSON.stringify(conditions)).toBe(true);
    const result = evaluate("(x-y)/(x^2-y^2)");
    expectEquivalent(result, (x, y) => 1 / (x + y), (x, y) => x === y || x === -y);
  });

  it.fails("AS-MUL-04 GAP: multivariate cancellation to 1/(x+y)", () => {
    expect(compact(evaluate("(x-y)/(x^2-y^2)"))).toBe("1/(x+y)");
  });

  it("AS-MUL-05 does not claim 3xyz without the assumption x+y+z=0", () => {
    expect(source).toContain("| AS-MUL-05 |");
    const result = evaluate("simplify(x^3+y^3+z^3)");
    expectEquivalent(result, (x, y, z) => x ** 3 + y ** 3 + z ** 3);
    expect(valueAt(result, 2, 3, 5)).not.toBeCloseTo(3 * 2 * 3 * 5, 6);
  });

  it.todo("AS-MUL-05 GAP: simplification under a user-supplied assumption x+y+z=0 -> 3xyz");

  it("AS-MUL-06 simplify() never returns a wrong value", () => {
    expect(source).toContain("| AS-MUL-06 |");
    const result = evaluate("simplify(x^2+y^2+z^2-x*y-y*z-z*x)");
    expectEquivalent(result, (x, y, z) => ((x - y) ** 2 + (y - z) ** 2 + (z - x) ** 2) / 2);
  });

  it.fails("AS-MUL-06 GAP: half-sum of squared differences form", () => {
    const result = compact(evaluate("simplify(x^2+y^2+z^2-x*y-y*z-z*x)"));
    expect(result).toContain("(x-y)^2");
    expect(result).toContain("(y-z)^2");
    expect(result).toMatch(/\((?:z-x|x-z)\)\^2/);
  });
});
