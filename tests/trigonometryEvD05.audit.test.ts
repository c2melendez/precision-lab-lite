import { describe, expect, it } from "vitest";
import { parseExpression } from "../src/engine/parsing";
import { evaluate } from "../src/engine/algebriteClient";
import { gunzipSync } from "node:zlib";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE_GZ = join(ROOT, "qa/certification/legacy_sources/ejercicios_trigonometria.md.gz");
const INPUT_LATEX = "\\sec\\left(\\frac{\\pi}{3}\\right)";
const INPUT_ASCII = "sec(pi/3)";
const EXPECTED = "2";

describe("Trigonometry EV-D-05 sec(pi/3)", () => {
  it("official EV-D-05 row exists in frozen trigonometry matrix with expected result", () => {
    const text = gunzipSync(readFileSync(SOURCE_GZ)).toString("utf8");
    const row = text.split("\\n").find((line) => /\\|\\s*EV-D-05\\s*\\|/.test(line)) ?? "";
    expect(row).not.toBe("");
    expect(row).toContain("\\sec\\left(\\frac{\\pi}{3}\\right)");
    expect(row).toMatch(/\\|\\s*2\\s*\\|/);
  });

  it("evaluates ASCII sec(pi/3) to exact 2 through official parser pipeline", () => {
    const parsed = parseExpression(INPUT_ASCII, "RAD");
    const got = evaluate(parsed.algebrite).replace(/\\s+/g, "");
    expect(got).toBe(EXPECTED);
    expect(evaluate("(" + got + ")-2").trim()).toBe("0");
  });

  it("parses official LaTeX sec(pi/3) and evaluates to exact 2", () => {
    const parsed = parseExpression(INPUT_LATEX, "RAD");
    const got = evaluate(parsed.algebrite).replace(/\\s+/g, "");
    expect(got).toBe(EXPECTED);
    expect(evaluate("(" + got + ")-2").trim()).toBe("0");
  });
});
