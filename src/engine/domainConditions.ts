import { evaluate, toLatex } from "./algebriteClient";
import type { DomainCondition } from "../types";

function matchingParen(text: string, open: number): number {
  let depth = 0;
  for (let i = open; i < text.length; i += 1) {
    if (text[i] === "(") depth += 1;
    else if (text[i] === ")") {
      depth -= 1;
      if (depth === 0) return i;
    }
  }
  return -1;
}

const DOMAIN_IGNORED_IDENTIFIERS = new Set([
  "sin","cos","tan","sec","csc","cot","asin","acos","atan","arcsin","arccos","arctan",
  "sinh","cosh","tanh","asinh","acosh","atanh","sqrt","log","ln","exp","abs","sign",
  "pi","e","i","oo","root","cbrt",
]);

function variablesIn(expr: string): string[] {
  const names = [...expr.matchAll(/[A-Za-z][A-Za-z0-9_]*/g)].map((m) => m[0]);
  return [...new Set(names.filter((name) => !DOMAIN_IGNORED_IDENTIFIERS.has(name)))];
}

function inferVariable(expr: string): string | undefined {
  const variables = variablesIn(expr);
  return variables.length === 1 ? variables[0] : undefined;
}

function hasSymbolicVariable(expr: string): boolean {
  return variablesIn(expr).length > 0;
}

function safeLatex(expr: string): string {
  try {
    return toLatex(expr);
  } catch {
    return expr;
  }
}

function makeCondition(
  expressionAlgebrite: string,
  operator: DomainCondition["operator"],
  comparisonAlgebrite: string,
  kind: DomainCondition["kind"],
): DomainCondition {
  const opLatex =
    operator === "!=" ? "\\ne" :
    operator === ">=" ? "\\ge" :
    operator === "<=" ? "\\le" :
    operator;
  return {
    expressionAlgebrite,
    operator,
    comparisonAlgebrite,
    text: `${expressionAlgebrite} ${operator} ${comparisonAlgebrite}`,
    latex: `${safeLatex(expressionAlgebrite)} ${opLatex} ${safeLatex(comparisonAlgebrite)}`,
    variable: inferVariable(expressionAlgebrite),
    kind,
  };
}

function captureFunctionArgs(text: string, name: string): string[] {
  const result: string[] = [];
  const re = new RegExp(`\\b${name}\\s*\\(`, "g");
  for (let match = re.exec(text); match; match = re.exec(text)) {
    const open = text.indexOf("(", match.index);
    const close = matchingParen(text, open);
    if (close < 0) continue;
    result.push(text.slice(open + 1, close));
    re.lastIndex = close + 1;
  }
  return result;
}

function captureDenominators(text: string): string[] {
  const result: string[] = [];
  for (let i = 0; i < text.length; i += 1) {
    if (text[i] !== "/") continue;
    let j = i + 1;
    while (j < text.length && /\s/.test(text[j])) j += 1;
    if (j >= text.length) continue;

    if (text[j] === "(") {
      const close = matchingParen(text, j);
      if (close > j) result.push(text.slice(j + 1, close));
      continue;
    }

    const start = j;
    if (/[A-Za-z]/.test(text[j])) {
      while (j < text.length && /[A-Za-z0-9_]/.test(text[j])) j += 1;
      if (text[j] === "(") {
        const close = matchingParen(text, j);
        if (close > j) {
          result.push(text.slice(start, close + 1));
          continue;
        }
      }
    } else {
      while (j < text.length && /[0-9.]/.test(text[j])) j += 1;
    }
    if (j > start) result.push(text.slice(start, j));
  }
  return result;
}

export function extractDomainConditions(expr: string): DomainCondition[] {
  const conditions: DomainCondition[] = [];

  for (const denominator of captureDenominators(expr)) {
    const source = denominator.trim();
    // Restricciones persistentes describen el dominio de una FUNCIÓN o
    // expresión simbólica. Un divisor numérico como 8/2 no debe producir
    // una tarjeta absurda "2 != 0" ni desplazar visualmente el resultado.
    // Si un divisor constante fuese 0, el evaluador normal ya devuelve el
    // error de dominio correspondiente.
    if (source && source !== "1" && hasSymbolicVariable(source)) {
      conditions.push(makeCondition(source, "!=", "0", "denominator"));
    }
  }

  for (const arg of [...captureFunctionArgs(expr, "log"), ...captureFunctionArgs(expr, "ln")]) {
    const source = arg.trim();
    if (hasSymbolicVariable(source)) {
      conditions.push(makeCondition(source, ">", "0", "log"));
    }
  }

  for (const arg of captureFunctionArgs(expr, "sqrt")) {
    const source = arg.trim();
    if (hasSymbolicVariable(source)) {
      conditions.push(makeCondition(source, ">=", "0", "even_root"));
    }
  }

  const seen = new Set<string>();
  const unique = conditions.filter((condition) => {
    const key = `${condition.kind}|${condition.expressionAlgebrite}|${condition.operator}|${condition.comparisonAlgebrite}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  return unique;
}

// Appends the combined real domain (kind "domain") of ONE univariate expression.
export function withRealDomainSummary(conditions: DomainCondition[]): DomainCondition[] {
  const summary = conditions.length > 0 ? realDomainSummary(conditions) : null;
  return summary ? [...conditions, summary] : conditions;
}

// Algebra114 AS-DOM: combined real domain of a univariate expression from its
// structural conditions. Critical points are the real roots of every numerator,
// denominator and radicand involved; each open region and each point is tested.
function realDomainSummary(conditions: DomainCondition[]): DomainCondition | null {
  const variables = new Set(conditions.map((c) => c.variable));
  if (variables.size !== 1) return null;
  const variable = [...variables][0];
  if (!variable) return null;
  try {
    const polys = new Set<string>();
    for (const c of conditions) {
      for (const piece of [c.expressionAlgebrite, ...captureFunctionArgs(c.expressionAlgebrite, "sqrt")]) {
        if (/sqrt|log|ln/.test(piece)) continue;
        const rational = evaluate(`rationalize(${piece})`);
        polys.add(evaluate(`numerator(${rational})`));
        polys.add(evaluate(`denominator(${rational})`));
      }
    }
    const points: { text: string; value: number }[] = [];
    for (const p of polys) {
      if (!new RegExp(`\\b${variable}\\b`).test(p)) continue;
      const listed = evaluate(`roots(${p},${variable})`).replace(/\s+/g, "");
      const roots = listed.startsWith("[") ? listed.slice(1, -1).split(",") : [listed];
      for (const r of roots) {
        if (/[A-Za-z]/.test(r.replace(/sqrt|\^/g, ""))) return null;
        const value = Number(evaluate(`float(${r})`));
        if (!Number.isFinite(value)) return null;
        if (!points.some((q) => Math.abs(q.value - value) < 1e-12)) points.push({ text: r, value });
      }
    }
    if (points.length === 0) return null;
    points.sort((a, b) => a.value - b.value);
    const holds = (t: string) => conditions.every((c) => {
      const raw = evaluate(`float(subst(${t},${variable},${c.expressionAlgebrite}))`);
      if (/[A-Za-z]/.test(raw.replace(/e[-+]?\d+/, ""))) return false;
      const v = Number(raw);
      if (!Number.isFinite(v)) return false;
      return c.operator === "!=" ? Math.abs(v) > 1e-12 : c.operator === ">=" ? v >= -1e-12 : c.operator === ">" ? v > 1e-12 : true;
    });
    const regions = points.map((p, i) => (i === 0 ? p.value - 1 : (points[i - 1].value + p.value) / 2));
    regions.push(points[points.length - 1].value + 1);
    const regionIn = regions.map((t) => holds(String(t)));
    const pointIn = points.map((p) => holds(`(${p.text})`));
    let text: string;
    let latex: string;
    if (regionIn.every(Boolean)) {
      const out = points.filter((_, i) => !pointIn[i]);
      if (out.length === 0) return null;
      text = out.map((p) => `${variable} != ${p.text}`).join(" and ");
      latex = out.map((p) => `${variable} \\neq ${safeLatex(p.text)}`).join(",\\ ");
    } else {
      const parts: string[] = [];
      const latexParts: string[] = [];
      let i = 0;
      while (i < regionIn.length) {
        if (!regionIn[i]) { i++; continue; }
        const lowerClosed = i > 0 && pointIn[i - 1];
        let j = i;
        while (j < points.length && pointIn[j] && regionIn[j + 1]) j++;
        const upperClosed = j < points.length && pointIn[j];
        const bounds: string[] = [];
        const latexBounds: string[] = [];
        if (i > 0) {
          bounds.push(`${variable} ${lowerClosed ? ">=" : ">"} ${points[i - 1].text}`);
          latexBounds.push(`${variable} ${lowerClosed ? "\\ge" : ">"} ${safeLatex(points[i - 1].text)}`);
        }
        if (j < points.length) {
          bounds.push(`${variable} ${upperClosed ? "<=" : "<"} ${points[j].text}`);
          latexBounds.push(`${variable} ${upperClosed ? "\\le" : "<"} ${safeLatex(points[j].text)}`);
        }
        if (bounds.length === 0) return null;
        parts.push(bounds.join(" and "));
        latexParts.push(latexBounds.join(" \\wedge "));
        i = j + 1;
      }
      if (parts.length === 0) return null;
      text = parts.join(" or ");
      latex = latexParts.join(" \\vee ");
    }
    return { expressionAlgebrite: variable, operator: "!=", comparisonAlgebrite: "", text, latex, variable, kind: "domain" };
  } catch {
    return null;
  }
}

export function mergeDomainConditions(...groups: DomainCondition[][]): DomainCondition[] {
  const seen = new Set<string>();
  const merged: DomainCondition[] = [];
  for (const condition of groups.flat()) {
    const key = `${condition.kind}|${condition.expressionAlgebrite}|${condition.operator}|${condition.comparisonAlgebrite}`;
    if (seen.has(key)) continue;
    seen.add(key);
    merged.push(condition);
  }
  return merged;
}
