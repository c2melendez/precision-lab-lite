import { describe, expect, it } from "vitest";
import { parseExpression } from "../src/engine/parsing";
import { evaluate } from "../src/engine/algebriteClient";
import { compileNumeric } from "../src/engine/numericFallback";
import { extractDomainConditions } from "../src/engine/domainConditions";
import source from "../qa/certification/algebra114_source.md?raw";

describe("Algebra114 AS-SIM-05 cancellation preserves excluded point", () => {
  it("simplifies to x+1 while retaining the original restriction x != 1", () => {
    expect(source).toContain("| AS-SIM-05 | N2 | \\({x^{2}-1}\\over{x-1}\\) | \\(x+1\\), con \\(x\\neq1\\) |");

    const input = parseExpression("(x^2-1)/(x-1)").algebrite;
    const conditions = extractDomainConditions(input);
    expect(conditions.some(
      c => c.kind === "denominator" &&
        c.operator === "!=" &&
        c.comparisonAlgebrite === "0" &&
        c.expressionAlgebrite === "x-1" &&
        c.variable === "x",
    )).toBe(true);

    const simplified = evaluate(input);
    for (const x of [-4, -1, 0, 2, 5]) {
      const substituted = simplified.replace(/x/g, "(" + x + ")");
      const actual = compileNumeric(evaluate(substituted), "__no_var__")(0);
      expect(actual).toBeCloseTo(x + 1, 9);
    }

    // The cancelled point remains excluded in the source expression.
    expect(() => evaluate(input.replace(/x/g, "(1)"))).toThrow();
  });
});
