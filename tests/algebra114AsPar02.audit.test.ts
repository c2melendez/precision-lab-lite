import { describe, expect, it } from "vitest";
import { evaluate, substituteExact } from "../src/engine/algebriteClient";
import { parseExpression } from "../src/engine/parsing";
import { solveAlgebra } from "../src/engine/stepEngine/algebra";
import source from "../qa/certification/algebra114_source.md?raw";

describe("Algebra114 AS-PAR-02 original parameter equation (a - 1)x = a + 1", () => {
  it("returns the generic quotient and rejects the a = 1 contradiction", () => {
    expect(source).toContain("| AS-PAR-02 | N2 |");

    const generic = parseExpression("(a-1)*x=a+1");
    expect(generic.isEquation).toBe(true);
    const symbolic = solveAlgebra(generic.leftAlgebrite, generic.rightAlgebrite, "x");
    expect(symbolic.solutionsAlgebrite).toHaveLength(1);
    const root = symbolic.solutionsAlgebrite[0];
    expect(root).toBe(evaluate("simplify((a+1)/(a-1))"));
    expect(substituteExact(root, "a", "0")).toBe("-1");
    expect(substituteExact(root, "a", "2")).toBe("3");

    // a = 0: -x = 1 -> x = -1.
    const zeroParameter = parseExpression("-x=1");
    const zeroResult = solveAlgebra(
      zeroParameter.leftAlgebrite,
      zeroParameter.rightAlgebrite,
      "x",
    );
    expect(zeroResult.solutionsAlgebrite).toContain("-1");

    // a = 2: x = 3.
    const nonUnitParameter = parseExpression("x=3");
    const nonUnitResult = solveAlgebra(
      nonUnitParameter.leftAlgebrite,
      nonUnitParameter.rightAlgebrite,
      "x",
    );
    expect(nonUnitResult.solutionsAlgebrite).toContain("3");

    // a = 1: 0*x = 2, a contradiction; no solution exists.
    const degenerate = parseExpression("0*x=2");
    const degenerateResult = solveAlgebra(
      degenerate.leftAlgebrite,
      degenerate.rightAlgebrite,
      "x",
    );
    expect(degenerateResult.truth).toBe("contradiction");
    expect(degenerateResult.solutionsAlgebrite).toEqual([]);
  });
});
