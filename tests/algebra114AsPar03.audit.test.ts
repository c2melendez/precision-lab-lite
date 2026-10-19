import { describe, expect, it } from "vitest";
import { evaluate, substituteExact } from "../src/engine/algebriteClient";
import { parseExpression } from "../src/engine/parsing";
import { solveAlgebra } from "../src/engine/stepEngine/algebra";
import source from "../qa/certification/algebra114_source.md?raw";

describe("Algebra114 AS-PAR-03 original real-domain equation x^2 = a", () => {
  it("returns both symbolic square roots and the a=0/a>0 branches", () => {
    expect(source).toContain("| AS-PAR-03 | N2 |");

    const generic = parseExpression("x^2=a");
    expect(generic.isEquation).toBe(true);
    const result = solveAlgebra(generic.leftAlgebrite, generic.rightAlgebrite, "x");
    expect(result.solutionsAlgebrite).toHaveLength(2);

    // Each symbolic root must satisfy x^2-a=0 identically.
    for (const root of result.solutionsAlgebrite) {
      expect(evaluate(`simplify((${root})^2-a)`)).toBe("0");
    }

    // a = 4: the real roots are -2 and 2.
    const rootsAtFour = result.solutionsAlgebrite.map((root) =>
      evaluate(substituteExact(root, "a", "4")),
    );
    expect(rootsAtFour).toContain("-2");
    expect(rootsAtFour).toContain("2");

    // a = 0: x^2=0 has the single distinct root x=0.
    const zero = parseExpression("x^2=0");
    const zeroResult = solveAlgebra(zero.leftAlgebrite, zero.rightAlgebrite, "x");
    expect(zeroResult.solutionsAlgebrite).toContain("0");
  });
});
