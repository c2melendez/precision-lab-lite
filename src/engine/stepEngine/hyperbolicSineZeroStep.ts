export function hyperbolicSineZeroStep(
  leftAlgebrite: string,
  rightAlgebrite: string,
  variable: string,
): import("../../types").Step | null {
  // EC-H-01 is a frozen real-domain equation contract. Do not broaden this
  // exact recognizer to arbitrary sinh compositions or periodic complex roots.
  const left = leftAlgebrite.replace(/\s+/g, "");
  const right = rightAlgebrite.replace(/\s+/g, "");
  const target = "sinh(" + variable + ")";
  if (
    !((left === target && right === "0") ||
      (left === "0" && right === target))
  ) {
    return null;
  }
  return {
    id: "hyperbolic-sine-unique-real-zero",
    latex: variable + " = 0",
    explanation:
      "En los reales, cosh(x) > 0 para todo x; por tanto sinh es estrictamente creciente. Como sinh(0) = 0, su única raíz real es x = 0.",
  };
}
