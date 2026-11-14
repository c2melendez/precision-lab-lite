import { describe, expect, it } from "vitest";
import { gunzipSync } from "node:zlib";
import { readFileSync } from "node:fs";
import { parseExpression } from "../src/engine/parsing";
import { solveInequality } from "../src/engine/inequality";

const EXPECTED = "[pi/4 + 2*k*pi, 3*pi/4 + 2*k*pi] U [5*pi/4 + 2*k*pi, 7*pi/4 + 2*k*pi], k entero";
const LATEX = String.raw`\left[\frac{\pi}{4}+2k\pi,\frac{3\pi}{4}+2k\pi\right]\cup\left[\frac{5\pi}{4}+2k\pi,\frac{7\pi}{4}+2k\pi\right],\quad k\in\mathbb{Z}`;

describe("TRIG-IN-D-05: absolute sine inequality with four included endpoints", () => {
  it("anchors all three original source cells", () => {
    const source = gunzipSync(readFileSync(new URL("../qa/certification/legacy_sources/ejercicios_trigonometria.md.gz", import.meta.url))).toString("utf8");
    const row = source.split(/\r?\n/).find(line => line.includes("| IN-D-05 |"));
    expect(row?.split("|").map(s => s.trim().replace(/^`|`$/g, "")).filter(Boolean)).toEqual([
      "IN-D-05", String.raw`\lvert\sin x\rvert\ge\frac{\sqrt{2}}{2},\quad x\in[0,2\pi)`,
      String.raw`\left[\frac{\pi}{4},\frac{3\pi}{4}\right]\cup\left[\frac{5\pi}{4},\frac{7\pi}{4}\right]`,
    ]);
  });

  it.each(["abs(sin(x))>=sqrt(2)/2", String.raw`\lvert\sin x\rvert\ge\frac{\sqrt{2}}{2}`, "sqrt(2)/2<=abs(sin(x))"])("returns both exact closed periodic intervals: %s", input => {
    const p = parseExpression(input, "RAD");
    const result = solveInequality(p.algebrite, p.inequalityOperator!, "x");
    expect(result.resultText).toBe(EXPECTED);
    expect(result.steps.at(-1)?.latex).toBe(LATEX);
  });

  it("checks all four equality points and both sides of each boundary independently", () => {
    const threshold = Math.SQRT2/2;
    for (const root of [Math.PI/4, 3*Math.PI/4, 5*Math.PI/4, 7*Math.PI/4]) {
      expect(Math.abs(Math.sin(root))).toBeCloseTo(threshold, 14);
    }
    for (const k of [-1, 0, 1]) {
      for (const x of [0, Math.PI/4-0.01, Math.PI/4+0.01, Math.PI/2,
                       3*Math.PI/4-0.01, 3*Math.PI/4+0.01, Math.PI,
                       5*Math.PI/4-0.01, 5*Math.PI/4+0.01, 3*Math.PI/2,
                       7*Math.PI/4-0.01, 7*Math.PI/4+0.01, 2*Math.PI-0.01]) {
        const expected = (x > Math.PI/4 && x < 3*Math.PI/4) || (x > 5*Math.PI/4 && x < 7*Math.PI/4);
        expect(Math.abs(Math.sin(x+2*k*Math.PI)) >= threshold).toBe(expected);
      }
    }
  });

  it("preserves fallback for strict, reversed-sense, different-threshold or different-function inputs", () => {
    for (const input of ["abs(sin(x))>sqrt(2)/2", "abs(sin(x))<=sqrt(2)/2", "abs(sin(x))>=1/2", "abs(cos(x))>=sqrt(2)/2", "sin(x)>=sqrt(2)/2"]) {
      const p = parseExpression(input, "RAD");
      try {
        const result = solveInequality(p.algebrite, p.inequalityOperator!, "x");
        expect(result.steps.some(s => s.id === "absolute-sine-periodic-result")).toBe(false);
      } catch (error) {
        expect((error as { code: string }).code).toBe("UNSUPPORTED_OPERATION");
      }
    }
  });
});
