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

describe("Trigonometry EC-D-03: tan(x)=sqrt(3), general real solution", () => {
  it("anchors the infinite periodic family in the frozen matrix", () => {
    const source = gunzipSync(readFileSync(SOURCE_GZ)).toString("utf8");
    expect(source).toMatch(/\|\s*EC-D-03\s*\|/);
    expect(source).toContain("tan x");
    expect(source).toContain("\\sqrt{3}");
    expect(source).toContain("x=\\frac{\\pi}{3}+k\\pi");
    expect(source).toContain("k\\in\\mathbb{Z}");
  });

  it("returns one integer-parameter family, not a finite list from one period", () => {
    const parsed = parseExpression("tan(x)=sqrt(3)", "RAD");
    expect(parsed.isEquation).toBe(true);
    expect(parsed.freeVariables).toEqual(["x"]);

    const result = solveAlgebra(parsed.leftAlgebrite, parsed.rightAlgebrite, "x");
    expect(result.solutionsAlgebrite).toHaveLength(1);

    const family = result.solutionsAlgebrite[0];
    expect(family).toContain("k");
    expect(family).toContain("pi");

    for (const k of [-3, 0, 2]) {
      const member = family.replace(/\bk\b/g, "(" + String(k) + ")");
      expect(evaluate("simplify((" + member + ")-(pi/3)-(" + k + ")*pi)")).toBe("0");
      expect(evaluate("simplify(tan(" + member + ")-sqrt(3))")).toBe("0");
    }

    const familyStep = result.steps.find((step) => /k|mathbb|pi/i.test(step.latex + step.explanation));
    expect(familyStep).toBeDefined();
    expect(familyStep?.latex).toContain("k");
    expect(familyStep?.latex).toContain("pi");
  });
});
