import { beforeAll, afterAll, describe, expect, it, vi } from "vitest";
import cases from "../qa/certification/syntax309_cases.jsonl?raw";
import { parseExpression } from "../src/engine/parsing";
import { evaluate } from "../src/engine/algebriteClient";
import { ErrorCode } from "../src/types";
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

  it("SY-E-26: original display-style fraction remains exact through worker and reentry", () => {
    const row = rows["SY-E-26"];
    expect(row.operacion).toBe("valor");
    expect(row.entrada).toBe("\\frac{1}{3}+\\frac{1}{6}");
    expect(row.esperado).toBe("\\frac{1}{2}");
    const parsed = parseExpression(row.entrada).algebrite;
    expect(evaluate(parsed)).toBe("1/2");
    expect(compileNumeric(parsed, "__unused__")(0)).toBe(0.5);
    scope.postMessage.mockClear();
    scope.onmessage!({ data: { type: "evaluate", requestId: "SY-E-26", expressionAlgebrite: parsed } });
    expect(scope.postMessage).toHaveBeenCalledTimes(1);
    const output = scope.postMessage.mock.calls[0][0];
    expect(output.success, JSON.stringify(output)).toBe(true);
    expect(output.requestId).toBe("SY-E-26");
    expect(output.resultLatex).toBeTypeOf("string");
    const returned = parseExpression(output.resultLatex).algebrite;
    expect(evaluate(returned)).toBe("1/2");
    expect(compileNumeric(returned, "__unused__")(0)).toBe(0.5);
    scope.postMessage.mockClear();
    scope.onmessage!({ data: { type: "evaluate", requestId: "SY-E-26-reentry", expressionAlgebrite: returned } });
    const again = scope.postMessage.mock.calls[0][0];
    expect(again.success, JSON.stringify(again)).toBe(true);
    expect(again.requestId).toBe("SY-E-26-reentry");
    expect(evaluate(parseExpression(again.resultLatex).algebrite)).toBe("1/2");
  });

  it("SY-E-27: original display-style fraction remains exact through worker and reentry", () => {
    const row = rows["SY-E-27"];
    expect(row.operacion).toBe("valor");
    expect(row.entrada).toBe("\\frac{22}{7}");
    expect(row.esperado).toBe("\\frac{22}{7}\\approx3.142857143");
    const parsed = parseExpression(row.entrada).algebrite;
    expect(evaluate(parsed)).toBe("22/7");
    expect(compileNumeric(parsed, "__unused__")(0)).toBeCloseTo(22/7, 12);
    scope.postMessage.mockClear();
    scope.onmessage!({ data: { type: "evaluate", requestId: "SY-E-27", expressionAlgebrite: parsed } });
    expect(scope.postMessage).toHaveBeenCalledTimes(1);
    const output = scope.postMessage.mock.calls[0][0];
    expect(output.success, JSON.stringify(output)).toBe(true);
    expect(output.requestId).toBe("SY-E-27");
    expect(output.resultLatex).toBeTypeOf("string");
    const returned = parseExpression(output.resultLatex).algebrite;
    expect(evaluate(returned)).toBe("22/7");
    expect(compileNumeric(returned, "__unused__")(0)).toBeCloseTo(22/7, 12);
    scope.postMessage.mockClear();
    scope.onmessage!({ data: { type: "evaluate", requestId: "SY-E-27-reentry", expressionAlgebrite: returned } });
    const again = scope.postMessage.mock.calls[0][0];
    expect(again.success, JSON.stringify(again)).toBe(true);
    expect(again.requestId).toBe("SY-E-27-reentry");
    expect(evaluate(parseExpression(again.resultLatex).algebrite)).toBe("22/7");
  });

  it("SY-E-28: original zero-denominator fraction gives a clear domain error and recovers", () => {
    const row = rows["SY-E-28"];
    expect(row.operacion).toBe("error");
    expect(row.entrada).toBe("\\frac{1}{0}");
    expect(row.esperado).toMatch(/división entre cero/);
    const parsed = parseExpression(row.entrada).algebrite;
    expect(() => evaluate(parsed)).toThrowError(expect.objectContaining({
      code: ErrorCode.DOMAIN_ERROR, message: expect.stringMatching(/cero|zero|divisi/i),
    }));
    scope.postMessage.mockClear();
    scope.onmessage!({ data: {type:"evaluate", requestId:"SY-E-28", expressionAlgebrite:parsed} });
    const rejected = scope.postMessage.mock.calls[0][0];
    expect(rejected.success).toBe(false);
    expect(rejected.errorCode).toBe(ErrorCode.DOMAIN_ERROR);
    expect(rejected.errorMessage).toMatch(/cero|zero|divisi/i);
    expect(rejected.resultLatex).toBeNull();
    scope.postMessage.mockClear();
    scope.onmessage!({ data: {type:"evaluate", requestId:"SY-E-28-recovery",
      expressionAlgebrite:parseExpression("2+3").algebrite} });
    const recovered = scope.postMessage.mock.calls[0][0];
    expect(recovered.success).toBe(true);
    expect(evaluate(parseExpression(recovered.resultLatex).algebrite)).toBe("5");
  });

  it("SY-E-29: zero over zero is identified as indeterminate, then recovers", () => {
    const row = rows["SY-E-29"];
    expect(row.operacion).toBe("error");
    expect(row.entrada).toBe("\\frac{0}{0}");
    expect(row.esperado).toMatch(/indeterminado/);
    const parsed = parseExpression(row.entrada).algebrite;
    expect(() => evaluate(parsed)).toThrowError(expect.objectContaining({
      code: ErrorCode.DOMAIN_ERROR, message: expect.stringMatching(/indeterm|0.*0/i),
    }));
    scope.postMessage.mockClear();
    scope.onmessage!({data:{type:"evaluate",requestId:"SY-E-29",expressionAlgebrite:parsed}});
    const rejected = scope.postMessage.mock.calls[0][0];
    expect(rejected.success).toBe(false);
    expect(rejected.errorCode).toBe(ErrorCode.DOMAIN_ERROR);
    expect(rejected.errorMessage).toMatch(/indeterm|0.*0/i);
    expect(rejected.resultLatex).toBeNull();
    scope.postMessage.mockClear();
    scope.onmessage!({data:{type:"evaluate",requestId:"SY-E-29-recovery",
      expressionAlgebrite:parseExpression("2+3").algebrite}});
    const recovered = scope.postMessage.mock.calls[0][0];
    expect(recovered.success).toBe(true);
    expect(evaluate(parseExpression(recovered.resultLatex).algebrite)).toBe("5");
  });

  it("SY-E-30: original empty denominator is a clear parse error and recovers", () => {
    const row = rows["SY-E-30"];
    expect(row.operacion).toBe("error");
    expect(row.entrada).toBe("\\frac{x}{}");
    expect(row.esperado).toContain("denominador vacío");
    expect(() => parseExpression(row.entrada)).toThrowError(expect.objectContaining({
      code: ErrorCode.PARSE_ERROR, message: expect.stringMatching(/denominador|denominator|vacío|empty/i),
    }));
    const recovered = parseExpression("2+3").algebrite;
    expect(evaluate(recovered)).toBe("5");
  });

  it("SY-E-31: adjacency is implicit multiplication", () => {
    const row = rows["SY-E-31"];
    expect(row.operacion).toBe("convencion");
    expect(row.entrada).toBe("2\\frac{1}{3}");
    const parsed = parseExpression(row.entrada).algebrite;
    expect(evaluate(parsed)).toBe("2/3");
    expect(compileNumeric(parsed, "__unused__")(0)).toBeCloseTo(2/3, 14);
    scope.postMessage.mockClear();
    scope.onmessage!({ data: { type: "evaluate", requestId: "SY-E-31", expressionAlgebrite: parsed } });
    const output = scope.postMessage.mock.calls[0][0];
    expect(output.success).toBe(true);
    expect(evaluate(parseExpression(output.resultLatex).algebrite)).toBe("2/3");
  });

  it("SY-N-01: leading-dot decimal remains 0.5 through parser, worker, and reentry", () => {
    const row = rows["SY-N-01"];
    expect(row.operacion).toBe("valor");
    expect(row.entrada).toBe(".5");
    expect(row.esperado).toBe("0.5");
    const parsed = parseExpression(row.entrada).algebrite;
    expect(compileNumeric(evaluate(parsed), "__unused__")(0)).toBe(0.5);
    expect(compileNumeric(parsed, "__unused__")(0)).toBe(0.5);
    scope.postMessage.mockClear();
    scope.onmessage!({data:{type:"evaluate",requestId:"SY-N-01",expressionAlgebrite:parsed}});
    const result = scope.postMessage.mock.calls[0][0];
    expect(result.success, JSON.stringify(result)).toBe(true);
    expect(compileNumeric(evaluate(parseExpression(result.resultLatex).algebrite), "__unused__")(0)).toBe(0.5);
  });

  it("SY-N-02: trailing-dot decimal evaluates exactly to five through parser, worker and reentry", () => {
    const row = rows["SY-N-02"];
    expect(row.operacion).toBe("valor");
    expect(row.entrada).toBe("5.");
    expect(row.esperado).toBe("5");
    const parsed = parseExpression(row.entrada).algebrite;
    expect(compileNumeric(evaluate(parsed), "__unused__")(0)).toBe(5);
    scope.postMessage.mockClear();
    scope.onmessage!({data:{type:"evaluate",requestId:"SY-N-02",expressionAlgebrite:parsed}});
    const result = scope.postMessage.mock.calls[0][0];
    expect(result.success, JSON.stringify(result)).toBe(true);
    expect(compileNumeric(evaluate(parseExpression(result.resultLatex).algebrite), "__unused__")(0)).toBe(5);
  });

  it("SY-N-03: leading zero integer remains twelve through parser, worker and reentry", () => {
    const row = rows["SY-N-03"];
    expect(row.operacion).toBe("valor");
    expect(row.entrada).toBe("00012");
    expect(row.esperado).toBe("12");
    const parsed = parseExpression(row.entrada).algebrite;
    expect(compileNumeric(evaluate(parsed), "__unused__")(0)).toBe(12);
    scope.postMessage.mockClear();
    scope.onmessage!({data:{type:"evaluate",requestId:"SY-N-03",expressionAlgebrite:parsed}});
    const result = scope.postMessage.mock.calls[0][0];
    expect(result.success, JSON.stringify(result)).toBe(true);
    expect(compileNumeric(evaluate(parseExpression(result.resultLatex).algebrite), "__unused__")(0)).toBe(12);
  });
  it("SY-N-04: scientific multiplication LaTeX equals 1200 through worker and reentry", () => {
    const row = rows["SY-N-04"];
    expect(row.operacion).toBe("valor");
    expect(row.entrada).toBe("1.2\\times10^{3}");
    expect(row.esperado).toBe("1200");
    const parsed = parseExpression(row.entrada).algebrite;
    expect(compileNumeric(evaluate(parsed), "__unused__")(0)).toBe(1200);
    scope.postMessage.mockClear();
    scope.onmessage!({data:{type:"evaluate",requestId:"SY-N-04",expressionAlgebrite:parsed}});
    const result = scope.postMessage.mock.calls[0][0];
    expect(result.success, JSON.stringify(result)).toBe(true);
    expect(compileNumeric(evaluate(parseExpression(result.resultLatex).algebrite), "__unused__")(0)).toBe(1200);
  });

});
