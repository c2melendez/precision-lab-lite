## 2026-10-20 UTC — 9/9 matrices congeladas como md.gz en producto

**LEGACY_SOURCES — COMMIT BILATERAL.**

Las 9 fuentes de `Matrices.zip` estan en `qa/certification/legacy_sources/*.md.gz` (Lite y Plus), verificadas con `check_legacy_sources.py` / MANIFEST.

| Key | Canonical |
|-----|-----------|
| AS229 | matriz_algebra_simbolica.md.gz |
| AS114 | matriz_algebra_simbolica_estres_114.md.gz |
| IN309 | matriz_sintaxis_entrada_309.md.gz |
| IN625 | matriz_entrada_sintaxis_625.md.gz |
| TR324 | ejercicios_trigonometria.md.gz |
| LER | matriz_log_exp_radicales.md.gz |
| MV153 | matriz_matrices_vectores.md.gz |
| EDCX | matriz_edo_variable_compleja.md.gz |
| GR519 | matriz_graficacion.md.gz |

**No se ejecutan casos** de TR/LER/MV/EDCX/GR. Global **OPEN**.

**Siguiente unico de producto:** `ALGEBRA229-AS-A-01-TEST-FIRST` — expand `(x+1)^2` → `x^2+2x+1` bilateral.

## Contexto

AS229 fixture builder + integrity gate previos. Algebra114 AS-CONV/AS-LIM PARTIAL_BILATERAL.
