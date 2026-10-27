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
- Plus added exact-input frontend tests for H.2 EN-SG-01..08 in commit `9d13cd39227839099c1809ddd2c4eeed32ee4842`; frontend tests/build passed in CI `40601412886`, backend job was still running. Follow-up commit `2db9e7b1d15c49b22299d4007cfda01959c67efc` tightens no-anchor assertions; Plus CI `40601719487` Unit/parity and production build passed, backend job still running. This is Plus-only evidence, not Lite coverage.
- Plus CI `40601719487` completed SUCCESS (Typecheck, Unit/parity, production build and backend tests). Plus commit `67113dfa4881838a7e376835b09bd0dfccd858c4` adds probe-backed EN-SG-08 backend tests; its CI is pending. Lite Runner retry `40602548307` passed fingerprint and push summary after restoring `prose_only_paths`. Lite CI `40602548219` failed at the hard `npm audit --package-lock-only` gate, so typecheck/unit/build were skipped. Lite's H2 parser test `tests/in625H2Security.audit.test.ts` covers literal inputs EN-SG-01/02/04..08 at parser level, but it is not browser escaping evidence. Do not repeat active runs.

## Rules

- No extreme loads or rate bursts against production.
- No SG28 isolation activation in production.
- Inventory matrix is not PASS.


## Execution update — 2026-10-27

- Plus CI `40602481512`: frontend and backend jobs SUCCESS; probe-backed EN-SG-08 regression passed for the specified file-read/process-launch side-effect probes. This is scoped evidence, not global H2 closure.
- Lite CI `40602548219`: failed at mandatory `npm audit --package-lock-only`. Uploaded artifact `lite-npm-audit` records 4 LOW advisories, including `deepmerge` prototype poisoning (`GHSA-gcqx-w48m-w2h4`) in the dependency chain `deepmerge` → `@rollup/plugin-node-resolve` → `workbox-build` → `vite-plugin-pwa`. npm's suggested remediation is a major downgrade to `vite-plugin-pwa@0.2.1`; it has NOT been applied because compatibility impact must be assessed. Typecheck, unit/parity, and build were skipped in that CI.
- Lite cumulative gate `40602548264` SUCCESS is not a substitute for the failed CI. Next: inspect `package.json`, lockfile, and advisory fix ranges; choose a compatible, minimally disruptive remediation, then run the affected checks once.
- `SECURITY-S25` remains BLOCKED (security job skipped); global certification OPEN.


### Dependency advisory severity reconciliation

The uploaded npm audit artifact labels the `deepmerge` finding LOW, but the GitHub Advisory Database page for `GHSA-gcqx-w48m-w2h4` / `CVE-2026-93753` currently labels it HIGH (CVSS 8.7) and lists no patched upstream `deepmerge` version. Treat the discrepancy as unresolved; do not downgrade this blocker to low-risk based only on npm's artifact severity, and do not apply npm's suggested `vite-plugin-pwa@0.2.1` major downgrade blindly. Assess a compatible dependency-chain update or explicit mitigation, regenerate the lockfile, then rerun audit + typecheck/unit/build once.
