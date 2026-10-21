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
const INPUT_LATEX = "\\tan\\left(\\frac{\\pi}{2}\\right)";

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

describe("Trigonometry EV-D-12 tan(pi/2) undefined", () => {
  it("official EV-D-12 row exists in frozen matrix and declares a clear error", () => {
    const text = gunzipSync(readFileSync(SOURCE_GZ)).toString("utf8");
    const row = text.split("\n").find((line) => /\|\s*EV-D-12\s*\|/.test(line)) ?? "";
    expect(row).not.toBe("");
    expect(row).toContain(INPUT_LATEX);
    expect(row.toLowerCase()).toContain("indefinida");
    expect(row.toLowerCase()).toContain("error claro");
  });

  it("tan(pi/2) raises a clear DOMAIN_ERROR (ASCII)", () => {
    const err = domainError("tan(pi/2)");
    expect(err.code).toBe(ErrorCode.DOMAIN_ERROR);
    expect(err.message ?? "").toMatch(/tangente.*no definida/i);
  });

  it("official LaTeX tan(pi/2) raises a clear DOMAIN_ERROR", () => {
    const err = domainError(INPUT_LATEX);
    expect(err.code).toBe(ErrorCode.DOMAIN_ERROR);
    expect(err.message ?? "").toMatch(/tangente.*no definida/i);
  });

  it("keeps defined tangent values unchanged", () => {
    expect(run("tan(pi/4)")).toBe("1");
    expect(run("tan(pi)")).toBe("0");
    expect(run("tan(pi/3)")).toBe("3^(1/2)");
    expect(run("tan(0)")).toBe("0");
  });

  it("log(0) and ln(0) raise DOMAIN_ERROR instead of echoing log(0)", () => {
    for (const input of ["log(0)", "ln(0)"]) {
      const err = domainError(input);
      expect(err.code).toBe(ErrorCode.DOMAIN_ERROR);
      expect(err.message ?? "").toMatch(/logaritmo.*no definido/i);
    }
  });
});

describe("AUD-SING-01 arccot(0) avoidable singularity", () => {
  it("arccot(0) is exactly pi/2, not a division-by-zero error", () => {
    expect(run("arccot(0)")).toBe("1/2*pi");
    expect(run("\\operatorname{arccot}(0)")).toBe("1/2*pi");
  });

  it("keeps the arctan(1/x) branch for non-zero arguments (parity with Plus)", () => {
    expect(run("arccot(1)")).toBe("1/4*pi");
    expect(run("arccot(-1)")).toBe("-1/4*pi");
  });
});
