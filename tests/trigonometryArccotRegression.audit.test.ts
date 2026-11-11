import { describe, expect, it } from "vitest";
import { parseExpression } from "../src/engine/parsing";
import { solveAlgebra } from "../src/engine/stepEngine/algebra";
import { solveArccotTwoPiThirdsEquation } from "../src/engine/stepEngine/trigonometricEquation";

function solveRoots(equation: string): string[] {
  const parsed = parseExpression(equation, "RAD");
  return solveAlgebra(parsed.leftAlgebrite, parsed.rightAlgebrite, "x").solutionsAlgebrite;
}

function isExpectedRoot(root: string): boolean {
  return root.replace(/\s+/g, "") === "-sqrt(3)/3" || root.replace(/\s+/g, "") === "-1/3*sqrt(3)";
}

describe("Regression: arccot(x)=2*pi/3 on the principal branch", () => {
  it("solves the direct equation to exactly one root, -sqrt(3)/3", () => {
    const roots = solveRoots("arccot(x)=2*pi/3");
    expect(roots).toHaveLength(1);
    expect(isExpectedRoot(roots[0])).toBe(true);
  });

  it("accepts the parser-normalized form pi/2-arctan(x)=2*pi/3 with the same root", () => {
    const roots = solveRoots("(pi/2-arctan(x))=2*pi/3");
    expect(roots).toHaveLength(1);
    expect(isExpectedRoot(roots[0])).toBe(true);
  });

  it("returns no candidate when the constant is not 2*pi/3", () => {
    const parsed = parseExpression("arccot(x)=pi/3", "RAD");
    expect(solveArccotTwoPiThirdsEquation(parsed.leftAlgebrite, parsed.rightAlgebrite, "x")).toBeNull();
  });
});
