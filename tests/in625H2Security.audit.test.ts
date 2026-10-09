import { describe, expect, it } from "vitest";
import { parseExpression } from "../src/engine/parsing";
import { ErrorCode } from "../src/types";

// IN625 H2: first isolated/parser-level tranche. No browser side effects,
// no network and no resource exhaustion; UI escaping is separately required.
describe("IN625 H2 — safe rejection of active markup and TeX commands", () => {
  const cases = [
    ["EN-SG-01", "<script>alert(1)</script>"],
    ["EN-SG-02", "<img src=x onerror=alert(1)>"],
    ["EN-SG-04", "\\href{javascript:alert(1)}{x}"],
    ["EN-SG-05 url", "\\url{http://example.com}"],
    ["EN-SG-05 image", "\\includegraphics{x.png}"],
    ["EN-SG-05 class", "\\htmlClass{a}{x}"],
    ["EN-SG-05 style", "\\htmlStyle{color:red}{x}"],
    ["EN-SG-06", "\\def\\a{\\a}\\a"],
    ["EN-SG-07", "\\newcommand{\\a}{\\a}\\a"],
    ["EN-SG-08", "\\input{/etc/passwd}"],
    ["EN-SG-07 let", "\\let\\a\\b"],
    ["EN-SG-07 catcode", "\\catcode"],
    ["EN-SG-08 include", "\\include{x}"],
    ["EN-SG-08 write18", "\\write18{ls}"],
    ["EN-SG-08 openin", "\\openin1=x"],
  ] as const;

  for (const [id, input] of cases) {
    it(id + " rejects unsafe input before evaluation", () => {
      expect(() => parseExpression(input)).toThrowError(
        expect.objectContaining({ code: ErrorCode.PARSE_ERROR }),
      );
    });
  }
});
