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

describe("Algebra114 AS-AVS-07 |x| = x-1 over R", () => {
  it("matches the official row", () => {
    expect(source).toContain(
      "| AS-AVS-07 | N3 | \\(|x|=x-1\\) | Sin solución; si se eleva al cuadrado aparece \\(x=\\frac{1}{2}\\), que es extraña |",
    );
  });

  it("confirms the squared candidate x=1/2 is extraneous", () => {
    expect(evaluate("roots(x^2-(x-1)^2,x)").replace(/\s+/g, "")).toBe("1/2");
    expect(evaluate("abs(1/2)-(1/2-1)")).toBe("1");
  });

  it("returns no real solution and rejects the extraneous candidate explicitly", () => {
    const result = solve("|x|=x-1");
    expect(result.truth).toBe("contradiction");
    expect(result.solutionsAlgebrite).toHaveLength(0);
    const cases = result.steps.find((step) => step.id === "absolute-value-cases");
    expect(cases, JSON.stringify(result.steps)).toBeDefined();
    expect(cases!.explanation).toMatch(/1\/2/);
    expect(cases!.explanation).toMatch(/descarta/);
    expect(result.steps.at(-1)!.latex).toBe("∅");
  });
});
