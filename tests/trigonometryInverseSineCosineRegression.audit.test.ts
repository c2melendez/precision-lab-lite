import { describe, expect, it } from "vitest";
import { parseExpression } from "../src/engine/parsing";
import { evaluate } from "../src/engine/algebriteClient";
import { solveAlgebra } from "../src/engine/stepEngine/algebra";
import { solveInverseSineCosineEqualEquation } from "../src/engine/stepEngine/trigonometricEquation";

function solveRoots(equation: string): string[] {
  const parsed = parseExpression(equation, "RAD");
  return solveAlgebra(parsed.leftAlgebrite, parsed.rightAlgebrite, "x").solutionsAlgebrite;
}

function isRootSqrtTwoOverTwo(root: string): boolean {
  return evaluate("simplify((" + root + ")-(sqrt(2)/2))").replace(/\s+/g, "") === "0";
}

describe("Regression: arcsin(x)=arccos(x) on the real domain", () => {
  it("solves arcsin(x)=arccos(x) to exactly one root, x=sqrt(2)/2", () => {
    const roots = solveRoots("arcsin(x)=arccos(x)");
    expect(roots).toHaveLength(1);
    expect(isRootSqrtTwoOverTwo(roots[0])).toBe(true);
  });

  it("accepts the reversed equation arccos(x)=arcsin(x) with the same single root", () => {
    const roots = solveRoots("arccos(x)=arcsin(x)");
    expect(roots).toHaveLength(1);
    expect(isRootSqrtTwoOverTwo(roots[0])).toBe(true);
  });

  it("does not claim the helper for a shifted form arcsin(x)=arccos(x)+1", () => {
    const parsed = parseExpression("arcsin(x)=arccos(x)+1", "RAD");
    expect(solveInverseSineCosineEqualEquation(parsed.leftAlgebrite, parsed.rightAlgebrite, "x")).toBeNull();
  });
});
