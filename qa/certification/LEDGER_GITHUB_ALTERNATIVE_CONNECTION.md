# Ledger documental — conexión alternativa a GitHub (PL-CONN-GH-ALT-P0)

**Apertura:** 2026-10-27 UTC
**Estado del mecanismo:** BLOCKED (persistencia e idempotencia durables no disponibles)
**Alcance:** registro común legible por cualquier sesión LLM mientras Supabase `oqlzftercvraprnvjifo` siga INACTIVE. No sustituye al ledger durable transaccional exigido por las fases 3 y 7 de `ROADMAP_GITHUB_ALTERNATIVE_CONNECTION.md`; por tanto no habilita claims concurrentes ni deduplicación transaccional.

## Reglas de registro

1. Solo se registra evidencia observada y reproducible; un run SUCCESS no equivale a PASS de conexión.
2. Estados permitidos: `BLOCKED`, `FAILED`, `RUNNING`, `SUCCEEDED`, `REPLAYED`.
3. Solo un `SUCCEEDED` con todas las etapas y evidencia completa cuenta como validación integral diaria.
4. Nunca se registran secretos, claves, tokens ni credenciales; solo identificadores y hashes.
5. Las entradas son inmutables: una corrección se añade como entrada nueva que referencia la anterior.
6. Cada entrada debe permitir a otra sesión reconstruir qué se probó, contra qué HEAD y con qué resultado.

## Entradas

| validation_id | correlation_id | UTC | repo / rama / SHA | etapas | evidencia | resultado | siguiente paso |
|---|---|---|---|---|---|---|---|
| `VAL-GH-ALT-2026-10-27-01` | `CORR-GH-ALT-2026-10-27-EXTAPI-01` | 2026-10-27T02:20Z | Lite `qa/syntax-audit-in625-a1` `84db0b1c2fe8f2105016ccc24b7ab6f16118f198`; Plus `qa/syntax-audit-in625-a1` `6ab469a33504430a6bd1b140e486332b331d81bc` | Fase 4.1–4.2 parcial (API externa, solo GET, sin credenciales) | `/healthz` 200 `{"status":"ok","read_only":true}` (32 s de arranque en frío); `/openapi.json` 200, `servers[0].url` = host consultado, solo GET, rutas `/healthz`, `/v1/status`, `/v1/gates/{gate}/plan`, `/v1/runs/{run_id}`, esquema `APIKeyHeader` (`X-API-Key`); `/v1/status?repo=both` sin clave 401 y con clave incorrecta 401; `/v1/gates/cumulative/plan?repo=lite` sin clave 401; `X-Read-Only: true` y `Cache-Control: no-store` | **PARTIAL** (no PASS): auth positiva, estado bilateral y planificador autenticado no probados | P0.1 Supabase; prueba positiva con `scripts/verify-live-api.ps1` por operador autorizado |

| `VAL-GH-ALT-2026-10-27-03` | `CORR-GH-ALT-2026-10-27-P01-INVENTORY` | 2026-10-27T02:45Z | Lite/Plus `qa/syntax-audit-in625-a1` (SHA del informe) | P0.1 (restauración + inventario) | Supabase `oqlzftercvraprnvjifo` de INACTIVE a `ACTIVE_HEALTHY`; `public.calls`/`public.history` vacías, RLS permisivo para `public` y grants amplios a `anon`/`authenticated`; migraciones vacías; sin tabla de idempotencia; WARN `function_search_path_mutable`; sin DDL. Fuente: `EXECUTION_REPORT_SUPABASE_P0_1_2026-10-27.md` (sesión concurrente; no re-verificado aquí) | **PARTIAL** | Completar inventario y decidir D-01 antes de cualquier migración |
| `VAL-GH-ALT-2026-10-27-02` | `CORR-GH-ALT-2026-10-27-BRIDGE-V1` | 2026-10-27T02:40Z | Lite/Plus `qa/syntax-audit-in625-a1` | P0.2 (diseño y auditoría estática) | `BRIDGE_CONTRACT_GITHUB_ALTERNATIVE_CONNECTION_v1.md`: contrato DRAFT de 17 secciones, threat model, 15 pruebas negativas y auditoría del Runner v2 | **DRAFT** (no aprobado, no implementado): no cuenta como validación | Aprobación D-01..D-06; completar P0.1 |

## Observaciones de auditoría (sin ejecución)

- **Código desplegado vs repositorio de la API:** `b6d5efdcae0802d5b5a24c79d8d7373bfa9e1acd` es el último commit de código; `main` tiene 5 commits posteriores que solo modifican `README.md`. No hay deriva de código en el repositorio, pero el deploy `dep-dbfnu8nlk1mc73fksl6g` sigue siendo una referencia documentada, no verificada de forma independiente.
- **Render `healthCheckPath`:** sin conciliar; `render.yaml` declara `/healthz` pero el servicio reporta el valor efectivo vacío. Requiere acceso al Dashboard o a la API de Render.
- **Runner v2 (Lite y Plus):** `workflow_dispatch` con `dry_run=true` por defecto; `dry_run=false` despacha el gate con `gh workflow run` usando `secrets.GH_TOKEN` y `permissions: actions: write`; en `push` no despacha ni publica. Usa `paths-ignore` para `**.md`, `qa/certification/continuity.json` y `qa/certification/runner/**`, y ya no usa `[skip ci]`. Es un ejecutor **dentro** de Actions, no un Bridge expuesto.
- **Bridge:** no existe componente ni endpoint identificado; la API es estrictamente GET. El circuito `Push → API → Bridge → Runner` sigue sin eslabón de ejecución autorizado.
- **Commits documentales:** los workflows con `push` a la rama canónica filtran `**/*.md` (o declaran rutas no documentales), por lo que los cambios de este ledger, `CURRENT_STATE` y `EXECUTION_LOG` no despachan gates.

- **Correlación Bridge→Runner (2026-10-27):** el Runner v2 solo acepta `target_repo`, `gate` y `dry_run`; no admite `reason`/`correlation_id`. El contrato v1 corrige el dispatch y abre D-07 (input opcional propagado al gate) para que la auditoría E2E no dependa solo de ventana temporal y SHA.

## Estado P0.1 y bloqueo vigente

- 2026-10-27: Supabase `oqlzftercvraprnvjifo` restaurado a `ACTIVE_HEALTHY` previa autorización del responsable; inventario inicial en `EXECUTION_REPORT_SUPABASE_P0_1_2026-10-27.md` (entrada `VAL-GH-ALT-2026-10-27-03`).
- Inventario parcial: historial de migraciones vacío, sin tabla de idempotencia y hallazgos de RLS/grants permisivos en `public.calls`/`public.history` sin corregir. No se ejecutó DDL.
- Bloqueo vigente: definir el almacén durable (D-01), completar el inventario y aprobar una migración antes de implementar el claim.
