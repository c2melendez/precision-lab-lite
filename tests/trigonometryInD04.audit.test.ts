import { describe, expect, it } from "vitest";
import { gunzipSync } from "node:zlib";
import { readFileSync } from "node:fs";
import { parseExpression } from "../src/engine/parsing";
import { solveInequality } from "../src/engine/inequality";

const EXPECTED = "[2*k*pi, pi/2 + 2*k*pi) U (pi/2 + 2*k*pi, 7*pi/6 + 2*k*pi) U (11*pi/6 + 2*k*pi, 2*pi + 2*k*pi), k entero";
const LATEX = String.raw`\left[2k\pi,\frac{\pi}{2}+2k\pi\right)\cup\left(\frac{\pi}{2}+2k\pi,\frac{7\pi}{6}+2k\pi\right)\cup\left(\frac{11\pi}{6}+2k\pi,2\pi+2k\pi\right),\quad k\in\mathbb{Z}`;

describe("TRIG-IN-D-04: quadratic sine inequality on [0,2*pi)", () => {
  it("anchors all original cells and the three-component source topology", () => {
    const source = gunzipSync(readFileSync(new URL("../qa/certification/legacy_sources/ejercicios_trigonometria.md.gz", import.meta.url))).toString("utf8");
    const row = source.split(/\r?\n/).find(line => line.includes("| IN-D-04 |"));
    expect(row?.split("|").map(s => s.trim().replace(/^`|`$/g, "")).filter(Boolean)).toEqual([
      "IN-D-04", String.raw`2\sin^{2}x-\sin x-1<0,\quad x\in[0,2\pi)`,
      String.raw`\left[0,\frac{\pi}{2}\right)\cup\left(\frac{\pi}{2},\frac{7\pi}{6}\right)\cup\left(\frac{11\pi}{6},2\pi\right)`,
    ]);
  });

  it.each(["2*sin(x)^2-sin(x)-1<0", String.raw`2\sin^{2}x-\sin x-1<0`, "0>2*sin(x)^2-sin(x)-1"])("returns exact periodic intervals with the hole at pi/2: %s", input => {
    const p = parseExpression(input, "RAD");
    const result = solveInequality(p.algebrite, p.inequalityOperator!, "x");
    expect(result.resultText).toBe(EXPECTED);
    expect(result.steps.at(-1)?.latex).toBe(LATEX);
  });

  it("checks signs, factorization and all boundary values independently", () => {
    for (const k of [-1, 0, 1]) {
      for (const x of [0, Math.PI/4, Math.PI/2-0.01, Math.PI/2+0.01, Math.PI,
                       7*Math.PI/6-0.01, 7*Math.PI/6+0.01, 3*Math.PI/2,
                       11*Math.PI/6-0.01, 11*Math.PI/6+0.01, 2*Math.PI-0.01]) {
        const y = Math.sin(x + 2*k*Math.PI);
        const expected = x < Math.PI/2 || (x > Math.PI/2 && x < 7*Math.PI/6) || x > 11*Math.PI/6;
        expect(2*y*y-y-1 < 0).toBe(expected);
        expect(2*y*y-y-1).toBeCloseTo((2*y+1)*(y-1), 13);
      }
    }
    for (const x of [Math.PI/2, 7*Math.PI/6, 11*Math.PI/6]) {
      const y = Math.sin(x);
      expect(Math.abs(2*y*y-y-1)).toBeLessThan(1e-14);
    }
    expect(2*Math.sin(0)**2-Math.sin(0)-1).toBe(-1);
  });

  it("preserves fallback for different polynomial, threshold or comparison", () => {
    for (const input of ["2*sin(x)^2-sin(x)-1<=0", "2*sin(x)^2-sin(x)-1>0", "2*sin(x)^2-sin(x)-2<0", "2*cos(x)^2-cos(x)-1<0"]) {
      const p = parseExpression(input, "RAD");
      try {
        const result = solveInequality(p.algebrite, p.inequalityOperator!, "x");
        expect(result.steps.some(s => s.id === "quadratic-sine-periodic-result")).toBe(false);
      } catch (error) {
        expect((error as { code: string }).code).toBe("UNSUPPORTED_OPERATION");
      }
    }
  });
});
