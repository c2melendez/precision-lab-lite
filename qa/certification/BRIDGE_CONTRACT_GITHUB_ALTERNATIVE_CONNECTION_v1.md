# Contrato del Bridge de certificación — v1 (DRAFT)

**ID:** PL-CONN-GH-BRIDGE-CONTRACT-v1
**Estado:** DRAFT — no aprobado, no implementado, no ejecutado
**Fecha:** 2026-10-27 UTC
**Prioridad:** P0 (subordinada a `ROADMAP_GITHUB_ALTERNATIVE_CONNECTION.md`)
**Dependencias:** P0.1 (persistencia durable) para el claim transaccional; el resto del contrato puede implementarse con un almacén intercambiable.
**Ámbito:** `c2melendez/precision-lab-lite` y `c2melendez/precision-lab-plus`, rama canónica resuelta desde `qa/certification/README.md` de la rama predeterminada.

**Contexto P0.1 (2026-10-27):** Supabase `oqlzftercvraprnvjifo` se restauró y quedó `ACTIVE_HEALTHY`; el inventario inicial solo encontró `public.calls` y `public.history` (ambas vacías, RLS habilitado con políticas permisivas para `public` y grants amplios a `anon`/`authenticated`), historial de migraciones vacío y ninguna tabla de idempotencia. Ese inventario es **parcial** y no lo re-verifica este documento. Fuente: `EXECUTION_REPORT_SUPABASE_P0_1_2026-10-27.md`.

> Este documento define el contrato del componente que falta en la ruta `Push → API → Bridge → Runner → resultado verificable`. No modifica la API read-only, no aprueba el uso de `SERVICE_API_KEY` como credencial de escritura y no crea esquema en base de datos.

## 1. Objetivo y no-objetivos

**Objetivo.** Recibir una solicitud de validación autenticada, reclamarla de forma idempotente, despachar exactamente un workflow del Runner sobre un repo/rama/SHA previamente autorizado, seguir su ejecución y persistir la evidencia correlacionada.

**No-objetivos.**

- No decide certificación matemática ni convierte un `success` de Actions en `PASS`.
- No ejecuta trabajos dentro del Bridge: el trabajo corre en GitHub Actions.
- No escribe código de producto, no crea commits de producto y no hace merge.
- No expone ni reenvía tokens de GitHub a clientes.
- No sustituye a la API read-only; la API sigue siendo el canal de consulta.
- No implementa cancelación, retry manual ni dispatch arbitrario en v1.

## 2. Frontera de componentes

```
Cliente autorizado
      │  POST /v1/validations (X-Bridge-Key)
      ▼
Bridge de certificación (servicio separado)
      │  claim durable (transaccional)
      │  verificación de allowlist + SHA actual
      ▼
GitHub Actions API  ── workflow_dispatch ──►  Certification Runner v2
      ▲                                             │
      │  GET runs/jobs (polling acotado)             │ despacha el gate
      └──────────────────────────────────────────────┘
                                                    ▼
                                          Gate seleccionado (cumulative/h1d/...)
                                                    │
                                                    ▼
                                    Registro `qa/certification/runner/<id>.json`
```

| Componente | Credencial | Puede | No puede |
|---|---|---|---|
| API read-only | `GITHUB_READ_TOKEN` (Contents: Read, Actions: Read) | Consultar estado, planificar, leer runs | Despachar, escribir, cancelar |
| Bridge | Token fine-grained propio: `Actions: write` + `Metadata: read` en Lite/Plus | Despachar el workflow del mapa versionado y leer runs | Leer contenidos, escribir ramas, crear PR, mutar producto |
| Runner (Actions) | `secrets.GH_TOKEN` | Despachar el gate y publicar el registro en `runner/` | Recibir solicitudes externas directas |
| Cliente | `X-Bridge-Key` | Solicitar y consultar validaciones | Elegir workflow, token o destino arbitrario |

**Regla de separación:** el token del Bridge nunca se reutiliza como token de lectura de la API, ni como `GH_TOKEN` del Runner, ni se entrega al cliente o al LLM.

## 3. Actores y autenticación

| Actor | Autenticación | Autorización |
|---|---|---|
| Operador humano | Cliente con `X-Bridge-Key` emitida por operador | Repos permitidos y cupo diario |
| Automatización autorizada | `X-Bridge-Key` + `X-Client-Id` | Igual, con cupo propio |
| Consulta de estado | `X-Bridge-Key` de solo lectura | Lectura de sus propias validaciones |
| Operador de recuperación | Clave de operación separada | Reconciliar `UNKNOWN_DISPATCH`; nunca saltar el claim |

Requisitos:

1. Claves de al menos 256 bits, almacenadas como hash (Argon2id o SHA-256 con sal por clave) y comparadas en tiempo constante.
2. `X-Client-Id` obligatorio; el par (cliente, clave) se resuelve contra un registro de claves activas con fecha de expiración y rotación.
3. Límite de tasa por cliente (por defecto 10 solicitudes/minuto) y límite global de validaciones activas (por defecto 1 por repositorio).
4. Las claves no se aceptan en query string, logs, mensajes de error ni trazas.
5. Rotación documentada: emitir nueva clave, solapar 24 h, revocar la anterior. Una clave revocada devuelve `401` y se audita.

## 4. Modelo lógico de persistencia (sin DDL)

Nombres ilustrativos. **No se ejecuta DDL hasta completar P0.1** y decidir si se reutiliza una tabla existente.

Con el inventario parcial de P0.1: `public.calls` (PK `id`) y `public.history` (PK `project_id`) son tablas de producto, no un ledger de eventos GitHub; **no se reutilizan** para idempotencia sin un análisis que lo justifique. El candidato preferente es un esquema privado nuevo (por ejemplo `certification`), con tabla dedicada, RLS y sin grants a `anon`/`authenticated`, sujeto a migración versionada y revisión.

| Campo | Tipo lógico | Invariante |
|---|---|---|
| `validation_id` | texto opaco | Único; generado por el Bridge (`VAL-...`), nunca reutilizado |
| `idempotency_key_hash` | hash | `UNIQUE`; nunca se guarda la clave en claro |
| `request_fingerprint` | hash SHA-256 | Huella canónica del payload sin la clave de idempotencia |
| `client_id` | texto | Clave foránea lógica al registro de clientes |
| `repo`, `branch` | texto | Deben pertenecer a la allowlist y a la rama canónica vigente |
| `requested_sha` | SHA-1 40 hex | Debe ser el HEAD de la rama canónica en el momento del claim |
| `gate` | enum cerrado | `cumulative`, `h1d`, `security` (Lite), `runner_smoke` (cuando exista) |
| `status` | enum cerrado | Ver §5 |
| `reason_code` | enum cerrado | Ver §7 |
| `runner_run_id`, `gate_run_id` | entero | Nulos hasta que existan; nunca inventados |
| `actual_head_sha` | SHA-1 | HEAD observado tras el despacho y al cerrar |
| `evidence_ref` | texto | Ruta/URL del registro del Runner y artefactos |
| `created_at`, `updated_at`, `claimed_at`, `lease_expires_at`, `finished_at` | timestamp UTC | Monótonos y con zona |
| `attempt` | entero | Empieza en 1; incrementa solo tras reconciliación explícita |

**Invariantes globales.**

- `status` y `reason_code` solo toman valores del contrato; cualquier otro valor es error interno y bloquea la respuesta como `FAILED`.
- El resultado persistido no contiene secretos, tokens, cabeceras de autenticación ni cuerpos completos de logs.
- Un `validation_id` no cambia de `repo`, `branch`, `requested_sha`, `gate` ni `request_fingerprint` después del claim.

## 5. Máquina de estados

| Estado | Significado | Transiciones permitidas |
|---|---|---|
| `RECEIVED` | Solicitud validada sintácticamente, sin claim | `CLAIMED`, `REJECTED` |
| `CLAIMED` | Claim durable adquirido; aún no se despachó | `DISPATCHING`, `BLOCKED`, `EXPIRED` |
| `DISPATCHING` | Llamada de dispatch en curso o de resultado ambiguo | `QUEUED`, `UNKNOWN_DISPATCH`, `BLOCKED` |
| `QUEUED` | Run identificado y aún no iniciado | `RUNNING`, `BLOCKED`, `EXPIRED` |
| `RUNNING` | Run en ejecución | `COMPLETED`, `BLOCKED`, `EXPIRED` |
| `COMPLETED` | Run terminado; conclusión registrada | `EVIDENCE_RECORDED`, `FAILED` |
| `EVIDENCE_RECORDED` | Evidencia correlacionada y persistida | `SUCCEEDED`, `FAILED` |
| `UNKNOWN_DISPATCH` | No se puede confirmar si el dispatch creó un run | `QUEUED` (tras reconciliar), `BLOCKED` |
| `SUCCEEDED` | Validación ejecutada y evidencia completa | Terminal |
| `FAILED` | Ejecución o evidencia incompleta | Terminal (nueva clave para reintentar) |
| `BLOCKED` | Dependencia no disponible | Terminal para esa clave |
| `REJECTED` | Solicitud inválida o no autorizada | Terminal |
| `EXPIRED` | Deadline superado | Terminal |

Reglas:

1. El claim (`RECEIVED → CLAIMED`) es una transacción con `UNIQUE(idempotency_key_hash)`; si la inserción falla por duplicado, se lee el registro existente.
2. `QUEUED` exige `runner_run_id` **y** `gate_run_id` verificados por API, no solo un `202` de dispatch.
3. `UNKNOWN_DISPATCH` nunca se reintenta a ciegas: primero se busca un run cuyo input `reason` contenga el `correlation_id`.
4. `SUCCEEDED` exige: claim, dispatch, run de gate, conclusión, registro del Runner y correlación persistida. Cualquier eslabón ausente produce `FAILED` o `BLOCKED`, nunca `SUCCEEDED`.

## 6. API del Bridge

### 6.1 Crear validación

`POST /v1/validations`

```json
{
  "idempotency_key": "<32-256 caracteres, opaco>",
  "correlation_id": "CORR-2026-10-27-...",
  "repo": "plus",
  "branch": "qa/syntax-audit-in625-a1",
  "requested_sha": "0123456789abcdef0123456789abcdef01234567",
  "gate": "cumulative",
  "reason": "validación diaria autorizada",
  "deadline_utc": "2026-10-27T06:00:00Z"
}
```

| Respuesta | Cuándo | Cuerpo mínimo |
|---|---|---|
| `201 Created` | Claim nuevo y dispatch iniciado | `validation_id`, `status`, `correlation_id`, `links.self` |
| `200 OK` | Replay: misma clave y misma huella | Registro existente + `replayed: true` |
| `409 Conflict` | Misma clave con huella distinta, SHA obsoleto o deriva de SHA | `reason_code`, estado actual |
| `401 Unauthorized` | Clave ausente, inválida o revocada | `error`, `request_id` |
| `403 Forbidden` | Repo/rama/gate fuera de allowlist | `reason_code` |
| `422 Unprocessable Entity` | Payload inválido o campos faltantes | Lista de campos |
| `429 Too Many Requests` | Límite de tasa o cupo de validaciones activas | `Retry-After` |
| `503 Service Unavailable` | Almacén o GitHub no disponible | `reason_code`, sin detalles sensibles |

### 6.2 Consultar validación

`GET /v1/validations/{validation_id}` → `200` con estado, marcas temporales, `runner_run_id`, `gate_run_id`, `reason_code`, `evidence_ref` y `certification_verdict` (`NOT_EVALUATED` por defecto).

### 6.3 Consultar por clave (sin revelar la clave)

`POST /v1/validations/lookup` con `idempotency_key_hash` calculado por el cliente, o cabecera `Idempotency-Key` en `GET /v1/validations`. El Bridge calcula el hash y devuelve el registro; nunca devuelve la clave.

### 6.4 Operación de reconciliación

`POST /v1/validations/{id}/reconcile` con clave de operación. Solo permite resolver `UNKNOWN_DISPATCH` o un lease vencido; no permite saltar el claim ni cambiar `request_fingerprint`. Toda reconciliación queda auditada.

**Sin endpoints de cancelación, retry, dispatch directo ni escritura de producto en v1.** Si se necesitan, requieren v2 y aprobación explícita.

## 7. Validaciones y códigos de rechazo

| `reason_code` | Condición | HTTP |
|---|---|---|
| `UNAUTHORIZED` | Clave ausente/inválida/revocada | 401 |
| `FORBIDDEN_REPO` | Repo fuera de `{lite, plus}` | 403 |
| `FORBIDDEN_BRANCH` | Rama distinta de la canónica resuelta | 403 |
| `FORBIDDEN_GATE` | Gate no permitido para ese repo | 403 |
| `INVALID_PAYLOAD` | Campos faltantes, tipos o longitudes inválidas | 422 |
| `STALE_SHA` | `requested_sha` ≠ HEAD actual de la rama canónica | 409 |
| `SHA_DRIFT` | El run despachado no corresponde al SHA solicitado | 409 |
| `IDEMPOTENCY_CONFLICT` | Misma clave, huella distinta | 409 |
| `ACTIVE_VALIDATION` | Ya hay una validación activa para el repo | 429 |
| `DEADLINE_EXCEEDED` | Se superó `deadline_utc` | 409 |
| `DISPATCH_FAILED` | GitHub rechazó el dispatch | 502/503 |
| `RUN_NOT_FOUND` | No aparece el run en la ventana de búsqueda | 504 |
| `RUNNER_FAILED` | Run terminó con conclusión no exitosa | 200 con estado `FAILED` |
| `STORAGE_UNAVAILABLE` | No se puede leer/escribir el claim durable | 503 |

## 8. Idempotencia, concurrencia y recuperación

1. **Clave:** `idempotency_key_hash = SHA-256(idempotency_key)`.
2. **Huella:** `SHA-256` de JSON canónico (claves ordenadas, sin espacios, UTF-8) con `correlation_id`, `repo`, `branch`, `requested_sha`, `gate`, `reason` y `deadline_utc`. Excluye `idempotency_key` y `validation_id`.
3. **Misma clave + misma huella:** devolver el registro existente; si ya terminó, marcarlo `replayed` sin crear commit, PR, dispatch ni run.
4. **Misma clave + huella distinta:** `409 IDEMPOTENCY_CONFLICT`; no modificar el registro original.
5. **Concurrencia:** el `UNIQUE` resuelve la carrera; una sola transacción gana el claim. El resto lee el registro ganador.
6. **Lease:** `lease_expires_at` (por defecto 180 s para el dispatch; se renueva con heartbeat). Un lease vencido sin run correlacionado puede reclamarse una vez, con `attempt+1` y auditoría.
7. **Reinicio:** tras reiniciar el Bridge, la recuperación relee registros `CLAIMED`/`DISPATCHING`/`QUEUED`/`RUNNING`, reconcilia contra GitHub y continúa el polling. No se crea un segundo run si el `correlation_id` ya aparece en un run existente.
8. **No usar memoria del proceso** como única deduplicación.

## 9. Despacho y correlación con el Runner

1. Resolver la rama canónica desde `qa/certification/README.md` de la rama predeterminada **en cada solicitud** y comparar con la rama pedida.
2. Verificar `requested_sha == HEAD` mediante `GET /repos/{repo}/git/ref/heads/{branch}` inmediatamente antes del dispatch.
3. Resolver el workflow desde un **mapa versionado del Bridge** (`cumulative → in625-cumulative-certification.yml`, etc.). El cliente nunca envía ruta de workflow.
4. Despachar con `POST /repos/{repo}/actions/workflows/{file}/dispatches`, `ref` = rama canónica e inputs **reales** del Runner: `target_repo`, `gate`, `dry_run=false`. El Runner v2 **no acepta** un input `reason`/`correlation_id`; enviarlo provocaría un rechazo por input desconocido. La correlación se resuelve por ventana de tiempo + `head_sha` + política de una validación activa por repo, y se mejora con D-07.
5. Localizar el run por `workflow_id`, `created_at >= dispatch_time` y `head_sha == requested_sha`; guardar `runner_run_id`. Con una sola validación activa por repo y la concurrencia del Runner, la ambigüedad es acotada; si aparecen dos runs candidatos, el estado es `UNKNOWN_DISPATCH`.
6. Mientras el Runner está activo, localizar el run del gate despachado por `workflow` del gate, `created_at >= dispatch_time` y `head_sha == requested_sha`; al cerrar, contrastarlo con `dispatched_run_id` del registro `runner/<id>.json`.
7. No basta con comparar `head_sha` del evento del Runner: el workflow hace checkout explícito de la rama canónica. El Bridge debe exigir que el `base_sha` dentro de `qa/certification/runner/<runner_run_id>.json` sea exactamente igual a `requested_sha` y que el run del gate esté asociado al mismo SHA. Si `head_sha`, `base_sha` o el SHA efectivo del gate discrepan, marcar `SHA_DRIFT` y no continuar como éxito. Si no se puede obtener el registro o resolver el SHA ejecutado, el estado es `UNKNOWN_DISPATCH`/`BLOCKED`, nunca `SUCCEEDED`.
8. **Interacción conocida:** el Runner publica `qa/certification/runner/<id>.json`, lo que mueve el HEAD de la rama canónica al terminar. El Bridge debe registrar por separado `requested_sha`, `base_sha` (SHA efectivamente testeado) y `actual_head_sha` posterior a la publicación. No reutilizar `requested_sha` como HEAD vigente después de esa publicación ni interpretar el cambio de HEAD del registro como deriva del producto.
9. La concurrencia del workflow (`group: certification-runner-<repo>`, `cancel-in-progress: false`) serializa ejecuciones; el Bridge, además, limita a una validación activa por repo para no encolar trabajo innecesario.

## 10. Resultado, evidencia y veredicto

El Bridge persiste y devuelve, como mínimo:

- `validation_id`, `correlation_id`, hash de la clave, `client_id`.
- `repo`, `branch`, `requested_sha`, `actual_head_sha`, `gate`.
- `runner_run_id`, `gate_run_id`, `conclusion` del gate, `conclusion` del Runner.
- `evidence_ref` al registro del Runner y a los artefactos/logs disponibles.
- `reason_code` final y `certification_verdict`.

**Regla dura:** `SUCCEEDED` significa *validación ejecutada y evidencia completa*, no certificación aprobada. `certification_verdict` permanece `NOT_EVALUATED` salvo que un proceso de revisión separado lo cambie con su propia evidencia.

## 11. Seguridad y threat model

| Amenaza | Vector | Control | Prueba |
|---|---|---|---|
| Spoofing | Clave robada | Rotación, hash en reposo, `client_id`, límite de tasa, opción mTLS | Clave revocada → 401 |
| Tampering | Replay con payload distinto | Huella canónica + `409` | Misma clave, otro SHA → 409 |
| Repudiation | Niego de una solicitud | Auditoría append-only con `request_id` | Trazabilidad completa por `validation_id` |
| Information disclosure | Tokens en logs/errores | Redacción, sin cuerpos completos, sin secretos en respuestas | Inspección de logs y respuestas |
| Denial of service | Ráfaga de solicitudes | Tasa, cupo, deadline, una activa por repo | 429 y `ACTIVE_VALIDATION` |
| Elevation of privilege | Pedir otro workflow/repo | Mapa versionado + allowlist + token mínimo | Repo/workflow no permitido → 403 |
| Supply chain | Workflow alterado en rama | El dispatch usa el workflow del ref canónico; cambios de workflow requieren revisión y gate | Comparar `path`/`sha` del workflow |
| Confusión de tokens | Reutilizar token read-only | Tokens separados y permisos distintos | Intento de dispatch con token read-only → 403 |

Permisos del token del Bridge (fine-grained, solo Lite/Plus):

- `Actions: write` (despachar y leer runs).
- `Metadata: read`.
- **Nada** de `Contents: write`, `Pull requests: write`, `Workflows: write` ni administración.

## 12. Pruebas negativas obligatorias (aceptación de Fase 2)

| ID | Caso | Resultado esperado |
|---|---|---|
| N-01 | Sin `X-Bridge-Key` | 401, sin efectos |
| N-02 | Clave inválida o revocada | 401, auditoría |
| N-03 | `repo=precision-lab-readonly-api` | 403, sin dispatch |
| N-04 | Rama no canónica | 403 |
| N-05 | SHA que no es HEAD | 409 `STALE_SHA` |
| N-06 | Payload sin `idempotency_key` | 422 |
| N-07 | Misma clave y misma huella | 200 replay, cero dispatch nuevos |
| N-08 | Misma clave y huella distinta | 409, registro original intacto |
| N-09 | Dos solicitudes concurrentes con la misma clave | Un solo claim y un solo dispatch |
| N-10 | Dispatch aceptado pero run no aparece | `RUN_NOT_FOUND`, `BLOCKED`, sin retry ciego |
| N-11 | Run con SHA distinto al pedido | `SHA_DRIFT`, nunca `SUCCEEDED` |
| N-12 | Reinicio entre dispatch y consulta | Estado recuperado, sin duplicado |
| N-13 | Fallo de almacén | 503 `STORAGE_UNAVAILABLE`, sin dispatch |
| N-14 | Gate falla | `FAILED` con `reason_code` y evidencia, no `PASS` |
| N-15 | Intento de cancelar/retry en v1 | 404/405, sin efecto |

## 13. Observabilidad y auditoría

- `request_id` por solicitud y `correlation_id` por validación; ambos en logs y respuestas.
- Logs estructurados con `validation_id`, `client_id`, estado anterior/nuevo, `reason_code` y latencia. Sin tokens, claves ni cuerpos completos.
- Métricas: solicitudes por resultado, validaciones activas, latencia de dispatch, tiempo hasta run, tiempo hasta cierre, replays, conflictos.
- Retención alineada con la política del repositorio; la evidencia durable vive en Git (`runner/`), no solo en el Bridge.

## 14. Límites operativos

- Una validación activa por repo (además de la concurrencia del Runner).
- Deadline por defecto 3 h (el Runner espera hasta 3 h por el gate); el Bridge debe cerrar antes o marcar `EXPIRED`.
- Sin reintentos automáticos de dispatch; solo reconciliación explícita.
- Sin cargas extremas en producción; el smoke de conexión debe ser inocuo (§16).

## 15. Decisiones abiertas (requieren aprobación del responsable)

| ID | Decisión | Bloquea |
|---|---|---|
| D-01 | Almacén durable: esquema privado nuevo en Supabase (`ACTIVE_HEALTHY`) u otra alternativa; `calls`/`history` no son candidatas | P0.3/idempotencia |
| D-02 | Hospedaje del Bridge (nuevo servicio privado vs componente existente) | Implementación |
| D-03 | Autenticación: clave de servicio sola o clave + mTLS | Contrato final |
| D-04 | Gate inocuo `runner_smoke` para E2E sin gates matemáticos | Fase 5/6 |
| D-05 | Cupo diario y presupuesto de Actions | Operación |
| D-06 | Responsable de emisión/rotación de claves | Operación |
| D-07 | Añadir input opcional `correlation_id` al Runner v2 y propagarlo al `reason` del gate | Auditoría E2E inequívoca |

**D-04 es la decisión más rentable:** hoy no existe un gate barato para probar la cadena. Un workflow `connection-smoke.yml` con un job trivial (echo del SHA, artefacto y registro) permitiría certificar `Bridge → Runner → resultado` sin ejecutar Playwright ni mutación.

## 16. Auditoría del Runner actual (evidencia estática, sin ejecución)

Fuente: `.github/workflows/certification-runner.yml` en Lite y Plus (rama canónica).

| Aspecto | Hallazgo | Riesgo/observación |
|---|---|---|
| Trigger útil | `workflow_dispatch` con `target_repo`, `gate`, `dry_run` | `dry_run=true` por defecto: correcto; **no acepta `reason`/`correlation_id`** (gap D-07) |
| Trigger `push` | Se dispara en la rama canónica pero no despacha ni publica | Consume un runner por push no documental; coste menor |
| Permisos | `contents: write`, `actions: write` | Necesarios para publicar el registro y despachar; el token debe ser fine-grained y limitado |
| Token | `secrets.GH_TOKEN` | No se puede verificar su alcance desde aquí; debe revisarse sin exponerlo |
| Concurrencia | `group: certification-runner-<repo>`, `cancel-in-progress: false` | Serializa por repo; no impide encolar solicitudes |
| SHA | No recibe SHA; opera sobre el HEAD del ref | El Bridge debe fijar y verificar el SHA antes/después |
| Dispatch | `gh workflow run` del gate + polling (24×5 s para aparecer, 360×30 s para terminar) | Ventana de 3 h; sin `idempotency_key` propia |
| Registro | Escribe `qa/certification/runner/<run_id>.json` y hace push | Mueve el HEAD; el fingerprint v2 ignora registros numéricos |
| Anti-loop | `paths-ignore` para `**.md`, `continuity.json`, `runner/**`; sin `[skip ci]` | Correcto; no suprimir gates |
| Guard de publicación | Compara `origin/<branch>` con `BASE_SHA` antes del push | Evita pisar trabajo concurrente; falla explícitamente si cambió |
| Evidencia | JSON con `runner_run_id`, `gate_run_id`, conclusión, URLs | Falta `validation_id`/`correlation_id` del Bridge (D-07) |

**Conclusión:** el Runner es un ejecutor razonable, pero no es un Bridge: no autentica clientes, no reclama idempotencia, no valida allowlist/SHA y no correlaciona con una solicitud externa. El Bridge debe añadir esas garantías sin ampliar los permisos del Runner.

## 17. Criterios de aceptación de P0.2

- [ ] Contrato revisado y aprobado por el responsable (este documento sale de DRAFT).
- [ ] Threat model y límites de permisos aceptados.
- [ ] Mapa de gates→workflow versionado y revisado.
- [ ] Pruebas N-01..N-15 especificadas como casos ejecutables.
- [ ] Decisión D-01 registrada (aunque sea “pendiente de completar P0.1”).
- [x] Inventario P0.1 inicial considerado (parcial; no re-verificado aquí).
- [ ] Sin cambios en la API read-only ni en sus permisos.
- [ ] Ningún DDL ejecutado antes de completar el inventario de P0.1.

**Este contrato no certifica nada por sí mismo.** La certificación de la conexión sigue BLOCKED hasta demostrar Fase 8 con evidencia.
