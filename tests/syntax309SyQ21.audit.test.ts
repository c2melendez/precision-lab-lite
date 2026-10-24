import {afterAll,beforeAll,describe,expect,it,vi} from "vitest";
import source from "../qa/certification/syntax309_cases.jsonl?raw";
import {parseExpression} from "../src/engine/parsing";
import {solveInequality} from "../src/engine/inequality";
const scope={postMessage:vi.fn(),onmessage:undefined as any};
beforeAll(async()=>{vi.stubGlobal("self",scope);await import("../src/workers/compute.worker");});
afterAll(()=>vi.unstubAllGlobals());
describe("SY-Q-21 source leq and closed finite endpoint",()=>{
 it("interprets the official macro, solves it and preserves closure through the handler",()=>{
  const row=source.trim().split("\n").map(s=>JSON.parse(s)).find(r=>r.id==="SY-Q-21");
  expect(row.entrada).toBe("x\\leq2");
  expect(row.esperado).toBe("x\\in(-\\infty,2]");
  expect(row.operacion).toBe("resolver");
  const p=parseExpression(row.entrada);
  expect(p.isInequality).toBe(true);
  expect(p.isEquation).toBe(false);
  expect(p.inequalityOperator).toBe("<=");
  expect(p.freeVariables).toEqual(["x"]);
  const answer=solveInequality(p.algebrite,p.inequalityOperator!,"x");
  expect(answer.resultText).toBe("x <= 2");
  // Exact interpretation of this relational representation: an unbounded
  // lower end is open; <= closes the finite upper endpoint, not infinity.
  const relation=/^x\s*(<=)\s*(-?\d+)$/.exec(answer.resultText)!;
  expect(relation).not.toBeNull();
  const represented={lower:-Infinity,lowerClosed:false,upper:Number(relation[2]),upperClosed:relation[1]==="<="};
  expect(represented).toEqual({lower:-Infinity,lowerClosed:false,upper:2,upperClosed:true});
  const belongs=(x:number)=>x<=represented.upper;
  expect([-1000000,1,2,3].map(belongs)).toEqual([true,true,true,false]);
  scope.postMessage.mockClear();
  scope.onmessage!({data:{type:"solveInequality",diffAlgebrite:p.algebrite,
   operator:p.inequalityOperator,variable:"x",requestId:"syq21"}});
  const reply=scope.postMessage.mock.calls.at(-1)![0];
  expect(reply.success,JSON.stringify(reply)).toBe(true);
  expect(reply.resultLatex).toBe("\\text{x <= 2}");
  expect(reply.requestId).toBe("syq21");
 });
 it.each([
  ["x<2","x < 2"],
  ["2\\geq x","x <= 2"],
  ["3x\\leq6","x <= 2"],
  ["-x\\geq-2","x <= 2"],
  ["x\\leq3","x <= 3"],
 ])("distinguishes strictness, direction and coefficient: %s",(input,expected)=>{
  const p=parseExpression(input);
  expect(p.isInequality).toBe(true);
  expect(solveInequality(p.algebrite,p.inequalityOperator!,"x").resultText).toBe(expected);
 });
});
