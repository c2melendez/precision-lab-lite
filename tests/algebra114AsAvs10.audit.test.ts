import { describe, expect, it } from "vitest";
import { evaluate } from "../src/engine/algebriteClient";
import { parseExpression } from "../src/engine/parsing";
import { solveAlgebra } from "../src/engine/stepEngine/algebra";
import source from "../qa/certification/algebra114_source.md?raw";

// Scope: numeric c<4 and c>4 instances. The c=4 interval [1,5] and the symbolic
// parameter c are not implemented and must stay unsupported, never a finite answer.
function solve(c: string) {
  const parsed = parseExpression(`|x-1|+|x-5|=${c}`);
  return solveAlgebra(parsed.leftAlgebrite, parsed.rightAlgebrite, "x");
}

describe("Algebra114 AS-AVS-10 |x-1|+|x-5|=c over R", () => {
  it("matches the official row", () => {
    expect(source).toContain(
      "| AS-AVS-10 | N3 | \\(|x-1|+|x-5|=c\\) | Si \\(c<4\\), sin solución; si \\(c=4\\), \\(x\\in[1,5]\\); si \\(c>4\\), \\(x=3\\pm\\frac{c}{2}\\) |",
    );
  });

  it.each(["0", "3", "7/2"])("c=%s < 4 has no real solution", (c) => {
    const result = solve(c);
    expect(result.truth).toBe("contradiction");
    expect(result.solutionsAlgebrite).toHaveLength(0);
  });

  it.each(["6", "10", "9/2"])("c=%s > 4 gives x = 3 ± c/2", (c) => {
    const result = solve(c);
    expect(result.truth).toBeUndefined();
    const expected = [evaluate(`3-(${c})/2`), evaluate(`3+(${c})/2`)];
    expect(result.solutionsAlgebrite).toEqual(expected);
    for (const root of expected) {
      expect(evaluate(`abs((${root})-1)+abs((${root})-5)-(${c})`)).toBe("0");
    }
  });

  it("keeps the c=4 interval case explicitly unsupported", () => {
    expect(() => solve("4")).toThrow();
    try {
      solve("4");
    } catch (error) {
      expect((error as { code: string }).code).toBe("UNSUPPORTED_OPERATION");
    }
  });
});
