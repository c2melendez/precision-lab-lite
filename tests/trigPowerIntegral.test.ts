import { describe, expect, it } from "vitest";
// @ts-ignore -- algebrite no distribuye tipos
import Algebrite from "algebrite";
import { indefiniteIntegral } from "../src/engine/algebriteClient";

describe("integrales de potencias trigonométricas enteras", () => {
  it.each(["sin", "cos", "tan"])("integra potencias de %s y verifica su derivada", (fn) => {
    for (const n of [0, 1, 2, 3, 5, 8]) {
      const integrand = `${fn}(x)^${n}`;
      const answer = indefiniteIntegral(`((${integrand}))`, "x");
      expect(answer).not.toMatch(/Stop|integral\(/i);
      for (const x of [0.2, 0.7]) {
        const difference: string = Algebrite.run(`float(subst(${x},x,d((${answer}),x)-(${integrand})))`);
        expect(Math.abs(Number.parseFloat(difference)), `${integrand} en x=${x}: ${difference}`).toBeLessThan(1e-4);
      }
    }
  });

  it("rechaza exponentes simbólicos que el motor no puede resolver", () => {
    expect(() => indefiniteIntegral("sin(x)^n", "x")).toThrow();
  });
});
