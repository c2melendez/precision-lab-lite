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
const original = (t: number) => Math.abs(t) + t;
const expected = (t: number) => (t >= 0 ? 2 * t : 0);

describe("Algebra114 AS-AVS-05 |x|+x by cases over R", () => {
  it("matches the official row", () => {
    expect(source).toContain(
      "| AS-AVS-05 | N3 | \\(|x|+x\\) | \\(2x\\) si \\(x\\ge0\\); \\(0\\) si \\(x<0\\) |",
    );
  });

  it("returns the official branches 0 (x<0) and 2x (x>=0)", () => {
    const parsed = parseExpression("|x|+x");
    expect(parsed.isEquation).toBe(false);
    expect(parsed.algebrite.replace(/\s+/g, "")).toBe("abs(x)+x");
    const result = realAbsolutePiecewise(parsed.algebrite);
    expect(result).not.toBeNull();
    expect(result!.variable).toBe("x");
    const branches = result!.branches;
    expect(branches).toHaveLength(2);
    expect(branches.map((b) => [b.lower, b.upper])).toEqual([[null, "0"], ["0", null]]);
    expect(branches.map((b) => [b.lowerClosed, b.upperClosed])).toEqual([[false, false], [true, false]]);
    const official = ["0", "2*x"];
    branches.forEach((b, i) => expect(evaluate(`simplify((${b.expressionAlgebrite})-(${official[i]}))`)).toBe("0"));
    for (const t of [-5, -1, -0.5, 0, 0.5, 1, 4]) {
      const holders = branches.filter((b) => contains(b, t));
      expect(holders, `partition at ${t}`).toHaveLength(1);
      const value = num(holders[0].expressionAlgebrite.replace(/x/g, `(${t})`));
      expect(value).toBeCloseTo(original(t), 12);
      expect(value).toBeCloseTo(expected(t), 12);
    }
  });

  it("delivers the piecewise result through the worker evaluate handler", () => {
    scope.postMessage.mockClear();
    scope.onmessage!({ data: { type: "evaluate", expressionAlgebrite: parseExpression("|x|+x").algebrite, requestId: "avs05" } });
    const result = scope.postMessage.mock.calls.at(-1)![0];
    expect(result.success, JSON.stringify(result)).toBe(true);
    expect(result.resultLatex).toBe("\\begin{cases}0 & x<0\\\\2x & x\\ge 0\\end{cases}");
    expect(result.resultLatex).not.toMatch(/\\left\s*\|/);
    expect(result.requestId).toBe("avs05");
  });
});
