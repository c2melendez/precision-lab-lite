import { describe, expect, it } from "vitest";
import { detectPiecewiseIntent } from "../src/engine/parsing/piecewiseIntent";
import { parseExpression } from "../src/engine/parsing";
import { evaluate } from "../src/engine/algebriteClient";

describe("IN625 E2c — función a trozos",()=>{
  const input="\\begin{cases}x^{2}&x<0\\\\x&x\\geq0\\end{cases}";

  it("EN-MT-14 reconoce piecewise y no sistema",()=>{
    expect(detectPiecewiseIntent(input)).toEqual({
      kind:"piecewise",
      branches:[
        {expressionLatex:"x^{2}",conditionLatex:"x<0"},
        {expressionLatex:"x",conditionLatex:"x\\geq0"},
      ],
    });
  });

  it("EN-MT-14 rama x<0: f(-2)=4",()=>{
    const intent=detectPiecewiseIntent(input)!;
    const parsed=parseExpression(intent.branches[0].expressionLatex);
    expect(evaluate(`subst(-2,x,${parsed.algebrite})`)).toBe("4");
  });

  it("EN-MT-14 rama x>=0: f(3)=3",()=>{
    const intent=detectPiecewiseIntent(input)!;
    const parsed=parseExpression(intent.branches[1].expressionLatex);
    expect(evaluate(`subst(3,x,${parsed.algebrite})`)).toBe("3");
  });
});
