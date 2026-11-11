import { describe, expect, it } from "vitest";
import { parseExpression } from "../src/engine/parsing";
import { evaluate } from "../src/engine/algebriteClient";
import { solveAlgebra } from "../src/engine/stepEngine/algebra";
import { solveInverseTangentEquation } from "../src/engine/stepEngine/trigonometricEquation";

function solveRoots(equation: string): string[] {
  const parsed = parseExpression(equation, "RAD");
  return solveAlgebra(parsed.leftAlgebrite, parsed.rightAlgebrite, "x").solutionsAlgebrite;
}

function isExactlyOne(root: string): boolean {
  return evaluate("simplify((" + root + ")-(1))").replace(/\s+/g, "") === "0";
}

describe("Regression: inverse-tangent branch arctan(x)=c on the real domain", () => {
  it("solves arctan(x)=pi/4 to exactly one root, x=1", () => {
    const roots = solveRoots("arctan(x)=pi/4");
    expect(roots).toHaveLength(1);
    expect(isExactlyOne(roots[0])).toBe(true);
  });

  it("accepts the reversed equation pi/4=arctan(x) with the same single root", () => {
    const roots = solveRoots("pi/4=arctan(x)");
    expect(roots).toHaveLength(1);
    expect(isExactlyOne(roots[0])).toBe(true);
  });

  it("does not return a candidate for arctan(x)=pi, which is outside the open principal range", () => {
    const parsed = parseExpression("arctan(x)=pi", "RAD");
    expect(solveInverseTangentEquation(parsed.leftAlgebrite, parsed.rightAlgebrite, "x")).toBeNull();
  });
});
