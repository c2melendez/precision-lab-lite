// Fase 10 (hallazgo de la auditoría Fase 0 v2): mean/median/mode/stdev/
// variance/sort/mad/min/max NO son funciones nativas de Algebrite —
// confirmado probando el paquete real (Algebrite.run("mean(3,7,2)")
// devuelve "mean(3,7,2)" tal cual, sin evaluar ni fallar). A diferencia
// de nPr/nCr (Fase 3), no se pueden reescribir como una sola expresión
// simbólica porque reciben una cantidad variable de argumentos — se
// evalúan aquí numéricamente en JS. Cada argumento se resuelve primero
// con evaluate() de Algebrite (permite pasar expresiones, ej.
// "mean(2+2, sqrt(9))", no solo literales).
//
// Alcance de esta fase: la función de estadística debe ser la expresión
// COMPLETA (mismo alcance que el fallback numérico de asinh/acosh/atanh/
// sign de la Fase 3) — no se soporta todavía anidarla dentro de una
// expresión más grande, ej. "mean(1,2,3)+1".

import { evaluate } from "./algebriteClient";

export const STAT_FUNCTION_NAMES = [
  "mean",
  "median",
  "mode",
  "stdev",
  "variance",
  // Alias real: la tecla "variance" del teclado inserta \mathrm{var}, no
  // \mathrm{variance} (ver MathKeyboard.tsx) — se acepta también "var"
  // tal cual llega desde ahí.
  "var",
  "sort",
  "mad",
  "min",
  "max",
  "range",
  // P6 (spec v2 §7.1): variance/stdev de arriba son muestrales (n-1) —
  // faltaba la variante poblacional. Se agregan como funciones NUEVAS,
  // sin tocar variance/stdev/var (que ya usa el campo de expresión
  // libre) ni su firma.
  "variancePop",
  "stdevPop",
  // Módulo M0 (spec_graficacion_matrices_estadistica_unidades.md, sección
  // 6.1): "percentile" toma (p, ...datos) como primer argumento, mismo
  // orden que Percentile en main (stat_functions.py) para paridad de firma.
  "percentile",
  "q1",
  "q2",
  "q3",
  "iqr",
] as const;
export type StatFunctionName = (typeof STAT_FUNCTION_NAMES)[number];

function isStatFunctionName(name: string): name is StatFunctionName {
  return (STAT_FUNCTION_NAMES as readonly string[]).includes(name);
}

export function splitTopLevelArgs(argsStr: string): string[] {
  const args: string[] = [];
  let depth = 0;
  let current = "";
  for (const ch of argsStr) {
    if (ch === "(") depth++;
    if (ch === ")") depth--;
    if (ch === "," && depth === 0) {
      args.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  if (current.trim().length > 0 || args.length > 0) args.push(current);
  return args.map((a) => a.trim()).filter((a) => a.length > 0);
}

function evalNumericArg(arg: string): number {
  const raw = evaluate(arg);
  const n = Number(raw);
  if (!Number.isFinite(n)) {
    throw new Error(`No se pudo evaluar "${arg}" a un número.`);
  }
  return n;
}

// P6 (spec v2 §7.1): estos helpers se exportan (antes eran privados del
// módulo) para que StatisticsMode.tsx los reutilice directamente sobre
// arreglos numéricos ya parseados desde DataListInput — sin pasar por
// tryStatFunction()/evaluate(), que espera una expresión de texto tipo
// "mean(1,2,3)", no un arreglo. Mismo motivo que pide la spec:
// "reutilizar statFunctions.ts existente, no reimplementar".
export function mean(values: number[]): number {
  return values.reduce((a, b) => a + b, 0) / values.length;
}

export function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}

export function modes(values: number[]): number[] {
  const counts = new Map<number, number>();
  for (const v of values) counts.set(v, (counts.get(v) ?? 0) + 1);
  const maxCount = Math.max(...counts.values());
  return [...counts.entries()]
    .filter(([, c]) => c === maxCount)
    .map(([v]) => v)
    .sort((a, b) => a - b);
}

export function range(values: number[]): number {
  return Math.max(...values) - Math.min(...values);
}

// Decisión DEDUCIBLE (no especificada antes): stdev/variance de MUESTRA
// (dividen entre n-1), la convención más común en calculadoras científicas
// (Casio fx, TI) para un conjunto de datos que no se asume la población
// completa. Documentado aquí para no dejarlo implícito.
export function variance(values: number[]): number {
  if (values.length < 2) {
    throw new Error("stdev/variance necesitan al menos 2 valores.");
  }
  const m = mean(values);
  const sumSq = values.reduce((acc, v) => acc + (v - m) ** 2, 0);
  return sumSq / (values.length - 1);
}

export function stdev(values: number[]): number {
  return Math.sqrt(variance(values));
}

/** P6 (spec v2 §7.1): variante poblacional (divide entre n, no n-1) —
 * función nueva, variance()/stdev() de arriba no cambian. */
export function variancePopulation(values: number[]): number {
  if (values.length < 1) {
    throw new Error("stdevPop/variancePop necesitan al menos 1 valor.");
  }
  const m = mean(values);
  const sumSq = values.reduce((acc, v) => acc + (v - m) ** 2, 0);
  return sumSq / values.length;
}

export function stdevPopulation(values: number[]): number {
  return Math.sqrt(variancePopulation(values));
}

export function mad(values: number[]): number {
  const m = mean(values);
  return mean(values.map((v) => Math.abs(v - m)));
}

// Módulo M0 (spec_graficacion_matrices_estadistica_unidades.md, sección
// 6.1): cuartiles/percentiles/RIQ. Misma convención DEDUCIBLE que main
// (interpolación lineal, numpy.percentile default) — documentado ahí,
// no repetido acá salvo por este resumen.
export function percentile(values: number[], p: number): number {
  if (values.length === 0) throw new Error("percentile necesita al menos un valor.");
  if (p < 0 || p > 100) throw new Error("El percentil debe estar entre 0 y 100.");
  const sorted = [...values].sort((a, b) => a - b);
  const n = sorted.length;
  if (n === 1) return sorted[0];
  const index = (p / 100) * (n - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  if (lower === upper) return sorted[lower];
  const frac = index - lower;
  return sorted[lower] + frac * (sorted[upper] - sorted[lower]);
}

export function q1(values: number[]): number {
  return percentile(values, 25);
}

export function q3(values: number[]): number {
  return percentile(values, 75);
}

export function iqr(values: number[]): number {
  return q3(values) - q1(values);
}

// Módulo M1 (spec_graficacion_matrices_estadistica_unidades.md, sección
// 6.2): correlación y regresión lineal simple. Opera sobre PARES (x,y) —
// funciones nuevas, no encajan en el patrón `values: number[]` del resto
// de este archivo, así que no reutilizan `tryStatFunction` (que solo
// despacha funciones de una lista).
export function correlation(x: number[], y: number[]): number {
  if (x.length !== y.length) throw new Error(`x e y deben tener la misma longitud; recibidas ${x.length} y ${y.length}.`);
  if (x.length < 2) throw new Error("La correlación necesita al menos 2 pares (x,y).");
  const mx = mean(x);
  const my = mean(y);
  let sxy = 0;
  let sxx = 0;
  let syy = 0;
  for (let i = 0; i < x.length; i++) {
    const dx = x[i] - mx;
    const dy = y[i] - my;
    sxy += dx * dy;
    sxx += dx * dx;
    syy += dy * dy;
  }
  if (sxx === 0 || syy === 0) throw new Error("La correlación no está definida cuando x o y son constantes (varianza cero).");
  return sxy / Math.sqrt(sxx * syy);
}

export function regressionSlope(x: number[], y: number[]): number {
  if (x.length !== y.length) throw new Error(`x e y deben tener la misma longitud; recibidas ${x.length} y ${y.length}.`);
  if (x.length < 2) throw new Error("La regresión necesita al menos 2 pares (x,y).");
  const mx = mean(x);
  const my = mean(y);
  let sxy = 0;
  let sxx = 0;
  for (let i = 0; i < x.length; i++) {
    sxy += (x[i] - mx) * (y[i] - my);
    sxx += (x[i] - mx) ** 2;
  }
  if (sxx === 0) throw new Error("La pendiente no está definida cuando todos los x son iguales (recta vertical).");
  return sxy / sxx;
}

export function regressionIntercept(x: number[], y: number[]): number {
  const mx = mean(x);
  const my = mean(y);
  return my - regressionSlope(x, y) * mx;
}

/** Evita basura de flotantes tipo 2.0000000000000004. */
function formatNumber(n: number): string {
  return Number(n.toPrecision(12)).toString();
}

/**
 * Si `expr` ES un llamado a una de las funciones de estadística (la
 * expresión completa, ver alcance arriba), la evalúa aquí y devuelve el
 * resultado en sintaxis Algebrite. Devuelve null si no aplica, para que
 * el flujo normal siga su curso (incluye Algebrite fallando/tratándola
 * como símbolo desconocido, que es lo que pasaba antes de esta fase).
 */
export function tryStatFunction(expr: string): string | null {
  // Módulo M0: el regex original ([a-zA-Z]+) no aceptaba dígitos en el
  // nombre — bug real encontrado por el test de "q1(...)"/"q3(...)"
  // (que antes devolvía null silenciosamente, nunca un error visible).
  // "q1"/"q3" son los únicos nombres de esta lista con dígito, así que
  // ningún nombre existente cambia de comportamiento con este fix.
  const match = expr.match(/^([a-zA-Z][a-zA-Z0-9]*)\((.*)\)$/s);
  if (!match) return null;
  const [, name, argsStr] = match;
  if (!isStatFunctionName(name)) return null;

  const argStrings = splitTopLevelArgs(argsStr);
  if (argStrings.length === 0) {
    throw new Error(`${name}() necesita al menos un argumento.`);
  }

  if (name === "sort") {
    const values = argStrings.map(evalNumericArg).sort((a, b) => a - b);
    return `[${values.map(formatNumber).join(",")}]`;
  }

  const values = argStrings.map(evalNumericArg);

  switch (name) {
    case "mean":
      return formatNumber(mean(values));
    case "median":
      return formatNumber(median(values));
    case "mode": {
      const m = modes(values);
      return m.length === 1 ? formatNumber(m[0]) : `[${m.map(formatNumber).join(",")}]`;
    }
    case "min":
      return formatNumber(Math.min(...values));
    case "max":
      return formatNumber(Math.max(...values));
    case "range":
      return formatNumber(Math.max(...values) - Math.min(...values));
    case "stdev":
      return formatNumber(stdev(values));
    case "variance":
    case "var":
      return formatNumber(variance(values));
    case "stdevPop":
      return formatNumber(stdevPopulation(values));
    case "variancePop":
      return formatNumber(variancePopulation(values));
    case "mad":
      return formatNumber(mad(values));
    case "percentile": {
      if (values.length < 2) {
        throw new Error("percentile necesita al menos un valor de datos después de p.");
      }
      const [p, ...data] = values;
      return formatNumber(percentile(data, p));
    }
    case "q1":
      return formatNumber(q1(values));
    case "q2":
      return formatNumber(median(values));
    case "q3":
      return formatNumber(q3(values));
    case "iqr":
      return formatNumber(iqr(values));
    default:
      return null;
  }
}
