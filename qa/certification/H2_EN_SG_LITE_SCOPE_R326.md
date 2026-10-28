# H2 EN-SG Lite scope close R326 — EN-SG-21 / EN-SG-28

**As of:** 2026-10-28 UTC · **Branch:** `qa/syntax-audit-in625-a1`

## Product decisions (authorized)

### EN-SG-21 — length contract (not “evaluate 10k terms”)

**Decision:** Lite does **not** promise evaluating a sum of ~10 000 terms.
The product contract is **reject by length** before CAS.

| Item | Value |
|------|--------|
| Bound | `MAX_EXPRESSION_LENGTH = 4000` in `expressionLengthGuard.ts` |
| Error | `ErrorCode.COMPLEXITY_LIMIT` |
| Note | Plus HTTP uses 500; Lite client uses 4000 so certified audits (e.g. SY-X-06) still pass while ~10k-term scale is refused |

**Classification:** **PASS (scoped length contract)**.

### EN-SG-28 — stop + recovery UI

**Decision:** **OUT_OF_SCOPE** for Lite.

- No UI control for user-initiated stop/recovery.
- Safety = preemptive bounds (macros, engine 23–27, length 21).

**Classification:** **OUT_OF_SCOPE**.

### EN-SG-32

**N/A** (no multi-tenant HTTP API on Lite).

## Global

SECURITY-S25 **BLOCKED** (bilateral). Global **OPEN**.
