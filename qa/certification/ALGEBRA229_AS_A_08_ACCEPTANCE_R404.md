# Algebra229 AS-A-08 — aceptación bilateral (r404)

**Estado: PASS_SCOPED bilateral — Lite y Plus, sección Algebra229 A, fila AS-A-08 únicamente.** No acredita la sección completa ni toda la matriz Algebra229.

## Contrato congelado

Fuente normativa: `qa/certification/legacy_sources/matriz_algebra_simbolica.md.gz`; SHA-256 `8cd36ff08343f98f92abd83e2b162d565e0cbe5c59dc73f26b1c018f77d663c7`.

Fila exacta: `(x-1)^5 → x^5-5x^4+10x^3-10x^2+5x-1`.

## Lite

- SHA técnico: `e1f5c9cc67ffe2cd9bdfc3dcdcb07b8de291d21f`; test `tests/algebra229AsA08.audit.test.ts`, blob `3863c4a54007bb3200ced4a157a4c8a4f4617390`.
- Fila fuente completa y siete puntos firmados contra `Math.pow(x-1,5)`, independiente del CAS.
- Acumulativo [42006623286](https://github.com/c2melendez/precision-lab-lite/actions/runs/42006623286): **SUCCESS**; focal 2 tests, 366 archivos / 2,259 passed / 8 expected fail / 34 TODO; typecheck, unit/parity y build SUCCESS.
- H1d [42006623192](https://github.com/c2melendez/precision-lab-lite/actions/runs/42006623192): **SUCCESS**, 22/22.
- Scientific UI [42006623224](https://github.com/c2melendez/precision-lab-lite/actions/runs/42006623224): **SUCCESS**, 456 pasadas desktop/tablet/mobile.
- CI estándar [42006623461](https://github.com/c2melendez/precision-lab-lite/actions/runs/42006623461): **FAILURE** en QA dependency audit hard gate por cuatro vulnerabilidades moderadas; typecheck, unit/parity y build omitidos en ese workflow. Sin cambiar el umbral.
- Runner [42006623362](https://github.com/c2melendez/precision-lab-lite/actions/runs/42006623362): **SUCCESS_PUSH_ONLY**; dispatch, recibo QA y persistencia omitidos.

## Plus

- SHA técnico: `6a42292878494500c8d902cada0dadaa39e8d2ee`.
- Test: `backend/tests/test_algebra229_as_a08.py`, blob `5d95493a65876a9456515164995147c6ef6d3e59`.
- Fila exacta, servicio `expand_expression` y HTTP `POST /api/v1/expand`, equivalencia simbólica y aritmética entera Python independiente en siete puntos firmados.
- CI [42006654279](https://github.com/c2melendez/precision-lab-plus/actions/runs/42006654279): **SUCCESS**, frontend/backend completos; backend 2,800 passed, 1 skipped, 10 xfailed.
- Acumulativo [42006654698](https://github.com/c2melendez/precision-lab-plus/actions/runs/42006654698): **SUCCESS**; ambos tests focales PASSED; backend 2,800 passed, 1 skipped, 10 xfailed.
- H1d [42006653939](https://github.com/c2melendez/precision-lab-plus/actions/runs/42006653939): **SUCCESS**, 38/38.
- Runner [42006654470](https://github.com/c2melendez/precision-lab-plus/actions/runs/42006654470): **SUCCESS_PUSH_ONLY**; dispatch/persist omitidos.

## Cierre acotado

- AS-A-08 queda **PASS_SCOPED bilateral** con oráculos independientes y todos los gates contractuales por motor.
- La matriz Algebra229 completa no está cerrada.
- Siguiente fila bilateral: **AS-A-09**, producto de cuatro factores lineales.
- El hard gate de dependencias Lite sigue bloqueado en la rama canónica. La mitigación está en PR draft [#62](https://github.com/c2melendez/precision-lab-lite/pull/62), no fusionado ni desplegado.
- EDCX-B6 VC-FE-45/EV-I-12 y H2/SG28/DIST siguen separados, sin cambios.
- Certificación global **OPEN**.
