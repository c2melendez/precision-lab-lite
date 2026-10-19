import { describe, expect, it } from "vitest";
import { evaluate } from "../src/engine/algebriteClient";
import { parseExpression } from "../src/engine/parsing";
import { solveAlgebra } from "../src/engine/stepEngine/algebra";
import source from "../qa/certification/algebra114_source.md?raw";

function solve(equation: string) {
  const parsed = parseExpression(equation);
  expect(parsed.isEquation).toBe(true);
  return solveAlgebra(parsed.leftAlgebrite, parsed.rightAlgebrite, "x");
}

function equivalent(left: string, right: string): boolean {
  return evaluate(`simplify((${left})-(${right}))`) === "0";
}

describe("Algebra114 AS-PAR-05 original real-domain parameter quadratic x^2 + mx + 1 = 0", () => {
  it("verifies the generic roots against the original polynomial and discriminant", () => {
    expect(source).toContain("| AS-PAR-05 | N3 |");

    const result = solve("x^2+m*x+1=0");
    expect(result.solutionsAlgebrite).toHaveLength(2);
    for (const root of result.solutionsAlgebrite) {
      expect(evaluate(`simplify((${root})^2+m*(${root})+1)`)).toBe("0");
    }

    const separation = evaluate(
      `simplify((${result.solutionsAlgebrite[0]})-(${result.solutionsAlgebrite[1]}))`,
    );
    expect(evaluate(`simplify((${separation})^2-(m^2-4))`)).toBe("0");
  });

  it.each([
    ["3", "(-3+sqrt(5))/2", "(-3-sqrt(5))/2"],
    ["-3", "(3+sqrt(5))/2", "(3-sqrt(5))/2"],
  ])("returns the two exact real roots for m=%s (|m|>2)", (m, first, second) => {
    const result = solve(`x^2+(${m})*x+1=0`);
    expect(result.solutionsAlgebrite).toHaveLength(2);
    for (const root of result.solutionsAlgebrite) {
      expect(evaluate(`simplify((${root})^2+(${m})*(${root})+1)`)).toBe("0");
    }
    expect(result.solutionsAlgebrite.some((root) => equivalent(root, first))).toBe(true);
    expect(result.solutionsAlgebrite.some((root) => equivalent(root, second))).toBe(true);
  });

  it.each([
    ["2", "-1"],
    ["-2", "1"],
  ])("returns the double root x=%s/2 for m=%s (|m|=2)", (m, expected) => {
    const result = solve(`x^2+(${m})*x+1=0`);
    expect(result.solutionsAlgebrite.length).toBeGreaterThanOrEqual(1);
    const distinctRoots = new Set(result.solutionsAlgebrite.map((root) => evaluate(`simplify(${root})`)));
    expect(distinctRoots.size).toBe(1);
    expect([...distinctRoots][0]).toBe(expected);
    for (const root of result.solutionsAlgebrite) {
      expect(evaluate(`simplify((${root})^2+(${m})*(${root})+1)`)).toBe("0");
    }
  });

  it("keeps the |m|<2 roots explicitly complex instead of misclassifying them as real", () => {
    // The canonical theorem is over R: at m=0, x^2+1 has no real roots.
    // The general solver may expose the complex pair; verify their identity explicitly.
    const result = solve("x^2+1=0");
    expect(result.solutionsAlgebrite).toHaveLength(2);
    for (const root of result.solutionsAlgebrite) {
      expect(evaluate(`simplify((${root})^2+1)`)).toBe("0");
    }
    expect(result.solutionsAlgebrite.some((root) => equivalent(root, "i"))).toBe(true);
    expect(result.solutionsAlgebrite.some((root) => equivalent(root, "-i"))).toBe(true);
  });
});
