import {afterAll,beforeAll,describe,expect,it,vi} from "vitest";
import fixture from "../qa/certification/syntax309_cases.jsonl?raw";
import {parseExpression} from "../src/engine/parsing";
const row=fixture.trim().split("\n").map(s=>JSON.parse(s)).find(r=>r.id==="SY-X-01");
const scope={postMessage:vi.fn(),onmessage:undefined as any};
beforeAll(async()=>{vi.stubGlobal("self",scope);await import("../src/workers/compute.worker");});
afterAll(()=>vi.unstubAllGlobals());
describe("SY-X-01 truly empty input is rejected and the engine recovers",()=>{
 it("pins the descriptive fixture without evaluating its marker",()=>{
  expect(row.entrada).toBe("*(vacía)*");
  expect(row.operacion).toBe("error");
  expect(row.esperado).toBe('sin cambios o aviso "entrada vacía"; sin error interno');
 });
 it("rejects empty input clearly before and after successful calculations",()=>{
  for(let pass=0;pass<2;pass++){
   let failure:unknown;
   try{parseExpression("");}catch(error){failure=error;}
   expect(failure).toMatchObject({code:"PARSE_ERROR",message:"Escriba una expresión antes de calcular."});
   const parsed=parseExpression("2+3");
   scope.postMessage.mockClear();
   const requestId="syx01-recovery-"+pass;
   scope.onmessage!({data:{type:"evaluate",expressionAlgebrite:parsed.algebrite,requestId}});
   const result=scope.postMessage.mock.calls.at(-1)![0];
   expect(result.success,JSON.stringify(result)).toBe(true);
   expect(result.requestId).toBe(requestId);
   expect(result.resultLatex).toBe("5");
  }
 });
});
