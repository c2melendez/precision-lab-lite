# Certification Execution Log

Registro acumulativo. No reemplaza `CURRENT_STATE.md`; conserva decisiones y evidencia histórica.

## 2026-10-07 — Migración de continuidad repo-native cerrada
- Se confirmó `qa/certification/` como fuente canónica en Lite y Plus.
- Se formalizó `CONTINUATION_PROMPT.md` como único bootstrap estable para nuevas sesiones.
- Se estableció que chat, ZIPs y handoffs históricos no son autoridad operativa cuando el estado canónico está disponible.
- Se reforzó la obligación de sincronizar `CURRENT_STATE.md` y este log en ambos repositorios tras cada avance sustantivo.

## 2026-10-07 — G2 cerrado bilateralmente
- EN-CH-06, EN-CH-07 y EN-CH-12 se resolvieron como equivalencias de representación/canonicalización del harness, sin cambio de producto.
- Lite Playwright `37580506336` — SUCCESS.
- Plus Playwright `37580510564` — SUCCESS.
- Lite corrida documental posterior `37581518369` — SUCCESS.
- G2 queda cerrado.
- EN-CH-11 permanece manual/config-dependent por decimal coma real / locale.
- Siguiente bloque activo: G3, 34 casos de entradas inválidas y mensajes de error.


## 2026-10-07 — G3 diagnóstico inicial
- Lite `37583041099`: fallo real de G3; 30 IDs en rojo. Se separó error semántico claro de mensajes CAS genéricos y aceptación silenciosa.
- Plus `37583044889`: 102 fallos por harness (`hideMathLiveKeyboard` inexistente), no producto.
- Se verificó contra la matriz original que G3 exige feedback semánticamente claro.
- Lite: validación estructural previa al CAS en `5eac718b9b8d33d9da9a06a688aca0204bd1fb13`.
- Lite: división por cero -> DOMAIN_ERROR claro en `0b7cd3a20fa4d147af321ffd7748ce3c899aeb48`.
- Plus: helper G3 restaurado en `4f146ec8572554febddbe7f21f800733c70e4381`.
- Reruns: Lite `37586956770`; Plus `37586831275`.


## 2026-10-07 — G3 harness sincronizado
- Se comprobó que `setValue()` no garantiza el evento `input` usado por React.
- El helper G3 ahora dispara un `InputEvent("input")` después de `setValue()`.
- El helper espera explícitamente feedback final (alert/status) antes de clasificar éxito/error.
- Las corridas `37586956770` (Lite) y `37586831275` (Plus) se consideran diagnósticos de harness no aptos para clasificar producto.
- Nueva evidencia a revisar: Lite `37589106994`; Plus `37589114822`.


## 2026-10-07 — G3 residual reducido
- Lite: los 28 timeouts estructurales se clasificaron como harness/visibilidad; `BasicScientificMode` sí ejecuta `setResult()` al capturar el parse error.
- Lite helper G3 ahora detecta alert/status por presencia y contenido DOM, no por `isVisible()`.
- Plus: EN-ER-03/04 se clasifican como canonicalización válida de MathLive (fracción incompleta -> grupo vacío).
- Plus: EN-ER-13 era producto real; función desnuda alcanzaba SymPy y podía provocar `TypeError: 'property' object is not iterable`.
- Plus ahora rechaza funciones desnudas antes de SymPy.
- Reruns a revisar: Lite `37678678320`; Plus `37678685459`.


## 2026-10-07 — G3 split por capa
- Se comprobó que MathLive canonicaliza siete entradas inválidas antes de que la UI/backend pueda observar la forma cruda.
- IDs movidos a parser-level: EN-ER-05, EN-ER-15, EN-ER-19, EN-ER-20, EN-ER-26, EN-ER-27, EN-ER-31.
- Cobertura total G3 se conserva: 27 E2E + 7 parser-level = 34.
- Lite parser regression: `11d41e9aef438961e8975b6067ae96d88a17440c`.
- Plus parser regression: `7079dd5854fd987249fb07a665900ce754015c96`.
- Runs a revisar: Lite Playwright `37687766493`; Plus Playwright `37687769608`.


## 2026-10-08 — G3 cerrado
- G3 queda CERRADO 34/34.
- Lite: 26 casos raw-parser + 8 E2E preservables por MathLive.
- Lite E2E run `37722856327`: SUCCESS en desktop/tablet/mobile.
- Lite parser run `37722856334`: SUCCESS.
- Plus: G3 34/34 ya certificado previamente con E2E + backend parser.
- Decisión estable: no exigir a MathLive preservar sintaxis cruda que canonicaliza; esos casos se certifican en parser-level sin perder cobertura.
- Próximo bloque: H1 — 30 casos reentrada/output-as-input.


## 2026-10-08 — H1a cerrado
- EN-RE-01..08 cerrados 8/8 en ambos motores.
- Lite H1a run `37771014887`: SUCCESS.
- Plus H1a run `37771019348`: SUCCESS.
- Regresiones permanentes añadidas para serialización/reentrada de resultados.
- Siguiente bloque: H1b — EN-RE-09..16.


## 2026-10-08 — H1b cerrado
- EN-RE-09..16 cerrados 8/8 en ambos motores.
- Lite H1b run `37778832819`: SUCCESS.
- Plus H1b run `37790101494`: SUCCESS.
- Regresiones permanentes añadidas para soluciones múltiples, matrices, intervalos y formatos de reentrada.
- Siguiente bloque: H1c — EN-RE-17..23.


## 2026-10-08 — H1c cerrado
- EN-RE-17..23: 6/6 casos automáticos PASS en ambos motores.
- Lite H1c run `37794754460`: SUCCESS.
- Plus H1c run `37794867403`: SUCCESS.
- EN-RE-22 permanece como CAPABILITY GAP explícito: historial no restaura todavía el LaTeX original al campo principal.
- Siguiente bloque: H1d — EN-RE-24..30.

## 2026-10-08 — Bootstrap permanente en rama predeterminada
- Se creó `qa/certification/README.md` en `main` de Lite y Plus, con puntero a la rama canónica activa.
- Se actualizó `qa/certification/CONTINUATION_PROMPT.md` en la rama canónica para resolver dinámicamente el puntero; ya no contiene un nombre de rama fija.
- Validación: el puntero `main` y el prompt tienen blobs idénticos entre Lite y Plus; la rama activa queda declarada exclusivamente en el puntero de `main`.
- Regla de migración: publicar y verificar primero la nueva rama canónica y después mover ambos punteros en `main`; el prompt único permanece invariable.

## 2026-10-08 — Reconciliación documental de siguiente paso
- README de main en ambos repositorios identifica qa/syntax-audit-in625-a1 como rama canónica.
- El encabezado de CURRENT_STATE mantenía G3 como tarea siguiente aunque G3, H1a, H1b y H1c ya constaban cerrados.
- Se corrigió el siguiente paso a IN625 H1d: EN-RE-24..30, con reconciliación de EN-RE-29/30 contra MANUAL_CAPABILITY_GAPS antes de certificar.
- HEAD inspeccionados antes de las modificaciones: Lite a9627f4d67f141c0346a19c467656d626e3affcc; Plus 802eea7d7a9abf2ec28f2fa46d97a40c67e5296f.
- Los jobs H1c referenciados finalizaron SUCCESS: Lite 37794754460, Plus 37794867403.
- La búsqueda de runs vinculados directamente a los HEAD devolvió cero resultados, sin descartar corridas por otros eventos; no se certifica H1d con ese dato.
- Clasificación: inconsistencia DOCUMENTAL/ESTADO, no fallo de producto. No hubo nueva ejecución de pruebas ni alteraciones al motor.
- Siguiente paso operativo: ubicar matriz/tests H1d, examinar historial completo de Actions, ejecutar cobertura automatizable bilateral y actualizar evidencia.

## 2026-10-08 — Auditoría de cobertura H1d en ambos motores
- Specs localizados: Lite `e2e/in625-h1d-reentry.spec.ts`; Plus `frontend/e2e/in625-h1d-reentry.spec.ts`.
- Workflows localizados: `.github/workflows/in625-h1d-reentry.yml` en Lite y Plus (`pull_request`, `workflow_dispatch`, Chromium desktop).
- EN-RE-24: 20 entradas con triple evaluación e idempotencia normalizada; equivalencia matemática independiente no probada.
- EN-RE-25: el test solo exige salida no vacía y por tanto NO comprueba la equivalencia semántica anunciada. Clasificación: ORÁCULO/HARNESS incompleto.
- EN-RE-26: aceptación sin verificación independiente del resultado. EN-RE-27/28: patrones de texto débiles frente al contrato semántico.
- EN-RE-29/30: gaps capability ya documentados, no PASS automáticos.
- Sin nueva corrida H1d acreditada; no hay rojo de producto probado ni cambios al motor.
- Decisión: reforzar oráculos y luego ejecutar/revisar H1d bilateralmente; conservar H2 bloqueado hasta cierre verificable.

### 2026-10-08 — H1d EN-RE-25: oráculo numérico reforzado
- Se modificó bilateralmente el spec H1d (Lite: `e2e/in625-h1d-reentry.spec.ts`; Plus: `frontend/e2e/in625-h1d-reentry.spec.ts`).
- El test EN-RE-25 ahora exige anclas numéricas independientes para `2+3`, `2^{10}`, `\\frac{3}{4}` y `10^{-3}`, en la primera evaluación y después de la reentrada. Se mantiene la comprobación de no vacío para las restantes entradas; **esto no certifica equivalencia semántica universal**.
- Commits de prueba: Lite `7c358d99c6b150ed2c037f6232100eef5b0e2b09`; Plus `101243e84506271860dbdd17c89eea028efff298`.
- La consulta de runs de PR asociados a esos SHA devolvió 0; el conector no ofrece despacho genérico de `workflow_dispatch`. Por tanto H1d **NO está ejecutado/cerrado** sobre esos commits.
- Siguiente paso exacto: disparar `.github/workflows/in625-h1d-reentry.yml` en ambas ramas con `workflow_dispatch` (o mediante evento PR), verificar IDs y logs, clasificar los rojos, corregir los oráculos pendientes y registrar gate acumulativo.

## 2026-10-08 — H1d: refuerzo de pruebas sin ejecución confirmada
- Specs H1d cambiados: Lite commit `82276fe5febd252e80c18753183c00d4fb01a67e`; Plus commit `8ac4e9105f3ce83d9951084c47be9a5d9d3cdda3`.
- EN-RE-25 ahora exige estabilidad textual normalizada S1→S2 en las 20 expresiones, además de anclas numéricas independientes en cuatro; sigue sin equivalencia matemática externa para los demás casos. Clasificación: refuerzo de oráculo/harness, no corrección de producto.
- EN-RE-24/25 Plus obtuvieron timeout explícito de 120 s; EN-RE-25 Lite se ajustó al mismo límite, evitando depender del timeout predeterminado en iteraciones largas. Este ajuste no prueba que pasen.
- Consulta de Actions vinculados a esos SHA retornó 0 runs; dicha consulta cubre solo eventos PR y no equivale a listar todas las ejecuciones. No se obtuvo run ID H1d, ni PASS/FAIL verificado. Los workflows `.github/workflows/in625-h1d-reentry.yml` requieren `workflow_dispatch` o `pull_request`; el conector disponible no expone despacho directo.
- H1d mantiene estado BLOCKED (CI no verificado); EN-RE-29/30 siguen como capability gaps, no PASS. Próximo paso: iniciar/observar H1d bilateral, diagnosticar rojos y ejecutar gate acumulativo. No iniciar H2 antes del cierre contractual.

## 2026-10-08 — H1d EN-RE-27: regresión de reentrada añadida
- Se extendió el test EN-RE-27 para reintroducir los resultados de `asin(1/2)` y `atan(1)` y exigir estabilidad de la representación canónica S1→S2, además de los patrones originales.
- Commits de test: Lite `c998956cadf87fa2b10a2da49147a78cf74750be`; Plus `148aa26db5c8d65b14776416a672b49590d6fa5d`.
- Clasificación: mejora de HARNESS/ORÁCULO, sin modificar código del producto. La estabilidad textual no certifica por sí misma semántica completa.
- No se obtuvo corrida H1d ni se verificó gate acumulativo para estos SHA. H1d permanece pendiente de ejecución bilateral; H2 no inicia.

## 2026-10-08 — H1d EN-RE-25: referencia racional adicional
- Se incorporó bilateralmente un oráculo independiente para `\\frac{1}{2}+\\frac{1}{3}` = `\\frac{5}{6}` (o forma decimal periódica soportada), validando primera salida y reentrada; se preserva el resto del test.
- Commits: Lite `679e85ee717e44149283d2632765c01c9b7e0783`; Plus `0f40b78ec5a4fa2c8226f092dd170cf34313eb71`.
- Tras commit Lite inició `IN625 Lite Build Diagnostic` run `37859589602`, visto `in_progress`; **no es H1d E2E**.
- Últimos runs H1d observados: Lite `37843775609`, Plus `37843780110`, ambos SUCCESS sobre commits anteriores; **no cubren los últimos cambios de test**.
- H1d continúa abierto: verificar ejecución H1d E2E en ambos SHA nuevos y gate acumulativo, mejorar oráculos pendientes, mantener EN-RE-29/30 como capability gaps. No declarar PASS global por éxito de build.

## 2026-10-08 — Comprobación posterior a corrida de H1d
- Lite Build Diagnostic `37859589602`, `37859621271` y `37859638478`: **SUCCESS**. Estos runs comprueban build, no H1d E2E.
- Último H1d específico encontrado mediante listado de Actions: Lite `37843775609` y Plus `37843780110`, ambos SUCCESS pero anteriores a los últimos cambios de los tests/oráculos; no sirven para certificar el HEAD actual.
- PR de certificación existentes: Lite #48 y Plus #29, abiertos; GitHub informa `mergeable_state=dirty` (conflictos de integración). No fusionar automáticamente.
- Bloqueo actual: no hay run H1d actualizado en ambos HEAD y el conector de esta sesión carece de `workflow_dispatch` genérico. Se requiere ejecutar `in625-h1d-reentry.yml` con el selector de rama activa en ambos repositorios mediante GitHub Actions o mecanismo autorizado equivalente; registrar nuevos run IDs y resultados. No declarar H1d PASS ni pasar a H2.

## 2026-10-08/09 — Diagnóstico IA: cuota API bloqueada
- Se publicó en main `.github/workflows/certification-ai-diagnosis.yml` en ambos repositorios. El workflow está limitado a fallos H1d verificados de la rama canónica y no tiene permisos de escritura.
- Evidencia real: Lite H1d run `37861656818` (reintento 2) terminó FAILURE; activó automáticamente el diagnóstico IA Lite run `37863815965`.
- La acción `openai/codex-action@v1` inició Codex (sandbox read-only), pero el servicio respondió `Quota exceeded. Check your plan and billing details.`; no se produjo diagnóstico ni se modificó código mediante Codex.
- Clasificación: BLOQUEO EXTERNO DE CUOTA/API (no fallo acreditado de cálculo). Confirmar saldo, facturación, límites y organización/proyecto de la clave sin exponer secretos. Evitar reintentos deliberados de Codex hasta resolver el bloqueo; GitHub Actions técnicos siguen independientes.
- Estado H1d: Plus run `37861053887` SUCCESS 5/5; Lite sigue FAIL (EN-RE-25/27). No cerrar H1d ni avanzar H2 sin gate bilateral.
- Validación siguiente: tras restablecer cuota, observar un diagnóstico Codex generado y comprobar su clasificación antes de autorizar Fase 2 con PR.

## 2026-10-09 — H1d automatizable: PASS bilateral, cierre contractual pendiente
- Lite H1d 5/5 SUCCESS run 37880382838, commit técnico 23623e92823adbccdd1f319bfff638fe8186ceb6; Build SUCCESS run 37880382824 en el mismo SHA. EN-RE-24..28 automatizables pasan.
- Plus H1d 5/5 SUCCESS run 37861053887, commit b388e5fb (certificación realizada previamente; no se ejecutó nueva validación Plus en este paso).
- Lite: correcciones verificadas de selección MathLive, reentrada del resultado canónico, celdas matriciales LaTeX y unión de intervalos. EN-RE-25: oráculo regex de fracciones corregido. El PASS automatizado no equivale a certificación semántica universal ni validación manual de UX.
- EN-RE-29 y EN-RE-30 continúan CAPABILITY GAPS (sin share/permalink y persistencia principal acreditadas); EN-RE-22 sigue gap anterior. No contarlos como PASS.
- Gate acumulativo específico posterior a estos cambios: PENDIENTE de ejecución/evidencia; por ello H1d NO se declara cerrado contractualmente y H2 no se inicia.
- Siguiente paso exacto: identificar y ejecutar el gate acumulativo aplicable en ambas ramas, verificar regresiones y equivalencia Lite/Plus; reconciliar oráculos parciales EN-RE-25/26/27/28 y registrar las excepciones; solo entonces decidir cierre bilateral y comenzar H2.

## 2026-10-09 — Gate acumulativo IN625 habilitado en rama activa
- Se creó `.github/workflows/in625-cumulative-certification.yml` bilateral para `qa/syntax-audit-in625-a1` (push técnico y dispatch). No se cambió CI general en main.
- Lite workflow commit `352691e93c83d5a91384bdc9f70c548bbb73830e`; gate run `37880835221`, H1d revalidación `37880835203`, Build `37880834972` (in_progress en consulta inicial).
- Plus workflow commit `763f58e5a308676e619e1411be2a9d7b9db0286d`; gate run `37880838018`, H1d revalidación `37880837934` (in_progress en consulta inicial).
- Alcance gate: Lite npm ci, typecheck, npm test, build. Plus backend pytest con cobertura >=75%, y frontend npm ci, typecheck, npm test, build.
- Se mantienen los resultados H1d previos PASS 5/5 Lite `37880382838` y Plus `37861053887`, pero aún falta verificar las nuevas corridas y el gate acumulativo en ambos HEAD. EN-RE-29/30 permanecen CAPABILITY GAPS. H2 NO se inicia hasta cierre bilateral comprobado.
- Siguiente paso exacto: consultar y clasificar conclusiones y logs de los cuatro runs gate/H1d nuevos, corregir regresiones si surgen y registrar cierre o impedimento reproducible.

## 2026-10-09 — Gates acumulativos: resultados y clasificación inicial
- H1d revalidado en ambos SHA de introducción del gate: Lite run 37880835203 SUCCESS 5/5; Plus run 37880837934 SUCCESS 5/5.
- Gate Lite run 37880835221 FAILURE: typecheck PASS, npm test 984 PASS / 31 FAIL / 30 TODO; build saltado tras error unitario. Las fallas abarcan parsing, statFunctions y keyboard-parity; causalidad respecto H1d NO acreditada.
- Gate Plus run 37880838018 FAILURE: frontend TypeScript TS2307 (node:fs en prueba), TS2339 y TS7006 (matrix union y callbacks), TS2322 (forma de result_data); backend job CANCELLED por resultado del workflow, por lo que no consta resultado pytest.
- Referencia histórica: CI main Lite #37864077199 FAIL en auditoría npm previa a los tests, por lo que NO es línea base de equivalencia de fallos. CI main Plus #37862256869 SUCCESS, pero difiere en rama/commit: comparar diferencias antes de atribuir regresión.
- Clasificación abierta: gate acumulativo impide cierre contractual de H1d y avance H2. Siguiente acción: baseline comparable y reparar primero errores TypeScript Plus, analizar 31 fallos Lite; ejecutar nuevamente gates.

## 2026-10-09 — Plus: reparación de bloqueos de TypeScript en gate acumulativo
- Se corrigió discriminación de matrices multiply y tipado de soluciones: commit Plus `d1c61602`; callback Unicode: `92d62ec6`; declaración node:fs de prueba Vitest: `1944655a`.
- Validación CI solicitada automáticamente: gate Plus #37883210983 y H1d Plus #37883210960 (in_progress en última consulta). No declarar PASS hasta conclusión.
- Lite gate #37880835221 sigue con 31 FAIL / 984 PASS / 30 TODO; requieren baseline comparable. Lite H1d #37880835203 PASS 5/5.
- Cierre IN625/H1d global y comienzo H2 siguen pendientes hasta confirmar gates y clasificar regresiones.

## 2026-10-09 — Gate Plus: TypeScript desbloqueado, corrección de enrutamiento de sistemas
- Gate Plus #37883210983: Typecheck PASS; frontend unit 715 PASS / 10 FAIL / 28 TODO, 3 archivos fallidos. Backend job CANCELLED (no acreditar pytest). H1d Plus #37883210960 SUCCESS 5/5.
- Grupos de fallos Plus: BasicMode sistemas 5; calculusIntent límites 2; parity teclado 3. Se corrigió prioridad de rutas en `frontend/src/components/BasicMode.tsx` para evaluar sistemas multilínea antes de relaciones de una sola expresión: commit `af1697bfa4ea111848aa65c40b7e177ed5f95906`.
- Nuevas Actions Plus H1d #37886600310 y gate #37886600325, en cola en consulta inicial; clasificación sin PASS hasta ejecutar.
- Lite gate #37880835221 continúa FAIL por 31 unit; H1d Lite #37880835203 PASS. No iniciar H2 ni cerrar gate acumulativo.

## 2026-10-09 — Plus frontend acumulativo PASS; backend reintentado
- Plus run #37891000954 (commit 904c06e8): frontend job SUCCESS (typecheck, unit tests y build). Workflow global CANCELLED por backend CANCELLED; no declarar gate completo verde.
- Se inició rerun del job backend cancelado mediante GitHub; nueva instancia job #113699307020 in_progress al verificar. Verificar resultado antes del cierre.
- Plus H1d #37891000846 SUCCESS 5/5. Lite H1d #37880835203 SUCCESS 5/5.
- Lite gate #37880835221: 31 FAIL / 984 PASS / 30 TODO. Clasificación por área: DMS, funciones trigonométricas inversas, delimitadores, operadores/precedencia, límites, LaTeX pegado, sintaxis externa, parsing y estadísticas. No atribuir automáticamente los 31 a regresiones de H1d; comparar con baseline y requisitos vigentes.
- Siguiente paso: revisar resultado de backend Plus y reproducir/corregir por grupos los fallos Lite sin suavizar aserciones semánticas. H2 pendiente.

## 2026-10-09 — Gate Plus backend: cancelación por duración; diagnóstico instrumentado
- Reintento del backend en gate Plus #37891000954 terminó CANCELLED; el job frontend del mismo run fue SUCCESS, backend se canceló durante pytest tras ~25 min sin resultado de pruebas. No acreditar cobertura ni PASS de backend.
- Commit Plus `36a2b06e83e70124d302fc51e658eea497c9721c` ajusta `.github/workflows/in625-cumulative-certification.yml`: pytest con log detallado, `pytest-timeout` por prueba (60 s, señal POSIX), reporte de pruebas lentas y timeout general backend de 35 min para identificar bloqueos, conservando `--cov-fail-under=75`.
- Corridas lanzadas: gate Plus #37898183036 y H1d Plus #37898183037 (queued al momento de consulta). Estado de cierre PENDIENTE; debe inspeccionarse la causa concreta si el gate falla.
- Lite H1d #37880835203 PASS, gate acumulativo Lite #37880835221 FAIL 31/984/30; no se introdujeron cambios matemáticos en Lite en este paso. H2 NO iniciado.

## 2026-10-09 — Localizado bloqueo backend Plus en fixture SymPy
- Gate Plus #37898183036: frontend SUCCESS; backend CANCELLED tras aproximadamente 35 min. El último test registrado como PASSED fue `test_substitution_with_free_variable_is_validation_error` (~10%), inmediatamente antes de `test_result_latex_truncated_when_too_long` en `backend/tests/test_evaluate.py`.
- Diagnóstico: la prueba siguiente construía `sympy.Add` con 3000 símbolos, proceso potencialmente patológico de normalización/ordenamiento en SymPy. Clasificación provisional: fixture de prueba, no fallo matemático demostrado.
- Commit Plus `2d4e97c38f7a6200b8146ebc56c1961a0b448678`: fixture sustituido por `sympy.Symbol("x" + "a" * 10100)` para conservar el contrato de truncado superior a 10000 caracteres sin coste de una suma gigante. No hay modificación de producto.
- Nuevas corridas Plus: acumulativo #37909986582 y H1d #37909986581; pendientes de resultado en consulta inicial.
- Próxima acción: inspeccionar ejecución y cobertura backend; si continúa bloqueo, identificar test siguiente por `pytest -vv`. Lite gate 31 fallos pendiente, H2 no iniciado.

## 2026-10-09 — Plus gate acumulativo PASS; Lite DMS corregido
- Plus gate acumulativo #37909986582 SUCCESS: jobs frontend y backend SUCCESS en SHA `2d4e97c3`; Plus H1d #37909986581 SUCCESS 5/5. El bloqueo SymPy de fixture de truncado quedó resuelto en la evidencia CI.
- Lite: diagnosticado defecto de entrada DMS: `normalizeUnicodePaste` transformaba el signo de minutos `′` en apóstrofo antes de ejecutar reglas de grados/minutos/segundos. Fix de producto en `src/engine/parsing/normalize.ts`, commit Lite `4bbb10feabb0ca8c8e287fecd7547f22823d042b`, conserva prima después de ° y valor numérico de minutos sin alterar el tratamiento de primas fuera de DMS.
- Nuevos runs Lite gate #37919867527, H1d #37919867472, Build #37919867564, inicialmente en ejecución. No declarar regresiones cerradas hasta verificar resultados.
- EN-RE-29/30 siguen capability gaps; Lite gate acumulativo aún abierto; H2 no iniciado.

## 2026-10-09 — Lite: reconciliación de oráculo de integral definida (gate pendiente)
- Gate Lite #37919867527 FAILURE: 987 PASS, 28 FAIL y 30 TODO; H1d Lite #37919867472 SUCCESS; Build #37919867564 SUCCESS.
- Se identificó un desfase en `tests/statFunctions.test.ts`: la prueba esperaba `defintegral((x^2),0,2)` (3 argumentos), mientras el contrato implementado conserva explícitamente la variable de integración `defintegral((x^2),0,2,x)` (4 argumentos). Se actualizó el oráculo y se agregó regresión para integrales respecto de x y t; no se modificó el producto.
- Commits Lite: `b399ffad509416487e8153cf94ad840964b5a435` (prueba) y `017459e0a4fab7cdb65b640d85c969e278b5cdf3` (escape correcto de LaTeX en test).
- Gate Lite #37921274929 y H1d #37921274939 fueron observados IN_PROGRESS sobre el primer commit; Build Lite #37921290902 IN_PROGRESS sobre el segundo. No se ha confirmado aún ejecución de gate sobre el HEAD final ni resultado de los trabajos en curso.
- Plus gate #37909986582 SUCCESS y H1d #37909986581 SUCCESS en SHA 2d4e97c3, sin cambios en esta operación.
- H1d no está cerrado contractualmente y H2 no inicia. Siguiente: verificar Actions con SHA actual Lite, comparar fallos restantes, corregir por causa raíz sin relajar contratos, y sincronizar evidencia nueva.

## 2026-10-09 — Lite: gate 27 fallos y corrección de inversas recíprocas
- Gate Lite #37921274929 FAILURE (SHA b399ffad): 988 PASS / 27 FAIL / 30 TODO. H1d Lite #37921274939 SUCCESS. Build #37921290902 SUCCESS sobre el commit corregido 017459e0.
- Se diagnosticó que `normalizePoweredFunctions` interpretaba `\\csc^{-1}(x)`, `\\sec^{-1}(x)` y `\\cot^{-1}(x)` como potencias recíprocas de csc/sec/cot, no como funciones trigonométricas inversas. Esta distinción explica fallos numéricos de paridad y dos aserciones directas de `tests/parsing.test.ts`.
- Cambio en producto Lite `src/engine/parsing/normalize.ts`, commit `3eaf96e1ae80faf53c40443d1f1504d75477191e`: se enruta a arcsin(1/x), arccos(1/x), arctan(1/x) antes de la normalización genérica de potencias. Las pruebas de regresión existentes cubren estos casos; no se modificó Plus.
- Lanzamiento automático observado en SHA 3eaf96e1: gate #37921487478, H1d #37921487510 y build #37921487454, inicialmente QUEUED. Aún no hay resultados verificables ni cierre de H1d.
- Plus mantiene gate #37909986582 SUCCESS. Siguiente paso: verificar resultados de Lite, continuar con hiperbólicas inversas y errores de sintaxis restantes tras el gate, sin iniciar H2 prematuramente.

## 2026-10-09 — Lite: inversión hiperbólica, validación CI pendiente
- Gate Lite #37921487478 completó FAILURE: 993 PASS / 22 FAIL / 30 TODO. H1d #37921487510 SUCCESS y build #37921487454 SUCCESS. La corrección de trigonométricas recíprocas eliminó cinco fallos respecto del gate anterior.
- Se observaron seis fallos de paridad en formas de teclado `sinh^{-1}`, `cosh^{-1}`, `tanh^{-1}`, `csch^{-1}`, `sech^{-1}`, `coth^{-1}` por enrutamiento de sintaxis. Se implementó normalización temprana, antes de la transformación genérica de potencias, hacia `asinh/acosh/atanh/acsch/asech/acoth`, sin relajar expectativas matemáticas.
- Commit Lite `1a020fa6271ba152a35588d8d9ba9060cfd8d41d` en `src/engine/parsing/normalize.ts`. No se modificó Plus.
- GitHub Actions generó automáticamente gate #37921790827, H1d #37921790903 y build #37921790828, QUEUED en la consulta. No afirmar PASS hasta revisar logs y ejecución sobre SHA correspondiente.
- Plus mantiene el último gate completo SUCCESS #37909986582. IN625 H1d aún sin cierre bilateral contractual; H2 pendiente.

## 2026-10-09 — Lite: gate 16 fallos y validación temprana de decimales
- Gate Lite #37921790827 FAILURE: 999 PASS / 16 FAIL / 30 TODO. H1d #37921790903 y build #37921790828 SUCCESS. Se corrigieron seis fallos de inversas hiperbólicas.
- El diagnóstico de la suite `tests/parsing.test.ts` identificó que `.5`, `5.` y `1e5` no se rechazan según el contrato de sintaxis estricta. Se añadió `validateDecimalPoints(latex)` antes de `preprocessLatex(latex)` para impedir que la canonicalización o multiplicación implícita escondan entradas inválidas; permanece la validación posterior.
- Commit Lite `535d7da95c35eda429a60003304b1c2310ba073e` en `src/engine/parsing/index.ts`. Gate Lite #37922045811, H1d #37922045861 y Build #37922045803 generados automáticamente, QUEUED al comprobar. Aún no hay evidencia de PASS o reducción de fallos de este cambio.
- Plus sin modificaciones de producto: último gate SUCCESS #37909986582. H1d contractual pendiente; H2 no iniciado. Siguiente paso: clasificar nueva corrida, continuar con delimitadores, texto LaTeX pegado y discrepancias de semántica sin relajar contratos.

## 2026-10-09 — Contradicción de oráculos D1/D2 y reversión segura
- Gate Lite #37922045811 sobre 535d7da9: FAILURE, 996 PASS / 19 FAIL / 30 TODO. H1d #37922045861 SUCCESS y build #37922045803 SUCCESS.
- La validación cruda introducida en 535d7da9 cerró tres casos legados de rechazo (`.5`, `5.`, `1e5`) pero provocó seis fallos en contratos IN625 vigentes: D1 EN-NM-03/05/06 (normalización permisiva) y D2 EN-CI-05/06/07 (notación científica). Regresión neta +3 FAIL.
- Se revirtió **únicamente** la llamada inicial `validateDecimalPoints(latex)` en Lite, commit `0b61ecf26c7d9c330b8f0892880b71d2d744da39`. Se conserva la validación posterior y todas las mejoras trigonométricas. No se debilitaron las matrices D1/D2.
- Nuevas corridas por push técnico: gate Lite #37922422250, H1d Lite #37922422230, build Lite #37922422315 (QUEUED en primera consulta). No acreditar conclusión hasta comprobarla.
- **Deuda de reconciliación de contrato**: `tests/parsing.test.ts` todavía espera rechazo de formatos que los contratos IN625 D1/D2 aceptan/canonizan. Establecer precedencia documental y revisar el oráculo legado antes de volver a cambiar la semántica del parser.
- Plus gate #37909986582 SUCCESS. H1d no cerrado contractualmente, H2 no iniciado.

## 2026-10-09 — Lite: G3 admite delimitadores visualmente equivalentes (CI pendiente)
- Gate posterior a reversión #37922422250: FAILURE, 999 PASS / 16 FAIL / 30 TODO; H1d #37922422230 SUCCESS y build #37922422315 SUCCESS. Se confirmó regreso a baseline previo a validación cruda conflictiva.
- Fallos EN-DL-04/05/06: el validador estructural G3 rechazaba `\\bigl/\\bigr/\\Bigl/\\Bigr/\\mleft/\\mright` antes de la normalización existente en `normalizeDelimiterSyntax`; estos comandos sólo expresan tamaño o agrupación equivalente.
- Corrección Lite `3e04ed0767660f6ffbf742bf8488a8933391c344` en `src/engine/parsing/normalize.ts`: pre-normalización **restringida a delimitadores visuales** dentro de G3, manteniendo íntegros los chequeos de errores estructurales y todas las equivalencias matemáticas.
- CI nuevo sobre ese SHA: gate #37922692266, H1d #37922692229 y build #37922692214, inicialmente QUEUED. No se acreditan PASS hasta confirmar resultados.
- Plus último gate completo SUCCESS #37909986582. H1d no cerrado contractualmente; H2 pendiente. Próximo: verificar tres casos A2 y analizar F1/otros errores sin ocultar defectos ni rebajar expectativas.

## 2026-10-09 — Lite: saneamiento de LaTeX pegado antes de validación G3
- Gate Lite #37922692266 FAILURE: 1002 PASS / 13 FAIL / 30 TODO. EN-DL-04/05/06 ahora sin fallos; H1d #37922692229 y build #37922692214 SUCCESS.
- EN-PG-05a/05b/14a/14b estaban fallando porque `validateInputStructureG3` rechazaba `\\begin`, `\\tag` y `\\label` antes de pasar por `normalizePastedLatex`, aun siendo wrappers/editoriales no semánticos contemplados en F1.
- Commit Lite `28612dccc6221f7196608a17cc5582fb4080935e`: G3 ahora valida la entrada saneada con `normalizePastedLatex(input)` y conserva las verificaciones estructurales. No se cambiaron oráculos ni Plus.
- Verificación de gate/H1d para el commit aún pendiente de aparición o terminación; no acreditar la reducción de fallos antes de obtener CI. Plus mantiene gate #37909986582 SUCCESS. H1d global aún abierto, H2 no iniciado.

## 2026-10-09 — Lite gate 9 fallos y compatibilidad G3 con macros/Excel
- Gate Lite #37922948977 FAILURE: 1006 PASS / 9 FAIL / 30 TODO (mejora confirmada frente a 1002 PASS / 13 FAIL). H1d #37922949047 SUCCESS y build #37922948989 SUCCESS, todos en SHA 28612dccc. Los cuatro casos EN-PG-05a/05b/14a/14b dejaron de fallar.
- Se identificaron fallos estructurales G3 por `\\binom{5}{2}`, `\\rightarrow` (contiene prefijo textual `\\right`), fórmula Excel `=2^10` y `PI()` de Excel español: G3 los rechazaba antes de la normalización semántica ya implementada.
- Cambio Lite `a878fe7715c8056d12f44bf0bab18f34258c2547` en `src/engine/parsing/normalize.ts`: G3 admite macro `binom`; convierte `\\rightarrow` en `\\to` antes del chequeo de emparejamiento; elimina prefijo Excel `=` al validar (sin alterar su significado matemático); reemplaza PI() por pi solo en el canal de validación estructural. No se modificaron oráculos ni Plus.
- GitHub Actions activados automáticamente: gate #37923383864, H1d #37923384007, build #37923383999; inicialmente QUEUED. Resultado de este nuevo cambio todavía no certificado.
- Plus último gate aprobado #37909986582. Mantener H1d contractual abierto y H2 pendiente hasta reconciliar pendientes y evidencias.

## 2026-10-09 — Lite: G3 fórmula Excel vs ecuación incompleta
- Gate Lite #37923383864 FAILURE: 1007 PASS / 8 FAIL / 30 TODO. H1d #37923384007 SUCCESS y build #37923383999 SUCCESS. EN-OP-21, EN-CA-21 y EN-AS-15 dejaron de fallar, pero apareció una regresión G3 EN-ER-26 (=3) y EN-AS-16 (PI()) aún fallaba.
- Causa: G3 eliminaba indiscriminadamente el prefijo = antes de validar, impidiendo el rechazo obligatorio de =3; además la expresión regular para PI() usaba incorrectamente un backslash literal antes del límite de palabra.
- Corrección Lite `e9a3493d2cfef5eb575d444a4d063bb15125e339` en `src/engine/parsing/normalize.ts`: restringir tolerancia Excel en G3 al patrón certificado de potencia `=2^10`; preservar rechazo de `=3`; corregir patrón de PI() en Excel español. No se modificaron tests ni Plus.
- CI iniciada sobre commit: gate #37924824324, H1d #37924824344 y build #37924824326 (QUEUED en consulta). No acreditar PASS hasta revisar logs.
- Plus último gate #37909986582 SUCCESS; H1d pendiente de cierre contractual conjunto. H2 no iniciado.

## 2026-10-09 — Lite gate 5 fallos; precedencia numérica y contrato G3
- Gate Lite #37924824324 FAILURE: 1010 PASS / 5 FAIL / 30 TODO. H1d #37924824344 SUCCESS; build #37924824326 SUCCESS. Los problemas EN-AS-16 (Excel PI()) y G3 EN-ER-26 (=3) ya no fallan.
- EN-PR-11 exigía que `2++3` evalúe a 5, pero G3 rechazaba cualquier `++`; el contrato G3 EN-ER-33 exige seguir rechazando `x++` incompleto. Commit Lite `c017d7b800a67406fdd5d85c341fcafcd8fd3149`: permitir estrictamente `número++número` en validación G3 y conservar rechazo de las demás cadenas `++` no reconocidas. Pendiente evidencia de nuevo gate, H1d y build.
- Cuatro fallos adicionales proceden de expectativas legadas en `tests/parsing.test.ts` sobre rechazo de `.5`, `5.`, `1e5` y token único `xyz`. Los contratos nuevos D1/D2 normalizan los tres formatos numéricos; NO revertir soporte de producto solo para satisfacer pruebas viejas. Reconciliar explícitamente contrato de identificadores antes de actualizar el oráculo `xyz`.
- Plus gate #37909986582 SUCCESS; H1d bilateral sin cierre formal, H2 aún no iniciado.

## 2026-10-09 — Lite: reconciliación parcial de oráculos heredados v9
- Gate Lite #37925091461 FAILURE: 1011 PASS / 4 FAIL / 30 TODO; H1d #37925091430 SUCCESS y build #37925091465 SUCCESS. EN-PR-11 dejó de fallar tras corrección G3.
- Los cuatro FAIL son exclusivamente de `tests/parsing.test.ts`. Tres reclaman rechazo de `.5`, `5.`, `1e5` de contrato v9; IN625 D1 EN-NM-03/05 y D2 EN-CI-05/06/07 exigen aceptación y normalización, ya verificadas por gate. Se actualizaron las expectativas legadas conservando pruebas de aceptación, sin cambiar código producto: commits Lite `14324ffcb50ae6df7ee06601f151806b882707f7` y `a6dd28b60ef4043079b25ac3967d43a7afd8400e` en `tests/parsing.test.ts`.
- **No se alteró** la cuarta expectativa antigua de identificador `xyz` porque aún requiere determinar autoridad del contrato para identificadores multiletra; sigue clasificada para reconciliación explícita.
- GitHub Actions: gate #37926431480 sobre SHA 14324ffcb inicialmente IN_PROGRESS (primer test commit); H1d #37926462125 y build #37926462157 observados QUEUED sobre SHA final a6dd28b60. Falta gate de SHA final: no atribuirle resultado de la versión anterior.
- Plus gate #37909986582 SUCCESS; H1d bilateral pendiente de cierre formal y H2 sin iniciar.

## 2026-10-09 — Lite: reconciliación final de dos oráculos legados del parser
- Gate Lite #37926462245 FAILURE, SHA a6dd28b60: 1012 PASS / 2 FAIL / 30 TODO (1044 casos). Build #37926462157 y H1d #37926462125 SUCCESS en la misma SHA.
- `tests/parsing.test.ts` aún exigía salida textual literal `1/2` para `.5`, pero el parser devuelve `(05/10)` matemáticamente equivalente y los contratos D1 validan equivalencia numérica; se cambió a prueba matemática `simplify(parsed - 1/2) == 0`, no a string hardcode.
- `xyz` era esperado como identificador multiletra por spec v9, mientras la regla vigente IN625 C10 en `src/engine/parsing/tokenize.ts` lo tokeniza como `x*y*z`, preservando los nombres reservados de varias letras. Se actualizó la prueba de regresión para la semántica C10; no se cambió el producto.
- Commit Lite `82fb45c47c30a7889ebd75a47464ac65649217be` en `tests/parsing.test.ts`, sin rebajar equivalencia funcional.
- Nuevos workflows emitidos en SHA 82fb45c47: gate #37926844320, H1d #37926844177, build #37926844234, inicialmente QUEUED. **No declarar gate SUCCESS** hasta verificar resultado y SHA.
- Plus conserva gate #37909986582 SUCCESS. H1d todavía necesita cierre bilateral formal y H2 continúa pendiente.

## 2026-10-09 — Gate Lite verde y consolidación de evidencia H1d bilateral
- Lite cumulative gate #37926844320 SUCCESS: **83/83 archivos, 1014 PASS, 0 FAIL, 30 TODO (1044)**, SHA de prueba `82fb45c47c30a7889ebd75a47464ac65649217be`. H1d #37926844177 SUCCESS y build #37926844234 SUCCESS en la misma SHA.
- Plus cumulative gate #37909986582 SUCCESS; H1d #37909986581 SUCCESS, ambos en SHA `2d4e97c38`.
- Se actualizó CURRENT_STATE.md bilateralmente: Lite commit `6c4ff0639913d0d66498b951dee730df3edf5dde`, Plus commit `604c5575b6b0cccd99d95f369a5254ef34768a`.
- **Aún no cerrar H1d formalmente ni comenzar H2**: confrontar criterios con pruebas H1d 24..28, reconocer límites de los oráculos 25..28 y mantener 29/30 como CAPABILITY GAPS, no PASS. EN-RE-22 permanece gap H1c. Cierre estructural automatizable demostrado, pero no equivalencia matemática universal.

## 2026-10-09 — H1d cierre formal por PASS/GAP; iniciar descubrimiento de H2
- H1d: EN-RE-24..28 = 5/5 PASS automatizados; EN-RE-29/30 = 2 CAPABILITY GAPS explícitos, NO PASS. H1a y H1b 8/8, H1c 6 PASS y EN-RE-22 GAP. Conforme a IN625_H1_MATRIX.md el cierre requiere clasificación exhaustiva, no capacidades ficticias.
- Lite H1d run 37926844177 SUCCESS; acumulativo run 37926844320 SUCCESS con 1014 PASS, 0 FAIL, 30 TODO. Plus H1d 37909986581 SUCCESS; acumulativo 37909986582 SUCCESS.
- Decisión: H1d CERRADO al nivel contractual de clasificación. Advertencia: EN-RE-25/26/27/28 tienen límites de oráculo semántico; EN-RE-22/29/30 siguen GAP y pendientes para desarrollo futuro. No implica certificación global.
- CURRENT_STATE.md actualizado en Lite commit 9ad0438c150a46529588027621fe52a74252e3ca y Plus commit af54bda6cab4bdac7741be3e5941430d8cb91a57.
- H2 se activa como próximo bloque, inicialmente en fase de localización de matriz, cobertura y harness. No se ha ejecutado H2.

## 2026-10-09 — H2: discovery de matriz canónica
- H1d cerrado por clasificación: cinco PASS automatizados EN-RE-24..28 en cada motor, dos GAP EN-RE-29/30; H1c EN-RE-22 también GAP. Gates Lite #37926844320 y Plus #37909986582 SUCCESS.
- **H2 no ejecutado**: no se localizó su matriz canónica en `qa/certification/`; la búsqueda limitada de GitHub tampoco identificó su fuente original `matriz_entrada_sintaxis_calculadora` Parte H.2. No hay IDs/casos H2 acreditados.
- Se creó `qa/certification/IN625_H2_DISCOVERY.md` bilateral, con inventario de fuentes consultadas y condiciones de procedencia antes de testear. Lite commit 724436bf; Plus commit 4d71ab65.
- **Siguiente paso exacto**: recuperar de los artefactos originales/otra ubicación del repo la Parte H.2 con IDs, entradas, expected y clasificación; incorporarla fielmente, preparar harness Lite y Plus y correr las suites. No marcar H2 PASS sin evidencias.

## 2026-10-09 — H2 source recovered (32 EN-SG cases)
- Original `matriz_entrada_sintaxis_calculadora.md` located in project file library, section H.2 (lines 864 onward): EN-SG-01..32; table summary 32 cases: N1=2, N2=8, N3=22. Actual H2 cases now grounded in primary project source, not invented.
- Created `qa/certification/IN625_H2_MATRIX.md` bilaterally as traceable working index: Lite commit f9a8d086, Plus commit e5a76ba0. Original remains source for exact inputs and expectations.
- Previous `IN625_H2_DISCOVERY.md` discovery blocker is RESOLVED for source localization; next task is to prepare safe isolated tests, initially lightweight N1/N2, then N3 controlled environment. No H2 PASS/FAIL claimed yet; do not execute potentially harmful resource-load/rate burst scenarios against production.
- H1d classified and closed as previously recorded; Lite cumulative run 37926844320 SUCCESS, Plus cumulative 37909986582 SUCCESS. H2 ACTIVE, execution not yet performed.

## 2026-10-09 — H2 primera tanda técnica de seguridad, aislada
- Matriz original H.2 recuperada de biblioteca: EN-SG-01..32 (N1 2, N2 8, N3 22). Índice bilateral `IN625_H2_MATRIX.md` creado antes.
- Lite: `tests/in625H2Security.audit.test.ts`, commit 37bd13d3a0f3001f9f671789173a891c298d7ca9. 10 verificaciones negativas de parser para SG01/02/04/05 (cuatro variantes)/06/07/08. **No equivalen a prueba de escape de DOM del navegador**.
- Plus: `backend/tests/test_in625_h2_security.py`, commit b57755bbc68a090081294c99ae9395fa28d3f09b. 9 solicitudes TestClient in-process sobre endpoint evaluate para SG09..16 (muestras seleccionadas), sin ejecutar expresiones ni tocar red exterior. Aún no acredita todos los ejemplos de cada fila.
- CI observada en inicio: Lite gate 37928409309 IN_PROGRESS, H1d 37928409338 IN_PROGRESS, build 37928409297 IN_PROGRESS; Plus gate 37928413904 QUEUED y H1d 37928415752 QUEUED. **PASS/FAIL pendientes de consultar**.
- En próximas rondas clasificar cada resultado y fortalecer UI, estado compartido, límites de recursos, recuperación de worker, JSON y tasa solo en entornos aislados. Ningún N3 de carga extrema se ha ejecutado.

## 2026-10-09 — H2 primera tanda: PASS verificado bilateral
- Lite gate 37928409309 SUCCESS SHA 37bd13d3: 84/84 archivos; 1024 PASS, 0 FAIL, 30 TODO (1054). H1d 37928409338 SUCCESS y build 37928409297 SUCCESS.
- Plus gate 37928413904 SUCCESS SHA b57755bb: frontend 69/69 archivos; 725 PASS, 0 FAIL, 28 TODO (753), con backend gate SUCCESS. H1d 37928415752 SUCCESS.
- Cobertura nueva H2: Lite 10 casos de rechazo parser (EN-SG-01/02/04/05/06/07/08, variantes); Plus 9 casos de rechazo backend TestClient (muestras EN-SG-09..16). Estas cifras son aserciones, NO 19 de 32 filas H2 certificadas: faltan verificaciones DOM/código nunca ejecutado, cobertura completa por fila, estrés/cancelación y API.
- Siguiente paso: reforzar cobertura de H2 sin lanzar cargas peligrosas en producción, evaluar categorías por fila y ejecutar nueva tanda aislada con evidencia.

## 2026-10-09 — H2 segunda tanda de variantes negativas
- Lite amplió pruebas EN-SG-07 (\\let, \\catcode) y EN-SG-08 (\\include, \\write18, \\openin) en `tests/in625H2Security.audit.test.ts`. SHA final de tests 181f58a87779572d45d561c6af043066b86cafaa; el commit intermedio 571226fb contenía literales de prueba con barras incorrectamente escapadas y fue corregido inmediatamente, no usar esa corrida como evidencia final.
- Plus amplió EN-SG-14/15/16 con variantes de os.system, __dict__, Integer y Function, en `backend/tests/test_in625_h2_security.py`, commit bd7f4f096a776907ae9ff33497796965cf67fd33.
- GitHub CI sobre código Lite final: gate 37929006342, H1d 37929006262 y build 37929006242 inicialmente QUEUED. Plus gate 37928951948 y H1d 37928952061 IN_PROGRESS. No acreditar nuevos PASS antes de revisar logs. Continúan pendientes DOM/UX, límites N3, aislamiento de estado y API dedicada.

## 2026-10-09 — H2 segunda tanda: gates bilaterales verdes
- Lite SHA 181f58a8 gate #37929006342 SUCCESS: 84/84 archivos, 1029 PASS, 0 FAIL, 30 TODO. H1d #37929006262 SUCCESS, build #37929006242 SUCCESS. El gate de SHA intermedia 571226fb falló y fue corregido antes de SHA validada.
- Plus SHA bd7f4f09 gate #37928951948 SUCCESS y H1d #37928952061 SUCCESS; log backend 498 PASS. Se preservó la primera tanda H2.
- H2 todavía NO cerrado: la verificación de rechazo sintáctico no sustituye escape/render DOM ni controles de recursos y concurrencia; próximos casos SG17..32 aislados.

## 2026-10-09 — H2 tercera tanda en CI (SG17, SG19/20)
- Lite `tests/in625H2Security.audit.test.ts` amplía EN-SG-19 (50 paréntesis balanceados, contenido 1) y EN-SG-20 (1000 paréntesis: rechazo explícito PARSE_ERROR). Código final SHA 349c3d48786aaf10e289fbbf081dba28caadc675. El commit inicial d3ae3b0e permitía erroneamente éxito SG20: sustituido por aserción estricta antes de certificar; no usar corrida intermedia.
- Plus `backend/tests/test_in625_h2_security.py` añade EN-SG-17 con llamadas consecutivas de TestClient, comprobando que la asignación a=7 no provoque salida numérica 8 para a+1. Commit 10d92349d1a961c5a5387a686a9d2ae5d400d6fc. Prueba de aislamiento parcial, no auditoría exhaustiva del estado.
- Corridas iniciales pendientes: Lite gate 37929580457, H1d 37929580449 y build 37929580458; Plus gate 37929605924 y H1d 37929605874. No se acreditan PASS hasta revisar logs.

## 2026-10-09 — H2 SG20: regresión detectada y corrección Lite
- Lite gate 37929580457 FAILURE: 1030 PASS / 1 FAIL / 30 TODO, fallo únicamente EN-SG-20: 1000 paréntesis anidados eran aceptados en vez de rechazarse con error controlado. H1d 37929580449 SUCCESS y build 37929580458 SUCCESS en misma SHA 349c3d48.
- Plus gate 37929605924 SUCCESS y H1d 37929605874 SUCCESS en SHA 10d92349; caso nuevo EN-SG-17 aprobó.
- Producto Lite corregido en `src/engine/parsing/normalize.ts`: G3 aborta cuando profundidad de paréntesis excede 128 (guard simple O(n)), conservando 50 paréntesis de EN-SG-19. Commit técnico 35eaf51da324f525873f7a3e34929fb5b58c4d00.
- Nuevas corridas Lite: gate 37929956618, H1d 37929956615 y build 37929956663; QUEUED en primera consulta. Resultado no acreditado aún. Mantener H2 abierto.

## 2026-10-09 — H2 SG20 confirmado y SG22 protección de longitud
- Lite gate 37929956618 SUCCESS SHA 35eaf51d: 84/84 archivos, 1031 PASS, 0 FAIL, 30 TODO (1061). H1d 37929956615 SUCCESS y build 37929956663 SUCCESS. EN-SG-20 (1000 niveles) queda aprobado tras límite de profundidad 128, SG19 (50 niveles) sigue PASS.
- H2 EN-SG-22: Lite test nuevo de 100001 caracteres en `tests/in625H2Security.audit.test.ts`, SHA 64093b78; producto `src/engine/parsing/normalize.ts` limita longitud a 65536 caracteres al inicio de G3, SHA 72f6288ba18aae40024de721a427689204da790a. No se envían cargas de estrés a producción.
- Corridas iniciadas de test commit: gate 37930218235, H1d 37930218224 y build 37930218284; commit de producto reciente 72f6288b aún sin gate listado en primera consulta (build 37930251056 QUEUED). Validar gate de SHA final, no adjudicar PASS antes de CI.
- Plus permanece en gate verde 37929605924 y H1d 37929605874, sin cambios de producto en esta tanda. H2 abierto.

## 2026-10-09 — H2 SG22 verificado y SG30 iniciado
- Lite SHA 72f6288b gate acumulativo #37930251112 SUCCESS: 84/84 archivos, 1032 PASS, 0 FAIL, 30 TODO. H1d #37930251045 SUCCESS; Build #37930251056 SUCCESS. Protección EN-SG-22 de longitud >65536 verificada en el gate.
- Plus añadió test seguro TestClient EN-SG-30 para comillas, apóstrofo, barra invertida, NUL, CR/LF dentro de JSON, sin enviar solicitudes a producción. Commit técnico 74c75eed676f9510489ee4b59023c442e78fccc4; gate #37930612943 y H1d #37930612924 IN_PROGRESS al consultar. Acreditación de EN-SG-30 PENDIENTE de resultados; cobertura solo transporte in-process, no audit del cliente/browser.
- Continuación H2: revisar nuevos logs, diferenciar producto/oráculo y trabajar límites de tamaño API, render escape y concurrencia con recursos aislados. H2 permanece abierto.

## 2026-10-09 — H2 SG30 verde; SG18 humo aislado iniciado
- Plus gate #37930612943 SUCCESS y H1d #37930612924 SUCCESS en SHA 74c75eed; backend 504 PASS; SG30 transporte JSON con caracteres especiales cubierto por cinco pruebas in-process (sin afirmar verificación completa de navegador).
- Lite último gate técnico #37930251112 SUCCESS: 1032 PASS, 0 FAIL, 30 TODO; SG22 longitud protegida y confirmada.
- Plus nueva tanda EN-SG-18 en backend/tests/test_in625_h2_security.py para clearall/draw/run/last/lambda; commit 8e7a16b1. **Oráculo de humo débil**: solo respuesta controlada y ausencia de traceback, no prueba completa de ausencia de efectos secundarios; reforzar con aislamiento de estado. Gate siguiente pendiente de verificación.
- H2 no está cerrado y los casos restantes no deben declararse PASS por estas pruebas parciales.

## 2026-10-09 — SG18 CI verde; ampliar símbolos reservados
- Plus SG18 primera tanda commit 8e7a16b1, gate #37931173988 SUCCESS (backend 509 PASS; frontend 69 archivos PASS), H1d #37931174106 SUCCESS.
- Se añadieron las dos palabras restantes de la fila SG18, `S` y `N`, a `backend/tests/test_in625_h2_security.py`, commit Plus e9366e32b0043dbb226b6226cd66e45430f82e26. Oráculo sigue siendo de respuesta controlada, no acredita ausencia absoluta de efectos secundarios.
- Pendiente verificar gate sobre e9366e32; H2 sigue abierto. Lite último gate confirmado #37930251112 SUCCESS (1032 PASS / 0 FAIL / 30 TODO).

## 2026-10-09 — SG18 cierre parcial validado y prueba de continuidad añadida
- Plus gate #37931655532 SUCCESS y H1d #37931655487 SUCCESS sobre SHA e9366e32; cobertura SG18 incluye clearall/draw/run/last/lambda/S/N como pruebas de respuesta controlada.
- Se amplió `backend/tests/test_in625_h2_security.py` para ejecutar cada palabra reservada seguida de cálculo independiente 2+3, cuyo resultado debe ser 5 y success=true: detección adicional de corrupción de estado (no prueba exhaustiva de ausencia de todos los efectos secundarios). Commit Plus eec2e12ac0f706149ea65e411fb348d641ddd036.
- Corridas de nuevo commit Plus: gate #37932351349 y H1d #37932351494 inicialmente QUEUED. No acreditar PASS hasta revisar esos logs. Lite último gate #37930251112 SUCCESS y conserva 1032 PASS, 0 FAIL, 30 TODO.
- H2 EN-SG-01..32 permanece abierto; continuar cobertura E2E de DOM y límites con ejecución aislada.

## 2026-10-09 — H2 SG18 corrección de oráculo API, nueva ejecución
- Plus run #37932351349 FAILURE en backend: siete aserciones de la prueba de continuidad SG18 buscaban `result` (campo inexistente en contrato de respuesta) en vez de `result_approx`. H1d #37932351494 SUCCESS. El fallo corresponde al HARNESS/ORÁCULO, no se acreditó fallo de producto.
- Se comprobó el contrato API mediante `backend/tests/test_evaluate.py` (assert de `result_approx`). Se corrigió el test de continuidad para exigir `result_approx == pytest.approx(5.0)`; commit Plus `416564fec878cad1cf77ac0c0884a29f463e1bf4`.
- Corridas nuevas: gate acumulativo Plus #37932655088 QUEUED y H1d #37932655171 IN_PROGRESS en primera consulta. No declarar PASS hasta verificar ambas. Lite último gate confirmado #37930251112 SUCCESS, 1032 PASS / 0 FAIL / 30 TODO.
- H2 permanece abierto y requiere validar ausencia de efectos secundarios de SG18 más allá de esta comprobación de continuidad.

## 2026-10-09 — H2 SG18 verificado y SG30 ampliación de controles JSON
- Plus SG18 gate #37932655088 SUCCESS en SHA 416564fe: backend 518 PASS; frontend 69 archivos PASS, H1d #37932655171 SUCCESS. Se corrigió oráculo de respuesta result_approx; no se necesitó cambio de motor.
- Nueva tanda Plus SG30 añade tab y newline en JSON in-process, `backend/tests/test_in625_h2_security.py`, SHA técnico e556d375. Gate #37932950020 y H1d #37932950098 IN_PROGRESS en consulta; no declarar PASS todavía.
- Lite mantiene gate #37930251112 SUCCESS: 1032 PASS / 0 FAIL / 30 TODO. H2 continúa abierto. Pendientes por cubrir: DOM, límites de recursos, concurrencia y clasificación por fila.

## 2026-10-09 — H2 SG30 gate verde y SG18 aislamiento simbólico ampliado
- Plus gate acumulativo #37932950020 SUCCESS en SHA e556d375 (backend 520 PASS, frontend 69 archivos PASS), H1d #37932950098 SUCCESS. EN-SG-30 JSON tab y newline aprobados in-process; esto no certifica seguridad de API pública o navegador.
- Plus commit 11e2298deef3ee3da4966abe10b33d1e12891bc8 agrega siete comprobaciones de continuidad de símbolo libre tras cada palabra reservada SG18; oráculo limitado a detectar asignación indebida conocida (a+1=8). No acredita aislamiento integral.
- Nueva H1d Plus #37933301231 QUEUED en primera consulta; gate acumulativo del commit nuevo pendiente de comprobación. Lite último gate #37930251112 SUCCESS, 1032 PASS / 0 FAIL / 30 TODO. H2 abierto.

## 2026-10-09 — H2 SG18 isolation gate verified; independent operation regression
- Plus SHA 11e2298d: gate #37933302467 SUCCESS, backend 527 PASS, frontend 69 test files PASS; H1d #37933301231 SUCCESS. Seven new symbolic-isolation checks passed.
- Plus new commit 52613c53388b30971086cff6c14d0c2b27c08948 adds seven independent 7*6=42 probes following SG18 reserved tokens, checking API result_approx. Gate on new code pending; no PASS claimed for it yet.
- Lite remains on latest technically verified gate #37930251112 SUCCESS (1032 PASS/0 FAIL/30 TODO). H2 open, pending browser DOM safety and safe resource/concurrency tests.

## 2026-10-09 — H2 SG18 numeric isolation verified; repeated-token regression started
- Plus SHA 52613c53 gate #37933634816 SUCCESS: backend 534 PASS, frontend 69/69 test files PASS; H1d #37933634751 SUCCESS. Seven independent 7*6=42 probes green.
- Plus commit 08d0a2ba2b0ac14e4b4047c6b26a0034af37e2b5 introduces 7 more controlled SG18 tests: three successive reserved-token requests followed by 3^2+1=10, validating no observed state corruption in tested path. No claims of universal state isolation.
- Must confirm new gate and H1d before PASS; Lite latest technical gate #37930251112 SUCCESS (1032 PASS, 0 FAIL, 30 TODO). H2 32-case certification remains incomplete, DOM/resource/concurrency coverage pending.

## 2026-10-09 — SG18 secuencial verde; prueba racional independiente pendiente
- Plus gate #37933993122 SUCCESS SHA 08d0a2ba (backend 541 PASS, frontend 69 archivos PASS), H1d #37933993117 SUCCESS. Siete secuencias de palabras reservadas y cálculo 3^2+1=10 fueron validadas.
- Plus nuevo test `backend/tests/test_in625_h2_security.py`: siete cálculos racionales 1/2+1/4=0.75 posteriores a palabras reservadas SG18, commit 5c1a331ca51d3701a5d3367386968e8932f3a579. Gate #37934298655 inicialmente QUEUED. No afirmar resultado hasta verificación.
- Lite último gate confirmado #37930251112 SUCCESS, 1032 PASS/0 FAIL/30 TODO. H2 no cerrado; pruebas SG18 comprueban continuidad de escenarios concretos, no ausencia universal de estado o efectos secundarios.

## 2026-10-09 — H2 SG18 PASS; cobertura SG19/SG20 iniciada en Plus
- Plus gate #37934298655 SUCCESS en SHA 5c1a331c: backend 548 PASS y frontend 69 archivos PASS; H1d #37934298776 SUCCESS. SG18 pruebas racionales independientes aprobadas.
- Se incorporó `EN-SG-19` (50 niveles, respuesta 1) y `EN-SG-20` (1000 niveles, rechazo controlado) en el test in-process del backend Plus: commit e0ff9a07d187a662685e1b2180b227505d59e72c. Nuevas corridas: gate #37934714680, H1d #37934714494, inicialmente IN_PROGRESS. Sin evidencia PASS todavía.
- Lite gate anterior #37930251112 SUCCESS, 1032 PASS / 0 FAIL / 30 TODO. H2 sigue abierto hasta clasificación de 32 filas, no contar repetición de SG18 como avance entre filas.

## 2026-10-09 — H2 SG20 Plus: 422 controlado, oráculo corregido
- Gate Plus #37934714680 FAILURE sobre commit e0ff9a07: caso SG19 (50 paréntesis) pasó, SG20 (1000 paréntesis) falló porque el test exigía HTTP 200 y API devolvió HTTP 422. H1d #37934714494 SUCCESS.
- Causa reproducible: `backend/app/schemas/requests.py` limita `EvaluateRequest.expression` a 500 caracteres. La entrada SG20 de 2001 caracteres se rechaza antes del parser. `backend/app/core/exception_handlers.py` devuelve `VALIDATION_ERROR` 422 con mensaje controlado, sin traceback. No se detectó 500/crash.
- Corrección de oráculo en `backend/tests/test_in625_h2_security.py`, commit Plus b5e2bebac2fbaadc5f50cb9b54a0085068a832b6: SG19 requiere 200 y valor 1; SG20 requiere 422, success false, VALIDATION_ERROR, mensaje y sin traceback. **No atribuir un guard de profundidad interna a Plus**: esta cobertura es rechazo por longitud.
- Último gate Plus anterior confirmado verde #37934298655 (backend 548 PASS; frontend 69 archivos). Nueva corrida de commit b5e2bebac2fbaadc5f50cb9b54a0085068a832b6 pendiente de obtención de evidencia. Lite gate #37930251112 SUCCESS (1032 PASS/0 FAIL/30 TODO). H2 abierto.

## 2026-10-09 — H2 SG20 gate verde; SG22/SG31 límites de entrada aislados
- Plus SHA b5e2beba gate #37935114341 SUCCESS: backend 550 PASS, frontend 69 archivos PASS; H1d #37935114335 SUCCESS. SG19 procesa 50 paréntesis; SG20 rechaza 1000 por `EvaluateRequest.expression` max_length=500, 422 VALIDATION_ERROR, sin demostrar guard de profundidad interna.
- Nueva tanda Plus commit 691ec0efd28da2a4243b40692f3db10a6c6965cd agrega EN-SG-22 texto de 100000 caracteres y EN-SG-31 campo de 5 MiB, usando solo TestClient in-process. Oráculo espera rechazo 422 VALIDATION_ERROR del esquema. **EN-SG-31 es cobertura PARCIAL**: la matriz exige 413 de cuerpo completo; no se acredita con esta prueba de campo. Nuevos gate #37935592868 y H1d #37935592844 IN_PROGRESS al consultar; sin PASS aún.
- Lite sigue gate verde #37930251112 (1032 PASS, 0 FAIL, 30 TODO). H2 abierto. Próximo trabajo: verificar gate, revisar implementación de límite global HTTP 413 en entorno aislado y avanzar DOM/concurrencia sin producción.

## 2026-10-09 — SG31: protección HTTP 413 incorporada en Plus
- Plus gate #37935592868 SUCCESS sobre SHA 691ec0ef: backend 552 PASS y frontend 69 archivos PASS; H1d #37935592844 SUCCESS. EN-SG-22 y comprobación parcial de SG31 por esquema 422 aprobados.
- Se identificó ausencia de corte temprano de cuerpo HTTP antes de FastAPI. Plus `backend/app/main.py` implementa rechazo HTTP 413 para POST/PUT/PATCH con Content-Length declarado > 1 MiB, respuesta JSON con request_id y explicación, commit 27ff01c08b79ecee454ca90d10f38c5563139d59.
- Test `backend/tests/test_in625_h2_security.py` EN-SG-31 envía 5 MiB JSON a TestClient aislado y exige 413/PAYLOAD_TOO_LARGE/mensaje, commit a7bce5cb1ac66500fdc5f92f9ac8ffc24ce52c7e. Nuevas corridas en SHA final: gate #37935947535 y H1d #37935947374 QUEUED al consultar. No declarar PASS hasta logs.
- Límite actual detecta Content-Length declarado; peticiones chunked/sin cabecera requieren auditoría aparte. No se ejecuta contra producción. Lite conserva gate #37930251112 SUCCESS (1032 PASS, 0 FAIL, 30 TODO). H2 abierto.

## 2026-10-09 — H2 SG31 API 413 working; stale oracle corrected
- Plus technical gate #37935947535 FAILURE on a7bce5cb. Backend log shows dedicated `test_in625_h2_sg31_five_mib_json_body_returns_413` PASSED: new request-size middleware works for Content-Length. Failure was older parametrized EN-SG-31 asserting 422, now incompatible with new contract. Frontend job SUCCESS, H1d #37935947374 SUCCESS.
- Updated `backend/tests/test_in625_h2_security.py` to keep EN-SG-22 schema validation 422 and SG31 exclusively in its dedicated 5 MiB HTTP 413 test; Plus commit 4e8df256f448de5e8290c3ddbb6465e4cc3d6c68. New gate #37936389499 QUEUED at first observation, H1d subsequent run to be verified. **Not marked PASS until new gate succeeds.**
- Limitation: middleware currently checks declared Content-Length; chunked/absent Content-Length still requires independent size enforcement. No direct production load tests. Lite latest gate #37930251112 SUCCESS. H2 still OPEN.

## 2026-10-09 — SG31 gate verde, cuerpo streaming sin Content-Length en evaluación
- Plus commit 4e8df256 gate #37936389499 SUCCESS y H1d #37936389495 SUCCESS. SG31 de 5 MiB con Content-Length recibe HTTP 413 como se exige.
- Plus `backend/app/main.py` commit 8a7e8f0e añade límite de 1 MiB para peticiones POST/PUT/PATCH sin Content-Length, inspeccionando stream de entrada antes de enviar al router y conservando cuerpos válidos.
- Plus `backend/tests/test_in625_h2_security.py` commit ecaca3b7 agrega prueba TestClient in-process con 5 MiB fragmentados y sin longitud declarada; deben devolver HTTP 413 y PAYLOAD_TOO_LARGE. Gate #37936872223, H1d #37936872206 inicialmente IN_PROGRESS. Estos cambios NO están certificados hasta comprobar logs.
- Lite gate anterior #37930251112 SUCCESS (1032 PASS/0 FAIL/30 TODO). H2 abierto; quedan pendientes otras filas de seguridad/recursos y pruebas DOM.

## 2026-10-09 — SG31 streaming gate PASS y regresión de cuerpo válido
- Plus gate #37936872223 SUCCESS SHA ecaca3b7: backend 553 PASS, frontend 69/69 archivos PASS; H1d #37936872206 SUCCESS. La petición 5 MiB por fragmentos sin Content-Length se rechaza 413 in-process.
- Nueva prueba en Plus `backend/tests/test_in625_h2_security.py`, commit e54e56ba7868d22be942aeec54dba7ff52839cad: cuerpo JSON pequeño fragmentado sin Content-Length debe conservarse correctamente y producir 2+3=5. Protege contra una regresión de lectura/replay introducida por el guard SG31. Nueva H1d #37938105111 QUEUED; gate acumulativo del nuevo commit aún no verificado.
- H2 no certificado integralmente. Lite último gate técnico #37930251112 SUCCESS (1032 PASS/0 FAIL/30 TODO). Próximos casos: DOM render, concurrencia y cancelación en entorno aislado.

## 2026-10-09 — SG31 gate verde; verificación posterior al rechazo
- Plus gate #37938105248 SUCCESS sobre SHA e54e56ba: 554 backend PASS, 69/69 archivos frontend PASS; H1d #37938105111 SUCCESS. Peticiones JSON válidas fragmentadas sin Content-Length siguen evaluándose.
- Plus commit 4d1cb61d31020d2f13a7f3e9edefeb7df23dec60 agrega dos regresiones SG31: operación válida fragmentada y continuidad de evaluación 6*7=42 tras rechazo previo por 413. La primera replica parcialmente cobertura previa; la segunda comprueba no contaminación después del rechazo. Gate nuevo aún no confirmado.
- Lite gate anterior #37930251112 SUCCESS 1032 PASS/0 FAIL/30 TODO. H2 abierto, pendientes pruebas DOM, cancelación y concurrencia.

## 2026-10-09 — SG31 recovery verified; H2 SG30 contract extended
- Plus SHA 4d1cb61d gate #37938555813 SUCCESS: 556 backend PASS, frontend 69 files PASS; H1d #37938553925 SUCCESS. SG31 rejection 413 does not poison subsequent evaluation (6*7=42).
- New Plus test commit 141f8addf360f2cd9a97cf174072dcf263fc7e9e: strengthen distinct EN-SG-30 JSON API test with quotes, backslash, NUL, CRLF, asserting structured JSON response, request_id correlation, and absence of traceback (in-process TestClient only). Gate #37939346741 was IN_PROGRESS when checked; results not yet confirmed.
- H2 remains open: no DOM/browser security or cancellation/concurrency certification yet; Lite latest verified gate #37930251112 SUCCESS, 1032 PASS/0 FAIL/30 TODO.

## 2026-10-09 — H2 SG30 PASS y SG29 concurrencia API introducida
- Plus gate #37939346741 SUCCESS en SHA 141f8add: backend 561 PASS, frontend 69 archivos PASS; H1d #37939346799 SUCCESS. SG30: JSON con caracteres especiales conserva respuesta estructurada y request_id.
- Nueva prueba Plus SG29 en commit 42f8f0e4ded0b91a6b66680554a68f15b0083c85: 20 evaluaciones numéricas independientes mediante ThreadPoolExecutor de 4 workers, TestClient local, valores/resultados/request_id únicos. Cobertura SOLO backend; falta comportamiento UI `última entrada gana` con Playwright. No afirmar PASS hasta CI.
- Lite último gate verificado #37930251112 SUCCESS (1032 PASS, 0 FAIL, 30 TODO). H2 sigue abierto; aún faltan DOM, cancelación y casos de recursos.

## 2026-10-09 — H2 SG29 backend aprobado; UI básica fuera de orden en evaluación
- Plus SHA 42f8f0e4: gate acumulativo #37947460730 SUCCESS, backend 562 PASS, frontend 69 archivos PASS; H1d #37947461087 SUCCESS. 20 solicitudes backend concurrentes producen resultado propio y request_id únicos.
- Inspección de `frontend/src/components/BasicMode.tsx` encontró riesgo de sobrescritura de resultados por respuestas tardías. Commit Plus 526a836e8e59c0cf986e06a594e9f6bdefe2538 agrega latestSubmissionRef y descarta respuesta tardía en ruta sencilla de evaluación /evaluate, /solve, /inequality. Commit 0dfb711b3edff5a417481effab0bc5146df23165 agrega test en BasicMode.test.tsx con orden inverso de resolución. **Cambios no certificados hasta gate de SHA final.**
- Alcance SG29 sigue PARCIAL: otras ramas del modo básico, otros módulos y 20 peticiones reales de UI exigen revisión adicional. Último Lite gate #37930251112 SUCCESS. H2 abierto.

## 2026-10-09 — H2 SG29: CI frontend test oracle fixed
- Plus SG29 implementation commit 526a836e cumulative gate #37952069953 SUCCESS, H1d #37952069894 SUCCESS. Follow-up frontend test commit 0dfb711b gate #37952104538 FAILURE: TestingLibraryElementError `Found multiple elements with the text: 4` at BasicMode.test.tsx:342. Backend job succeeded, H1d #37952104433 SUCCESS. This failure is an ambiguous selector, not direct evidence of functional stale-response failure.
- Plus commit f76ac236a00365f3b75739ba7badb75350c906dc updates SG29 test to `getAllByText` for result 4; gate #37953322968 QUEUED at observation. Await test gate before marking SG29 UI proof green. Actual SG29 scope still partial: basic evaluation path only, other modes unverified.

## 2026-10-09 — SG29 UI stale-success PASS; stale-error regression added
- Plus SHA f76ac236 gate #37953322968 SUCCESS: backend 562 PASS, frontend 69/69 test files PASS; H1d #37953322982 SUCCESS. The BasicMode out-of-order earlier-success test now passes.
- Plus new test SHA 5c549133733fe2dbe9658dc5f480e131dc29e16a checks late failure response cannot replace newer successful result or introduce a stale error in BasicMode. New CI pending; do not claim PASS yet.
- SG29 remains partial outside basic path, H2 OPEN. Lite last verified technical gate #37930251112 SUCCESS.

## 2026-10-09 — SG29 stale-error green; cobertura extendida a sistemas y cálculo Plus
- Plus SHA 5c549133 gate #37954572365 SUCCESS: backend 562 PASS, frontend 69 archivos PASS; H1d #37954572398 SUCCESS. La prueba de error antiguo que llega después de resultado correcto reciente pasó.
- Plus commit 167bb7149fc18f98c643f117fa36fb30ae5fb483 implementa `latestSubmissionRef` en `BasicMode.tsx` para `submitSystem`, `submitInequalitySystem` y `submitCalculus`: descarta respuestas asíncronas tardías y restringe reseteo de loading a solicitud más reciente. No afirmar cobertura de todos los módulos. Gate #37955774771 y H1d #37955775227 inicialmente QUEUED; verificación pendiente.
- H2 sigue OPEN; SG29 UI requiere test de respuestas fuera de orden por otras rutas, no solo implementar guard. Lite último gate de código #37930251112 SUCCESS.

## 2026-10-09 — H2 SG29 async basic routing GREEN; /solve test iniciado
- Plus SHA 167bb714 gate #37955774771 SUCCESS, backend 562 PASS, frontend 69 test files PASS; H1d #37955775227 SUCCESS. Protección a respuestas tardías en ramas `submitSystem`, `submitInequalitySystem` y `submitCalculus` compila y no rompe suites existentes.
- Nuevo test Plus `frontend/src/__tests__/BasicMode.test.tsx`, commit 02fc3cbd7a440e51bebfa2c9cecee6b82b597038: dos respuestas `/solve` fuera de orden deben mantener el resultado de la petición más reciente, comprobando ruta adicional a `/evaluate`. Nuevo gate técnico aún pendiente, no registrar PASS por adelantado.
- H2 y SG29 siguen abiertos/parciales: otros modos y flujos asíncronos por probar. Lite último gate #37930251112 SUCCESS.

## 2026-10-09 — H2 SG29 /solve UI test: LaTeX display oracle fixed
- Plus commit 02fc3cbd gate #37956405216 FAILURE only frontend. The SG29 /solve out-of-order test sought `SG29_SOLVE_NEW` (result_text) while ResultPanel prefers result_latex `4`, so no matching visible text; backend SUCCESS, H1d #37956405211 SUCCESS. No actual stale-answer evidence from this selector failure.
- Plus correction commit ced6b8fe239cff3f550090e54760b640f452323f sets `result_latex: null` in the two mocked /solve responses, causing ResultPanel to display the sentinel result_text and let UI out-of-order invariant be tested directly. Fresh cumulative #37957224974 and H1d #37957224935 initially QUEUED. Await PASS before claiming validation.
- Last prior fully green Plus technical gate #37955774771 with 562 backend PASS/69 frontend files. Lite remains at #37930251112. H2 remains OPEN and SG29 only partially covered.

## 2026-10-09 — SG29 /solve test: duplicate visible sentinel corrected
- Plus SHA ced6b8fe gate #37957224974 FAILURE in frontend; backend SUCCESS and H1d #37957224935 SUCCESS. ResultPanel renders `SG29_SOLVE_NEW` in several locations; test incorrectly used getByText (unique-match assertion), not a functional regression.
- Plus SHA d2a056665121422bd4a47370e864e5bb1b93ba4c switches this assertion to getAllByText for SG29 /solve latest-response test. Await cumulative and H1d confirmation; SG29 remains partial and H2 OPEN.

## 2026-10-09 — SG29 /solve comprobado y /inequality en CI
- Plus SHA d2a05666 gate #37959015869 SUCCESS: backend 562 PASS, frontend 69 archivos PASS; H1d #37959015319 SUCCESS. Prueba `/solve` con respuestas fuera de orden aprobada.
- Plus commit 9bbf14989128fc6d9fcaafea46749a2c784372dc incorpora prueba de resultados fuera de orden de `/inequality` en BasicMode. Sin PASS hasta verificar gate del nuevo commit. SG29 parcial; H2 abierto.

## 2026-10-09 — SG29 inequality gate green; derivative UI regression introduced
- Plus commit 9bbf1498 gate #37959669282 SUCCESS; H1d #37959669389 SUCCESS. Out-of-order /inequality UI regression passed.
- Plus commit d3a445013a0b4ef30311d22d548fc8f402ac31e3 introduces BasicMode SG29 derivative concurrency test: two derivative submissions, resolve newer first, expect stale response ignored. CI result pending; do not assert PASS. SG29 remains partial; H2 open.

## 2026-10-09 — SG29: nueva regresión de integrales fuera de orden (pendiente CI)
- Se verificó que ambos repositorios conservan el puntero de `main` a `qa/syntax-audit-in625-a1`.
- Plus commit técnico `f2fd668ba102f3a587c1d20988e631b975be363c`: nueva prueba unitaria en `frontend/src/__tests__/BasicMode.test.tsx` para dos solicitudes `/integral` resueltas en orden inverso. Contrato: la respuesta antigua no debe sobrescribir la nueva.
- La prueba fue publicada y su presencia verificada en la rama canónica Plus; **no se comprobó todavía el resultado de Actions del nuevo commit**, por lo que no se registra PASS.
- El workflow acumulativo Plus contiene `push` sobre rama canónica para cambios técnicos, así que este commit cumple su filtro. Verificar ejecución real, run ID, SHA y jobs/logs antes de clasificar.
- No se modificaron motor ni API; Lite no necesita la misma prueba de `/integral` backend Plus, pero la cobertura equivalente en su UI queda por evaluar. H2 permanece ABIERTO; SG29 PARCIAL. La prueba previa de derivadas Plus en SHA `d3a445013a0b4ef30311d22d548fc8f402ac31e3` también sigue sin nueva conclusión CI confirmada.
- Próximo paso: comprobar gate del SHA `f2fd668ba`, diagnosticar rojo si aparece, continuar SG29 en otros flujos y luego EN-SG-28 cancelación / casos DOM aislados.

## 2026-10-09 — SG29 /integral: oráculo de payload reforzado; CI pendiente
- Plus: test SG29 de integrales de respuesta fuera de orden publicado en commit `f2fd668ba102f3a587c1d20988e631b975be363c`.
- Plus: commit `360e233eef2e166cd2fd7d7626ea7f485842da6b` añade aserciones de payload distintas: `/integral` debe recibir `x^2`, variable `x`, límites `0..1` y `0..2` en sus respectivos envíos; no basta comprobar el nombre de endpoint.
- La herramienta de consultas de corridas disponibles solo devuelve runs de PR asociados al SHA, no todos los eventos `push`; el status combinado tampoco es prueba del gate Actions. El acceso web a la página Actions no permitió verificación. **Ningún PASS de estos commits puede acreditarse en esta sesión**.
- No se modificó código de producto ni seguridad; cambios limitados a tests de Plus. Lite no se modificó técnicamente. H2 abierto y SG29 parcial.
- Siguiente paso: revisar por ID/URL la corrida `IN625 Cumulative Certification Gate` del SHA `360e233eef2e166cd2fd7d7626ea7f485842da6b` y el H1d vinculado, clasificar errores, y después continuar cobertura de UI/cancelación/DOM aislado. Si el workflow falló, corregir según logs; no declarar certificación hasta confirmación.

## 2026-10-09 — SG29: argumentos de derivadas verificados por nuevo oráculo (sin PASS CI)
- Plus commit técnico `8b9b2db253fb935f5baf9b2a655cddb28c179479` en `frontend/src/__tests__/BasicMode.test.tsx`: el test de dos derivadas fuera de orden verifica ahora payloads concretos: `/derivative` con `expression=x^2` y `expression=x^3`, `variable=x`, `order=1`.
- Continúa el test SG29 de integrales de la revisión anterior (commit `360e233eef2e166cd2fd7d7626ea7f485842da6b`); ambos cubren última respuesta gana.
- Se confirmó mediante lectura GitHub que el archivo de test existe en la rama canónica. Las consultas disponibles no han acreditado aún runs ni logs para estos SHA. NO se registra PASS, ni se cierra SG29 o H2.
- Cambio limitado a oráculo de prueba en Plus, sin modificación del motor. Pendiente inspeccionar resultado real del gate y regresiones de seguridad de la interfaz en un entorno aislado.

## 2026-10-09 — SG29 regresión entre operaciones diferentes, pendiente CI
- Plus commit técnico `acf0a28da09bb8c50314594076bb65cadfd2e4ca` agrega en `frontend/src/__tests__/BasicMode.test.tsx` una prueba donde una derivada previa responde después de una integral nueva. Se exige conservar solo la integral reciente.
- Se verificó que el spec está publicado en GitHub; no se modificó el código de producto. El resultado del gate acumulativo correspondiente al SHA sigue **sin verificar** por ausencia de listados completos de corridas push en el conector disponible; no registrar PASS.
- SG29 y H2 permanecen abiertos/parciales. Próximo paso: comprobar jobs/logs del gate del SHA técnico, diagnosticar eventuales rojos, continuar SG28 recuperación/cancelación y seguridad DOM en pruebas aisladas.

## 2026-10-09 — H2 SG29: error obsoleto entre operaciones (sin CI confirmado)
- Plus commit `c9c8a9ffa13d1dcef157b2428b5933ff7ee97bd6` agrega prueba a `frontend/src/__tests__/BasicMode.test.tsx`: una derivada antigua devuelve error después de que una integral más reciente tuvo éxito. Se exige conservar el resultado nuevo y descartar el mensaje del error antiguo.
- Contrato de regresión extendido desde éxito obsoleto (commit `acf0a28d`) hacia error obsoleto cruzando endpoints de cálculo. Solo se modificó el test; ningún motor alterado.
- La página GitHub Actions no es recuperable desde web en este entorno y el conector GitHub no dispone de listado completo de corridas `push`. Sin log del gate del SHA actual NO hay PASS confirmado; H2 y SG29 siguen abiertos.
- Próximo paso: localizar gate cumulative + H1d por SHA y confirmar jobs/logs; corregir rojos; continuar EN-SG-28 (cancelación/recuperación) y validación DOM aislada.

## 2026-10-09 — SG29: estado de carga de solicitud vigente (CI pendiente)
- Plus commit `b3da038dcc3b3d86f6065bc754ada083bd6a1954` en `frontend/src/__tests__/BasicMode.test.tsx` incorpora regresión para evitar que una respuesta anterior desactive `isLoading` mientras la segunda evaluación sigue pendiente.
- El test comprueba dos solicitudes `/evaluate`, resolución primero de la antigua y después de la reciente, con `isLoading=true` hasta terminar la reciente y `false` después. Sin cambios en el producto.
- No se conoce aún run ID ni conclusión del gate del SHA; NO acreditar PASS ni cierre de SG29/H2. Verificar GitHub Actions y logs antes de corregir o avanzar hacia cierre. A continuación: revisar rutas asíncronas sin guarda, EN-SG-28 y DOM en aislamiento.

## 2026-10-09 — H2 SG29: guard de resultados matriciales tardíos en Plus
- Inspección de `frontend/src/components/BasicMode.tsx` mostró una ruta matricial asíncrona sin verificación `latestSubmissionRef` antes de actualizar resultado y sin protección del `setLoading(false)` en `finally`.
- Plus commit técnico `da74098aaf2458591c21fa36cd730a3d72e1a1cc` añade comprobación de `submissionId` antes de presentar respuestas matriciales y evita que una solicitud obsoleta apague el estado de carga de otra reciente.
- Corregida la rama matricial específica; **no se han comprobado todavía todas las rutas ni se ha ejecutado/verificado el gate del nuevo commit**. Esta corrección no acredita PASS. H2/SG29 siguen abiertos. Pendiente añadir regresión matricial automatizada y confirmar gate acumulativo, después SG28 y DOM aislado.

## 2026-10-09 — H2 SG29 regresión matricial pendiente de CI
- Plus commit técnico `162252af93a6a60eb016bfd411ae44f73891984e`: nueva prueba en `frontend/src/__tests__/BasicMode.test.tsx` comprueba determinante `/matrix/determinant` seguido de `/evaluate` con respuesta nueva primero y respuesta matricial obsoleta después. Se validan payloads y ausencia de sobrescritura visible.
- Cubre la corrección matricial Plus `da74098aaf2458591c21fa36cd730a3d72e1a1cc`; no se modificó el motor en este cambio.
- Test publicado, pero ejecución/resultado de CI del SHA técnico aún NO confirmado. No registrar PASS; H2/SG29 abiertos.
- Próximo paso: verificar gate acumulativo e H1d en GitHub Actions, corregir fallos comprobados y después continuar EN-SG-28 / DOM aislado.

## 2026-10-09 — H2 SG29: matriz obsoleta con error y loading pendiente de CI
- Plus commit técnico `cbd3f2b3cdda8e838b6a2a3c6c6704e166b7de29` incorpora regresión en `frontend/src/__tests__/BasicMode.test.tsx`: determinante antiguo falla mientras una evaluación posterior sigue pendiente; el error obsoleto no debe mostrarse ni apagar `isLoading`, y el resultado reciente se conserva.
- Complementa la prueba de resultado matricial obsoleto `162252af93a6a60eb016bfd411ae44f73891984e` y la protección de producto `da74098aaf2458591c21fa36cd730a3d72e1a1cc`.
- El conector de runs por SHA solo busca ejecuciones PR y devolvió cero para el commit previo; esto NO prueba ausencia de una corrida `push`. No se verificó run ID, logs ni PASS de los nuevos commits. SG29/H2 siguen ABIERTOS.
- Próximo paso obligatorio: recuperar logs reales del gate acumulativo Plus y H1d para el último SHA, corregir posibles fallos y continuar SG28/DOM aislado. No declarar certificación por publicación de test.

## 2026-10-09 — SG28: auditoría de cancelación y recuperación (sin PASS)
- Inspección directa en Plus, rama canónica: `frontend/src/api/client.ts` utiliza `AbortController` y timeout de solicitud para cortar peticiones vencidas, devolviendo respuesta de error controlada.
- `frontend/src/components/CalculatorScreen.tsx` se inspeccionó por interfaces de carga/envío; no se identificó control de cancelación manual allí. Esta búsqueda acotada **no demuestra ausencia en todo el producto**. No declarar EN-SG-28 como PASS ni como fallo definitivo.
- SG29 técnico más reciente Plus: `cbd3f2b3cdda8e838b6a2a3c6c6704e166b7de29`, tests matriciales. `get_commit_combined_status` y `fetch_commit_workflow_runs` retornaron arreglos vacíos; la segunda consulta solamente abarca eventos PR. No son evidencia de ausencia de corridas `push`. Web pública de Actions no accesible y red directa hacia `api.github.com` no disponible en el entorno.
- Bloqueo de certificación: sin run IDs/logs actuales, no acreditar PASS de SG29, ni cerrar H2. Prioridad de la próxima sesión: obtener historial completo Actions mediante acceso autorizado; verificar gate acumulativo y H1d; después ampliar SG28 en entorno local/CI aislado, incluyendo recuperación y cancelación manual si existe contrato de UI.

## 2026-10-09 — H2 SG28: recuperación tras AbortError, test publicado pendiente CI
- Plus commit técnico `af2c199083204d63118b34dca68c4f8d5fafaac7` modifica `frontend/src/__tests__/client.test.ts`: primera petición `/evaluate` emite `AbortError` simulado, segunda evalúa `6*7` con respuesta correcta `42`; verifica dos señales `AbortSignal` independientes y ausencia de contaminación entre solicitudes.
- El test cubre **recuperación ante cancelación simulada en capa cliente**, no tiempo transcurrido real, parada efectiva de un proceso backend ni control de cancelación manual en UI. No atribuir más cobertura de la que demuestra.
- SG28 sigue PARCIAL, sin PASS hasta ejecutar gate del SHA y verificar logs. SG29 continúa pendiente de validaciones de CI. No se cambió código de producto ni se ejecutaron cargas extremas.
- Próximo paso: confirmar gate acumulativo en Plus y H1d, corregir fallos si los hay, probar timeout real con timers controlados y comprobar si existe contrato UI de cancelación manual.

## 2026-10-09 — H2 SG28: timeout controlado y recuperación, test pendiente CI
- Plus commit técnico `6e26283313c16ce7d4fe567b5b7c773f7af46b52` modifica `frontend/src/__tests__/client.test.ts`: fake timers de Vitest avanzan 15 000 ms, el fetch simulado pendiente escucha AbortSignal, comprueba cancelación y error MathResponse, y a continuación se valida una nueva evaluación `6*7 = 42`.
- Test aislado: no ejecuta cálculos pesados ni llama producción. Comprueba aborto real del controlador en un fetch simulado, no detención del cálculo backend ni cancelación manual en UI.
- Ningún PASS del commit está certificado hasta verificar gate acumulativo y logs. H2/SG28 siguen abiertos. Próximo paso: comprobar CI de `6e262833` y regresiones SG29; corregir según evidencia, luego cubrir cancelación manual si el contrato la exige y está implementada.

## 2026-10-09 — H2 SG28: limpieza de temporizador tras éxito (CI pendiente)
- Plus commit técnico `04d0bd1a6c9ab01f9027f56afc653caadb3ee460` incorpora test en `frontend/src/__tests__/client.test.ts`: solicitud `/evaluate` completada, señal no abortada; avanzar timers simulados otros 30 s no debe provocar `abort` tardío.
- La prueba complementa timeout controlado y recuperación SG28. No prueba cancelación manual ni detención de backend. Cambio solo en tests.
- Gate acumulativo para `04d0bd1a` **no verificado**, sin PASS acreditado. Consulta limitada a PR para `6e262833` devolvió cero, no permite inferir estado de corridas `push`. H2/SG28 siguen abiertos. Próximo: verificar logs Actions y corregir fallos comprobados.

## 2026-10-09 — H2 SG28: prueba de frontera inferior de timeout (CI pendiente)
- Plus commit técnico `0441c1512491def3bbe575e40cfc58679538f0a8` añade en `frontend/src/__tests__/client.test.ts` un test con fake timers a 14 999 ms, que exige `AbortSignal.aborted=false` y procesa respuesta antes del umbral de 15 s. Tras finalizar, verifica limpieza del temporizador.
- Se comprobó la publicación del archivo en la rama canónica mediante GitHub. Conector de corridas por SHA limitado a PR devolvió 0 para commit anterior `04d0bd1a`; no permite inferir estado de corridas push. Ningún PASS nuevo acreditado; SG28/H2 siguen abiertos.
- Próximo: obtener run ID y logs de gate acumulativo Plus, validar nuevos tests y corregir rojos reales antes de certificar.

## 2026-10-09 — H2 SG28: señales independientes en solicitudes paralelas (CI pendiente)
- Plus commit técnico `f75e897fbe3bc4cd459cc401046eeb1455b68903` en `frontend/src/__tests__/client.test.ts`: nueva regresión de dos solicitudes paralelas `/evaluate` y comprobación de `AbortSignal` distintos.
- La escritura previamente bloqueada pudo realizarse en esta sesión. La prueba cubre aislamiento de controladores cliente, no cancelación manual ni backend.
- Consulta de corridas por SHA previa `0441c151` devolvió cero ejecuciones PR, que NO representa el listado de runs `push`; no hay PASS confirmado para último commit. H2/SG28 permanecen ABIERTOS.
- Próximo paso: comprobar gate acumulativo/H1d y sus logs, corregir rojos reales; extender caso de independencia con temporizadores simulados si CI está verde.

## 2026-10-09 — H2 SG28: timeout de solicitudes superpuestas (CI pendiente)
- Plus commit técnico `e017d337a12d38e4de97762ecd8ad99734f1aa1d` agrega test aislado en `frontend/src/__tests__/client.test.ts`: petición antigua comienza, nueva comienza 5 s más tarde; tras 15 s desde la primera, solo la antigua debe expirar, la nueva sigue activa y termina correctamente. Temporizadores simulados, sin tráfico de producción.
- La prueba complementa señales de cancelación independientes de `f75e897f` y casos anteriores de timeout/recuperación. No prueba cancelación manual ni terminación del backend.
- No se recuperaron run ID ni logs del gate acumulativo de esta revisión. Consulta por SHA solo abarca PR y devolvió 0 para `f75e897f`; no implica ausencia de runs `push`. Ningún PASS nuevo registrado; SG28 y H2 siguen abiertos.
- Próximo: verificar CI del SHA técnico, diagnosticar rojos y decidir si se requiere implementación/cobertura manual SG28 según contrato.

## 2026-10-09 — H2 SG28: fallo de red y limpieza de temporizador (CI pendiente)
- Plus commit técnico `d4cd6e63bfe8aa3084fe31531b766a22ce02726c` agrega a `frontend/src/__tests__/client.test.ts` regresión aislada: fallo de red `/evaluate`, error sintético controlado, señal sin abortar y 30 s de reloj simulado sin aborto tardío.
- Se comprobó código cliente `callApi` con `clearTimeout` al manejar errores; la prueba cubre esta ruta específica. No hay cambio de producto, tráfico de producción ni carga peligrosa.
- No se pudieron comprobar runs `push` del último commit: status combinado vacío y runs por SHA limitados a PR; consulta pública API GitHub no accesible. Ningún PASS nuevo. SG28 y H2 siguen ABIERTOS.
- Próximo paso: obtener run ID y logs del gate acumulativo Plus y H1d, corregir errores confirmados, cerrar pendientes SG28 según criterios de matriz; revisar pendiente de cancelación manual.

## 2026-10-09 — H2 SG28: ruta no-JSON y limpieza de temporizador (CI pendiente)
- Plus commit técnico `cfc49dfa465a19d98ce7e450fd41a8d7536099b0` agrega en `frontend/src/__tests__/client.test.ts` regresión de respuesta no-JSON: error sintético controlado, temporizador limpiado y señal sin aborto después de 30 s simulados.
- Prueba aislada de cliente sin llamadas a producción; no implementa cancelación manual ni modifica motor.
- Consulta por SHA anterior `d4cd6e63` recuperó cero corridas PR, no representa runs push; resultado de gate para commit nuevo sin confirmar. No acreditar PASS. SG28/SG29/H2 siguen abiertos.
- Siguiente paso: obtener listado completo de Actions para rama de certificación, inspeccionar run ID y logs, corregir rojos confirmados y verificar contratos SG28 pendientes.

## 2026-10-09 — H2 SG28: respuesta JSON con esquema inválido, sin aborto tardío (CI pendiente)
- Plus commit técnico `042c5d69a218c14fc222af9ea83d134ec553db1c` añade prueba en `frontend/src/__tests__/client.test.ts`: JSON bien formado pero no válido para MathResponse; se exige error controlado y ausencia de aborto tardío tras 30 s simulados.
- Cambio únicamente de pruebas; no se alteró motor, backend ni interfaz. Cubre camino distinto al caso no-JSON `cfc49dfa`.
- API pública GitHub Actions para el repositorio/branch no accesible desde la herramienta web, y el conector por SHA no lista ejecuciones push. CI no confirmado: NO acreditar PASS. H2/SG28 siguen abiertos.
- Prioridad: obtener run ID/logs del gate acumulativo/H1d para el último SHA y corregir fallos; revisar si queda pendiente cancelación manual contractual.

## 2026-10-09 — H2 SG28: timeout cubre lectura del cuerpo HTTP (CI pendiente)
- Hallazgo funcional Plus: `frontend/src/api/client.ts` limpiaba el temporizador después de `fetch()` pero **antes** de `response.json()`, dejando fuera del límite de 15 s la lectura del cuerpo. Se corrigió con commit `3886e9be3bf84c83fc6b1af25760593729487cb9`: procesamiento de respuesta dentro del try protegido por controlador y limpieza del temporizador en un `finally` exterior; errores por aborto durante JSON se traducen a timeout controlado.
- Commit Plus `2df6867ed2be4db066b93de490a59958b16bb8e8` incorpora regresión con temporizadores simulados y cuerpo JSON pendiente que rechaza al abortar la señal.
- Código y prueba publicados; resultado real de CI **no verificado**, sin PASS acreditado. SG28/H2 siguen abiertos. Revisar posible timeout de lectura y otras rutas, ejecutar gate acumulativo y H1d antes de concluir.

## 2026-10-09 — H2 SG28: cuerpo JSON termina a 14 999 ms, CI pendiente
- Plus commit técnico `dde284c26ffe60c0fea39b07bd3e168b00bf44b9` agrega test en `frontend/src/__tests__/client.test.ts`: respuesta `fetch` obtenida, lectura del cuerpo JSON terminada a 14 999 ms; se exige resultado válido y temporizador sin aborto tardío después de alcanzar 15 000 ms.
- Complementa corrección `3886e9be3bf84c83fc6b1af25760593729487cb9` y test de cuerpo bloqueado `2df6867ed2be4db066b93de490a59958b16bb8e8`. No se modifica producto en este commit.
- Consultas de estado y runs PR para `2df6867e` devolvieron listas vacías: no contienen verificación de ejecuciones `push`. No acreditar PASS; H2/SG28 continúan ABIERTOS. Prioridad: recuperar IDs/logs del gate acumulativo y corregir fallos confirmados.

## 2026-10-09 — H2 SG28: rechazo de cuerpo JSON tardío tras timeout (CI pendiente)
- Hallazgo: después de `response.json()`, un adaptador fetch no cooperativo puede resolver su promesa aunque el `AbortSignal` ya haya vencido; el cliente aceptaba entonces una respuesta tardía.
- Plus commit `0890180ba2a9dcb7d7f8e1a10866380828e3f6cb` añade guardia explícita `controller.signal.aborted` antes de validar/aceptar el cuerpo como MathResponse.
- Plus commit `76d8ed9953277e2abe4b51332a91a88d7401f746` incluye prueba con fake timers 15 s y `response.json` no cooperativo que termina después: resultado debe ser error de timeout, nunca éxito.
- Publicado en rama canónica, NO se ha verificado gate CI ni H1d asociado; no registrar PASS. SG28/H2 abiertos; SG29 sigue pendiente CI. Próximo paso: recuperar logs reales de Actions, ejecutar/corregir validaciones; revisar cancelación manual y restantes requisitos H2.

## 2026-10-09 — H2 SG28: respuesta fetch tardía tras timeout, CI pendiente
- Plus commit técnico `b1f9a75fb6af59ba4cff03c66200a73a441977ee` agrega test en `frontend/src/__tests__/client.test.ts`: adaptador fetch no cooperativo entrega cabeceras después de 15 s; resultado válido tardío debe descartarse como error timeout.
- Complementa protección `0890180ba2a9dcb7d7f8e1a10866380828e3f6cb` y caso JSON tardío `76d8ed9953277e2abe4b51332a91a88d7401f746`. No hubo cambio de código producto en este commit.
- El conector GitHub solo lista corridas PR por SHA (devolvió ninguna para la revisión anterior); status combinado vacío no acredita estado de workflows push. No se verificó CI del nuevo commit y no hay PASS nuevo. H2/SG28 siguen abiertos.
- Siguiente prioridad: obtener gate acumulativo y logs por run ID antes de certificar, corregir fallos confirmados y completar requisitos restantes de SG28.

## 2026-10-09 — H2 SG28: conciliación con el criterio original de detener y recuperar
- Se verificó la fuente canónica `qa/certification/IN625_H2_MATRIX.md`: EN-SG-28 exige «Detener durante cálculo largo, recuperación»; las pruebas de timeout HTTP no demuestran por sí solas detención efectiva del backend o worker ni cancelación manual UI.
- Se añadieron pendientes explícitos de capability/evidencia en `qa/certification/MANUAL_CAPABILITY_GAPS.md` de Lite y Plus, commits Lite `8fcbb187d53e5eed9911f2752bfce680b20e7ff8` y Plus `04df6220fdceb923165035e83405e053274fbc2a`.
- Consultas de GitHub Actions web/API para rama Plus siguen inaccesibles. No se obtuvieron logs ni PASS para SG28/29. H2 permanece ABIERTO.
- Próximo paso: verificar CI de últimos commits y auditar flujo de stop real en UI/worker de cada motor bajo entorno aislado antes de clasificar EN-SG-28.

## 2026-10-09 — SG28: auditoría diferenciada Lite worker / Plus HTTP
- Lite `src/hooks/useComputeWorker.ts` verificado directamente: `cancelWorker()` ejecuta `workerRef.current.terminate()` y asigna null; `getWorker()` crea un worker nuevo al requerirse y `useEffect` ejecuta cancelWorker al desmontar el componente. Es evidencia de **capacidad técnica de interrupción mediante fin del worker**, no evidencia de botón Detener en UI ni recuperación E2E aprobada.
- Lite `src/workers/compute.worker.ts` aloja cálculo simbólico en web worker. Se requiere test seguro de integración que compruebe cancelación en mitad de cómputo, ausencia de mensaje obsoleto y cálculo posterior en nuevo worker.
- Plus `frontend/src/api/client.ts` aplica AbortController a petición HTTP, pero no demuestra interrupción del backend. `CalculatorScreen.tsx` no muestra control Detener en los fragmentos auditados.
- Clasificación EN-SG-28: Lite PARCIAL (mecanismo worker comprobado, flujo completo pendiente); Plus PARCIAL (timeout HTTP comprobado en fuente, parada efectiva backend/UI pendiente). SG28 sigue NO CERTIFICADO; IN625 H2 ABIERTO.
- Acceso actual al conector GitHub no ofrece listado exhaustivo de runs push; CI pendiente de evidencia real. Próximo paso: confirmar gate y crear prueba de lifecycle Lite en entorno de test aislado.

## 2026-10-09 — SG28 Lite: test de cancelación y recreación de worker publicado, CI pendiente
- Lite commit técnico `0c3f4ce692a37863601d5d8052d23bc84aef3322` crea `tests/useComputeWorker.test.ts` (ruta incluida por Vitest `tests/**/*.test.ts`), con Worker simulado y mocks de hooks React.
- Valida la reutilización del worker mientras está activo, llamada a terminate() al cancelar, creación de instancia nueva, idempotencia de cancelar y cleanup al desmontar el hook.
- Alcance limitado a prueba unitaria del ciclo de vida, NO comprueba parada en mitad de cálculo real, resultados obsoletos o UI completa. Sin PASS CI verificable, SG28/IN625 H2 siguen ABIERTOS.
- Próximo paso: comprobar gate de Lite para SHA técnico, corregir errores de test/harness si los hay, después Playwright/worker integrado en entorno aislado; Plus SG28 pendiente de detención real backend.

## 2026-10-09 — SG28 Lite: cancelación previa a inicialización del worker (pendiente CI)
- Lite commit técnico `f626e7c9c057803a5441d0520f6aa070cb5cd1e1` amplía `tests/useComputeWorker.test.ts`: llamar `cancelWorker()` antes de `getWorker()` no debe crear ni terminar instancias, y posteriormente `getWorker()` debe construir el worker. Simplifica la limpieza de stub Worker entre tests.
- Prueba aislada de lifecycle; no equivale a interrupción real de cálculo ni recuperación E2E. El conector de corridas por commit solo devuelve PR y no encontró run para SHA anterior; esto no informa del gate push. Sin PASS CI acreditado.
- H2/SG28 abiertos; siguiente paso verificar gate Lite del SHA técnico y ejecutar integración worker de cálculo controlado; Plus sigue pendiente de verificación de backend y CI.

## 2026-10-09 — SG28 Lite: test de inicialización diferida de worker, pendiente CI
- Lite commit técnico `d546dc0065f07949de01b73d6358c1f1c05b540c` amplía `tests/useComputeWorker.test.ts` con prueba de que el worker no se instancia hasta `getWorker()` y se reutiliza entre consultas mientras siga activo.
- Se verificó `vite.config.ts` con `include: tests/**/*.test.ts`, y el workflow acumulativo Lite con npm ci, typecheck, npm test y build en push de la rama canónica para cambios técnicos.
- Alcance: prueba unitaria con Worker simulado; todavía no demuestra interrupción de cálculo real ni recuperación E2E. No se verificó run/log para nuevo SHA: SG28/H2 siguen abiertos.
- Próxima prioridad: obtener run ID y logs del gate Lite; corregir rojos antes de ampliar test del worker integrado, y continuar diferencia de cancelación backend Plus.

## 2026-10-09 — SG28 Lite: corregir semántica del test de desmontaje y remontaje
- Lite commit `a1b95134125ac64c48e11b49c8640559aadf4f53` cambia `tests/useComputeWorker.test.ts`: el test previo invocaba `getWorker()` de un hook ya desmontado, una simulación artificial. La prueba actual verifica `terminate()`, referencia null, nuevo montaje del hook y worker distinto. Solo harness; sin cambios en motor.
- Gate acumulativo Lite está configurado para dispararse con commits técnicos; intentos de recuperar corridas push mediante conector de GitHub, web y red del contenedor no permitieron acceder a los logs. NO acreditar PASS. EN-SG-28 y H2 siguen ABIERTOS. Prioridad: resultados del gate y prueba segura con worker real.

## 2026-10-09 — SG28 Lite: referencias independientes entre montajes simulados (CI pendiente)
- Lite commit `c88d6cbbdc7b918099ce99bbc6c3871c945f4fe1` corrige `tests/useComputeWorker.test.ts`: mock de `useRef` crea una referencia por cada montaje simulado en vez de compartirla globalmente; se comprueba que el nuevo montaje tenga una referencia distinta. Cambio exclusivamente de harness.
- No es prueba de ejecución de cálculo real ni de recuperación E2E. Conector GitHub no mostró corridas por SHA previo porque la búsqueda visible no incluye pushes; no atribuir PASS. IN625 H2 / EN-SG-28 abiertos.

## 2026-10-09 — H2 SG28 Lite: fallo de sintaxis confirmado en harness y corregido
- Auditoría directa de `tests/useComputeWorker.test.ts` encontró secuencia literal `\\n` incrustada entre dos instrucciones TypeScript dentro del test de desmontaje/remontaje, introducida por un parche anterior. Fallo real de fuente con riesgo de impedir el parseo de Vitest.
- Lite commit técnico `3eafd245c2ca8f891cfb9436a4671570dbc591a2` reemplaza esa secuencia por un salto de línea auténtico. Corrección solo del test; motor sin cambios.
- La comprobación fue mediante lectura del archivo en GitHub, NO mediante ejecución exitosa de CI. Última consulta de runs por commit previo devolvió lista vacía (no visibilidad de push). EN-SG-28 y H2 siguen abiertos; no declarar PASS.
- Priorizar obtención de run/log y correcciones basadas en evidencia antes de añadir pruebas.

## 2026-10-09 — Evidencia visual Actions Lite gate #29 verde
- Captura del usuario de GitHub Actions, workflow `IN625 Cumulative Certification Gate` en `c2melendez/precision-lab-lite`, rama `qa/syntax-audit-in625-a1`, acredita: corrida #29 commit `3eafd245` con indicador VERDE (45 s); #28 commit `c88d6cbb` ROJO (23 s); #27 `a1b95134` VERDE (44 s); #26 `d546dc00` VERDE (32 s); #25 `f626e7c9` VERDE (47 s); #24 `0c3f4ce` VERDE (42 s).
- Decisión: gate acumulativo Lite del commit `3eafd245` aprobado según evidencia visual. La falla de #28 fue seguida por corrección sintáctica y gate verde #29. Causa precisa del rojo #28 no demostrada sin logs; no atribuirla definitivamente.
- Límite: captura no aporta run ID numérico de GitHub ni logs de jobs, y la API/web aquí no permitió recuperarlos. Gate aprobado por evidencia visible, no afirmar trazas internas analizadas.
- EN-SG-28 sigue PARCIAL/ABIERTO: pruebas unitarias de lifecycle bajo gate verde, pero cancelación de trabajo real y recuperación UI/E2E faltantes. IN625 H2 permanece ABIERTO. Plus no tiene nueva evidencia CI en esta captura.

## 2026-10-09 — Evidencia CI directa Lite, workflow run 37989574886
- Fuente: https://github.com/c2melendez/precision-lab-lite/actions/runs/37989574886; GitHub API verificó run `#29`, workflow `IN625 Cumulative Certification Gate`, rama `qa/syntax-audit-in625-a1`, SHA técnico `3eafd245c2ca8f891cfb9436a4671570dbc591a2`, estado completed y conclusión success.
- Job cumulative ID `114020006884`: pasos Install dependencies, Typecheck, Unit and parity regression y Production build finalizaron success; logs recuperados directamente.
- Vitest: **85 archivos aprobados**, **1036 tests PASS**, **30 TODO** (1066 reportados). Compilación producción Vite completada en 6.63 s. Los 30 TODO no son PASS.
- Decisión: GATE ACUMULATIVO LITE #29 PASS con evidencia CI auditable. La regresión SG28 del lifecycle del worker forma parte de esta corrida, pero EN-SG-28 completo NO CERTIFICADO: persisten integración con worker real, cancelación durante cálculo y recuperación E2E. H2 sigue ABIERTO. No extrapolar esta corrida a Plus ni a los commits documentales posteriores.

## 2026-10-09 — SG28 Lite: control Detener cálculo en módulo Cálculo (CI pendiente)
- Lite commit `777ddb8bc3a1063855987d454377b0e6eadfde5a` conecta `cancelWorker()` al módulo `src/modes/Calculus/CalculusMode.tsx`, muestra botón «Detener cálculo» durante cómputo, termina worker previo antes de nueva solicitud, y valida ID de respuesta para descartar mensajes atrasados.
- Lite commit `019317e9b5da46616700114922ed9f44082a7d08` limpia worker y estado loading para los errores de orden de derivada, punto de límite o cotas de integral.
- Gate Lite #29 de SHA `3eafd245` **PASS anterior**, no prueba estos cambios. Nuevos cambios de UI NO verificados por CI/E2E. Sigue faltando validar carga real controlada, cancelación visible, cálculo posterior y regresión. SG28/H2 ABIERTOS.

## 2026-10-09 — SG28 Lite: recuperación explícita tras error del worker (CI pendiente)
- Lite commit técnico `42484852c982c948589b8108289cd994647aad0d` añade manejo `worker.onerror` en `src/modes/Calculus/CalculusMode.tsx`. Si el error corresponde a la solicitud activa, termina y reinicia la referencia al worker, quita loading y muestra un mensaje recuperable.
- Complementa botón Detener cálculo `777ddb8bc3a1063855987d454377b0e6eadfde5a` y corrección de validación `019317e9b5da46616700114922ed9f44082a7d08`.
- Gate Lite #29 (run 37989574886, 1036 PASS/30 TODO) es anterior a estas modificaciones. Sin evidencia CI/E2E de los nuevos commits. H2/SG28 siguen ABIERTOS; prioridad gate nuevo e integración real segura.

## 2026-10-09 — SG28 Lite: tres gates CI PASS para commit 42484852
- Evidencia directa vía GitHub Check Runs para commit técnico `42484852c982c948589b8108289cd994647aad0d` de Lite: cumulative SUCCESS (job 114027855199, run https://github.com/c2melendez/precision-lab-lite/actions/runs/37991876628), build-diagnostic SUCCESS (job 114027855105, run 37991876636), h1d SUCCESS (job 114027854405, run 37991876565).
- Log del job cumulative descargado: Vitest 85 archivos PASS, 1036 tests PASS, 30 TODO (no aprobados); build Vite 7.20 segundos y Typecheck completo por conclusión SUCCESS del job.
- Estos gates validan automáticamente cambios recientes de módulo Cálculo: botón Detener, limpieza ante parámetros incorrectos y `worker.onerror`, pero NO prueban interrupción real mediante E2E. SG28/H2 siguen abiertos hasta prueba integrada y recuperación efectiva.
- No extrapolar este gate Lite al backend o frontend de Plus.


## 2026-10-09 — SG28 auditoría de accesibilidad funcional (sesión de continuidad)
- Lectura directa: `main/qa/certification/README.md` coincide en Lite/Plus (`qa/syntax-audit-in625-a1`); rama existente y documentos de ejecución legibles en ambos.
- Hallazgo trazable SG28: `CalculusMode.tsx` tiene cancelación worker, pero `src/App.tsx` excluye `calculus` de `VISIBLE_MODES`. `BasicScientificMode.tsx`, interfaz visible y router de cálculo, usa `getWorker` sin `cancelWorker`. Un gate unitario exitoso en un componente no navegable no satisface el criterio UX SG28. Clasificación PRODUCT/CAPABILITY, pendiente de reproducción E2E real; no cambiar motor por especulación.
- Plus solo demuestra aborto de solicitud desde el cliente con timeout; terminación del cómputo backend no demostrada.
- Jobs Lite consultados directamente: 37991876628 cumulative SUCCESS; 37991876636 build SUCCESS; 37991876565 H1d SUCCESS. No se ejecutó una nueva prueba ni se creó un run SG28; no se declara PASS de H2.
- Prioridad: prueba reproducible sobre Científica visible y corrección dirigida al mecanismo de cancelación de su worker, más prueba de recuperación; posteriormente revisar interrupción real Plus bajo aislamiento.


## 2026-10-09 — SG28 Lite: cancelación desde Científica visible integrada (CI pendiente)
- Producto Lite modificado en `src/modes/BasicScientific/BasicScientificMode.tsx`: cancela worker previo al iniciar Calcular; botón de detener en Científica, despacho con request ID y rechazo de respuestas tardías, captura errores. Se conservan 17 rutas de despacho hacia el motor, ahora unificadas mediante `dispatchWorker`.
- Commits Lite: `b836e016a354cfcff054edfd09e356774ee00f46`, `31ce6b502730043e9d3266dee735c74c1cf9d363` (orden de declaraciones). Inspección posterior confirmó el control y la envoltura. NO hubo CI/E2E confirmado sobre esos commits; 0 runs PR asociados no significa 0 push runs.
- Plus sin cambios funcionales; estado SG28 es abierto bilateral. Próximo paso: gate Lite y E2E reproducible de cancelación/recuperación, luego evidencia backend Plus.


## 2026-10-09 — SG28 prueba E2E controlada añadida (validación CI pendiente)
- Creada prueba E2E Lite para validar cancelación/reinicio sin enviar cargas extremas: `e2e/in625-h2-sg28-cancel.spec.ts`; incorpora mock delimitado del worker, evento tardío con request ID original y comprobación de que el resultado posterior es normal.
- Creado workflow dedicado `in625-sg28-scientific-cancel.yml` con Chromium desktop sobre cambios técnicos. Commits Lite `1b6d678d` (spec), `901fadc0` (workflow), `0f3e1dff` (oráculo de respuesta tardía).
- Alcance del nuevo test: navegación real de Científica con worker simulado; NO certifica carga prolongada de worker real ni aborto del backend Plus. El último run de este nuevo workflow no está verificado, sin PASS/FAIL acreditado. Siguiente paso: leer logs Actions y cerrar rojos antes de ampliar SG28.


## 2026-10-09 — SG28: endurecimiento del workflow de diagnóstico
- Commit Lite `85f05af837d09914a4fc6d4acd34bc630f5e874e`: workflow dedicado SG28 ampliado con Typecheck antes de E2E y artifact de depuración de Playwright en caso de fallo. Cambio de CI/harness, sin modificación de producto.
- Conector no permite consultar listado general de runs push; consulta por SHA solo cubre PR, por tanto resultado actual **NO VERIFICADO**. SG28/H2 no se declara PASS.


## 2026-10-09 — SG28 error recovery regression extended
- Added simulated `onerror` recovery route to Lite Playwright SG28, commit `512f9346fd941ee1fe2e6b2d4b0fc0ecf9fe1f06`. Case now covers cancellation/late message/new calculation and worker error/recovery. No production load tests. This is a test expansion, **not verified PASS**; workflow/job results still need direct confirmation.


## 2026-10-09 — SG28 test oracle: reused worker lifecycle corrected
- Corrección únicamente en test Lite commit `a4a153dd81c84348de079b92ea986cc93c47cf50`. La versión previa suponía una nueva instancia de worker para la siguiente solicitud después de un resultado normal; eso contradice el hook `useComputeWorker`, que reutiliza instancia hasta cancelación/error. Se ajustaron oráculo, mock y número esperado de instancias.
- Clasificación HARNESS. No hay evidencia de CI PASS/FAIL verificada para el test corregido. Cierre SG28 prohibido hasta ejecución y validación real.


## 2026-10-09 — SG28 reconcile exact Scientific worker lifecycle
- Se confirmó por lectura de `BasicScientificMode.tsx` que el botón Calcular termina siempre el worker existente antes de iniciar el siguiente; no basta extrapolar el comportamiento del hook `useComputeWorker` aislado. Clasificación: HARNESS/ORÁCULO del E2E desalineado con comportamiento real.
- Commit Lite `b731f66dad3c75fd7d5f7cf3dcafef3e01f71b14` ajusta secuencia de cuatro instancias y oráculo de error a instancia tres. CI PASS aún NO verificado; no elevar el estado de H2.


## 2026-10-09 — SG28 smoke integrado con worker real añadido
- Lite commit `0484a8e1e3a92d7df2c39d721cf013a77388cd2d`: añadido smoke de Playwright con worker real para operación ligera `2+3=5`, diferenciado explícitamente del test de cancelación bajo mock. No se tocó el producto. CI no verificada y no hay PASS nuevo acreditado.


## 2026-10-09 — SG28 corregido escape regex de oráculo real-worker
- Lite `8e369c866c44a7ccca01feb82238c66b0be3fd01`: corrigió regex mal escapadas del oráculo E2E con worker nativo, antes de acreditar un resultado CI. Clasificación: ORÁCULO/HARNESS. Sin cambio de producto y sin PASS de CI acreditado; H2 continúa abierto.


## 2026-10-09 — SG28 real-worker E2E waits for result value
- Lite commit `e08beb30a774959296e100ce026aeae0fd42ea84`: the native-worker smoke now waits with `expect.poll` for the expected canonical result, rather than checking it immediately after the request ID appears. Classification HARNESS timing/oracle; no product change.
- New workflow run status not confirmed: GitHub connector does not expose a repository-wide push-run listing and public Actions retrieval was unavailable. This is NOT PASS evidence. Next exact step: inspect SG28 E2E and cumulative gate jobs/logs for this revision, resolve reproducible failures, then isolated real cancellation and Plus backend termination validation. H2 OPEN.


## 2026-10-09 — SG28 UI result selectors made layout-independent
- Lite commit `5ecbb2e495a3e157849aead7dfabcb5e3b57b6f4`: corregida fragilidad de selectores E2E. La variante `fused` de `Screen` no crea `section[aria-label="Resultado"]`, pero `ResultPanel` sí expone `data-result-request-id` para respuestas y `role=alert` para errores. Clasificación HARNESS, sin cambio motor. PASS de CI pendiente de evidencia.


## 2026-10-09 — SG28 fixed layout setup for Playwright
- SG28 HARNESS Lite commit `ad4c399b76f07b031cf7ce7121c608ee39417378`. Forzado layout `split` antes del arranque en ambos casos E2E para garantizar que el control `Calcular` esté disponible en la UI esperada; sin alteración del motor. CI/Playwright sobre este SHA no verificado. H2 abierto.


## 2026-10-09 — SG28 stale-output assertion does not require a result node
- Lite commit `8091c4f72739776575524e90c04890d6eeebb1bd`: evita un fallo de harness cuando el test intenta buscar `ResultPanel` después de cancelar el primer cálculo (todavía sin ningún resultado). Ahora rechaza el marcador obsoleto en la página completa. Sin cambio del motor; CI no verificado y SG28 permanece abierto.


## 2026-10-09 — SG28 Lite: CI verificado PASS en run 37999350568
- Se recuperó directamente run `37999350568` de GitHub Actions (push; SHA `8091c4f72739776575524e90c04890d6eeebb1bd`). Log del job `114053353730`: **2 passed (15.9s)**, pruebas SG28 de UI mock y smoke worker real; typecheck SUCCESS.
- Revisión adicional de runs del mismo SHA: cumulative `37999350602` SUCCESS, build diagnostic `37999350623` SUCCESS, H1d reentry `37999350567` SUCCESS; jobs `114053352753`, `114053353745`, `114053352557` verificados. **No se publicaron cambios técnicos en esta verificación**.
- Clasificación: prueba automatizada acotada **PASS**; gap de cancelación efectiva en ejecución real y backend Plus **OPEN**, SG28/H2 sin cierre integral.


## 2026-10-09 — SG28 Plus backend cancellation surface checked
- Auditoría directa de Plus `backend/app/main.py`, `backend/app/routers/evaluate.py` y `backend/app/routers/calculus.py`. FastAPI registra routers bajo `/api/v1`; los endpoints matemáticos son `async def` y usan SymPy, pero en lo inspeccionado NO aparece `request.is_disconnected`, un token/canal de cancelación, ejecución en subproceso cancelable ni cola de trabajos gestionada. Esto **no prueba categóricamente ausencia** en todos los servicios, pero impide afirmar que `AbortController` del frontend detenga un trabajo de SymPy ya iniciado.
- Se documenta decisión técnica: no publicar una prueba de estrés de SymPy ni ejecutar operaciones costosas en producción. Para certificar backend Plus se requiere primero una estrategia de computación aislada con límites de tiempo/recursos e interrupción efectiva, y pruebas de recuperación en CI local; no limitarse a abortar la conexión.
- Gaps Lite del run 37999350568: dos tests SG28 PASS, pero uno simula el worker y el otro ejecuta operación ligera real; no prueban cancelación de trabajo largo real. H2/SG28 globales ABIERTOS.


## 2026-10-09 — SG28 native worker CI verified run 38000982016
- GitHub Actions confirmado: `https://github.com/c2melendez/precision-lab-lite/actions/runs/38000982016`; job `114058691659`, SHA `3191e9d296deec42a7946a73b5e1dfa686b94748`, 3/3 E2E PASS, Typecheck PASS. Los runs cumulative `38000982159`, build `38000982024` y H1d `38000982038` también SUCCESS para dicho SHA.
- No hay FAIL nuevo. Sigue pendiente certificar interrupción en motor matemático real y cancelación en backend Plus; no cerrar H2.


## 2026-10-09 — SG28 four Playwright tests verified PASS
- GitHub Actions Lite SG28 run https://github.com/c2melendez/precision-lab-lite/actions/runs/38001591613, SHA `d9f36bde5759d2394ce6e9014137127e7d91c0b4`, job `114060683879`: **4/4 Playwright PASS (18.5s)**. Nueva prueba acredita terminación/recreación del worker matemático compilado con operación ordinaria. Gates del mismo SHA cumulative `38001591557`, build `38001591646`, H1d `38001591596`: SUCCESS.
- Acreditado: ciclo de vida de workers, cancelación bajo mock, worker nativo ocupado acotado y reinicio de worker matemático. Sin acreditar: cancelación de cómputo matemático prolongado ya iniciado y cancelación efectiva del servidor Plus. SG28/H2 abiertos a efectos integrales.


## 2026-10-09 — SG28 Plus isolated CI PASS, cumulative frontend failure triaged
- Plus run 38002882796: SG28 prototype isolated-process tests 3/3 PASS. Plus cumulative run 38002882722: backend 565 PASS; frontend 3 FAIL in `frontend/src/__tests__/client.test.ts` (746 PASS/28 TODO), all trace to aborted non-timeout requests being reported as elapsed-timeout. H1d run 38002882754 SUCCESS.
- Plus `frontend/src/api/client.ts` commit `0afdc4f7b20fa1ee79e92f350be8790943fac337`: added explicit `timedOut` tracking, distinguishing timeout-triggered AbortController.abort() from unrelated fetch AbortError. CI on patch not yet verified: **DO NOT MARK cumulative PASS**.
- Plus SG28 process-isolation primitive remains test-only, unconnected to routes; no server-request-disconnect cancellation certified. H2 OPEN.


## 2026-10-09 — Plus cumulative run 38003323387 diagnosis and oracle correction
- Plus cumulative `38003323387` on `0afdc4f7b20fa1ee79e92f350be8790943fac337`: **FAIL** frontend `client.test.ts`, 3 failed/746 passed/28 TODO; backend job SUCCESS. Direct log: failures at lines 265,313,337 expected `/fallo de red/` although all three cases actually advance fake timers to 15,000 ms; correct timeout message was `tiempo máximo`. Classification ORACLE/HARNESS (tests), not product failure.
- Plus commit `8511653781fde1f53b13dba351d347f950c6864b`: fixed exactly those three assertions to require `/tiempo máximo/`. The separate pre-timeout AbortError tests continue to require network-error classification. No production code modified in this patch.
- GitHub Actions new Plus cumulative run `38004192723` and H1d `38004192745` were QUEUED when checked, no PASS claimed. SG28 isolated backend prototype had already passed 3/3; integration of backend cancellation remains pending, H2 OPEN.


## 2026-10-09 — Plus cumulative restored, 749 frontend + 565 backend PASS
- GitHub Actions Plus cumulative run `38004192723` completed SUCCESS on exact SHA `8511653781fde1f53b13dba351d347f950c6864b`. Frontend job `114069085476`: **749 passed, 28 TODO, 0 failed** over 69 test files; backend job `114069085716`: **565 passed, 1 warning, 0 failed**. H1d Reentry run `38004192745` also SUCCESS on same SHA.
- This verifies the correction of three mismatched timeout oracles in `frontend/src/__tests__/client.test.ts`. Plus cumulative is GREEN. Separate SG28 backend-isolation prototype run `38002882796` had 3/3 PASS, but it remains disconnected from production endpoints; client disconnect does not yet terminate server SymPy operation. **SG28/H2 globally OPEN**.


## 2026-10-09 — SG28 Plus isolated real SymPy CI 5/5 PASS
- Plus commit `0c4db6237c5bfd6ee1843db7f8c9bfdb2df874d4` adds two tests exercising real SymPy differentiation in an isolated child process, including recovery after stopping a separate bounded child. SG28 backend-isolation workflow run `38004754538` SUCCESS, job `114070860832`, pytest log **5 passed in 1.49s**. Evidence: https://github.com/c2melendez/precision-lab-plus/actions/runs/38004754538.
- As checked, cumulative run `38004754563` and H1d `38004754608` for same commit were still IN_PROGRESS; do not claim their results. No API router is connected to `run_bounded`; no actual live SymPy cancellation on client disconnect has been demonstrated. SG28/H2 OPEN.


## 2026-10-09 — Plus SG28 SymPy isolated cumulative gates verified
- Plus SHA `0c4db6237c5bfd6ee1843db7f8c9bfdb2df874d4`: SG28 isolated backend run `38004754538` **5/5 PASS**; cumulative run `38004754563` **SUCCESS** (backend job `114070861216`: **567 passed**, one warning; frontend job `114070861527`: **749 passed, 28 TODO**, zero failures); H1d run `38004754608` **SUCCESS**. Direct GitHub Actions job/log confirmation.
- Scope: SymPy real calculation in child process and recovery after termination of a *different controlled test child*; NO live cancellation of already-running SymPy evaluation, request disconnect handling, or public endpoint integration. SG28/H2 still open.


## 2026-10-09 — SG28 Plus gated active-child termination test pending CI
- Plus `backend/tests/test_in625_sg28_interruptible.py` adds gated active child test: a spawned child signals readiness, waits at a gate before a genuine SymPy derivative, then a 1-second bounded timeout ends that live process; a new child completes the derivative. Commits `bffc195b`, `5fbccf0d`. Does **NOT** demonstrate terminating SymPy while actively computing, because termination happens at the gate. No public endpoint changed.
- GitHub Actions for latest Plus SHA `5fbccf0d2f6ebc0393f08ab48eb1eff646465a25` needs verification; earlier runs for `bffc195b` were queued. Do not certify this sixth test until logs pass. SG28/H2 remain OPEN; next scope is actual running SymPy cancellation and endpoint-level integration after isolated safety checks.


## 2026-10-09 — Plus SG28 6/6 PASS, cumulative and H1d green
- Verified GitHub Actions Plus SG28 run `38005647857` at SHA `5fbccf0d2f6ebc0393f08ab48eb1eff646465a25`: job `114073702086` SUCCESS, **6/6 pytest PASS in 2.38s**. Sixth case terminates an active spawned process at a synchronization gate before executing SymPy, then confirms recovery with fresh SymPy evaluation.
- Same SHA cumulative run `38005647868`: **SUCCESS**, frontend `749 PASS, 28 TODO` (job `114073702176`), backend `568 PASS, 1 warning` (job `114073702323`). H1d run `38005647935`: SUCCESS.
- Scope: process isolation/cancel/recovery in CI only. Not a demonstration of interrupting SymPy mid-computation or HTTP disconnect cancellation. No public router integration. SG28/H2 integral **OPEN**; next is real mid-computation interruption and safe endpoint integration.


## 2026-10-09 — SG28 actual SymPy computation interruption test pending CI
- Plus technical commit `732d30a6b61abe7638459f07803ea5dac27201fc` adds seventh isolated SG28 pytest: child signals readiness, enters an actual SymPy differentiation loop, is stopped by `run_bounded` with 1 s wall-clock deadline, then a fresh process validates SymPy derivative recovery. This is test-only and NOT connected to HTTP endpoints. Unlike previous gate-based test, child does genuine SymPy computation during test; mechanism still lacks request-disconnect cancellation and production constraints.
- Auto-triggered Plus GitHub Actions: SG28 `38006130315`, cumulative `38006130285`, H1d `38006130276`, all QUEUED when checked. No PASS on this new SHA yet. SG28/H2 remain OPEN.


## 2026-10-09 — Plus SG28 real active SymPy interrupted 7/7 PASS
- Exact SHA `732d30a6b61abe7638459f07803ea5dac27201fc`: Plus backend isolated SG28 GitHub Actions run `38006130315` SUCCESS (job `114075228567`), direct log **7 passed in 3.68s**, including interrupting a spawned child during a real, deliberately bounded-by-wall-clock SymPy differentiation loop, and then successfully running a new calculation.
- Same SHA Plus cumulative run `38006130285` SUCCESS: frontend `749 PASS, 28 TODO`, backend `569 PASS, 1 warning`, no failures. H1d run `38006130276` SUCCESS. Tests only; no public API routing/HTTP disconnect cancellation implemented. **SG28/H2 OPEN**, next stage is safe server request-to-isolated-job lifecycle integration, with explicit resource bounds and cancellation.


## 2026-10-09 — SG28 explicit caller cancellation in isolated Plus worker
- Plus service `backend/app/services/interruptible.py` commit `aaaafff5ecb123bec10fc5ab30d6f182ebeeecd0` extends the prototype isolated worker with an explicit caller-controlled `cancel_event`, a bounded 50 ms poll interval, and `ComputationCancelled`. Existing `finally` path terminates/joins/kills the child. Not connected to public FastAPI routes; production unchanged.
- Plus `backend/tests/test_in625_sg28_interruptible.py` commit `c8644f4792f62243463df502ad2477b098a4b05a` adds eighth test: starts a live SymPy differentiation loop in child, sets cancellation event after worker readiness, expects `ComputationCancelled`, then checks normal SymPy recovery in new child. This explicitly distinguishes caller cancellation from timeout.
- CI new SHA was QUEUED when inspected: SG28 `38006506957`, cumulative `38006506938`, H1d `38006506912`; **no new PASS claimed**. Next: verify logs, then evaluate safe mapping from FastAPI disconnect to cancel_event, keeping bounded resources. H2/SG28 remain OPEN.


## 2026-10-09 — SG28 Plus real SymPy active-process termination test
- Plus test commit `3984b632a89e274e7494f2e4b4d8b02b5287f990`: new isolated pytest case repeatedly performs real SymPy differentiation in a spawned process for up to four seconds. `run_bounded` should terminate that process at 1.5 seconds, then a freshly spawned process should calculate a normal SymPy derivative. No public endpoint changed and no production load applied.
- **CI for new commit not yet verified.** Previous Plus gate run `38004754563` success and SG28 5/5 run `38004754538` are historical, not a PASS for this new sixth test. Request disconnect handling and endpoint integration remain open; H2 not closed.


## 2026-10-09 — Plus SG28 9/9 and cumulative green on 3984b632
- Verified direct GitHub Actions evidence for Plus SHA `3984b632a89e274e7494f2e4b4d8b02b5287f990`: SG28 run `38006921769` SUCCESS, job `114077728826`, **9 passed in 6.85s**. Contains bounded real-SymPy active-process timeout/recovery test. Cumulative run `38006921751` SUCCESS: **571 backend PASS** (one warning), **749 frontend PASS** (28 TODO), no failures. H1d `38006921744` SUCCESS on same SHA.
- Scope: actual SymPy computation active in isolated child and forcibly ended via timeout; recovery tested. Still NOT integrated into public FastAPI math endpoints and NOT proven to terminate backend work upon user-driven client request cancellation. SG28/H2 remain OPEN for end-to-end cancellation.


## 2026-10-09 — SG28 Plus external AbortSignal wired at API client (pending CI)
- Plus frontend `src/api/client.ts` commit `ff469ce71c0fbf8cba05d46b597dee0bd0da9715` adds optional caller `AbortSignal` on `callApi`; preserves 15s timeout, distinguishes explicit user cancellation, discards late responses and removes abort listener. Plus tests `src/__tests__/client.test.ts` commit `6784bfa61344bb396f4dc047eebd66db1d9cdfc3` cover caller-triggered abort/recovery and a pre-aborted signal.
- Status: source and tests published, **CI not verified**. No UI cancel button wiring or backend HTTP-disconnect propagation yet. SG28/H2 remain OPEN; never infer server process termination from client abort.


## 2026-10-09 — SG28 Plus explicit cancel 8/8 PASS and cumulative 1319 PASS
- GitHub Actions Plus SG28 run `38006506957` SUCCESS, job `114076408843`, exactly SHA `c8644f4792f62243463df502ad2477b098a4b05a`: **8/8 pytest PASS in 4.75s** including explicit caller-triggered cancellation of live isolated SymPy computation.
- Same SHA cumulative `38006506938` SUCCESS, backend job `114076408729`: **570 PASS, 1 warning**; frontend job `114076408960`: **749 PASS, 28 TODO**; no failures, 1319 passing total. H1d `38006506912` SUCCESS.
- Verified behavior only in isolated executor; no HTTP disconnect-to-child cancellation or public FastAPI integration has been tested or deployed. SG28/H2 globally **OPEN**. Next: design and test bounded request-lifecycle bridge with explicit cancellation and stable MathResponse contracts.


## 2026-10-09 — SG28 experimental request-disconnect bridge pending CI
- Plus `backend/app/services/request_cancellation.py` commit `16c41238` adds test-only ASGI request bridge that runs `run_bounded` in a worker thread, polls `request.is_disconnected()`, and sets cancellation event for cleanup. Plus tests `backend/tests/test_in625_sg28_request_cancellation.py` commit `80883dfd` exercise disconnect plus recovery with FakeRequest; workflow `in625-sg28-backend-cancellation.yml` commit `dfa15f27` runs both test files.
- Runs queued when queried: SG28 `38008815812`, cumulative `38008815822`, H1d `38008815823`. NO PASS yet for this SHA. Not integrated into publicly exposed FastAPI endpoints; the mock request is not a live HTTP disconnect; server cancellation remains unproven end-to-end. SG28/H2 OPEN.


## 2026-10-09 — SG28 request bridge 11/11 PASS, cumulative 1324
- Verified Plus SHA `dfa15f27afd450ca26bd4631f6e19d2533c8bf3f`: SG28 isolated bridge run `38008815812`, job `114083777213`: **11 passed in 7.69s**. Cumulative `38008815822` SUCCESS: backend job `114083777394` **573 passed, 1 warning**; frontend job `114083777617` **751 passed, 28 TODO** (0 FAIL); H1d `38008815823` SUCCESS. Overall cumulative 1324 PASS.
- Bridge is tested with FakeRequest and isolated spawned processes, not a production HTTP disconnect or public endpoint. SG28/H2 **OPEN** for full API-to-server work cancellation. Next: isolated ASGI transport/disconnection E2E and controlled production-route integration only after demonstrated safety/resource constraints.


## 2026-10-09 — SG28 ASGI disconnect event test pending CI
- Plus test commit `e0c8c12b9df727832ff47ea9bab82da8ac0d0ab6`: `backend/tests/test_in625_sg28_request_cancellation.py` adds a Starlette `Request` constructed with a genuine ASGI `http.disconnect` message, then verifies `run_for_request` interrupts the isolated child and a subsequent request recovers. This is in-process ASGI-message evidence, **not a real socket disconnection and not a production endpoint integration**.
- New Plus runs queued: SG28 `38009241766`, cumulative `38009241757`, H1d `38009241884`. Test not yet accredited PASS. Next: inspect logs, then true isolated HTTP server/socket test and resource constraints before routing production SymPy. H2/SG28 OPEN.


## 2026-10-09 — SG28 Plus Starlette ASGI disconnect 12/12 PASS
- Plus SHA `e0c8c12b9df727832ff47ea9bab82da8ac0d0ab6`: SG28 run `38009241766` SUCCESS, job `114085145293` **12/12 pytest PASS (7.84s)** including real Starlette Request receiving an in-process ASGI `http.disconnect` event.
- Same SHA cumulative run `38009241757` SUCCESS: backend `574 PASS, 1 warning` and frontend `751 PASS, 28 TODO` (1325 passing total, zero failures). H1d run `38009241884` SUCCESS.
- Coverage does not include an external TCP/HTTP client disconnect or public mathematical FastAPI route integration. SG28/H2 OPEN; next is an isolated loopback HTTP server/client disconnect lifecycle test and resource limits.


## 2026-10-09 — SG28 real loopback TCP disconnect test pending CI
- Plus test `backend/tests/test_in625_sg28_loopback_http.py` commit `92753ea3949b05336e6308feac9bcc0f85080816`: starts a test-only FastAPI app on loopback 127.0.0.1, sends a real HTTP request over TCP, closes client socket while isolated computation is active, checks that the request bridge observes disconnect and finishes cleanup, then verifies a fresh HTTP request computes 2+3=5. It uses bounded timeouts; no production endpoint or external load.
- Dedicated SG28 workflow amended in `9550b08b73481617b461f4e34c73dee7c9fabe90` to include loopback test. Runs for exact SHA initially QUEUED: SG28 `38009888528`, cumulative `38009888538`, H1d `38009888576`. **No PASS claimed until logs inspected.** This proves test-only HTTP-to-process wiring only if CI passes; actual production endpoints remain unchanged, H2 OPEN.


## 2026-10-09 — SG28 loopback TCP 13 PASS cumulative 1326 PASS
- Verified Plus exact SHA `9550b08b73481617b461f4e34c73dee7c9fabe90`: isolated SG28 run `38009888528` SUCCESS job `114087200053`, **13 pytest passed in 8.83s**, including real loopback TCP HTTP disconnect against test-only FastAPI app and recovery. Cumulative `38009888538` SUCCESS: backend `575 passed, 1 warning`, frontend `751 passed, 28 TODO`, 1326 PASS/0 FAIL; H1d `38009888576` SUCCESS.
- This evidence is for a local **test-only** endpoint, not the public math API. No production request-to-process cancellation wired; SG28/H2 remain OPEN pending safe integration and end-to-end verification.


## 2026-10-09 — Plus caller AbortSignal gate verified 751+571 PASS
- Plus SHA `6784bfa61344bb396f4dc047eebd66db1d9cdfc3`: GitHub Actions cumulative run `38007690669` **SUCCESS**; backend job `114080181068` **571 PASS**, 1 warning; frontend job `114080181197` **751 PASS**, 28 TODO, 0 FAIL. H1d run `38007690683` **SUCCESS**. This validates the two new SG28 external AbortSignal client tests plus existing regressions.
- Coverage: request-level caller cancellation and subsequent recovery in frontend, NOT termination of SymPy work on the server or explicit UI button. Plus isolated SymPy SG28 earlier run `38006921769` 9 PASS. H2/SG28 globally OPEN pending integrated UI -> HTTP -> backend-process cancellation.


## 2026-10-09 — SG28 Plus basic UI caller cancellation implemented, CI pending
- Plus commit `aae4bec93123c357ff7696dc8fc07b53dff7ea00`: `submitAndRecord` forwards optional AbortSignal and omits history entries for aborted requests. Plus `95eb408d45b958f8bba3c6052e1b175e174cafa7`: visible 'Detener cálculo' in Basic mode for direct evaluate/solve/inequality request, aborts active fetch, invalidates stale request ID and retires busy state. **Scope is limited to these direct paths**; systems, matrices and graphing are not covered yet.
- New Plus cumulative run `38010848002` and H1d run `38010847995` were QUEUED when checked. **No CI PASS claimed** for these changes. This is client UI/HTTP cancellation, not proof of process termination on backend. SG28/H2 OPEN.


## 2026-10-09 — Plus SG28 Basic UI CI failure and compatibility repair
- Plus cumulative run `38010848002` for `95eb408d`: FAILED frontend **39 failed / 712 passed / 28 TODO**; backend SUCCESS and H1d `38010847995` SUCCESS. Direct logs show tests expecting exactly two `callApi` arguments after SG28 added optional third argument carrying AbortSignal.
- Plus patch `7102720e`: `submitAndRecord` retains two-argument `callApi` invocation for all legacy callers lacking cancellation options. Plus test patch `516a381c`: nine direct BasicMode call assertions now expect a third `{ signal: AbortSignal }` argument. Existing product feature for Basic direct cancel remains enabled.
- CI for `516a381c`: cumulative run `38011234844`, H1d `38011234835`, QUEUED when observed. Do not claim PASS until jobs/logs checked. Backend actual request-disconnect integration still unimplemented. SG28/H2 OPEN.


## 2026-10-09 — Plus Basic cancellation compatibility gate recovered
- Plus SHA `516a381cbcedabcca602b9edb25e76a226c4a56f`: cumulative run `38011234844` SUCCESS. Backend job `114091482037`: **575 PASS**, 1 warning. Frontend job `114091482273`: **751 PASS**, 28 TODO, 0 FAIL. H1d run `38011234835` SUCCESS. Previously observed 39 frontend failures in run `38010848002` were removed by backwards-compatible optional AbortSignal forwarding and adjusted SG28 Basic call expectations.
- Scope: existing unit and integration suite green; still lacks specific browser E2E of Basic UI cancel and back-end process interruption on client disconnect. SG28/H2 OPEN.


## 2026-10-09 — SG28 Plus Basic browser E2E added, CI pending
- Plus `frontend/e2e/in625-h2-sg28-cancel.spec.ts` commit `38c2f190f6eebac42f0895f92b39562992317ffa`: browser Playwright test exercises visible «Detener cálculo» in Basic mode, delays first HTTP /evaluate response via route mock, cancels, submits a second ordinary operation, and checks stale response marker absent. No expensive request sent to production; test uses Playwright isolated backend.
- Dedicated workflow `.github/workflows/in625-sg28-plus-ui-cancel.yml` commit `086d9f678faf5f8f13aa4ec6a2707eebbedb73b5`. Initial runs as observed: E2E `38011603975`, cumulative `38011603949`, H1d `38011603906` all QUEUED. No CI PASS claimed for new browser test.
- Scope: client UI cancel/recover only; backend cancellation upon client disconnect still NOT demonstrated. SG28/H2 OPEN.
