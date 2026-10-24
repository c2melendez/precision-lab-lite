import {afterAll,beforeAll,describe,expect,it,vi} from "vitest";
import fixture from "../qa/certification/syntax309_cases.jsonl?raw";
import {parseExpression} from "../src/engine/parsing";
import {evaluate} from "../src/engine/algebriteClient";
const row=fixture.trim().split("\n").map(s=>JSON.parse(s)).find(r=>r.id==="SY-X-04");
const scope={postMessage:vi.fn(),onmessage:undefined as any};
beforeAll(async()=>{vi.stubGlobal("self",scope);await import("../src/workers/compute.worker");});
afterAll(()=>vi.unstubAllGlobals());
function calculate(source:string,requestId:string){
 const parsed=parseExpression(source);
 expect(parsed.isEquation).toBe(false);
 expect(parsed.freeVariables).toEqual(["x"]);
 scope.postMessage.mockClear();
 scope.onmessage!({data:{type:"evaluate",expressionAlgebrite:parsed.algebrite,requestId}});
 const result=scope.postMessage.mock.calls.at(-1)![0];
 expect(result.success,JSON.stringify(result)).toBe(true);
 expect(result.requestId).toBe(requestId);
 return result.resultLatex as string;
}
describe("SY-X-04 expanded sum, exact output and reentry",()=>{
 it("preserves the official descriptive fixture and expands 500 real terms",()=>{
  expect(row.entrada).toBe(String.raw`x+x+x+\cdots+x\ \text{(500 términos)}`);
  expect(row.operacion).toBe("equivalente");
  expect(row.esperado).toBe("500x");
  const source=Array(500).fill("x").join("+");
  expect(source).toHaveLength(999);
  expect(source.split("+")).toHaveLength(500);
  for(const output of [calculate(source,"syx04-expanded"),calculate(calculate(source,"syx04-first"),"syx04-reentry")]){
   const actual=parseExpression(output).algebrite;
   expect(evaluate(`simplify((${actual})-500*x)`).trim()).toBe("0");
   expect(actual).not.toMatch(/\d\.\d/);
  }
 });
 it.each([499,501])("distinguishes %i terms rather than hardcoding 500x",count=>{
  const output=calculate(Array(count).fill("x").join("+"),"syx04-neighbor-"+count);
  expect(evaluate(`simplify((${parseExpression(output).algebrite})-${count}*x)`).trim()).toBe("0");
 });
});
