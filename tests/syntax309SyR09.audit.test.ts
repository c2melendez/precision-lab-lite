import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import fixture from "../qa/certification/syntax309_cases.jsonl?raw";
import { parseExpression } from "../src/engine/parsing";
import { evaluate } from "../src/engine/algebriteClient";
const rows = fixture.trim().split("\n").map(s => JSON.parse(s));
const scope = { postMessage: vi.fn(), onmessage: undefined as any };
beforeAll(async () => { vi.stubGlobal("self", scope); await import("../src/workers/compute.worker"); });
afterAll(() => vi.unstubAllGlobals());

function reply(source: string, type = "evaluate", variable = "x", requestId = "syr09") {
 scope.postMessage.mockClear();
 scope.onmessage!({data:{type, expressionAlgebrite:parseExpression(source, "RAD").algebrite, variable, order:1, requestId}});
 const result = scope.postMessage.mock.calls.at(-1)![0];
 expect(result.success, JSON.stringify(result)).toBe(true);
 expect(result.requestId).toBe(requestId);
 return result;
}
function equivalent(latex: string, expected: string) {
 const actual = parseExpression(latex, "RAD").algebrite;
 expect(evaluate("(" + actual + ")-(" + expected + ")").replace(/\s/g, "")).toBe("0");
}
describe("SY-R-09 antiderivative result reentry and real differentiation", () => {
 it.each([
  [String.raw`\frac{x^{3}}{3}+C`, "x", "x^3/3+C", "x^2", "1"],
  [String.raw`\frac{y^{4}}{4}+C`, "y", "y^4/4+C", "y^3", "1"],
  [String.raw`\frac{x^{3}}{3}+7C`, "x", "x^3/3+7*C", "x^2", "7"],
 ])("preserves the constant and differentiates reentered %s", (source, variable, expected, derivative, constantDerivative) => {
  if (source === String.raw`\frac{x^{3}}{3}+C`) {
   const row = rows.find(row => row.id === "SY-R-09");
   expect(row.entrada).toBe(source);
   expect(row.esperado).toBe("al derivar da `x^{2}`");
  }
  const result = reply(source);
  console.log("SY-R-09", {source, result});
  equivalent(result.resultLatex, expected);
  const restored = reply(result.resultLatex, "evaluate", variable, "syr09-reentry");
  equivalent(restored.resultLatex, expected);
  equivalent(reply(restored.resultLatex, "derivative", variable, "syr09-differentiate").resultLatex, derivative);
  equivalent(reply(restored.resultLatex, "derivative", "C", "syr09-constant").resultLatex, constantDerivative);
  const natural = String.raw`\frac{d}{d` + variable + String.raw`}\left(` + restored.resultLatex + String.raw`\right)`;
  equivalent(reply(natural).resultLatex, derivative);
 });
 it("reenters an actual integral response before differentiation", () => {
  const integral = reply("x^2", "indefiniteIntegral");
  equivalent(integral.resultLatex, "x^3/3+C");
  const result = reply(integral.resultLatex, "derivative", "x", "syr09-integral-reentry");
  equivalent(result.resultLatex, "x^2");
 });
});

describe("SY-R-09 parenthesized derivative binding regression", () => {
 it.each([
  [String.raw`\frac{d}{dy}\left(x^2y+C\right)`, "x^2"],
  [String.raw`\frac{d^2}{dy^2}\left(y^3/3+C\right)`, "2*y"],
  [String.raw`\frac{d}{dC}\left(x^2+C\right)`, "1"],
 ])("binds the explicitly declared variable in %s", (source, expected) => {
  equivalent(reply(source).resultLatex, expected);
 });
});
