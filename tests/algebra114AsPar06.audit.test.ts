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

describe("Algebra114 AS-PAR-06 original square-root equation sqrt(x) = a over R", () => {
  it("keeps the official conditional contract and source fixture", () => {
    expect(source).toContain("| AS-PAR-06 | N3 |");
    expect(source).toContain("Si \\(a\\ge0\\), \\(x=a^{2}\\); si \\(a<0\\), sin solución real");
  });

  it.each([
    ["0", "0"],
    ["2", "4"],
    ["3", "9"],
  ])("returns x=a^2 and satisfies the original equation when a=%s", (a, expected) => {
    const result = solve(`sqrt(x)=${a}`);
    expect(result.solutionsAlgebrite).toHaveLength(1);
    const root = evaluate(`simplify(${result.solutionsAlgebrite[0]})`);
    expect(root).toBe(expected);
    expect(evaluate(`simplify(sqrt(${root})-(${a}))`)).toBe("0");
  });

  it.each(["-1", "-2"])("does not invent a real root when a=%s is negative", (a) => {
    expect(() => solve(`sqrt(x)=(${a})`)).toThrow();
  });
});
