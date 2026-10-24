import { describe, expect, it } from "vitest";
import { parseExpression } from "../src/engine/parsing";
import { evaluate } from "../src/engine/algebriteClient";
import { compileNumeric } from "../src/engine/numericFallback";
import { extractDomainConditions } from "../src/engine/domainConditions";
import source from "../qa/certification/algebra114_source.md?raw";

describe("Algebra114 AS-SIM-09 opposite fraction", () => {
  it("returns -1 at allowed inputs but preserves x != 1", () => {
    expect(source).toContain("AS-SIM-09 | N3");
    const expr = parseExpression("(x-1)/(1-x)").algebrite;
    const conditions = extractDomainConditions(expr);
    expect(conditions.some(c => c.kind === "denominator" && c.variable === "x" && c.operator === "!=")).toBe(true);
    for (const x of [-4, 0, 2, 10]) {
      const output = evaluate(expr.replace(/x/g, "(" + x + ")"));
      expect(compileNumeric(output, "__no_var__")(0)).toBeCloseTo(-1, 9);
    }
    expect(1 - 1).toBe(0);
  });
});
