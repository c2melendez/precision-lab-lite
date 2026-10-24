import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { evaluate } from "../src/engine/algebriteClient";
import { parseExpression } from "../src/engine/parsing";
import { realAbsolutePiecewise, type AbsPiecewiseBranch } from "../src/engine/absPiecewise";
import source from "../qa/certification/algebra114_source.md?raw";

const scope = { postMessage: vi.fn(), onmessage: undefined as any };
beforeAll(async () => { vi.stubGlobal("self", scope); await import("../src/workers/compute.worker"); });
afterAll(() => vi.unstubAllGlobals());

const num = (s: string) => Number(evaluate(`float(${s})`));
const contains = (b: AbsPiecewiseBranch, t: number) =>
  (b.lower === null || (b.lowerClosed ? t >= num(b.lower) : t > num(b.lower))) &&
  (b.upper === null || (b.upperClosed ? t <= num(b.upper) : t < num(b.upper)));
const original = (t: number) => Math.abs(t - 1) + Math.abs(t + 1);
const expected = (t: number) => (t < -1 ? -2 * t : t <= 1 ? 2 : 2 * t);

describe("Algebra114 AS-AVS-03 |x-1|+|x+1| by cases over R", () => {
  it("matches the official row", () => {
    expect(source).toContain(
      "| AS-AVS-03 | N2 | \\(|x-1|+|x+1|\\) | \\(-2x\\) si \\(x<-1\\); \\(2\\) si \\(-1\\le x\\le1\\); \\(2x\\) si \\(x>1\\) |",
    );
  });

  it("returns the three official branches with breakpoints -1 and 1", () => {
    const parsed = parseExpression("|x-1|+|x+1|");
    expect(parsed.isEquation).toBe(false);
    const result = realAbsolutePiecewise(parsed.algebrite);
    expect(result).not.toBeNull();
    expect(result!.variable).toBe("x");
    const branches = result!.branches;
    expect(branches).toHaveLength(3);
    expect(branches.map((b) => [b.lower, b.upper])).toEqual([[null, "-1"], ["-1", "1"], ["1", null]]);
    const official = ["-2*x", "2", "2*x"];
    branches.forEach((b, i) => expect(evaluate(`simplify((${b.expressionAlgebrite})-(${official[i]}))`)).toBe("0"));
    for (const t of [-4, -1.5, -1, -0.25, 0, 0.75, 1, 1.5, 6]) {
      const holders = branches.filter((b) => contains(b, t));
      expect(holders, `partition at ${t}`).toHaveLength(1);
      const value = num(holders[0].expressionAlgebrite.replace(/x/g, `(${t})`));
      expect(value).toBeCloseTo(original(t), 12);
      expect(value).toBeCloseTo(expected(t), 12);
    }
  });

  it("delivers the piecewise result through the worker evaluate handler", () => {
    scope.postMessage.mockClear();
    scope.onmessage!({ data: { type: "evaluate", expressionAlgebrite: parseExpression("|x-1|+|x+1|").algebrite, requestId: "avs03" } });
    const result = scope.postMessage.mock.calls.at(-1)![0];
    expect(result.success, JSON.stringify(result)).toBe(true);
    expect(result.resultLatex).toBe("\\begin{cases}-2x & x<-1\\\\2 & -1\\le x<1\\\\2x & x\\ge 1\\end{cases}");
    expect(result.resultLatex).not.toMatch(/\\left\s*\|/);
    expect(result.requestId).toBe("avs03");
  });

  it("keeps plain |x| and non-linear or multivariate inputs untouched", () => {
    for (const input of ["abs(x)", "3*abs(x)", "abs(x)^2", "abs(x*y)", "abs(x^2-1)", "abs(x)+abs(y)", "sin(abs(x))"]) {
      expect(realAbsolutePiecewise(input), input).toBeNull();
    }
  });
});
