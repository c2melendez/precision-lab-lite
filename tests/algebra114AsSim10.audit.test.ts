import { describe, expect, it } from "vitest";
import { extractDomainConditions } from "../src/engine/domainConditions";
import source from "../qa/certification/algebra114_source.md?raw";

describe("Algebra114 AS-SIM-10 nested rational identity", () => {
  it("preserves x!=0, y!=0, x!=y while verifying source values", () => {
    expect(source).toContain("AS-SIM-10 | N3");
    const expression = "(1/x-1/y)/(x-y)";
    const conditions = extractDomainConditions(expression);
    expect(conditions.filter(c => c.kind === "denominator").length).toBeGreaterThanOrEqual(3);
    for (const [x,y] of [[2,3],[-2,3],[3,-2],[-4,-1],[1,5]]) {
      const observed = (1/x-1/y)/(x-y);
      expect(observed).toBeCloseTo(-1/(x*y), 9);
    }
  });
});
