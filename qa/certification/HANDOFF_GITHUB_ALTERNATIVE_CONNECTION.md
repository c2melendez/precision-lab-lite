# HANDOFF — Conexión alternativa certificable a GitHub (corte 2026-10-26)

**Prioridad P0:** certificar conexión antes de reanudar la certificación general de motores matemáticos. **Estado:** BLOCKED en persistencia y E2E no demostrado. GitHub es la fuente de verdad. Este handoff y `ROADMAP_GITHUB_ALTERNATIVE_CONNECTION.md` deben leerse junto al Prompt maestro; lo complementan, no lo reemplazan.

## Objetivo y alcance
Certificar la ruta autorizada `Push → API → Bridge → Runner → resultado verificable`. La API desplegada actualmente es de solo lectura y NO es el Bridge ejecutor. No se debe agregar dispatch/push a esa API por conveniencia. La ejecución debe ser un componente separado, autenticado, con allowlist, control de SHA, idempotencia y auditoría. No hay evidencia confirmada de una ruta E2E completa.

## Repositorios y componentes
- Lite: `c2melendez/precision-lab-lite`
- Plus: `c2melendez/precision-lab-plus`
- API de lectura: `c2melendez/precision-lab-readonly-api`
- Render: servicio `precision-lab-readonly-api`; último estado documentado live, deploy `dep-dbfnu8nlk1mc73fksl6g`, commit `b6d5efdcae0802d5b5a24c79d8d7373bfa9e1acd`.
- Supabase `oqlzftercvraprnvjifo` (región `us-west-2`): **candidato no confirmado**. La API desplegada no contiene integración con Supabase y el propósito del proyecto restaurado no está verificado (ledger `VAL-GH-ALT-2026-10-27-05`).

## Estado observado
- **Verificación externa 2026-10-27 (solo GET, sin credenciales):** `/healthz` 200 con `read_only=true`; `/openapi.json` 200 con `servers[0].url` correcto, solo GET y esquema `X-API-Key`; `/v1/status?repo=both` 401 sin clave y con clave incorrecta; planificador 401 sin clave. Auth positiva, estado bilateral y `healthCheckPath` siguen pendientes. Registro en `qa/certification/LEDGER_GITHUB_ALTERNATIVE_CONNECTION.md`.
- Los logs de producción del corte previo muestran `GET /healthz` y `GET /openapi.json` con 200; `GET /v1/status` sin clave con 401 (esperado).
- No se ha verificado una llamada autenticada correcta a `/v1/status?repo=both` ni al planificador.
- No se confirmó la presencia/configuración de `GITHUB_READ_TOKEN` ni `SERVICE_API_KEY`. No inferir ausencia, imprimir ni compartir valores.
- Render reportó `healthCheckPath` vacío mientras `render.yaml` declara `/healthz`; conciliar la deriva. `autoDeployTrigger` está desactivado.
- La API de lectura solo usa GET y no ofrece dispatch, push, cancelación, retry ni mutaciones. Token GitHub de la API: fine-grained, solo Lite/Plus, Contents: Read y Actions: Read; nunca reutilizar el token de escritura del Runner.
- Supabase quedó `ACTIVE_HEALTHY` tras la restauración del 2026-10-27; el inventario inicial sigue parcial (historial de migraciones vacío, sin tabla de idempotencia). El propósito del proyecto no está demostrado: la API no lo referencia y no se halló `DATABASE_URL` ni cliente de base de datos. No se conoce si tiene otros consumidores externos.
- Restaurar Supabase puede reanudar consumo/cargos. Comprobar condiciones y obtener autorización antes de restaurar; no se ejecutó restauración.
- Existen workflows/Runner y registros en Lite/Plus, pero un push registrado no demuestra que el Runner haya procesado el trabajo. No hay correlación E2E confirmada solicitud → Bridge → run/job → resultado durable.

- **Cadena Runner → gate verificada con evidencia histórica (2026-10-27, sin nuevos runs):** Lite `40272871857` → gate h1d `40272886275` y Plus `40273483681` → `40273499483`, ambos `workflow_dispatch` completed/success, con el `base_sha` del registro igual al `head_sha` del gate y registro durable en `qa/certification/runner/<id>.json`. No es E2E: faltan Push → API → Bridge. El `reason` con run/gate/sha solo es legible en logs; el objeto REST del run devuelve `inputs: null` (D-07).

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

**P0.2:** contrato v1 en borrador (`BRIDGE_CONTRACT_GITHUB_ALTERNATIVE_CONNECTION_v1.md`); requiere revisión y aprobación de D-01..D-07. No implementar ni desplegar hasta aprobación y hasta completar el inventario de P0.1.

## Decisiones aprobadas por el responsable (2026-10-27)

- **D-01: opción 1.** Esquema privado dedicado en el proyecto Supabase actual `oqlzftercvraprnvjifo`, condicionado a auditoría previa. Antes de cualquier DDL hay que confirmar: (a) que la Data API no expone ese esquema; (b) que nadie usa `public.calls` ni `public.history`; (c) rol de runtime dedicado, con `USAGE` y DML solo sobre tablas del ledger, sin grants a `anon`, `authenticated` ni `PUBLIC`, y sin `service_role`. Si la auditoría no puede confirmar (a) y (b), se aplica la opción 2 (proyecto dedicado). No se modifican `public.calls` ni `public.history`.
- **D-04: aprobado.** Implementar `connection-smoke.yml` como dispatch-only, sin gate matemático. Orden obligatorio: primero la auditoría de D-01; después el smoke. Prueba Runner → resultado; no prueba Bridge completo ni idempotencia.
- **Pendientes:** D-02, D-03, D-05 (cupo diario de Actions, requerido antes del smoke), D-06 (responsable de rotación de claves), D-07 (`correlation_id` en el Runner).
- **Clave:** la `SERVICE_API_KEY` anterior fue revocada por el responsable; la nueva se configura en el servicio antes de cualquier validación.


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
