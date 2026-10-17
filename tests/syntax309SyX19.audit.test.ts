import {afterAll,beforeAll,expect,it,vi} from "vitest";
import fixture from "../qa/certification/syntax309_cases.jsonl?raw";
import {parseExpression} from "../src/engine/parsing";
const row=fixture.trim().split("\n").map(line=>JSON.parse(line)).find(row=>row.id==="SY-X-19");
const scope={postMessage:vi.fn(),onmessage:undefined as any};
beforeAll(async()=>{vi.stubGlobal("self",scope);await import("../src/workers/compute.worker");});
afterAll(()=>vi.unstubAllGlobals());
it("pins original file-read expression and rejects it",()=>{
  expect(row.entrada).toBe(String.raw`open('/etc/passwd').read()`);
  expect(row.esperado).toBe("error de sintaxis sin ejecutar nada");
  expect(()=>parseExpression(row.entrada)).toThrow();
});
it("raw actual Worker handler rejects command and recovers with new request IDs",()=>{
  function send(expressionAlgebrite:string,requestId:string){
    scope.postMessage.mockClear();scope.onmessage!({data:{type:"evaluate",expressionAlgebrite,requestId}});
    const result=scope.postMessage.mock.calls.at(-1)![0];expect(result.requestId).toBe(requestId);return result;
  }
  const bad=send(row.entrada,"x19-source");
  expect(bad.success,JSON.stringify(bad)).toBe(false);expect(bad.resultLatex).toBeNull();expect(bad.errorMessage).toBeTruthy();
  const good=send(parseExpression("2+3").algebrite,"x19-recovery");
  expect(good.success).toBe(true);expect(good.resultLatex).toBe("5");
  expect(send(good.resultLatex,"x19-reentry").resultLatex).toBe("5");
});
