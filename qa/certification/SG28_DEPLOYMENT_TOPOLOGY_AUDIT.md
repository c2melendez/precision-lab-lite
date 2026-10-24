# IN625 H2 / SG28 — Deployment topology and admission audit

Date: 2026-10-10. Scope: Plus backend; coordinated certification with Lite. Status: **OPEN — deployment evidence required**.

## Source-based findings (Plus canonical certification branch)

1. `backend/app/services/request_cancellation.py` creates `_ADMISSION = threading.BoundedSemaphore(_MAX_ISOLATED_REQUESTS)` at Python module import. The configured default is 2 and the variable is clamped to 1..16 **per process**, not per fleet.
2. `request_admission_lease()` reserves one **local** slot for a logical request and must be released after coordinator cleanup. The route's legacy opt-in phase implementation and exact lease wiring must be rechecked against HEAD during later changes; neither form supplies distributed coordination.
3. `backend/app/services/disconnect_tracking.py` marks an `asyncio.Event` on the shared ASGI scope on receipt of `http.disconnect`. `backend/app/main.py` installs it as outer ASGI middleware. Existing passing SG28 tests prove **in-process** disconnect propagation and local cleanup only.
4. No Render blueprint, Dockerfile, Procfile or deploy manifest was found in the tracked repository tree on this branch. This does **not** prove a particular runtime command, worker count, service type or replica count; those are externally managed unknowns.
5. If R independent Python processes each permit K active isolated requests, a worst-case upper admission count is R × K, subject to other limits. This arithmetic does not constitute a verified production capacity figure.
6. Isolation on `/api/v1/evaluate` is experimental, opt-in via `SG28_EVALUATE_ISOLATION=1`, and must **not** be enabled in production/shared deployments on this evidence.

## Outstanding evidence before any deployment decision

- Read-only Render service inspection in the **user-confirmed workspace**: service identity, plan, instance count, deploy/start command, Python/Uvicorn/Gunicorn workers, autoscaling, deploy SHA, effective opt-in state (without revealing secrets).
- Define total fleet budget using verified instances × processes × per-process limits; include CPU/memory headroom, queues, admission/rejection policy (HTTP 503) and restart behavior.
- Test real TCP/HTTP disconnect with a bounded operation in a dedicated isolated environment where SG28 is opt-in; prove child cleanup before slot reuse and subsequent recovery.
- Validate simultaneous requests across independent processes or replicas; establish distributed admission or explicitly documented per-instance capacity with protections before calling the feature production-ready.
- Add metrics for active processes/leases, canceled/abandoned jobs, rejected requests, worker exit and memory pressure; use bounded load only.
- Re-run SG28, cumulative and relevant Lite/Plus parity gates on exact technical SHAs; document job URLs, PASS/FAIL/BLOCKED/MANUAL.

## Evidence boundary and decision

Latest **recorded** Plus passing evidence as of this audit: SG28 run 38074280892 (68 PASS), cumulative run 38074280914 (630 backend PASS), H1d run 38074280878 (5 PASS), technical SHA 4654cd937b68b15e30c0047f4b75a6674bafba0b. These do not establish fleet readiness. The documentation HEAD may be newer than the technical SHA.

**Decision:** H2/SG28 remains OPEN; distributed admission/deployment validation **BLOCKED on external topology evidence**. No production change authorized. This audit is documentary only and is not a new test PASS.

Next executable step: obtain the confirmed Render workspace and read-only live service topology; then implement a bounded external-transport test in isolated CI without using production. Preserve local SG28 regression gates.
