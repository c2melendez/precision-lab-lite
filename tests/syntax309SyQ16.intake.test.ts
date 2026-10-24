import { describe, expect, it } from "vitest";
import raw from "../qa/certification/syntax309_cases.jsonl?raw";
import { splitSystemLatex } from "../src/engine/parsing/systemSplit";
import { parseExpression } from "../src/engine/parsing";

describe("SY-Q-16 nonlinear systems: intake and capability boundary", () => {
  it("preserves both nonlinear equations from the official LaTeX fixture", () => {
    const row = raw.split("\n").filter(Boolean).map(s => JSON.parse(s)).find(v => v.id === "SY-Q-16");
    expect(row.esperado).toBe(String.raw`(x,y)=(3,4),\ (4,3)`);
    const equations = splitSystemLatex(row.entrada);
    expect(equations).toEqual(["x^{2}+y^{2}=25", "x+y=7"]);
    const parsed = equations!.map(s => parseExpression(s));
    expect(parsed.every(p => p.isEquation)).toBe(true);
    expect([...new Set(parsed.flatMap(p => p.freeVariables))].sort()).toEqual(["x", "y"]);
    // The currently routed Lite solver is explicitly linear-only; this
    // intake test is not a PASS of nonlinear equation solving.
  });
});
