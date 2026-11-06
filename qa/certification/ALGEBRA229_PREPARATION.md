# Algebra 229 — preparación de matriz y trazabilidad

Estado: **FIXTURE_PROMOTED**; sección A **AS-A-01..17 PASS_SCOPED bilateral**; sección B **AS-B-01..08 PASS_SCOPED bilateral**; matriz **NOT_EXECUTED** en bloque (no se certifican las 229 filas). Certificación global **OPEN**.

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
- **AS-B-04** (x^3+27=(x+3)(x^2-3x+9)): **PASS_SCOPED bilateral**. Lite SHA `8229e0961b4bae6d0f7dbd07d3521939a76bf508` (cumulative 42137517887, H1d 42137518068, Scientific UI 42137517759, Runner 42137517842 SUCCESS; CI 42137518118 FAILURE solo npm audit); Plus SHA `54a7963d47e020b35ea5a3cde75379953d513742` (cumulative 42137523357, H1d 42137523360, CI 42137523336, Runner 42137523341 SUCCESS). Sin cambio de producto.
- **AS-B-05** (x^4-1=(x-1)(x+1)(x^2+1) sobre ℚ): **PASS_SCOPED bilateral**. Lite SHA `9a4352732241a6d97c2a21686b4618cb069d8144` (cumulative 42143597700, H1d 42143597591, Scientific UI 42143597597, Runner 42143597781 SUCCESS; CI 42143597848 FAILURE solo npm audit); Plus SHA `1a93f562579a615e8faed9bac2449ed74c8ef543` (cumulative 42143597860, H1d 42143597715, CI 42143597710, Runner 42143597834 SUCCESS). Sin cambio de producto.
- **AS-B-06** (x^4+4=(x^2-2x+2)(x^2+2x+2), Sophie Germain): **PASS_SCOPED bilateral**. Lite SHA `8c27e459a45e30c10f1e944582f2c25d7874d0f1` (cumulative 42144769755, H1d 42144769861, Scientific UI 42144769670, Runner 42144769740 SUCCESS; CI 42144769724 FAILURE solo npm audit); Plus SHA `ac6785822c2bb0b3fdff45fef12536d00b009c9e` (cumulative 42144769877, H1d 42144769822, CI 42144769863, Runner 42144769876 SUCCESS). Sin cambio de producto.
- **AS-B-07** (x^6-1=(x-1)(x+1)(x^2-x+1)(x^2+x+1)): **PASS_SCOPED bilateral**. Lite SHA `63fbef834a1fdd7bf0c969c4a8ae0f41a84060be` (cumulative 42145939069, H1d 42145939097, Scientific UI 42145939299, Runner 42145939287 SUCCESS; CI 42145939134 FAILURE solo npm audit); Plus SHA `2e3facb7d48f41902fc16c65090868a6708f2d00` (cumulative 42145947023, H1d 42145946957, CI 42145946946, Runner 42145946981 SUCCESS). Sin cambio de producto.
- **AS-B-08** (x^4-5x^2+4=(x-2)(x-1)(x+1)(x+2)): **PASS_SCOPED bilateral**. Lite SHA `8cb03f920fab0d5e5b665eeef1fefb6807131529` (cumulative 42147149489, H1d 42147149472, Scientific UI 42147149512, Runner 42147149478 SUCCESS; CI 42147149533 FAILURE solo npm audit); Plus SHA `073c28998087ad2d24b0688a5089d4af75187f33` (cumulative 42147155135, H1d 42147155163, CI 42147155107, Runner 42147155112 SUCCESS). Sin cambio de producto.

## Siguiente

`ALGEBRA229-AS-B-09-TEST-FIRST` — factorizar `6x^2+5x-4` → `(2x-1)(3x+4)`, bilateral. Global OPEN.
