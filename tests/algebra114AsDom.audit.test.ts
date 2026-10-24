import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { evaluate } from "../src/engine/algebriteClient";
import { parseExpression } from "../src/engine/parsing";
import { solveAlgebra } from "../src/engine/stepEngine/algebra";
import source from "../qa/certification/algebra114_source.md?raw";

// Algebra114 AS-DOM-01..06: results keep the ORIGINAL real domain. The combined
// domain condition (kind "domain") is checked against an independent oracle.
const scope = { postMessage: vi.fn(), onmessage: undefined as any };
beforeAll(async () => { vi.stubGlobal("self", scope); await import("../src/workers/compute.worker"); });
afterAll(() => vi.unstubAllGlobals());

const run = (input: string) => {
  scope.onmessage!({ data: { type: "evaluate", expressionAlgebrite: parseExpression(input).algebrite, requestId: "dom" } });
  return scope.postMessage.mock.calls.at(-1)![0];
};

const CASES: [string, string, string | null, string, (t: number) => boolean][] = [
  ["AS-DOM-01", "(x^2-1)/(x-1)", "x+1", "x != 1", (t) => t !== 1],
  ["AS-DOM-02", "(x-1)/(x^2-1)", "1/(x+1)", "x != -1 and x != 1", (t) => t !== 1 && t !== -1],
  ["AS-DOM-04", "sqrt(x^2)/x", null, "x != 0", (t) => t !== 0],
  ["AS-DOM-05", "1/sqrt(x-1)", null, "x > 1", (t) => t > 1],
  ["AS-DOM-06", "sqrt(x/(x-1))", null, "x <= 0 or x > 1", (t) => t <= 0 || t > 1],
];

function satisfies(text: string, t: number): boolean {
  return text.split(" or ").some((part) => part.split(" and ").every((atom) => {
    const [, op, rhs] = /^x (!=|<=|>=|<|>) (.+)$/.exec(atom)!;
    const v = Number(evaluate(`float(${rhs})`));
    return op === "!=" ? t !== v : op === "<=" ? t <= v : op === ">=" ? t >= v : op === "<" ? t < v : t > v;
  }));
}

describe("Algebra114 AS-DOM original real domain", () => {
  it.each(CASES)("%s keeps the original domain", (id, input, expected, domain, inDomain) => {
    expect(source).toContain(`| ${id} | `);
    const result = run(input);
    expect(result.success, JSON.stringify(result)).toBe(true);
    if (expected) expect(result.resultLatex).toBe(id === "AS-DOM-01" ? "x+1" : "\\frac{1}{x+1}");
    const summaries = (result.domainConditions ?? []).filter((c: any) => c.kind === "domain");
    expect(summaries.map((c: any) => c.text)).toEqual([domain]);
    for (const t of [-3, -1, -0.5, 0, 0.5, 1, 1.5, 2, 5]) expect(satisfies(summaries[0].text, t), `${id} ${t}`).toBe(inDomain(t));
  });

  it("AS-DOM-04 returns |x|/x with its sign cases", () => {
    const result = run("sqrt(x^2)/x");
    expect(result.resultLatex).toBe("\\frac{\\left |x \\right |}{x}");
    expect(result.steps.map((s: any) => s.explanation).join(" ")).toContain("vale 1 si x > 0 y -1 si x < 0");
  });

  it("AS-DOM-03 solves to x=-1 and discards x=1 outside the domain", () => {
    expect(source).toContain("| AS-DOM-03 | ");
    const p = parseExpression("(x^2-1)/(x-1)=0");
    const result = solveAlgebra(p.leftAlgebrite, p.rightAlgebrite, "x");
    expect(result.solutionsAlgebrite).toEqual(["-1"]);
    const text = result.steps.map((s) => s.explanation).join(" ");
    expect(text).toContain("x≠1");
    expect(text).toContain("x = 1 anula el numerador pero no pertenece al dominio");
  });
});
