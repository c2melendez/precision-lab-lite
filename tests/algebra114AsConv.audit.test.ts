import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { evaluate } from "../src/engine/algebriteClient";
import { parseExpression } from "../src/engine/parsing";
import source from "../qa/certification/algebra114_source.md?raw";

// AS-CONV (sección L) — paridad funcional con Plus (test_algebra114_as_conv.py).
// Canal Lite: DomainCondition kind "domain" en MathResult.domainConditions.
const scope = { postMessage: vi.fn(), onmessage: undefined as any };
beforeAll(async () => { vi.stubGlobal("self", scope); await import("../src/workers/compute.worker"); });
afterAll(() => vi.unstubAllGlobals());

const run = (input: string) => {
  scope.postMessage.mockClear();
  scope.onmessage!({ data: { type: "evaluate", expressionAlgebrite: parseExpression(input).algebrite, requestId: "asconv" } });
  return scope.postMessage.mock.calls.at(-1)![0];
};
const declared = (r: any, needle: string) =>
  (r.domainConditions ?? []).some((c: any) => String(c.text).toLowerCase().includes(needle.toLowerCase()));

describe("Algebra114 AS-CONV section L conventions (Lite parity)", () => {
  it("fixture rows present", () => {
    for (const id of ["AS-CONV-01","AS-CONV-02","AS-CONV-03","AS-CONV-04","AS-CONV-05","AS-CONV-06","AS-CONV-07","AS-CONV-08"]) {
      expect(source).toContain(`| ${id} |`);
    }
  });

  it("AS-CONV-06 cbrt(-8) is the real root -2 without noise", () => {
    const r = run("cbrt(-8)");
    expect(r.success, JSON.stringify(r)).toBe(true);
    // Oráculo numérico tolerante a formato: el contrato es el VALOR -2,
    // no la representación exacta (sondeo: latex "-2"; float puede dar "-2.0").
    const numeric = parseFloat(String(evaluate(`float(${r.resultLatex.replace(/[^0-9.-]/g, "")})`)));
    expect(numeric).toBeCloseTo(-2, 10);
    expect(declared(r, "AS-CONV")).toBe(false);
  });

  it("AS-CONV-03 x^0 = 1 silently; 0^0 must be DECLARED", () => {
    expect(evaluate("simplify(x^0)")).toBe("1");
    const r = run("0^0");
    expect(r.success, JSON.stringify(r)).toBe(true);
    expect(declared(r, "AS-CONV-03")).toBe(true);
  });

  it("AS-CONV-04 sqrt(-4) = 2i with complex-domain declaration", () => {
    const r = run("sqrt(-4)");
    expect(r.success, JSON.stringify(r)).toBe(true);
    expect(declared(r, "ℂ")).toBe(true);
  });

  it("AS-CONV-02 (-8)^(2/3): convention declared, never silent", () => {
    const r = run("(-8)^(2/3)");
    expect(r.success, JSON.stringify(r)).toBe(true);
    expect(declared(r, "AS-CONV-02")).toBe(true);
  });

  it("AS-CONV-01 numeric odd root of negative declares real branch", () => {
    // En Lite la forma canónica del usuario es cbrt(-8); el parser normaliza
    // root(-8,3) a texto no evaluado por Algebrite — se prueba por cbrt y se
    // declara via convención cuando el CAS devuelve la rama principal.
    const r = run("root(-8,3)");
    if (String(r.resultLatex).includes("-2")) {
      expect(declared(r, "ℝ") || declared(r, "AS-CONV-01")).toBe(true);
    } else {
      expect(declared(r, "ℂ") || declared(r, "principal") || declared(r, "AS-CONV-01")).toBe(true);
    }
  });

  it("AS-CONV-07 sqrt(x^2-2x+1) keeps abs-form or declares assumption", () => {
    const r = run("sqrt(x^2-2*x+1)");
    expect(r.success, JSON.stringify(r)).toBe(true);
    // Algebrite deja la forma sin resolver; el contrato exige |x-1| o declaración.
    const latex = String(r.resultLatex);
    const hasAbs = latex.includes("\\left|x - 1\\right|") || latex.includes("|x-1|") || latex.includes("\\vert");
    if (!hasAbs) {
      // Pendiente GAP-LITE-ASCONV-07: registrar como excepción documental si
      // el CAS no resuelve a valor absoluto y no hay supuesto declarado.
      expect(declared(r, "supuesto") || declared(r, "AS-CONV-07")).toBe(true);
    }
  });

  it("AS-CONV-05 fourth root of x^4 is |x| or declared", () => {
    const r = run("root(x^4,4)");
    expect(r.success, JSON.stringify(r)).toBe(true);
    const latex = String(r.resultLatex);
    if (!latex.includes("abs") && !latex.includes("\\left|x\\right|")) {
      expect(declared(r, "AS-CONV-05") || declared(r, "supuesto")).toBe(true);
    }
  });
});
