import { beforeAll, afterAll, describe, expect, it, vi } from "vitest";
import cases from "../qa/certification/syntax309_cases.jsonl?raw";
import { parseExpression } from "../src/engine/parsing";
import { evaluate } from "../src/engine/algebriteClient";
import { ErrorCode } from "../src/types";
import { formatScientificResult } from "../src/components/ResultPanel";
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

  it("SY-N-05: explicit calculator-e convention equals 1000 and supports reentry", () => {
    const row = rows["SY-N-05"];
    expect(row.operacion).toBe("convencion");
    expect(row.entrada).toBe("1\\mathrm{e}3");
    expect(row.nota).toMatch(/aceptarla o rechazarla/);
    const parsed = parseExpression(row.entrada).algebrite;
    expect(compileNumeric(evaluate(parsed), "__unused__")(0)).toBe(1000);
    scope.postMessage.mockClear();
    scope.onmessage!({data:{type:"evaluate",requestId:"SY-N-05",expressionAlgebrite:parsed}});
    const result = scope.postMessage.mock.calls[0][0];
    expect(result.success, JSON.stringify(result)).toBe(true);
    expect(compileNumeric(evaluate(parseExpression(result.resultLatex).algebrite), "__unused__")(0)).toBe(1000);
  });

  it("SY-N-06: decimal addition is exactly 0.3, never a floating-point artifact", () => {
    const row = rows["SY-N-06"];
    expect(row.operacion).toBe("valor");
    expect(row.entrada).toBe("0.1+0.2");
    expect(row.esperado).toBe("0.3");
    const parsed = parseExpression(row.entrada).algebrite;
    const exact = evaluate(parsed);
    expect(compileNumeric(exact, "__unused__")(0)).toBe(0.3);
    expect(exact).not.toContain("0.30000000000000004");
    scope.postMessage.mockClear();
    scope.onmessage!({data:{type:"evaluate",requestId:"SY-N-06",expressionAlgebrite:parsed}});
    const result = scope.postMessage.mock.calls[0][0];
    expect(result.success, JSON.stringify(result)).toBe(true);
    expect(result.resultLatex).not.toContain("0.30000000000000004");
    expect(compileNumeric(evaluate(parseExpression(result.resultLatex).algebrite), "__unused__")(0)).toBe(0.3);
  });

  it("SY-N-07: multiplying decimal 0.1 by 3 retains exact 0.3 through worker and reentry", () => {
    const row = rows["SY-N-07"];
    expect(row.operacion).toBe("valor");
    expect(row.entrada).toBe("0.1\\times3");
    expect(row.esperado).toBe("0.3");
    const parsed = parseExpression(row.entrada).algebrite;
    const exact = evaluate(parsed);
    expect(compileNumeric(exact, "__unused__")(0)).toBe(0.3);
    expect(exact).not.toContain("0.30000000000000004");
    scope.postMessage.mockClear();
    scope.onmessage!({data:{type:"evaluate",requestId:"SY-N-07",expressionAlgebrite:parsed}});
    const result = scope.postMessage.mock.calls[0][0];
    expect(result.success, JSON.stringify(result)).toBe(true);
    expect(result.resultLatex).not.toContain("0.30000000000000004");
    expect(compileNumeric(evaluate(parseExpression(result.resultLatex).algebrite), "__unused__")(0)).toBe(0.3);
  });

  it("SY-N-08: subtracting 0.9 from one retains exact 0.1 through worker and reentry", () => {
    const row = rows["SY-N-08"];
    expect(row.operacion).toBe("valor");
    expect(row.entrada).toBe("1-0.9");
    expect(row.esperado).toBe("0.1");
    const parsed = parseExpression(row.entrada).algebrite;
    const exact = evaluate(parsed);
    expect(compileNumeric(exact, "__unused__")(0)).toBe(0.1);
    expect(exact).not.toContain("0.09999999999999998");
    scope.postMessage.mockClear();
    scope.onmessage!({data:{type:"evaluate",requestId:"SY-N-08",expressionAlgebrite:parsed}});
    const result = scope.postMessage.mock.calls[0][0];
    expect(result.success, JSON.stringify(result)).toBe(true);
    expect(result.resultLatex).not.toContain("0.09999999999999998");
    expect(compileNumeric(evaluate(parseExpression(result.resultLatex).algebrite), "__unused__")(0)).toBe(0.1);
  });

  it("SY-N-09: decimal product 4.35 times 100 yields exactly 435 through worker and reentry", () => {
    const row = rows["SY-N-09"];
    expect(row.operacion).toBe("valor");
    expect(row.entrada).toBe("4.35\\times100");
    expect(row.esperado).toBe("435");
    const parsed = parseExpression(row.entrada).algebrite;
    const exact = evaluate(parsed);
    expect(compileNumeric(exact, "__unused__")(0)).toBe(435);
    expect(exact).not.toContain("434.99999999999994");
    scope.postMessage.mockClear();
    scope.onmessage!({data:{type:"evaluate",requestId:"SY-N-09",expressionAlgebrite:parsed}});
    const result = scope.postMessage.mock.calls[0][0];
    expect(result.success, JSON.stringify(result)).toBe(true);
    expect(result.resultLatex).not.toContain("434.99999999999994");
    expect(compileNumeric(evaluate(parseExpression(result.resultLatex).algebrite), "__unused__")(0)).toBe(435);
  });

  it("SY-N-10: 1.005 times 1000 remains exactly 1005 through worker and reentry", () => {
    const row = rows["SY-N-10"];
    expect(row.operacion).toBe("valor");
    expect(row.entrada).toBe("1.005\\times1000");
    expect(row.esperado).toBe("1005");
    const parsed = parseExpression(row.entrada).algebrite;
    expect(evaluate(parsed)).toBe("1005");
    scope.postMessage.mockClear();
    scope.onmessage!({data:{type:"evaluate",requestId:"SY-N-10",expressionAlgebrite:parsed}});
    expect(scope.postMessage).toHaveBeenCalledTimes(1);
    const result = scope.postMessage.mock.calls[0][0];
    expect(result.success, JSON.stringify(result)).toBe(true);
    expect(result.requestId).toBe("SY-N-10");
    expect(result.resultLatex).toBe("1005");
    const returned = parseExpression(result.resultLatex).algebrite;
    expect(evaluate(returned)).toBe("1005");
    expect(compileNumeric(evaluate(returned), "__unused__")(0)).toBe(1005);
    scope.postMessage.mockClear();
    scope.onmessage!({data:{type:"evaluate",requestId:"SY-N-10-reentry",expressionAlgebrite:returned}});
    const repeated = scope.postMessage.mock.calls[0][0];
    expect(repeated.success).toBe(true);
    expect(repeated.requestId).toBe("SY-N-10-reentry");
    expect(repeated.resultLatex).toBe("1005");
  });

  it("SY-N-11: exact one third times three is one through worker and reentry", () => {
    const row = rows["SY-N-11"];
    expect(row.operacion).toBe("valor");
    expect(row.entrada).toBe("\\frac{1}{3}\\times3");
    expect(row.esperado).toBe("1");
    const parsed = parseExpression(row.entrada).algebrite;
    expect(evaluate(parsed)).toBe("1");
    scope.postMessage.mockClear();
    scope.onmessage!({data:{type:"evaluate",requestId:"SY-N-11",expressionAlgebrite:parsed}});
    expect(scope.postMessage).toHaveBeenCalledTimes(1);
    const result = scope.postMessage.mock.calls[0][0];
    expect(result.success, JSON.stringify(result)).toBe(true);
    expect(result.requestId).toBe("SY-N-11");
    expect(result.resultLatex).toBe("1");
    const returned = parseExpression(result.resultLatex).algebrite;
    expect(evaluate(returned)).toBe("1");
    scope.postMessage.mockClear();
    scope.onmessage!({data:{type:"evaluate",requestId:"SY-N-11-reentry",expressionAlgebrite:returned}});
    const repeated = scope.postMessage.mock.calls[0][0];
    expect(repeated.success).toBe(true);
    expect(repeated.requestId).toBe("SY-N-11-reentry");
    expect(repeated.resultLatex).toBe("1");
  });

  it("SY-N-12: decimal plus abbreviated fraction remains exactly two through reentry", () => {
    const row = rows["SY-N-12"];
    expect(row.operacion).toBe("valor");
    expect(row.entrada).toBe("1.5+\\frac12");
    expect(row.esperado).toBe("2");
    const parsed = parseExpression(row.entrada).algebrite;
    expect(evaluate(parsed)).toBe("2");
    scope.postMessage.mockClear();
    scope.onmessage!({data:{type:"evaluate",requestId:"SY-N-12",expressionAlgebrite:parsed}});
    expect(scope.postMessage).toHaveBeenCalledTimes(1);
    const result = scope.postMessage.mock.calls[0][0];
    expect(result.success, JSON.stringify(result)).toBe(true);
    expect(result.requestId).toBe("SY-N-12");
    expect(result.resultLatex).toBe("2");
    const returned = parseExpression(result.resultLatex).algebrite;
    expect(evaluate(returned)).toBe("2");
    scope.postMessage.mockClear();
    scope.onmessage!({data:{type:"evaluate",requestId:"SY-N-12-reentry",expressionAlgebrite:returned}});
    const repeated = scope.postMessage.mock.calls[0][0];
    expect(repeated.success).toBe(true);
    expect(repeated.requestId).toBe("SY-N-12-reentry");
    expect(repeated.resultLatex).toBe("2");
  });

  it("SY-N-13: original squared radical is exactly two through worker and reentry", () => {
    const row = rows["SY-N-13"];
    expect(row.operacion).toBe("valor");
    expect(row.entrada).toBe("\\sqrt{2}^{2}");
    expect(row.esperado).toBe("2");
    const parsed = parseExpression(row.entrada).algebrite;
    expect(parsed).toMatch(/sqrt|2\^\(1\/2\)|2\^0\.5|2\^\(1\/2\)/i);
    expect(evaluate(parsed)).toBe("2");
    scope.postMessage.mockClear();
    scope.onmessage!({data:{type:"evaluate",requestId:"SY-N-13",expressionAlgebrite:parsed}});
    expect(scope.postMessage).toHaveBeenCalledTimes(1);
    const result = scope.postMessage.mock.calls[0][0];
    expect(result.success, JSON.stringify(result)).toBe(true);
    expect(result.requestId).toBe("SY-N-13");
    expect(result.resultLatex).toBe("2");
    const returned = parseExpression(result.resultLatex).algebrite;
    expect(evaluate(returned)).toBe("2");
    scope.postMessage.mockClear();
    scope.onmessage!({data:{type:"evaluate",requestId:"SY-N-13-reentry",expressionAlgebrite:returned}});
    const repeated = scope.postMessage.mock.calls[0][0];
    expect(repeated.success, JSON.stringify(repeated)).toBe(true);
    expect(repeated.requestId).toBe("SY-N-13-reentry");
    expect(repeated.resultLatex).toBe("2");
  });

  it("SY-N-14: squared radical minus two is exactly zero through worker and reentry", () => {
    const row = rows["SY-N-14"];
    expect(row.operacion).toBe("valor");
    expect(row.entrada).toBe("\\left(\\sqrt{2}\\right)^{2}-2");
    expect(row.esperado).toBe("0");
    const parsed = parseExpression(row.entrada).algebrite;
    expect(evaluate(parsed)).toBe("0");
    scope.postMessage.mockClear();
    scope.onmessage!({data:{type:"evaluate",requestId:"SY-N-14",expressionAlgebrite:parsed}});
    expect(scope.postMessage).toHaveBeenCalledTimes(1);
    const result = scope.postMessage.mock.calls[0][0];
    expect(result.success, JSON.stringify(result)).toBe(true);
    expect(result.requestId).toBe("SY-N-14");
    expect(result.resultLatex).toBe("0");
    const returned = parseExpression(result.resultLatex).algebrite;
    expect(evaluate(returned)).toBe("0");
    scope.postMessage.mockClear();
    scope.onmessage!({data:{type:"evaluate",requestId:"SY-N-14-reentry",expressionAlgebrite:returned}});
    const repeated = scope.postMessage.mock.calls[0][0];
    expect(repeated.success, JSON.stringify(repeated)).toBe(true);
    expect(repeated.requestId).toBe("SY-N-14-reentry");
    expect(repeated.resultLatex).toBe("0");
  });

  it("SY-N-15: integer beyond IEEE-754 range is preserved exactly on reentry", () => {
    const row = rows["SY-N-15"];
    expect(row.operacion).toBe("valor");
    expect(row.entrada).toBe("10^{20}+1");
    expect(row.esperado).toBe("100000000000000000001");
    const parsed = parseExpression(row.entrada).algebrite;
    expect(evaluate(parsed)).toBe(row.esperado);
    scope.postMessage.mockClear();
    scope.onmessage!({data:{type:"evaluate",requestId:"SY-N-15",expressionAlgebrite:parsed}});
    expect(scope.postMessage).toHaveBeenCalledTimes(1);
    const result = scope.postMessage.mock.calls[0][0];
    expect(result.success, JSON.stringify(result)).toBe(true);
    expect(result.requestId).toBe("SY-N-15");
    expect(result.resultLatex).toBe(row.esperado);
    const returned = parseExpression(result.resultLatex).algebrite;
    expect(evaluate(returned)).toBe(row.esperado);
    scope.postMessage.mockClear();
    scope.onmessage!({data:{type:"evaluate",requestId:"SY-N-15-reentry",expressionAlgebrite:returned}});
    const repeated = scope.postMessage.mock.calls[0][0];
    expect(repeated.success).toBe(true);
    expect(repeated.requestId).toBe("SY-N-15-reentry");
    expect(repeated.resultLatex).toBe(row.esperado);
  });

  it("SY-N-15: keeps 10^20 plus one as an exact integer across reentry", () => {
    const row = rows["SY-N-15"];
    const expected = "100000000000000000001";
    expect(row.entrada).toBe("10^{20}+1");
    expect(row.esperado).toBe(expected);
    const parsed = parseExpression(row.entrada).algebrite;
    expect(evaluate(parsed)).toBe(expected);
    scope.postMessage.mockClear();
    scope.onmessage!({ data: { type: "evaluate", requestId: "SY-N-15", expressionAlgebrite: parsed } });
    const reply = scope.postMessage.mock.calls[0][0];
    expect(reply.success).toBe(true);
    expect(reply.resultLatex).toBe(expected);
    const again = parseExpression(reply.resultLatex).algebrite;
    expect(evaluate(again)).toBe(expected);
  });

  it("SY-N-16: exact power of two survives worker and reentry", () => {
    const row = rows["SY-N-16"];
    const expected = "1267650600228229401496703205376";
    expect(row.operacion).toBe("valor");
    expect(row.entrada).toBe("2^{100}");
    expect(row.esperado).toBe(expected);
    const parsed = parseExpression(row.entrada).algebrite;
    expect(evaluate(parsed)).toBe(expected);
    scope.postMessage.mockClear();
    scope.onmessage!({data:{type:"evaluate",requestId:"SY-N-16",expressionAlgebrite:parsed}});
    expect(scope.postMessage).toHaveBeenCalledTimes(1);
    const response = scope.postMessage.mock.calls[0][0];
    expect(response.success, JSON.stringify(response)).toBe(true);
    expect(response.requestId).toBe("SY-N-16");
    expect(response.resultLatex).toBe(expected);
    const returned = parseExpression(response.resultLatex).algebrite;
    expect(evaluate(returned)).toBe(expected);
    scope.postMessage.mockClear();
    scope.onmessage!({data:{type:"evaluate",requestId:"SY-N-16-reentry",expressionAlgebrite:returned}});
    const repeat = scope.postMessage.mock.calls[0][0];
    expect(repeat.success).toBe(true);
    expect(repeat.requestId).toBe("SY-N-16-reentry");
    expect(repeat.resultLatex).toBe(expected);
  });

  it("SY-N-17: integer above JS safe limit retains all digits through worker and reentry", () => {
    const row = rows["SY-N-17"];
    const expected = "9007199254740993";
    expect(row.operacion).toBe("valor");
    expect(row.entrada).toBe(expected);
    expect(row.esperado).toBe(expected);
    const parsed = parseExpression(row.entrada).algebrite;
    expect(evaluate(parsed)).toBe(expected);
    scope.postMessage.mockClear();
    scope.onmessage!({data:{type:"evaluate",requestId:"SY-N-17",expressionAlgebrite:parsed}});
    expect(scope.postMessage).toHaveBeenCalledTimes(1);
    const response = scope.postMessage.mock.calls[0][0];
    expect(response.success, JSON.stringify(response)).toBe(true);
    expect(response.requestId).toBe("SY-N-17");
    expect(response.resultLatex).toBe(expected);
    const again = parseExpression(response.resultLatex).algebrite;
    expect(evaluate(again)).toBe(expected);
    scope.postMessage.mockClear();
    scope.onmessage!({data:{type:"evaluate",requestId:"SY-N-17-reentry",expressionAlgebrite:again}});
    const repeat = scope.postMessage.mock.calls[0][0];
    expect(repeat.success).toBe(true);
    expect(repeat.resultLatex).toBe(expected);
  });

  it("SY-N-18: original percent equals exact twelve hundredths through worker and reentry", () => {
    const row = rows["SY-N-18"];
    expect(row.operacion).toBe("valor");
    expect(row.entrada).toBe("12\\%");
    expect(row.esperado).toBe("0.12");
    const parsed = parseExpression(row.entrada).algebrite;
    const exact = evaluate(parsed);
    expect(["0.12", "3/25"]).toContain(exact);
    scope.postMessage.mockClear();
    scope.onmessage!({data:{type:"evaluate",requestId:"SY-N-18",expressionAlgebrite:parsed}});
    const result = scope.postMessage.mock.calls[0][0];
    expect(result.success, JSON.stringify(result)).toBe(true);
    expect(result.requestId).toBe("SY-N-18");
    expect(["0.12", "\\frac{3}{25}"]).toContain(result.resultLatex);
    const again = parseExpression(result.resultLatex).algebrite;
    expect(["0.12", "3/25"]).toContain(evaluate(again));
  });

  it("SY-N-19: percent multiplication yields exactly one hundred across reentry", () => {
    const row = rows["SY-N-19"];
    expect(row.operacion).toBe("valor");
    expect(row.entrada).toBe("50\\%\\times200");
    expect(row.esperado).toBe("100");
    const parsed = parseExpression(row.entrada).algebrite;
    expect(evaluate(parsed)).toBe("100");
    scope.postMessage.mockClear();
    scope.onmessage!({data:{type:"evaluate",requestId:"SY-N-19",expressionAlgebrite:parsed}});
    const response = scope.postMessage.mock.calls[0][0];
    expect(response.success, JSON.stringify(response)).toBe(true);
    expect(response.requestId).toBe("SY-N-19");
    expect(response.resultLatex).toBe("100");
    const returned = parseExpression(response.resultLatex).algebrite;
    expect(evaluate(returned)).toBe("100");
    scope.postMessage.mockClear();
    scope.onmessage!({data:{type:"evaluate",requestId:"SY-N-19-reentry",expressionAlgebrite:returned}});
    const repeated = scope.postMessage.mock.calls[0][0];
    expect(repeated.success).toBe(true);
    expect(repeated.resultLatex).toBe("100");
  });

  it("SY-N-20: five factorial equals 120 through worker and reentry", () => {
    const row = rows["SY-N-20"];
    expect(row.operacion).toBe("valor");
    expect(row.entrada).toBe("5!");
    expect(row.esperado).toBe("120");
    const parsed = parseExpression(row.entrada).algebrite;
    expect(evaluate(parsed)).toBe("120");
    scope.postMessage.mockClear();
    scope.onmessage!({data:{type:"evaluate",requestId:"SY-N-20",expressionAlgebrite:parsed}});
    expect(scope.postMessage).toHaveBeenCalledTimes(1);
    const response = scope.postMessage.mock.calls[0][0];
    expect(response.success, JSON.stringify(response)).toBe(true);
    expect(response.requestId).toBe("SY-N-20");
    expect(response.resultLatex).toBe("120");
    const returned = parseExpression(response.resultLatex).algebrite;
    expect(evaluate(returned)).toBe("120");
    scope.postMessage.mockClear();
    scope.onmessage!({data:{type:"evaluate",requestId:"SY-N-20-reentry",expressionAlgebrite:returned}});
    const repeated = scope.postMessage.mock.calls[0][0];
    expect(repeated.success).toBe(true);
    expect(repeated.resultLatex).toBe("120");
  });


  it("SY-N-21: zero factorial equals one through worker and reentry", () => {
    const row = rows["SY-N-21"];
    expect(row.operacion).toBe("valor");
    expect(row.entrada).toBe("0!");
    expect(row.esperado).toBe("1");
    const parsed = parseExpression(row.entrada).algebrite;
    expect(evaluate(parsed)).toBe("1");
    scope.postMessage.mockClear();
    scope.onmessage!({data:{type:"evaluate",requestId:"SY-N-21",expressionAlgebrite:parsed}});
    expect(scope.postMessage).toHaveBeenCalledTimes(1);
    const response = scope.postMessage.mock.calls[0][0];
    expect(response.success, JSON.stringify(response)).toBe(true);
    expect(response.requestId).toBe("SY-N-21");
    expect(response.resultLatex).toBe("1");
    const returned = parseExpression(response.resultLatex).algebrite;
    expect(evaluate(returned)).toBe("1");
    scope.postMessage.mockClear();
    scope.onmessage!({data:{type:"evaluate",requestId:"SY-N-21-reentry",expressionAlgebrite:returned}});
    const repeated = scope.postMessage.mock.calls[0][0];
    expect(repeated.success).toBe(true);
    expect(repeated.requestId).toBe("SY-N-21-reentry");
    expect(repeated.resultLatex).toBe("1");
  });


  it("SY-N-22: negative integer factorial is rejected and worker recovers", () => {
    const row = rows["SY-N-22"];
    expect(row.operacion).toBe("error");
    expect(row.entrada).toBe("(-1)!");
    expect(row.esperado).toMatch(/factorial no definido/i);
    const parsed = parseExpression(row.entrada).algebrite;
    scope.postMessage.mockClear();
    scope.onmessage!({data:{type:"evaluate",requestId:"SY-N-22",expressionAlgebrite:parsed}});
    expect(scope.postMessage).toHaveBeenCalledTimes(1);
    const invalid = scope.postMessage.mock.calls[0][0];
    expect(invalid.success, JSON.stringify(invalid)).toBe(false);
    expect(invalid.requestId).toBe("SY-N-22");
    expect(invalid.errorCode).toBe(ErrorCode.DOMAIN_ERROR);
    expect(invalid.errorMessage).toMatch(/factorial|negativ|definid|domain/i);
    expect(invalid.resultLatex).toBeNull();
    scope.postMessage.mockClear();
    scope.onmessage!({data:{type:"evaluate",requestId:"SY-N-22-recovery",expressionAlgebrite:parseExpression("2+3").algebrite}});
    const recovered = scope.postMessage.mock.calls[0][0];
    expect(recovered.success, JSON.stringify(recovered)).toBe(true);
    expect(recovered.requestId).toBe("SY-N-22-recovery");
    expect(evaluate(parseExpression(recovered.resultLatex).algebrite)).toBe("5");
  });


  it("SY-N-23: non-integer factorial follows explicit Gamma-or-error convention and recovers", () => {
    const row = rows["SY-N-23"];
    expect(row.operacion).toBe("convencion");
    expect(row.entrada).toBe("2.5!");
    expect(row.nota).toMatch(/Gamma o aviso/);
    const parsed = parseExpression(row.entrada).algebrite;
    scope.postMessage.mockClear();
    scope.onmessage!({data:{type:"evaluate",requestId:"SY-N-23",expressionAlgebrite:parsed}});
    expect(scope.postMessage).toHaveBeenCalledTimes(1);
    const response = scope.postMessage.mock.calls[0][0];
    expect(response.requestId).toBe("SY-N-23");
    if (response.success) {
      const approx = Number(response.decimalApprox);
      expect(Number.isFinite(approx), JSON.stringify(response)).toBe(true);
      expect(approx).toBeCloseTo(3.3233509704478426, 8);
    } else {
      expect([ErrorCode.DOMAIN_ERROR, ErrorCode.UNSUPPORTED_OPERATION]).toContain(response.errorCode);
      expect(response.errorMessage).toMatch(/factorial|entero|integer|gamma|dominio/i);
      expect(response.resultLatex).toBeNull();
    }
    scope.postMessage.mockClear();
    scope.onmessage!({data:{type:"evaluate",requestId:"SY-N-23-recovery",expressionAlgebrite:parseExpression("2+3").algebrite}});
    const recovered = scope.postMessage.mock.calls[0][0];
    expect(recovered.success).toBe(true);
    expect(evaluate(parseExpression(recovered.resultLatex).algebrite)).toBe("5");
  });


  it("SY-N-24: 100 factorial has 158 digits or valid scientific magnitude and recovers", () => {
    const row = rows["SY-N-24"];
    expect(row.operacion).toBe("valor");
    expect(row.entrada).toBe("100!");
    const parsed = parseExpression(row.entrada).algebrite;
    scope.postMessage.mockClear();
    scope.onmessage!({data:{type:"evaluate",requestId:"SY-N-24",expressionAlgebrite:parsed}});
    const response = scope.postMessage.mock.calls[0][0];
    expect(response.success, JSON.stringify(response)).toBe(true);
    expect(response.requestId).toBe("SY-N-24");
    const exact = BigInt(Array.from({length: 100}, (_, i) => BigInt(i + 1)).reduce((p, n) => p * n, 1n)).toString();
    expect(exact.length).toBe(158);
    const rendered = String(response.resultLatex);
    expect(rendered).not.toMatch(/Infinity|NaN|undefined/);
    const decimal = Number(response.decimalApprox ?? rendered.replace(/\\times10\^\{(\d+)\}/, "e$1"));
    if (rendered === exact) {
      expect(rendered.length).toBe(158);
    } else {
      expect(Number.isFinite(decimal), JSON.stringify(response)).toBe(true);
      expect(decimal / 1e157).toBeCloseTo(9.332621544, 7);
    }
    scope.postMessage.mockClear();
    scope.onmessage!({data:{type:"evaluate",requestId:"SY-N-24-recovery",expressionAlgebrite:parseExpression("2+3").algebrite}});
    const recovered = scope.postMessage.mock.calls[0][0];
    expect(recovered.success).toBe(true);
    expect(evaluate(parseExpression(recovered.resultLatex).algebrite)).toBe("5");
  });


  it("SY-N-25: 170 factorial has finite magnitude and recovery", () => {
    const row = rows["SY-N-25"];
    expect(row.operacion).toBe("valor");
    expect(row.entrada).toBe("170!");
    const expected = Array.from({length: 170}, (_, i) => BigInt(i + 1)).reduce((p, n) => p * n, 1n).toString();
    expect(expected.length).toBe(307);
    const parsed = parseExpression(row.entrada).algebrite;
    scope.postMessage.mockClear();
    scope.onmessage!({data:{type:"evaluate",requestId:"SY-N-25",expressionAlgebrite:parsed}});
    const response = scope.postMessage.mock.calls[0][0];
    expect(response.success, JSON.stringify(response)).toBe(true);
    expect(response.requestId).toBe("SY-N-25");
    const rendered = String(response.resultLatex);
    expect(rendered).not.toMatch(/Infinity|NaN|undefined/);
    if (rendered === expected) {
      expect(rendered.length).toBe(307);
    } else {
      const approx = Number(response.decimalApprox ?? rendered.replace(/\\times10\^\{(\d+)\}/, "e$1"));
      expect(Number.isFinite(approx), JSON.stringify(response)).toBe(true);
      expect(approx / 1e306).toBeCloseTo(7.257415615, 7);
    }
    scope.postMessage.mockClear();
    scope.onmessage!({data:{type:"evaluate",requestId:"SY-N-25-recovery",expressionAlgebrite:parseExpression("2+3").algebrite}});
    const recovered = scope.postMessage.mock.calls[0][0];
    expect(recovered.success).toBe(true);
    expect(evaluate(parseExpression(recovered.resultLatex).algebrite)).toBe("5");
  });


  it("SY-N-26: 171 factorial never returns silent Infinity and worker recovers", () => {
    const row = rows["SY-N-26"];
    expect(row.operacion).toBe("valor");
    expect(row.entrada).toBe("171!");
    const exact = Array.from({length:171}, (_,i)=>BigInt(i+1)).reduce((p,n)=>p*n,1n).toString();
    expect(exact.length).toBe(310);
    const parsed = parseExpression(row.entrada).algebrite;
    scope.postMessage.mockClear();
    scope.onmessage!({data:{type:"evaluate",requestId:"SY-N-26",expressionAlgebrite:parsed}});
    const reply = scope.postMessage.mock.calls[0][0];
    expect(reply.requestId).toBe("SY-N-26");
    if(reply.success) {
      expect(String(reply.resultLatex)).not.toMatch(/Infinity|NaN|undefined/i);
      expect(String(reply.resultLatex)).toBe(exact);
      expect(reply.decimalApprox == null || Number.isFinite(Number(reply.decimalApprox))).toBe(true);
    } else {
      expect([ErrorCode.DOMAIN_ERROR, ErrorCode.COMPLEXITY_LIMIT, ErrorCode.UNSUPPORTED_OPERATION]).toContain(reply.errorCode);
      expect(reply.errorMessage).toMatch(/desbord|overflow|límite|limite|factorial|grande|large/i);
      expect(reply.resultLatex).toBeNull();
    }
    scope.postMessage.mockClear();
    scope.onmessage!({data:{type:"evaluate",requestId:"SY-N-26-recovery",expressionAlgebrite:parseExpression("2+3").algebrite}});
    const recovered = scope.postMessage.mock.calls[0][0];
    expect(recovered.success).toBe(true);
    expect(evaluate(parseExpression(recovered.resultLatex).algebrite)).toBe("5");
  });

  it("SY-N-27: pi retains exact identity, nine-decimal approximation and reentry", () => {
    const row = rows["SY-N-27"];
    expect(row.entrada).toBe("\\pi");
    expect(row.esperado).toBe("3.141592654");
    const parsed = parseExpression(row.entrada).algebrite;
    expect(evaluate(parsed)).toBe("pi");
    scope.postMessage.mockClear();
    scope.onmessage!({data:{type:"evaluate",requestId:"SY-N-27",expressionAlgebrite:parsed}});
    const reply = scope.postMessage.mock.calls[0][0];
    expect(reply.success, JSON.stringify(reply)).toBe(true);
    expect(reply.requestId).toBe("SY-N-27");
    expect(evaluate(parseExpression(reply.resultLatex).algebrite)).toBe("pi");
    const approx = Number(String(reply.decimalApprox).replace(/…|\.\.\./g, ""));
    expect(Number.isFinite(approx), JSON.stringify(reply)).toBe(true);
    expect(approx.toFixed(9)).toBe("3.141592654");
    expect(Math.abs(approx - 3.141592653589793)).toBeLessThan(5e-10);
    scope.postMessage.mockClear();
    scope.onmessage!({data:{type:"evaluate",requestId:"SY-N-27-reentry",
      expressionAlgebrite:parseExpression(reply.resultLatex).algebrite}});
    const repeated = scope.postMessage.mock.calls[0][0];
    expect(repeated.success).toBe(true);
    expect(repeated.requestId).toBe("SY-N-27-reentry");
    expect(evaluate(parseExpression(repeated.resultLatex).algebrite)).toBe("pi");
  });

  it("SY-N-28: Euler constant preserves identity, decimal precision and reentry", () => {
    const row = rows["SY-N-28"];
    expect(row.entrada).toBe("e");
    expect(row.esperado).toBe("2.718281828");
    const parsed = parseExpression(row.entrada).algebrite;
    expect(evaluate("(" + evaluate(parsed) + ")-exp(1)")).toBe("0");
    scope.postMessage.mockClear();
    scope.onmessage!({data:{type:"evaluate",requestId:"SY-N-28",expressionAlgebrite:parsed}});
    const reply = scope.postMessage.mock.calls[0][0];
    expect(reply.success, JSON.stringify(reply)).toBe(true);
    expect(reply.requestId).toBe("SY-N-28");
    const returned = parseExpression(reply.resultLatex).algebrite;
    expect(evaluate("(" + returned + ")-exp(1)")).toBe("0");
    const approx = Number(String(reply.decimalApprox).replace(/…|\.\.\./g, ""));
    expect(Number.isFinite(approx), JSON.stringify(reply)).toBe(true);
    expect(approx.toFixed(9)).toBe("2.718281828");
    expect(Math.abs(approx - 2.718281828459045)).toBeLessThan(5e-10);
    scope.postMessage.mockClear();
    scope.onmessage!({data:{type:"evaluate",requestId:"SY-N-28-reentry",expressionAlgebrite:returned}});
    const repeated = scope.postMessage.mock.calls[0][0];
    expect(repeated.success).toBe(true);
    expect(evaluate("(" + parseExpression(repeated.resultLatex).algebrite + ")-exp(1)")).toBe("0");
  });


  it("SY-N-29: decimal comma cannot silently change the mathematical value", () => {
    const row = rows["SY-N-29"];
    expect(row.entrada).toBe("1,5+2");
    expect(row.operacion).toBe("convencion");
    let result: string | undefined;
    let rejection: unknown;
    try {
      const parsed = parseExpression(row.entrada).algebrite;
      result = evaluate(parsed);
    } catch (error) {
      rejection = error;
    }
    if (rejection !== undefined) {
      // The engine may reject the locale at parsing or evaluation.
      const error = rejection as { code?: unknown; message?: unknown };
      expect(error.code).toBe(ErrorCode.PARSE_ERROR);
      expect(String(error.message)).toMatch(/syntax|sintax|decimal|separador|comma|coma|invalid|inválid/i);
    } else {
      expect(result, "Accepted decimal-comma input must equal 3.5").toBe("7/2");
    }
  });


  it("SY-N-30: thousands separator markup must evaluate as 1001 or report a syntax error", () => {
    const row = rows["SY-N-30"];
    expect(row.entrada).toBe("1{,}000+1");
    expect(row.operacion).toBe("convencion");
    let value: string | undefined;
    let rejection: unknown;
    try {
      value = evaluate(parseExpression(row.entrada).algebrite);
    } catch (error) {
      rejection = error;
    }
    if (rejection !== undefined) {
      const err = rejection as { code?: unknown; message?: unknown };
      expect(err.code).toBe(ErrorCode.PARSE_ERROR);
      expect(String(err.message)).toMatch(/syntax|sintax|separator|separador|invalid|inválid|error/i);
    } else {
      expect(value, "Accepted thousands separator must yield 1001").toBe("1001");
    }
  });


  it("SY-N-31: small rational remains exact and approximates in scientific notation", () => {
    const row = rows["SY-N-31"];
    expect(row.entrada).toBe("\\frac{1}{3000000}");
    expect(row.operacion).toBe("valor");
    expect(row.esperado).toBe("3.333333333\\times10^{-7}");
    const parsed = parseExpression(row.entrada).algebrite;
    expect(evaluate(parsed)).toBe("1/3000000");
    scope.postMessage.mockClear();
    scope.onmessage!({data:{type:"evaluate",requestId:"SY-N-31",expressionAlgebrite:parsed}});
    const reply = scope.postMessage.mock.calls[0][0];
    expect(reply.success, JSON.stringify(reply)).toBe(true);
    expect(reply.requestId).toBe("SY-N-31");
    expect(evaluate(parseExpression(reply.resultLatex).algebrite)).toBe("1/3000000");
    const approx = Number(String(reply.decimalApprox).replace(/…|\\.\\.\\./g, ""));
    expect(Number.isFinite(approx)).toBe(true);
    expect(approx).toBeCloseTo(1 / 3000000, 13);
    expect(approx.toExponential(9)).toBe("3.333333333e-7");
    expect(formatScientificResult(String(reply.decimalApprox))).toBe(row.esperado);
    scope.postMessage.mockClear();
    scope.onmessage!({data:{type:"evaluate",requestId:"SY-N-31-reentry",expressionAlgebrite:parseExpression(reply.resultLatex).algebrite}});
    const repeated = scope.postMessage.mock.calls[0][0];
    expect(repeated.success).toBe(true);
    expect(evaluate(parseExpression(repeated.resultLatex).algebrite)).toBe("1/3000000");
  });

  it("SY-D-05: LaTeX left parenthesis and right bracket must reject delimiter mismatch", () => {
    const row = rows["SY-D-05"];
    expect(row.entrada).toBe(String.raw`\left(1+2\right]`);
    expect(row.operacion).toBe("error");
    let rejection: unknown;
    try {
      const parsed = parseExpression(row.entrada).algebrite;
      evaluate(parsed);
    } catch (error) {
      rejection = error;
    }
    expect(rejection, "Mismatched LaTeX delimiters must not silently evaluate to 3").toBeDefined();
    const diagnostic = rejection as { code?: unknown; message?: unknown };
    expect(diagnostic.code).toBe(ErrorCode.PARSE_ERROR);
    expect(String(diagnostic.message)).toMatch(/delimiter|delimitador|corchete|bracket|par[eé]ntesis|parenthes|mismatch|coincid|syntax|sintax|unexpected/i);
  });

  it("SY-D-04: mixed parenthesis and bracket must reject delimiter mismatch", () => {
    const row = rows["SY-D-04"];
    expect(row.entrada).toBe("(1+2]");
    expect(row.operacion).toBe("error");
    let rejection: unknown;
    try {
      const parsed = parseExpression(row.entrada).algebrite;
      evaluate(parsed);
    } catch (error) {
      rejection = error;
    }
    expect(rejection, "Incompatible delimiters must not evaluate to 3").toBeDefined();
    const diagnostic = rejection as { code?: unknown; message?: unknown };
    expect(diagnostic.code).toBe(ErrorCode.PARSE_ERROR);
    expect(String(diagnostic.message)).toMatch(/delimiter|delimitador|corchete|bracket|par[eé]ntesis|parenthes|mismatch|coincid|syntax|sintax|unexpected/i);
  });

  it("SY-D-03: empty parentheses must fail with an explicit syntax error", () => {
    const row = rows["SY-D-03"];
    expect(row.entrada).toBe("()");
    expect(row.operacion).toBe("error");
    let rejection: unknown;
    try {
      const parsed = parseExpression(row.entrada).algebrite;
      evaluate(parsed);
    } catch (error) {
      rejection = error;
    }
    expect(rejection, "Empty parentheses must not be evaluated as a valid number").toBeDefined();
    const diagnostic = rejection as { code?: unknown; message?: unknown };
    expect(diagnostic.code).toBe(ErrorCode.PARSE_ERROR);
    expect(String(diagnostic.message)).toMatch(/vac[ií]o|empty|par[eé]ntesis|parenthes|syntax|sintax|unexpected|expresi[oó]n/i);
  });

  it("SY-D-02: unmatched closing parenthesis must report an explicit parse error", () => {
    const row = rows["SY-D-02"];
    expect(row.entrada).toBe("2+3)");
    expect(row.operacion).toBe("error");
    let rejection: unknown;
    try {
      const parsed = parseExpression(row.entrada).algebrite;
      evaluate(parsed);
    } catch (error) {
      rejection = error;
    }
    expect(rejection, "An extra closing parenthesis must not silently evaluate").toBeDefined();
    const diagnostic = rejection as { code?: unknown; message?: unknown };
    expect(diagnostic.code).toBe(ErrorCode.PARSE_ERROR);
    expect(String(diagnostic.message)).toMatch(/par[eé]ntesis|parenthes|sobrante|closing|syntax|sintax|unexpected/i);
  });

  it("SY-D-01: unclosed opening parenthesis is rejected with a clear syntax diagnostic", () => {
    const row = rows["SY-D-01"];
    expect(row.entrada).toBe("(2+3");
    expect(row.operacion).toBe("error");
    let rejection: unknown;
    try {
      const parsed = parseExpression(row.entrada).algebrite;
      evaluate(parsed);
    } catch (error) {
      rejection = error;
    }
    expect(rejection, "An unmatched opening parenthesis must not silently evaluate to 5").toBeDefined();
    const diagnostic = rejection as { code?: unknown; message?: unknown };
    expect(diagnostic.code).toBe(ErrorCode.PARSE_ERROR);
    expect(String(diagnostic.message)).toMatch(/par[eé]ntesis|parenthes|unclos|cerrar|syntax|sintax/i);
  });


  it("SY-D-06: square-bracketed sum multiplied by three evaluates to nine with worker reentry", () => {
    const row = rows["SY-D-06"];
    expect(row.entrada).toBe(String.raw`[1+2]\cdot3`);
    expect(row.esperado).toBe("9");
    const parsed = parseExpression(row.entrada).algebrite;
    expect(evaluate(parsed)).toBe("9");
    scope.postMessage.mockClear();
    scope.onmessage!({ data: { type: "evaluate", requestId: "SY-D-06", expressionAlgebrite: parsed } });
    const reply = scope.postMessage.mock.calls[0][0];
    expect(reply.success, JSON.stringify(reply)).toBe(true);
    expect(evaluate(parseExpression(reply.resultLatex).algebrite)).toBe("9");
    scope.postMessage.mockClear();
    scope.onmessage!({ data: { type: "evaluate", requestId: "SY-D-06-reentry", expressionAlgebrite: parseExpression(reply.resultLatex).algebrite } });
    const repeated = scope.postMessage.mock.calls[0][0];
    expect(repeated.success).toBe(true);
    expect(evaluate(parseExpression(repeated.resultLatex).algebrite)).toBe("9");
  });

  it("SY-D-07: braced grouping yields nine or explicit syntax error", () => {
    const row = rows["SY-D-07"];
    expect(row.entrada).toBe("\\{1+2\\}\\cdot3");
    expect(row.operacion).toBe("convencion");
    let result: string | undefined;
    let rejection: unknown;
    try { result = evaluate(parseExpression(row.entrada).algebrite); } catch (error) { rejection = error; }
    if (rejection !== undefined) {
      const diagnostic = rejection as { code?: unknown; message?: unknown };
      expect(diagnostic.code).toBe(ErrorCode.PARSE_ERROR);
      expect(String(diagnostic.message)).toMatch(/llave|brace|set|conjunto|syntax|sintax|unrecognized|reconocid|invalid|inválid/i);
    } else { expect(result).toBe("9"); }
  });

  it("SY-D-08: LaTeX left/right parentheses preserve exponent and worker reentry", () => {
    const row = rows["SY-D-08"];
    expect(row.entrada).toBe(String.raw`\left(1+2\right)^{2}`);
    expect(row.operacion).toBe("valor");
    expect(row.esperado).toBe("9");
    const parsed = parseExpression(row.entrada).algebrite;
    expect(evaluate(parsed)).toBe("9");
    scope.postMessage.mockClear();
    scope.onmessage!({ data: { type: "evaluate", requestId: "SY-D-08", expressionAlgebrite: parsed } });
    const reply = scope.postMessage.mock.calls[0][0];
    expect(reply.success, JSON.stringify(reply)).toBe(true);
    expect(reply.requestId).toBe("SY-D-08");
    expect(evaluate(parseExpression(reply.resultLatex).algebrite)).toBe("9");
    scope.postMessage.mockClear();
    scope.onmessage!({ data: { type: "evaluate", requestId: "SY-D-08-reentry", expressionAlgebrite: parseExpression(reply.resultLatex).algebrite } });
    const repeated = scope.postMessage.mock.calls[0][0];
    expect(repeated.success).toBe(true);
    expect(evaluate(parseExpression(repeated.resultLatex).algebrite)).toBe("9");
  });

  it("SY-D-09: parenthesized fraction squared remains exact through worker reentry", () => {
    const row = rows["SY-D-09"];
    expect(row.entrada).toBe(String.raw`\left(\frac{1}{2}\right)^{2}`);
    expect(row.operacion).toBe("valor");
    expect(row.esperado).toBe(String.raw`\frac{1}{4}`);
    const parsed = parseExpression(row.entrada).algebrite;
    expect(evaluate(parsed)).toBe("1/4");
    scope.postMessage.mockClear();
    scope.onmessage!({ data: { type: "evaluate", requestId: "SY-D-09", expressionAlgebrite: parsed } });
    const reply = scope.postMessage.mock.calls[0][0];
    expect(reply.success, JSON.stringify(reply)).toBe(true);
    expect(reply.requestId).toBe("SY-D-09");
    expect(evaluate(parseExpression(reply.resultLatex).algebrite)).toBe("1/4");
    scope.postMessage.mockClear();
    scope.onmessage!({ data: { type: "evaluate", requestId: "SY-D-09-reentry", expressionAlgebrite: parseExpression(reply.resultLatex).algebrite } });
    const again = scope.postMessage.mock.calls[0][0];
    expect(again.success).toBe(true);
    expect(evaluate(parseExpression(again.resultLatex).algebrite)).toBe("1/4");
  });

  it("SY-D-10: adjacent grouped factors multiply to 21 through worker reentry", () => {
    const row = rows["SY-D-10"];
    expect(row.entrada).toBe("(1+2)(3+4)");
    expect(row.operacion).toBe("valor");
    expect(row.esperado).toBe("21");
    const parsed = parseExpression(row.entrada).algebrite;
    expect(evaluate(parsed)).toBe("21");
    scope.postMessage.mockClear();
    scope.onmessage!({ data: { type: "evaluate", requestId: "SY-D-10", expressionAlgebrite: parsed } });
    const reply = scope.postMessage.mock.calls[0][0];
    expect(reply.success, JSON.stringify(reply)).toBe(true);
    expect(evaluate(parseExpression(reply.resultLatex).algebrite)).toBe("21");
    scope.postMessage.mockClear();
    scope.onmessage!({ data: { type: "evaluate", requestId: "SY-D-10-reentry", expressionAlgebrite: parseExpression(reply.resultLatex).algebrite } });
    const again = scope.postMessage.mock.calls[0][0];
    expect(again.success).toBe(true);
    expect(evaluate(parseExpression(again.resultLatex).algebrite)).toBe("21");
  });

  it("SY-D-11: grouped factor next to numeric literal multiplies to nine and reenters", () => {
    const row = rows["SY-D-11"];
    expect(row.entrada).toBe("(1+2)3");
    expect(row.operacion).toBe("valor");
    expect(row.esperado).toBe("9");
    const parsed = parseExpression(row.entrada).algebrite;
    expect(evaluate(parsed)).toBe("9");
    scope.postMessage.mockClear();
    scope.onmessage!({ data: { type: "evaluate", requestId: "SY-D-11", expressionAlgebrite: parsed } });
    const reply = scope.postMessage.mock.calls[0][0];
    expect(reply.success, JSON.stringify(reply)).toBe(true);
    expect(evaluate(parseExpression(reply.resultLatex).algebrite)).toBe("9");
    scope.postMessage.mockClear();
    scope.onmessage!({ data: { type: "evaluate", requestId: "SY-D-11-reentry", expressionAlgebrite: parseExpression(reply.resultLatex).algebrite } });
    const repeated = scope.postMessage.mock.calls[0][0];
    expect(repeated.success).toBe(true);
    expect(evaluate(parseExpression(repeated.resultLatex).algebrite)).toBe("9");
  });

  it("SY-D-12: numeric literal next to grouped factor multiplies to nine and reenters", () => {
    const row = rows["SY-D-12"];
    expect(row.entrada).toBe("3(1+2)");
    expect(row.operacion).toBe("valor");
    expect(row.esperado).toBe("9");
    const parsed = parseExpression(row.entrada).algebrite;
    expect(evaluate(parsed)).toBe("9");
    scope.postMessage.mockClear();
    scope.onmessage!({ data: { type: "evaluate", requestId: "SY-D-12", expressionAlgebrite: parsed } });
    const reply = scope.postMessage.mock.calls[0][0];
    expect(reply.success, JSON.stringify(reply)).toBe(true);
    expect(evaluate(parseExpression(reply.resultLatex).algebrite)).toBe("9");
    scope.postMessage.mockClear();
    scope.onmessage!({ data: { type: "evaluate", requestId: "SY-D-12-reentry", expressionAlgebrite: parseExpression(reply.resultLatex).algebrite } });
    const repeated = scope.postMessage.mock.calls[0][0];
    expect(repeated.success).toBe(true);
    expect(evaluate(parseExpression(repeated.resultLatex).algebrite)).toBe("9");
  });

  it("SY-D-13: ten nested parentheses preserve exact unity through worker and reentry", () => {
    const row = rows["SY-D-13"];
    expect(row.entrada).toBe("(".repeat(10) + "1" + ")".repeat(10));
    expect(row.esperado).toBe("1");
    const parsed = parseExpression(row.entrada).algebrite;
    expect(evaluate(parsed)).toBe("1");
    scope.postMessage.mockClear();
    scope.onmessage!({ data: { type: "evaluate", requestId: "SY-D-13", expressionAlgebrite: parsed } });
    const result = scope.postMessage.mock.calls[0][0];
    expect(result.success, JSON.stringify(result)).toBe(true);
    expect(evaluate(parseExpression(result.resultLatex).algebrite)).toBe("1");
    scope.postMessage.mockClear();
    scope.onmessage!({ data: { type: "evaluate", requestId: "SY-D-13-reentry", expressionAlgebrite: parseExpression(result.resultLatex).algebrite } });
    const again = scope.postMessage.mock.calls[0][0];
    expect(again.success).toBe(true);
    expect(evaluate(parseExpression(again.resultLatex).algebrite)).toBe("1");
  });

  it("SY-D-14: double parentheses preserve two through worker and reentry", () => {
    const row = rows["SY-D-14"];
    expect(row.entrada).toBe("((2))");
    expect(row.operacion).toBe("valor");
    expect(row.esperado).toBe("2");
    const parsed = parseExpression(row.entrada).algebrite;
    expect(evaluate(parsed)).toBe("2");
    scope.postMessage.mockClear();
    scope.onmessage!({ data: { type: "evaluate", requestId: "SY-D-14", expressionAlgebrite: parsed } });
    const result = scope.postMessage.mock.calls[0][0];
    expect(result.success, JSON.stringify(result)).toBe(true);
    expect(evaluate(parseExpression(result.resultLatex).algebrite)).toBe("2");
    scope.postMessage.mockClear();
    scope.onmessage!({ data: { type: "evaluate", requestId: "SY-D-14-reentry", expressionAlgebrite: parseExpression(result.resultLatex).algebrite } });
    const again = scope.postMessage.mock.calls[0][0];
    expect(again.success).toBe(true);
    expect(evaluate(parseExpression(again.resultLatex).algebrite)).toBe("2");
  });

  it("SY-U-01: original multiplication sign yields exact twelve and reenters", () => {
    const row = rows["SY-U-01"];
    expect(row.entrada).toBe("3\\times4");
    expect(row.operacion).toBe("valor");
    expect(row.esperado).toBe("12");
    const parsed = parseExpression(row.entrada).algebrite;
    expect(evaluate(parsed)).toBe("12");
    scope.postMessage.mockClear();
    scope.onmessage!({data:{type:"evaluate",requestId:"SY-U-01",expressionAlgebrite:parsed}});
    expect(scope.postMessage).toHaveBeenCalledTimes(1);
    const result = scope.postMessage.mock.calls[0][0];
    expect(result.success, JSON.stringify(result)).toBe(true);
    expect(result.requestId).toBe("SY-U-01");
    expect(result.resultLatex).toBe("12");
    const returned = parseExpression(result.resultLatex).algebrite;
    expect(evaluate(returned)).toBe("12");
    scope.postMessage.mockClear();
    scope.onmessage!({data:{type:"evaluate",requestId:"SY-U-01-reentry",expressionAlgebrite:returned}});
    const repeated = scope.postMessage.mock.calls[0][0];
    expect(repeated.success).toBe(true);
    expect(repeated.requestId).toBe("SY-U-01-reentry");
    expect(repeated.resultLatex).toBe("12");
  });

});
