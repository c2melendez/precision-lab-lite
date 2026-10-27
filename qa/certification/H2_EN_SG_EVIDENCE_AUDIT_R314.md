# H2 EN-SG evidence audit R314 (mirror)

Canonical detailed table lives in **precision-lab-plus** `qa/certification/H2_EN_SG_EVIDENCE_AUDIT_R314.md`.

**Status:** PARTIAL · 2026-10-27 UTC · Bridge parked · `next_action` = `H2-EN-SG-CASE-EVIDENCE-AUDIT-R314`

## Summary counts

| Class | Count |
|-------|------:|
| PARTIAL (API/harness) | 16 |
| GAP | 16 |
| Matrix-complete PASS | 0 |

## GAP IDs

EN-SG-01..08 (HTML/LaTeX/macros N1–N2), EN-SG-21, 23..28, 32.

## PARTIAL IDs

EN-SG-09..20, 22, 29, 30, 31 — primarily `backend/tests/test_in625_h2_security.py` on Plus (not Lite product UI coverage).

## Rules

- No extreme loads or rate bursts against production.
- No SG28 isolation activation in production.
- Inventory matrix is not PASS.
