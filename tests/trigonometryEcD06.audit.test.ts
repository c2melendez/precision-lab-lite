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
const EXPECTED_ROOTS = ["pi/6", "pi/2", "5*pi/6", "3*pi/2"];

describe("Trigonometry EC-D-06: sin(2*x)=cos(x) on [0,2*pi)", () => {
  it("anchors the exact equation, interval and four-root oracle in the frozen matrix", () => {
    const source = gunzipSync(readFileSync(SOURCE_GZ)).toString("utf8");
    expect(source).toMatch(/\|\s*EC-D-06\s*\|/);
    expect(source).toContain(String.raw`\sin 2x=\cos x`);
    expect(source).toContain(String.raw`x\in[0,2\pi)`);
    expect(source).toContain(String.raw`\frac{\pi}{6}`);
    expect(source).toContain(String.raw`\frac{\pi}{2}`);
    expect(source).toContain(String.raw`\frac{5\pi}{6}`);
    expect(source).toContain(String.raw`\frac{3\pi}{2}`);
  });

  it("returns exactly the four exact roots in [0,2*pi), each verified in the original equation", () => {
    const parsed = parseExpression("sin(2*x)=cos(x)", "RAD");
    expect(parsed.isEquation).toBe(true);
    expect(parsed.freeVariables).toEqual(["x"]);

    const result = solveAlgebra(parsed.leftAlgebrite, parsed.rightAlgebrite, "x");
    expect(result.solutionsAlgebrite).toHaveLength(4);

    const matches = result.solutionsAlgebrite.map((root) =>
      EXPECTED_ROOTS.find((expected) =>
        evaluate("simplify((" + root + ")-(" + expected + "))").replace(/\s+/g, "") === "0",
      ) ?? "UNMATCHED:" + root,
    );
    expect(matches.sort()).toEqual([...EXPECTED_ROOTS].sort());

    const numericRoots = result.solutionsAlgebrite.map((root) =>
      Number(evaluate("float(" + root + ")").trim().replace(/\.\.\.$/, "")),
    );
    expect(numericRoots.every((value) => Number.isFinite(value) && value >= 0 && value < 2 * Math.PI)).toBe(true);

    for (const root of result.solutionsAlgebrite) {
      expect(evaluate("simplify(sin(2*(" + root + "))-cos(" + root + "))").replace(/\s+/g, "")).toBe("0");
    }
  });
});
