import { describe, expect, it } from "vitest";
import { evaluate } from "../src/engine/algebriteClient";
import { gunzipSync } from "node:zlib";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE_GZ = join(ROOT, "qa/certification/legacy_sources/matriz_algebra_simbolica.md.gz");
const ORIGINAL = "a^3+b^3";

describe("Algebra229 AS-B-17 factor a^3+b^3", () => {
  it("source row is present in frozen AS229 matrix", () => {
    const text = gunzipSync(readFileSync(SOURCE_GZ)).toString("utf8");
    expect(text).toMatch(/\|\s*AS-B-17\s*\|\s*N2\s*\|/);
    expect(text).toContain("a^{3}+b^{3}");
    expect(text).toContain("\\left(a + b\\right) \\left(a^{2} - a b + b^{2}\\right)");
  });

  it("factors into (a+b)(a^2-ab+b^2) equivalent to the original", () => {
    const factored = evaluate(`factor(${ORIGINAL})`).replace(/\s+/g, "");
    expect(evaluate(`(${factored})-(${ORIGINAL})`).trim()).toBe("0");
    expect(evaluate(`(${factored})-((a+b)*(a^2-a*b+b^2))`).trim()).toBe("0");
    expect(factored).toMatch(/\(/);
  });
});
