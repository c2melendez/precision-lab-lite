import { describe, expect, it } from "vitest";
import { parseExpression } from "../src/engine/parsing";
import { evaluate } from "../src/engine/algebriteClient";

function evalNum(input: string): number {
  const parsed = parseExpression(input).algebrite;
  return Number(evaluate(`float(${parsed})`));
}
function expectClose(input: string, expected: number, digits = 9): void {
  expect(evalNum(input)).toBeCloseTo(expected, digits);
}
function parseOut(input: string): string {
  return parseExpression(input).algebrite.replace(/\s+/g, "");
}

describe("IN625 Parte A / A4 Raíces", () => {
  it("EN-RD-01 sqrt con llaves", () => expectClose("\\sqrt{4}", 2));
  it("EN-RD-02 sqrt sin llaves", () => expectClose("\\sqrt4", 2));
  it("EN-RD-03 sqrt2", () => expectClose("\\sqrt2", Math.SQRT2));
  it("EN-RD-04 sqrt x conserva raíz", () => {
    const out = parseOut("\\sqrt x");
    expect(out).toContain("sqrt(x)");
  });
  it("EN-RD-05 y queda fuera del radical", () => {
    const out = parseOut("\\sqrt{x}y");
    expect(out).toContain("sqrt(x)");
    expect(out).toMatch(/\*y|y\*/);
  });
  it("EN-RD-06 raíz cúbica de 8", () => expectClose("\\sqrt[3]{8}", 2));
  it("EN-RD-07 raíz cúbica real de -8", () => expectClose("\\sqrt[3]{-8}", -2));
  it("EN-RD-08 raíz cúbica sin llaves", () => expectClose("\\sqrt[3]4", Math.cbrt(4)));
  it("EN-RD-09 índice de dos dígitos", () => expectClose("\\sqrt[10]{1024}", 2));
  it("EN-RD-10 raíz n-ésima simbólica", () => {
    const out = parseOut("\\sqrt[n]{x}");
    expect(out).toMatch(/x.*1.*n|\^\(1\/\(n\)\)/);
  });
  it("EN-RD-11 raíces anidadas", () => expectClose("\\sqrt{\\sqrt{\\sqrt{256}}}", 2));
  it("EN-RD-12 coeficiente por radical", () => expectClose("2\\sqrt{3}", 2 * Math.sqrt(3)));
  it("EN-RD-13 producto de radicales", () => expectClose("\\sqrt{2}\\sqrt{3}", Math.sqrt(6)));
  it("EN-RD-14 potencia un medio equivale a sqrt", () => {
    const a = parseExpression("x^{\\frac{1}{2}}").algebrite;
    const b = parseExpression("\\sqrt{x}").algebrite;
    const diff = evaluate(`simplify((${a})-(${b}))`);
    expect(Number(diff)).toBe(0);
  });
  it("EN-RD-15 sqrt(-4): complejo 2i o error real explícito", () => {
    try {
      const out = evaluate(parseExpression("\\sqrt{-4}").algebrite);
      expect(out.replace(/\s+/g, "")).toMatch(/2\*?i|i\*?2|2i/);
    } catch (e) {
      expect(String(e).length).toBeGreaterThan(0);
    }
  });
});
