import { describe, expect, it } from "vitest";
import {
  mean, median, modes, range, variance, variancePopulation, stdev, stdevPopulation,
  q1, q3, iqr, percentile, correlation, regressionSlope, regressionIntercept,
} from "../src/engine/statFunctions";
import {
  binomialPMF, binomialCDF, binomialMean, binomialVariance,
  normalCDF, zScore, poissonMean, poissonVariance,
  uniformCDF, uniformMean, uniformVariance,
  exponentialCDF, exponentialMean, exponentialVariance,
} from "../src/engine/distributions";

describe("Suite exhaustiva original — Módulo 7: Estadística", () => {
  const v = [1,2,3,4,5];

  it("descriptiva conocida", () => {
    expect(mean(v)).toBe(3);
    expect(median(v)).toBe(3);
    expect(range(v)).toBe(4);
    expect(q1(v)).toBe(2);
    expect(median(v)).toBe(3);
    expect(q3(v)).toBe(4);
    expect(iqr(v)).toBe(2);
    expect(percentile(v,90)).toBeCloseTo(4.6,12);
    expect(modes([1,1,2,3])).toEqual([1]);
  });

  it("varianza/desviación población vs muestra", () => {
    expect(variancePopulation(v)).toBeCloseTo(2,12);
    expect(variance(v)).toBeCloseTo(2.5,12);
    expect(stdevPopulation(v)).toBeCloseTo(Math.sqrt(2),12);
    expect(stdev(v)).toBeCloseTo(Math.sqrt(2.5),12);
  });

  it("correlación y regresión lineal", () => {
    const x=[1,2,3,4], y=[3,5,7,9];
    expect(correlation(x,y)).toBeCloseTo(1,12);
    expect(regressionSlope(x,y)).toBeCloseTo(2,12);
    expect(regressionIntercept(x,y)).toBeCloseTo(1,12);
  });

  it("binomial y normal", () => {
    expect(binomialPMF(4,.5,2)).toBeCloseTo(.375,12);
    expect(binomialCDF(4,.5,2)).toBeCloseTo(.6875,12);
    expect(binomialMean(4,.5)).toBe(2);
    expect(binomialVariance(4,.5)).toBe(1);
    expect(normalCDF(0,1,0)).toBeCloseTo(.5,7);
    expect(zScore(10,2,14)).toBe(2);
  });

  it("Poisson, uniforme y exponencial", () => {
    expect(poissonMean(4)).toBe(4);
    expect(poissonVariance(4)).toBe(4);
    expect(uniformCDF(0,10,5)).toBe(.5);
    expect(uniformMean(0,10)).toBe(5);
    expect(uniformVariance(0,10)).toBeCloseTo(100/12,12);
    expect(exponentialCDF(2,0)).toBe(0);
    expect(exponentialMean(2)).toBe(.5);
    expect(exponentialVariance(2)).toBe(.25);
  });

  it("parámetros inválidos se rechazan explícitamente", () => {
    expect(() => percentile(v,101)).toThrow();
    expect(() => correlation([1,1,1],[1,2,3])).toThrow();
    expect(() => binomialPMF(4,1.5,2)).toThrow();
    expect(() => normalCDF(0,0,0)).toThrow();
    expect(() => poissonMean(0)).toThrow();
    expect(() => uniformCDF(2,2,2)).toThrow();
    expect(() => exponentialMean(0)).toThrow();
  });
});
