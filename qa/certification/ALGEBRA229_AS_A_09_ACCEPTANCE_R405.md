# Algebra229 AS-A-09 — aceptación bilateral (r405)

**Estado: PASS_SCOPED bilateral — Lite y Plus, sección Algebra229 A, fila AS-A-09 únicamente.** No acredita la sección completa ni toda la matriz Algebra229.

## Contrato congelado

Fuente normativa: `qa/certification/legacy_sources/matriz_algebra_simbolica.md.gz`; SHA-256 del contenido descomprimido `8cd36ff08343f98f92abd83e2b162d565e0cbe5c59dc73f26b1c018f77d663c7` (blob `d216dc77cb1356ef29cb8c803cbff809450e0456`).

Fila exacta: `| AS-A-09 | N2 | \`expandir\` | \`(x+1)(x+2)(x+3)(x+4)\` | \`x^{4} + 10 x^{3} + 35 x^{2} + 50 x + 24\` |  |`.

## Lite

- SHA técnico: `5968d58708bda2b63fccf5c4deb70c96d1c7df81`; test `tests/algebra229AsA09.audit.test.ts`, blob `827145ee310d871e7b7a8cc362d1a7f8726f808a`.
- El test compara la fila fuente completa carácter a carácter y evalúa el producto expandido en ocho muestras firmadas `x=[-5,-4,-3,-2,-1,0,1,2]` contra aritmética entera independiente `(x+1)(x+2)(x+3)(x+4)`; no usa el CAS para calcular el valor esperado.
- Acumulativo [42008399184](https://github.com/c2melendez/precision-lab-lite/actions/runs/42008399184): **SUCCESS**; focal `tests/algebra229AsA09.audit.test.ts` 2 tests; 366 archivos / 2,259 passed / 8 expected fail / 34 TODO; typecheck y build (`built in 4.68s`) SUCCESS.
- H1d [42008399193](https://github.com/c2melendez/precision-lab-lite/actions/runs/42008399193): **SUCCESS**, 22/22.
- Scientific UI [42008399013](https://github.com/c2melendez/precision-lab-lite/actions/runs/42008399013): **SUCCESS**, 456/456 en desktop/tablet/mobile.
- CI estándar [42008399087](https://github.com/c2melendez/precision-lab-lite/actions/runs/42008399087): **FAILURE** en el hard gate `npm audit` por cuatro vulnerabilidades moderadas; typecheck, unit/parity y build omitidos en ese workflow. Umbral sin cambios.
- Runner [42008399129](https://github.com/c2melendez/precision-lab-lite/actions/runs/42008399129): **SUCCESS_PUSH_ONLY**; dispatch, recibo QA y persistencia omitidos.

## Plus

- SHA técnico: `ebe7c74e1de56609f44fa05c23efc0433a26fd87`; test `backend/tests/test_algebra229_as_a09.py`, blob `c14ea7a72f86bc858761a56bcc4c06c40785b646`.
- Fila exacta, servicio `expand_expression` y HTTP `POST /api/v1/expand`; equivalencia simbólica con `x^4+10x^3+35x^2+50x+24` y ocho muestras con multiplicación entera nativa de Python, independiente de SymPy.
- CI [42008437911](https://github.com/c2melendez/precision-lab-plus/actions/runs/42008437911): **SUCCESS**; backend 2,800 passed / 1 skipped / 10 xfailed; frontend 150 archivos / 1,055 passed.
- Acumulativo [42008437780](https://github.com/c2melendez/precision-lab-plus/actions/runs/42008437780): **SUCCESS**; ambos tests focales PASSED; backend 2,800 passed / 1 skipped / 10 xfailed.
- H1d [42008437774](https://github.com/c2melendez/precision-lab-plus/actions/runs/42008437774): **SUCCESS**, 38/38.
- Runner [42008437689](https://github.com/c2melendez/precision-lab-plus/actions/runs/42008437689): **SUCCESS_PUSH_ONLY**; dispatch y persistencia no probados.

## Cierre acotado

- AS-A-09 queda **PASS_SCOPED bilateral** con fila fuente exacta, oráculos independientes y gates contractuales verdes por motor.
- La matriz Algebra229 completa no está cerrada.
- Siguiente fila bilateral: **AS-A-10**, `(x^2+x+1)^3 → x^6+3x^5+6x^4+7x^3+6x^2+3x+1`.
- El hard gate de dependencias Lite sigue bloqueado en la rama canónica. PR draft [#62](https://github.com/c2melendez/precision-lab-lite/pull/62) tiene los 15 checks `pull_request` en SUCCESS sobre `b24d3951e9548eff46cdd105b6f44225c8bfc7e6`; permanece draft y pendiente de revisión/fusión humana.
- EDCX-B6 VC-FE-45/EV-I-12 y H2/SG28/DIST siguen separados, sin cambios.
- Certificación global **OPEN**.
