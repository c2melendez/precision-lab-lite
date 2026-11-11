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

describe("Trigonometry EC-H-01: sinh(x)=0 over the reals", () => {
  it("anchors the exact equation and root in the frozen three-column matrix", () => {
    const source = gunzipSync(readFileSync(SOURCE_GZ)).toString("utf8");
    expect(source).toMatch(/\|\s*EC-H-01\s*\|/);
    expect(source).toContain(String.raw`\sinh x=0`);
    expect(source).toContain(String.raw`x=0`);
  });

  it("returns exactly the real root x=0 through the algebra equation solver", () => {
    const parsed = parseExpression("sinh(x)=0", "RAD");
    expect(parsed.isEquation).toBe(true);
    expect(parsed.freeVariables).toEqual(["x"]);

    const result = solveAlgebra(parsed.leftAlgebrite, parsed.rightAlgebrite, "x");
    expect(result.solutionsAlgebrite).toHaveLength(1);

    const root = result.solutionsAlgebrite[0];
    expect(evaluate("simplify((" + root + ")-0)").replace(/\s+/g, "")).toBe("0");
    const numericRoot = Number(evaluate("float(" + root + ")").trim().replace(/\.\.\.$/, ""));
    expect(Number.isFinite(numericRoot)).toBe(true);
    expect(Math.abs(Math.sinh(numericRoot))).toBeLessThan(1e-12);
  });
});
