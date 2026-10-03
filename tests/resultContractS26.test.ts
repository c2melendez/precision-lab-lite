import { describe, expect, it } from "vitest";
import { buildComplexResultViews, buildExpressionResultViews, classifyResultExpression } from "../src/engine/resultContract";

describe("S26 result contract — classification", () => {
  it.each([
    ["42", true, "numeric"],
    ["x^2+2*x+1", false, "algebraic"],
    ["(x^2-1)/(x-1)", false, "rational"],
    ["sqrt(x+1)", false, "radical"],
    ["ln(x)", false, "logarithmic"],
    ["exp(x)", false, "exponential"],
    ["sin(x)+cos(x)", false, "trigonometric"],
    ["2+3*i", false, "complex"],
  ] as const)("%s -> %s", (expr, numeric, expected) => {
    expect(classifyResultExpression(expr, numeric)).toBe(expected);
  });

  it("crea Original y no duplica transformaciones equivalentes", () => {
    const views = buildExpressionResultViews("(x+1)^2", "x^2+2*x+1", "algebraic");
    expect(views[0]?.key).toBe("original");
    expect(new Set(views.map((view) => view.latex)).size).toBe(views.length);
  });
  it("genera las cuatro representaciones complejas para un valor único", () => {
    const views = buildComplexResultViews("2+3*i", 2, 3);
    expect(views.map((view) => view.key)).toEqual([
      "original",
      "complex_binomial",
      "complex_polar",
      "complex_trigonometric",
      "complex_exponential",
    ]);
  });
  it("expone Identidad para una reducción trigonométrica", () => {
    const views = buildExpressionResultViews(
      "sin(x)^2+cos(x)^2",
      "1",
      "trigonometric",
    );
    expect(views.some((view) => view.key === "identity")).toBe(true);
  });
});
