import { describe, expect, it } from "vitest";
import source from "../qa/certification/syntax309_sy_p_cases.jsonl?raw";
import { parseExpression } from "../src/engine/parsing";
import { evaluate } from "../src/engine/algebriteClient";

type Case = { id: string; operacion: string; entrada: string };
const rows = source.trim().split("\n").map((line) => JSON.parse(line) as Case);
const probes: Record<string, { x: number; expected: number }> = {
  "SY-P-04": { x: 3, expected: 18 },
  "SY-P-05": { x: 3, expected: -9 },
  "SY-P-20": { x: 6, expected: 3 },
  "SY-P-22": { x: 2, expected: 0.25 },
  "SY-P-26": { x: 3, expected: 9 },
};
function numeric(input: string, x: number): number {
  const parsed = parseExpression(input).algebrite;
  const expression = parsed.replace(/\bx\b/g, `(${x})`);
  const raw = evaluate(expression);
  const value = Number(raw);
  return Number.isFinite(value) ? value : Number(evaluate(`float(${expression})`));
}
describe("Syntax309 SY-P — structural interpretation numeric witnesses", () => {
  it("identifies verified official interpretation rows", () => {
    for (const id of Object.keys(probes)) {
      const row = rows.find((item) => item.id === id);
      expect(row?.operacion).toBe("interpretacion");
    }
  });
  for (const [id, probe] of Object.entries(probes)) {
    it(`${id}: interpretation at x=${probe.x}`, () => {
      const row = rows.find((item) => item.id === id);
      expect(row).toBeDefined();
      const result = numeric(row!.entrada, probe.x);
      expect(Number.isFinite(result)).toBe(true);
      expect(result).toBeCloseTo(probe.expected, 9);
    });
  }
});
