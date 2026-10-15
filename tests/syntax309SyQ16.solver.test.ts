import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import raw from "../qa/certification/syntax309_cases.jsonl?raw";
import { splitSystemLatex } from "../src/engine/parsing/systemSplit";
import { parseExpression } from "../src/engine/parsing";
import { tryQuadraticSystem } from "../src/engine/stepEngine/quadraticSystem";
import { evaluate } from "../src/engine/algebriteClient";

const parsed = (rows: string[]) => rows.map(row => parseExpression(row).algebrite);
const solve = (rows: string[]) => tryQuadraticSystem(parsed(rows), ["x", "y"]);
const scope = {postMessage: vi.fn(), onmessage: undefined as any};
beforeAll(async () => { vi.stubGlobal("self", scope); await import("../src/workers/compute.worker"); });
afterAll(() => vi.unstubAllGlobals());

describe("SY-Q-16 exact affine/quadratic systems", () => {
  it("returns BOTH official roots, independently certified by sum and product", () => {
    const row = raw.split("\n").filter(Boolean).map(s => JSON.parse(s)).find(r => r.id === "SY-Q-16");
    expect(row.esperado).toBe(String.raw`(x,y)=(3,4),\ (4,3)`);
    const rows = splitSystemLatex(row.entrada)!;
    expect(rows).toEqual(["x^{2}+y^{2}=25", "x+y=7"]);
    const roots = solve(rows)!;
    expect(roots.map(r => r.join(",")).sort()).toEqual(["3,4", "4,3"]);
    for (const pair of roots) {
      const [x,y] = pair.map(Number);
      expect(x+y).toBe(7);
      expect(x*y).toBe(12); // (x+y)^2 = x²+y²+2xy; two roots of t²-7t+12
      expect(x*x+y*y).toBe(25);
    }
    scope.postMessage.mockClear();
    scope.onmessage!({data:{type:"solveSystem", requestId:"syq16", equationsAlgebrite:parsed(rows), variables:["x","y"]}});
    const reply = scope.postMessage.mock.calls.at(-1)![0];
    expect(reply.success, JSON.stringify(reply)).toBe(true);
    expect(reply.requestId).toBe("syq16");
    expect(reply.resultLatex).toMatch(/x\s*=\s*3.*y\s*=\s*4/);
    expect(reply.resultLatex).toMatch(/x\s*=\s*4.*y\s*=\s*3/);
    expect(reply.resultViewLabel).toBe("Soluciones reales");
  });
  it("is invariant under equation order and handles a zero first pivot", () => {
    expect(solve(["x+y=7","x^2+y^2=25"])!.map(r=>r.join(",")).sort()).toEqual(["3,4","4,3"]);
    expect(solve(["y=4","x^2+y^2=25"])!.map(r=>r.join(",")).sort()).toEqual(["-3,4","3,4"]);
  });
  it("deduplicates tangency and reports no real intersections", () => {
    expect(solve(["x^2+y^2=2","x+y=2"])).toEqual([["1","1"]]);
    expect(solve(["x^2+y^2=1","x+y=3"])).toEqual([]);
  });
  it("preserves exact irrational and rational roots", () => {
    const roots = solve(["x^2+y^2=2","y=0"])!;
    expect(roots).toHaveLength(2);
    for(const [x,y] of roots) {
      expect(y).toBe("0");
      expect(evaluate("("+x+")^2-2")).toBe("0");
    }
    expect(solve(["x^2+y^2=1/2","x+y=1"])).toEqual([["1/2","1/2"]]);
  });
  it("keeps linear systems on the existing solver and rejects unsupported nonlinear families", () => {
    expect(solve(["x+y=3","x-y=1"])).toBeNull();
    for(const rows of [
      ["x^2+y^2=25","x*y=12"],
      ["x^3+y=1","x+y=2"],
      ["sin(x)+y=1","x+y=2"],
      ["x+y=1","(x+y)^2=1"],
    ]) expect(() => solve(rows)).toThrow();
  });
});
