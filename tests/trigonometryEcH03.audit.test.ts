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

describe("Trigonometry EC-H-03: sinh(x)=1 over the reals", () => {
  it("anchors the exact equation and logarithmic root in the frozen matrix", () => {
    const source = gunzipSync(readFileSync(SOURCE_GZ)).toString("utf8");
    const row = source.split(/\r?\n/).find((line) => /\|\s*EC-H-03\s*\|/.test(line));
    expect(row).toBeDefined();
    const cells = row!.split("|").map((cell) => cell.trim()).filter(Boolean);
    expect(cells).toHaveLength(3);
    expect(cells[0]).toBe("EC-H-03");
    expect(cells[1]).toContain("\\sinh x=1");
    expect(cells[2]).toContain("x=\\ln\\left(1+\\sqrt{2}\\right)");
  });

  it("returns exactly the real logarithmic root through the algebra equation solver", () => {
    const parsed = parseExpression("sinh(x)=1", "RAD");
    expect(parsed.isEquation).toBe(true);
    expect(parsed.freeVariables).toEqual(["x"]);

    const result = solveAlgebra(parsed.leftAlgebrite, parsed.rightAlgebrite, "x");
    expect(result.solutionsAlgebrite).toHaveLength(1);

    const root = result.solutionsAlgebrite[0];
    expect(evaluate("simplify((" + root + ")-log(1+sqrt(2)))").replace(/\s+/g, "")).toBe("0");
    // Verify the defining equation through the independent JavaScript numeric oracle;
    // Algebrite overflows its stack simplifying exp(log(1+sqrt(2))) here.

    const numericRoot = Number(evaluate("float(" + root + ")").trim().replace(/\.\.\.$/, ""));
    expect(Number.isFinite(numericRoot)).toBe(true);
    expect(Math.abs(Math.sinh(numericRoot) - 1)).toBeLessThan(1e-5);
  });
});
