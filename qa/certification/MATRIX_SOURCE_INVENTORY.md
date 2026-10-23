# Inventario — 9/9 Matrices.zip versionadas en producto

**Corte:** 2026-10-23 UTC - revisión **260**. Rama `qa/syntax-audit-in625-a1`.

Todas las fuentes están como `qa/certification/legacy_sources/*.md.gz` + `MANIFEST.json`.
Integridad: `python3 qa/certification/check_legacy_sources.py` → `PASS_LEGACY_SOURCES` 9/9.

> **Este corte sustituye al de 2026-10-20**, que marcaba `TR324` y `LER` como "CONGELADO (no ejecutado)".
> Eso ya es falso: la sección 1 (Evaluación) de ambas está ejecutada y cerrada (r229–r235). Ver *Historial de este documento*.

## Convención de estados

`CONGELADO` describe **la fuente** (fijada por `sha256_raw` en `MANIFEST.json`), **no** la ejecución.
El estado de **ejecución** se anota aparte y procede del ledger (`continuity.json`, objetos `*_closure_r*`) y de los documentos por caso.

| Estado | Significado |
|---|---|
| `CERRADO` | Bloque con cierre `PASS_SCOPED_BILATERAL` (Lite y Plus) en el ledger. |
| `PARCIAL` | Algunas filas/bloques cerrados; el resto sin cierre. |
| `PREPARADO` | Fuente congelada y mapeada; sin filas ejecutadas. |
| `NO_EJECUTADO` | Sin cierres ni entradas de ejecución. |
| `BLOQUEADO` | Hay un blocker abierto que impide el cierre. |

> Regla de acreditación: un `PASS` exige gates verdes con `head_sha` exacto, `attempt=1` y pruebas realmente ejecutadas.
> `REUSE`, un skip o un commit exclusivamente documental **no** acreditan.

## Resumen

| Key | Canonical | Filas | Ejecución |
|-----|-----------|------:|-----------|
| AS229 | `matriz_algebra_simbolica.md.gz` | 229 | `NO_EJECUTADO` en bloque; `AS-A-01..05` y `AS-B-18..28` con trabajo; `AS-B-29` `ON_HOLD` |
| AS114 | `matriz_algebra_simbolica_estres_114.md.gz` | 114 | `PARCIAL`: `AS-DIV-03..08`, `AS-PAR-01..10`, `AS-AVS-01..03`; gaps `AS-MUL`/`AS-RAD`/`AS-LIM` |
| IN309 | `matriz_sintaxis_entrada_309.md.gz` | 309 | `PREPARADO / NO CERTIFICADO`; trabajo por bloques; `SY-P-23` y `SY-X-04` abiertos |
| IN625 | `matriz_entrada_sintaxis_625.md.gz` | 625 | `PARCIAL`: H1 (`EN-RE-01..30`) vía H1a–H1d; **H2 no ejecutado**; `H2-SG28-DIST`, `SY-P-23`, `SY-X-04` abiertos |
| TR324 | `ejercicios_trigonometria.md.gz` | 324 | `PARCIAL`: solo sección 1 Evaluación (33/48 con cierre); secciones 2–9 pendientes |
| LER | `matriz_log_exp_radicales.md.gz` | 540 | `PARCIAL`: sección 1 Evaluación `CERRADA` (67/67); secciones 2–9 pendientes |
| MV153 | `matriz_matrices_vectores.md.gz` | 153 | `CERRADO` (r236–r253): catálogo A–H+J `PASS_SCOPED_BILATERAL` |
| EDCX | `matriz_edo_variable_compleja.md.gz` | 638 | `PARCIAL`: Parte A A1-A8 y Parte B B1-B2 (300/638) `PASS_SCOPED` en Plus (171 PASS / 129 BLOCKED); B3-B15 pendientes; Lite sin motor equivalente |
| GR519 | `matriz_graficacion.md.gz` | 522 | `NO_EJECUTADO` |

**Total de filas de las 9 fuentes: 3.454.**

**Certificación global: `OPEN`.** Blockers vigentes: `H2-SG28-DIST-01..08`, `SECURITY-S25`, `SY-P-23`, `SY-X-04-PLUS-HTTP`, `ALGEBRA229-AS-B-29` (`ON_HOLD`).

## Detalle por fuente

### AS229 — Álgebra simbólica (229)

- 12 secciones: A Expansión y productos notables 17 · B Factorización 30 · C Racionales/división/MCD-MCM 23 · D Fracciones parciales 9 · E Radicales y exponentes 26 · F Log/exp (leyes) 18 · G Ecuaciones 35 · H Desigualdades 23 · I Sucesiones/sumatorias 18 · J Funciones 12 · K Identidades 7 · L Trampas de dominio 11.
- Estado: **NOT_EXECUTED en bloque** (`ALGEBRA229_PREPARATION.md`, `FIXTURE_PROMOTED`).
- Con trabajo: `AS-A-01..05` (`PASS_SCOPED`), `AS-B-18..28` (decisiones D1–D10; `AS-B-22/23` se mantienen sin factorizar como regresión).
- Pendiente: resto (≈213 filas). `AS-B-29` sigue `ON_HOLD`.

### AS114 — Estrés de álgebra simbólica (114)

- 13 secciones: A Simplificación 10 · B Expansión 10 · C Factorización 12 · D Fracciones parciales 8 · E Racionalización 10 · F División 8 · G Ecuaciones con parámetros 10 · H Valor absoluto 10 · I Raíces extrañas 10 · J Dominio 6 · K Multivariable/simetría 6 · L Convenciones de raíces 8 · M Robustez exacta 6.
- Estado: `PARCIAL`. Cierres: `AS-DIV-03..08` (6/8), `AS-PAR-01..10` (10/10), `AS-AVS-01..03` (3/10).
- Gaps documentados en `MANUAL_CAPABILITY_GAPS.md`: `AS-MUL`, `AS-RAD`, `AS-LIM`.
- Pendiente: A, B, C, D, E (resto), I, J, K (resto), L, M.

### IN309 — Sintaxis de entrada (309)

- 12 bloques: SY-P 33 · SY-F 48 · SY-E 31 · SY-N 31 · SY-D 14 · SY-U 25 · SY-V 28 · SY-Q 23 · SY-M 20 · SY-S 20 · SY-R 14 · SY-X 22.
- Estado: **PREPARACIÓN / NO CERTIFICADO** (`SYNTAX309_EXECUTION_MATRIX.md`). Trabajo por bloques (SY-P, SY-R, SY-N, SY-U, SY-X…), sin cierre de matriz.
- Abiertos: `SY-P-23`, `SY-X-04-PLUS-HTTP`.

### IN625 — Entrada/sintaxis de calculadora (625)

- 26 bloques: A1 24 · A2 20 · A3 24 · A4 15 · B1 35 · B2 10 · B3 36 · B4 14 · C1 25 · C2 23 · C3 36 · C4 24 · D1 26 · D2 19 · D3 20 · E1 32 · E2 14 · E3 23 · F1 15 · F2 26 · F3 26 · G1 27 · G2 15 · G3 34 · H.1 30 · H.2 32.
- Estado: línea activa. **H1 (H.1, `EN-RE-01..30`) ejecutado** vía H1a–H1d (`IN625_H1_MATRIX.md`).
- **H2 (H.2, 32 filas) NO ejecutado** (`IN625_H2_MATRIX.md`); además `H2-SG28-DIST-01..08` abierto.
- Resto A1–G3: trabajo parcial por fila (histórico en `EXECUTION_LOG.md`); sin cierre de matriz.

### TR324 — Trigonometría (324)

| Sección | Filas | Estado |
|---|---:|---|
| 1. Evaluación (D/I/H/HI) | 48 | `PARCIAL`: `EV-D-04..12`, `EV-I-01..12` (r226/r228/r229), `EV-H-01..12` (r227); `EV-D-01..03` y `EV-HI-01..12` sin cierre |
| 2. Ecuaciones (D/I/H/HI) | 37 | `NO_EJECUTADO` |
| 3. Inecuaciones | 32 | `NO_EJECUTADO` |
| 4. Límites | 43 | `NO_EJECUTADO` |
| 5. Derivadas | 48 | `NO_EJECUTADO` |
| 6. Integrales indefinidas | 55 | `NO_EJECUTADO` |
| 7. Integrales definidas | 40 | `NO_EJECUTADO` |
| 8. Casos límite (`CL-01..12`) | 12 | `NO_EJECUTADO` |
| 9. Modo grados (`GR-01..09`) | 9 | `NO_EJECUTADO` |
| **Total** | **324** | **33/324 con cierre documentado** |

### LER — Logaritmos, exponenciales y radicales (540)

| Sección | Filas | Estado |
|---|---:|---|
| 1. Evaluación (`EV-L/E/R/M/T`) | 67 | **`CERRADO`** (r229–r235): L 14 · E 14 · R 14 · M 13 · T 12 |
| 2. Ecuaciones | 68 | `NO_EJECUTADO` |
| 3. Inecuaciones | 44 | `NO_EJECUTADO` |
| 4. Límites (incl. 4.V multivariable) | 94 | `NO_EJECUTADO` |
| 5. Derivadas | 69 | `NO_EJECUTADO` |
| 6. Integrales indefinidas (incl. 6.S no elementales) | 71 | `NO_EJECUTADO` |
| 7. Integrales definidas | 72 | `NO_EJECUTADO` |
| 8. Simplificación y series (`SP-01..21`) | 21 | `NO_EJECUTADO` |
| 9. Casos límite y robustez (`CL`, `RN`) | 34 | `NO_EJECUTADO` |
| **Total** | **540** | **67/540 cerradas** |

### MV153 — Matrices y vectores (153)

- 9 secciones: A Operaciones básicas 25 · B Determinantes 22 · C Inversa/adjunta/singulares 19 · D Sistemas/escalonada/factorizaciones 17 · E Rango/núcleo/imagen/traza 12 · F Valores y vectores propios 17 · G Vectores 2D/3D 22 · H Formatos/tamaños/rendimiento 12 · J Transformaciones lineales 7.
- Estado: `CERRADO` (r236–r253). **Catálogo completo**: 153 filas A–H+J en `PASS_SCOPED_BILATERAL`.
- `matrices_ejecutables.jsonl` ya existe (derivado y validado) en ambos repos.

### EDCX — EDO y variable compleja (638)

- Parte A (ED, 210): A1 Primer orden (S/L/H/X/B/C) · A2 Segundo orden y superior (K/N/E/A) · A3 Sistemas y exponencial matricial · A4 Laplace · A5 Series/Frobenius · A6 EDP · A7 Cualitativo/numérico/retardo · A8 Casos límite.
- Parte B (VC, 428): B1 Conversión de formas (17/10/10/12) · B2 Operaciones (11/9/9/12) · B3 Potencias y raíces · B4 Ecuaciones en ℂ · B5 Lugares geométricos · B6 Funciones multivaluadas · B7 Límites/series · B8 Cauchy–Riemann · B9 Contorno/residuos · B10 Taylor/Laurent · B11 Integrales reales · B12 Transformaciones conformes · B13 Teoremas globales · B14 EDO/Laplace/Fourier · B15 Robustez.
- Estado: `PARCIAL`. A1 (53) + A2 (50) + A3 (16) + A4 (24) + A5 (10) + A6 (26) + A7 (25) + A8 (6) cerradas en Plus como `PASS_SCOPED` (93 PASS / 117 BLOCKED medidos, r259); B1 (49) medida en r260 (45 PASS_SCOPED / 4 BLOCKED); B2 (41) medida en r261 (20 PASS exactos + 13 PASS_SCOPED / 8 BLOCKED). Acumulado 300/638, 171 PASS / 129 BLOCKED; B3-B15 pendientes. Lite: `NO_EJECUTADO` (motor `stepEngine/ode.ts` limitado a `y'=f(x)` y 2.º orden constante; sin motor de variable compleja).

### GR519 — Graficación (522)

- 2D: G1–G12 (algebraicas, trig/hiperbólicas, trozos, sistemas/desigualdades, cónicas, límites, tangente/normal, área/Riemann/acumulación, paramétricas, polares, transformaciones, robustez).
- 3D: H1–H8 (superficies/cuádricas, nivel/gradiente/extremos, curvas en el espacio, paramétricas, sólidos de revolución, secciones/integrales múltiples, cilíndricas/esféricas/campos, robustez).
- Estado: `NO_EJECUTADO`.

## Historial de este documento

- **2026-10-23 (r261)** - EDCX Parte B B2 medida en Plus (300/638; 171 PASS / 129 BLOCKED). 20 PASS exactos + 13 PASS_SCOPED / 8 BLOCKED. Lite NO_EJECUTADO (sin motor de operaciones con complejos). Proximo bloque EDCX B3 (potencias y raices, 19 filas).
- **2026-10-23 (r260)** - EDCX Parte B B1 medida en Plus (259/638; 138 PASS / 121 BLOCKED). 45 PASS_SCOPED / 4 BLOCKED. Lite NO_EJECUTADO (sin motor de variable compleja B/P/T/X). Proximo bloque EDCX B2 (operaciones).
- **2026-10-23 (r259)** - EDCX Parte A cerrada en Plus (210/638; 93 PASS / 117 BLOCKED). A8 (6 filas) queda 0 PASS / 6 BLOCKED. Lite NO_EJECUTADO (sin existencia/unicidad, ramas, intervalo maximo ni fronteras). Proximo bloque EDCX B1 (conversion de formas).
- **2026-10-23 (r258)** - EDCX A7 cerrada en Plus (`PASS_SCOPED`, 2 PASS exactos + 2 PASS_SCOPED / 21 BLOCKED); acumulado A1-A7 93/111. Lite NO_EJECUTADO (sin canal cualitativo, numerico, recurrencias ni retardo). Proximo bloque EDCX A8 (casos limite).
- **2026-10-23 (r257)** - EDCX A6 cerrada en Plus (`PASS_SCOPED`, 1 PASS_SCOPED / 25 BLOCKED); acumulado A1-A6 89/90. Único caso ejecutable: `ED-P-25` (laplaciano compuesto con derivadas parciales reales). No hay motor de EDP. Próximo bloque EDCX A7 (cualitativo/numérico/retardo).
- **2026-10-23 (r256)** - EDCX A5 cerrada en Plus (`PASS_SCOPED`, 8 PASS / 2 BLOCKED); acumulado A1-A5 88/65. Las clasificaciones de punto singular regular/irregular quedan BLOCKED. Próximo bloque EDCX A6 (EDP).
- **2026-10-23 (r255)** - EDCX A3+A4 abiertas en Plus (`PASS_SCOPED`, 4 PASS / 36 BLOCKED); acumulado A1-A4 80/63. Defecto confirmado: la segunda condición inicial con `;` no está implementada. Próximo bloque EDCX A5.
- **2026-10-23 (r254)** - EDCX A1+A2 abiertas en Plus (`PASS_SCOPED`, 76 PASS / 27 BLOCKED); MV153 marcado `CERRADO` (catálogo A-H+J bilateral r236-r253); próximo bloque EDCX A3.
- **2026-10-21 (r235)** — Refresco: se separa "fuente congelada" de "ejecución"; se corrige `TR324`/`LER` (sección 1 ejecutada y cerrada); se añade estado por sección/bloque y pendientes; `next` = Matrices/Vectores.
- **2026-10-20** — Corte anterior: tabla plana con `CONGELADO` y marcas "no ejecutado" agregadas, que quedaron obsoletas al cerrarse `EV-L/E/R/M/T` y `EV-D/H/I`.

## Siguiente caso de producto

**EDCX B2** - continuar la Parte B con las operaciones (41 filas: 11/9/9/12) en Plus, midiendo primero los canales de suma/resta/producto/cociente/conjugado/módulo/argumento/potencia/raíz y su notación de entrada; Lite sigue sin motor complejo equivalente.
