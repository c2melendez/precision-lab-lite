import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import fixture from "../qa/certification/syntax309_cases.jsonl?raw";
import { parseExpression } from "../src/engine/parsing";
const rows = fixture.trim().split("\n").map(s => JSON.parse(s));
const scope = { postMessage: vi.fn(), onmessage: undefined as any };
beforeAll(async () => { vi.stubGlobal("self", scope); await import("../src/workers/compute.worker"); });
afterAll(() => vi.unstubAllGlobals());
function reply(latex: string, requestId: string) {
 scope.postMessage.mockClear();
 scope.onmessage!({ data: { type: "evaluate", expressionAlgebrite: parseExpression(latex, "RAD").algebrite, requestId } });
 const result = scope.postMessage.mock.calls.at(-1)![0];
 expect(result.success, JSON.stringify(result)).toBe(true);
 expect(result.requestId).toBe(requestId);
 return result;
}

function parts(latex: string) {
 const s = parseExpression(latex, "RAD").algebrite.replace(/\s/g, "");
 const terms = s.match(/[+-]?[^+-]+/g) ?? [];
 let re = 0, im = 0;
 for (const term of terms) {
  if (/^[+-]?\d+(?:\.\d+)?$/.test(term)) re += Number(term);
  else {
   const m = term.match(/^([+-]?)(\d+(?:\.\d+)?)?\*?i$/);
   expect(m, s).not.toBeNull();
   im += (m![1] === "-" ? -1 : 1) * Number(m![2] ?? 1);
  }
 }
 expect(terms.length).toBeGreaterThan(0);
 return { re, im };
}
describe("Syntax309 SY-R-08 complex binomial and result reentry", () => {
 it.each([
  ["1+2i", 1, 2],
  ["3-4i", 3, -4],
  ["-2+3i", -2, 3],
  ["(1+2i)^2", -3, 4],
 ])("preserves real and imaginary components of %s", (source, re, im) => {
  if (source === "1+2i") {
   const row = rows.find(row => row.id === "SY-R-08");
   expect(row.entrada).toBe(source);
   expect(row.esperado).toBe("1+2i");
  }
  const result = reply(source, "syr08-first");
  console.log("SY-R-08", {source, result});
  expect(parts(result.resultLatex)).toEqual({re, im});
  const again = reply(result.resultLatex, "syr08-reentry");
  expect(parts(again.resultLatex)).toEqual({re, im});
 });
});
