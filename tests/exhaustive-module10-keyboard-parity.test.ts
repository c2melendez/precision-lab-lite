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
import { tryPlusMinus } from "../src/engine/plusMinus";

const allKeys: KeyDef[] = [
  ...BASIC_V5_ROWS.flat(),
  ...SYMBOL_VARIABLES,
  ...SYMBOL_CONSTANTS,
  ...Object.values(CATEGORY_MENUS).flatMap((groups) => groups.flatMap((group) => group.keys)),
];
const keyByLabel = (label: string) => allKeys.find((key) => key.ariaLabel === label);

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

  it("mantiene divergencias documentadas de Lite sin convertirlas en teclas activas falsas", () => {
    for (const label of [
      "derivada parcial",
      "residuo en un polo (funciones racionales)",
      "singularidades (funciones racionales)",
    ]) {
      expect(keyByLabel(label)?.unavailable).toBe(true);
    }
  });

  it("porcentaje real: 50% = 0.5", () => {
    const parsed = parseExpression("50\\%");
    expect(Number(evaluate(`float(${parsed.algebrite})`))).toBeCloseTo(0.5, 12);
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
      expect(Number(evaluate(`float(${parsed.algebrite})`))).toBeCloseTo(expected, 6);
    }
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
