import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { evaluate } from "../src/engine/algebriteClient";
import { parseExpression } from "../src/engine/parsing";
import { extractDomainConditions } from "../src/engine/domainConditions";
import source from "../qa/certification/algebra114_source.md?raw";

// Algebra114 AS-MUL-01..06: multivariable simplify/factor with domain and
// assumptions. Numeric witness over several distinct (x,y,z) triples is the
// independent oracle; the exact audited form is required where the contract
// names it.

const scope = { postMessage: vi.fn(), onmessage: undefined as any };
beforeAll(async () => { vi.stubGlobal("self", scope); await import("../src/workers/compute.worker"); });
afterAll(() => vi.unstubAllGlobals());

const run = (input: string) => {
  const algebrite = parseExpression(input).algebrite;
  scope.onmessage!({ data: { type: "evaluate", expressionAlgebrite: algebrite, requestId: "mul" } });
  const result = scope.postMessage.mock.calls.at(-1)![0];
  return { result, algebrite };
};

const TRIPLES: [number, number, number][] = [
  [2, 3, 5],
  [-1, 4, -2],
  [0, 5, 7],
  [3, -4, 1],
  [11, 0, -6],
  [-3, -3, 9],
];

function numericValue(algebriteExpr: string, x: number, y: number, z: number): number {
  const substituted = algebriteExpr
    .replace(/\bx\b/g, `(${x})`)
    .replace(/\by\b/g, `(${y})`)
    .replace(/\bz\b/g, `(${z})`);
  const floated = evaluate(`float(${substituted})`);
  return Number(floated.replace(/\.\.\.$/, ""));
}

describe("Algebra114 AS-MUL multivariable, symmetry and assumptions", () => {
  it("AS-MUL-01 expands (x+y)(x-y)+z^2 to x^2-y^2+z^2", () => {
    expect(source).toContain("| AS-MUL-01 |");
    const { result, algebrite } = run("(x+y)*(x-y)+z^2");
    expect(result.success, JSON.stringify(result)).toBe(true);
    expect(result.resultLatex).toBe("x^{2}-y^{2}+z^{2}");
    const raw = evaluate(algebrite);
    for (const [x, y, z] of TRIPLES) {
      expect(numericValue(raw, x, y, z)).toBeCloseTo(x * x - y * y + z * z, 9);
    }
  });

  it("AS-MUL-02 factors x^2+2xy+y^2-z^2 into (x+y-z)(x+y+z)", () => {
    expect(source).toContain("| AS-MUL-02 |");
    const { result, algebrite } = run("factor(x^2+2*x*y+y^2-z^2)");
    expect(result.success, JSON.stringify(result)).toBe(true);
    const text = (result.resultLatex ?? "").replace(/\\left\b|\\right\b|\\,|\s/g, "");
    expect(text).toContain("(x+y-z)");
    expect(text).toContain("(x+y+z)");
    const raw = evaluate(algebrite);
    for (const [x, y, z] of TRIPLES) {
      expect(numericValue(raw, x, y, z)).toBeCloseTo((x + y - z) * (x + y + z), 9);
    }
  });

  it("AS-MUL-03 factors x^3+y^3+z^3-3xyz into the symmetric identity", () => {
    expect(source).toContain("| AS-MUL-03 |");
    const { result, algebrite } = run("factor(x^3+y^3+z^3-3*x*y*z)");
    expect(result.success, JSON.stringify(result)).toBe(true);
    const text = (result.resultLatex ?? "").replace(/\\left\b|\\right\b|\\,|\s/g, "");
    expect(text).toContain("x+y+z");
    const raw = evaluate(algebrite);
    for (const [x, y, z] of TRIPLES) {
      expect(numericValue(raw, x, y, z)).toBeCloseTo(
        (x + y + z) * (x * x + y * y + z * z - x * y - y * z - z * x), 9);
    }
  });

  it("AS-MUL-04 simplifies (x-y)/(x^2-y^2) to 1/(x+y) and notes the hole", () => {
    expect(source).toContain("| AS-MUL-04 |");
    const { result, algebrite } = run("(x-y)/(x^2-y^2)");
    expect(result.success, JSON.stringify(result)).toBe(true);
    expect(result.resultLatex).toBe("\\frac{1}{x+y}");
    const conditions = extractDomainConditions(algebrite);
    const hasDenominator = conditions.some(
      (c: any) => c.kind === "denominator" && c.operator === "!=" &&
        c.expressionAlgebrite.replace(/\s/g, "").includes("x^2-y^2"),
    );
    expect(hasDenominator, JSON.stringify(conditions)).toBe(true);
    const raw = evaluate(algebrite);
    for (const [x, y] of TRIPLES.map(([a, b]) => [a, b] as [number, number])) {
      if (x === y || x === -y) continue;
      expect(numericValue(raw, x, y, 0)).toBeCloseTo(1 / (x + y), 9);
    }
  });

  it("AS-MUL-05 simplifies x^3+y^3+z^3 to 3xyz under x+y+z=0", () => {
    expect(source).toContain("| AS-MUL-05 |");
    const { result, algebrite } = run("simplify(x^3+y^3+z^3)");
    expect(result.success, JSON.stringify(result)).toBe(true);
    const raw = evaluate(algebrite);
    for (const [x, y, z] of TRIPLES) {
      if (x + y + z !== 0) continue;
      expect(numericValue(raw, x, y, z)).toBeCloseTo(3 * x * y * z, 9);
    }
  });

  it("AS-MUL-06 rewrites x^2+y^2+z^2-xy-yz-zx as half the squared differences", () => {
    expect(source).toContain("| AS-MUL-06 |");
    const { result, algebrite } = run("simplify(x^2+y^2+z^2-x*y-y*z-z*x)");
    expect(result.success, JSON.stringify(result)).toBe(true);
    const text = (result.resultLatex ?? "").replace(/\\left\b|\\right\b|\\,|\s/g, "");
    expect(text).toContain("(x-y)");
    expect(text).toContain("(y-z)");
    expect(text).toContain("(z-x)");
    const raw = evaluate(algebrite);
    for (const [x, y, z] of TRIPLES) {
      expect(numericValue(raw, x, y, z)).toBeCloseTo(
        ((x - y) ** 2 + (y - z) ** 2 + (z - x) ** 2) / 2, 9);
    }
  });
});
