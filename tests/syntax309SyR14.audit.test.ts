import {afterAll,beforeAll,describe,expect,it,vi} from "vitest";
import fixture from "../qa/certification/syntax309_cases.jsonl?raw";
import {parseExpression} from "../src/engine/parsing";
import {evaluate} from "../src/engine/algebriteClient";
const row=fixture.trim().split("\n").map(s=>JSON.parse(s)).find(r=>r.id==="SY-R-14");
const scope={postMessage:vi.fn(),onmessage:undefined as any};
beforeAll(async()=>{vi.stubGlobal("self",scope);await import("../src/workers/compute.worker");});
afterAll(()=>vi.unstubAllGlobals());
function calculate(source:string,requestId:string){
 const parsed=parseExpression(source);
 expect(parsed.isEquation).toBe(false);
 expect(parsed.freeVariables).toEqual([]);
 scope.postMessage.mockClear();
 scope.onmessage!({data:{type:"evaluate",expressionAlgebrite:parsed.algebrite,requestId}});
 const result=scope.postMessage.mock.calls.at(-1)![0];
 expect(result.success,JSON.stringify(result)).toBe(true);
 expect(result.requestId).toBe(requestId);
 return result;
}
describe("SY-R-14 exact absolute value with ephemeral substitution",()=>{
 it("pins the official fixture",()=>{
  expect(row.entrada).toBe(String.raw`\left\lvert x\right\rvert\ \text{con}\ x=-4`);
  expect(row.esperado).toBe("4");
  expect(row.operacion).toBe("valor");
 });
 it.each([
  [String.raw`\left\lvert x\right\rvert\ \text{con}\ x=-4`,"4"],
  [String.raw`\left\lvert x\right\rvert\ \text{con}\ x=4`,"4"],
  [String.raw`\left\lvert y\right\rvert\ \text{con}\ y=-7`,"7"],
  [String.raw`\left\lvert x\right\rvert\ \text{con}\ x=0`,"0"],
  [String.raw`\left\lvert x\right\rvert\ \text{con}\ x=-\frac{3}{2}`,"3/2"],
  [String.raw`\left\lvert x\right\rvert+x\ \text{con}\ x=-4`,"0"],
  [String.raw`\left\lvert x\right\rvert+x\ \text{con}\ x=4`,"8"],
 ])("evaluates and reenters %s exactly",(source,expected)=>{
  const first=calculate(source,"syr14-source");
  const second=calculate(first.resultLatex,"syr14-reentry");
  for(const result of [first,second]){
   const actual=parseExpression(result.resultLatex).algebrite;
   expect(evaluate("simplify(("+actual+")-("+expected+"))").trim()).toBe("0");
   expect(actual).not.toMatch(/\d\.\d/);
  }
  expect(parseExpression("x").freeVariables).toEqual(["x"]);
 });
});
