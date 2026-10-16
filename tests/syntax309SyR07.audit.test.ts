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
 expect(value).not.toBe(0);
 expect(Math.abs(value - Number(expected))).toBeLessThanOrEqual(1e-9 * Math.abs(Number(expected)));
}
describe("Syntax309 SY-R-07 small scientific number display and result reentry", () => {
 it.each(["SY-R-07"])("%s preserves numeric value through real Worker response and reentry", id => {
  const row = rows.find(row => row.id === id);
  expect(row.entrada).toBe(String.raw`1.5\times10^{-7}`);
  expect(row.esperado).toBe("0.00000015");
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

describe("SY-R-07 scientific notation controls", () => {
 it.each([
  [String.raw`2.5\times10^{-6}`, 0.0000025],
  [String.raw`-1.5\times10^{-7}`, -0.00000015],
 ])("preserves the small value and reentry of %s", (source, expected) => {
  const result = reply(source, "syr07-control");
  const shown = result.decimalApprox ?? result.fraction?.decimal;
  assertOfficial(Number(shown.replace(/(?:…|\.\.\.)$/, "")), String(expected));
  const again = reply(result.resultLatex, "syr07-control-reentry");
  assertOfficial(Number((again.decimalApprox ?? again.fraction?.decimal).replace(/(?:…|\.\.\.)$/, "")), String(expected));
 });
});
