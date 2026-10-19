import { describe, expect, it } from "vitest";
import { evaluate, substituteExact } from "../src/engine/algebriteClient";
import { parseExpression } from "../src/engine/parsing";
import { solveAlgebra } from "../src/engine/stepEngine/algebra";
import source from "../qa/certification/algebra114_source.md?raw";

describe("Algebra114 AS-PAR-04 original parameter quadratic x^2 - 2mx + m^2 - 1 = 0", () => {
  it("returns the two distinct symbolic roots m-1 and m+1", () => {
    expect(source).toContain("| AS-PAR-04 | N2 |");

    const generic = parseExpression("x^2-2*m*x+m^2-1=0");
    expect(generic.isEquation).toBe(true);
    const result = solveAlgebra(generic.leftAlgebrite, generic.rightAlgebrite, "x");
    expect(result.solutionsAlgebrite).toHaveLength(2);

    // Both roots satisfy the original polynomial identically.
    for (const root of result.solutionsAlgebrite) {
      expect(
        evaluate(`simplify((${root})^2-2*m*(${root})+m^2-1)`),
      ).toBe("0");
    }

    // The two branches remain distinct for every m: their difference is 2.
    const rootDifference = evaluate(
      `simplify((${result.solutionsAlgebrite[0]})-(${result.solutionsAlgebrite[1]}))`,
    );
    expect(evaluate(`simplify(abs(${rootDifference}))`)).toBe("2");

    // Concrete controls: m=0 -> {-1,1}; m=2 -> {1,3}.
    const atZero = result.solutionsAlgebrite.map((root) =>
      evaluate(substituteExact(root, "m", "0")),
    );
    expect(atZero).toContain("-1");
    expect(atZero).toContain("1");

    const atTwo = result.solutionsAlgebrite.map((root) =>
      evaluate(substituteExact(root, "m", "2")),
    );
    expect(atTwo).toContain("1");
    expect(atTwo).toContain("3");
  });
});
