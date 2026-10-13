import { describe, expect, it } from "vitest";
import fixture from "../qa/certification/syntax309_cases.jsonl?raw";
import { parseExpression } from "../src/engine/parsing";
import { evaluate } from "../src/engine/algebriteClient";

type Row = { id: string; seccion: string; operacion: string; entrada: string };
const rows = fixture.trim().split("\n").map(line => JSON.parse(line) as Row);
const byId = Object.fromEntries(rows.map(row => [row.id, row]));

describe("Syntax309 SY-F — numeric witnesses via Lite parser and engine", () => {
  it("binds witnesses to the 48 official SY-F records", () => {
    expect(rows.filter(row => row.seccion === "F")).toHaveLength(48);
    expect(byId["SY-F-09"].operacion).toBe("valor");
    expect(byId["SY-F-06"].operacion).toBe("valor");
  });

  it("SY-F-09: sine of pi/6 evaluates to one half", () => {
    const input = byId["SY-F-09"].entrada;
    const parsed = parseExpression(input).algebrite;
    const raw = evaluate(parsed);
    const result = Number(raw);
    const numeric = Number.isFinite(result) ? result : Number(evaluate(`float(${parsed})`));
    expect(numeric).toBeCloseTo(0.5, 8);
  });

  it("SY-F-06: reciprocal of sine is two, not inverse sine", () => {
    const input = byId["SY-F-06"].entrada;
    const parsed = parseExpression(input).algebrite;
    const raw = evaluate(parsed);
    const result = Number(raw);
    const numeric = Number.isFinite(result) ? result : Number(evaluate(`float(${parsed})`));
    expect(numeric).toBeCloseTo(2, 8);
  });
});
