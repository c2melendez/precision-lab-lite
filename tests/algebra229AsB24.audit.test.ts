import { describe, expect, it } from "vitest";
import { evaluate } from "../src/engine/algebriteClient";
import { gunzipSync } from "node:zlib";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE_GZ = join(ROOT, "qa/certification/legacy_sources/matriz_algebra_simbolica.md.gz");
const INPUT = "factor(x^2-2) sobre ℝ";
const EXPECTED = "(x-sqrt(2))*(x+sqrt(2))";

describe("Algebra229 AS-B-24 factor x^2-2 sobre ℝ", () => {
  it("source row is present in frozen AS229 matrix", () => {
    const text = gunzipSync(readFileSync(SOURCE_GZ)).toString("utf8");
    expect(text).toMatch(/\|\s*AS-B-24\s*\|\s*N3\s*\|/);
    expect(text).toContain("Con raíces permitidas");
  });

  it("returns the ASCII sqrt form over the reals", () => {
    const result = evaluate(INPUT).replace(/\s+/g, "");
    expect(result).toBe(EXPECTED);
  });

  it("result is equivalent to x^2-2", () => {
    const result = evaluate(INPUT).replace(/\s+/g, "");
    expect(evaluate(`(${result})-(x^2-2)`).trim()).toBe("0");
  });
});
