import { evaluate, toLatex } from "./algebriteClient";
import type { ResultKind, ResultView } from "../types";

const TRIG_RE = /\b(?:sin|cos|tan|sec|csc|cot|asin|acos|atan|arcsin|arccos|arctan|sinh|cosh|tanh|asinh|acosh|atanh|asech|acsch|acoth)\s*\(/;
const LOG_RE = /\b(?:log|ln)\s*\(/;
const EXP_RE = /\bexp\s*\(|(?:^|[^A-Za-z0-9_])e\s*\^/;
const RADICAL_RE = /\b(?:sqrt|cbrt|root)\s*\(/;
const COMPLEX_I_RE = /(^|[^A-Za-z0-9_])i([^A-Za-z0-9_]|$)/;

export function classifyResultExpression(expression: string, isNumeric = false): ResultKind {
  // Complejo tiene prioridad sobre "numérico": 2+3i es un número, pero
  // necesita el contrato de cuatro representaciones complejas.
  if (COMPLEX_I_RE.test(expression)) return "complex";
  if (isNumeric) return "numeric";
  if (TRIG_RE.test(expression)) return "trigonometric";
  if (LOG_RE.test(expression)) return "logarithmic";
  if (EXP_RE.test(expression)) return "exponential";
  if (RADICAL_RE.test(expression)) return "radical";
  if (expression.includes("/")) return "rational";
  if (/[A-Za-z]/.test(expression)) return "algebraic";
  return "other";
}

function safeTransform(call: string): string | null {
  try {
    const value = evaluate(call);
    if (!value || /^(?:simplify|factor|expand)\(/.test(value)) return null;
    return value;
  } catch {
    return null;
  }
}

export function buildExpressionResultViews(
  originalExpression: string,
  resultExpression: string,
  kind: ResultKind,
): ResultView[] {
  const views: ResultView[] = [];
  const seen = new Set<string>();

  function add(key: ResultView["key"], label: string, raw: string | null): void {
    if (!raw) return;
    let latex: string;
    try {
      latex = toLatex(raw);
    } catch {
      return;
    }
    const normalized = latex.replace(/\s+/g, "");
    if (seen.has(normalized)) return;
    seen.add(normalized);
    views.push({ key, label, latex, kind });
  }

  add("original", "Original", originalExpression);
  add("result", "Resultado", resultExpression);

  if (kind !== "numeric" && kind !== "complex" && kind !== "other") {
    add("simplified", "Simplificada", safeTransform(`simplify((${originalExpression}))`));
    add("factored", "Factorizada", safeTransform(`factor((${originalExpression}))`));
    add("expanded", "Expandida", safeTransform(`expand((${originalExpression}))`));
  }

  return views;
}


function fmt(n: number): string {
  const snapped = Math.abs(n) < 1e-12 ? 0 : n;
  return Number(snapped.toPrecision(12)).toString();
}

export function buildComplexResultViews(
  originalExpression: string,
  real: number,
  imaginary: number,
): ResultView[] {
  const r = Math.hypot(real, imaginary);
  const theta = Math.atan2(imaginary, real);
  const a = fmt(real);
  const bAbs = fmt(Math.abs(imaginary));
  const rText = fmt(r);
  const thetaText = fmt(theta);
  const binomial =
    imaginary === 0 ? a :
    real === 0 ? `${imaginary < 0 ? "-" : ""}${bAbs}i` :
    `${a} ${imaginary < 0 ? "-" : "+"} ${bAbs}i`;

  return [
    { key: "original", label: "Original", latex: toLatex(originalExpression), kind: "complex" },
    { key: "complex_binomial", label: "Binómica", latex: binomial, kind: "complex" },
    { key: "complex_polar", label: "Polar", latex: `${rText}\\angle ${thetaText}`, kind: "complex" },
    {
      key: "complex_trigonometric",
      label: "Trigonométrica",
      latex: `${rText}(\\cos(${thetaText})+i\\sin(${thetaText}))`,
      kind: "complex",
    },
    {
      key: "complex_exponential",
      label: "Exponencial",
      latex: `${rText}e^{i(${thetaText})}`,
      kind: "complex",
    },
  ];
}
