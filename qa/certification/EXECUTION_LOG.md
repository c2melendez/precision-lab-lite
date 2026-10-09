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
