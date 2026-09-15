import { describe, it, expect } from "vitest";
import { parseExpression } from "../src/engine/parsing";
import { compileNumeric } from "../src/engine/numericFallback";

// Auditoría Módulo A: replica el pipeline real de handleEvaluate en
// compute.worker.ts (evaluate() simbólico + fallback numérico vía
// compileNumeric cuando el resultado sigue conteniendo asinh/acosh/atanh),
// ya que llamar a algebriteClient.evaluate() solo no dispara el fallback.
describe("Auditoría Módulo A (hiperbólicas inversas recíprocas) — pipeline real", () => {
  it("asech(0.5) = acosh(2)", () => {
    const parsed = parseExpression("asech(0.5)");
    const fn = compileNumeric(parsed.algebrite, "__no_var__");
    const result = fn(0);
    console.log("asech(0.5) =", result);
    expect(result).toBeCloseTo(1.3169578969248166, 6);
  });

  it("acsch(2) = asinh(0.5)", () => {
    const parsed = parseExpression("acsch(2)");
    const fn = compileNumeric(parsed.algebrite, "__no_var__");
    const result = fn(0);
    console.log("acsch(2) =", result);
    expect(result).toBeCloseTo(0.48121182505960347, 6);
  });

  it("acoth(3) = atanh(1/3)", () => {
    const parsed = parseExpression("acoth(3)");
    const fn = compileNumeric(parsed.algebrite, "__no_var__");
    const result = fn(0);
    console.log("acoth(3) =", result);
    expect(result).toBeCloseTo(0.34657359027997264, 6);
  });
});
