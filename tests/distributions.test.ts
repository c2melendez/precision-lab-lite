import { describe, it, expect } from "vitest";
import {
  binomialPMF,
  binomialMean,
  binomialVariance,
  normalCDF,
  poissonPMF,
  poissonCDF,
  poissonMean,
  poissonVariance,
  uniformCDF,
  uniformMean,
  uniformVariance,
  exponentialCDF,
  exponentialMean,
  exponentialVariance,
} from "../src/engine/distributions";

// Módulo N0 (spec_graficacion_matrices_estadistica_unidades.md, sección 7):
// Poisson, uniforme, exponencial. Mismos casos de referencia usados en
// backend/tests/test_statistics.py de main, verificados en vivo contra el
// backend real antes de escribirlos, para equivalencia matemática directa
// entre motores con el mismo input.
// distributions.ts no tenía ningún test en esta suite todavía (confirmado
// buscando en tests/ antes de escribir este archivo) — se agrega N0 y,
// como regresión real, binomial/normal también.

describe("poisson", () => {
  it("PMF Poisson(4).pmf(2) = 8*e^-4 ≈ 0.14652511110987343 — mismo caso que main", () => {
    expect(poissonPMF(4, 2)).toBeCloseTo(0.14652511110987343, 9);
  });

  it("mean y variance de Poisson(4) son ambas 4", () => {
    expect(poissonMean(4)).toBeCloseTo(4, 9);
    expect(poissonVariance(4)).toBeCloseTo(4, 9);
  });

  it("CDF es la suma acumulada de la PMF", () => {
    const cdf2 = poissonCDF(4, 2);
    const manual = poissonPMF(4, 0) + poissonPMF(4, 1) + poissonPMF(4, 2);
    expect(cdf2).toBeCloseTo(manual, 9);
  });

  it("rechaza k negativo y λ≤0", () => {
    expect(() => poissonPMF(4, -1)).toThrow();
    expect(() => poissonMean(0)).toThrow();
  });
});

describe("uniform", () => {
  it("CDF en el punto medio de Uniforme(0,10) es 0.5 — mismo caso que main", () => {
    expect(uniformCDF(0, 10, 5)).toBeCloseTo(0.5, 9);
  });

  it("mean de Uniforme(0,10) es 5 — mismo caso que main", () => {
    expect(uniformMean(0, 10)).toBeCloseTo(5, 9);
  });

  it("variance de Uniforme(0,10) es 25/3 ≈ 8.3333 — mismo caso que main", () => {
    expect(uniformVariance(0, 10)).toBeCloseTo(25 / 3, 9);
  });

  it("rechaza a >= b", () => {
    expect(() => uniformMean(10, 0)).toThrow();
  });
});

describe("exponential", () => {
  it("CDF Exponencial(2).cdf(1) = 1-e^-2 ≈ 0.8646647167633873 — mismo caso que main", () => {
    expect(exponentialCDF(2, 1)).toBeCloseTo(0.8646647167633873, 9);
  });

  it("mean de Exponencial(2) es 0.5 — mismo caso que main", () => {
    expect(exponentialMean(2)).toBeCloseTo(0.5, 9);
  });

  it("variance de Exponencial(2) es 0.25 — mismo caso que main", () => {
    expect(exponentialVariance(2)).toBeCloseTo(0.25, 9);
  });

  it("rechaza λ≤0", () => {
    expect(() => exponentialMean(0)).toThrow();
  });
});

// Regresión: binomial y normal existentes no cambian.
describe("regresión: binomial y normal tras N0", () => {
  it("binomial PMF sigue calculando correctamente", () => {
    expect(binomialPMF(10, 0.3, 3)).toBeGreaterThan(0);
    expect(binomialMean(10, 0.3)).toBeCloseTo(3, 9);
    expect(binomialVariance(10, 0.3)).toBeCloseTo(2.1, 9);
  });

  it("normal CDF en x=μ sigue siendo 0.5", () => {
    // Tolerancia acorde al error documentado de la aproximación erf
    // (Abramowitz-Stegun, ~1.5e-7) — no un bug del código, sino de mi
    // aserción inicial siendo más estricta de lo que la propia
    // implementación puede garantizar.
    expect(normalCDF(0, 1, 0)).toBeCloseTo(0.5, 6);
  });
});
