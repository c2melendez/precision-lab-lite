// Fix (decisión de Carlos, cierre de la suite de paridad de teclado v1.0):
// <, >, ≤, ≥ no tenían ningún solver detrás. "Solver básico" (decisión
// de Carlos) = análisis de signos por intervalos: se resuelve
// diff = izquierda - derecha = 0 para encontrar las raíces REALES (con
// el mismo solveEquation() que ya usa solveAlgebra.ts), se prueba el
// signo de diff en un punto de cada intervalo entre raíces consecutivas
// (y en los dos extremos hacia ±infinito), y se arman los intervalos que
// cumplen el operador pedido.
//
// Alcance: una variable, un operador, sin cadenas dobles (eso ya lo
// bloquea inequalitySplit.ts antes de llegar acá). Funciona para
// cualquier expresión de la que solveEquation() pueda sacar raíces
// reales (lineales, cuadráticas, polinomios de grado mayor, etc.) — no
// está limitado a lineales, pero tampoco intenta resolver desigualdades
// con funciones trascendentes que no tengan raíces algebraicas
// cerradas (ahí solveEquation() ya falla y este solver lo reporta como
// no resuelto, en vez de inventar un resultado).
import { evaluate, solveEquation } from "./algebriteClient";
import { compileNumeric } from "./numericFallback";
import { parseComplex } from "./complexFunctions";
import { ErrorCode, type AppError } from "../types";
import type { InequalityOperator } from "./parsing/inequalitySplit";

function appError(message: string): AppError {
  return { code: ErrorCode.UNSUPPORTED_OPERATION, message };
}

export interface InequalityResult {
  /** Descripción en texto plano del conjunto solución, ej. "x < 3" o
   * "-2 < x < 2" o "x <= -1 o x >= 4". */
  resultText: string;
  steps: { id: string; latex: string; explanation: string }[];
}

function satisfiesOperator(sign: number, operator: InequalityOperator): boolean {
  switch (operator) {
    case "<":
      return sign < 0;
    case ">":
      return sign > 0;
    case "<=":
      return sign <= 0;
    case ">=":
      return sign >= 0;
  }
}

export function solveInequality(
  diffAlgebrite: string,
  operator: InequalityOperator,
  variable: string,
): InequalityResult {
  let rootsRaw: string[];
  try {
    rootsRaw = solveEquation(diffAlgebrite, variable);
  } catch (err) {
    throw appError(
      `No se pudo resolver esta desigualdad: el solver básico necesita encontrar las raíces reales de "${diffAlgebrite} = 0" y no lo logró (${(err as AppError).message ?? err}).`,
    );
  }

  // Filtra a raíces REALES únicamente (una desigualdad ordena la recta
  // real; una raíz compleja no divide la recta en ningún punto).
  const realRoots: number[] = [];
  for (const r of rootsRaw) {
    let approx: string;
    try {
      approx = evaluate(`float(${r})`);
    } catch {
      continue;
    }
    const { re, im } = parseComplex(approx);
    if (Math.abs(im) < 1e-9 && Number.isFinite(re)) {
      realRoots.push(re);
    }
  }
  realRoots.sort((a, b) => a - b);
  // Deduplicar raíces muy cercanas (multiplicidad, o ruido numérico).
  const roots: number[] = [];
  for (const r of realRoots) {
    if (roots.length === 0 || Math.abs(r - roots[roots.length - 1]) > 1e-9) roots.push(r);
  }

  const fn = compileNumeric(diffAlgebrite, variable);
  const sign = (x: number): number => {
    const v = fn(x);
    if (!Number.isFinite(v)) return NaN;
    return v > 1e-9 ? 1 : v < -1e-9 ? -1 : 0;
  };

  if (roots.length === 0) {
    // Sin raíces reales: el signo de diff es constante en toda la recta
    // (o la expresión es constante). Un solo punto de prueba alcanza.
    const s = sign(0) || sign(1) || sign(-1);
    const holds = satisfiesOperator(s, operator);
    return {
      resultText: holds ? "todos los números reales" : "no tiene solución real",
      steps: [
        {
          id: "no-roots",
          latex: `${diffAlgebrite} ${operator} 0`,
          explanation: `"${diffAlgebrite} = 0" no tiene raíces reales, así que el signo de "${diffAlgebrite}" es siempre el mismo — se prueba en un punto cualquiera.`,
        },
      ],
    };
  }

  // Intervalos: (-∞,r0), (r0,r1), ..., (rN,∞) — se prueba un punto medio
  // de cada uno (o raíz±1 en los extremos abiertos).
  const testPoints: number[] = [roots[0] - Math.max(1, Math.abs(roots[0]))];
  for (let i = 0; i < roots.length - 1; i++) testPoints.push((roots[i] + roots[i + 1]) / 2);
  testPoints.push(roots[roots.length - 1] + Math.max(1, Math.abs(roots[roots.length - 1])));

  const intervalHolds = testPoints.map((p) => satisfiesOperator(sign(p), operator));
  const rootHolds = roots.map(() => operator === "<=" || operator === ">="); // en la raíz diff=0 exacto

  // Fusiona intervalos/raíces consecutivos que cumplen en un tramo único.
  type Bound = { value: number; open: boolean } | null; // null = infinito
  const segments: { lower: Bound; upper: Bound }[] = [];
  let i = 0;
  const n = roots.length;
  while (i <= n) {
    const holds = intervalHolds[i];
    if (!holds) {
      i++;
      continue;
    }
    let lower: Bound = i === 0 ? null : { value: roots[i - 1], open: !rootHolds[i - 1] };
    let upperRootIdx = i;
    // Extiende mientras la raíz de la derecha también cumpla y el
    // siguiente intervalo también cumpla (fusiona en un solo tramo).
    while (upperRootIdx < n && rootHolds[upperRootIdx] && intervalHolds[upperRootIdx + 1]) {
      upperRootIdx++;
    }
    const upper: Bound = upperRootIdx === n ? null : { value: roots[upperRootIdx], open: !rootHolds[upperRootIdx] };
    segments.push({ lower, upper });
    i = upperRootIdx + 1;
  }
  // Puntos aislados: una raíz que cumple pero ningún intervalo adyacente cumple.
  for (let k = 0; k < n; k++) {
    if (!rootHolds[k]) continue;
    const leftHolds = intervalHolds[k];
    const rightHolds = intervalHolds[k + 1];
    if (!leftHolds && !rightHolds) {
      segments.push({ lower: { value: roots[k], open: false }, upper: { value: roots[k], open: false } });
    }
  }
  segments.sort((a, b) => (a.lower?.value ?? -Infinity) - (b.lower?.value ?? -Infinity));

  if (segments.length === 0) {
    return {
      resultText: "No tiene solución real.",
      steps: [
        {
          id: "no-solution",
          latex: `${diffAlgebrite} ${operator} 0`,
          explanation: "Ningún intervalo de la recta real cumple la desigualdad.",
        },
      ],
    };
  }

  const fmt = (x: number): string => (Number.isInteger(x) ? String(x) : x.toFixed(4).replace(/0+$/, "").replace(/\.$/, ""));
  const parts = segments.map((seg) => {
    if (seg.lower && seg.upper && seg.lower.value === seg.upper.value) {
      return `${variable} = ${fmt(seg.lower.value)}`;
    }
    if (seg.lower === null && seg.upper === null) return `todos los números reales`;
    if (seg.lower === null) return `${variable} ${seg.upper!.open ? "<" : "<="} ${fmt(seg.upper!.value)}`;
    if (seg.upper === null) return `${variable} ${seg.lower.open ? ">" : ">="} ${fmt(seg.lower.value)}`;
    return `${fmt(seg.lower.value)} ${seg.lower.open ? "<" : "<="} ${variable} ${seg.upper.open ? "<" : "<="} ${fmt(seg.upper.value)}`;
  });

  return {
    resultText: parts.join(" o "),
    steps: [
      {
        id: "roots",
        latex: `${diffAlgebrite} = 0 \\Rightarrow ${variable} = ${roots.map(fmt).join(", ")}`,
        explanation: "Raíces reales que dividen la recta en intervalos de signo constante.",
      },
      {
        id: "result",
        latex: parts.join(" \\text{ o } "),
        explanation: "Intervalos donde se cumple la desigualdad, por prueba de signo en cada tramo.",
      },
    ],
  };
}
