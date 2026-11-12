export function hyperbolicSineOneStep(
  leftAlgebrite: string,
  rightAlgebrite: string,
  variable: string,
): import("../../types").Step | null {
  // EC-H-03 is an exact real-domain equation contract. Keep recognition
  // narrow: sinh(x)=1 (or its reversed equality), not arbitrary compositions.
  const left = leftAlgebrite.replace(/\s+/g, "");
  const right = rightAlgebrite.replace(/\s+/g, "");
  const target = "sinh(" + variable + ")";
  if (
    !((left === target && right === "1") ||
      (left === "1" && right === target))
  ) {
    return null;
  }
  return {
    id: "hyperbolic-sine-one-real-logarithmic-root",
    latex: variable + " = \\ln\\left(1+\\sqrt{2}\\right)",
    explanation:
      "La función sinh es estrictamente creciente en los reales porque su derivada cosh(x) es siempre positiva. Para y = ln(1+sqrt(2)), e^y = 1+sqrt(2) y e^(-y) = sqrt(2)-1; por tanto sinh(y) = (e^y-e^(-y))/2 = 1. Por monotonía, esa raíz real es única.",
  };
}
