# Algebra 229 — preparación de matriz y trazabilidad

Estado: **FIXTURE_PROMOTED**; sección A **AS-A-01..17 PASS_SCOPED bilateral**; sección B **AS-B-01..02 PASS_SCOPED bilateral**, **AS-B-03 TEST-FIRST / WAIT**; matriz **NOT_EXECUTED** en bloque (no se certifican las 229 filas). Certificación global **OPEN**.

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

AS-A-01..17 cerrados **PASS_SCOPED bilateral**.

## Sección B (factorizar)

- **AS-B-01** (x^2-5x+6=(x-3)(x-2)): **PASS_SCOPED bilateral**. Acceptance `ALGEBRA229_AS_B_01_ACCEPTANCE_2026-11-06.md`.
- **AS-B-02** (x^2-9=(x-3)(x+3)): **PASS_SCOPED bilateral**. Acceptance `ALGEBRA229_AS_B_02_ACCEPTANCE_2026-11-06.md`.
- **AS-B-03** (x^3-8=(x-2)(x^2+2x+4)): tests reforzados con fila exacta (incluida nota de irreducibilidad) y diez sustituciones enteras independientes. SHA Lite `fe78fd9a1061a66f5f0a05280ed65fea13cefa30`, SHA Plus `300bdede38cf5f58e8f47a59ff20a83dd4389dfe`; estado **WAIT** por gates automáticos en curso.

## Siguiente

`ALGEBRA229-AS-B-03-TEST-FIRST` — revisar Lite runs 42136026980/42136027012/42136027006/42136026913/42136027069 y Plus 42136032221/42136032228/42136032313/42136032220. Global OPEN.
