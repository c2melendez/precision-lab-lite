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

describe("Algebra114 AS-PAR-10 rational equation x/(x-a)=1", () => {
  it("matches the official parameter and domain contract", () => {
    expect(source).toContain("| AS-PAR-10 | N3 |");
    expect(source).toContain("Si \\(a\\neq0\\), sin solución; si \\(a=0\\), toda \\(x\\neq0\\)");
  });

  it("returns no solution for a nonzero parameter", () => {
    const result = solve("x/(x-3)=1");
    expect(result.solutionsAlgebrite).toHaveLength(0);
    expect(result.truth).toBe("contradiction");
  });

  it("classifies a=0 as an identity without losing x!=0", () => {
    const result = solve("x/x=1");
    expect(result.truth).toBe("identity");
    expect(result.solutionsAlgebrite).toHaveLength(0);
    const domainStep = result.steps.find((step) => /domain|dominio/i.test(step.id + " " + step.explanation));
    expect(domainStep).toBeDefined();
    expect((domainStep?.explanation || "") + " " + (domainStep?.latex || "")).toMatch(/x\\s*!=?\\s*0|x\\neq0|x≠0|x != 0/);
  });
});
