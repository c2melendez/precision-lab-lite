# Correcciones PR #53 — paquete v2 (2026-10-26)

## Contexto verificado
Run 40337481960 (CI, attempt 1 de run #1253) = re-ejecucion del PR #53 tras la carga
del paquete anterior. MISMO fallo: paso "QA dependency audit (hard gate)" -> FAILURE.
Causa raiz confirmada por API publica: el commit HEAD de la rama del PR (285855c)
SIGUE con `.gitignore` = `*.tar.gz` (blob 335ec95). La correccion local (de0b197)
NUNCA se propuso a la rama remota del PR. Este paquete cierra ese hueco.

## Contenido
- `0001-fix-ci-restaurar-.gitignore-original-de-main-en-rama.patch`
  Commit listo para aplicar sobre la rama del PR #53. Cambia exactamente
  `*.tar.gz` -> las 6 lineas originales de main (node_modules/, dist/,
  *.tsbuildinfo, playwright-report/, test-results/, .env).
  Base: blob 335ec95 -> resultado blob 4a3b9d5 (identico a main).
- `gitignore-exacto-main.txt` — copia literal del .gitignore de main (para edicion via UI).
- `certification-runner.yml` — workflow v3 revalidado en este paquete:
  SHA-256 c85eb1d4..., YAML OK, job certification-cycle, 16 pasos,
  5/5 heredocs PY compilan (tras dedent), 15/15 bloques run validos (bash -n).
- `SHA256SUMS` — integridad (`sha256sum -c SHA256SUMS`).

## Opcion A — gh CLI (recomendada, sube directo a la rama del PR)
```bash
git checkout workflow-certification-runner-installation-64472   # o crear clone con esa rama
git am upload/fix-pr53-v2/0001-*.patch                          # aplica el fix
git push origin workflow-certification-runner-installation-64472
```
El push re-dispara CI automaticamente. El hard gate debe volver a verde
(main pasa el mismo gate con el mismo package-lock; la rotura era del .gitignore destructivo
que expuso artefactos/ruido en el arbol del PR).

## Opcion B — UI de GitHub (sin git/gh)
1. Ir a: https://github.com/c2melendez/precision-lab-lite/blob/workflow-certification-runner-installation-64472/.gitignore
2. Click en el lapiz (Edit this file).
3. Reemplazar TODO el contenido (`*.tar.gz`) por estas 6 lineas exactas:
```
node_modules/
dist/
*.tsbuildinfo
playwright-report/
test-results/
.env
```
4. Commit directly a la rama `workflow-certification-runner-installation-64472`.
5. Esperar CI (~2 min): el hard gate debe pasar.

## Importante
- NO fusionar el PR tal como esta: los archivos bajo `upload/**` no pertenecen al producto.
- La instalacion real del runner es por otra via: PUT del yml a
  `.github/workflows/certification-runner.yml` en `qa/syntax-audit-in625-a1`
  (lite y plus); main ya tiene v3 (PR #52). Instrucciones completas en
  `../certification/CARGA_MANUAL.md` y `../fix-pr53/README_CORRECCIONES.md`.
- Tras el green del gate: cerrar PR #53 sin merge (Option A/B segun convenga).
