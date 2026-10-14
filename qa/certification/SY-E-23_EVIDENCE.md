# SY-E-23 — evidence ledger (2026-10-14)

Canonical branch: `qa/syntax-audit-in625-a1` in Lite and Plus.
Official fixture: `\\frac{\\frac{1}{2}}{\\frac{3}{4}}`, operation `valor`, expected `\\frac{2}{3}`.

## Implemented
- Lite test `tests/syntax309SyE23.audit.test.ts`, commit `c25c2331133525eb2c4626334fc98e304a9edefc`: checks raw nested source, parser exact 2/3, numerical 2/3, worker handler, LaTeX and reentry, plus a flattening counterexample. Transport simulation, not native MathLive E2E.
- Plus backend test `backend/tests/test_syntax309_sye23.py`, commit `ea5ebe84a444576fa5fa1f99acecacad4b46de54`: HTTP /api/v1/evaluate, complete MathResponse validation, exact/approx/LaTeX and result_text reentry. Explicit backend translation, not native editor E2E.
- Plus frontend test `frontend/src/__tests__/syntax309SyEFractions.audit.test.ts`; technical commits `66c556a2e489bb5890a24cef49b81c578ab45572`, `9bf9e4214d7ad31b10a007433675dc789558c7f8`: source conversion checks for SY-E-22/23. Scope remains conversion, not browser interaction.

## CI checked in this session
- Lite cumulative: https://github.com/c2melendez/precision-lab-lite/actions/runs/38525970770 — SUCCESS on `c25c2331133525eb2c4626334fc98e304a9edefc`.
- Lite H1d: https://github.com/c2melendez/precision-lab-lite/actions/runs/38525970768 — check final status before formal close.
- Lite build: https://github.com/c2melendez/precision-lab-lite/actions/runs/38525970780 — check final status before formal close.
- Plus first cumulative: https://github.com/c2melendez/precision-lab-plus/actions/runs/38525974598 — backend was still in progress at last check; frontend finished SUCCESS.
- Plus cumulative for latest technical SHA: https://github.com/c2melendez/precision-lab-plus/actions/runs/38526121387 — in progress at last check. Verify jobs, logs and current SHA before calling PASS.
- Plus H1d latest SHA: https://github.com/c2melendez/precision-lab-plus/actions/runs/38526121378 — verify final status.

## Status and exact next steps
SY-E-23: IMPLEMENTED, CERTIFICATION PENDING Plus final cumulative and H1d evidence. Never count queued/running as PASS. Check for actual frontend parser deficiencies rather than weakening expected equivalence. Do not conflate HTTP explicit translation with MathLive E2E.
Once all relevant SHA-aligned gates pass, update CURRENT_STATE.md and EXECUTION_LOG.md in both repos and begin SY-E-24 fixture `\\dfrac{3}{4}` -> `\\frac{3}{4}`, preserving original source. Syntax309 global OPEN, H2/SG28 OPEN, DIST multi-node BLOCKED pending independent nodes.
No production changes.
