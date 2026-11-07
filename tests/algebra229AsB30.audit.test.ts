import { describe, expect, it } from "vitest";
import { evaluate } from "../src/engine/algebriteClient";
import { gunzipSync } from "node:zlib";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE_GZ = join(ROOT, "qa/certification/legacy_sources/matriz_algebra_simbolica.md.gz");
const INPUT = "\\text{¿es primo }1000000007?";
const ORIGINAL = 1000000007;
const EXPECTED = "sí, es primo";

function trialDivisionIsPrime(value: number): boolean {
  if (!Number.isSafeInteger(value) || value < 2) return false;
  for (let divisor = 2; divisor * divisor <= value; divisor++) {
    if (value % divisor === 0) return false;
  }
  return true;
}

describe("Algebra229 AS-B-30 valor: ¿es primo 1000000007?", () => {
  it("matches every frozen source-row contract cell", () => {
    const text = gunzipSync(readFileSync(SOURCE_GZ)).toString("utf8");
    const sourceRow = text.split(/\r?\n/).find((line) => /^\|\s*AS-B-30\s*\|/.test(line))?.trim();
    expect(sourceRow).toBeTruthy();
    const cells = sourceRow!.split("|").map((cell) => cell.trim());
    expect(cells).toHaveLength(8);
    expect(cells.slice(1, 7)).toEqual([
      "AS-B-30",
      "N3",
      "`valor`",
      "`\\text{¿es primo }1000000007?`",
      "sí, es primo",
      "",
    ]);
    expect(cells[7]).toBe("");
  });

  it("returns the exact contract answer for the frozen question", () => {
    expect(evaluate(INPUT)).toBe(EXPECTED);
  });

  it("independent trial-division oracle confirms primality and rejects a composite control", () => {
    expect(trialDivisionIsPrime(ORIGINAL)).toBe(true);
    expect(evaluate(INPUT)).toBe(EXPECTED);

    const composite = 1000000008;
    expect(trialDivisionIsPrime(composite)).toBe(false);
    expect(evaluate(`primo(${composite})`)).toBe("no, es compuesto");
  });

  it("keeps the boundary cases explicit", () => {
    expect(evaluate("primo(2)")).toBe("sí, es primo");
    expect(evaluate("primo(1)")).toBe("no, no es primo");
  });
});
