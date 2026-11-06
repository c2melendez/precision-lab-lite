# Algebra 229 — preparación de matriz y trazabilidad

Estado: **FIXTURE_PROMOTED**; sección A **AS-A-01..17 PASS_SCOPED bilateral** (casos individuales, tests unit/HTTP y gates por caso); sección B iniciada con **AS-B-01 TEST-FIRST / REVIEW**; matriz **NOT_EXECUTED** en bloque (no se certifican las 229 filas). Certificación global **OPEN**.

## Fuente y fixture

| Campo | Valor |
|---|---|
| Markdown congelado | `legacy_sources/matriz_algebra_simbolica.md.gz` |
| SHA-256 | `8cd36ff08343f98f92abd83e2b162d565e0cbe5c59dc73f26b1c018f77d663c7` |
| Filas | **229** (A17 B30 C23 D9 E26 F18 G35 H23 I18 J12 K7 L11) |
| Builder | `build_algebra229_fixture.py` (deriva JSONL del MD; no inventa oráculos) |
| Validador | `check_algebra229_fixture.py` (rebuild + conteo IDs/secciones) |
| Gate CI | `algebra229-source-integrity.yml` |

## Avance sección A (expandir)

AS-A-01..17 cerrados **PASS_SCOPED bilateral**; acceptance de AS-A-17 en `ALGEBRA229_AS_A_17_ACCEPTANCE_2026-11-05.md`. La matriz completa de 229 filas continúa **NOT_EXECUTED** como bloque.

## Sección B (factorizar)

Siguiente fila: **AS-B-01**, factorizar (x^2-5x+6) en ((x-3)(x-2)). Se reforzaron los tests de Lite y Plus con cotejo exacto de fila fuente y diez sustituciones enteras independientes. Estado **REVIEW** hasta reconciliar las corridas push activadas por los commits técnicos; no reutilizar los runs previos al cambio del oráculo.

## Siguiente

`ALGEBRA229-AS-B-01-TEST-FIRST` — verificar los runs automáticos de los SHA Lite `b26787342ab1bcd9edd7af8e723246306215be51` y Plus `eb3a45c4b0ae68ff3d8da440b434c27098cf69c1`, incluidos acumulativo, H1d, CI y Scientific UI Lite. Global OPEN.
