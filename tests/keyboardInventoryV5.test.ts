import { describe, expect, it } from "vitest";

import { BASIC_V5_ROWS } from "../src/components/KeyboardBasicPanel";
import {
  CATEGORY_MENUS,
  SYMBOL_CONSTANTS,
  SYMBOL_FUNCTIONS,
  SYMBOL_VARIABLES,
  type KeyDef,
} from "../src/components/MathKeyboard";

const EDITOR_ACTIONS = new Set([
  "borrar",
  "borrar todo el campo",
  "insertar el último resultado",
  "calcular",
  "graficar en el plano de Argand",
]);

const allKeyboardKeys: KeyDef[] = [
  ...BASIC_V5_ROWS.flat(),
  ...SYMBOL_VARIABLES,
  ...SYMBOL_CONSTANTS,
  ...SYMBOL_FUNCTIONS,
  ...Object.values(CATEGORY_MENUS).flatMap((groups) =>
    groups.flatMap((group) => group.keys),
  ),
];

const functionalKeys = allKeyboardKeys.filter(
  (key) => !key.unavailable && !EDITOR_ACTIONS.has(key.ariaLabel),
);

describe("inventario estructural del teclado V5 de Lite", () => {
  it("contiene al menos una definición en cada categoría", () => {
    expect(BASIC_V5_ROWS.length).toBeGreaterThan(0);
    expect(SYMBOL_VARIABLES.length).toBeGreaterThan(0);
    expect(SYMBOL_CONSTANTS.length).toBeGreaterThan(0);

    for (const groups of Object.values(CATEGORY_MENUS)) {
      expect(groups.length).toBeGreaterThan(0);
      expect(groups.flatMap((group) => group.keys).length).toBeGreaterThan(0);
    }
  });

  it("B6 mantiene el núcleo compacto y expulsa teclas contextuales", () => {
    const labels = BASIC_V5_ROWS.flat().map((key) => key.ariaLabel);
    expect(BASIC_V5_ROWS.map((row) => row.length)).toEqual([6, 6, 6, 5]);
    expect(labels).toContain("igual");
    expect(labels).toContain("calcular");
    expect(labels).toContain("borrar");
    expect(labels).not.toContain("grados");
    expect(labels).not.toContain("grados minutos segundos");
    expect(labels).not.toContain("prima");
    expect(labels).not.toContain("menor que");
    expect(labels).not.toContain("mayor que");
    expect(labels).not.toContain("menor o igual que");
    expect(labels).not.toContain("mayor o igual que");
  });


  it("B6 expone las siete familias contextuales y amplía Símbolos", () => {
    expect(Object.keys(CATEGORY_MENUS)).toEqual(expect.arrayContaining([
      "Álgebra",
      "Trigonométricas",
      "Cálculo",
      "Complejos",
      "Unidades",
      "Más",
    ]));

    const variableLabels = SYMBOL_VARIABLES.map((key) => key.ariaLabel);
    for (const label of ["variable t", "variable a", "variable b", "variable c", "variable n"]) {
      expect(variableLabels).toContain(label);
    }

    expect(SYMBOL_CONSTANTS.map((key) => key.ariaLabel)).toContain("tau");
    expect(SYMBOL_FUNCTIONS.map((key) => key.ariaLabel)).toEqual(["función f", "función g", "función h"]);

    const algebra = (CATEGORY_MENUS.Álgebra ?? []).flatMap((group) => group.keys);
    expect(algebra.map((key) => key.ariaLabel)).not.toContain("exponencial");
    expect(algebra.map((key) => key.ariaLabel)).toContain("operador de potencia");

    const units = (CATEGORY_MENUS.Unidades ?? []).flatMap((group) => group.keys);
    expect(units.map((key) => key.ariaLabel)).toEqual(expect.arrayContaining([
      "grados",
      "prima",
      "grados minutos segundos",
      "fracción",
      "fracción mixta",
      "pi",
    ]));
  });

  it("no deja teclas sin etiqueta accesible", () => {
    for (const key of allKeyboardKeys) {
      expect(key.ariaLabel.trim()).not.toBe("");
    }
  });

  it("mantiene tooltip o descripción en cada tecla", () => {
    for (const key of allKeyboardKeys) {
      expect((key.description ?? key.ariaLabel).trim()).not.toBe("");
    }
  });

  it("no marca como disponible una tecla matemática sin inserción", () => {
    for (const key of functionalKeys) {
      expect(key.insertLatex.trim()).not.toBe("");
    }
  });

  it("M20 no deja capacidades del teclado marcadas como no disponibles", () => {
    const unavailableLabels = allKeyboardKeys
      .filter((key) => key.unavailable)
      .map((key) => key.ariaLabel);

    expect(unavailableLabels).toEqual([]);
  });
});
