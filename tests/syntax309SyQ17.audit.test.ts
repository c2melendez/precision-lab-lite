import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import source from "../qa/certification/syntax309_cases.jsonl?raw";
import { parseExpression } from "../src/engine/parsing";
import { splitSystemLatex } from "../src/engine/parsing/systemSplit";
import { intersectLinearInequalities } from "../src/engine/linearInequalityIntersection";

const clauses = (rows: string[]) => rows.map(row => {
  const parsed = parseExpression(row);
  expect(parsed.isInequality).toBe(true);
  return {diffAlgebrite:parsed.algebrite, operator:parsed.inequalityOperator!};
});
const solve = (rows: string[]) => intersectLinearInequalities(clauses(rows), "x");
const scope = {postMessage:vi.fn(), onmessage:undefined as any};
beforeAll(async()=>{vi.stubGlobal("self",scope);await import("../src/workers/compute.worker");});
afterAll(()=>vi.unstubAllGlobals());

describe("SY-Q-17 exact univariate intersection", () => {
  it("uses the official source and produces an open interval through the real handler", () => {
    const row = source.trim().split("\n").map(s=>JSON.parse(s)).find(r=>r.id==="SY-Q-17");
    expect(row.entrada).toBe(String.raw`\begin{cases}x>1\\ x<3\end{cases}`);
    expect(row.esperado).toBe(String.raw`x\in(1,3)`);
    const rows=splitSystemLatex(row.entrada)!;
    expect(rows).toEqual(["x>1","x<3"]);
    const inequalities=clauses(rows);
    expect(solve(rows)).toBe(String.raw`x\in(1,\ 3)`);
    scope.postMessage.mockClear();
    scope.onmessage!({data:{type:"inequalityIntersection", inequalities, variable:"x",requestId:"syq17"}});
    const result=scope.postMessage.mock.calls.at(-1)![0];
    expect(result.success,JSON.stringify(result)).toBe(true);
    expect(result.resultLatex).toBe(String.raw`x\in(1,\ 3)`);
    expect(result.requestId).toBe("syq17");
    expect(result.resultViewLabel).toBe("Intersección real");
  });
  it.each([
    [["x>1","x<3"], String.raw`x\in(1,\ 3)`],
    [["x<3","x>1"], String.raw`x\in(1,\ 3)`],
    [["x>=1","x<3"], String.raw`x\in[1,\ 3)`],
    [["x>1","x<=3"], String.raw`x\in(1,\ 3]`],
    [["x>=1","x<=3"], String.raw`x\in[1,\ 3]`],
    [["-2x<-2","3x<9"], String.raw`x\in(1,\ 3)`],
    [["x>0","x>=1","x<3","x<=4"], String.raw`x\in[1,\ 3)`],
    [["x>1","x>=1"], String.raw`x\in(1,\ \infty)`],
    [["x<3","x<=3"], String.raw`x\in(-\infty,\ 3)`],
    [["x>=2","x<=2"], String.raw`x\in\{2\}`],
    [["x>3","x<1"], String.raw`\varnothing`],
    [["x>2","x<=2"], String.raw`\varnothing`],
    [["x>=2","x<2"], String.raw`\varnothing`],
  ])("preserves intersection and endpoint inclusion: %j", (rows, expected) => {
    expect(solve(rows as string[])).toBe(expected);
  });
  it("retains rational endpoints without four-decimal rounding", () => {
    expect(solve(["3x>1","3x<2"])).toBe(String.raw`x\in(\frac{1}{3},\ \frac{2}{3})`);
  });
  it("rejects unsupported expressions and mismatched variables", () => {
    for(const rows of [["x^2>1","x<3"],["1/x>1","x<3"],["sin(x)>0","x<3"],["y>1","x<3"]]) {
      expect(()=>solve(rows)).toThrow();
    }
  });
});
