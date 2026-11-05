import { describe, expect, it } from "vitest";
import { evaluate } from "../src/engine/algebriteClient";
import { compileNumeric } from "../src/engine/numericFallback";
import source from "../qa/certification/algebra114_source.md?raw";

describe("Algebra114 AS-RAT-10 original nested denominator conjugate", () => {
  it("matches the exact source row and checks original and rationalized forms with an independent Math.sqrt oracle", () => {
    const expectedRow = String.raw`| AS-RAT-10 | N3 | \(\frac{\sqrt{3}}{\sqrt{2}+\sqrt{3}}\) | \(3-\sqrt{6}\) |`;
    expect(source.replace(/\s+/g, " ")).toContain(expectedRow.replace(/\s+/g, " "));

    const original = "sqrt(3)/(sqrt(2)+sqrt(3))";
    const rationalized = evaluate(original);
    expect(rationalized.replace(/\s+/g, "")).toBe("3-sqrt(6)");

    const rootTwo = Math.sqrt(2);
    const rootThree = Math.sqrt(3);
    const rootSix = Math.sqrt(6);
    const originalExpected = rootThree / (rootTwo + rootThree);
    const rationalizedExpected = 3 - rootSix;
    expect(rationalizedExpected).toBeGreaterThan(0);
    expect(rationalizedExpected).toBeCloseTo(originalExpected, 12);
    expect(rationalizedExpected * (3 + rootSix)).toBeCloseTo(3, 12);

    const originalActual = compileNumeric(original, "__none__")(0);
    const rationalizedActual = compileNumeric(rationalized, "__none__")(0);
    expect(originalActual).toBeCloseTo(originalExpected, 12);
    expect(rationalizedActual).toBeCloseTo(originalExpected, 12);
    expect(rationalizedActual).toBeCloseTo(rationalizedExpected, 12);
  });
});
