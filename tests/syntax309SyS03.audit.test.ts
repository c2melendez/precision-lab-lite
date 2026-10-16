import {afterAll,beforeAll,describe,expect,it,vi} from "vitest";
import source from "../qa/certification/syntax309_cases.jsonl?raw";
import {parseExpression} from "../src/engine/parsing";
import {evaluate} from "../src/engine/algebriteClient";
const scope={postMessage:vi.fn(),onmessage:undefined as any};
beforeAll(async()=>{vi.stubGlobal("self",scope);await import("../src/workers/compute.worker");});
afterAll(()=>vi.unstubAllGlobals());
const row=source.trim().split("\n").map(s=>JSON.parse(s)).find(r=>r.id==="SY-S-03");
describe("SY-S-03 Spanish tangent alias",()=>{
 it("binds the whole official argument and evaluates exactly",()=>{
  expect(row.entrada).toBe(String.raw`\operatorname{ctg}\frac{\pi}{4}`);
  expect(row.esperado).toBe("1");
  const parsed=parseExpression(row.entrada,"RAD");
  // This parser reports the known constant pi among identifiers.
  expect(parsed.freeVariables.filter(name=>name!=="pi")).toEqual([]);
  expect(evaluate(parsed.algebrite)).toBe("1");
 });
 it.each([row.entrada,String.raw`\operatorname{ctg}\left(\frac{\pi}{4}\right)`])("returns exact fractions through the real worker and reentry: %s",latex=>{
  scope.postMessage.mockClear();
  scope.onmessage!({data:{type:"evaluate",expressionAlgebrite:parseExpression(latex,"RAD").algebrite,requestId:"sys03"}});
  const reply=scope.postMessage.mock.calls.at(-1)![0];
  expect(reply.success,JSON.stringify(reply)).toBe(true);
  expect(reply.requestId).toBe("sys03");
  expect(evaluate(parseExpression(reply.fraction.improperLatex,"RAD").algebrite)).toBe("1");
  expect(reply.fraction.decimal).toBe("1");
  expect(evaluate(parseExpression(reply.resultLatex,"RAD").algebrite)).toBe("1");
 });
});
