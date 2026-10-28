/**
 * H2 EN-SG Lite MathLive macro bounds R325 — EN-SG-06/07.
 *
 * Pure-guard probes (no browser): recursive TeX primitives must be refused
 * in <2s. Architecture contracts lock StaticMath integration.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  hasUnsafeTexPrimitives,
  probeMacroGuardMs,
  safeMathliveDisplayLatex,
} from "../src/engine/mathliveMacroGuard";

const BUDGET_MS = 2000;

function stripComments(source: string): string {
  return source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
}

describe("H2 EN-SG Lite MathLive macro guard (R325)", () => {
  it("EN-SG-06: recursive \\def is refused under time budget", () => {
    const payloads = [
      "\\def\\foo{\\foo}\\foo",
      "\\def\\a{\\a\\a}\\a",
      "\\edef\\x{\\x}\\x",
      "\\gdef\\loop{\\loop}\\loop",
    ];
    for (const p of payloads) {
      const ms = probeMacroGuardMs(p);
      expect(ms, p).toBeLessThan(BUDGET_MS);
      expect(hasUnsafeTexPrimitives(p), p).toBe(true);
      expect(safeMathliveDisplayLatex(p)).toEqual({
        value: "",
        fallback: "syntax",
      });
    }
  });

  it("EN-SG-07: \\newcommand / \\let / \\catcode refused under time budget", () => {
    const payloads = [
      "\\newcommand{\\evil}{\\evil}\\evil",
      "\\renewcommand{\\frac}{\\frac}\\frac{1}{2}",
      "\\let\\a\\b",
      "\\catcode`\\@=11",
      "\\providecommand{\\z}{\\z}",
    ];
    for (const p of payloads) {
      const ms = probeMacroGuardMs(p);
      expect(ms, p).toBeLessThan(BUDGET_MS);
      expect(hasUnsafeTexPrimitives(p), p).toBe(true);
      expect(safeMathliveDisplayLatex(p).fallback).toBe("syntax");
    }
  });

  it("safe display math still passes through", () => {
    const safe = ["\\frac{1}{2}", "x^2+1", "\\sqrt{a+b}", "5!", ""];
    for (const p of safe) {
      expect(hasUnsafeTexPrimitives(p), p).toBe(false);
      expect(safeMathliveDisplayLatex(p)).toEqual({
        value: p,
        fallback: null,
      });
    }
  });

  it("StaticMath wires safeMathliveDisplayLatex and data-render-fallback", () => {
    const code = stripComments(
      readFileSync(resolve(process.cwd(), "src/components/StaticMath.tsx"), "utf8"),
    );
    expect(code).toMatch(/safeMathliveDisplayLatex/);
    expect(code).toMatch(/data-render-fallback/);
    expect(code).toMatch(/math-field/);
    expect(code).not.toMatch(/dangerouslySetInnerHTML/);
  });

  it("mathliveMacroGuard module exports bound helpers", () => {
    const code = stripComments(
      readFileSync(resolve(process.cwd(), "src/engine/mathliveMacroGuard.ts"), "utf8"),
    );
    expect(code).toMatch(/hasUnsafeTexPrimitives/);
    expect(code).toMatch(/safeMathliveDisplayLatex/);
    expect(code).toMatch(/\\(?:def|newcommand|let|catcode)/i);
  });
});
