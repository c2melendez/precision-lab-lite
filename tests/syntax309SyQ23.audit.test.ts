import {afterAll,beforeAll,describe,expect,it,vi} from "vitest";
import source from "../qa/certification/syntax309_cases.jsonl?raw";
import {parseExpression} from "../src/engine/parsing";
import {solveInequality} from "../src/engine/inequality";
const scope={postMessage:vi.fn(),onmessage:undefined as any};
beforeAll(async()=>{vi.stubGlobal("self",scope);await import("../src/workers/compute.worker");});
afterAll(()=>vi.unstubAllGlobals());
describe("SY-Q-23 Unicode comparison before equation splitting",()=>{
 it("interprets the official Unicode operator, solves it and preserves closure through the handler",()=>{
  const row=source.trim().split("\n").map(s=>JSON.parse(s)).find(r=>r.id==="SY-Q-23");
  expect(row.entrada).toBe("x≥1");
  expect(row.esperado).toBe("x\\in[1,\\infty)");
  expect(row.operacion).toBe("resolver");
  expect(row.nota).toContain("Unicode");
  const p=parseExpression(row.entrada);
  expect(p.isInequality).toBe(true);
  expect(p.isEquation).toBe(false);
  expect(p.inequalityOperator).toBe(">=");
  expect(p.freeVariables).toEqual(["x"]);
  const answer=solveInequality(p.algebrite,p.inequalityOperator!,"x");
  expect(answer.resultText).toBe("x >= 1");
  const requestId="syq23";
  scope.postMessage.mockClear();
  scope.onmessage!({data:{type:"solveInequality",diffAlgebrite:p.algebrite,operator:p.inequalityOperator,variable:"x",requestId}});
  const reply=scope.postMessage.mock.calls.at(-1)![0];
  expect(reply.success,JSON.stringify(reply)).toBe(true);
  expect(reply.resultLatex).toBe("\\text{x >= 1}");
  expect(reply.requestId).toBe(requestId);
 });
 it.each([["x>1","x > 1"],["1≤x","x >= 1"],["3x≥3","x >= 1"],["-x≤-1","x >= 1"],["x≥2","x >= 2"]])("solves direction and boundary: %s",(input,expected)=>{
  const p=parseExpression(input);
  expect(p.isInequality).toBe(true);
  expect(solveInequality(p.algebrite,p.inequalityOperator!,"x").resultText).toBe(expected);
 });
});
