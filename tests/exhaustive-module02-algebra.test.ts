import { describe, expect, it } from "vitest";
import { parseExpression } from "../src/engine/parsing";
import { evaluate, expand } from "../src/engine/algebriteClient";
import { compileNumeric } from "../src/engine/numericFallback";
import { solveAlgebra } from "../src/engine/stepEngine/algebra";
import { solveInequality } from "../src/engine/inequality";
import { gaussJordan, toFractionMatrix } from "../src/engine/matrixOps";

function numeric(latex: string): number {
  const parsed = parseExpression(latex, "RAD");
  const evaluated = evaluate(parsed.algebrite);
  const fn = compileNumeric(evaluated, "__no_var__");
  return fn(0);
}

describe("Suite exhaustiva original — Módulo 2: Álgebra", () => {
  const known: Array<[string, number]> = [
    ["log(100)", 2],
    ["\\log_{2}\\left(8\\right)", 3],
    ["ln(e)", 1],
    ["exp(1)", Math.E],
    ["10^3", 1000],
    ["sqrt(81)", 9],
    ["sqrt(2)^2", 2],
  ];

  for (const [expression, expected] of known) {
    it(`${expression} = valor conocido`, () => {
      expect(numeric(expression)).toBeCloseTo(expected, 10);
    });
  }

  it("expande (x+2)^3 correctamente", () => {
    const parsed = parseExpression("(x+2)^3");
    const result = expand(parsed.algebrite).replace(/\s+/g, "");
    expect(result).toContain("x^3");
    expect(result).toContain("6*x^2");
    expect(result).toContain("12*x");
    expect(result).toContain("8");
  });

  it("resuelve x^2-5x+6=0 -> {2,3}", () => {
    const parsed = parseExpression("x^2-5x+6=0");
    const result = solveAlgebra(parsed.leftAlgebrite, parsed.rightAlgebrite, "x");
    expect(new Set(result.solutionsAlgebrite)).toEqual(new Set(["2", "3"]));
  });

  it("detecta ecuación multivariable para rechazo explícito en UI", () => {
    const parsed = parseExpression("x+y=0");
    expect(parsed.freeVariables.sort()).toEqual(["x", "y"]);
  });

  it("sistema 5x5 único", () => {
    const solution = gaussJordan(toFractionMatrix([
      [1,0,0,0,0,1],
      [0,1,0,0,0,2],
      [0,0,1,0,0,3],
      [0,0,0,1,0,4],
      [0,0,0,0,1,5],
    ]), ["x1","x2","x3","x4","x5"]);
    expect(solution.kind).toBe("unique");
    expect(solution.values?.map(v => v.toFraction())).toEqual(["1","2","3","4","5"]);
  });

  it("sistema compatible indeterminado", () => {
    const solution = gaussJordan(toFractionMatrix([
      [1,1,2],
      [2,2,4],
    ]), ["x","y"]);
    expect(solution.kind).toBe("infinite");
  });

  it("sistema incompatible", () => {
    const solution = gaussJordan(toFractionMatrix([
      [1,1,1],
      [1,1,2],
    ]), ["x","y"]);
    expect(solution.kind).toBe("none");
  });

  for (const [expression, expected] of [
    ["2*x+1<7", "x < 3"],
    ["x^2<4", "-2 < x < 2"],
    ["x^2<0", "No tiene solución real."],
  ] as Array<[string,string]>) {
    it(`inecuación ${expression}`, () => {
      const parsed = parseExpression(expression, "RAD");
      const result = solveInequality(
        parsed.algebrite,
        parsed.inequalityOperator!,
        parsed.freeVariables[0] ?? "x",
      );
      expect(result.resultText).toBe(expected);
    });
  }

  it("rechaza log con tres argumentos", () => {
    expect(() => parseExpression("log(8,2,3)")).toThrow();
  });

  it("detecta inecuación con dos variables para rechazo explícito en UI", () => {
    const parsed = parseExpression("x+y<5", "RAD");
    expect(parsed.freeVariables.sort()).toEqual(["x", "y"]);
  });
});
