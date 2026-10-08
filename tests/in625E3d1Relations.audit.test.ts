import { describe, expect, it } from "vitest";
import { detectRelationIntent } from "../src/engine/parsing/relationIntent";
import { parseExpression } from "../src/engine/parsing";
import { solveAlgebra } from "../src/engine/stepEngine/algebra";

describe("IN625 E3d1 — definiciones y relaciones", () => {
  it("EN-DI-15 f(x)=... es definición", () => {
    expect(detectRelationIntent("f(x)=x^{2}-4")?.kind).toBe("functionDefinition");
  });

  it("EN-DI-16 y=... es relación explícita", () => {
    expect(detectRelationIntent("y=x^{2}-4")?.kind).toBe("explicitRelation");
  });

  it("EN-DI-17 x^2+y^2=1 es relación implícita", () => {
    expect(detectRelationIntent("x^{2}+y^{2}=1")?.kind).toBe("implicitRelation");
  });

  it("EN-DI-18 x=3 sigue siendo ecuación resoluble", () => {
    expect(detectRelationIntent("x=3")).toBeNull();
    const p = parseExpression("x=3");
    const r = solveAlgebra(p.leftAlgebrite, p.rightAlgebrite, "x");
    expect(r.solutionsAlgebrite).toEqual(["3"]);
  });
});
