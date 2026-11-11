import { describe, expect, it } from "vitest";
import { gunzipSync } from "node:zlib";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { parseExpression } from "../src/engine/parsing";
import { evaluate } from "../src/engine/algebriteClient";
import { solveAlgebra } from "../src/engine/stepEngine/algebra";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE_GZ = join(ROOT, "qa/certification/legacy_sources/ejercicios_trigonometria.md.gz");
const EXPECTED_ROOT = "2";

describe("Trigonometry EC-I-07: arcsec(x)=pi/3 on the principal branch", () => {
  it("anchors the exact equation and the single-root expectation in the frozen matrix", () => {
    const source = gunzipSync(readFileSync(SOURCE_GZ)).toString("utf8");
    expect(source).toMatch(/\|\s*EC-I-07\s*\|/);
    expect(source).toContain(String.raw`\operatorname{arcsec} x=\frac{\pi}{3}`);
    expect(source).toContain(String.raw`x=2`);
  });

  it("returns exactly x=2, verified with sec(pi/3)=2", () => {
    const parsed = parseExpression("arcsec(x)=pi/3", "RAD");
    expect(parsed.isEquation).toBe(true);
    expect(parsed.freeVariables.filter((v) => v !== "pi")).toEqual(["x"]);

    const result = solveAlgebra(parsed.leftAlgebrite, parsed.rightAlgebrite, "x");
    expect(result.solutionsAlgebrite).toHaveLength(1);

    const root = result.solutionsAlgebrite[0];
    expect(evaluate("simplify((" + root + ")-(" + EXPECTED_ROOT + "))").replace(/\s+/g, "")).toBe("0");

    const numeric = Number(evaluate("float(" + root + ")").trim().replace(/\.\.\.$/, ""));
    expect(Number.isFinite(numeric)).toBe(true);
    // Algebrite leaves arcsec unevaluated, so verify the principal branch with
    // arcsec(x)=arccos(1/x) in JavaScript.
    expect(Math.abs(Math.acos(1 / numeric) - Math.PI / 3)).toBeLessThan(1e-9);
  });
});
