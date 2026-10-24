import { describe, expect, it } from "vitest";
import { evaluate } from "../src/engine/algebriteClient";
import { compileNumeric } from "../src/engine/numericFallback";
import { denestConstantRadicals } from "../src/engine/radicalDenesting";

/** Casos con denestado exacto: entrada → forma esperada. */
const DENESTABLE: Array<[string, string]> = [
  ["sqrt(2+sqrt(3))", "(sqrt(6)+sqrt(2))/2"],
  ["sqrt(2-sqrt(3))", "(sqrt(6)-sqrt(2))/2"],
  ["sqrt(3+sqrt(5))", "(sqrt(10)+sqrt(2))/2"],
  ["sqrt(7-sqrt(13))", "(sqrt(26)-sqrt(2))/2"],
  ["sqrt(5+2*sqrt(6))", "sqrt(3)+sqrt(2)"],
  ["sqrt(7+4*sqrt(3))", "2+sqrt(3)"],
  ["sqrt(10+2*sqrt(21))", "sqrt(7)+sqrt(3)"],
  ["sqrt(16-2*sqrt(15))", "sqrt(15)-1"],
  ["sqrt(2+sqrt(3))+1", "((sqrt(6)+sqrt(2))/2)+1"],
  ["1/sqrt(2+sqrt(3))", "1/((sqrt(6)+sqrt(2))/2)"],
  ["2*sqrt(2+sqrt(3))", "2*((sqrt(6)+sqrt(2))/2)"],
  ["sqrt(2+3^(1/2))", "(sqrt(6)+sqrt(2))/2"],
];

/** Casos que no tienen denestado racional o no son de la forma soportada: sin cambios. */
const UNCHANGED = [
  "sqrt(1+sqrt(2))",
  "sqrt(1-2*sqrt(2))",
  "sqrt(x+sqrt(3))",
  "sqrt(2)+sqrt(3)",
  "sqrt(3)",
  "(x+3^(1/2))^(1/2)",
];

describe("radicalDenesting: denestado exacto de raíces anidadas", () => {
  it.each(DENESTABLE)("reescribe %s como %s", (input, expected) => {
    expect(denestConstantRadicals(input).replace(/\s+/g, "")).toBe(expected);
  });

  it.each(DENESTABLE)("el resultado de %s es numéricamente igual al original", (input) => {
    const denested = denestConstantRadicals(input);
    expect(compileNumeric(denested, "__none__")(0)).toBeCloseTo(
      compileNumeric(input, "__none__")(0),
      10,
    );
  });

  it.each(UNCHANGED)("deja %s sin cambios", (input) => {
    expect(denestConstantRadicals(input)).toBe(input);
  });

  it("acepta la forma que devuelve Algebrite, (a+b*c^(1/2))^(1/2)", () => {
    expect(denestConstantRadicals("(2+3^(1/2))^(1/2)").replace(/\s+/g, "")).toBe(
      "(sqrt(6)+sqrt(2))/2",
    );
  });
});

describe("radicalDenesting dentro de evaluate (ruta CAS completa)", () => {
  it.each([
    ["sqrt(3+sqrt(5))", "(sqrt(10)+sqrt(2))/2"],
    ["sqrt(7+4*sqrt(3))", "2+sqrt(3)"],
    ["sqrt(7-sqrt(13))", "(sqrt(26)-sqrt(2))/2"],
  ])("evaluate(%s) devuelve la forma denestada", (input, expected) => {
    expect(evaluate(input).replace(/\s+/g, "")).toBe(expected);
  });

  it("no reescribe radicales anidados simbólicos", () => {
    expect(evaluate("sqrt(x+sqrt(3))")).toContain("x");
    expect(evaluate("sqrt(x+sqrt(3))")).not.toContain("sqrt(6)");
  });
});
