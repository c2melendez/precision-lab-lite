import {afterAll,beforeAll,expect,it,vi} from "vitest";
import fixture from "../qa/certification/syntax309_cases.jsonl?raw";
import {parseExpression} from "../src/engine/parsing";
const row=fixture.trim().split("\n").map(line=>JSON.parse(line)).find(row=>row.id==="SY-X-17");
const scope={postMessage:vi.fn(),onmessage:undefined as any};
beforeAll(async()=>{vi.stubGlobal("self",scope);await import("../src/workers/compute.worker");});
afterAll(()=>vi.unstubAllGlobals());
it("pins original shell escape command and rejects it as an unrecognized character",()=>{
  expect(row.entrada).toBe(String.raw`\write18{ls}`);
  expect(row.esperado).toBe("ignorado o rechazado; sin ejecución");
  expect(()=>parseExpression(row.entrada)).toThrow(/Carácter no reconocido/i);
});
it("raw actual Worker handler rejects command and recovers with new request IDs",()=>{
  function send(expressionAlgebrite:string,requestId:string){
    scope.postMessage.mockClear();scope.onmessage!({data:{type:"evaluate",expressionAlgebrite,requestId}});
    const result=scope.postMessage.mock.calls.at(-1)![0];expect(result.requestId).toBe(requestId);return result;
  }
  const bad=send(row.entrada,"x17-source");
  expect(bad.success,JSON.stringify(bad)).toBe(false);expect(bad.resultLatex).toBeNull();expect(bad.errorMessage).toBeTruthy();
  const good=send(parseExpression("2+3").algebrite,"x17-recovery");
  expect(good.success).toBe(true);expect(good.resultLatex).toBe("5");
  expect(send(good.resultLatex,"x17-reentry").resultLatex).toBe("5");
});
