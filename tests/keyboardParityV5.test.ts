import { describe, expect, it } from "vitest";

import { BASIC_V5_ROWS } from "../src/components/KeyboardBasicPanel";
import { CATEGORY_MENUS, SYMBOL_CONSTANTS, SYMBOL_VARIABLES } from "../src/components/MathKeyboard";

const basicKeys = BASIC_V5_ROWS.flat();
const byLabel = (label: string) => basicKeys.find((key) => key.ariaLabel === label);

describe("paridad del teclado V5 de Lite", () => {
  it("concentra controles en Básico y deja igual como inserción", () => {
    expect(byLabel("borrar todo el campo")).toBeDefined();
    expect(byLabel("insertar el último resultado")).toBeDefined();
    expect(byLabel("grados minutos segundos")?.insertLatex).toBe("#0°#1′#2″");
    expect(byLabel("prima")?.insertLatex).toBe("'");
    expect(byLabel("igual")?.insertLatex).toBe("=");
    expect(byLabel("calcular")?.insertLatex).toBe("");
    expect(basicKeys.some((key) => key.ariaLabel === "variable x")).toBe(false);
    expect(basicKeys.some((key) => key.ariaLabel === "pi")).toBe(false);
  });

  it("separa variables y constantes con Phi angular y phi áureo", () => {
    expect(SYMBOL_VARIABLES.find((key) => key.ariaLabel === "Phi mayúscula")?.insertLatex).toBe("\\Phi");
    expect(SYMBOL_CONSTANTS.find((key) => key.ariaLabel === "número áureo phi")?.insertLatex).toBe(
      "\\frac{1+\\sqrt{5}}{2}",
    );
  });

  it("mantiene todas las teclas documentadas con tooltip", () => {
    const advancedKeys = Object.values(CATEGORY_MENUS).flatMap((groups) => groups.flatMap((group) => group.keys));
    for (const key of [...basicKeys, ...SYMBOL_VARIABLES, ...SYMBOL_CONSTANTS, ...advancedKeys]) {
      expect(key.description ?? key.ariaLabel).not.toBe("");
    }
  });

  it("expone signo y módulo en Álgebra y conserva límites reales", () => {
    const algebra = CATEGORY_MENUS["Álgebra"].flatMap((group) => group.keys);
    expect(algebra.find((key) => key.ariaLabel === "signo de a")?.insertLatex).toBe(
      "\\mathrm{sign}\\left(#0\\right)",
    );
    expect(algebra.find((key) => key.ariaLabel === "módulo o residuo")?.insertLatex).toBe(
      "\\mathrm{mod}\\left(#0,#1\\right)",
    );

    const calculus = CATEGORY_MENUS["Cálculo"].flatMap((group) => group.keys);
    expect(calculus.find((key) => key.ariaLabel === "límite")?.unavailable).toBe(false);
    expect(calculus.find((key) => key.ariaLabel === "derivada parcial")?.unavailable).toBe(false);
    const product = calculus.find((key) => key.ariaLabel === "productoria");
    expect(product?.unavailable).toBeFalsy();
    expect(product?.insertLatex).toContain("\\prod");
  });
  it("B6 congela el inventario visual y exige tooltip real en todas las teclas de Básico", () => {
    expect(BASIC_V5_ROWS.map((row) => row.map((key) => String(key.glyph)))).toEqual([
      ["7", "8", "9", "(", ")", "⌫", "DEL", "ANS"],
      ["4", "5", "6", "×", "÷", "%", "<", ">"],
      ["1", "2", "3", "+", "−", ".", "=", "′"],
      ["0", "°", "DMS", "±()", "≤", "≥", "Enter"],
    ]);
    expect(basicKeys).toHaveLength(31);
    for (const key of basicKeys) {
      expect(key.description, `tooltip faltante en ${key.ariaLabel}`).toBeTruthy();
    }
    expect(byLabel("calcular")?.glyph).toBe("Enter");
  });

});
