# H2 EN-SG Lite parity audit R323

**Status:** PARTIAL · **As of:** 2026-10-28 UTC · **HEAD (docs push):** to be filled by continuity · **Architecture baseline SHA:** `c6ecd40ea934c37c5f13f3d9c834b88d6ec7534c`
**Canonical branch:** `qa/syntax-audit-in625-a1`
**Rule:** Lite evidence is independent of Plus. Do not import Plus PASS rows.

## Architecture (Lite ≠ Plus)

| Surface | Plus | Lite |
|---------|------|------|
| Math display | `MathRenderer` → `katex.renderToString` + conditional `dangerouslySetInnerHTML` | `StaticMath` → `<math-field read-only>` (MathLive **Shadow DOM**) |
| Math input | MathLive / forms | `NaturalInput` → `<math-field>` |
| Backend API | FastAPI `/api/v1/evaluate` | **None** (Algebrite in-browser) |
| XSS HTML sink | Guarded KaTeX path + markup regex | **No live `dangerouslySetInnerHTML`** in result/history/input components |

Historical note: ResultPanel/HistoryLog previously used `convertLatexToMarkup` + `dangerouslySetInnerHTML`; Fase 2.6 replaced that with StaticMath. Comments still mention the old path; live code does not.

## Traceability (Lite)

| ID | Theme | Lite classification | Evidence |
|----|-------|---------------------|----------|
| EN-SG-01 | `<script>…` | **PASS (scoped architecture)** | No HTML injection path; StaticMath/ResultPanel/HistoryLog/NaturalInput contracts in `tests/h2EnSgLiteRenderPath.audit.test.ts` |
| EN-SG-02 | `<img onerror=…>` | **PASS (scoped architecture)** | Same |
| EN-SG-03 | HTML inside math text | **PASS (scoped architecture)** | Same; display is Shadow DOM, not light-DOM HTML from user LaTeX |
| EN-SG-04 | `\href{javascript:…}` | **PASS (scoped architecture)** | No KaTeX HTML anchor surface on result path |
| EN-SG-05 | `\url` / `\includegraphics` / htmlClass/Style | **PASS (scoped architecture)** | Same |
| EN-SG-06 | Recursive `\def` | **PARTIAL** | MathLive field value assignment is not KaTeX expansion; no dedicated maxExpand pin; no hang test in CI yet |
| EN-SG-07 | `\newcommand` / `\let` / `\catcode` | **PARTIAL** | Same as 06 |
| EN-SG-08 | `\input` / `\write18` / … | **PASS (scoped architecture)** | Browser client; no TeX shell/file primitives on display path; no backend |
| EN-SG-09..20, 22, 29..31 | Engine / input bounds | **PARTIAL / inventory** | Client Algebrite surface; not re-audited in R323 |
| EN-SG-21 | 10k-term sum | **GAP** | Product/contract decision (no 500-char HTTP body; different surface) |
| EN-SG-23..27 | Astronomical powers / factorial / huge symbolic power | **GAP** | Need explicit client-engine bounds + timed tests (not present as Plus-style API COMPLEXITY_LIMIT) |
| EN-SG-28 | Stop + recovery UI | **GAP** | UI stop/recovery not closed |
| EN-SG-32 | Rate limit burst | **OUT_OF_SCOPE / N/A** | No multi-tenant HTTP API on Lite |

## CI contract tests

- File: `tests/h2EnSgLiteRenderPath.audit.test.ts`
- Asserts absence of `dangerouslySetInnerHTML` / `convertLatexToMarkup` / `innerHTML=` in live code of key components, and presence of `math-field` + readonly on StaticMath.
- Included by `vitest` `tests/**/*.test.ts`.

## Next Lite steps

1. Timed MathLive-field probes for EN-SG-06/07 (or explicit MathLive config bounds) if product requires parity with Plus maxExpand semantics.
2. Client-engine complexity guards for EN-SG-23..27 with regression tests.
3. EN-SG-28 UI stop/recovery when product exposes it.
4. Do not claim bilateral SECURITY-S25 closed until explicit acceptance (Lite npm audit already 0 after deepmerge vendor patch).

Global certification remains **OPEN**.
