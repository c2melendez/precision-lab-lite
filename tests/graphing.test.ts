import { describe, it, expect } from "vitest";
import { analyzeGraph } from "../src/engine/stepEngine/graphing";

// NO EJECUTADO en el entorno de generación. Correr con `npm run test`.
// Estos casos usan una parábola simple porque su comportamiento es
// completamente conocido de antemano — sirve como prueba de referencia
// clara para el análisis numérico.

describe("analyzeGraph", () => {
  it("detecta el vértice de x^2-4 en (0,-4)", () => {
    const analysis = analyzeGraph("x^2-4", "x", [-10, 10]);
    expect(analysis.vertex).not.toBeNull();
    expect(analysis.vertex!.x).toBeCloseTo(0, 1);
    expect(analysis.vertex!.y).toBeCloseTo(-4, 1);
  });

  it("detecta las dos intercepciones en x de x^2-4 (x=-2 y x=2)", () => {
    const analysis = analyzeGraph("x^2-4", "x", [-10, 10]);
    const rounded = analysis.xIntercepts.map((x) => Math.round(x));
    expect(rounded).toContain(-2);
    expect(rounded).toContain(2);
  });

  it("detecta la intercepción en y de x^2-4 (y=-4)", () => {
    const analysis = analyzeGraph("x^2-4", "x", [-10, 10]);
    expect(analysis.yIntercept).toBeCloseTo(-4, 1);
  });

  it("detecta un mínimo global en x=0 para x^2-4", () => {
    const analysis = analyzeGraph("x^2-4", "x", [-10, 10]);
    expect(analysis.globalMin?.x).toBeCloseTo(0, 1);
  });

  it("no detecta vértice para una función no cuadrática (sin(x))", () => {
    const analysis = analyzeGraph("sin(x)", "x", [-10, 10]);
    expect(analysis.vertex).toBeNull();
  });

  it("rechaza una ventana con \"desde\" igual a \"hasta\" (bug detectado en revisión: antes producía división entre cero en el dibujo)", () => {
    expect(() => analyzeGraph("x^2", "x", [5, 5])).toThrow();
  });

  it("no lanza excepción con una ventana muy angosta (caso límite, no igual)", () => {
    expect(() => analyzeGraph("x^2", "x", [-0.001, 0.001])).not.toThrow();
  });

  it("1/(x-2) NO reporta una raíz falsa en la asíntota x=2 (bug real de la suite de regresión v1.1: el filtrado de puntos no finitos descartaba el hueco en vez de marcarlo, así que un cambio de signo cruzando la asíntota se contaba como raíz)", () => {
    const analysis = analyzeGraph("1/(x-2)", "x", [0, 4]);
    expect(analysis.xIntercepts).toEqual([]);
  });

  it("tan(x) NO reporta raíces falsas en sus asíntotas (±π/2, ±3π/2) — solo las raíces reales en -π, 0, π (bug real: cerca del polo tan(x) da un número FINITO pero gigantesco, sin pasar por Infinity, así que el chequeo de hueco no alcanza — hace falta además un umbral de magnitud)", () => {
    const analysis = analyzeGraph("tan(x)", "x", [-5, 5]);
    expect(analysis.xIntercepts.length).toBe(3);
    for (const root of analysis.xIntercepts) {
      expect(Math.abs(root) < 0.1 || Math.abs(Math.abs(root) - Math.PI) < 0.1).toBe(true);
    }
  });

  it("1/x tampoco reporta una raíz falsa en x=0", () => {
    const analysis = analyzeGraph("1/x", "x", [-3, 3]);
    expect(analysis.xIntercepts).toEqual([]);
  });
});
