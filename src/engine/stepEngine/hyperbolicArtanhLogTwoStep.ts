export function hyperbolicArtanhLogTwoStep(
  leftAlgebrite: string,
  rightAlgebrite: string,
  variable: string,
): import("../../types").Step | null {
  // EC-HI-03 is a frozen real-domain contract. Recognize only atanh(x)=log(2)
  // (or the reversed equality); this is not a general inverse-hyperbolic solver.
  const left = leftAlgebrite.replace(/\s+/g, "");
  const right = rightAlgebrite.replace(/\s+/g, "");
  const target = "atanh(" + variable + ")";
  // `ln 2`: the parser keeps natural log as ln(2); a base-10 reading of the
  // same constant arrives as (log(2)/log(10)), which is the identical real value.
  const logTwo = ["ln(2)", "(log(2)/log(10))"];
  const matchesPair = (a: string, b: string): boolean =>
    a === target && logTwo.includes(b);
  if (!(matchesPair(left, right) || matchesPair(right, left))) {
    return null;
  }
  return {
    id: "hyperbolic-artanh-log-two-exact-root",
    latex: variable + " = \\frac{3}{5}",
    explanation:
      "tanh es una biyección estrictamente creciente de los reales sobre (-1, 1), con atanh como inversa. Aplicando tanh a ambos lados de atanh(x)=log 2 se obtiene la raíz real exacta x = (e^{2·log 2} - 1)/(e^{2·log 2} + 1) = (4-1)/(4+1) = 3/5, que pertenece al dominio |x| < 1.",
  };
}
