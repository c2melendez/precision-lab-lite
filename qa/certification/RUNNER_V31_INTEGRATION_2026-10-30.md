# Integración Runner v3.1 — gate v2.1 + operación docs — 2026-10-30

**Autorización:** explícita del titular para portar la operación `docs` de `main` v3.x sobre el contrato de gate v2.1 en una rama de integración.

**Alcance:** un único workflow `.github/workflows/certification-runner.yml` con dos operaciones independientes. No se despachó ningún workflow, no se fusionó ningún PR, no se desplegó nada y no se modificó ningún dato remoto.

## 1. Resultado

El workflow integrado conserva el contrato de gate de la rama canónica y añade la operación documental de `main`:

| Operación | Qué hace | Qué no hace |
|---|---|---|
| `gate` | resuelve la rama canónica, calcula la huella, resuelve el gate, detecta un run equivalente activo, espera si existe, despacha si no existe, registra y persiste | no publica paquetes documentales |
| `docs` | valida la solicitud, descarga y verifica el paquete, aplica solo cambios documentales y publica con compare-and-swap | no despacha gates ni ejecuta pruebas |

Ambas operaciones comparten la resolución de rama canónica, el checkout y el registro de `BASE_SHA`. La operación se elige con el input obligatorio `operation` (`gate` o `docs`).

## 2. Invariantes preservados del gate v2.1

- Dispatch solo con `workflow_dispatch`, `dry_run != true` y `RUN_ID` vacío.
- Sonda de run equivalente antes del dispatch, limitada al mismo `BASE_SHA` y a estados `queued`/`in_progress`/`waiting`.
- `WAIT_EXISTING` espera el run existente y no lo duplica.
- Resolución de `GATE_WORKFLOW` desde `continuity.json` y `reason` con run/gate/sha.
- Registro `qa/certification/runner/<id>.json` con la cadena de correlación completa.
- Persistencia en `continuity.json`, `CURRENT_STATE.md` y `EXECUTION_LOG.md`.
- Publicación con compare-and-swap contra `BASE_SHA`.
- Bloqueo de `security` en Plus.
- Guarda de `target_repo` por repositorio.

## 3. Invariantes preservados de la operación docs v3.x

- `target_repo` debe ser el repositorio actual; `both` se rechaza con error explícito.
- Solo HTTPS, sin credenciales en la URL y solo puerto 443.
- Rechazo de `localhost`, `.local`, `.internal` e IP privadas, loopback, link-local o reservadas.
- Allowlist de hosts, ampliable solo con `docs_patch_hosts`.
- Verificación de SHA-256, límite de 5 MiB y rechazo de parches binarios.
- Aplicación con `git am --3way` sobre `docs_expected_base_sha` exacto.
- Solo rutas `qa/certification/**.md` y `qa/certification/continuity.json`.
- Rechazo de symlinks, gitlinks, cambios de modo, commits vacíos y marcadores de omisión.
- Publicación con `--force-with-lease` contra `BASE_SHA` y verificación del remoto posterior.
- Registro con `schema_version: 2` y `operation: docs`.
- `dry_run=true` valida y no publica.

## 4. Validación ejecutada

| Comprobación | Lite | Plus |
|---|---|---|
| YAML parseado | OK | OK |
| Bloques `run` con `bash -n` | 18/18 OK | 18/18 OK |
| Suite completa local | 68 pruebas OK | 87 pruebas OK |
| Pruebas nuevas de `docs` | 13 OK | 13 OK |
| Pruebas de integridad de dispatch | 11 OK | 11 OK |

El diff entre los dos workflows integrados es de **2 líneas**: `default: lite`/`default: plus` y `options: [lite, both]`/`options: [plus, both]`. No hay divergencia de contrato entre repositorios.

La validación en CI se obtiene del PR de integración: el gate cumulative ejecuta `unittest discover` sobre `scripts/certification`, por lo que corre las 68/87 pruebas. El workflow del Runner no se ejecuta en el PR porque su disparador es `workflow_dispatch` o push a la rama canónica; por eso la validación es estática y no un despacho real.

## 5. Históricos del proyecto

Se conservan sin borrar ni reescribir:

| Hito | Referencia | Disposición |
|---|---|---|
| Instalación de Runner v2 en `main` | `07f68ed0` · blob `91f3c773` | histórico; superado por v3.x y v3.1 |
| Rama de publicación documental v3.0 | `ci/runner-v3-docs` · Lite `fab2657f` / Plus `4d6a9bea` · blob `23e42cf6` | histórico; integrada por PR #52 |
| Merge de v3 en `main` | PR #52 · `11806ba5` | histórico; base de la operación `docs` |
| Correcciones de v3 en `main` | `49be5e3e`, `e404bcac`, `4507082a` · blob `bcaef28a` | histórico; incorporadas |
| Contrato de gate v2.1 en la rama canónica | Lite `e07f747d` / Plus `efee4a92` · blobs `9c39cacb` / `171703c2` | canónico hasta la promoción de v3.1 |
| Reconciliación y pruebas de dispatch | PR Lite #57 / Plus #38 · `e21274c6` / `2674683c` | base de esta integración; permanece abierto |
| Integración v3.1 | rama `ci/runner-v31-integration-20261030` | propuesta en revisión; sin merge |

No se cerraron PR históricos, no se borraron ramas y no se reescribió ningún commit. Los PR #57 y #38 siguen abiertos y en Draft; si se aprueba la integración, quedan superados por ella y pueden cerrarse administrativamente en una operación separada.

## 6. Límites y pendientes

- **O6:** PENDING. No se ejecutó `workflow_dispatch → gate → recibo → persistencia` real.
- **O7:** PENDING y depende de O6. La idempotencia durable pertenece al Bridge.
- **D-07:** la API de GitHub no devuelve `inputs`; falta `correlation_id` o recibo durable.
- **Gate `scientific`:** sigue declarado en `continuity.json` y fuera de las opciones del Runner.
- **Promoción:** requiere revisión y merge separados; no se ejecuta aquí.

## 7. Publicación de la integración

| Repositorio | Rama | Commit | PR |
|---|---|---|---|
| Lite | `ci/runner-v31-integration-20261030` | `e14475fc` | #58 (Draft) |
| Plus | `ci/runner-v31-integration-20261030` | `cbacb4dc` | #39 (Draft) |

Ambos PR apuntan a `qa/syntax-audit-in625-a1` y son acumulativos: incluyen también el commit de reconciliación y pruebas de dispatch de #57/#38.

## 8. Siguiente paso exacto

Revisar el PR de integración en Lite y Plus. Si se aprueba, fusionarlo en la rama canónica en una operación separada y actualizar `CURRENT_STATE.md`. Después, y solo con autorización específica, ejecutar un despacho real controlado para cerrar O6/O7.
