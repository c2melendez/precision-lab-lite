import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import fixture from "../qa/certification/syntax309_cases.jsonl?raw";
import { parseExpression } from "../src/engine/parsing";
import { evaluate, toLatex } from "../src/engine/algebriteClient";
import { compileNumeric } from "../src/engine/numericFallback";
import { ErrorCode } from "../src/types";

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

describe("Syntax309 SY-E-17..20 power conventions and domain — original Lite source", () => {
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
  it("SY-E-18: original cube-root power uses the principal complex branch", () => {
    const row = rows["SY-E-18"];
    expect(row.operacion).toBe("convencion");
    expect(row.entrada).toBe("(-8)^{\\frac{1}{3}}");
    expect(row.nota).toContain("declarar");
    const parsed = parseExpression(row.entrada).algebrite;
    const raw = evaluate(parsed);
    const reRaw = evaluate("real(" + raw + ")");
    const imRaw = evaluate("imag(" + raw + ")");
    console.info("SY-E-18_SOURCE_CHARACTERIZATION", JSON.stringify({ parsed, raw, reRaw, imRaw }));
    const re = compileNumeric(reRaw, "__unused__")(0);
    const im = compileNumeric(imRaw, "__unused__")(0);
    expect(Number.isFinite(re) && Number.isFinite(im), JSON.stringify({ raw, reRaw, imRaw })).toBe(true);
    expect(re).toBeCloseTo(1, 12);
    expect(im).toBeGreaterThan(0);
    expect(im).toBeCloseTo(1.7320508075688772, 12);
    expect(Number(evaluate("(" + raw + ")^3"))).toBe(-8);

    workerScope.postMessage.mockClear();
    workerScope.onmessage!({ data: {
      type: "evaluate", requestId: "SY-E-18", expressionAlgebrite: parsed,
    } });
    expect(workerScope.postMessage).toHaveBeenCalledTimes(1);
    const result = workerScope.postMessage.mock.calls[0][0];
    expect(result.success, JSON.stringify(result)).toBe(true);
    expect(result.requestId).toBe("SY-E-18");
    expect(result.resultLatex).toBeTypeOf("string");
    expect(result.resultLatex.length).toBeGreaterThan(0);
    expect(JSON.stringify(result)).not.toMatch(/NaN|Infinity/);
    const returned = parseExpression(result.resultLatex).algebrite;
    console.info("SY-E-18_WORKER_ROUNDTRIP", JSON.stringify({ raw, result, returned, roundtrip: evaluate(returned) }));
    expect(evaluate("(" + returned + ")-(" + raw + ")"), JSON.stringify({ result, returned })).toBe("0");
    // The original power is never substituted by cbrt() or root().
  });

  it("explicit odd real roots remain multiplicative atoms after a coefficient", () => {
    for (const [source, expected] of [
      ["2\\sqrt[3]{-1}", -2],
      ["3\\sqrt[3]{-8}", -6],
      ["2\\sqrt[3]{(-2)^{3}}", -4],
    ] as const) {
      expect(Number(evaluate(parseExpression(source).algebrite)), source).toBe(expected);
    }
  });
  it("numeric complex power output retains its branch on reentry", () => {
    for (const source of ["2*(-1)^(1/3)", "(-1)^(2/3)"]) {
      const raw = evaluate(source);
      const latex = toLatex(raw);
      expect(latex).toMatch(/i/);
      const returned = parseExpression(latex).algebrite;
      expect(evaluate("(" + returned + ")-(" + raw + ")"), latex).toBe("0");
    }
  });

  it("SY-E-19: declares the existing zero-to-zero convention as one", () => {
    const row = rows["SY-E-19"];
    expect(row.operacion).toBe("convencion");
    expect(row.entrada).toBe("0^{0}");
    expect(row.esperado).toContain("convención declarada");
    const parsed = parseExpression(row.entrada).algebrite;
    const raw = evaluate(parsed);
    console.info("SY-E-19_CONVENTION", JSON.stringify({ parsed, raw }));
    expect(raw).toBe("1");
    workerScope.postMessage.mockClear();
    workerScope.onmessage!({ data: {
      type: "evaluate", requestId: "SY-E-19", expressionAlgebrite: parsed,
    } });
    const result = workerScope.postMessage.mock.calls[0][0];
    expect(result.success, JSON.stringify(result)).toBe(true);
    expect(result.requestId).toBe("SY-E-19");
    expect(result.resultLatex).toBe("1");
    expect(evaluate(parseExpression(result.resultLatex).algebrite)).toBe("1");
  });
  it("SY-E-20: zero to a negative power is a clear domain error, then recovers", () => {
    const row = rows["SY-E-20"];
    expect(row.operacion).toBe("error");
    expect(row.entrada).toBe("0^{-1}");
    const parsed = parseExpression(row.entrada).algebrite;
    expect(() => evaluate(parsed)).toThrowError(expect.objectContaining({
      code: ErrorCode.DOMAIN_ERROR, message: expect.stringMatching(/cero|zero|divisi/i),
    }));
    workerScope.postMessage.mockClear();
    workerScope.onmessage!({ data: {
      type: "evaluate", requestId: "SY-E-20", expressionAlgebrite: parsed,
    } });
    const result = workerScope.postMessage.mock.calls[0][0];
    expect(result.success).toBe(false);
    expect(result.requestId).toBe("SY-E-20");
    expect(result.errorCode).toBe(ErrorCode.DOMAIN_ERROR);
    expect(result.errorMessage).toMatch(/cero|zero|divisi/i);
    expect(result.resultLatex).toBeNull();
    workerScope.postMessage.mockClear();
    workerScope.onmessage!({ data: {
      type: "evaluate", requestId: "SY-E-20-recovery", expressionAlgebrite: parseExpression("2+3").algebrite,
    } });
    const recovered = workerScope.postMessage.mock.calls[0][0];
    expect(recovered.success).toBe(true);
    expect(recovered.requestId).toBe("SY-E-20-recovery");
    expect(evaluate(parseExpression(recovered.resultLatex).algebrite)).toBe("5");
  });

  it("SY-E-21: abbreviated fraction preserves exact value and worker result reentry", () => {
    const row = rows["SY-E-21"];
    expect(row.operacion).toBe("valor");
    expect(row.entrada).toBe("\\frac12");
    expect(row.esperado).toBe("\\frac{1}{2}");
    const parsed = parseExpression(row.entrada).algebrite;
    expect(evaluate(parsed)).toBe("1/2");
    expect(compileNumeric(parsed, "__unused__")(0)).toBe(0.5);
    workerScope.postMessage.mockClear();
    workerScope.onmessage!({ data: {
      type: "evaluate", requestId: "SY-E-21", expressionAlgebrite: parsed,
    } });
    expect(workerScope.postMessage).toHaveBeenCalledTimes(1);
    const result = workerScope.postMessage.mock.calls[0][0];
    expect(result.success, JSON.stringify(result)).toBe(true);
    expect(result.requestId).toBe("SY-E-21");
    expect(result.resultLatex).toBeTypeOf("string");
    const returned = parseExpression(result.resultLatex).algebrite;
    expect(evaluate(returned)).toBe("1/2");
    expect(compileNumeric(returned, "__unused__")(0)).toBe(0.5);
    workerScope.postMessage.mockClear();
    workerScope.onmessage!({ data: {
      type: "evaluate", requestId: "SY-E-21-reentry", expressionAlgebrite: returned,
    } });
    const reentered = workerScope.postMessage.mock.calls[0][0];
    expect(reentered.success).toBe(true);
    expect(reentered.requestId).toBe("SY-E-21-reentry");
    expect(evaluate(parseExpression(reentered.resultLatex).algebrite)).toBe("1/2");
  });

});
