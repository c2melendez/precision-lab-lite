import { describe, expect, it } from "vitest";
import { evaluate } from "../src/engine/algebriteClient";
import { gunzipSync } from "node:zlib";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE_GZ = join(ROOT, "qa/certification/legacy_sources/matriz_algebra_simbolica.md.gz");
const ORIGINAL = "a*x+a*y+b*x+b*y";

describe("Algebra229 AS-B-11 factor ax+ay+bx+by", () => {
  it("source row is present in frozen AS229 matrix", () => {
    const text = gunzipSync(readFileSync(SOURCE_GZ)).toString("utf8");
    expect(text).toMatch(/\|\s*AS-B-11\s*\|\s*N2\s*\|/);
    expect(text).toContain("ax+ay+bx+by");
    expect(text).toContain("\\left(a + b\\right) \\left(x + y\\right)");
  });

  it("factors by grouping into a product of two binomials equal to the original", () => {
    const factored = evaluate(`factor(${ORIGINAL})`).replace(/\s+/g, "");
    expect(evaluate(`(${factored})-(${ORIGINAL})`).trim()).toBe("0");
    expect(evaluate(`(${factored})-((a+b)*(x+y))`).trim()).toBe("0");
    expect(factored).toMatch(/^\(.+\)\*\(.+\)$/);
  });
});
