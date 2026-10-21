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

function equivalent(left: string, right: string): boolean {
  return evaluate(`(${left})-(${right})`).replace(/\s+/g, "") === "0";
}

describe("Log/Exp/Rad matrix EV-R-01..14 (radicals)", () => {
  it("the frozen matrix contains the 14 radical rows", () => {
    for (let index = 1; index <= 14; index += 1) {
      const id = `EV-R-${String(index).padStart(2, "0")}`;
      expect(rowOf(id), `${id} row missing`).not.toBe("");
    }
  });

  it("keeps the documented exact integer roots, including real odd roots", () => {
    const exact: Array<[string, string]> = [
      ["\\sqrt{16}", "4"],
      ["\\sqrt[3]{27}", "3"],
      // La fila exige la raíz real de un radicando negativo con índice impar.
      ["\\sqrt[3]{-8}", "-2"],
      ["\\sqrt[4]{81}", "3"],
      ["\\sqrt[5]{-32}", "-2"],
      ["\\sqrt[3]{2}\\cdot\\sqrt[3]{4}", "2"],
      ["16^{3/4}", "8"],
    ];
    for (const [input, expected] of exact) {
      expect(equivalent(run(input), expected), `${input} != ${expected}`).toBe(true);
    }
  });

  it("returns the exact radical forms the matrix requires", () => {
    const exact: Array<[string, string]> = [
      ["\\sqrt{12}", "2*sqrt(3)"],
      ["\\sqrt{8}+\\sqrt{18}", "5*sqrt(2)"],
      ["\\sqrt{3+2\\sqrt{2}}", "1+sqrt(2)"],
      ["\\sqrt{5+2\\sqrt{6}}", "sqrt(2)+sqrt(3)"],
    ];
    for (const [input, expected] of exact) {
      expect(equivalent(run(input), expected), `${input} != ${expected}`).toBe(true);
    }
  });

  it("anchors every oracle to the frozen matrix row", () => {
    const frozen: Array<[string, string]> = [
      ["EV-R-03", "-2"],
      ["EV-R-05", "-2"],
      ["EV-R-06", "2\\sqrt{3}"],
      ["EV-R-07", "5\\sqrt{2}"],
      ["EV-R-08", "\\sqrt{2}-1"],
      ["EV-R-09", "`2`"],
      ["EV-R-10", "`8`"],
      ["EV-R-11", "1+\\sqrt{2}"],
      ["EV-R-12", "\\sqrt{2}+\\sqrt{3}"],
    ];
    for (const [id, reference] of frozen) {
      expect(rowOf(id), `${id} frozen reference`).toContain(reference);
    }
  });

  it("EV-R-08 rationalizes 1/(sqrt(2)+1) exactly (regression)", () => {
    expect(run("\\frac{1}{\\sqrt{2}+1}")).toBe("2^(1/2)-1");
    expect(equivalent(run("\\frac{1}{\\sqrt{2}-1}"), "sqrt(2)+1")).toBe(true);
    // Fuera del alcance declarado (|b - a^2| != 1) la forma se conserva.
    expect(run("\\frac{1}{1+\\sqrt{3}}")).toContain("1/(");
  });

  it("EV-R-13 uses the declared complex branch", () => {
    // La fila admite "en C: 2i" solo si la rama se declara; la declaración
    // está en qa/certification/MANUAL_CAPABILITY_GAPS.md.
    expect(equivalent(run("\\sqrt{-4}"), "2*i")).toBe(true);
  });

  it("EV-R-14 uses the declared principal convention", () => {
    // Convención declarada: la notación de potencia con exponente fraccionario
    // devuelve la rama principal (2*(-1)^(1/3) = 1 + sqrt(3)i), mientras que la
    // notación radical con índice impar (EV-R-03/05) devuelve la raíz real.
    expect(run("(-8)^{1/3}")).toBe("2*(-1)^(1/3)");
  });
});
