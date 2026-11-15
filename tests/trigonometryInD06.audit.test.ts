import { describe, expect, it } from "vitest";
import { gunzipSync } from "node:zlib";
import { readFileSync } from "node:fs";
import { parseExpression } from "../src/engine/parsing";
import { solveInequality } from "../src/engine/inequality";

const EXPECTED = "(2*k*pi, pi/2 + 2*k*pi) U (pi + 2*k*pi, 3*pi/2 + 2*k*pi), k entero";
describe("TRIG-IN-D-06 sine cosine product", () => {
  it("freezes the original source row", () => {
    const source = gunzipSync(readFileSync(new URL("../qa/certification/legacy_sources/ejercicios_trigonometria.md.gz", import.meta.url))).toString("utf8");
    const row = source.split(/\r?\n/).find(line => line.includes("| IN-D-06 |"));
    expect(row?.split("|").map(s => s.trim().replace(/^`|`$/g, "")).filter(Boolean)).toEqual(["IN-D-06", String.raw`\sin x\cos x>0,\quad x\in[0,2\pi)`, String.raw`\left(0,\frac{\pi}{2}\right)\cup\left(\pi,\frac{3\pi}{2}\right)`]);
  });
  it.each(["sin(x)*cos(x)>0", "0<sin(x)*cos(x)", String.raw`\sin x\cos x>0`])("returns both periodic open intervals for %s", input => {
    const p = parseExpression(input, "RAD");
    const result = solveInequality(p.algebrite, p.inequalityOperator!, "x");
    expect(result.resultText).toBe(EXPECTED);
    expect(result.steps.at(-1)?.latex).toBe(String.raw`\left(2k\pi,\frac{\pi}{2}+2k\pi\right)\cup\left(\pi+2k\pi,\frac{3\pi}{2}+2k\pi\right),\quad k\in\mathbb{Z}`);
  });
  it("checks roots and alternating signs independently", () => {
    for (const x of [0, Math.PI/2, Math.PI, 3*Math.PI/2, 2*Math.PI]) expect(Math.sin(x)*Math.cos(x)).toBeCloseTo(0, 14);
    for (const [x, sign] of [[Math.PI/4, true], [3*Math.PI/4, false], [5*Math.PI/4, true], [7*Math.PI/4, false]] as const) expect(Math.sin(x)*Math.cos(x)>0).toBe(sign);
  });
  it("keeps other comparisons on the existing path", () => {
    for (const input of ["sin(x)*cos(x)>=0", "sin(x)*cos(x)<0", "sin(2*x)*cos(x)>0", "sin(x)*cos(x)>1"]) {
      const p = parseExpression(input, "RAD");
      try { expect(solveInequality(p.algebrite, p.inequalityOperator!, "x").steps.some(s => s.id === "sine-cosine-periodic-result")).toBe(false); }
      catch (error) { expect((error as {code:string}).code).toBe("UNSUPPORTED_OPERATION"); }
    }
  });
});
