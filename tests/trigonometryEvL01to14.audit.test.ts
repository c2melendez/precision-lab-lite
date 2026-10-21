import { describe, expect, it } from "vitest";
import { parseExpression } from "../src/engine/parsing";
import { evaluate } from "../src/engine/algebriteClient";
import { ErrorCode } from "../src/types";
import { gunzipSync } from "node:zlib";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE_GZ = join(ROOT, "qa/certification/legacy_sources/matriz_log_exp_radicales.md.gz");
const MATRIX = gunzipSync(readFileSync(SOURCE_GZ)).toString("utf8");

function rowOf(id: string): string {
  return MATRIX.split("\n").find((line) => new RegExp(`\\|\\s*${id}\\s*\\|`).test(line)) ?? "";
}

function run(input: string): string {
  return evaluate(parseExpression(input, "RAD").algebrite).replace(/\s+/g, "");
}

function approx(input: string): number {
  return Number(
    evaluate(`float(${parseExpression(input, "RAD").algebrite})`)
      .trim()
      .replace(/\.\.\.$/, ""),
  );
}

interface AppErr {
  code?: string;
  message?: string;
}

function domainError(input: string): AppErr {
  try {
    run(input);
  } catch (error) {
    return error as AppErr;
  }
  throw new Error(`expected a DOMAIN_ERROR for ${input}`);
}

describe("EV-L-01..14 logarithms in the frozen matrix", () => {
  it("all source rows exist", () => {
    for (let i = 1; i <= 14; i += 1) {
      expect(rowOf(`EV-L-${String(i).padStart(2, "0")}`)).not.toBe("");
    }
  });

  it("exact values (L01, L02, L03, L04, L06, L07, L10)", () => {
    expect(run("\\ln\\left(e^{3}\\right)")).toBe("3");
    expect(run("\\log_{2}(8)")).toBe("3");
    expect(run("\\log_{10}(0.001)")).toBe("-3");
    expect(run("\\log_{3}\\left(\\frac{1}{27}\\right)")).toBe("-3");
    expect(run("\\log_{4}(8)")).toBe("3/2");
    expect(run("\\log_{8}(2)")).toBe("1/3");
    expect(run("\\ln\\left(\\sqrt{e}\\right)")).toBe("1/2");
  });

  it("approximations (L05, L08, L11) keep the exact form and match numerically", () => {
    expect(approx("\\ln 2")).toBeCloseTo(0.693147181, 6);
    expect(run("\\log_{2}(3)")).toBe("log(3)/log(2)");
    expect(approx("\\log_{2}(3)")).toBeCloseTo(1.584962501, 6);
    expect(run("\\ln\\left(10^{50}\\right)")).toBe("50*log(10)");
    expect(approx("\\ln\\left(10^{50}\\right)")).toBeCloseTo(115.12925465, 6);
  });

  it("undefined and complex values (L12, L13)", () => {
    const zero = domainError("\\ln(0)");
    expect(zero.code).toBe(ErrorCode.DOMAIN_ERROR);
    expect(zero.message ?? "").toMatch(/logaritmo.*no definido/i);
    expect(run("\\ln(-1)")).toBe("i*pi");
  });

  it("invalid base (L14) reports a clear DOMAIN_ERROR", () => {
    for (const input of ["\\log_{1}(5)", "\\log_{0}(5)", "\\log_{-2}(5)"]) {
      const err = domainError(input);
      expect(err.code).toBe(ErrorCode.DOMAIN_ERROR);
      expect(err.message ?? "").toMatch(/base de logaritmo inválida/i);
    }
  });
});
