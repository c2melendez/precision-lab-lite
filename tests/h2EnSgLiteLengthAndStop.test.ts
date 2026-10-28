/**
 * H2 EN-SG Lite R326 — EN-SG-21 length contract + EN-SG-28 scope.
 * 21: reject oversize input before CAS (<2s), aligned with Plus max_length=500.
 * 28: OUT_OF_SCOPE — no user stop/recovery UI; safety is preemptive bounds only.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { evaluate } from "../src/engine/algebriteClient";
import { MAX_EXPRESSION_LENGTH } from "../src/engine/expressionLengthGuard";
import { ErrorCode } from "../src/types";

const BUDGET_MS = 2000;

describe("H2 EN-SG Lite length contract EN-SG-21 (R326)", () => {
  it("exports MAX_EXPRESSION_LENGTH aligned with Plus (500)", () => {
    expect(MAX_EXPRESSION_LENGTH).toBe(500);
  });

  it("EN-SG-21: oversize expression rejects under time budget", () => {
    const oversize = "1+" + "1+".repeat(300) + "1";
    expect(oversize.length).toBeGreaterThan(MAX_EXPRESSION_LENGTH);
    const t0 = performance.now();
    let caught: unknown;
    try {
      evaluate(oversize);
    } catch (e) {
      caught = e;
    }
    const elapsed = performance.now() - t0;
    expect(caught).toMatchObject({ code: ErrorCode.COMPLEXITY_LIMIT });
    expect(elapsed).toBeLessThan(BUDGET_MS);
  });

  it("EN-SG-21 regression: certified short expressions still evaluate", () => {
    expect(evaluate("2+2")).toMatch(/4/);
    expect(evaluate("factorial(5)")).toMatch(/120/);
  });

  it("algebriteClient wires assertExpressionLength", () => {
    const code = readFileSync(
      resolve(process.cwd(), "src/engine/algebriteClient.ts"),
      "utf8",
    );
    expect(code).toMatch(/assertExpressionLength/);
  });
});

describe("H2 EN-SG Lite EN-SG-28 scope (R326)", () => {
  it("documents OUT_OF_SCOPE: no UI stop control in product sources", () => {
    const files = [
      "src/components/NaturalInput.tsx",
      "src/components/ResultPanel.tsx",
      "src/components/Screen.tsx",
    ];
    for (const rel of files) {
      const code = readFileSync(resolve(process.cwd(), rel), "utf8");
      expect(code, rel).not.toMatch(/onCancelEvaluation|abortController|stopCalculation/i);
    }
  });
});
