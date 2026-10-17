import { afterAll, beforeAll, expect, it, vi } from "vitest";
import fixture from "../qa/certification/syntax309_cases.jsonl?raw";
import { parseExpression } from "../src/engine/parsing";
const row = fixture.trim().split("\n").map(line => JSON.parse(line)).find(row => row.id === "SY-X-08");
const scope = { postMessage: vi.fn(), onmessage: undefined as any };
beforeAll(async () => { vi.stubGlobal("self", scope); await import("../src/workers/compute.worker"); });
afterAll(() => vi.unstubAllGlobals());
it("retains the existing principal complex branch and exact output reentry", () => {
  expect(row.entrada).toBe(String.raw`\sqrt{-1}`);
  expect(row.esperado).toBe("en ℝ: error claro; en ℂ: `i`");
  const ids: string[] = [];
  function evaluate(source: string, expected: string) {
    const requestId = `x08-${ids.length}`;
    scope.postMessage.mockClear();
    scope.onmessage!({ data: { type: "evaluate", expressionAlgebrite: parseExpression(source, "RAD").algebrite, requestId } });
    const result = scope.postMessage.mock.calls.at(-1)![0];
    expect(result.success, JSON.stringify(result)).toBe(true);
    expect(result.requestId).toBe(requestId);
    expect(parseExpression(result.resultLatex, "RAD").algebrite.replace(/\s/g, "")).toBe(expected);
    ids.push(result.requestId);
    return result.resultLatex;
  }
  evaluate(evaluate(row.entrada, "i"), "i");
  evaluate(String.raw`\sqrt{-4}`, "2*i");
  evaluate("i^2", "-1");
  evaluate(evaluate("2+3", "5"), "5");
  expect(new Set(ids).size).toBe(6);
});
