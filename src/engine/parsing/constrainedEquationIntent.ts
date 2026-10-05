export interface ConstrainedEquationIntent {
  equationLatex: string;
  constraintLatex: string;
  variable: string;
  operator: "<" | "<=" | ">" | ">=";
  bound: number;
}

export function detectConstrainedEquationIntent(latex: string): ConstrainedEquationIntent | null {
  const text = latex.trim();
  if (!text) return null;

  let depth = 0;
  let comma = -1;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === "(" || ch === "[" || ch === "{") depth++;
    else if (ch === ")" || ch === "]" || ch === "}") depth = Math.max(0, depth - 1);
    else if (ch === "," && depth === 0) {
      comma = i;
      break;
    }
  }
  if (comma < 0) return null;

  const equationLatex = text.slice(0, comma).trim();
  const constraintLatex = text.slice(comma + 1).trim();
  if (!equationLatex.includes("=") || /[<>]/.test(equationLatex)) return null;

  const m = constraintLatex
    .replace(/\\leq/g, "<=")
    .replace(/\\geq/g, ">=")
    .replace(/\s+/g, "")
    .match(/^([a-zA-Z])(<|<=|>|>=)(-?\d+(?:\.\d+)?)$/);
  if (!m) return null;

  return {
    equationLatex,
    constraintLatex,
    variable: m[1],
    operator: m[2] as "<" | "<=" | ">" | ">=",
    bound: Number(m[3]),
  };
}

export function satisfiesConstraint(
  value: number,
  intent: ConstrainedEquationIntent,
): boolean {
  if (intent.operator === ">") return value > intent.bound;
  if (intent.operator === ">=") return value >= intent.bound;
  if (intent.operator === "<") return value < intent.bound;
  return value <= intent.bound;
}
