import { describe, expect, it } from "vitest";
import source from "../qa/certification/syntax309_cases.jsonl?raw";
import { tokenize } from "../src/engine/parsing/tokenize";
import { parseExpression } from "../src/engine/parsing";
const row = source.trim().split("\n").map(line => JSON.parse(line)).find(x => x.id === "SY-V-26");
describe("SY-V-26 ambiguous bare sinx — Lite convention", () => {
 it("declares bare letters as product, not an implicit trig call", () => {
   expect(row.entrada).toBe("sinx");
   expect(row.operacion).toBe("convencion");
   expect(row.nota).toMatch(/funci[oó]n/);
   const tokens = tokenize("sinx");
   expect(tokens.map(t => t.type)).not.toContain("function");
   const interpreted = parseExpression("sinx").algebrite;
   expect(interpreted).not.toContain("sin(");
   expect(interpreted).toContain("*");
 });
 it("distinguishes an explicit sin(x) call from bare sinx", () => {
   const explicit = parseExpression("sin(x)").algebrite;
   expect(explicit).toContain("sin(");
   expect(explicit).not.toBe(parseExpression("sinx").algebrite);
 });
});
