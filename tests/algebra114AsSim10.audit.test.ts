import { describe, expect, it } from "vitest";
import { extractDomainConditions } from "../src/engine/domainConditions";
import { parseExpression } from "../src/engine/parsing";
import { evaluate } from "../src/engine/algebriteClient";
import { compileNumeric } from "../src/engine/numericFallback";
import source from "../qa/certification/algebra114_source.md?raw";

describe("Algebra114 AS-SIM-10 nested rational identity", () => {
  it("preserves x!=0, y!=0, x!=y while verifying source values", () => {
    expect(source).toContain("AS-SIM-10 | N3");
    const expression = "(1/x-1/y)/(x-y)";
    const parsed = parseExpression(expression).algebrite;
    const conditions = extractDomainConditions(expression);
    expect(conditions.filter(c => c.kind === "denominator").length).toBeGreaterThanOrEqual(3);
    for (const [x,y] of [[2,3],[-2,3],[3,-2],[-4,-1],[1,5]]) {
      const input = parsed.replace(/x/g, "(" + x + ")").replace(/y/g, "(" + y + ")");
      const observed = compileNumeric(evaluate(input), "__no_var__")(0);
      expect(observed).toBeCloseTo(-1/(x*y), 9);
    }
  });
});
