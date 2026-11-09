import { describe, expect, it } from "vitest";
import { parseExpression } from "../src/engine/parsing";
import { evaluate } from "../src/engine/algebriteClient";
import { gunzipSync } from "node:zlib";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE_GZ = join(ROOT, "qa/certification/legacy_sources/ejercicios_trigonometria.md.gz");
/** Official matrix LM-D-01: lim_{x\\to 0} sin(x)/x -> 1 */
const INPUT_LATEX = "\\lim_{x\\to 0}\\frac{\\sin x}{x}";
const INPUT_ASCII = "limit(sin(x)/x,x,0)";
const EXPECTED = "1";

describe("Trigonometry LM-D-01 lim x->0 sin(x)/x", () => {
  it("source row is present in frozen trigonometry matrix", () => {
    const text = gunzipSync(readFileSync(SOURCE_GZ)).toString("utf8");
    expect(text).toMatch(/\|\s*LM-D-01\s*\|/);
    expect(text).toContain("\\lim_{x\\to 0}\\frac{\\sin x}{x}");
    expect(text).toMatch(/\|\s*`1`\s*\|/);
  });

  it("parses official LaTeX limit notation to a limit(...) form", () => {
    const parsed = parseExpression(INPUT_LATEX, "RAD").algebrite.replace(/\s+/g, "");
    expect(parsed).toMatch(/^limit\(/);
    expect(parsed).toContain("sin");
  });

  it("evaluates lim x->0 sin(x)/x to exact 1 via algebrite path", () => {
    const fromAscii = evaluate(INPUT_ASCII).replace(/\s+/g, "");
    expect(fromAscii).toBe(EXPECTED);
    expect(evaluate(`(${fromAscii})-1`).trim()).toBe("0");
  });

  it("parses official LaTeX and evaluates to exact 1", () => {
    const parsed = parseExpression(INPUT_LATEX, "RAD");
    const result = evaluate(parsed.algebrite).replace(/\s+/g, "");
    expect(result).toBe(EXPECTED);
    expect(evaluate(`(${result})-1`).trim()).toBe("0");
  });
});
