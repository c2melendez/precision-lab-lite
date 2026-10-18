import { describe, expect, it } from "vitest";
import { parseExpression } from "../src/engine/parsing";
import { evaluate } from "../src/engine/algebriteClient";
import { extractDomainConditions } from "../src/engine/domainConditions";
import source from "../qa/certification/algebra114_source.md?raw";

describe("Algebra114 AS-SIM-06 rational cancellation and domain", () => {
  it("keeps x != 2 and matches (x+2)/(x-2) away from the hole", () => {
    expect(source).toContain("AS-SIM-06 | N2");
    const input = parseExpression("(x^2-4)/(x^2-4*x+4)").algebrite;
    const conditions = extractDomainConditions(input);
    expect(conditions.some(c => c.kind === "denominator" && c.operator === "!=" && c.variable === "x")).toBe(true);
    for (const x of [-3, 0, 1, 3, 7]) {
      const value = Number(evaluate(input.replace(/x/g, "(" + x + ")")));
      expect(value).toBeCloseTo((x + 2) / (x - 2), 9);
    }
    expect((2 * 2 - 4 * 2 + 4)).toBe(0);
  });
});
