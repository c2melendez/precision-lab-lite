import { toLatex } from "./algebriteClient";
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
  return conditions.filter((condition) => {
    const key = `${condition.kind}|${condition.expressionAlgebrite}|${condition.operator}|${condition.comparisonAlgebrite}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
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
