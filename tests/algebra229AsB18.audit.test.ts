import { describe, expect, it } from "vitest";
import { evaluate } from "../src/engine/algebriteClient";
import { gunzipSync } from "node:zlib";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE_GZ = join(ROOT, "qa/certification/legacy_sources/matriz_algebra_simbolica.md.gz");
const ORIGINAL = "x^8-1";

describe("Algebra229 AS-B-18 factor x^8-1", () => {
  it("source row is present in frozen AS229 matrix", () => {
    const text = gunzipSync(readFileSync(SOURCE_GZ)).toString("utf8");
    expect(text).toMatch(/\|\s*AS-B-18\s*\|\s*N2\s*\|/);
    expect(text).toContain("x^{8}-1");
    expect(text).toContain("\\left(x - 1\\right) \\left(x + 1\\right) \\left(x^{2} + 1\\right) \\left(x^{4} + 1\\right)");
  });

  it("factors into (x-1)(x+1)(x^2+1)(x^4+1) equivalent to the original", () => {
    const factored = evaluate(`factor(${ORIGINAL})`).replace(/\s+/g, "");
    expect(evaluate(`(${factored})-(${ORIGINAL})`).trim()).toBe("0");
    expect(evaluate(`(${factored})-((x-1)*(x+1)*(x^2+1)*(x^4+1))`).trim()).toBe("0");
    expect(factored).toMatch(/\(/);
  });
});
