import {afterAll,beforeAll,describe,expect,it,vi} from "vitest";
import fixture from "../qa/certification/syntax309_cases.jsonl?raw";
import {parseExpression} from "../src/engine/parsing";
const row=fixture.trim().split("\n").map(s=>JSON.parse(s)).find(r=>r.id==="SY-X-03");
const scope={postMessage:vi.fn(),onmessage:undefined as any};
beforeAll(async()=>{vi.stubGlobal("self",scope);await import("../src/workers/compute.worker");});
afterAll(()=>vi.unstubAllGlobals());
describe("SY-X-03 literal backslashes are syntax errors and recover",()=>{
 it("pins two literal backslashes, not escaped spaces",()=>{
  expect(row.entrada).toBe("\\".repeat(2));
  expect(row.entrada).toHaveLength(2);
  expect(row.operacion).toBe("error");
  expect(row.esperado).toBe("error claro de sintaxis");
 });
 it.each(["\\".repeat(2),"\\","\n"+"\\".repeat(2)+"\t"])("rejects %j as syntax rather than empty input",input=>{
  let failure:any;
  try{parseExpression(input);}catch(error){failure=error;}
  expect(failure?.code).toBe("PARSE_ERROR");
  expect(failure?.message).toMatch(/sintaxis|carácter|comando|interpretar|barra/i);
  expect(failure?.message).not.toBe("Escriba una expresión antes de calcular.");
  const parsed=parseExpression("2+3");
  scope.postMessage.mockClear();
  const requestId="syx03-recovery";
  scope.onmessage!({data:{type:"evaluate",expressionAlgebrite:parsed.algebrite,requestId}});
  const result=scope.postMessage.mock.calls.at(-1)![0];
  expect(result.success,JSON.stringify(result)).toBe(true);
  expect(result.requestId).toBe(requestId);
  expect(result.resultLatex).toBe("5");
 });
});
