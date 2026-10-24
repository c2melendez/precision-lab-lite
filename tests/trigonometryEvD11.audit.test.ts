import { describe, expect, it } from "vitest";
import { parseExpression } from "../src/engine/parsing";
import { evaluate } from "../src/engine/algebriteClient";
import { gunzipSync } from "node:zlib";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE_GZ = join(ROOT, "qa/certification/legacy_sources/ejercicios_trigonometria.md.gz");
const INPUT_LATEX =
  "\\sin^{2}\\left(\\frac{\\pi}{8}\\right)+\\cos^{2}\\left(\\frac{\\pi}{8}\\right)";
// ASCII witness: `sin^2(pi/8)` would bind the exponent to the whole product,
// so the squared functions are written explicitly.
const INPUT_ASCII = "(sin(pi/8))^2+(cos(pi/8))^2";

describe("Trigonometry EV-D-11 sin^2+cos^2 identity = 1", () => {
  it("official EV-D-11 row exists in frozen trigonometry matrix with expected result", () => {
    const text = gunzipSync(readFileSync(SOURCE_GZ)).toString("utf8");
    const row = text.split("\n").find((line) => /\|\s*EV-D-11\s*\|/.test(line)) ?? "";
    expect(row).not.toBe("");
    expect(row).toContain(INPUT_LATEX);
    expect(row).toMatch(/\|\s*`?1`?\s*\|/);
  });

  it("ASCII identity is exactly equivalent to 1 (simplify difference = 0)", () => {
    const parsed = parseExpression(INPUT_ASCII, "RAD");
    const got = evaluate(parsed.algebrite).replace(/\s+/g, "");
    // Algebrite keeps the Pythagorean identity in exact form; equivalence is
    // certified through simplify(), not through textual collapse to "1".
    expect(evaluate("simplify(" + got + ")").trim()).toBe("1");
    expect(evaluate("simplify((" + got + ")-1)").trim()).toBe("0");
    expect(Number(evaluate("float(" + got + ")").trim().replace(/\.\.\.$/, ""))).toBeCloseTo(1, 6);
  });

  it("official LaTeX identity is exactly equivalent to 1", () => {
    const parsed = parseExpression(INPUT_LATEX, "RAD");
    const got = evaluate(parsed.algebrite).replace(/\s+/g, "");
    expect(evaluate("simplify(" + got + ")").trim()).toBe("1");
    expect(evaluate("simplify((" + got + ")-1)").trim()).toBe("0");
  });
});
