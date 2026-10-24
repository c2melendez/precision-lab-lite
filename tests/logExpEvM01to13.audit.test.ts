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

describe("Log/Exp matrix EV-M-01..13 (mixtas)", () => {
  it("the frozen matrix contains the 13 mixed rows", () => {
    for (let index = 1; index <= 13; index += 1) {
      const id = `EV-M-${String(index).padStart(2, "0")}`;
      expect(rowOf(id), `${id} row missing`).not.toBe("");
    }
  });

  it("keeps the documented exact values", () => {
    const exact: Array<[string, string, string, string]> = [
      ["EV-M-01", "\\ln\\left(\\sqrt[3]{e^{6}}\\right)", "2", "`2`"],
      ["EV-M-02", "e^{2\\ln 3}", "9", "`9`"],
      ["EV-M-03", "\\log_{2}\\left(\\sqrt{8}\\right)", "3/2", "\\frac{3}{2}"],
      ["EV-M-04", "f(x)=\\ln\\left(x^{2}+1\\right);\\ f\\left(\\sqrt{e-1}\\right)", "1", "`1`"],
      ["EV-M-08", "f(x)=x^{x};\\ f(2)", "4", "`4`"],
      ["EV-M-12", "f(x)=\\sqrt{x^{2}};\\ f(-3)", "3", "`3`"],
      ["EV-M-13", "f(x)=\\ln\\left(x-\\sqrt{x^{2}-1}\\right)+\\ln\\left(x+\\sqrt{x^{2}-1}\\right);\\ f(2)", "0", "`0`"],
    ];
    for (const [id, input, expected, frozen] of exact) {
      expect(rowOf(id), `${id} frozen value`).toContain(frozen);
      expect(equivalent(run(input), expected), `${input} != ${expected}`).toBe(true);
    }
  });

  it("keeps the exact form when the row prints a nine-decimal reference", () => {
    // [id, entrada, forma exacta esperada] — la fila congelada fija el oráculo
    // decimal; la forma exacta debe conservarse (protocolo, regla 2).
    const forms: Array<[string, string, string]> = [
      ["EV-M-05", "f(x)=\\sqrt[3]{x^{3}+1};\\ f(2)", "3^(2/3)"],
      ["EV-M-06", "f(x)=x^{2}e^{-x};\\ f(2)", "4*exp(-2)"],
      ["EV-M-07", "f(x)=\\frac{\\ln x}{x};\\ f(e)", "exp(-1)"],
      ["EV-M-09", "\\sqrt{2}^{\\sqrt{2}}", "2^(1/2*2^(1/2))"],
      ["EV-M-10", "\\ln\\left(\\frac{1+\\sqrt{5}}{2}\\right)", "log(1/2+1/2*5^(1/2))"],
      ["EV-M-11", "\\left(\\frac{1+\\sqrt{5}}{2}\\right)^{2}", "3/2+1/2*5^(1/2)"],
    ];
    for (const [id, input, form] of forms) {
      expect(run(input), `${id} exact form`).toBe(form);
    }
    // Las dos formas exactas de EV-M-05 y EV-M-06 son equivalentes al oráculo.
    expect(equivalent(run("f(x)=\\sqrt[3]{x^{3}+1};\\ f(2)"), "9^(1/3)")).toBe(true);
    expect(equivalent(run("f(x)=x^{2}e^{-x};\\ f(2)"), "4*e^(-2)")).toBe(true);
  });

  it("matches the nine-decimal references on the approximation channel", () => {
    // [id, entrada, referencia congelada, valor] — el oráculo del test debe
    // aparecer literalmente en la fila congelada de la matriz.
    const expected: Array<[string, string, string, number]> = [
      ["EV-M-05", "f(x)=\\sqrt[3]{x^{3}+1};\\ f(2)", "2.080083823", 2.080083823],
      ["EV-M-06", "f(x)=x^{2}e^{-x};\\ f(2)", "0.541341133", 0.541341133],
      ["EV-M-07", "f(x)=\\frac{\\ln x}{x};\\ f(e)", "0.367879441", 0.367879441],
      ["EV-M-09", "\\sqrt{2}^{\\sqrt{2}}", "1.632526919", 1.632526919],
      ["EV-M-10", "\\ln\\left(\\frac{1+\\sqrt{5}}{2}\\right)", "0.481211825", 0.481211825],
      ["EV-M-11", "\\left(\\frac{1+\\sqrt{5}}{2}\\right)^{2}", "2.618033989", 2.618033989],
    ];
    for (const [id, input, frozen, reference] of expected) {
      expect(rowOf(id), `${id} frozen reference`).toContain(frozen);
      expect(Math.abs(approx(input) - reference), `${input} approx`).toBeLessThanOrEqual(1e-6);
    }
  });

  it("EV-M-02 applies exp(k*ln r) = r^k only to exact scaled logarithms", () => {
    expect(run("e^{2\\ln 3}")).toBe("9");
    expect(run("e^{-2\\ln 3}")).toBe("1/9");
    expect(run("e^{\\ln 3}")).toBe("3");
    // Una suma no logarítmica en el exponente no se toca.
    expect(run("e^{2\\ln 3+1}")).toContain("exp(");
  });

  it("EV-M-04 reads \\left(...\\right) and balanced arguments in definition calls", () => {
    expect(run("f(x)=\\ln\\left(x^{2}+1\\right);\\ f\\left(\\sqrt{e-1}\\right)")).toBe("1");
    expect(run("f\\left(x\\right)=x^{2};\\ f\\left(3\\right)")).toBe("9");
    expect(run("f(x)=x^{2};\\ f(\\sqrt{4})")).toBe("4");
  });

  it("EV-M-13 sums conjugate logarithms to log(1) = 0", () => {
    const row = "f(x)=\\ln\\left(x-\\sqrt{x^{2}-1}\\right)+\\ln\\left(x+\\sqrt{x^{2}-1}\\right);\\ f(2)";
    expect(run(row)).toBe("0");
    expect(run("\\ln(2-\\sqrt{3})+\\ln(2+\\sqrt{3})")).toBe("0");
    // Producto 9-5 = 4, no 1: la regla no se aplica y la suma sigue simbólica.
    expect(run("\\ln(3-\\sqrt{5})+\\ln(3+\\sqrt{5})")).toContain("log(");
  });
});
