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
