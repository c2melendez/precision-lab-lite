# Paquetes de instalación del Certification Runner v3 (rama canónica)

Generados el 2026-10-26. Cada paquete es un `git format-patch` aplicable con la operación `docs`
del propio runner (`operation=docs`) o manualmente con `git am --3way`. Solo toca rutas documentales
(`qa/certification/**.md`, `qa/certification/continuity.json`, registro en `qa/certification/runner/`)
más el workflow `.github/workflows/certification-runner.yml` sincronizado al blob exacto de `main`
(23e42cf6dad30b281036cbbb63eff938c6646fde, sha256 c85eb1d4b89606a51904ec792c7ca8bb141dd9ee9ca0f15b1d0eddc82815e0d7).

## lite (repo c2melendez/precision-lab-lite, rama qa/syntax-audit-in625-a1)
- base_sha: 98c78b7ad6224b16694fa7adb20b3432540de665
- commits: d6e4295c… (workflow+índice+estado+log), 3d4aa458… (registro dry-run + docs_workflows enriquecido)
- pkg_sha256: 6739843af2d8f2e76dbe3ae5b4c941d849d753c40037b8141a65dea1cc420564
## plus (repo c2melendez/precision-lab-plus, rama qa/syntax-audit-in625-a1)
- base_sha: da153d1117f56a3ec22c5a443830a7a33cf552d5
- commits: e01ac695…, bbe694ad…
- pkg_sha256: 9e88fd6f35c853e2e0f264826809205d9ec03cefe4dc677f27800c57d2ea16a0

## Dry-run obligatorio (siguiente acción, requiere credenciales contents:write/actions:write)
```bash
gh workflow run certification-runner.yml --repo c2melendez/precision-lab-lite \
  --ref qa/syntax-audit-in625-a1 -f operation=gate -f gate=cumulative -f target_repo=lite -f dry_run=true
gh workflow run certification-runner.yml --repo c2melendez/precision-lab-plus \
  --ref qa/syntax-audit-in625-a1 -f operation=gate -f gate=cumulative -f target_repo=plus -f dry_run=true
# comprobar además el bloqueo de seguridad:
gh workflow run certification-runner.yml --repo c2melendez/precision-lab-plus \
  --ref qa/syntax-audit-in625-a1 -f operation=gate -f gate=security -f target_repo=plus -f dry_run=true
# → debe fallar en "Gate policy and workflow resolution" (S19/R304) sin despachar nada.
```
Sin credenciales el dispatch anónimo devuelve 401/404 (verificado); no se expuso ningún secreto.
La simulación local del pipeline confirmó: gates descubiertos desde continuity.json y rechazo de security+Plus.
