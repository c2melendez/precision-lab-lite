import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import fixture from "../qa/certification/syntax309_cases.jsonl?raw";
import { parseExpression } from "../src/engine/parsing";
import { evaluate } from "../src/engine/algebriteClient";
const rows = fixture.trim().split("\n").map(s => JSON.parse(s));
const scope = { postMessage: vi.fn(), onmessage: undefined as any };
beforeAll(async () => { vi.stubGlobal("self", scope); await import("../src/workers/compute.worker"); });
afterAll(() => vi.unstubAllGlobals());


function send(source: string, requestId: string) {
 scope.postMessage.mockClear();
 scope.onmessage!({data:{type:"evaluate", expressionAlgebrite:parseExpression(source).algebrite, requestId}});
 const result = scope.postMessage.mock.calls.at(-1)![0];
 expect(result.requestId).toBe(requestId);
 return result;
}
function check(result: any, expected: string, variable: string, pole: number) {
 expect(result.success, JSON.stringify(result)).toBe(true);
 const actual = parseExpression(result.resultLatex).algebrite;
 expect(evaluate("simplify(("+actual+")-("+expected+"))").replace(/\s/g,"")).toBe("0");
 const exclusions = (result.domainConditions ?? []).filter((c: any) =>
  c.kind==="denominator" && c.variable===variable && c.operator==="!=" &&
  evaluate("("+c.comparisonAlgebrite+")").trim()==="0");
 expect(exclusions.length, JSON.stringify(result)).toBeGreaterThan(0);
 expect(exclusions.some((c: any) =>
  evaluate("subst("+pole+","+variable+",("+c.expressionAlgebrite+"))").trim()==="0" &&
  evaluate("subst("+(pole+1)+","+variable+",("+c.expressionAlgebrite+"))").trim()!=="0"
 )).toBe(true);
}
describe("SY-R-10 exact rational equivalence, domain and reentry", () => {
 it.each([
  [String.raw`\left(\frac{x+1}{x-1}\right)^{2}`, "(x+1)^2/(x-1)^2", "x", 1],
  [String.raw`\left(\frac{y+2}{y-2}\right)^{2}`, "(y+2)^2/(y-2)^2", "y", 2],
  [String.raw`\left(\frac{2x+1}{x-1}\right)^{2}`, "(2*x+1)^2/(x-1)^2", "x", 1],
 ])("preserves the rational function and pole of %s", (source, expected, variable, pole) => {
  if(source===String.raw`\left(\frac{x+1}{x-1}\right)^{2}`) {
   const row=rows.find(row=>row.id==="SY-R-10");
   expect(row.entrada).toBe(source);
   expect(row.esperado).toBe(String.raw`\frac{(x+1)^{2}}{(x-1)^{2}}`);
  }
  const result=send(source,"syr10-first");
  console.log("SY-R-10",{source,result});
  check(result,expected,variable,pole);
  const restored=send(result.resultLatex,"syr10-reentry");
  check(restored,expected,variable,pole);
  const invalid=send(result.resultLatex+" con "+variable+"="+pole,"syr10-pole");
  expect(invalid.success,JSON.stringify(invalid)).toBe(false);
  expect(invalid.errorCode).toBe("DOMAIN_ERROR");
 });
});
