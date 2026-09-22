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
  trace,
  transposeMatrix,
  toFractionMatrix,
} from "../src/engine/matrixOps";

const asText = (m: ReturnType<typeof toFractionMatrix>) =>
  m.map((row) => row.map((v) => v.toFraction()));

function identity(n: number) {
  return toFractionMatrix(
    Array.from({ length: n }, (_, r) =>
      Array.from({ length: n }, (_, c) => (r === c ? 1 : 0)),
    ),
  );
}

describe("M21 — matrices 5x5/6x6", () => {
  it("determinante 6x6 triangular = producto exacto de la diagonal", () => {
    const A = toFractionMatrix([
      [2, 1, 3, 4, 5, 6],
      [0, 3, 2, 1, 4, 5],
      [0, 0, 5, 2, 1, 3],
      [0, 0, 0, 7, 2, 1],
      [0, 0, 0, 0, 11, 4],
      [0, 0, 0, 0, 0, 13],
    ]);
    expect(determinant(A).value.toFraction()).toBe(String(2 * 3 * 5 * 7 * 11 * 13));
  });

  it("determinante respeta cambio de signo por intercambio de filas", () => {
    const A = identity(6);
    [A[0], A[1]] = [A[1], A[0]];
    expect(determinant(A).value.toFraction()).toBe("-1");
  });

  it("inversa 6x6 diagonal y producto A*A^-1 producen identidad", () => {
    const A = toFractionMatrix([
      [2,0,0,0,0,0],
      [0,3,0,0,0,0],
      [0,0,4,0,0,0],
      [0,0,0,5,0,0],
      [0,0,0,0,6,0],
      [0,0,0,0,0,7],
    ]);
    const inv = invertMatrix(A).result;
    expect(asText(multiplyMatrices(A, inv).result)).toEqual(asText(identity(6)));
  });

  it("suma y potencia 6x6 conservan dimensiones y valores", () => {
    const I = identity(6);
    expect(asText(addMatrices(I, I).result)[5][5]).toBe("2");
    expect(asText(powerMatrix(I, 5).result)).toEqual(asText(I));
  });

  it("REF/RREF/rango escalan en matriz 5x6 rectangular", () => {
    const A = toFractionMatrix([
      [1,0,0,0,0,1],
      [0,1,0,0,0,2],
      [0,0,1,0,0,3],
      [0,0,0,1,0,4],
      [0,0,0,0,1,5],
    ]);
    expect(rank(A).value).toBe(5);
    expect(ref(A).result).toHaveLength(5);
    expect(rref(A).result).toHaveLength(5);
    expect(rref(A).result[0]).toHaveLength(6);
  });

  it("transpuesta 5x6 pasa a 6x5", () => {
    const A = toFractionMatrix([
      [1,2,3,4,5,6],
      [7,8,9,10,11,12],
      [13,14,15,16,17,18],
      [19,20,21,22,23,24],
      [25,26,27,28,29,30],
    ]);
    const T = transposeMatrix(A).result;
    expect(T).toHaveLength(6);
    expect(T[0]).toHaveLength(5);
    expect(T[5][4].toFraction()).toBe("30");
  });

  it("traza 6x6 identidad = 6", () => {
    expect(trace(identity(6)).value.toFraction()).toBe("6");
  });
});
