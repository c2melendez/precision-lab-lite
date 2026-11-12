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

describe("Trigonometry EC-H-07: sinh(2x)=sinh x over the reals", () => {
  it("anchors the exact equation and root in the frozen three-column row", () => {
    const source = gunzipSync(readFileSync(SOURCE_GZ)).toString("utf8");
    const row = source.split(/\r?\n/).find((line) => /\|\s*EC-H-07\s*\|/.test(line));
    expect(row).toBeDefined();
    const cells = row!.split("|").map((cell) => cell.trim()).filter(Boolean);
    expect(cells).toHaveLength(3);
    expect(cells[0]).toBe("EC-H-07");
    expect(cells[1]).toContain("\\sinh(2x)=\\sinh x");
    expect(cells[2]).toContain("x=0");
  });

  it("returns exactly the unique real root zero and verifies the original equation", () => {
    const parsed = parseExpression("sinh(2*x)=sinh(x)", "RAD");
    expect(parsed.isEquation).toBe(true);
    expect(parsed.freeVariables).toEqual(["x"]);

    const result = solveAlgebra(parsed.leftAlgebrite, parsed.rightAlgebrite, "x");
    expect(result.solutionsAlgebrite).toHaveLength(1);

    const root = result.solutionsAlgebrite[0];
    expect(evaluate("simplify((" + root + ")-0)").replace(/\s+/g, "")).toBe("0");

    const numericRoot = Number(evaluate("float(" + root + ")").trim().replace(/\.\.\.$/, ""));
    expect(Number.isFinite(numericRoot)).toBe(true);
    const originalResidual = Number(
      evaluate("float(sinh(2*(" + root + "))-sinh(" + root + "))").trim().replace(/\.\.\.$/, ""),
    );
    expect(Number.isFinite(originalResidual)).toBe(true);
    expect(Math.abs(Math.sinh(2 * numericRoot) - Math.sinh(numericRoot))).toBeLessThan(1e-9);
    expect(Math.abs(originalResidual)).toBeLessThan(1e-9);
    // Unique real root: sinh(2x)-sinh(x)=sinh(x)*(2*cosh(x)-1) and 2*cosh(x)-1>0.
    expect(2 * Math.cosh(numericRoot) - 1).toBeGreaterThan(0);
  });
});
