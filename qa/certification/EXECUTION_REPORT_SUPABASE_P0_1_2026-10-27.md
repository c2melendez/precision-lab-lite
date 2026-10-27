# Informe de ejecución — P0.1 Supabase

**Fecha:** 2026-10-27 UTC  
**Objetivo:** recuperar acceso a Supabase e inspeccionar el esquema antes de diseñar persistencia de idempotencia para la conexión alternativa a GitHub.  
**Proyecto:** `oqlzftercvraprnvjifo`  
**Región:** `us-west-2`  
**Motor reportado:** PostgreSQL 17.6.1.155  
**Último estado observado:** `ACTIVE_HEALTHY`  
**Resultado P0.1:** `PARTIAL — proyecto accesible e inventario inicial completado; quedan validaciones y decisión de esquema`

## Acciones realizadas

1. Consulté metadatos y confirmé inicialmente `INACTIVE`.
2. Tras autorización explícita del usuario para restaurar aun con posible reanudación de cargos, ejecuté la restauración; herramienta respondió `success: true`.
3. En una primera consulta, el estado era `COMING_UP` y la base no estaba accesible.
4. En una consulta posterior, el proyecto reportó `ACTIVE_HEALTHY`.
5. Inspeccioné las tablas de `public` con columnas y claves.
6. Consulté el historial de migraciones: lista vacía (`migrations: []`).
7. Consulté en modo lectura restricciones, índices, políticas RLS, triggers, funciones y permisos de tabla.
8. Ejecuté el asesor de seguridad de Supabase y consulté las Edge Functions.

## Inventario observado

### Tablas del esquema `public`

- `public.calls`: 0 filas reportadas; clave primaria `id` (text); RLS habilitado.
- `public.history`: 0 filas reportadas; clave primaria `project_id` (text); RLS habilitado.
- No se identificó ninguna tabla obvia para ledger de idempotencia de eventos GitHub.
- Índices visibles: solo los índices únicos de las claves primarias `calls_pkey` y `history_pkey`.
- Historial de migraciones devuelto por la herramienta: vacío. Esto no demuestra por sí solo que no existan cambios manuales o drift de esquema.

### Políticas y permisos — hallazgo de seguridad importante

Las dos tablas tienen políticas RLS con rol `public` que permiten `SELECT`, `INSERT` y `UPDATE` sin restricciones de fila (`USING true` / `WITH CHECK true`). También se observan privilegios de tabla para los roles `anon` y `authenticated`, incluidos `DELETE`, `TRUNCATE` y otros privilegios. Las tablas están vacías según el inventario, pero esta combinación permite acceso amplio si las tablas están expuestas por la Data API.

**No se modificaron estas políticas ni los permisos.** Antes de endurecerlos, confirmar si las tablas sirven a otra aplicación o flujo existente y revisar la configuración de exposición de Data API. Este hallazgo no debe ignorarse en una certificación de seguridad.

### Función y triggers

- Función: `public.set_updated_at()`, función trigger que actualiza `updated_at`.
- Triggers: `trg_calls_updated_at` y `trg_history_updated_at`, ambos en UPDATE.
- El asesor de seguridad reportó WARN `function_search_path_mutable` para `public.set_updated_at`, porque no fija `search_path`.
- No se modificó la función ni los triggers.
- Edge Functions listadas: ninguna.

## Límites y cambios

- Restauración solicitada y aceptada por la herramienta: sí.
- Estado `ACTIVE_HEALTHY` confirmado: sí, en consulta posterior.
- Inventario inicial de tablas/columnas/PK: sí, solo esquema `public`.
- Historial de migraciones consultado: sí; lista vacía.
- Inventario de constraints, índices, políticas, triggers y funciones: sí, en modo lectura.
- DDL o migraciones ejecutadas: no.
- RLS, índices, funciones, triggers o grants modificados: no.
- Datos de usuario modificados: no.
- Costo real de la reactivación confirmado: no.

## Decisión técnica

No crear aún una tabla de idempotencia. La inspección inicial no encontró una tabla que parezca cumplir esa función, pero antes de diseñar DDL hay que confirmar el contrato real del API/Bridge, inspeccionar los esquemas adicionales relevantes y revisar la arquitectura de permisos. La forma de la tabla y sus campos sigue sin estar aprobada.

## Siguientes pasos obligatorios

1. Revisar si hay esquemas adicionales relevantes y obtener el inventario completo de migraciones desde la fuente de control de versiones, ya que la lista de Supabase está vacía.
2. Inspeccionar el contrato del API/Bridge y definir la clave de idempotencia, alcance, retención, estados, política de reintentos y comportamiento concurrente.
3. Investigar y planificar la corrección de permisos/RLS de `calls` y `history` sin romper el flujo que actualmente las usa.
4. Corregir la advertencia de `search_path` solo mediante cambio revisado y probado, no de forma improvisada.
5. Diseñar una migración versionada y revisable para persistencia de idempotencia; aplicarla únicamente después de revisar y aprobar el plan.
6. Probar persistencia, replay, concurrencia y reinicio del Bridge/Runner antes de certificar.

## Estado global de certificación

La certificación de conexión alternativa a GitHub permanece `BLOCKED`. No hay evidencia de E2E completo `Push → API → Bridge → Runner → resultado verificable`, ni de persistencia idempotente validada. La certificación general de motores matemáticos sigue pausada según la prioridad P0.

## Seguridad y control de ejecución

No solicitar ni incluir credenciales, tokens, claves ni cadenas de conexión en este informe. No activar dispatches de Actions, no crear commits artificiales para disparar workflows y no declarar PASS sin evidencia verificable.


## Cruce adicional de esquema y Runner — 2026-10-27 UTC

### Esquemas de Supabase y migraciones

- Se amplió la inspección de catálogo a esquemas no gestionados por Supabase. El resultado de `pg_tables` solo muestra objetos de aplicación en `public`: `calls` y `history`. No apareció otro esquema/tablero de aplicación ni un ledger alternativo de idempotencia en los esquemas consultados.
- `list_migrations` sigue devolviendo una lista vacía. Las rutas estándar `supabase/config.toml` y `supabase/migrations/README.md` no existen en la rama canónica inspeccionada de Plus; no se deben interpretar estas dos rutas ausentes como prueba de que no exista SQL/migración en cualquier otra ubicación. La fuente de migraciones continúa sin reconciliarse.
- Esto confirma que no hay base observada para reutilizar `public.calls` o `public.history` como ledger de validaciones. No se ejecutó DDL ni se cambió ningún permiso.

### Runner y contrato del Bridge

- La auditoría estática de `.github/workflows/certification-runner.yml` confirma que `workflow_dispatch` acepta `target_repo`, `gate` y `dry_run`; el valor predeterminado es `dry_run=true`. Solo la ejecución explícita con `dry_run=false` despacha un gate y escribe `qa/certification/runner/<run_id>.json`.
- El evento `push` solo calcula la huella; no despacha un gate. El Runner tiene permisos de workflow `contents: write` y `actions: write`, por lo que el Bridge debe despachar exclusivamente el workflow permitido por un mapa cerrado y no ofrecer parámetros de workflow al cliente.
- El Runner hace checkout de la rama canónica y registra `BASE_SHA` del checkout real. Por eso, para certificar que se ejecutó sobre el SHA solicitado, el Bridge debe contrastar el SHA solicitado con el `base_sha` del registro `runner/<id>.json` y con el run del gate; `head_sha` del evento del Runner, por sí solo, no basta para demostrar qué SHA se testeó si la rama avanzó entre despacho y checkout.
- El Runner publica el registro JSON al terminar, moviendo el HEAD de la rama. El Bridge debe guardar por separado `requested_sha`, `base_sha`/SHA realmente testeado y `actual_head_sha` posterior al registro. No tratar el nuevo HEAD generado por el registro como deriva del producto ni como equivalencia automática del SHA validado.
- La API `precision-lab-readonly-api` se mantiene exclusivamente GET y sin capacidad de escritura. No se añadió endpoint ni se compartieron credenciales.

### Estado y siguiente paso

P0.1 permanece parcial: la auditoría de objetos de aplicación no encontró un almacén de idempotencia existente; la fuente de migraciones y la exposición efectiva de Data API siguen pendientes. Antes de DDL, cerrar el contrato de persistencia y verificar cómo se accede a Supabase. P0.2 sigue DRAFT: reforzar explícitamente la prueba de SHA ejecutado con el `base_sha` del registro del Runner. Global `OPEN`; E2E no demostrado; sin nuevas Actions.
