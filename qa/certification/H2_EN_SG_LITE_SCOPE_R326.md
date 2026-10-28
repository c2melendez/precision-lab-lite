# H2 EN-SG Lite scope close R326 — EN-SG-21 / EN-SG-28

**As of:** 2026-10-28 UTC · **Branch:** `qa/syntax-audit-in625-a1`

## Product decisions (authorized)

### EN-SG-21 — length contract (not unbounded 10k-term CAS work)

**Decision:** Reject by length before CAS for oversize input.

| Item | Value |
|------|--------|
| Bound | `MAX_EXPRESSION_LENGTH = 12000` |
| Why 12000 | SY-X-06 certifies a **10000-character** sum (`"1+".repeat(4999)+"11"` → 5010). Bound must be &gt; 10000. |
| Error | `COMPLEXITY_LIMIT` |

**Classification:** **PASS (scoped length contract)**.

### EN-SG-28 — stop + recovery UI

**OUT_OF_SCOPE** — no user cancel UI; safety is preemptive bounds only.

### EN-SG-32

**N/A**.

## Global

SECURITY-S25 **BLOCKED** (bilateral). Global **OPEN**.
