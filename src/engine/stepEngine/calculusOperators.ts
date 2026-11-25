/**
 * The calculus keyboard inserts the whole operator, e.g. `\frac{d}{dx}(x^2)`,
 * `\int x^2\,dx`, `\int_0^1 x^2\,dx` or `\lim_{x\to 0} ...`. The parser keeps
 * that shape (`d((x^(2)),x)`, `integral((x^(2)),x)`, `defintegral(...)`,
 * `limit(...)`), and the UI forwards the parsed text to the calculus engine.
 *
 * The engine expects the operand only. Without this unwrapping step the
 * derivative differentiates the unevaluated `d(...)` call (returning a
 * constant), the indefinite integral integrates twice and the definite
 * integral/limit reach the numeric fallback with an unknown operator name.
 *
 * This module extracts the operand (and literal bounds/point when present).
 * It is intentionally strict: a call must span the whole expression.
 */

export type CalculusOperatorName = "d" | "derivative" | "integral" | "defintegral" | "limit";

export type CalculusOperatorCall = {
  name: CalculusOperatorName;
  args: string[];
};

const OPERATOR_ARITY: Record<CalculusOperatorName, number[]> = {
  d: [2, 3],
  derivative: [2, 3],
  integral: [2],
  defintegral: [3, 4],
  limit: [3, 4],
};

/** Splits the inside of `name(...)` on top-level commas. */
function splitTopLevelArgs(source: string): string[] {
  const args: string[] = [];
  let depth = 0;
  let start = 0;
  for (let i = 0; i < source.length; i += 1) {
    const char = source[i];
    if (char === "(" || char === "[" || char === "{") depth += 1;
    else if (char === ")" || char === "]" || char === "}") depth -= 1;
    else if (char === "," && depth === 0) {
      args.push(source.slice(start, i).trim());
      start = i + 1;
    }
  }
  args.push(source.slice(start).trim());
  return args;
}

/** Returns the index of the `(` matching the `)` at `closeIndex`. */
function matchingOpen(source: string, closeIndex: number): number {
  let depth = 0;
  for (let i = closeIndex; i >= 0; i -= 1) {
    const char = source[i];
    if (char === ")") depth += 1;
    else if (char === "(") {
      depth -= 1;
      if (depth === 0) return i;
    }
  }
  return -1;
}

/**
 * Parses a whole-expression calculus operator call, or returns null when the
 * expression is a plain operand.
 */
export function parseCalculusOperator(source: string): CalculusOperatorCall | null {
  const trimmed = source.trim();
  const match = /^([A-Za-z]+)\s*\(/.exec(trimmed);
  if (!match) return null;

  const name = match[1] as CalculusOperatorName;
  const arities = OPERATOR_ARITY[name];
  if (!arities) return null;
  if (!trimmed.endsWith(")")) return null;

  const openIndex = trimmed.indexOf("(", match[1].length);
  const closeIndex = trimmed.length - 1;
  if (matchingOpen(trimmed, closeIndex) !== openIndex) return null;

  const args = splitTopLevelArgs(trimmed.slice(openIndex + 1, closeIndex));
  if (!arities.includes(args.length)) return null;
  return { name, args };
}

/** Returns the operand of `names`, or the original expression unchanged. */
export function operandOf(source: string, names: CalculusOperatorName[]): string {
  const call = parseCalculusOperator(source);
  if (!call || !names.includes(call.name)) return source;
  return call.args[0];
}

/**
 * Function names that this engine can only handle when applied (`name(...)`).
 * When one appears as a bare identifier the parser has turned the function
 * into a product (`\operatorname{sech}^{2}x` -> `sech^(2)*x`), and letting it
 * through would fabricate a plausible but wrong result. Fail closed instead.
 */
const FUNCTION_TOKENS = [
  "arccot",
  "arcsec",
  "arccsc",
  "arcoth",
  "arsech",
  "arcsch",
  "acot",
  "asec",
  "acsc",
  "acoth",
  "asech",
  "acsch",
  "sech",
  "csch",
  "coth",
  "asinh",
  "acosh",
  "atanh",
  "d",
];

/**
 * Returns the first bare function token that is not applied as a function, or
 * null when the expression is unambiguous. `variable` is always allowed.
 */
export function findBareFunctionToken(source: string, variable: string): string | null {
  const compact = source.replace(/\s/g, "");
  for (const token of FUNCTION_TOKENS) {
    if (token === variable) continue;
    const applied = new RegExp(`${token}\\(`, "g");
    const withoutCalls = compact.replace(applied, " ");
    if (new RegExp(`(^|[^A-Za-z0-9_])${token}(?![A-Za-z0-9_])`).test(withoutCalls)) {
      return token;
    }
  }
  return null;
}
