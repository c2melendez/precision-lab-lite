import { describe, expect, it } from "vitest";
import { evaluate } from "../src/engine/algebriteClient";
import { compileNumeric } from "../src/engine/numericFallback";
import source from "../qa/certification/algebra114_source.md?raw";

describe("Algebra114 AS-RAT-06 variable radical conjugate", () => {
  it("matches the exact source row, preserves its stated domain, and checks the conjugate with an independent oracle", () => {
    expect(source).toContain("| AS-RAT-06 | N2 | \\(\\frac{\\sqrt{x+h}-\\sqrt{x}}{h}\\) | \\(\\frac{1}{\\sqrt{x+h}+\\sqrt{x}}\\), con \\(x>0\\), \\(h>-x\\), \\(h\\neq0\\) |");

    const original = "(sqrt(x+h)-sqrt(x))/h";
    const actual = evaluate(original);
    expect(actual.replace(/\s+/g, "")).toBe("1/(sqrt(x+h)+sqrt(x))");

    const samples = [[1, 1], [4, 0.5], [9, -2], [0.25, 2], [16, -3], [0.5, -0.25], [25, 5]];
    for (const [x, h] of samples) {
      expect(x).toBeGreaterThan(0);
      expect(h).toBeGreaterThan(-x);
      expect(h).not.toBe(0);

      const substituted = actual
        .replace(/\bx\b/g, "(" + x + ")")
        .replace(/\bh\b/g, "(" + h + ")");
      const value = compileNumeric(substituted, "__no_var__")(0);

      // Math.sqrt supplies an oracle independent from the symbolic CAS.
      const rootXH = Math.sqrt(x + h);
      const rootX = Math.sqrt(x);
      const originalValue = (rootXH - rootX) / h;
      const conjugateValue = 1 / (rootXH + rootX);
      expect(value).toBeGreaterThan(0);
      expect(value).toBeCloseTo(conjugateValue, 11);
      expect(conjugateValue).toBeCloseTo(originalValue, 10);
    }
  });
});
