import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { evaluate } from "../src/engine/algebriteClient";
import { parseExpression } from "../src/engine/parsing";
import type { DomainCondition } from "../src/types";
import source from "../qa/certification/algebra114_source.md?raw";

// Algebra114 sección M (AS-LIM-01..06) — contrato en qa/certification/algebra114_source.md.
// Oráculo = valor contractual + dominio. Gaps que cuelgan → it.todo (no invocar motor).
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

  it("AS-LIM-01 cancels to 1+x and keeps x≠1", () => {
    const r = run("(1-x^2)/(1-x)");
    expect(r.success, JSON.stringify(r)).toBe(true);
    expect(compact(r.resultLatex)).toMatch(/1\+x|x\+1/);
    const domain = conditions(r).filter((c) => c.kind === "domain");
    expect(domain.some((c) => /x\s*≠\s*1|x\s*!=\s*1/.test(c.text)), JSON.stringify(domain)).toBe(
      true,
    );
  });

  // Algebrite does not terminate in bounded time on this input (CI hung ~minutes).
  it.todo("AS-LIM-02 GAP: (x^5-1)/(x-1) geometric sum within bounded time");

  it("AS-LIM-03 (x^3-8)/(x-2) equals x^2+2x+4", () => {
    const r = run("(x^3-8)/(x-2)");
    expect(r.success, JSON.stringify(r)).toBe(true);
    const text = compact(evaluate("(x^3-8)/(x-2)"));
    expect(evaluate(`simplify((${text})-(x^2+2*x+4))`)).toBe("0");
  });

  it("AS-LIM-04 sqrt(2)*sqrt(8) = 4 exact", () => {
    const r = run("sqrt(2)*sqrt(8)");
    expect(r.success, JSON.stringify(r)).toBe(true);
    expect(compact(r.resultLatex)).toBe("4");
    expect(String(r.resultApprox ?? "")).not.toMatch(/5\.656|2\.828/);
  });

  // Finishes but returns incorrect factors including (x^2+1) instead of (x^2-x+1).
  it.fails("AS-LIM-05 GAP: x^6-1 factors as (x-1)(x+1)(x^2+x+1)(x^2-x+1)", () => {
    const text = compact(evaluate("factor(x^6-1)"));
    expect(text).toMatch(/x-1/);
    expect(text).toMatch(/x\+1/);
    expect(text).toMatch(/x\^2\+x\+1|x\^2\+1\*x\+1/);
    expect(text).toMatch(/x\^2-x\+1|x\^2-1\*x\+1/);
    expect(text).not.toMatch(/\(x\^2\+1\)/);
  });

  // Algebrite does not terminate in bounded time on degree-100 quotient.
  it.todo("AS-LIM-06 GAP: (x^100-1)/(x-1) compact form within bounded time");
});
