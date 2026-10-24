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
function assertOfficial(value: number, expected: string) {
 expect(Number.isFinite(value)).toBe(true);
 expect(Math.abs(value - Number(expected))).toBeLessThanOrEqual(1e-9 * Math.abs(Number(expected)));
}
describe("Syntax309 SY-R-06 natural logarithm numeric display and result reentry", () => {
 it.each(["SY-R-06"])("%s preserves numeric value through real Worker response and reentry", id => {
  const row = rows.find(row => row.id === id);
  expect(row.entrada).toBe(String.raw`\ln\left(2\right)`);
  expect(row.esperado).toBe("0.6931471806");
  const result = reply(row.entrada, id);
  const shown = result.decimalApprox ?? result.fraction?.decimal;
  console.log(id, { input: row.entrada, result });
  expect(typeof shown).toBe("string");
  assertOfficial(Number(shown.replace(/(?:…|\.\.\.)$/, "")), row.esperado);
  const again = reply(result.resultLatex, id + "-reentry");
  const againShown = again.decimalApprox ?? again.fraction?.decimal;
  assertOfficial(Number(againShown.replace(/(?:…|\.\.\.)$/, "")), row.esperado);
 });
});

describe("SY-R-06 natural and decimal logarithms remain distinct", () => {
 it.each([
  [String.raw`\ln\left(3\right)`, Math.log(3)],
  [String.raw`\log\left(2\right)`, Math.log10(2)],
 ])("evaluates and reenters %s", (source, expected) => {
  const result = reply(source, "syr06-control");
  const shown = result.decimalApprox ?? result.fraction?.decimal;
  assertOfficial(Number(shown.replace(/(?:…|\.\.\.)$/, "")), String(expected));
  const again = reply(result.resultLatex, "syr06-control-reentry");
  assertOfficial(Number((again.decimalApprox ?? again.fraction?.decimal).replace(/(?:…|\.\.\.)$/, "")), String(expected));
 });
});
