import { describe, expect, it } from "vitest";
import { solveODE } from "../src/engine/stepEngine/ode";
import { ErrorCode } from "../src/types";

describe("Suite exhaustiva original — Módulo 4: EDO", () => {
  it("y'=2x produce solución general", () => {
    const r = solveODE("y'=2x");
    expect(r.resultLatex).toContain("x^2");
    expect(r.resultLatex).toContain("C_1");
  });

  it("y'=2x, y(0)=1 determina la constante", () => {
    const r = solveODE("y'=2x, y(0)=1");
    expect(r.resultLatex.replace(/\s/g, "")).toContain("x^2");
    expect(r.resultLatex).not.toContain("C_1");
  });

  it("segundo orden homogénea con coeficientes constantes", () => {
    const r = solveODE("y''+3y'+2y=0");
    expect(r.resultLatex).toContain("C_1");
    expect(r.resultLatex).toContain("C_2");
  });

  it("segundo orden no homogénea con término constante", () => {
    const r = solveODE("y''+3y'+2y=4");
    expect(r.resultLatex).toContain("C_1");
    expect(r.resultLatex).toContain("C_2");
    expect(r.resultLatex).toContain("2");
  });

  it("dependencia y'=y se rechaza explícitamente por alcance actual", () => {
    try {
      solveODE("y'=y");
      throw new Error("expected rejection");
    } catch (e) {
      expect((e as { code?: ErrorCode }).code).toBe(ErrorCode.UNSUPPORTED_OPERATION);
    }
  });

  it("orden 3 se rechaza explícitamente", () => {
    try {
      solveODE("y'''=0");
      throw new Error("expected rejection");
    } catch (e) {
      expect((e as { code?: ErrorCode }).code).toBe(ErrorCode.UNSUPPORTED_OPERATION);
    }
  });

  it("sin derivada se rechaza como parse error", () => {
    try {
      solveODE("y=2x");
      throw new Error("expected rejection");
    } catch (e) {
      expect((e as { code?: ErrorCode }).code).toBe(ErrorCode.PARSE_ERROR);
    }
  });
});
