import { describe, expect, it } from "vitest";
import { evaluate } from "../src/engine/algebriteClient";
import { gunzipSync } from "node:zlib";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE_GZ = join(ROOT, "qa/certification/legacy_sources/matriz_algebra_simbolica.md.gz");
const INPUT = "factor(x^2+1) sobre ℂ";
const EXPECTED = "(x-i)*(x+i)";

describe("Algebra229 AS-B-25 factor x^2+1 sobre ℂ", () => {
  it("source row is present in frozen AS229 matrix", () => {
    const text = gunzipSync(readFileSync(SOURCE_GZ)).toString("utf8");
    expect(text).toMatch(/\|\s*AS-B-25\s*\|\s*N3\s*\|/);
    expect(text).toContain("Sobre ℂ se descompone.");
  });

  it("returns the ASCII imaginary-unit form over the complexes", () => {
    const result = evaluate(INPUT).replace(/\s+/g, "");
    expect(result).toBe(EXPECTED);
  });

  it("result is equivalent to x^2+1", () => {
    const result = evaluate(INPUT).replace(/\s+/g, "");
    expect(evaluate(`(${result})-(x^2+1)`).trim()).toBe("0");
  });

  it("plain factor(x^2+1) without the complex suffix is not factored over C", () => {
    const result = evaluate("factor(x^2+1)").replace(/\s+/g, "");
    expect(result).not.toBe(EXPECTED);
  });
});
