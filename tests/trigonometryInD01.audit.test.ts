import { describe, expect, it } from "vitest";
import { gunzipSync } from "node:zlib";
import { readFileSync } from "node:fs";
import { parseExpression } from "../src/engine/parsing";
import { solveInequality } from "../src/engine/inequality";
import { evaluate } from "../src/engine/algebriteClient";

describe("TRIG-IN-D-01: sin(x)>1/2 in [0,2*pi)", () => {
  it("anchors all three frozen source cells", () => {
    const source = gunzipSync(readFileSync(new URL("../qa/certification/legacy_sources/ejercicios_trigonometria.md.gz", import.meta.url))).toString("utf8");
    const row = source.split(/\r?\n/).find(line => line.includes("| IN-D-01 |"));
    expect(row?.split("|").map(s => s.trim().replace(/^`|`$/g, "")).filter(Boolean)).toEqual([
      "IN-D-01", String.raw`\sin x>\frac{1}{2},\quad x\in[0,2\pi)`,
      String.raw`\left(\frac{\pi}{6},\frac{5\pi}{6}\right)`,
    ]);
  });

  it("returns exact open endpoints and explicitly retains all periodic branches", () => {
    // The engine solves the inequality over R; the frozen row is its k=0 period.
    // Keep k in the product output so it cannot be read as a global bounded set.
    const parsed = parseExpression("sin(x)>1/2", "RAD");
    expect(parsed.isInequality).toBe(true);
    const result = solveInequality(parsed.algebrite, parsed.inequalityOperator!, "x");
    expect(result.resultText).toBe("pi/6 + 2*k*pi < x < 5*pi/6 + 2*k*pi, k entero");
    expect(result.steps.at(-1)?.latex).toBe(String.raw`\frac{\pi}{6}+2k\pi < x < \frac{5\pi}{6}+2k\pi,\quad k\in\mathbb{Z}`);
  });

  it("accepts the source LaTeX inequality without absorbing its right side into sine", () => {
    const parsed = parseExpression(String.raw`\sin x>\frac{1}{2}`, "RAD");
    expect(parsed.isInequality).toBe(true);
    expect(parsed.leftAlgebrite).toBe("sin(x)");
    expect(evaluate(parsed.rightAlgebrite)).toBe("1/2");
    expect(solveInequality(parsed.algebrite, parsed.inequalityOperator!, "x").resultText)
      .toBe("pi/6 + 2*k*pi < x < 5*pi/6 + 2*k*pi, k entero");
  });

  it.each([
    [String.raw`\sin x<\frac{1}{2}`, "<"],
    [String.raw`\sin x\le\frac{1}{2}`, "<="],
    [String.raw`\sin x\geq\frac{1}{2}`, ">="],
    [String.raw`\sin x≤\frac{1}{2}`, "<="],
    [String.raw`\sin x≥\frac{1}{2}`, ">="],
  ])("keeps the comparison outside an unparenthesized function: %s", (input, op) => {
    const parsed = parseExpression(input, "RAD");
    expect(parsed.isInequality).toBe(true);
    expect(parsed.inequalityOperator).toBe(op);
    expect(parsed.leftAlgebrite).toBe("sin(x)");
    expect(evaluate(parsed.rightAlgebrite)).toBe("1/2");
  });

  it("checks open boundaries, each complementary arc, and adjacent periods independently", () => {
    const lower = Math.PI / 6, upper = 5 * Math.PI / 6;
    expect(Math.sin(lower)).toBeCloseTo(0.5, 14);
    expect(Math.sin(upper)).toBeCloseTo(0.5, 14);
    for (const k of [-1, 0, 1]) {
      for (const x of [0, lower - 0.01, lower + 0.01, Math.PI / 2, upper - 0.01, upper + 0.01, Math.PI, 2 * Math.PI - 0.01]) {
        const shifted = x + 2 * k * Math.PI;
        expect(Math.sin(shifted) > 0.5).toBe(x > lower && x < upper);
      }
    }
  });

  it("does not apply the frozen sine result to different inequalities", () => {
    for (const input of ["sin(x)>1/3", "sin(x)^2>1/2", "sin(x)<1/2", "sin(x+1)>1/2"]) {
      const parsed = parseExpression(input, "RAD");
      try {
        const result = solveInequality(parsed.algebrite, parsed.inequalityOperator!, "x");
        expect(result.steps.some(step => step.id === "sine-half-periodic-result")).toBe(false);
      } catch (error) {
        expect((error as { code: string }).code).toBe("UNSUPPORTED_OPERATION");
      }
    }
  });
});
