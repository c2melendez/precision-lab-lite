# Correcciones al PR #53 — carga manual

## Contexto del problema (run 40334765495 = CI del PR #53, FAILURE)
El PR #53 (rama `workflow-certification-runner-installation-64472` → main de lite) tenía 2 defectos:
1. **Destructivo**: modificó `.gitignore` eliminando las 6 líneas de protección
   (`node_modules/`, `dist/`, `*.tsbuildinfo`, `playwright-report/`, `test-results/`, `.env`)
   y dejándolo solo en `*.tar.gz`. Esto rompió el hard gate "QA dependency audit" del CI
   y expondría artefactos/.env en futuros commits.
2. **Mal dirigido**: colocó el workflow v3 en `upload/certification/` en vez de
   `.github/workflows/`, por lo que no instalaba nada (GitHub Actions lo ignora).
   Nota: main YA tiene el v3 correcto (blob `23e42cf6…`, SHA-256 `c85eb1d4…`) vía PR #52.

## Opción A (recomendada): CERRAR el PR #53 sin fusionar + cargar a la rama canónica
main ya contiene el v3 íntegro; lo único pendiente es la rama canónica
`qa/syntax-audit-in625-a1` (aún con la versión antigua `91f3c773…`, 9.230 bytes) en AMBOS repos.

### A.1 GitHub UI (sin gh CLI)
1. Repo → `Code and automation` → `Branches` → crear/confirmar `qa/syntax-audit-in625-a1` (ya existe).
2. Ir a `qa/syntax-audit-in625-a1` → `.github/workflows/certification-runner.yml` → lápiz (Edit).
3. Seleccionar TODO el contenido antiguo, pegar el contenido completo de `certification-runner.yml`
   (el de este paquete, 536 líneas) → Commit directly a esa rama. Mensaje sugerido:
   `chore(cert): sincronizar certification-runner v3 en rama canónica`
4. Repetir en precision-lab-plus.
5. Verificar hash (debe dar `c85eb1d4b89606a51904ec792c7ca8bb141dd9ee9ca0f15b1d0eddc82815e0d7`
   en las 4 ubicaciones): usar el comando de verificación de CARGA_MANUAL.md o descargar cada
   archivo raw desde GitHub y ejecutar `sha256sum`.

### A.2 gh CLI (con token contents:write)
```bash
# Solo rama canónica (main ya está correcto en ambos repos)
for R in precision-lab-lite precision-lab-plus; do
  gh api -X PUT "repos/c2melendez/$R/contents/.github/workflows/certification-runner.yml" \
    -f branch="qa/syntax-audit-in625-a1" \
    -f sha="$(gh api "repos/c2melendez/$R/contents/.github/workflows/certification-runner.yml?ref=qa/syntax-audit-in625-a1" --jq .sha)" \
    -f message="chore(cert): sincronizar certification-runner v3 en rama canonica ($R)" \
    -f content="$(base64 -w0 certification-runner.yml)"
done
```
⚠️ El parámetro `-f sha=` es OBLIGATORIO al sobrescribir un archivo existente (evita 409 conflict).

## Opción B: Corregir el PR #53 en lugar de cerrarlo
Aplicar el parche `0002-fix-ci-restaurar-.gitignore-original-de-main-reviert.patch`
en la rama del PR (restaura el blob exacto de main, `4a3b9d5`):
```bash
git checkout workflow-certification-runner-installation-64472
git am 0002-fix-ci-restaurar-.gitignore-original-de-main-reviert.patch
git push origin workflow-certification-runner-installation-64472
```
Esto re-dispara el CI; el hard gate de dependency audit debería volver a pasar.
Incluso corregido, NO conviene fusionar los archivos `upload/**` a main del producto:
son paquetes de trabajo, no instalación. Recomendado: cerrar el PR tras aplicar la
corrección de `.gitignore`, o dejarlo cerrado si nadie más depende de él.

## Validación local de este paquete
- `certification-runner.yml`: SHA-256 idéntico al blob publicado en main de lite y plus.
- Parche 0002 genera exactamente el `.gitignore` de main (verificado con git diff → vacío).
- Prohibiciones respetadas: sin merges, sin tocar producto real, sin credenciales.
