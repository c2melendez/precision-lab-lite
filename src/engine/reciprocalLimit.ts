// Exact one-sided limits of signed reciprocal functions at zero.
// A large sampled value is never used as evidence of infinity.
import { evaluate } from "./algebriteClient";

export function reciprocalPoleLimit(
  body: string,
  variable: string,
  point: string,
  direction: "both" | "left" | "right",
): "oo" | "-oo" | null {
  if (direction === "both" || !/^[A-Za-z][A-Za-z0-9_]*$/.test(variable)) return null;
  if (evaluate(point) !== "0") return null;
  const normalized = evaluate(body).replace(/\s+/g, "");
  const coefficient = normalized === "1/" + variable ? 1
    : normalized === "-1/" + variable ? -1 : 0;
  if (!coefficient) return null;
  return coefficient * (direction === "right" ? 1 : -1) > 0 ? "oo" : "-oo";
}
