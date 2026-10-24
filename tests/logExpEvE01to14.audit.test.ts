import { describe, expect, it } from "vitest";
import { parseExpression } from "../src/engine/parsing";
import { evaluate } from "../src/engine/algebriteClient";
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

function equivalent(left: string, right: string): boolean {
  return evaluate(`(${left})-(${right})`).replace(/\s+/g, "") === "0";
}

describe("Log/Exp matrix EV-E-01..14 (exponentials)", () => {
  it("the frozen matrix contains the 14 exponential rows", () => {
    for (let index = 1; index <= 14; index += 1) {
      const id = `EV-E-${String(index).padStart(2, "0")}`;
      expect(rowOf(id), `${id} row missing`).not.toBe("");
    }
  });

  it("keeps the documented exact values", () => {
    const exact: Array<[string, string]> = [
      ["e^{0}", "1"],
      ["2^{10}", "1024"],
      ["2^{-3}", "1/8"],
      ["8^{2/3}", "4"],
      ["27^{-1/3}", "1/3"],
      ["e^{\\ln 2+\\ln 3}", "6"],
      ["e^{i\\pi}", "-1"],
    ];
    for (const [input, expected] of exact) {
      expect(equivalent(run(input), expected), `${input} != ${expected}`).toBe(true);
    }
  });

  it("matches the nine-decimal references on the approximation channel", () => {
    // [id, entrada, referencia congelada, valor] — el oráculo del test debe
    // aparecer literalmente en la fila congelada de la matriz.
    const expected: Array<[string, string, string, number]> = [
      ["EV-E-02", "e^{-1}", "0.367879441", 0.367879441],
      ["EV-E-07", "2^{\\sqrt{2}}", "2.665144143", 2.665144143],
      ["EV-E-08", "\\pi^{e}", "22.459157718", 22.459157718],
      ["EV-E-09", "e^{\\pi}-\\pi", "19.999099979", 19.999099979],
      ["EV-E-12", "\\left(1+\\frac{1}{1000}\\right)^{1000}", "2.716923932", 2.716923932],
    ];
    for (const [id, input, frozen, reference] of expected) {
      expect(rowOf(id), `${id} frozen reference`).toContain(frozen);
      const text = run(input);
      // Protocolo, regla 2: una salida que solo imprima el decimal no
      // certifica la fila; la forma exacta debe conservarse.
      expect(text, `${id} must keep an exact form`).not.toMatch(
        /^-?\d+(\.\d+)?([eE][+-]?\d+)?$/,
      );
      expect(Math.abs(approx(input) - reference), `${input} approx`).toBeLessThanOrEqual(1e-6);
    }
    // EV-E-11 conserva la forma exacta exp(100); la referencia es relativa.
    expect(rowOf("EV-E-11")).toContain("2.688117142");
    expect(run("e^{100}")).toContain("exp(");
    const big = approx("e^{100}");
    expect(Math.abs(big / 1e43 - 2.688117142)).toBeLessThanOrEqual(1e-9);
  });

  it("EV-E-10 evaluates the sum of logarithms exactly (regression)", () => {
    expect(rowOf("EV-E-10")).toContain("`6`");
    expect(run("e^{\\ln 2+\\ln 3}")).toBe("6");
    expect(run("e^{\\ln 2}")).toBe("2");
    expect(equivalent(run("e^{\\ln 2+\\ln 3+\\ln 5}"), "30")).toBe(true);
    expect(equivalent(run("e^{\\ln 6-\\ln 2}"), "3")).toBe(true);
    // Una suma no logarítmica en el exponente no se toca.
    expect(run("e^{\\ln 2+1}")).toContain("exp(");
  });

  it("EV-E-13 resolves the complex exponential to -1", () => {
    expect(equivalent(run("e^{i\\pi}"), "-1")).toBe(true);
  });

  it("EV-E-14 returns 1 under the declared 0^0 convention", () => {
    // Convención declarada en qa/certification/MANUAL_CAPABILITY_GAPS.md:
    // la fila admite "1 por convención declarada".
    expect(equivalent(run("0^{0}"), "1")).toBe(true);
  });
});
