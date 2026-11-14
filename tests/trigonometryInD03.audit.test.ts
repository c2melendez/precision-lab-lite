import { describe, expect, it } from "vitest";
import { gunzipSync } from "node:zlib";
import { readFileSync } from "node:fs";
import { parseExpression } from "../src/engine/parsing";
import { solveInequality } from "../src/engine/inequality";

describe("TRIG-IN-D-03: tan(x)<1 on (-pi/2,pi/2)", () => {
  it("anchors all three frozen cells, including the open branch domain", () => {
    const source = gunzipSync(readFileSync(new URL("../qa/certification/legacy_sources/ejercicios_trigonometria.md.gz", import.meta.url))).toString("utf8");
    const row = source.split(/\r?\n/).find(line => line.includes("| IN-D-03 |"));
    expect(row?.split("|").map(s => s.trim().replace(/^`|`$/g, "")).filter(Boolean)).toEqual([
      "IN-D-03", String.raw`\tan x<1,\quad x\in\left(-\frac{\pi}{2},\frac{\pi}{2}\right)`,
      String.raw`\left(-\frac{\pi}{2},\frac{\pi}{4}\right)`,
    ]);
  });

  it.each(["tan(x)<1", String.raw`\tan x<1`, "1>tan(x)"])("returns exact open intervals with period pi: %s", input => {
    const parsed = parseExpression(input, "RAD");
    const result = solveInequality(parsed.algebrite, parsed.inequalityOperator!, "x");
    expect(result.resultText).toBe("-pi/2 + k*pi < x < pi/4 + k*pi, k entero");
    expect(result.steps.at(-1)?.latex).toBe(String.raw`-\frac{\pi}{2}+k\pi < x < \frac{\pi}{4}+k\pi,\quad k\in\mathbb{Z}`);
  });

  it("covers negative arguments and the signs next to the pole and root independently", () => {
    const lower = -Math.PI / 2, root = Math.PI / 4, upper = Math.PI / 2;
    expect(Math.atan(1)).toBe(root);
    for (const k of [-1, 0, 1]) {
      for (const x of [lower + 0.01, -Math.PI / 4, 0, root - 0.01, root + 0.01, upper - 0.01]) {
        expect(Math.tan(x + k * Math.PI) < 1).toBe(x > lower && x < root);
      }
    }
  });

  it("keeps the fallback for non-matching inequalities", () => {
    for (const input of ["tan(x)<=1", "tan(x)<0", "tan(x)^2<1", "tan(2*x)<1", "atan(x)<1"]) {
      const p = parseExpression(input, "RAD");
      try {
        const result = solveInequality(p.algebrite, p.inequalityOperator!, "x");
        expect(result.steps.some(s => s.id === "tangent-one-periodic-result")).toBe(false);
      } catch (error) {
        expect((error as { code: string }).code).toBe("UNSUPPORTED_OPERATION");
      }
    }
  });
});
