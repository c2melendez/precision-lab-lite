# legacy_sources — matrices normativas congeladas

Cada matriz de `Matrices.zip` / handoff v0.3 se conserva como `*.md.gz` o `*.md.gz.b64`.

`MANIFEST.json` lista clave, nombre canonico y SHA-256 del Markdown sin comprimir.

```bash
python3 qa/certification/restore_legacy_sources.py
python3 qa/certification/check_legacy_sources.py
```

Congelar la fuente no ejecuta casos ni declara PASS. Evita SOURCE_NOT_LOCATED para TR, LER, MV, EDCX, GR e IN*.
