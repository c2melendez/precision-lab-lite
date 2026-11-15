import { describe, expect, it } from "vitest";
import { gunzipSync } from "node:zlib";
import { readFileSync } from "node:fs";
import { parseExpression } from "../src/engine/parsing";
import { solveInequality } from "../src/engine/inequality";

const EXPECTED = "(-pi/2 + 2*k*pi, -pi/3 + 2*k*pi) U (pi/3 + 2*k*pi, pi/2 + 2*k*pi), k entero";
describe("TRIG-IN-D-07 strict secant branch", () => {
  it("anchors all source cells", () => {
    const source = gunzipSync(readFileSync(new URL("../qa/certification/legacy_sources/ejercicios_trigonometria.md.gz", import.meta.url))).toString("utf8");
    const row = source.split(/\r?\n/).find(line => line.includes("| IN-D-07 |"));
    expect(row?.split("|").map(s=>s.trim().replace(/^`|`$/g, "")).filter(Boolean)).toEqual(["IN-D-07", String.raw`\sec x>2,\quad x\in\left(-\frac{\pi}{2},\frac{\pi}{2}\right)`, String.raw`\left(-\frac{\pi}{2},-\frac{\pi}{3}\right)\cup\left(\frac{\pi}{3},\frac{\pi}{2}\right)`]);
  });
  it.each(["sec(x)>2", "2<sec(x)", String.raw`\sec x>2`])("returns both open intervals for %s", input => {
    const p = parseExpression(input, "RAD");
    const result = solveInequality(p.algebrite, p.inequalityOperator!, "x");
    expect(result.resultText).toBe(EXPECTED);
    expect(result.steps.at(-1)?.latex).toBe(String.raw`\left(-\frac{\pi}{2}+2k\pi,-\frac{\pi}{3}+2k\pi\right)\cup\left(\frac{\pi}{3}+2k\pi,\frac{\pi}{2}+2k\pi\right),\quad k\in\mathbb{Z}`);
  });
  it("checks equality, poles and signs independently", () => {
    for (const x of [-Math.PI/3, Math.PI/3]) expect(1/Math.cos(x)).toBeCloseTo(2, 14);
    for (const x of [-Math.PI/2, Math.PI/2]) expect(Math.cos(x)).toBeCloseTo(0, 14);
    for (const [x, expected] of [[-5*Math.PI/12,true],[0,false],[5*Math.PI/12,true]] as const) expect(1/Math.cos(x)>2).toBe(expected);
  });
  it("preserves fallback for other comparisons", () => {
    for (const input of ["sec(x)>=2", "sec(x)<2", "sec(x)>3", "sec(2*x)>2", "cos(x)>2"]) {
      const p = parseExpression(input, "RAD");
      try { expect(solveInequality(p.algebrite, p.inequalityOperator!, "x").steps.some(s=>s.id === "secant-two-periodic-result")).toBe(false); }
      catch (error) { expect((error as {code:string}).code).toBe("UNSUPPORTED_OPERATION"); }
    }
  });
});
