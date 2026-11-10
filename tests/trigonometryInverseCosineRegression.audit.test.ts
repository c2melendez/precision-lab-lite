import { describe, expect, it } from "vitest";
import { parseExpression } from "../src/engine/parsing";
import { evaluate } from "../src/engine/algebriteClient";
import { solveAlgebra } from "../src/engine/stepEngine/algebra";

function solveRoots(equation: string): string[] {
  const parsed = parseExpression(equation, "RAD");
  return solveAlgebra(parsed.leftAlgebrite, parsed.rightAlgebrite, "x").solutionsAlgebrite;
}

function isExactlyHalf(root: string): boolean {
  return evaluate("simplify((" + root + ")-(1/2))").replace(/\s+/g, "") === "0";
}

describe("Regression: inverse-cosine branch arccos(x)=c on the real domain", () => {
  it("solves arccos(x)=pi/3 to exactly one root, x=1/2", () => {
    const roots = solveRoots("arccos(x)=pi/3");
    expect(roots).toHaveLength(1);
    expect(isExactlyHalf(roots[0])).toBe(true);
  });

  it("accepts the reversed equation pi/3=arccos(x) with the same single root", () => {
    const roots = solveRoots("pi/3=arccos(x)");
    expect(roots).toHaveLength(1);
    expect(isExactlyHalf(roots[0])).toBe(true);
  });

  it("does not invent a real root for arccos(x)=4, which is outside the range of arccos", () => {
    let roots: string[] = [];
    try {
      roots = solveRoots("arccos(x)=4");
    } catch {
      roots = [];
    }
    expect(roots).toHaveLength(0);
  });
});
