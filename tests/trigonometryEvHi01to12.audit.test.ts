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
const MATRIX = gunzipSync(readFileSync(SOURCE_GZ)).toString("utf8");

interface AppErr {
  code?: string;
  message?: string;
}

function rowOf(id: string): string {
  return MATRIX.split("\n").find((line) => new RegExp(`\\|\\s*${id}\\s*\\|`).test(line)) ?? "";
}

function run(input: string): string {
  return String(evaluate(parseExpression(input, "RAD").algebrite)).replace(/\s+/g, "");
}

/** Reads the numeric value of the public engine result, never the echo of the call. */
function numeric(input: string): number {
  const raw = String(evaluate(parseExpression(input, "RAD").algebrite)).replace(/\.\.\.$/, "").trim();
  const value = Number(raw);
  if (!Number.isFinite(value)) throw new Error(`non-numeric engine output: ${raw}`);
  return value;
}

function domainError(input: string): AppErr {
  try {
    run(input);
  } catch (error) {
    return error as AppErr;
  }
  throw new Error(`expected a DOMAIN_ERROR for ${input}`);
}

describe("Trigonometry EV-HI-01..03 inverse hyperbolic origin", () => {
  it("rows and exact values", () => {
    expect(rowOf("EV-HI-01")).toContain("\\operatorname{arsinh}(0)");
    expect(rowOf("EV-HI-02")).toContain("\\operatorname{arcosh}(1)");
    expect(rowOf("EV-HI-03")).toContain("\\operatorname{artanh}(0)");
    expect(run("arsinh(0)")).toBe("0");
    expect(run("arcosh(1)")).toBe("0");
    expect(run("artanh(0)")).toBe("0");
  });
});

describe("Trigonometry EV-HI-04..09 inverse hyperbolic values", () => {
  const cases: Array<[string, string, string, number]> = [
    ["EV-HI-04", "arsinh(1)", "0.881373587", 0.881373587019543],
    ["EV-HI-05", "arcosh(2)", "1.316957897", 1.3169578969248166],
    ["EV-HI-06", "artanh(1/2)", "0.549306144", 0.5493061443340549],
    ["EV-HI-07", "arcsch(1)", "0.881373587", 0.881373587019543],
    ["EV-HI-08", "arsech(1/2)", "1.316957897", 1.3169578969248166],
    ["EV-HI-09", "arcoth(2)", "0.549306144", 0.5493061443340549],
  ];

  for (const [id, input, documented, expected] of cases) {
    it(`${id} row and numeric value ${input}`, () => {
      const row = rowOf(id);
      expect(row).not.toBe("");
      expect(row).toContain(documented);
      expect(numeric(input)).toBeCloseTo(expected, 6);
    });
  }
});

describe("Trigonometry EV-HI-10..12 composition and real domain", () => {
  it("EV-HI-10 sinh(arsinh(3)) is exactly 3", () => {
    expect(rowOf("EV-HI-10")).toContain("\\sinh\\left(\\operatorname{arsinh}(3)\\right)");
    expect(run("sinh(arsinh(3))")).toBe("3");
  });

  it("EV-HI-11 artanh(1) reports a clear domain error", () => {
    const row = rowOf("EV-HI-11").toLowerCase();
    expect(row).toContain("\\operatorname{artanh}(1)");
    expect(row).toContain("no definida");
    const err = domainError("artanh(1)");
    expect(err.code).toBe(ErrorCode.DOMAIN_ERROR);
  });

  it("EV-HI-12 arcosh(1/2) reports a clear real-domain error", () => {
    const row = rowOf("EV-HI-12").toLowerCase();
    expect(row).toContain("\\operatorname{arcosh}\\left(\\frac{1}{2}\\right)");
    expect(row).toContain("fuera del dominio real");
    const err = domainError("arcosh(1/2)");
    expect(err.code).toBe(ErrorCode.DOMAIN_ERROR);
  });
});
