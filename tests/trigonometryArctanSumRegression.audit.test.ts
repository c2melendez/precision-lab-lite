import { describe, expect, it } from "vitest";
import { parseExpression } from "../src/engine/parsing";
import { evaluate } from "../src/engine/algebriteClient";
import { solveAlgebra } from "../src/engine/stepEngine/algebra";
import { solveArctanSumQuarterPiEquation } from "../src/engine/stepEngine/trigonometricEquation";

function solveRoots(equation: string): string[] {
  const parsed = parseExpression(equation, "RAD");
  return solveAlgebra(parsed.leftAlgebrite, parsed.rightAlgebrite, "x").solutionsAlgebrite;
}

function isPositiveRoot(root: string): boolean {
  return evaluate("simplify((" + root + ")-((sqrt(17)-3)/4))").replace(/\s+/g, "") === "0";
}

describe("Regression: arctan(x)+arctan(2x)=pi/4 on the real domain", () => {
  it("solves the direct sum to exactly one root, (sqrt(17)-3)/4", () => {
    const roots = solveRoots("arctan(x)+arctan(2*x)=pi/4");
    expect(roots).toHaveLength(1);
    expect(isPositiveRoot(roots[0])).toBe(true);
  });

  it("accepts the reversed sum arctan(2*x)+arctan(x)=pi/4 with the same single root", () => {
    const roots = solveRoots("arctan(2*x)+arctan(x)=pi/4");
    expect(roots).toHaveLength(1);
    expect(isPositiveRoot(roots[0])).toBe(true);
  });

  it("returns no candidate when the constant is not pi/4", () => {
    const parsed = parseExpression("arctan(x)+arctan(2*x)=pi/2", "RAD");
    expect(solveArctanSumQuarterPiEquation(parsed.leftAlgebrite, parsed.rightAlgebrite, "x")).toBeNull();
  });
});
