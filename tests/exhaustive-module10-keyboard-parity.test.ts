import { describe, expect, it } from "vitest";
import { BASIC_V5_ROWS } from "../src/components/KeyboardBasicPanel";
import {
  CATEGORY_MENUS,
  SYMBOL_CONSTANTS,
  SYMBOL_VARIABLES,
  type KeyDef,
} from "../src/components/MathKeyboard";
import { parseExpression } from "../src/engine/parsing";
import { evaluate } from "../src/engine/algebriteClient";
import { compileNumeric } from "../src/engine/numericFallback";
import { tryPlusMinus } from "../src/engine/plusMinus";

const allKeys: KeyDef[] = [
  ...BASIC_V5_ROWS.flat(),
  ...SYMBOL_VARIABLES,
  ...SYMBOL_CONSTANTS,
  ...Object.values(CATEGORY_MENUS).flatMap((groups) => groups.flatMap((group) => group.keys)),
];
const keyByLabel = (label: string) => allKeys.find((key) => key.ariaLabel === label);

function numeric(latex: string): number {
  const parsed = parseExpression(latex);
  return compileNumeric(parsed.algebrite, "__no_var__")(0);
}

describe("Suite exhaustiva original — Módulo 10: teclado ↔ motor (Lite)", () => {
  it("todo KeyDef visible tiene etiqueta y tooltip/descripcion utilizable", () => {
    for (const key of allKeys) {
      expect(key.ariaLabel.trim()).not.toBe("");
      expect((key.description ?? key.ariaLabel).trim()).not.toBe("");
    }
  });

  it("Productoria Π cumple el requisito actualizado: activa y con plantilla real", () => {
    const product = keyByLabel("productoria");
    expect(product).toBeDefined();
    expect(product?.unavailable).toBeFalsy();
    expect(product?.insertLatex.trim()).not.toBe("");
  });

  it("M20 activa las dos capacidades complejas antes documentadas como divergencias", () => {
    for (const label of [
      "residuo en un polo (funciones racionales)",
      "singularidades (funciones racionales)",
    ]) {
      expect(keyByLabel(label)).toBeDefined();
      expect(keyByLabel(label)?.unavailable).toBeFalsy();
      expect(keyByLabel(label)?.insertLatex.trim()).not.toBe("");
    }
  });

  it("porcentaje real: 50% = 0.5", () => {
    const parsed = parseExpression("50%");
    expect(parseFloat(evaluate(`float(${parsed.algebrite})`))).toBeCloseTo(0.5, 12);
  });

  it("± real: ±(5) produce ambas ramas", () => {
    const parsed = parseExpression("\\pm\\left(5\\right)");
    expect(tryPlusMinus(parsed.algebrite)).toBe("[5,-5]");
  });

  it("grados y DMS tienen semantica evaluable", () => {
    for (const [latex, expected] of [
      ["90°", Math.PI / 2],
      ["45°30′", 45.5 * Math.PI / 180],
      ["45°30′15″", (45 + 30/60 + 15/3600) * Math.PI / 180],
    ] as const) {
      const parsed = parseExpression(latex);
      expect(parseFloat(evaluate(`float(${parsed.algebrite})`))).toBeCloseTo(expected, 6);
    }
  });

  it.each([
    ["sin", "\\sin\\left(\\frac{\\pi}{6}\\right)", 0.5],
    ["cos", "\\cos\\left(\\frac{\\pi}{3}\\right)", 0.5],
    ["tan", "\\tan\\left(\\frac{\\pi}{4}\\right)", 1],
    ["csc", "\\csc\\left(\\frac{\\pi}{2}\\right)", 1],
    ["sec", "\\sec\\left(0\\right)", 1],
    ["cot", "\\cot\\left(\\frac{\\pi}{4}\\right)", 1],
    ["sin inversa", "\\sin^{-1}\\left(0.5\\right)", Math.PI/6],
    ["cos inversa", "\\cos^{-1}\\left(0.5\\right)", Math.PI/3],
    ["tan inversa", "\\tan^{-1}\\left(1\\right)", Math.PI/4],
    ["csc inversa", "\\csc^{-1}\\left(2\\right)", Math.PI/6],
    ["sec inversa", "\\sec^{-1}\\left(2\\right)", Math.PI/3],
    ["cot inversa", "\\cot^{-1}\\left(1\\right)", Math.PI/4],
    ["sinh", "sinh\\left(0\\right)", 0],
    ["cosh", "cosh\\left(0\\right)", 1],
    ["tanh", "tanh\\left(0\\right)", 0],
    ["csch", "csch\\left(1\\right)", 1/Math.sinh(1)],
    ["sech", "sech\\left(0\\right)", 1],
    ["coth", "coth\\left(1\\right)", 1/Math.tanh(1)],
    ["sinh inversa", "sinh^{-1}\\left(1\\right)", Math.asinh(1)],
    ["cosh inversa", "cosh^{-1}\\left(2\\right)", Math.acosh(2)],
    ["tanh inversa", "tanh^{-1}\\left(0.5\\right)", Math.atanh(0.5)],
    ["csch inversa", "csch^{-1}\\left(2\\right)", Math.asinh(0.5)],
    ["sech inversa", "sech^{-1}\\left(0.5\\right)", Math.acosh(2)],
    ["coth inversa", "coth^{-1}\\left(2\\right)", Math.atanh(0.5)],
  ] as const)("las 24 teclas trigonométricas tienen semántica: %s", (_label, latex, expected) => {
    expect(numeric(latex)).toBeCloseTo(expected, 7);
  });

  it("plantillas reales de inversas trig y log con base llegan al parser", () => {
    for (const latex of [
      "\\sin^{-1}\\left(0.5\\right)",
      "\\csc^{-1}\\left(2\\right)",
      "\\log_{2}\\left(8\\right)",
    ]) {
      expect(() => parseExpression(latex), latex).not.toThrow();
    }
  });
});
