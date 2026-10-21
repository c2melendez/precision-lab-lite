import { describe, expect, it } from "vitest";
import { parseExpression } from "../src/engine/parsing";
import { evaluate } from "../src/engine/algebriteClient";
import { gunzipSync } from "node:zlib";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE_GZ = join(ROOT, "qa/certification/legacy_sources/ejercicios_trigonometria.md.gz");
const INPUT_LATEX = "\\cot\\left(\\frac{\\pi}{4}\\right)";
const INPUT_ASCII = "cot(pi/4)";
const EXPECTED = "1";

describe("Trigonometry EV-D-06 cot(pi/4)", () => {
  it("official EV-D-06 row exists in frozen trigonometry matrix with expected result", () => {
    const text = gunzipSync(readFileSync(SOURCE_GZ)).toString("utf8");
    const row = text.split("\n").find((line) => /\|\s*EV-D-06\s*\|/.test(line)) ?? "";
    expect(row).not.toBe("");
    expect(row).toContain(INPUT_LATEX);
    expect(row).toMatch(/\|\s*`?1`?\s*\|/);
  });

  it("evaluates ASCII cot(pi/4) to exact 1 through official parser pipeline", () => {
    const parsed = parseExpression(INPUT_ASCII, "RAD");
    const got = evaluate(parsed.algebrite).replace(/\s+/g, "");
    expect(got).toBe(EXPECTED);
    expect(evaluate("(" + got + ")-1").trim()).toBe("0");
  });

  it("parses official LaTeX cot(pi/4) and evaluates to exact 1", () => {
    const parsed = parseExpression(INPUT_LATEX, "RAD");
    const got = evaluate(parsed.algebrite).replace(/\s+/g, "");
    expect(got).toBe(EXPECTED);
    expect(evaluate("(" + got + ")-1").trim()).toBe("0");
  });
});
