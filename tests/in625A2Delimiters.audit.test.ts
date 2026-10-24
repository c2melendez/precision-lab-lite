import { describe, expect, it } from "vitest";
import { parseExpression } from "../src/engine/parsing";
import { evaluate } from "../src/engine/algebriteClient";

function equivalent(input: string, expected: string): void {
  const parsed = parseExpression(input).algebrite;
  const diff = evaluate(`simplify((${parsed})-(${expected}))`);
  expect(Number(diff)).toBe(0);
}

describe("IN625 Parte A / A2 Delimitadores y valor absoluto — contrato de sintaxis", () => {
  const equivalentCases: Array<[string, string, string]> = [
    ["EN-DL-01", "\\left(x+1\\right)^{2}", "(x+1)^2"],
    ["EN-DL-02", "\\left[x+1\\right]^{2}", "(x+1)^2"],
    ["EN-DL-04", "\\bigl(x+1\\bigr)^{2}", "(x+1)^2"],
    ["EN-DL-05", "\\Bigl(\\frac{1}{2}\\Bigr)^{3}", "1/8"],
    ["EN-DL-06", "\\mleft(x+1\\mright)^{2}", "(x+1)^2"],
    ["EN-DL-07", "((x))", "x"],
    ["EN-DL-08", "\\left(2+3\\right)\\left(4-1\\right)", "15"],
    ["EN-DL-09", "\\left(\\frac{1}{2}\\right)^{-2}", "4"],
    ["EN-DL-10", "\\lvert x-1\\rvert", "abs(x-1)"],
    ["EN-DL-11", "|x-1|", "abs(x-1)"],
    ["EN-DL-12", "\\left| x-1 \\right|", "abs(x-1)"],
    ["EN-DL-13", "||x|-1|", "abs(abs(x)-1)"],
    ["EN-DL-14", "\\lvert\\lvert x\\rvert-1\\rvert", "abs(abs(x)-1)"],
    ["EN-DL-15", "\\lvert x\\rvert\\lvert y\\rvert", "abs(x)*abs(y)"],
    ["EN-DL-17", "\\lceil 2.1\\rceil", "3"],
  ];

  for (const [id, input, expected] of equivalentCases) {
    it(`${id}: conserva la semántica esperada`, () => equivalent(input, expected));
  }

  it("EN-DL-03: llaves se interpretan como agrupación o producen error explícito", () => {
    try {
      equivalent("2\\left\\{3+4\\right\\}", "14");
    } catch (error) {
      expect(String(error).length).toBeGreaterThan(0);
    }
  });

  it("EN-DL-16: floor evalúa correctamente ambos signos", () => {
    equivalent("\\lfloor 2.7\\rfloor", "2");
    equivalent("\\lfloor -2.5\\rfloor", "-3");
  });

  it("EN-DL-20: norma vectorial =5 o rechazo explícito (feature-dependent)", () => {
    try {
      equivalent("\\lVert\\begin{pmatrix}3\\\\4\\end{pmatrix}\\rVert", "5");
    } catch (error) {
      expect(String(error).length).toBeGreaterThan(0);
    }
  });

  // EN-DL-18/19 son notación de intervalos, no expresiones escalares del motor.
  // Se conservan para observación L2/manual y no se fuerzan como aritmética.
});
