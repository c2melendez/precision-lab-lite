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
const SAMPLES = [-10, -3, -1, 0, 1, 2, 5, 10];

type ComplexPair = readonly [number, number];

function multiplyComplex(a: ComplexPair, b: ComplexPair): ComplexPair {
  return [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
}

describe("Algebra229 AS-B-25 factor x^2+1 sobre ℂ", () => {
  it("matches all seven semantic cells of the frozen source row", () => {
    const text = gunzipSync(readFileSync(SOURCE_GZ)).toString("utf8");
    const sourceRow = text.split(/\r?\n/).find((line) => /^\|\s*AS-B-25\s*\|/.test(line))?.trim();
    expect(sourceRow).toBeTruthy();
    const cells = sourceRow!.split("|").map((cell) => cell.trim());
    expect(cells).toHaveLength(8);
    expect(cells.slice(1, 7)).toEqual([
      "AS-B-25",
      "N3",
      "`factorizar`",
      "`x^{2}+1\\ \\text{sobre }\\mathbb{C}`",
      "`\\left(x - i\\right) \\left(x + i\\right)`",
      "Sobre ℂ se descompone.",
    ]);
    expect(cells[7]).toBe("");
  });

  it("returns the exact ASCII imaginary-unit form only for explicit complex-domain input", () => {
    expect(evaluate(INPUT).replace(/\s+/g, "")).toBe(EXPECTED);
  });

  it("the complex factorization is symbolically equivalent to x^2+1", () => {
    const result = evaluate(INPUT).replace(/\s+/g, "");
    expect(evaluate(`(${result})-(x^2+1)`).trim()).toBe("0");
  });

  it("independent complex multiplication oracle matches eight integer samples", () => {
    for (const x of SAMPLES) {
      const product = multiplyComplex([x, -1], [x, 1]);
      expect(product[0]).toBe(x ** 2 + 1);
      expect(product[1]).toBe(0);
    }
  });

  it("plain factor(x^2+1) without the complex suffix is not factored over C", () => {
    const result = evaluate("factor(x^2+1)").replace(/\s+/g, "");
    expect(result).not.toBe(EXPECTED);
    expect(evaluate(`(${result})-(x^2+1)`).trim()).toBe("0");
  });
});
