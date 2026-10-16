import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import fixture from "../qa/certification/syntax309_cases.jsonl?raw";
import { parseExpression } from "../src/engine/parsing";
import { compileNumeric } from "../src/engine/numericFallback";
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
describe("Syntax309 SY-R-04 numeric display and exact reentry", () => {
 it.each(["SY-R-04"])("%s preserves numeric value through real Worker response and reentry", id => {
  const row = rows.find(row => row.id === id);
  const result = reply(row.entrada, id);
  const shown = result.decimalApprox ?? result.fraction?.decimal;
  console.log(id, { input: row.entrada, result });
  expect(typeof shown).toBe("string");
  assertOfficial(Number(shown.replace(/(?:…|\.\.\.)$/, "")), row.esperado);
  const reentered = parseExpression(result.resultLatex, "RAD").algebrite;
  assertOfficial(compileNumeric(reentered, "__unused__")(0), row.esperado);
  const again = reply(result.resultLatex, id + "-reentry");
  const againShown = again.decimalApprox ?? again.fraction?.decimal;
  assertOfficial(Number(againShown.replace(/(?:…|\.\.\.)$/, "")), row.esperado);
 });
});

describe("SY-R-04 inline substitution is mathematical, not an equation", () => {
 it.each([
  ["e^{-x^{2}} con x=2", Math.exp(-4)],
  ["e^{-y^{2}} con y=-1", Math.exp(-1)],
  ["2^{-x^{2}} con x=1", 0.5],
 ])("evaluates a changed source %s", (source, expected) => {
  const parsed = parseExpression(source, "RAD");
  expect(parsed.isEquation).toBe(false);
  expect(parsed.freeVariables.filter(name => name !== "e" && name !== "pi")).toEqual([]);
  const result = reply(source, "syr04-variant");
  const value = Number((result.decimalApprox ?? result.fraction?.decimal ?? "").replace(/(?:…|\.\.\.)$/, ""));
  expect(Math.abs(value - expected)).toBeLessThanOrEqual(1e-9 * Math.abs(expected));
 });
 it.each(["x+1 con x=y", "x+1 con x=1/0", "x+1 con x=1 con y=2"])("rejects invalid or multiple bindings %s", source => {
  expect(() => parseExpression(source, "RAD")).toThrow();
 });
});
