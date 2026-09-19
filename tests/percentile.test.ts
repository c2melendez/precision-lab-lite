import { describe, it, expect } from "vitest";
import {
  mean,
  median,
  modes,
  stdev,
  variance,
  mad,
  q1,
  q3,
  iqr,
  percentile,
  tryStatFunction,
  correlation,
  regressionSlope,
  regressionIntercept,
} from "../src/engine/statFunctions";

// Módulo M0 (spec_graficacion_matrices_estadistica_unidades.md, sección
// 6.1). Mismo caso de referencia usado en
// backend/tests/test_statistics.py de main — [2,4,4,4,5,5,7,9], n=8,
// interpolación lineal — para tener equivalencia matemática directa entre
// motores con el mismo input:
//   Q1=4, Q2=4.5, Q3=5.5, IQR=1.5, P90=7.6 (calculado a mano y verificado
//   contra /statistics/descriptive real en el Módulo M0 de main).
const KNOWN_DATASET = [2, 4, 4, 4, 5, 5, 7, 9];

describe("percentile/q1/q3/iqr", () => {
  it("Q1 del dataset conocido es 4 — mismo caso que main", () => {
    expect(q1(KNOWN_DATASET)).toBeCloseTo(4, 9);
  });

  it("Q2 coincide exactamente con median() — misma definición, mismo caso que main", () => {
    const q2 = median(KNOWN_DATASET);
    expect(q2).toBeCloseTo(4.5, 9);
    expect(q2).toBe(median(KNOWN_DATASET));
  });

  it("Q3 del dataset conocido es 5.5 — mismo caso que main", () => {
    expect(q3(KNOWN_DATASET)).toBeCloseTo(5.5, 9);
  });

  it("IQR del dataset conocido es 1.5 — mismo caso que main", () => {
    expect(iqr(KNOWN_DATASET)).toBeCloseTo(1.5, 9);
  });

  it("percentile(90) del dataset conocido es 7.6 — mismo caso que main", () => {
    expect(percentile(KNOWN_DATASET, 90)).toBeCloseTo(7.6, 9);
  });

  it("rechaza p fuera de [0,100]", () => {
    expect(() => percentile(KNOWN_DATASET, 150)).toThrow();
    expect(() => percentile(KNOWN_DATASET, -1)).toThrow();
  });

  it("tryStatFunction despacha percentile(p,...datos) correctamente vía el campo de expresión libre", () => {
    const result = tryStatFunction("percentile(90,2,4,4,4,5,5,7,9)");
    expect(result).not.toBeNull();
    expect(Number(result)).toBeCloseTo(7.6, 6);
  });

  it("tryStatFunction despacha q1/q3/iqr correctamente", () => {
    expect(Number(tryStatFunction("q1(2,4,4,4,5,5,7,9)"))).toBeCloseTo(4, 6);
    expect(Number(tryStatFunction("q3(2,4,4,4,5,5,7,9)"))).toBeCloseTo(5.5, 6);
    expect(Number(tryStatFunction("iqr(2,4,4,4,5,5,7,9)"))).toBeCloseTo(1.5, 6);
  });
});

// Regresión: mean/median/mode/stdev/variance/mad existentes no cambian.
describe("regresión de estadísticos existentes tras M0", () => {
  it("mean del dataset conocido sigue siendo 5", () => {
    expect(mean(KNOWN_DATASET)).toBeCloseTo(5, 9);
  });

  it("mode del dataset conocido sigue siendo [4] (4 aparece 3 veces)", () => {
    expect(modes(KNOWN_DATASET)).toEqual([4]);
  });

  it("stdev/variance siguen siendo consistentes entre sí (stdev = sqrt(variance))", () => {
    const v = variance(KNOWN_DATASET);
    const s = stdev(KNOWN_DATASET);
    expect(s * s).toBeCloseTo(v, 9);
  });

  it("mad del dataset conocido sigue calculando sin lanzar error", () => {
    expect(mad(KNOWN_DATASET)).toBeGreaterThan(0);
  });
});

// Módulo M1 (spec_graficacion_matrices_estadistica_unidades.md, sección
// 6.2). Mismos casos que backend/tests/test_statistics.py de main para
// equivalencia matemática directa: y=2x+1 (r=1), oscilante simétrico
// (r=0), x constante (rechazado).
describe("correlation/regressionSlope/regressionIntercept", () => {
  it("relación lineal perfecta y=2x+1: r=1, pendiente=2, intercepto=1 — mismo caso que main", () => {
    const x = [1, 2, 3, 4];
    const y = [3, 5, 7, 9];
    expect(correlation(x, y)).toBeCloseTo(1, 9);
    expect(regressionSlope(x, y)).toBeCloseTo(2, 9);
    expect(regressionIntercept(x, y)).toBeCloseTo(1, 9);
  });

  it("relación lineal perfecta negativa: r=-1 — mismo caso que main", () => {
    expect(correlation([1, 2, 3, 4], [10, 8, 6, 4])).toBeCloseTo(-1, 9);
  });

  it("sin correlación (patrón oscilante simétrico): r=0 — mismo caso que main", () => {
    expect(correlation([1, 2, 3, 4, 5], [3, -3, 3, -3, 3])).toBeCloseTo(0, 9);
  });

  it("rechaza x e y de longitud distinta", () => {
    expect(() => correlation([1, 2, 3], [1, 2])).toThrow();
  });

  it("rechaza x constante (varianza cero)", () => {
    expect(() => correlation([5, 5, 5], [1, 2, 3])).toThrow();
  });
});

// Regresión: el resto de Estadística (lista única) no se ve afectado por
// el cambio de UI de entrada de M1 -- se re-verifica un caso de Módulo M0
// después de agregar correlación/regresión.
describe("regresión: M0 no afectado por M1", () => {
  it("q1/q3/iqr del dataset conocido siguen dando los mismos valores", () => {
    const KNOWN_DATASET = [2, 4, 4, 4, 5, 5, 7, 9];
    expect(q1(KNOWN_DATASET)).toBeCloseTo(4, 9);
    expect(q3(KNOWN_DATASET)).toBeCloseTo(5.5, 9);
    expect(iqr(KNOWN_DATASET)).toBeCloseTo(1.5, 9);
  });
});
