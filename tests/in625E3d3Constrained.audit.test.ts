import { describe, expect, it } from "vitest";
import { detectConstrainedEquationIntent, satisfiesConstraint } from "../src/engine/parsing/constrainedEquationIntent";
import { parseExpression } from "../src/engine/parsing";
import { solveAlgebra } from "../src/engine/stepEngine/algebra";

describe("IN625 E3d3 — ecuación con restricción", () => {
  it("EN-DI-22 detecta ecuación + condición", () => {
    const intent = detectConstrainedEquationIntent("x^{2}-4=0, x>0");
    expect(intent).toEqual({
      equationLatex: "x^{2}-4=0",
      constraintLatex: "x>0",
      variable: "x",
      operator: ">",
      bound: 0,
    });
  });

  it("EN-DI-22 filtra {-2,2} a {2}", () => {
    const intent = detectConstrainedEquationIntent("x^{2}-4=0, x>0")!;
    const parsed = parseExpression(intent.equationLatex);
    const solved = solveAlgebra(parsed.leftAlgebrite, parsed.rightAlgebrite, intent.variable);
    const filtered = solved.solutionsAlgebrite
      .map(Number)
      .filter((value) => Number.isFinite(value) && satisfiesConstraint(value, intent));
    expect(filtered).toEqual([2]);
  });
});
