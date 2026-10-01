import { describe, expect, it } from "vitest";
import { angleAwareTrigInsertLatex, key } from "./MathKeyboard";

describe("S26.3 — plantillas trigonométricas sensibles al modo angular", () => {
  for (const fn of ["sin", "cos", "tan", "sec", "csc", "cot"]) {
    it(`${fn} inserta ° dentro del argumento en GRAD`, () => {
      const k = key(fn, `\\${fn}\\left(#0\\right)`, fn);
      expect(angleAwareTrigInsertLatex(k, true)).toBe(`\\${fn}\\left(#0^{\\circ}\\right)`);
    });

    it(`${fn} conserva plantilla normal en RAD`, () => {
      const k = key(fn, `\\${fn}\\left(#0\\right)`, fn);
      expect(angleAwareTrigInsertLatex(k, false)).toBe(`\\${fn}\\left(#0\\right)`);
    });
  }

  it("no agrega grados a una función inversa", () => {
    const k = key({ sup: "-1", base: "sin" }, "\\sin^{-1}\\left(#0\\right)", "sin inversa");
    expect(angleAwareTrigInsertLatex(k, true)).toBe("\\sin^{-1}\\left(#0\\right)");
  });
});
