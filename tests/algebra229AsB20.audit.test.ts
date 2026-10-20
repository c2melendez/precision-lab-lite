import { describe, expect, it } from "vitest";
import { evaluate } from "../src/engine/algebriteClient";
import { gunzipSync } from "node:zlib";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE_GZ = join(ROOT, "qa/certification/legacy_sources/matriz_algebra_simbolica.md.gz");
const ORIGINAL = "x^4+x^2*y^2+y^4";
const EXPECTED = "(x^2-x*y+y^2)*(x^2+x*y+y^2)";

describe("Algebra229 AS-B-20 factor x^4+x^2y^2+y^4", () => {
  it("source row is present in frozen AS229 matrix", () => {
    const text = gunzipSync(readFileSync(SOURCE_GZ)).toString("utf8");
    expect(text).toMatch(/\|\s*AS-B-20\s*\|\s*N3\s*\|/);
    expect(text).toContain("x^{4}+x^{2}y^{2}+y^{4}");
    expect(text).toContain("\\left(x^{2} - x y + y^{2}\\right) \\left(x^{2} + x y + y^{2}\\right)");
  });

  it("factors into two quadratic factors equivalent to the original", () => {
    const factored = evaluate(`factor(${ORIGINAL})`).replace(/\s+/g, "");
    expect(evaluate(`(${factored})-(${ORIGINAL})`).trim()).toBe("0");
    expect(evaluate(`(${factored})-(${EXPECTED})`).trim()).toBe("0");
    expect(factored).toMatch(/\(/);
  });
});
