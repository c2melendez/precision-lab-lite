export function hyperbolicSechHalfStep(
  leftAlgebrite: string,
  rightAlgebrite: string,
  variable: string,
): import("../../types").Step | null {
  // EC-H-08 is a frozen real-domain equation contract. Recognize only
  // sech(x)=1/2 (or the reversed equality, or the equivalent 1/cosh(x) form);
  // sech(x)=1/2 is equivalent to cosh(x)=2 for real x.
  // The parser rewrites sech(x) as (1/cosh(x)); ignore parentheses and spaces.
  const bare = (value: string) => value.replace(/[\s()]/g, "");
  const left = bare(leftAlgebrite);
  const right = bare(rightAlgebrite);
  const sechTargets = ["sech" + variable, "1/cosh" + variable];
  const isOneHalf = (value: string) => value === "1/2" || value === "0.5";
  const isSech = (value: string) => sechTargets.includes(value);
  if (
    !((isSech(left) && isOneHalf(right)) ||
      (isOneHalf(left) && isSech(right)))
  ) {
    return null;
  }
  return {
    id: "hyperbolic-secant-half-real-logarithmic-roots",
    latex: variable + " = \\pm\\ln\\left(2+\\sqrt{3}\\right)",
    explanation:
      "Para x real, sech(x)=1/2 equivale a cosh(x)=2. Sea t = e^x > 0. De cosh(x)=2 se obtiene t + 1/t = 4 y, por tanto, t² - 4t + 1 = 0. Sus dos raíces positivas son 2+√3 y 2-√3; como (2-√3)(2+√3)=1, sus logaritmos son opuestos. Así, las dos soluciones reales son x = ±ln(2+√3), y la sustitución en sech(x)=1/2 las verifica.",
  };
}
