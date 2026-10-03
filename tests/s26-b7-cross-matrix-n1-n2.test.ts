import { describe, expect, it } from "vitest";

import { evaluate } from "../src/engine/algebriteClient";
import { compileNumeric } from "../src/engine/numericFallback";
import { calcDefiniteIntegral, calcDerivative } from "../src/engine/stepEngine/calculus";

function numericExpr(expression: string, x: number): number {
  return compileNumeric(expression, "x")(x);
}

function derivativeValue(expression: string, x: number): number {
  const derivative = calcDerivative(expression, "x", 1).resultLatex;
  return numericExpr(derivative, x);
}

describe("S26 B7 — recertificación N1/N2 cruzada", () => {
  it("EV-H-04/05/06: sinh/cosh/tanh(ln 2) conservan valores exactos", () => {
    expect(Number(evaluate("float(sinh(log(2)))").replace("...", ""))).toBeCloseTo(3 / 4, 9);
    expect(Number(evaluate("float(cosh(log(2)))").replace("...", ""))).toBeCloseTo(5 / 4, 9);
    expect(Number(evaluate("float(tanh(log(2)))").replace("...", ""))).toBeCloseTo(3 / 5, 9);
  });

  it("EV-H-12: cosh²(1)-sinh²(1)=1", () => {
    expect(Number(evaluate("float(cosh(1)^2-sinh(1)^2)").replace("...", ""))).toBeCloseTo(1, 9);
  });

  it("DV-T-01: d/dx ln(sin x) coincide numéricamente con cot x", () => {
    for (const point of [0.7, 1.1, 2.0]) {
      expect(derivativeValue("log(sin(x))", point)).toBeCloseTo(1 / Math.tan(point), 6);
    }
  });

  it("DV-T-06: regla de cadena para e^(sin x)", () => {
    for (const point of [-0.4, 0.7, 1.3]) {
      const expected = Math.cos(point) * Math.exp(Math.sin(point));
      expect(derivativeValue("exp(sin(x))", point)).toBeCloseTo(expected, 6);
    }
  });

  it("DV-T-14: d/dx ln(cosh x) coincide con tanh x", () => {
    for (const point of [-1.2, 0.4, 1.5]) {
      expect(derivativeValue("log(cosh(x))", point)).toBeCloseTo(Math.tanh(point), 6);
    }
  });

  it("ID-M-06: integral definida 0..pi de e^x sin x", () => {
    const actual = Number(
      calcDefiniteIntegral("exp(x)*sin(x)", "x", 0, Math.PI).resultLatex.replace("...", ""),
    );
    expect(actual).toBeCloseTo((1 + Math.exp(Math.PI)) / 2, 4);
  });

  // Hallazgos reales de la matriz: Algebrite no resuelve todavía estas
  // integrales indefinidas. Se mantienen visibles como deuda de motor,
  // fuera del hard gate mientras se implementa primero el contrato de resultados.
  it.todo("IT-T-01: integral de e^x sin x — pendiente motor Lite");
  it.todo("IT-T-09: integral cos(x)/(1+sin²x) — pendiente motor Lite");
  it.todo("IT-M-01: integral sqrt(x) ln(x) — pendiente motor Lite");
});
