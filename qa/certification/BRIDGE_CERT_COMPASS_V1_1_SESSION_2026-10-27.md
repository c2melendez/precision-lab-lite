> **AVISO: DOCUMENTO HISTÓRICO SUPERADO (2026-10-28 UTC).** El estado vigente es [BRIDGE_CERT_COMPASS_V1_1_STATUS_2026-10-28.md](BRIDGE_CERT_COMPASS_V1_1_STATUS_2026-10-28.md). Las anotaciones antiguas que muestran D1 como bloqueado o D4 pendiente fueron superadas por la revisión posterior. Los fragmentos de claves de acceso se sustituyeron por marcadores de redacción; no recuperar ni copiar valores del historial.

---

# Cert Runner Compass v1.1 — sesión de certificación (2026-10-27)

**Estado global del Bridge:** OPEN / **NO CERTIFICADO**  
**Prioridad canónica posterior:** motores (`H2-EN-SG…` / paridad Lite); este documento **no** reabre Bridge como `next_action`.

## Resumen ejecutivo

En sesión autorizada por el titular (Carlos / C2 Meléndez) se ejecutó la **Fase 2** de la suite v1.1 sobre Lite (`target_repo=lite`, gate `h1d`) más pruebas D/E de solo lectura o autenticación. El camino feliz de idempotencia + dry-run + dispatch real + estado final funcionó. La certificación **no** cierra por bloqueos residuales (sobre todo **D1**).

## Autorización y reglas

- Autorización escrita del titular para Fase 2 y para aceptar runs en repos públicos.
- No reenviar POST ante 409 / error de red / `DISPATCH_OUTCOME_UNKNOWN`.
- No usar `GET /api/run` (puede despachar).
- No registrar valores de `X-Bridge-Key` en documentación.

## Resultados por grupo

| Grupo | Resultado | Notas |
|-------|-----------|--------|
| A1–A6 | OK (Fase 1, 0 runs) | Health / API read-only / auth Bridge |
| B1–B2 | OK (Fase 1) | Validación Idempotency-Key |
| **B3** | **OK** | Primer POST dry_run; 1 runner nuevo |
| **B4** | **OK** | Replay misma clave; 0 runs nuevos |
| **B5** | **OK** | 409 IDEMPOTENCY_CONFLICT; 0 runs |
| **B6** | **OK** | Concurrentes; ≤1 run nuevo |
| **C1** | **OK** | dry_run=false; 1 runner + 1 gate |
| **C2** | **OK** | Estado final `SUCCEEDED` |
| **C3** | **OK** | Replay C1; 0 runs nuevos |
| **D1** | **BLOCKED** | Sin GET read-only por Idempotency-Key |
| **D2** | **OK** | 401 con clave revocada (admin Compass) |
| **D3** | **OK** | 400/401 sin efectos |
| **D4** | **PENDIENTE** | No se forzó rechazo definitivo GitHub |
| **D5** | **OK** | Camino feliz de localización de run (C1) |
| E1–E5 | OK | Política LLM / sin filtrar claves en reporte |

## Runs GitHub observados (Lite)

Línea base pre–Fase 2 (descriptiva): **26** runs de `certification-runner.yml`.

| Prueba | Runner run | Gate run | dry_run |
|--------|------------|----------|---------|
| B3 | [40461232174](https://github.com/c2melendez/precision-lab-lite/actions/runs/40461232174) | — | true |
| B6 | [40461306085](https://github.com/c2melendez/precision-lab-lite/actions/runs/40461306085) | — | true |
| C1 | [40461473176](https://github.com/c2melendez/precision-lab-lite/actions/runs/40461473176) | [40461496350](https://github.com/c2melendez/precision-lab-lite/actions/runs/40461496350) h1d | false |
| Registro C1 | `qa/certification/runner/40461473176.json` | decision DISPATCHED, gate success | |

### Runs posteriores a C1

- **#30** [40463419492](https://github.com/c2melendez/precision-lab-lite/actions/runs/40463419492) y **#31** [40463536599](https://github.com/c2melendez/precision-lab-lite/actions/runs/40463536599): patrón dry-run (~13 s). Uno confirmado manual por el responsable; el otro candidato a sonda de sesión (`cert-20261027-probe-only` en Recent calls del admin Compass). No publicaron JSON de runner (esperado con dry_run).

## Bloqueos residuales

1. **D1 BLOCKED** — falta endpoint de solo lectura por `Idempotency-Key` (Lovable).
2. **`GET /api/run`** puede invocar dispatch — desactivar/restringir pendiente.
3. **D4 PENDIENTE** — no ejercitado rechazo definitivo GitHub.
4. Rotar claves Bridge expuestas en el canal de sesión.
5. D-07: correlación formal; `inputs` del gate suelen ser `null` vía API.

## Criterios suite v1.1

Camino feliz B3–C3 y D2/D3/D5/E OK; **D1 BLOCKED** y **D4 PENDIENTE** → **NO CERTIFICADO**.

## Relación con el índice canónico

El `next_action` vigente puede ser EN-SG / paridad Lite. **No** desplazar el índice hacia Bridge salvo decisión explícita del responsable.

---

## Addendum: origen de los runs extra (27 oct 2026, UTC)

Registrado el 28 de octubre de 2026 a partir de la revisión de GitHub y del registro del Bridge (solo lectura).

Runs del runner en Lite entre 06:27 y 06:51 UTC del 27 de octubre: **5** (límite: 3). Runs del gate: **1** (límite: 1).

| Run | Hora UTC | Origen verificado | Modo |
|---|---|---|---|
| 40461232174 | 06:27:38 | Bridge, B3 (clave activa `[valor omitido; clave expuesta]`) | dry_run |
| 40461306085 | 06:28:26 | Bridge, B6 (misma clave) | dry_run |
| 40461473176 | 06:30:08 | Bridge, C1 (misma clave); lanzó el gate `40461496350` | dry_run=false |
| 40463419492 | 06:49:43 | Bridge, POST de 06:49:44 con `correlation_id` `cert-20261027-probe-only` (misma clave) | dry_run |
| 40463536599 | 06:50:54 | Sin registro en el Bridge | dry_run |

**Conclusiones**

- Cuatro de los cinco runs pasaron por el Bridge con la clave activa `[valor omitido; clave expuesta]`. Esa clave es compartida y el Bridge no identifica la sesión que la usó.
- El run 40463419492 excede el presupuesto. Lo originó una llamada etiquetada `probe-only`, que no estaba en el plan de pruebas documentado.
- El run 40463536599 no tiene registro en el Bridge. La única identidad visible es la cuenta `c2melendez`, que también usa el Bridge, así que no se atribuye a ninguna sesión concreta.
- El archivo de sesión `ses_e8024a7ceffeqltmqqjs51hw3z.json` se creó el 28 de octubre a las 00:14 UTC, después de ambos runs, y no menciona sus IDs. No los originó.
- Los runs dry-run no generan costo en repositorios públicos, pero cuentan contra el presupuesto. El presupuesto del 27 de octubre quedó excedido en dos runs del runner.
- Los GET a `/api/run` registrados entre 20:19 y 20:54 UTC fueron rechazados con 401 y no dispararon runs.
- Hubo un 401 a las 06:49:33 UTC con una clave que empieza por `cert-20261…`, usada como `X-Bridge-Key`. Una sesión confundió la Idempotency-Key con la clave de acceso.

**Acciones pendientes**

1. Revocar y rotar `[valor omitido; clave expuesta]`.
2. Asignar una clave por sesión y registrar la sesión en `correlation_id`.
3. No dar por eliminado el límite de presupuesto sin una autorización escrita con fecha y nuevo límite.
