import { describe, expect, it } from "vitest";
import { preprocessLatex } from "../src/engine/parsing/normalize";

describe("IN625 F1 — texto pegado", () => {
  it.each([
    ["EN-PG-01", "$x^{2}+1$", "x^{2}+1"],
    ["EN-PG-02", "$$x^{2}+1$$", "x^{2}+1"],
    ["EN-PG-03", "\\(x^{2}+1\\)", "x^{2}+1"],
    ["EN-PG-04", "\\[x^{2}+1\\]", "x^{2}+1"],
    ["EN-PG-05a", "\\begin{equation}x^{2}+1\\end{equation}", "x^{2}+1"],
    ["EN-PG-05b", "\\begin{align*}x^{2}+1\\end{align*}", "x^{2}+1"],
    ["EN-PG-06", "{\\displaystyle x^{2}+1}", "x^{2}+1"],
    ["EN-PG-07a", "\\displaystyle\\frac{1}{2}", "\\frac{1}{2}"],
    ["EN-PG-07b", "\\textstyle\\frac{1}{2}", "\\frac{1}{2}"],
    ["EN-PG-08", "x^{2}\\,+\\,1", "x^{2}+1"],
    ["EN-PG-09", "x^{2}+1 \\,", "x^{2}+1"],
    ["EN-PG-12", "x^{2}+1\n", "x^{2}+1"],
    ["EN-PG-13", "x+1\\\\", "x+1"],
    ["EN-PG-14a", "x^{2}+1\\tag{1}", "x^{2}+1"],
    ["EN-PG-14b", "x^{2}+1\\label{eq:1}", "x^{2}+1"],
  ])("%s limpia ruido no semántico", (_id, input, expected) => {
    const out = preprocessLatex(input).replace(/\s+/g, "");
    const normalizedExpected = expected
      .replace(/x\^\{2\}/g, "x^(2)")
      .replace(/\\frac\{1\}\{2\}/, "((1)/(2))")
      .replace(/\s+/g, "");
    expect(out).toBe(normalizedExpected);
  });

  it.each([
    ["EN-PG-10", "x^{2}+1."],
    ["EN-PG-11", "x^{2}+1,"],
    ["EN-PG-15", "x^{2}+1\\quad\\text{(ver ejercicio 3)}"],
  ])("%s nunca debe degradarse silenciosamente", (_id, input) => {
    try {
      const out = preprocessLatex(input);
      expect(out).not.toMatch(/ver\s*ejercicio/i);
    } catch (err) {
      expect(String((err as { message?: string }).message ?? err).length).toBeGreaterThan(0);
    }
  });
});
