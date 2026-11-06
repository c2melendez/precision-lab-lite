# Algebra 229 — preparación de matriz y trazabilidad

Estado: **FIXTURE_PROMOTED**; sección A **AS-A-01..17 PASS_SCOPED bilateral** (casos individuales, tests unit/HTTP y gates por caso); sección B iniciada, **AS-B-01 TEST-FIRST / WAIT**; matriz **NOT_EXECUTED** en bloque (no se certifican las 229 filas). Certificación global **OPEN**.

## Fuente y fixture

| Campo | Valor |
|---|---|
| Markdown congelado | `legacy_sources/matriz_algebra_simbolica.md.gz` |
| SHA-256 | `8cd36ff08343f98f92abd83e2b162d565e0cbe5c59dc73f26b1c018f77d663c7` |
| Filas | **229** (A17 B30 C23 D9 E26 F18 G35 H23 I18 J12 K7 L11) |
| Builder | `build_algebra229_fixture.py` |
| Validador | `check_algebra229_fixture.py` |
| Gate CI | `algebra229-source-integrity.yml` |

## Avance sección A (expandir)

AS-A-01..17 cerrados **PASS_SCOPED bilateral**. Acceptance: `ALGEBRA229_AS_A_17_ACCEPTANCE_2026-11-05.md`. La matriz completa permanece NOT_EXECUTED.

## Sección B (factorizar)

AS-B-01: factorizar (x^2-5x+6) como ((x-3)(x-2)). Los tests se reforzaron con las celdas fuente exactas y diez sustituciones enteras. El primer run Lite identificó un falso negativo por signed-zero; ya está corregido en Lite SHA `7e21f3f9d9bebaab2741a76f4cc533992e56d76a`. Plus SHA de test: `eb3a45c4b0ae68ff3d8da440b434c27098cf69c1`. Las corridas de validación están activas; no aceptar hasta concluir acumulativo y reingreso en ambos proyectos, además de Scientific UI Lite.

## Siguiente

`ALGEBRA229-AS-B-01-TEST-FIRST` — cerrar la re-ejecución de Lite SHA `7e21f3f9d9bebaab2741a76f4cc533992e56d76a` y Plus SHA `eb3a45c4b0ae68ff3d8da440b434c27098cf69c1`. Global OPEN.
