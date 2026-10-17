import { afterAll, beforeAll, expect, it, vi } from "vitest";
import fixture from "../qa/certification/syntax309_cases.jsonl?raw";
import { parseExpression } from "../src/engine/parsing";
const row = fixture.trim().split("\n").map((line) => JSON.parse(line)).find((entry) => entry.id === "SY-X-06");
const source = "1+".repeat(4999) + "11"; // 10000 actual math characters, exact sum5010.
const scope = { postMessage: vi.fn(), onmessage: undefined as any };
beforeAll(async () => { vi.stubGlobal("self", scope); await import("../src/workers/compute.worker"); });
afterAll(() => vi.unstubAllGlobals());

it("pins the length oracle and deterministic10000-character expansion", () => {
  expect(row.entrada).toBe(String.raw`\text{(entrada de 10 000 caracteres)}`);
  expect(row.esperado).toBe("procesada sin bloquear, o rechazada con aviso de longitud");
  expect(source).toHaveLength(10000);
  expect(source.split("+")).toHaveLength(5000);
});

// Real parser/Worker handler; self/postMessage transport is simulated here.
it("processes the full10000-character source, reenters its result and recovers", () => {
  function calculate(expression: string, requestId: string) {
    const parsed = parseExpression(expression);
    scope.postMessage.mockClear();
    scope.onmessage!({ data: { type: "evaluate", expressionAlgebrite: parsed.algebrite, requestId } });
    const body = scope.postMessage.mock.calls.at(-1)![0];
    expect(body.success, JSON.stringify(body)).toBe(true);
    expect(body.requestId).toBe(requestId);
    return body.resultLatex as string;
  }
  const result = calculate(source, "syx06-full");
  expect(result).toBe("5010");
  expect(calculate(result, "syx06-reentry")).toBe("5010");
  expect(calculate("2+3", "syx06-recovery")).toBe("5");
}, 15000);
