import { describe, expect, it } from "vitest";
import source from "../qa/certification/syntax309_cases.jsonl?raw";
import { splitInequality } from "../src/engine/parsing/inequalitySplit";

const fixture = source.trim().split("\n").map(line => JSON.parse(line)).find(row => row.id === "SY-Q-08");

describe("SY-Q-08 Lite capability boundary: chained inequalities", () => {
  it("preserves the official case and reports the chained-input limitation", () => {
    expect(fixture.entrada).toBe("1<x\\le3");
    expect(fixture.esperado).toBe("x\\in(1,3]");
    expect(fixture.operacion).toBe("resolver");
    expect(() => splitInequality("1<x<=3")).toThrow(/una desigualdad simple|no cadenas/);
  });
  it("continues accepting each simple relation separately", () => {
    expect(splitInequality("1<x")).toEqual({left:"1",right:"x",operator:"<"});
    expect(splitInequality("x<=3")).toEqual({left:"x",right:"3",operator:"<="});
  });
});
