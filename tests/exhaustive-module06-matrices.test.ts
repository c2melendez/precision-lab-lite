import { describe, expect, it } from "vitest";
import { determinant, invertMatrix, multiplyMatrices, rank, ref, rref, toFractionMatrix, trace, transposeMatrix } from "../src/engine/matrixOps";
import { computeEigenvalues } from "../src/engine/eigenOps";

describe("Suite exhaustiva original — Módulo 6: Matrices", () => {
  const A = toFractionMatrix([[2,1],[1,2]]);

  it("determinante/inversa/transpuesta/rango/traza", () => {
    expect(determinant(A).value.toFraction()).toBe("3");
    expect(invertMatrix(A).result.map(r => r.map(v => v.toFraction()))).toEqual([["2/3","-1/3"],["-1/3","2/3"]]);
    expect(transposeMatrix(toFractionMatrix([[1,2,3],[4,5,6]])).result.map(r => r.map(v => v.toFraction()))).toEqual([["1","4"],["2","5"],["3","6"]]);
    expect(rank(toFractionMatrix([[1,2],[2,4]])).value).toBe(1);
    expect(trace(A).value.toFraction()).toBe("4");
  });

  it("REF/RREF y multiplicación", () => {
    expect(ref(toFractionMatrix([[1,2],[2,4]])).result.length).toBe(2);
    expect(rref(toFractionMatrix([[1,2,3],[2,4,6]])).result[0].map(v => v.toFraction())).toEqual(["1","2","3"]);
    expect(multiplyMatrices(
      toFractionMatrix([[1,2],[3,4]]),
      toFractionMatrix([[5,6],[7,8]])
    ).result.map(r => r.map(v => v.toFraction()))).toEqual([["19","22"],["43","50"]]);
  });

  it("eigen 2x2 conocido 1 y 3 con eigenvectores válidos", () => {
    const { pairs } = computeEigenvalues(A);
    expect(pairs.map(p => p.approx).sort((a,b)=>a-b)).toEqual([expect.closeTo(1,6), expect.closeTo(3,6)]);
    for (const p of pairs) expect(p.eigenvector).not.toBeNull();
  });

  it("eigen 3x3 diagonal 2,3,5", () => {
    const { pairs } = computeEigenvalues(toFractionMatrix([[2,0,0],[0,3,0],[0,0,5]]));
    expect(pairs.map(p => p.approx).sort((a,b)=>a-b)).toEqual([expect.closeTo(2,6),expect.closeTo(3,6),expect.closeTo(5,6)]);
  });

  it("eigen fuera de 2x2/3x3 se rechaza explícitamente", () => {
    expect(() => computeEigenvalues(toFractionMatrix([[1,0,0,0],[0,1,0,0],[0,0,1,0],[0,0,0,1]]))).toThrow();
  });

  it("inversa singular se rechaza", () => {
    expect(() => invertMatrix(toFractionMatrix([[1,2],[2,4]]))).toThrow();
  });

  it("multiplicación con dimensiones incompatibles se rechaza", () => {
    expect(() => multiplyMatrices(toFractionMatrix([[1,2,3]]), toFractionMatrix([[1,2],[3,4]]))).toThrow();
  });
});
