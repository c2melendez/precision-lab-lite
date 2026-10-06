import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { preprocessLatex } from "../src/engine/parsing/normalize";

const inputSrc = readFileSync("src/components/NaturalInput.tsx", "utf8");
const keyboardSrc = readFileSync("src/components/MathKeyboard.tsx", "utf8");

describe("IN625 G1a — contrato estructural del teclado", () => {
  it("EN-TC-24 desactiva autocorrección/capitalización móvil", () => {
    expect(inputSrc).toContain('autoCapitalize="off"');
    expect(inputSrc).toContain('autoCorrect="off"');
    expect(inputSrc).toContain("spellCheck={false}");
  });

  it("EN-TC-18 plantillas virtuales x², xʸ, raíz y fracción", () => {
    expect(keyboardSrc).toContain('"#0^2"');
    expect(keyboardSrc).toContain('"#0^{#1}"');
    expect(keyboardSrc).toContain('"\\sqrt{#0}"');
    expect(keyboardSrc).toContain('"\\frac{#0}{#1}"');
  });

  it("EN-TC-19 inversas/log/ln/10^x/e^x están cableadas", () => {
    expect(keyboardSrc).toContain('{ sup: "-1", base: f }');
    expect(keyboardSrc).toContain(String.raw\`\\\${f}^{-1}\\left(#0\\right)\`);
    expect(keyboardSrc).toContain('"\\log\\left(#0\\right)"');
    expect(keyboardSrc).toContain('"\\ln\\left(#0\\right)"');
    expect(keyboardSrc).toContain('"10^{#0}"');
    expect(keyboardSrc).toContain('"e^{#0}"');
  });

  it("EN-TC-12 símbolos/relaciones principales existen", () => {
    for (const token of ["\\pi","\\theta","\\le","\\ge","\\cdot"]) {
      expect(keyboardSrc).toContain(token);
    }
  });

  it("EN-TC-20/22 wiring estructural de borrar y Enter", () => {
    expect(keyboardSrc).toContain('k.glyph === "⏎"');
    expect(keyboardSrc).toContain("onEnter?.()");
    expect(keyboardSrc).toContain('k.glyph === "⌫"');
    expect(keyboardSrc).toContain("onBackspace?.()");
  });

  it("EN-TC-27 raíz con tilde se reconoce", () => {
    expect(preprocessLatex("raíz(x)")).toMatch(/sqrt\(x\)/);
  });
});
