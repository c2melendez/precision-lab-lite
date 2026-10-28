# H2 EN-SG Lite scope close R326 — EN-SG-21 / EN-SG-28

**As of:** 2026-10-28 UTC · **Branch:** `qa/syntax-audit-in625-a1`

## Product decisions (authorized)

### EN-SG-21 — length contract (not “evaluate 10k terms”)

**Decision:** Lite does **not** promise evaluating a sum of ~10 000 terms.
The product contract is **reject by length** before CAS, aligned with Plus
`max_length=500` (HTTP 422 there; client `COMPLEXITY_LIMIT` here).

| Item | Value |
|------|--------|
| Bound | `MAX_EXPRESSION_LENGTH = 500` in `algebriteClient.ts` |
| Error | `ErrorCode.COMPLEXITY_LIMIT` |
| Evidence | `tests/h2EnSgLiteLengthAndStop.test.ts` timed &lt;2s |

**Classification:** **PASS (scoped length contract)** — not PASS for “sum 10k in &lt;2s”.

### EN-SG-28 — stop + recovery UI

**Decision:** **OUT_OF_SCOPE** for Lite.

- No multi-tenant backend worker cancel surface.
- No product UI control for user-initiated stop/recovery of a running evaluation.
- Safety relies on **preemptive bounds** already certified: EN-SG-06/07 macros,
  EN-SG-23..27 engine bounds, EN-SG-21 length.

**Classification:** **OUT_OF_SCOPE** (not PASS, not FAIL).

### EN-SG-32

Unchanged: **N/A** (no multi-tenant HTTP API on Lite).

## Global

SECURITY-S25 remains **BLOCKED** (bilateral). Global certification remains **OPEN**.
