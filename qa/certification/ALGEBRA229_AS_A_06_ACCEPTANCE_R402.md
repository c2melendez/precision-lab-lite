# Algebra229 AS-A-06 — aceptación bilateral (r402)

**Estado: PASS_SCOPED bilateral — Lite y Plus, sección Algebra229 A, solo fila AS-A-06.** No acredita la matriz completa ni la certificación global.

## Contrato congelado

Fuente normativa: `qa/certification/legacy_sources/matriz_algebra_simbolica.md.gz`, SHA-256 `8cd36ff08343f98f92abd83e2b162d565e0cbe5c59dc73f26b1c018f77d663c7`.

Fila AS-A-06: `(x+y+z)^2 → x^2+2xy+2xz+y^2+2yz+z^2`.

## Lite

- SHA técnico: `790c49034f88ef0b20ad76c0e49c41fbb3cbd763`.
- Test: `tests/algebra229AsA06.audit.test.ts`, blob `6ffb510661f5c88c1c5f553a188f3d8566d05e1b`.
- El test compara la fila congelada completa y evalúa ocho ternas, incluidas combinaciones con signos, con el oráculo aritmético independiente `(x+y+z)^2`.
- Acumulativo [42001452228](https://github.com/c2melendez/precision-lab-lite/actions/runs/42001452228): **SUCCESS**; test focal explícito (2 tests), 366 archivos / 2,259 passed / 8 expected fail / 34 TODO; typecheck, unit/parity y build SUCCESS.
- H1d [42001452201](https://github.com/c2melendez/precision-lab-lite/actions/runs/42001452201): **SUCCESS**, 22/22.
- Scientific UI [42001452411](https://github.com/c2melendez/precision-lab-lite/actions/runs/42001452411): **SUCCESS**; job nativo desktop/tablet/mobile completado, 456 passed.
- CI estándar [42001452519](https://github.com/c2melendez/precision-lab-lite/actions/runs/42001452519): **FAILURE** en QA dependency audit hard gate por 4 vulnerabilidades moderadas; typecheck, unit/parity y build fueron omitidos en ese workflow. No se cambió el umbral.
- Runner [42001452227](https://github.com/c2melendez/precision-lab-lite/actions/runs/42001452227): **SUCCESS_PUSH_ONLY**; dispatch, recibo QA y persistencia omitidos.

## Plus

- SHA técnico: `0b2f02e6507f50ea4072691c96d5270dfdb0827c`.
- Test: `backend/tests/test_algebra229_as_a06.py`, blob `2ec9c63c8f7eb4a522c65b173573369fbed34ada`.
- El test exige la fila completa, verifica servicio `expand_expression` y HTTP `POST /api/v1/expand`, conserva la equivalencia simbólica y compara servicio y HTTP contra un oráculo Python independiente en ocho ternas firmadas.
- CI [42002301382](https://github.com/c2melendez/precision-lab-plus/actions/runs/42002301382): **SUCCESS**; frontend audit/typecheck/unit/parity/build y backend tests SUCCESS.
- Acumulativo [42002301613](https://github.com/c2melendez/precision-lab-plus/actions/runs/42002301613): **SUCCESS**; backend regression y frontend typecheck/unit/build SUCCESS.
- H1d [42002301152](https://github.com/c2melendez/precision-lab-plus/actions/runs/42002301152): **SUCCESS**, 38/38.
- Runner [42002301346](https://github.com/c2melendez/precision-lab-plus/actions/runs/42002301346): **SUCCESS_PUSH_ONLY**; no acredita dispatch ni persistencia.

## Límites y siguiente paso

- La aceptación se limita a AS-A-06; no cierra toda la sección A ni Algebra229.
- El CI estándar de Lite conserva el bloqueo de dependencias. La suite acumulativa/H1d/Scientific UI no transforma ese hard gate en PASS.
- Siguiente fila bilateral: **AS-A-07**, expansión de `(2x-3)^4`, test-first.
- Los bloqueos independientes H2/SG28/DIST y EDCX-B6 VC-FE-45/EV-I-12 no cambian.
- Certificación global **OPEN**.
