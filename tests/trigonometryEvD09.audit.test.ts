import { describe, expect, it } from "vitest";
import { parseExpression } from "../src/engine/parsing";
import { evaluate } from "../src/engine/algebriteClient";
import { gunzipSync } from "node:zlib";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE_GZ = join(ROOT, "qa/certification/legacy_sources/ejercicios_trigonometria.md.gz");
const INPUT_LATEX = "\\cos(2)";
const INPUT_ASCII = "cos(2)";
/** EV-D-09 documents an approximation: `\approx -0.416146837` (9 decimals). */
const DOCUMENTED = -0.416146837;
const DOCUMENTED_DECIMALS = 9;
// Protocol rule 4: Lite's float channel prints 6 decimals, so the secondary
// numeric check uses 1e-6; symbolic exactness below is mandatory.
const TOLERANCE = 1e-6;

function floatValue(expr: string): number {
  return Number(evaluate("float(" + expr + ")").trim().replace(/\.\.\.$/, ""));
}

describe("Trigonometry EV-D-09 cos(2) approx -0.416146837", () => {
  it("official EV-D-09 row exists in frozen matrix with the documented approximation", () => {
    const text = gunzipSync(readFileSync(SOURCE_GZ)).toString("utf8");
    const row = text.split("\n").find((line) => /\|\s*EV-D-09\s*\|/.test(line)) ?? "";
    expect(row).not.toBe("");
    expect(row).toContain(INPUT_LATEX);
    expect(row).toContain("\\approx");
    expect(row).toContain("-0.416146837");
  });

  it("documented value is the correct 9-decimal rounding of cos(2)", () => {
    expect(Number(Math.cos(2).toFixed(DOCUMENTED_DECIMALS))).toBe(DOCUMENTED);
  });

  it("keeps exact symbolic cos(2) and matches the documented value numerically (ASCII)", () => {
    const parsed = parseExpression(INPUT_ASCII, "RAD");
    const got = evaluate(parsed.algebrite).replace(/\s+/g, "");
    // Approx rows still require an exact form: a decimal-only output does not certify.
    expect(got).toBe("cos(2)");
    expect(got).not.toMatch(/^-?\d*\.\d+$/);
    expect(Math.abs(floatValue(got) - DOCUMENTED)).toBeLessThanOrEqual(TOLERANCE);
  });

  it("parses official LaTeX cos(2) and keeps exact symbolic cos(2)", () => {
    const parsed = parseExpression(INPUT_LATEX, "RAD");
    const got = evaluate(parsed.algebrite).replace(/\s+/g, "");
    expect(got).toBe("cos(2)");
    expect(got).not.toMatch(/^-?\d*\.\d+$/);
    expect(Math.abs(floatValue(got) - DOCUMENTED)).toBeLessThanOrEqual(TOLERANCE);
  });
});
