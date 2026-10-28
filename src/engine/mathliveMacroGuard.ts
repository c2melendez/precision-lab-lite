/**
 * EN-SG-06/07 (Lite R325): MathLive is not KaTeX — it does not expand
 * TeX \def / \newcommand the same way. User-supplied recursive definitions
 * still must not reach math-field.value as an unbounded expansion risk.
 *
 * Product bound: detect TeX primitive macro/assignment commands and refuse
 * them on the display path. Safe math (frac, powers, etc.) is unchanged.
 */

export type MathliveFallbackReason = "syntax" | null;

/** TeX primitives that define or rebind control sequences (EN-SG-06/07). */
const TEX_MACRO_PRIMITIVES =
  /\\(?:def|edef|gdef|xdef|newcommand|renewcommand|providecommand|let|futurelet|catcode|mathcode|lccode|uccode|sfcode|delcode|chardef|mathchardef)\b/i;

/** Shell / file primitives (defense in depth; also covered by EN-SG-08 arch). */
const TEX_IO_PRIMITIVES =
  /\\(?:input|include|write|write18|openout|openin|read|csname|endcsname)\b/i;

export function hasUnsafeTexPrimitives(latex: string): boolean {
  if (!latex) return false;
  return TEX_MACRO_PRIMITIVES.test(latex) || TEX_IO_PRIMITIVES.test(latex);
}

/**
 * Decide what string may be assigned to a math-field for display.
 * Unsafe → empty value + fallback reason so UI can show plain text.
 */
export function safeMathliveDisplayLatex(latex: string): {
  value: string;
  fallback: MathliveFallbackReason;
} {
  if (hasUnsafeTexPrimitives(latex)) {
    return { value: "", fallback: "syntax" };
  }
  return { value: latex, fallback: null };
}

/** Timed pure-guard probe (no DOM). Used by EN-SG-06/07 unit tests. */
export function probeMacroGuardMs(latex: string): number {
  const t0 = performance.now();
  void safeMathliveDisplayLatex(latex);
  return performance.now() - t0;
}
