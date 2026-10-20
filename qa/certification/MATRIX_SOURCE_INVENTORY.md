# Inventario de fuentes de matrices — producto vs Matrices.zip

**Corte:** 2026-10-20 UTC (conciliacion: las 9 fuentes del ZIP en `qa/certification/legacy_sources/`).

| Key | SHA-256 (prefix) | Canonical en producto | Estado |
|-----|------------------|----------------------|--------|
| AS229 | 8cd36ff0… | matriz_algebra_simbolica.md.gz | CONGELADO + builder/fixture |
| AS114 | 0d7ce9e0… | matriz_algebra_simbolica_estres_114.md.gz | CONGELADO |
| IN309 | d037b562… | matriz_sintaxis_entrada_309.md.gz | CONGELADO |
| IN625 | 58fbc0ed… | matriz_entrada_sintaxis_625.md.gz | CONGELADO |
| TR324 | 8d3904fd… | ejercicios_trigonometria.md.gz | CONGELADO (no ejecutado) |
| LER | bb7030e2… | matriz_log_exp_radicales.md.gz | CONGELADO (no ejecutado) |
| MV153 | 55ae614d… | matriz_matrices_vectores.md.gz | CONGELADO (no ejecutado) |
| EDCX | 09793d3f… | matriz_edo_variable_compleja.md.gz | CONGELADO (no ejecutado) |
| GR519 | e5990516… | matriz_graficacion.md.gz | CONGELADO (no ejecutado) |

Verificacion: `restore_legacy_sources.py` + `check_legacy_sources.py`.
Orden de ejecucion sin cambio: … Algebra 229 (activo) → Trigonometria → …
Siguiente caso de producto: ALGEBRA229-AS-A-01-TEST-FIRST.
