import { describe, expect, it } from "vitest";
import { buildExpressionResultViews, classifyResultExpression } from "../src/engine/resultContract";

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
});
