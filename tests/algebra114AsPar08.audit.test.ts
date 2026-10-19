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

describe("Algebra114 AS-PAR-08 absolute-value equation |x-a| = b over R", () => {
  it("matches the official three-branch contract", () => {
    expect(source).toContain("| AS-PAR-08 | N3 |");
    expect(source).toContain("Si \\(b<0\\), sin solución; si \\(b=0\\), \\(x=a\\); si \\(b>0\\), \\(x=a\\pm b\\)");
  });

  it("returns the single root x=a when b=0", () => {
    const result = solve("abs(x-5)=0");
    expect(result.solutionsAlgebrite).toHaveLength(1);
    expect(evaluate("simplify(" + result.solutionsAlgebrite[0] + "-5)")).toBe("0");
    expect(evaluate("simplify(abs(" + result.solutionsAlgebrite[0] + "-5))")).toBe("0");
  });

  it.each([
    ["2", "5", ["3", "7"]],
    ["3", "0", ["-3", "3"]],
  ])("returns both exact roots when b=%s > 0", (b, a, expected) => {
    const result = solve("abs(x-(" + a + "))=" + b);
    expect(result.solutionsAlgebrite).toHaveLength(2);
    const roots = result.solutionsAlgebrite.map((root) => evaluate("simplify(" + root + ")")).sort();
    expect(roots).toEqual([...expected].sort());
    for (const root of roots) {
      expect(evaluate("simplify(abs((" + root + ")-(" + a + "))-(" + b + "))")).toBe("0");
    }
  });

  it("states the conditional three-way branch for symbolic b", () => {
    const result = solve("abs(x-a)=b");
    expect(result.solutionsAlgebrite).toHaveLength(2);
    expect(evaluate("simplify((" + result.solutionsAlgebrite[0] + ")-(a+b))")).toBe("0");
    expect(evaluate("simplify((" + result.solutionsAlgebrite[1] + ")-(a-b))")).toBe("0");
    const domainStep = result.steps.find((step) => step.id === "absolute-value-domain");
    expect(domainStep?.explanation).toContain("b < 0");
    expect(domainStep?.explanation).toContain("b = 0");
    expect(domainStep?.explanation).toContain("b > 0");
  });

  it.each(["-1", "-2"])("returns no real roots when b=%s < 0", (b) => {
    const result = solve("abs(x-5)=(" + b + ")");
    expect(result.solutionsAlgebrite).toHaveLength(0);
    expect(result.truth).toBe("contradiction");
  });
});
