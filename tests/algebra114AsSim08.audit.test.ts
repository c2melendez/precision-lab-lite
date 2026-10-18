import { describe, expect, it } from "vitest";
import { parseExpression } from "../src/engine/parsing";
import { evaluate } from "../src/engine/algebriteClient";
import { compileNumeric } from "../src/engine/numericFallback";
import { extractDomainConditions } from "../src/engine/domainConditions";
import source from "../qa/certification/algebra114_source.md?raw";

describe("Algebra114 AS-SIM-08 real radical cube", () => {
  it("preserves original x >= 0 domain and sqrt(x^3)=x*sqrt(x)", () => {
    expect(source).toContain("AS-SIM-08 | N2");
    const parsed = parseExpression("sqrt(x^3)").algebrite;
    const restrictions = extractDomainConditions(parsed);
    expect(restrictions.some(c => c.kind === "sqrt" || c.kind === "root")).toBe(true);
    for (const x of [0, 1, 2, 9, 16]) {
      const raw = evaluate(parsed.replace(/x/g, "(" + x + ")"));
      const value = compileNumeric(raw, "__no_var__")(0);
      expect(value).toBeCloseTo(x * Math.sqrt(x), 9);
    }
  });
});
