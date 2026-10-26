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

## 2026-10-24 UTC — r287 addendum: revisión de contrato SG28

- Añadido `SG28_CONTRACT_REVIEW_R287.md` (commit `7c6392336039f8e654acb94dc0f75cc6f0818412`).
- Contraste con `SG28_INTEGRATION_EXIT_CRITERIA.md`: el borrador menciona los seis requisitos, pero no define decisiones implementables para presupuesto total, ACK perdido/renewal, reloj/reinicio, fencing del hijo, tabla HTTP/MathResponse ni topología de aceptación.
- Decisión: no cablear endpoint, no activar flags y no repetir suites por documentación. H2-SG28-DIST-01..08 y SY-X-04-PLUS-HTTP continúan BLOCKED; global OPEN; PR #29 abierto.
- Siguiente acción: revisión explícita del responsable backend/infraestructura sobre la matriz de brechas antes de versionar contrato aprobado.

---

## 2026-10-24 UTC — r287: SG28 lease/fencing contract proposed; S18 classified as infrastructure cancellation

- Reconciled Plus PR-head evidence at `6e6a59ee556cf6bba60a40010ec707f05a01ca52`: CI 40069907974, cumulative 40069907843, Playwright 40069907922 and H1a/H1b/H1c/H1d/S17/S20/S21/S23/S25/Syntax diagnostic SUCCESS.
- S19 40069907892 SUCCESS. Backend Plus, frontend Lite and frontend Plus mutation jobs completed SUCCESS and uploaded reports; score/acceptance still requires reviewing the artifacts against thresholds.
- S18 40069907881 was cancelled when the runner received a shutdown signal during the differential/property step; 40069346239 was cancelled similarly. Classify as infrastructure/cancelled, not product failure and not PASS.
- Added `SG28_LOGICAL_REQUEST_LEASE_CONTRACT_PROPOSAL_v1.md`, explicitly `PROPOSED / REVIEW_REQUIRED`, covering total logical-request budget, lease renewal, authoritative clock, fail-closed behavior, execution fencing, HTTP/MathResponse and distributed topology criteria.
- No production flag activated, no HTTP integration wired, no PR merged. DIST remains BLOCKED pending review and independent-host evidence.

## 2026-10-24 UTC — r286: contrato MathResponse off/on corregido; sg28-prototype PASS, cierre global pendiente

- HEAD técnico `c6df370fd3c5779a56bc29317968b26ea046d4bf`; rama `qa/syntax-audit-in625-a1`; PR #29 continúa abierto y no se mergea.
- El test-first en `492e3ed3`, run [40069155348](https://github.com/c2melendez/precision-lab-plus/actions/runs/40069155348), falló en dos comparaciones y permitió aislar la causa: el modo aislado añadía `ParseSecurityError:` al mensaje `PARSE_ERROR`, y el snapshot de HTTP 422 incluía un `duration_ms` no determinista.
- Corregido en `backend/app/routers/evaluate.py` y `backend/tests/test_in625_sg28_loopback_http.py` en `c6df370fd3c5779a56bc29317968b26ea046d4bf`. Se compara el esquema público completo de MathResponse, igualdad semántica off/on para resultados numéricos/simbólicos y errores de parse/dominio/sustitución, y el cuerpo estable de HTTP 422 (se excluyen solo request_id y duration_ms).
- SG28 prototype [40069343572](https://github.com/c2melendez/precision-lab-plus/actions/runs/40069343572) SUCCESS exacto-en-HEAD: 70 passed, 1 warning. S25 [40069346241](https://github.com/c2melendez/precision-lab-plus/actions/runs/40069346241) SUCCESS exacto-en-HEAD.
- Acumulativo [40069346201](https://github.com/c2melendez/precision-lab-plus/actions/runs/40069346201), CI [40069346209](https://github.com/c2melendez/precision-lab-plus/actions/runs/40069346209) y H1d [40069346229](https://github.com/c2melendez/precision-lab-plus/actions/runs/40069346229) seguían IN_PROGRESS al reconciliar; no se duplican.
- Tras esos gates, siguiente paso documentado: contrato versionado para vigencia de solicitud lógica, presupuesto total, lease/renewal, comportamiento fail-closed, autoridad de reloj, recuperación, fencing aplicado al worker efectivo y mapeo de error HTTP/MathResponse, según `SG28_INTEGRATION_EXIT_CRITERIA.md`. Prepararlo como PROPOSED/REVIEW_REQUIRED, sin afirmar aprobación.
- Global OPEN. H2-SG28-DIST-01..08 y SECURITY-S25 siguen BLOCKED; loopback de un host no constituye evidencia distribuida. No activar en producción ni mergear PR #29.

---

## 2026-10-24 UTC — r284: alineación de harness SG28 en Playwright (sin cierre)

- Evidencia previa exacta en `0325fa77`: Playwright [40047564113](https://github.com/c2melendez/precision-lab-plus/actions/runs/40047564113) FAILURE, 11+1 en `in625-h2-sg28-cancel.spec.ts` por `SG28_CI_EVENT_FILE` ausente y timeouts de «Detener cálculo» con aislamiento off. Clasificación harness.
- S18 [40047563967](https://github.com/c2melendez/precision-lab-plus/actions/runs/40047563967) FAILURE por shutdown del runner, no por diff matemático. [40045973724](https://github.com/c2melendez/precision-lab-plus/actions/runs/40045973724) cancelled. Infraestructura; sin relanzamiento manual.
- S25 [40047564057](https://github.com/c2melendez/precision-lab-plus/actions/runs/40047564057) SUCCESS en ese HEAD. SECURITY-S25 permanece BLOCKED.
- Cambio: `.github/workflows/playwright.yml` en `83b18dab5a176087d9f228725a2140c535d07a2f`. Fase general sin flags SG28; fase SG28 con el env del workflow dedicado y `workers=1`.
- Run automático en curso, no es PASS: [40065789096](https://github.com/c2melendez/precision-lab-plus/actions/runs/40065789096). Decisión WAIT.
- H2-SG28-DIST BLOCKED. Global OPEN. No merge de PR #29.

---

## 2026-10-24 UTC — r285: run SG28 en 83b18dab verificado (harness PASS_SCOPED; DIST sigue BLOCKED)

- Plus Playwright E2E [40065789096] SUCCESS @ `83b18dab`, job 120788643371, intento 1.
- General sin SG28: 627 passed. EN-SG-28 con SG28 aislado: 21 passed (7 x desktop/tablet/movil). `general_exit=0 sg28_exit=0`.
- Fallo previo 40047564113 clasificado como harness; corregido en 83b18dab.
- No cierra H2-SG28-DIST-01..08 ni S25. Lite sin cambios en este commit.
- Hallazgo: `playwright.yml` no dispara push en la rama canonica (pendiente cambio tecnico).
- Siguiente: brecha 4 del contrato SG28 (MathResponse y status HTTP).

---

## 2026-10-23 UTC — r264: registro gates r263 — Plus success

- r264: gates r263 Plus en success: cumulative 40014981162, H1d 40014985059, Native Syntax 40014988262 sobre 177955dc.
- Plus/Lite B4 mantienen la clasificación de r263; no se toca producto.
- Siguiente: EDCX-B5 READY, no iniciado.

---

## 2026-10-23 UTC — r266: EDCX-B5 brecha de capacidad (Plus)

- Filas VC-LG-01..25 (lugares geométricos) con `canal` vacío. Ninguna ruta de Plus devuelve un lugar geométrico (revisión de `/evaluate`, `/solve`, `/complex/*`, `/graph/*`).
- Resultado: 25 BLOCKED por capacidad; sin PASS/FAIL; sin cambio de producto ni de oráculo. Lite NO_EJECUTADO.
- Gates: sin CI (solo documentación). Global OPEN.
- Siguiente: EDCX-B6 (53 filas, VC-FE), REVIEW por canal vacío.


## 2026-10-23 UTC — r263: EDCX B4 (Plus scoped)

- Plus `7e501f5` (test-first): cumulative [40014004350] SUCCESS; H1d [40014004348] SUCCESS. Harness local 33 passed, 4 xfailed.
- B4: 34 filas -> 14 PASS / 14 PASS_SCOPED / 4 FAIL / 2 BLOCKED, medidas con oraculo sympy independiente sobre `/api/v1/solve` y `/api/v1/solve/system`.
- FAIL (xfail estricto, sin cambio de producto): VC-EC-16, 17, 18, 19 (raices faltantes, o vacio con solucion existente).
- BLOCKED: VC-EC-20, 21 (`abs(z)` no soportado).
- Lite: B4 sin ejecutar (`NO_EJECUTADO`).
- Siguiente: EDCX-B5 (25 filas, prefijo VC-LG), READY, no iniciado.

---

## 2026-10-23 UTC — r262: EDCX B3 (Plus scoped)

- Plus `ab220425` (B3): cumulative [39945613218] SUCCESS — 2345 passed, 1 skipped,
  6 xfailed, cobertura 87.92%; H1d [39945613228] SUCCESS. Harness B3 22/22.
- B3: 19 filas -> 7 PASS exactos + 10 PASS_SCOPED / 2 BLOCKED. `evaluate`
  resuelve potencias exactas; `sqrt`/`root` devuelven solo la raíz principal
  (`sqrt(-3+4i)=1+2i`, `8^(1/3)=2`, `1^(1/4)=1`).
- PASS_SCOPED: `PR-07..PR-16`; la enumeración completa se certifica con
  `/api/v1/solve` sobre `z^n=w`, que devuelve todas las raíces exactas. `PR-07`
  devuelve `±sqrt(I)` (equivalente a `±(1+i)/sqrt(2)`); `PR-15/PR-16` emiten
  radicales cartesianos en lugar de la forma exponencial.
- BLOCKED: `PR-17` (sin nodo de sumatoria; `sum`/`Sum` -> `PARSE_ERROR`) y
  `PR-18` (sin operación de producto de raíces).
- Hallazgo: `(-8)^(1/3)=2*(-1)**(1/3)` es la rama principal compleja, no `-2`.
- Acumulado EDCX (A + B1 + B2 + B3): 319 / 638 filas, 188 PASS / 131 BLOCKED.
- Lite: EDCX sin ejecutar (`NO_EJECUTADO`); sin PASS/FAIL bilateral.
- Siguiente: EDCX Parte B, bloque B4 (ecuaciones en C, 34 filas, `VC-EC-01..34`).

---

## 2026-10-23 UTC — r261: EDCX B2 (Plus scoped)

- Plus `7c87b95f` (B2): cumulative [39943293295] SUCCESS — 2323 passed, 1 skipped,
  6 xfailed, cobertura 87.96%; H1d [39943293116] SUCCESS. Harness B2 38/38.
- B2: 41 filas -> 20 PASS exactos + 13 PASS_SCOPED + 8 BLOCKED. Forma binómica
  literal, incluida la multiplicación implícita (`(2+3i)(1-i)=5+i`); las nueve
  entradas `r_{theta}` siguen dando `PARSE_ERROR`.
- PASS_SCOPED: `P-01..P-09` exigen la traducción documentada y emiten forma
  binómica/raíz; `T-05` devuelve `exp(I*(alpha+beta))` (Euler exacto); `X-04`
  devuelve la potencia principal `32*(-1)**(5/6) = -16*sqrt(3)+16i`; `X-08`
  conserva `conjugate(theta)` (exacto con `theta,r` reales); `X-09` devuelve
  `exp(re(a)-im(b))` (exacto con `a,b` reales).
- BLOCKED: `T-04/X-10` devuelven `exp(I*theta)**n` sin combinar; `T-06/T-07/T-08`
  no expanden ángulo múltiple ni linealizan; `T-09` no tiene nodo de sumatoria
  (`sum`/`Sum` -> `PARSE_ERROR`); `X-11/X-12` no reescriben media ángulo ni serie
  geométrica.
- Hallazgo: `cos3theta` se interpreta como símbolo libre, no como `cos(3*theta)`.
- Acumulado EDCX (A + B1 + B2): 300 / 638 filas, 171 PASS / 129 BLOCKED.
- Lite: EDCX sin ejecutar (`NO_EJECUTADO`); sin PASS/FAIL bilateral.
- Siguiente: EDCX Parte B, bloque B3 (potencias y raíces, 19 filas, `VC-PR-01..19`).

---

## 2026-10-23 UTC — r260: EDCX B1 (Plus scoped)

- Plus `a53449db` (B1): cumulative [39940618566] SUCCESS — 2285 passed, 1 skipped,
  6 xfailed, cobertura 87.94%; H1d [39940618559] SUCCESS. Harness B1 61/61.
- B1: 49 filas -> 45 PASS_SCOPED + 4 BLOCKED. No hay notación polar de entrada
  (`2_{pi/3}` -> `PARSE_ERROR`; `2 angle pi/3` -> `2*pi*angle/3`) ni de salida
  (`topolar(3)=3`, `topolar(-2)=-2`, `topolar(1+i)=(-1)**(1/4)*sqrt(2)`).
  La conversión se certifica con `abs`+`arg` y oráculo sympy que reconstruye
  `r*exp(i*theta)=z`, `r*cos(theta)+i*r*sin(theta)=z` y `re+i*im=z`; las 10
  filas P usan la traducción documentada `r_theta -> r*(cos+i*sin)`.
- BLOCKED: `B-17` (`arg(0)=0` sin aviso frente a `topolar(0)=DOMAIN_ERROR`) y
  `T-09/T-10/X-12` (formas semángulo simbólicas sin reducir).
- Hallazgo: `arg(exp(i*pi))` exacto `pi` y aproximado `-3.14159`; `log` base 10
  frente a `ln` natural (`X-10` usa `ln`, como la fuente).
- Acumulado EDCX (A + B1): 259 / 638 filas, 138 PASS / 121 BLOCKED.
- Lite: EDCX sin ejecutar (`NO_EJECUTADO`); sin PASS/FAIL bilateral.
- Siguiente: EDCX Parte B, bloque B2 (operaciones, 41 filas).

---

## 2026-10-23 UTC — r259: EDCX A8 y cierre de la Parte A (Plus)

- Plus `c3d38972` (A8): cumulative [39935820474] SUCCESS — 2224 passed, 1 skipped,
  6 xfailed, cobertura 87.94%; H1d [39935820754] SUCCESS. Harness A8 7/7.
- A8: 6 filas -> 0 PASS / 6 BLOCKED. `CL-01/CL-02` comparten el mismo
  `UNSUPPORTED_OPERATION` (el canal no distingue sin solución de infinitas);
  `CL-03` devuelve una integral implícita sin ramas; `CL-04` evalúa `1/(1-x)` en
  `x=2` como `-1` sin error de intervalo; `CL-05` devuelve solo `-|x|`;
  `CL-06` se rechaza por el límite de una condición inicial, no por
  incompatibilidad de frontera.
- Parte A completa (A1–A8): 210 / 638 filas, 93 PASS / 117 BLOCKED.
- Lite: EDCX sin ejecutar (`NO_EJECUTADO`); sin PASS/FAIL bilateral.
- Siguiente: EDCX Parte B, bloque B1 (conversión de formas, 49 filas).

---

## 2026-10-23 UTC — r258: EDCX A7 (Plus scoped)

- Plus `795a97ef` (A7): cumulative [39934588535] SUCCESS — 2217 passed, 1 skipped,
  6 xfailed, cobertura 87.90%; H1d [39934588487] SUCCESS. Harness A7 19/19.
- A7: 25 filas -> 2 PASS exactos (`ED-Q-23/24`: Si y erf; residuo + condición
  inicial) + 2 PASS_SCOPED (`ED-Q-05/06`: solución exacta, intervalo máximo solo
  derivado con oráculo) + 21 BLOCKED (cualitativas, no unicidad, ortogonales,
  Picard, Euler/Heun/RK4, recurrencias, retardo y Riccati sin canal).
- Acumulado EDCX A1–A7: 204 filas, 93 PASS / 111 BLOCKED.
- Lite: A7 sin ejecutar (`NO_EJECUTADO`); sin PASS/FAIL bilateral.
- Siguiente: EDCX A8 (casos límite, 6 filas).

---

## 2026-10-23 UTC — r257: EDCX A6 (Plus scoped)

- Plus `9a828f3c` (A6): cumulative [39932526897] SUCCESS — 2198 passed, 1 skipped,
  6 xfailed, cobertura 87.90%; H1d [39932526943] SUCCESS. Harness A6 30/30.
- A6: 26 filas -> 1 PASS_SCOPED (`ED-P-25`, laplaciano de `e^x sin y` compuesto
  con dos derivadas parciales reales de orden 2 y suma exacta 0) + 25 BLOCKED
  (EDP, clasificación, características, valores iniciales/frontera, Fourier y
  núcleo del calor; sin motor de EDP). `ED-P-23/24` se bloquean por el rechazo
  determinista de dos condiciones iniciales.
- Acumulado EDCX A1–A6: 179 filas, 89 PASS / 90 BLOCKED.
- Lite: A6 sin ejecutar (`NO_EJECUTADO`); sin PASS/FAIL bilateral.
- Local: 92 pruebas HTTP/seguridad sin servidor vivo fallan (0 fallos EDCX);
  el gate cumulative de CI está verde.
- Siguiente: EDCX A7 (cualitativo/numérico/retardo, 25 filas).

---

## 2026-10-23 UTC — r256: EDCX A5 (Plus scoped)

- Plus `50d9ca03` (A5): cumulative [39929466812] SUCCESS — 2168 passed, 1 skipped,
  6 xfailed, cobertura 87.85%; H1d [39929467052] SUCCESS. Harness A5 11/11.
- A5: 10 filas -> 5 PASS exactos (`ED-F-01..05`: trigonométrica, Airy, Bessel;
  residuo + wronskiano + forma cerrada de la fuente) + 3 PASS_SCOPED
  (`ED-F-06..08`: serie truncada de Legendre y polinomios de Hermite/Chebyshev
  por elección de constantes) + 2 BLOCKED (`ED-F-09..10`: clasificación de
  punto singular regular/irregular sin canal).
- Acumulado EDCX A1–A5: 153 filas, 88 PASS / 65 BLOCKED.
- Lite: A5 sin ejecutar (`NO_EJECUTADO`); sin PASS/FAIL bilateral.
- Siguiente: EDCX A6 (EDP, 26 filas).

---

## 2026-10-23 UTC — r255: EDCX A3+A4 (Plus scoped)

- Plus `6aef2571` (A3): cumulative [39926515965] SUCCESS — 2130 passed, 1 skipped,
  6 xfailed, cobertura 87.92%; H1d [39926515979] SUCCESS. Harness A3 17/17.
- Plus `02e198ac` (A4): cumulative [39927284848] SUCCESS — 2157 passed, 1 skipped,
  6 xfailed, cobertura 87.85%; H1d [39927284862] SUCCESS. Harness A4 27/27.
- A3: 16 filas -> 3 PASS_SCOPED (`ED-M-11..13`, autovalores exactos por
  `/matrix/eigen`) + 13 BLOCKED (sistemas, `expm`, no lineales/Lyapunov).
- A4: 24 filas -> 1 PASS (`ED-T-17` con `t -> x`, residuo + IC) + 23 BLOCKED
  (`laplace`/`ilaplace`, convolución, dos condiciones iniciales, integrales,
  sistema).
- Acumulado EDCX A1–A4: 143 filas, 80 PASS / 63 BLOCKED.
- Defecto confirmado: la segunda condición inicial con `;` documentada en
  `_parse_initial_condition` no está implementada; el valor `0; y'(0)=0` falla con
  `PARSE_ERROR: No se pudo interpretar la condición inicial.` No se corrige en r255.
- Lite: A3/A4 sin ejecutar (`NO_EJECUTADO`); sin PASS/FAIL bilateral.
- Siguiente: EDCX A5 (series / Frobenius, 10 filas).

---

## 2026-10-23 UTC — r254: EDCX A1+A2 PASS_SCOPED (Plus)

- Plus `fdcf2d63` (A2): cumulative [39924322798] SUCCESS — backend 2113 passed,
  1 skipped, 6 xfailed, cobertura 87.92%; H1d [39924322809] SUCCESS.
- Plus `5a76477a` (fix aislamiento ODE): cumulative [39922491068], H1d
  [39922491020], native [39922491000] SUCCESS.
- A1: 53 filas → 47 PASS (sustitución numérica), 6 BLOCKED acotados; 8 filas F4.
- A2: 50 filas → 29 PASS (25 EDO + 3 Wronskianos por determinante + ED-A-05
  renombrado), 21 BLOCKED por alcance medido.
- Regresión de `86241e40` (`mp.pool.Pool` sin importar `multiprocessing.pool`)
  detectada en H1d/security/native y corregida en `5a76477a`; no se declara PASS
  para los runs fallidos.
- Lite: A1/A2 sin ejecutar; gap de alcance del motor (`stepEngine/ode.ts`).
  No se asigna PASS ni FAIL bilateral.
- Siguiente: EDCX A3 (sistemas y exponencial matricial, 16 filas).

---

## 2026-10-23 UTC — r253: MV-J PASS_SCOPED_BILATERAL — catálogo MV completo

- Plus [39914423538] SUCCESS @ `2fcd869`.
- Lite [39914455096] SUCCESS @ `40b000b`.
- 153 filas A–H+J certificadas bilateralmente (scoped donde aplica).
- Siguiente: formalizar cierre dominio MV o retomar Stryker / otros dominios.

---

## 2026-10-23 UTC — r252: MV-H PASS_SCOPED_BILATERAL

- Plus [39913600442] / Lite [39913642080] SUCCESS.


---

## 2026-10-24 UTC — r292: S19 focalizado y conciliación de gates

- HEAD canónico: `561547252456b30124f4f7a1db06347ee0731079` (`fix(qa): match mutmut's qualified mutant names`).
- Se corrigieron filtros de mutmut para usar nombres cualificados reales; el workflow-only change se conserva en alcance focalizado.
- CI [40098526446](https://github.com/c2melendez/precision-lab-plus/actions/runs/40098526446), cumulative [40098526501](https://github.com/c2melendez/precision-lab-plus/actions/runs/40098526501), Playwright [40098526513](https://github.com/c2melendez/precision-lab-plus/actions/runs/40098526513) y S19 focalizado [40098526609](https://github.com/c2melendez/precision-lab-plus/actions/runs/40098526609): SUCCESS en el mismo SHA.
- S19 focalizado: 1,666 mutantes del alcance dirigido; 801 killed, 863 survived, 2 timeout. No sustituye la campaña histórica/global ni cierra el bloqueo de aceptación S19.
- S18 [40098526464](https://github.com/c2melendez/precision-lab-plus/actions/runs/40098526464): no PASS. El log registra shutdown signal del runner durante `python qa/s18/run_differential.py`; el paso se canceló por infraestructura, sin evidencia de fallo funcional.
- PR #29 continúa OPEN/DRAFT. Certificación global OPEN; SECURITY-S25 global BLOCKED, AS-B-29 ON_HOLD y H2-SG28-DIST-01..08 BLOCKED.
- Siguiente acción única: diagnosticar/restablecer infraestructura de S18 y ejecutar ese gate una sola vez. No repetir los gates verdes ni lanzar S19 completo. Después, revisar sobrevivientes de S19 desde el artefacto existente.

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

## 2026-10-26 UTC — r307: runner v3 docs y reconciliación de Playwright

- PR #32 (`ci/runner-v3-docs`) fusionado en `main`: merge `903e44acba68c95026abc22f06bf482b207d7bad`; paridad con Lite (blob `23e42cf6dad30b281036cbbb63eff938c6646fde`).
- Playwright E2E SUCCESS en `9acc0bff` (40155180977) y `73be7940` (40154343463); se cierra la reconciliación pendiente de r304.
- S19 acceptance sin cambio (BLOCKED por decisión de contrato); no se repiten gates.
- Siguiente acción en `continuity.json` r307.

## 2026-10-26 UTC — r308: IDs de publicación y evidencia S25/Playwright

- `operation=docs` publicó r307: run 40286743228 (dry-run 40286675700), base `bef07d86`, commits `53279df3` + `b0eccc4b`.
- Playwright SUCCESS en `9acc0bff` (40155180977) y `73be7940` (40154343463).
- S25 SUCCESS en 061e9110/9acc0bff/73be7940/3697ac9b; permanece BLOCKED por condición de aceptación explícita. S19 BLOCKED por contrato.

## 2026-10-26 UTC — r309: decisión de aceptación S19 (B+C)

- Decisión del responsable: contrato `2026-10-26-s19-focused-acceptance-v1`. Piso 90.0% killed sobre el alcance focalizado y sin regresión contra 40154343365 (73be7940: 1,564 killed / 122 survived / 2 timeout).
- Campaña completa r304 (71.87%) solo informativa. Mutantes SG28 de `_evaluate_impl` (líneas 34, 37, 39–57) diferidos a H2-SG28.
- S19 CLOSED_SCOPED; sin Actions ni cambios de producto. Índice `continuity.json` r309.

## 2026-10-26 UTC — r310: SG28 un solo host (opción 2)

- Contrato `2026-10-26-sg28-single-host-scope-v1`: DIST-01..08 OUT_OF_SCOPE_SINGLE_HOST (no PASS); propuesta de lease distribuido archivada; reapertura si hay varias instancias. Siguiente: bloque local de cuota/concurrencia. Índice r310; sin Actions.

## 2026-10-26 UTC — r311: corrección del bloque local H2-SG28

- La cuota/concurrencia local ya estaba implementada y probada; se corrige `still_required_local` de r310. Siguiente: auditoría de evidencia EN-SG-01..32. Índice r311; sin Actions.

## 2026-10-26 UTC — r312: runner v3 sincronizado en la rama canónica e índice docs_workflows

- Rama canónica de Plus: workflow v2 `91f3c773` → v3 `23e42cf6`, blob idéntico a `main` (paridad con Lite, r298).
- Validación sintáctica completa del blob v3 (YAML/bash/python, 13 pasos).
- `continuity.json`: clave `docs_workflows.certification_runner` registrada (workflow ID Plus 374437934, active).
- Bloqueo de seguridad `gate=security` en Plus verificado (S19/R304) mediante simulación local del pipeline gate. Dispatch obligatorio de dry-run pendiente de credenciales `actions:write`; sin gates reales, sin merges, sin exposición de credenciales.
