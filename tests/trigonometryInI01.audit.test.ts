import { describe, expect, it } from "vitest";
import { gunzipSync } from "node:zlib";
import { readFileSync } from "node:fs";
import { parseExpression } from "../src/engine/parsing";
import { solveInequality } from "../src/engine/inequality";

describe("TRIG-IN-I-01 inverse sine", () => {
  it("anchors source cells", () => {
    const source = gunzipSync(readFileSync(new URL("../qa/certification/legacy_sources/ejercicios_trigonometria.md.gz", import.meta.url))).toString("utf8");
    const row = source.split(/\r?\n/).find(line => line.includes("| IN-I-01 |"));
    expect(row?.split("|").map(s=>s.trim().replace(/^`|`$/g, "")).filter(Boolean)).toEqual(["IN-I-01", String.raw`\arcsin x>\frac{\pi}{6}`, String.raw`\left(\frac{1}{2},1\right]`]);
  });
  it.each(["arcsin(x)>pi/6", "pi/6<arcsin(x)", String.raw`\arcsin x>\frac{\pi}{6}`])("solves %s", input => {
    const p = parseExpression(input, "RAD");
    const result = solveInequality(p.algebrite,p.inequalityOperator!,"x");
    expect(result.resultText).toBe("1/2 < x <= 1");
    expect(result.steps.at(-1)?.latex).toBe(String.raw`\left(\frac{1}{2},1\right]`);
  });
  it("validates strict equality and real domain", () => {
    expect(Math.asin(0.5)).toBeCloseTo(Math.PI/6,14);
    expect(Math.asin(1)).toBeGreaterThan(Math.PI/6);
    expect(Number.isNaN(Math.asin(1.01))).toBe(true);
    expect(Math.asin(-1)).toBeLessThan(Math.PI/6);
  });
  it("preserves fallback for other comparisons", () => {
    for (const input of ["arcsin(x)>=pi/6", "arcsin(x)>pi/4", "arcsin(2*x)>pi/6", "sin(x)>pi/6"]) {
      const p = parseExpression(input, "RAD");
      try { expect(solveInequality(p.algebrite,p.inequalityOperator!,"x").steps.some(s=>s.id === "arcsine-sixth-domain-result")).toBe(false); }
      catch (error) { expect((error as {code:string}).code).toBe("UNSUPPORTED_OPERATION"); }
    }
  });
});
