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

describe("Trigonometry EC-H-08: sech x=1/2 over the reals", () => {
  it("anchors the exact equation and logarithmic roots in the frozen three-column row", () => {
    const source = gunzipSync(readFileSync(SOURCE_GZ)).toString("utf8");
    const row = source.split(/\r?\n/).find((line) => /\|\s*EC-H-08\s*\|/.test(line));
    expect(row).toBeDefined();
    const cells = row!.split("|").map((cell) => cell.trim()).filter(Boolean);
    expect(cells).toHaveLength(3);
    expect(cells[0]).toBe("EC-H-08");
    expect(cells[1]).toContain("\\operatorname{sech} x=\\frac{1}{2}");
    expect(cells[2]).toContain("x=\\pm\\ln\\left(2+\\sqrt{3}\\right)");
  });

  it("returns exactly the two real logarithmic roots and verifies sech in the original equation", () => {
    const parsed = parseExpression("sech(x)=1/2", "RAD");
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
    expect(plusChecks.filter((value) => value === "0")).toHaveLength(1);
    expect(minusChecks.filter((value) => value === "0")).toHaveLength(1);

    const numericRoots = roots.map((root) =>
      Number(evaluate("float(" + root + ")").trim().replace(/\.\.\.$/, "")),
    );
    expect(numericRoots.every(Number.isFinite)).toBe(true);
    expect(Math.abs(numericRoots[0] + numericRoots[1])).toBeLessThan(1e-9);
    for (const root of numericRoots) {
      // Original equation sech(x)=1/2, evaluated independently of the solver.
      expect(Math.abs(1 / Math.cosh(root) - 0.5)).toBeLessThan(1e-6);
      // Real-domain equivalence: sech(x)=1/2 <=> cosh(x)=2.
      expect(Math.abs(Math.cosh(root) - 2)).toBeLessThan(1e-6);
    }
  });
});
