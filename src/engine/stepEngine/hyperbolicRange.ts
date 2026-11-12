// hyperbolicRange.ts — narrow real-domain range contradiction helpers for frozen EC-H contracts.
import type { Step } from "../../types";

export function hyperbolicTangentOutOfRangeStep(
  leftAlgebrite: string,
  rightAlgebrite: string,
  variable: string,
): Step | null {
  // EC-H-10 is a frozen real-domain contract. For real x, |tanh(x)| < 1, so
  // tanh(x)=c has no real solution when |c| >= 1. Recognize only tanh(x)=c with a
  // rational c (or the reversed equality).
  const bare = (value: string) => value.replace(/[\s()]/g, "");
  const left = bare(leftAlgebrite);
  const right = bare(rightAlgebrite);
  const target = "tanh" + variable;
  const rationalValue = (value: string): number | null => {
    const match = /^(-?\d+(?:\.\d+)?)(?:\/(\d+(?:\.\d+)?))?$/.exec(value);
    if (!match) return null;
    const denominator = match[2] === undefined ? 1 : Number(match[2]);
    if (denominator === 0) return null;
    return Number(match[1]) / denominator;
  };
  let constant: number | null = null;
  if (left === target) constant = rationalValue(right);
  else if (right === target) constant = rationalValue(left);
  if (constant === null || !(Math.abs(constant) >= 1)) return null;
  return {
    id: "hyperbolic-tangent-out-of-range-no-real-solution",
    latex: "\\varnothing",
    explanation:
      "Para x real, |tanh(x)| < 1. Como el valor de la ecuación tiene valor absoluto mayor o igual que 1, no existe ninguna solución real.",
  };
}
