import { describe, expect, it } from "vitest";
import source from "../qa/certification/syntax309_cases.jsonl?raw";
import { detectChainedInequality } from "../src/engine/parsing/chainedInequality";
import { parseExpression } from "../src/engine/parsing";

describe("SY-Q-08 actual scientific-input chained routing", () => {
 it("splits the canonical inequality into two real parser clauses", () => {
   const row = source.trim().split("\n").map(line => JSON.parse(line)).find(row => row.id === "SY-Q-08");
   expect(row.entrada).toBe("1<x\\le3");
   const chain = detectChainedInequality(row.entrada);
   expect(chain).not.toBeNull();
   expect(chain?.variable).toBe("x");
   const first = parseExpression(chain!.leftClause);
   const second = parseExpression(chain!.rightClause);
   expect(first.isInequality).toBe(true);
   expect(second.isInequality).toBe(true);
   expect(first.inequalityOperator).toBe("<");
   expect(second.inequalityOperator).toBe("<=");
   expect(first.freeVariables).toEqual(["x"]);
   expect(second.freeVariables).toEqual(["x"]);
 });
 it("does not classify ordinary simple inequalities as chains", () => {
   expect(detectChainedInequality("x<3")).toBeNull();
   expect(detectChainedInequality("x<=3")).toBeNull();
 });
});
