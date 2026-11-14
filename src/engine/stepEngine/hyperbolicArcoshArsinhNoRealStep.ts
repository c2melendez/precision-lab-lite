export function hyperbolicArcoshArsinhNoRealStep(
  leftAlgebrite: string,
  rightAlgebrite: string,
  variable: string,
): import("../../types").Step | null {
  // EC-HI-07 is a frozen real-domain contract. Recognize only
  // arcosh(x)=arsinh(x) (or the reversed equality) and report that the real
  // solution set is empty.
  const bare = (value: string) => value.replace(/[\s()]/g, "");
  const left = bare(leftAlgebrite);
  const right = bare(rightAlgebrite);
  const arcosh = "acosh" + variable;
  const arsinh = "asinh" + variable;
  const matchesPair = (a: string, b: string): boolean => a === arcosh && b === arsinh;
  if (!(matchesPair(left, right) || matchesPair(right, left))) {
    return null;
  }
  return {
    id: "hyperbolic-arcosh-arsinh-no-real-solution",
    latex: "\\varnothing",
    explanation:
      "Para x real, cosh(x) - sinh(x) = e^{-x} > 0, así que cosh(x) > sinh(x) en todo real. Como ambas son estrictamente crecientes e invertibles en el dominio compartido x ≥ 1, la desigualdad se invierte al invertir: acosh(x) < asinh(x) para todo x ≥ 1. Por tanto la igualdad arcosh(x)=arsinh(x) no tiene solución real.",
  };
}
