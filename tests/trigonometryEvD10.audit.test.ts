import { describe, expect, it } from "vitest";
import { parseExpression } from "../src/engine/parsing";
import { evaluate } from "../src/engine/algebriteClient";
import { gunzipSync } from "node:zlib";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE_GZ = join(ROOT, "qa/certification/legacy_sources/ejercicios_trigonometria.md.gz");
const INPUT_LATEX = "\\cot\\left(\\frac{\\pi}{2}\\right)";
const INPUT_ASCII = "cot(pi/2)";
const EXPECTED = "0";

describe("Trigonometry EV-D-10 cot(pi/2)", () => {
  it("official EV-D-10 row exists in frozen trigonometry matrix with expected result", () => {
    const text = gunzipSync(readFileSync(SOURCE_GZ)).toString("utf8");
    const row = text.split("\n").find((line) => /\|\s*EV-D-10\s*\|/.test(line)) ?? "";
    expect(row).not.toBe("");
    expect(row).toContain(INPUT_LATEX);
    expect(row).toMatch(/\|\s*`?0`?\s*\|/);
  });

  it("evaluates ASCII cot(pi/2) to exact 0 through official parser pipeline", () => {
    const parsed = parseExpression(INPUT_ASCII, "RAD");
    const got = evaluate(parsed.algebrite).replace(/\s+/g, "");
    expect(got).toBe(EXPECTED);
  });

  it("parses official LaTeX cot(pi/2) and evaluates to exact 0", () => {
    const parsed = parseExpression(INPUT_LATEX, "RAD");
    const got = evaluate(parsed.algebrite).replace(/\s+/g, "");
    expect(got).toBe(EXPECTED);
  });
});
