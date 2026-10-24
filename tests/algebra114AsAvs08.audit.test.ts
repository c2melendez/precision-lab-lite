import { describe, expect, it } from "vitest";
import { evaluate } from "../src/engine/algebriteClient";
import { parseExpression } from "../src/engine/parsing";
import { solveAlgebra } from "../src/engine/stepEngine/algebra";
import source from "../qa/certification/algebra114_source.md?raw";

const EQUATION = "|x-1|=x+1";
const LEFT = "abs(x-1)";
const RIGHT = "x+1";
const EXPECTED = ["0"];

describe("Algebra114 AS-AVS-08 |x-1|=x+1 over R", () => {
  it("matches the official row", () => {
    expect(source).toContain("| AS-AVS-08 | N3 | \\(|x-1|=x+1\\) | \\(x=0\\) |");
  });

  it("solves by cases and keeps exactly the official roots", () => {
    const parsed = parseExpression(EQUATION);
    expect(parsed.isEquation).toBe(true);
    const result = solveAlgebra(parsed.leftAlgebrite, parsed.rightAlgebrite, "x");
    expect(result.truth).toBeUndefined();
    expect(result.solutionsAlgebrite).toEqual(EXPECTED);
    const cases = result.steps.find((step) => step.id === "absolute-value-cases");
    expect(cases, JSON.stringify(result.steps)).toBeDefined();
    expect(cases!.explanation).toMatch(/sin solución/);
    for (const root of EXPECTED) {
      expect(evaluate(`(${LEFT})-(${RIGHT})`.replaceAll("x", `(${root})`))).toBe("0");
    }
  });
});
