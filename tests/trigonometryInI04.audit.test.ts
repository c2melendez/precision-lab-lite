import { describe, expect, it } from "vitest";
import { gunzipSync } from "node:zlib";
import { readFileSync } from "node:fs";
import { parseExpression } from "../src/engine/parsing";
import { solveInequality } from "../src/engine/inequality";

describe("TRIG-IN-I-04 scaled inverse tangent", () => {
  it("anchors source cells", () => {
    const source = gunzipSync(readFileSync(new URL("../qa/certification/legacy_sources/ejercicios_trigonometria.md.gz", import.meta.url))).toString("utf8");
    const row = source.split(/\r?\n/).find(line => line.includes("| IN-I-04 |"));
    expect(row?.split("|").map(s=>s.trim().replace(/^`|`$/g, "")).filter(Boolean)).toEqual(["IN-I-04", String.raw`\arctan(2x)\ge\frac{\pi}{4}`, String.raw`\left[\frac{1}{2},\infty\right)`]);
  });
  it.each(["arctan(2*x)>=pi/4", "pi/4<=arctan(2*x)", String.raw`\arctan(2x)\ge\frac{\pi}{4}`])("solves %s", input => {
    const p = parseExpression(input,"RAD");
    const result = solveInequality(p.algebrite,p.inequalityOperator!,"x");
    expect(result.resultText).toBe("x >= 1/2");
    expect(result.steps.at(-1)?.latex).toBe(String.raw`\left[\frac{1}{2},\infty\right)`);
  });
  it("checks equality and signs", () => {
    expect(Math.atan(2*0.5)).toBeCloseTo(Math.PI/4,14);
    expect(Math.atan(2*0.4)).toBeLessThan(Math.PI/4);
    expect(Math.atan(2*1)).toBeGreaterThan(Math.PI/4);
  });
  it("preserves fallback for neighboring comparisons", () => {
    for(const input of ["arctan(2*x)>pi/4", "arctan(2*x)>=pi/3", "arctan(3*x)>=pi/4", "tan(2*x)>=pi/4"]) {
      const p = parseExpression(input,"RAD");
      try { expect(solveInequality(p.algebrite,p.inequalityOperator!,"x").steps.some(s=>s.id === "arctangent-double-quarter-result")).toBe(false); }
      catch(error) { expect((error as {code:string}).code).toBe("UNSUPPORTED_OPERATION"); }
    }
  });
});
