import { describe, expect, it } from "vitest";
import { evaluate } from "../src/engine/algebriteClient";
import source from "../qa/certification/algebra114_source.md?raw";

describe("Algebra114 AS-FAC-02 quadratic factoring", () => {
  it("factors original x^2+5x+6 and preserves (x+2)(x+3)", () => {
    expect(source).toContain("| AS-FAC-02 | N1 |");
    const result = evaluate("factor(x^2+5*x+6)");
    expect(result).not.toContain("factor(");
    for (const x of [-5,-3,-2,0,2,4]) {
      const observed = evaluate(result.replace(/x/g, "(" + x + ")"));
      const oracle = evaluate("(" + x + "+2)*(" + x + "+3)");
      expect(observed).toBe(oracle);
    }
  });
});
