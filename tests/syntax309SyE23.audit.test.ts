import { beforeAll, afterAll, describe, expect, it, vi } from "vitest";
import cases from "../qa/certification/syntax309_cases.jsonl?raw";
import { parseExpression } from "../src/engine/parsing";
import { evaluate } from "../src/engine/algebriteClient";
import { compileNumeric } from "../src/engine/numericFallback";

const rows = Object.fromEntries(cases.trim().split("\n").map(line => {
  const row = JSON.parse(line); return [row.id, row];
}));
const scope = {
  postMessage: vi.fn(),
  onmessage: undefined as undefined | ((event: {data: {
    type: "evaluate"; requestId: string; expressionAlgebrite: string;
  }}) => void),
};
beforeAll(async () => {
  vi.stubGlobal("self", scope);
  await import("../src/workers/compute.worker");
});
afterAll(() => vi.unstubAllGlobals());

describe("Syntax309 SY-E-23 nested numeric fractions: original source", () => {
  it("keeps the outer division and both inner fractions through worker and result reentry", () => {
    const row = rows["SY-E-23"];
    expect(row.operacion).toBe("valor");
    expect(row.entrada).toBe("\\frac{\\frac{1}{2}}{\\frac{3}{4}}");
    expect(row.esperado).toBe("\\frac{2}{3}");
    const parsed = parseExpression(row.entrada).algebrite;
    expect(evaluate(parsed)).toBe("2/3");
    expect(compileNumeric(parsed, "__unused__")(0)).toBeCloseTo(2/3, 15);
    // A flattened 1/2/3/4 would produce 1/24, not 2/3.
    expect(compileNumeric(parsed, "__unused__")(0)).not.toBeCloseTo(1/24, 12);
    scope.postMessage.mockClear();
    expect(scope.onmessage).toBeTypeOf("function");
    scope.onmessage!({ data: { type: "evaluate", requestId: "SY-E-23", expressionAlgebrite: parsed } });
    expect(scope.postMessage).toHaveBeenCalledTimes(1);
    const output = scope.postMessage.mock.calls[0][0];
    expect(output.success, JSON.stringify(output)).toBe(true);
    expect(output.requestId).toBe("SY-E-23");
    expect(output.resultLatex).toBeTypeOf("string");
    const returned = parseExpression(output.resultLatex).algebrite;
    expect(evaluate(returned)).toBe("2/3");
    expect(compileNumeric(returned, "__unused__")(0)).toBeCloseTo(2/3, 15);
    scope.postMessage.mockClear();
    scope.onmessage!({ data: { type: "evaluate", requestId: "SY-E-23-reentry", expressionAlgebrite: returned } });
    const reentry = scope.postMessage.mock.calls[0][0];
    expect(reentry.success).toBe(true);
    expect(reentry.requestId).toBe("SY-E-23-reentry");
    expect(evaluate(parseExpression(reentry.resultLatex).algebrite)).toBe("2/3");
  });

  it("SY-E-24: original display-style fraction remains exact through worker and reentry", () => {
    const row = rows["SY-E-24"];
    expect(row.operacion).toBe("valor");
    expect(row.entrada).toBe("\\dfrac{3}{4}");
    expect(row.esperado).toBe("\\frac{3}{4}");
    const parsed = parseExpression(row.entrada).algebrite;
    expect(evaluate(parsed)).toBe("3/4");
    expect(compileNumeric(parsed, "__unused__")(0)).toBe(0.75);
    scope.postMessage.mockClear();
    scope.onmessage!({ data: { type: "evaluate", requestId: "SY-E-24", expressionAlgebrite: parsed } });
    expect(scope.postMessage).toHaveBeenCalledTimes(1);
    const output = scope.postMessage.mock.calls[0][0];
    expect(output.success, JSON.stringify(output)).toBe(true);
    expect(output.requestId).toBe("SY-E-24");
    expect(output.resultLatex).toBeTypeOf("string");
    const returned = parseExpression(output.resultLatex).algebrite;
    expect(evaluate(returned)).toBe("3/4");
    expect(compileNumeric(returned, "__unused__")(0)).toBe(0.75);
    scope.postMessage.mockClear();
    scope.onmessage!({ data: { type: "evaluate", requestId: "SY-E-24-reentry", expressionAlgebrite: returned } });
    const again = scope.postMessage.mock.calls[0][0];
    expect(again.success, JSON.stringify(again)).toBe(true);
    expect(again.requestId).toBe("SY-E-24-reentry");
    expect(evaluate(parseExpression(again.resultLatex).algebrite)).toBe("3/4");
  });

  it("SY-E-25: original display-style fraction remains exact through worker and reentry", () => {
    const row = rows["SY-E-25"];
    expect(row.operacion).toBe("valor");
    expect(row.entrada).toBe("\\tfrac{3}{4}");
    expect(row.esperado).toBe("\\frac{3}{4}");
    const parsed = parseExpression(row.entrada).algebrite;
    expect(evaluate(parsed)).toBe("3/4");
    expect(compileNumeric(parsed, "__unused__")(0)).toBe(0.75);
    scope.postMessage.mockClear();
    scope.onmessage!({ data: { type: "evaluate", requestId: "SY-E-25", expressionAlgebrite: parsed } });
    expect(scope.postMessage).toHaveBeenCalledTimes(1);
    const output = scope.postMessage.mock.calls[0][0];
    expect(output.success, JSON.stringify(output)).toBe(true);
    expect(output.requestId).toBe("SY-E-25");
    expect(output.resultLatex).toBeTypeOf("string");
    const returned = parseExpression(output.resultLatex).algebrite;
    expect(evaluate(returned)).toBe("3/4");
    expect(compileNumeric(returned, "__unused__")(0)).toBe(0.75);
    scope.postMessage.mockClear();
    scope.onmessage!({ data: { type: "evaluate", requestId: "SY-E-25-reentry", expressionAlgebrite: returned } });
    const again = scope.postMessage.mock.calls[0][0];
    expect(again.success, JSON.stringify(again)).toBe(true);
    expect(again.requestId).toBe("SY-E-25-reentry");
    expect(evaluate(parseExpression(again.resultLatex).algebrite)).toBe("3/4");
  });

});