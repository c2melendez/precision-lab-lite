import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import source from "../qa/certification/syntax309_cases.jsonl?raw";
import { parseExpression } from "../src/engine/parsing";
import { solveAlgebra } from "../src/engine/stepEngine/algebra";
import { evaluate } from "../src/engine/algebriteClient";

const scope={postMessage:vi.fn(),onmessage:undefined as any};
beforeAll(async()=>{vi.stubGlobal("self",scope);await import("../src/workers/compute.worker");});
afterAll(()=>vi.unstubAllGlobals());

describe("SY-Q-18 explicit variable and symbolic free parameter",()=>{
  it("solves the official equation as x=3-y without fixing y",()=>{
    const row=source.trim().split("\n").map(s=>JSON.parse(s)).find(r=>r.id==="SY-Q-18");
    expect(row.entrada).toBe("x+y=3");
    expect(row.esperado).toContain("x=3-y");
    expect(row.esperado).toContain("libre");
    const parsed=parseExpression(row.entrada);
    expect(parsed.freeVariables.sort()).toEqual(["x","y"]);
    const solution=solveAlgebra(parsed.leftAlgebrite,parsed.rightAlgebrite,"x");
    expect(solution.solutionsAlgebrite).toHaveLength(1);
    const value=solution.solutionsAlgebrite[0];
    expect(evaluate("("+value+")-(3-y)")).toBe("0");
    expect(value).toMatch(/\by\b/);
    expect(value).not.toMatch(/\bx\b/);
    expect(evaluate("("+value+")+y-3")).toBe("0");
    for(const y of [-5,0,1,3,9]) expect(Number(evaluate("subst("+y+",y,"+value+")"))+y).toBe(3);
    scope.postMessage.mockClear();
    scope.onmessage!({data:{type:"solveAlgebra",leftAlgebrite:parsed.leftAlgebrite,
      rightAlgebrite:parsed.rightAlgebrite,variable:"x",requestId:"syq18"}});
    const reply=scope.postMessage.mock.calls.at(-1)![0];
    expect(reply.success,JSON.stringify(reply)).toBe(true);
    expect(reply.requestId).toBe("syq18");
    const replay=parseExpression(reply.resultLatex);
    expect(replay.isEquation).toBe(true);
    expect(evaluate(replay.algebrite+"-("+parsed.algebrite+")")).toBe("0");
  });
  it("respects choosing y instead and preserves scaled equations",()=>{
    for(const [equation,variable,expected] of [
      ["x+y=3","y","3-x"],
      ["2x+2y=6","x","3-y"],
      ["2x+y=3","x","(3-y)/2"],
    ]) {
      const p=parseExpression(equation);
      const answer=solveAlgebra(p.leftAlgebrite,p.rightAlgebrite,variable).solutionsAlgebrite;
      expect(answer).toHaveLength(1);
      expect(evaluate("("+answer[0]+")-("+expected+")")).toBe("0");
    }
  });
});
