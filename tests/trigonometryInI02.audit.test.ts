import { describe, expect, it } from "vitest";
import { gunzipSync } from "node:zlib";
import { readFileSync } from "node:fs";
import { parseExpression } from "../src/engine/parsing";
import { solveInequality } from "../src/engine/inequality";

describe("TRIG-IN-I-02 inverse cosine", () => {
  it("anchors source cells", () => {
    const source = gunzipSync(readFileSync(new URL("../qa/certification/legacy_sources/ejercicios_trigonometria.md.gz", import.meta.url))).toString("utf8");
    const row = source.split(/\r?\n/).find(line => line.includes("| IN-I-02 |"));
    expect(row?.split("|").map(s=>s.trim().replace(/^`|`$/g, "")).filter(Boolean)).toEqual(["IN-I-02", String.raw`\arccos x\le\frac{\pi}{3}`, String.raw`\left[\frac{1}{2},1\right]`]);
  });
  it.each(["arccos(x)<=pi/3", "pi/3>=arccos(x)", String.raw`\arccos x\le\frac{\pi}{3}`])("solves %s", input => {
    const p = parseExpression(input, "RAD");
    const result = solveInequality(p.algebrite,p.inequalityOperator!,"x");
    expect(result.resultText).toBe("1/2 <= x <= 1");
    expect(result.steps.at(-1)?.latex).toBe(String.raw`\left[\frac{1}{2},1\right]`);
  });
  it("checks equality and real domain", () => {
    expect(Math.acos(0.5)).toBeCloseTo(Math.PI/3,14);
    expect(Math.acos(1)).toBeLessThan(Math.PI/3);
    expect(Math.acos(0)).toBeGreaterThan(Math.PI/3);
    expect(Number.isNaN(Math.acos(1.01))).toBe(true);
  });
  it("preserves fallback for other comparisons", () => {
    for(const input of ["arccos(x)<pi/3", "arccos(x)<=pi/4", "arccos(2*x)<=pi/3", "cos(x)<=pi/3"]) {
      const p = parseExpression(input,"RAD");
      try { expect(solveInequality(p.algebrite,p.inequalityOperator!,"x").steps.some(s=>s.id === "arccosine-third-domain-result")).toBe(false); }
      catch(error) { expect((error as {code:string}).code).toBe("UNSUPPORTED_OPERATION"); }
    }
  });
});
