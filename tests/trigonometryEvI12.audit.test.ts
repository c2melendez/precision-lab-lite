import { describe, expect, it } from "vitest";
import { parseExpression } from "../src/engine/parsing";
import { evaluate } from "../src/engine/algebriteClient";
import { ErrorCode } from "../src/types";
import { gunzipSync } from "node:zlib";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE_GZ = join(ROOT, "qa/certification/legacy_sources/ejercicios_trigonometria.md.gz");

interface AppErr {
  code?: string;
  message?: string;
}

function run(input: string): string {
  return evaluate(parseExpression(input, "RAD").algebrite).replace(/\s+/g, "");
}

function domainError(input: string): AppErr {
  try {
    run(input);
  } catch (error) {
    return error as AppErr;
  }
  throw new Error(`expected a DOMAIN_ERROR for ${input}`);
}

describe("Trigonometry EV-I-12 arcsin(2) outside the real domain", () => {
  it("official EV-I-12 row exists in frozen matrix and requires a clear error", () => {
    const text = gunzipSync(readFileSync(SOURCE_GZ)).toString("utf8");
    const row = text.split("\n").find((line) => /\|\s*EV-I-12\s*\|/.test(line)) ?? "";
    expect(row).not.toBe("");
    expect(row).toContain("\\arcsin(2)");
    expect(row.toLowerCase()).toContain("fuera del dominio real");
    expect(row.toLowerCase()).toContain("error claro");
  });

  it("arcsin(2) and arccos(2) raise DOMAIN_ERROR instead of echoing the call", () => {
    for (const input of ["arcsin(2)", "arccos(2)", "arcsin(-2)", "arccos(-1.5)"]) {
      const err = domainError(input);
      expect(err.code).toBe(ErrorCode.DOMAIN_ERROR);
      expect(err.message ?? "").toMatch(/fuera del dominio real/i);
    }
  });

  it("values inside [-1, 1] and symbolic arguments keep working", () => {
    expect(run("arcsin(1/2)")).toBe("1/6*pi");
    expect(run("arcsin(1)")).toBe("1/2*pi");
    expect(run("arccos(-1)")).toBe("pi");
    expect(run("arcsin(x)")).toBe("arcsin(x)");
  });
});
