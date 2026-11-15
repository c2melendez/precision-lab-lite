import { describe, expect, it } from "vitest";
import { gunzipSync } from "node:zlib";
import { readFileSync } from "node:fs";
import { parseExpression } from "../src/engine/parsing";
import { solveInequality } from "../src/engine/inequality";

describe("TRIG-IN-D-09 strict cosecant branch", () => {
  it("anchors the original source row", () => {
    const source = gunzipSync(readFileSync(new URL("../qa/certification/legacy_sources/ejercicios_trigonometria.md.gz", import.meta.url))).toString("utf8");
    const row = source.split(/\r?\n/).find(line => line.includes("| IN-D-09 |"));
    expect(row?.split("|").map(s=>s.trim().replace(/^`|`$/g, "")).filter(Boolean)).toEqual(["IN-D-09", String.raw`\csc x<-2,\quad x\in[0,2\pi)`, String.raw`\left(\pi,\frac{7\pi}{6}\right)\cup\left(\frac{11\pi}{6},2\pi\right)`]);
  });
  it.each(["csc(x)<-2", "-2>csc(x)", String.raw`\csc x<-2`])("solves %s", input => {
    const p = parseExpression(input, "RAD");
    const result = solveInequality(p.algebrite, p.inequalityOperator!, "x");
    expect(result.resultText).toBe("(pi + 2*k*pi, 7*pi/6 + 2*k*pi) U (11*pi/6 + 2*k*pi, 2*pi + 2*k*pi), k entero");
  });
  it("checks poles, strict endpoints and signs", () => {
    for(const x of [Math.PI, 2*Math.PI]) expect(Math.sin(x)).toBeCloseTo(0, 14);
    for(const x of [7*Math.PI/6, 11*Math.PI/6]) expect(1/Math.sin(x)).toBeCloseTo(-2, 14);
    for(const [x, expected] of [[13*Math.PI/12,true],[3*Math.PI/2,false],[23*Math.PI/12,true],[Math.PI/2,false]] as const) expect(1/Math.sin(x)<-2).toBe(expected);
  });
  it("keeps adjacent cases on the fallback", () => {
    for(const input of ["csc(x)<=-2","csc(x)<-3","csc(2*x)<-2","sin(x)<-2"]) {
      const p = parseExpression(input,"RAD");
      try { expect(solveInequality(p.algebrite,p.inequalityOperator!,"x").steps.some(s=>s.id === "cosecant-minus-two-periodic-result")).toBe(false); }
      catch(error) { expect((error as {code:string}).code).toBe("UNSUPPORTED_OPERATION"); }
    }
  });
});
