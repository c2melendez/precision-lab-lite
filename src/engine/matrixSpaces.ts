// MV-E: bases del núcleo y del espacio columna (Fraction exacto vía rref).
import Fraction from "fraction.js";
import type { Step } from "../types";
import { rref, type Matrix } from "./matrixOps";

/** Base del núcleo: vectores (como filas) que anulan A·v = 0. Acepta múltiplos. */
export function nullspace(a: Matrix): { vectors: Matrix; steps: Step[] } {
  const { result: R } = rref(a);
  const rows = R.length;
  const cols = R[0]?.length ?? 0;
  const pivotCol: number[] = [];
  let r = 0;
  for (let c = 0; c < cols && r < rows; c++) {
    if (!R[r][c].equals(0)) {
      pivotCol.push(c);
      r++;
    }
  }
  const free: number[] = [];
  for (let c = 0; c < cols; c++) if (!pivotCol.includes(c)) free.push(c);
  const vectors: Matrix = free.map((freeIndex) => {
    const v = Array.from({ length: cols }, () => new Fraction(0));
    v[freeIndex] = new Fraction(1);
    for (let pi = 0; pi < pivotCol.length; pi++) {
      const pc = pivotCol[pi];
      // R[pi][pc] es 1 en rref; R[pi][freeIndex] es el coeficiente de la libre.
      v[pc] = R[pi][freeIndex].neg();
    }
    return v;
  });
  return {
    vectors,
    steps: [
      {
        id: "nullspace",
        latex: `\\ker(A)`,
        explanation: `Base del núcleo con ${vectors.length} vector(es) libre(s).`,
      },
    ],
  };
}

/** Base del espacio columna: columnas pivote de A (como filas en el resultado). */
export function columnspace(a: Matrix): { vectors: Matrix; steps: Step[] } {
  const { result: R } = rref(a);
  const rows = R.length;
  const cols = R[0]?.length ?? 0;
  const pivotCol: number[] = [];
  let r = 0;
  for (let c = 0; c < cols && r < rows; c++) {
    if (!R[r][c].equals(0)) {
      pivotCol.push(c);
      r++;
    }
  }
  const vectors: Matrix = pivotCol.map((c) => a.map((row) => row[c]));
  return {
    vectors,
    steps: [
      {
        id: "columnspace",
        latex: `\\operatorname{Col}(A)`,
        explanation: `Base del espacio columna: ${vectors.length} columna(s) pivote.`,
      },
    ],
  };
}
