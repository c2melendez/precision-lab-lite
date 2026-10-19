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

describe("Algebra114 AS-PAR-07 original equation sqrt(x-a) = b over R", () => {
  it("matches the official conditional contract", () => {
    expect(source).toContain("| AS-PAR-07 | N3 |");
    expect(source).toContain("Si \\(b\\ge0\\), \\(x=a+b^{2}\\); si \\(b<0\\), sin solución real");
  });

  it.each([
    ["0", "5", "5"],
    ["2", "5", "9"],
    ["3", "0", "9"],
  ])("returns x=a+b^2 and satisfies the original equation for b=%s, a=%s", (b, a, expected) => {
    const result = solve("sqrt(x-" + a + ")=" + b);
    expect(result.solutionsAlgebrite).toHaveLength(1);
    const root = evaluate("simplify(" + result.solutionsAlgebrite[0] + ")");
    expect(root).toBe(expected);
    expect(evaluate("simplify(sqrt((" + root + ")-(" + a + "))-(" + b + "))")).toBe("0");
  });

  it("states the nonnegative condition for symbolic a and b", () => {
    const result = solve("sqrt(x-a)=b");
    expect(result.solutionsAlgebrite).toHaveLength(1);
    expect(evaluate("simplify((" + result.solutionsAlgebrite[0] + ")-(a+b^2))")).toBe("0");
    const domainStep = result.steps.find((step) => step.id === "square-root-domain");
    expect(domainStep?.explanation).toContain("b ≥ 0");
    expect(domainStep?.explanation).toContain("b < 0");
  });

  it.each(["-1", "-2"])("returns no real solution when b=%s is negative", (b) => {
    const result = solve("sqrt(x-5)=(" + b + ")");
    expect(result.solutionsAlgebrite).toHaveLength(0);
    expect(result.truth).toBe("contradiction");
  });
});
