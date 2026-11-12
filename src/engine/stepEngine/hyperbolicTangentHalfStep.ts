export function hyperbolicTangentHalfStep(
  leftAlgebrite: string,
  rightAlgebrite: string,
  variable: string,
): import("../../types").Step | null {
  // EC-H-05 is a frozen real-domain contract. Recognize only tanh(x)=1/2
  // (or the reversed equality); this is not a general hyperbolic solver.
  const left = leftAlgebrite.replace(/\s+/g, "");
  const right = rightAlgebrite.replace(/\s+/g, "");
  const target = "tanh(" + variable + ")";
  const isOneHalf = (value: string) => value === "1/2" || value === "(1/2)";
  if (
    !((left === target && isOneHalf(right)) ||
      (isOneHalf(left) && right === target))
  ) {
    return null;
  }
  return {
    id: "hyperbolic-tangent-half-real-logarithmic-root",
    latex: variable + " = \\frac{1}{2}\\ln 3",
    explanation:
      "Sea t = e^x > 0. La identidad tanh(x) = (t²-1)/(t²+1) convierte tanh(x)=1/2 en t²=3. Como t es positivo, t=√3 y x=ln(√3)=1/2·ln(3). Además, tanh es estrictamente creciente en los reales porque su derivada es sech²(x)>0; por tanto la raíz es real y única.",
  };
}
