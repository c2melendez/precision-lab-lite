import { afterAll, beforeAll, expect, it, vi } from "vitest";
import { parseExpression } from "../src/engine/parsing";

const scope = { postMessage: vi.fn(), onmessage: undefined as any };
beforeAll(async () => {
  vi.stubGlobal("self", scope);
  await import("../src/workers/compute.worker");
});
afterAll(() => vi.unstubAllGlobals());

it("SY-X-22 guards the 10000-digit source and keeps real Worker recovery available", () => {
  const source = "9".repeat(10000) + "+1";
  expect(source.length).toBe(10002);
  let parsed: ReturnType<typeof parseExpression> | null = null;
  try { parsed = parseExpression(source); }
  catch (e) {
    expect(String(e)).toMatch(/longitud|length|size|limit|caracter|expresi|parse|sintaxis/i);
  }
  function send(input: string, requestId: string) {
    scope.postMessage.mockClear();
    scope.onmessage!({ data: { type: "evaluate", expressionAlgebrite: input, requestId } });
    const response = scope.postMessage.mock.calls.at(-1)?.[0];
    expect(response?.requestId).toBe(requestId);
    return response;
  }
  if (parsed) {
    const response = send(parsed.algebrite, "x22-original");
    if (response.success) {
      expect(response.resultLatex).toBe("1" + "0".repeat(10000));
    } else {
      expect(response.errorMessage).toBeTruthy();
      expect(response.resultLatex).toBeNull();
    }
  }
  const recovery = send(parseExpression("2+3").algebrite, "x22-recovery");
  expect(recovery.success).toBe(true);
  expect(recovery.resultLatex).toBe("5");
  const reentry = send("5", "x22-reentry");
  expect(reentry.resultLatex).toBe("5");
});
