export function hyperbolicDoubleAngleSinhStep(
  leftAlgebrite: string,
  rightAlgebrite: string,
  variable: string,
): import("../../types").Step | null {
  // EC-H-07 is a frozen real-domain contract. Recognize only
  // sinh(2*x)=sinh(x) (or the reversed equality); not a general solver.
  const left = leftAlgebrite.replace(/\s+/g, "");
  const right = rightAlgebrite.replace(/\s+/g, "");
  const doubleAngle = "sinh(2*" + variable + ")";
  const singleAngle = "sinh(" + variable + ")";
  if (
    !((left === doubleAngle && right === singleAngle) ||
      (left === singleAngle && right === doubleAngle))
  ) {
    return null;
  }
  return {
    id: "hyperbolic-sinh-double-angle-unique-real-zero",
    latex: variable + " = 0",
    explanation:
      "La identidad sinh(2x)=2·sinh(x)·cosh(x) convierte la ecuación en " +
      "sinh(x)(2·cosh(x)-1)=0. Para x real, cosh(x)≥1, así que 2·cosh(x)-1≥1>0 " +
      "y el segundo factor nunca se anula. Por tanto sinh(x)=0, cuya única " +
      "solución real es x=0; la sustitución en sinh(2x)=sinh(x) la verifica.",
  };
}
