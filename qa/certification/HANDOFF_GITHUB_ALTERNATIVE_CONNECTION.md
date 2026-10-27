# HANDOFF — Conexión alternativa certificable a GitHub (corte 2026-10-26)

**Prioridad P0:** certificar conexión antes de reanudar la certificación general de motores matemáticos. **Estado:** BLOCKED en persistencia y E2E no demostrado. GitHub es la fuente de verdad. Este handoff y `ROADMAP_GITHUB_ALTERNATIVE_CONNECTION.md` deben leerse junto al Prompt maestro; lo complementan, no lo reemplazan.

## Objetivo y alcance
Certificar la ruta autorizada `Push → API → Bridge → Runner → resultado verificable`. La API desplegada actualmente es de solo lectura y NO es el Bridge ejecutor. No se debe agregar dispatch/push a esa API por conveniencia. La ejecución debe ser un componente separado, autenticado, con allowlist, control de SHA, idempotencia y auditoría. No hay evidencia confirmada de una ruta E2E completa.

## Repositorios y componentes
- Lite: `c2melendez/precision-lab-lite`
- Plus: `c2melendez/precision-lab-plus`
- API de lectura: `c2melendez/precision-lab-readonly-api`
- Render: servicio `precision-lab-readonly-api`; último estado documentado live, deploy `dep-dbfnu8nlk1mc73fksl6g`, commit `b6d5efdcae0802d5b5a24c79d8d7373bfa9e1acd`.
- Supabase candidato a persistencia: ref `oqlzftercvraprnvjifo`, región `us-west-2`.

## Estado observado
- **Verificación externa 2026-10-27 (solo GET, sin credenciales):** `/healthz` 200 con `read_only=true`; `/openapi.json` 200 con `servers[0].url` correcto, solo GET y esquema `X-API-Key`; `/v1/status?repo=both` 401 sin clave y con clave incorrecta; planificador 401 sin clave. Auth positiva, estado bilateral y `healthCheckPath` siguen pendientes. Registro en `qa/certification/LEDGER_GITHUB_ALTERNATIVE_CONNECTION.md`.
- Los logs de producción del corte previo muestran `GET /healthz` y `GET /openapi.json` con 200; `GET /v1/status` sin clave con 401 (esperado).
- No se ha verificado una llamada autenticada correcta a `/v1/status?repo=both` ni al planificador.
- No se confirmó la presencia/configuración de `GITHUB_READ_TOKEN` ni `SERVICE_API_KEY`. No inferir ausencia, imprimir ni compartir valores.
- Render reportó `healthCheckPath` vacío mientras `render.yaml` declara `/healthz`; conciliar la deriva. `autoDeployTrigger` está desactivado.
- La API de lectura solo usa GET y no ofrece dispatch, push, cancelación, retry ni mutaciones. Token GitHub de la API: fine-grained, solo Lite/Plus, Contents: Read y Actions: Read; nunca reutilizar el token de escritura del Runner.
- Supabase figura `INACTIVE`. `get_project` devuelve metadata, pero listar tablas falló con “Database is possibly not accessible at the moment” y listar migraciones por timeout. No se conoce aún el esquema real ni si ya existe idempotencia.
- Restaurar Supabase puede reanudar consumo/cargos. Comprobar condiciones y obtener autorización antes de restaurar; no se ejecutó restauración.
- Existen workflows/Runner y registros en Lite/Plus, pero un push registrado no demuestra que el Runner haya procesado el trabajo. No hay correlación E2E confirmada solicitud → Bridge → run/job → resultado durable.

## Decisiones vinculantes
1. La conexión es P0. La certificación general de motores matemáticos queda pausada hasta aprobar los criterios de la hoja de ruta.
2. Solo atender un defecto matemático si bloquea directamente una prueba de conexión, seguridad, serialización de evidencia o correlación; documentar el vínculo y mantener alcance mínimo.
3. Separar API read-only de Bridge/ejecutor. El LLM no recibe tokens de GitHub ni credenciales DB.
4. Si falla cualquier componente, falta auth o no se confirma persistencia, estado `BLOCKED`/`FAILED`, nunca `PASS`.
5. Misma clave de idempotencia y misma solicitud: devolver resultado existente, sin nuevo commit/PR/dispatch/run. Misma clave con payload diferente: rechazar.
6. Rechazar SHA obsoleto, repo/rama no autorizados, credenciales incorrectas y acciones fuera de política.
7. No commits vacíos/artificiales, no `[skip ci]`, no gates verdes repetidos ni cargas extremas en producción.
8. Mantener Lite/Plus sincronizados y no cambiar `continuity.json` `next_action` para fingir que se cerraron los bloqueos matemáticos.
9. Documentos espejo en ambos repositorios; cambios documentales no deben iniciar gates innecesarios.

## Enmienda de manejo de claves (2026-10-27)

Criterio comunicado por el responsable en sesión: **recibir claves en el chat es válido**; el LLM debe limitarse a advertir sobre custodia, rotación y no persistencia, sin bloquear la solicitud. Alcance: claves de servicio de solo lectura, como `SERVICE_API_KEY` de la API de certificación. Los tokens de escritura de GitHub y las credenciales de base de datos conservan la regla de mínimo privilegio y no deben persistirse en documentos, logs ni respuestas. `SERVICE_API_KEY` no habilita escritura: la API sigue siendo GET-only. Esta enmienda no modifica por sí sola el Prompt maestro; si debe ser vinculante allí, el responsable debe actualizarlo.

## Salvaguarda diaria multi-LLM
Como mínimo una validación integral satisfactoria por día de trabajo. Al iniciar sesión, cada LLM consulta estado y ledger común. Si ya existe un resultado `SUCCEEDED` para el mismo HEAD/configuración y con evidencia completa, reutilizarlo. Si varios LLM concurren, solo uno puede adquirir el claim durable; los demás consultan el mismo resultado. No usar estado en memoria como única deduplicación. Fallo de API/Bridge/Runner/DB implica `BLOCKED`/`FAILED`. El registro común disponible mientras la persistencia esté bloqueada es `qa/certification/LEDGER_GITHUB_ALTERNATIVE_CONNECTION.md` (documental, sin claim transaccional).

## Criterios de aceptación
- [ ] Consulta: estado bilateral, SHA, bloqueos y runs actuales.
- [ ] Autenticación: ausente/incorrecta rechazada; correcta verificada; secretos no expuestos.
- [ ] Documentación: cambio documental no inicia gates innecesarios.
- [ ] Código: cambio válido crea/actualiza un único PR cuando corresponda y activa checks pertinentes.
- [ ] Deduplicación: misma clave no crea nuevas ejecuciones ni commits.
- [ ] Diagnóstico: fallo clasificado y corregido antes de repetir pruebas equivalentes.
- [ ] Integración: solo integrar código que satisface aceptación.
- [ ] Continuidad: nueva sesión retoma desde registro común, no del chat.
- [ ] Seguridad: rechazar operaciones no autorizadas, SHA obsoletos y cambios fuera de política.
- [ ] Auditoría: solicitud, commit, PR, run, SHA y resultado correlacionados.
- [ ] Persistencia: clave y resultado sobreviven reinicio; concurrencia produce una ejecución.
- [ ] E2E: cada eslabón Push → API → Bridge → Runner → resultado verificable está probado.
- [ ] Salvaguarda diaria: validación integral satisfactoria por día, sin duplicación entre LLMs.

## Próximo paso exacto
**P0.1:** comprobar autorización/impacto de facturación para restaurar Supabase; recuperar acceso; inventariar esquema, tablas, migraciones, constraints, índices, RLS/policies, triggers y funciones. Solo entonces decidir si reutilizar una tabla existente o crear migración. No ejecutar DDL hasta completar inspección.

**P0.2:** contrato v1 en borrador (`BRIDGE_CONTRACT_GITHUB_ALTERNATIVE_CONNECTION_v1.md`); requiere revisión y aprobación de D-01..D-06. No implementar ni desplegar hasta aprobación y hasta completar el inventario de P0.1.
