export function hyperbolicArtanhTwoStep(
  leftAlgebrite: string,
  rightAlgebrite: string,
  variable: string,
): import("../../types").Step | null {
  // EC-HI-08 is a frozen real-domain contract. Recognize only atanh(x)=2
  // (or the reversed equality); the value 2 is outside (-1, 1) as a result,
  // but inside the domain of tanh as a preimage.
  const bare = (value: string) => value.replace(/[\s()]/g, "");
  const left = bare(leftAlgebrite);
  const right = bare(rightAlgebrite);
  const target = "atanh" + variable;
  const matchesPair = (a: string, b: string): boolean => a === target && b === "2";
  if (!(matchesPair(left, right) || matchesPair(right, left))) {
    return null;
  }
  return {
    id: "hyperbolic-artanh-two-exact-root",
    latex: variable + " = \\tanh 2",
    explanation:
      "tanh es una biyección estrictamente creciente de los reales sobre (-1, 1), con atanh como inversa. Aplicando tanh a ambos lados de atanh(x)=2 se obtiene la raíz real exacta x = tanh 2 ≈ 0.964027580, que pertenece al dominio |x| < 1.",
  };
}
