# Paquete de corrección v4 — PR #53 (lite) — HEAD remoto 384bed8

## Situación (runs 40342497926 CI y 40342497845 Cross-browser)
- CI falló otra vez en paso 5 "QA dependency audit (hard gate)".
- El commit 384bed8 ("restore .gitignore") NO restauró nada: volvió a escribir
  *.tar.gz + *.gz (blob e4284d9) sobre el .gitignore roto anterior.
- main tiene el .gitignore correcto (blob 4a3b9d5, 6 líneas).
- Cross-browser smoke aparece "cancelled" porque GitHub canceló el job al fallar CI
  del mismo commit; no es un fallo propio.
- Nota dura: aunque el .gitignore quede perfecto, el hard gate seguirá fallando
  mientras npm audit reporte las 4 vulnerabilidades del lock (katex/postcss/tailwind
  cadena). Eso es trabajo M16 del producto, no del workflow. Ver Opción B abajo.

## Corrección incluida aquí
- Commit local 35f5904 sobre el HEAD exacto 384bed8: restaura .gitignore al blob
  4a3b9d5 (SHA-256 437fa5d0...8d7348, verificado byte a byte contra main).
- Parche portable: 0001-fix-ci-restaurar-.gitignore-original-de-main-blob-4a.patch
  (aplica limpio con git apply sobre 384bed8).
- certification-runner.yml v3 íntegro (SHA-256 c85eb1d4...15e0d7) para la rama
  canónica qa/syntax-audit-in625-a1 en ruta correcta .github/workflows/.

## Opción A (recomendada): cerrar PR #53 sin fusionar
main ya tiene el runner v3 (PR #52). El PR #53 solo añade upload/** al producto y
rompe .gitignore; no instala nada. Cerrarlo y hacer el PUT del v3 directo a la rama
canónica:

  SHA=$(gh api repos/c2melendez/precision-lab-lite/git/blobs/$(git hash-object -w --stdin < certification-runner.yml) --jq .sha)
  for R in precision-lab-lite precision-lab-plus; do
    gh api -X PUT repos/c2melendez/$R/contents/.github/workflows/certification-runner.yml \
      -f sha=$SHA -f content=$(base64 -w0 certification-runner.yml) \
      -f branch=qa/syntax-audit-in625-a1 -f message="cert: sync runner v3 to canonical branch"
  done

## Opción B: sanear la rama del PR (si quieres que CI vuelva a verde)
UI de GitHub: editar .gitignore en la rama workflow-certification-runner-installation-64472,
reemplazar el contenido por las 6 líneas de gitignore-exacto-main.txt, commit a esa rama.
O por CLI:
  git checkout workflow-certification-runner-installation-64472
  git apply 0001-fix-ci-restaurar-.gitignore-original-de-main-blob-4a.patch
  git push
Esto NO basta para green si npm audit sigue dando exit 1 (ver arriba); para desbloquear
la instalación sin tocar dependencias se requiere decisión explícita del owner sobre el
hard gate (paquete v3 incluyó ci-hardgate-soft-optionB.yml como referencia).

## Verificación post-carga
  sha256sum certification-runner.yml   # debe dar c85eb1d4...15e0d7 en las 4 ubicaciones
  gh workflow list -R c2melendez/precision-lab-lite | grep certification
  gh workflow run certification-runner.yml -R c2melendez/precision-lab-lite -f gate=cumulative -f dry_run=true
  gh workflow run certification-runner.yml -R c2melendez/precision-lab-plus -f gate=security -f dry_run=true
