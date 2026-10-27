# Hoja de ruta — Certificación de mecanismos alternativos de conexión a GitHub

**ID:** PL-CONN-GH-ALT-P0 · **Prioridad:** P0 antes de motores matemáticos · **Estado inicial:** BLOCKED · **Salida:** evidencia reproducible de `Push → API → Bridge → Runner → resultado verificable`.

## Reglas de alcance
GitHub es fuente de verdad. La API desplegada es read-only; no añadir dispatch ni escritura a ella. Diseñar o identificar un Bridge/ejecutor separado con allowlist, auth, control de SHA, idempotencia y auditoría. Sin commits artificiales, `[skip ci]`, gates repetidos ni cargas extremas en producción. No marcar PASS si algún eslabón o la persistencia no se pueden confirmar. Restaurar Supabase puede generar cargos; confirmar autorización primero. La certificación matemática general no se reanuda hasta aprobar Fase 8; solo se permite arreglar un defecto matemático que bloquee directamente la conexión, con justificación documentada.

## Estado conocido
| Componente | Evidencia actual | Estado |
|---|---|---|
| API `/healthz`, `/openapi.json` | Verificado externo 2026-10-27: 200, JSON read-only, OpenAPI 3.1 con `servers[0].url` correcto y solo GET | PASS externo sin auth |
| Auth API | Verificado externo 2026-10-27: sin clave 401 y clave incorrecta 401; positiva pendiente | Parcial: falta clave correcta |
| Estado bilateral | No se ha verificado llamada autenticada `repo=both` | No demostrado |
| Planificador | GET read-only; no inicia gates | Live no verificado |
| Render health check | `healthCheckPath` efectivo vacío, YAML declara `/healthz` | Reconciliar |
| `GITHUB_READ_TOKEN`, `SERVICE_API_KEY` | Presencia no confirmada; valores no deben divulgarse | No demostrado |
| Bridge | Sin E2E identificado | BLOCKED |
| Runner Lite/Plus | Workflows/ledger existen, pero sin E2E de la ruta completa | Parcial |
| Supabase `oqlzftercvraprnvjifo` | INACTIVE; tablas fallan por inaccesibilidad, migraciones por timeout | BLOCKED |
| Idempotencia durable | Esquema desconocido; reinicio no probado | BLOCKED |
| Resultado E2E | No hay correlación solicitud→Bridge→Runner→resultado persistido | BLOCKED |

## Fase 0 — Fuente común y continuidad
1. Leer este documento y el handoff junto al Prompt maestro.
2. Consultar HEAD real, rama canónica, bloqueos y runs de Lite/Plus; no asumir que SHA del chat sigue vigente.
3. Crear/actualizar ledger común por validación con `validation_id`, `correlation_id`, repo/rama/SHA, versión de contrato/configuración, estados por etapa, run/job IDs, resultado y siguiente paso.
4. Definir estados `BLOCKED`, `FAILED`, `RUNNING`, `SUCCEEDED`, `REPLAYED`. Solo `SUCCEEDED` con evidencia completa cuenta como validación diaria.
5. El Prompt maestro debe exigir esta ruta antes de la siguiente tarea matemática canónica.
**Aceptación:** ambos repos apuntan a los mismos documentos; otro LLM encuentra ledger y next step sin chat. No Actions para validar documentación sola.

## Fase 1 — Recuperación y auditoría de base de datos
1. Confirmar proyecto/organización e impacto de facturación; pedir autorización antes de restaurar si puede haber cargos.
2. Restaurar por mecanismo autorizado y esperar acceso estable.
3. Inspeccionar tablas/esquemas, columnas/tipos, PK/FK, índices/unique constraints, triggers, funciones, extensiones, roles/grants, RLS/policies e historial de migraciones aplicado y versionado.
4. Conciliar drift entre DB y migraciones; buscar idempotencia ya existente antes de añadir objetos.
5. Si tras 2–3 intentos no responde, detener reintentos idénticos y diagnosticar acceso/conexión o usar vía autorizada alternativa. No exponer credenciales.
**Aceptación:** inventario reproducible y decisión de reutilizar/crear. Si no se completa, BLOCKED; no DDL.

## Fase 2 — Contrato seguro de Bridge/ejecutor
1. Especificar request/response y transiciones: `validation_id`, `idempotency_key`, `correlation_id`, repo allowlisted, branch, requested SHA, tipo de validación, timestamps, estado/resultado.
2. Mantener API read-only para consulta/plan/evidencia. Separar ejecución y permisos.
3. Auditar Runner actual y decidir mecanismo autorizado para una prueba controlada; no asumir que el API existente puede despachar.
4. Rechazar repo/rama fuera de allowlist, SHA obsoleto, solicitud sin clave, payload inválido, replay conflictivo y operación no permitida.
5. Secrets solo en runtime/secret manager y permisos mínimos. No dar credenciales al LLM ni reutilizar token read-only como escritura.
**Aceptación:** contrato versionado, threat model y límites de permiso; pruebas negativas demuestran que no hay escritura en API read-only y que Bridge rechaza operaciones no autorizadas.

## Fase 3 — Idempotencia durable
1. Después de Fase 1, reutilizar tabla existente si cumple invariantes; de otro modo diseñar migración versionada.
2. Modelo lógico mínimo (nombres ilustrativos, NO ejecutar antes de inspección): `idempotency_key UNIQUE`, `validation_id`, `correlation_id`, repo/branch/requested SHA, fingerprint del request, status controlado, resultado/error no sensible, timestamps created/updated/started/finished, y enlaces/IDs a commit/PR/run/job cuando existan.
3. Claim transaccional antes del dispatch. Misma clave + misma huella devuelve estado/resultado existente. Misma clave + huella diferente devuelve conflicto. No iniciar Runner si no hay claim durable.
4. Resolver concurrencia con constraint único y lease/recuperación de RUNNING; no depender de mutex en memoria ni mantener transacción abierta durante el workflow.
5. DB en esquema privado si posible, privilegios mínimos y RLS como defensa adicional; sin grants públicos por defecto ni service-role en clientes.
6. Probar migración en entorno controlado, revisar advisors y verificar estado tras reinicio. No aplicar migraciones repetidas para iterar.
**Aceptación:** constraint único real, una sola ejecución bajo concurrencia, replay sin nuevos efectos, conflicto ante payload distinto y persistencia tras reinicio.

## Fase 4 — Verificación externa de API y auth
1. Desde fuera comprobar `/healthz` y `/openapi.json`.
2. Probar `/v1/status?repo=both`: sin clave 401; clave incorrecta 401; correcta 200 si upstream accesible o error clasificado si no. No imprimir clave.
3. Comparar repos/branch/HEAD SHA/revisión/bloqueos/runs con GitHub; probar Lite y Plus y endpoints de plan/run.
4. Confirmar planificador `action_taken=false`; jamás debe iniciar gate.
5. Conciliar healthCheckPath en Render con `/healthz`.
6. Validar permisos mínimos de GitHub read token sin mostrar valor.
7. Ejecutar `scripts/verify-live-api.ps1` desde sesión autorizada, con entrada de clave oculta.
**Aceptación:** API/OpenAPI/host coinciden; auth positiva/negativa probada; estado bilateral y plan de solo lectura verificados. /healthz por sí solo no prueba GitHub ni Bridge.

## Fase 5 — Runner y evidencia
1. Inspeccionar workflows en Lite/Plus: triggers, branch filters, permissions, concurrency, outputs, registro padre/hijo y filtros de docs; preservar regla de no usar `[skip ci]`.
2. Definir una prueba de conexión mínima, inocua y autorizada; no lanzar gates matemáticos completos para validar la herramienta.
3. Un push debe ser un cambio real necesario. Si no existe, no inventar commits; usar mecanismo de prueba autorizado documentado.
4. Correlacionar validation/correlation ID con evento GitHub, commit SHA, PR si aplica, run/job ID, conclusion, logs/artefactos y ledger.
5. Separar estados push recibido, workflow creado, job iniciado, job terminado y resultado aceptado.
6. Probar permisos denegados, SHA obsoleto, rama no autorizada y fallo de workflow en entorno controlado; no integrar código fallido.
**Aceptación:** cada eslabón tiene IDs/URLs y SHA verificables; HTTP 202 o run creado no equivalen a PASS.

## Fase 6 — E2E, replay, concurrencia y reinicio
En un entorno controlado, verificar en orden:
1. Solicitud autenticada/permitida con validation ID, idempotency key y correlation ID.
2. API valida estado y conserva read-only; Bridge crea claim durable antes de ejecutar.
3. Runner recibe exactamente un trabajo para repo/branch/SHA autorizado.
4. GitHub registra run/job; se guardan logs y resultado.
5. Bridge asocia resultado a solicitud y persiste IDs/estado.
6. Repetir igual solicitud devuelve registro existente, sin commit/PR/dispatch/run nuevo.
7. Dos solicitudes concurrentes con la misma clave producen un único trabajo.
8. Reiniciar API/Bridge entre ejecución y consulta no pierde el resultado ni duplica el trabajo.
9. Misma clave con fingerprint distinto se rechaza.
10. Simular caída/timeout de cada dependencia: estado BLOCKED/FAILED, nunca PASS.
**Aceptación:** evidencia por cada eslabón y pruebas de replay/concurrencia/reinicio.

## Fase 7 — Salvaguarda diaria y multi-LLM
1. Al comenzar sesión, cada LLM consulta API y ledger común antes de actuar.
2. Usar clave diaria determinista basada en fecha/zona acordada, configuración/versión y SHA objetivo; evitar clave permanente que impida validaciones futuras.
3. Si existe `SUCCEEDED` completo del mismo HEAD/config, reutilizarlo.
4. Si no existe, un único cliente adquiere claim durable; otros esperan/leen registro.
5. Si cambia HEAD/config, decidir si la evidencia sigue siendo equivalente; registrar nueva validación solo si necesaria/autorizada.
6. Guardar hora UTC, repos/rama/SHA, versiones, validation/correlation IDs, hash seguro de idempotency key, run/job IDs, resultados y bloqueos.
7. No automatizar commits artificiales ni acciones de escritura sin autorización.
**Aceptación:** varias sesiones/LLMs comparten estado y solo una ejecución diaria concurrente ocurre para la misma validación.

## Fase 8 — Checklist de certificación
- [ ] Consulta: estado bilateral, SHA, bloqueos y runs actuales.
- [ ] Auth: ausente/incorrecta rechazada; correcta probada; secretos no expuestos.
- [ ] Documentación: cambios docs no disparan gates innecesarios.
- [ ] Código: cambio válido genera/actualiza un solo PR cuando corresponde y activa checks pertinentes.
- [ ] Deduplicación: misma clave no crea ejecución ni commit nuevos.
- [ ] Diagnóstico: fallos clasificados/corregidos antes de repetir.
- [ ] Integración: solo integrar tras aceptación.
- [ ] Continuidad: nueva sesión determina siguiente paso sin chat.
- [ ] Seguridad: operación no autorizada, SHA obsoleto y cambios fuera de política rechazados.
- [ ] Auditoría: solicitud, commit, PR, run, SHA y resultado correlacionados.
- [ ] Persistencia: claves/resultados sobreviven reinicio y concurrencia no duplica.
- [ ] E2E: Push→API→Bridge→Runner→resultado probado.
- [ ] Validación integral satisfactoria al menos una vez por día de trabajo, sin duplicación multi-LLM.

## Orden de ejecución
| Orden | Trabajo | Salida requerida |
|---|---|---|
| P0.1 | Autorizar/recuperar Supabase; auditar esquema/migraciones | Inventario y decisión de tabla |
| P0.2 | Definir Bridge/contrato; auditar Runner en paralelo | Contrato versionado y política |
| P0.3 | Implementar idempotencia | Migración revisada y pruebas |
| P0.4 | Verificar API/auth/health/estado bilateral | Informe externo reproducible |
| P0.5 | Probar Runner y evidencias | Run/job/SHA y logs correlacionados |
| P0.6 | Replay/concurrencia/reinicio | Evidencia durable |
| P0.7 | E2E controlado | Paquete de evidencia por etapa |
| P0.8 | Salvaguarda diaria y checklist final | PASS de conexión o bloqueos precisos |

## Evidencia obligatoria por validación
`validation_id`, `correlation_id`, hash de idempotency key, UTC, repo/branch/requested SHA/actual HEAD, versiones/configuración, estado/timestamp de API/Bridge/Runner, commit/PR si aplica, workflow/run/job IDs, logs/artefactos, resultado por etapa, reason code final y siguiente paso. No inventar commits o PR si no eran necesarios.

**Regla de cierre:** hasta que todas las casillas de Fase 8 estén demostradas, el mecanismo queda BLOCKED/FAILED y la certificación general de motores matemáticos no se reanuda.