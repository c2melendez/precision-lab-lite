## 2026-10-16 — SY-X-04 Plus: límite HTTP documentado y regresión permanente
- Confirmado por código `backend/app/schemas/requests.py`: `EvaluateRequest.expression` tiene `max_length=500`; los 500 sumandos reales de x ocupan 999 caracteres. No se puede certificar la expansión vía `/api/v1/evaluate` sin cambio contractual autorizado. No se cambia el schema para fabricar PASS.
- Commit Plus `3c425c124595a7f4deb03fc0e5fc3644d81913fd`: `backend/tests/test_syntax309_syx04_http_limit.py` envía 500 sumandos explícitos y exige HTTP 422, `VALIDATION_ERROR`, `MathResponse` sin resultados, request_id, seguido de recuperación HTTP 200 y resultado 5 para 2+3. La cobertura certifica rechazo seguro/recovery solamente, no resultado 500x por API.
- SY-X-04 queda PARTIAL/BLOCKED HTTP (límite contractual), PENDING CI en Plus y Lite UI; pendiente localizar runs reales por SHA, verificar inclusión de test Plus en gate acumulativo y evaluar interfaz/conversor Plus. SY-R-12 y H2/SG28 permanecen OPEN; DIST multinodo BLOCKED. Siguiente paso exacto: revisar los jobs de CI del commit Plus, comprobar assertions sin relajar contrato y determinar una ruta autorizada para 999 caracteres antes de cerrar SY-X-04 globalmente.

## 2026-10-16 — SY-X-04 CI wiring
- Inspected `.github/workflows/syntax309-scientific-e2e.yml`: the explicit push path and Playwright spec list omitted SY-X-04.
- Lite technical commit `fa7739347496b101351fa586df299afa15e0f354` adds the test to both lists without creating redundant workflows. Test source SHA commit `3c5dcce2c97cb1de8ed145b6857c1a9ccf793f40`.
- No verified SHA-matched Actions run; no PASS claim. Next: inspect CI run, troubleshoot any ingestion/result/timeout mismatch and cover Plus backend/frontend; preserve SG28 and SY-R-12 OPEN.

## 2026-10-16 — SY-X-04 E2E test prepared
- Lite technical commit `3c5dcce2c97cb1de8ed145b6857c1a9ccf793f40`: 500 explicit x addends (999 characters), strict MathLive ingestion, expected 500x, subsequent 2+3 recovery.
- Gate coverage and SHA-specific results not verified; earlier scientific-ui command enumerates specs through SY-X-03. Must wire new spec, verify runs and add Plus counterpart. No certification claimed. SY-R-12 awaiting post-fix run evidence.

## 2026-10-16 — SY-R-12 harness CI blocker repaired
- Verified Lite run 38969978401 (job 117205682399): FAILURE at TypeScript parse (`}) const diagnostic`, line 35); cumulative run 38969978348 SUCCESS on old SHA. Root cause: malformed E2E test, not established product bug.
- Published Lite technical commit `2915a76ca5879eb1a9eecf0e9420e40d18ed0beb` repairing `e2e/syntax309-syr12.spec.ts` and preserving DOM diagnostic on alert visibility failure.
- Canonical CURRENT_STATE synchronized in Lite and Plus. No new SHA-scoped CI PASS confirmed in this session; obtain actual latest scientific-ui run/job/log before marking SY-R-12 PASS. No redundant old-SHA rerun requested. Plus UI and SG28/DIST remain open.

