import {afterAll,beforeAll,describe,expect,it,vi} from "vitest";
import source from "../qa/certification/syntax309_cases.jsonl?raw";
import {parseExpression} from "../src/engine/parsing";
const scope={postMessage:vi.fn(),onmessage:undefined as any};
beforeAll(async()=>{vi.stubGlobal("self",scope);await import("../src/workers/compute.worker");});
afterAll(()=>vi.unstubAllGlobals());
const row=source.trim().split("\n").map(s=>JSON.parse(s)).find(r=>r.id==="SY-S-09");
describe("SY-S-09 tgh numeric oracle",()=>{
 it("evaluates the official hyperbolic sine alias through the real Worker",()=>{
  expect(row.entrada).toBe(String.raw`\operatorname{tgh}1`);
  expect(row.esperado).toBe("0.7615941560");
  scope.postMessage.mockClear();
  scope.onmessage!({data:{type:"evaluate",expressionAlgebrite:parseExpression(row.entrada,"RAD").algebrite,requestId:"sys09"}});
  const reply=scope.postMessage.mock.calls.at(-1)![0];
  expect(reply.success,JSON.stringify(reply)).toBe(true);
  expect(reply.requestId).toBe("sys09");
  const value=Number(reply.fraction?.decimal ?? reply.decimalApprox ?? reply.result);
  expect(Number.isFinite(value),JSON.stringify(reply)).toBe(true);
  expect(Math.abs(value-Number(row.esperado))).toBeLessThan(5e-10);
 });
});
