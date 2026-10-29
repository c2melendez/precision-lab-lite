# Estado consolidado — Cert Runner Compass v1.1 con idempotencia

**Corte documental:** 2026-10-29 UTC  
**Versión de suite de referencia:** v1.1, revisión 4 / workspace v11  
**Estado global:** **EN PROGRESO — NO CERTIFICADO**  
**Alcance de este documento:** consolidación documental de la evidencia registrada. Esta actualización no envió solicitudes al Bridge, no consultó credenciales ni disparó GitHub Actions.

## 1. Autoridad y límites de la evidencia

Este archivo es el resumen vigente del Bridge. El informe de sesión anterior, BRIDGE_CERT_COMPASS_V1_1_SESSION_2026-10-27.md, se conserva como histórico y no debe prevalecer sobre este corte cuando haya contradicciones.

Los resultados de B3–B6, C1–C3, D1 y D4 descritos abajo se incorporan desde los registros técnicos/documentales entregados y citados en la suite. **No se repitieron en esta actualización llamadas HTTP ni consultas a la base.** “Verificado anteriormente” no significa que se haya repetido la comprobación en este corte.

No confundir:
- **D-01…D-07**: decisiones del frente de conexión/P0.1 (Supabase, conexión y smoke).
- **D1…D5**: casos de prueba del grupo D de la suite del Bridge.
- La suite del Bridge y la certificación matemática general de Lite/Plus son ámbitos diferentes.

## 2. Estado por grupo

| ID | Estado documental | Evidencia / condición |
|---|---|---|
| A1–A6 | OK en la pasada registrada | Health y autenticación del Bridge; no se repitieron aquí. La validación de la clave de Render debe reconciliarse tras su rotación. |
| B1–B2 | OK | Los POST inválidos fueron rechazados sin runs nuevos. |
| V1 | Confirmado por el responsable; no independiente | El hosting no expone su SHA de despliegue. Referencia reportada: 5db4ce9f23fb425a6312d85a5d59f5abb0f086a9. |
| V2–V6 | OK en la verificación registrada | GET /api/run respondió 405; lookup de solo lectura validó autenticación/entrada y no cambió el conteo de runs. No usar GET /api/run. |
| D1 | **CERRADO CON ALCANCE** | Se documentó recuperación por run_id original mediante GET /api/runs/{id}, sin reenvío. El lookup por Idempotency-Key solo localiza solicitudes creadas con la misma X-Bridge-Key; no es una búsqueda global ni una consulta en vivo a GitHub. |
| B3 | OK, con anomalía de persistencia | Runner 40461232174 completó success; el ledger de dry-run quedó en RUNNING. |
| B4 | Funcionalmente idempotente; contrato de respuesta inconsistente | Replay conserva idempotency_id y run_id, sin run nuevo; devolvió HTTP 201 y reused: false, no la respuesta esperada de replay. |
| B5 | OK | Reutilizar la clave con parámetros distintos devolvió 409 IDEMPOTENCY_CONFLICT, sin run nuevo. |
| B6 | OK en unicidad; anomalía de persistencia | Dos POST produjeron un solo registro y un solo runner (40461306085), sin duplicado. Respuestas registradas: 202/reused y 201; el ledger del dry-run siguió RUNNING. |
| C1 | OK | Runner 40461473176 y gate h1d 40461496350 terminaron en success. El JSON del runner enlaza la decisión DISPATCHED y el gate. |
| C2 | OK | El estado pasó de RUNNING a SUCCEEDED para el dispatch real y quedó persistido. |
| C3 | Funcionalmente idempotente; contrato de respuesta inconsistente | Replay conserva idempotency_id/run_id, sin run nuevo; devolvió HTTP 201 en lugar de una respuesta inequívoca de replay. |
| D2 | PENDIENTE de evidencia vigente | Falta registrar una clave de prueba creada y revocada deliberadamente y confirmar su 401 después de la rotación. |
| D3 | Reportado OK | Rechazo por entrada/clave sin efectos; conservar evidencia específica en la suite final. |
| D4 | **VERIFICADO anteriormente** | Rama inexistente: HTTP 502 con GITHUB_DISPATCH_REJECTED_422; claim FAILED, sin gh_runs y sin run nuevo. |
| D5 | PARCIAL / PENDIENTE DE CIERRE | C1 localizó el runner y se registró el gate. Falta dejar evidencia inequívoca, enlazada al despliegue, del contrato específico de respuesta 204 y de su asociación al run. |
| E1, E4, E5 | Reportados OK; conservar evidencia del GPT | Son revisiones en modo simulado/documental y no deben originar POST. |
| E2 | **PENDIENTE** | Se necesita la conversación real del GPT que recibió el 409, no reenvió la solicitud e informó el estado. Los logs del servidor por sí solos no prueban la respuesta conversacional. |
| E3 | **PENDIENTE** | Se necesita la conversación real del GPT que reutilizó la misma clave para la misma tarea. El replay B4 no permite atribuirlo al GPT, porque pudo ser manual. |

## 3. Incidencias que impiden certificar

### 3.1 Estado persistido de dry-run

En B3 y B6 GitHub muestra runs completed/success, pero bridge_idempotency.state y outcome_state continuaron como RUNNING. C1 (dispatch real) sí terminó en SUCCEEDED, y D4 terminó correctamente en FAILED.

**Conclusión:** la persistencia de resultados finales para dry-run no es coherente con el resultado del Runner. Mantener abierta esta discrepancia. Resolverla por inspección de código/logs o consultas de solo lectura antes de considerar una nueva prueba; no crear nuevos POST solo para volver a observar el mismo patrón.

### 3.2 Contrato de replay

B4 y C3 devolvieron HTTP 201 pese a ser replays; B4 además indicó reused: false. La identidad de idempotency_id/run_id y la ausencia de run adicional prueban que no se duplicó el trabajo en esos casos, pero la representación de replay no coincide con el contrato descrito en la suite. B6 sí registró una respuesta concurrente 202 con reused: true.

**Pendiente:** decidir y documentar el contrato HTTP canónico para replay y alinear implementación, pruebas y suite. No reinterpretar las respuestas como perfectas solo porque no hubo duplicado.

### 3.3 Correlación

D-07 continúa abierto: la API de GitHub no ofrece los inputs esperados en la respuesta REST y la correlación formal correlation_id del Runner no está demostrada. El gate de C1 se identifica mediante el JSON del Runner, no por una relación persistida completa en el ledger. No afirmar trazabilidad E2E plena.

### 3.4 Identidad del despliegue

Se han citado estas referencias en documentación relacionada: commit de referencia del despliegue 5db4ce9f…, commit de edición reportado por Lovable 5f7ad6a6… y requisito f051a4b1 mencionado en la plantilla de registro. No se deben tratar como equivalentes sin conciliación explícita. El hosting no expone un SHA verificable de forma independiente.

## 4. Runs y control del presupuesto

Runs del Runner asociados a la Fase 2 del 27 de octubre (UTC): cinco, más un run de gate:

| Run de Runner | Atribución registrada | Resultado de control |
|---|---|---|
| [40461232174](https://github.com/c2melendez/precision-lab-lite/actions/runs/40461232174) | B3 | 1.º dispatch previsto; dry-run |
| [40461306085](https://github.com/c2melendez/precision-lab-lite/actions/runs/40461306085) | B6 | 2.º dispatch previsto; dry-run |
| [40461473176](https://github.com/c2melendez/precision-lab-lite/actions/runs/40461473176) | C1 | 3.º dispatch previsto; dispatch real |
| [40463419492](https://github.com/c2melendez/precision-lab-lite/actions/runs/40463419492) | POST etiquetado probe-only | Run adicional no previsto |
| [40463536599](https://github.com/c2melendez/precision-lab-lite/actions/runs/40463536599) | Sin registro correspondiente en Compass | Atribución no resuelta |
| [40461496350](https://github.com/c2melendez/precision-lab-lite/actions/runs/40461496350) | Gate h1d originado por C1 | 1 run de gate |

El plan v1.1 permitía como máximo tres runs de Runner y uno de gate para esta validación. El resultado histórico fue **5 Runner / 1 gate: dos runs de Runner por encima del presupuesto de prueba original**. La ausencia de costo directo por minutos en repositorios públicos no convierte los runs extra en previstos ni los elimina del control de duplicados. El conteo de 38 runs totales citado para Lite incluye eventos push; no equivale a 38 dispatches de Compass.

No disparar nuevos workflows para “compensar”, completar conteos ni repetir casos aprobados. Cualquier ejecución nueva requiere autorización explícita y un plan que indique presupuesto y causa.

## 5. Seguridad y credenciales

- Una clave activa del Bridge y una clave de la API de Render quedaron expuestas en el historial de conversación. Sus valores no se reproducen aquí ni deben copiarse a documentos, commits, logs o reportes.
- **Rotación no confirmada en la evidencia disponible:** revocar la clave del Bridge compartida por varias sesiones y generar una clave nueva por sesión. Rotar también la clave de Render revelada, y actualizar SERVICE_API_KEY en Render antes de validar la autenticación.
- La prueba manual más reciente reportada con una clave de Render devolvió 401. No concluir que esa clave funciona ni usar los resultados de una pasada previa como prueba de que el secreto actual está sincronizado. Probar desde un entorno autorizado, con la clave solo en una variable de entorno y reportar únicamente el código HTTP.
- Para D2, crear una clave de prueba y revocarla de inmediato; no usar la clave activa ni registrar el valor.
- SERVICE_API_KEY autentica la API de Render; no es una credencial de Supabase. Las credenciales de Supabase aún deben definirse por separado para el trabajo de persistencia, con mínimo privilegio.

## 6. Decisiones de conexión relacionadas, fuera de los casos D1–D5

- **D-01 (P0.1 / Supabase):** el responsable eligió la opción 1: auditar primero el esquema privado del proyecto actual. Solo se conserva esa opción si se demuestra que la Data API no expone el esquema, que nadie usa public.calls/public.history y que el rol de runtime es dedicado y sin grants públicos. Si alguna condición no puede demostrarse, se debe pasar a la opción 2 (proyecto Supabase dedicado). Esta decisión no equivale a una auditoría aprobada.
- **D-04 (P0.1 / smoke):** el responsable aprobó conceptualmente connection-smoke.yml dispatch-only. No implementarlo ni ejecutarlo antes de terminar la auditoría/inventario P0.1 y documentar el riesgo de pushes/Actions.
- No mezclar estas decisiones P0.1 con los casos de prueba D1–D5 del Bridge.

## 7. Próxima secuencia documental sin nuevos runs

1. Registrar la revocación/rotación de ambas claves sin incluir valores y validar la clave de Render desde el entorno autorizado.
2. Conciliar las referencias del despliegue (5db4ce9f…, 5f7ad6a6…, f051a4b1) con evidencia disponible en Lovable/hosting.
3. Conservar evidencia conversacional real del GPT para E2 y E3; no hacer POST nuevos por automatismo. Solo abrir una prueba nueva si la evidencia histórica ya no puede recuperarse y existe autorización explícita.
4. Cerrar D5 con evidencia del contrato 204→run, y D2 tras verificar la clave revocada.
5. Resolver la persistencia RUNNING en dry-run y definir el contrato de replay.
6. Mantener D-07 abierto hasta demostrar correlación formal.
7. Reconciliar el conteo de GitHub y conservar explícitos los dos runs extra y su atribución no resuelta.

**Criterio de salida:** no certificar hasta cerrar E2/E3 y los defectos/ambigüedades de contrato y persistencia, confirmar la rotación de credenciales, y documentar todos los estados finales. Duplicados observados en B3–C3: 0; runs extra históricos sobre el presupuesto original: 2 de Runner; atribución de 40463536599: no resuelta.

**Estado final del corte: EN PROGRESO — NO CERTIFICADO.**


## 2026-10-29 UTC — read-only reconciliation: Compass B3/B6 ledger and ACL

**No POST, workflow dispatch, DDL, or permission change was performed in this review.**

- Lovable metadata confirms project `Cert Runner Compass` is published and its latest source commit is `b0442cca4f1c47f2f4d71d02ded75b63fc539428`. The provider response does not expose an independently verifiable deployed artifact SHA; do not equate this source commit with the historical references `f051a4b1`, `5f7ad6a6` or `5db4ce9f` without deployment provenance.
- A read-only DB query confirms the record `cert-20261028-OWN-B3` is `SUCCEEDED` with outcome `SUCCEEDED`, and its stored GitHub run is [40624157231](https://github.com/c2melendez/precision-lab-lite/actions/runs/40624157231), completed/success. This resolves that specific record's final state; it does not repair unrelated historic records.
- Three other records created on 2026-10-27 remain persisted as `RUNNING` with `outcome_state=RUNNING`, although their linked Runner workflows are completed/success on the same SHA `4507082a101fbc5a196cfbfe335db6e83c2cb6d0`: B3 [40461232174](https://github.com/c2melendez/precision-lab-lite/actions/runs/40461232174), B6 [40461306085](https://github.com/c2melendez/precision-lab-lite/actions/runs/40461306085), and the additional probe [40463419492](https://github.com/c2melendez/precision-lab-lite/actions/runs/40463419492). Do not retry these workflows. Reconcile through the authenticated owner-scoped read-only lookup only when the already-authorized key for the corresponding record is available; do not swap key hashes to impersonate an owner. The earlier attribution of run 40463536599 remains unresolved.
- A schema-only read found RLS enabled and no policies returned for `public.bridge_calls`, `public.bridge_idempotency`, `public.bridge_keys`, and `public.bridge_runs`. `bridge_idempotency` grants are restricted to `service_role`; however, `anon` and `authenticated` still have SELECT/INSERT/UPDATE/DELETE/TRUNCATE/REFERENCES/TRIGGER grants on `bridge_calls`, `bridge_keys`, and `bridge_runs`. This ACL is broader than the documented no-public-grants requirement even though no row policies were found. No direct table-access test was attempted and no grants/policies were changed. Treat least-privilege remediation as a security change requiring a reviewed migration and protected rollout.
- **Gate:** Compass remains `OPEN / NO CERTIFICADO`. Outstanding items include deployment provenance, reconciliation of those stale RUNNING rows, replay-response contract, D2/D5/E2/E3 evidence and formal D-07 correlation. Do not use `GET /api/run`, and do not send `POST /api/runs` merely to repeat B3/B6.
