export function hyperbolicArsinhOneStep(
  leftAlgebrite: string,
  rightAlgebrite: string,
  variable: string,
): import("../../types").Step | null {
  // EC-HI-01 is a frozen real-domain contract. Recognize only asinh(x)=1
  // (or the reversed equality); this is not a general inverse-hyperbolic solver.
  const left = leftAlgebrite.replace(/\s+/g, "");
  const right = rightAlgebrite.replace(/\s+/g, "");
  const target = "asinh(" + variable + ")";
  if (
    !((left === target && right === "1") ||
      (right === target && left === "1"))
  ) {
    return null;
  }
  return {
    id: "hyperbolic-arsinh-one-exact-root",
    latex: variable + " = \\sinh 1",
    explanation:
      "sinh es una biyección estrictamente creciente de los reales sobre los reales, con derivada cosh(x) > 0; por tanto asinh es su inversa global. Aplicando sinh a ambos lados de asinh(x)=1 se obtiene la raíz real exacta x = sinh 1 ≈ 1.175201194.",
  };
}
