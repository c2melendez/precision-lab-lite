import { describe, expect, it } from "vitest";
import source from "../qa/certification/syntax309_cases.jsonl?raw";
import { splitSystemLatex } from "../src/engine/parsing/systemSplit";
import { parseExpression } from "../src/engine/parsing";
import { evaluate } from "../src/engine/algebriteClient";

const official = source.split("\n").filter(Boolean).map(line => JSON.parse(line))
  .find(row => row.id === "SY-Q-11");

describe("SY-Q-11 official 2x2 scientific system input", () => {
  it("splits source LaTeX and certifies its ordered exact solution", () => {
    expect(official.esperado).toBe("(x,y)=(2,1)");
    const rows = splitSystemLatex(official.entrada);
    expect(rows).toEqual(["x+y=3", "x-y=1"]);
    const parsed = rows!.map(row => parseExpression(row));
    expect(parsed.every(row => row.isEquation)).toBe(true);
    expect([...new Set(parsed.flatMap(row => row.freeVariables))].sort()).toEqual(["x","y"]);
    expect(evaluate(parsed[0].algebrite.replace(/\bx\b/g, "(2)").replace(/\by\b/g, "(1)"))).toBe("0");
    expect(evaluate(parsed[1].algebrite.replace(/\bx\b/g, "(2)").replace(/\by\b/g, "(1)"))).toBe("0");
  });
});
