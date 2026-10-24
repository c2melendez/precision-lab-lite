import { describe, expect, it } from "vitest";
import { evaluate, toDecimalApprox, toLatex } from "../src/engine/algebriteClient";
describe("SY-R decimal precision preserves exact and symbolic contracts", () => {
 it.each([
  ["sqrt(2)/2", Math.SQRT1_2],
  ["2*sqrt(3)", 2 * Math.sqrt(3)],
  ["pi/6", Math.PI/6],
  ["log(2)", Math.log(2)],
 ])("keeps full finite numeric accuracy for native CAS %s", (expression, expected) => {
  const shown = toDecimalApprox(expression);
  expect(shown).not.toBeNull();
  expect(Math.abs(Number(shown) - expected)).toBeLessThanOrEqual(1e-14);
 });
 it.each(["x+1", "__unused__", "i", "1/0"])("does not invent a finite scalar approximation for %s", expression => {
  expect(toDecimalApprox(expression)).toBeNull();
 });
 it("leaves the exact CAS and LaTeX available for reentry", () => {
  const exact = evaluate("sqrt(2)/2");
  const latex = toLatex(exact);
  toDecimalApprox(exact);
  expect(evaluate("sqrt(2)/2")).toBe(exact);
  expect(toLatex(exact)).toBe(latex);
 });
});
