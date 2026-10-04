import { describe, expect, it } from "vitest";
import { parseExpression } from "../src/engine/parsing";
import { evaluate } from "../src/engine/algebriteClient";

function expectEquivalent(input: string, expectedAlgebrite: string): void {
  const parsed = parseExpression(input).algebrite;
  const diffExpr = `(${parsed})-(${expectedAlgebrite})`;
  const diff = evaluate(diffExpr);
  if (Number(diff) === 0) return;

  // Algebrite no reduce automáticamente algunas identidades racionales
  // equivalentes (p.ej. 1/(1/x+1/y) - xy/(x+y)). Pedimos una pasada
  // explícita de simplificación antes de declarar un fallo de sintaxis.
  const simplified = evaluate(`simplify(${diffExpr})`);
  expect(Number(simplified)).toBe(0);
}

describe("IN625 Parte A / A1 Fracciones — contrato de sintaxis", () => {
  const cases: Array<[string, string, string]> = [
    ["EN-FR-01", "\\frac{1}{2}", "1/2"],
    ["EN-FR-02", "\\dfrac{1}{2}", "1/2"],
    ["EN-FR-03", "\\tfrac{1}{2}", "1/2"],
    ["EN-FR-04", "\\cfrac{1}{2}", "1/2"],
    ["EN-FR-05", "{1\\over 2}", "1/2"],
    ["EN-FR-06", "1/2", "1/2"],
    ["EN-FR-07", "\\frac{x+1}{x-1}", "(x+1)/(x-1)"],
    ["EN-FR-08", "(x+1)/(x-1)", "(x+1)/(x-1)"],
    ["EN-FR-09", "x+1\\over x-1", "(x+1)/(x-1)"],
    ["EN-FR-10", "\\frac12", "1/2"],
    ["EN-FR-11", "\\frac1x", "1/x"],
    ["EN-FR-12", "\\frac{12}3", "4"],
    ["EN-FR-13", "\\frac123", "3/2"],
    ["EN-FR-14", "\\frac{\\frac{1}{2}}{3}", "1/6"],
    ["EN-FR-15", "\\frac{1}{\\frac{1}{2}}", "2"],
    ["EN-FR-16", "\\frac{1}{\\frac{1}{x}+\\frac{1}{y}}", "(x*y)/(x+y)"],
    ["EN-FR-17", "\\frac{1}{2}x", "x/2"],
    ["EN-FR-18", "\\frac{1}{2x}", "1/(2*x)"],
    ["EN-FR-19", "\\frac{a}{b}\\frac{c}{d}", "(a*c)/(b*d)"],
    ["EN-FR-20", "x+1/x-1", "x+1/x-1"],
    ["EN-FR-21", "\\frac{2}{3}+\\frac{3}{4}", "17/12"],
    ["EN-FR-22", "\\frac{1.5}{2}", "3/4"],
    ["EN-FR-23", "\\frac{\\pi}{2}", "pi/2"],
    ["EN-FR-24", "\\frac{\\sqrt{2}}{2}", "sqrt(2)/2"],
  ];

  for (const [id, input, expected] of cases) {
    it(`${id}: interpreta la entrada según el contrato histórico`, () => {
      expectEquivalent(input, expected);
    });
  }
});
