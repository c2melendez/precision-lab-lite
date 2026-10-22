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

/** Canal decimal de 6 dígitos de Lite (puede terminar en "..."). */
function approx(input: string): number {
  return Number(
    evaluate(`float(${parseExpression(input, "RAD").algebrite})`)
      .trim()
      .replace(/\.\.\.$/, ""),
  );
}

function equivalent(left: string, right: string): boolean {
  return evaluate(`(${left})-(${right})`).replace(/\s+/g, "") === "0";
}

function errorCode(input: string): string | undefined {
  try {
    evaluate(parseExpression(input, "RAD").algebrite);
  } catch (error) {
    return (error as { code?: string }).code;
  }
  return undefined;
}

describe("Log/Exp matrix EV-T-01..12 (trigonométricas, hiperbólicas e inversas)", () => {
  it("the frozen matrix contains the 12 rows", () => {
    for (let index = 1; index <= 12; index += 1) {
      const id = `EV-T-${String(index).padStart(2, "0")}`;
      expect(rowOf(id), `${id} row missing`).not.toBe("");
    }
  });

  it("anchors the frozen rows and their documented oracles", () => {
    expect(rowOf("EV-T-01")).toContain("\\ln\\left(\\sin\\frac{\\pi}{2}\\right)");
    expect(rowOf("EV-T-02")).toContain("e^{\\sin(\\pi/6)}");
    expect(rowOf("EV-T-03")).toContain("\\sqrt{1+\\tan^{2}\\frac{\\pi}{3}}");
    expect(rowOf("EV-T-04")).toContain("\\ln\\left(\\tan\\frac{\\pi}{4}\\right)");
    expect(rowOf("EV-T-05")).toContain("\\ln(\\cosh 1)");
    expect(rowOf("EV-T-05")).toContain("0.433780830");
    expect(rowOf("EV-T-06")).toContain("\\arctan\\left(e^{0}\\right)");
    expect(rowOf("EV-T-07")).toContain("\\sin\\left(10^{22}\\right)");
    expect(rowOf("EV-T-07")).toContain("-0.852200850");
    expect(rowOf("EV-T-08")).toContain("e^{i\\pi/2}");
    expect(rowOf("EV-T-09")).toContain("\\operatorname{arsinh}");
    expect(rowOf("EV-T-10")).toContain("\\operatorname{artanh}");
    expect(rowOf("EV-T-11")).toContain("\\ln\\left(\\cos\\frac{\\pi}{2}\\right)");
    expect(rowOf("EV-T-12")).toContain("\\sqrt{\\cos\\pi}");
  });

  it("keeps the documented exact values", () => {
    const exact: Array<[string, string, string]> = [
      ["EV-T-01", "\\ln\\left(\\sin\\frac{\\pi}{2}\\right)", "0"],
      ["EV-T-03", "\\sqrt{1+\\tan^{2}\\frac{\\pi}{3}}", "2"],
      ["EV-T-04", "\\ln\\left(\\tan\\frac{\\pi}{4}\\right)", "0"],
      ["EV-T-06", "\\arctan\\left(e^{0}\\right)", "pi/4"],
      ["EV-T-09", "\\operatorname{arsinh}\\left(\\frac{e-e^{-1}}{2}\\right)", "1"],
      ["EV-T-10", "\\exp\\left(\\operatorname{artanh}\\frac{1}{2}\\right)", "sqrt(3)"],
    ];
    for (const [id, input, expected] of exact) {
      expect(rowOf(id), `${id} row present`).not.toBe("");
      expect(equivalent(run(input), expected), `${input} != ${expected}`).toBe(true);
    }
  });

  it("preserves the exact form of EV-T-02 and EV-T-10 (no decimal-only output)", () => {
    // EV-T-02: el oráculo es \sqrt{e}; exp(1/2) es la forma exacta equivalente.
    expect(run("e^{\\sin(\\pi/6)}")).toBe("exp(1/2)");
    expect(equivalent(run("e^{\\sin(\\pi/6)}"), "sqrt(e)")).toBe(true);
    // EV-T-10: el oráculo es \sqrt{3}; 3^(1/2) es la forma exacta equivalente
    // (identidad exp(atanh(1/2)) = sqrt(3)). Nunca un decimal aproximado.
    expect(run("\\exp\\left(\\operatorname{artanh}\\frac{1}{2}\\right)")).toBe("3^(1/2)");
    expect(equivalent(run("\\exp\\left(\\operatorname{artanh}\\frac{1}{2}\\right)"), "sqrt(3)")).toBe(true);
  });

  it("EV-T-07 preserves the exact unevaluated sine and reduces the argument numerically", () => {
    // Regla 2 del protocolo: la fila \approx exige conservar una forma exacta.
    expect(run("\\sin\\left(10^{22}\\right)")).toMatch(/^sin\(1\d+\)$/);
    expect(Math.abs(approx("\\sin\\left(10^{22}\\right)") - -0.85220085)).toBeLessThanOrEqual(1e-6);
  });

  it("EV-T-08 and EV-T-12 take the documented complex branch i", () => {
    expect(run("e^{i\\pi/2}")).toBe("i");
    expect(run("\\sqrt{\\cos\\pi}")).toBe("i");
    // Control del canal complejo: ln(-1) = i*pi, ln(0) es dominio.
    expect(run("\\ln(-1)")).toBe("i*pi");
  });

  it("EV-T-11 requires a clear DOMAIN_ERROR (log of a zero argument)", () => {
    expect(errorCode("\\ln\\left(\\cos\\frac{\\pi}{2}\\right)")).toBe(ErrorCode.DOMAIN_ERROR);
    // Cierra la fuga bilateral: log(1-1) tampoco puede seguir siendo un decimal.
    expect(errorCode("ln(1-1)")).toBe(ErrorCode.DOMAIN_ERROR);
    expect(errorCode("ln(0)")).toBe(ErrorCode.DOMAIN_ERROR);
  });

  it("matches the frozen nine-decimal reference of EV-T-05 on the numeric channel", () => {
    // Limitación declarada (paridad con EV-H-10/11 y regla 4 del protocolo):
    // el canal hiperbólico de Lite imprime 6 decimales; la fila EV-T-05 es
    // una aproximación sin forma cerrada en el CAS. Plus conserva la forma
    // exacta ln(cosh(1)) y expone result_approx.
    expect(Math.abs(approx("\\ln(\\cosh 1)") - 0.433780830)).toBeLessThanOrEqual(1e-6);
  });
});
