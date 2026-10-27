# Ledger documental — conexión alternativa a GitHub (PL-CONN-GH-ALT-P0)

**Apertura:** 2026-10-27 UTC
**Estado del mecanismo:** BLOCKED (persistencia e idempotencia durables no disponibles)
**Alcance:** registro común legible por cualquier sesión LLM mientras no exista un almacén durable verificado; ningún backend está confirmado y Supabase `oqlzftercvraprnvjifo` sigue sin relación de aplicación demostrada (ver `VAL-GH-ALT-2026-10-27-05`). No sustituye al ledger durable transaccional exigido por las fases 3 y 7 de `ROADMAP_GITHUB_ALTERNATIVE_CONNECTION.md`; por tanto no habilita claims concurrentes ni deduplicación transaccional.

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
| `VAL-GH-ALT-2026-10-27-02` | `CORR-GH-ALT-2026-10-27-BRIDGE-V1` | 2026-10-27T02:40Z | Lite/Plus `qa/syntax-audit-in625-a1` | P0.2 (diseño y auditoría estática) | `BRIDGE_CONTRACT_GITHUB_ALTERNATIVE_CONNECTION_v1.md`: contrato DRAFT de 17 secciones, threat model, 15 pruebas negativas y auditoría del Runner v2 | **DRAFT** (no aprobado, no implementado): no cuenta como validación | Aprobación D-01..D-07; completar P0.1 |
| `VAL-GH-ALT-2026-10-27-03` | `CORR-GH-ALT-2026-10-27-P01-INVENTORY` | 2026-10-27T02:45Z | Lite/Plus `qa/syntax-audit-in625-a1` (SHA del informe) | P0.1 (restauración + inventario) | Supabase `oqlzftercvraprnvjifo` de INACTIVE a `ACTIVE_HEALTHY`; `public.calls`/`public.history` vacías, RLS permisivo para `public` y grants amplios a `anon`/`authenticated`; migraciones vacías; sin tabla de idempotencia; WARN `function_search_path_mutable`; sin DDL. Fuente: `EXECUTION_REPORT_SUPABASE_P0_1_2026-10-27.md` (sesión concurrente; no re-verificado aquí) | **PARTIAL** | Completar inventario y decidir D-01 antes de cualquier migración |
| `VAL-GH-ALT-2026-10-27-04` | `CORR-GH-ALT-2026-10-27-RUNNER-DISPATCH` | 2026-10-27T03:05Z | Lite `qa/syntax-audit-in625-a1` `afc54a3c48c6a40ad94f95772a9d31196bfb0172`; Plus `qa/syntax-audit-in625-a1` `af9f38e409644cda2eedcfbda3987a3307a6c61a` | P0.5 parcial (Runner → gate, evidencia histórica; sin nuevos runs) | Lite runner `40272871857` → gate h1d `40272886275` (workflow_dispatch, completed/success); registro `qa/certification/runner/40272871857.json` schema 1 `decision=DISPATCHED` y `base_sha` igual al `head_sha` del gate; Plus runner `40273483681` → `40273499483` con la misma igualdad; el job log del gate registra `REVALIDATION_REASON: certification-runner run=<id> gate=h1d sha=<base_sha>`; `GET /actions/runs/{id}` devuelve `inputs: null` | **PARTIAL** (no E2E): faltan Push → API → Bridge y correlación legible por máquina | Aprobar D-07; no repetir estos runs para la misma evidencia |
| `VAL-GH-ALT-2026-10-27-05` | `CORR-GH-ALT-2026-10-27-SUPABASE-PURPOSE-CHECK` | 2026-10-27T21:00Z | API `main` + Lite/Plus rama canónica | P0.1 (trazabilidad de persistencia) | Inspección estática de `precision-lab-readonly-api/app/config.py`, `app/main.py`, `app/github_api.py`, `render.yaml`; búsqueda en repos de API, Plus y Lite; catálogo Supabase adicional | **BLOCKED / no se establece relación de aplicación**: la API usa `GITHUB_READ_TOKEN` y `SERVICE_API_KEY`, el cliente implementa GitHub GET, y no se encontró referencia a Supabase, `DATABASE_URL` ni integración de persistencia en el código inspeccionado. La base restaurada contiene `public.calls` y `public.history`, con forma funcional ajena al contrato de validaciones que se necesita. Esto no demuestra que el proyecto no tenga otros consumidores externos. | No ejecutar DDL ni cambiar RLS/grants ni pausar el proyecto. Primero identificar si este Supabase es realmente el destino aprobado para el Bridge o si se restauró un proyecto ajeno; escoger/autorizar explícitamente el backend durable antes de diseñar migración. |

**Nota 2026-10-27T03:06Z:** la entrada `CORR-GH-ALT-2026-10-27-SUPABASE-PURPOSE-CHECK` se renumeró de `VAL-GH-ALT-2026-10-27-04` a `VAL-GH-ALT-2026-10-27-05` por colisión de ID con `CORR-GH-ALT-2026-10-27-RUNNER-DISPATCH`; el contenido de la fila no se modificó. Su hora `21:00Z` no coincide con la secuencia de commits observada (~03:0xZ del mismo día) y debe revisarse.

## Observaciones de auditoría (sin ejecución)

- **Código desplegado vs repositorio de la API:** `b6d5efdcae0802d5b5a24c79d8d7373bfa9e1acd` es el último commit de código; `main` tiene 5 commits posteriores que solo modifican `README.md`. No hay deriva de código en el repositorio, pero el deploy `dep-dbfnu8nlk1mc73fksl6g` sigue siendo una referencia documentada, no verificada de forma independiente.
- **Render `healthCheckPath`:** sin conciliar; `render.yaml` declara `/healthz` pero el servicio reporta el valor efectivo vacío. Requiere acceso al Dashboard o a la API de Render.
- **Runner v2 (Lite y Plus):** `workflow_dispatch` con `dry_run=true` por defecto; `dry_run=false` despacha el gate con `gh workflow run` usando `secrets.GH_TOKEN` y `permissions: actions: write`; en `push` no despacha ni publica. Usa `paths-ignore` para `**.md`, `qa/certification/continuity.json` y `qa/certification/runner/**`, y ya no usa `[skip ci]`. Es un ejecutor **dentro** de Actions, no un Bridge expuesto.
- **Bridge:** no existe componente ni endpoint identificado; la API es estrictamente GET. El circuito `Push → API → Bridge → Runner` sigue sin eslabón de ejecución autorizado.
- **Commits documentales:** los workflows con `push` a la rama canónica filtran `**/*.md` (o declaran rutas no documentales), por lo que los cambios de este ledger, `CURRENT_STATE` y `EXECUTION_LOG` no despachan gates.

- **Correlación Bridge→Runner (2026-10-27):** el Runner v2 solo acepta `target_repo`, `gate` y `dry_run`; no admite `reason`/`correlation_id`. El contrato v1 corrige el dispatch y abre D-07 (input opcional propagado al gate) para que la auditoría E2E no dependa solo de ventana temporal y SHA.
- **Correlación Runner→gate (2026-10-27):** el Runner despacha con `-f reason="certification-runner run=<id> gate=<gate> sha=<base_sha>"` y el gate lo registra en su log (`REVALIDATION_REASON`), pero `GET /actions/runs/{id}` devuelve `inputs: null`: el Bridge no puede recuperar la correlación desde el objeto REST del run, solo desde logs. Esto convierte D-07 (input dedicado `correlation_id`) en requisito de auditoría, no en mejora cosmética.

## Estado P0.1 y bloqueo vigente

- 2026-10-27: Supabase `oqlzftercvraprnvjifo` restaurado a `ACTIVE_HEALTHY` previa autorización del responsable; inventario inicial en `EXECUTION_REPORT_SUPABASE_P0_1_2026-10-27.md` (entrada `VAL-GH-ALT-2026-10-27-03`).
- Inventario parcial: historial de migraciones vacío, sin tabla de idempotencia y hallazgos de RLS/grants permisivos en `public.calls`/`public.history` sin corregir. No se ejecutó DDL.
- Bloqueo vigente: definir el almacén durable (D-01), completar el inventario y aprobar una migración antes de implementar el claim.
- 2026-10-27: la API desplegada no referencia Supabase (`DATABASE_URL` ni cliente) y `calls`/`history` no encajan con el contrato de validaciones; el propósito del proyecto restaurado queda sin verificar (`VAL-GH-ALT-2026-10-27-05`). D-01 sigue abierta: no se presupone Supabase como almacén del Bridge.



## 2026-10-27 — Decisión D-01 propuesta tras autorización de mínimo privilegio

- El responsable autoriza elegir/ajustar la base final para que el sistema de conexión externo funcione con permisos mínimos. Decisión de diseño documentada: conservar el proyecto Supabase actual como candidato, pero usar exclusivamente un esquema privado dedicado para el Bridge; no reutilizar ni modificar `public.calls`/`public.history`.
- No se borra, renombra, pausa ni altera el proyecto actual; no se cambian los grants/RLS existentes porque no se ha descartado que haya consumidores externos. Si no puede verificarse el aislamiento, la alternativa es una base/proyecto dedicado, sujeto a confirmar organización y coste.
- La decisión no es implementación ni aceptación final de D-01: falta verificar Data API exposure, completar el inventario de roles/consumidores y aprobar migración versionada/credenciales separadas. Sin DDL ni Actions en esta actualización.
- Documento de diseño: [DATABASE_MINIMUM_PRIVILEGE_DECISION_2026-10-27.md](DATABASE_MINIMUM_PRIVILEGE_DECISION_2026-10-27.md). P0.1 permanece BLOCKED hasta la verificación y la prueba de privilegios efectivos.


## 2026-10-27 — P0.1 security inventory continuation

- Confirmed catalog findings: `public.calls`/`public.history` have permissive policies and broad grants to API roles; schema `public` grants USAGE to `anon`/`authenticated`; `service_role` has BYPASSRLS and must not be the Bridge runtime identity. No Bridge-specific role found in the role query.
- Effective Data API exposed-schema configuration and external consumers remain unverified. Recent logs are not sufficient to prove no consumer. No migrations registered, which does not rule out manual DDL. Advisor still flags mutable search_path on `public.set_updated_at`.
- No schema/permission/data changes or Actions. P0.1 remains BLOCKED. Required next step: confirm Data API configuration and runtime access pattern, then prepare reviewed migration/rollback for private Bridge schema. Details: [EXECUTION_REPORT_SUPABASE_SECURITY_AUDIT_2026-10-27.md](EXECUTION_REPORT_SUPABASE_SECURITY_AUDIT_2026-10-27.md).


## Corte actualizado — Certificación Cert Runner Compass v1.1 (2026-10-27 UTC)

> **Precedencia:** este corte actualiza el estado de la ruta ejecutora implementada como Cert Runner Compass. Corrige las frases históricas de este documento que indiquen que todavía no existe Bridge implementado. No implica que la certificación global de Precision Lab esté cerrada ni sustituye la auditoría separada de Supabase/D-01.

### Estado
- **Certificación del Bridge: OPEN / NO CERTIFICADA.** Se completó la Fase 1 sin crear runs. La Fase 2 está autorizada por el responsable para continuar; este registro documental no ejecutó POST ni workflows.
- Arquitectura actual: GPT/LLM → Cert Runner Compass (Lovable, proyecto `57b9141d-9f69-4fef-9b7f-0f81f2eaec2f`, autenticación `X-Bridge-Key` + `Idempotency-Key`) → GitHub Actions Runner. La persistencia de Compass está en Lovable Cloud; **no** es el proyecto Supabase `oqlzftercvraprnvjifo`.
- La API `precision-lab-readonly-api` en Render es independiente, GET-only, autenticada con `X-API-Key`; no despacha workflows y no comparte claves con Compass.
- Destinos: `lite` → `precision-lab-lite`; `plus` → `precision-lab-plus`; `both` → ambos repositorios y potencialmente dos runs de runner.
- La clave expuesta anteriormente en conversaciones se considera comprometida y debe rotarse por el responsable. Nunca registrar ni reproducir valores de claves.

### Evidencia registrada
- Compass commit `7b6ccae9`: idempotencia durable; 27 pruebas reportadas.
- Compass commit `f051a4b1`: corrección reportada para GitHub HTTP 204 (buscar/asociar el run antes de concluir incertidumbre) y clasificación de rechazo definitivo `GITHUB_DISPATCH_REJECTED_<status>` para 401/403/404/422 frente a `DISPATCH_OUTCOME_UNKNOWN` para red/timeout/5xx; 30 pruebas reportadas.
- El responsable informa que `f051a4b1` está desplegado, pero la verificación independiente del artefacto desplegado sigue pendiente. No tratar el reporte de despliegue como prueba de certificación.
- Fase 1, 9/9 comprobaciones OK, sin runs: A1–A6, B1 y B2a/B2b. E1 y E4 se simularon correctamente, sin enviar solicitudes. Conteo descriptivo: 11 verificaciones/simulaciones aprobadas de aproximadamente 20 previstas; no equivale a certificación.
- Línea base observada en Lite durante la Fase 1: 26 runs antes y 26 después. Último run previo identificado en ese corte: `40429625526`, push, completed/success, 2026-10-27 00:57 UTC. Es una observación histórica, no un conteo actual garantizado.
- Smoke temprano de Lite/h1d devolvió `409 DISPATCH_OUTCOME_UNKNOWN`; no se encontraron runs nuevos desde 2026-10-27 04:00 UTC en la inspección descrita. Evidencia fuerte, no absoluta, de que no se creó un run por ese intento.

### Hallazgos y bloqueos
1. **No usar `GET /api/run`:** `src/routes/api/run.ts` llama a `trigger()` y puede despachar un workflow. Sigue pendiente desactivarlo/restringirlo.
2. **D1 BLOCKED:** falta recuperación de solo lectura por `Idempotency-Key` cuando un POST falla antes de devolver `idempotency_id/status_url`. No reintentar ciegamente ni repetir POST para recuperar estado.
3. **D2 pendiente:** requiere una clave de prueba que el responsable haya revocado deliberadamente; nunca revocar la clave activa de producción para esta prueba.
4. **D3–D5 pendientes:** distinguir rechazos definitivos de estados inciertos y probar asociación del HTTP 204 con un run real. D5 necesita un 204 real.
5. **E2/E3 pendientes:** dependen de B3/B5. E5 requiere revisar respuestas reales del GPT configurado para asegurar que no muestre claves.
6. `certification-runner.yml` de Lite ejecuta el workflow también con `dry_run=true`; `both` puede crear dos runs. El uso de `requested_sha` como `ref` puede dar 422 si se envía un SHA en lugar de rama/tag; esta hipótesis aún no está verificada.
7. Pendientes independientes de la ruta Compass: D-01 (auditoría de Supabase) y D-04 (smoke dispatch-only, sujeto a D-01), además de D-02/D-03/D-05/D-06/D-07 en la hoja de ruta histórica. No asumir que Supabase es el backend de Compass.

### Decisiones vigentes
- El responsable confirmó que se puede continuar con Fase 2 y que el presupuesto anterior de máximo 3 runs de runner + 1 de gate ya no es un límite operativo, dado que Lite y Plus son públicos y no tienen el límite de minutos que motivó la restricción. Registrar todos los runs reales y verificar conteos antes/después; no crear runs accidentales ni lanzar pruebas no incluidas en la suite.
- Las 20 ejecuciones multi-día quedan fuera de la suite v1.1 salvo decisión posterior.
- Orden: comprobar de forma read-only el despliegue/código operativo de la corrección; luego B3; registrar `idempotency_id`, `status_url` y conteos; continuar B4/B5; ejecutar B6 con dos solicitudes concurrentes; después C1 (un runner + un gate), C2/C3; finalmente D/E según sus prerrequisitos. Ante error de red, 409 o `DISPATCH_OUTCOME_UNKNOWN`, detener reintentos y consultar estado por lectura.
- No declarar PASS global hasta completar los criterios de A–E, cero duplicados, resultados finales registrados y corrección de los hallazgos críticos.

Referencia de suite/handoff recibido en la sesión: registro de Fase 1 y plan v1.1 fechado 2026-10-27 UTC. Los hechos anteriores se preservan como historia; este corte prevalece para el estado actual de Cert Runner Compass.


## Corte actualizado — Cert Runner Compass v1.1 (2026-10-27 UTC)

> **Precedencia:** este corte actualiza el estado de la ruta ejecutora implementada como Cert Runner Compass. Corrige las frases históricas que indiquen que todavía no existe Bridge implementado. No cierra la certificación global ni sustituye la auditoría independiente de Supabase/D-01.

- **Estado:** OPEN / NO CERTIFICADO. Fase 1: 9/9 OK sin runs (A1–A6, B1, B2a/B2b). E1 y E4 se aprobaron en simulación, sin enviar solicitudes. Total descriptivo: 11 comprobaciones/simulaciones aprobadas de ~20; no equivale a certificación.
- **Arquitectura:** GPT/LLM → Cert Runner Compass (Lovable, proyecto `57b9141d-9f69-4fef-9b7f-0f81f2eaec2f`, `X-Bridge-Key` + `Idempotency-Key`) → GitHub Actions. Persistencia Compass en Lovable Cloud, **no** en Supabase `oqlzftercvraprnvjifo`. La API Render `precision-lab-readonly-api` es separada, GET-only y usa `X-API-Key`; no despacha workflows.
- **Correcciones reportadas:** commit `7b6ccae9` (idempotencia durable, 27 pruebas) y `f051a4b1` (HTTP 204: localizar/asociar run; 401/403/404/422 como `GITHUB_DISPATCH_REJECTED_<status>`; red/timeout/5xx como `DISPATCH_OUTCOME_UNKNOWN`, 30 pruebas). El responsable dice que está desplegado; verificación independiente pendiente.
- **Línea base histórica:** Lite tenía 26 runs antes y después de Fase 1. Último run previo citado: `40429625526`, push, success, 2026-10-27 00:57 UTC. No tratar el número 26 como conteo actual garantizado. Smoke temprano Lite/h1d: `409 DISPATCH_OUTCOME_UNKNOWN`; no se observaron runs nuevos desde 04:00 UTC en esa revisión (evidencia fuerte, no absoluta).
- **Bloqueos:** no usar `GET /api/run` (puede despachar); desactivarlo/restringirlo sigue pendiente. D1: falta lookup read-only por `Idempotency-Key` si el POST falla antes de devolver ID/URL. D2 requiere clave de prueba deliberadamente revocada. D3–D5 pendientes; D5 requiere HTTP 204 real. E2/E3 dependen de B3/B5; E5 exige revisar respuestas reales del GPT. Pendiente leer runner YAML de Plus y el origen de `defaultBranch`. El runner de Lite ejecuta incluso con `dry_run=true`; `both` puede generar dos runs; SHA usado como ref puede dar 422, hipótesis aún no verificada.
- **Decisión del responsable (2026-10-27):** continuar Fase 2; el tope previo de 3 runs runner + 1 gate queda sustituido como límite operativo porque los repositorios son públicos y sin ese límite. Aun así, contar runs pre/post y evitar dispatches accidentales/duplicados. Las 20 ejecuciones multi-día siguen fuera de v1.1.
- **Secuencia:** verificación read-only del despliegue de `f051a4b1` o posterior; después B3 (un POST controlado, registrar `idempotency_id`, `status_url` y conteos), B4/B5, B6, C1 (un runner + un gate), C2/C3 y luego D/E según prerrequisitos. Ante 409, error de red o `DISPATCH_OUTCOME_UNKNOWN`, no reenviar; consultar estado por lectura. No declarar certificación hasta cerrar criterios A–E y registrar estados finales.
- **Claves:** las expuestas previamente se consideran comprometidas y deben rotarse por el responsable. No escribir ni repetir valores reales.

La suite v1.1 y el registro de Fase 1 recibidos el 2026-10-27 UTC son la base de este corte. Los registros previos permanecen como historia; este addendum prevalece para el estado actual de Compass.
