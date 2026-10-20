import { describe, expect, it } from "vitest";
import { evaluate } from "../src/engine/algebriteClient";
import { gunzipSync } from "node:zlib";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE_GZ = join(ROOT, "qa/certification/legacy_sources/matriz_algebra_simbolica.md.gz");
const ORIGINAL = "x^2*y-x*y^2";

describe("Algebra229 AS-B-19 factor common multivariable factor x^2y-xy^2", () => {
  it("source row is present in frozen AS229 matrix", () => {
    const text = gunzipSync(readFileSync(SOURCE_GZ)).toString("utf8");
    expect(text).toMatch(/\|\s*AS-B-19\s*\|\s*N2\s*\|/);
    expect(text).toContain("x^{2}y-xy^{2}");
    expect(text).toContain("x y \\left(x - y\\right)");
  });

  it("factors out the common factor xy, equivalent to the original", () => {
    const factored = evaluate(`factor(${ORIGINAL})`).replace(/\s+/g, "");
    expect(evaluate(`(${factored})-(${ORIGINAL})`).trim()).toBe("0");
    expect(evaluate(`(${factored})-(x*y*(x-y))`).trim()).toBe("0");
    expect(factored).toMatch(/\(/);
  });
});
