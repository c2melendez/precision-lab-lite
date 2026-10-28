/**
 * H2 EN-SG Lite engine bounds R324 — EN-SG-23..27 client CAS guards.
 * Timed rejections before Algebrite does unbounded work.
 * Restored algebriteClient.ts on SHA db2202be (MAX_LITERAL_FACTORIAL=1000).
 */
import { describe, expect, it } from "vitest";
import { evaluate } from "../src/engine/algebriteClient";
import { ErrorCode } from "../src/types";

function expectComplexityFast(expr: string, budgetMs = 2000): void {
  const started = performance.now();
  let caught: unknown;
  try {
    evaluate(expr);
  } catch (error) {
    caught = error;
  }
  const elapsed = performance.now() - started;
  expect(caught, `expected COMPLEXITY_LIMIT for ${JSON.stringify(expr)}, got ${JSON.stringify(caught)}`).toMatchObject({
    code: ErrorCode.COMPLEXITY_LIMIT,
  });
  expect(elapsed).toBeLessThan(budgetMs);
}

describe("H2 EN-SG Lite engine bounds (R324)", () => {
  it("EN-SG-23: nested astronomical power rejects before CAS", () => {
    // SY-X-10: 2^(2^20) exceeds nested magnitude bound
    expectComplexityFast("2^(2^20)");
    expectComplexityFast("2^(2^16)");
  });

  it("EN-SG-24: oversized integer exponent rejects before CAS", () => {
    // SY-X-09: absolute exponent > 10000
    expectComplexityFast("2^100000");
    expectComplexityFast("3^(100001)");
  });

  it("EN-SG-25: literal factorial above 1000 rejects before CAS", () => {
    expectComplexityFast("1000000!");
    expectComplexityFast("factorial(1000000)");
    expectComplexityFast("factorial(1001)");
    expectComplexityFast("(5000)!");
  });

  it("EN-SG-25 regression: certified small factorials still evaluate", () => {
    // Prefer functional form; Algebrite postfix ! is less reliable across builds.
    expect(evaluate("factorial(5)")).toMatch(/120/);
    expect(evaluate("factorial(10)")).toMatch(/3628800/);
  });

  it("EN-SG-26: large literal exponent on polynomial base is rejected", () => {
    expectComplexityFast("(x+1)^100000");
  });

  it("EN-SG-27: nested power tower rejects when magnitude exceeds bound", () => {
    // 10^6 nested under a base-2 power exceeds the 10000 magnitude gate
    expectComplexityFast("2^(10^6)");
    expectComplexityFast("2^(10^5)");
  });

  it("negative factorial remains DOMAIN_ERROR (not complexity)", () => {
    let caught: unknown;
    try {
      evaluate("factorial(-3)");
    } catch (error) {
      caught = error;
    }
    expect(caught).toMatchObject({ code: ErrorCode.DOMAIN_ERROR });
  });
});
