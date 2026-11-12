export function hyperbolicCosineTwoStep(
  leftAlgebrite: string,
  rightAlgebrite: string,
  variable: string,
): import("../../types").Step | null {
  // EC-H-04 is a frozen real-domain equation contract. Recognize only
  // cosh(x)=2 (or the reversed equality); do not infer a general cosh solver.
  const left = leftAlgebrite.replace(/\s+/g, "");
  const right = rightAlgebrite.replace(/\s+/g, "");
  const target = "cosh(" + variable + ")";
  if (
    !((left === target && right === "2") ||
      (left === "2" && right === target))
  ) {
    return null;
  }
  return {
    id: "hyperbolic-cosine-two-real-logarithmic-roots",
    latex: variable + " = \\pm\\ln\\left(2+\\sqrt{3}\\right)",
    explanation:
      "Sea t = e^x > 0. De cosh(x)=2 se obtiene t + 1/t = 4 y, por tanto, t² - 4t + 1 = 0. Sus dos raíces positivas son 2+√3 y 2-√3; como (2-√3)(2+√3)=1, sus logaritmos son opuestos. Así, las dos soluciones reales son x = ±ln(2+√3).",
  };
}
