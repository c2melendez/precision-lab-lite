# Algebra229 AS-B-26 — aceptación scoped bilateral (Lite)

**Resultado: PASS_SCOPED bilateral.** La certificación global permanece **OPEN**.

## Contrato congelado
- AS-B-26, N2, `factorizar`.
- Entrada original: `\\text{factorizar el entero }360`.
- Salida original: `2^{3}\\cdot 3^{2}\\cdot 5`.
- Forma ASCII esperada del motor: `2^3*3^2*5`.

## Pruebas y oráculos
- Lite `tests/algebra229AsB26.audit.test.ts`: 4/4 PASS. Comprueba las ocho celdas de la fila congelada, forma ASCII exacta, factorización independiente por división de prueba (`[(2,3),(3,2),(5,1)]), verificando además que el producto sea 360) y equivalencia simbólica con 360.
- Plus `backend/tests/test_algebra229_as_b26.py`: 3/3 PASS. Comprueba fila fuente exacta, endpoint HTTP `POST /api/v1/factor`, forma ASCII exacta, división de prueba independiente con bases primas/multiplicidades exactas y evaluación entera mediante AST restringido (sin `eval`).

## Evidencia Lite — SHA técnico `26cc8cc69d32e4a5614dc9921a87030308f9cdd1`
- Cumulative [42270957296](https://github.com/c2melendez/precision-lab-lite/actions/runs/42270957296) SUCCESS; guard `skip=false`, `evidence_run_id=""`; focal 4/4, 366/366 archivos, 2,264 passed, 8 expected fail, 34 TODO.
- H1d [42270957306](https://github.com/c2melendez/precision-lab-lite/actions/runs/42270957306) SUCCESS; 22/22 Playwright.
- CI [42270957315](https://github.com/c2melendez/precision-lab-lite/actions/runs/42270957315) SUCCESS; typecheck, suite y production build.
- Scientific UI [42270957389](https://github.com/c2melendez/precision-lab-lite/actions/runs/42270957389) SUCCESS; 456/456 Playwright en desktop, tablet y mobile.
- Runner [42270957317](https://github.com/c2melendez/precision-lab-lite/actions/runs/42270957317) SUCCESS; fingerprint push-only, no se contabiliza como gate adicional.

## Evidencia Plus (par bilateral) — SHA técnico corregido `4509e41570258a1f573f8992475433b1b05ef120`
- Cumulative [42272022466](https://github.com/c2melendez/precision-lab-plus/actions/runs/42272022466) SUCCESS; guard `skip=false`, `evidence_run_id=""`; frontend/backend SUCCESS, focal 3/3 y backend 2,805 passed, 1 skipped, 10 xfailed.
- H1d [42272022376](https://github.com/c2melendez/precision-lab-plus/actions/runs/42272022376) SUCCESS; 38/38 Playwright.
- CI [42272022354](https://github.com/c2melendez/precision-lab-plus/actions/runs/42272022354) SUCCESS; frontend/backend SUCCESS, backend 2,805 passed, 1 skipped, 10 xfailed.
- Runner [42272022361](https://github.com/c2melendez/precision-lab-plus/actions/runs/42272022361) SUCCESS; fingerprint push-only.

## Diagnóstico de la primera revalidación Plus
- CI [42271188505](https://github.com/c2melendez/precision-lab-plus/actions/runs/42271188505) sobre SHA `ef97ca2a23324d2512f4f26585ad51f421d316ff` falló exclusivamente porque el test esperaba dos barras invertidas en las celdas LaTeX mientras la matriz congelada contiene una.
- El test se corrigió con cadenas raw de una barra literal. Los gates posteriores se ejecutaron en SHA `4509e41570258a1f573f8992475433b1b05ef120`; la corrida anterior no se reutilizó ni se contabiliza para PASS.
- Los diffs técnicos de ambos productos modifican únicamente tests; no hubo cambio de motor ni producto. El fallo fue de oráculo/test de fixture, no matemático.

La aceptación es **PASS_SCOPED bilateral**. SG28/H2/DIST, SECURITY-S25 y los demás gaps independientes permanecen abiertos; global **OPEN**.

Siguiente: AS-B-27, `\\text{factorizar el entero }1001` → `7\\cdot 11\\cdot 13` (N2). Global **OPEN**.
