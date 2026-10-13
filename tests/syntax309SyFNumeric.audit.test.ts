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

  it("SY-F-03: sin(x squared) is not sine(x) squared", () => {
    expect(byId["SY-F-03"].operacion).toBe("interpretacion");
    const parsed = parseExpression(byId["SY-F-03"].entrada).algebrite;
    const substituted = parsed.replace(/\bx\b/g, "(2)");
    const exact = evaluate(substituted);
    const floated = evaluate(`float(${exact})`);
    // Algebrite can print truncated decimals as "-0.756802..." (or Unicode ellipsis).
    // Number("...") is NaN even when the mathematical evaluation succeeded.
    const numericText = floated.trim().replace(/(?:\.\.\.|…)$/, "");
    const actual = Number(numericText);
    expect(Number.isFinite(actual), `SY-F-03 parsed=${parsed} substituted=${substituted} exact=${exact} floated=${floated}`).toBe(true);
    // Algebrite's displayed float is truncated, so use an accuracy bound
    // compatible with its emitted digits; keep the independent Math.sin oracle.
    expect(actual).toBeCloseTo(Math.sin(4), 5);
    expect(actual).not.toBeCloseTo(Math.sin(2) ** 2, 4);
  });

  it("SY-F-09: sine of pi/6 evaluates to one half", () => {
    const input = byId["SY-F-09"].entrada;
    const parsed = parseExpression(input).algebrite;
    const raw = evaluate(parsed);
    const result = Number(raw);
    const numeric = Number.isFinite(result) ? result : Number(evaluate(`float(${raw})`));
    expect(Number.isFinite(numeric), `SY-F-09 input=${input} parsed=${parsed} raw=${raw} numeric=${numeric}`).toBe(true);
    expect(numeric).toBeCloseTo(0.5, 8);
  });

  it("SY-F-06: reciprocal of sine is two, not inverse sine", () => {
    const input = byId["SY-F-06"].entrada;
    const parsed = parseExpression(input).algebrite;
    const raw = evaluate(parsed);
    const result = Number(raw);
    const numeric = Number.isFinite(result) ? result : Number(evaluate(`float(${raw})`));
    expect(numeric).toBeCloseTo(2, 8);
  });
  it("SY-F-04: function power sin²(pi/6) is one quarter", () => {
    expect(byId["SY-F-04"].operacion).toBe("valor");
    const input = byId["SY-F-04"].entrada;
    const parsed = parseExpression(input).algebrite;
    const exact = evaluate(parsed);
    const floated = evaluate(`float(${exact})`);
    const numeric = Number(floated.trim().replace(/(?:\.\.\.|…)$/, ""));
    expect(Number.isFinite(numeric), `SY-F-04 input=${input} parsed=${parsed} exact=${exact} floated=${floated}`).toBe(true);
    expect(numeric).toBeCloseTo(0.25, 5);
  });

  it("SY-F-05: inverse sine of one half is pi/6, not reciprocal sine", () => {
    expect(byId["SY-F-05"].operacion).toBe("valor");
    const input = byId["SY-F-05"].entrada;
    const parsed = parseExpression(input).algebrite;
    const exact = evaluate(parsed);
    const floated = evaluate(`float(${exact})`);
    const numeric = Number(floated.trim().replace(/(?:\.\.\.|…)$/, ""));
    expect(Number.isFinite(numeric), `SY-F-05 input=${input} parsed=${parsed} exact=${exact} floated=${floated}`).toBe(true);
    expect(numeric).toBeCloseTo(Math.PI / 6, 5);
    expect(numeric).not.toBeCloseTo(2, 4);
  });

  it("SY-F-07: inverse tangent of one equals pi/4", () => {
    expect(byId["SY-F-07"].operacion).toBe("valor");
    const input = byId["SY-F-07"].entrada;
    const parsed = parseExpression(input).algebrite;
    const exact = evaluate(parsed);
    const floated = evaluate(`float(${exact})`);
    const numeric = Number(floated.trim().replace(/(?:\.\.\.|…)$/, ""));
    expect(Number.isFinite(numeric), `SY-F-07 input=${input} parsed=${parsed} exact=${exact} floated=${floated}`).toBe(true);
    expect(numeric).toBeCloseTo(Math.PI / 4, 5);
    expect(numeric).not.toBeCloseTo(1 / Math.tan(1), 4);
  });

  it("SY-F-01: sin x + 1 must not capture +1 inside sine", () => {
    expect(byId["SY-F-01"].operacion).toBe("interpretacion");
    const parsed = parseExpression(byId["SY-F-01"].entrada).algebrite;
    const substituted = parsed.replace(/\bx\b/g, "(2)");
    const exact = evaluate(substituted);
    const floated = evaluate(`float(${exact})`);
    const numeric = Number(floated.trim().replace(/(?:\.\.\.|…)$/, ""));
    expect(Number.isFinite(numeric), `SY-F-01 parsed=${parsed} exact=${exact} floated=${floated}`).toBe(true);
    expect(numeric).toBeCloseTo(Math.sin(2) + 1, 5);
    expect(numeric).not.toBeCloseTo(Math.sin(3), 4);
  });

  it("SY-F-02: adjacent sine and cosine multiply, without nesting", () => {
    expect(byId["SY-F-02"].operacion).toBe("interpretacion");
    const parsed = parseExpression(byId["SY-F-02"].entrada).algebrite;
    const substituted = parsed.replace(/\bx\b/g, "(1)");
    const exact = evaluate(substituted);
    const floated = evaluate(`float(${exact})`);
    const numeric = Number(floated.trim().replace(/(?:\.\.\.|…)$/, ""));
    expect(Number.isFinite(numeric), `SY-F-02 parsed=${parsed} exact=${exact} floated=${floated}`).toBe(true);
    expect(numeric).toBeCloseTo(Math.sin(1) * Math.cos(1), 5);
  });

  it("SY-F-08: sin2x binds both factors inside sine by the declared convention", () => {
    expect(byId["SY-F-08"].operacion).toBe("convencion");
    const parsed = parseExpression(byId["SY-F-08"].entrada).algebrite;
    const substituted = parsed.replace(/\bx\b/g, "(1)");
    const exact = evaluate(substituted);
    const floated = evaluate(`float(${exact})`);
    const numeric = Number(floated.trim().replace(/(?:\.\.\.|…)$/, ""));
    expect(Number.isFinite(numeric), `SY-F-08 parsed=${parsed} exact=${exact} floated=${floated}`).toBe(true);
    expect(numeric).toBeCloseTo(Math.sin(2), 5);
    expect(numeric).not.toBeCloseTo(2 * Math.sin(1), 4);
  });

  it.each(["SY-F-10", "SY-F-11"])("%s: explicit 30 degrees evaluates to one half", (id) => {
    expect(byId[id].operacion).toBe("valor");
    const input = byId[id].entrada;
    const parsed = parseExpression(input).algebrite;
    const exact = evaluate(parsed);
    const floated = evaluate(`float(${exact})`);
    const numeric = Number(floated.trim().replace(/(?:\.\.\.|…)$/, ""));
    expect(Number.isFinite(numeric), `${id} input=${input} parsed=${parsed} exact=${exact} floated=${floated}`).toBe(true);
    expect(numeric).toBeCloseTo(0.5, 5);
  });

  it("SY-F-12: cosine squared plus sine squared is one", () => {
    expect(byId["SY-F-12"].operacion).toBe("equivalente");
    const input = byId["SY-F-12"].entrada;
    const parsed = parseExpression(input).algebrite;
    for (const x of [0, 0.7, 2]) {
      const exact = evaluate(parsed.replace(/\bx\b/g, `(${x})`));
      const floated = evaluate(`float(${exact})`);
      const numeric = Number(floated.trim().replace(/(?:\.\.\.|…)$/, ""));
      expect(Number.isFinite(numeric), `SY-F-12 input=${input} parsed=${parsed} x=${x} exact=${exact} floated=${floated}`).toBe(true);
      expect(numeric).toBeCloseTo(1, 5);
    }
  });

  it.each([
    ["SY-F-13", Math.log(4), Math.log(2) ** 2],
    ["SY-F-14", Math.log(2) ** 2, Math.log(4)],
  ] as const)("%s: log argument power vs function power", (id, expected, incorrect) => {
    const input = byId[id].entrada;
    expect(byId[id].operacion).toBe(id === "SY-F-13" ? "interpretacion" : "convencion");
    const parsed = parseExpression(input).algebrite;
    const substituted = parsed.replace(/\bx\b/g, "(2)");
    const exact = evaluate(substituted);
    const floated = evaluate("float(" + exact + ")");
    const numeric = Number(floated.trim().replace(/(?:\.\.\.|…)$/, ""));
    expect(Number.isFinite(numeric), id + " input=" + input + " parsed=" + parsed + " exact=" + exact + " floated=" + floated).toBe(true);
    expect(numeric).toBeCloseTo(expected, 5);
    expect(numeric).not.toBeCloseTo(incorrect, 4);
  });
  it.each([["SY-F-15", 2], ["SY-F-16", 3], ["SY-F-17", 3]] as const)("%s: declared logarithm base", (id, expected) => {
    expect(byId[id].operacion).toBe("valor");
    const input = byId[id].entrada;
    const parsed = parseExpression(input).algebrite;
    const exact = evaluate(parsed);
    const floated = evaluate("float(" + exact + ")");
    const numeric = Number(floated.trim().replace(/(?:\.\.\.|…)$/, ""));
    expect(Number.isFinite(numeric), id + " input=" + input + " parsed=" + parsed + " exact=" + exact + " floated=" + floated).toBe(true);
    expect(numeric).toBeCloseTo(expected, 5);
  });
  it("SY-F-18: log base 2 of x plus 1 is not log base 2 of (x+1)", () => {
    expect(byId["SY-F-18"].operacion).toBe("interpretacion");
    const input = byId["SY-F-18"].entrada;
    const parsed = parseExpression(input).algebrite;
    const exact = evaluate(parsed.replace(/\bx\b/g, "(8)"));
    const numeric = Number(evaluate("float(" + exact + ")").replace(/(?:\.\.\.|…)$/, ""));
    expect(Number.isFinite(numeric), "SY-F-18 parsed=" + parsed + " exact=" + exact).toBe(true);
    expect(numeric).toBeCloseTo(4, 5);
    expect(numeric).not.toBeCloseTo(Math.log2(9), 4);
  });
  it("SY-F-19: change of base ln(b)/ln(a) computes log base a of b", () => {
    expect(byId["SY-F-19"].operacion).toBe("equivalente");
    const parsed = parseExpression(byId["SY-F-19"].entrada).algebrite;
    const substituted = parsed.replace(/\ba\b/g, "(2)").replace(/\bb\b/g, "(8)");
    const exact = evaluate(substituted);
    const numeric = Number(evaluate("float(" + exact + ")").replace(/(?:\.\.\.|…)$/, ""));
    expect(Number.isFinite(numeric), "SY-F-19 parsed=" + parsed + " exact=" + exact).toBe(true);
    expect(numeric).toBeCloseTo(3, 5);
  });
  it("SY-F-20: natural logarithm of e is one", () => {
    expect(byId["SY-F-20"].operacion).toBe("valor");
    const parsed = parseExpression(byId["SY-F-20"].entrada).algebrite;
    const exact = evaluate(parsed);
    const numeric = Number(evaluate("float(" + exact + ")").replace(/(?:\.\.\.|…)$/, ""));
    expect(Number.isFinite(numeric), "SY-F-20 parsed=" + parsed + " exact=" + exact).toBe(true);
    expect(numeric).toBeCloseTo(1, 5);
  });
});
