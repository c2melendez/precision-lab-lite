import { describe, expect, it } from "vitest";
import { parseExpression } from "../src/engine/parsing";
import { evaluate } from "../src/engine/algebriteClient";
import { calcDefiniteIntegral, calcDerivative, calcLimit } from "../src/engine/stepEngine/calculus";

describe("Suite exhaustiva original — Módulo 3: Cálculo", () => {
  it("derivada conocida x^3 -> 3x^2", () => {
    expect(calcDerivative("x^3", "x", 1).resultLatex.replace(/\s/g, "")).toMatch(/3\*?x\^2/);
  });

  it("derivada orden 4 de x^5 -> 120x", () => {
    expect(calcDerivative("x^5", "x", 4).resultLatex.replace(/\s/g, "")).toMatch(/120\*?x/);
  });

  it("integral definida 0..2 de x^2 -> 8/3", () => {
    const value = Number(calcDefiniteIntegral("x^2", "x", 0, 2).resultLatex.replace("...", ""));
    expect(value).toBeCloseTo(8 / 3, 4);
  });

  it("límite sin(x)/x en 0 -> 1", () => {
    const r = calcLimit("sin(x)/x", "x", "0", 0, "both");
    expect(Number(r.resultLatex.replace("...", ""))).toBeCloseTo(1, 3);
  });

  it("límite 1/x en +infinito -> 0", () => {
    const r = calcLimit("1/x", "x", "oo", 0, "both");
    expect(Number(r.resultLatex.replace("...", ""))).toBeCloseTo(0, 3);
  });

  it("límite lateral derecho 1/x en 0 no explota", () => {
    const r = calcLimit("1/x", "x", "0", 0, "right");
    expect(r.resultLatex).toBeDefined();
  });

  it("límite bilateral 1/x en 0 se identifica como inexistente", () => {
    expect(() => calcLimit("1/x", "x", "0", 0, "both")).toThrow();
  });

  it("sumatoria 1+2+3+4+5 -> 15", () => {
    const parsed = parseExpression("\\sum_{i=1}^{5}i");
    expect(parsed.algebrite).toBe("sum((i),i,1,5)");
    expect(Number(evaluate(parsed.algebrite))).toBe(15);
  });

  it("sumatoria mal formada se rechaza explícitamente", () => {
    expect(() => parseExpression("\\sum_{i}^{5}i")).toThrow();
  });
});
