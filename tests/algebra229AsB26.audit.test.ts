import { describe, expect, it } from "vitest";
import { evaluate } from "../src/engine/algebriteClient";
import { gunzipSync } from "node:zlib";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE_GZ = join(ROOT, "qa/certification/legacy_sources/matriz_algebra_simbolica.md.gz");
const INPUT = "factor(360)";
const EXPECTED = "2^3*3^2*5";

describe("Algebra229 AS-B-26 factor entero 360", () => {
  it("source row is present in frozen AS229 matrix", () => {
    const text = gunzipSync(readFileSync(SOURCE_GZ)).toString("utf8");
    expect(text).toMatch(/\|\s*AS-B-26\s*\|\s*N2\s*\|/);
    expect(text).toContain("factorizar el entero ");
  });

  it("returns the ASCII prime factorization of 360", () => {
    const result = evaluate(INPUT).replace(/\s+/g, "");
    expect(result).toBe(EXPECTED);
  });

  it("result is equivalent to 360", () => {
    const result = evaluate(INPUT).replace(/\s+/g, "");
    expect(evaluate(`(${result})-360`).trim()).toBe("0");
  });
});
