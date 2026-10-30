# Algebra 114 — preparación de matriz y trazabilidad

Estado: **PREPARATORY / REQUIREMENTS NOT IDENTIFIED** (2026-10-17). Certificación global **OPEN**.

## Autoridad y límites

El protocolo `qa/certification/EXECUTION_PROTOCOL.md` ordena Syntax 309 → Algebra 114 → Algebra 229. El progreso limitado de Syntax 309 no cierra sus bloqueos (SY-P-23, SY-X-04 y SY-X-14 en Plus). Esta preparación es un frente independiente, no certificación Algebra 114.

## Inventario observado en los árboles de la rama canónica

- **Plus**: `backend/app/routers/algebra.py`, `backend/app/services/algebra_service.py`, `backend/tests/test_algebra.py`, `backend/tests/test_exhaustive_module02_algebra.py`, `frontend/e2e/exhaustive-module02-algebra.spec.ts`.
- **Lite**: no se identificó un archivo con nombres `algebra114`, `algebra229` o `114`/`229` asociados a álgebra en el árbol inspeccionado.
- **Ambos**: no se identificó una matriz de 114 filas con identidad verificable por búsquedas de rutas `algebra114`, `114.*algebra` o `certification.*algebra`. Esto no prueba inexistencia de requisitos en otros archivos.

## Próximo objetivo exacto

1. Localizar la fuente normativa de los 114 casos: ruta, versión, conteo, ID y oráculo por caso. No inferir 114 casos de pruebas existentes.
2. Construir inventario de requisitos únicos y asociar a Lite/Plus parser, Worker/HTTP, UI y E2E; registrar `NOT_COVERED` cuando corresponda.
3. Elegir un primer caso independiente que tenga oráculo y fuente verificables. Únicamente entonces incorporar prueba técnica focalizada y consultar gates del SHA correspondiente.
4. Conservar `SY-P-23-CONVENTION-DECISION` bloqueado por contrato, SY-X-04/X-14 Plus bloqueados y el estado global `OPEN`.

No hacer dispatch manual por cambios documentales ni inventar porcentajes de certificación.

## Inventario verificado — 2026-10-17

Se inspeccionaron árboles completos de la rama canónica: Lite (567 entradas) y Plus (648 entradas). No apareció un archivo de matriz `Algebra114`, `Algebra229` ni una lista de 114 IDs en las rutas de certificación. **Resultado: SOURCE_NOT_LOCATED**, no ausencia demostrada fuera de los repositorios.

| Capacidad observada | Lite | Plus | Alcance verificable |
|---|---|---|---|
| Evaluación algebraica numérica | `tests/exhaustive-module02-algebra.test.ts` | `backend/tests/test_exhaustive_module02_algebra.py` | Testigos de log/exp/radical; sin IDs de Algebra114 |
| Ecuaciones, expansión e inecuaciones | `src/engine/stepEngine/algebra.ts` y pruebas del módulo 2 | `backend/app/services/algebra_service.py` y pruebas del módulo 2 | Implementaciones presentes, cobertura de requisitos aún ND |
| Interfaz/teclado Álgebra | `e2e/exhaustive-module02-algebra.spec.ts` | `frontend/e2e/exhaustive-module02-algebra.spec.ts` | Verifica botones y entrada, no 114 recorridos E2E |
| API/Worker | Lite: motor local, parser y Worker por canal | Plus: router `backend/app/routers/algebra.py` | No se atribuye equivalencia canal por nombre de archivo |

**No calcular porcentaje de requisitos cubiertos.** Antes de construir una matriz de 114 filas se necesita el documento normativo o fixture original, su versión, ID, expresión y oráculo para cada fila. No fabricar esa matriz a partir de funciones o casos de prueba existentes.

Acción independiente útil: inventariar la procedencia de la suite original (issue/adjunto/commit/archivo externo) y vincular únicamente casos con identificadores canónicos. Mantener SY-P-23 BLOCKED_ON_CONTRACT y Global OPEN. No enviar CI por este cambio documental.

## 2026-10-17 — SOURCE LOCATED and validated

**Source:** `qa/certification/algebra114_source.md`, preserved verbatim from user Library document `Matriz de estrés — Álgebra simbólica.md` (two additional Library copies were byte-for-byte identical in extracted text). **114 original table rows, 114 distinct `AS-*` IDs, four columns ID/Nivel/Ejercicio/Resultado esperado; no additional/generated oracle.**

Official counts by section: SIM 10; EXP 10; FAC 12; PF 8; RAT 10; DIV 8; PAR 10; AVS 10; RAD 10; DOM 6; MUL 6; CONV 8; LIM 6 (total 114). Historical `SOURCE_NOT_LOCATED` status above is superseded: original source is now versioned in both repos. **Source validated; tests still NOT MAPPED/NOT CERTIFIED**. Domain restrictions, real/complex conventions, symbolic equivalents and declared assumptions are part of the original oracles and must not be dropped.

Next: create a deterministic read-only fixture validator for exact original IDs/sections/row count and then a case-channel inventory; begin with `AS-SIM-01` only after explicit parser/engine/UI expected semantics identified. Do not infer 114 PASS from existing Module 2 tests. Keep Syntax309 X04/X14 Plus and SY-P23 blockers, H2/DIST, security S25, mutation S19 and global OPEN. Do not dispatch CI solely for source documentation.


## 2026-10-30 — r358: AS-SIM-01 PASS_SCOPED

- Fuente `algebra114_source.md`, fila AS-SIM-01: `3x+2y-x+5y = 2x+7y`.
- Test `tests/algebra114AsSim01.audit.test.ts`, blob `0af3d63cf797d0acfef92b3af664ad7c2616ea40`: conserva la fila fuente, comprueba salida simbólica normalizada y cinco sustituciones con oráculo aritmético JavaScript independiente.
- SHA técnico `30b0b03120faa5252dbb7b090c81d37a8c16452a`: CI 41135927030, cumulative 41135926842 y H1d 41135926938 SUCCESS. Cumulative: 365 archivos, 2.258 passed, 8 expected fail, 34 todo.
- Aceptación detallada: `ALGEBRA114_AS_SIM_01_ACCEPTANCE_R358.md`. PASS_SCOPED solo Lite; no certifica Algebra114 completa.
- Siguiente: `ALGEBRA114-AS-SIM-05-TEST-FIRST`. Preservar la condición `x != 1` al simplificar `(x^2-1)/(x-1)`; no aceptar cancelación que pierda el dominio.


## 2026-10-30 — r358: AS-SIM-05 PASS_SCOPED

- Fuente: `(x^2-1)/(x-1) = x+1`, con `x != 1`.
- Test `tests/algebra114AsSim05.audit.test.ts` (blob `d3ad970124d9f8362ae5ea0c4381dd334bfe43ea`) verifica condición original `x-1 != 0`, cinco sustituciones válidas con oráculo aritmético independiente y rechazo en `x=1`.
- SHA técnico `4abfe22293d5088e40d27a72568d5f4e93197f10`: CI 41136809596, cumulative 41136809590 y H1d 41136809678 SUCCESS. Cumulative: 366 archivos, 2.259 passed, 8 expected fail, 34 todo.
- Aceptación: `ALGEBRA114_AS_SIM_05_ACCEPTANCE_R358.md`. PASS_SCOPED Lite; no certifica Algebra114 completa.
- Siguiente: auditar los oráculos de AS-EXP-01..10, empezando por AS-EXP-01; no confiar en comparación CAS-vs-CAS.

## 2026-10-30 — r359: AS-EXP-01 PASS_SCOPED

- Fuente algebra114_source.md, fila AS-EXP-01: (x+1)(x-1) = x^2-1.
- Test tests/algebra114AsExp01.audit.test.ts, blob 373593e7216e1d3e710963bb7431cc96a208eca9: confirma fixture original, salida simbólica normalizada x^2-1 y cinco sustituciones x=-3,-1,0,1,4 con oráculo JavaScript independiente x*x-1.
- SHA técnico a48496d5da441589c3ca5e231761654dc5566b6b; CI 41137239350, cumulative 41137239432 (366 files / 2259 passed / 8 expected fail / 34 todo), H1d 41137239316 (22 E2E passed) y Runner 41137239337, todos SUCCESS en el mismo SHA. Runner dispatch/persistencia SKIPPED.
- Aceptación ALGEBRA114_AS_EXP_01_ACCEPTANCE_R359.md. No extrapolar a las otras nueve filas EXP ni a Plus.
- Siguiente: AS-EXP-02; auditar restricciones de dominio y oráculo independiente. Global OPEN.


## 2026-10-30 — r360: AS-EXP-02 PASS_SCOPED

- Fuente `algebra114_source.md`, fila AS-EXP-02: `(x+2)^2 = x^2+4x+4`.
- Test `tests/algebra114AsExp02.audit.test.ts`, blob `9d4cd2e8fb1e70ce37a3aa47ef05cbf78083cc04`: salida simbólica normalizada y cinco sustituciones con oráculo independiente `x*x+4*x+4`.
- SHA técnico `c8c29d820e5bd16ab4df8a528bcea9b4a72f8acc); CI 41138509410, cumulative 41138509481, H1d 41138509536 y Scientific UI 41138509494 SUCCESS. Runner push 41138509571 SUCCESS; pasos de despacho/persistencia SKIPPED.
- Aceptación acotada: `ALGEBRA114_AS_EXP_02_ACCEPTANCE_R360.md`. Solo Lite; global OPEN.
- Siguiente: AS-EXP-03, oráculo independiente `6*x*x+5*x-4`.


## 2026-10-30 — r361: AS-EXP-03 PASS_SCOPED

- Fuente algebra114_source.md, fila AS-EXP-03: `(2x-1)(3x+4)=6x^2+5x-4`.
- Test tests/algebra114AsExp03.audit.test.ts, blob `c3585658febba9c8acc4c2b71e46f6f4fb6ac90d`: salida simbólica normalizada y cinco sustituciones con oráculo independiente `6*x*x+5*x-4`.
- SHA técnico `0a85b448298df0691b043269648d327d0a7aec0b`; CI 41141038026, cumulative 41141037941 y H1d 41141037866 SUCCESS. Runner 41141037836 SUCCESS push/no-dispatch. Scientific UI 41141038013 seguía IN_PROGRESS, complementario y no usado para aceptar el caso algebraico.
- Aceptación acotada: `ALGEBRA114_AS_EXP_03_ACCEPTANCE_R361.md`. Solo Lite; global OPEN.
- Siguiente: AS-EXP-04, `(x+1)(x^2-x+1)=x^3+1`, oráculo independiente `x*x*x+1`.


## 2026-10-30 — r362: AS-EXP-04 PASS_SCOPED

- Fuente algebra114_source.md, fila AS-EXP-04: `(x+1)(x^2-x+1)=x^3+1`.
- Test tests/algebra114AsExp04.audit.test.ts, blob `753c1d83b7a44fb166fd502ccb545259d331c697`: salida simbólica normalizada y cinco sustituciones con oráculo independiente `x*x*x+1`.
- SHA técnico `933fad5c3e55db06db9de6ff21e02cd96070da0f`; CI 41141571381, cumulative 41141571350 y H1d 41141571338 SUCCESS. Runner 41141571479 SUCCESS push/no-dispatch. Scientific UI 41141571351 seguía IN_PROGRESS como evidencia complementaria.
- Aceptación acotada: `ALGEBRA114_AS_EXP_04_ACCEPTANCE_R362.md`. Solo Lite; global OPEN.
- Siguiente: AS-EXP-05.


## 2026-10-30 — r364: AS-EXP-05 PASS_SCOPED

- Fuente algebra114_source.md, fila AS-EXP-05: `(x-1)(x^2+x+1)=x^3-1`.
- Test tests/algebra114AsExp05.audit.test.ts, blob `b6985e7139ca77edc78faa48f6d55104d76a2627`: salida simbólica normalizada y seis sustituciones con oráculo independiente `x*x*x-1`.
- SHA técnico `4341955335d6898c4979063520432f82a6d129ba`; CI 41142010457, cumulative 41142010406 y H1d 41142010389 SUCCESS. Runner 41142010410 SUCCESS push/no-dispatch. Scientific UI 41142010385 seguía IN_PROGRESS como evidencia complementaria.
- Aceptación acotada: `ALGEBRA114_AS_EXP_05_ACCEPTANCE_R364.md`. Solo Lite; global OPEN.
- Siguiente: AS-EXP-06.
