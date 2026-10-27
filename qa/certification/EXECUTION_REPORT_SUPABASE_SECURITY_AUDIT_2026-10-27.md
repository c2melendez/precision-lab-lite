# Informe de auditoría de seguridad de persistencia P0.1 — 2026-10-27 (continuación)

## Alcance de esta continuación

Lectura de catálogo PostgreSQL, grants, roles, tablas, historial de migraciones, asesor de seguridad y logs recientes del proyecto Supabase `oqlzftercvraprnvjifo`. No se ejecutó DDL, no se cambiaron permisos/políticas, no se modificaron datos y no se lanzaron GitHub Actions.

## Hallazgos verificados

1. Proyecto `ACTIVE_HEALTHY`, PostgreSQL 17.6.1.155, región `us-west-2`.
2. `public.calls` y `public.history` existen, ambas tienen RLS habilitado y 0 filas observadas en el inventario. Las políticas existentes permiten SELECT/INSERT/UPDATE con condiciones `true`; las tablas tienen grants amplios a `anon` y `authenticated`, incluidos INSERT, SELECT, UPDATE, DELETE, TRUNCATE, REFERENCES y TRIGGER. Esto es una configuración de alto riesgo si las tablas están expuestas a esos roles por la Data API.
3. El ACL del esquema `public` concede USAGE a `anon`, `authenticated` y `service_role`; los privilegios de tablas se conceden además directamente. RLS no sustituye a los grants SQL.
4. No se encontraron roles específicos con nombre relacionado con Bridge en la consulta de roles revisada. El rol `service_role` tiene `BYPASSRLS`; no debe usarse como identidad de mínimo privilegio para el Bridge.
5. El historial de migraciones gestionado por Supabase sigue vacío. Esto no descarta DDL manual ni cambios fuera de migraciones.
6. El asesor de seguridad mantiene `function_search_path_mutable` para `public.set_updated_at`; no se modificó porque la función pertenece al esquema existente y su impacto debe revisarse aparte.
7. Los logs consultados solo cubren la ventana reciente disponible. Se observaron mensajes de carga de caché de esquema y terminación/reinicio de PostgREST, no evidencia suficiente para identificar consumidores de `calls`/`history`. La ausencia de consultas en esa ventana no demuestra que no haya consumidores.
8. La API de consulta del repositorio sigue sin referencia de código a Supabase ni `DATABASE_URL`. No hay evidencia de que el proyecto actual esté conectado al Bridge.
9. La configuración efectiva de esquemas expuestos por la Data API no puede confirmarse con el resultado de `get_project` o con el catálogo SQL consultado. Requiere revisar la configuración de API del Dashboard/Management API o una prueba HTTP controlada con claves autorizadas. Por tanto, no se afirma que las tablas sean accesibles externamente.

## Decisión de seguridad

No tocar `public.calls`/`public.history` ni los permisos actuales hasta entender sus consumidores. El Bridge deberá usar un esquema privado dedicado, no expuesto por Data API, con rol de runtime separado y permisos limitados a las tablas del ledger. No usar `service_role`, `postgres` ni credenciales de administrador en el runtime. Si no puede verificarse aislamiento en este proyecto, seleccionar un proyecto/base dedicada después de revisar organización y coste.

## Bloqueos y próximo paso

P0.1 permanece **BLOCKED**. Antes de DDL:
- verificar configuración efectiva de Data API (esquemas expuestos y funciones expuestas);
- revisar si hay consumidores externos conocidos y la configuración de aplicaciones conectadas fuera de los repos inspeccionados;
- elegir el patrón de acceso del Bridge (conexión PostgreSQL privada/credencial de rol dedicado frente a un servicio intermediario), sin usar claves privilegiadas en clientes;
- versionar migración y plan de rollback; separar rol de migración de rol de runtime;
- comprobar permisos efectivos con `has_schema_privilege`/`has_table_privilege` y prueba negativa para `anon`/`authenticated`, sin tocar tablas existentes.

No ejecutar gates matemáticos ni repetir workflows verdes para esta auditoría documental. Certificación global OPEN.
