# Decisión de arquitectura de persistencia del Bridge — 2026-10-27

**Estado:** decisión de diseño autorizada; implementación y certificación pendientes.  
**Ámbito:** persistencia del Bridge para `Push → API read-only → Bridge → GitHub Actions Runner → resultado verificable`.

## Decisión

No borrar, renombrar ni reutilizar `public.calls` ni `public.history` para el Bridge. El proyecto Supabase actual (`oqlzftercvraprnvjifo`) puede usarse como candidato **solo mediante un esquema privado dedicado** a certificación, separado de las tablas existentes. No se ha demostrado que las tablas existentes estén libres de consumidores externos; por tanto, no se revocan sus permisos ni se alteran sus políticas en esta decisión.

Si el inventario de consumidores, la exposición de Data API o las condiciones de aislamiento no se pueden verificar, la alternativa es provisionar una base/proyecto dedicado, después de confirmar la organización y cualquier coste recurrente. No eliminar el proyecto actual como parte de esta decisión.

## Modelo mínimo de permisos requerido

- El Bridge accede al almacén con una identidad de base de datos dedicada; no usa credenciales en clientes, LLM, logs ni respuestas.
- Esquema privado no expuesto por Data API; sin grants a `anon`, `authenticated` ni `PUBLIC`.
- Conceder al rol del Bridge únicamente `USAGE` en el esquema y los privilegios DML necesarios sobre tablas específicas del ledger. No conceder `CREATE` en el esquema al runtime del Bridge.
- El rol de migración/administración se mantiene separado del rol de runtime.
- RLS se configura como defensa adicional según el modelo de acceso; no se considera sustituto de los grants mínimos.
- No usar `public.calls` ni `public.history` para claves de idempotencia, claims, estado ni auditoría del Bridge.
- Los secretos se guardan en el gestor de secretos del servicio Bridge. La API read-only conserva solo sus permisos de lectura de GitHub y no recibe permisos de escritura ni conexión de base de datos.
- La persistencia debe tener restricción única sobre el hash de idempotencia y claim transaccional antes del dispatch. No guardar claves de idempotencia en claro.

## Límites y estado

- Esta decisión no prueba que el proyecto Supabase actual sea el backend correcto; lo designa como candidato condicionado a aislamiento.
- No se ha creado esquema, tabla, rol ni migración. No se han cambiado grants/RLS ni se han lanzado GitHub Actions.
- Antes del DDL: verificar la exposición efectiva de Data API, completar el inventario disponible de esquemas/roles/consumidores, definir el rol runtime y migración versionada, revisar el contrato del Bridge (sigue DRAFT) y preparar rollback.
- Antes de cambiar permisos de `public.calls`/`public.history`, obtener evidencia de consumidores o aislarlos de forma independiente; no hacer cambios destructivos por suposiciones.
- No declarar P0.1 ni la conexión E2E como PASS hasta probar permisos, claim concurrente, replay, conflicto, recuperación tras reinicio y correlación real con Runner/gate.

## Próximo paso verificable

Completar el inventario de seguridad (Data API exposure, roles/grants, políticas, consumidores/configuración fuera de los repos inspeccionados y coste del proyecto); después proponer una migración versionada para un esquema privado dedicado y validar sus privilegios efectivos antes de implementar el Bridge. No ejecutar gates matemáticos para esta tarea documental.
