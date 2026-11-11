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
const EXPECTED_ROOT = "-sqrt(3)/3";

describe("Trigonometry EC-I-06: arccot(x)=2*pi/3 on the principal branch", () => {
  it("anchors the exact equation and the single-root expectation in the frozen matrix", () => {
    const source = gunzipSync(readFileSync(SOURCE_GZ)).toString("utf8");
    expect(source).toMatch(/\|\s*EC-I-06\s*\|/);
    expect(source).toContain(String.raw`\operatorname{arccot} x=\frac{2\pi}{3}`);
    expect(source).toContain(String.raw`x=-\frac{\sqrt{3}}{3}`);
  });

  it("returns exactly x=-sqrt(3)/3, verified on the principal arccot branch", () => {
    const parsed = parseExpression("arccot(x)=2*pi/3", "RAD");
    expect(parsed.isEquation).toBe(true);
    expect(parsed.freeVariables.filter((v) => v !== "pi")).toEqual(["x"]);

    const result = solveAlgebra(parsed.leftAlgebrite, parsed.rightAlgebrite, "x");
    expect(result.solutionsAlgebrite).toHaveLength(1);

    const root = result.solutionsAlgebrite[0];
    expect(evaluate("simplify((" + root + ")-(" + EXPECTED_ROOT + "))").replace(/\s+/g, "")).toBe("0");

    const numeric = Number(evaluate("float(" + root + ")").trim().replace(/\.\.\.$/, ""));
    expect(Number.isFinite(numeric)).toBe(true);
    // Algebrite leaves arccot/acot unevaluated, so the principal branch is checked
    // with the exact identity arccot(x)=pi/2-atan(x) in JavaScript.
    expect(Math.abs(Math.PI / 2 - Math.atan(numeric) - (2 * Math.PI) / 3)).toBeLessThan(1e-9);
  });
});
