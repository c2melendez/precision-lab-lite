## 2026-10-16 — SY-X-04: cobertura de ejecución Plus por revisar
- Se comprobó `backend/tests/test_syntax309_syx04_service.py`: usa la función real `evaluate_service.evaluate(expression, angle_unit='rad', substitutions=None)` y el resultado tipado `.expr`, consistente con `backend/app/services/evaluate_service.py`.
- El workflow general Plus `.github/workflows/ci.yml` incluye `pytest -q` y `npm test`, pero su disparador `push` sólo nombra `main`, `master` y `qa/exhaustive-suite-module-01`, no la rama canónica `qa/syntax-audit-in625-a1`. Por ello este workflow general no prueba por sí solo que se hayan ejecutado automáticamente los tests nuevos en la rama de certificación. Pueden existir workflows específicos adicionales; aún no se verificó la lista completa.
- Decisión: NO ampliar a ciegas el disparador de CI ni crear otro workflow, pues podría duplicar gates o gastar Actions. Localizar el workflow acumulativo realmente utilizado por Plus, comprobar inclusión de los tests de servicio/frontend y recuperar runs `push` por SHA mediante acceso que los liste; issue Lite #50 mantiene el bloqueo de evidencia. Estado SY-X-04 Plus PENDING CI; no PASS. H2/SG28 y DIST sin cambios.

## 2026-10-16 — SY-X-04 Plus: ensayo matemático interno independiente del límite HTTP
- Plus commit `20d739d2644847357a28e52383f3ec134819ac53` agrega `backend/tests/test_syntax309_syx04_service.py`. Envía al servicio matemático los 500 sumandos literales de x (999 caracteres), sin atajo `500*x`, y compara el resultado con `500*x` usando equivalencia simbólica SymPy. Además prueba recuperación independiente con 2+3=5.
- Objetivo: separar capacidad del parser/motor del bloqueo contractual de HTTP `max_length=500`, sin alterarlo ni falsificar certificación E2E. El ensayo puede encontrar límites de complejidad reales; resultado todavía NO verificado por CI. Si falla, identificar clase de error y no relajar oráculo; ver issue Lite #50 para resultados por SHA. SY-X-04 sigue OPEN; SG28/H2 y DIST sin cambios.

## 2026-10-16 — SY-X-04 Plus: conversión de 500 términos espaciados
- Commit técnico Plus `a2fbdece01c08e1ce5eae90a6a285c293cae9783` añade un test al archivo `frontend/src/components/syntax309-syx04.test.ts`: 500 sumandos `x + x + ...`, verifica que el conversor conserva los 500 términos al normalizar whitespace, sin truncar ni presimplificar.
- Alcance ORÁCULO/REGRESIÓN de frontend. No modifica el contrato HTTP de 500 caracteres ni el motor; la expresión espaciada tampoco acredita capacidad de la API para admitirla. CI aún pendiente, no PASS.
- Bloqueo de evidencia por SHA sigue en Lite issue #50; próximo paso sin duplicar Actions es recuperar runs existentes y sus logs. SY-R-12 permanece OPEN; SG28/H2 OPEN y DIST BLOCKED.

## 2026-10-16 — SY-X-04: propuesta de resolución contractual, no aprobada
- Documento de decisión bilateral `qa/certification/SY_X_04_LENGTH_DECISION.md` (Plus `dc11c29aad94fba662c1a101ef22de841eb5b4da`; Lite `cb7d0ce4af9d7ab19b8f07a85d3ebbbce2540748`). Evalúa conservar max_length=500 con capability parcial, ampliar expresamente a >=999 caracteres tras autorización y pruebas de límites de recursos, o introducir API versionada. No se modificó contrato ni motor.
- Preferencia de diseño sujeta a aprobación: ampliar acotadamente EvaluateRequest a un valor documentado (p.ej. 1024), solo tras analizar parser, límites AST, SG28, seguridad, clientes y gates de regresión, con entrada literal intacta; mientras tanto no declarar SY-X-04 Plus HTTP PASS. Corridas pendientes bajo issue Lite #50.

## 2026-10-16 — SY-X-04: oráculo exacto y recuperación independiente
- Lite commit técnico `1a0da3fafae1dcd2d654b527ac85ce45d47a52a2` refuerza `e2e/syntax309-syx04.spec.ts`: la aserción previa `/500\\s*x/` admitía falsos positivos como `1500x`; ahora exige texto completo de `500x` (se permite asterisco explícito), captura `request_id` y exige uno distinto tras `2+3=5`, y comprueba ausencia de errores de página. Conserva 500 sumandos originales y serialización completa. Clasificación: mejora del ORÁCULO/HARNESS, no corrección del producto.
- El cambio entra al workflow científico ya registrado, pero no se confirmó run ni resultado CI para este SHA. No declarar PASS, no forzar corridas adicionales; para validación de trabajos pendientes consultar el seguimiento GitHub Lite #50. El bloqueo HTTP Plus (>500 caracteres), SY-R-12, H2/SG28 y DIST se mantienen según su evidencia.
- Siguiente tarea no bloqueada: revisar el oráculo de SY-X-04 Plus y la matriz posterior de Syntax309 sin modificar el contrato de longitud; registrar evidencias verificables por SHA cuando estén disponibles.

## 2026-10-16 — CI preflight para impedir gates E2E con specs inválidas
- Lite commit `69f8763d53e2bf76869cb789dace412e624e47f1` modifica `.github/workflows/syntax309-scientific-e2e.yml`: tras instalar el runner Playwright y antes de instalar Chromium, ejecuta `npx playwright test --list e2e/syntax309-*.spec.ts`. Esto detecta errores sintácticos/de carga como el `Missing semicolon` observado en SY-R-12 antes de descargar navegadores y ejecutar la matriz; el paso existente de E2E se conserva sin relajar oráculos ni alterar la lista de casos.
- Es mejora de infraestructura CI, no una aprobación matemática ni evidencia de que los tests ya hayan concluido. No se pudo confirmar en esta sesión los runs push por SHA con el conector de GitHub; el endpoint de corridas por commit está limitado a PR. No se disparó ninguna corrida manual duplicada.
- Siguiente acción: consultar la corrida automática generada por SHA `69f8763d53e2bf76869cb789dace412e624e47f1`, revisar el nuevo preflight y el gate E2E; revisar Plus frontend/backend para `5e63fcb6d` y `22d6d5928`; resolver SY-R-12 antes de marcar PASS. SY-X-04 sigue pendiente (500 sumandos exceden el max_length=500 del API Plus). H2/SG28 OPEN y DIST BLOCKED.

## 2026-10-16 — SY-X-04: prueba de frontera HTTP 500/501
- Plus commit técnico `22d6d5928af9857c0a4851e5987a862cb0f562a2`: amplía `backend/tests/test_syntax309_syx04_http_limit.py` con frontera exacta del schema: 500 caracteres para expresión `2+3` con espacios finales (esperado HTTP 200, resultado 5), 501 caracteres (HTTP 422 `VALIDATION_ERROR`) y recuperación posterior (200, resultado 5). Se conserva el caso original de 500 sumandos (999 caracteres), rechazo 422 y recuperación.
- No se ha alterado `EvaluateRequest.expression` max_length=500, ni se considera que un rechazo 422 certifique el resultado 500x. Estado: prueba incorporada, PENDING CI para SHA 22d6d592; si falla la frontera aceptada, investigar parser/normalización real antes de cambiar expectativas o contrato.
- Consultas de runs por commit `fa7739347` Lite y `5e63fcb6d` Plus retornaron vacío mediante API limitada a PR, lo cual NO prueba ausencia de corridas push. Evitar nuevas corridas manuales sin consultar primero el registro real de Actions. SY-R-12 OPEN, SY-X-04 parcial y SG28/DIST pendientes.
- Siguiente acción: obtener IDs de runs push y jobs por workflow/rama y SHA exacto, revisar errores del gate científico Lite y unitarias frontend/backend Plus; decidir formalmente si ampliar el contrato a 999+ antes de requerir aceptación por HTTP.

## 2026-10-16 — SY-X-04 Plus: nueva regresión del conversor, pendiente de CI
- Commit Plus `5e63fcb6d12bc8f42e8aa8f2311e0feed9d86ec0` añade `frontend/src/components/syntax309-syx04.test.ts`, que exige preservar los 500 sumandos de x (999 caracteres) sin sustituirlos por `500*x` y comprueba conversión posterior de 2+3.
- Verificado el código del conversor `latexToBackendSyntax` en `frontend/src/components/NaturalMathField.tsx`. Resultado de la nueva prueba NO verificado por CI; si falla, diagnosticar diferencias de serialización MathLive frente a error del conversor. No relajar la exigencia de conservar los términos sin evidencia ni cambiar producto sin causa confirmada.
- Plus HTTP mantiene `EvaluateRequest.expression` máximo 500; el nuevo test de frontend no certifica que la API acepte 999 caracteres. El test backend 422/recovery sigue pendiente de CI. Lite UI y SY-R-12 también pendientes de resultados. No declarar PASS global SY-X-04.
- Siguiente paso exacto: obtener runs y jobs de los commits técnicos Lite `fa7739347` y Plus `5e63fcb6d`/`3c425c124`; verificar cobertura automática y corregir fallos causales. Reconciliar límite contractual de 500 sin modificarlo inadvertidamente.

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

