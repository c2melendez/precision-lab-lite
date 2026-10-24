# Syntax309 — Section V (28 fixtures) checkpoint

Date: 2026-10-15. Source: `qa/certification/syntax309_cases.jsonl`.

## Grounded inventory
The official fixture catalog contains exactly SY-V-01 through SY-V-28 (28 unique IDs). There is **no SY-V-29**. The next catalog section in file order is Q, beginning with SY-Q-01, `x^{2}=4`, expected roots `x=-2` and `x=2`.

## Latest fixture gate
SY-V-28: original `\\alpha+\\alpha`, expected `2\\alpha`. The permanent tests were published on Lite SHA `61e227b7c1a916976d64d236e5982dd32d67ad18` and Plus SHA `2c7ecaa1f562b2c238bb27d75a9aeb3f20811966`.
- Lite cumulative 38714477278, H1d 38714477156, build 38714477100, scientific UI E2E (generic) 38714477111: SUCCESS.
- Plus cumulative 38714483066 and H1d 38714483064: SUCCESS.

Scope: original source parser and symbolic engine test in Lite, translated alpha HTTP and MathResponse/reentry in Plus. The generic Lite browser gate does not by itself certify a dedicated SY-V-28 keyboard action; Plus backend HTTP does not certify frontend MathLive input. This is a fixture-level PASS within tested routes, not an unqualified end-to-end pass for all 28 rows.

## Section decision
**Inventory complete (28/28). Section-wide contractual certification remains OPEN** pending a systematic row-to-test-and-channel evidence audit, preserving TODO/XFAIL/MANUAL and channel gaps. Neither the 28 fixtures nor successful cumulative CI alone establish 28 fully certified UI flows.

## Next exact executable objective
Start **SY-Q-01**: solve `x^{2}=4`, require both real roots `{-2,2}` without dropping either, guard against a single principal-root answer and distinguish solving an equation from evaluating an expression. Add permanent Lite and Plus tests through each product's actual solving path, verify CI at the new technical SHA, diagnose any failures, then proceed SY-Q-02. Do not invent SY-V-29.
