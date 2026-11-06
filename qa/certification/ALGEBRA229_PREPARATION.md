# Algebra 229 — preparación de matriz y trazabilidad

Estado: **FIXTURE_PROMOTED**; sección A **AS-A-01..17 PASS_SCOPED bilateral**; sección B **AS-B-01..03 PASS_SCOPED bilateral**, **AS-B-04 TEST-FIRST / WAIT**; matriz **NOT_EXECUTED** en bloque (no se certifican las 229 filas). Certificación global **OPEN**.

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

- **AS-B-01** (x^2-5x+6=(x-3)(x-2)): **PASS_SCOPED bilateral**.
- **AS-B-02** (x^2-9=(x-3)(x+3)): **PASS_SCOPED bilateral**.
- **AS-B-03** (x^3-8=(x-2)(x^2+2x+4)): **PASS_SCOPED bilateral**. Plus oráculo AST corregido tras falso negativo por sustitución negativa no parentizada; no hubo fallo de producto.
- **AS-B-04** (x^3+27=(x+3)(x^2-3x+9)): tests reforzados con fila fuente, grados 1/2, irreducibilidad real vía discriminante negativo y diez sustituciones enteras. SHA Lite `8229e0961b4bae6d0f7dbd07d3521939a76bf508`, Plus `54a7963d47e020b35ea5a3cde75379953d513742`; estado **WAIT**.

## Siguiente

`ALGEBRA229-AS-B-04-TEST-FIRST` — revisar Lite runs 42137517887/42137518068/42137517759/42137518118/42137517842 y Plus 42137523357/42137523360/42137523336/42137523341. Global OPEN.
