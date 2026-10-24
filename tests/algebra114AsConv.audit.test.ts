import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { evaluate } from "../src/engine/algebriteClient";
import { parseExpression } from "../src/engine/parsing";
import type { DomainCondition } from "../src/types";
import source from "../qa/certification/algebra114_source.md?raw";

// Algebra114 sección L (AS-CONV-01..08) — contrato en qa/certification/algebra114_source.md.
//
// Reglas de honestidad de este archivo (ver CURRENT_STATE 2026-10-20):
//  * El oráculo de cada caso es el RESULTADO que exige el contrato, no la
//    presencia de una etiqueta. Una declaración de convención solo cuenta si
//    describe un cálculo que el motor realmente hizo.
//  * Canal de declaración en Lite: DomainCondition kind "domain" (la UI
//    renderiza `latex`; `text` es la explicación completa).
//  * Los casos que el motor no resuelve se registran con `it.fails` estricto
//    (pasan solo mientras la capacidad falta; fallan en cuanto se implementa,
//    obligando a convertirlos en pruebas normales).
const scope = { postMessage: vi.fn(), onmessage: undefined as any };
beforeAll(async () => { vi.stubGlobal("self", scope); await import("../src/workers/compute.worker"); });
afterAll(() => vi.unstubAllGlobals());

const run = (input: string) => {
  scope.postMessage.mockClear();
  scope.onmessage!({ data: { type: "evaluate", expressionAlgebrite: parseExpression(input).algebrite, requestId: "asconv" } });
  return scope.postMessage.mock.calls.at(-1)![0];
};
const conditions = (r: any): DomainCondition[] => r.domainConditions ?? [];
const declared = (r: any, tag: string) => conditions(r).some((c) => c.text.includes(tag));
const compact = (s: unknown) => String(s).replace(/\s+/g, "");

// `|u|` terms of a LaTeX result: [ "x-1", ... ] plus the LaTeX left once they are removed.
function absTerms(latex: string): { args: string[]; rest: string } {
  const args: string[] = [];
  const rest = latex.replace(/\\left\s*\|\s*(.+?)\s*\\right\s*\|/g, (_m, inner) => { args.push(compact(inner)); return "§"; });
  return { args, rest: compact(rest) };
}
// |a| = |b| for polynomials a, b  <=>  a^2 - b^2 == 0 (independent CAS check, sign-insensitive).
const sameAbs = (a: string, b: string) => evaluate(`expand((${a})^2-(${b})^2)`) === "0";
function expectAbsSum(latex: string, expected: string[]) {
  const { args, rest } = absTerms(latex);
  expect(args.length, `abs terms in ${latex}`).toBe(expected.length);
  expect(rest).toBe(Array(expected.length).fill("§").join("+"));
  const pool = [...args];
  for (const want of expected) {
    const at = pool.findIndex((a) => sameAbs(a, want));
    expect(at, `|${want}| not found among ${JSON.stringify(args)} in ${latex}`).toBeGreaterThanOrEqual(0);
    pool.splice(at, 1);
  }
}

describe("Algebra114 AS-CONV section L (contract oracles)", () => {
  it("fixture rows AS-CONV-01..08 present in the audited source", () => {
    for (const id of ["AS-CONV-01", "AS-CONV-02", "AS-CONV-03", "AS-CONV-04", "AS-CONV-05", "AS-CONV-06", "AS-CONV-07", "AS-CONV-08"]) {
      expect(source).toContain(`| ${id} |`);
    }
  });

  // --- AS-CONV-01: ∛(-8) = -2 on R, with the real branch declared when the explicit root form is used.
  it("AS-CONV-01 root(-8,3) = -2 (real branch) and declares it", () => {
    const r = run("root(-8,3)");
    expect(r.success, JSON.stringify(r)).toBe(true);
    expect(compact(r.resultLatex)).toBe("-2");
    expect(declared(r, "AS-CONV-01")).toBe(true);
  });
  it("AS-CONV-01 cbrt(-8) = -2 (cbrt is the real cube root by definition)", () => {
    const r = run("cbrt(-8)");
    expect(r.success, JSON.stringify(r)).toBe(true);
    expect(compact(r.resultLatex)).toBe("-2");
  });

  // --- AS-CONV-02: (-8)^(2/3) in the principal complex branch, convention declared.
  it("AS-CONV-02 (-8)^(2/3) = -2+2i√3 (principal branch) and declares the convention", () => {
    const r = run("(-8)^(2/3)");
    expect(r.success, JSON.stringify(r)).toBe(true);
    expect(compact(r.resultLatex)).toBe("-2+2i\\sqrt{3}");
    expect(declared(r, "AS-CONV-02")).toBe(true);
  });

  // --- AS-CONV-03: x^0 = 1; 0^0 declared, never silent (any form that is 0^0).
  it("AS-CONV-03 x^0 = 1 and 2^0 = 1 carry no 0^0 declaration", () => {
    for (const e of ["x^0", "2^0", "0^2"]) {
      const r = run(e);
      expect(r.success, e).toBe(true);
      expect(declared(r, "AS-CONV-03"), `${e} must not claim 0^0`).toBe(false);
    }
    expect(compact(run("x^0").resultLatex)).toBe("1");
  });
  it("AS-CONV-03 literal 0^0 = 1 is declared", () => {
    const r = run("0^0");
    expect(r.success, JSON.stringify(r)).toBe(true);
    expect(compact(r.resultLatex)).toBe("1");
    expect(declared(r, "AS-CONV-03")).toBe(true);
  });
  it.fails("AS-CONV-03 every form that evaluates to 0^0 is declared ((1-1)^(1-1), 0^(2-2), 0^0+1, 2^0+0^0)", () => {
    for (const e of ["(1-1)^(1-1)", "0^(2-2)", "0^0+1", "2^0+0^0"]) {
      const r = run(e);
      expect(r.success, e).toBe(true);
      expect(declared(r, "AS-CONV-03"), `${e} resolves 0^0 silently`).toBe(true);
    }
  });

  // --- AS-CONV-04: sqrt(-4) = 2i in C, declared.
  it("AS-CONV-04 sqrt(-4) = 2i with the complex domain declared", () => {
    const r = run("sqrt(-4)");
    expect(r.success, JSON.stringify(r)).toBe(true);
    expect(compact(r.resultLatex)).toBe("2i");
    expect(declared(r, "AS-CONV-04")).toBe(true);
  });

  // --- AS-CONV-05..08: the contract demands the VALUE |u| (not u). Algebrite leaves the radical unevaluated.
  it.fails("AS-CONV-05 root(x^4,4) = |x|, not x", () => {
    const r = run("root(x^4,4)");
    expect(r.success, JSON.stringify(r)).toBe(true);
    expectAbsSum(String(r.resultLatex), ["x"]);
  });
  it.fails("AS-CONV-06 root(x^3,3) = x", () => {
    const r = run("root(x^3,3)");
    expect(r.success, JSON.stringify(r)).toBe(true);
    expect(compact(r.resultLatex)).toBe("x");
  });
  it.fails("AS-CONV-07 sqrt(x^2-2x+1) = |x-1|", () => {
    const r = run("sqrt(x^2-2*x+1)");
    expect(r.success, JSON.stringify(r)).toBe(true);
    expectAbsSum(String(r.resultLatex), ["x-1"]);
  });
  it.fails("AS-CONV-08 sqrt(x^2-6x+9)+sqrt(x^2+6x+9) = |x-3|+|x+3|", () => {
    const r = run("sqrt(x^2-6*x+9)+sqrt(x^2+6*x+9)");
    expect(r.success, JSON.stringify(r)).toBe(true);
    expectAbsSum(String(r.resultLatex), ["x-3", "x+3"]);
  });

  // Negative controls: radicands that are NOT perfect powers must never be rewritten.
  it("controls: non-perfect-square radicands are not rewritten to an absolute value", () => {
    for (const e of ["sqrt(x^2+1)", "sqrt(x^2-2*x+2)", "sqrt(x^3)"]) {
      const r = run(e);
      expect(r.success, e).toBe(true);
      expect(absTerms(String(r.resultLatex)).args, `${e} -> ${r.resultLatex}`).toEqual([]);
    }
  });
});
