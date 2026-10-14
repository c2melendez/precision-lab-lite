import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import fixture from "../qa/certification/syntax309_cases.jsonl?raw";
import { parseExpression } from "../src/engine/parsing";
import { evaluate } from "../src/engine/algebriteClient";
import { compileNumeric } from "../src/engine/numericFallback";

const rows = Object.fromEntries(fixture.trim().split("\n").map(line => {
  const row = JSON.parse(line); return [row.id, row];
}));
const workerScope = {
  postMessage: vi.fn(),
  onmessage: undefined as undefined | ((event: { data: {
    type: "evaluate"; requestId: string; expressionAlgebrite: string;
  } }) => void),
};
beforeAll(async () => {
  vi.stubGlobal("self", workerScope);
  await import("../src/workers/compute.worker");
});
afterAll(() => vi.unstubAllGlobals());

describe("Syntax309 SY-E-17 principal complex power — original Lite source", () => {
  it("preserves sqrt(2)*i through the scientific worker handler", () => {
    const row = rows["SY-E-17"];
    expect(row.operacion).toBe("convencion");
    expect(row.entrada).toBe("(-2)^{0.5}");
    expect(row.esperado).toContain("ℂ");
    const parsed = parseExpression(row.entrada).algebrite;
    const raw = evaluate(parsed);
    expect(evaluate("(" + raw + ")-(2^(1/2)*i)"), "raw=" + raw).toBe("0");
    // A finite real raw/i establishes real part zero; its positive
    // fixed coefficient distinguishes the principal complex branch.
    const imaginaryCoefficient = evaluate("(" + raw + ")/i");
    const im = compileNumeric(imaginaryCoefficient, "__unused__")(0);
    expect(Number.isFinite(im)).toBe(true);
    expect(im).toBeGreaterThan(0);
    expect(im).toBeCloseTo(1.4142135623730951, 12);
    expect(Number(evaluate("(" + raw + ")^2"))).toBe(-2);

    workerScope.postMessage.mockClear();
    expect(workerScope.onmessage).toBeTypeOf("function");
    workerScope.onmessage!({ data: {
      type: "evaluate", requestId: "SY-E-17", expressionAlgebrite: parsed,
    } });
    expect(workerScope.postMessage).toHaveBeenCalledTimes(1);
    const result = workerScope.postMessage.mock.calls[0][0];
    expect(result.success, JSON.stringify(result)).toBe(true);
    expect(result.requestId).toBe("SY-E-17");
    expect(result.resultLatex).toBeTypeOf("string");
    expect(result.resultLatex).toMatch(/i/);
    expect(JSON.stringify(result)).not.toMatch(/NaN|Infinity/);
    const returned = parseExpression(result.resultLatex).algebrite;
    expect(evaluate("(" + returned + ")-(2^(1/2)*i)")).toBe("0");
    // Real worker handler, not a browser Worker/MathLive E2E.
  });
});
