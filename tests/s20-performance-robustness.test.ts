import { describe, expect, it } from "vitest";
import { validateFiniteSumRange } from "../src/engine/sum";
import { tryFiniteProduct } from "../src/engine/product";
import { determinant, toFractionMatrix } from "../src/engine/matrixOps";
import { mean, variancePopulation } from "../src/engine/statFunctions";

describe("S20 — límites y robustez del motor Lite", () => {
  it("rechaza sumatoria de 100000 términos antes de Algebrite", () => {
    const started = performance.now();
    let caught: unknown;
    try {
      validateFiniteSumRange("sum(i,i,1,100000)");
    } catch (error) {
      caught = error;
    }
    const elapsed = performance.now() - started;
    expect(caught).toMatchObject({ code: "COMPLEXITY_LIMIT" });
    expect(elapsed).toBeLessThan(1000);
  });

  it("permite el límite soportado de 10000 términos", () => {
    expect(validateFiniteSumRange("sum(i,i,1,10000)")).toBe(true);
  });

  it("productoria de 100000 términos se rechaza dentro del presupuesto", () => {
    const started = performance.now();
    expect(() => tryFiniteProduct("product(1,i,1,100000)")).toThrow(/demasiado grande/i);
    expect(performance.now() - started).toBeLessThan(1000);
  });

  it("matriz 6x6 soportada termina sin hang", () => {
    const matrix = toFractionMatrix([
      [2, 1, 3, 4, 5, 6],
      [0, 3, 2, 1, 4, 5],
      [0, 0, 5, 2, 1, 3],
      [0, 0, 0, 7, 2, 1],
      [0, 0, 0, 0, 11, 4],
      [0, 0, 0, 0, 0, 13],
    ]);
    const started = performance.now();
    expect(determinant(matrix).value.toFraction()).toBe("30030");
    expect(performance.now() - started).toBeLessThan(5000);
  });

  it("estadística con 200 valores soportados termina y es finita", () => {
    const values = Array.from({ length: 200 }, (_, i) => i + 1);
    const started = performance.now();
    expect(mean(values)).toBe(100.5);
    expect(Number.isFinite(variancePopulation(values))).toBe(true);
    expect(performance.now() - started).toBeLessThan(1000);
  });
});
