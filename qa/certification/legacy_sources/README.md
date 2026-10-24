# legacy_sources — matrices normativas congeladas

## Contenido esperado (9/9 de Matrices.zip)

Ver `MANIFEST.json` (SHA-256 del Markdown sin comprimir).

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

## Como materializar los blobs

Desde el adjunto oficial `Matrices.zip` (SHA del ZIP `41295fd7…`):

```bash
python3 qa/certification/import_from_matrices_zip.py /ruta/Matrices.zip
python3 qa/certification/check_legacy_sources.py
```

AS229 ya puede existir como `.md.gz` binario en el repo. El importador sobrescribe/completa el resto con el mismo SHA del ZIP.

Tambien se acepta transporte `*.md.gz.b64` (Base64) via `restore_legacy_sources.py`.

## Politica

Congelar fuente ≠ ejecutar casos ≠ PASS de certificacion. Orden de suite: Syntax → Algebra114 → Algebra229 (activo) → Trigonometria → …
