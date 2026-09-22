import { describe, expect, it } from "vitest";
import { detectComplexAnalysisIntent } from "../src/engine/parsing/complexAnalysisIntent";
import { ErrorCode } from "../src/types";

describe("M20 — detector Res/Sing", () => {
  it("detecta la plantilla real de Res de MathLive", () => {
    expect(
      detectComplexAnalysisIntent("\\mathrm{Res}\\left(\\frac{1}{z-2},z=2\\right)"),
    ).toEqual({
      kind: "residue",
      expressionLatex: "\\frac{1}{z-2}",
      pointLatex: "2",
    });
  });

  it("detecta Sing con paréntesis anidados", () => {
    expect(
      detectComplexAnalysisIntent("\\mathrm{Sing}\\left(\\frac{1}{(z-1)(z+2)}\\right)"),
    ).toEqual({
      kind: "singularities",
      expressionLatex: "\\frac{1}{(z-1)(z+2)}",
    });
  });

  it("no intercepta expresiones normales", () => {
    expect(detectComplexAnalysisIntent("sin(x)+1")).toBeNull();
  });

  it("rechaza Res sin z=punto", () => {
    expect(() => detectComplexAnalysisIntent("Res(1/(z-2),2)")).toThrowError(
      expect.objectContaining({ code: ErrorCode.PARSE_ERROR }),
    );
  });
});
