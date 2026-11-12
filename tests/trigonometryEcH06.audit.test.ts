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

describe("Trigonometry EC-H-06: cosh(x)+sinh(x)=2 over the reals", () => {
  it("anchors the exact equation and logarithmic root in the frozen three-column row", () => {
    const source = gunzipSync(readFileSync(SOURCE_GZ)).toString("utf8");
    const row = source.split(/\r?\n/).find((line) => /\|\s*EC-H-06\s*\|/.test(line));
    expect(row).toBeDefined();
    const cells = row!.split("|").map((cell) => cell.trim()).filter(Boolean);
    expect(cells).toHaveLength(3);
    expect(cells[0]).toBe("EC-H-06");
    expect(cells[1]).toContain("\\cosh x+\\sinh x=2");
    expect(cells[2]).toContain("x=\\ln 2");
  });

  it("returns exactly the unique real logarithmic root and verifies the original equation", () => {
    const parsed = parseExpression("cosh(x)+sinh(x)=2", "RAD");
    expect(parsed.isEquation).toBe(true);
    expect(parsed.freeVariables).toEqual(["x"]);

    const result = solveAlgebra(parsed.leftAlgebrite, parsed.rightAlgebrite, "x");
    expect(result.solutionsAlgebrite).toHaveLength(1);

    const root = result.solutionsAlgebrite[0];
    expect(
      evaluate("simplify((" + root + ")-log(2))").replace(/\s+/g, ""),
    ).toBe("0");
    expect(
      evaluate("simplify(cosh(" + root + ")+sinh(" + root + ")-2)").replace(/\s+/g, ""),
    ).toBe("0");

    const numericRoot = Number(evaluate("float(" + root + ")").trim().replace(/\.\.\.$/, ""));
    expect(Number.isFinite(numericRoot)).toBe(true);
    expect(Math.abs(Math.cosh(numericRoot) + Math.sinh(numericRoot) - 2)).toBeLessThan(1e-5);
  });
});
