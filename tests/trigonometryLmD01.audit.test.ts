import { describe, expect, it } from "vitest";
import { parseExpression } from "../src/engine/parsing";
import { evaluate } from "../src/engine/algebriteClient";
import { compileNumeric } from "../src/engine/numericFallback";
import { calcLimit } from "../src/engine/stepEngine/calculus";
import { gunzipSync } from "node:zlib";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE_GZ = join(ROOT, "qa/certification/legacy_sources/ejercicios_trigonometria.md.gz");
/** Official matrix LM-D-01: lim_{x\\to 0} sin(x)/x -> 1 */
const INPUT_LATEX = "\\lim_{x\\to 0}\\frac{\\sin x}{x}";
// Samples approaching 0 from both sides (exclude exact 0: sin(x)/x is removable).
const SAMPLES = [-0.1, -0.01, -0.001, 0.001, 0.01, 0.1];

describe("Trigonometry LM-D-01 lim x->0 sin(x)/x", () => {
  it("source row is present in frozen trigonometry matrix", () => {
    const text = gunzipSync(readFileSync(SOURCE_GZ)).toString("utf8");
    expect(text).toMatch(/\|\s*LM-D-01\s*\|/);
    expect(text).toContain("\\lim_{x\\to 0}\\frac{\\sin x}{x}");
    const row = text.split(/\r?\n/).find((line) => /\|\s*LM-D-01\s*\|/.test(line)) ?? "";
    expect(row).toMatch(/`1`/);
  });

  it("parses official LaTeX limit notation to a limit(...) form", () => {
    const parsed = parseExpression(INPUT_LATEX, "RAD").algebrite.replace(/\s+/g, "");
    expect(parsed).toMatch(/^limit\(/);
    expect(parsed).toContain("sin");
    expect(parsed).toMatch(/,x,0\)?$/);
  });

  it("computes the frozen limit through Lite's calculus engine", () => {
    const result = calcLimit("sin(x)/x", "x", "0", 0, "both");
    expect(result.confidence).toBe("NUMERIC_FALLBACK");
    expect(Number(result.resultLatex)).toBeCloseTo(1, 6);
    expect(result.steps.some((step) => step.id === "numeric")).toBe(true);
  });

  it("independent samples of sin(x)/x approach 1 near x=0 (numerical oracle)", () => {
    for (const x of SAMPLES) {
      const actual = compileNumeric(`sin(${x})/(${x})`, "__unused__")(0);
      expect(actual).toBeCloseTo(Math.sin(x) / x, 10);
      expect(actual).toBeCloseTo(1, 2); // within ~0.01 at |x|<=0.1
    }
  });

  it("does not claim a finite value by substituting x=0 into sin(x)/x (0/0)", () => {
    // Removable discontinuity: direct substitution is undefined; limit is 1.
    // Either an explicit domain error or a non-finite sentinel is acceptable.
    let result: string;
    try {
      result = evaluate("sin(0)/0");
    } catch {
      return;
    }
    expect(Number.isFinite(Number(result))).toBe(false);
  });
});
