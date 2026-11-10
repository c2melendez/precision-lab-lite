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

describe("Regression: inverse-sine branch arcsin(x)=c on the real domain", () => {
  it("solves arcsin(x)=pi/6 to exactly one root, x=1/2", () => {
    const roots = solveRoots("arcsin(x)=pi/6");
    expect(roots).toHaveLength(1);
    expect(isExactlyHalf(roots[0])).toBe(true);
  });

  it("accepts the reversed equation pi/6=arcsin(x) with the same single root", () => {
    const roots = solveRoots("pi/6=arcsin(x)");
    expect(roots).toHaveLength(1);
    expect(isExactlyHalf(roots[0])).toBe(true);
  });

  it("does not invent a real root for arcsin(x)=2, which is outside the range of arcsin", () => {
    let roots: string[] = [];
    try {
      roots = solveRoots("arcsin(x)=2");
    } catch {
      roots = [];
    }
    expect(roots).toHaveLength(0);
  });
});
