import {afterAll,beforeAll,describe,expect,it,vi} from "vitest";
import source from "../qa/certification/syntax309_cases.jsonl?raw";
import {parseExpression} from "../src/engine/parsing";
import {evaluate} from "../src/engine/algebriteClient";
const scope={postMessage:vi.fn(),onmessage:undefined as any};
beforeAll(async()=>{vi.stubGlobal("self",scope);await import("../src/workers/compute.worker");});
afterAll(()=>vi.unstubAllGlobals());
const row=source.trim().split("\n").map(s=>JSON.parse(s)).find(r=>r.id==="SY-S-20");
describe("SY-S-20 Spanish sine alias",()=>{
 it.each(["RAD","GRAD"] as const)("binds the explicit degree argument exactly in %s",mode=>{
  expect(row.entrada).toBe("sen(30°)");
  expect(row.esperado).toBe(String.raw`\frac{1}{2}`);
  const parsed=parseExpression(row.entrada,mode);
  // This parser reports the known constant pi among identifiers.
  expect(parsed.freeVariables.filter(name=>name!=="pi")).toEqual([]);
  expect(evaluate(parsed.algebrite)).toBe("1/2");
 });
 it.each(["RAD","GRAD"] as const)("returns exact fractions through the real worker and reentry in %s",mode=>{
  const latex = row.entrada;
  scope.postMessage.mockClear();
  scope.onmessage!({data:{type:"evaluate",expressionAlgebrite:parseExpression(latex,mode).algebrite,requestId:"sys20"}});
  const reply=scope.postMessage.mock.calls.at(-1)![0];
  expect(reply.success,JSON.stringify(reply)).toBe(true);
  expect(reply.requestId).toBe("sys20");
  expect(reply.fraction.improperLatex).toBe(row.esperado);
  expect(reply.fraction.decimal).toBe("0.5");
  expect(evaluate(parseExpression(reply.resultLatex,"RAD").algebrite)).toBe("1/2");
 });
});
