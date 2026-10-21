import { describe, expect, it } from "vitest";
import { parseExpression } from "../src/engine/parsing";
import { evaluate } from "../src/engine/algebriteClient";
import { gunzipSync } from "node:zlib";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE_GZ = join(ROOT, "qa/certification/legacy_sources/ejercicios_trigonometria.md.gz");
const INPUT_LATEX = "\\csc\\left(\\frac{\\pi}{6}\\right)";
const INPUT_ASCII = "csc(pi/6)";
const EXPECTED = "2";

describe("Trigonometry EV-D-04 csc(pi/6)", () => {
  it("official EV-D-04 row exists in frozen trigonometry matrix with expected result", () => {
    const text = gunzipSync(readFileSync(SOURCE_GZ)).toString("utf8");
    expect(text).toMatch(/\|\s*EV-D-04\s*\|/);
    expect(text).toContain("\\csc\\left(\\frac{\\pi}{6}\\right)");
    expect(text).toMatch(/\|\s*EV-D-04\s*\|[^\n]*\|\s*`2`\s*\|/);
  });

  it("evaluates ASCII csc(pi/6) to exact 2 through Algebrite", () => {
    const parsed = parseExpression(INPUT_ASCII, "RAD");
    const got = evaluate(parsed.algebrite).replace(/\s+/g, "");
    expect(got).toBe(EXPECTED);
    expect(evaluate("(" + got + ")-2").trim()).toBe("0");
  });

  it("parses official LaTeX csc(pi/6) and evaluates to exact 2", () => {
    const parsed = parseExpression(INPUT_LATEX, "RAD");
    const got = evaluate(parsed.algebrite).replace(/\s+/g, "");
    expect(got).toBe(EXPECTED);
    expect(evaluate("(" + got + ")-2").trim()).toBe("0");
  });
});
