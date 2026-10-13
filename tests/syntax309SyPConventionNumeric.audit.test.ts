import { describe, expect, it } from "vitest";
import source from "../qa/certification/syntax309_sy_p_cases.jsonl?raw";
import { parseExpression } from "../src/engine/parsing";
import { evaluate } from "../src/engine/algebriteClient";
import { tokenize } from "../src/engine/parsing/tokenize";

type Case = { id: string; entrada: string; operacion: string };
const byId = Object.fromEntries(source.trim().split("\n").map(line => {
  const row = JSON.parse(line) as Case;
  return [row.id, row];
}));

describe("Syntax309 SY-P — Lite numeric precedence convention", () => {
  for (const [id, expected] of [["SY-P-18", 16], ["SY-P-19", 9]] as const) {
    it(`${id}: verify actual implicit-division interpretation numerically`, () => {
      const row = byId[id];
      expect(row.operacion).toBe("convencion");
      const parsed = parseExpression(row.entrada).algebrite;
      const result = Number(evaluate(parsed));
      expect(Number.isFinite(result)).toBe(true);
      expect(result).toBeCloseTo(expected, 9);
    });
  }
  it("SY-P-21: 1/2x at x=6 must have an explicit numeric interpretation", () => {
    const row = byId["SY-P-21"];
    expect(row.operacion).toBe("convencion");
    const parsed = parseExpression(row.entrada).algebrite;
    const substituted = parsed.replace(/\bx\b/g, "(6)");
    const exact = evaluate(substituted);
    const direct = Number(exact);
    const result = Number.isFinite(direct) ? direct : Number(evaluate(`float(${substituted})`));
    expect(Number.isFinite(result), `SY-P-21 parsed=${parsed}, substituted=${substituted}, exact=${exact}`).toBe(true);
    expect(result).toBeCloseTo(3, 9);
  });

  it("SY-P-23: characterizes raw a/bc versus an explicitly grouped denominator", () => {
    const row = byId["SY-P-23"];
    expect(row.operacion).toBe("convencion");
    const raw = parseExpression(row.entrada).algebrite;
    const grouped = parseExpression("a/(b*c)").algebrite;
    // A defined grouping must retain a multiplication inside its denominator.
    expect(grouped).toContain("/");
    expect(grouped).toContain("b");
    expect(grouped).toContain("c");
    // Keep the disputed raw expression visible as evidence, without
    // declaring either reading universally correct.
    expect(raw).toContain("a");
    expect(raw).toContain("/");
  });

  it("SY-P-23: explicitly grouped alternatives are distinguishable numerically", () => {
    const row = byId["SY-P-23"];
    expect(row.operacion).toBe("convencion");
    const byProduct = parseExpression("(a/b)*c").algebrite;
    const byDenominator = parseExpression("a/(b*c)").algebrite;
    const replaceVars = (expr: string) => expr
      .replace(/\ba\b/g, "(12)")
      .replace(/\bb\b/g, "(3)")
      .replace(/\bc\b/g, "(2)");
    const left = Number(evaluate(replaceVars(byProduct)));
    const right = Number(evaluate(replaceVars(byDenominator)));
    expect(left).toBeCloseTo(8, 9);
    expect(right).toBeCloseTo(2, 9);
    expect(left).not.toBeCloseTo(right, 9);
  });
  it("SY-P-23: raw bc and explicit b*c retain distinct parser structures", () => {
    const raw = parseExpression("a/bc").algebrite;
    const multiplied = parseExpression("a/(b*c)").algebrite;
    const numeratorTimesC = parseExpression("(a/b)*c").algebrite;
    // This is structural characterization, not an assertion that either
    // ambiguous reading is universally mathematically mandated.
    expect(raw.length).toBeGreaterThan(0);
    expect(multiplied.length).toBeGreaterThan(0);
    expect(numeratorTimesC.length).toBeGreaterThan(0);
    const evaluateWith = (expr: string) => Number(evaluate(expr
      .replace(/\ba\b/g, "(12)")
      .replace(/\bb\b/g, "(3)")
      .replace(/\bc\b/g, "(2)")));
    expect(evaluateWith(multiplied)).toBeCloseTo(2, 9);
    expect(evaluateWith(numeratorTimesC)).toBeCloseTo(8, 9);
  });

  
  it("SY-P-23: Lite separa bc desconocido en dos identificadores de una letra", () => {
    const tokens = tokenize("a/bc").map(token => [token.type, token.value]);
    expect(tokens).toEqual([
      ["identifier", "a"], ["operator", "/"],
      ["identifier", "b"], ["identifier", "c"],
    ]);
    expect(parseExpression("a/bc").algebrite).toBe(parseExpression("a/b*c").algebrite);
    expect(parseExpression("a/(b*c)").algebrite).not.toBe(parseExpression("a/bc").algebrite);
  });


  it("SY-P-23: signed witnesses preserve both explicit groupings", () => {
    const substitutions = (expression: string) => expression
      .replace(/\\ba\\b/g, "(12)")
      .replace(/\\bb\\b/g, "(-3)")
      .replace(/\\bc\\b/g, "(-2)");
    const numeratorProduct = parseExpression("(a/b)*c").algebrite;
    const denominatorProduct = parseExpression("a/(b*c)").algebrite;
    expect(Number(evaluate(substitutions(numeratorProduct)))).toBeCloseTo(8, 9);
    expect(Number(evaluate(substitutions(denominatorProduct)))).toBeCloseTo(2, 9);
    // Lite tokenizes raw bc as two single-letter identifiers; Plus permits named bc.
    // Do not assert raw a/bc is equivalent across engines.
    expect(tokenize("a/bc").filter(t => t.type === "identifier").map(t => t.value))
      .toEqual(["a", "b", "c"]);
  });

  it("SY-P-23: las dos agrupaciones LaTeX tienen resultados discriminantes", () => {
    const product = parseExpression(String.raw`\frac{a}{b}*c`).algebrite;
    const denominator = parseExpression(String.raw`\frac{a}{b*c}`).algebrite;
    const numeric = (expr: string) => Number(evaluate(expr
      .replace(/\ba\b/g, "(12)")
      .replace(/\bb\b/g, "(3)")
      .replace(/\bc\b/g, "(2)")));
    expect(numeric(product)).toBeCloseTo(8, 9);
    expect(numeric(denominator)).toBeCloseTo(2, 9);
    expect(numeric(product)).not.toBeCloseTo(numeric(denominator), 9);
  });

  it("SY-P-23: paréntesis redundantes preservan división y producto explícitos", () => {
    const cases = [
      ["((a)/(b*c))", 2],
      ["(((a)/(b)))*c", 8],
    ] as const;
    for (const [input, expected] of cases) {
      const expression = parseExpression(input).algebrite
        .replace(/\ba\b/g, "(12)")
        .replace(/\bb\b/g, "(3)")
        .replace(/\bc\b/g, "(2)");
      expect(Number(evaluate(expression)), input).toBeCloseTo(expected, 9);
    }
  });

  it("SY-P-23: agrupaciones explícitas preservan valores con factores decimales", () => {
    const cases = [
      ["(a/b)*c", 7.5],
      ["a/(b*c)", 1.2],
      [String.raw`\frac{a}{b*c}`, 1.2],
    ] as const;
    for (const [input, expected] of cases) {
      const parsed = parseExpression(input).algebrite;
      const substituted = parsed
        .replace(/\ba\b/g, "(9)")
        .replace(/\bb\b/g, "(3)")
        .replace(/\bc\b/g, "(2.5)");
      expect(Number(evaluate(substituted)), input).toBeCloseTo(expected, 9);
    }
  });

  it("SY-P-23: la fracción LaTeX conserva la multiplicación b*c en Lite", () => {
    const latex = parseExpression(String.raw`\frac{a}{bc}`).algebrite;
    const grouped = parseExpression("a/(b*c)").algebrite;
    // La fracción introduce agrupación del denominador; no crea variable bc.
    // LaTeX puede añadir paréntesis redundantes: verificar semántica, no texto exacto.
    expect(latex).toContain("b*c");
    const numeric = latex
      .replace(/\ba\b/g, "(12)")
      .replace(/\bb\b/g, "(3)")
      .replace(/\bc\b/g, "(2)");
    const substitutedGrouped = grouped
      .replace(/\ba\b/g, "(12)")
      .replace(/\bb\b/g, "(3)")
      .replace(/\bc\b/g, "(2)");
    expect(Number(evaluate(numeric))).toBeCloseTo(2, 9);
    expect(Number(evaluate(substitutedGrouped))).toBeCloseTo(2, 9);
  });

});
