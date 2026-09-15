import { describe, it, expect } from "vitest";
import { solveInequalitySystemNumeric } from "../src/engine/stepEngine/linearInequalitySystem";
import type { InequalityOperator } from "../src/engine/parsing/inequalitySplit";

function c(a: number, b: number, op: InequalityOperator, rhs: number, label = "") {
  return { a, b, c: rhs, operator: op, label: label || `${a}x+${b}y ${op} ${rhs}` };
}

describe("Auditoría Módulo C — sistema de inecuaciones lineales", () => {
  it("triángulo acotado: x>=0, y>=0, x+y<=4", () => {
    const result = solveInequalitySystemNumeric([
      c(1, 0, ">=", 0),
      c(0, 1, ">=", 0),
      c(1, 1, "<=", 4),
    ]);
    expect(result.kind).toBe("bounded");
    const pts = result.vertices!.map((p) => `${p.x},${p.y}`);
    expect(new Set(pts)).toEqual(new Set(["0,0", "4,0", "0,4"]));
  });

  it("hallazgo de auditoría: vacío vía rectas paralelas (x>=5, x<=1) no se confunde con no acotado", () => {
    const result = solveInequalitySystemNumeric([c(1, 0, ">=", 5), c(1, 0, "<=", 1)]);
    expect(result.kind).toBe("empty");
  });

  it("franja no acotada, genuinamente factible (0<=x<=1), misma estructura que el caso vacío de arriba", () => {
    const result = solveInequalitySystemNumeric([c(1, 0, ">=", 0), c(1, 0, "<=", 1)]);
    expect(result.kind).toBe("unbounded");
    expect(result.vertices).toEqual([]);
  });

  it("cuadrante no acotado con 1 vértice finito: x>=0, y>=0", () => {
    const result = solveInequalitySystemNumeric([c(1, 0, ">=", 0), c(0, 1, ">=", 0)]);
    expect(result.kind).toBe("unbounded");
    expect(result.vertices).toEqual([{ x: 0, y: 0 }]);
  });

  it("vacío con 'vértices' geométricamente imposibles: x>=0,y>=0,x+y<=-1", () => {
    const result = solveInequalitySystemNumeric([c(1, 0, ">=", 0), c(0, 1, ">=", 0), c(1, 1, "<=", -1)]);
    expect(result.kind).toBe("empty");
  });
});
