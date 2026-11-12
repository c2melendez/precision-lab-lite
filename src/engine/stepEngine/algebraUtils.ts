import { evaluate, solveEquation } from "../algebriteClient";
import type { Step } from "../../types";

export function principalSquareRootOffset(expression: string, variable: string): string | null {
  const compact = expression.replace(/\s+/g, "");
  if (compact === "sqrt(" + variable + ")" ||
      compact === variable + "^(1/2)" ||
      compact === "(" + variable + ")^(1/2)") {
    return "0";
  }

  const prefix = "sqrt(";
  if (!compact.startsWith(prefix) || !compact.endsWith(")")) return null;
  const radicand = compact.slice(prefix.length, -1);
  const offsetPrefix = variable + "-";
  if (!radicand.startsWith(offsetPrefix)) return null;

  const offset = radicand.slice(offsetPrefix.length);
  if (!offset || new RegExp("\\b" + variable + "\\b").test(offset)) return null;
  return offset;
}

export function realNumericSign(expression: string): -1 | 0 | 1 | null {
  try {
    const normalized = evaluate("simplify(" + expression + ")").replace(/\s+/g, "");
    if (/^[+-]?\d+(?:\.\d+)?(?:e[+-]?\d+)?$/i.test(normalized)) {
      const value = Number(normalized);
      if (Number.isFinite(value)) return value < 0 ? -1 : value > 0 ? 1 : 0;
    }
    const fraction = normalized.match(/^([+-]?\d+)\/([+-]?\d+)$/);
    if (fraction) {
      const numerator = BigInt(fraction[1]);
      const denominator = BigInt(fraction[2]);
      if (denominator === 0n) return null;
      if (numerator === 0n) return 0;
      return (numerator < 0n) !== (denominator < 0n) ? -1 : 1;
    }
    return null;
  } catch {
    return null;
  }
}

export function absoluteValueOffset(expression: string, variable: string): string | null {
  const compact = expression.replace(/\s+/g, "");
  const prefix = "abs(";
  if (!compact.startsWith(prefix) || !compact.endsWith(")")) return null;
  const inner = compact.slice(prefix.length, -1);
  if (inner === variable) return "0";
  const offsetPrefix = variable + "-";
  if (!inner.startsWith(offsetPrefix)) return null;
  const offset = inner.slice(offsetPrefix.length);
  if (!offset || new RegExp("\\b" + variable + "\\b").test(offset)) return null;
  return offset;
}

function denominatorOperands(expression: string): string[] {
  const text = expression.replace(/\s+/g, "");
  const operands: string[] = [];
  for (let i = 0; i < text.length; i++) {
    if (text[i] !== "/") continue;
    let j = i + 1;
    if (text[j] === "(") {
      let depth = 0;
      let k = j;
      for (; k < text.length; k++) {
        if (text[k] === "(") depth++;
        else if (text[k] === ")") {
          depth--;
          if (depth === 0) break;
        }
      }
      if (depth !== 0) continue;
      operands.push(text.slice(j + 1, k));
    } else {
      let k = j;
      while (k < text.length && /[A-Za-z0-9_.]/.test(text[k])) k++;
      if (k > j) operands.push(text.slice(j, k));
    }
  }
  const inversePower = /\(([^()]+)\)\^\(?-1\)?/g;
  for (const match of text.matchAll(inversePower)) operands.push(match[1]);
  const atomicInversePower = /\b([A-Za-z][A-Za-z0-9_]*)\^\(?-1\)?/g;
  for (const match of text.matchAll(atomicInversePower)) operands.push(match[1]);
  return [...new Set(operands)];
}

export function denominatorExclusions(left: string, right: string, variable: string): string[] {
  const variablePattern = new RegExp("\\b" + variable + "\\b");
  const exclusions: string[] = [];
  for (const operand of [...denominatorOperands(left), ...denominatorOperands(right)]) {
    if (!variablePattern.test(operand)) continue;
    let roots: string[] = [];
    try {
      roots = solveEquation(operand, variable);
    } catch {
      continue;
    }
    for (const root of roots) {
      const normalized = root.trim();
      if (/\bi\b|sqrt\(-/.test(normalized) || variablePattern.test(normalized)) continue;
      if (!exclusions.includes(normalized)) exclusions.push(normalized);
    }
  }
  return exclusions;
}

export function domainRestrictionStep(variable: string, exclusions: string[], detail: string): Step {
  const plain = exclusions.map((point) => variable + "\u2260" + point).join(", ");
  const latex = exclusions.map((point) => variable + " \\neq " + point).join(",\\ ");
  return {
    id: "domain-restriction",
    latex,
    explanation: "Restricci\u00f3n de dominio original: " + plain + ". " + detail,
  };
}
