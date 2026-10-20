import { describe, expect, it } from "vitest";
import { parseExpression } from "../src/engine/parsing";
import { expand, evaluate } from "../src/engine/algebriteClient";
import { gunzipSync } from "node:zlib";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE_GZ = join(ROOT, "qa/certification/legacy_sources/matriz_algebra_simbolica.md.gz");

describe("Algebra229 AS-A-16 expand (1+i)^4", () => {
  it("source row is present in frozen AS229 matrix", () => {
    const text = gunzipSync(readFileSync(SOURCE_GZ)).toString("utf8");
    expect(text).toMatch(/\|\s*AS-A-16\s*\|\s*N2\s*\|/);
    expect(text).toContain("(1+i)^{4}");
  });

  it("expands with the imaginary unit to exactly -4", () => {
    const original = parseExpression("(1+i)^4").algebrite;
    const expanded = expand(original);
    expect(evaluate(`(${expanded})-(-4)`).trim()).toBe("0");
    expect(evaluate(expanded).replace(/\s+/g, "")).toBe("-4");
    expect(expanded).not.toMatch(/\)\s*\^\s*4/);
  });
});
