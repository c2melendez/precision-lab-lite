# Carga manual v3 — run 40341085383 (CI PR #53, attempt fallido otra vez)

## Diagnostico definitivo (verificado con API publica)
1. El run 40341085383 es CI del PR #53 sobre el nuevo commit `ec71427`. Fallo OTRA VEZ en
   paso 5 "QA dependency audit (hard gate)".
2. **El fix de .gitignore NO llego a la rama**: en `ec71427` el blob sigue siendo `335ec95`
   (`*.tar.gz`). La carga anterior subio los archivos del paquete tal cual (todo bajo
   `upload/...`) y ademas el mensaje del bot revirti6 el fix ("Revert .gitignore to original
   *.tar.gz state"). Resultado: HEAD actual = rot6 otra vez.
3. **Causa REAL del fallo del hard gate (reproducida localmente)**: no es solo el .gitignore.
   Ejecute `npm audit --package-lock-only --json` contra el package-lock.json exacto del repo
   (idéntico en main y en la rama del PR) y **exit=1 con 4 vulnerabilidades activas**:
   - katex 0.16.44 (directa, low) — prototype pollution
   - postcss-selector-parser (transitiva, moderate) + chain tailwindcss→postcss-nested (moderate)
   Es decir: aunque el .gitignore este perfecto, el hard gate de ci.yml FALLA igual porque
   las dependencias del producto tienen avisos abiertos (trabajo M16 pendiente). Esto explica
   por que el PR nunca podra pasar ese paso sin una decision explicita.

## Archivos de este paquete
| Archivo | Que es |
|---|---|
| `0001-fix-ci-restaurar-.gitignore-original-de-main-en-HEAD.patch` | Fix de .gitignore sobre HEAD ACTUAL (`ec71427`): `335ec95 -> 4a3b9d5`. Probado: `git apply -v` limpio y resultado SHA-256 identico byte a byte al .gitignore de main. |
| `gitignore-exacto-main.txt` | Las 6 lineas literales para pegar desde la UI (rama del PR, archivo .gitignore). |
| `ci-main-exacto.yml` | Copia exacta del ci.yml de main (referencia; el PR no lo toca). |
| `ci-hardgate-soft-optionB.yml` | OPCION B: ci.yml con el paso de auditoria como reporte (`|| true`), comentado como PENDIENTE DE DECISION hasta que M16 resuelva katex/postcss. Solo usar si decides desbloquear el PR temporalmente. Verificado YAML OK. |

## Como cargar (elige UNA ruta)
### Ruta recomendada (alineada con la tarea original)
PR #53 esta mal dirigido (sube upload/** al producto y no instala nada en .github/workflows/;
main YA tiene el runner v3 via PR #52). Lo correcto:
1. **Cerrar PR #53 sin fusionar** (UI → Pull requests #53 → Close pull request).
2. Con token contents:write, sincronizar el blob v3 con la rama canonica (pendiente real):
```bash
B64=$(base64 -w0 certification-runner.yml)   # certification-runner.yml v3 (SHA-256 c85eb1d4b896...)
SHA=$(gh api repos/c2melendez/precision-lab-lite/git/blobs/23e42cf6f4d02fa1e6bcf80817191ba601ac5739 --jq .sha 2>/dev/null || echo "")
for R in precision-lab-lite precision-lab-plus; do
  gh api -X PUT "repos/c2melendez/$R/contents/.github/workflows/certification-runner.yml" \
    -f sha="$(gh api repos/c2melendez/$R/contents/.github/workflows/certification-runner.yml?ref=qa/syntax-audit-in625-a1 --jq .sha)" \
    -f branch=qa/syntax-audit-in625-a1 -f message="chore(cert): sync certification-runner v3 to canonical branch" \
    -f content="$B64" | jq '.commit.sha'
done
```
3. Dry-runs obligatorios desde la canonica: `gate=cumulative` (lite) y `gate=security` (plus, espera rc!=0 = bloqueo S19 correcto), luego `operation=docs` para continuity.json/CURRENT_STATE/EXECUTION_LOG.

### Si quieres ver el PR verde igualmente (no recomendado)
- Paso 1: aplicar el parche (restaura .gitignore) — corrige el dano colateral.
- Paso 2: el hard gate seguira rojo por katex/postcss. Solo entonces considerar Opcion B
  (usar `ci-hardgate-soft-optionB.yml` en la rama) entendiendo que relaja un gate de seguridad
  del producto: decision del owner, documentar excepcion y restaurar tras M16.

## Prohibiciones respetadas
Sin merges, sin tocar producto real desde este entorno, sin gates fuera de dry-run, sin credenciales (solo API publica anonima + reproduccion local de npm audit).
