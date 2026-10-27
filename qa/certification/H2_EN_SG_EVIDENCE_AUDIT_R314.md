# H2 EN-SG evidence audit R314 (mirror)

Canonical detailed table lives in **precision-lab-plus** `qa/certification/H2_EN_SG_EVIDENCE_AUDIT_R314.md`.

**Status:** PARTIAL · 2026-10-27 UTC · Bridge parked · `next_action` = `H2-EN-SG-CASE-EVIDENCE-AUDIT-R314`

## Summary

| Class | Count |
|-------|------:|
| PARTIAL (existing API/harness evidence) | 15 |
| GAP (not implemented or not matrix-complete) | 16 |
| PENDING EXECUTION | 1 (EN-SG-03 frontend regression) |
| Matrix-complete PASS | 0 |

## Gap IDs

EN-SG-01, EN-SG-02, EN-SG-04..08 (HTML/LaTeX/macros N1–N2), EN-SG-21, EN-SG-23..28, EN-SG-32.

## Partial IDs

EN-SG-09..20, EN-SG-22, EN-SG-29..31 — primarily `backend/tests/test_in625_h2_security.py` on Plus (not Lite product UI coverage).

## Execution note — 2026-10-27

- Plus added EN-SG-03 literal-HTML fallback regression in commit `58a395306cf90bfee81c2e5ae79c58ebf3105a85`; the result remains **PENDING EXECUTION** until the corresponding Actions run is inspected.
- CI push branch filters were corrected to include `qa/syntax-audit-in625-a1`: Lite commit `0f84d5a18a7684677fb1046efd1d75dc429990f3`; Plus commit `50fd09331f46122048ff479d099bfcb12b5faec5`.
- Available run/status lookup did not return push-run evidence. Do not interpret that empty response as a PASS or proof of no run.

## Rules

- No extreme loads or rate bursts against production.
- No SG28 isolation activation in production.
- Inventory matrix is not PASS.
