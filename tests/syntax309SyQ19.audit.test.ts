import { describe, expect, it } from "vitest";
import source from "../qa/certification/syntax309_cases.jsonl?raw";
import { parseExpression } from "../src/engine/parsing";
import { detectRelationIntent } from "../src/engine/parsing/relationIntent";
import { splitSystemLatex } from "../src/engine/parsing/systemSplit";
import { ErrorCode } from "../src/types";

describe("SY-Q-19 chained equality must not become a successful relation",()=>{
  it("preserves the official error fixture",()=>{
    const row=source.trim().split("\n").map(s=>JSON.parse(s)).find(r=>r.id==="SY-Q-19");
    expect(row.entrada).toBe("x=y=3");
    expect(row.operacion).toBe("error");
    expect(row.esperado).toContain("igualdad encadenada");
    expect(detectRelationIntent(row.entrada)).toBeNull();
    expect(()=>parseExpression(row.entrada)).toThrow();
  });
  it.each(["x=y=3","y=x=3","x = y = 3","x=3=3","x=y=z=3","x=(y=3)","f(x)=x=3"])(
    "does not bypass parser errors for %s",(input)=>{
      expect(detectRelationIntent(input)).toBeNull();
      let caught:any;
      try {parseExpression(input);} catch(error) {caught=error;}
      expect(caught?.code).toBe(ErrorCode.PARSE_ERROR);
      expect(caught?.message).toMatch(/signo|=/);
    });
  it("preserves single relations, definitions and separate system equations",()=>{
    expect(detectRelationIntent("x+y=3")?.kind).toBe("implicitRelation");
    expect(detectRelationIntent("y=x+3")?.kind).toBe("explicitRelation");
    expect(detectRelationIntent("f(x)=x+3")?.kind).toBe("functionDefinition");
    expect(parseExpression("x+1=4").isEquation).toBe(true);
    // Existing external-comparison import convention: == is an alias for =.
    expect(parseExpression("x==3")).toEqual(parseExpression("x=3"));
    const rows=splitSystemLatex(String.raw`\begin{cases}x=y\\ y=3\end{cases}`)!;
    expect(rows).toEqual(["x=y","y=3"]);
    expect(rows.map(r=>parseExpression(r).isEquation)).toEqual([true,true]);
  });
});
