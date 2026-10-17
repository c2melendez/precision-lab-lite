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
