## 2026-10-20 UTC — Algebra 229 fixture canonico promovido; siguiente AS-A-01 test-first

**ALGEBRA229-FIXTURE-PROMOTE-VALIDATE — COMPLETADO (fixture, no ejecucion de casos).**

- Fuente congelada: `qa/certification/legacy_sources/matriz_algebra_simbolica.md.gz` SHA-256 `8cd36ff08343f98f92abd83e2b162d565e0cbe5c59dc73f26b1c018f77d663c7` (coincide byte a byte con Matrices.zip).
- Fixture: regenerado siempre desde el MD por `build_algebra229_fixture.py` (**229** filas, IDs A–L).
- Validadores: `check_algebra229_source.py` + `check_algebra229_fixture.py`.
- Workflow: `.github/workflows/algebra229-source-integrity.yml`.
- Tipos de comparison: taxonomia del documento original + operacion (expected = fuente).

**No se declara ningun caso AS-A…L ejecutado.** Global **OPEN**.

**Siguiente unico:** `ALGEBRA229-AS-A-01-TEST-FIRST` — expandir `(x+1)^2` → `x^2 + 2x + 1` (`equivalencia_simbolica`) bilateral; test original; gates exact-SHA.

## Contexto

AS-CONV + AS-LIM PARTIAL_BILATERAL. Algebra114 recorrido parcial. `MATRIX_SOURCE_INVENTORY.md` lista las 9 fuentes del ZIP. Bloqueos SG28/S25/S19/SY-P-23/X04/X14 sin cambios.
