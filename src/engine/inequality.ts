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

function gcdInt(a: number, b: number): number {
  a = Math.abs(Math.trunc(a));
  b = Math.abs(Math.trunc(b));
  while (b !== 0) [a, b] = [b, a % b];
  return a || 1;
}

function formatBoundedValue(value: number): string {
  if (Math.abs(value) < 1e-9) return "0";
  const ratio = value / Math.PI;
  for (let denominator = 1; denominator <= 24; denominator++) {
    const numerator = Math.round(ratio * denominator);
    if (Math.abs(ratio - numerator / denominator) < 1e-7) {
      const g = gcdInt(numerator, denominator);
      const n = numerator / g;
      const d = denominator / g;
      if (d === 1) {
        if (n === 1) return "π";
        if (n === -1) return "-π";
        return `${n}π`;
      }
      if (n === 1) return `π/${d}`;
      if (n === -1) return `-π/${d}`;
      return `${n}π/${d}`;
    }
  }
  return Number(value.toFixed(8)).toString();
}

function findNumericRoots(
  fn: (x: number) => number,
  lower: number,
  upper: number,
): number[] {
  const roots: number[] = [];
  const add = (x: number) => {
    if (!Number.isFinite(x) || x < lower - 1e-8 || x > upper + 1e-8) return;
    if (!roots.some((r) => Math.abs(r - x) < 1e-6)) roots.push(x);
  };
  const samples = 4096;
  let px = lower;
  let py = fn(px);
  if (Number.isFinite(py) && Math.abs(py) < 1e-10) add(px);

  for (let i = 1; i <= samples; i++) {
    const x = lower + ((upper - lower) * i) / samples;
    const y = fn(x);
    if (Number.isFinite(y) && Math.abs(y) < 1e-10) add(x);

    if (Number.isFinite(py) && Number.isFinite(y) && py * y < 0) {
      let lo = px;
      let hi = x;
      let flo = py;
      for (let step = 0; step < 60; step++) {
        const mid = (lo + hi) / 2;
        const fm = fn(mid);
        if (!Number.isFinite(fm)) break;
        if (Math.abs(fm) < 1e-12) {
          lo = hi = mid;
          break;
        }
        if (flo * fm <= 0) {
          hi = mid;
        } else {
          lo = mid;
          flo = fm;
        }
      }
      const root = (lo + hi) / 2;
      const residual = fn(root);
      if (Number.isFinite(residual) && Math.abs(residual) < 1e-6) add(root);
    }
    px = x;
    py = y;
  }
  return roots.sort((a, b) => a - b);
}

function knownTrigPoles(diff: string, lower: number, upper: number): number[] {
  const poles: number[] = [];
  const addFamily = (offset: number, period: number) => {
    const kMin = Math.floor((lower - offset) / period) - 1;
    const kMax = Math.ceil((upper - offset) / period) + 1;
    for (let k = kMin; k <= kMax; k++) {
      const x = offset + k * period;
      if (x > lower + 1e-9 && x < upper - 1e-9) poles.push(x);
    }
  };

  // tan/sec => cos(x)=0. csc/cot => sin(x)=0.
  if (/\btan\(x\)|1\/cos\(x\)/.test(diff)) addFamily(Math.PI / 2, Math.PI);
  if (/1\/sin\(x\)|1\/tan\(x\)/.test(diff)) addFamily(0, Math.PI);

  poles.sort((a, b) => a - b);
  return poles.filter((x, i) => i === 0 || Math.abs(x - poles[i - 1]) > 1e-7);
}

function solveBoundedInequality(
  diffAlgebrite: string,
  operator: InequalityOperator,
  variable: string,
  lower: number,
  upper: number,
  lowerInclusive: boolean,
  upperInclusive: boolean,
): InequalityResult {
  const a = Math.min(lower, upper);
  const b = Math.max(lower, upper);
  const fn = compileNumeric(diffAlgebrite, variable);
  const roots = findNumericRoots(fn, a, b);
  const poles = knownTrigPoles(diffAlgebrite, a, b);
  const boundaries = [
    { value: a, kind: "domain" as const },
    ...roots.map((value) => ({ value, kind: "root" as const })),
    ...poles.map((value) => ({ value, kind: "pole" as const })),
    { value: b, kind: "domain" as const },
  ]
    .sort((x, y) => x.value - y.value)
    .filter((entry, i, arr) => i === 0 || Math.abs(entry.value - arr[i - 1].value) > 1e-7);

  type Segment = { lower: number; upper: number; lowerClosed: boolean; upperClosed: boolean };
  const segments: Segment[] = [];

  for (let i = 0; i < boundaries.length - 1; i++) {
    const left = boundaries[i];
    const right = boundaries[i + 1];
    if (right.value - left.value < 1e-10) continue;
    const mid = (left.value + right.value) / 2;
    const v = fn(mid);
    if (!Number.isFinite(v) || !satisfiesOperator(v > 1e-9 ? 1 : v < -1e-9 ? -1 : 0, operator)) {
      continue;
    }

    const leftIsRoot = left.kind === "root";
    const rightIsRoot = right.kind === "root";
    const boundaryHolds = (value: number): boolean => {
      const evaluated = fn(value);
      if (!Number.isFinite(evaluated)) return false;
      const sign = evaluated > 1e-9 ? 1 : evaluated < -1e-9 ? -1 : 0;
      return satisfiesOperator(sign, operator);
    };

    const leftDomainInclusive =
      Math.abs(left.value - lower) < 1e-8 ? lowerInclusive : upperInclusive;
    const rightDomainInclusive =
      Math.abs(right.value - upper) < 1e-8 ? upperInclusive : lowerInclusive;

    segments.push({
      lower: left.value,
      upper: right.value,
      lowerClosed:
        left.kind === "domain"
          ? leftDomainInclusive && boundaryHolds(left.value)
          : leftIsRoot && (operator === "<=" || operator === ">="),
      upperClosed:
        right.kind === "domain"
          ? rightDomainInclusive && boundaryHolds(right.value)
          : rightIsRoot && (operator === "<=" || operator === ">="),
    });
  }

  // Inclusive roots can be isolated when neither adjacent open interval holds.
  if (operator === "<=" || operator === ">=") {
    for (const root of roots) {
      const alreadyCovered = segments.some((s) => root >= s.lower - 1e-8 && root <= s.upper + 1e-8);
      if (!alreadyCovered) segments.push({ lower: root, upper: root, lowerClosed: true, upperClosed: true });
    }
  }

  segments.sort((x, y) => x.lower - y.lower);
  if (segments.length === 0) {
    return { resultText: "No tiene solución real.", steps: [] };
  }

  const parts = segments.map((s) => {
    if (Math.abs(s.lower - s.upper) < 1e-8) return `${variable} = ${formatBoundedValue(s.lower)}`;
    return `${s.lowerClosed ? "[" : "("}${formatBoundedValue(s.lower)}, ${formatBoundedValue(s.upper)}${s.upperClosed ? "]" : ")"}`;
  });

  return {
    resultText: parts.join(" ∪ "),
    steps: [
      {
        id: "bounded-roots",
        latex: `${diffAlgebrite} = 0`,
        explanation: "Se identifican raíces y discontinuidades dentro del intervalo indicado.",
      },
      {
        id: "bounded-signs",
        latex: parts.join(" \\cup "),
        explanation: "Se prueba el signo en cada tramo delimitado por raíces, polos y extremos del dominio.",
      },
    ],
  };
}

export function solveInequality(
  diffAlgebrite: string,
  operator: InequalityOperator,
  variable: string,
  domainLower?: number,
  domainUpper?: number,
  domainLowerInclusive = true,
  domainUpperInclusive = true,
): InequalityResult {
  if (
    domainLower !== undefined &&
    domainUpper !== undefined &&
    Number.isFinite(domainLower) &&
    Number.isFinite(domainUpper)
  ) {
    return solveBoundedInequality(
      diffAlgebrite,
      operator,
      variable,
      domainLower,
      domainUpper,
      domainLowerInclusive,
      domainUpperInclusive,
    );
  }

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
