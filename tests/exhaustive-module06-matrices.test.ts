import { describe, expect, it } from "vitest";
import {
  addMatrices,
  determinant,
  invertMatrix,
  multiplyMatrices,
  powerMatrix,
  rank,
  ref,
  rref,
  subtractMatrices,
  toFractionMatrix,
  trace,
  transposeMatrix,
} from "../src/engine/matrixOps";
import { computeEigenvalues } from "../src/engine/eigenOps";

const asText = (m: ReturnType<typeof toFractionMatrix>) =>
  m.map(r => r.map(v => v.toFraction()));

describe("Suite exhaustiva original — Módulo 6: Matrices", () => {
  const A = toFractionMatrix([[2,1],[1,2]]);

  it("suma/resta/multiplicación", () => {
    const X = toFractionMatrix([[1,2],[3,4]]);
    const Y = toFractionMatrix([[5,6],[7,8]]);
    expect(asText(addMatrices(X,Y).result)).toEqual([["6","8"],["10","12"]]);
    expect(asText(subtractMatrices(X,Y).result)).toEqual([["-4","-4"],["-4","-4"]]);
    expect(asText(multiplyMatrices(X,Y).result)).toEqual([["19","22"],["43","50"]]);
  });

  it("determinante/inversa/transpuesta/rango/traza", () => {
    expect(determinant(A).value.toFraction()).toBe("3");
    expect(asText(invertMatrix(A).result)).toEqual([["2/3","-1/3"],["-1/3","2/3"]]);
    expect(asText(transposeMatrix(toFractionMatrix([[1,2,3],[4,5,6]])).result)).toEqual([["1","4"],["2","5"],["3","6"]]);
    expect(rank(toFractionMatrix([[1,2],[2,4]])).value).toBe(1);
    expect(trace(A).value.toFraction()).toBe("4");
  });

  it("REF/RREF", () => {
    expect(asText(ref(toFractionMatrix([[1,2],[2,4]])).result)).toEqual([["1","2"],["0","0"]]);
    expect(asText(rref(toFractionMatrix([[1,2,3],[2,4,6]])).result)).toEqual([["1","2","3"],["0","0","0"]]);
  });

  it("potencias A^0 y A^2", () => {
    expect(asText(powerMatrix(A,0).result)).toEqual([["1","0"],["0","1"]]);
    expect(asText(powerMatrix(A,2).result)).toEqual([["5","4"],["4","5"]]);
  });

  it("potencia negativa se rechaza explícitamente en Lite", () => {
    expect(() => powerMatrix(A,-1)).toThrow();
  });

  it("eigen 2x2 conocido 1 y 3 con eigenvectores válidos", () => {
    const { pairs } = computeEigenvalues(A);
    const vals = pairs.map(p => p.approx).sort((a,b)=>a-b);
    expect(vals[0]).toBeCloseTo(1,6);
    expect(vals[1]).toBeCloseTo(3,6);
    for (const p of pairs) expect(p.eigenvector).not.toBeNull();
  });

  it("eigen 3x3 diagonal 2,3,5", () => {
    const { pairs } = computeEigenvalues(toFractionMatrix([[2,0,0],[0,3,0],[0,0,5]]));
    const vals = pairs.map(p => p.approx).sort((a,b)=>a-b);
    expect(vals[0]).toBeCloseTo(2,6);
    expect(vals[1]).toBeCloseTo(3,6);
    expect(vals[2]).toBeCloseTo(5,6);
  });

  it("eigen fuera de 2x2/3x3 se rechaza explícitamente", () => {
    expect(() => computeEigenvalues(toFractionMatrix([[1,0,0,0],[0,1,0,0],[0,0,1,0],[0,0,0,1]]))).toThrow();
  });

  it("inversa singular y errores dimensionales se rechazan", () => {
    expect(() => invertMatrix(toFractionMatrix([[1,2],[2,4]]))).toThrow();
    expect(() => determinant(toFractionMatrix([[1,2,3],[4,5,6]]))).toThrow();
    expect(() => trace(toFractionMatrix([[1,2,3],[4,5,6]]))).toThrow();
    expect(() => multiplyMatrices(toFractionMatrix([[1,2,3]]), toFractionMatrix([[1,2],[3,4]]))).toThrow();
  });
});
