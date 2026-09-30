import { describe, expect, it } from "vitest";
// @ts-ignore -- algebrite no distribuye tipos
import Algebrite from "algebrite";
import { indefiniteIntegral } from "../src/engine/algebriteClient";

describe("B7 fast paths de integrales estándar", () => {
  const cases = [
    ["sec(x)*tan(x)", "sec(x)*tan(x)"],
    ["csc(x)*cot(x)", "csc(x)*cot(x)"],
    ["tan(x)^2", "tan(x)^2"],
    ["sech(x)^2", "sech(x)^2"],
    ["csch(x)^2", "csch(x)^2"],
    ["sech(x)*tanh(x)", "sech(x)*tanh(x)"],
    ["csch(x)*coth(x)", "csch(x)*coth(x)"],
    ["sinh(x)*cosh(x)", "sinh(x)*cosh(x)"],
    ["e^x*sin(x)", "e^x*sin(x)"],
  ] as const;

  it.each(cases)("integra %s sin dejar integral(...) pendiente", (integrand) => {
    const answer = indefiniteIntegral(integrand, "x");
    expect(answer).not.toMatch(/Stop|integral\(/i);
  });

  it("reutiliza la forma cerrada de sech(x) en integrales definidas", () => {
    expect(indefiniteIntegral("sech(x)", "x")).toBe("arctan(sinh(x))");
  });
});
