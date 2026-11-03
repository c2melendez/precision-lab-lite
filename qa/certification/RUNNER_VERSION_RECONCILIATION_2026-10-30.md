# Reconciliación de versiones del Certification Runner — 2026-10-30

**Alcance:** Lite y Plus. **Naturaleza:** análisis estático y solo lectura. No se despachó ningún workflow, no se fusionó ningún PR, no se desplegó nada y no se modificó ningún dato remoto.

**Motivo:** cerrar el bloque 1 del plan de Runner (conciliar la versión de `main` con la conservada en las ramas canónicas) antes de intentar acreditar O6/O7.

## 1. Evidencia de referencias

| Superficie | Lite | Plus | Blob del workflow | Bytes |
|---|---|---|---|---|
| `main` | `4507082a101fbc5a196cfbfe335db6e83c2cb6d0` | `abc1c29744341afb707878d428c98fcf44acbbbd` | `bcaef28a5408c0a857ed514232f5ec9bd769a1bb` | 25 896 |
| `qa/syntax-audit-in625-a1` (canónica) | `e07f747d55c06917423996e033f96d8d706de35c` | `efee4a920973b68294872ff94036c5a1f87c5d7e` | `9c39cacb59aee788c713fc7aea89b13f84547eb7` / `171703c2d0da28e2a9b72ba84d580b2472730922` | 12 055 / 12 034 |
| `ci/runner-v3-docs` | `fab2657f4b1321b37ec0416c7c2412f8aef34b04` | `4d6a9bea9230f562c16da1a80fa69f3fc5bdaedf` | `23e42cf6dad30b281036cbbb63eff938c6646fde` | 25 208 |
| base v2 anterior a v3 (`07f68ed0`) | `07f68ed0f699cd65215447059140786d22084ecd` | — | `91f3c77344daca1a48aba10f2b4fa23b11ffa39a` | 9 230 |

`main` incorporó v3 mediante el PR #52 (`11806ba5`) y tres correcciones posteriores (`49be5e3e`, `e404bcac`, `4507082a`). El blob del workflow es idéntico en Lite y Plus.

## 2. Qué contiene cada versión

| Capacidad | `main` v3.x | `qa` v2.1 |
|---|---|---|
| `workflow_dispatch` con `target_repo`, `gate`, `dry_run` | Sí | Sí |
| Operación `docs` (descarga, SHA-256, allowlist, CAS) | Sí | No |
| Sonda de run equivalente en el mismo SHA | No | Sí |
| Espera del run equivalente (`WAIT_EXISTING`) | No | Sí |
| Guarda de dispatch con `RUN_ID` vacío | No | Sí |
| Registro `qa/certification/runner/<id>.json` con cadena de correlación | Sí | Sí |
| Persistencia en `continuity.json` / `CURRENT_STATE.md` / `EXECUTION_LOG.md` | No | Sí |
| Publicación con compare-and-swap contra `BASE_SHA` | Sí | Sí |
| Bloqueo de `security` en Plus | Sí | Sí |
| `gate` limitado a `continuity.json` | Sí | Sí |

Conclusión: **no son equivalentes**. `main` añade la operación documental pero conserva la ruta de gate anterior; la rama canónica tiene la ruta de gate más estricta pero no la operación documental.

## 3. Equivalencia Lite/Plus

El diff de los dos workflows canónicos es de 4 líneas y no cambia comportamiento:

- 2 líneas de comentario sobre `[skip ci]` y el evento push.
- `default: lite` / `default: plus`.
- `options: [lite, both]` / `options: [plus, both]`.

Todo el resto (sonda, espera, dispatch, registro, persistencia, CAS y bloqueo de seguridad) es idéntico. La equivalencia de contrato se cumple en la rama canónica.

## 4. Decisión

- **Canónica para certificación:** la rama `qa/syntax-audit-in625-a1` (v2.1). Es la que ejecuta los gates reales y la que contiene las garantías de no duplicación y trazabilidad.
- **`main` v3.x no se promueve tal cual.** Hacerlo eliminaría la sonda, la espera, la persistencia y la guarda `RUN_ID`, y debilitaría la trazabilidad.
- **La operación `docs` no se descarta:** es una capacidad separada que debe portarse sobre el contrato de gate v2.1 en un único workflow, con pruebas, antes de declararla canónica.
- **No se fusiona nada** en esta operación.

## 5. Cobertura de regresión añadida

`scripts/certification/test_runner_dispatch_integrity.py` (11 pruebas) fija:

- dispatch solo con `workflow_dispatch`, `dry_run != true` y `RUN_ID` vacío;
- sonda de run equivalente antes del dispatch, con el mismo `BASE_SHA` y estados activos;
- `WAIT_EXISTING` espera el run existente y no re-despacha;
- resolución de `GATE_WORKFLOW` y `reason` con run/gate/sha;
- cadena de correlación completa en el registro;
- orden registro → persistencia → publicación y CAS contra `BASE_SHA`;
- push y dry-run sin dispatch ni registro;
- guarda de `target_repo`;
- gates expuestos ⊆ `continuity.json`;
- cada gate expuesto existe y exige `reason`.

Evidencia local (2026-10-30):

- Lite: 55 pruebas OK (`python -m unittest discover -s scripts/certification -p "test_*.py"`).
- Plus: 74 pruebas OK.
- Contraste: contra el workflow de `main` v3 la misma suite falla 4 pruebas (sonda, espera, guarda `RUN_ID`, orden/persistencia). Eso demuestra que la suite distingue ambas versiones y que `main` no puede declararse equivalente.

## 6. Pendientes que NO cierra esta reconciliación

- **O6:** sigue PENDING. No se ejecutó `workflow_dispatch → gate → recibo → persistencia` real por la restricción operativa. Un run push no genera recibo ni despacha.
- **O7:** sigue PENDING y depende de O6. La idempotencia durable pertenece al Bridge (`UNIQUE` sobre hash de clave + claim). El Runner solo evita duplicar un run activo del mismo SHA; no reclama claves.
- **D-07:** la API de GitHub no devuelve `inputs`, así que la correlación solicitud→run no es recuperable por API. Requiere `correlation_id` propagado o un recibo durable.
- **Gate `scientific`:** está declarado en `continuity.json` pero no figura en las opciones del Runner. No se añadió para no ampliar el alcance sin decisión; queda documentado como brecha de contrato.
- **Merge de `main`/`qa`:** no realizado.

## 7. Siguiente paso exacto

Portar la operación `docs` de `main` v3.x sobre el contrato de gate v2.1 en una rama de integración, ejecutar la suite completa en Lite y Plus, y solo después proponer la promoción. O6/O7 requieren una autorización separada para un despacho real controlado; no se ejecutan aquí.
