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
