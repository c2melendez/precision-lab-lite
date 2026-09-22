// engine/eigenOps.ts — Módulo K1 (spec_graficacion_matrices_estadistica_unidades.md,
// sección 3.2, diseño confirmado en K0). Importa Algebrite SOLO a través de
// algebriteClient.ts (regla de capa dura, ver su cabecera) — nunca
// `import Algebrite from "algebrite"` directo acá.
//
// Alcance determinado en K0, no supuesto:
// - Eigenvalores 2x2/3x3: ruta simbólica exacta cuando roots() da una
//   forma limpia (racional, irracional simple, compleja simple).
// - M23: 4x4–6x6 usan ruta numérica Faddeev–LeVerrier + Durand–Kerner.
// - M24: escalado previo, reinicios deterministas, pulido Newton, ruta
//   triangular exacta y selección adaptativa de eigenvector por residual.
//   Fallback a numérico cuando el resultado simbólico es "casus
//   irreducibilis" (cúbica con 3 raíces reales irracionales que
//   roots() expresa con cos/sin/potencias fraccionarias de -1 —
//   matemáticamente correctas pero ilegibles).
// - Multiplicidad: detectada vía mcd(p, p') repetido, porque roots()
//   SIEMPRE colapsa a raíces distintas (confirmado en K0).
// - Eigenvectores: numéricos (float). M22 amplía el espacio nulo a
//   aritmética compleja. M23 reutiliza ese espacio nulo para 4x4–6x6.

import Fraction from "fraction.js";
import type { Matrix } from "./matrixOps";
import { expand, polynomialGcd, solveEquation, derivative, substituteAndFloat } from "./algebriteClient";
import { ErrorCode, type AppError } from "../types";

export interface ComplexVectorComponent {
  re: number;
  im: number;
}

export interface EigenPair {
  /** Forma exacta en sintaxis Algebrite (ej. "3", "2-2^(1/2)", "i") — null si solo hay aproximación numérica. */
  exact: string | null;
  /** Parte real de la aproximación decimal, siempre presente. */
  approx: number;
  /** Parte imaginaria de la aproximación decimal; 0 para eigenvalores reales. */
  approxIm: number;
  multiplicity: number;
  isComplex: boolean;
  /** Eigenvector numérico real cuando λ es real. */
  eigenvector: number[] | null;
  /** M22: eigenvector numérico complejo cuando λ es complejo. */
  complexEigenvector: ComplexVectorComponent[] | null;
}

function fractionToAlgebriteStr(f: Fraction): string {
  return f.toFraction(false);
}

/**
 * Construye det(A - xI) como una expresión Algebrite, por expansión de
 * cofactores sobre strings — mismo algoritmo que `determinant()` en
 * matrixOps.ts, pero operando sobre texto simbólico en vez de
 * `Fraction`, porque la diagonal necesita "-x" y Fraction no puede
 * representar una variable libre.
 */
function buildCharacteristicPolynomialExpr(matrix: Matrix): string {
  const M: string[][] = matrix.map((row, i) =>
    row.map((f, j) => {
      const s = fractionToAlgebriteStr(f);
      return i === j ? `(${s}-x)` : `(${s})`;
    }),
  );

  function minor(mat: string[][], skipRow: number, skipCol: number): string[][] {
    return mat.filter((_, r) => r !== skipRow).map((row) => row.filter((_, c) => c !== skipCol));
  }

  function det(mat: string[][]): string {
    const k = mat.length;
    if (k === 1) return mat[0][0];
    if (k === 2) return `(${mat[0][0]}*${mat[1][1]}-${mat[0][1]}*${mat[1][0]})`;
    const terms: string[] = [];
    for (let c = 0; c < k; c++) {
      const sign = c % 2 === 0 ? "+" : "-";
      terms.push(`${sign}${mat[0][c]}*(${det(minor(mat, 0, c))})`);
    }
    return `(${terms.join("")})`;
  }

  return det(M);
}

/** Extrae todos los números (parte real e imaginaria) de un string de Algebrite para chequear "≈0". */
function isApproxZero(algebriteFloatResult: string, epsilon = 1e-6): boolean {
  const nums = algebriteFloatResult.match(/-?\d+\.?\d*(e[-+]?\d+)?/gi) ?? [];
  if (nums.length === 0) return false;
  return nums.every((n) => Math.abs(parseFloat(n)) < epsilon);
}

/** K0: heurística de "resultado ilegible" (casus irreducibilis) — cos/sin o potencia fraccionaria de -1. */
function looksMessy(rootExpr: string): boolean {
  return /cos\(|sin\(|\(-1\)\^\(/.test(rootExpr);
}

function parseComplexFloat(s: string): { re: number; im: number } {
  // Algebrite float() de un complejo viene como "a.a+b.b*i" o "a.a-b.b*i"
  // o solo "a.a" si es real, o solo "b.b*i"/"-b.b*i" si es imaginario puro.
  const cleaned = s.replace(/\.\.\.$/, "").trim();
  const imMatch = cleaned.match(/([+-]?\d+\.?\d*(?:e[+-]?\d+)?)\*i/);
  const im = imMatch ? parseFloat(imMatch[1]) : cleaned.includes("i") && !imMatch ? (cleaned.startsWith("-i") ? -1 : cleaned === "i" ? 1 : 0) : 0;
  const reMatch = cleaned.replace(/[+-]?\d+\.?\d*(?:e[+-]?\d+)?\*i/, "").match(/-?\d+\.?\d*(?:e[+-]?\d+)?/);
  const re = reMatch ? parseFloat(reMatch[0]) : 0;
  return { re, im };
}

type ComplexNumber = { re: number; im: number };

function complexAbs(z: ComplexNumber): number {
  return Math.hypot(z.re, z.im);
}

function complexSub(a: ComplexNumber, b: ComplexNumber): ComplexNumber {
  return { re: a.re - b.re, im: a.im - b.im };
}

function complexMul(a: ComplexNumber, b: ComplexNumber): ComplexNumber {
  return {
    re: a.re * b.re - a.im * b.im,
    im: a.re * b.im + a.im * b.re,
  };
}

function complexDiv(a: ComplexNumber, b: ComplexNumber): ComplexNumber {
  const d = b.re * b.re + b.im * b.im;
  return {
    re: (a.re * b.re + a.im * b.im) / d,
    im: (a.im * b.re - a.re * b.im) / d,
  };
}

/** M22: espacio nulo numérico complejo de una matriz cuadrada. */
function nullSpaceVectorComplex(
  M: ComplexNumber[][],
  epsilon = 1e-6,
): ComplexVectorComponent[] | null {
  const n = M.length;
  const m = M.map((row) => row.map((z) => ({ ...z })));
  const pivotCols: number[] = [];
  let pivotRow = 0;

  for (let col = 0; col < n && pivotRow < n; col++) {
    let sel = -1;
    let maxAbs = epsilon;
    for (let r = pivotRow; r < n; r++) {
      const magnitude = complexAbs(m[r][col]);
      if (magnitude > maxAbs) {
        maxAbs = magnitude;
        sel = r;
      }
    }
    if (sel === -1) continue;

    [m[sel], m[pivotRow]] = [m[pivotRow], m[sel]];
    const pivot = m[pivotRow][col];
    m[pivotRow] = m[pivotRow].map((z) => complexDiv(z, pivot));

    for (let r = 0; r < n; r++) {
      if (r === pivotRow) continue;
      const factor = m[r][col];
      if (complexAbs(factor) < epsilon) continue;
      m[r] = m[r].map((z, c) =>
        complexSub(z, complexMul(factor, m[pivotRow][c])),
      );
    }

    pivotCols.push(col);
    pivotRow++;
  }

  const freeCol = Array.from({ length: n }, (_, c) => c).find(
    (c) => !pivotCols.includes(c),
  );
  if (freeCol === undefined) return null;

  const v: ComplexNumber[] = Array.from({ length: n }, () => ({ re: 0, im: 0 }));
  v[freeCol] = { re: 1, im: 0 };
  pivotCols.forEach((col, i) => {
    const z = m[i][freeCol];
    v[col] = { re: -z.re, im: -z.im };
  });

  const norm = Math.sqrt(
    v.reduce((sum, z) => sum + z.re * z.re + z.im * z.im, 0),
  );
  if (norm <= epsilon) return null;

  return v.map((z) => ({ re: z.re / norm, im: z.im / norm }));
}

/**
 * Espacio nulo (una dimensión) de una matriz numérica real por
 * eliminación gaussiana con pivoteo parcial y tolerancia epsilon —
 * necesario porque λ es solo una aproximación float, así que (A-λI)
 * nunca es EXACTAMENTE singular en punto flotante.
 */
function nullSpaceVector(M: number[][], epsilon = 1e-6): number[] | null {
  const n = M.length;
  const m = M.map((row) => [...row]);
  const pivotCols: number[] = [];
  let pivotRow = 0;

  for (let col = 0; col < n && pivotRow < n; col++) {
    let sel = -1;
    let maxAbs = epsilon;
    for (let r = pivotRow; r < n; r++) {
      if (Math.abs(m[r][col]) > maxAbs) {
        maxAbs = Math.abs(m[r][col]);
        sel = r;
      }
    }
    if (sel === -1) continue;
    [m[sel], m[pivotRow]] = [m[pivotRow], m[sel]];
    const pivotVal = m[pivotRow][col];
    m[pivotRow] = m[pivotRow].map((v) => v / pivotVal);
    for (let r = 0; r < n; r++) {
      if (r === pivotRow) continue;
      const factor = m[r][col];
      if (Math.abs(factor) < epsilon) continue;
      m[r] = m[r].map((v, c) => v - factor * m[pivotRow][c]);
    }
    pivotCols.push(col);
    pivotRow++;
  }

  const freeCol = Array.from({ length: n }, (_, c) => c).find((c) => !pivotCols.includes(c));
  if (freeCol === undefined) return null; // rango completo — no debería pasar si λ es realmente un eigenvalor

  const v = new Array(n).fill(0);
  v[freeCol] = 1;
  pivotCols.forEach((col, i) => {
    v[col] = -m[i][freeCol];
  });
  const norm = Math.sqrt(v.reduce((s, x) => s + x * x, 0));
  return norm > epsilon ? v.map((x) => x / norm) : null;
}


function numericIdentity(n: number): number[][] {
  return Array.from({ length: n }, (_, r) =>
    Array.from({ length: n }, (_, col) => (r === col ? 1 : 0)),
  );
}

function numericMultiply(a: number[][], b: number[][]): number[][] {
  const rows = a.length;
  const cols = b[0].length;
  const inner = b.length;
  return Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (_, col) => {
      let sum = 0;
      for (let k = 0; k < inner; k++) sum += a[r][k] * b[k][col];
      return sum;
    }),
  );
}

function numericTrace(a: number[][]): number {
  return a.reduce((sum, row, i) => sum + row[i], 0);
}

function numericInfinityNorm(a: number[][]): number {
  return Math.max(
    0,
    ...a.map((row) => row.reduce((sum, value) => sum + Math.abs(value), 0)),
  );
}

/** M24: detecta matrices triangulares exactas. Sus eigenvalores son la diagonal,
 * evitando la inestabilidad de hallar raíces múltiples con Durand–Kerner. */
function triangularDiagonal(matrix: Matrix): number[] | null {
  const n = matrix.length;
  let upper = true;
  let lower = true;
  for (let r = 0; r < n; r++) {
    for (let col = 0; col < n; col++) {
      if (r > col && !matrix[r][col].equals(0)) upper = false;
      if (r < col && !matrix[r][col].equals(0)) lower = false;
    }
  }
  if (!upper && !lower) return null;
  return matrix.map((row, i) => row[i].valueOf());
}

/** Coeficientes del polinomio característico mónico mediante Faddeev–LeVerrier.
 * Devuelve [1, c1, ..., cn] para x^n + c1*x^(n-1) + ... + cn. */
function characteristicCoefficientsFromNumeric(A: number[][]): number[] {
  const n = A.length;
  let B = numericIdentity(n);
  const coeffs = [1];

  for (let k = 1; k <= n; k++) {
    const AB = numericMultiply(A, B);
    const ck = -numericTrace(AB) / k;
    coeffs.push(Math.abs(ck) < 1e-14 ? 0 : ck);
    B = AB.map((row, r) =>
      row.map((value, col) => value + (r === col ? ck : 0)),
    );
  }
  return coeffs;
}

function complexAdd(a: ComplexNumber, b: ComplexNumber): ComplexNumber {
  return { re: a.re + b.re, im: a.im + b.im };
}

function evaluatePolynomialComplex(coeffs: number[], z: ComplexNumber): ComplexNumber {
  let result: ComplexNumber = { re: coeffs[0], im: 0 };
  for (let i = 1; i < coeffs.length; i++) {
    result = complexAdd(complexMul(result, z), { re: coeffs[i], im: 0 });
  }
  return result;
}

function derivativeCoefficients(coeffs: number[]): number[] {
  const degree = coeffs.length - 1;
  return coeffs.slice(0, -1).map((coefficient, i) => coefficient * (degree - i));
}

function polynomialResidual(coeffs: number[], roots: ComplexNumber[]): number {
  return Math.max(0, ...roots.map((root) => complexAbs(evaluatePolynomialComplex(coeffs, root))));
}

function polishRootNewton(
  coeffs: number[],
  initial: ComplexNumber,
  iterations = 12,
): ComplexNumber {
  const derivative = derivativeCoefficients(coeffs);
  let root = initial;
  for (let i = 0; i < iterations; i++) {
    const value = evaluatePolynomialComplex(coeffs, root);
    const slope = evaluatePolynomialComplex(derivative, root);
    if (complexAbs(slope) < 1e-14) break;
    const correction = complexDiv(value, slope);
    root = complexSub(root, correction);
    if (complexAbs(correction) < 1e-13) break;
  }
  return root;
}

interface RootSolveResult {
  roots: ComplexNumber[];
  converged: boolean;
  maxResidual: number;
}

/** M24: Durand–Kerner con reinicios deterministas y selección por residual.
 * Los reinicios reducen sensibilidad a una sola distribución inicial. */
function durandKernerRoots(coeffs: number[]): RootSolveResult {
  const degree = coeffs.length - 1;
  const radius = 1 + Math.max(...coeffs.slice(1).map((x) => Math.abs(x)));
  const phaseOffsets = [0.137, 0.3141592653589793, 0.731, 1.111];
  const tolerance = 1e-12;
  const maxIterations = 3000;

  let best: RootSolveResult | null = null;

  for (const phase of phaseOffsets) {
    let roots = Array.from({ length: degree }, (_, k) => {
      const angle = (2 * Math.PI * k) / degree + phase;
      return { re: radius * Math.cos(angle), im: radius * Math.sin(angle) };
    });
    let converged = false;

    for (let iteration = 0; iteration < maxIterations; iteration++) {
      let maxDelta = 0;
      const next = roots.map((root, i) => {
        let denom: ComplexNumber = { re: 1, im: 0 };
        for (let j = 0; j < degree; j++) {
          if (j === i) continue;
          let diff = complexSub(root, roots[j]);
          if (complexAbs(diff) < 1e-14) {
            diff = {
              re: diff.re + 1e-10 * (i + 1),
              im: diff.im + 1e-10 * (j + 1),
            };
          }
          denom = complexMul(denom, diff);
        }
        if (complexAbs(denom) < 1e-20) return root;
        const correction = complexDiv(evaluatePolynomialComplex(coeffs, root), denom);
        maxDelta = Math.max(maxDelta, complexAbs(correction));
        return complexSub(root, correction);
      });
      roots = next;
      if (maxDelta < tolerance) {
        converged = true;
        break;
      }
    }

    roots = roots.map((root) => polishRootNewton(coeffs, root));
    const maxResidual = polynomialResidual(coeffs, roots);
    const candidate = { roots, converged, maxResidual };
    if (best === null || candidate.maxResidual < best.maxResidual) best = candidate;
    if (converged && maxResidual < 1e-9) break;
  }

  return best!;
}

function clusterNumericRoots(
  roots: ComplexNumber[],
  tolerance: number,
): Array<{ root: ComplexNumber; multiplicity: number }> {
  const clusters: Array<{ members: ComplexNumber[] }> = [];
  for (const root of roots) {
    const found = clusters.find((cluster) => {
      const center = cluster.members.reduce(
        (acc, z) => ({ re: acc.re + z.re, im: acc.im + z.im }),
        { re: 0, im: 0 },
      );
      center.re /= cluster.members.length;
      center.im /= cluster.members.length;
      const scale = Math.max(1, complexAbs(center), complexAbs(root));
      return complexAbs(complexSub(root, center)) <= tolerance * scale;
    });
    if (found) found.members.push(root);
    else clusters.push({ members: [root] });
  }

  return clusters.map(({ members }) => {
    const sum = members.reduce(
      (acc, z) => ({ re: acc.re + z.re, im: acc.im + z.im }),
      { re: 0, im: 0 },
    );
    let re = sum.re / members.length;
    let im = sum.im / members.length;
    if (Math.abs(re) < 1e-10) re = 0;
    if (Math.abs(im) < 1e-10) im = 0;
    return { root: { re, im }, multiplicity: members.length };
  });
}

function clusterRealDiagonal(
  values: number[],
  tolerance = 1e-9,
): Array<{ root: ComplexNumber; multiplicity: number }> {
  const sorted = [...values].sort((a, b) => a - b);
  const clusters: Array<{ values: number[] }> = [];
  for (const value of sorted) {
    const found = clusters.find((cluster) => {
      const center = cluster.values.reduce((sum, x) => sum + x, 0) / cluster.values.length;
      return Math.abs(value - center) <= tolerance * Math.max(1, Math.abs(value), Math.abs(center));
    });
    if (found) found.values.push(value);
    else clusters.push({ values: [value] });
  }
  return clusters.map((cluster) => ({
    root: {
      re: cluster.values.reduce((sum, x) => sum + x, 0) / cluster.values.length,
      im: 0,
    },
    multiplicity: cluster.values.length,
  }));
}

function formatNumericCharacteristicPolynomial(coeffs: number[]): string {
  const degree = coeffs.length - 1;
  const terms: string[] = ["x^" + degree];
  for (let i = 1; i < coeffs.length; i++) {
    const coefficient = coeffs[i];
    if (Math.abs(coefficient) < 1e-10) continue;
    const power = degree - i;
    const sign = coefficient >= 0 ? "+" : "-";
    const magnitude = Math.abs(coefficient);
    const rounded = Math.abs(magnitude - Math.round(magnitude)) < 1e-10
      ? String(Math.round(magnitude))
      : magnitude.toPrecision(8).replace(/\.?0+$/, "");
    const variable = power === 0 ? "" : power === 1 ? "*x" : `*x^${power}`;
    terms.push(`${sign}${rounded}${variable}`);
  }
  return terms.join("");
}

function complexVectorResidual(
  matrix: Matrix,
  lambda: ComplexNumber,
  vector: ComplexVectorComponent[],
): number {
  let residualSquared = 0;
  let vectorNormSquared = 0;
  const numeric = matrix.map((row) => row.map((f) => f.valueOf()));
  const matrixNorm = Math.max(1, numericInfinityNorm(numeric));

  for (let i = 0; i < matrix.length; i++) {
    const av = matrix[i].reduce(
      (acc, aij, j) => ({
        re: acc.re + aij.valueOf() * vector[j].re,
        im: acc.im + aij.valueOf() * vector[j].im,
      }),
      { re: 0, im: 0 },
    );
    const lv = complexMul(lambda, vector[i]);
    residualSquared += (av.re - lv.re) ** 2 + (av.im - lv.im) ** 2;
    vectorNormSquared += vector[i].re ** 2 + vector[i].im ** 2;
  }

  const denom = (matrixNorm + complexAbs(lambda)) * Math.sqrt(Math.max(vectorNormSquared, 1e-30));
  return Math.sqrt(residualSquared) / Math.max(denom, 1e-30);
}

/** M24: prueba varias tolerancias de rango y elige el eigenvector con menor residual. */
function bestComplexEigenvector(
  matrix: Matrix,
  lambda: ComplexNumber,
): ComplexVectorComponent[] | null {
  const numeric = matrix.map((row) => row.map((f) => f.valueOf()));
  const matrixNorm = Math.max(1, numericInfinityNorm(numeric));
  const shifted: ComplexNumber[][] = matrix.map((row, i) =>
    row.map((f, j) => ({
      re: f.valueOf() - (i === j ? lambda.re : 0),
      im: i === j ? -lambda.im : 0,
    })),
  );

  const epsilons = [1e-10, 1e-9, 1e-8, 1e-7, 1e-6, 1e-5, 1e-4].map(
    (epsilon) => epsilon * matrixNorm,
  );
  let best: { vector: ComplexVectorComponent[]; residual: number } | null = null;

  for (const epsilon of epsilons) {
    const vector = nullSpaceVectorComplex(shifted, epsilon);
    if (!vector) continue;
    const residual = complexVectorResidual(matrix, lambda, vector);
    if (best === null || residual < best.residual) best = { vector, residual };
  }

  if (!best) return null;
  return best.residual <= 5e-6 ? best.vector : null;
}

function computeEigenvaluesNumeric(matrix: Matrix): {
  pairs: EigenPair[];
  allExact: boolean;
  characteristicPolynomial: string;
} {
  const numeric = matrix.map((row) => row.map((f) => f.valueOf()));
  const scale = Math.max(1, numericInfinityNorm(numeric));
  const scaled = numeric.map((row) => row.map((value) => value / scale));
  const scaledCoeffs = characteristicCoefficientsFromNumeric(scaled);

  let rootClusters: Array<{ root: ComplexNumber; multiplicity: number }>;
  const diagonal = triangularDiagonal(matrix);

  if (diagonal) {
    rootClusters = clusterRealDiagonal(diagonal);
  } else {
    const solved = durandKernerRoots(scaledCoeffs);
    const scaledResidual = solved.maxResidual;
    if (!Number.isFinite(scaledResidual) || scaledResidual > 1e-5) {
      throw {
        code: ErrorCode.UNSUPPORTED_OPERATION,
        message: "El solver numérico de eigen no convergió con residual suficiente para esta matriz.",
      } as AppError;
    }

    const unscaledRoots = solved.roots.map((root) => ({
      re: root.re * scale,
      im: root.im * scale,
    }));

    // Tolerancia adaptativa: crece suavemente con el residual de raíces,
    // pero queda acotada para no fusionar eigenvalores cercanos legítimos.
    const clusterTolerance = Math.min(
      1e-4,
      Math.max(1e-8, 10 * Math.sqrt(Math.max(scaledResidual, 1e-16))),
    );
    rootClusters = clusterNumericRoots(unscaledRoots, clusterTolerance);
  }

  // Coeficientes solo para mostrar el polinomio en escala original.
  const originalCoeffs = characteristicCoefficientsFromNumeric(numeric);

  const pairs: EigenPair[] = rootClusters.map(({ root, multiplicity }) => {
    let re = root.re;
    let im = root.im;
    if (Math.abs(re) < 1e-10 * scale) re = 0;
    if (Math.abs(im) < 1e-10 * scale) im = 0;

    const isComplex = Math.abs(im) > 1e-7 * Math.max(1, Math.abs(re), Math.abs(im));
    const vector = bestComplexEigenvector(matrix, { re, im });
    let eigenvector: number[] | null = null;
    let complexEigenvector: ComplexVectorComponent[] | null = null;

    if (vector) {
      if (!isComplex && vector.every((z) => Math.abs(z.im) < 1e-6)) {
        eigenvector = vector.map((z) => z.re);
      } else {
        complexEigenvector = vector;
      }
    }

    return {
      exact: null,
      approx: re,
      approxIm: im,
      multiplicity,
      isComplex,
      eigenvector,
      complexEigenvector,
    };
  });

  pairs.sort((a, b) => a.approx - b.approx || a.approxIm - b.approxIm);

  return {
    pairs,
    allExact: false,
    characteristicPolynomial: formatNumericCharacteristicPolynomial(originalCoeffs),
  };
}

export function computeEigenvalues(matrix: Matrix): { pairs: EigenPair[]; allExact: boolean; characteristicPolynomial: string } {
  const n = matrix.length;
  if (matrix.some((row) => row.length !== n) || n < 2 || n > 6) {
    throw {
      code: ErrorCode.UNSUPPORTED_OPERATION,
      message: "Los eigenvalores requieren una matriz cuadrada de tamaño 2×2 a 6×6.",
    } as AppError;
  }

  // M23: 4×4–6×6 usan una ruta numérica separada. 2×2/3×3 conservan
  // exactamente el solver simbólico validado en K0/M22.
  if (n >= 4) return computeEigenvaluesNumeric(matrix);

  const charPolyRaw = buildCharacteristicPolynomialExpr(matrix);
  const charPoly = expand(charPolyRaw);
  const distinctRoots = solveEquation(charPoly, "x");

  const allExact = !distinctRoots.some(looksMessy);

  // Multiplicidad: mcd(p, p') repetido — cada iteración que "atrapa" una
  // raíz de mayor multiplicidad reduce el grado del mcd en 1 por cada
  // multiplicidad extra (K0: confirmado, no supuesto).
  const multiplicities = new Map<string, number>(distinctRoots.map((r) => [r, 1]));
  let currentPoly = charPoly;
  for (let iter = 0; iter < n - 1; iter++) {
    const deriv = derivative(currentPoly, "x", 1);
    let g: string;
    try {
      g = polynomialGcd(currentPoly, deriv);
    } catch {
      break;
    }
    if (/^-?\d+(\.\d+)?$/.test(g.trim())) break; // constante: no quedan raíces repetidas
    for (const r of distinctRoots) {
      const val = substituteAndFloat(g, "x", r);
      if (isApproxZero(val)) multiplicities.set(r, (multiplicities.get(r) ?? 1) + 1);
    }
    currentPoly = g;
  }

  const pairs: EigenPair[] = distinctRoots.map((r) => {
    const { re, im } = parseComplexFloat(evaluateFloatOf(r));
    const isComplex = Math.abs(im) > 1e-9;
    let eigenvector: number[] | null = null;
    let complexEigenvector: ComplexVectorComponent[] | null = null;

    if (isComplex) {
      const AminusLambdaI: ComplexNumber[][] = matrix.map((row, i) =>
        row.map((f, j) => ({
          re: f.valueOf() - (i === j ? re : 0),
          im: i === j ? -im : 0,
        })),
      );
      complexEigenvector = nullSpaceVectorComplex(AminusLambdaI);
    } else {
      const AminusLambdaI = matrix.map((row, i) =>
        row.map((f, j) => f.valueOf() - (i === j ? re : 0)),
      );
      eigenvector = nullSpaceVector(AminusLambdaI);
    }

    return {
      exact: allExact && !looksMessy(r) ? r : null,
      approx: re,
      approxIm: im,
      multiplicity: multiplicities.get(r) ?? 1,
      isComplex,
      eigenvector,
      complexEigenvector,
    };
  });

  return { pairs, allExact, characteristicPolynomial: charPoly };
}

function evaluateFloatOf(rootExpr: string): string {
  // float(r) directo — separado de substituteAndFloat porque acá no hay
  // sustitución, solo forzar aproximación decimal del propio valor.
  return substituteAndFloat("y", "y", rootExpr);
}
