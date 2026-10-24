import { describe, expect, it } from "vitest";
import { parseExpression } from "../src/engine/parsing";
import { evaluate } from "../src/engine/algebriteClient";
import { gunzipSync } from "node:zlib";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE_GZ = join(ROOT, "qa/certification/legacy_sources/ejercicios_trigonometria.md.gz");
/** Official matrix EV-D-03: \\tan(\\frac{\\pi}{4}) -> 1 */
const INPUT_LATEX = "\\tan\\left(\\frac{\\pi}{4}\\right)";
const INPUT_ASCII = "tan(pi/4)";
const EXPECTED = "1";

describe("Trigonometry EV-D-03 tan(pi/4)", () => {
  it("source row is present in frozen trigonometry matrix", () => {
    const text = gunzipSync(readFileSync(SOURCE_GZ)).toString("utf8");
    expect(text).toMatch(/\|\s*EV-D-03\s*\|/);
    expect(text).toContain("\\tan\\left(\\frac{\\pi}{4}\\right)");
    expect(text).toMatch(/\|\s*EV-D-03\s*\|[^\n]*\|\s*`1`\s*\|/);
  });

  it("evaluates tan(pi/4) to exact 1 via algebrite path", () => {
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
