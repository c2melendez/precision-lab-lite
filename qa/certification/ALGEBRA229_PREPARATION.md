# Algebra 229 — preparacion de matriz y trazabilidad

Estado: **FIXTURE_PROMOTED**; sección A **AS-A-01..06 PASS_SCOPED bilateral** (casos individuales, tests unit/HTTP y gates por caso); matriz **NOT_EXECUTED** en bloque (no se certifican las 229 filas). Certificacion global **OPEN**.

## Fuente y fixture

| Campo | Valor |
|---|---|
| Markdown congelado | `legacy_sources/matriz_algebra_simbolica.md.gz` |
| SHA-256 | `8cd36ff08343f98f92abd83e2b162d565e0cbe5c59dc73f26b1c018f77d663c7` |
| Filas | **229** (A17 B30 C23 D9 E26 F18 G35 H23 I18 J12 K7 L11) |
| Builder | `build_algebra229_fixture.py` (deriva JSONL del MD; no inventa oraculos) |
| Validador | `check_algebra229_fixture.py` (rebuild + conteo IDs/secciones) |
| Gate CI | `algebra229-source-integrity.yml` |

Coincide byte a byte con `Matrices.zip`. El JSONL del handoff v0.3 es historico; el producto regenera el fixture desde el MD.

## Avance seccion A (expandir)

AS-A-01..10 cerrados PASS_SCOPED bilateral con runs cumulative SUCCESS (ver `CURRENT_STATE.md` / `EXECUTION_LOG.md` / `continuity.json`).

## Siguiente

`ALGEBRA229-AS-A-11-TEST-FIRST` — expandir `(a+b+c)^3` → `a^3+3a^2b+3a^2c+3ab^2+6abc+3ac^2+b^3+3b^2c+3bc^2+c^3` bilateral. Global OPEN.
