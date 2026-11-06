# Algebra 229 — preparación de matriz y trazabilidad

Estado: **FIXTURE_PROMOTED**; sección A **AS-A-01..17 PASS_SCOPED bilateral**; sección B **AS-B-01 PASS_SCOPED bilateral**, **AS-B-02 TEST-FIRST / WAIT**; matriz **NOT_EXECUTED** en bloque (no se certifican las 229 filas). Certificación global **OPEN**.

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

AS-A-01..17 cerrados **PASS_SCOPED bilateral**. Acceptance de AS-A-17: `ALGEBRA229_AS_A_17_ACCEPTANCE_2026-11-05.md`.

## Sección B (factorizar)

- **AS-B-01** (x^2-5x+6=(x-3)(x-2)): **PASS_SCOPED bilateral**. Acceptance: `ALGEBRA229_AS_B_01_ACCEPTANCE_2026-11-06.md`. Oráculo independiente de diez sustituciones enteras; HTTP verificado en Plus; pruebas UI nativas de Lite en desktop/tablet/mobile.
- **AS-B-02** (x^2-9=(x-3)(x+3)): tests reforzados con fila fuente exacta y diez sustituciones enteras independientes; SHA Lite `4a5bb09703c527a0ddd68a33749fc228748d2060`, SHA Plus `e8bbb528bdf1d70ee8acd947c8e58144ad07d3a6`. Estado **WAIT** hasta resolver corridas automáticas de ambos repositorios.

## Siguiente

`ALGEBRA229-AS-B-02-TEST-FIRST` — revisar runs Lite 42135018417/42135018449/42135018517/42135018389/42135018349 y Plus 42135022942/42135022812/42135022746/42135022814. Global OPEN.
