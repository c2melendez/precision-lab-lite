import { describe, expect, it } from "vitest";
import { evaluate } from "../src/engine/algebriteClient";
import { gunzipSync } from "node:zlib";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE_GZ = join(ROOT, "qa/certification/legacy_sources/matriz_algebra_simbolica.md.gz");
const ORIGINAL = "x^2-9";

describe("Algebra229 AS-B-02 factor x^2-9", () => {
  it("source row is present in frozen AS229 matrix", () => {
    const text = gunzipSync(readFileSync(SOURCE_GZ)).toString("utf8");
    expect(text).toMatch(/\|\s*AS-B-02\s*\|\s*N1\s*\|/);
    expect(text).toContain("x^{2}-9");
    expect(text).toContain("\\left(x - 3\\right) \\left(x + 3\\right)");
  });

  it("factors into a product equal to the original polynomial", () => {
    const factored = evaluate(`factor(${ORIGINAL})`).replace(/\s+/g, "");
    expect(evaluate(`(${factored})-(${ORIGINAL})`).trim()).toBe("0");
    expect(factored).toMatch(/\(/);
    expect(evaluate(`(${factored})-((x-3)*(x+3))`).trim()).toBe("0");
  });
});
