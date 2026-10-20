# Inventario de fuentes de matrices — Matrices.zip vs GitHub QA

**Corte:** 2026-10-20 UTC.  
**ZIP de entrada:** `Matrices.zip` SHA-256 `41295fd7be19d7e64d0a3bfc55cae4d72abf5c8aa4a001dc7b08b87a5e133d6b` (9 archivos Markdown).

## Resumen

| Key | Archivo en Matrices.zip | SHA-256 del Markdown | Conteos declarados / verificados | En rama QA `qa/syntax-audit-in625-a1` | En handoff v0.3 (ZIP) |
|---|---|---|---|---|---|
| **AS229** | `matriz_algebra_simbolica.md` | `8cd36ff08343f98f92abd83e2b162d565e0cbe5c59dc73f26b1c018f77d663c7` | **229** filas / 229 IDs | **SÍ** — `legacy_sources/matriz_algebra_simbolica.md.gz` + `check_algebra229_source.py` + gate CI | raw + promoted JSONL |
| **AS114** | `Matriz de estrés — Álgebra simbólica.md` | `0d7ce9e02e6f381be5ef3b6006db75a4b26371ad13fbbc1d564217d2b0eb8b98` | **114** filas (SIM…LIM) | **SÍ** — `algebra114_source.md` (versión de trabajo de certificación) | raw + promoted |
| **IN309** | `matriz_sintaxis_entrada.md` | `d037b562bc82c2f47b25c205cb8912c9c8b1346c0a477376c2cca287d3c7fcdb` | **309** | Fixture Syntax309 ya en QA (`syntax309` / integrity); no es copia gzip de este nombre | raw + promoted |
| **IN625** | `matriz_entrada_sintaxis_calculadora.md` | `58fbc0ed04aef158148981fc28074d470e45ec07a67604f89b3847b55c625528` | 625 (handoff) | Parcial vía campaña IN625 / Syntax; no gzip de este archivo en QA | raw + promoted |
| **TR324** | `ejercicios_trigonometria_calculadora.md` | `8d3904fd1c53f8af694caf66171b99caf821ca5d94dfbef8677d73b7a76054f7` | ~324 (handoff) | **NO** en árbol QA de producto | raw + promoted |
| **LER** | `matriz_log_exp_radicales_calculadora.md` | `bb7030e28f11b2bfb61b6c7d64e3d4e1c758702cc15d2d0cffc0304433fd4912` | handoff | **NO** | raw + promoted |
| **MV153** | `matriz_matrices_vectores.md` | `55ae614d03d22d1ef30212ccd3bf0a3f7aea21f10228856fdaed31b40c43e18b` | **153** | **NO** | raw + promoted |
| **EDCX** | `matriz_edo_variable_compleja_calculadora.md` | `09793d3f97052cc292e9773fef19c0d51208a85a395f311756dad27af73e40a5` | handoff | **NO** | raw + promoted |
| **GR519** | `matriz_graficacion_calculadora.md` | `e59905160bb261fb43f80d42ea51a9f814cd176edb436f2f032f6f8c8ac3ee15` | handoff | **NO** | raw + promoted |

## Interpretación

1. **AS229** es la única matriz del ZIP que pasó a **fuente congelada + validador + CI** en la rama canónica de **ambos** productos (Lite/Plus). Eso **no** certifica ningún caso AS-A…L ejecutado.
2. **AS114** ya se certificó parcialmente vía `algebra114_source.md` y tests `AS-*` (SIM…LIM); es un documento distinto de AS229.
3. Las demás matrices existen en el **handoff v0.3** (legacy_sources + JSONL) pero **no** están versionadas como fixture canónico en el árbol de producto GitHub, salvo el trabajo histórico de Syntax309/IN625 que no sustituye el gzip de cada fuente del ZIP.
4. El crosswalk del handoff (`MATRIX_SOURCE_CROSSWALK.md`) afirma 9/9 preservadas en *su* `legacy_sources/`; eso es autoridad del **paquete handoff**, no del repo de producto hasta que se publique el mismo blob en `qa/certification/`.

## Política

- No fabricar filas ni oráculos.
- No declarar certificación global.
- Promover fixture solo tras comparación Markdown ↔ JSONL y publicación bilateral en GitHub.
- Siguiente prioritario Frente B: `ALGEBRA229-FIXTURE-PROMOTE-VALIDATE` (ver `CURRENT_STATE.md` / `continuity.json`).

## Evidencia de integridad AS229 en producto

- Lite: [39381807307](https://github.com/c2melendez/precision-lab-lite/actions/runs/39381807307) @ `db7fd2c9f1b23c4fbf9e966463541a8576157fd1`
- Plus: [39381871764](https://github.com/c2melendez/precision-lab-plus/actions/runs/39381871764) @ `1f2c09580847a142b9a6a3435a68c3c02e449a94`
- Adjunto Matrices.zip: mismo SHA de `matriz_algebra_simbolica.md` que el congelado.
