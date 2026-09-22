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

  it("M22: 2x2 rotación 90° calcula eigenvectores complejos válidos para ±i", () => {
    const A = toFractionMatrix([
      [0, -1],
      [1, 0],
    ]);
    const { pairs } = computeEigenvalues(A);
    expect(pairs.length).toBe(2);

    for (const p of pairs) {
      expect(p.isComplex).toBe(true);
      expect(p.eigenvector).toBeNull();
      expect(p.complexEigenvector).not.toBeNull();
      expect(Math.abs(p.approx)).toBeLessThan(1e-6);
      expect(Math.abs(Math.abs(p.approxIm) - 1)).toBeLessThan(1e-6);

      const v = p.complexEigenvector!;
      for (let i = 0; i < 2; i++) {
        const av = A[i].reduce(
          (acc, aij, j) => ({
            re: acc.re + aij.valueOf() * v[j].re,
            im: acc.im + aij.valueOf() * v[j].im,
          }),
          { re: 0, im: 0 },
        );
        const lv = {
          re: p.approx * v[i].re - p.approxIm * v[i].im,
          im: p.approx * v[i].im + p.approxIm * v[i].re,
        };
        expect(av.re).toBeCloseTo(lv.re, 5);
        expect(av.im).toBeCloseTo(lv.im, 5);
      }
    }
  });

  it("M22: 3x3 con bloque de rotación conserva eigenvector complejo y eigenvector real", () => {
    const A = toFractionMatrix([
      [0, -1, 0],
      [1, 0, 0],
      [0, 0, 2],
    ]);
    const { pairs } = computeEigenvalues(A);
    expect(pairs).toHaveLength(3);

    const complexPairs = pairs.filter((p) => p.isComplex);
    const realPairs = pairs.filter((p) => !p.isComplex);
    expect(complexPairs).toHaveLength(2);
    expect(realPairs).toHaveLength(1);
    expect(complexPairs.every((p) => p.complexEigenvector !== null)).toBe(true);
    expect(realPairs[0].eigenvector).not.toBeNull();
    expect(realPairs[0].approx).toBeCloseTo(2, 6);

    for (const p of complexPairs) {
      const v = p.complexEigenvector!;
      for (let i = 0; i < 3; i++) {
        const av = A[i].reduce(
          (acc, aij, j) => ({
            re: acc.re + aij.valueOf() * v[j].re,
            im: acc.im + aij.valueOf() * v[j].im,
          }),
          { re: 0, im: 0 },
        );
        const lv = {
          re: p.approx * v[i].re - p.approxIm * v[i].im,
          im: p.approx * v[i].im + p.approxIm * v[i].re,
        };
        expect(av.re).toBeCloseTo(lv.re, 5);
        expect(av.im).toBeCloseTo(lv.im, 5);
      }
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

  function expectResidualSmall(
    A: ReturnType<typeof toFractionMatrix>,
    p: ReturnType<typeof computeEigenvalues>["pairs"][number],
    tolerance = 1e-4,
  ) {
    if (p.isComplex) {
      expect(p.complexEigenvector).not.toBeNull();
      const v = p.complexEigenvector!;
      let residualSquared = 0;
      for (let i = 0; i < A.length; i++) {
        const av = A[i].reduce(
          (acc, aij, j) => ({
            re: acc.re + aij.valueOf() * v[j].re,
            im: acc.im + aij.valueOf() * v[j].im,
          }),
          { re: 0, im: 0 },
        );
        const lv = {
          re: p.approx * v[i].re - p.approxIm * v[i].im,
          im: p.approx * v[i].im + p.approxIm * v[i].re,
        };
        residualSquared += (av.re - lv.re) ** 2 + (av.im - lv.im) ** 2;
      }
      expect(Math.sqrt(residualSquared)).toBeLessThan(tolerance);
    } else {
      expect(p.eigenvector).not.toBeNull();
      const v = p.eigenvector!;
      let residualSquared = 0;
      for (let i = 0; i < A.length; i++) {
        const av = A[i].reduce((sum, aij, j) => sum + aij.valueOf() * v[j], 0);
        residualSquared += (av - p.approx * v[i]) ** 2;
      }
      expect(Math.sqrt(residualSquared)).toBeLessThan(tolerance);
    }
  }

  it("M23: 4x4 diagonal usa ruta numérica y produce eigenpares válidos", () => {
    const A = toFractionMatrix([
      [1,0,0,0],
      [0,2,0,0],
      [0,0,3,0],
      [0,0,0,4],
    ]);
    const { pairs, allExact } = computeEigenvalues(A);
    expect(allExact).toBe(false);
    expect(pairs).toHaveLength(4);
    expect(pairs.map((p) => p.approx)).toEqual([
      expect.closeTo(1, 5),
      expect.closeTo(2, 5),
      expect.closeTo(3, 5),
      expect.closeTo(4, 5),
    ]);
    for (const p of pairs) expectResidualSmall(A, p);
  });

  it("M23: 6x6 diagonal escala hasta el nuevo máximo", () => {
    const A = toFractionMatrix([
      [1,0,0,0,0,0],
      [0,2,0,0,0,0],
      [0,0,3,0,0,0],
      [0,0,0,4,0,0],
      [0,0,0,0,5,0],
      [0,0,0,0,0,6],
    ]);
    const { pairs, allExact } = computeEigenvalues(A);
    expect(allExact).toBe(false);
    expect(pairs).toHaveLength(6);
    for (let i = 0; i < 6; i++) expect(pairs[i].approx).toBeCloseTo(i + 1, 4);
    for (const p of pairs) expectResidualSmall(A, p, 2e-4);
  });

  it("M23: 4x4 con dos bloques de rotación calcula cuatro eigenpares complejos", () => {
    const A = toFractionMatrix([
      [0,-1,0,0],
      [1,0,0,0],
      [0,0,0,-2],
      [0,0,2,0],
    ]);
    const { pairs } = computeEigenvalues(A);
    expect(pairs).toHaveLength(4);
    expect(pairs.every((p) => p.isComplex)).toBe(true);
    const magnitudes = pairs.map((p) => Math.abs(p.approxIm)).sort((a,b) => a-b);
    expect(magnitudes[0]).toBeCloseTo(1, 4);
    expect(magnitudes[1]).toBeCloseTo(1, 4);
    expect(magnitudes[2]).toBeCloseTo(2, 4);
    expect(magnitudes[3]).toBeCloseTo(2, 4);
    for (const p of pairs) expectResidualSmall(A, p, 2e-4);
  });

  it("M24: identidad 6x6 agrupa λ=1 con multiplicidad 6 y conserva eigenvector válido", () => {
    const A = toFractionMatrix(Array.from({ length: 6 }, (_, r) =>
      Array.from({ length: 6 }, (_, col) => (r === col ? 1 : 0)),
    ));
    const { pairs } = computeEigenvalues(A);
    expect(pairs).toHaveLength(1);
    expect(pairs[0].approx).toBeCloseTo(1, 10);
    expect(pairs[0].multiplicity).toBe(6);
    expectResidualSmall(A, pairs[0], 1e-8);
  });

  it("M24: diagonal casi repetida no fusiona eigenvalores distintos", () => {
    const A = toFractionMatrix([
      [1,0,0,0],
      [0,"1.000001",0,0],
      [0,0,2,0],
      [0,0,0,3],
    ]);
    const { pairs } = computeEigenvalues(A);
    expect(pairs).toHaveLength(4);
    expect(pairs[0].approx).toBeCloseTo(1, 8);
    expect(pairs[1].approx).toBeCloseTo(1.000001, 8);
    expect(pairs[0].multiplicity).toBe(1);
    expect(pairs[1].multiplicity).toBe(1);
  });

  it("M24: Jordan 4x4 defectivo reporta multiplicidad 4 y al menos un eigenvector", () => {
    const A = toFractionMatrix([
      [2,1,0,0],
      [0,2,1,0],
      [0,0,2,1],
      [0,0,0,2],
    ]);
    const { pairs } = computeEigenvalues(A);
    expect(pairs).toHaveLength(1);
    expect(pairs[0].approx).toBeCloseTo(2, 10);
    expect(pairs[0].multiplicity).toBe(4);
    expectResidualSmall(A, pairs[0], 1e-8);
  });

  it("M24: matriz defectiva densa similar a Jordan mantiene λ=2 y residual controlado", () => {
    const A = toFractionMatrix([
      [1,"2/3","1/3","1/3"],
      ["-4/5","32/15","2/3","-2/15"],
      [-1,"-1/3","10/3","-5/3"],
      ["1/5","-8/15","1/3","23/15"],
    ]);
    const { pairs } = computeEigenvalues(A);
    expect(pairs.length).toBeGreaterThanOrEqual(1);
    expect(pairs.reduce((sum, p) => sum + p.multiplicity, 0)).toBe(4);
    for (const p of pairs) {
      expect(p.approx).toBeCloseTo(2, 3);
      expect(Math.abs(p.approxIm)).toBeLessThan(5e-3);
      if (p.eigenvector || p.complexEigenvector) expectResidualSmall(A, p, 5e-4);
    }
    expect(pairs.some((p) => p.eigenvector !== null || p.complexEigenvector !== null)).toBe(true);
  });

  it("M24: escalas grandes y pequeñas conservan eigenvalores triangulares", () => {
    const large = toFractionMatrix([
      [100000000,0,0,0],
      [0,200000000,0,0],
      [0,0,300000000,0],
      [0,0,0,400000000],
    ]);
    const small = toFractionMatrix([
      ["1e-8",0,0,0],
      [0,"2e-8",0,0],
      [0,0,"3e-8",0],
      [0,0,0,"4e-8"],
    ]);
    expect(computeEigenvalues(large).pairs.map((p) => p.approx)).toEqual([
      expect.closeTo(1e8, 0),
      expect.closeTo(2e8, 0),
      expect.closeTo(3e8, 0),
      expect.closeTo(4e8, 0),
    ]);
    expect(computeEigenvalues(small).pairs.map((p) => p.approx)).toEqual([
      expect.closeTo(1e-8, 12),
      expect.closeTo(2e-8, 12),
      expect.closeTo(3e-8, 12),
      expect.closeTo(4e-8, 12),
    ]);
  });

  it("M23: rechaza 1x1, no cuadradas y tamaños mayores a 6", () => {
    expect(() => computeEigenvalues(toFractionMatrix([[5]]))).toThrow();
    expect(() => computeEigenvalues(toFractionMatrix([[1,2,3],[4,5,6]]))).toThrow();
    const A7 = toFractionMatrix(Array.from({ length: 7 }, (_, r) =>
      Array.from({ length: 7 }, (_, col) => (r === col ? r + 1 : 0)),
    ));
    expect(() => computeEigenvalues(A7)).toThrow();
  });
});
