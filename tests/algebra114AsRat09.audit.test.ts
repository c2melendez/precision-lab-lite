import { describe, expect, it } from "vitest";
import { evaluate } from "../src/engine/algebriteClient";
import { compileNumeric } from "../src/engine/numericFallback";
import source from "../qa/certification/algebra114_source.md?raw";

describe("Algebra114 AS-RAT-09 variable radical denominator", () => {
  it("matches the exact source row and verifies both conjugate forms on the restricted real domain", () => {
    const expectedRow = String.raw`| AS-RAT-09 | N3 | \(\frac{1}{\sqrt{x}+\sqrt{y}}\) | \(\frac{\sqrt{x}-\sqrt{y}}{x-y}\), con \(x,y\ge0\), \(x\neq y\) |`;
    expect(source.replace(/\s+/g, " ")).toContain(expectedRow.replace(/\s+/g, " "));

    const original = "1/(sqrt(x)+sqrt(y))";
    const rationalized = evaluate(original);
    expect(rationalized.replace(/\s+/g, "")).toBe("(sqrt(x)-sqrt(y))/(x-y)");

    const cases: Array<[number, number]> = [
      [4, 1],
      [1, 4],
      [9, 0],
      [0, 16],
      [0.25, 2],
      [7.5, 3.25],
    ];

    for (const [x, y] of cases) {
      expect(x).toBeGreaterThanOrEqual(0);
      expect(y).toBeGreaterThanOrEqual(0);
      expect(x).not.toBe(y);

      const rootX = Math.sqrt(x);
      const rootY = Math.sqrt(y);
      const originalExpected = 1 / (rootX + rootY);
      const rationalizedExpected = (rootX - rootY) / (x - y);
      expect(rationalizedExpected).toBeCloseTo(originalExpected, 12);

      const originalAtPoint = original.replace(/x/g, `(${x})`).replace(/y/g, `(${y})`);
      const rationalizedAtPoint = rationalized.replace(/x/g, `(${x})`).replace(/y/g, `(${y})`);
      const originalActual = compileNumeric(originalAtPoint, "__none__")(0);
      const rationalizedActual = compileNumeric(rationalizedAtPoint, "__none__")(0);

      expect(originalActual).toBeCloseTo(originalExpected, 12);
      expect(rationalizedActual).toBeCloseTo(originalExpected, 12);
      expect(rationalizedActual).toBeCloseTo(rationalizedExpected, 12);
    }
  });
});
