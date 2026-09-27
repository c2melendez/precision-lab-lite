import { describe, expect, it } from "vitest";

import { BASIC_V5_ROWS } from "../src/components/KeyboardBasicPanel";
import {
  CATEGORY_MENUS,
  SYMBOL_CONSTANTS,
  SYMBOL_VARIABLES,
  type KeyDef,
} from "../src/components/MathKeyboard";

const allCategoryKeys = Object.values(CATEGORY_MENUS).flatMap((groups) =>
  groups.flatMap((group) => group.keys),
);
const allKeys: KeyDef[] = [
  ...BASIC_V5_ROWS.flat(),
  ...SYMBOL_VARIABLES,
  ...SYMBOL_CONSTANTS,
  ...allCategoryKeys,
];

const ACTION_LABELS = new Set([
  "borrar",
  "borrar todo el campo",
  "insertar el último resultado",
  "calcular",
  "graficar en el plano de Argand",
]);

describe("Suite exhaustiva original — Módulo 10: inventario teclado Lite", () => {
  it("mantiene el inventario V5 esperado por superficie", () => {
    expect(BASIC_V5_ROWS.flat()).toHaveLength(23);
    expect(SYMBOL_VARIABLES).toHaveLength(11);
    expect(SYMBOL_CONSTANTS).toHaveLength(6);
    for (const family of ["Álgebra", "Trigonométricas", "Cálculo", "Complejos", "Unidades", "Más"] as const) {
      expect(CATEGORY_MENUS[family]?.length, family).toBeGreaterThan(0);
      expect(CATEGORY_MENUS[family].flatMap(g => g.keys).length, family).toBeGreaterThan(0);
    }

    const trig = CATEGORY_MENUS["Trigonométricas"].flatMap(g => g.keys).map(k => k.ariaLabel);
    expect(trig).toEqual(expect.arrayContaining([
      "sin", "cos", "tan",
      "sinh", "cosh", "tanh",
      "sinh inversa", "cosh inversa", "tanh inversa",
    ]));

    const calculus = CATEGORY_MENUS["Cálculo"].flatMap(g => g.keys).map(k => k.ariaLabel);
    expect(calculus).toEqual(expect.arrayContaining([
      "integral indefinida",
      "integral definida",
      "sumatoria",
      "productoria",
      "límite",
      "límite al infinito",
      "límite lateral por la izquierda",
      "límite lateral por la derecha",
    ]));
  });

  it("toda tecla visible tiene etiqueta y tooltip utilizable", () => {
    for (const key of allKeys) {
      expect(key.ariaLabel.trim(), JSON.stringify(key)).not.toBe("");
      expect((key.description ?? key.ariaLabel).trim(), key.ariaLabel).not.toBe("");
    }
  });

  it("toda tecla matemática activa tiene inserción o acción explícita", () => {
    for (const key of allKeys.filter(k => !k.unavailable)) {
      if (ACTION_LABELS.has(key.ariaLabel)) continue;
      expect(key.insertLatex.trim(), key.ariaLabel).not.toBe("");
    }
  });

  it("M20 cierra las divergencias documentadas: no quedan teclas unavailable", () => {
    const unavailable = [...new Set(allKeys.filter(k => k.unavailable).map(k => k.ariaLabel))].sort();
    expect(unavailable).toEqual([]);
  });
});
