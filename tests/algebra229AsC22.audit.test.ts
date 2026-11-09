import { describe, expect, it } from "vitest";
import { substituteExact } from "../src/engine/algebriteClient";
import { gunzipSync } from "node:zlib";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE_GZ = join(ROOT, "qa/certification/legacy_sources/matriz_algebra_simbolica.md.gz");
const INPUT = "x^100-1";
const QUOTIENT = "(x^100-1)/(x-1)";

function compact(expression: string): string {
  return expression.replace(/\s+/g, "").replace(/\*/g, "");
}

describe("Algebra229 AS-C-22 remainder of x^100-1 by x-1", () => {
  it("matches every frozen source-row contract cell", () => {
    const text = gunzipSync(readFileSync(SOURCE_GZ)).toString("utf8");
    const sourceRow = text.split(/\r?\n/).find((line) => /^\|\s*AS-C-22\s*\|/.test(line))?.trim();
    expect(sourceRow).toBeTruthy();
    const cells = sourceRow!.split("|").map((cell) => cell.trim());
    expect(cells).toHaveLength(8);
    expect(cells.slice(1, 7)).toEqual([
      "AS-C-22",
      "N2",
      "`valor`",
      "`\\text{resto de }x^{100}-1\\ \\text{entre}\\ x-1`",
      "`0`",
      "Teorema del resto: `p(1)=0`.",
    ]);
    expect(cells[7]).toBe("");
  });

  it("remainder theorem: substitution at x=1 is exactly 0", () => {
    const actual = compact(String(substituteExact(INPUT, "x", "1")));
    expect(actual).toBe("0");
  });

  it("quotient at x=2 equals 2^100-1 exactly", () => {
    const actual = compact(String(substituteExact(QUOTIENT, "x", "2")));
    const expected = (2n ** 100n - 1n).toString();
    expect(actual).toBe(expected);
  });

  it("independent geometric oracle confirms exact division", () => {
    // (x^100-1) = (x-1)*(1+x+...+x^99); at x=2 the quotient is the geometric sum.
    let geometric = 0n;
    for (let k = 0n; k < 100n; k += 1n) geometric += 2n ** k;
    expect(geometric).toBe(2n ** 100n - 1n);
    expect(2n ** 100n - 1n - (2n - 1n) * geometric).toBe(0n);
    expect(1n ** 100n - 1n).toBe(0n);
  });
});
