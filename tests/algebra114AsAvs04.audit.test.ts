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
const original = (t: number) => Math.abs(2 * t - 3);
const expected = (t: number) => (t < 1.5 ? 3 - 2 * t : 2 * t - 3);

describe("Algebra114 AS-AVS-04 |2x-3| by cases over R", () => {
  it("matches the official row", () => {
    expect(source).toContain(
      "| AS-AVS-04 | N2 | \\(|2x-3|\\) | \\(3-2x\\) si \\(x<\\frac{3}{2}\\); \\(2x-3\\) si \\(x\\ge\\frac{3}{2}\\) |",
    );
  });

  it("returns the two official branches with breakpoint 3/2", () => {
    const parsed = parseExpression("|2x-3|");
    expect(parsed.isEquation).toBe(false);
    expect(parsed.algebrite.replace(/\s+/g, "")).toBe("abs(2*x-3)");
    const result = realAbsolutePiecewise(parsed.algebrite);
    expect(result).not.toBeNull();
    expect(result!.variable).toBe("x");
    const branches = result!.branches;
    expect(branches).toHaveLength(2);
    expect(branches.map((b) => [b.lower, b.upper])).toEqual([[null, "3/2"], ["3/2", null]]);
    expect(branches.map((b) => [b.lowerClosed, b.upperClosed])).toEqual([[false, false], [true, false]]);
    const official = ["3-2*x", "2*x-3"];
    branches.forEach((b, i) => expect(evaluate(`simplify((${b.expressionAlgebrite})-(${official[i]}))`)).toBe("0"));
    for (const t of [-3, 0, 1, 1.25, 1.5, 1.75, 2, 10]) {
      const holders = branches.filter((b) => contains(b, t));
      expect(holders, `partition at ${t}`).toHaveLength(1);
      const value = num(holders[0].expressionAlgebrite.replace(/x/g, `(${t})`));
      expect(value).toBeCloseTo(original(t), 12);
      expect(value).toBeCloseTo(expected(t), 12);
    }
  });

  it("delivers the piecewise result through the worker evaluate handler", () => {
    scope.postMessage.mockClear();
    scope.onmessage!({ data: { type: "evaluate", expressionAlgebrite: parseExpression("|2x-3|").algebrite, requestId: "avs04" } });
    const result = scope.postMessage.mock.calls.at(-1)![0];
    expect(result.success, JSON.stringify(result)).toBe(true);
    expect(result.resultLatex).toBe("\\begin{cases}-2x+3 & x<\\frac{3}{2}\\\\2x-3 & x\\ge \\frac{3}{2}\\end{cases}");
    expect(result.resultLatex).not.toMatch(/\\left\s*\|/);
    expect(result.requestId).toBe("avs04");
  });
});
