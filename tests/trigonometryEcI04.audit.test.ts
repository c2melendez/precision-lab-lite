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
const EXPECTED_ROOT = "sqrt(2)/2";

describe("Trigonometry EC-I-04: arcsin(x)=arccos(x) on the real domain", () => {
  it("anchors the exact equation and the single-root expectation in the frozen matrix", () => {
    const source = gunzipSync(readFileSync(SOURCE_GZ)).toString("utf8");
    expect(source).toMatch(/\|\s*EC-I-04\s*\|/);
    expect(source).toContain(String.raw`\arcsin x=\arccos x`);
    expect(source).toContain(String.raw`x=\frac{\sqrt{2}}{2}`);
  });

  it("returns exactly x=sqrt(2)/2, verified in the original equation", () => {
    const parsed = parseExpression("arcsin(x)=arccos(x)", "RAD");
    expect(parsed.isEquation).toBe(true);
    // The parser also reports the constant `pi` among the free variables; the unknown is the only non-constant one.
    expect(parsed.freeVariables.filter((v) => v !== "pi")).toEqual(["x"]);

    const result = solveAlgebra(parsed.leftAlgebrite, parsed.rightAlgebrite, "x");
    expect(result.solutionsAlgebrite).toHaveLength(1);

    const root = result.solutionsAlgebrite[0];
    expect(evaluate("simplify((" + root + ")-(" + EXPECTED_ROOT + "))").replace(/\s+/g, "")).toBe("0");
    expect(evaluate("simplify(arcsin(" + root + ")-arccos(" + root + "))").replace(/\s+/g, "")).toBe("0");
  });
});
