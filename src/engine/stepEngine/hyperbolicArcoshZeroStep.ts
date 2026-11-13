export function hyperbolicArcoshZeroStep(
  leftAlgebrite: string,
  rightAlgebrite: string,
  variable: string,
): import("../../types").Step | null {
  // EC-HI-02 is a frozen real-domain contract. Recognize only acosh(x)=0
  // (or the reversed equality); this is not a general inverse-hyperbolic solver.
  const left = leftAlgebrite.replace(/\s+/g, "");
  const right = rightAlgebrite.replace(/\s+/g, "");
  const target = "acosh(" + variable + ")";
  if (
    !((left === target && right === "0") ||
      (right === target && left === "0"))
  ) {
    return null;
  }
  return {
    id: "hyperbolic-arcosh-zero-exact-root",
    latex: variable + " = 1",
    explanation:
      "cosh es una biyección estrictamente creciente de [0, ∞) sobre [1, ∞), con acosh como inversa; acosh(1) = 0, por lo que la única solución real de acosh(x)=0 es x=1.",
  };
}
