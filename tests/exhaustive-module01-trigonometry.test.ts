import { describe, expect, it } from "vitest";
import { parseExpression } from "../src/engine/parsing";
import { compileNumeric } from "../src/engine/numericFallback";

function numeric(expression: string, angle: "RAD" | "GRAD" = "RAD"): number {
  const parsed = parseExpression(expression, angle);
  const fn = compileNumeric(parsed.algebrite, "__no_var__");
  return fn(0);
}

describe("Suite exhaustiva original — Módulo 1: Trigonometría", () => {
  const known: Array<[string, number]> = [
    ["sin(0)", 0],
    ["sin(pi/2)", 1],
    ["cos(0)", 1],
    ["cos(pi)", -1],
    ["tan(pi/4)", 1],
    ["sec(0)", 1],
    ["csc(pi/2)", 1],
    ["cot(pi/4)", 1],
    ["asin(1)", Math.PI / 2],
    ["acos(1)", 0],
    ["atan(1)", Math.PI / 4],
    ["sinh(0)", 0],
    ["cosh(0)", 1],
    ["tanh(0)", 0],
    ["asinh(0)", 0],
    ["acosh(1)", 0],
    ["atanh(0)", 0],
    ["asech(1)", 0],
    ["acsch(1)", Math.asinh(1)],
    ["acoth(2)", 0.5 * Math.log(3)],
  ];

  for (const [expression, expected] of known) {
    it(`${expression} = valor conocido`, () => {
      expect(numeric(expression)).toBeCloseTo(expected, 10);
    });
  }

  for (const [expression, expected] of [
    ["sin(30)", 0.5],
    ["cos(60)", 0.5],
    ["tan(45)", 1],
  ] as Array<[string, number]>) {
    it(`${expression} en grados`, () => {
      expect(numeric(expression, "GRAD")).toBeCloseTo(expected, 10);
    });
  }

  for (const expression of [
    "tan(pi/2)",
    "sec(pi/2)",
    "csc(0)",
    "cot(0)",
    "atanh(1)",
    "asech(0)",
    "acoth(1)",
  ]) {
    it(`${expression} no produce un valor finito silencioso`, () => {
      const result = numeric(expression);
      expect(Number.isFinite(result)).toBe(false);
    });
  }
});


describe("S26.3 — inversas devuelven grados en modo GRAD", () => {
  for (const [expression, expected] of [
    ["asin(1)", 90],
    ["acos(1)", 0],
    ["atan(1)", 45],
    ["arcsin(0.5)", 30],
  ] as Array<[string, number]>) {
    it(`${expression} devuelve grados`, () => {
      expect(numeric(expression, "GRAD")).toBeCloseTo(expected, 10);
    });
  }

  it("preserva composición directa(inversa) en modo grados", () => {
    expect(numeric("sin(asin(0.5))", "GRAD")).toBeCloseTo(0.5, 10);
  });
});
