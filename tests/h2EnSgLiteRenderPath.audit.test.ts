/**
 * H2 EN-SG Lite parity — render-path architecture contracts (R323).
 *
 * Lite has no backend and does not use KaTeX.renderToString +
 * dangerouslySetInnerHTML for results. Display goes through
 * <StaticMath> → <math-field read-only> (MathLive Shadow DOM).
 * These tests lock that product choice so EN-SG-01..08 XSS surfaces
 * cannot regress to an HTML-injection path without failing CI.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

function stripComments(source: string): string {
  return source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
}

function readSrc(rel: string): string {
  return readFileSync(resolve(process.cwd(), rel), "utf8");
}

describe("H2 EN-SG Lite render path architecture (R323)", () => {
  it("StaticMath uses readonly math-field and never injects HTML", () => {
    const code = stripComments(readSrc("src/components/StaticMath.tsx"));
    expect(code).toMatch(/math-field/);
    expect(code).toMatch(/readOnly|read-only/);
    expect(code).not.toMatch(/dangerouslySetInnerHTML/);
    expect(code).not.toMatch(/convertLatexToMarkup/);
    expect(code).not.toMatch(/innerHTML\s*=/);
  });

  it("ResultPanel does not inject HTML; delegates math to StaticMath", () => {
    const code = stripComments(readSrc("src/components/ResultPanel.tsx"));
    expect(code).toMatch(/StaticMath/);
    expect(code).not.toMatch(/dangerouslySetInnerHTML/);
    expect(code).not.toMatch(/convertLatexToMarkup/);
    expect(code).not.toMatch(/innerHTML\s*=/);
  });

  it("HistoryLog does not inject HTML; delegates math to StaticMath", () => {
    const code = stripComments(readSrc("src/components/HistoryLog.tsx"));
    expect(code).toMatch(/StaticMath/);
    expect(code).not.toMatch(/dangerouslySetInnerHTML/);
    expect(code).not.toMatch(/convertLatexToMarkup/);
  });

  it("NaturalInput is a MathLive field wrapper (input surface, not HTML sink)", () => {
    const code = stripComments(readSrc("src/components/NaturalInput.tsx"));
    expect(code).toMatch(/math-field/);
    expect(code).not.toMatch(/dangerouslySetInnerHTML/);
    expect(code).not.toMatch(/innerHTML\s*=/);
  });

  it("no src/ component uses dangerouslySetInnerHTML as live code", () => {
    // Guard against a silent reintroduction of the old KaTeX HTML path.
    const files = [
      "src/components/StaticMath.tsx",
      "src/components/ResultPanel.tsx",
      "src/components/HistoryLog.tsx",
      "src/components/NaturalInput.tsx",
      "src/components/StepList.tsx",
      "src/components/Screen.tsx",
    ];
    for (const rel of files) {
      const code = stripComments(readSrc(rel));
      expect(code, rel).not.toMatch(/dangerouslySetInnerHTML/);
    }
  });
});
