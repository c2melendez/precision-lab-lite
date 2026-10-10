# Current Certification State

Actualizado: 2026-10-07
Alcance coordinado: Lite + Plus
Rama activa: `qa/syntax-audit-in625-a1`

## Baseline
- Oracle Audit: 74/74 shards.
- 2,132/2,132 casos planificados.
- 4,026 casos canónicos.
- 3,451/3,451 legacy representados.
- promoted legacy oracle: 2,823/3,448 verificados; 625 restantes forman IN625.
- canonical oracle: 3,399/4,026.
- blocking verified: 1,357.
- Product Certification Wave 2: PASS en Lite y Plus, 22/22.

## IN625
Bloques cerrados y verdes en ambos motores:
A1, A2, A3, A4, B1, B2, B3, B4, C1, C2, C3, C4, D1, D2, D3, E1a, E1b, E1c, E1d, E2a, E2b, E2c, E3a, E3b, E3c, E3d1, E3d2, E3d3, F1, F2a, F2b, F3a, F3b, F3c, G1a, G1b automatizable y G2.

G1 manual/capability:
- TC17
- TC23

G2 manual/config-dependent:
- EN-CH-11: decimal coma real / locale.

## G2 — CERRADO
Se normalizaron únicamente equivalencias de representación del harness, sin cambiar producto:
- EN-CH-06: `sin^2(x)` ↔ `sin^2x`
- EN-CH-07: `sin^-1(x)` / `sin^(-1(x))` ↔ `sin^-1x`
- EN-CH-12: `abs(x-1)` ↔ `|x-1|`

Evidencia:
- Lite Playwright `37580506336` — SUCCESS.
- Plus Playwright `37580510564` — SUCCESS.
- Lite HEAD documental posterior: Playwright `37581518369` — SUCCESS.

## G3 — entradas inválidas y mensajes de error: CERRADO 34/34.
- Lite: 26 parser-level raw + 8 E2E preservables por MathLive.
- Lite E2E run `37722856327`: SUCCESS en desktop/tablet/mobile.
- Lite parser run `37722856334`: SUCCESS.
- Plus: G3 ya certificado 34/34 con Playwright + backend parser.
- La separación por capa preserva cobertura completa: entradas canonicalizadas por MathLive se validan antes del editor; entradas que sí atraviesan UI se validan E2E.

Siguiente bloque activo: H1 — 30 casos de reentrada / output-as-input.

## Siguiente paso exacto — H1d (EN-RE-24..30)
1. Localizar los siete casos H1d en la matriz vigente y confirmar sus tests y harness en Lite y Plus.
2. Verificar HEAD y Actions completos; las consultas por SHA no muestran todas las corridas.
3. Reconciliar EN-RE-29 y EN-RE-30 con MANUAL_CAPABILITY_GAPS.md sin contarlos como PASS.
4. Ejecutar pruebas automatizables H1d y gate acumulativo en ambos motores; clasificar cada rojo antes de corregir.
5. Actualizar CURRENT_STATE y EXECUTION_LOG en ambos repositorios con commits, runs, evidencias y próximo paso. Solo avanzar a H2 tras cierre bilateral.

### Reconciliación documental 2026-10-08
- G3 y H1a–H1c ya constan cerrados; H1d no tiene cierre nuevo verificado.
- HEAD previos a este ajuste: Lite a9627f4d67f141c0346a19c467656d626e3affcc; Plus 802eea7d7a9abf2ec28f2fa46d97a40c67e5296f.
- H1c: jobs SUCCESS Lite 37794754460; Plus 37794867403.
- No se ejecutaron pruebas ni se modificó código de producto en esta reconciliación.

## Continuidad repo-native
El bootstrap oficial es `qa/certification/CONTINUATION_PROMPT.md`. No se necesita ZIP de handoff mientras GitHub y estos archivos estén accesibles.

H1a — EN-RE-01..08: CERRADO 8/8 en Lite y Plus. Lite `37771014887`, Plus `37771019348`.
Siguiente bloque: H1b — EN-RE-09..16: CERRADO 8/8 en Lite y Plus.
- Lite run `37778832819`: SUCCESS.
- Plus run `37790101494`: SUCCESS.
- Correcciones permanentes: reentrada de listas de soluciones, matrices naturales, extracción exacta de salida Plus, preservación de unión de intervalos y formatos numéricos.
- Siguiente bloque: H1c — EN-RE-17..23: CERRADO con 6/6 automáticos PASS + 1 CAPABILITY GAP explícito.
- Lite run `37794754460`: SUCCESS.
- Plus run `37794867403`: SUCCESS.
- Automáticos PASS: EN-RE-17, 18, 19, 20, 21 y 23.
- EN-RE-22: capability gap documentado; el historial aún no restaura el LaTeX original al campo principal.
- Siguiente bloque: H1d — EN-RE-24..30.

### Auditoría del harness H1d — 2026-10-08 (sin corrida nueva)
- Se localizaron los specs de cinco pruebas automatizadas: Lite `e2e/in625-h1d-reentry.spec.ts` y Plus `frontend/e2e/in625-h1d-reentry.spec.ts`.
- Se localizaron ambos workflows `.github/workflows/in625-h1d-reentry.yml`, configurados para `pull_request` y `workflow_dispatch`; cada uno ejecuta Chromium desktop.
- EN-RE-24 prueba idempotencia textual normalizada de 20 inputs y tercera reentrada. La igualdad textual no equivale por sí sola a equivalencia matemática: revisar oráculo contra las reglas canónicas.
- EN-RE-25 lleva el título «equivalencia semántica» pero solo exige que la segunda salida no esté vacía. CLASIFICACIÓN: hueco de ORÁCULO/HARNESS, no defecto de producto acreditado.
- EN-RE-26 comprueba únicamente aceptación/no vacío de formatos cruzados, no garantiza resultado matemático correcto. ORÁCULO parcial.
- EN-RE-27 valida presencia de patrones textuales de asin/atan y EN-RE-28 comprueba `cases|x`; ambas necesitan una verificación de semántica más fuerte para certificación plena.
- EN-RE-29/30 permanecen en MANUAL_CAPABILITY_GAPS como capacidades no expuestas; no contarlos como PASS.
- **No hay ejecución H1d nueva verificada** ni clasificación de fallos de producto; no se han modificado motores. No declarar H1d cerrado.
- Siguiente paso: reforzar primero los oráculos de H1d (usando referencias matemáticas independientes, no solo no-vacío), luego disparar y comprobar los workflows H1d en ambos repositorios y registrar runs, resultados y gate acumulativo antes de H2.

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

### 2026-10-08 — H1d: mejora bilateral de oráculo, sin cierre
- Nueva comprobación EN-RE-25: suma racional `\\frac{1}{2}+\\frac{1}{3}` debe devolver `\\frac{5}{6}` o decimal periódico admitido, tanto inicialmente como tras reentrada.
- Test commits: Lite `679e85ee717e44149283d2632765c01c9b7e0783`; Plus `0f40b78ec5a4fa2c8226f092dd170cf34313eb71`.
- Build Lite run `37859589602` inicialmente en curso; no valida H1d.
- Último H1d E2E SUCCESS observado Lite `37843775609`, Plus `37843780110` en commits previos, sin cobertura acreditada de estos cambios.
- **H1d pendiente** hasta E2E y gate bilateral verificables. Siguiente paso: obtener nuevas corridas H1d en SHA actual (PR o dispatch autorizado), diagnosticar los resultados y continuar oráculos de EN-RE-26/28. EN-RE-29/30 no PASS (capability).

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

## 2026-10-09 — Estado verificado por GitHub Actions: gates verdes bilaterales
- **Lite**: gate acumulativo SUCCESS run `37926844320` en commit técnico `82fb45c47c30a7889ebd75a47464ac65649217be`; H1d SUCCESS `37926844177` y Build SUCCESS `37926844234` sobre la misma SHA. La reconciliación de oráculos legados de D1/D2/C10 no modificó el producto. El gate anterior `37926462245` tenía 1012 PASS / 2 FAIL / 30 TODO; **no trasladar ese conteo al gate verde sin inspeccionar su log**.
- **Plus**: gate acumulativo SUCCESS `37909986582` y H1d SUCCESS `37909986581`, ambos en SHA `2d4e97c38`. No hubo nuevas modificaciones de producto Plus en esta fase.
- **Decisión IN625 H1d**: evidencia automatizada 5/5 en cada motor y gates acumulativos verdes confirmados. EN-RE-29/30 permanecen CAPABILITY GAPS (no PASS); EN-RE-22 permanece gap H1c. Los oráculos EN-RE-25/26/27/28 aún tienen cobertura semántica parcial, según auditoría canónica: **no declarar certificación semántica universal**.
- **Siguiente paso exacto**: auditar cierre contractual H1d (revisar evidencia de cada caso y las excepciones, marcar resolución formal cuando cumpla el protocolo), y comenzar H2 solo después de documentar cierre bilateral. Mantener sincronización del `CURRENT_STATE.md` y `EXECUTION_LOG.md` en ambos repositorios.

## 2026-10-09 — Cierre contractual H1d y apertura de H2
- H1d clasificado 7/7: EN-RE-24..28 PASS automatizados 5/5, EN-RE-29/30 CAPABILITY GAPS explícitos 2/2 (NO PASS), conforme a IN625_H1_MATRIX.md.
- Lite H1d SUCCESS 37926844177; gate SUCCESS 37926844320: 1014 PASS, 0 FAIL, 30 TODO en SHA 82fb45c47. Plus H1d SUCCESS 37909986581 y gate SUCCESS 37909986582 en SHA 2d4e97c38.
- EN-RE-22 permanece GAP H1c; EN-RE-25/26/27/28 aún requieren fortalecer oráculos semánticos, sin asumir equivalencia universal.
- H1d CERRADO por clasificación contractual PASS/GAP, no certificación funcional global. Siguiente bloque H2: localizar matriz canónica, determinar pruebas, preparar ejecución y documentar evidencia antes de declarar PASS.

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
- Se confirmó el puntero de `main` en Lite y Plus a `qa/syntax-audit-in625-a1`; el índice H2 de ambos enumera EN-SG-01..32. Esta auditoría se realizó leyendo la rama canónica directamente.
- **Hallazgo PRODUCT / CAPABILITY SG28 Lite**: `src/App.tsx` registra `CalculusMode` pero NO lo incluye en `VISIBLE_MODES` (solo basic, matrices, graphing, statistics, units). El botón «Detener cálculo» introducido en `src/modes/Calculus/CalculusMode.tsx` no acredita por sí mismo un control accesible para la navegación normal del usuario. La pantalla visible `BasicScientificMode.tsx` usa `getWorker()`, pero actualmente no obtiene `cancelWorker()` ni muestra ese botón. No extrapolar el gate verde a UX accesible.
- Plus `frontend/src/api/client.ts`: AbortController/timeout de 15 s controla la solicitud cliente; no prueba terminación backend. Clasificación: CAPABILITY/PRODUCT pendiente, sin evidencia de bloqueo nuevo causado por harness.
- Evidencia CI verificada por consulta de jobs, Lite: cumulative run 37991876628 SUCCESS, build run 37991876636 SUCCESS, H1d run 37991876565 SUCCESS. Estas ejecuciones no son E2E SG28 en la ruta visible.
- **Siguiente paso exacto**: especificar y probar EN-SG-28 en el módulo visible Científica Lite (cancelar/ignorar respuesta antigua, cálculo posterior y pantalla recuperada), con E2E de navegador en CI controlado; comparar mecanismo Plus UI/backend sin atribuir aborto del servidor al cliente; ejecutar gates y registrar run IDs. H2 continúa ABIERTO. No ejecutar cargas extremas contra producción.


## 2026-10-09 — SG28 Lite: cancelación desde Científica visible integrada (CI pendiente)
- Lite `src/modes/BasicScientific/BasicScientificMode.tsx` actualizado: unifica los 17 despachos `worker.postMessage` mediante `dispatchWorker`, activa indicador de cálculo y botón «Detener cálculo» en Científica visible. `handleCancelComputation` termina el worker, invalida request activo y retira el indicador. El despachador rechaza mensajes tardíos/no coincidentes y maneja errores del worker y de postMessage.
- Commits Lite: implementación `b836e016a354cfcff054edfd09e356774ee00f46`; corrección de orden de declaración del callback `31ce6b502730043e9d3266dee735c74c1cf9d363`. No hubo cambio de motor matemático ni de Plus.
- **Sin PASS acreditado para este cambio:** la consulta de runs por SHA del conector cubre PR y devolvió cero; no prueba ausencia de runs push. Typecheck, tests, build y E2E de cancelación deben verificarse antes de cierre.
- SG28/H2 continúan ABIERTOS. Siguiente paso exacto: revisar gate acumulativo del commit técnico Lite `31ce6b50`; corregir cualquier rojo clasificado; crear E2E controlada de Científica (worker en vuelo, detener, ausencia de salida tardía, nuevo cálculo exitoso); evaluar cancelación real backend Plus con aislamiento. No usar cargas extremas de producción.


## 2026-10-09 — SG28 prueba E2E controlada añadida (validación CI pendiente)
- Lite: prueba determinista `e2e/in625-h2-sg28-cancel.spec.ts` publicada. Simula un worker en vuelo sin cargas pesadas, comprueba botón de detener en Científica, terminación, descarte de respuesta tardía con el mismo request ID y nueva operación recuperable. No equivale a cancelación de un cálculo matemático real de larga duración.
- Lite: workflow dedicado `.github/workflows/in625-sg28-scientific-cancel.yml`, disparado por push técnico o dispatch, Playwright Chromium desktop. Commits de prueba/CI: `1b6d678da32ec4cf07733b5745d5384e7fcd2562`, `901fadc04515275c556d81aebcc4dab8bc185af1`, `0f3e1dffc8095967343ade007ab871a9b630365a`.
- CI de este nuevo spec todavía **NO verificada** por lectura de job/log; no atribuir PASS y clasificar rojos tras corrida. Plus sin cambio de motor; SG28/H2 permanecen abiertos.
- Siguiente paso exacto: comprobar gate acumulativo y workflow SG28 en SHA Lite actual, diagnosticar posibles fallos de integración/browser, corregirlos en la capa responsable; después aumentar cobertura real de worker y comparar interrupción efectiva del backend Plus en CI aislado.


## 2026-10-09 — SG28: endurecimiento del workflow de diagnóstico
- Lite `.github/workflows/in625-sg28-scientific-cancel.yml` ahora incluye `npm run typecheck` y sube trazas/capturas/informe de Playwright como artifact `sg28-playwright-evidence` solo en fallo, con retención de 7 días. Commit técnico `85f05af837d09914a4fc6d4acd34bc630f5e874e`.
- La consulta de runs asociados al commit anterior mediante conector GitHub devuelve 0 porque solo cubre eventos PR; búsqueda pública del workflow no proporcionó logs. **No se verificó estado CI del nuevo cambio**; no afirmar éxito ni fallo.
- H2/SG28 permanece abierto. Siguiente paso exacto: recuperar los nuevos jobs del gate acumulativo y del workflow SG28, leer trazas de Playwright si falla, clasificar causa y corregir. Requiere además verificación con worker real y comparación Plus bajo aislamiento; no ejecutar cargas extremas en producción.


## 2026-10-09 — SG28 error recovery regression extended
- Lite E2E `e2e/in625-h2-sg28-cancel.spec.ts` now also simulates a worker `onerror` after a prior successful cancellation/retry; asserts visible failure feedback, worker termination, cleared loading control, and successful subsequent computation. Commit `512f9346fd941ee1fe2e6b2d4b0fc0ecf9fe1f06`.
- Classification HARNESS/oracle expansion. No product engine alteration. **No new CI result confirmed**; cannot claim SG28 PASS. Next step: verify SG28 Playwright + cumulative gate logs for this exact code SHA, resolve failed cases, then perform isolated real-worker cancellation and Plus backend comparison. H2 OPEN.


## 2026-10-09 — SG28 test oracle: reused worker lifecycle corrected
- Se auditó el test E2E Lite `e2e/in625-h2-sg28-cancel.spec.ts` sin asumir éxito de CI. Hallazgo de HARNESS: tras una respuesta correcta, el worker sigue vivo y se reutiliza; el test anterior esperaba erróneamente un tercer worker antes de lanzar un error. Su mock respondía inmediatamente y podía ocultar el botón de cancelación antes del assertion.
- Commit Lite `a4a153dd81c84348de079b92ea986cc93c47cf50`: el mock ahora cuenta mensajes por worker; retiene la segunda solicitud del worker reutilizado para simular error y comprueba recuperación usando exactamente tres instancias, no cuatro. También tipa explícitamente el registro del mock.
- No se tocó el producto. Falta ejecutar/inspeccionar el workflow SG28 y gate acumulativo en ese commit; no declarar PASS. Siguiente paso: recuperar job/log, diagnosticar rojos, probar worker real de forma aislada y comparar Plus. SG28/H2 ABIERTOS.


## 2026-10-09 — SG28 reconcile exact Scientific worker lifecycle
- Verificación por código: `BasicScientificMode.handleCalculate` llama `handleCancelComputation()` al inicio de cada click Calcular, independientemente de si el worker completó su mensaje. Por tanto incluso una segunda operación tras SUCCESS crea un worker nuevo. El test E2E anterior (commit `a4a153dd`) asumía reutilización tras SUCCESS, pero esa suposición solo corresponde al hook aislado y contradice el componente real.
- Fix de HARNESS Lite `b731f66dad3c75fd7d5f7cf3dcafef3e01f71b14`: test de SG28 restaura secuencia determinista de instancias 1 (pendiente/cancelar), 2 (SUCCESS), 3 (pendiente/error), 4 (recuperación). Sin cambio de motor ni de implementación de producto.
- SG28/H2 ABIERTOS: prueba no acreditada por CI todavía. Siguiente paso exacto: obtener jobs/logs del workflow SG28 y gate acumulativo de esta revisión, corregir fallos reproducibles, ejecutar test integrado con worker real bajo carga acotada y comparar Plus aislado.


## 2026-10-09 — SG28 smoke integrado con worker real añadido
- Lite `e2e/in625-h2-sg28-cancel.spec.ts` ahora incorpora **segundo test de integración sin reemplazar Worker**: evalúa `2+3` con el worker real compilado y exige resultado canónico `5` y salida de estado busy. Commit de test `0484a8e1e3a92d7df2c39d721cf013a77388cd2d`.
- Evidencia separada: test 1 usa mock acotado para cancelación, error y recuperación; test 2 usa motor real para cálculo ordinario, pero no demuestra interrupción de un cálculo real prolongado. Sin resultado CI confirmado para nueva revisión; **no marcar PASS**.
- Siguiente paso exacto: inspeccionar ejecución del workflow SG28 (dos tests) y gate Lite en el commit; clasificar fallo de harness/producto si lo hay, después diseñar interrupción real controlada y validar Plus backend aislado. H2 sigue ABIERTO.


## 2026-10-09 — SG28 corregido escape regex de oráculo real-worker
- Auditoría del spec `e2e/in625-h2-sg28-cancel.spec.ts` encontró un error de ORÁCULO concreto: los literales regex del smoke con worker real tenían doble barra `/\\\\s+/` y `/\\\\.0+/` (buscaban barras literales), por lo que el resultado válido `5.0` podría rechazarse y los blancos no normalizarse. Lite commit `8e369c866c44a7ccca01feb82238c66b0be3fd01` deja expresiones regulares correctas `/\\s+/` y `/\\.0+/`.
- Corrección exclusivamente de test/harness; no cambia el motor matemático. No se confirmó corrida CI sobre este SHA; SG28/H2 siguen ABIERTOS. Siguiente paso: verificar workflow SG28 + gate acumulativo, diagnosticar los resultados y probar interrupción real controlada.


## 2026-10-09 — SG28 real-worker E2E waits for result value
- Lite commit `e08beb30a774959296e100ce026aeae0fd42ea84`: the native-worker smoke now waits with `expect.poll` for the expected canonical result, rather than checking it immediately after the request ID appears. Classification HARNESS timing/oracle; no product change.
- New workflow run status not confirmed: GitHub connector does not expose a repository-wide push-run listing and public Actions retrieval was unavailable. This is NOT PASS evidence. Next exact step: inspect SG28 E2E and cumulative gate jobs/logs for this revision, resolve reproducible failures, then isolated real cancellation and Plus backend termination validation. H2 OPEN.


## 2026-10-09 — SG28 UI result selectors made layout-independent
- Confirmación del código de UI: `src/components/Screen.tsx` solo renderiza `section[aria-label="Resultado"]` en ciertas disposiciones; en `fused` el componente `ResultPanel` se monta sin ese wrapper. El test SG28 buscaba exclusivamente esa sección, creando un fallo de HARNESS dependiente del layout, independientemente del resultado matemático.
- Lite commit `5ecbb2e495a3e157849aead7dfabcb5e3b57b6f4`: el test SG28 localiza resultados por `[data-result-request-id]` (atributo real de `ResultPanel`) y errores por `role=alert`, separando correctamente éxito/error. No se alteró producto.
- Estado: resultados del workflow SG28 sobre este SHA aún no verificados; el histórico antiguo de cumulative exitoso no certifica este cambio. Siguiente paso: recuperar CI y depurar rojos restantes con evidencia. SG28/H2 ABIERTOS.


## 2026-10-09 — SG28 fixed layout setup for Playwright
- Verificación del código: `useLayoutModeStore` por defecto es `split` si no hay persistencia, pero `Screen` solo ofrece botón `Calcular` dentro de `section[aria-label="Entrada"]` en esta disposición. El test SG28 dependía de ese botón sin fijar el layout; por tanto podía fallar según `localStorage`.
- Lite commit `ad4c399b76f07b031cf7ce7121c608ee39417378`: los dos tests SG28 fijan `precision-lab-layout-mode=split` mediante `page.addInitScript` antes de cargar App. Clasificación HARNESS/E2E; no hay cambio de producto.
- Sigue sin existir evidencia de PASS del nuevo workflow. El gate acumulativo SUCCESS disponible (run 37991876628) es anterior a SG28, no acredita estos cambios. Siguiente: obtener run/job y logs del SHA técnico actual, corregir rojos, ampliar a interrupción worker real y backend Plus. SG28/H2 ABIERTOS.


## 2026-10-09 — SG28 stale-output assertion does not require a result node
- Lite E2E SG28 original comprobaba `[data-result-request-id]` inmediatamente después de cancelar la PRIMERA operación pendiente. Al no existir resultado previo, `ResultPanel` puede no montar ese nodo: el assertion es inválido incluso ante cancelación correcta. Fix HARNESS en Lite `8091c4f72739776575524e90c04890d6eeebb1bd`: aserción de ausencia del marcador de respuesta obsoleta `999999` a nivel `body`, sin requerir un resultado que legítimamente no existe.
- Evidencia de CI reciente aún no accesible: el conector permite leer jobs por run ID, pero no listar corridas `push` por workflow; el histórico anterior no certifica este SHA. Sin PASS acreditado. Próximo paso: leer jobs SG28/cumulative recientes si aparece un run ID; completar verificación con worker real, luego backend Plus aislado. H2 ABIERTO.


## 2026-10-09 — SG28 Lite: CI verificado PASS en run 37999350568
- Evidencia directa GitHub Actions para SHA Lite `8091c4f72739776575524e90c04890d6eeebb1bd`: workflow SG28 `37999350568` COMPLETED/SUCCESS, job `114053353730`; log obtenido y confirmado: **2 Playwright tests PASS** (`Scientific real worker resumes ordinary calculation`; `Scientific can cancel and recover without stale results`), **typecheck PASS**. Enlace: https://github.com/c2melendez/precision-lab-lite/actions/runs/37999350568.
- Mismo SHA, gates adicionales obtenidos vía API GitHub y jobs: cumulative `37999350602` SUCCESS (job `114053352753`), build diagnostic `37999350623` SUCCESS (job `114053353745`), H1d reentry `37999350567` SUCCESS (job `114053352557`). Los cuatro gates coinciden exactamente con la versión técnica.
- **Acreditado**: cobertura SG28 Lite de cancelación/recuperación en UI con mock y cálculo ordinario con worker auténtico. **No acreditado**: terminación de un cómputo matemático real prolongado durante ejecución, concurrencia/estrés, ni cancelación backend Plus. EN-SG-28 y H2 completos permanecen ABIERTOS.
- Siguiente paso exacto: implementar/verificar prueba limitada de terminación de un worker real ocupado en entorno de CI aislado; en Plus comprobar explícitamente la diferencia entre abortar la petición del navegador y detener la computación en backend, con cancelación y recuperación trazable.


## 2026-10-09 — SG28 native Worker termination bounded test added
- Lite commit `3191e9d296deec42a7946a73b5e1dfa686b94748`: tercer test E2E SG28 agregado; usa Web Worker NATIVO creado desde Blob con cómputo acotado (400 ms) y comprueba llamada efectiva a `terminate()` tras «Detener cálculo», así como ausencia del resultado tardío. No usa entradas matemáticas extremas ni backend de producción.
- Esta prueba certifica, si pasa CI, **terminación de un worker auténtico bajo carga simulada**, pero NO ejecución/cancelación de SymPy/Algebrite real durante una operación compleja. Sigue pendiente recuperación tras terminación de carga nativa y cancelación del backend Plus.
- Estado del commit nuevo: **CI no verificada**, no declarar PASS adicional. Siguiente paso: leer job/logs del workflow SG28 del SHA `3191e9d`, ajustar harness si hay rojo, luego definir arquitectura Plus de ejecución interruptible aislada. H2 abierto.


## 2026-10-09 — SG28 native worker CI verified run 38000982016
- Evidencia GitHub Actions directa: Lite SHA `3191e9d296deec42a7946a73b5e1dfa686b94748`; SG28 run `38000982016` SUCCESS, job `114058691659`, log **3 Playwright passed (17.6s)** y Typecheck PASS. Incluye test de terminación de Web Worker nativo ocupado de manera acotada, worker simulado cancelación/recuperación y operación matemática ligera con worker real.
- Mismo SHA: cumulative run `38000982159` SUCCESS; Lite Build Diagnostic `38000982024` SUCCESS; H1d Reentry `38000982038` SUCCESS, verificados mediante lista de ejecuciones de GitHub.
- Alcance estrictamente acreditado: terminación de worker genuino de navegador bajo tarea controlada y recuperación UI bajo mock; NO prueba parada de tarea Algebrite real compleja ni detención servidor Plus. SG28 en Lite queda ampliado y acreditado parcialmente; H2/SG28 general ABIERTO. Siguiente paso: integración con tarea matemática realmente en curso en runner aislado, más arquitectura/prueba backend Plus cancelable.


## 2026-10-09 — SG28 compiled worker lifecycle test pending CI
- Lite commit `d9f36bde5759d2394ce6e9014137127e7d91c0b4`: cuarto E2E SG28 agregado. Captura URL del worker matemático compilado, termina una instancia después de enviar una operación pequeña y comprueba que una instancia nueva evalúa `2+3=5`. Test sin carga intensiva, acotado a 10 s, y sin modificar producto. **NO se ha verificado CI para esta adición**. Como la terminación ocurre inmediatamente, tampoco demuestra parada de un cálculo costoso ya en progreso. H2 permanece abierto.


## 2026-10-09 — SG28 four Playwright tests verified PASS
- GitHub Actions Lite SG28 run https://github.com/c2melendez/precision-lab-lite/actions/runs/38001591613, SHA `d9f36bde5759d2394ce6e9014137127e7d91c0b4`, job `114060683879`: **4/4 Playwright PASS (18.5s)**. Nueva prueba acredita terminación/recreación del worker matemático compilado con operación ordinaria. Gates del mismo SHA cumulative `38001591557`, build `38001591646`, H1d `38001591596`: SUCCESS.
- Acreditado: ciclo de vida de workers, cancelación bajo mock, worker nativo ocupado acotado y reinicio de worker matemático. Sin acreditar: cancelación de cómputo matemático prolongado ya iniciado y cancelación efectiva del servidor Plus. SG28/H2 abiertos a efectos integrales.


## 2026-10-09 — SG28 Plus isolated killable-process prototype
- Plus backend prototype added: `backend/app/services/interruptible.py` (`e3bf193e`), `backend/tests/test_in625_sg28_interruptible.py` (`44b92c78`), isolated workflow `.github/workflows/in625-sg28-backend-cancellation.yml` (`1a17e320`). Primitive uses a spawned child process, wall-clock timeout and terminate/kill cleanup, with smoke-result, bounded-timeout and recovery tests. No math endpoint/router or production behavior modified.
- CI run for latest Plus SHA not available yet at time of inspection; **NOT PASS**. This is a prototype only: HTTP request disconnect cancellation is NOT implemented, actual SymPy operations have NOT been integrated, and production isolation/resource quotas are NOT certified.
- Next: inspect new workflow run and logs, fix reproducible failures, then design safe request-to-process cancellation integration; SG28/H2 remain OPEN.


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


## 2026-10-09 — SG28 Plus genuine SymPy child-process regression added
- Plus test file `backend/tests/test_in625_sg28_interruptible.py` updated in commit `0c4db6237c5bfd6ee1843db7f8c9bfdb2df874d4`: two additional tests run a genuine, small SymPy derivative in a spawned child process and verify a subsequent real SymPy evaluation still succeeds after another worker times out and is killed.
- Expected isolated SG28 suite: 5 tests, **not yet verified by CI**. Unlike prior generic arithmetic tests, this confirms a genuine SymPy call can execute in a subprocess. It does NOT show cancellation of an in-progress expensive SymPy operation or live HTTP request disconnection; endpoints remain unchanged. H2 OPEN.


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


## 2026-10-09 — SG28 Plus browser cancel E2E and cumulative confirmed PASS
- GitHub Actions Plus SHA `086d9f678faf5f8f13aa4ec6a2707eebbedb73b5`: SG28 UI run `38011603975`, job `114092633887`, **1 Playwright PASS (4.3s)**; confirms visible Basic cancellation and recovery with simulated delayed HTTP result. Cumulative run `38011603949`: frontend job `114092633897` **751 PASS, 28 TODO**; backend job `114092634033` **575 PASS, 1 warning**. H1d run `38011603906` SUCCESS.
- All three workflows SUCCESS on the same SHA. No production SymPy cancellation upon HTTP request disconnect demonstrated; SG28/H2 OPEN pending safe backend integration and E2E evidence.


## 2026-10-09 — SG28 ASGI disconnect during active SymPy test awaiting CI
- Existing Plus SG28 bridge `backend/app/services/request_cancellation.py` already monitors ASGI `http.disconnect` and signals killable `run_bounded` child through threading.Event; experimental and NOT connected to production math endpoints. Existing tests cover ASGI fake disconnect and real loopback TCP disconnect/recovery.
- New Plus commit `618a24ebb77aa95e0b44af95bd1cbaa3718aa0c9`: `backend/tests/test_in625_sg28_request_cancellation.py` adds end-to-end in-process ASGI disconnect while spawned child actively runs SymPy differentiation (synchronized spawn event), then verifies fresh SymPy recovery. **CI results pending**: isolated SG28 `38012269370`, cumulative `38012269384`, H1d `38012269339` queued at check. SG28/H2 OPEN; public /evaluate route not yet connected.


## 2026-10-09 — Plus SG28 ASGI active-SymPy run certified
- Plus commit `618a24ebb77aa95e0b44af95bd1cbaa3718aa0c9` SG28 isolated workflow `38012269370`: **SUCCESS, 14/14 PASS in 9.85s** (job `114094683361`). Includes ASGI disconnect while active SymPy process differentiates, child interruption and subsequent fresh SymPy recovery.
- Plus cumulative `38012269384` SUCCESS: backend **576 PASS**, one warning (job `114094683544`); frontend **751 PASS**, 28 TODO (job `114094683353`), zero failures. H1d `38012269339` SUCCESS.
- This confirms experimental isolation/ASGI behavior, not public `/evaluate` cancellation or deployment readiness. SG28/H2 remain OPEN pending controlled production-route integration and compatibility/security assessment.


## 2026-10-09 — SG28 Plus ASGI handler cancellation: regresión publicada, CI por verificar
- Plus commit `1b4f6a1173bb192aaef7b02fbe3a74672a151d48` añadió `test_asgi_handler_task_cancellation_interrupts_child_and_recovers` en `backend/tests/test_in625_sg28_request_cancellation.py`: cancela una tarea ASGI mientras un proceso aislado ejecuta SymPy y exige recuperación posterior.
- Evidencia precedente válida: SG28 Plus `38012269370` SUCCESS (14/14), cumulative `38012269384` SUCCESS (backend 576, frontend 751); esos runs son de SHA anterior `618a24eb`, **no acreditan la prueba nueva**.
- Consulta de runs asociada al SHA nuevo devolvió 0, pero el conector solo enumera runs disparados por pull request; no permite afirmar que no haya corrida push. Estado de esta prueba: PENDIENTE DE EVIDENCIA CI.
- Siguiente paso exacto: identificar y revisar el SG28 workflow `in625-sg28-backend-cancellation.yml`, el acumulativo y H1d para SHA `1b4f6a1`; extraer logs y clasificar eventuales fallos. Antes de integrar `/evaluate` públicamente, demostrar compatibilidad MathResponse, limpieza de procesos y recuperación en test de integración aislado.
- SG28/H2 OPEN. No hay PASS nuevo ni cambio a endpoint público.


## 2026-10-09 — SG28 Plus concurrent cancellation isolation test
- Plus test commit `24d90b370bf9d5e619b415b3388283fade91bd9f`: nueva prueba `test_concurrent_request_disconnect_does_not_cancel_independent_request` en `backend/tests/test_in625_sg28_request_cancellation.py`. Valida que un disconnect cancele solo la operación afectada, sin impedir que una segunda solicitud independiente complete `2+3=5`.
- Complementa la prueba anterior de cancelación de tarea ASGI commit `1b4f6a1173bb192aaef7b02fbe3a74672a151d48`. No se cambió código de producto ni se conectó el puente experimental a `/evaluate`.
- **CI pendiente de verificar para ambos commits**: `fetch_commit_workflow_runs` devolvió lista vacía para el SHA anterior pero solo consulta runs de pull_request, no cubre push; por tanto el resultado no demuestra ausencia de ejecución. Nunca contar estas pruebas como PASS sin evidencia de job/log para SHA `24d90b3`.
- Siguiente paso: verificar workflow SG28 backend, cumulative y H1d del SHA técnico; inspeccionar jobs y logs, clasificar rojos y corregir. H2/SG28 OPEN.


## 2026-10-09 — SG28 Plus concurrencia SymPy real (CI pendiente)
- Plus commit `04d1d23ce237ec18879e95c12512771957b4c4e1` fortalece `test_concurrent_request_disconnect_does_not_cancel_independent_request`: ahora el primer proceso ejecuta SymPy activamente y señaliza su arranque mediante multiprocessing.Event; la solicitud sana ejecuta una segunda derivada real. El test exige cancelación del primer proceso y resultado independiente `3*x**2 + 2`.
- Sustituye la versión con stub sleep/add del commit `24d90b3` como evidencia objetivo de concurrencia; no modifica motores, endpoint público ni contrato MathResponse.
- El workflow `.github/workflows/in625-sg28-backend-cancellation.yml` incluye este archivo bajo `push` y ejecuta todo el paquete SG28; **no se ha verificado un run ni los logs para SHA `04d1d23`**. La consulta de runs por commit solo cubre pull requests y devolvió vacío para SHA anterior, sin demostrar ausencia de push.
- Siguiente paso exacto: revisar Actions y logs de SG28 + cumulative + H1d en Plus SHA `04d1d23`, corregir si hay fallos; no declarar PASS. Tras gate verde, diseñar integración segura de cancelación en `/evaluate` con límites de concurrencia y preservación de MathResponse. H2/SG28 OPEN.


## 2026-10-09 — SG28 concurrent workers start synchronization
- Plus commit `4de7358c944555728e13c246daeeb97879a7659d` refuerza el test SG28 de cancelación concurrente: segundo proceso real SymPy señaliza arranque mediante `multiprocessing.Event` antes de desconectar la primera solicitud. Conserva validación de resultado matemático independiente. Es cambio de test, no producto.
- La consulta de GitHub por SHA `04d1d23` devolvió 0 ejecuciones PR; ese endpoint excluye runs push. **No hay PASS/FAIL verificado para el nuevo SHA `4de7358`**, ni evidencia de gate acumulativo. No cerrar SG28/H2.
- Próximo paso: consultar GitHub Actions por workflow/branch para el SHA técnico, inspeccionar jobs y logs SG28, cumulative y H1d, corregir fallos verificados. No integrar aún el puente experimental con `/evaluate` sin pruebas de compatibilidad y recursos.


## 2026-10-09 — SG28 concurrent healthy SymPy calculation signal corrected
- Plus commit `9b2ecd96badf6583a8aea1e22bdafd799d3419d4` mueve `ready.set()` del worker sano a después de evaluar la derivada SymPy dentro de la prueba de concurrencia. Con ello la señal ya acredita que el cálculo sano se efectuó, en lugar de solo indicar entrada a la función.
- No hubo modificaciones de producto o endpoint público. La prueba aún no tiene evidencia CI acreditada para ese SHA. Consulta limitada por SHA de `4de7358` no devolvió runs de PR, sin cubrir push.
- Siguiente paso: confirmar run SG28 y gates acumulativos mediante listado de workflows por rama o UI de Actions y examinar logs. Corregir cualquier FAIL antes de integración pública de `/evaluate`. SG28/H2 sigue OPEN.


## 2026-10-09 — SG28 concurrency isolation with overlapping live workers, CI pending
- Plus commit `a6f28bb8fea21d246a34c956e16f040f6f02acec` improves backend SG28 concurrent cancellation regression: second worker computes actual SymPy derivative, signals readiness and remains alive on a multiprocessing release gate while the first active SymPy worker is disconnected/cancelled. The test checks healthy worker remains running and then returns `3*x**2 + 2` on release. This replaces weaker sequencing that could allow healthy operation to finish before cancellation.
- No product route change. **CI for exact SHA not yet verified**; GitHub commit-run connector only lists pull_request events and returns no push runs. Do not mark test PASS without actual job logs. SG28/H2 remains OPEN.
- Next: verify SG28 isolation workflow and cumulative gate for `a6f28bb` via full Actions listing, diagnose any failure, then plan bounded `/evaluate` integration only after reliable evidence.


## 2026-10-09 — SG28: servicio /evaluate real probado en puente aislado (CI pendiente)
- Plus commit `7966cba0e7379828b4a021f7c6670be63e56eae5` agrega `test_isolated_real_evaluate_service_preserves_results` parametrizado con `2+3`, `sin(30)` en grados y `1/4`. Ejecuta `app.services.evaluate_service.evaluate` dentro de `run_for_request`/`run_bounded` (spawn), no una función SymPy artificial, y verifica resultado numérico y presencia de AST. El archivo está incluido en el workflow SG28 existente.
- Alcance: compatibilidad preliminar del servicio matemático real con el puente experimental, **sin cablear la ruta FastAPI pública ni demostrar conservación completa de MathResponse**. Se requiere CI para SHA `7966cba0`; no declarar PASS sin logs. H2/SG28 OPEN.
- Próxima acción: revisar el workflow SG28 para este SHA, cumulative y H1d, clasificar resultados y abordar preservación de errores/contrato de la ruta en entorno aislado antes de modificar producción.


## 2026-10-09 — SG28 isolated evaluate symbolic preservation (CI pending)
- Plus commit `7bcdb5b32d16f66e10bd14ca686a215ac39d9c40` adds `test_isolated_real_evaluate_service_preserves_symbolic_result` to `backend/tests/test_in625_sg28_request_cancellation.py`. It checks that real `evaluate_service.evaluate('x+1', 'rad')` round-trips through the experimental spawned-process request bridge with symbolic expression, `is_numeric=False` and no numeric approximation.
- This supplements prior actual-service numeric tests commit `7966cba0` (2+3, sin(30) degrees, 1/4). No public /evaluate route or production math engine changed. **New SHA not verified PASS in CI.** GitHub connector's `fetch_commit_workflow_runs` covers only PR runs; public Actions API could not be accessed from this session. Do not infer that no push run occurred.
- Next: obtain SG28, cumulative and H1d job/log evidence for the technical SHA; classify/correct any failure. Then test full MathResponse/error preservation in an isolated adapter before considering a gated public route integration. SG28/H2 remains OPEN.


## 2026-10-09 — SG28 isolated evaluate error propagation regression (CI pending)
- Plus commit `223dcf76911a15b3a6c9c0f5b93434e579ccd31f` adds parametrized test for invalid evaluation (`1/0`, `x+(`) via actual `evaluate_service.evaluate` through isolated request bridge. It expects child failures to surface as `ComputationFailed`, not a successful value, with original exception type represented in diagnostic text. Exact exception expectations remain **unverified until CI**, and may require adjustment based on actual parser/domain classification.
- This does NOT establish preservation of public MathResponse error codes: the prototype wrapper currently converts subprocess exceptions into `ComputationFailed`. Production FastAPI `/evaluate` remains unchanged. H2/SG28 OPEN.
- Follow-up: review SG28 run/logs for SHA `223dcf7` plus cumulative/H1d, classify any failures; establish typed error transmission in prototype and compatibility tests before public endpoint integration.


## SG28 Plus — CI verificado: run 38015912720
- Workflow `IN625 SG28 Plus Backend Isolation Prototype`: SUCCESS, job `sg28-backend-isolation` `114105984641`; SHA técnico `223dcf76911a15b3a6c9c0f5b93434e579ccd31f`; rama `qa/syntax-audit-in625-a1`; logs: `22 passed in 12.10s` (3 ficheros pytest SG28: interruptible, request_cancellation, loopback_http).
- Evidencia: https://github.com/c2melendez/precision-lab-plus/actions/runs/38015912720
- Alcance aprobado: pruebas del prototipo de aislamiento/cancelación del backend en ese SHA. No acredita integración de `/evaluate` público ni gate acumulativo completo; H2/SG28 permanece OPEN.


## 2026-10-09 — SG28 typed child errors implemented (CI pending)
- Plus commit `201184f617c9107a6bf50338d2d91d86d163ac2a` modifies experimental `backend/app/services/interruptible.py`: worker sends `(exception class name, error message)` as structured failure payload; `ComputationFailed.error_type` retains exception identity and traditional text remains compatible.
- Plus commit `2010e21cf0ac4022c616938a4cfdc5009e10e4a6` extends `test_isolated_real_evaluate_service_rejects_invalid_input` to assert `error_type` across child boundary.
- No FastAPI public `/evaluate` route modified, no public MathResponse error mapping implemented; H2/SG28 remains OPEN. Prior confirmed SG28 run `38015912720` 22/22 PASS applies to older SHA `223dcf7`, **not** the new two commits; pending fresh SG28 + cumulative gates.


## 2026-10-09 — SG28 structured error recovery regression (CI pending)
- Plus commit `0457e1ed2ade5fa2afab61433355eefcfbc4710b`: adds subprocess regression asserting `ComputationFailed.error_type == 'ValueError'`, preserves error details and verifies that a following calculation succeeds. Pure regression test; does not change public `/evaluate`.
- Previous 22/22 PASS run `38015912720` is for SHA `223dcf7` and does NOT certify current SG28 commits `201184f`, `2010e21`, `0457e1e`. GitHub SHA query only covers PR runs; push workflow run remains unverified. H2/SG28 OPEN.


## 2026-10-09 SG28 Plus proof
- Plus SG28 run 38018275394: SUCCESS, 23 passed / 0 failed, SHA 0457e1ed2ade5fa2afab61433355eefcfbc4710b.
- Prototipo aislado confirmado, endpoint publico /evaluate aun no integrado. H2 OPEN.


## 2026-10-09 — SG28 MathResponse serialization contract probe
- Plus commit `85e1f6307ec0a7164e924f2a1659efacaacd9a7d`: adds test which returns real `MathResponse` Pydantic instance from the isolated process after actual evaluate-service computation, asserting EVALUATE, SCALAR, approx, request_id, JSON serialization and no detailed steps. This is a **synthetic contract projection**, not full actual endpoint mapping.
- CI unverified for SHA 85e1f63; previous SG28 evidence 23 PASS on SHA 0457e1e (run 38018275394). Public `/evaluate` unchanged, H2/SG28 remains OPEN.


## 2026-10-09 — SG28 MathResponse error transport probe (CI pendiente)
- Plus commit `7547f2efbb941c0a72d92602d8b3b4d614f03a29` añade regresión que devuelve un `MathResponse` de error construido en proceso aislado, comprobando `success=False`, `ErrorCode.PARSE_ERROR`, operation EVALUATE, mensaje y serialización JSON.
- Prueba de transporte estructural del esquema; **no implica que la ruta pública /evaluate cree la respuesta bajo aislamiento ni que su mapeo de excepciones haya sido comprobado**. Última evidencia SG28 23/23 PASS en run `38018275394` corresponde SHA `0457e1e`. SHA nuevo sin verificación CI. H2 OPEN.


## 2026-10-09 — SG28 typed child errors versus public ErrorCode (pending CI)
- Plus technical commit `e0be97ca33df4b026247d5edc740b799fa86c885` adds parametrized bridge test for real `evaluate_service.evaluate` errors: DomainErrorResult -> DOMAIN_ERROR and ParseSecurityError -> PARSE_ERROR. Checks typed transport and test-local ErrorCode mapping. It does NOT implement the real router adapter, nor demonstrate actual public MathResponse handling.
- Last SG28 CI accredited: `38018275394`, 23/23 PASS at earlier SHA 0457e1e. New change must be checked in workflow and cumulative gate. H2/SG28 OPEN.


## SG28 staged endpoint integration — 2026-10-09
- Plus commit `0640354e36c46bc00bb344f38af1936db6761f4d` adds **opt-in** `SG28_EVALUATE_ISOLATION=1` to actual `/api/v1/evaluate` service execution. Flag defaults off; original route remains unchanged when off. Experimental path calls `run_for_request` on actual `evaluate_service.evaluate`, handles typed child failure to existing `ErrorCode`, timeout and cancellation; public MathResponse formatting remains on parent request handler.
- Plus commit `ed11f9b7bfae7e8c3d070bb10479448e479acc3e` adds HTTP `TestClient` comparison for actual public `/evaluate`, isolation off/on: arithmetic, degrees trig, parse/domain errors and selected response fields.
- **CI not yet verified** for these commits. Integration is not production-enabled, unbounded parent-side formatting still exists, and resource/concurrency caps and cancellation E2E must be proved before enabling. H2 OPEN. Previous prototype run 38018275394: 23/23 PASS at older commit.
- Next: verify SG28 backend workflow and cumulative CI on `ed11f9b`, fix mismatches, add real HTTP disconnect/recovery test for production route under opt-in and concurrency controls, then gate deployment.


## 2026-10-09 — SG28 CI activation fix for endpoint integration
- Plus commit `cd7bbce8dca4dcbbd4f26fe5ba710d1199b143f1` extends workflow `.github/workflows/in625-sg28-backend-cancellation.yml` push paths: `backend/app/routers/evaluate.py`, `backend/app/services/evaluate_service.py`, `backend/app/schemas/{requests,responses}.py`. Prior workflow did not trigger on endpoint-only source changes; now expected to cover integrated endpoint regressions.
- Expected automatic workflow push for this workflow-file commit. **Pending inspection of run ID, logs, and PASS/FAIL**. Do not claim new CI success; SG28/H2 OPEN; experimental flag remains OFF by default. Next verify HTTP off/on test and run cumulative.


## SG28 — CI confirmado 31 PASS sobre endpoint opt-in
- Plus run 38021514258, job 114123323554: SUCCESS, 31 passed, 1 warning in 16.77s, SHA cd7bbce8dca4dcbbd4f26fe5ba710d1199b143f1, branch qa/syntax-audit-in625-a1. Workflow SG28 Backend Isolation incluye test HTTP de /evaluate aislamiento 0/1 y error/resultado. URL https://github.com/c2melendez/precision-lab-plus/actions/runs/38021514258
- Integra prueba HTTP real por TestClient, no certifica cancelación frontend→backend mediante desconexión TCP, cuotas/concurrencia, ni gate acumulativo. H2 OPEN. Siguiente paso preciso: prueba HTTP TCP real contra /api/v1/evaluate con bandera on, confirmar cancelación del proceso y recuperación; añadir cuotas antes de producción; ejecutar CI acumulativo.


## SG28 — prueba de desconexion TCP del endpoint real publicada (CI pendiente)
- Plus commit `d1e6c3e11c42e11ae0aa9cfd6893ee6cf9275ef5` añade en `backend/tests/test_in625_sg28_loopback_http.py` escenario opt-in real `POST /api/v1/evaluate`: request HTTP TCP, desconexión durante worker prolongado, comprobación de interrupción observada por bridge y nueva solicitud de recuperación. El protocolo aún necesita logs CI y posible ajuste por middleware ASGI. **No certificada hasta correr.**
- Evidencia anterior acreditada: SG28 31 PASS y 1 warning en Plus run 38021514258 SHA cd7bbce. H2 OPEN; flag desactivado por defecto. Siguiente: consultar run para SHA d1e6c3e, diagnosticar rojo y mejorar prueba del cleanup de procesos/concurrencia antes de producción.


## 2026-10-09 SG28 actual HTTP disconnect gate FAIL
- Plus GitHub Actions run `38022234145`, SHA `d1e6c3e11c42e11ae0aa9cfd6893ee6cf9275ef5`, job `114125506307`: FAILURE, `31 passed, 1 failed, 1 warning in 19.33s`. Failed `test_public_evaluate_disconnect_cancels_isolated_worker_and_recovers` at `backend/tests/test_in625_sg28_loopback_http.py:128`: `AssertionError: Client disconnect did not interrupt public evaluate`. URL https://github.com/c2melendez/precision-lab-plus/actions/runs/38022234145
- Prior 31 PASS (38021514258) remains evidence solely for basic HTTP parity. **Full endpoint disconnect NOT certified.** Code inspection: `app.main` uses `@app.middleware('http')` and `call_next`, while bridge uses `request.is_disconnected()`. Middleware ASGI receive propagation is a plausible hypothesis, NOT demonstrated root cause. Must instrument receive/disconnect, test worker termination, and fix actual propagation or build explicit cancellation by request ID. No weakening assertion to fake PASS; flag default OFF. H2 OPEN.
- Precise next action: reproduce/instrument real TCP test on backend pipeline; inspect whether ASGI http.disconnect reaches endpoint, whether run_for_request raises, and whether cleanup completes. Implement narrowly scoped fix and rerun SG28 plus cumulative gates.


## SG28 — corrección experimental ASGI disconnect tracking (pendiente CI)
- Plus commits `ed77937562e51c6e8dfa8f292e8d74572e50a400`, `77ceef6c8bcb2c521b408432d13ec08bdd4d221a`, `0d95fe2dca2c73ee12332c8b0b0a1bb1e232da0e` crean `DisconnectTrackingMiddleware` ASGI externo en `backend/app/main.py`, registra evento `http.disconnect` en scope y permite a `run_for_request` detectarlo aun cuando middleware HTTP consume el mensaje. No se modifica el test para fabricar verde.
- Workflow `in625-sg28-backend-cancellation.yml` commit `3af8bd7e65d0e336c130901eddf1c9c581aa69ab` añade paths `backend/app/main.py` y `backend/app/services/disconnect_tracking.py` para disparar SG28.
- Evidencia anterior fallida: run 38022234145, 31 PASS/1 FAIL, el test real TCP esperaba cancelación no observada. **Nueva corrección CI no verificada**. Siguiente paso EXACTO: leer run SG28 de SHA `3af8bd7`, analizar resultado y ajustar si persiste el fallo; asegurar cancelación y cleanup real, luego gates acumulativos. Mantener `SG28_EVALUATE_ISOLATION` desactivado por defecto. H2 OPEN.


## 2026-10-09 — SG28 disconnected HTTP gate PASS
- Plus workflow run `38023015566`, job `114127871831`, SHA `3af8bd7e65d0e336c130901eddf1c9c581aa69ab`, push branch `qa/syntax-audit-in625-a1`: SUCCESS, `32 passed, 1 warning in 15.22s`. Real TCP disconnect + recovery test now PASS after outer ASGI disconnect tracker fix. https://github.com/c2melendez/precision-lab-plus/actions/runs/38023015566
- This validates current test assertions, not full proof of child-process resource reclamation or server concurrency budgets. SG28/H2 OPEN; flag stays OFF by default. Next implement measurable child cleanup/concurrency gates and frontend end-to-end cancellation, run cumulative regression.


## SG28 pending gate — 2026-10-09
Plus commits 6d14933, fcf966c, b5d6b6c add isolated concurrency admission (2 default), 503 capacity response, and rejection/recovery test. CI pending. Latest certified run 38023015566 (32 PASS) predates these changes. Next verify SG28 CI for b5d6b6c, diagnose failures, then test actual process cleanup and frontend E2E. H2 OPEN; flag OFF.


## 2026-10-09 — SG28 admission gate verified
- Plus run 38023325162, job 114128810903, SHA b5d6b6c9af0185abcb5b9270339ba862f6befca5: SUCCESS, 33 passed, 1 warning in 12.80 s; includes concurrency capacity rejection/cancellation/recovery gate. https://github.com/c2melendez/precision-lab-plus/actions/runs/38023325162
- H2 OPEN: semaphore limits concurrent jobs within each application process, not across multiple replicas; must still verify actual child cleanup, load, cumulative gates and UI E2E. SG28 flag OFF by default. Next test measured child-process termination and cleanup under cancellation.


## SG28 — observable child PID termination regression pending CI
- Plus commit 88bfd0f52b21e94d4b46d84ab3fec5233d44cab8 adds POSIX-only parametrized subprocess worker PID liveness tests for timeout and explicit cancellation, with real SymPy active worker, os.kill(pid, 0) absence assertion after interruption and new calculation recovery.
- This is test implementation only. Latest CI accredited 33 PASS on run 38023325162 (SHA b5d6b6c). New SHA 88bfd0f not CI verified. SG28/H2 OPEN. Next inspect SG28 Actions run for SHA 88bfd0f, diagnose failures and then progress frontend E2E/cumulative gates.


## 2026-10-09 — SG28 real child PID cleanup PASS
- Plus workflow run `38024028278` job `114130927523`, commit `88bfd0f52b21e94d4b46d84ab3fec5233d44cab8`, branch `qa/syntax-audit-in625-a1`: SUCCESS, `35 passed, 1 warning in 15.92s`. Real POSIX PID disappearance on timeout/cancellation and subsequent healthy compute covered. https://github.com/c2melendez/precision-lab-plus/actions/runs/38024028278
- This proves measured child PID cleanup in CI on Linux; does not yet certify frontend stop-button end-to-end, complete load/replica resource limits, or cumulative gates. SG28/H2 OPEN; opt-in flag OFF by default. Next inspect frontend cancellation, add real browser E2E and run cumulative gates.


## 2026-10-09 — SG28 Plus real browser evaluation over opt-in isolated backend (CI pending)
- Inspected frontend E2E: existing `frontend/e2e/in625-h2-sg28-cancel.spec.ts` tests browser stop + stale-response guard using mocked delayed route; frontend `BasicMode.tsx` already uses AbortController. This is not full browser-to-server cancellation evidence.
- Plus technical commits `d6db0f9e4dcca773377516b90405e1cc28fc8f03`, `0abf3aaa3ee6e77711a79d1df66cf6f4cc18e054`, `e13e8ab214b7be9558b273d873654f437e956bfa`: Playwright starts test backend with SG28_EVALUATE_ISOLATION from CI env; second Playwright browser test sends unmocked `2+3` to actual isolated `/api/v1/evaluate` and verifies HTTP MathResponse and UI; SG28 Plus UI workflow enables flag ONLY in CI and watches related paths.
- Last verified backend isolation run 38024028278: 35 PASS at SHA 88bfd0f. New UI workflow SHA e13e8ab has **not been checked**. Full browser-triggered cancellation of server workload, load/cumulative gates and cross-replica constraints still OPEN. Flag remains off in production. Next: inspect SG28 UI Actions for e13e8ab, fix any regressions; then add deterministic browser-to-server cancellation evidence without mocks and certify cumulative gates.


## SG28 Plus browser isolated API parse-error recovery — 2026-10-09
- Plus technical commit adc1eb71682c985f7dd4a47d607ef8474d7b7658 appends Playwright browser E2E using real /api/v1/evaluate (no mocks) under CI opt-in flag: invalid x+( -> PARSE_ERROR then 4+5 -> 9 and UI display, verifies recovery. Not a full real browser stop-to-server cancellation proof.
- CI for UI commits e13e8ab and adc1eb7 not verified yet through available listings; do NOT infer PASS. Last accredited SG28 backend isolation 35 PASS run 38024028278. Next inspect `IN625 SG28 Plus UI Cancellation E2E` workflow run for adc1eb7, fix failures, then implement deterministic browser cancellation-to-server observable proof and cumulative gates. H2 OPEN.


## 2026-10-09 — SG28 UI Playwright 3/3 verified
- Plus run `38024683700`, job `114132893364`, SHA `adc1eb71682c985f7dd4a47d607ef8474d7b7658`, branch `qa/syntax-audit-in625-a1`, event push, SUCCESS: `3 passed (8.2s)` on Chromium desktop. Test cases: browser actual isolated backend evaluate; mocked pending request stop and stale-response recovery; browser actual parse error followed by healthy evaluate. https://github.com/c2melendez/precision-lab-plus/actions/runs/38024683700
- UI CI PASS does not demonstrate server worker cancellation by real browser button; must add deterministic unmocked end-to-end stop-to-child-termination evidence and cumulative gates. Latest backend SG28 run `38024028278`: 35 PASS. H2 OPEN, default experimental isolation OFF.


## SG28 follow-up — 2026-10-09
- Plus `0353aa97b2f594fde8320b4a95e247e3cc13d910`: correct outdated request bridge docstring: route integrated when `SG28_EVALUATE_ISOLATION=1`.
- Plus `7257c1e2acbfd0a67f5639a27ee77d6ee3e3f194`: add FastAPI TestClient gate asserting structured HTTP 503 MathResponse when isolated-worker admission is exhausted. CI of this commit not yet verified; previous accredited backend run 38024028278 (35 PASS), UI run 38024683700 (3 PASS).
- Still OPEN: deterministic, unmocked browser stop-button -> server worker PID teardown, full cumulative gates. New test does not pretend to cover these. Flag OFF by default. Next inspect backend SG28 CI for 7257c1e, fix regressions, continue UI-to-server cancellation proof.


## SG28 follow-up 2026-10-09 — default route isolation safety
- Plus commit `57a4af0156a9bbca1953e5241d0fe666019938c0` adds regression on real FastAPI TestClient: with `SG28_EVALUATE_ISOLATION` unset, `/api/v1/evaluate` bypasses `_ADMISSION` and returns 2+3=5, ensuring default behavior unaffected by quota. Previous commit `7257c1e2acbfd0a67f5639a27ee77d6ee3e3f194` adds 503 response contract test with isolation enabled and capacity depleted.
- CI pending for these two new tests. Last verified Plus backend 35 PASS run 38024028278, UI 3 PASS run 38024683700. `fetch_commit_workflow_runs` listed no runs for 7257c1e (this connector search may omit push runs; not evidence of missing CI). Next read SG28 backend workflow run at SHA 57a4af0 and resolve any failure. True browser stop -> server child PID termination remains unproven. H2 OPEN.


## 2026-10-09 — SG28 backend 37 PASS verified
- Plus Actions run 38025649681, job 114135816966, commit 57a4af0156a9bbca1953e5241d0fe666019938c0, success: 37 passed, 1 warning, 20.22s. Confirms HTTP 503 exhausted-capacity contract and default-mode bypass of experimental SG28 quota. https://github.com/c2melendez/precision-lab-plus/actions/runs/38025649681
- Previously SG28 UI Playwright 3 PASS run 38024683700. H2 OPEN: full unmocked browser stop-button to actual backend child termination still missing, cumulative gates pending. Experimental isolation OFF by default.


## SG28 Plus unmocked browser stop/recovery test — CI pending
- Plus commit dca1970f9f1018da6f8bbea1a57e344deed87a6b appends a Playwright test to frontend/e2e/in625-h2-sg28-cancel.spec.ts which sends actual /api/v1/evaluate from browser, clicks Detener cálculo and verifies 4+5=9 on subsequent request, with no page.route mocks.
- CI for dca1970 remains unverified. This does not establish that child PID was active at click or actually reaped by browser cancellation; observable backend process probe still required. Previously certified backend 37 PASS run 38025649681 and UI 3 PASS run 38024683700. H2/SG28 OPEN, experimental flag OFF by default.


## 2026-10-09 — SG28 UI E2E 4/4 verified
- Plus run 38026273274, job 114137669432, SHA dca1970f9f1018da6f8bbea1a57e344deed87a6b, SUCCESS, Chromium desktop 4 passed in 10.2 s. Fourth unmocked browser HTTP cancellation and recovery test passed. https://github.com/c2melendez/precision-lab-plus/actions/runs/38026273274
- Backend last accredited 37 PASS run 38025649681. Remaining H2 SG28 gap: deterministic evidence child process active when browser presses stop and same PID reaped by server cancellation; cumulative gates not yet certified. Experimental isolation OFF by default. H2 OPEN.


## SG28 2026-10-09 — optional PID lifecycle logging (CI pending)
- Plus commit a68a37dac225724e571012bef696d4c19f33906b adds SG28_CI_OBSERVE opt-in child PID START/FINISH log in interruptible.py. Plus 4bb96be5f222dea0574c448918ced022d795feb9 enables flag in UI workflow and adds monitored path.
- CI result unverified. This instrumentation alone does NOT prove browser Stop cancels specific active child; timestamps/cancel reason/identity correlation still needed. Previous backend 37 PASS run 38025649681 and Plus UI 4 PASS run 38026273274. H2 remains OPEN, production flags OFF.
