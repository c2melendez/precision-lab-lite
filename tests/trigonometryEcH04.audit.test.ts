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

describe("Trigonometry EC-H-04: cosh(x)=2 over the reals", () => {
  it("anchors all three cells of the frozen equation and solution row", () => {
    const source = gunzipSync(readFileSync(SOURCE_GZ)).toString("utf8");
    const row = source.split(/\r?\n/).find((line) => /\|\s*EC-H-04\s*\|/.test(line));
    expect(row).toBeDefined();
    const cells = row!.split("|").map((cell) => cell.trim()).filter(Boolean);
    expect(cells).toHaveLength(3);
    expect(cells[0]).toBe("EC-H-04");
    expect(cells[1]).toContain("\\cosh x=2");
    expect(cells[2]).toContain("x=\\pm\\ln\\left(2+\\sqrt{3}\\right)");
  });

  it("returns exactly the two real logarithmic roots and verifies both substitutions", () => {
    const parsed = parseExpression("cosh(x)=2", "RAD");
    expect(parsed.isEquation).toBe(true);
    expect(parsed.freeVariables).toEqual(["x"]);

    const result = solveAlgebra(parsed.leftAlgebrite, parsed.rightAlgebrite, "x");
    expect(result.solutionsAlgebrite).toHaveLength(2);

    const roots = result.solutionsAlgebrite;
    const plusChecks = roots.map((root) =>
      evaluate("simplify((" + root + ")-log(2+sqrt(3)))").replace(/\s+/g, ""),
    );
    const minusChecks = roots.map((root) =>
      evaluate("simplify((" + root + ")+log(2+sqrt(3)))").replace(/\s+/g, ""),
    );
    expect(plusChecks).toContain("0");
    expect(minusChecks).toContain("0");

    const numericRoots = roots.map((root) =>
      Number(evaluate("float(" + root + ")").trim().replace(/\.\.\.$/, "")),
    );
    expect(numericRoots.every(Number.isFinite)).toBe(true);
    expect(Math.abs(numericRoots[0] + numericRoots[1])).toBeLessThan(1e-5);
    for (const root of numericRoots) {
      expect(Math.abs(Math.cosh(root) - 2)).toBeLessThan(1e-5);
    }
  });
});
