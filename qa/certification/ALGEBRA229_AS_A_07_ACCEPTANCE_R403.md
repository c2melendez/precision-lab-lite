# Algebra229 AS-A-07 — aceptación bilateral (r403)

**Estado: PASS_SCOPED bilateral — Lite y Plus, sección Algebra229 A, fila AS-A-07 únicamente.** No acredita la sección completa ni la matriz Algebra229 completa.

## Contrato congelado

Fuente normativa: `qa/certification/legacy_sources/matriz_algebra_simbolica.md.gz`; SHA-256 `8cd36ff08343f98f92abd83e2b162d565e0cbe5c59dc73f26b1c018f77d663c7`.

Fila exacta: `(2x-3)^4 → 16x^4-96x^3+216x^2-216x+81`.

## Lite

- SHA técnico: `02e1fff40eb05e58946e2ec9fdc2ba1618821bd2`.
- Test: `tests/algebra229AsA07.audit.test.ts`, blob `4af7e3b65f7f16b1b6f0f4c37648bd935c10c123`.
- Compara la fila fuente completa y valida la expansión original en siete valores firmados con `Math.pow(2*x-3,4)`, independiente del CAS.
- Acumulativo [42004987491](https://github.com/c2melendez/precision-lab-lite/actions/runs/42004987491): **SUCCESS**; test focal explícito (2 tests), 366 archivos / 2,259 passed / 8 expected fail / 34 TODO; typecheck, unit/parity y build SUCCESS.
- H1d [42004987501](https://github.com/c2melendez/precision-lab-lite/actions/runs/42004987501): **SUCCESS**, 22/22.
- Scientific UI [42004987667](https://github.com/c2melendez/precision-lab-lite/actions/runs/42004987667): **SUCCESS**, 456 pasadas en el job nativo desktop/tablet/mobile.
- CI estándar [42004987602](https://github.com/c2melendez/precision-lab-lite/actions/runs/42004987602): **FAILURE** en QA dependency audit hard gate por 4 vulnerabilidades moderadas; typecheck, unit/parity y build fueron omitidos en este workflow. El umbral no fue cambiado.
- Runner [42004987409](https://github.com/c2melendez/precision-lab-lite/actions/runs/42004987409): **SUCCESS_PUSH_ONLY**; no acredita dispatch, recibo QA ni persistencia.

## Plus

- SHA técnico: `c161cc4a9fb71274b89b3dfd6db83f5225f40bfb`.
- Test: `backend/tests/test_algebra229_as_a07.py`, blob `8b0327cccaa396df0840848a915871e811f5ecfb`.
- La prueba fija la fila completa, usa `expand_expression` y HTTP `POST /api/v1/expand`, conserva la equivalencia simbólica y valida siete muestras firmadas con aritmética entera de Python independiente de SymPy.
- CI [42005026736](https://github.com/c2melendez/precision-lab-plus/actions/runs/42005026736): **SUCCESS**, frontend audit/typecheck/unit/parity/build y backend tests SUCCESS; backend 2,800 passed, 1 skipped, 10 xfailed.
- Acumulativo [42005026806](https://github.com/c2melendez/precision-lab-plus/actions/runs/42005026806): **SUCCESS**; el log muestra ambos tests focales AS-A-07 como PASSED y 2,800 passed, 1 skipped, 10 xfailed.
- H1d [42005026732](https://github.com/c2melendez/precision-lab-plus/actions/runs/42005026732): **SUCCESS**, 38/38.
- Runner [42005026827](https://github.com/c2melendez/precision-lab-plus/actions/runs/42005026827): **SUCCESS_PUSH_ONLY**; no acredita dispatch ni persistencia.

## Cierre acotado

- AS-A-07 queda **PASS_SCOPED bilateral**, con oráculo independiente por motor y evidencia de cada gate contractual.
- No se extrapola el resultado a otras filas ni al cierre completo de Algebra229.
- Siguiente fila bilateral: **AS-A-08**, expansión de `(x-1)^5`.
- El hard gate de dependencias de Lite permanece abierto. La mitigación Workbox se mantiene aislada en PR draft #62, sin merge ni despliegue.
- EDCX-B6 VC-FE-45/EV-I-12 y H2/SG28/DIST permanecen separados, sin modificaciones.
- Certificación global **OPEN**.
