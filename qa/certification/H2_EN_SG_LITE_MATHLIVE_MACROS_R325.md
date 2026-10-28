# H2 EN-SG Lite MathLive macros R325

**Status:** PASS (scoped display path) · **As of:** 2026-10-28 UTC
**Product SHA:** `991bd219fb83c548b83bd0cae5bc550adbeeaabd`
**Test-fix SHA:** `effa9f54b0012bc2ce14ab167b23873aea474ec9`
**CI:** [40759428403](https://github.com/c2melendez/precision-lab-lite/actions/runs/40759428403) SUCCESS

## Why Lite ≠ Plus for EN-SG-06/07

Plus pins KaTeX `maxExpand=1000` and surfaces `data-render-fallback` on expansion failure.
Lite displays via MathLive `<math-field read-only>` (Shadow DOM). MathLive does **not** expand TeX `\def` / `\newcommand` the same way KaTeX does, but recursive primitives must still not enter `math-field.value` unbounded.

## Product bound

Module: `src/engine/mathliveMacroGuard.ts`

- Detects TeX macro primitives: `\def`, `\edef`, `\gdef`, `\xdef`, `\newcommand`, `\renewcommand`, `\providecommand`, `\let`, `\futurelet`, `\catcode`, …
- Detects IO primitives: `\input`, `\write18`, `\csname`, …
- `safeMathliveDisplayLatex(latex)` → empty value + `fallback: "syntax"` when unsafe

`StaticMath` calls the guard before assignment and sets `data-render-fallback="syntax"` on refusal.

## Tests

`tests/h2EnSgLiteMathliveMacros.test.ts`

- EN-SG-06 recursive `\def` / `\edef` / `\gdef` refused in <2s
- EN-SG-07 `\newcommand` / `\let` / `\catcode` refused in <2s
- Safe math (`\frac`, powers, factorials) passes through unchanged
- Source contracts: StaticMath wires guard + attribute; no `dangerouslySetInnerHTML`

## Classification

| ID | Status |
|----|--------|
| EN-SG-06 | **PASS scoped display** |
| EN-SG-07 | **PASS scoped display** |
| EN-SG-21 | GAP (product decision) |
| EN-SG-28 | GAP (UI stop/recovery) |
| EN-SG-32 | N/A (no multi-tenant HTTP) |

Global certification remains **OPEN**. SECURITY-S25 remains **BLOCKED** (bilateral).
