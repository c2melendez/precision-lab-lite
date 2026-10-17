import { afterAll, beforeAll, expect, it, vi } from "vitest";
import fixture from "../qa/certification/syntax309_cases.jsonl?raw";
import { parseExpression } from "../src/engine/parsing";
import { evaluate } from "../src/engine/algebriteClient";
const row = fixture.trim().split("\n").map((line) => JSON.parse(line)).find((entry) => entry.id === "SY-X-07");
const scope = { postMessage: vi.fn(), onmessage: undefined as any };
beforeAll(async () => { vi.stubGlobal("self", scope); await import("../src/workers/compute.worker"); });
afterAll(() => vi.unstubAllGlobals());
it("pins the infinity-minus-infinity fixture and rejects explicitly before losing provenance", () => {
  expect(row.entrada).toBe(String.raw`\infty-\infty`);
  expect(row.esperado).toBe("indeterminado: error claro");
  expect(() => parseExpression(row.entrada)).toThrow(/indeterminad/i);
  expect(parseExpression("2+3").algebrite).toBe("2+3");
});

it.each(["oo-oo", "∞-∞", "(oo)-(oo)", "(-oo)-(-oo)"])("rejects literal witness %s at parser and CAS boundaries", (source) => {
  expect(() => parseExpression(source)).toThrow(/indeterminad/i);
  expect(() => evaluate(source)).toThrow(/indeterminad/i);
});

it.each([["3-3", "0"], ["3-2", "1"]])("retains ordinary finite subtraction %s", (source, expected) => {
  expect(evaluate(parseExpression(source).algebrite)).toBe(expected);
});

it("rejects raw Worker infinity subtraction and permits real handler recovery/reentry", () => {
  function send(expressionAlgebrite: string, requestId: string) {
    scope.postMessage.mockClear();
    scope.onmessage!({ data: { type: "evaluate", expressionAlgebrite, requestId } });
    const result = scope.postMessage.mock.calls.at(-1)![0];
    expect(result.requestId).toBe(requestId);
    return result;
  }
  const rejected = send("oo-oo", "syx07-rejected");
  expect(rejected.success).toBe(false);
  expect(rejected.errorCode).toBe("DOMAIN_ERROR");
  expect(rejected.errorMessage).toMatch(/indeterminad/i);
  const recovered = send("2+3", "syx07-recovered");
  expect(recovered.success).toBe(true);
  expect(recovered.resultLatex).toBe("5");
  expect(send(recovered.resultLatex, "syx07-reentry").resultLatex).toBe("5");
});
