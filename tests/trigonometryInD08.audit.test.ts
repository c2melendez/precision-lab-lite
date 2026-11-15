import { describe, expect, it } from "vitest";
import { gunzipSync } from "node:zlib";
import { readFileSync } from "node:fs";
import { parseExpression } from "../src/engine/parsing";
import { solveInequality } from "../src/engine/inequality";

const EXPECTED = "k*pi < x <= pi/4 + k*pi, k entero";
describe("TRIG-IN-D-08 inclusive cotangent branch", () => {
  it("anchors all source cells", () => {
    const source = gunzipSync(readFileSync(new URL("../qa/certification/legacy_sources/ejercicios_trigonometria.md.gz", import.meta.url))).toString("utf8");
    const row = source.split(/\r?\n/).find(line => line.includes("| IN-D-08 |"));
    expect(row?.split("|").map(s => s.trim().replace(/^`|`$/g, "")).filter(Boolean)).toEqual(["IN-D-08", String.raw`\cot x\ge 1,\quad x\in(0,\pi)`, String.raw`\left(0,\frac{\pi}{4}\right]`]);
  });

  it.each(["cot(x)>=1", "1<=cot(x)", String.raw`\cot x\ge 1`])("returns the inclusive periodic branch for %s", input => {
    const parsed = parseExpression(input, "RAD");
    expect(parsed.isInequality).toBe(true);
    const result = solveInequality(parsed.algebrite, parsed.inequalityOperator!, "x");
    expect(result.resultText).toBe(EXPECTED);
    expect(result.steps.at(-1)?.latex).toBe(String.raw`\left(k\pi,\frac{\pi}{4}+k\pi\right],\quad k\in\mathbb{Z}`);
  });

  it("checks equality, poles and signs independently", () => {
    for (const k of [-1, 0, 1]) expect(1 / Math.tan(Math.PI / 4 + k * Math.PI)).toBeCloseTo(1, 14);
    for (const x of [0, Math.PI]) expect(Math.sin(x)).toBeCloseTo(0, 14);
    for (const [x, expected] of [
      [Math.PI / 8, true],
      [Math.PI / 4, true],
      [Math.PI / 2, false],
      [3 * Math.PI / 4, false],
      [Math.PI / 4 + Math.PI, true],
    ] as const) {
      expect(1 / Math.tan(x) >= 1).toBe(expected);
    }
  });

  it("preserves fallback for the strict neighbor cot(x)>1", { timeout: 30000 }, () => {
    const parsed = parseExpression("cot(x)>1", "RAD");
    try {
      expect(solveInequality(parsed.algebrite, parsed.inequalityOperator!, "x").steps.some(step => step.id === "cotangent-one-periodic-result")).toBe(false);
    } catch (error) {
      expect((error as { code: string }).code).toBe("UNSUPPORTED_OPERATION");
    }
  });

  it.each(["cot(x)<=1", "cot(x)>=2", "cot(2*x)>=1", "cos(x)>=1"])("preserves fallback for %s", input => {
    const parsed = parseExpression(input, "RAD");
    try {
      expect(solveInequality(parsed.algebrite, parsed.inequalityOperator!, "x").steps.some(step => step.id === "cotangent-one-periodic-result")).toBe(false);
    } catch (error) {
      expect((error as { code: string }).code).toBe("UNSUPPORTED_OPERATION");
    }
  });
});
