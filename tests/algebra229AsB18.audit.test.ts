import { describe, expect, it } from "vitest";
import { evaluate } from "../src/engine/algebriteClient";
import { compileNumeric } from "../src/engine/numericFallback";
import { gunzipSync } from "node:zlib";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE_GZ = join(ROOT, "qa/certification/legacy_sources/matriz_algebra_simbolica.md.gz");
const ORIGINAL = "x^8-1";

describe("Algebra229 AS-B-18 factor x^8-1", () => {
  it("matches every frozen source-row contract cell", () => {
    const text = gunzipSync(readFileSync(SOURCE_GZ)).toString("utf8");
    const sourceRow = text.split(/\r?\n/).find((line) => /^\|\s*AS-B-18\s*\|/.test(line))?.trim();
    expect(sourceRow).toBeTruthy();
    const cells = sourceRow!.split("|").map((cell) => cell.trim());
    expect(cells.slice(1, 8)).toEqual([
      "AS-B-18",
      "N2",
      "`factorizar`",
      "`x^{8}-1`",
      "`\\left(x - 1\\right) \\left(x + 1\\right) \\left(x^{2} + 1\\right) \\left(x^{4} + 1\\right)`",
      "",
      "",
    ]);
  });

  it("factors into (x-1)(x+1)(x^2+1)(x^4+1) verified by independent integer arithmetic", () => {
    const factored = evaluate(`factor(${ORIGINAL})`).replace(/\s+/g, "");
    expect(evaluate(`(${factored})-(${ORIGINAL})`).trim()).toBe("0");
    expect(evaluate(`(${factored})-((x-1)*(x+1)*(x^2+1)*(x^4+1))`).trim()).toBe("0");

    const samples: number[] = [0, 1, -1, 2, -2, 3, -3, 4, 5, 10];
    for (const x of samples) {
      const substituted = factored.replace(/\bx\b/g, `(${x})`);
      const actual = compileNumeric(substituted, "__no_var__")(0);
      const expected = x ** 8 - 1;
      const normalizedActual = Object.is(actual, -0) ? 0 : actual;
      expect(normalizedActual).toBe(expected);
    }
  });
});
