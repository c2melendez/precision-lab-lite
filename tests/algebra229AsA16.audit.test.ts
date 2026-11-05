import { describe, expect, it } from "vitest";
import { parseExpression } from "../src/engine/parsing";
import { expand, evaluate } from "../src/engine/algebriteClient";
import { gunzipSync } from "node:zlib";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE_GZ = join(ROOT, "qa/certification/legacy_sources/matriz_algebra_simbolica.md.gz");

type GaussianInteger = readonly [number, number];
const multiply = (a: GaussianInteger, b: GaussianInteger): GaussianInteger => [
  a[0] * b[0] - a[1] * b[1],
  a[0] * b[1] + a[1] * b[0],
];

const gaussianPower = (base: GaussianInteger, exponent: number): GaussianInteger => {
  let result: GaussianInteger = [1, 0];
  for (let n = 0; n < exponent; n += 1) result = multiply(result, base);
  return result;
};

describe("Algebra229 AS-A-16 expand (1+i)^4", () => {
  it("matches the exact frozen matrix identity, input and expected result cells", () => {
    const text = gunzipSync(readFileSync(SOURCE_GZ)).toString("utf8");
    const sourceRow = text.split(/\r?\n/).find((line) => /^\|\s*AS-A-16\s*\|/.test(line))?.trim();
    expect(sourceRow).toBeTruthy();
    const cells = sourceRow!.split("|").map((cell) => cell.trim());
    expect(cells.slice(1, 6)).toEqual(["AS-A-16", "N2", "`expandir`", "`(1+i)^{4}`", "`-4`"]);
  });

  it("expands to -4 and matches an independent Gaussian-integer oracle", () => {
    expect(gaussianPower([1, 1], 4)).toEqual([-4, 0]);
    const original = parseExpression("(1+i)^4").algebrite;
    const expanded = expand(original);
    expect(evaluate(`(${expanded})-(-4)`).trim()).toBe("0");
    expect(evaluate(expanded).replace(/\s+/g, "")).toBe("-4");
    expect(expanded).not.toMatch(/\)\s*\^\s*4/);
  });
});
