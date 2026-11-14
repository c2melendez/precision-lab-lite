import { describe, expect, it } from "vitest";
import { gunzipSync } from "node:zlib";
import { readFileSync } from "node:fs";
import { parseExpression } from "../src/engine/parsing";
import { solveInequality } from "../src/engine/inequality";

describe("TRIG-IN-D-02: cos(x)<=0 on [0,2*pi)", () => {
  it("anchors all three original source cells", () => {
    const source = gunzipSync(readFileSync(new URL("../qa/certification/legacy_sources/ejercicios_trigonometria.md.gz", import.meta.url))).toString("utf8");
    const row = source.split(/\r?\n/).find(line => line.includes("| IN-D-02 |"));
    expect(row?.split("|").map(s => s.trim().replace(/^`|`$/g, "")).filter(Boolean)).toEqual([
      "IN-D-02", String.raw`\cos x\le 0,\quad x\in[0,2\pi)`,
      String.raw`\left[\frac{\pi}{2},\frac{3\pi}{2}\right]`,
    ]);
  });

  it.each(["cos(x)<=0", String.raw`\cos x\le 0`])("returns exact closed periodic intervals for %s", input => {
    const parsed = parseExpression(input, "RAD");
    expect(parsed.isInequality).toBe(true);
    const result = solveInequality(parsed.algebrite, parsed.inequalityOperator!, "x");
    expect(result.resultText).toBe("pi/2 + 2*k*pi <= x <= 3*pi/2 + 2*k*pi, k entero");
    expect(result.steps.at(-1)?.latex).toBe(String.raw`\frac{\pi}{2}+2k\pi \le x \le \frac{3\pi}{2}+2k\pi,\quad k\in\mathbb{Z}`);
  });

  it("checks closed boundaries and signs on both complementary arcs independently", () => {
    const lower = Math.PI / 2, upper = 3 * Math.PI / 2;
    expect(Math.abs(Math.cos(lower))).toBeLessThan(1e-15);
    expect(Math.abs(Math.cos(upper))).toBeLessThan(1e-15);
    for (const k of [-1, 0, 1]) {
      for (const x of [0, lower - 0.01, lower + 0.01, Math.PI, upper - 0.01, upper + 0.01, 2 * Math.PI - 0.01]) {
        expect(Math.cos(x + 2 * k * Math.PI) <= 0).toBe(x >= lower && x <= upper);
      }
    }
  });

  it("preserves the fallback for different cosine inequalities", () => {
    for (const input of ["cos(x)>=0", "cos(x)<0", "cos(x)<=1/2", "cos(x)^2<=0", "cos(x+1)<=0"]) {
      const parsed = parseExpression(input, "RAD");
      try {
        const result = solveInequality(parsed.algebrite, parsed.inequalityOperator!, "x");
        expect(result.steps.some(step => step.id === "cosine-zero-periodic-result")).toBe(false);
      } catch (error) {
        expect((error as { code: string }).code).toBe("UNSUPPORTED_OPERATION");
      }
    }
  });
});
