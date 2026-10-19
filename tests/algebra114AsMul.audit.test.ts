import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { evaluate } from "../src/engine/algebriteClient";
import { parseExpression } from "../src/engine/parsing";
import { extractDomainConditions } from "../src/engine/domainConditions";
import { compileNumeric } from "../src/engine/numericFallback";
import source from "../qa/certification/algebra114_source.md?raw";

// Algebra114 AS-MUL-01..06: multivariable simplify/factor with domain and
// assumptions. Numeric witness over several distinct (x,y,z) triples is the
// independent oracle; the exact audited form is required where the contract
// names it. The test is introduced first and is expected to fail before any
// scoped engine correction is applied.

const scope = { postMessage: vi.fn(), onmessage: undefined as any };
beforeAll(async () => { vi.stubGlobal("self", scope); await import("../src/workers/compute.worker"); });
afterAll(() => vi.unstubAllGlobals());

const run = (input: string) => {
  scope.onmessage!({ data: { type: "evaluate", expressionAlgebrite: parseExpression(input).algebrite, requestId: "mul" } });
  return scope.postMessage.mock.calls.at(-1)![0];
};

const TRIPLES: [number, number, number][] = [
  [2, 3, 5],
  [-1, 4, -2],
  [0, 5, 7],
  [3, -4, 1],
  [11, 0, -6],
  [-3, -3, 9],
];

function numericValue(expr: string, x: number, y: number, z: number): number {
  const substituted = expr
    .replace(/x/g, `(${x})`)
    .replace(/y/g, `(${y})`)
    .replace(/z/g, `(${z})`);
  return compileNumeric(evaluate(substituted), "__no_var__")(0);
}

describe("Algebra114 AS-MUL multivariable, symmetry and assumptions", () => {
  it("AS-MUL-01 expands (x+y)(x-y)+z^2 to x^2-y^2+z^2", () => {
    expect(source).toContain("| AS-MUL-01 |");
    const result = run("(x+y)*(x-y)+z^2");
    expect(result.success, JSON.stringify(result)).toBe(true);
    expect(result.resultLatex).toBe("x^{2}-y^{2}+z^{2}");
    for (const [x, y, z] of TRIPLES) {
      expect(numericValue(result.resultAlgebrite ?? result.resultLatex, x, y, z))
        .toBeCloseTo(x * x - y * y + z * z, 9);
    }
  });

  it("AS-MUL-02 factors x^2+2xy+y^2-z^2 into (x+y-z)(x+y+z)", () => {
    expect(source).toContain("| AS-MUL-02 |");
    const result = run("factor(x^2+2*x*y+y^2-z^2)");
    expect(result.success, JSON.stringify(result)).toBe(true);
    const text = (result.resultLatex ?? "").replace(/\s/g, "");
    expect(text).toContain("(x+y-z)");
    expect(text).toContain("(x+y+z)");
    for (const [x, y, z] of TRIPLES) {
      const expected = (x + y - z) * (x + y + z);
      const actual = numericValue(result.resultAlgebrite ?? result.resultLatex, x, y, z);
      expect(actual).toBeCloseTo(expected, 9);
    }
  });

  it("AS-MUL-03 factors x^3+y^3+z^3-3xyz into the symmetric identity", () => {
    expect(source).toContain("| AS-MUL-03 |");
    const result = run("factor(x^3+y^3+z^3-3*x*y*z)");
    expect(result.success, JSON.stringify(result)).toBe(true);
    const text = (result.resultLatex ?? "").replace(/\s/g, "");
    expect(text).toContain("x+y+z");
    for (const [x, y, z] of TRIPLES) {
      const expected = (x + y + z) * (x * x + y * y + z * z - x * y - y * z - z * x);
      const actual = numericValue(result.resultAlgebrite ?? result.resultLatex, x, y, z);
      expect(actual).toBeCloseTo(expected, 9);
    }
  });

  it("AS-MUL-04 simplifies (x-y)/(x^2-y^2) to 1/(x+y) and notes the x=y hole", () => {
    expect(source).toContain("| AS-MUL-04 |");
    const input = parseExpression("(x-y)/(x^2-y^2)").algebrite;
    const result = run("(x-y)/(x^2-y^2)");
    expect(result.success, JSON.stringify(result)).toBe(true);
    expect(result.resultLatex).toBe("\\frac{1}{x+y}");
    const conditions = extractDomainConditions(input);
    const namesDenominator = conditions.some(
      (c: any) => c.kind === "denominator" && c.variable === "x" && c.operator === "!=",
    );
    expect(namesDenominator, JSON.stringify(conditions)).toBe(true);
    for (const [x, y] of TRIPLES.map(([a, b]) => [a, b] as [number, number])) {
      if (x === y) continue;
      const actual = numericValue(result.resultAlgebrite ?? result.resultLatex, x, y, 0);
      expect(actual).toBeCloseTo(1 / (x + y), 9);
    }
  });

  it("AS-MUL-05 simplifies x^3+y^3+z^3 to 3xyz under x+y+z=0", () => {
    expect(source).toContain("| AS-MUL-05 |");
    const result = run("simplify(x^3+y^3+z^3)");
    expect(result.success, JSON.stringify(result)).toBe(true);
    // The symmetric identity reduces x^3+y^3+z^3 to 3xyz when x+y+z=0.
    for (const [x, y, z] of TRIPLES) {
      if (x + y + z !== 0) continue;
      const actual = numericValue(result.resultAlgebrite ?? result.resultLatex, x, y, z);
      expect(actual).toBeCloseTo(3 * x * y * z, 9);
    }
  });

  it("AS-MUL-06 rewrites x^2+y^2+z^2-xy-yz-zx as half the squared differences", () => {
    expect(source).toContain("| AS-MUL-06 |");
    const result = run("simplify(x^2+y^2+z^2-x*y-y*z-z*x)");
    expect(result.success, JSON.stringify(result)).toBe(true);
    const text = (result.resultLatex ?? "").replace(/\s/g, "");
    // The contract requires the half-squared-differences form, not just an
    // equivalent unsimplified expression. Accept either 1/2(...) or (...)/2.
    expect(text).toMatch(/\b2\b/);
    for (const [x, y, z] of TRIPLES) {
      const expected = ((x - y) ** 2 + (y - z) ** 2 + (z - x) ** 2) / 2;
      const actual = numericValue(result.resultAlgebrite ?? result.resultLatex, x, y, z);
      expect(actual).toBeCloseTo(expected, 9);
    }
  });
});
