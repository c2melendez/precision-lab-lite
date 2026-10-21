import { describe, expect, it } from "vitest";
import { evaluate } from "../src/engine/algebriteClient";
import { gunzipSync } from "node:zlib";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE_GZ = join(ROOT, "qa/certification/legacy_sources/matriz_algebra_simbolica.md.gz");
const ORIGINAL = "x^2-2";

describe("Algebra229 AS-B-23 factor x^2-2 stays irreducible over Q", () => {
  it("source row is present in frozen AS229 matrix", () => {
    const text = gunzipSync(readFileSync(SOURCE_GZ)).toString("utf8");
    expect(text).toMatch(/\|\s*AS-B-23\s*\|\s*N2\s*\|/);
    expect(text).toContain("Irreducible sobre ℚ: debe quedar igual.");
  });

  it("result is equivalent to x^2-2 and is not a product of factors", () => {
    const result = evaluate(`factor(${ORIGINAL})`).replace(/\s+/g, "");
    expect(evaluate(`(${result})-(${ORIGINAL})`).trim()).toBe("0");
    expect(result).not.toMatch(/\(/);
    expect(result).not.toMatch(/\*/);
  });
});
