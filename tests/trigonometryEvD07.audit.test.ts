import { describe, expect, it } from "vitest";
import { parseExpression } from "../src/engine/parsing";
import { evaluate } from "../src/engine/algebriteClient";
import { gunzipSync } from "node:zlib";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE_GZ = join(ROOT, "qa/certification/legacy_sources/ejercicios_trigonometria.md.gz");
const INPUT_LATEX = "\\sin\\left(\\frac{5\\pi}{4}\\right)";
const INPUT_ASCII = "sin(5*pi/4)";
const EXPECTED_LATEX = "-\\frac{\\sqrt{2}}{2}";
const EXPECTED_NUMERIC = -Math.SQRT1_2;

// Algebrite prints floats as "-0.707107..." (trailing ellipsis); strip it before parsing.
function numericValue(expr: string): number {
  return Number(evaluate("float(" + expr + ")").trim().replace(/\.\.\.$/, ""));
}

describe("Trigonometry EV-D-07 sin(5pi/4)", () => {
  it("official EV-D-07 row exists in frozen trigonometry matrix with expected result", () => {
    const text = gunzipSync(readFileSync(SOURCE_GZ)).toString("utf8");
    const row = text.split("\n").find((line) => /\|\s*EV-D-07\s*\|/.test(line)) ?? "";
    expect(row).not.toBe("");
    expect(row).toContain(INPUT_LATEX);
    expect(row).toContain(EXPECTED_LATEX);
  });

  it("evaluates ASCII sin(5*pi/4) to exact -sqrt(2)/2 through official parser pipeline", () => {
    const parsed = parseExpression(INPUT_ASCII, "RAD");
    const got = evaluate(parsed.algebrite).replace(/\s+/g, "");
    // Exactness guard: the value must be an exact radical, not a decimal approximation.
    expect(got).toMatch(/2\^\(1\/2\)|sqrt\(2\)/);
    expect(got).not.toMatch(/^-?\d*\.\d+$/);
    expect(evaluate("(" + got + ")+sqrt(2)/2").trim()).toBe("0");
    expect(numericValue(got)).toBeCloseTo(EXPECTED_NUMERIC, 5);
  });

  it("parses official LaTeX sin(5pi/4) and evaluates to exact -sqrt(2)/2", () => {
    const parsed = parseExpression(INPUT_LATEX, "RAD");
    const got = evaluate(parsed.algebrite).replace(/\s+/g, "");
    expect(got).toMatch(/2\^\(1\/2\)|sqrt\(2\)/);
    expect(evaluate("(" + got + ")+sqrt(2)/2").trim()).toBe("0");
    expect(numericValue(got)).toBeCloseTo(EXPECTED_NUMERIC, 5);
  });
});
