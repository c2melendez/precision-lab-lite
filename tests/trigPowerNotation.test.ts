import { describe, expect, it } from "vitest";
import { parseExpression } from "../src/engine/parsing";
import { evaluate, toLatex } from "../src/engine/algebriteClient";
import katex from "katex";

describe("trigonometric power notation", () => {
  it.each([
    ["\\sin^{3}\\left(x\\right)", "\\sin\\left(x\\right)^{3}"],
    ["\\cos^5(2x)", "\\cos(2x)^5"],
    ["tan^4(x)", "tan(x)^4"],
  ])("parses both notations equivalently", (traditional, postfix) => {
    const a = parseExpression(traditional, "RAD").algebrite;
    const b = parseExpression(postfix, "RAD").algebrite;
    expect(evaluate(a)).toBe(evaluate(b));
  });

  it("prints powers before the function argument", () => {
    expect(toLatex("-cos(x)+cos(x)^3/3")).toMatch(/\\cos\^\{3\}\(x\)/);
    expect(toLatex("-cos(x)+cos(x)^3/3")).not.toMatch(/cos\(x\)\^3/);
  });

  it("keeps the denominator of a trig-power fraction and renders it", () => {
    const latex = toLatex("-cos(x)+1/3*cos(x)^3") + " + C";
    expect(latex).toContain("\\frac{\\cos^{3}(x)}{3}");
    expect(katex.renderToString(latex, { throwOnError: true })).toContain("mfrac");
  });
});
