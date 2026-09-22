import { describe, expect, it } from "vitest";
import { residueAtRational, singularitiesOfRational } from "../src/engine/complexAnalysis";
import { ErrorCode } from "../src/types";

describe("M20 — análisis complejo racional", () => {
  it("calcula residuo de un polo simple", () => {
    expect(residueAtRational("1/(z-2)", "2")).toBe("1");
  });

  it("calcula residuo de un polo de orden 2", () => {
    expect(residueAtRational("z/(z-1)^2", "1")).toBe("1");
  });

  it("devuelve 0 si el punto no es un polo", () => {
    expect(residueAtRational("1/(z-2)", "3")).toBe("0");
  });

  it("lista singularidades racionales finitas", () => {
    expect(singularitiesOfRational("1/((z-1)*(z+2))")).toEqual(["-2", "1"]);
  });

  it("un polinomio no tiene singularidades finitas", () => {
    expect(singularitiesOfRational("z^2+1")).toEqual([]);
  });

  it("rechaza funciones trascendentes fuera del contrato racional", () => {
    expect(() => singularitiesOfRational("1/sin(z)")).toThrowError(
      expect.objectContaining({ code: ErrorCode.UNSUPPORTED_OPERATION }),
    );
  });
});
