import { evaluate } from "./algebriteClient";

// Internal marker emitted only by nCr(symbol,2) in the parser.
// Ordinary combinatorial interpretation: symbol is a nonnegative integer,
// with zero pairs for cardinality zero or one.
export function trySymbolicBinomialPair(expr: string): { value: string; variable: string } | null {
  const match = expr.trim().match(/^binomialpair\(([A-Za-z])\)$/);
  if (!match || /^[eEiI]$/.test(match[1])) return null;
  const variable = match[1];
  return { value: evaluate(variable + "*(" + variable + "-1)/2"), variable };
}
