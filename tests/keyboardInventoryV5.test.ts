import { describe, expect, it } from "vitest";

import { BASIC_V5_ROWS } from "../src/components/KeyboardBasicPanel";
import {
  CATEGORY_MENUS,
  SYMBOL_CONSTANTS,
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

  it("conserva las capacidades conocidas como no disponibles", () => {
    const unavailableLabels = allKeyboardKeys
      .filter((key) => key.unavailable)
      .map((key) => key.ariaLabel);

    expect(unavailableLabels).toEqual(
      expect.arrayContaining([
        "derivada parcial",
        "residuo en un polo (funciones racionales)",
        "singularidades (funciones racionales)",
      ]),
    );
  });
});
