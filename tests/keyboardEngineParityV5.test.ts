import { describe, expect, it } from "vitest";

import { parseExpression } from "../src/engine/parsing";
import { BASIC_V5_ROWS, type KeyDef } from "../src/components/KeyboardBasicPanel";
import {
  CATEGORY_MENUS,
  SYMBOL_CONSTANTS,
  SYMBOL_VARIABLES,
} from "../src/components/MathKeyboard";

const allKeys: KeyDef[] = [
  ...BASIC_V5_ROWS.flat(),
  ...SYMBOL_VARIABLES,
  ...SYMBOL_CONSTANTS,
  ...Object.values(CATEGORY_MENUS).flatMap((groups) =>
    groups.flatMap((group) => group.keys),
  ),
];

const keyByLabel = (label: string) =>
  allKeys.find((key) => key.ariaLabel === label);

type ParityCase = {
  label: string;
  expression: string;
};

const PARITY_CASES: ParityCase[] = [
  { label: "sin", expression: "sin(pi/2)" },
  { label: "cos", expression: "cos(0)" },
  { label: "tan", expression: "tan(pi/4)" },
  { label: "sec", expression: "sec(0)" },
  { label: "csc", expression: "csc(pi/2)" },
  { label: "cot", expression: "cot(pi/4)" },
  { label: "sinh", expression: "sinh(1)" },
  { label: "csch", expression: "csch(1)" },
  { label: "sinh inversa", expression: "asinh(1)" },
  { label: "logaritmo base 10", expression: "log(100)" },
  { label: "logaritmo con base", expression: "log(8,2)" },
  { label: "exponencial", expression: "exp(1)" },
  { label: "raíz cuadrada de a", expression: "sqrt(9)" },
  { label: "raíz de índice n editable", expression: "\\sqrt[3]{27}" },
  { label: "signo de a", expression: "sign(-4)" },
  { label: "módulo o residuo", expression: "mod(10,3)" },
];

describe("paridad tecla → parser del teclado V5", () => {
  it.each(PARITY_CASES)(
    "encuentra la tecla funcional: $label",
    ({ label }) => {
      const key = keyByLabel(label);
      expect(key, "No existe una tecla con ariaLabel " + label).toBeDefined();
      expect(key?.unavailable, "La tecla está marcada unavailable: " + label).toBeFalsy();
      expect(key?.insertLatex.trim(), "La tecla no tiene inserción: " + label).not.toBe("");
    },
  );

  it.each(PARITY_CASES)(
    "acepta la expresión representativa de: $label",
    ({ expression }) => {
      expect(() => parseExpression(expression), expression).not.toThrow();
    },
  );

  it("M20 activa Res y Sing como capacidades funcionales", () => {
    for (const label of [
      "residuo en un polo (funciones racionales)",
      "singularidades (funciones racionales)",
    ]) {
      const key = keyByLabel(label);
      expect(key, "No existe la tecla " + label).toBeDefined();
      expect(key?.unavailable, "La tecla sigue marcada unavailable: " + label).toBeFalsy();
      expect(key?.insertLatex.trim(), "La tecla no inserta plantilla: " + label).not.toBe("");
    }
  });
});
