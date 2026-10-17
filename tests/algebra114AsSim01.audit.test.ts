import { describe, expect, it } from "vitest";
import { parseExpression } from "../src/engine/parsing";
import { evaluate } from "../src/engine/algebriteClient";
import fixture from "../qa/certification/algebra114_source.md?raw";

describe("Algebra114 AS-SIM-01 exact symbolic witness", () => {
  it("retains the original source and proves equality at distinct substitutions", () => {
    expect(fixture).toContain("| AS-SIM-01 | N1 | \\(3x+2y-x+5y\\) | \\(2x+7y\\) |");
    const actual = parseExpression("3x+2y-x+5y").algebrite;
    const oracle = parseExpression("2x+7y").algebrite;
    for (const [x, y] of [[2, 3], [-5, 7], [0, -4], [11, 0]]) {
      const substitute = (source: string) => source
        .replace(/\\bx\\b/g, `(${x})`)
        .replace(/\\by\\b/g, `(${y})`);
      expect(Number(evaluate(substitute(actual)))).toBeCloseTo(Number(evaluate(substitute(oracle))), 9);
    }
  });
});
