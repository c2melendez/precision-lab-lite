# SY-X-04 — Decision record: 500-term input versus Plus HTTP contract

**Status:** PROPOSED / NOT APPROVED. **Date:** 2026-10-16. **Scope:** certification branch `qa/syntax-audit-in625-a1`; no production change.

## Evidence and non-negotiable facts

- SY-X-04 requires **500 explicit x addends**, generated as `Array(500).fill("x").join("+")`, exactly **999 characters**, with independent expected mathematical result **500x**. Replacing it upstream by `500*x` would bypass the required ingestion/parser path.
- Plus `backend/app/schemas/requests.py` sets `EvaluateRequest.expression: Field(..., min_length=1, max_length=500)`. Thus a 999-character payload to `/api/v1/evaluate` is invalid at schema validation; HTTP **422 / VALIDATION_ERROR** is correct for the *current* contract, not a mathematical pass of SY-X-04.
- Plus regression `backend/tests/test_syntax309_syx04_http_limit.py` documents rejected 999-character source, boundary 500/501, and recovery. Plus frontend `frontend/src/components/syntax309-syx04.test.ts` tests source preservation. Lite `e2e/syntax309-syx04.spec.ts` tests native input and expected output. **All new results require SHA-scoped CI before PASS.**
- SG28/H2 and independent-host DIST requirements are not discharged by this decision.

## Alternatives

| Option | Contract impact | Mathematical evidence | Risks / decision |
| --- | --- | --- | --- |
| A. Keep maximum 500, report capability | None | Does not certify Plus HTTP SY-X-04 | Honest partial result; cannot close full parity |
| B. Raise expression limit to **at least 999** (candidate 1024) | Public API validation change, likely other expression endpoints and UI validators to review | Allows original 500 addends through real HTTP parser | Requires explicit contract approval and safety assessment of AST terms, runtime/memory, worker isolation, request limits, timeouts and old clients; do not apply automatically |
| C. Introduce a separately versioned endpoint/input representation | New public API surface | Could support original expanded source if transmitted unchanged | Greater complexity and compatibility burden; must not collapse addends before parser |

**Proposed preference:** B only after authorization and bounded resource testing; until then choose A in certification status. B does not imply raising every schema limit or relaxing SG28.

## Acceptance gates before choosing B

1. Approve a **specific** new input-length contract and whether it applies only to evaluate or other operations; update OpenAPI/generated client types and inline UI limits consistently.
2. Preserve the literal 500-term source through MathLive, conversion, transport, parsing and result rendering; prove output **exactly equivalent to 500x**, not a substring or fixture shortcut; use an independent mathematical oracle.
3. Check parser AST/term ceilings, 500-term simplification resource use, bounded execution, cancellation, concurrency and logging without dumping oversized user expressions.
4. Prove requests 1 below, exactly at, and 1 above the approved length; rejected bodies return typed validation errors and subsequent `2+3=5` works with a fresh request ID.
5. Verify desktop/tablet/mobile where supported, frontend unit, backend HTTP, cumulative regression and CI logs on the exact SHA in **both** repositories; differentiate PASS, SKIP, XFAIL and capability.
6. No staging/prod toggle, deployment or contract mutation without separate authorization and SG28 prerequisites.

## Follow-up, no duplicate Actions

- CI/run evidence blocker: https://github.com/c2melendez/precision-lab-lite/issues/50
- Keep `CURRENT_STATE.md` as the live status; this document is a **decision proposal**, not an authorization or a certification result.
