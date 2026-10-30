# Lite H2 / EN-SG evidence reconciliation (r358)

**Aggregate status: PARTIAL.** This is a reconciliation of Lite-only evidence, not a new product certification and not a bilateral comparison.

## Evidence accepted in the current continuity index

The current `continuity.json` (r335 before this reconciliation) records:

| Scope | Rows | Classification |
|---|---|---|
| Architecture / render path | EN-SG-01..05, EN-SG-08 | PASS_SCOPED |
| MathLive display macros | EN-SG-06, EN-SG-07 | PASS_SCOPED |
| Client-engine bounds | EN-SG-23..27 | PASS_SCOPED |
| Expression-length contract | EN-SG-21 | PASS_SCOPED |
| Stop/recovery UI | EN-SG-28 | OUT_OF_SCOPE |
| Multi-tenant HTTP rate limiting | EN-SG-32 | OUT_OF_SCOPE / N/A |

Supporting evidence:
- MathLive macro guard: `H2_EN_SG_LITE_MATHLIVE_MACROS_R325.md`; CI [40759428403](https://github.com/c2melendez/precision-lab-lite/actions/runs/40759428403), product SHA `991bd219fb83c548b83bd0cae5bc550adbeeaabd`.
- Current R326 audit record: CI [40765520289](https://github.com/c2melendez/precision-lab-lite/actions/runs/40765520289), SHA `11f8a5f453f0a2dd068d00e29788c5f8d339edca`.
- Length boundary: `H2_EN_SG_LITE_SCOPE_R326.md`; `MAX_EXPRESSION_LENGTH=12000`, with EN-SG-21 accepted as a scoped length contract.

## Rows not to overstate

- EN-SG-09..20, EN-SG-22 and EN-SG-29..31 remain PARTIAL / unclassified in the current audit. They are not PASS merely because the current index has no confirmed GAP.
- EN-SG-28 remains OUT_OF_SCOPE: Lite has no stop/recovery UI in this scope.
- EN-SG-32 remains OUT_OF_SCOPE / N/A because Lite has no multi-tenant HTTP API. No Plus rate-limit result is imported.
- H2-SG28-DIST-01..08 is a different distributed multi-host scope and remains OUT_OF_SCOPE_SINGLE_HOST, not PASS.
- SECURITY-S25 ACCEPTED_BILATERAL is a separate acceptance; it does not close H2 EN-SG.

## Supersession and decision

The older R323 parity-audit prose labels several rows PARTIAL/GAP. The current continuity index and R325/R326 evidence supersede those earlier labels where they conflict. Keep the aggregate audit PARTIAL until the remaining rows have explicit contracts and evidence. Lite remains independent of Plus; no EDCX-B6 parity is inferred. Global certification remains OPEN.
