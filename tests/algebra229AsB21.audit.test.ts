import { describe, expect, it } from "vitest";
import { evaluate } from "../src/engine/algebriteClient";
import { gunzipSync } from "node:zlib";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE_GZ = join(ROOT, "qa/certification/legacy_sources/matriz_algebra_simbolica.md.gz");
const ORIGINAL = "(x^2+1)^2-4*x^2";
const EXPECTED = "(x-1)^2*(x+1)^2";

describe("Algebra229 AS-B-21 factor (x^2+1)^2-4x^2", () => {
  it("source row is present in frozen AS229 matrix", () => {
    const text = gunzipSync(readFileSync(SOURCE_GZ)).toString("utf8");
    expect(text).toMatch(/\|\s*AS-B-21\s*\|\s*N3\s*\|/);
    expect(text).toContain("\\left(x - 1\\right)^{2} \\left(x + 1\\right)^{2}");
  });

  it("factors into a product equivalent to the original and to (x-1)^2(x+1)^2", () => {
    const factored = evaluate(`factor(${ORIGINAL})`).replace(/\s+/g, "");
    expect(evaluate(`(${factored})-(${ORIGINAL})`).trim()).toBe("0");
    expect(evaluate(`(${factored})-(${EXPECTED})`).trim()).toBe("0");
    expect(factored).toMatch(/\(/);
  });

  it("irreducible guard: x^2+1 does not become a product of factors (AS-B-22 regression)", () => {
    const result = evaluate("factor(x^2+1)").replace(/\s+/g, "");
    expect(result).not.toMatch(/\)\*\(/);
  });
});
