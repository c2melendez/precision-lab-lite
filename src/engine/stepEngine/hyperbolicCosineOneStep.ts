export function hyperbolicCosineOneStep(
  leftAlgebrite: string,
  rightAlgebrite: string,
  variable: string,
): import("../../types").Step | null {
  // EC-H-02 is an exact real-domain equation contract. Keep the recognizer
  // narrow: cosh(x) >= 1 for real x, with equality only at x = 0.
  const left = leftAlgebrite.replace(/\s+/g, "");
  const right = rightAlgebrite.replace(/\s+/g, "");
  const target = "cosh(" + variable + ")";
  if (
    !((left === target && right === "1") ||
      (left === "1" && right === target))
  ) {
    return null;
  }
  return {
    id: "hyperbolic-cosine-unique-real-minimum",
    latex: variable + " = 0",
    explanation:
      "Para x real, cosh(x) ≥ 1 y alcanza el valor 1 únicamente cuando x = 0; por tanto, la única solución real es x = 0.",
  };
}
