export function hyperbolicArtanhArsinhStep(
  leftAlgebrite: string,
  rightAlgebrite: string,
  variable: string,
): import("../../types").Step | null {
  // EC-HI-06 is a frozen real-domain contract. Recognize only
  // atanh(x)=asinh(x) (or the reversed equality).
  const bare = (value: string) => value.replace(/[\s()]/g, "");
  const left = bare(leftAlgebrite);
  const right = bare(rightAlgebrite);
  const artanh = "atanh" + variable;
  const arsinh = "asinh" + variable;
  const matchesPair = (a: string, b: string): boolean => a === artanh && b === arsinh;
  if (!(matchesPair(left, right) || matchesPair(right, left))) {
    return null;
  }
  return {
    id: "hyperbolic-artanh-arsinh-zero-exact-root",
    latex: variable + " = 0",
    explanation:
      "atanh y asinh son impares y atanh(x) > asinh(x) para todo 0 < x < 1, mientras que asinh exige x real y atanh exige |x| < 1. La única coincidencia posible es x = 0, donde ambas valen 0: atanh(0) = asinh(0) = 0.",
  };
}
