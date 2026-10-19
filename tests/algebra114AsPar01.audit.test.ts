import { describe, expect, it } from "vitest";
import { evaluate } from "../src/engine/algebriteClient";
import { parseExpression } from "../src/engine/parsing";
import { solveAlgebra } from "../src/engine/stepEngine/algebra";
import source from "../qa/certification/algebra114_source.md?raw";

describe("Algebra114 AS-PAR-01 original parameter equation ax = b", () => {
  it("solves the generic case and preserves identity/contradiction degeneracies", () => {
    expect(source).toContain("| AS-PAR-01 | N2 |");

    const generic = parseExpression("a*x=b");
    expect(generic.isEquation).toBe(true);
    const symbolic = solveAlgebra(generic.leftAlgebrite, generic.rightAlgebrite, "x");
    expect(symbolic.solutionsAlgebrite).toHaveLength(1);

    // The returned symbolic root must satisfy a*x-b = 0 identically.
    const root = symbolic.solutionsAlgebrite[0];
    expect(evaluate(`simplify(a*(${root})-b)`)).toBe("0");

    // Concrete non-degenerate case: 2x = 6 -> x = 3.
    const numeric = parseExpression("2*x=6");
    const numericResult = solveAlgebra(numeric.leftAlgebrite, numeric.rightAlgebrite, "x");
    expect(numericResult.solutionsAlgebrite).toContain("3");

    // a = 0, b = 0: every x satisfies the equation (identity).
    const identity = parseExpression("0*x=0");
    const identityResult = solveAlgebra(identity.leftAlgebrite, identity.rightAlgebrite, "x");
    expect(identityResult.truth).toBe("identity");
    expect(identityResult.solutionsAlgebrite).toEqual([]);

    // a = 0, b != 0: no x satisfies the equation (contradiction).
    const contradiction = parseExpression("0*x=5");
    const contradictionResult = solveAlgebra(
      contradiction.leftAlgebrite,
      contradiction.rightAlgebrite,
      "x",
    );
    expect(contradictionResult.truth).toBe("contradiction");
    expect(contradictionResult.solutionsAlgebrite).toEqual([]);
  });
});
