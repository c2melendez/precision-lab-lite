import { describe, expect, it } from "vitest";
import { evaluate } from "../src/engine/algebriteClient";
import { gunzipSync } from "node:zlib";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE_GZ = join(ROOT, "qa/certification/legacy_sources/matriz_algebra_simbolica.md.gz");
const ORIGINAL = "6*x^2+5*x-4";

describe("Algebra229 AS-B-09 factor 6x^2+5x-4", () => {
  it("source row is present in frozen AS229 matrix", () => {
    const text = gunzipSync(readFileSync(SOURCE_GZ)).toString("utf8");
    expect(text).toMatch(/\|\s*AS-B-09\s*\|\s*N2\s*\|/);
    expect(text).toContain("6x^{2}+5x-4");
    expect(text).toContain("\\left(2 x - 1\\right) \\left(3 x + 4\\right)");
  });

  it("factors over the rationals into a product equal to the original", () => {
    const factored = evaluate(`factor(${ORIGINAL})`).replace(/\s+/g, "");
    expect(evaluate(`(${factored})-(${ORIGINAL})`).trim()).toBe("0");
    expect(factored).toMatch(/\(/);
    expect(evaluate(`(${factored})-((2*x-1)*(3*x+4))`).trim()).toBe("0");
  });
});
