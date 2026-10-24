import { describe, expect, it } from "vitest";
import { parseExpression } from "../src/engine/parsing";
import { solveAlgebra } from "../src/engine/stepEngine/algebra";

function classify(input: string) {
  const p = parseExpression(input);
  const variable = p.freeVariables[0] ?? "x";
  return solveAlgebra(p.leftAlgebrite, p.rightAlgebrite, variable);
}

describe("IN625 E3d2 — verdad e identidades", () => {
  it("EN-DI-19: 1=1 es verdadero", () => {
    expect(classify("1=1").truth).toBe("identity");
  });

  it("EN-DI-19: 2=3 es falso", () => {
    expect(classify("2=3").truth).toBe("contradiction");
  });

  it("EN-DI-20: x=x es identidad", () => {
    expect(classify("x=x").truth).toBe("identity");
  });

  it("EN-DI-20: x+1=x es contradicción", () => {
    expect(classify("x+1=x").truth).toBe("contradiction");
  });

  it("EN-DI-21: identidad trigonométrica", () => {
    expect(classify("\\sin^{2}(x)+\\cos^{2}(x)=1").truth).toBe("identity");
  });

  it("EN-DI-23: identidad binomial", () => {
    expect(classify("(x+1)^{2}=x^{2}+2x+1").truth).toBe("identity");
  });
});
