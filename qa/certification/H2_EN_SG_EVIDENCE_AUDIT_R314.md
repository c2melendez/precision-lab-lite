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

- Recovered the exact H.2 source from Library `Matrices.zip`: `matriz_entrada_sintaxis_calculadora.md`, SHA-256 `58fbc0ed04aef158148981fc28074d470e45ec07a67604f89b3847b55c625528`, rows EN-SG-01..32 at lines 864–901.
- Plus synthetic EN-SG-03 regression was verified in CI `40597214760`. Added a second regression for exact original input `x^{2}\text{<b>hola</b>}` in commit `2e755ecdd8fef3536f8f4a7076aff961eea15cab`; Plus CI `40599001729` is **IN_PROGRESS**, so do not promote EN-SG-03 yet.
- CI push branch filters were corrected to include `qa/syntax-audit-in625-a1`: Lite commit `0f84d5a18a7684677fb1046efd1d75dc429990f3`; Plus commit `50fd09331f46122048ff479d099bfcb12b5faec5`.
- Plus added exact-input frontend tests for H.2 EN-SG-01..08 in commit `9d13cd39227839099c1809ddd2c4eeed32ee4842`; CI `40601412886` frontend tests/build passed but backend job was still running at last check. This is Plus-only evidence, not Lite coverage.
- Do not repeat the current Plus CI/cumulative/H1d/native syntax runs; inspect the existing run IDs first.

## Rules

- No extreme loads or rate bursts against production.
- No SG28 isolation activation in production.
- Inventory matrix is not PASS.
