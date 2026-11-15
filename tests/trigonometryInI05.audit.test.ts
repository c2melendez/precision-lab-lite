import { describe, expect, it } from "vitest";
import { gunzipSync } from "node:zlib";
import { readFileSync } from "node:fs";
import { parseExpression } from "../src/engine/parsing";
import { solveInequality } from "../src/engine/inequality";

describe("TRIG-IN-I-05 inverse sine and cosine", () => {
  it("anchors source cells", () => {
    const source = gunzipSync(readFileSync(new URL("../qa/certification/legacy_sources/ejercicios_trigonometria.md.gz", import.meta.url))).toString("utf8");
    const row = source.split(/\r?\n/).find(line => line.includes("| IN-I-05 |"));
    expect(row?.split("|").map(s=>s.trim().replace(/^`|`$/g, "")).filter(Boolean)).toEqual(["IN-I-05", String.raw`\arcsin x<\arccos x`, String.raw`\left[-1,\frac{\sqrt{2}}{2}\right)`]);
  });
  it.each(["arcsin(x)<arccos(x)", "arccos(x)>arcsin(x)", String.raw`\arcsin x<\arccos x`])("solves %s", input => {
    const p = parseExpression(input,"RAD");
    const result = solveInequality(p.algebrite,p.inequalityOperator!,"x");
    expect(result.resultText).toBe("-1 <= x < sqrt(2)/2");
    expect(result.steps.at(-1)?.latex).toBe(String.raw`\left[-1,\frac{\sqrt{2}}{2}\right)`);
  });
  it("checks domain and strict equality", () => {
    const b = Math.SQRT2/2;
    expect(Math.asin(b)).toBeCloseTo(Math.acos(b),14);
    expect(Math.asin(-1)).toBeLessThan(Math.acos(-1));
    expect(Math.asin(1)).toBeGreaterThan(Math.acos(1));
    expect(Number.isNaN(Math.asin(1.01))).toBe(true);
  });
  it("preserves fallback for neighboring comparisons", () => {
    for(const input of ["arcsin(x)<=arccos(x)","arcsin(x)>arccos(x)","arcsin(2*x)<arccos(x)"]) {
      const p = parseExpression(input,"RAD");
      try { expect(solveInequality(p.algebrite,p.inequalityOperator!,"x").steps.some(s=>s.id === "arcsine-arccosine-domain-result")).toBe(false); }
      catch(error) { expect((error as {code:string}).code).toBe("UNSUPPORTED_OPERATION"); }
    }
  });
});
