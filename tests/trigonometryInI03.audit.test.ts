import { describe, expect, it } from "vitest";
import { gunzipSync } from "node:zlib";
import { readFileSync } from "node:fs";
import { parseExpression } from "../src/engine/parsing";
import { solveInequality } from "../src/engine/inequality";

describe("TRIG-IN-I-03 inverse tangent", () => {
  it("anchors source cells", () => {
    const source = gunzipSync(readFileSync(new URL("../qa/certification/legacy_sources/ejercicios_trigonometria.md.gz", import.meta.url))).toString("utf8");
    const row = source.split(/\r?\n/).find(line => line.includes("| IN-I-03 |"));
    expect(row?.split("|").map(s=>s.trim()).filter(Boolean)).toEqual(["IN-I-03", "`\\arctan x<1`", "`\\left(-\\infty,\\tan 1\\right)` con `\\tan 1\\approx 1.557407725`"]);
  });
  it.each(["arctan(x)<1", "1>arctan(x)", String.raw`\arctan x<1`])("solves %s", input => {
    const p = parseExpression(input,"RAD");
    const result = solveInequality(p.algebrite,p.inequalityOperator!,"x");
    expect(result.resultText).toBe("x < tan(1)");
    expect(result.steps.at(-1)?.latex).toBe(String.raw`\left(-\infty,\tan(1)\right)`);
  });
  it("checks strict boundary independently", () => {
    expect(Math.atan(Math.tan(1))).toBeCloseTo(1,14);
    expect(Math.tan(1)).toBeCloseTo(1.557407725,9);
    expect(Math.atan(1)).toBeLessThan(1);
    expect(Math.atan(2)).toBeGreaterThan(1);
  });
  it("preserves fallback for other comparisons", () => {
    for(const input of ["arctan(x)<=1", "arctan(x)<2", "arctan(2*x)<1", "tan(x)<1"]) {
      const p = parseExpression(input,"RAD");
      try { expect(solveInequality(p.algebrite,p.inequalityOperator!,"x").steps.some(s=>s.id === "arctangent-one-domain-result")).toBe(false); }
      catch(error) { expect((error as {code:string}).code).toBe("UNSUPPORTED_OPERATION"); }
    }
  });
});
