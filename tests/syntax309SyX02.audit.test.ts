import {afterAll,beforeAll,describe,expect,it,vi} from "vitest";
import fixture from "../qa/certification/syntax309_cases.jsonl?raw";
import {parseExpression} from "../src/engine/parsing";
const row=fixture.trim().split("\n").map(s=>JSON.parse(s)).find(r=>r.id==="SY-X-02");
const scope={postMessage:vi.fn(),onmessage:undefined as any};
beforeAll(async()=>{vi.stubGlobal("self",scope);await import("../src/workers/compute.worker");});
afterAll(()=>vi.unstubAllGlobals());
describe("SY-X-02 spacing-only source is empty and recovers",()=>{
 it("pins the escaped spaces fixture",()=>{
  expect(row.entrada).toBe("\\ ".repeat(4));
  expect(row.operacion).toBe("error");
  expect(row.esperado).toBe("igual que la entrada vacía");
 });
 it.each(["\\ ".repeat(4)," \t\n",String.raw`\ `])("rejects spacing-only %j and recovers",input=>{
  let failure:unknown;
  try{parseExpression(input);}catch(error){failure=error;}
  expect(failure).toMatchObject({code:"PARSE_ERROR",message:"Escriba una expresión antes de calcular."});
  const parsed=parseExpression(String.raw`2\ +\ 3`);
  scope.postMessage.mockClear();
  const requestId="syx02-recovery";
  scope.onmessage!({data:{type:"evaluate",expressionAlgebrite:parsed.algebrite,requestId}});
  const result=scope.postMessage.mock.calls.at(-1)![0];
  expect(result.success,JSON.stringify(result)).toBe(true);
  expect(result.requestId).toBe(requestId);
  expect(result.resultLatex).toBe("5");
 });
});
