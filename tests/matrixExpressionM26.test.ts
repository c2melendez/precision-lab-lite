import { describe, expect, it } from "vitest";
import { evaluateMatrixExpression } from "../src/engine/matrixExpression";
import { toFractionMatrix } from "../src/engine/matrixOps";

const env = {
  A: toFractionMatrix([[1,2],[3,4]]),
  B: toFractionMatrix([[5,6],[7,8]]),
  C: toFractionMatrix([[2,0],[0,2]]),
  D: toFractionMatrix([[1,0],[0,1]]),
  E: toFractionMatrix([[1,2,3],[4,5,6]]),
  F: toFractionMatrix([[2,0],[0,3]]),
};

function matrixText(value: ReturnType<typeof evaluateMatrixExpression>) {
  expect(value.kind).toBe("matrix");
  if (value.kind !== "matrix") throw new Error("expected matrix");
  return value.value.map((row) => row.map((cell) => cell.toFraction()));
}

describe("M26 — expresiones matriciales A-F", () => {
  it("respeta precedencia: A+B*C", () => {
    const result = evaluateMatrixExpression("A+B*C", env);
    expect(matrixText(result)).toEqual([["11","14"],["17","20"]]);
  });

  it("respeta paréntesis: (A+B)*C", () => {
    const result = evaluateMatrixExpression("(A+B)*C", env);
    expect(matrixText(result)).toEqual([["12","16"],["20","24"]]);
  });

  it("evalúa potencia entera", () => {
    const result = evaluateMatrixExpression("A^2", env);
    expect(matrixText(result)).toEqual([["7","10"],["15","22"]]);
  });

  it("evalúa funciones escalares det/tr/rank y aritmética escalar", () => {
    const result = evaluateMatrixExpression("det(A)+tr(B)-rank(C)", env);
    expect(result.kind).toBe("scalar");
    if (result.kind !== "scalar") throw new Error("expected scalar");
    // det(A)=-2, tr(B)=13, rank(C)=2
    expect(result.value.toFraction()).toBe("9");
  });

  it("permite multiplicación escalar derivada de una función", () => {
    const result = evaluateMatrixExpression("det(F)*A", env);
    expect(matrixText(result)).toEqual([["6","12"],["18","24"]]);
  });

  it("evalúa inv/ref/rref/transpose", () => {
    expect(matrixText(evaluateMatrixExpression("inv(C)", env))).toEqual([["1/2","0"],["0","1/2"]]);
    expect(matrixText(evaluateMatrixExpression("transpose(E)", env))).toEqual([["1","4"],["2","5"],["3","6"]]);
    expect(matrixText(evaluateMatrixExpression("rref(A)", env))).toEqual([["1","0"],["0","1"]]);
    expect(matrixText(evaluateMatrixExpression("ref(A)", env))).toHaveLength(2);
  });

  it("rechaza dimensiones incompatibles", () => {
    expect(() => evaluateMatrixExpression("A+E", env)).toThrow();
    expect(() => evaluateMatrixExpression("E*A", env)).toThrow();
  });

  it("rechaza funciones y símbolos fuera de la gramática", () => {
    expect(() => evaluateMatrixExpression("eigen(A)", env)).toThrow();
    expect(() => evaluateMatrixExpression("A/B", env)).toThrow();
    expect(() => evaluateMatrixExpression("A[0]", env)).toThrow();
  });

  it("rechaza exponentes fuera del contrato", () => {
    expect(() => evaluateMatrixExpression("A^11", env)).toThrow();
    expect(() => evaluateMatrixExpression("A^-1", env)).toThrow();
  });

  it("rechaza expresiones patológicamente profundas", () => {
    const deep = "(".repeat(25) + "A" + ")".repeat(25);
    expect(() => evaluateMatrixExpression(deep, env)).toThrow();
  });
});
