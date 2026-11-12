export function hyperbolicCoshSinhTwoStep(
  leftAlgebrite: string,
  rightAlgebrite: string,
  variable: string,
): import("../../types").Step | null {
  // EC-H-06 is a frozen identity contract. Recognize only cosh(x)+sinh(x)=2
  // (or the reversed equality); do not imply a general composite solver.
  const left = leftAlgebrite.replace(/\s+/g, "");
  const right = rightAlgebrite.replace(/\s+/g, "");
  const target = "cosh(" + variable + ")+sinh(" + variable + ")";
  const reversed = "sinh(" + variable + ")+cosh(" + variable + ")";
  if (!((left === target || left === reversed) && right === "2") &&
      !((right === target || right === reversed) && left === "2")) {
    return null;
  }
  return {
    id: "hyperbolic-cosh-sinh-two-real-logarithmic-root",
    latex: variable + " = \\ln 2",
    explanation:
      "La identidad cosh(x)+sinh(x)=e^x reduce la ecuación a e^x=2. " +
      "La exponencial es estrictamente creciente en los reales y siempre positiva; " +
      "por tanto existe exactamente una raíz real, x=ln(2). La sustitución en " +
      "cosh(x)+sinh(x)=2 verifica la solución.",
  };
}
