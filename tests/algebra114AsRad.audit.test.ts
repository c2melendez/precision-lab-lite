import { describe, expect, it } from "vitest";
import { evaluate } from "../src/engine/algebriteClient";
import { parseExpression } from "../src/engine/parsing";
import { solveAlgebra } from "../src/engine/stepEngine/algebra";
import source from "../qa/certification/algebra114_source.md?raw";

// Algebra114 AS-RAD-01..10: every official root returned, every candidate from
// raising to a power named and discarded, each root checked with real semantics.
const CASES: [string, string, string, string[], string[]][] = [
  ["AS-RAD-01", String.raw`\(\sqrt{x}=-2\)`, "sqrt(x)=-2", [], ["4"]],
  ["AS-RAD-02", String.raw`\(\sqrt{x+3}=x+1\)`, "sqrt(x+3)=x+1", ["1"], ["-2"]],
  ["AS-RAD-03", String.raw`\(\sqrt{2x-1}=x-1\)`, "sqrt(2x-1)=x-1", ["2+sqrt(2)"], ["2-sqrt(2)"]],
  ["AS-RAD-04", String.raw`\(\sqrt{x^{2}}=x-1\)`, "sqrt(x^2)=x-1", [], ["1/2"]],
  ["AS-RAD-05", String.raw`\(\sqrt{3-x}=x\)`, "sqrt(3-x)=x", ["(-1+sqrt(13))/2"], ["(-1-sqrt(13))/2"]],
  ["AS-RAD-06", String.raw`\(\sqrt[4]{x}=-1\)`, "x^(1/4)=-1", [], ["1"]],
  ["AS-RAD-07", String.raw`\(\sqrt[3]{x-1}=x-1\)`, "cbrt(x-1)=x-1", ["0", "1", "2"], []],
  ["AS-RAD-08", String.raw`\(\sqrt{x}+\sqrt{x-1}=1\)`, "sqrt(x)+sqrt(x-1)=1", ["1"], []],
  ["AS-RAD-09", String.raw`\(\sqrt{x-1}=x-3\)`, "sqrt(x-1)=x-3", ["5"], ["2"]],
  ["AS-RAD-10", String.raw`\(\sqrt{x}+\sqrt{x+3}=3\)`, "sqrt(x)+sqrt(x+3)=3", ["1"], []],
];

const same = (values: string[], expected: string[]) =>
  values.length === expected.length && expected.every((e) => values.some((v) => evaluate(`simplify((${v})-(${e}))`) === "0"));

function realResidual(equation: string, root: string): number {
  const [l, r] = equation.split("=");
  const js = (s: string) => s
    .replace(/(\d)x/g, "$1*x").replace(/cbrt\(/g, "Math.cbrt(").replace(/sqrt\(/g, "Math.sqrt(")
    .replace(/x\^\(1\/4\)/g, "Math.pow(x,0.25)").replace(/\^/g, "**");
  const value = Function(`return (${root.replace(/\^/g, "**")});`)() as number;
  return Function("x", `return (${js(l)})-(${js(r)});`)(value) as number;
}

describe("Algebra114 AS-RAD radical equations over R", () => {
  it.each(CASES)("%s matches the official row", (id, cell) => {
    expect(source).toContain(`| ${id} | `);
    expect(source).toContain(` | ${cell} | `);
  });

  it.each(CASES)("%s keeps official roots and discards extraneous ones", (id, _cell, equation, expected, extraneous) => {
    const parsed = parseExpression(equation);
    const result = solveAlgebra(parsed.leftAlgebrite, parsed.rightAlgebrite, "x");
    expect(same(result.solutionsAlgebrite, expected), `${id} ${JSON.stringify(result.solutionsAlgebrite)}`).toBe(true);
    expect(result.truth).toBe(expected.length === 0 ? "contradiction" : undefined);
    for (const root of result.solutionsAlgebrite) expect(Math.abs(realResidual(equation, root))).toBeLessThan(1e-9);
    const text = result.steps.map((s) => s.explanation).join(" ");
    const rejected = [...text.matchAll(/Candidato x = ([^:]+): [^;]*; se descarta/g)].map((m) => m[1]);
    expect(same(rejected, extraneous), `${id} ${text}`).toBe(true);
  });
});
