# Algebra 229 — preparación de matriz y trazabilidad

Estado: **SOURCE_INTEGRITY_PASS / FIXTURE_PROMOTE_PENDING** (2026-10-20). Certificación global **OPEN**.

## Autoridad y límites

Protocolo: Syntax 309 → Algebra 114 → **Algebra 229** → Trigonometría → …
Algebra 114 (114 filas AS-SIM…AS-LIM en `algebra114_source.md`) = recorrido completo, certificación **parcial** bilateral.
Esta matriz es **distinta**: 229 filas `AS-A-01`…`AS-L-11` en `matriz_algebra_simbolica.md`.

## Fuente normativa recuperada

| Campo | Valor |
|---|---|
| Archivo original | `matriz_algebra_simbolica.md` (Matrices.zip) |
| Congelado en QA | `qa/certification/legacy_sources/matriz_algebra_simbolica.md.gz` |
| SHA-256 (raw) | `8cd36ff08343f98f92abd83e2b162d565e0cbe5c59dc73f26b1c018f77d663c7` |
| Bytes | 29 940 |
| Filas / IDs únicos | **229 / 229** |
| Niveles | N1=43 · N2=132 · N3=54 |
| Secciones | A17 B30 C23 D9 E26 F18 G35 H23 I18 J12 K7 L11 |
| Validador | `qa/certification/check_algebra229_source.py` |
| Gate CI | workflow `algebra229-source-integrity.yml` |

**Verificación bilateral 2026-10-20:** el adjunto `Matrices.zip` produce el **mismo SHA-256** byte a byte. Lite run [39381807307](https://github.com/c2melendez/precision-lab-lite/actions/runs/39381807307) SUCCESS en SHA `db7fd2c9…`; Plus run [39381871764](https://github.com/c2melendez/precision-lab-plus/actions/runs/39381871764) SUCCESS en SHA `1f2c0958…`.

Recuperar Markdown en un checkout:
```bash
python3 qa/certification/check_algebra229_source.py --restore
```

## JSONL candidato (handoff v0.3 — aún no canónico en el repo de producto)

En el ZIP de handoff (no versionado aún en `qa/certification/` del producto):

- `migration/imported/as229_raw.jsonl` — 229 registros
- `cases/algebra/algebra_229_promoted_v1.jsonl` — 229 registros

Comparación local ID/entrada contra el Markdown congelado: **229/229 IDs** alineados. Diferencias aparentes en 6 oráculos se deben a backticks embebidos en la columna “Resultado esperado” del Markdown (artefacto de parseo de tabla), no a filas inventadas. **Aún no** se declara fixture canónico de ejecución hasta revisión fila a fila de tipo de comparación + oráculo y publicación en el árbol del producto.

## Qué no hacer

- No inventar filas ni fusionar Algebra114 con Algebra229.
- No declarar PASS de casos AS-A…L sin tests + gates exact-SHA.
- No contar XFAIL/TODO/SKIP como PASS.
- No promover el JSONL del handoff sin el paso `ALGEBRA229-FIXTURE-PROMOTE-VALIDATE`.

## Siguiente único

`ALGEBRA229-FIXTURE-PROMOTE-VALIDATE`:

1. Comparar cada ID: operación, entrada, esperado, tipo de comparación (Markdown ↔ JSONL candidato).
2. Publicar fixture canónico en `qa/certification/` (ambos repos) solo tras esa comparación.
3. Añadir validador de esquema del fixture promovido.
4. Primer caso test-first (p. ej. `AS-A-01`) bilateral + gates exact-SHA.

Global **OPEN**; bloqueos SY-P-23, X04/X14 Plus, S25, S19, H2/SG28/DIST sin cambios.
