# Algebra229 AS-A-11 — aceptación bilateral (r407)

**Estado: PASS_SCOPED bilateral — Lite y Plus, sección Algebra229 A, fila AS-A-11 únicamente.** No acredita la sección completa ni toda la matriz Algebra229.

## Contrato congelado

Fuente normativa: `qa/certification/legacy_sources/matriz_algebra_simbolica.md.gz`; SHA-256 del contenido descomprimido `8cd36ff08343f98f92abd83e2b162d565e0cbe5c59dc73f26b1c018f77d663c7` (blob `d216dc77cb1356ef29cb8c803cbff809450e0456`).

Fila exacta: `| AS-A-11 | N2 | \`expandir\` | \`(a+b+c)^{3}\` | \`a^{3} + 3 a^{2} b + 3 a^{2} c + 3 a b^{2} + 6 a b c + 3 a c^{2} + b^{3} + 3 b^{2} c + 3 b c^{2} + c^{3}\` |  |`.

## Lite

- SHA técnico: `0393cfb4a7a690fd35f77a70afba3b900b8a8b7c`; test `tests/algebra229AsA11.audit.test.ts`, blob `7c6f13348d2deb379e62c9edfe401d25c121a7a9`.
- El test compara la fila fuente completa carácter a carácter y evalúa `(a+b+c)^3` expandido en ocho ternas firmadas contra `Math.pow(a+b+c, 3)`, independiente del CAS.
- Acumulativo [42023809086](https://github.com/c2melendez/precision-lab-lite/actions/runs/42023809086): **SUCCESS**; guard `skip=false` (no había evidencia reutilizable); focal `algebra229AsA11.audit.test.ts` 2 tests; 366 archivos / 2,259 passed / 8 expected fail / 34 TODO; typecheck y build (`built in 5.17s`) SUCCESS.
- H1d [42023809104](https://github.com/c2melendez/precision-lab-lite/actions/runs/42023809104): **SUCCESS**, 22/22.
- Scientific UI [42023809065](https://github.com/c2melendez/precision-lab-lite/actions/runs/42023809065): **SUCCESS**, 456/456.
- CI estándar [42023809135](https://github.com/c2melendez/precision-lab-lite/actions/runs/42023809135): **FAILURE** en `QA dependency audit` por cuatro vulnerabilidades moderadas; umbral sin cambios; typecheck/unit/build omitidos en ese workflow.
- Runner [42023809050](https://github.com/c2melendez/precision-lab-lite/actions/runs/42023809050): **SUCCESS_PUSH_ONLY** (dispatch, espera, registro y persistencia SKIPPED).

## Plus

- SHA técnico: `8c7362c40afb6c3992ca956033870fd577034d8f`; test `backend/tests/test_algebra229_as_a11.py`, blob `c7cc8bcb0736c1f0ba1774f3d6039debf48a9aae`.
- Fila exacta, servicio `expand_expression` y HTTP `POST /api/v1/expand`; equivalencia simbólica y ocho ternas con exponenciación entera nativa de Python, independiente de SymPy.
- CI [42023819574](https://github.com/c2melendez/precision-lab-plus/actions/runs/42023819574): **SUCCESS**; backend 2,800 passed / 1 skipped / 10 xfailed; frontend 150 archivos / 1,055 passed.
- Acumulativo [42023819742](https://github.com/c2melendez/precision-lab-plus/actions/runs/42023819742): **SUCCESS**; guard `skip=false`; ambos tests focales PASSED; backend 2,800 passed / 1 skipped / 10 xfailed.
- H1d [42023819511](https://github.com/c2melendez/precision-lab-plus/actions/runs/42023819511): **SUCCESS**, 38/38.
- Runner [42023819548](https://github.com/c2melendez/precision-lab-plus/actions/runs/42023819548): **SUCCESS_PUSH_ONLY**.

## Cierre acotado

- AS-A-11 queda **PASS_SCOPED bilateral**.
- La matriz Algebra229 completa no está cerrada.
- Siguiente fila bilateral: **AS-A-12**, `(x^2-1)^2`.
- PR draft [#62](https://github.com/c2melendez/precision-lab-lite/pull/62) sigue pendiente de revisión/fusión humana; el hard gate de dependencias Lite continúa bloqueado.
- El conflicto contractual Plus VC-FE-45 frente a EV-I-12 no cambia.
- Certificación global **OPEN**.
