import { afterAll, beforeAll, expect, it, vi } from "vitest";
import fixture from "../qa/certification/syntax309_cases.jsonl?raw";
import { parseExpression } from "../src/engine/parsing";
const row = fixture.trim().split("\n").map((line) => JSON.parse(line)).find((entry) => entry.id === "SY-X-05");
const scope = { postMessage: vi.fn(), onmessage: undefined as any };
beforeAll(async () => { vi.stubGlobal("self", scope); await import("../src/workers/compute.worker"); });
afterAll(() => vi.unstubAllGlobals());

function calculate(source: string, requestId: string): string {
  const parsed = parseExpression(source);
  expect(parsed.isEquation).toBe(false);
  expect(parsed.freeVariables).toEqual([]);
  scope.postMessage.mockClear();
  scope.onmessage!({ data: { type: "evaluate", expressionAlgebrite: parsed.algebrite, requestId } });
  const body = scope.postMessage.mock.calls.at(-1)![0];
  expect(body.success, JSON.stringify(body)).toBe(true);
  expect(body.requestId).toBe(requestId);
  return body.resultLatex;
}

it("pins the descriptive fixture and expands30 actual grouping levels", () => {
  expect(row.entrada).toBe(String.raw`\underbrace{(\cdots((1))\cdots)}_{30\text{ niveles}}`);
  expect(row.esperado).toBe("1");
  expect("(".repeat(30) + "1" + ")".repeat(30)).toHaveLength(61);
});

// Worker handler is real; self/postMessage transport is simulated in this unit test.
it.each([["1", "1"], ["7", "7"], ["2+3", "5"]])("evaluates depth30 source %s, reenters and recovers", (inner, expected) => {
  const source = "(".repeat(30) + inner + ")".repeat(30);
  const first = calculate(source, "syx05-first-" + inner);
  expect(first).toBe(expected);
  expect(calculate(first, "syx05-reentry-" + inner)).toBe(expected);
  expect(calculate("2+3", "syx05-recovery-" + inner)).toBe("5");
});
