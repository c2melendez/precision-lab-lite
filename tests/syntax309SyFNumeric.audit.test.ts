import { describe, expect, it } from "vitest";
import fixture from "../qa/certification/syntax309_cases.jsonl?raw";
import { parseExpression, rewriteReciprocalFunctions } from "../src/engine/parsing";
import { evaluate } from "../src/engine/algebriteClient";
import { compileNumeric } from "../src/engine/numericFallback";

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
  it.each([["SY-F-21", Math.asinh(1)], ["SY-F-22", Math.asinh(1)]] as const)("%s: inverse hyperbolic sine of one", (id, expected) => {
    expect(byId[id].operacion).toBe("valor");
    const input = byId[id].entrada;
    const parsed = parseExpression(input).algebrite;
    // asinh is intentionally evaluated by the numeric fallback, not Algebrite.
    const numeric = compileNumeric(parsed, "__unused__")(0);
    expect(Number.isFinite(numeric), id + " input=" + input + " parsed=" + parsed).toBe(true);
    expect(numeric).toBeCloseTo(expected, 5);
  });
  it("SY-F-23: cosh squared minus sinh squared equals one", () => {
    expect(byId["SY-F-23"].operacion).toBe("equivalente");
    const parsed = parseExpression(byId["SY-F-23"].entrada).algebrite;
    for (const x of [0, 1, 2]) {
      // Evaluate the parsed identity via the calculator numeric path, avoiding
      // display-only truncated Algebrite strings such as "1.000000...".
      const numeric = compileNumeric(parsed, "x")(x);
      expect(Number.isFinite(numeric), "SY-F-23 parsed=" + parsed + " x=" + x).toBe(true);
      expect(numeric).toBeCloseTo(1, 5);
    }
  });
  it.each([["SY-F-24", 1], ["SY-F-25", Math.exp(2)], ["SY-F-26", 3]] as const)("%s: hyperbolic reciprocal and exponential witnesses", (id, expected) => {
    expect(byId[id].operacion).toBe("valor");
    const input = byId[id].entrada;
    const parsed = parseExpression(input).algebrite;
    // Match the production reciprocal-function rewrite before numeric fallback.
    const numericExpression = rewriteReciprocalFunctions(parsed);
    const numeric = compileNumeric(numericExpression, "__unused__")(0);
    expect(Number.isFinite(numeric), id + " input=" + input + " parsed=" + parsed + " numericExpression=" + numericExpression).toBe(true);
    expect(numeric).toBeCloseTo(expected, 6);
  });
  it("SY-F-27: adjacent sine factors are squared sine, not sine of squared x", () => {
    expect(byId["SY-F-27"].operacion).toBe("equivalente");
    const parsed = parseExpression(byId["SY-F-27"].entrada).algebrite;
    for (const x of [0.4, 1.2]) {
      const actual = compileNumeric(parsed, "x")(x);
      expect(actual).toBeCloseTo(Math.sin(x) ** 2, 9);
      expect(actual).not.toBeCloseTo(Math.sin(x * x), 4);
    }
  });
  it("SY-F-28: nested sine cosine tangent evaluates from inside out", () => {
    expect(byId["SY-F-28"].operacion).toBe("valor");
    const parsed = parseExpression(byId["SY-F-28"].entrada).algebrite;
    const actual = compileNumeric(parsed, "__unused__")(0);
    expect(Number.isFinite(actual), "SY-F-28 parsed=" + parsed).toBe(true);
    expect(actual).toBeCloseTo(Math.sin(Math.cos(Math.tan(0))), 9);
  });
  it("SY-F-29: original arcsin(2) LaTeX is outside the real domain", () => {
    expect(byId["SY-F-29"].operacion).toBe("error");
    const input = byId["SY-F-29"].entrada;
    const parsed = parseExpression(input).algebrite;
    // Do not silently reinterpret the operator name as arc * sin * 2.
    expect(["asin(2)", "arcsin(2)"]).toContain(parsed.toLowerCase().replace(/\s+/g, ""));
    let finiteReal = false;
    try {
      finiteReal = Number.isFinite(compileNumeric(parsed, "__unused__")(0));
    } catch {
      // A real-domain rejection is acceptable by the case contract.
    }
    expect(finiteReal, "SY-F-29 must not yield a finite real result: " + parsed).toBe(false);
  });
  it("SY-F-30: square root applies to x only, then multiplies by y", () => {
    expect(byId["SY-F-30"].operacion).toBe("interpretacion");
    const parsed = parseExpression(byId["SY-F-30"].entrada).algebrite;
    const substituted = parsed.replace(/\bx\b/g, "(9)").replace(/\by\b/g, "(2)");
    const actual = compileNumeric(substituted, "__unused__")(0);
    expect(Number.isFinite(actual), "SY-F-30 parsed=" + parsed).toBe(true);
    expect(actual).toBeCloseTo(6, 9);
    expect(actual).not.toBeCloseTo(Math.sqrt(18), 5);
  });
  it("SY-F-31: unbraced sqrt3 means square root of three", () => {
    expect(byId["SY-F-31"].operacion).toBe("valor");
    const parsed = parseExpression(byId["SY-F-31"].entrada).algebrite;
    const actual = compileNumeric(parsed, "__unused__")(0);
    expect(actual, "SY-F-31 parsed=" + parsed).toBeCloseTo(Math.sqrt(3), 9);
  });
  it.each([
    ["SY-F-32", 2],
    ["SY-F-33", -2],
    ["SY-F-34", 2],
  ] as const)("%s: source LaTeX indexed root follows real-root convention", (id, expected) => {
    expect(byId[id].operacion).toBe("valor");
    const parsed = parseExpression(byId[id].entrada).algebrite;
    const actual = compileNumeric(parsed, "__unused__")(0);
    expect(Number.isFinite(actual), id + " parsed=" + parsed).toBe(true);
    expect(actual, id + " parsed=" + parsed).toBeCloseTo(expected, 9);
  });
  it("SY-F-35: nested square roots of sixteen evaluate to two", () => {
    expect(byId["SY-F-35"].operacion).toBe("valor");
    const parsed = parseExpression(byId["SY-F-35"].entrada).algebrite;
    const actual = compileNumeric(parsed, "__unused__")(0);
    expect(actual, "SY-F-35 parsed=" + parsed).toBeCloseTo(2, 9);
  });
  it.each([
    ["\\sqrt[2]{(-3)^{2}}", 3],
    ["\\sqrt[2]{3^{2}}", 3],
    ["\\sqrt[3]{(-3)^{3}}", -3],
    ["\\sqrt[3]{3^{3}}", 3],
    ["\\sqrt[4]{(-2)^{4}}", 2],
  ] as const)("SY-F-36: concrete indexed-radical parity %s", (input, expected) => {
    expect(byId["SY-F-36"].operacion).toBe("equivalente");
    const parsed = parseExpression(input).algebrite;
    const numeric = compileNumeric(parsed, "__unused__")(0);
    expect(Number.isFinite(numeric), "SY-F-36 parsed=" + parsed).toBe(true);
    expect(numeric).toBeCloseTo(expected, 9);
  });
  it("SY-F-37: original absolute-value LaTeX of negative three is three", () => {
    expect(byId["SY-F-37"].operacion).toBe("valor");
    const parsed = parseExpression(byId["SY-F-37"].entrada).algebrite;
    const actual = compileNumeric(parsed, "__unused__")(0);
    expect(actual, "SY-F-37 parsed=" + parsed).toBeCloseTo(3, 9);
  });
  it.each(["SY-F-38", "SY-F-39"])("%s: absolute value syntax from official LaTeX returns three", (id) => {
    expect(byId[id].operacion).toBe("valor");
    const input = byId[id].entrada;
    const parsed = parseExpression(input).algebrite;
    const numeric = compileNumeric(parsed, "__unused__")(0);
    expect(numeric, id + " input=" + input + " parsed=" + parsed).toBeCloseTo(3, 9);
  });
  it("SY-F-40: nested absolute bars do not silently change meaning", () => {
    expect(byId["SY-F-40"].operacion).toBe("convencion");
    const input = byId["SY-F-40"].entrada;
    try {
      const parsed = parseExpression(input).algebrite;
      for (const [x, expected] of [[-3, 1], [0, 2], [5, 3]] as const) {
        const substituted = parsed.replace(/\bx\b/g, "(" + x + ")");
        const actual = compileNumeric(substituted, "__unused__")(0);
        expect(Number.isFinite(actual), "SY-F-40 input=" + input + " parsed=" + parsed).toBe(true);
        expect(actual).toBeCloseTo(expected, 9);
      }
    } catch (error) {
      // The contract permits a clear request for explicit delimiters instead
      // of guessing how nested typed bars should pair.
      const message = (error instanceof Error ? error.message : (error && typeof error === "object" && "message" in error ? String(error.message) : String(error)));
      expect(message).toMatch(/ambigu|delimit|barra|\\\\lvert|\\\\rvert/i);
    }
  });
  it("SY-F-41: source LaTeX floor of 3.7 is three", () => {
    expect(byId["SY-F-41"].operacion).toBe("valor");
    const parsed = parseExpression(byId["SY-F-41"].entrada).algebrite;
    const actual = compileNumeric(parsed, "__unused__")(0);
    expect(Number.isFinite(actual), "SY-F-41 parsed=" + parsed).toBe(true);
    expect(actual).toBe(3);
  });

  it("SY-F-42: source LaTeX ceiling of 3.2 is four", () => {
    expect(byId["SY-F-42"].operacion).toBe("valor");
    const parsed = parseExpression(byId["SY-F-42"].entrada).algebrite;
    const actual = compileNumeric(parsed, "__unused__")(0);
    expect(Number.isFinite(actual), "SY-F-42 parsed=" + parsed).toBe(true);
    expect(actual).toBe(4);
  });

});
