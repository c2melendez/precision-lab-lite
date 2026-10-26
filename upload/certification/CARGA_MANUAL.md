# Guía de carga manual — certification-runner.yml v3

## Archivos incluidos
- `certification-runner.yml` — workflow v3 íntegro (536 líneas, job `certification-cycle`, 16 pasos: 9 gate + 7 docs). Validado: YAML OK, 5/5 heredocs Python compilan, 15/15 bloques `run` pasan `bash -n`. SHA-256: ver `SHA256SUMS`.

## Ruta de destino en cada repo
```
.github/workflows/certification-runner.yml
```
(crear la carpeta `.github/workflows/` si no existe; sobrescribir el archivo existente)

## Repos y ramas objetivo
| Repo | Rama main | Rama canónica de certificación |
|---|---|---|
| c2melendez/precision-lab-lite | `main` | `qa/syntax-audit-in625-a1` |
| c2melendez/precision-lab-plus  | `main` | `qa/syntax-audit-in625-a1` |

La rama canónica se confirma en `qa/certification/README.md` de `main` ("Rama canónica activa"). No codificarla a mano: el runner la resuelve desde ese README.

## Opción A — GitHub UI (sin gh CLI)
1. Ir al repo → `Add file` → `Create new file` (o editar el existente).
2. Nombre exacto: `.github/workflows/certification-runner.yml`
3. Pegar el contenido completo del archivo y **Commit directly to `main`**.
4. Cambiar el selector de rama a `qa/syntax-audit-in625-a1` → repetir el pegado → commit ahí.
5. Hacer lo mismo en el segundo repositorio (el blob debe quedar idéntico en las 4 ubicaciones).

## Opción B — gh CLI (si está disponible)
```bash
gh auth login   # una vez, con scopes contents:write + actions:write
for R in precision-lab-lite precision-lab-plus; do
  for BR in main qa/syntax-audit-in625-a1; do
    gh api -X PUT "repos/c2melendez/$R/contents/.github/workflows/certification-runner.yml" \
      -f branch="$BR" -f message="chore(cert): instalar certification-runner v3 en $BR ($R)" \
      -f content="$(base64 -w0 certification-runner.yml)"
  done
done
```

## Verificación tras la carga
```bash
# 1. Integridad del blob en las 4 ubicaciones (debe dar el mismo SHA-256)
for R in precision-lab-lite precision-lab-plus; do
  for BR in main qa/syntax-audit-in625-a1; do
    gh api "repos/c2melendez/$R/contents/.github/workflows/certification-runner.yml?ref=$BR" \
      --jq '.content' | base64 -d | sha256sum
  done
done

# 2. Workflow descubierto y activo
gh workflow list -R c2melendez/precision-lab-lite
gh workflow list -R c2melendez/precision-lab-plus

# 3. Dry-run obligatorio (descubrimiento de gates + bloqueo de seguridad)
gh workflow run certification-runner.yml -R c2melendez/precision-lab-lite \
  -f operation=gate -f target_repo=lite -f gate=cumulative -f dry_run=true
gh workflow run certification-runner.yml -R c2melendez/precision-lab-plus \
  -f operation=gate -f target_repo=plus -f gate=security -f dry_run=true
gh run list -R c2melendez/precision-lab-lite --workflow=certification-runner.yml --limit 3

# 4. Registro documental (operation=docs, paquete format-patch que toca solo qa/certification/**.md y continuity.json)
#    Actualizar clave docs_workflows en qa/certification/continuity.json dentro del paquete documental,
#    NO editar producto real. Publicar con:
#    gh workflow run certification-runner.yml -R <repo> -f operation=docs -f target_repo=<lite|plus> \
#      -f docs_package_url=<https...> -f docs_package_sha256=<64hex> -f docs_expected_base_sha=<40hex> -f dry_run=false
```

## Prohibiciones (recordatorio)
- No modificar producto real (`src/`, `tests/`, dependencias, fixtures).
- No fusionar PRs ni despachar gates reales fuera de `dry_run=true` en esta fase.
- No exponer tokens/credenciales en commits, logs ni paquetes documentales.
