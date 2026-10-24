import { describe, expect, it } from "vitest";
import { parseExpression } from "../src/engine/parsing";
import { evaluate } from "../src/engine/algebriteClient";
import { gunzipSync } from "node:zlib";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE_GZ = join(ROOT, "qa/certification/legacy_sources/ejercicios_trigonometria.md.gz");
/** Official matrix EV-D-02: \\cos(\\frac{\\pi}{3}) -> 1/2 */
const INPUT_LATEX = "\\cos\\left(\\frac{\\pi}{3}\\right)";
const INPUT_ASCII = "cos(pi/3)";
const EXPECTED = "1/2";

describe("Trigonometry EV-D-02 cos(pi/3)", () => {
  it("source row is present in frozen trigonometry matrix", () => {
    const text = gunzipSync(readFileSync(SOURCE_GZ)).toString("utf8");
    expect(text).toMatch(/\|\s*EV-D-02\s*\|/);
    expect(text).toContain("\\cos\\left(\\frac{\\pi}{3}\\right)");
    expect(text).toContain("\\frac{1}{2}");
  });

  it("evaluates cos(pi/3) to exact 1/2 via algebrite path", () => {
    const fromAscii = evaluate(INPUT_ASCII).replace(/\s+/g, "");
    expect(fromAscii).toBe(EXPECTED);
    expect(evaluate(`(${fromAscii})-1/2`).trim()).toBe("0");
  });

  it("parses official LaTeX and evaluates to exact 1/2", () => {
    const parsed = parseExpression(INPUT_LATEX, "RAD");
    const result = evaluate(parsed.algebrite).replace(/\s+/g, "");
    expect(result).toBe(EXPECTED);
    expect(evaluate(`(${result})-1/2`).trim()).toBe("0");
  });
});
