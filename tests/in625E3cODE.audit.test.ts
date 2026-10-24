import { describe, expect, it } from "vitest";
import { detectODE } from "../src/engine/parsing/odeDetect";
import { solveODE } from "../src/engine/stepEngine/ode";

describe("IN625 E3c — EDO", () => {
  it("EN-DI-12: y'=y", () => {
    const normalized = detectODE("y'=y");
    expect(normalized).toBe("y'=y");
    const r = solveODE(normalized!);
    expect(r.resultLatex.replace(/\s/g, "")).toContain("C_1*e^");
  });

  it("EN-DI-13: y''+y=0", () => {
    const normalized = detectODE("y''+y=0");
    expect(normalized).toBe("y''+y=0");
    const r = solveODE(normalized!);
    const compact = r.resultLatex.replace(/\s/g, "");
    expect(compact).toContain("C_1*cos(x)");
    expect(compact).toContain("C_2*sin(x)");
  });

  it("EN-DI-14: dy/dx=y normaliza al mismo intent", () => {
    const normalized = detectODE("\\frac{dy}{dx}=y");
    expect(normalized).toBe("y'=y");
    const r = solveODE(normalized!);
    expect(r.resultLatex.replace(/\s/g, "")).toContain("C_1*e^");
  });
});
