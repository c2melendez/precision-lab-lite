import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { evaluate } from "../src/engine/algebriteClient";
import { parseExpression } from "../src/engine/parsing";
import type { DomainCondition } from "../src/types";
import source from "../qa/certification/algebra114_source.md?raw";

// Algebra114 sección M (AS-LIM-01..06) — contrato en qa/certification/algebra114_source.md.
// Oráculo = valor contractual + dominio. Gaps de motor/tiempo → it.fails estricto.
const scope = { postMessage: vi.fn(), onmessage: undefined as any };
beforeAll(async () => {
  vi.stubGlobal("self", scope);
  await import("../src/workers/compute.worker");
});
afterAll(() => vi.unstubAllGlobals());

const run = (input: string) => {
  scope.postMessage.mockClear();
  scope.onmessage!({
    data: {
      type: "evaluate",
      expressionAlgebrite: parseExpression(input).algebrite,
      requestId: "aslim",
    },
  });
  return scope.postMessage.mock.calls.at(-1)![0];
};
const compact = (s: unknown) => String(s).replace(/\s+/g, "");
const conditions = (r: any): DomainCondition[] => r.domainConditions ?? [];

describe("Algebra114 AS-LIM section M (exactness and limit cases)", () => {
  it("fixture rows AS-LIM-01..06 present in the audited source", () => {
    for (const id of [
      "AS-LIM-01",
      "AS-LIM-02",
      "AS-LIM-03",
      "AS-LIM-04",
      "AS-LIM-05",
      "AS-LIM-06",
    ]) {
      expect(source).toContain(`| ${id} |`);
    }
  });

  // AS-LIM-01: (1-x²)/(1-x) → 1+x, with x≠1 — PASS on HEAD e31f0101
  it("AS-LIM-01 cancels to 1+x and keeps x≠1", () => {
    const r = run("(1-x^2)/(1-x)");
    expect(r.success, JSON.stringify(r)).toBe(true);
    expect(compact(r.resultLatex)).toMatch(/1\+x|x\+1/);
    const domain = conditions(r).filter((c) => c.kind === "domain");
    expect(domain.some((c) => /x\s*≠\s*1|x\s*!=\s*1/.test(c.text)), JSON.stringify(domain)).toBe(
      true,
    );
  });

  // AS-LIM-02: Algebrite hangs on (x^5-1)/(x-1) via worker (>5s) — CAPABILITY_GAP
  it.fails("AS-LIM-02 GAP: (x^5-1)/(x-1) completes as geometric sum within bounded time", () => {
    const r = run("(x^5-1)/(x-1)");
    expect(r.success, JSON.stringify(r)).toBe(true);
    const text = compact(evaluate("(x^5-1)/(x-1)"));
    expect(evaluate(`simplify((${text})-(x^4+x^3+x^2+x+1))`)).toBe("0");
  });

  // AS-LIM-03: (x^3-8)/(x-2) ≡ x^2+2x+4 — PASS
  it("AS-LIM-03 (x^3-8)/(x-2) equals x^2+2x+4", () => {
    const r = run("(x^3-8)/(x-2)");
    expect(r.success, JSON.stringify(r)).toBe(true);
    const text = compact(evaluate("(x^3-8)/(x-2)"));
    expect(evaluate(`simplify((${text})-(x^2+2*x+4))`)).toBe("0");
  });

  // AS-LIM-04: √2 √8 = 4 exact — PASS
  it("AS-LIM-04 sqrt(2)*sqrt(8) = 4 exact", () => {
    const r = run("sqrt(2)*sqrt(8)");
    expect(r.success, JSON.stringify(r)).toBe(true);
    expect(compact(r.resultLatex)).toBe("4");
    expect(String(r.resultApprox ?? "")).not.toMatch(/5\.656|2\.828/);
  });

  // AS-LIM-05: factor(x^6-1) returns (x-1)(x+1)(x^2+x+1)(x^2+1) — incomplete/wrong over R
  it.fails("AS-LIM-05 GAP: x^6-1 factors as (x-1)(x+1)(x^2+x+1)(x^2-x+1)", () => {
    const text = compact(evaluate("factor(x^6-1)"));
    expect(text).toMatch(/x-1/);
    expect(text).toMatch(/x\+1/);
    expect(text).toMatch(/x\^2\+x\+1|x\^2\+1\*x\+1/);
    expect(text).toMatch(/x\^2-x\+1|x\^2-1\*x\+1/);
    // Must not claim x^2+1 as a factor of x^6-1
    expect(text).not.toMatch(/\(x\^2\+1\)/);
  });

  // AS-LIM-06: (x^100-1)/(x-1) hangs — CAPABILITY_GAP (no compact form, timeout)
  it.fails("AS-LIM-06 GAP: (x^100-1)/(x-1) stays compact and finishes in bounded time", () => {
    const r = run("(x^100-1)/(x-1)");
    expect(r.success, JSON.stringify(r)).toBe(true);
    const latex = String(r.resultLatex ?? "");
    const powerHits = (latex.match(/x\^\d+/g) ?? []).length;
    expect(powerHits, `too many explicit powers in ${latex.slice(0, 200)}`).toBeLessThan(20);
  });
});
