import { describe, expect, it } from "vitest";
import { tryComplexFunction, parseComplex } from "../src/engine/complexFunctions";
import { evaluate } from "../src/engine/algebriteClient";
import { residueAtRational, singularitiesOfRational } from "../src/engine/complexAnalysis";

function parts(expr: string) {
  const raw = tryComplexFunction(expr);
  if (raw === null) throw new Error("not intercepted");
  return parseComplex(raw);
}

describe("Suite exhaustiva original — Módulo 5: Complejos", () => {
  it("Re/Im/arg/conj funcionan", () => {
    expect(tryComplexFunction("re(3+4*i)")).toBe("3");
    expect(tryComplexFunction("im(3+4*i)")).toBe("4");
    expect(Number(tryComplexFunction("arg(1+i)"))).toBeCloseTo(Math.PI/4, 10);
    expect(tryComplexFunction("conj(3+4*i)")).toBe("3-4*i");
  });

  it("módulo 3+4i = 5 vía motor base", () => {
    expect(Number(evaluate("abs(3+4*i)"))).toBeCloseTo(5, 10);
  });

  it("forma polar conserva módulo y argumento", () => {
    const p = tryComplexFunction("topolar(3+4*i)");
    expect(p).not.toBeNull();
    expect(p!).toContain("5*e^(");
  });

  it("raíz principal de -4 es 2i", () => {
    expect(tryComplexFunction("root(-4,2)")).toBe("2*i");
  });

  it("potencia compleja (1+i)^2 = 2i", () => {
    const p = parseComplex(evaluate("(1+i)^2"));
    expect(p.re).toBeCloseTo(0, 10);
    expect(p.im).toBeCloseTo(2, 10);
  });

  it("Log(-1) usa logaritmo complejo principal natural", () => {
    const p = parts("log(-1)");
    expect(p.re).toBeCloseTo(0, 10);
    expect(p.im).toBeCloseTo(Math.PI, 10);
  });

  it("M20: residuo y singularidades racionales igualan el contrato Plus", () => {
    expect(residueAtRational("1/(z-2)", "2")).toBe("1");
    expect(singularitiesOfRational("1/((z-1)*(z+2))")).toEqual(["-2", "1"]);
  });
});

// QA rerun marker: módulo 5 validado contra el estado actual del proyecto.
