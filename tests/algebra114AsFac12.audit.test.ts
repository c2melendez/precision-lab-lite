import { describe, expect, it } from "vitest";
import { evaluate } from "../src/engine/algebriteClient";
import { compileNumeric } from "../src/engine/numericFallback";
import source from "../qa/certification/algebra114_source.md?raw";

describe("Algebra114 AS-FAC-12 alternating three-variable identity", () => {
  it("matches the exact source row, returns three linear factors, and preserves the independent sign oracle", () => {
    expect(source).toContain("| AS-FAC-12 | N3 | \\(x^{2}(y-z)+y^{2}(z-x)+z^{2}(x-y)\\) | \\((x-y)(x-z)(y-z)\\) |");

    const original = "x^2*(y-z)+y^2*(z-x)+z^2*(x-y)";
    const factored = evaluate("factor(" + original + ")");
    expect(factored).not.toContain("factor(");

    const compact = factored.replace(/\s+/g, "");
    expect(compact.match(/\*/g)?.length ?? 0).toBeGreaterThanOrEqual(2);
    expect(compact).toContain("x");
    expect(compact).toContain("y");
    expect(compact).toContain("z");
    expect(compact).not.toContain("x^2");
    expect(compact).not.toContain("y^2");
    expect(compact).not.toContain("z^2");

    const values = [-3, -1, 0, 1, 2, 4];
    for (const x of values) {
      for (const y of values) {
        for (const z of values) {
          const substituted = factored
            .replace(/\bx\b/g, "(" + x + ")")
            .replace(/\by\b/g, "(" + y + ")")
            .replace(/\bz\b/g, "(" + z + ")");
          const actual = compileNumeric(evaluate(substituted), "__no_var__")(0);
          const expected = (x - y) * (x - z) * (y - z);
          expect(actual).toBeCloseTo(expected, 9);
        }
      }
    }
  });
});
