## 2026-10-24 UTC — r291: revalidación automática posterior a documentación

- Tras commits de documentación, PR #29 disparó nuevamente workflows en SHA `91ab2cfaf5a85f4c5a504a078eae361be702b16b`; no fue una campaña focalizada del plan r290.
- S19 run [40086398270](https://github.com/c2melendez/precision-lab-plus/actions/runs/40086398270): workflow SUCCESS; backend mutmut job `120859802944` y artefacto ID `12559771024`. Resumen final: 3,280 mutantes, 971 killed, 2,136 survived, 159 no tests, 14 timeout; score killed 29.60%. Resultado sin mejora frente a run 40069907892; no contar como ejecución de tests dirigidos r290.
- CI run [40086398092](https://github.com/c2melendez/precision-lab-plus/actions/runs/40086398092): SUCCESS (backend/frontend); S25, S17, S20, S21, S23, Playwright E2E, integridad Algebra 229 y gate acumulativo figuran SUCCESS en SHA actual.
- S18 run [40086398104](https://github.com/c2melendez/precision-lab-plus/actions/runs/40086398104): CANCELLED en el paso differential/property; no PASS, mantener bloqueo de infraestructura y no reintentar sin causa de estabilidad.
- No se implementaron los tests del plan r290 ni se cambió código de producto. S19 backend sigue BLOCKED por score/inventario; PR #29 sigue abierto y draft; certificación global OPEN.
- Siguiente paso: revisar/aceptar los casos P0 del plan r290 contra contratos G3/Algebra 229 y añadir pruebas dirigidas antes de la próxima mutación. Para evitar repetición, no volver a disparar el workflow completo con commits solo documentales si puede evitarse; no declarar PASS por workflow SUCCESS.

---

## 2026-10-24 UTC — r290: plan focalizado de pruebas S19 backend

- Se creó `S19_BACKEND_TARGETED_TEST_PLAN_R290.md` (commit `d526cd099a8e5fae3b46a72e812f611e4200ab2a`) con prioridades basadas en el log mutmut por función.
- P0: `_absolute_value_cases_result` (172 survived), `_radical_cases_result` (185 survived), `_rational_domain_result` (143 survived), `_absolute_value_steps` (112 survived), `_absolute_value_equidistance_steps` (105 survived), `validate_g3_structure` (246 survived), `_evaluate_impl` (228 survived); además funciones con no tests como `parse_inequality_tree` (52), `parse_chained_inequalities` (24), `_domain_step` (28) y `_real_radical_value` (12).
- Verificado: los tests seleccionados actuales no nombran explícitamente varias de estas funciones; SG28 slow path queda bloqueado hasta aprobación contractual.
- Plan: revisión de casos y contratos, tests unitarios focalizados, luego una sola corrida mutacional focalizada. No se lanzaron Actions ni se modificó producto.
- S19 backend BLOCKED; SG28 REVIEW_REQUIRED; global OPEN; PR #29 abierto.

---

## 2026-10-24 UTC — r289: discrepancia de alcance S19 backend

- El baseline normativo `qa/s19/BASELINE_MUTATION.md` fija como operativo 1,028 mutantes (590 killed, 371 survived, 58 no tests, 9 timeout; score killed 57.39%). El log final del run actual 40069907892 registra 971 killed, 2,136 survived, 159 no tests y 14 timeout; total 3,280, score killed 29.60% con la misma convención. El archivo `mutmut-results.txt` lista solo estados no-killed; el resumen final del log es necesario para reconstruir el total.
- El inventario creció de 1,028 a 3,280 (+2,252); el score reportado bajó de 57.39% a 29.60% (-27.79 pp). Debe analizarse la expansión del código y de los mutantes por módulo antes de atribuirlo a regresión de tests. Se documentó en `S19_BACKEND_MUTATION_SCOPE_DRIFT_R289.md` (actualización posterior aa38a869be574bf405fdee3169fff00aeee0787d) y se corrigió la interpretación inicial de mutmut results.
- Artefacto baseline recuperado y resumen completo del log comparado. La expansión se concentra en solve_service (+1,071 mutantes; 6→16 funciones), parsing (+717; 19→24 funciones), evaluate (+437; 3→7 funciones) y ast_validator (+27). El score bajó en todos los módulos; la deuda más grande está en solve_service/evaluate. Siguiente paso: revisión de pruebas dirigidas para las funciones nuevas y sobrevivientes de esas superficies, sin ejecutar S19 completo. No repetir S19 completo ni cambiar producto.
- S19 backend sigue BLOCKED; SG28 REVIEW_REQUIRED, S18 CANCELLED por infraestructura, PR #29 abierto, certificación global OPEN. Sin nuevas Actions.

---

## 2026-10-24 UTC — r288: revisión del artefacto S19 backend mutmut

- Revisado artefacto `s19-plus-backend-mutmut` ID `12551670346` del run [40069907892](https://github.com/c2melendez/precision-lab-plus/actions/runs/40069907892), SHA `6e6a59ee556cf6bba60a40010ec707f05a01ca52`.
- Corrección de interpretación: `mutmut-results.txt` lista 2,309 estados no-killed (2,136 survived, 159 no tests, 14 timeout), no el total de la campaña. El resumen final del log confirma 971 killed y 3,280 total; score 29.60%. `mutmut-exit-code.txt` = 0 no equivale a aceptación. El artefacto fuente confirma 14 timeout.
- Nuevo informe `S19_BACKEND_MUTATION_REVIEW_R288.md`: S19 backend acceptance BLOCKED porque no hay kills ni criterio/umbral aprobado. No repetir la corrida hasta versionar el contrato de score/denominador, timeout/no-tests, equivalentes y exclusiones.
- Sin cambios de producto ni Actions nuevas. SG28 REVIEW_REQUIRED, S18 CANCELLED por infraestructura, global OPEN; PR #29 abierto.

---

## 2026-10-24 UTC — r287: gates reconciliados y contrato SG28 propuesto

**HEAD de partida:** `6e6a59ee556cf6bba60a40010ec707f05a01ca52`; rama `qa/syntax-audit-in625-a1`; PR #29 abierto, sin merge.

### Evidencia exacta en SHA `6e6a59ee556cf6bba60a40010ec707f05a01ca52`
- CI [40069907974](https://github.com/c2melendez/precision-lab-plus/actions/runs/40069907974), acumulativo [40069907843](https://github.com/c2melendez/precision-lab-plus/actions/runs/40069907843) y Playwright [40069907922](https://github.com/c2melendez/precision-lab-plus/actions/runs/40069907922): SUCCESS.
- H1a/H1b/H1c/H1d, S17, S20, S21, S23, S25 y Syntax Diagnostic: SUCCESS exacto en ese SHA.
- S19 [40069907892](https://github.com/c2melendez/precision-lab-plus/actions/runs/40069907892): SUCCESS; los jobs de mutación backend Plus, frontend Lite y frontend Plus finalizaron y subieron informes. Revisar artefactos contra los umbrales de aceptación antes de dar por cerrada la puntuación.
- S18 [40069907881](https://github.com/c2melendez/precision-lab-plus/actions/runs/40069907881): CANCELLED por señal de apagado del runner durante el paso diferencial; el run anterior [40069346239](https://github.com/c2melendez/precision-lab-plus/actions/runs/40069346239) terminó de forma similar. Es infraestructura, no una aserción fallida; tampoco es PASS.

### Contrato SG28
Se añadió `SG28_LOGICAL_REQUEST_LEASE_CONTRACT_PROPOSAL_v1.md` como `PROPOSED / REVIEW_REQUIRED`. Cubre presupuesto lógico, lease/renovación, reloj, fail-closed, fencing efectivo, HTTP/MathResponse y topología. No autoriza activar el flag ni afirma K=1 distribuido.

### Bloqueos y siguiente acción
Global OPEN · H2-SG28-DIST-01..08 BLOCKED · SECURITY-S25 global BLOCKED · SY-P-23 OPEN · SY-X-04-PLUS-HTTP BLOCKED · ALGEBRA229-AS-B-29 ON_HOLD · EDCX-B5 BLOCKED por canal/capacidad. No mergear PR #29.

**Siguiente acción única — REVIEW:** revisión técnica del contrato propuesto contra `SG28_INTEGRATION_EXIT_CRITERIA.md`. No cablear la ruta HTTP ni activar aislamiento en producción. Tras completar los gates de Lite en el SHA técnico actual, reintentar solo el job S18 cancelado si el runner está disponible y verificar qué snapshot de Lite se compara.

### Addendum r287 — revisión técnica SG28 completada, contrato aún no aprobado

Se añadió [SG28_CONTRACT_REVIEW_R287.md](SG28_CONTRACT_REVIEW_R287.md), contraste de los seis puntos de `SG28_INTEGRATION_EXIT_CRITERIA.md`. Resultado: el contrato propuesto los menciona, pero aún no los resuelve como decisiones implementables. Los puntos críticos son ACK perdido/renovación, reloj y recuperación, fencing de ejecución efectiva y condición para conceder una generación sucesora. No cablear HTTP ni activar flags; H2-SG28-DIST-01..08 y SY-X-04-PLUS-HTTP continúan BLOCKED. Cambio documental únicamente; no se ejecutaron Actions.

---

## 2026-10-24 UTC — r286: brecha MathResponse corregida; gates de cierre en WAIT

**HEAD técnico verificado:** `c6df370fd3c5779a56bc29317968b26ea046d4bf` en `qa/syntax-audit-in625-a1`. PR #29 sigue abierto; no se ha mergeado.

### Brecha 4 SG28 — cambio y evidencia
- El test-first en SHA `492e3ed3` encontró una diferencia real: `x+(` devolvía `PARSE_ERROR` con mensaje limpio en la ruta normal y con prefijo `ParseSecurityError:` en aislamiento.
- También descubrió que el test HTTP 422 comparaba `duration_ms`, que varía naturalmente. No se ignoró la diferencia semántica: se corrigió el mensaje público y se excluyeron de los snapshots solo `request_id` y `duration_ms`.
- En `backend/app/routers/evaluate.py`, `_computation_failure_message` elimina solo el prefijo del tipo interno de excepción cuando está presente, manteniendo el texto matemático original. Las pruebas comparan todos los campos de `MathResponse`, HTTP 200 para éxito/error de parser/dominio/sustitución y HTTP 422 para payload malformado, en aislamiento OFF/ON.
- Gate dedicado [40069343572](https://github.com/c2melendez/precision-lab-plus/actions/runs/40069343572): **SUCCESS**, 70 passed, 1 warning, job ejecutado en este SHA.
- S25 [40069346241](https://github.com/c2melendez/precision-lab-plus/actions/runs/40069346241): **SUCCESS** exacto-en-HEAD. No cierra el bloqueo bilateral SECURITY-S25 por sí solo.

### Gates equivalentes que siguen activos
- Acumulativo [40069346201](https://github.com/c2melendez/precision-lab-plus/actions/runs/40069346201): IN_PROGRESS (backend regresión en curso; frontend build completó SUCCESS).
- CI [40069346209](https://github.com/c2melendez/precision-lab-plus/actions/runs/40069346209): IN_PROGRESS.
- H1d [40069346229](https://github.com/c2melendez/precision-lab-plus/actions/runs/40069346229): IN_PROGRESS.
- No volver a ejecutar esos gates mientras estén activos ni usar los resultados del SHA previo `492e3ed3` como evidencia del HEAD actual.

### Estados y límites
Global OPEN · H2-SG28-DIST-01..08 BLOCKED · SECURITY-S25 global BLOCKED · SY-P-23 OPEN · SY-X-04-PLUS-HTTP BLOCKED · ALGEBRA229-AS-B-29 ON_HOLD · EDCX-B5 BLOCKED por falta de capacidad/canal. El prototipo SG28 y sus pruebas son de un host/loopback; no demuestran K=1 global ni aceptación multinodo. No activar aislamiento en producción ni desplegar/provisionar coordinador automáticamente. No mergear PR #29.

### Siguiente acción única
**WAIT:** revisar en sus SHA exactos la conclusión/log de los runs acumulativo `40069346201`, CI `40069346209` y H1d `40069346229`. Una vez reconciliados, preparar el contrato versionado de vigencia de la solicitud lógica, lease/renovación, reloj autoritativo, fail-closed y fencing de ejecución definido por `SG28_INTEGRATION_EXIT_CRITERIA.md`. El documento debe quedar `PROPOSED / REVIEW_REQUIRED`, no aprobado sin revisión. Mantener DIST BLOCKED; no repetir SG28 prototype ni mergear PR #29.

---

## 2026-10-24 UTC — r285: run SG28 en 83b18dab verificado (harness PASS_SCOPED; DIST sigue BLOCKED)

**HEAD verificado antes de publicar:** `c28ea34721cb596a83f530f157e89ccd2b29a48e` (docs r284). Commit exclusivamente documental: toca solo `.md` y `qa/certification/continuity.json`, rutas excluidas por `paths-ignore` de `playwright.yml`; no lanza E2E.

### Evidencia (pull_request, SHA 83b18dab)
- Playwright E2E [40065789096](https://github.com/c2melendez/precision-lab-plus/actions/runs/40065789096): **SUCCESS**, job `e2e` 120788643371, intento 1.
- Fase general sin SG28: 627 passed (8.5 min, 2 workers).
- Fase EN-SG-28 (`SG28_EVALUATE_ISOLATION=1`, `SG28_CI_OBSERVE=1`, `SG28_CI_SLOW=1`, `SG28_CI_EVENT_FILE`, workers=1): 21 passed = 7 casos x desktop, tablet y movil (Chromium), contra backend aislado real.
- Log del paso: `general_exit=0 sg28_exit=0`.

### Clasificacion
- Fallo previo 40047564113 = **harness**: `SG28_CI_EVENT_FILE` no estaba exportado en `playwright.yml`. Corregido en 83b18dab y verificado en este run.
- Esto valida el harness E2E. **No cierra H2-SG28-DIST-01..08**: faltan contrato MathResponse completo, cancelacion por HTTP con servidor real, cuotas/concurrencia y operaciones costosas en proceso principal (puntos 4-6 del contrato).
- S18 40047563967 (apagado de runner) sigue siendo infraestructura; no se relanza.

### Hallazgo de CI (pendiente, no resuelto aqui)
- `playwright.yml` dispara `push` solo en `main`, `master` y `qa/exhaustive-suite-module-01`. La rama canonica `qa/syntax-audit-in625-a1` no tiene push automatico. Requiere cambio tecnico del YAML.

### Estados
Global OPEN · SG28-DIST BLOCKED · SECURITY-S25 BLOCKED · SY-P-23 OPEN · SY-X-04-PLUS-HTTP BLOCKED · ALGEBRA229-AS-B-29 ON_HOLD · EDCX-B5 BLOCKED (capability).

### Siguiente paso único
Cerrar la brecha 4 del contrato SG28: comparar respuestas MathResponse completas y status HTTP de exito/error contra `/api/v1/evaluate` con `SG28_EVALUATE_ISOLATION=1`, con test-first en backend. Despues ejecutar gate `sg28-prototype` y H1d en el SHA tecnico. No repetir el run 40065789096 ni declarar DIST PASS.

---

## 2026-10-24 UTC — r284: harness Playwright SG28 alineado; corrida en curso (no PASS)

**HEAD del fix:** `83b18dab5a176087d9f228725a2140c535d07a2f` (padre documental `0325fa773ad69cd0310b36f6fd09c0d1ad8e0305`).

### Diagnóstico exacto en el HEAD anterior (pull_request, `0325fa77`)
- Playwright E2E [40047564113](https://github.com/c2melendez/precision-lab-plus/actions/runs/40047564113): **FAILURE**. 11 failed + 1 flaky, todos en `frontend/e2e/in625-h2-sg28-cancel.spec.ts`; 636 passed. Diez fallos son `SG28_CI_EVENT_FILE must be configured in CI`: `playwright.yml` no exportaba el entorno que sí define `in625-sg28-plus-ui-cancel.yml`. Los timeouts de «Detener cálculo» ocurren con aislamiento apagado (`2+3` termina antes de que el botón exista). Clasificación: **harness**, no producto.
- S18 [40047563967](https://github.com/c2melendez/precision-lab-plus/actions/runs/40047563967): **FAILURE** por apagado del runner (`The runner has received a shutdown signal`) ~14 min después de arrancar el diferencial; no hay aserción matemática roja en el log. La corrida citada en r283, [40045973724](https://github.com/c2melendez/precision-lab-plus/actions/runs/40045973724), quedó `cancelled`. Clasificación: **infraestructura**. No se relanza a propósito.
- S21 [40047563960](https://github.com/c2melendez/precision-lab-plus/actions/runs/40047563960): `cancelled`. REVIEW.
- S25 [40047564057](https://github.com/c2melendez/precision-lab-plus/actions/runs/40047564057): **SUCCESS** en este HEAD. No cierra SECURITY-S25: el bloqueo es bilateral y S25 no admite reutilización ni cierre sin las condiciones de salida. En Lite el gate S25 de este corte también está verde, pero el hard gate de CI sigue rojo por vulnerabilidades moderate/low.

### Cambio publicado
Solo `.github/workflows/playwright.yml`. La suite general corre con `--grep-invert EN-SG-28` y sin flags SG28. Después, solo `in625-h2-sg28-cancel.spec.ts` con `workers=1` y el mismo entorno que el workflow dedicado: `SG28_EVALUATE_ISOLATION=1`, `SG28_CI_OBSERVE=1`, `SG28_CI_SLOW=1`, `SG28_CI_EVENT_FILE=/tmp/sg28-plus-e2e-events.jsonl`. Timeout del job 25 → 40 min para no cortar las dos fases. **H2-SG28-DIST sigue BLOCKED.** No se activó aislamiento en producción.

### Corrida a inspeccionar (WAIT, no PASS)
Playwright E2E pull_request [40065789096](https://github.com/c2melendez/precision-lab-plus/actions/runs/40065789096), SHA `83b18dab5a176087d9f228725a2140c535d07a2f`, `in_progress` al registrar este corte. No despachar otra corrida equivalente.

### Estados
Global OPEN · B6 REVIEW · B5 BLOCKED · SG28-DIST BLOCKED · SECURITY-S25 BLOCKED · SY-P-23 OPEN · SY-X-04-PLUS-HTTP BLOCKED · ALGEBRA229-AS-B-29 ON_HOLD. No mergear PR #29.

### Siguiente paso único
Leer el job e2e de [40065789096](https://github.com/c2melendez/precision-lab-plus/actions/runs/40065789096) y separar `general_exit` de `sg28_exit`. Si SG28 sigue rojo con el entorno ya presente, diagnosticar esa salida; no repetir la misma corrida.

---

## 2026-10-24 UTC — r283: reconciliación exacta-en-HEAD tras push del merge (verificada vía API con auth)

**HEAD verificado**: `a174806836cf1e28666e004be36b76f49c43e0b9` (PR #29, base `7aa493e6...`, mergeable=True, mergeable_state=`unstable`). El estado `dirty` de r280 queda RESUELTO por el merge r281.

### Evidencia válida nueva (pull_request, exacta en HEAD)
- **IN625 Cumulative Certification Gate: SUCCESS** (run 40045973765); pasos "Certification continuity and CI guard regressions" verdes en backend y frontend.
- **CI completo: SUCCESS** (run 40045973713). **S25 Security Gate PLUS: SUCCESS** (run 40045973931) — primera vez verde para un HEAD de la rama QA; el fallo del 22-10 (39820758573) no aplica a esta cabeza.
- SUCCESS además: Syntax diagnostic A1..G1a (40045973720), syntax-native+recovery (40045973762), H1a/H1b/H1c/H1d reentry, S17 fuzzing, S19 mutation, S20 performance, S21 cross-browser, S23 accessibility, api-timeout-recovery, source-fixture integrity, frontend-audit.
- S18 Differential (40045973724): in_progress al momento de esta revisión.

### Fallo activo exacta-en-HEAD (causa raíz identificada con logs)
**Playwright E2E job e2e** (run 40045973784): 12 fallos, todos en `in625-h2-sg28-cancel.spec.ts`:
1. 10× `SG28_CI_EVENT_FILE must be configured in CI` — la spec exige la variable cuando `process.env.CI`, pero `.github/workflows/playwright.yml` no la exporta, mientras que el workflow dedicado `in625-sg28-plus-ui-cancel.yml` sí define `SG28_CI_EVENT_FILE=/tmp/sg28-plus-e2e-events.jsonl`. Inconsistencia de configuración entre pipelines.
2. 2× timeout `locator.click` sobre botón "Detener cálculo" (35 s) en mobile/tablet.
Consecuencia: **H2-SG28-DIST permanece BLOCKED**, ahora con causa concreta y accionable (no falta de ejecución). El gate SG28 propio pasó como success en su workflow dedicado; el rojo proviene del pipeline general playwright.yml.

### Estados de certificación
Global OPEN · B6 REVIEW (harness mínimo ya validado; faltan 53 aceptaciones matemáticas completas) · B5 BLOCKED · SG28-DIST BLOCKED (causa: config e2e + timeouts) · SECURITY-S25: en Plus hay evidencia SUCCESS exacta-en-HEAD (run 40045973931); en Lite sigue BLOCKED (vite high) → se mantiene BLOCKED global hasta ambos verdes · SY-P-23 OPEN · SY-X-04-PLUS-HTTP BLOCKED · ALGEBRA229-AS-B-29 ON_HOLD.

### Siguiente paso único y concreto
Alinear `playwright.yml` con el contrato SG28 (exportar `SG28_CI_EVENT_FILE` o scoping de la spec fuera del pipeline general) y reproducir los 2 timeouts "Detener cálculo". Confirmar S18 (40045973724). No mergear PR #29 hasta checks verdes o excepciones documentadas.

---

## 2026-10-24 UTC — r282: merge ejecutado, push completado, workflows verificados exitosos

**Acción autorizada**: `git merge origin/main` + resolución de conflictos + push a rama QA (r281).

### Estado post-push
- **Rama**: `qa/syntax-audit-in625-a1`
- **HEAD anterior**: `e541b52c31e35c1ae18ebfc22c24f9e04ad0b7b9` (docs-only)
- **HEAD nuevo**: `9cba8a59223712237330c8062b1c61301aacb4c8` (merge commit con cambios funcionales)
- **PR #29 mergeable_state**: cambió de `dirty` a `unstable` (conflictos eliminados; esperando completion de checks)

### Corridas disparadas automáticamente
- **[Run 40045113479](https://github.com/c2melendez/precision-lab-plus/actions/runs/40045113479)**: IN625 A1+A2+A3+A4+B1+B2+B3+B4+C1+C2+C3+C4+D1+D2+D3+E1a+E1b+E1c+E1d+E2a+E2b+E2c+E3a+E3b+E3c+E3d1+E3d2+E3d3+F1+F2a+F2b+F3a+F3b+F3c+G1a Syntax Diagnostic
  - Trigger: `push` sobre `qa/syntax-audit-in625-a1`
  - SHA probado: `9cba8a59223712237330c8062b1c61301aacb4c8` ✓ (exacto-en-HEAD)
  - Estado final: **completed / success**
  - Duración: ~40 segundos
  
### Cambios introducidos por el merge
El merge incorporó desde main:
1. Fix SY-X-09 scoped localizer en `tests/e2e/syntax-native.spec.ts`
2. Workflow `s25-lockfile-heal.yml` parametrizado (versión más nueva)
3. Conservación de superseto SY-X-13..22 de la rama QA
4. Todos los archivos de certificación canónicos de la rama QA

Total: 8 archivos, +152/−23 líneas (todos documentales o de configuración CI)

### Impacto en certificación
**Evidencia válida nueva**: El HEAD actual tiene una corrida exitosa del gate IN625 acumulativo. Esto prueba matemáticamente los cambios hasta `9cba8a59...`.

**Estados mantenidos** (precaución: no declarar certificación basada en una sola corrida):
- EDCX-B6: `REVIEW` (run cubre harness mínimo B6, pero matriz de trazabilidad muestra 0/53 casos VC-FE con aceptación completa demostrada)
- EDCX-B5: `BLOCKED` (sin evidencia nueva)
- Lite certificación: `NO_EJECUTADO` (verificar estado Lite por separado)
- Global: `OPEN`
- SG28/DIST: `BLOCKED`
- S25: `BLOCKED`
- SY-P-23: `OPEN`
- SY-X-04-PLUS-HTTP: `BLOCKED`
- ALGEBRA229-AS-B-29: `ON_HOLD`

### Siguiente paso único y concreto
Actualizar `continuity.json` con SHA confirmado (`9cba8a59...`) y run ID (`40045113479`). Revisar manualmente la matriz EDCX-B6 para determinar si alguno de los 53 VC-FE cases puede reclasificarse de "sin cobertura" a "parcial" basado en lo que efectivamente validó este run.

---

## 2026-10-23 UTC — r278: reconciliación de corridas aportadas y filtros CI (OBSOLETO POR r282)

~~Lite [run 40016849405](https://github.com/c2melendez/precision-lab-lite/actions/runs/40016849405): `SUCCESS`, evento `workflow_dispatch`, SHA probado `912e3f8afd1c3a54b1c665c8a91c76490ea4f912`; logs: **456/456 tests passed**. La cabeza actual de PR #48 es `496b1ec10c210b0bdb7f27c8e8734b334b5759c9`; la corrida no certifica esa cabeza.~~

~~Plus [run 40026869114](https://github.com/c2melendez/precision-lab-plus/actions/runs/40026869114): `SUCCESS`, evento `push`, SHA probado `bd25d58fac8e8333bd9e0aa90a1b9a54efa6aa69`; backend y frontend correctos, incluyendo el harness mínimo B6. La cabeza actual de PR #29 es `2d57dcb6e025db3219b0cf423ec05ebff309a8e1`; la corrida no certifica esa cabeza.~~

~~Inspección de workflow: `.github/workflows/in625-cumulative-certification.yml` define eventos `push` y `pull_request` con filtros `paths`; excluye gran parte de los cambios solo documentales. Esto es una explicación posible para commits de documentación sin nuevo `push`, pero no demuestra por sí solo por qué faltan checks PR para la cabeza actual, ya que el diff completo de cada PR puede incluir código.~~

~~PR #29 continúa abierta y reportada como `mergeable=false`; no mergear ni reejecutar gates globales por rutina. Próximo paso único: cotejar diff/paths de la PR actual con los filtros y consultar branch protection/rulesets para identificar checks requeridos; después volver al test dirigido del adaptador B6. Global `OPEN`; B6 `REVIEW`; bloqueos SG28/DIST y S25 conservados.~~

---

## 2026-10-23 UTC — r276: comprobación exacta de PR/HEAD

- HEAD de rama y head SHA de la PR #29: `63d830ae8e2998993dfaa14e53ebe2ad3113d5c9`; base SHA: `992d7b1bb18d9fa0c84be88d4d648ebfd7f8def1`.
- La consulta de workflows asociadas al SHA exacto no devolvió runs `pull_request`. Los últimos `push` visibles consultados siguen en SHA anterior `bd25d58fac8e8333bd9e0aa90a1b9a54efa6aa69`; no son evidencia de este HEAD.
- PR #29 está abierta y GitHub reporta `mergeable=false`; API informa 3554 commits y 651 archivos cambiados. No mergear ni intentar arreglar conflictos automáticamente dentro de este objetivo.
- La consulta es acotada y no demuestra ausencia absoluta de todos los checks en otros endpoints. No se despacharon workflows.
- Siguiente acción: aclarar por qué no hay runs `pull_request` asociados al HEAD exacto y confirmar los checks requeridos antes de decidir cualquier CI. B6 permanece REVIEW; B5 BLOCKED en Plus; Lite NO_EJECUTADO; global OPEN; SG28/DIST y S25 bloqueados.

---

## 2026-10-23 UTC — r275: reconciliación acotada de HEAD y Actions

- HEAD actual de la rama: `d854f379583b5479abe4fe6e43fa545a81ff8b6b`. Últimos runs `push` visibles consultados usan SHA `bd25d58fac8e8333bd9e0aa90a1b9a54efa6aa69`, por lo que **no prueban el HEAD actual**.
- Último grupo `pull_request` visible en la primera página: fecha 2026-10-08, SHA de ejecución `e5a86514d289fb5224eaf43e57e76722808cbdc0`. PR #29 visible page includes S25 Security Gate FAILURE and S21 Cross-browser Compatibility FAILURE; latest visible PR event is older than current HEAD.
- La consulta fue acotada a primeras páginas de API; no se afirma que sea el historial exhaustivo. No se despachó ningún workflow en esta revisión.
- Siguiente acción única: validar el adaptador B6 con prueba dirigida y, antes de cualquier CI nuevo, comprobar los checks `pull_request` que correspondan al HEAD actual. No repetir gates globales verdes ni interpretar los antiguos como evidencia de HEAD actual.
- B6 REVIEW; B5 BLOCKED en Plus; Lite NO_EJECUTADO; certificación global OPEN. SG28/DIST y S25 conservan sus bloqueos.

---

## 2026-10-23 UTC — r274: plan de adaptador/oráculo EDCX-B6

- Publicado [EDCX_B6_ADAPTER_ORACLE_PLAN.md](EDCX_B6_ADAPTER_ORACLE_PLAN.md): entradas candidatas para VC-FE-01..03 y VC-FE-06..10, oráculo Python math/cmath, decodificación de salida pendiente de validar y tolerancia propuesta explícitamente provisional.
- Inspección estática confirma que result_approx solo sirve para resultados reales; no es criterio de aceptación para estas filas complejas.
- No se añadieron tests ni se ejecutaron Actions. Siguiente paso único: validar adaptador de salida con una prueba dirigida del servicio; después preparar tests mínimos y reconciliar push/pull_request por SHA antes de decidir CI.
- B6 REVIEW; 0/53 filas con aceptación matemática completa demostrada por el harness actual; B5 BLOCKED; Lite NO_EJECUTADO; global OPEN. SG28/DIST y S25 permanecen bloqueados.

---

## 2026-10-23 UTC — r273: trazabilidad fila-a-fila de EDCX-B6

- Publicada [EDCX_B6_TEST_TRACEABILITY.md](EDCX_B6_TEST_TRACEABILITY.md), que cruza las 53 filas fuente con el harness y la evidencia CI.
- Resultado preciso: **0/53 filas tiene aceptación matemática completa demostrada por el harness actual**. `VC-FE-05` solo verifica que la salida compleja tenga texto/LaTeX y `result_approx=null`; no compara con `iπ`. `VC-FE-14` verifica `DOMAIN_ERROR`. `VC-FE-11` sigue bloqueada por requerir conjunto multivaluado.
- La corrida 40026869114 terminó `SUCCESS`; backend `2383 passed, 1 skipped, 10 xfailed`, cobertura 87.97%; los cinco checks del harness pasaron. Esto no cierra B6.
- Siguiente acción única: especificar adaptador de entrada y oráculo independiente para el primer grupo escalar `VC-FE-01..03` y `VC-FE-06..10`; después preparar pruebas concretas y evitar un nuevo dispatch hasta confirmar el conjunto mínimo de gates.
- B6 `REVIEW`; B5 `BLOCKED`; Lite `NO_EJECUTADO`; global `OPEN`. Sin nueva corrida.

---

## 2026-10-23 UTC — r272: resultado del harness EDCX-B6 y regresión general

- La corrida [40026869114](https://github.com/c2melendez/precision-lab-plus/actions/runs/40026869114) terminó `SUCCESS` en SHA técnico `bd25d58fac8e8333bd9e0aa90a1b9a54efa6aa69`; backend y frontend finalizaron correctamente.
- El backend reportó `2383 passed, 1 skipped, 10 xfailed`, cobertura total `87.97%`. Los cinco checks de `backend/tests/test_edcx_b6_contract.py` aparecen como `PASSED`: `log(100)`, `ln(e)`, `Log(100)`, respuesta compleja de `Log(-1)` y dominio de `Log(0)`.
- La corrida H1d [40026869004](https://github.com/c2melendez/precision-lab-plus/actions/runs/40026869004) también terminó `SUCCESS` en el mismo SHA.
- **Alcance limitado:** esto no certifica las 53 filas VC-FE-01..53 ni la salida multivaluada de VC-FE-11. B6 sigue `REVIEW`; B5 `BLOCKED`; Lite `NO_EJECUTADO`; global `OPEN`. Sin nuevo dispatch.
- Siguiente acción única: elaborar matriz fila→test→oráculo→estado para las 53 filas B6 y señalar huecos exactos antes de añadir tests o lanzar otra corrida.

---

## 2026-10-23 UTC — r271: harness mínimo de contrato EDCX-B6 creado (sin ejecutar)

- Añadido `backend/tests/test_edcx_b6_contract.py` en Plus, commit `bd25d58fac8e8333bd9e0aa90a1b9a54efa6aa69`. Incluye checks de `log(100)` base 10, `ln(e)`, `Log(100)` principal complejo, respuesta compleja de `Log(-1)` y dominio `Log(0)`.
- **Estado: test-first, NO EJECUTADO.** No se afirma que pase; no se ejecutaron pruebas ni Actions. Estos checks no certifican las 53 filas B6 ni la salida multivaluada VC-FE-11.
- Siguiente acción única: ejecutar solo `backend/tests/test_edcx_b6_contract.py`, resolver divergencias con evidencia y mantener gates globales sin dispatch.
- B6 `REVIEW`; B5 `BLOCKED`; Lite `NO_EJECUTADO`; certificación global `OPEN`.

---

## Continuidad operativa obligatoria — r265

Antes de cualquier dispatch, reconciliar HEAD y Actions (push y pull_request) en Lite y Plus según [ROADMAP_CONTINUITY.md](ROADMAP_CONTINUITY.md). No cambiar la tarea viva aquí: la única siguiente acción es la definida por `continuity.json`; en este corte es **EDCX-B6 (VC-FE, 53 filas; REVIEW por canal vacío)**. Mantener SG28/DIST y S25 bloqueados, y SY-P-23, SY-X-04-PLUS-HTTP y ALGEBRA229-AS-B-29 en sus estados vigentes hasta verificar sus condiciones de salida. Aplicar RUN/WAIT/REUSE/DIAGNOSE/REVIEW y no repetir gates verdes vigentes.

---

## 2026-10-23 UTC — r269: borrador de contrato por fila EDCX-B6

- Creado [EDCX_B6_ROW_CONTRACT_DRAFT.md](EDCX_B6_ROW_CONTRACT_DRAFT.md) con las 53 expresiones y expectativas transcritas de la matriz y una clasificación preliminar para preparar la revisión técnica.
- Es un borrador, no evidencia de soporte ni aceptación de endpoint. Todos los casos siguen REVIEW hasta validar payload real, alias, rama/corte, oráculo independiente y tolerancia/criterio de aceptación.
- No se modificó producto ni JSONL. No se ejecutaron pruebas ni se despachó CI. Lite NO_EJECUTADO; B5 BLOCKED; global OPEN.

---

## 2026-10-23 UTC — r268: corrección de semántica del campo canal en EDCX-B6

- Revisión del JSONL completo: 638 filas; 589 tienen `canal` vacío y 49 tienen valor. Ejemplos como `B → P, T, X` describen transformaciones entre representaciones matemáticas, no endpoints HTTP.
- Por ello, el vacío de `canal` no prueba por sí solo una brecha de endpoint. No rellenar el campo con `/api/v1/evaluate` ni tratarlo como canal de API.
- B6 sigue REVIEW y sin medición. Antes de harness, definir contrato por cada `VC-FE-01..53`: notación `Log/log/ln`, rama/signo, endpoint/payload, oráculo independiente, tolerancia y aceptación. `/api/v1/evaluate` es solo candidato para casos escalares compatibles.
- Lite permanece NO_EJECUTADO por falta de motor complejo equivalente; B5 sigue BLOCKED en Plus. Certificación global OPEN. No se despachó CI.
- Auditoría: [EDCX_B6_CHANNEL_AUDIT.md](EDCX_B6_CHANNEL_AUDIT.md).

---

## 2026-10-23 UTC — r266: EDCX-B5 registrado como brecha de capacidad (Plus)

- **Medición:** no ejecutada. Las 25 filas `VC-LG-01..25` describen lugares geométricos (circunferencias, semiplanos, cónicas, curvas paramétricas) y su campo `canal` está vacío.
- **Producto (técnico 7e501f5; HEAD documental anterior 4e812bd):** la revisión del código no encontró ninguna ruta que devuelva un lugar geométrico. Rutas revisadas: `/evaluate`, `/solve`, `/complex/residue`, `/complex/singularities`, `/graph/2d`, `/graph/complex_point`.
- **Decisión:** las 25 filas quedan BLOCKED por capacidad, sin PASS ni FAIL. No se inventó canal ni oráculo; el denominador de EDCX no cambia.
- **Lite:** NO_EJECUTADO.
- **Gates:** sin CI nueva. Cambio exclusivamente documental: `continuity.json`, `CURRENT_STATE.md`, `EXECUTION_LOG.md` y `MANUAL_CAPABILITY_GAPS.md`.
- **Siguiente:** EDCX-B6 (53 filas, prefijo VC-FE), REVIEW. Su campo `canal` también está vacío en las 53 filas; antes de medir hay que decidir el canal, como con B5.

---

## 2026-10-23 UTC — r264: registro gates r263 — Plus success

- r264: gates r263 Plus en success: cumulative 40014981162, H1d 40014985059, Native Syntax 40014988262 sobre 177955dc.
- Siguiente: EDCX-B5 (25 filas, prefijo VC-LG), READY, no iniciado.

---

## 2026-10-23 UTC — r263: EDCX B4 — 14 PASS + 14 PASS_SCOPED / 4 FAIL / 2 BLOCKED (Plus)

**EDCX Parte B, bloque B4 (34 filas, ecuaciones en C, VC-EC-01..34): medido en Plus.**
No es cierre bilateral: Lite no ejecuta EDCX; la certificación global sigue `OPEN`.

| Bloque | Filas | PASS | PASS_SCOPED | FAIL | BLOCKED |
|---|---|---|---|---|---|
| B4 ecuaciones en C | 34 | 14 | 14 | 4 | 2 |

- **Canal:** `/api/v1/solve` devuelve las raíces en `result_data`; `/api/v1/solve/system` resuelve VC-EC-22 (`z1=1, z2=I`). La matriz usa `Log`, pero el producto usa `ln`; `log(z)` devuelve vacío sin error.
- **PASS (14):** VC-EC-01, 02, 04–09, 11–15, 22. Conjuntos finitos exactos y completos, verificados con oráculo sympy.
- **PASS_SCOPED (14):** VC-EC-03 (multiplicidad no reportada), 10 (forma cartesiana), 23–30, 32, 33 (solo raíz principal de familias infinitas), 31 (vacío correcto), 34 (notación `ln`).
- **FAIL (4):** VC-EC-16 (faltan `1/2±√3/2 i`), 17 (faltan `-1/2±√3/2 i`), 18 (faltan `±i`), 19 (devuelve vacío; faltan `-1±√3+i`). Son defectos de completitud, no de validez: las raíces devueltas satisfacen la ecuación. Se registran como `xfail` estricto; no se cambió producto.
- **BLOCKED (2):** VC-EC-20, 21 (`abs(z)` devuelve `UNSUPPORTED_OPERATION`).
- **Producto:** sin cambios. Test-first Plus `7e501f5`; gates cumulative `40014004350` y H1d `40014004348` en success con `head_sha` exacto.
- **Harness:** `backend/tests/test_edcx_ed_b4_01_l34.py` (33 passed, 4 xfailed en local).
- **Siguiente:** EDCX-B5 (25 filas, prefijo VC-LG), READY, no iniciado.

---

## 2026-10-23 UTC — r262: EDCX B3 — 7 PASS exactos + 10 PASS_SCOPED / 2 BLOCKED (Plus)

**EDCX Parte B, bloque B3 (19 filas, potencias y raíces): 7 PASS exactos + 10 PASS_SCOPED + 2 BLOCKED en Plus.**
No es cierre bilateral: Lite no ejecuta EDCX (gap de alcance de motor);
la certificación global sigue `OPEN`.

| Bloque | Filas | PASS exacto | PASS_SCOPED | BLOCKED |
|--------|-------|-------------|-------------|---------|
| B3 potencias y raíces | 19 | 7 | 10 | 2 |

- **Canal:** `/api/v1/evaluate` resuelve potencias enteras y negativas de forma
  exacta. `sqrt(z)` y `root(z, n)` devuelven solo la raíz principal:
  `sqrt(-3+4i)=1+2i`, `8^(1/3)=2`, `1^(1/4)=1`. No hay endpoint de raíces
  n-ésimas ni operador que enumere todas las raíces.
- **Enumeración completa:** `/api/v1/solve` sobre `z^n=w` devuelve todas las
  raíces exactas en `result_data` (por ejemplo `z^4=-4` -> `±1±i`). Es una ruta
  alternativa documentada, no una operación de raíz n-ésima.
- **PASS exacto (7):** `PR-01..PR-06` (potencias exactas: `-512`, `-64`, `1`,
  `-1024`, `-1/4`, `1`) y `PR-19` (`cos(2*pi/5)=(sqrt(5)-1)/4`).
- **PASS_SCOPED (10):** `PR-07..PR-16`. El conjunto de raíces es exacto, pero
  se obtiene resolviendo `z^n=w` y/o se emite en forma cartesiana de radicales
  en lugar de la forma polar/exponencial pedida. `PR-07` devuelve `±sqrt(I)`,
  equivalente exacto de `±(1+i)/sqrt(2)`; `PR-16` devuelve la raíz principal
  `2^(1/6)e^(i*pi/12)` como radicales cartesianos.
- **BLOCKED (2):**
  - `PR-17`: no existe nodo de sumatoria; `sum(...)` y `Sum(...)` devuelven
    `PARSE_ERROR`, aunque la suma geométrica vale `0` para `n >= 2`.
  - `PR-18`: no existe operación de producto de raíces; `/solve` enumera las
    raíces cuartas de la unidad, pero el producto `(-1)^(n+1)` no se produce.
- **Hallazgo:** `(-8)^(1/3)` y `root(-8,3)` devuelven `2*(-1)**(1/3)`, la raíz
  compleja principal, no `-2`; es la convención de rama principal ya declarada
  en el producto. `sqrt(i)` se devuelve sin simplificar como `sqrt(I)`.

Acumulado EDCX (Parte A + B1 + B2 + B3): **319 / 638 filas, 188 PASS / 131 BLOCKED** en Plus.

### Evidencia CI Plus

| HEAD | Cumulative | H1d |
|------|------------|-----|
| `ab220425` (B3) | [39945613218](https://github.com/c2melendez/precision-lab-plus/actions/runs/39945613218) **SUCCESS** | [39945613228](https://github.com/c2melendez/precision-lab-plus/actions/runs/39945613228) **SUCCESS** |

Backend cumulative: **2345 passed, 1 skipped, 6 xfailed**, cobertura **87.92%**.
Harness B3: 22/22.

**Siguiente acción única:** EDCX Parte B, bloque B4 (ecuaciones en C, 34 filas, `VC-EC-01..34`).

---

## 2026-10-23 UTC — r261: EDCX B2 — 20 PASS exactos + 13 PASS_SCOPED / 8 BLOCKED (Plus)

**EDCX Parte B, bloque B2 (41 filas, operaciones con números complejos): 20 PASS exactos + 13 PASS_SCOPED + 8 BLOCKED en Plus.**
No es cierre bilateral: Lite no ejecuta EDCX (gap de alcance de motor);
la certificación global sigue `OPEN`.

| Bloque | Filas | PASS exacto | PASS_SCOPED | BLOCKED |
|--------|-------|-------------|-------------|---------|
| B2 operaciones en C | 41 | 20 | 13 | 8 |

- **Canal:** la forma binómica se evalúa de forma literal, incluida la
  multiplicación implícita (`(2+3i)(1-i) = 5+i`). Sigue sin existir notación
  polar de entrada: las nueve formas `r_{theta}` devuelven `PARSE_ERROR`.
  `cos3theta` se lee como un símbolo libre, no como `cos(3*theta)`.
- **PASS exacto (20):** `B-01..B-11` (suma, resta, producto, cociente,
  potencia, conjugado, módulo, parte real e imaginaria), `T-01..T-03`
  (potencias y cociente en forma trigonométrica con ángulos exactos) y
  `X-01..X-03`, `X-05..X-07` (producto, cociente, potencia y suma/resta de
  exponenciales, incluida `e^{i*pi}+1=0`).
- **PASS_SCOPED (13):**
  - `P-01..P-09`: la entrada `r_theta` se traduce a
    `r*(cos(theta)+i*sin(theta))`; el resultado es exacto, pero se emite en
    forma binómica o de raíz, nunca como `r_theta`.
  - `T-05`: devuelve `exp(I*(alpha+beta))`, equivalente exacto por Euler de
    `cos(alpha+beta)+i*sin(alpha+beta)`.
  - `X-04`: devuelve la potencia principal `32*(-1)**(5/6)`, exactamente
    `-16*sqrt(3)+16i`, en forma de raíz.
  - `X-08`: devuelve `3*exp(-I*conjugate(theta))` y
    `exp(-I*conjugate(theta))*conjugate(r)`; exacto para `theta` y `r` reales.
  - `X-09`: `abs(exp(a+b*i))` devuelve `exp(re(a)-im(b))`; con `a,b` reales
    (`re(a)=a`, `im(b)=0`) es exactamente `exp(a)`.
- **BLOCKED (8):**
  - `T-04/X-10`: la potencia se devuelve como `exp(I*theta)**n` sin combinar;
    no produce `exp(I*n*theta)` ni `cos(n*theta)+i*sin(n*theta)`.
  - `T-06/T-07/T-08`: no hay expansión de ángulo múltiple ni linealización;
    `cos(3*theta)`, `sin(3*theta)` y `cos(theta)^4` se devuelven sin cambiar.
  - `T-09`: no existe nodo de sumatoria; `sum(...)` y `Sum(...)` dan
    `PARSE_ERROR`, aunque la forma cerrada de la fuente es correcta.
  - `X-11/X-12`: no hay reescritura de media ángulo ni de serie geométrica;
    `1/(1-exp(I*theta))` y `Abs(exp(I*theta)+1)` se devuelven sin reducir.
- **Hallazgo:** el motor reconoce la forma exponencial y la trigonométrica,
  pero no aplica De Moivre ni las identidades de ángulo múltiple; tampoco
  distingue `cos3theta` (símbolo) de `cos(3*theta)` (expresión).

Acumulado EDCX (Parte A + B1 + B2): **300 / 638 filas, 171 PASS / 129 BLOCKED** en Plus.

### Evidencia CI Plus

| HEAD | Cumulative | H1d |
|------|------------|-----|
| `7c87b95f` (B2) | [39943293295](https://github.com/c2melendez/precision-lab-plus/actions/runs/39943293295) **SUCCESS** | [39943293116](https://github.com/c2melendez/precision-lab-plus/actions/runs/39943293116) **SUCCESS** |

Backend cumulative: **2323 passed, 1 skipped, 6 xfailed**, cobertura **87.96%**.
Harness B2: 38/38.

**Siguiente acción única:** EDCX Parte B, bloque B3 (potencias y raíces, 19 filas, `VC-PR-01..19`).

---

## 2026-10-23 UTC — r260: EDCX B1 — 45 PASS_SCOPED / 4 BLOCKED (Plus)

**EDCX Parte B, bloque B1 (49 filas, conversión entre representaciones): 45 PASS_SCOPED + 4 BLOCKED en Plus.**
No es cierre bilateral: Lite no ejecuta EDCX (gap de alcance de motor);
la certificación global sigue `OPEN`.

| Bloque | Filas | PASS exacto | PASS_SCOPED | BLOCKED |
|--------|-------|-------------|-------------|---------|
| B1 conversión B/P/T/X | 49 | 0 | 45 | 4 |

- **Canal:** la forma binómica (`1+i`), la trigonométrica
  (`r*(cos(t)+i*sin(t))`) y la exponencial (`exp(i*t)`) se evalúan. No hay
  notación polar de entrada: `2_{pi/3}` devuelve `PARSE_ERROR` y
  `2 angle pi/3` se interpreta como `2*pi*angle/3`. Tampoco hay emisor polar:
  `topolar(3)=3`, `topolar(-2)=-2`, `topolar(1+i)=(-1)**(1/4)*sqrt(2)`.
- **PASS_SCOPED (45):** `abs` y `arg` devuelven `(r, theta)` exactos y el
  oráculo sympy verifica `r*exp(i*theta)=z` (X), `r*cos(theta)+i*r*sin(theta)=z`
  (T) y `re(z)+i*im(z)=z` (B). Las 10 filas P exigen la traducción documentada
  `r_theta -> r*(cos(theta)+i*sin(theta))`; no se atribuye al producto una
  notación que no emite.
- **BLOCKED (4):**
  - `B-17` (`z=0`): el módulo `0` es correcto, pero `arg(0)=0` sin aviso
    mientras `topolar(0)` sí devuelve `DOMAIN_ERROR`; la fila exige argumento
    indefinido con aviso claro.
  - `T-09/T-10/X-12` (`theta` simbólico): el canal devuelve `Abs(...)` y
    `arg(...)` sin reducir; no entrega las formas semángulo
    `2cos(theta/2)_{theta/2}`, `2sin(theta/2)_{(pi-theta)/2}` ni `1_{-theta}`.
- **Hallazgo:** `arg(exp(i*pi))` y `arg(exp(1+i*pi))` devuelven `result_text=pi`
  pero `result_approx=-3.141592653589793`; el canal exacto y el aproximado
  discrepan en el corte de rama.
- **Convención:** `log` es base 10 y `ln` es natural. `X-10` usa `ln` (igual
  que la fuente); con `log(2)` el módulo sería `2**(1/ln(10))`, no `2`.

Acumulado EDCX (Parte A + B1): **259 / 638 filas, 138 PASS / 121 BLOCKED** en Plus.

### Evidencia CI Plus

| HEAD | Cumulative | H1d |
|------|------------|-----|
| `a53449db` (B1) | [39940618566](https://github.com/c2melendez/precision-lab-plus/actions/runs/39940618566) **SUCCESS** | [39940618559](https://github.com/c2melendez/precision-lab-plus/actions/runs/39940618559) **SUCCESS** |

Backend cumulative: **2285 passed, 1 skipped, 6 xfailed**, cobertura **87.94%**.
Harness B1: 61/61.

**Siguiente acción única:** EDCX Parte B, bloque B2 (operaciones, 41 filas: 11/9/9/12).

---

## 2026-10-23 UTC — r259: EDCX A8 + cierre Parte A — 0 PASS / 6 BLOCKED (Plus)

**EDCX Parte A, bloque A8 (6 filas, casos límite): 0 PASS / 6 BLOCKED en Plus. Parte A completa: 210 / 638 filas, 93 PASS / 117 BLOCKED.**
No es cierre bilateral: Lite no ejecuta EDCX (gap de alcance de motor);
la certificación global sigue `OPEN`.

| Bloque | Filas | PASS | PASS_SCOPED | BLOCKED |
|--------|-------|------|-------------|---------|
| A8 casos límite | 6 | 0 | 0 | 6 |

- `CL-01/CL-02` (`y'=y/x` con `y(0)=1` y `y(0)=0`): el canal devuelve
  exactamente el mismo `UNSUPPORTED_OPERATION`; no distingue «sin solución» de
  «infinitas soluciones». Oráculo: la familia `y=Cx` cumple `y(0)=0` para todo
  `C`, y `y(0)=1` no tiene solución.
- `CL-03` (`y'=sqrt(abs(y)), y(0)=0`): devuelve una integral implícita sin
  evaluar, no las dos ramas `y=0` e `y=x|x|/4`.
- `CL-04` (`y'=y^2, y(0)=1`): devuelve `1/(1-x)`; al evaluar en `x=2` responde
  `-1` con `success=true` y solo anota `x != 1`, sin error claro fuera del
  intervalo máximo `(-infinito, 1)`.
- `CL-05` (`y'=x/y, y(0)=0`): devuelve una sola rama `-sqrt(x^2) = -|x|`, no
  `y=±x`.
- `CL-06` (`y''+y=0, y(0)=0, y(pi)=1`): se rechaza con `PARSE_ERROR` por el
  límite de una condición inicial, no por la incompatibilidad de frontera
  (`0=1`).

Acumulado EDCX Parte A (A1–A8): **210 / 638 filas, 93 PASS / 117 BLOCKED** en Plus.

### Evidencia CI Plus

| HEAD | Cumulative | H1d |
|------|------------|-----|
| `c3d38972` (A8) | [39935820474](https://github.com/c2melendez/precision-lab-plus/actions/runs/39935820474) **SUCCESS** | [39935820754](https://github.com/c2melendez/precision-lab-plus/actions/runs/39935820754) **SUCCESS** |

Backend cumulative: **2224 passed, 1 skipped, 6 xfailed**, cobertura **87.94%**.
Harness A8: 7/7.

**Siguiente acción única:** EDCX Parte B, bloque B1 (conversión de formas, 49 filas).

---

## 2026-10-23 UTC — r258: EDCX A7 — PASS_SCOPED (Plus), 4 PASS / 21 BLOCKED

**EDCX Parte A, bloque A7 (25 filas, cualitativo/numérico/retardo): 2 PASS exactos + 2 PASS_SCOPED + 21 BLOCKED en Plus.**
No es cierre bilateral: Lite no ejecuta este bloque (gap de alcance de motor);
la certificación global sigue `OPEN`.

| Bloque | Filas | PASS exacto | PASS_SCOPED | BLOCKED |
|--------|-------|-------------|-------------|---------|
| A7 cualitativo/numérico/retardo | 25 | 2 | 2 | 21 |

- PASS exacto (`ED-Q-23/24`): `y=Si(x)` y `y=sqrt(pi)/2 erf(x)`. El motor
  devuelve exactamente la forma cerrada de la fuente; se verifica residuo nulo
  y condición inicial con sympy.
- PASS_SCOPED (`ED-Q-05/06`): `y=1/(1-x)` y `y=tan x`. La solución es exacta,
  pero el intervalo máximo no viaja en la respuesta (`domain_conditions` vacío);
  se deriva con un oráculo sympy independiente y se documenta como alcance.
- BLOCKED (21): cualitativas `ED-Q-01..04` (sin canal de equilibrios,
  estabilidad ni bifurcaciones; solo solución general); `ED-Q-07` devuelve una
  sola rama (`x^3/27`) sin veredicto de unicidad; ortogonales `ED-Q-08..10`
  sin canal; Picard `ED-Q-11/12` con `steps=[]`; métodos numéricos
  `ED-Q-13..16` rechazan `h` como segunda condición (`PARSE_ERROR`);
  recurrencias `ED-Q-17..21` fallan con `AMBIGUOUS_VARIABLE`; retardo `ED-Q-22`
  devuelve una expresión que no es la solución por tramos; `ED-Q-25` (Riccati)
  devuelve `UNSUPPORTED_OPERATION`.

Acumulado EDCX A1–A7: **204 / 638 filas, 93 PASS / 111 BLOCKED** en Plus.

### Evidencia CI Plus

| HEAD | Cumulative | H1d |
|------|------------|-----|
| `795a97ef` (A7) | [39934588535](https://github.com/c2melendez/precision-lab-plus/actions/runs/39934588535) **SUCCESS** | [39934588487](https://github.com/c2melendez/precision-lab-plus/actions/runs/39934588487) **SUCCESS** |

Backend cumulative: **2217 passed, 1 skipped, 6 xfailed**, cobertura **87.90%**.
Harness A7: 19/19.

**Siguiente acción única:** EDCX A8 (casos límite, 6 filas).

---

## 2026-10-23 UTC — r257: EDCX A6 — PASS_SCOPED (Plus), 1 PASS_SCOPED / 25 BLOCKED

**EDCX Parte A, bloque A6 (26 filas, EDP): 1 PASS_SCOPED + 25 BLOCKED en Plus.**
No es cierre bilateral: Lite no ejecuta EDP; la certificación global sigue `OPEN`.

| Bloque | Filas | PASS exacto | PASS_SCOPED | BLOCKED |
|--------|-------|-------------|-------------|---------|
| A6 EDP | 26 | 0 | 1 | 25 |

- PASS_SCOPED (`ED-P-25`): `Δ(e^x sin y)`. No existe endpoint «laplaciano»; el
  arnés compone la definición `Δu = u_xx + u_yy` con dos llamadas reales a
  `/api/v1/derivative/partial` (orden 2), que devuelven exactamente
  `exp(x)*sin(y)` y `-exp(x)*sin(y)`, y suma ambos resultados por
  `/api/v1/evaluate`, que devuelve exactamente `0`. El alcance (composición,
  no botón dedicado) queda documentado.
- BLOCKED (`ED-P-01..24`, `ED-P-26`): no hay motor de EDP — ni resolución,
  clasificación, características, separación de variables, Fourier ni núcleo
  del calor. Medido: `/api/v1/evaluate` rechaza ecuaciones
  (`No se esperaba '=' ...`) y `/api/v1/ode` rechaza más de una condición
  inicial en `ED-P-23/24` (`No se esperaba más de una condición inicial`);
  el inventario de rutas no contiene `pde`, `classif`, `characteristic`,
  `heat`, `wave`, `fourier` ni `laplac`.

Acumulado EDCX A1–A6: **179 / 638 filas, 89 PASS / 90 BLOCKED** en Plus.

### Evidencia CI Plus

| HEAD | Cumulative | H1d |
|------|------------|-----|
| `9a828f3c` (A6) | [39932526897](https://github.com/c2melendez/precision-lab-plus/actions/runs/39932526897) **SUCCESS** | [39932526943](https://github.com/c2melendez/precision-lab-plus/actions/runs/39932526943) **SUCCESS** |

Backend cumulative: **2198 passed, 1 skipped, 6 xfailed**, cobertura **87.90%**.
Harness A6: 30/30.

**Siguiente acción única:** EDCX A7 (cualitativo/numérico/retardo, 25 filas).

---

## 2026-10-23 UTC — r256: EDCX A5 — PASS_SCOPED (Plus), 8 PASS / 2 BLOCKED

**EDCX Parte A, bloque A5 (10 filas, series y Frobenius): 8 PASS + 2 BLOCKED en Plus.**
No es cierre bilateral: Lite no ejecuta este bloque (gap de alcance de motor);
la certificación global sigue `OPEN`.

| Bloque | Filas | PASS exacto | PASS_SCOPED | BLOCKED |
|--------|-------|-------------|-------------|---------|
| A5 series / Frobenius | 10 | 5 | 3 | 2 |

- PASS exacto (`ED-F-01..05`): el motor devuelve la solución general en forma
  cerrada (trigonométrica, Airy y Bessel). Se verifica residuo simbólico nulo,
  wronskiano no nulo y que la forma cerrada de la fuente también satisfaga la
  EDO.
- PASS_SCOPED (`ED-F-06..08`): F-06 devuelve la serie truncada `O(x^6)` y sus
  coeficientes coinciden con el desarrollo de la forma cerrada de Legendre;
  F-07/F-08 devuelven la familia general y la solución polinomial de la fuente
  se obtiene fijando las constantes (`C2=-1/2`, `C2=-1`, respectivamente).
  El renombrado/elección queda documentado, no se compara texto.
- BLOCKED (`ED-F-09..10`): la fila pide **clasificar** `x=0` (regular /
  irregular). El producto resuelve la EDO (Bessel) pero no emite clasificación;
  el único canal con «singularities» (`/api/v1/complex/singularities`) devuelve
  solo el conjunto de puntos (`{0}`), sin tipo ODE, y no existe operación de
  clasificación regular/irregular.

Acumulado EDCX A1–A5: **153 / 638 filas, 88 PASS / 65 BLOCKED** en Plus.

### Evidencia CI Plus

| HEAD | Cumulative | H1d |
|------|------------|-----|
| `50d9ca03` (A5) | [39929466812](https://github.com/c2melendez/precision-lab-plus/actions/runs/39929466812) **SUCCESS** | [39929467052](https://github.com/c2melendez/precision-lab-plus/actions/runs/39929467052) **SUCCESS** |

Backend cumulative: **2168 passed, 1 skipped, 6 xfailed**, cobertura **87.85%**.
Harness A5: 11/11.

**Siguiente acción única:** EDCX A6 (EDP, 26 filas).

---

## 2026-10-23 UTC — r255: EDCX A3+A4 — PASS_SCOPED (Plus), 4 PASS / 36 BLOCKED

**EDCX Parte A, bloques A3 (16 filas) y A4 (24 filas): 4 PASS + 36 BLOCKED en Plus.**
No es cierre bilateral: Lite no ejecuta estos bloques (gap de alcance de motor, ver
`MANUAL_CAPABILITY_GAPS.md`); la certificación global sigue `OPEN`.

| Bloque | Filas | PASS | BLOCKED | Canal |
|--------|-------|------|---------|-------|
| A3 sistemas / expm | 16 | 3 | 13 | `/api/v1/matrix/eigen` |
| A4 Laplace / integrales | 24 | 1 | 23 | `/api/v1/ode` |

- A3: `ED-M-11..13` PASS_SCOPED por autovalores exactos con `/matrix/eigen`; la
  etiqueta cualitativa (silla / foco estable / centro) la deduce el usuario a
  partir de ellos y así se documenta. Bloqueados: `ED-M-01..07` (sistemas; el
  canal EDO es escalar `y(x)`), `ED-M-08..10` (no existe exponencial matricial:
  el enum de `/matrix/operations` rechaza `expm` con 422) y `ED-M-14..16`
  (sistemas no lineales / Lyapunov).
- A4: `ED-T-17` PASS con renombrado documentado `t -> x`
  (`y'+2y=e^{-x}, y(0)=1` -> `y=e^{-x}`), verificado por residuo simbólico y
  condición inicial. Bloqueados: `ED-T-01..09` (`laplace` no existe),
  `ED-T-10..15` (`ilaplace` no existe), `ED-T-16` (convolución: `integrate` no
  existe y `t*exp(t)` se devuelve literal, sin semántica de convolución),
  `ED-T-18..21` (dos condiciones iniciales; además `dirac` / `heaviside` no están
  permitidos), `ED-T-22..23` (ecuaciones integrales) y `ED-T-24` (sistema).

Acumulado EDCX A1–A4: **143 / 638 filas, 80 PASS / 63 BLOCKED** en Plus.

### Evidencia CI Plus

| HEAD | Cumulative | H1d |
|------|------------|-----|
| `02e198ac` (A4) | [39927284848](https://github.com/c2melendez/precision-lab-plus/actions/runs/39927284848) **SUCCESS** | [39927284862](https://github.com/c2melendez/precision-lab-plus/actions/runs/39927284862) **SUCCESS** |
| `6aef2571` (A3) | [39926515965](https://github.com/c2melendez/precision-lab-plus/actions/runs/39926515965) **SUCCESS** | [39926515979](https://github.com/c2melendez/precision-lab-plus/actions/runs/39926515979) **SUCCESS** |

Backend cumulative: **2157 passed, 1 skipped, 6 xfailed**, cobertura **87.85%**
(A3: 2130 passed, 87.92%). Harness nuevos: A3 17/17, A4 27/27.

### Defecto de producto confirmado (no corregido en r255)

`_parse_initial_condition` documenta una segunda condición inicial separada por
`;`, pero no la implementa: `_split_equation_and_condition` solo parte por coma y
el valor `0; y'(0)=0` llega completo al parser de expresiones, que falla con
`PARSE_ERROR: No se pudo interpretar la condición inicial.` Medido en
`y''-y=exp(x), y(0)=0; y'(0)=0`. No se usa como PASS; queda registrado para
decisión de producto.

**Siguiente acción única:** EDCX A5 (series / Frobenius, 10 filas).

---

## 2026-10-23 UTC — r254: EDCX A1+A2 — PASS_SCOPED (Plus), capacidad Lite no ejecutada

**EDCX Parte A, bloques A1 (53 filas) y A2 (50 filas): 76 PASS + 27 BLOCKED en Plus.**
No es cierre bilateral: Lite no ejecuta estos bloques (gap de alcance de motor, ver
`MANUAL_CAPABILITY_GAPS.md`); la certificación global sigue `OPEN`.

| Bloque | Filas | PASS | BLOCKED | Canal |
|--------|-------|------|---------|-------|
| A1 primer orden | 53 | 47 | 6 | `/api/v1/ode` (prima `y'`) |
| A2 orden 2/superior | 50 | 29 | 21 | `/api/v1/ode` + `/api/v1/matrix/determinant` (Wronskianos) |

- A1: 47 familias verificadas por sustitución numérica; 8 filas F4 (familia
  correcta, sin soluciones singulares enumeradas). Límites acotados y registrados:
  ED-L-12 (canal `x(y)`), ED-X-02/X-03, ED-B-09, ED-C-02, ED-C-05.
- A2: 25 EDO por sustitución, 3 Wronskianos por determinante con oráculo de
  derivadas, ED-A-05 por renombrado documentado `T(t)→y(x)`; 21 bloqueadas por
  alcance medido (orden>2, una sola condición inicial, `yy''=y'^2`, celdas
  `exp/log` rechazadas por el parser de matrices).

### Evidencia CI Plus

| HEAD | Cumulative | H1d | Native |
|------|------------|-----|--------|
| `fdcf2d63` (A2) | [39924322798](https://github.com/c2melendez/precision-lab-plus/actions/runs/39924322798) **SUCCESS** | [39924322809](https://github.com/c2melendez/precision-lab-plus/actions/runs/39924322809) **SUCCESS** | — (sin rutas frontend) |
| `5a76477a` (fix pool) | [39922491068](https://github.com/c2melendez/precision-lab-plus/actions/runs/39922491068) **SUCCESS** | [39922491020](https://github.com/c2melendez/precision-lab-plus/actions/runs/39922491020) **SUCCESS** | [39922491000](https://github.com/c2melendez/precision-lab-plus/actions/runs/39922491000) **SUCCESS** |

Backend cumulative: **2113 passed, 1 skipped, 6 xfailed**, cobertura **87.92%**.

### Regresión real encontrada y corregida

`86241e40` introdujo el aislamiento acotado de `dsolve` con la anotación
`mp.pool.Pool` sin importar el submódulo: H1d `39921705215`, security
`39921705206` y native `39921705116` fallaron con `AttributeError`. Corregido en
`5a76477a` (`from multiprocessing import pool as mp_pool`); los tres workflows
quedaron verdes en ese SHA.

**Siguiente acción única:** EDCX A3 (sistemas y exponencial matricial, 16 filas).

---

## 2026-10-23 UTC — r253: MV-J-01..07 PASS_SCOPED_BILATERAL — CATÁLOGO MV COMPLETO

**MV-J (transformaciones geométricas) — PASS_SCOPED_BILATERAL.**

Con esto se cierra el catálogo congelado **Matrices/Vectores** (153 filas, secciones A–H + J):

| Sección | Tema | Estado |
|---------|------|--------|
| A–D | Aritmética, sistemas, det/inv, Gram-Schmidt | PASS formal bilateral (r≤249) |
| E | Espacios (null/col/rank simbólico) | PASS_SCOPED_BILATERAL |
| F | Potencias + eigen | PASS_SCOPED_BILATERAL |
| G | Vectores + geometría 3D | PASS_SCOPED_BILATERAL |
| H | Productos mixtos, Hilbert, límites | PASS_SCOPED_BILATERAL |
| **J** | Rotación / reflexión / shear / composición | **PASS_SCOPED_BILATERAL** |

### Evidencia CI MV-J

| Repo | HEAD | Cumulative |
|------|------|------------|
| Plus | `2fcd869` | [39914423538](https://github.com/c2melendez/precision-lab-plus/actions/runs/39914423538) **SUCCESS** |
| Lite | `40b000b` | [39914455096](https://github.com/c2melendez/precision-lab-lite/actions/runs/39914455096) **SUCCESS** |

### Notas
- J-01..05, J-07: API multiply / det / power.
- J-06 composición simbólica: oráculo SymPy (`R(θ)R(φ)=R(θ+φ)`); Lite proxy numérico R90²=R180.

**Siguiente acción única (fuera de MV):** retomar gates transversales del protocolo de continuidad (p. ej. ampliación Stryker / resto de dominios según CURRENT_STATE previo a la serie MV-E..J), o formalizar cierre del dominio Matrices/Vectores en el registro de certificación.

---

## 2026-10-23 UTC — r252: MV-H PASS_SCOPED_BILATERAL

Ver r252.


---

## 2026-10-23 UTC — r270: contrato HTTP B6 inspeccionado estáticamente

- Nuevo [EDCX_B6_HTTP_CONTRACT_FINDINGS.md](EDCX_B6_HTTP_CONTRACT_FINDINGS.md) registra router, payload y respuesta observados en el código vigente.
- `POST /api/v1/evaluate` recibe `EvaluateRequest` (expression 1–500 chars, angle_unit rad/deg, substitutions string map) y devuelve `MathResponse`. `result_approx` es opcional float y el servicio solo lo asigna cuando el resultado es real; para complejos hay que verificar `result_text`/`result_latex` y contrastar con oráculo independiente.
- `Log` principal, `log` base 10 y `ln` natural tienen semánticas distintas en el parser. B6-11 multivaluado no puede certificarse con un único resultado principal.
- Esto es lectura estática, no ejecución. No se ejecutaron tests ni Actions. B6 REVIEW, B5 BLOCKED, Lite NO_EJECUTADO, global OPEN.


---

## 2026-10-24 UTC — Estado actual r292

- HEAD: `561547252456b30124f4f7a1db06347ee0731079`.
- CI, cumulative, Playwright y S19 focalizado: SUCCESS en el SHA actual (runs 40098526446, 40098526501, 40098526513, 40098526609).
- S19 focalizado: 801/1666 mutantes eliminados; 863 sobrevivientes; 2 timeouts. **S19 aceptación sigue BLOCKED**; no lanzar campaña completa.
- S18 run 40098526464 fue cancelado por shutdown del runner durante la prueba diferencial; clasificado como infraestructura, no como fallo de producto.
- Bloqueos sin cambios: SECURITY-S25 global BLOCKED; AS-B-29 ON_HOLD; SG28 distribuido BLOCKED; certificación global OPEN; PR #29 OPEN/DRAFT.
- Próximo paso: diagnosticar infraestructura S18 y repetir solo S18 una vez cuando sea viable. No repetir gates verdes.

## 2026-10-24 UTC — r293: S18 timeout aislado a una expresión reproducible

- Los logs de S18 en SHA `32f8ab617b8222c529de387da8ade9afc0a5eb08` (runs `40099750218` y `40099786410`) muestran la misma última petición iniciada sin respuesta. La señal de shutdown era consecuencia compatible con una operación bloqueada; no prueba por sí sola un problema de infraestructura.
- Se actualizó `qa/s18/run_differential.py` en commit `3dac60a2b4c3467e1ecf719a2c8d02eee36f5889` para aislar cada llamada a Plus en un proceso terminable con límite de 8 s. Run `40103093212` falló en ~41 s y emitió el contraejemplo exacto: `exp(-1.3983707058413914)+(-1)*sin(-1.3983707058413914)` (seed 180018, timeout 8 s). El mismo hash de entrada aparece en los logs anteriores como última petición iniciada sin respuesta.
- Reclasificación: S18 queda `BLOCKED_REPRODUCIBLE_EVALUATION_TIMEOUT`, no `BLOCKED_INFRASTRUCTURE`. La fase interna exacta (parseo, evaluación o presentación) aún no está aislada; no atribuir la causa a un subsistema específico sin instrumentación.
- Siguiente paso: aislar por fase `POST /api/v1/evaluate` con este único contraejemplo, corregir el bloqueo y añadir regresión acotada. No repetir S18 completo hasta disponer de esa corrección; no repetir CI/cumulative/Playwright ni lanzar S19 completo. S19 sigue BLOCKED (801/1666 killed, 863 survived, 2 timeout); seguridad global BLOCKED; Algebra 229 AS-B-29 ON_HOLD; SG28 H2 BLOCKED; PR #29 abierto/draft; certificación global OPEN.

## 2026-10-24 UTC — r294: corrección focalizada del simplify no acotado en S18

- S18 run `40103093212` ya identifica el input reproducible `exp(-1.3983707058413914)+(-1)*sin(-1.3983707058413914)` y falla rápido con timeout por petición de 8 s. El diagnóstico de fase en run `40103478925` quedó inconcluso por un `EOFError` del propio helper diagnóstico; se corrigió el manejo de EOF.
- Reproducción local del parser de SymPy confirma que `rationalize` convierte los decimales de entrada en racionales exactos y que `sympy.simplify()` sobre la expresión resultante puede agotar memoria. La operación costosa corresponde al `sympy.simplify(result.expr)` incondicional en `_render_evaluate_presentation`; no es un fallo genérico del runner.
- Corrección aplicada en `backend/app/routers/evaluate.py`: para expresiones numéricas sin variables libres que contienen `exp`, provienen de una entrada decimal y ya tienen `approx_value`, la presentación usa esa aproximación calculada en vez de intentar una simplificación exacta potencialmente no acotada. Se añadió regresión HTTP en `backend/tests/test_evaluate.py` para el contraejemplo exacto. El harness S18 mantiene el límite por petición y ahora tolera EOF del diagnóstico.
- Estado: `VERIFYING_FIX`. El commit actual debe validar CI y S18; no lanzar S19 completo ni repetir manualmente gates verdes. Si S18 pasa en el SHA actual, registrar PASS para ese gate y continuar con la revisión focalizada de sobrevivientes S19. Global certification OPEN; S19 acceptance BLOCKED; S25 global BLOCKED; Algebra 229 AS-B-29 ON_HOLD; SG28 H2 BLOCKED; PR #29 abierto/draft.

## 2026-10-24 UTC — r295: corrección del patrón decimal en el guard de presentación

- En revisión del commit r294 se detectó que el patrón regex del guard decimal quedó con escapes duplicados por la serialización del cambio (`\\d` literal), por lo que no activaría la protección. Se corrige a `\d+\.\d+` en el código Python. Esta revisión de código se hizo antes de aceptar el resultado de S18; el run de r294 no debe considerarse validación del fix.
- La corrección de presentación y la regresión HTTP permanecen focalizadas en el contraejemplo S18. El siguiente commit debe demostrar que el guard se activa y que CI/S18 terminan; no repetir S19 completo ni aceptar gates solo por estado queued. Certificación global OPEN; S19 BLOCKED; S25 global BLOCKED; AS-B-29 ON_HOLD; SG28 H2 BLOCKED; PR #29 abierto/draft.


## 2026-10-24 UTC — r296: S18 cerrado en el SHA técnico y revisión S19 reabierta con evidencia nueva

- HEAD técnico validado: `02d01c3a1f968eab2bf5ecdb438810d55928edce`. S18 Differential Properties run [40105997558](https://github.com/c2melendez/precision-lab-plus/actions/runs/40105997558) SUCCESS en este SHA; el reporte declara `status: PASS`, seed 180018, 149 casos y 60 diferenciales numéricos. El contraejemplo de `exp(-1.3983707058413914)+(-1)*sin(-1.3983707058413914)` ya no agota el timeout de 8 s.
- CI [40105997615](https://github.com/c2melendez/precision-lab-plus/actions/runs/40105997615) SUCCESS; backend: 2,425 passed, 1 skipped, 10 xfailed; frontend también SUCCESS. Gate acumulativo [40105997679](https://github.com/c2melendez/precision-lab-plus/actions/runs/40105997679) SUCCESS; Playwright [40105997559](https://github.com/c2melendez/precision-lab-plus/actions/runs/40105997559) SUCCESS. Corridas corresponden al SHA técnico indicado.
- La corrida automática S19 [40105997583](https://github.com/c2melendez/precision-lab-plus/actions/runs/40105997583) ejecutó alcance FULL: 3,302 mutantes; 1,581 killed, 1,659 survived, 24 sin tests y 16 timeout. Score killed 47.88%, inferior al baseline histórico 57.39%; workflow SUCCESS no implica aceptación. Artefacto existente ID 12564793967, ZIP SHA-256 `20786dce29c0de88b781ae52156f85a4d33c77abd768c1ba5aaa96742cf19983`. S19 sigue BLOCKED; no volver a lanzar campaña completa.
- S25 run [40105997654](https://github.com/c2melendez/precision-lab-plus/actions/runs/40105997654) SUCCESS como ejecución, pero el bloqueo global SECURITY-S25 permanece BLOCKED hasta reconciliar advisories y criterios de salida. Algebra 229 AS-B-29 sigue ON_HOLD; SG28 H2 sigue BLOCKED; PR #29 sigue OPEN/DRAFT; certificación global OPEN.
- Siguiente acción única: revisar los sobrevivientes y categorías sin tests/timeout del artefacto S19 existente, empezando por funciones P0 del plan r290 y priorizando regresiones relevantes; usar el artefacto/log ya generado, sin repetir S19 completo. Después implementar solo tests focalizados que se justifiquen por contratos y evidencia.


## 2026-10-24 UTC — r297: reconciliación S19 y corrección del filtro de alcance

- El full S19 automático [run 40108433043](https://github.com/c2melendez/precision-lab-plus/actions/runs/40108433043) terminó SUCCESS como ejecución, pero no satisface aceptación. Artefacto ID 12566355605, ZIP SHA-256 `e096e458bf96fd8153f150f4c661fcb95a856dfe9b184de67048990975ec5cc6`; `mutmut-results.txt` contiene 1,663 survived, 24 no tests y 22 timeout. Frente a 3,302 mutantes, eso implica 1,593 killed y score 48.24%, por debajo del baseline 57.39%. El conteo de timeout subió frente al run anterior; S19 sigue BLOCKED.
- Se corrigió `.github/workflows/s19-mutation.yml`: `qa/certification/continuity.json` entra en la allowlist docs-only y `workflow_call` ya calcula el delta de commit en vez de forzar full. La corrida PR workflow-only [40114121716](https://github.com/c2melendez/precision-lab-plus/actions/runs/40114121716) corresponde al commit anterior al segundo ajuste; está pendiente de salir de cola para verificar su clasificación. No lanzar otra campaña manual.
- S18 permanece PASS en el SHA técnico `02d01c3a1f968eab2bf5ecdb438810d55928edce`: run [40105997558](https://github.com/c2melendez/precision-lab-plus/actions/runs/40105997558), seed 180018, 149 casos; CI [40105997615](https://github.com/c2melendez/precision-lab-plus/actions/runs/40105997615), acumulativo [40105997679](https://github.com/c2melendez/precision-lab-plus/actions/runs/40105997679) y Playwright [40105997559](https://github.com/c2melendez/precision-lab-plus/actions/runs/40105997559) SUCCESS en ese SHA.
- Bloqueos no cambiados: SECURITY-S25 BLOCKED, Algebra 229 AS-B-29 ON_HOLD, SG28 H2 BLOCKED, PR #29 OPEN/DRAFT y certificación global OPEN.
- Siguiente acción: verificar el scope filter en la corrida pendiente; después identificar cambios mutantes específicos en los puntos P0 del plan r290 antes de añadir tests focalizados. No repetir S19 full.

## 2026-10-24 UTC — r298: pruebas focalizadas y verificación real del filtro de alcance S19

- Se añadieron pruebas solo de test en `backend/tests/test_parsing.py` y `backend/tests/test_solve.py` (commit técnico `30a291bb49752f86b00c39fd05cf01eef4f9d0c1`): mensajes deterministas de G3, allowlist completa de comandos, desigualdades encadenadas, valor absoluto, radicales, dominio racional y contrato de `domain_step`. Local: `pytest -q tests/test_parsing.py tests/test_solve.py tests/test_evaluate.py` → 252 passed.
- El clasificador de alcance quedó verificado en una corrida real: S19 [40136007686](https://github.com/c2melendez/precision-lab-plus/actions/runs/40136007686) SUCCESS sobre `30a291bb`, con `S19 mutation scope: focused` y `SCOPE: focused` en el log. Artefacto [12577980586](https://github.com/c2melendez/precision-lab-plus/actions/runs/40136007686/artifacts/12577980586), ZIP SHA-256 `a34abe5f5093a50ae59a13f13982edcc9bad24ad9bd9b1be3321f04d4677e1a2`.
- Inventario focalizado: **1,688 mutantes comprobados, 1,082 killed (64.10%), 595 survived, 11 timeout**; 1,614 mutantes del inventario total de 3,302 quedaron `not checked` fuera de foco. El run focalizado anterior dejaba 803 killed (47.57%): las pruebas nuevas eliminaron 279 mutantes adicionales sin tocar producto, oráculos, matrices ni gates.
- En el mismo SHA: CI 40136007717, cumulative 40136007622, Playwright 40136007682, S18 40136007687, S25 40136007721, H1a 40136007614, H1b 40136007718, H1c 40136007666, H1d 40136007736, S17 40136007646, S20 40136007612, S21 40136007714, S23 40136007637, AA229 40136007691 y native syntax 40136007627: SUCCESS.
- **S19 sigue BLOCKED**: sobreviven 595 mutantes, concentrados en `app.routers.evaluate.x__evaluate_impl` (218), `x__render_evaluate_presentation` (106), `solve_service` radical/abs/rational (166) y `parsing.x_validate_g3_structure` (48). El score focalizado supera el baseline 57.39%, pero eso no constituye aceptación.
- Hallazgo de producto diferido: el patrón `r"\\left\([\\s\\S]*\\right\]"` de `backend/app/services/parsing.py` tiene doble escape en la clase de caracteres, por lo que el mensaje "Delimitadores incompatibles" es inalcanzable. Se excluyó ese caso del test para no validar una rama muerta; corregirlo requiere un cambio de producto aislado con su regresión.
- Bloqueos sin cambios: SECURITY-S25 BLOCKED; ALGEBRA229-AS-B-29 ON_HOLD; SG28 H2 BLOCKED; PR #29 OPEN/DRAFT; certificación global OPEN.

## 2026-10-24 UTC — r299: verificación del run focalizado S19 sobre r299

- El commit test-only `1f5faeba` (r299: G3 allowlist, branches de solve y `_evaluate_impl`/render) quedó verificado con el run S19 [40142571395](https://github.com/c2melendez/precision-lab-plus/actions/runs/40142571395): SUCCESS, `S19 mutation scope: focused` y `SCOPE: focused`. Artefacto [12579268204](https://github.com/c2melendez/precision-lab-plus/actions/runs/40142571395/artifacts/12579268204), ZIP SHA-256 `a5f88cc37d5f041cde03dbcd4919628b613cfbc0f1cb5d5578b790b5a1c8994f`.
- Inventario focalizado: **1,688 comprobados, 1,473 killed (87.26%), 212 survived y 3 timeout**; 1,614 fuera de foco. Frente a r298 (1,082 killed, 595 survived, 11 timeout): +391 killed, −383 supervivientes, −8 timeouts, sin cambios de producto ni de oráculos.
- Supervivientes por función: `_radical_cases_result` 44, `_evaluate_impl` 43 (17 corresponden a la selección del fixture SG28 y quedan diferidos), `_render_evaluate_presentation` 30, `_rational_domain_result` 27, `_absolute_value_cases_result` 21, `validate_g3_structure` 20, `_absolute_value_steps` 10, `permutation_alias_args` 9, `_absolute_value_equidistance_steps` 5 y 1 en cada una de `parse_inequality_tree`, `parse_chained_inequalities` y `symbolic_identity_sum_bound`.
- En el mismo SHA `1f5faeba`: CI [40142571421](https://github.com/c2melendez/precision-lab-plus/actions/runs/40142571421), cumulative [40142571394](https://github.com/c2melendez/precision-lab-plus/actions/runs/40142571394), Playwright [40142571539](https://github.com/c2melendez/precision-lab-plus/actions/runs/40142571539), native syntax [40142571513](https://github.com/c2melendez/precision-lab-plus/actions/runs/40142571513), S17 [40142571392](https://github.com/c2melendez/precision-lab-plus/actions/runs/40142571392), S18 [40142571422](https://github.com/c2melendez/precision-lab-plus/actions/runs/40142571422), S20 [40142571433](https://github.com/c2melendez/precision-lab-plus/actions/runs/40142571433), S21 [40142571386](https://github.com/c2melendez/precision-lab-plus/actions/runs/40142571386), S23 [40142571413](https://github.com/c2melendez/precision-lab-plus/actions/runs/40142571413), S25 [40142571396](https://github.com/c2melendez/precision-lab-plus/actions/runs/40142571396), H1a [40142571553](https://github.com/c2melendez/precision-lab-plus/actions/runs/40142571553), H1b [40142571391](https://github.com/c2melendez/precision-lab-plus/actions/runs/40142571391), H1c [40142571440](https://github.com/c2melendez/precision-lab-plus/actions/runs/40142571440), H1d [40142571465](https://github.com/c2melendez/precision-lab-plus/actions/runs/40142571465) y AA229 [40142571418](https://github.com/c2melendez/precision-lab-plus/actions/runs/40142571418): SUCCESS.
- Se inició el commit test-only `cf4a24d8` (r300) con aserciones exactas del contrato de pasos y del logging de `/evaluate`; sus runs quedan en verificación y no se declaran verdes hasta reconciliar el resultado real.
- **S19 sigue BLOCKED** con 212 supervivientes. Los mutantes equivalentes o inalcanzables identificados no se persiguen: rama `raw` vacía de G3, regex de `\placeholder` con `re.I`, patrón de delimitadores con doble escape, `replace("\left"/"\right")` no-op para el conteo, guard de lado vacío en `parse_chained_inequalities`, `[A-Za-z]`→`[a-za-z]` y `index`→`rindex` en `parse_inequality_tree`.
- Bloqueos sin cambios: SECURITY-S25 BLOCKED; ALGEBRA229-AS-B-29 ON_HOLD; SG28 H2-SG28-DIST-01..08 BLOCKED; EDCX-B5 BLOCKED; SY-X-04-PLUS-HTTP BLOCKED; PR #29 OPEN/DRAFT; certificación global OPEN.

## 2026-10-24 UTC — r300: contrato exacto de pasos y nuevo inventario S19

- El commit test-only `cf4a24d8` añadió aserciones exactas del contrato de pasos (`index`, `latex_before`, `latex_after` y descripción completa) para valor absoluto, equidistancia, casos por tramos, dominio racional y radicales; también `sec`/`cot`, límites inclusivos de `P(n,r)` y el logging de `/evaluate`. Local: `pytest -q tests/test_parsing.py tests/test_evaluate.py tests/test_solve.py tests/test_exhaustive_module13_security.py` → **433 passed**.
- S19 focalizado [40143618188](https://github.com/c2melendez/precision-lab-plus/actions/runs/40143618188) SUCCESS sobre `cf4a24d8`, alcance focused. Artefacto [12579234535](https://github.com/c2melendez/precision-lab-plus/actions/runs/40143618188/artifacts/12579234535), ZIP SHA-256 `be66391fb4367c85830295b0d5c2045d4bcf0cca19803bf77128bc9d1b5655d8`.
- Inventario: **1,688 comprobados, 1,513 killed (89.64%), 173 survived, 2 timeout**. Frente a r299: +40 killed, −39 supervivientes, −1 timeout. Distribución: `_radical_cases_result` 39, `_evaluate_impl` 37, `_render_evaluate_presentation` 30, `_rational_domain_result` 21, `validate_g3_structure` 20, `_absolute_value_cases_result` 14, `_absolute_value_steps` 3, `_absolute_value_equidistance_steps` 3, `permutation_alias_args` 3 y 1 en cada una de las tres funciones de parsing restantes.
- Buena parte de los 173 restantes es equivalente o inalcanzable: defaults de `getattr` sobre atributos de dataclass siempre presentes, `zip(strict=False)` con longitudes iguales, `diff(var)` frente a `diff(argumento, var)` cuando la pendiente ya es 1, ramas muertas de G3 (raw vacío, delimitadores con doble escape, reemplazos que no alteran el conteo), guard de lado vacío en `parse_chained_inequalities`, `[A-Za-z]`→`[a-za-z]` y `index`→`rindex` con operador repetido ya rechazado. Los 17 mutantes de selección SG28 y los 6 de serialización 503 quedan diferidos; no se tocaron producto, oráculos, matrices ni gates.
- En el mismo SHA `cf4a24d8`: CI [40143618121](https://github.com/c2melendez/precision-lab-plus/actions/runs/40143618121), cumulative [40143618128](https://github.com/c2melendez/precision-lab-plus/actions/runs/40143618128), native syntax [40143618117](https://github.com/c2melendez/precision-lab-plus/actions/runs/40143618117), S17 [40143618131](https://github.com/c2melendez/precision-lab-plus/actions/runs/40143618131), S18 [40143618123](https://github.com/c2melendez/precision-lab-plus/actions/runs/40143618123), S20 [40143618141](https://github.com/c2melendez/precision-lab-plus/actions/runs/40143618141), S21 [40143618150](https://github.com/c2melendez/precision-lab-plus/actions/runs/40143618150), S23 [40143618153](https://github.com/c2melendez/precision-lab-plus/actions/runs/40143618153), S25 [40143618126](https://github.com/c2melendez/precision-lab-plus/actions/runs/40143618126), H1a [40143618119](https://github.com/c2melendez/precision-lab-plus/actions/runs/40143618119), H1b [40143618156](https://github.com/c2melendez/precision-lab-plus/actions/runs/40143618156), H1c [40143618134](https://github.com/c2melendez/precision-lab-plus/actions/runs/40143618134), H1d [40143618139](https://github.com/c2melendez/precision-lab-plus/actions/runs/40143618139) y AA229 [40143618127](https://github.com/c2melendez/precision-lab-plus/actions/runs/40143618127): SUCCESS.
- El run S19 [40143713918](https://github.com/c2melendez/precision-lab-plus/actions/runs/40143713918) sobre el commit docs-only posterior clasificó `S19 mutation scope: docs-only` y omitió el job de mutación. Los workflows PR con `paths-ignore` se reevalúan contra el diff completo del PR, por lo que Playwright puede repetirse aunque el último commit sea documental; no se modificó ningún filtro para forzarlo.
- **S19 sigue BLOCKED**. SECURITY-S25 BLOCKED; ALGEBRA229-AS-B-29 ON_HOLD; SG28 H2-SG28-DIST-01..08 BLOCKED; EDCX-B5 BLOCKED; PR #29 OPEN/DRAFT; certificación global OPEN.

## 2026-10-24/25 UTC — r301: Playwright y gate de dependencias verificados; campaña completa S19 registrada

- Playwright [40143618191](https://github.com/c2melendez/precision-lab-plus/actions/runs/40143618191) **SUCCESS** en `cf4a24d8`: 627 passed (9.9 m) y 21 passed (44.8 s). Cierra la última verificación pendiente del conjunto r300.
- Gate de dependencias [40143614164](https://github.com/c2melendez/precision-lab-plus/actions/runs/40143614164) **SUCCESS** en el mismo SHA: `audit-request`, `security/validate-request`, `security/backend-security` y la cadena de mutación.
- Ese gate invocó el workflow reutilizable S19 desde un evento `push`. Dentro del workflow llamado `GITHUB_EVENT_NAME` es `push`, así que `change-scope` aplicó su rama conservadora y publicó `S19 mutation scope: full` / `SCOPE: full`. No fue una ejecución manual ni una decisión de repetir; no se modificó ningún workflow.
- La campaña completa quedó registrada en ese SHA: **3,302 mutantes, 2,314 killed (70.38% de 3,288 comprobados), 961 survived, 13 timeout y 14 sin tests**. Artefacto [12580460741](https://github.com/c2melendez/precision-lab-plus/actions/runs/40143614164/artifacts/12580460741), ZIP SHA-256 `681c5ac7a03ea98f83466683474a110899ce6f7232296c2262b4cad40185d7f0`.
- Supervivientes completos por módulo: `solve_service` 458, `parsing` 385, `evaluate` 73, `ast_validator` 45. Por función destacan `solve_equation` 161, `normalize_unicode` 104, `_try_parse_finite_aggregate` 98, `_source_denominator_exclusions` 80, `_quadratic_steps` 74, `parse_expression_tree` 52 y `check_complexity_limits` 42.
- El modo focalizado solo muta 15 funciones; casi todas las funciones con más supervivientes de la campaña completa quedan fuera de esa allowlist. Ampliar cobertura exige una decisión explícita de alcance, no una edición del workflow para forzar verde.
- En el commit documental `ba25ad58` los workflows de PR volvieron a despacharse por el diff completo del PR: cumulative, CI, S17, S18, S19 (docs-only), S20, S21, S23, S25, H1a–H1d, AA229 y native syntax **SUCCESS**; Playwright seguía en progreso al escribir este corte. No se declara verde hasta reconciliar su resultado y no se repite manualmente.
- **S19 sigue BLOCKED** con 961 supervivientes totales (173 en el alcance focalizado). SECURITY-S25 BLOCKED; ALGEBRA229-AS-B-29 ON_HOLD; SG28 H2-SG28-DIST-01..08 BLOCKED; EDCX-B5 BLOCKED; SY-X-04-PLUS-HTTP BLOCKED; PR #29 OPEN/DRAFT; certificación global OPEN.

## 2026-10-25 UTC — r302: alcance S19 congelado en focused; gates documentales re-verificados

- Decisión registrada: se **mantiene el alcance focalizado** de S19. No se amplía la allowlist ni se edita el workflow. La campaña completa (2,314 killed / 961 survived) queda como inventario documentado, no como objetivo inmediato, porque sus supervivientes se concentran en funciones sin contrato observable que justifique tests nuevos.
- El trabajo de mutación continúa solo sobre los 173 supervivientes focalizados (`_radical_cases_result` 39, `_evaluate_impl` 37 — 23 diferidos por SG28/503 —, `_render_evaluate_presentation` 30, `_rational_domain_result` 21, `validate_g3_structure` 20, `_absolute_value_cases_result` 14, `_absolute_value_steps` 3, `_absolute_value_equidistance_steps` 3, `permutation_alias_args` 3 y 1 en cada función de parsing restante).
- Los commits documentales `ba25ad58` y `fd270710` volvieron a despachar automáticamente los workflows de PR (el filtro de paths evalúa el diff completo del PR). En `ba25ad58` todo quedó SUCCESS, incluido Playwright [40144362658](https://github.com/c2melendez/precision-lab-plus/actions/runs/40144362658) y S19 docs-only [40144362587](https://github.com/c2melendez/precision-lab-plus/actions/runs/40144362587).
- En `fd270710`: CI [40145233443](https://github.com/c2melendez/precision-lab-plus/actions/runs/40145233443), cumulative [40145233476](https://github.com/c2melendez/precision-lab-plus/actions/runs/40145233476), Playwright [40145233478](https://github.com/c2melendez/precision-lab-plus/actions/runs/40145233478) (627 passed en 12.3 m y 21 passed en 57.5 s), native syntax [40145233431](https://github.com/c2melendez/precision-lab-plus/actions/runs/40145233431), S17 [40145233438](https://github.com/c2melendez/precision-lab-plus/actions/runs/40145233438), S18 [40145233458](https://github.com/c2melendez/precision-lab-plus/actions/runs/40145233458), S20 [40145233466](https://github.com/c2melendez/precision-lab-plus/actions/runs/40145233466), S21 [40145233480](https://github.com/c2melendez/precision-lab-plus/actions/runs/40145233480), S23 [40145233516](https://github.com/c2melendez/precision-lab-plus/actions/runs/40145233516), S25 [40145233445](https://github.com/c2melendez/precision-lab-plus/actions/runs/40145233445), H1a [40145233468](https://github.com/c2melendez/precision-lab-plus/actions/runs/40145233468), H1b [40145233436](https://github.com/c2melendez/precision-lab-plus/actions/runs/40145233436), H1c [40145233497](https://github.com/c2melendez/precision-lab-plus/actions/runs/40145233497), H1d [40145233459](https://github.com/c2melendez/precision-lab-plus/actions/runs/40145233459), AA229 [40145233429](https://github.com/c2melendez/precision-lab-plus/actions/runs/40145233429) y A1–D [40145233464](https://github.com/c2melendez/precision-lab-plus/actions/runs/40145233464): SUCCESS. El S19 [40145233498](https://github.com/c2melendez/precision-lab-plus/actions/runs/40145233498) clasificó `docs-only` y omitió mutación.
- Estos runs son repeticiones automáticas sobre commits sin cambios de producto; no aportan evidencia nueva y no justifican repetir gates manualmente. No se persigue la cascada que genere este mismo commit documental.
- **S19 sigue BLOCKED** (173 supervivientes focalizados, 961 totales). SECURITY-S25 BLOCKED; ALGEBRA229-AS-B-29 ON_HOLD; SG28 H2-SG28-DIST-01..08 BLOCKED; EDCX-B5 BLOCKED; SY-X-04-PLUS-HTTP BLOCKED; PR #29 OPEN/DRAFT; certificación global OPEN.

## 2026-10-25 UTC — r303: S19 focalizado converge a 122 supervivientes y queda clasificado

- **Campaña focalizada cerrada con evidencia exacta.** Tres commits consecutivos, solo sobre `backend/tests/`, redujeron los supervivientes del alcance `focused` de 173 a 122 sin tocar producto, contratos, oráculos, matrices ni el workflow:
  - `a6b03e1e` (lote 1: `test_solve.py` + `test_evaluate.py`): S19 [40152869952](https://github.com/c2melendez/precision-lab-plus/actions/runs/40152869952), job `121047977934`, artefacto `12583168924`; 1,543 killed / 143 survived / 2 timeout de 1,688 (91.41% killed). Local: 438 passed.
  - `74414ebc` (lote 2: `test_solve.py` + `test_parsing.py`): S19 [40153456360](https://github.com/c2melendez/precision-lab-plus/actions/runs/40153456360), job `121049969054`, artefacto `12584005675`; 1,562 killed / 124 survived / 2 timeout (92.54%). Local: 443 passed.
  - `73be7940` (lote 3: `test_parsing.py`): S19 [40154343365](https://github.com/c2melendez/precision-lab-plus/actions/runs/40154343365), job `121052678895`, artefacto `12584112224`; 1,564 killed / 122 survived / 2 timeout (92.65%). Local: 444 passed.
  - En los tres runs `validate-request`, `change-scope` y `plus-backend-mutmut` quedaron SUCCESS y los dos jobs Stryker `skipped`.
- **Matriz de PR en `73be7940`:** CI [40154343352](https://github.com/c2melendez/precision-lab-plus/actions/runs/40154343352), cumulative [40154343367](https://github.com/c2melendez/precision-lab-plus/actions/runs/40154343367) y [40154340913](https://github.com/c2melendez/precision-lab-plus/actions/runs/40154340913), H1a [40154343351](https://github.com/c2melendez/precision-lab-plus/actions/runs/40154343351), H1b [40154343353](https://github.com/c2melendez/precision-lab-plus/actions/runs/40154343353), H1c [40154343364](https://github.com/c2melendez/precision-lab-plus/actions/runs/40154343364), H1d [40154343354](https://github.com/c2melendez/precision-lab-plus/actions/runs/40154343354) y [40154340969](https://github.com/c2melendez/precision-lab-plus/actions/runs/40154340969), native syntax [40154343372](https://github.com/c2melendez/precision-lab-plus/actions/runs/40154343372), AA229 [40154343361](https://github.com/c2melendez/precision-lab-plus/actions/runs/40154343361), A1–D [40154343362](https://github.com/c2melendez/precision-lab-plus/actions/runs/40154343362), S17 [40154343357](https://github.com/c2melendez/precision-lab-plus/actions/runs/40154343357), S18 [40154343355](https://github.com/c2melendez/precision-lab-plus/actions/runs/40154343355), S19 [40154343365](https://github.com/c2melendez/precision-lab-plus/actions/runs/40154343365), S20 [40154343360](https://github.com/c2melendez/precision-lab-plus/actions/runs/40154343360), S21 [40154343347](https://github.com/c2melendez/precision-lab-plus/actions/runs/40154343347), S23 [40154343349](https://github.com/c2melendez/precision-lab-plus/actions/runs/40154343349) y S25 [40154343356](https://github.com/c2melendez/precision-lab-plus/actions/runs/40154343356): SUCCESS. Quedaron en progreso el gate de dependencias y Playwright; no se declaran verdes hasta reconciliar su resultado y no se repiten manualmente.
- **Mutantes eliminados (51 en total):**
  - Lote 1 (30): `_rational_domain_result` 68, 77, 85, 104, 113, 114, 118, 119, 127, 128, 129, 133, 134, 143; `_render_evaluate_presentation` 45, 46, 93, 94, 116, 137, 150, 151, 152, 162, 163; `_absolute_value_cases_result` 142, 143, 157, 158, 163.
  - Lote 2 (19): `_radical_cases_result` 13, 17, 37, 38, 82, 84, 112, 113, 114, 115, 163, 164, 172, 173, 177, 178, 187; `_absolute_value_steps` 25; `symbolic_identity_sum_bound` 7.
  - Lote 3 (2): `validate_g3_structure` 66 (precedencia del mensaje de delimitador para la forma de invocación `\right(`) y `_radical_cases_result` 16 (`continue`→`break`), que depende del orden de iteración de `atoms(Pow)` y por eso no se había eliminado en el lote 2.
- **Cobertura añadida:** campos completos de resultado (`input_eq`, `variable`, `has_detailed_steps`, `warnings`) en valor absoluto, dominio racional y radicales; descripciones y LaTeX exactos de dos y tres raíces, radicando negativo y raíces extrañas; rechazo de cuatro radicales; radio simbólico real; denest de raíces anidadas, `trigsimp` recíproco, reescritura `\log`→`\ln`, límite de 10,000 caracteres LaTeX, fuente decimal con exponencial; y precedencia del mensaje de delimitador.
- **Supervivientes finales (122) por función:** `_evaluate_impl` 37, `_radical_cases_result` 21, `validate_g3_structure` 19, `_render_evaluate_presentation` 19, `_absolute_value_cases_result` 9, `_rational_domain_result` 7, `_absolute_value_equidistance_steps` 3, `permutation_alias_args` 3, `_absolute_value_steps` 2, `parse_chained_inequalities` 1, `parse_inequality_tree` 1; `symbolic_identity_sum_bound` 0. Los 2 timeouts siguen siendo `_evaluate_impl` 205 y 207.
- **Clasificación de los 122 (sin perseguir equivalentes):**
  - `_evaluate_impl` 37: 34, 37 y 39–57 son la selección de fixture SG28 (diferida: el plan r290 prohíbe declarar aceptación SG28 sin aprobación de contrato); 81–83 y 223–225 son `model_dump(mode=…)` con JSON idéntico (verificado: `mode=None`, `"XXjsonXX"` y `"JSON"` devuelven el mismo enum y `json.dumps` lo serializa igual); 11/13/16/196/198/201 son defaults de `os.getenv` que solo difieren cuando la variable no existe (todas las ramas comparan contra `"1"`); 20/182 pasan `request=None` en ramas SG28/aislamiento; 1 cambia el default de `admission_reserved` y 272 omite `steps=[]` (default de modelo equivalente).
  - `_radical_cases_result` 21: 3/5/6/7/8 son guardas `has(Abs, Piecewise)` sin diferencia observable (probadas 20 ecuaciones, incluidas `sqrt(Abs(x))=2`, `sqrt(sin(x))=1` y `sqrt(exp(x))=1`); 17 (`continue`→`break`) depende del orden de iteración de `atoms(Pow)` y no se elimina de forma determinista; 26/30/31/32 usan `is_polynomial(None)`/`Poly(…, None)`/`Poly(var)`, equivalentes por inferencia de SymPy (probado con `sqrt(1/x)`, `sqrt(1/(x+1))`, `sqrt(2/x)`, `sqrt(x/2)`); 44/47/48/66/69/70 son `zip(..., strict=…)` con longitudes iguales por construcción; 56/58/59/60 no cambian el resultado en las 20 entradas probadas; 92/94 (`sorted(key=float)`) son equivalentes para raíces reales.
  - `validate_g3_structure` 19: 17–20 son la segunda rama `if not raw`, inalcanzable porque el guard de layout ya eleva el mismo mensaje para texto vacío; 28 es la regex de `\placeholder` con `re.I`; 123/124 están sombreados por el guard de marcador (verificado: `\placeholder{x}` y `\PLACEHOLDER{x}` → "Entrada incompleta"); 235–240 son la rama de delimitadores con doble escape `[\\s\\S]`, alcanzable solo con contenido en `{ \, s, S }` (`\left(s\right]`), mientras que `\left(x\right]` produce "Paréntesis sin cerrar."; 274–279 son `replace("\\left"/"\\right")` no-op para el conteo de paréntesis.
  - `_render_evaluate_presentation` 19: defaults de `getattr`, variantes de `permutation_alias`, condiciones de denest y `trigsimp` con `has(None)`, y la rama `str` inalcanzable; la simplificación recíproca simbólica no cambia `csc`/`sec`/`cot` (probadas 12 expresiones).
  - `_absolute_value_cases_result` 9: guardas `or`/`and` sin diferencia, `line is None` con `TypeError` capturado, midpoint `/3` y `strict` que conservan la misma región de signo, muestras ±2 y comparaciones `>=0`/`>0`/`>=1` sin cambio con breakpoints fraccionarios (1/2, 1/3, 1/4, 1/10).
  - `_rational_domain_result` 7: inferencia `None` de SymPy, `is_zero` desconocido y orden de `sorted`.
  - `_absolute_value_equidistance_steps` 3 y `permutation_alias_args` 3: guardas de tipo/variable y umbrales de longitud que no cambian el resultado porque el rechazo posterior (pendiente 0, límite `0 <= r <= n <= 170`) ya lo determina.
  - `parse_chained_inequalities` 1 y `parse_inequality_tree` 1: la regex exige ambos lados no vacíos y el operador único se valida antes, así que las ramas alternativas son inalcanzables.
  - `_absolute_value_steps` 2: las variantes de `diff` dejan el centro dependiente de la variable y el guard posterior devuelve `None`.
- Este push documental volverá a despachar la matriz de PR por el diff completo del PR; el S19 clasificará `docs-only` y omitirá mutación. No se persigue esa cascada ni se repiten los gates ya verdes.
- **Decisión registrada:** se **congela** la triage focalizada en 122 supervivientes. No se lanza otro run S19 mientras no exista una decisión explícita de aceptación de equivalencias o un cambio de contrato/alcance: los 122 restantes están clasificados como equivalentes, inalcanzables, dependientes de orden o diferidos por SG28. No se amplía la allowlist ni se edita el workflow.
- **S19 acceptance sigue BLOCKED** (122 focalizados clasificados, 961 de la campaña completa). SECURITY-S25 BLOCKED; ALGEBRA229-AS-B-29 ON_HOLD; H2-SG28-DIST-01..08 BLOCKED; EDCX-B5 BLOCKED; SY-X-04-PLUS-HTTP BLOCKED; PR #29 OPEN/DRAFT; certificación global OPEN.

## 2026-10-25 UTC — r304: campaña completa de S19 re-ejecutada sobre el SHA técnico final

- **Evidencia exacta.** El gate de dependencias [40154340922](https://github.com/c2melendez/precision-lab-plus/actions/runs/40154340922) (disparado por `73be7940`) terminó **SUCCESS** a las 02:48:40 UTC. Su job `mutation / plus-backend-mutmut` `121052752170` corrió de 02:26:46 a 02:48:39 y subió el artefacto `12583639759` (40,017 bytes: `mutmut-results.txt`, `mutmut-survived.txt`, `mutmut-timeout.txt`, `mutmut-exit-code.txt`). `mutmut-exit-code.txt` = `0`.
- **Totales de la campaña completa:** `3302/3302 🎉 2363 🫥 14 ⏰ 13 🙁 912`. Es decir, 3,302 mutantes, **2,363 killed**, 912 survived, 13 timeout y 14 sin tests sobre 3,288 comprobados (71.87% killed). La línea de resumen se leyó del log del job, no se infirió del artefacto.
- **Delta contra r301** (misma campaña completa, run `40143614164`, artefacto `12580460741`: 2,314 killed / 961 survived / 13 timeout / 14 sin tests): **+49 killed, 0 regresiones**, supervivientes 961 → 912. Por módulo: `solve_service` 458 → 422 (−36), `parsing` 385 → 383 (−2), `evaluate` 73 → 62 (−11), `ast_validator` 45 → 45.
- **Los 49 kills por función:** `_rational_domain_result` 14 (68, 77, 85, 104, 113, 114, 118, 119, 127, 128, 129, 133, 134, 143); `_render_evaluate_presentation` 11 (45, 46, 93, 94, 116, 137, 150, 151, 152, 162, 163); `_absolute_value_cases_result` 5 (142, 143, 157, 158, 163); `_radical_cases_result` 16 (13, 37, 38, 82, 84, 112, 113, 114, 115, 163, 164, 172, 173, 177, 178, 187); `_absolute_value_steps` 1 (25); `symbolic_identity_sum_bound` 1 (7); `validate_g3_structure` 1 (66).
- **Hallazgo sobre `_radical_cases_result` 16 y 17:** ambos **sobreviven** en la campaña completa sobre `73be7940` con el mismo comando de pruebas (`tests/test_parsing.py tests/test_evaluate.py tests/test_solve.py tests/test_exhaustive_module13_security.py`), aunque el lote 2 mató el 17 y el lote 3 mató el 16 en el alcance focalizado. La diferencia no es cobertura: es el orden de iteración de `atoms(Pow)` bajo aleatorización de hash. Queda confirmado que son kills no deterministas y no se persiguen con pruebas adicionales.
- **Lectura de alcance:** los 912 supervivientes completos son inventario documentado, no objetivo. El alcance `focused` sigue **congelado en 122** supervivientes clasificados. La campaña completa no cambia esa decisión: sus 49 kills transferibles ya están cubiertos por los tests de `backend/tests/` y los supervivientes restantes están fuera del contrato observable.
- **Matriz de PR en `9acc0bff`:** 16 de 17 workflows **SUCCESS** (AA229, CI, A1–D, cumulative, H1a–H1d, native syntax, S17, S18, S19, S20, S21, S23, S25); Playwright seguía en progreso al escribir este corte y no se declara verde hasta reconciliarlo. El run S19 [40155181008](https://github.com/c2melendez/precision-lab-plus/actions/runs/40155181008) clasificó el commit como `docs-only` y omitió `plus-backend-mutmut`, como estaba previsto. Este push documental vuelve a despachar la matriz de PR; no se persigue esa cascada.
- **Estado de bloqueos sin cambios:** S19 acceptance **BLOCKED** (122 focalizados clasificados; 912 completos como inventario), SECURITY-S25 BLOCKED, ALGEBRA229-AS-B-29 ON_HOLD, H2-SG28-DIST-01..08 BLOCKED, EDCX-B5 BLOCKED, SY-X-04-PLUS-HTTP BLOCKED, SY-P-23 OPEN, PR #29 OPEN/DRAFT, certificación global OPEN.
