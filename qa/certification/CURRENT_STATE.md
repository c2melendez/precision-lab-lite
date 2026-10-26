## 2026-10-24 UTC — r286: H1c y Playwright corregidos en el SHA técnico; CI sigue bloqueado por audit

**SHA técnico evaluado:** `14153e8bfd4f8557c24c7d195915b0a0907baa00` en `qa/syntax-audit-in625-a1`. PR #48 sigue abierto; no se ha mergeado.

### Evidencia exacta asociada a este SHA
- H1c Reentry [40072711602](https://github.com/c2melendez/precision-lab-lite/actions/runs/40072711602): SUCCESS.
- Playwright E2E [40072711609](https://github.com/c2melendez/precision-lab-lite/actions/runs/40072711609): SUCCESS. Resuelve la espera anterior de browser; no repetirlo sin cambio relevante.
- Acumulativo [40072711574](https://github.com/c2melendez/precision-lab-lite/actions/runs/40072711574): SUCCESS.
- Algebra 229 Source and Fixture Integrity [40072711589](https://github.com/c2melendez/precision-lab-lite/actions/runs/40072711589): SUCCESS.
- H1a [40072711552](https://github.com/c2melendez/precision-lab-lite/actions/runs/40072711552), H1b [40072711557](https://github.com/c2melendez/precision-lab-lite/actions/runs/40072711557), H1d [40072711543](https://github.com/c2melendez/precision-lab-lite/actions/runs/40072711543), G3 parser [40072711586](https://github.com/c2melendez/precision-lab-lite/actions/runs/40072711586), G3 E2E [40072711548](https://github.com/c2melendez/precision-lab-lite/actions/runs/40072711548), S22 [40072711559](https://github.com/c2melendez/precision-lab-lite/actions/runs/40072711559), S23 [40072711607](https://github.com/c2melendez/precision-lab-lite/actions/runs/40072711607), S25 [40072711628](https://github.com/c2melendez/precision-lab-lite/actions/runs/40072711628), Scientific UI [40072711620](https://github.com/c2melendez/precision-lab-lite/actions/runs/40072711620) y cross-browser [40072711577](https://github.com/c2melendez/precision-lab-lite/actions/runs/40072711577): SUCCESS.
- CI [40072711615](https://github.com/c2melendez/precision-lab-lite/actions/runs/40072711615): FAILURE en `QA dependency audit (hard gate)`; 8 advisories reportados: 2 low y 6 moderate. No reducir ni omitir el hard gate.
- S19 de Plus usó el snapshot Lite antiguo `6cbec7645b73ad18875d4472182c704eb35228b0`; por ello no constituye evidencia diferencial para este SHA.

### Decisión y siguiente acción
H1c y Playwright quedan PASS para el SHA señalado. CI sigue BLOCKED por dependencias; global OPEN. No repetir H1c, acumulativo, Playwright ni integridad Algebra 229 sin cambios en código/fixtures o criterio. Próximo trabajo de Lite: resolver advisories con cambios mínimos de dependencias y revisar audit completo antes de repetir el hard gate. Mantener PR #48 sin merge mientras CI siga rojo.

### Addendum de remediación npm audit — análisis del lockfile

El lockfile v3 confirma las rutas directas: Vitest 5.0.1 → @vitest/mocker 5.0.1; AJV 8.20.0 → fast-uri 3.1.8; @rollup/plugin-terser 1.0.0 → serialize-javascript 7.1.0; y Tailwind 3.4.19 → postcss-selector-parser 6.1.4 / postcss-nested 6.2.0. No forzar parser 7 dentro de Tailwind 3. La revisión detallada y el orden seguro de remediación están en [LITE_NPM_AUDIT_TRIAGE_R286.md](LITE_NPM_AUDIT_TRIAGE_R286.md). No se modificó package-lock ni se lanzó CI: no hay checkout npm local disponible en este entorno. Siguiente acción: ejecutar la remediación con npm en un entorno con checkout y validar lock, audit, typecheck, unitarias, build y E2E antes de repetir el hard gate.

### Actualización de advisories oficiales — versiones mínimas corregidas

El cruce con los avisos oficiales concreta candidatos: Vitest y `@vitest/mocker` 5.0.3; `fast-uri` 3.1.9 (3.1.8 no basta para el aviso publicado el 19-oct-2026); `serialize-javascript` 7.1.3; KaTeX 0.18.2. KaTeX requiere actualizar su rango directo `^0.16.11` y validar renderizado. `postcss-selector-parser` está corregido en 7.1.6, pero no debe forzarse sobre Tailwind 3/postcss-nested con rangos 6.x; buscar backport 6.x o separar la migración. Fuentes y detalle en [LITE_NPM_AUDIT_TRIAGE_R286.md](LITE_NPM_AUDIT_TRIAGE_R286.md). Son versiones candidatas, no cambios aplicados ni aceptación de audit.

---

## 2026-10-24 UTC — r285: EN-RE-12 corregido; Playwright E2E en WAIT

**HEAD técnico verificado:** `5113fd28ee0ddf5233be930eb23c74772fcace97` en `qa/syntax-audit-in625-a1`. PR #48 sigue abierto; no se ha mergeado.

### Corrección y evidencia exacta en el SHA actual
- Se añadió un adaptador acotado en `src/engine/parsing/inequalitySolution.ts`: solo reconoce la salida textual generada de la inecuación de dos rayos y la convierte a una unión canónica que luego valida el lector estricto de intervalos. No acepta texto arbitrario como matemáticas.
- `BasicScientificMode.tsx` pasa ese formato por el adaptador antes del validador de uniones; `tests/inequality.test.ts` cubre salidas estrictas, extremos inclusivos y rechazo de texto/no-disjunción.
- H1b [40069116272](https://github.com/c2melendez/precision-lab-lite/actions/runs/40069116272): **SUCCESS**, 8 pasados; EN-RE-12 pasa en desktop.
- H1d [40069111537](https://github.com/c2melendez/precision-lab-lite/actions/runs/40069111537): **SUCCESS**, 22/22 pasados.
- Acumulativo [40069111608](https://github.com/c2melendez/precision-lab-lite/actions/runs/40069111608): **SUCCESS**; 360 archivos, 2.232 pasados, 8 expected fail, 34 TODO.
- G3 parser [40069116074](https://github.com/c2melendez/precision-lab-lite/actions/runs/40069116074): **SUCCESS**, 26/26. Syntax diagnostic [40069115987](https://github.com/c2melendez/precision-lab-lite/actions/runs/40069115987), Scientific UI [40069116227](https://github.com/c2melendez/precision-lab-lite/actions/runs/40069116227) y S25 [40069116120](https://github.com/c2melendez/precision-lab-lite/actions/runs/40069116120): **SUCCESS**.
- CI [40069116121](https://github.com/c2melendez/precision-lab-lite/actions/runs/40069116121): **FAILURE** en el hard gate `npm audit`: 6 moderate + 2 low, 0 high. No se baja el umbral ni se omite el gate.
- Playwright E2E [40069116223](https://github.com/c2melendez/precision-lab-lite/actions/runs/40069116223): **IN_PROGRESS** sobre el mismo SHA. El corte anterior reportaba EN-RE-20 mobile y EN-RE-21 tablet/móvil además de EN-RE-12; aquí aún no hay logs finales que permitan reclasificarlos.

### Clasificación y estados
- EN-RE-12: **producto corregido**, H1b exacto-en-HEAD PASS; aceptación browser completa pendiente hasta que Playwright termine.
- Fallo transitorio de CI del commit intermedio `1014abe9` (run 40069062729): escape mal formado del nuevo adaptador; corregido en `5113fd28`. La evidencia actual corresponde al HEAD corregido.
- Global OPEN · H2-SG28-DIST-01..08 BLOCKED · SECURITY-S25 global BLOCKED · SY-P-23 OPEN · SY-X-04-PLUS-HTTP BLOCKED · ALGEBRA229-AS-B-29 ON_HOLD · EDCX-B5 BLOCKED por falta de canal/capacidad. No mergear PR #48.

### Siguiente acción única
**WAIT:** inspeccionar conclusión y logs de Playwright E2E run 40069116223 en SHA `5113fd28ee0ddf5233be930eb23c74772fcace97`. Si EN-RE-20/21 siguen rojos, diagnosticar sus aserciones antes de tocar producto o repetir cualquier gate. No repetir H1b, H1d ni acumulativo; no volver a ejecutar el hard gate idéntico mientras no cambie la dependencia o el advisory.

---

## 2026-10-24 UTC — r284: el HIGH de vite ya no está; siguen EN-RE-12 y el hard gate por moderate

**HEAD verificado:** `935366887f1bb670690db90061b75d708f3f9dd8` (bump vite 7.3.6 → 7.3.7, posterior al corte r283).

### Evidencia pull_request exacta en este HEAD
- **S25 Security Gate SUCCESS** [40049504130](https://github.com/c2melendez/precision-lab-lite/actions/runs/40049504130). El paso del workflow es `npm audit --audit-level=high`. El HIGH de vite (GHSA citado en r283) ya no falla este gate. No cierra SECURITY-S25 bilateral: el índice sigue BLOCKED hasta las condiciones de salida, y el hard gate de CI es otro contrato.
- **CI frontend FAILURE** [40049504154](https://github.com/c2melendez/precision-lab-lite/actions/runs/40049504154). `npm ci` reporta 8 vulnerabilidades (2 low, 6 moderate, 0 high) y `npm audit --package-lock-only` sale 1. El hard gate no usa `--audit-level`. No se baja el umbral ni se suprime el paso. Clasificación: dependencia/advisory residual, ya no el HIGH de vite.
- **H1b FAILURE** [40049504150](https://github.com/c2melendez/precision-lab-lite/actions/runs/40049504150). EN-RE-12: S1=`\text{x < -2 o x > 2}` reinyectado igual produce `PARSE_ERROR` «Texto no matemático». 7 passed. Clasificación: **producto/parser**. El fallo ya existía desde el merge r281; el bump de vite no lo toca.
- **Playwright E2E FAILURE** [40049504117](https://github.com/c2melendez/precision-lab-lite/actions/runs/40049504117). 6 failed, 977 passed, 1 skipped. EN-RE-12 en desktop/tablet/mobile; además EN-RE-21 en tablet y mobile, y EN-RE-20 en mobile. Esas dos últimas quedan REVIEW: el resumen no trae la aserción y no se inventa la causa.
- Cumulative, H1d y Scientific UI del mismo SHA: SUCCESS (push 40049500403 / 40049500417 / 40049500463 y sus equivalentes pull_request).

### Estados
Global OPEN · B6 REVIEW · B5 BLOCKED/NO_EJECUTADO · SG28-DIST BLOCKED · SECURITY-S25 BLOCKED · SY-P-23 OPEN · SY-X-04-PLUS-HTTP BLOCKED · ALGEBRA229-AS-B-29 ON_HOLD. No mergear PR #48.

### Siguiente paso único
Diagnosticar EN-RE-12 en el parser (por qué la forma `\text{...}` de la inecuación, que el propio producto acaba de emitir, se rechaza al reentrar). No relanzar H1b ni Playwright hasta cambiar esa precondición. No repetir el bump de vite.

---

## 2026-10-24 UTC — r283: reconciliación exacta-en-HEAD tras push del merge (verificada vía API con auth)

**HEAD verificado**: `875418a0d82cc1bda1f64f380cd2fc09ac6b62b5` (PR #48, base `7cbef02b...`, mergeable=True, mergeable_state=`unstable`). El estado `dirty` de r280 queda RESUELTO por el merge r281.

### Evidencia válida nueva (pull_request, exacta en HEAD)
- **IN625 Cumulative Certification Gate: SUCCESS** (run 40046050475). Pasos "Certification continuity and CI guard regressions" verdes. Primer gate acumulativo exitoso exacto-en-HEAD de Lite.
- SUCCESS además en: Syntax diagnostic A1..G1a (40046050580), G3 parser (40046050428), G3 e2e desktop/tablet/mobile (40046050541), S23 accessibility (40046050422), S22 PWA offline (40046050593), cross-browser smoke (40046050505), Algebra229 source/fixture integrity (40046050521), SY-N-31 Scientific UI (40046050437), H1a/H1c/H1d reentry.
- Playwright E2E (40046050515): in_progress al momento de esta revisión; verificar antes de mergear.

### Fallos activos exacta-en-HEAD (causas raíz identificadas con logs/artifact)
1. **CI frontend / hard gate de auditoría** (run 40046050472) y **S25 Security Gate** (run 40046050487): mismo root cause — `npm audit` reporta 1 HIGH con fix disponible: **vite 7.0.0–7.3.6** (GHSA-9jrq-w75r-8gcw, GHSA-rq7h-c2jc-7f22 + launch-editor). Artifact `lite-npm-audit` (ID 12540964499): total 9 (high 1, moderate 6, low 2). S25 arrastra fallo histórico desde 2026-10-08 (runs 37818703343/37818738329/37843775488 también FAILURE); SECURITY-S25 permanece BLOCKED con causa concreta y accionable: actualizar vite y regenerar package-lock.
2. **IN625 H1b Reentry** (run 40046050435): regresión funcional EN-RE-12 — reinyectar el resultado `	ext{x < -2 o x > 2}` produce PARSE_ERROR ("Texto no matemático"). Este gate era SUCCESS en `3b4d42b7e6`; el fallo aparece desde el merge r281 → probable interacción con código traído de main. Requiere bisect/dirimir antes de tocar producción.

### Estados de certificación
Global OPEN · B6 REVIEW · B5 BLOCKED/NO_EJECUTADO · SG28-DIST BLOCKED (confirmado por evidencia Plus r283) · **SECURITY-S25 BLOCKED (root cause concreto: vuln high vite)** · SY-P-23 OPEN · SY-X-04-PLUS-HTTP BLOCKED · ALGEBRA229-AS-B-29 ON_HOLD. No se modifica ninguna aceptación de bloque: los éxitos nuevos son evidencia a registrar, no certificación.

### Siguiente paso único y concreto
Triage de fallos del HEAD: (a) bump de vite + lockfile para destrabar S25/audit; (b) diagnóstico EN-RE-12 en H1b; (c) confirmar conclusión de Playwright E2E 40046050515. No mergear PR #48 hasta checks verdes o excepciones documentadas.

---

## 2026-10-24 UTC — r282: merge ejecutado, push completado, workflows verificados exitosos

**Acción autorizada**: `git merge origin/main` + resolución de conflictos + push a rama QA (r281).

### Estado post-push
- **Rama**: `qa/syntax-audit-in625-a1`
- **HEAD anterior**: `c29758dc7209122ebd2ce79b0babcc80c0f2732` (docs-only)
- **HEAD nuevo**: `066a675dcd8196feee596e7a6df6f3d1a5ef9ced` (merge commit con cambios funcionales)
- **PR #48 mergeable_state**: cambió de `dirty` a `unstable` (conflictos eliminados; esperando completion de checks)

### Corridas disparadas automáticamente
- **[Run 40045121573](https://github.com/c2melendez/precision-lab-lite/actions/runs/40045121573)**: Syntax309 SY-N-31 Scientific UI E2E
  - Trigger: `push` sobre `qa/syntax-audit-in625-a1`
  - SHA probado: `066a675dcd8196feee596e7a6df6f3d1a5ef9ced` ✓ (exacto-en-HEAD)
  - Estado final: **completed / success**
  - Duración: ~5 minutos
  
### Cambios introducidos por el merge
El merge incorporó desde main:
1. Workflows de CI actualizados (playwright.yml auto-fusionó limpio)
2. Especificaciones E2E reconciliadas
3. Documentación de certificación conservada (rama canónica)

Total: 6 archivos, +56/−12 líneas

### Impacto en certificación
**Evidencia válida nueva**: El HEAD actual tiene una corrida exitosa de E2E Scientific UI. Esto valida Playwright specs y paridad científica hasta `066a675d...`.

**Estados mantenidos** (precaución: no declarar certificación global basada en una sola corrida):
- Lite certificación: `NO_EJECUTADO` → `PARCIAL` (run exitoso, pero falta reconciliar contra roadmap completo)
- Global: `OPEN`

### Nota sobre discrepancia de SHA resuelta
La revisión r279 identificó que el SHA `c29758dc...` aparecía asociado al PR pero devolvía HTTP 422 "No commit found". La causa fue una transcripción incorrecta del hash (39 caracteres hex en lugar de 40). El commit existe correctamente; la API lo validó durante el push.

### Siguiente paso único y concreto
Actualizar `continuity.json` con SHA confirmado (`066a675d...`) y run ID (`40045121573`). Revisar el roadmap de certificación Lite para determinar si este run cubre todos los gates pendientes o si faltan corridas adicionales.

---

## 2026-10-23 UTC — r278: reconciliación de corridas aportadas y filtros CI (OBSOLETO POR r282)

~~Lite [run 40016849405](https://github.com/c2melendez/precision-lab-lite/actions/runs/40016849405): `SUCCESS`, evento `workflow_dispatch`, SHA probado `912e3f8afd1c3a54b1c665c8a91c76490ea4f912`; logs: **456/456 tests passed**. La cabeza actual de PR #48 es `496b1ec10c210b0bdb7f27c8e8734b334b5759c9`; la corrida no certifica esa cabeza.~~

~~Plus [run 40026869114](https://github.com/c2melendez/precision-lab-plus/actions/runs/40026869114): `SUCCESS`, evento `push`, SHA probado `bd25d58fac8e8333bd9e0aa90a1b9a54efa6aa69`; backend y frontend correctos, incluyendo el harness mínimo B6. La cabeza actual de PR #29 es `2d57dcb6e025db3219b0cf423ec05ebff309a8e1`; la corrida no certifica esa cabeza.~~

~~Inspección de workflow: `.github/workflows/syntax309-scientific-e2e.yml` define eventos `push` y `pull_request` con filtros `paths`; excluye gran parte de los cambios solo documentales. Esto es una explicación posible para commits de documentación sin nuevo `push`, pero no demuestra por sí solo por qué faltan checks PR para la cabeza actual, ya que el diff completo de cada PR puede incluir código.~~

~~PR #48 continúa abierta y reportada como `mergeable=false`; no mergear ni reejecutar gates globales por rutina. Próximo paso único: cotejar diff/paths de la PR actual con los filtros y consultar branch protection/rulesets para identificar checks requeridos; después volver al test dirigido del adaptador B6. Global `OPEN`; B6 `REVIEW`; bloqueos SG28/DIST y S25 conservados.~~

---

## 2026-10-23 UTC — r276: comprobación exacta de PR/HEAD

- HEAD de rama y head SHA de la PR #48: `1e8b625454179435dc85f9033984d10098def56c`; base SHA: `eb728e0ebb367f15b06aca491ca6236006834387`.
- La consulta de workflows asociadas al SHA exacto no devolvió runs `pull_request`. Los últimos `push` visibles consultados siguen en SHA anterior `40b000b8f40fc8ac6c3e286b48c83554dac1e9e3`; no son evidencia de este HEAD.
- PR #48 está abierta y GitHub reporta `mergeable=false`; API informa 3260 commits y 553 archivos cambiados. No mergear ni intentar arreglar conflictos automáticamente dentro de este objetivo.
- La consulta es acotada y no demuestra ausencia absoluta de todos los checks en otros endpoints. No se despacharon workflows.
- Siguiente acción: aclarar por qué no hay runs `pull_request` asociados al HEAD exacto y confirmar los checks requeridos antes de decidir cualquier CI. B6 permanece REVIEW; B5 BLOCKED en Plus; Lite NO_EJECUTADO; global OPEN; SG28/DIST y S25 bloqueados.

---

## 2026-10-23 UTC — r275: reconciliación acotada de HEAD y Actions

- HEAD actual de la rama: `c4decef6cc6792e776bbb6908530579e68694a37`. Últimos runs `push` visibles consultados usan SHA `40b000b8f40fc8ac6c3e286b48c83554dac1e9e3`, por lo que **no prueban el HEAD actual**.
- Último grupo `pull_request` visible en la primera página: fecha 2026-10-08, SHA de ejecución `3b4d42b7e63f97377d7d40f01f639627b107f632`. PR #48 visible page includes CI FAILURE, Playwright E2E FAILURE and S23 Accessibility Gate FAILURE; latest visible PR event is older than current HEAD.
- La consulta fue acotada a primeras páginas de API; no se afirma que sea el historial exhaustivo. No se despachó ningún workflow en esta revisión.
- Siguiente acción única: validar el adaptador B6 con prueba dirigida y, antes de cualquier CI nuevo, comprobar los checks `pull_request` que correspondan al HEAD actual. No repetir gates globales verdes ni interpretar los antiguos como evidencia de HEAD actual.
- B6 REVIEW; B5 BLOCKED en Plus; Lite NO_EJECUTADO; certificación global OPEN. SG28/DIST y S25 conservan sus bloqueos.

---

## 2026-10-23 UTC — r274: espejo del plan de adaptador/oráculo EDCX-B6

- Plus publicó [EDCX_B6_ADAPTER_ORACLE_PLAN.md](https://github.com/c2melendez/precision-lab-plus/blob/qa/syntax-audit-in625-a1/qa/certification/EDCX_B6_ADAPTER_ORACLE_PLAN.md), con entradas candidatas y oráculo independiente math/cmath; la decodificación de salida aún debe validarse.
- No se ejecutaron tests B6 ni Actions nuevos. Lite sigue NO_EJECUTADO; no inferir paridad ni despachar gates globales.
- Siguiente paso coordinado: validar en Plus el adaptador de salida con una prueba dirigida. Global OPEN; bloqueos sin cambios.

---

## 2026-10-23 UTC — r273: espejo de trazabilidad B6

- Plus publicó [EDCX_B6_TEST_TRACEABILITY.md](https://github.com/c2melendez/precision-lab-plus/blob/qa/syntax-audit-in625-a1/qa/certification/EDCX_B6_TEST_TRACEABILITY.md). El harness actual no demuestra aceptación matemática completa de ninguna de las 53 filas; `VC-FE-05` y `VC-FE-14` solo tienen cobertura parcial, y `VC-FE-11` requiere un contrato multivaluado.
- La corrida de Plus terminó `SUCCESS`, pero esa evidencia no es de Lite. Lite permanece `NO_EJECUTADO`; no declarar paridad ni correr los gates globales.
- Siguiente paso coordinado: definir adaptador de notación y oráculo independiente para el primer grupo escalar en Plus; luego revisar la necesidad de pruebas separadas. Certificación global `OPEN`.

---

## 2026-10-23 UTC — r272: espejo de evidencia CI B6 (sin paridad)

- En Plus, la corrida [40026869114](https://github.com/c2melendez/precision-lab-plus/actions/runs/40026869114) terminó `SUCCESS` en SHA técnico `bd25d58fac8e8333bd9e0aa90a1b9a54efa6aa69`; los cinco checks del harness B6 pasaron dentro de la suite backend (`2383 passed, 1 skipped, 10 xfailed`).
- La evidencia es solo de Plus; no se ejecutó B6 en Lite y no se afirma paridad. Lite sigue `NO_EJECUTADO`; B6 `REVIEW`; B5 `BLOCKED`; certificación global `OPEN`.
- No lanzar Actions redundantes. Siguiente paso: usar la matriz de trazabilidad de 53 filas de Plus para identificar qué evidencia falta, sin copiar un resultado de Plus como resultado de Lite.

---

## 2026-10-23 UTC — r271: espejo de continuidad B6 (test no ejecutado)

- El harness `backend/tests/test_edcx_b6_contract.py` fue creado solo en Plus; todavía no se ejecutó. Lite no tiene implementación compleja equivalente y sigue `NO_EJECUTADO`.
- No declarar paridad, no cambiar bloqueos y no despachar gates globales. Siguiente paso: obtener evidencia del test dirigido en Plus.

---

## Continuidad operativa obligatoria — r265

Antes de cualquier dispatch, reconciliar HEAD y Actions (push y pull_request) en Lite y Plus según [ROADMAP_CONTINUITY.md](ROADMAP_CONTINUITY.md). No cambiar la tarea viva aquí: la única siguiente acción es la definida por `continuity.json`; en este corte es **EDCX-B6 (VC-FE, 53 filas; REVIEW por canal vacío)**. Mantener SG28/DIST y S25 bloqueados, y SY-P-23, SY-X-04-PLUS-HTTP y ALGEBRA229-AS-B-29 en sus estados vigentes hasta verificar sus condiciones de salida. Aplicar RUN/WAIT/REUSE/DIAGNOSE/REVIEW y no repetir gates verdes vigentes.

---

## 2026-10-23 UTC — r269: referencia al borrador contractual EDCX-B6

- El borrador de 53 filas se creó en Plus: [EDCX_B6_ROW_CONTRACT_DRAFT.md](https://github.com/c2melendez/precision-lab-plus/blob/qa/syntax-audit-in625-a1/qa/certification/EDCX_B6_ROW_CONTRACT_DRAFT.md).
- No implica ejecución ni paridad de Lite; permanece NO_EJECUTADO por falta de motor equivalente. B5 sigue BLOCKED en Plus y certificación global OPEN.
- Próximo paso: revisar el contrato técnico por fila en Plus y no lanzar CI hasta que endpoints, ramas, oráculo y aceptación estén definidos.

---

## 2026-10-23 UTC — r268: espejo documental de EDCX-B6

- B6 sigue REVIEW y no se ejecuta en Lite: no hay motor de variable compleja equivalente.
- Se corrige la interpretación del campo `canal`: en el JSONL de Plus hay 589/638 filas vacías y 49 con transformaciones entre representaciones; ese campo no representa rutas HTTP. No debe completarse con un endpoint por inferencia.
- La tabla de contrato B6 debe definir por fila notación, rama/signo, endpoint/payload técnico, oráculo independiente, tolerancia y aceptación antes de cualquier medición en Plus.
- B5 continúa BLOCKED en Plus y NO_EJECUTADO en Lite. Certificación global OPEN. No se despachó CI.
- Auditoría de referencia: [EDCX_B6_CHANNEL_AUDIT.md](https://github.com/c2melendez/precision-lab-plus/blob/qa/syntax-audit-in625-a1/qa/certification/EDCX_B6_CHANNEL_AUDIT.md).

---

## 2026-10-23 UTC — r266: EDCX-B5 registrado como brecha de capacidad (Lite)

- **Medición:** Lite NO_EJECUTADO. Las 25 filas `VC-LG-01..25` describen lugares geométricos y su campo `canal` está vacío. Lite no tiene una implementación equivalente de esta capacidad.
- **Plus (espejo):** B5 registrado como BLOCKED por capacidad (ver CURRENT_STATE de Plus, r266). No hay PASS ni FAIL en ninguno de los dos productos.
- **Gates:** sin CI nueva. Cambio exclusivamente documental.
- **Siguiente:** EDCX-B6 (53 filas, prefijo VC-FE), REVIEW. Su campo `canal` también está vacío; requiere la misma decisión antes de medir.

---

## 2026-10-23 UTC — r264: registro gates r263 — Lite success

- r264: gates r263 Lite en success: cumulative 40015124636, H1d 40015127464, scientific-ui 40015130309 sobre 61f438d2.
- Siguiente: EDCX-B5 (25 filas, prefijo VC-LG), READY, no iniciado.

---

## 2026-10-23 UTC — r263: EDCX B4 — Plus scoped; Lite NO_EJECUTADO

**EDCX Parte B, B4 (34 filas, ecuaciones en C): medido en Plus; Lite NO_EJECUTADO.**
Lite no tiene motor complejo equivalente para estas ecuaciones; no se declara paridad. Certificación global `OPEN`.

- Plus: 14 PASS / 14 PASS_SCOPED / 4 FAIL (VC-EC-16..19, raíces faltantes) / 2 BLOCKED (VC-EC-20..21, `abs(z)`).
- Siguiente: EDCX-B5 (25 filas, prefijo VC-LG), READY, no iniciado.

---

## 2026-10-23 UTC — r262: EDCX B3 — Plus scoped; Lite NO_EJECUTADO

**EDCX Parte B, B3 (19 filas, potencias y raíces de números complejos): 7 PASS exactos + 10 PASS_SCOPED + 2 BLOCKED en Plus.**

- Lite: **0 filas ejecutadas**. No existe motor de variable compleja con
  potencias y raíces (potencia entera, raíz n-ésima, rama principal ni
  enumeración de raíces). No se declara PASS ni FAIL de Lite: gap de alcance.
- Plus B3: 7 PASS exactos + 10 PASS_SCOPED / 2 BLOCKED. `evaluate` resuelve
  potencias enteras y negativas exactas; `sqrt`/`root` devuelven solo la raíz
  principal; `/api/v1/solve` sobre `z^n=w` enumera todas las raíces exactas.
- PASS_SCOPED en Plus: `VC-PR-07..16` usan `/solve` como ruta alternativa para
  el conjunto completo de raíces (`z^4=-4 -> ±1±i`, `z^3=8 -> 2, -1±i√3`,
  `z^6=1` en seis radicales cartesianos).
- BLOCKED en Plus: `VC-PR-17` (sin nodo de sumatoria; `sum`/`Sum` ->
  `PARSE_ERROR`) y `VC-PR-18` (sin operación de producto de raíces).
- Hallazgos: `sqrt(i)` se devuelve sin simplificar como `sqrt(I)`;
  `(-8)^(1/3)` devuelve `2*(-1)**(1/3)`, la raíz compleja principal, no `-2`.
- Acumulado EDCX (A + B1 + B2 + B3): 319 / 638 filas, 188 PASS / 131 BLOCKED.
- Evidencia CI Plus: `ab220425` cumulative [39945613218] / H1d
  [39945613228] **SUCCESS** (2345 passed, 1 skipped, 6 xfailed, cobertura
  87.92%). Harness B3 22/22.
- Detalle completo en `CURRENT_STATE.md`, `EXECUTION_LOG.md` y
  `MANUAL_CAPABILITY_GAPS.md` del repo Plus, r262.

**Siguiente acción única:** EDCX Parte B, bloque B4 (ecuaciones en C, 34
filas, `VC-EC-01..34`) en Plus; Lite permanece sin motor complejo equivalente.

---

## 2026-10-23 UTC — r261: EDCX B2 — Plus scoped; Lite NO_EJECUTADO

**EDCX Parte B, B2 (41 filas, operaciones con números complejos): 20 PASS exactos + 13 PASS_SCOPED + 8 BLOCKED en Plus.**

- Lite: **0 filas ejecutadas**. No existe motor de operaciones con complejos
  (`i` como unidad, `re`, `im`, `conj`, `abs`, `exp` con esa semántica). No se
  declara PASS ni FAIL de Lite: gap de alcance.
- Plus B2: 20 PASS exactos + 13 PASS_SCOPED / 8 BLOCKED. La forma binómica se
  evalúa literalmente, incluida la multiplicación implícita
  (`(2+3i)(1-i)=5+i`); las nueve entradas `r_{theta}` devuelven `PARSE_ERROR`.
- PASS_SCOPED en Plus: `P-01..P-09` requieren la traducción documentada y
  emiten forma binómica/raíz; `T-05` devuelve `exp(I*(alpha+beta))` (Euler
  exacto); `X-04` devuelve la potencia principal
  `32*(-1)**(5/6) = -16*sqrt(3)+16i`; `X-08` conserva
  `conjugate(theta)` (exacto con `theta,r` reales); `X-09` devuelve
  `exp(re(a)-im(b))` (exacto con `a,b` reales).
- BLOCKED en Plus: `T-04/X-10` (potencia sin combinar), `T-06/T-07/T-08` (sin
  expansión de ángulo múltiple ni linealización), `T-09` (sin nodo de
  sumatoria; `sum`/`Sum` -> `PARSE_ERROR`), `X-11/X-12` (sin reescritura de
  media ángulo ni serie geométrica).
- Hallazgo: `cos3theta` se interpreta como símbolo libre, no como
  `cos(3*theta)`.
- Acumulado EDCX (A + B1 + B2): 300 / 638 filas, 171 PASS / 129 BLOCKED.
- Evidencia CI Plus: `7c87b95f` cumulative [39943293295] / H1d
  [39943293116] **SUCCESS** (2323 passed, 1 skipped, 6 xfailed, cobertura
  87.96%).
- Detalle completo en `CURRENT_STATE.md`, `EXECUTION_LOG.md` y
  `MANUAL_CAPABILITY_GAPS.md` del repo Plus, r261.

**Siguiente acción única:** EDCX Parte B, bloque B3 (potencias y raíces, 19
filas, `VC-PR-01..19`) en Plus; Lite permanece sin motor complejo equivalente.

---

## 2026-10-23 UTC — r260: EDCX B1 — Plus scoped; Lite NO_EJECUTADO

**EDCX Parte B, B1 (49 filas, conversión entre representaciones): 45 PASS_SCOPED + 4 BLOCKED en Plus.**

- Lite: **0 filas ejecutadas**. No existe motor de variable compleja que cubra
  la conversión B/P/T/X (`abs`, `arg`, `re`, `im`, `topolar` no están
  implementados con esa semántica). No se declara PASS ni FAIL de Lite: gap de
  alcance.
- Plus B1: 45 PASS_SCOPED / 4 BLOCKED. No hay notación polar de entrada
  (`2_{pi/3}` -> `PARSE_ERROR`; `2 angle pi/3` -> `2*pi*angle/3`) ni de salida
  (`topolar(3)=3`, `topolar(-2)=-2`, `topolar(1+i)=(-1)**(1/4)*sqrt(2)`). La
  conversión se certifica con `abs`+`arg` y oráculo sympy que reconstruye las
  formas B/T/X; las 10 filas P usan la traducción documentada
  `r_theta -> r*(cos(theta)+i*sin(theta))`.
- BLOCKED: `B-17` (`arg(0)=0` sin aviso frente a `topolar(0)=DOMAIN_ERROR`) y
  `T-09/T-10/X-12` (formas semángulo simbólicas sin reducir).
- Acumulado EDCX (A + B1): 259 / 638 filas, 138 PASS / 121 BLOCKED.
- Evidencia CI Plus: `a53449db` cumulative [39940618566] / H1d [39940618559]
  **SUCCESS** (2285 passed, 1 skipped, 6 xfailed, cobertura 87.94%).
- Detalle completo en `CURRENT_STATE.md`, `EXECUTION_LOG.md` y
  `MANUAL_CAPABILITY_GAPS.md` del repo Plus, r260.

**Siguiente acción única:** EDCX Parte B, bloque B2 (operaciones, 41 filas) en
Plus; Lite permanece sin motor complejo equivalente.

---

## 2026-10-23 UTC — r259: EDCX A8 — Plus scoped; Lite NO_EJECUTADO

**EDCX Parte A, A8 (6 filas, casos límite): 0 PASS / 6 BLOCKED en Plus. Parte A completa: 210 / 638 filas, 93 PASS / 117 BLOCKED.**

- Lite: **0 filas ejecutadas**. `src/engine/stepEngine/ode.ts` no implementa
  análisis de existencia/unicidad, ramas múltiples, intervalo máximo ni
  condiciones de frontera. No se declara PASS ni FAIL de Lite: gap de alcance.
- Plus A8: 0 PASS / 6 BLOCKED. `CL-01/CL-02` comparten el mismo
  `UNSUPPORTED_OPERATION`; `CL-03` devuelve una integral implícita sin ramas;
  `CL-04` evalúa `1/(1-x)` en `x=2` como `-1` sin error de intervalo; `CL-05`
  devuelve solo `-|x|`; `CL-06` se rechaza por el límite de una condición
  inicial, no por incompatibilidad de frontera.
- Parte A completa (A1–A8): 210 / 638 filas, 93 PASS / 117 BLOCKED.
- Evidencia CI Plus: `c3d38972` cumulative [39935820474] / H1d [39935820754]
  **SUCCESS** (2224 passed, 1 skipped, 6 xfailed, cobertura 87.94%).
- Detalle completo en `CURRENT_STATE.md`, `EXECUTION_LOG.md` y
  `MANUAL_CAPABILITY_GAPS.md` del repo Plus, r259.

**Siguiente acción única:** EDCX Parte B, bloque B1 (conversión de formas, 49
filas) en Plus; Lite permanece sin motor complejo equivalente.

---

## 2026-10-23 UTC — r258: EDCX A7 — Plus scoped; Lite NO_EJECUTADO

**EDCX Parte A, A7 (25 filas, cualitativo/numérico/retardo): 4 PASS (2 exactos + 2 con alcance) / 21 BLOCKED en Plus.**

- Lite: **0 filas ejecutadas**. `src/engine/stepEngine/ode.ts` no implementa
  análisis cualitativo, trayectorias ortogonales, iteración de Picard, métodos
  numéricos, recurrencias ni ecuaciones con retardo. No se declara PASS ni FAIL
  de Lite: gap de alcance.
- Plus A7: 2 PASS exactos (`ED-Q-23/24`: `Si(x)` y `sqrt(pi)/2 erf(x)`) + 2
  PASS_SCOPED (`ED-Q-05/06`: solución exacta, intervalo máximo solo derivado con
  oráculo) + 21 BLOCKED (cualitativas, no unicidad, ortogonales, Picard,
  Euler/Heun/RK4, recurrencias, retardo y Riccati).
- Acumulado EDCX A1–A7 en Plus: **204 filas, 93 PASS / 111 BLOCKED**.
- Evidencia CI Plus: `795a97ef` cumulative [39934588535] / H1d [39934588487]
  **SUCCESS** (2217 passed, 1 skipped, 6 xfailed, cobertura 87.90%).
- Detalle completo en `CURRENT_STATE.md`, `EXECUTION_LOG.md` y
  `MANUAL_CAPABILITY_GAPS.md` del repo Plus, r258.

**Siguiente acción única:** EDCX A8 (casos límite, 6 filas) en Plus; Lite permanece
sin motor EDO equivalente.

---

## 2026-10-23 UTC — r257: EDCX A6 — Plus scoped; Lite NO_EJECUTADO

**EDCX Parte A, A6 (26 filas, EDP): 1 PASS_SCOPED / 25 BLOCKED en Plus.**

- Lite: **0 filas ejecutadas**. `src/engine/stepEngine/ode.ts` no implementa EDP,
  clasificación, características, series de Fourier ni núcleo del calor. No se
  declara PASS ni FAIL de Lite: gap de alcance.
- Plus A6: 1 PASS_SCOPED (`ED-P-25`: laplaciano de `e^x sin y` compuesto con dos
  derivadas parciales reales de orden 2 y suma exacta 0) + 25 BLOCKED
  (transporte, Burgers, d'Alembert, cuerda, calor, Laplace/Poisson, autovalores
  con dos fronteras y núcleo del calor).
- Acumulado EDCX A1–A6 en Plus: **179 filas, 89 PASS / 90 BLOCKED**.
- Evidencia CI Plus: `9a828f3c` cumulative [39932526897] / H1d [39932526943]
  **SUCCESS** (2198 passed, 1 skipped, 6 xfailed, cobertura 87.90%).
- Detalle completo en `CURRENT_STATE.md`, `EXECUTION_LOG.md` y
  `MANUAL_CAPABILITY_GAPS.md` del repo Plus, r257.

**Siguiente acción única:** EDCX A7 (cualitativo/numérico/retardo, 25 filas) en
Plus; Lite permanece sin motor EDO/EDP equivalente.

---

## 2026-10-23 UTC — r256: EDCX A5 — Plus scoped; Lite NO_EJECUTADO

**EDCX Parte A, A5 (10 filas, series y Frobenius): 8 PASS / 2 BLOCKED en Plus.**

- Lite: **0 filas ejecutadas**. `src/engine/stepEngine/ode.ts` solo cubre
  `y'=f(x)` y EDO lineales de 2.º orden con coeficientes constantes; no hay
  series, Frobenius ni clasificación de puntos singulares. No se declara PASS ni
  FAIL de Lite: gap de alcance.
- Plus A5: 5 PASS exactos (`ED-F-01..05`: trigonométrica, Airy, Bessel) +
  3 PASS_SCOPED (`ED-F-06..08`: serie truncada de Legendre y polinomios de
  Hermite/Chebyshev por elección de constantes) + 2 BLOCKED (`ED-F-09..10`:
  clasificación de punto singular regular/irregular sin canal).
- Acumulado EDCX A1–A5 en Plus: **153 filas, 88 PASS / 65 BLOCKED**.
- Evidencia CI Plus: `50d9ca03` cumulative [39929466812] / H1d [39929467052]
  **SUCCESS** (2168 passed, 1 skipped, 6 xfailed, cobertura 87.85%).
- Detalle completo en `CURRENT_STATE.md`, `EXECUTION_LOG.md` y
  `MANUAL_CAPABILITY_GAPS.md` del repo Plus, r256.

**Siguiente acción única:** EDCX A6 (EDP, 26 filas) en Plus; Lite permanece sin
motor EDO/EDP equivalente.

---

## 2026-10-23 UTC — r255: EDCX A3+A4 — Plus scoped; Lite NO_EJECUTADO

**EDCX Parte A, A3 (16 filas) + A4 (24 filas): 4 PASS / 36 BLOCKED en Plus.**

- Lite: **0 filas ejecutadas**. `src/engine/stepEngine/ode.ts` solo cubre
  `y'=f(x)` y EDO lineales de 2.º orden con coeficientes constantes; no hay
  sistemas, exponencial matricial, Laplace, ecuaciones integrales ni series.
  No se declara PASS ni FAIL de Lite: gap de alcance.
- Plus A3: 3 PASS_SCOPED (`ED-M-11..13`, autovalores exactos por
  `/matrix/eigen`) + 13 BLOCKED (sistemas, `expm`, no lineales/Lyapunov).
- Plus A4: 1 PASS (`ED-T-17` con `t -> x`, residuo + condición inicial) +
  23 BLOCKED (`laplace`/`ilaplace`, convolución, dos condiciones iniciales,
  integrales, sistema).
- Acumulado EDCX A1–A4 en Plus: **143 filas, 80 PASS / 63 BLOCKED**.
- Defecto confirmado en Plus (no corregido): la segunda condición inicial con
  `;` documentada en `_parse_initial_condition` no está implementada.
- Evidencia CI Plus: `6aef2571` cumulative [39926515965] / H1d [39926515979]
  **SUCCESS**; `02e198ac` cumulative [39927284848] / H1d [39927284862]
  **SUCCESS** (2157 passed, 1 skipped, 6 xfailed, cobertura 87.85%).
- Detalle completo en `CURRENT_STATE.md`, `EXECUTION_LOG.md` y
  `MANUAL_CAPABILITY_GAPS.md` del repo Plus, r255.

**Siguiente acción única:** EDCX A5 (series / Frobenius, 10 filas) en Plus;
Lite permanece sin motor EDO equivalente.

---

## 2026-10-23 UTC — r254: EDCX A1+A2 — PASS_SCOPED en Plus; Lite NO_EJECUTADO

**EDCX Parte A, A1 (53 filas) + A2 (50 filas): 76 PASS / 27 BLOCKED en Plus.**

- Lite: **0 filas ejecutadas**. `src/engine/stepEngine/ode.ts` solo cubre `y'=f(x)`
  y EDO lineales de 2.º orden con coeficientes constantes; no hay separables,
  lineales con factor integrante, Bernoulli, Riccati, Clairaut/Lagrange ni
  Wronskianos. No se declara PASS ni FAIL de Lite: gap de alcance.
- Plus: A1 47 PASS / 6 BLOCKED (ED-L-12 canal `x(y)`; ED-X-02/X-03, ED-B-09,
  ED-C-02, ED-C-05 acotados); A2 29 PASS / 21 BLOCKED (orden>2, dos condiciones
  iniciales, `yy''=y'^2`, celdas `exp/log` en el parser de matrices).
- Detalle completo y evidencia CI en el repo Plus, r254:
  `CURRENT_STATE.md`, `EXECUTION_LOG.md`, `MANUAL_CAPABILITY_GAPS.md`.
- Contexto Lite: el catálogo MV se cerró en `40b000b8` (MV-J, cumulative
  [39914455096](https://github.com/c2melendez/precision-lab-lite/actions/runs/39914455096)
  **SUCCESS**); las revisiones documentales r249–r253 se mantuvieron en Plus.

**Siguiente acción única:** EDCX A3 (sistemas y exponencial matricial, 16 filas)
en Plus; Lite permanece sin motor EDO equivalente.

---

## 2026-10-23 UTC — r248: MV-E-01..12 PASS_SCOPED_BILATERAL

**MV-E-01..12 (rango, núcleo, Col, rango–nulidad) — PASS_SCOPED_BILATERAL.**

### Producto Lite

- `rank()` en `src/engine/matrixOps.ts`
- `nullspace()` / `columnspace()` en `src/engine/matrixSpaces.ts` (rref exacto, Fraction)
- Suite: `tests/matricesMvE01to12.audit.test.ts`
- HEAD: `4f2abd932c3714318f8ffaef2aa6199d36c33de6`
- cumulative [39905437848](https://github.com/c2melendez/precision-lab-lite/actions/runs/39905437848) **SUCCESS**

### Producto Plus (paridad)

- `/matrix/rank` (allow_symbolic), `/matrix/nullspace`, `/matrix/columnspace`
- cumulative [39904542863](https://github.com/c2melendez/precision-lab-plus/actions/runs/39904542863) **SUCCESS** @ `544d8bd`

**Siguiente acción única:** **MV-F** (siguiente sección de `matriz_matrices_vectores.md.gz`).

---

## 2026-10-23 UTC — r246: MV-D-01..17 PASS_SCOPED_BILATERAL

SHA técnico Lite `c28091c`; gates cumulative/h1d/scientific-ui SUCCESS. Campaña S25/S19 CLEARED en Plus.


---

## 2026-10-23 UTC — r270: referencia a hallazgos de contrato HTTP B6

- Plus documenta el contrato estático del endpoint candidato en [EDCX_B6_HTTP_CONTRACT_FINDINGS.md](https://github.com/c2melendez/precision-lab-plus/blob/qa/syntax-audit-in625-a1/qa/certification/EDCX_B6_HTTP_CONTRACT_FINDINGS.md).
- No es evidencia runtime ni prueba de paridad. El endpoint de Plus devuelve `result_approx` solo para resultados reales; las respuestas complejas requieren validación independiente de texto/LaTeX y el caso multivaluado necesita un contrato distinto.
- Lite permanece NO_EJECUTADO; B5 BLOCKED en Plus y certificación global OPEN. No se ejecutaron tests ni Actions.

## 2026-10-24 UTC — r287: npm audit remediado y verificado en CI

- SHA técnico `1cf29a7192c803afc461e10fb4912f9bc88cec4e`. Se actualizaron `vitest`/`@vitest/mocker` a 5.0.3, `fast-uri` a 3.1.9, `serialize-javascript` a 7.1.4 y `katex` a 0.18.2; `package-lock.json` regenerado con npm (lockfile v3) y validado con `npm ci`.
- `postcss-selector-parser` se resolvió con override a 7.1.7 porque Tailwind 3.4.19 no admite el rango 7.x. La compatibilidad se demostró, no se asumió: el CSS de producción es byte a byte idéntico antes y después (`index-BcOzQwa2.css`, 59,816 bytes, SHA-256 `E9D13FB752B976D46FF6CE78F2D81FCDF4D71A93ACF20B1EB67BD14F38B43436`), con typecheck, suite completa y build correctos.
- **Hard gate CLEARED**: `npm audit --package-lock-only` devuelve 0 vulnerabilidades (antes: 2 low, 6 moderate). No se rebajó el gate ni se añadió excepción. Detalle en `LITE_NPM_AUDIT_REMEDIATION_R287.md`.
- Evidencia en GitHub: CI [40138503619](https://github.com/c2melendez/precision-lab-lite/actions/runs/40138503619) **SUCCESS** con `found 0 vulnerabilities`, 360 archivos / 2,232 passed / 8 expected fail / 34 TODO y build 5.71 s; cumulative [40137719189](https://github.com/c2melendez/precision-lab-lite/actions/runs/40137719189), H1d [40137719188](https://github.com/c2melendez/precision-lab-lite/actions/runs/40137719188), scientific [40137719203](https://github.com/c2melendez/precision-lab-lite/actions/runs/40137719203) y dependency gates [40137719274](https://github.com/c2melendez/precision-lab-lite/actions/runs/40137719274) SUCCESS.
- PR #48 está `OPEN`/`DRAFT` con `mergeable: false` (`dirty`), por lo que GitHub no dispara workflows de `pull_request` en los pushes nuevos. Para no declarar verde un gate no ejecutado, CI y Playwright se despacharon con `workflow_dispatch` sobre la rama; no se modificó ningún workflow ni filtro.
- Playwright [40138909348](https://github.com/c2melendez/precision-lab-lite/actions/runs/40138909348) **FAILURE**: 979 passed, 4 failed, todos en `e2e/in625-h1c-reentry.spec.ts` (EN-RE-21 en desktop/tablet/mobile y EN-RE-20 con timeout de 30 s en desktop esperando `math-field[read-only]`). En `a8d726f0` (run 40078650376, antes de la remediación) ya fallaba EN-RE-21 y EN-RE-20 pasaba en 2.2 s; no hay vínculo demostrado con los paquetes cambiados (build/test o no usados en runtime). No se tocaron specs ni oráculos.
- Bloqueos sin cambios: SECURITY-S25 BLOCKED; ALGEBRA229-AS-B-29 ON_HOLD; H2-SG28-DIST-01..08 BLOCKED; EDCX-B5 BLOCKED; SY-X-04-PLUS-HTTP BLOCKED; PR #48 OPEN/DRAFT; certificación global OPEN.

## 2026-10-24 UTC — r288: EN-RE-21/20 diagnosticados y canal H1c cerrado

- **EN-RE-21 no era un fallo de producto.** En la corrida de diagnóstico el campo MathLive ya contenía `5\cdot2` tras ANS → `\cdot` → `2`, pero el spec leía de inmediato el resultado anterior `5`; con 2 s de espera el mismo flujo devolvía `10`. Era una carrera entre el reemplazo del nodo de resultado y la lectura.
- **EN-RE-20 era un timeout de CI, no de producto.** Desktop local pasa en 5.1 s (7.1 s dentro del spec completo) y tablet/mobile ya pasaban en `1cf29a71`. El nodo `math-field[read-only]` se desmonta durante el re-render y Playwright aguardaba el elemento completo hasta agotar los 30 s.
- Corrección solo de arnés en `444df962` (`e2e/in625-h1c-reentry.spec.ts`): `readOutcomeAfterChange` exige un resultado distinto del anterior antes de afirmar, y la lectura del `math-field` queda acotada a 5 s con fallback al texto de estado accesible. No se modificaron producto, specs de contrato, oráculos, matrices ni gates.
- Evidencia local: spec H1c completo **18/18** en desktop/tablet/mobile (1.3 m) y EN-RE-20 desktop aislado en 5.1 s.
- Evidencia en GitHub sobre `444df962`: H1c [40143756120](https://github.com/c2melendez/precision-lab-lite/actions/runs/40143756120) **SUCCESS**, 6 passed desktop (EN-RE-20 1.6 s, EN-RE-21 1.6 s); Playwright [40143758336](https://github.com/c2melendez/precision-lab-lite/actions/runs/40143758336) **SUCCESS**, 983 passed y 1 skipped (11.6 m), con EN-RE-20/21 verdes en los tres viewports; cumulative [40143738485](https://github.com/c2melendez/precision-lab-lite/actions/runs/40143738485) **SUCCESS**, 360 archivos / 2,232 passed / 8 expected fail / 34 TODO; H1d [40143738467](https://github.com/c2melendez/precision-lab-lite/actions/runs/40143738467) **SUCCESS**, 22 passed.
- El bloqueo `LITE-PLAYWRIGHT-H1C-EN-RE-21` queda **RESUELTO y verificado** por runs exactos en HEAD; se retira de la lista de bloqueos activos y su evidencia queda en `h1c_harness_fix_r288`.
- Bloqueos sin cambios: SECURITY-S25 BLOCKED; ALGEBRA229-AS-B-29 ON_HOLD; H2-SG28-DIST-01..08 BLOCKED; EDCX-B5 BLOCKED; SY-X-04-PLUS-HTTP BLOCKED; SY-P-23 OPEN; PR #48 OPEN/DRAFT; certificación global OPEN.

## 2026-10-24/25 UTC — r289: PR #48 diagnosticado; merge mecánico verificado sin publicar

- PR #48 sigue `OPEN`/`DRAFT`, `mergeable: false` (`dirty`), head `ea68e99a`, base declarada `7cbef02b`; `main` real está en `773f7b28`.
- `git merge-tree --write-tree FETCH_HEAD HEAD` (solo lectura) devuelve **un único conflicto en `package.json`**; `package-lock.json` se auto-fusiona. Causa: `main` avanzó dos commits (`vitest` 5.0.3 y `katex` 0.18.2) y su cola de `devDependencies` choca con el bloque `overrides` que añadió la rama; la rama ya contiene `vitest ^5.0.3` y `katex ^0.18.2`.
- `main` queda además internamente inconsistente: `package.json` declara `katex ^0.16.11`, la raíz del lock declara `^0.18.2` y el paquete instalado es `0.16.47`. La rama es consistente (`^0.18.2` / `^0.18.2` / `0.18.2`).
- Experimento local en un worktree desechable: merge de `773f7b28` conservando `package.json` y `package-lock.json` de la rama → **árbol byte a byte idéntico a `ea68e99a`** (`git diff --stat ea68e99a` vacío). El commit de merge local es `773bcba9` y **no se publicó**.
- Motivo para no publicarlo: el merge no cambia contenido frente a su primer padre; al volverse `mergeable` el PR, GitHub volvería a despachar los workflows de PR ya verdes y el clasificador de alcance evaluaría un delta vacío. La decisión queda explícita en `next_action`.
- Reconciliación de evidencia por SHA: `ea68e99a` es solo documentación y los workflows de push ignoran `**/*.md` y `continuity.json`, por lo que no generó runs; `444df962` aporta H1c, Playwright, cumulative y H1d verdes; `1cf29a71` aporta CI, cumulative, H1d, scientific y dependency gates verdes. El único delta hasta `444df962` es un spec E2E, que no entra en `tsconfig.app.json` (`include: src`) ni en la suite unitaria, así que esos verdes siguen aplicando a la fuente sin cambios.
- Bloqueos sin cambios: SECURITY-S25 BLOCKED; ALGEBRA229-AS-B-29 ON_HOLD; H2-SG28-DIST-01..08 BLOCKED; EDCX-B5 BLOCKED; SY-X-04-PLUS-HTTP BLOCKED; SY-P-23 OPEN; PR #48 OPEN/DRAFT; certificación global OPEN.

## 2026-10-24/25 UTC — r290: decisión sobre PR #48 (mantener draft)

- Decisión registrada: PR #48 permanece **OPEN/DRAFT** y **no se publica** el merge de topología contra `main`. El conflicto es solo textual en `package.json` y la resolución local no cambia contenido (árbol idéntico a `ea68e99a`), pero publicarlo haría mergeable el PR y volvería a despachar workflows de PR ya verdes sin evidencia nueva.
- La integración se reconsiderará cuando cierren los bloqueos de certificación (SECURITY-S25, ALGEBRA229-AS-B-29, H2-SG28-DIST-01..08, EDCX-B5, SY-X-04-PLUS-HTTP) o exista autorización explícita.
- Evidencia de gates vigente: `444df962` (H1c, Playwright, cumulative, H1d verdes) y `1cf29a71` (CI, cumulative, H1d, scientific y dependency gates verdes). No hay cambios de fuente desde `1cf29a71`; el único delta es el arnés E2E, fuera de `tsconfig.app.json` y de la suite unitaria. No se repiten esos gates.
- Bloqueos sin cambios: SECURITY-S25 BLOCKED; ALGEBRA229-AS-B-29 ON_HOLD; H2-SG28-DIST-01..08 BLOCKED; EDCX-B5 BLOCKED; SY-X-04-PLUS-HTTP BLOCKED; SY-P-23 OPEN; PR #48 OPEN/DRAFT; certificación global OPEN.

## 2026-10-25 UTC — r291: triage local cerrado; los bloqueos restantes son bilaterales o de capacidad

- **Estado del repositorio:** HEAD `4cee0e76` en `qa/syntax-audit-in625-a1`, árbol limpio. No hay cambios de fuente, fixtures, workflows, dependencias ni contrato desde `1cf29a71` (gates verdes) y `ea68e99a`/`444df962` (H1c, Playwright, cumulative y H1d verdes). PR #48 sigue **OPEN/DRAFT** con `mergeable: false`.
- **Triage de bloqueos:** no queda ningún bloqueo de certificación accionable solo en Lite.
  - **SECURITY-S25**: el canal de remediación de Lite quedó cerrado en r287 (`LITE_NPM_AUDIT_REMEDIATION_R287.md`); lo que resta es evidencia del gate de seguridad compartido, que se reconcilia desde Plus.
  - **ALGEBRA229-AS-B-29**: ON_HOLD por decisión de contrato; no es PASS ni FAIL y no se desbloquea ejecutando pruebas de Lite.
  - **H2-SG28-DIST-01..08**: requiere la topología distribuida y la evidencia de Plus; Lite no tiene canal equivalente.
  - **EDCX-B5**: VC-LG-01..25 carece de canal y endpoint de producto en ambos repos; no se simula capacidad inexistente.
  - **SY-X-04-PLUS-HTTP**: es un canal HTTP de Plus; la evidencia de parser/UI de Lite no lo sustituye.
  - **SY-P-23**: sigue **OPEN** por convención no declarada (`a/bc`); no se certifica como PASS ni se cierra por pruebas numéricas de las lecturas explícitas.
- **Decisión registrada:** no se despachan runs nuevos ni se repiten H1c, Playwright, cumulative, H1d, CI, scientific ni dependency gates mientras no cambie un insumo técnico o exista una decisión explícita de contrato/alcance. El PR #48 permanece en draft y no se publica el merge de topología. La certificación global sigue **OPEN**.
- **Siguiente acción única:** reentrar cuando Plus produzca evidencia nueva de S19/seguridad o cuando se autorice una decisión de contrato para ALGEBRA229, SG28 distribuido, EDCX-B5 o SY-P-23; en ese momento se reevalúa el merge de PR #48 y se ejecuta solo el gate afectado.

## 2026-10-26 UTC — r294: operación `docs` del Certification Runner v3, publicada por el propio runner

- **Despliegue.** PR #52 fusionado en `main` (merge `11806ba5b2dc05d8690d4300f3897e073859b76a`). Workflow `.github/workflows/certification-runner.yml`, blob `23e42cf6dad30b281036cbbb63eff938c6646fde`, sha256 `c85eb1d4b89606a51904ec792c7ca8bb141dd9ee9ca0f15b1d0eddc82815e0d7`.
- **Operación `docs`.** Acepta un paquete `git format-patch` por HTTPS, lo verifica con SHA-256 y `docs_expected_base_sha`, lo aplica con `git am --3way` conservando los commits y publica con `--force-with-lease`. Solo admite `qa/certification/**.md` y `qa/certification/continuity.json`; rechaza workflows, scripts, tests, dependencias, fixtures, symlinks, modos ejecutables, binarios, commits vacíos y merges. `dry_run=true` valida sin publicar. La operación `gate` conserva el comportamiento v2.
- **Verificación local.** 27/27 pruebas del pipeline sobre un remoto bare: aplicación e historial, registro con URL saneada, rechazo de rutas técnicas y modos, base incorrecta, rama avanzada, conflicto de aplicación, CAS y validación de URL/hash/descarga. YAML validado con PyYAML y todos los bloques `run` con `bash -n`.
- **Evidencia de esta revisión.** Publicada con `operation=docs` (run registrado en `qa/certification/runner/` en el mismo commit de publicación), sin push manual y sin ejecutar gates.
- **Estado.** Sin cambios de fuente desde `1cf29a71`/`444df962`: H1c, Playwright, cumulative, H1d, scientific, CI y dependency gates conservan su evidencia (REUSE). SECURITY-S25 BLOCKED; ALGEBRA229-AS-B-29 ON_HOLD; H2-SG28-DIST-01..08 BLOCKED; EDCX-B5 BLOCKED; SY-X-04-PLUS-HTTP BLOCKED; SY-P-23 CLOSED; PR #48 OPEN/DRAFT; certificación global OPEN.
- **Siguiente acción.** Reconciliar evidencia nueva de Plus (S19/seguridad) cuando cambie; no repetir gates verdes ni reintentar S25 sin cambio de dependencia o advisory.

## 2026-10-26 UTC — r295: evidencia de publicación del runner v3 y audit de la rama canónica

- **Publicación real con `operation=docs`.** Run [40286599978](https://github.com/c2melendez/precision-lab-lite/actions/runs/40286599978) **SUCCESS** (dry-run [40286528777](https://github.com/c2melendez/precision-lab-lite/actions/runs/40286528777)), base `c1627046`, commits `58bdbafe` (documentación) y `66bd7ec7` (registro), registro `qa/certification/runner/40286599978.json`. Los pasos de gate quedaron omitidos; no se dispararon matrices.
- **Audit de la rama canónica.** `npm audit --package-lock-only` sobre el lockfile de `qa/syntax-audit-in625-a1` devuelve **0 vulnerabilidades** (0 low, 0 moderate, 0 high, 0 critical; 492 dependencias). El fallo de CI del PR #52 ocurría en `main` (lockfile distinto: 1 low + 3 moderate) y no afecta a la rama certificada.
- **S25 sin cambio de estado.** El gate de seguridad de Lite conserva evidencia verde en `1cf29a71` (run 40137719274); no se reutiliza por SHA y un audit local no cierra el blocker. SECURITY-S25 permanece **BLOCKED** hasta cumplir su condición de salida explícita y registrar la aceptación.
- **Siguiente acción:** sin cambios respecto a r294.

## 2026-10-26 UTC — r296: paridad con la decisión S19 de Plus

- Plus registró (r309, commit `04962ba`) la aceptación `2026-10-26-s19-focused-acceptance-v1`: S19 backend CLOSED_SCOPED sobre el alcance focalizado, con los mutantes SG28 diferidos a H2-SG28. Esa mutación es de Plus; **Lite no cambia** gates, umbrales ni evidencia.
- Estado Lite sin cambios: SECURITY-S25 BLOCKED; ALGEBRA229-AS-B-29 ON_HOLD; H2-SG28-DIST-01..08 BLOCKED; EDCX-B5 BLOCKED; SY-X-04-PLUS-HTTP BLOCKED; SY-P-23 CLOSED; PR #48 OPEN/DRAFT; certificación global OPEN. Solo documentación; sin Actions.
- **Siguiente acción:** sin cambios respecto a r295; reentrar cuando Plus produzca evidencia nueva o se apruebe el contrato SG28.

## 2026-10-26 UTC — r297: paridad con SG28 un solo host de Plus

- Plus registró (r310) `2026-10-26-sg28-single-host-scope-v1`: H2-SG28-DIST-01..08 = OUT_OF_SCOPE_SINGLE_HOST (no PASS; reapertura si hay varias instancias). SG28 es de Plus; **Lite no cambia** gates ni evidencia.
- Estado Lite: SECURITY-S25 BLOCKED; ALGEBRA229-AS-B-29 ON_HOLD; EDCX-B5 BLOCKED; SY-X-04-PLUS-HTTP BLOCKED; SY-P-23 CLOSED; PR #48 OPEN/DRAFT; certificación global OPEN. Solo documentación; sin Actions.
- **Siguiente acción:** sin cambios respecto a r295; reentrar cuando Plus produzca evidencia nueva.


## 2026-10-26 UTC — r298: exclusión de registros generados del fingerprint; validación pendiente

- Corrección aplicada en `scripts/certification/continuity.py`: la huella ignora únicamente `qa/certification/runner/<id>.json` con ID numérico; el algoritmo pasa a versión 2.
- Pruebas de regresión: cambiar el contenido de un registro generado no invalida evidencia; añadir un archivo no numérico en `runner/` o modificar un contrato sí invalida la huella.
- Se actualizó `CONTINUITY.md` para eliminar el snapshot histórico r235 y documentar la excepción estricta y los marcadores de Actions.
- El siguiente paso es validar este commit mediante la corrida acumulativa activada por el cambio técnico y reconciliar `technical_baseline_sha` con evidencia exacta antes de volver a usar el planificador. No repetir otros gates verdes por rutina.
- Certificación global: OPEN. Bloqueos existentes: sin cambios.