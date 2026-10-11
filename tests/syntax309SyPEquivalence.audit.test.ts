import { describe, expect, it } from "vitest";
import source from "../qa/certification/syntax309_sy_p_cases.jsonl?raw";
import { parseExpression } from "../src/engine/parsing";
import { evaluate } from "../src/engine/algebriteClient";

type Row = { id: string; operacion: string; entrada: string; esperado: string };
const rows = source.trim().split("\n").map((line) => JSON.parse(line) as Row);
const pairs: Record<string, [string, string]> = {
  "SY-P-29": ["(x+1)(x-1)", "x^2-1"],
  "SY-P-30": ["x(x+1)", "x^2+x"],
  "SY-P-31": ["2(x)(3)", "6x"],
};
const samples = [-3, -1, 0, 2, 5];
function numeric(input: string, x: number): number {
  const parsed = parseExpression(input).algebrite;
  const substituted = parsed.replace(/\bx\b/g, `(${x})`);
  const raw = evaluate(substituted);
  const n = Number(raw);
  return Number.isFinite(n) ? n : Number(evaluate(`float(${substituted})`));
}
describe("Syntax309 SY-P equivalence — Lite parser and evaluator", () => {
  it("uses exactly three original equivalence records", () => {
    const actual = rows.filter((row) => row.operacion === "equivalente");
    expect(actual.map((row) => row.id)).toEqual(Object.keys(pairs));
  });
  for (const [id, [input, expected]] of Object.entries(pairs)) {
    for (const x of samples) {
      it(`${id} at x=${x}`, () => {
        const row = rows.find((candidate) => candidate.id === id);
        expect(row?.entrada).toBe(input);
        const lhs = numeric(input, x);
        const rhs = numeric(expected, x);
        expect(Number.isFinite(lhs)).toBe(true);
        expect(Number.isFinite(rhs)).toBe(true);
        expect(lhs).toBeCloseTo(rhs, 9);
      });
    }
  }
});
