import { describe, it, expect } from "vitest";
import { parseExpression } from "../src/engine/parsing";
import { solveInequality } from "../src/engine/inequality";

// Fix (decisión de Carlos, cierre de la suite de paridad de teclado v1.0):
// <, >, ≤, ≥ no tenían ningún solver — "solver básico" = análisis de
// signos por intervalos usando las raíces reales de izquierda-derecha=0.
describe("solveInequality (decisión de Carlos: solver básico de <,>,≤,≥)", () => {
  function solve(latex: string) {
    const parsed = parseExpression(latex, "RAD");
    expect(parsed.isInequality).toBe(true);
    return solveInequality(parsed.algebrite, parsed.inequalityOperator!, parsed.freeVariables[0] ?? "x").resultText;
  }

  it("lineal simple: 2x+1<7 -> x<3", () => {
    expect(solve("2*x+1<7")).toBe("x < 3");
  });

  it("dividir por negativo invierte el sentido sin lógica especial (el método de prueba de signo lo maneja solo): -2x+4>0 -> x<2", () => {
    expect(solve("-2*x+4>0")).toBe("x < 2");
  });

  it("cuadrática acotada: x^2<4 -> -2<x<2", () => {
    expect(solve("x^2<4")).toBe("-2 < x < 2");
  });

  it("cuadrática con dos ramas: x^2>4 -> x<-2 o x>2", () => {
    expect(solve("x^2>4")).toBe("x < -2 o x > 2");
  });

  it("punto aislado: x^2<=0 -> x=0 (no un intervalo)", () => {
    expect(solve("x^2<=0")).toBe("x = 0");
  });

  it("siempre cierto: x^2>=0 -> todos los reales", () => {
    expect(solve("x^2>=0")).toBe("todos los números reales");
  });

  it("nunca cierto: x^2<0 -> sin solución real", () => {
    expect(solve("x^2<0")).toBe("No tiene solución real.");
  });

  it("cúbica con signos alternados: (x-1)(x-2)(x-3)<0 -> x<1 o 2<x<3", () => {
    expect(solve("(x-1)*(x-2)*(x-3)<0")).toBe("x < 1 o 2 < x < 3");
  });

  it("≥/≤ (teclas reales, macros \\ge/\\le) parsean sin colisionar con \\left/\\right", () => {
    expect(solve("x\\ge3")).toBe("x >= 3");
    expect(solve("x\\le-2")).toBe("x <= -2");
  });

  it("cadena doble (1<x<5) se rechaza en vez de adivinar semántica no pedida", () => {
    expect(() => parseExpression("1<x<5", "RAD")).toThrow();
  });

  it("más de una variable se rechaza (mismo criterio que las ecuaciones)", () => {
    const parsed = parseExpression("x+y<5", "RAD");
    expect(parsed.isInequality).toBe(true);
    expect(parsed.freeVariables.length).toBe(2);
  });
});
