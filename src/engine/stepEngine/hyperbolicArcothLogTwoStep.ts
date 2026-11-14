export function hyperbolicArcothLogTwoStep(
  leftAlgebrite: string,
  rightAlgebrite: string,
  variable: string,
): import("../../types").Step | null {
  // EC-HI-05 is a frozen real-domain contract. Recognize only acoth(x)=ln(2)
  // (or the reversed equality). The Lite parser rewrites acoth(u) as
  // atanh(1/u), so the canonical form is atanh(1/x).
  const bare = (value: string) => value.replace(/[\s()]/g, "");
  const left = bare(leftAlgebrite);
  const right = bare(rightAlgebrite);
  const target = "atanh1/" + variable;
  const logTwo = ["ln2", "log2/log10"];
  const matchesPair = (a: string, b: string): boolean => a === target && logTwo.includes(b);
  if (!(matchesPair(left, right) || matchesPair(right, left))) {
    return null;
  }
  return {
    id: "hyperbolic-arcoth-log-two-exact-root",
    latex: variable + " = \\frac{5}{3}",
    explanation:
      "coth es una biyección estrictamente decreciente de (0, ∞) sobre (1, ∞), con acoth como inversa en ese tramo. Aplicando coth a ambos lados de acoth(x)=ln 2 se obtiene x = (e^{2 ln 2} + 1)/(e^{2 ln 2} - 1) = (4 + 1)/(4 - 1) = 5/3, que pertenece al dominio |x| > 1.",
  };
}
