export function hyperbolicCoshBelowOneStep(
  leftAlgebrite: string,
  rightAlgebrite: string,
  variable: string,
): import("../../types").Step | null {
  // EC-H-09 is a frozen real-domain contract. For real x, cosh(x) >= 1, so
  // cosh(x)=c has no real solution when c < 1. Recognize only cosh(x)=c with a
  // rational c (or the reversed equality).
  const bare = (value: string) => value.replace(/[\s()]/g, "");
  const left = bare(leftAlgebrite);
  const right = bare(rightAlgebrite);
  const target = "cosh" + variable;
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
  if (constant === null || !(constant < 1)) return null;
  return {
    id: "hyperbolic-cosine-below-one-no-real-solution",
    latex: "\\varnothing",
    explanation:
      "Para x real, cosh(x) ≥ 1 y la igualdad solo ocurre en x = 0. Como el valor de la ecuación es menor que 1, no existe ninguna solución real.",
  };
}
