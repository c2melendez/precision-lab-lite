import { describe, it, expect } from "vitest";
import { toFractionMatrix } from "../src/engine/matrixOps";
import { computeEigenvalues } from "../src/engine/eigenOps";

// Módulo K1 (spec_graficacion_matrices_estadistica_unidades.md, sección
// 3.2, diseño confirmado en K0). Todos los casos se corren contra el
// paquete Algebrite real (no simulado) — la auditoría de K0 ya mostró que
// asumir el comportamiento sin ejecutarlo llevaba a conclusiones
// incorrectas (rref/eigen() sobre matrices [[...]] parecían viables hasta
// que se probaron de verdad).

describe("computeEigenvalues", () => {
  it("2x2 racional [[2,1],[1,2]]: eigenvalores 1 y 3, cada uno multiplicidad 1, eigenvectores ortogonales conocidos", () => {
    const A = toFractionMatrix([
      [2, 1],
      [1, 2],
    ]);
    const { pairs, allExact } = computeEigenvalues(A);
    expect(allExact).toBe(true);
    const approxSorted = pairs.map((p) => p.approx).sort((a, b) => a - b);
    expect(approxSorted[0]).toBeCloseTo(1, 6);
    expect(approxSorted[1]).toBeCloseTo(3, 6);
    for (const p of pairs) {
      expect(p.multiplicity).toBe(1);
      expect(p.isComplex).toBe(false);
      expect(p.eigenvector).not.toBeNull();
      // Verificación real de la propiedad definitoria: A*v = λ*v.
      const v = p.eigenvector!;
      const Av = A.map((row) => row.reduce((s, f, j) => s + f.valueOf() * v[j], 0));
      for (let i = 0; i < 2; i++) expect(Av[i]).toBeCloseTo(p.approx * v[i], 5);
    }
  });

  it("2x2 con eigenvalores complejos [[0,-1],[1,0]] (rotación 90°): i y -i, sin eigenvector calculado (límite declarado)", () => {
    const A = toFractionMatrix([
      [0, -1],
      [1, 0],
    ]);
    const { pairs } = computeEigenvalues(A);
    expect(pairs.length).toBe(2);
    for (const p of pairs) {
      expect(p.isComplex).toBe(true);
      expect(p.eigenvector).toBeNull();
      expect(Math.abs(p.approx)).toBeLessThan(1e-6); // parte real de ±i es 0
    }
  });

  it("2x2 con eigenvalor repetido [[2,1],[0,2]] (matriz defectuosa): multiplicidad 2 detectada, no colapsada a 1", () => {
    const A = toFractionMatrix([
      [2, 1],
      [0, 2],
    ]);
    const { pairs } = computeEigenvalues(A);
    expect(pairs.length).toBe(1);
    expect(pairs[0].approx).toBeCloseTo(2, 6);
    expect(pairs[0].multiplicity).toBe(2);
  });

  it("2x2 irracional [[1,1],[1,-1]]: eigenvalores ±√2, forma exacta preservada", () => {
    const A = toFractionMatrix([
      [1, 1],
      [1, -1],
    ]);
    const { pairs, allExact } = computeEigenvalues(A);
    expect(allExact).toBe(true);
    const approxSorted = pairs.map((p) => p.approx).sort((a, b) => a - b);
    expect(approxSorted[0]).toBeCloseTo(-Math.sqrt(2), 6);
    expect(approxSorted[1]).toBeCloseTo(Math.sqrt(2), 6);
    expect(pairs.every((p) => p.exact !== null)).toBe(true);
  });

  it("3x3 diagonal diag(2,3,5): eigenvalores exactos 2,3,5, eigenvectores = base estándar", () => {
    const A = toFractionMatrix([
      [2, 0, 0],
      [0, 3, 0],
      [0, 0, 5],
    ]);
    const { pairs, allExact } = computeEigenvalues(A);
    expect(allExact).toBe(true);
    const approxSorted = pairs.map((p) => p.approx).sort((a, b) => a - b);
    expect(approxSorted).toEqual([
      expect.closeTo(2, 6),
      expect.closeTo(3, 6),
      expect.closeTo(5, 6),
    ]);
  });

  it("3x3 tridiagonal [[2,1,0],[1,2,1],[0,1,2]]: eigenvalores 2, 2-√2, 2+√2 — mismo caso verificado en K0 contra el paquete real", () => {
    const A = toFractionMatrix([
      [2, 1, 0],
      [1, 2, 1],
      [0, 1, 2],
    ]);
    const { pairs, allExact } = computeEigenvalues(A);
    expect(allExact).toBe(true);
    const approxSorted = pairs.map((p) => p.approx).sort((a, b) => a - b);
    expect(approxSorted[0]).toBeCloseTo(2 - Math.sqrt(2), 6);
    expect(approxSorted[1]).toBeCloseTo(2, 6);
    expect(approxSorted[2]).toBeCloseTo(2 + Math.sqrt(2), 6);
  });

  it("rechaza matrices que no son 2x2 ni 3x3 (alcance determinado en K0)", () => {
    const A1 = toFractionMatrix([[5]]);
    expect(() => computeEigenvalues(A1)).toThrow();
    const A4 = toFractionMatrix([
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1],
    ]);
    expect(() => computeEigenvalues(A4)).toThrow();
  });
});
