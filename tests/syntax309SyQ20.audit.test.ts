import { afterAll,beforeAll,describe,expect,it,vi } from "vitest";
import source from "../qa/certification/syntax309_cases.jsonl?raw";
import { parseExpression } from "../src/engine/parsing";
import { evaluate } from "../src/engine/algebriteClient";
import { solveAlgebra } from "../src/engine/stepEngine/algebra";
const scope={postMessage:vi.fn(),onmessage:undefined as any};
beforeAll(async()=>{vi.stubGlobal("self",scope);await import("../src/workers/compute.worker");});
afterAll(()=>vi.unstubAllGlobals());
describe("SY-Q-20 expression versus explicit equation intent",()=>{
 it("evaluates the official source as an expression and solves its visible =0 form",()=>{
  const row=source.trim().split("\n").map(s=>JSON.parse(s)).find(r=>r.id==="SY-Q-20");
  expect(row.entrada).toBe(String.raw`x^{2}-4`);
  expect(row.operacion).toBe("convencion");
  expect(row.esperado).toContain("=0");
  const p=parseExpression(row.entrada);
  expect(p.isEquation).toBe(false);
  scope.postMessage.mockClear();
  scope.onmessage!({data:{type:"evaluate",expressionAlgebrite:p.algebrite,requestId:"syq20-expression"}});
  const expression=scope.postMessage.mock.calls.at(-1)![0];
  expect(expression.success,JSON.stringify(expression)).toBe(true);
  const shown=parseExpression(expression.resultLatex);
  expect(shown.isEquation).toBe(false);
  expect(evaluate("("+shown.algebrite+")-("+p.algebrite+")")).toBe("0");
  const equation=parseExpression(row.entrada+"=0");
  scope.postMessage.mockClear();
  scope.onmessage!({data:{type:"solveAlgebra",leftAlgebrite:equation.leftAlgebrite,
   rightAlgebrite:equation.rightAlgebrite,variable:"x",requestId:"syq20-equation"}});
  const reply=scope.postMessage.mock.calls.at(-1)![0];
  expect(reply.success,JSON.stringify(reply)).toBe(true);
  expect(reply.requestId).not.toBe(expression.requestId);
  expect([...reply.resultLatex.matchAll(/x\s*=\s*(-?\d+)/g)].map(m=>Number(m[1])).sort((a,b)=>a-b)).toEqual([-2,2]);
 });
 it("changes roots with the constant and preserves single-root equations",()=>{
  for(const [input,expected] of [["x^2-9=0",[-3,3]],["x+1=0",[-1]]] as const){
   const p=parseExpression(input);
   const roots=solveAlgebra(p.leftAlgebrite,p.rightAlgebrite,"x").solutionsAlgebrite;
   expect(roots.map(Number).sort((a,b)=>a-b)).toEqual([...expected]);
  }
 });
});
