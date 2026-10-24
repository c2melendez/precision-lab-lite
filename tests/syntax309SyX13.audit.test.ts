import { expect, it, vi } from "vitest";
import fixture from "../qa/certification/syntax309_cases.jsonl?raw";
import { derivative, evaluate } from "../src/engine/algebriteClient";
import { parseExpression } from "../src/engine/parsing";

it("SY-X-13 checks original nested derivative against oracle at positive sample points", () => {
  const row = fixture.trim().split("\n").map(line => JSON.parse(line)).find(row => row.id === "SY-X-13");
  expect(row.entrada).toBe("\\frac{d}{dx}x^{x^{x}}");
  expect(row.esperado).toBe("x^{x^{x}}\\left(x^{x}(\\ln x+1)\\ln x+x^{x-1}\\right)");
  const input = parseExpression("x^{x^{x}}", "RAD").algebrite;
  const oracle = parseExpression(row.esperado, "RAD").algebrite;
  const actual = derivative(input, "x", 1);
  for (const x of [1.25, 1.5, 2]) {
    const diff = Number(evaluate("float(subst(" + x + ",x,(" + actual + ")-(" + oracle + ")))"));
    expect(Number.isFinite(diff)).toBe(true);
    expect(Math.abs(diff)).toBeLessThan(1e-6);
  }
  expect(evaluate(parseExpression("2+3", "RAD").algebrite)).toBe("5");
});

it("SY-X-13 original parser and actual Worker handler preserve exact derivative and result reentry", async () => {
  const row = fixture.trim().split("\n").map(line => JSON.parse(line)).find(row => row.id === "SY-X-13");
  const scope = {postMessage:vi.fn(), onmessage:undefined as any};
  vi.stubGlobal("self",scope);
  try {
    await import("../src/workers/compute.worker");
    const oracle = parseExpression(row.esperado).algebrite;
    const ids:string[]=[];
    function calculate(source:string) {
      const requestId=`x13-${ids.length}`;
      scope.onmessage!({data:{type:"evaluate",expressionAlgebrite:parseExpression(source).algebrite,requestId}});
      const result=scope.postMessage.mock.calls.at(-1)![0];
      expect(result.success,JSON.stringify(result)).toBe(true);
      expect(result.requestId).toBe(requestId);
      ids.push(requestId);
      return result.resultLatex;
    }
    const actual=calculate(row.entrada);
    const reentry=calculate(actual);
    for(const output of [actual,reentry]) {
      expect(evaluate(`simplify((${parseExpression(output).algebrite})-(${oracle}))`)).toBe("0");
    }
    expect(calculate("2+3")).toBe("5");
    expect(calculate("5")).toBe("5");
    expect(new Set(ids).size).toBe(4);
  } finally {vi.unstubAllGlobals();}
});
