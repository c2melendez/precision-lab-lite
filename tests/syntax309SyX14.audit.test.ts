import {afterAll,beforeAll,expect,it,vi} from "vitest";
import fixture from "../qa/certification/syntax309_cases.jsonl?raw";
import {parseExpression} from "../src/engine/parsing";
import {evaluate} from "../src/engine/algebriteClient";
const row=fixture.trim().split("\n").map(line=>JSON.parse(line)).find(row=>row.id==="SY-X-14");
const scope={postMessage:vi.fn(),onmessage:undefined as any};
beforeAll(async()=>{vi.stubGlobal("self",scope);await import("../src/workers/compute.worker");});
afterAll(()=>vi.unstubAllGlobals());
function nested(depth:number,inner="x"){for(let i=0;i<depth;i++)inner=String.raw`\frac{1}{${inner}}`;return inner;}
function calculate(source:string,id:string){
  scope.postMessage.mockClear();
  scope.onmessage!({data:{type:"evaluate",expressionAlgebrite:parseExpression(source).algebrite,requestId:id}});
  const result=scope.postMessage.mock.calls.at(-1)![0];
  expect(result.requestId).toBe(id);return result;
}
it("pins the descriptive fixture and expands exactly50 actual reciprocal layers",()=>{
  expect(row.entrada).toBe(String.raw`\underbrace{\frac{1}{\frac{1}{\cdots\frac{1}{x}}}}_{50\text{ niveles}}`);
  expect(row.esperado).toBe("`x` o `\\frac{1}{x}` según la paridad de los niveles (50 → `x`)");
  expect(nested(50).match(/\\frac/g)).toHaveLength(50);
  expect(nested(50)).toHaveLength(501);
});
it.each([49,50,51])("actual Worker preserves parity and original domain for %i layers",depth=>{
  const source=nested(depth);
  const parsed=parseExpression(source);
  expect(parsed.algebrite.match(/\//g)).toHaveLength(depth);
  const result=calculate(source,`x14-${depth}`);
  expect(result.success,JSON.stringify(result)).toBe(true);
  const expected=depth%2?"1/x":"x";
  expect(evaluate(`simplify((${parseExpression(result.resultLatex).algebrite})-(${expected}))`)).toBe("0");
  expect(result.domainConditions.some((c:any)=>c.operator==="!="&&c.comparisonAlgebrite==="0"&&c.expressionAlgebrite.replace(/[()\s]/g,"")==="x")).toBe(true);
});
it("nested literalzero is rejected before cancellation and Worker recovers",()=>{
  const result=calculate(nested(50,"0"),"x14-zero");
  expect(result.success,JSON.stringify(result)).toBe(false);
  expect(result.errorCode).toBe("DOMAIN_ERROR");
  expect(result.resultLatex).toBeNull();
  const recovery=calculate("2+3","x14-recovery");
  expect(recovery.success).toBe(true);expect(recovery.resultLatex).toBe("5");
  const again=calculate(recovery.resultLatex,"x14-reentry");
  expect(again.success).toBe(true);expect(again.resultLatex).toBe("5");
});
