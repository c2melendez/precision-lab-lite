# Current Certification State

## Estado vigente — 2026-10-14 UTC / 2026-10-13 Honduras
Esta sección prevalece sobre las fotografías históricas conservadas debajo.
- Rama canónica bilateral: `qa/syntax-audit-in625-a1`.
- SY-E-04 confirmado: Lite SHA b24d252e8e4c9ea2e2600179a086adfd67342045 cumulative 38511416734, H1d 38511416741 y build 38511416781 SUCCESS; Plus SHA f5624448180965193488de1b1f6596d807bf9abb cumulative 38511428018 y H1d 38511427856 SUCCESS. Resultado 10^-3 = 0.001.
- SY-E-05 confirmado en alcance parcial: Lite SHA 0ae996a756a7d4cd52e5bc7b58f26a9cde28672b cumulative 38512067119, H1d 38512066234, build 38512066314 SUCCESS; Plus SHA 09aee8bc792a4f734b631a9ec7a89cfcfbcc540d cumulative 38512070814, H1d 38512070837 SUCCESS. Lite 1159 PASS + 30 TODO; Plus backend 1025 PASS + 1 XFAIL y frontend 757 PASS (omisiones no cuentan como PASS).
- Oráculo SY-E-05 preserva fixture 2^{2^{2}}=16 y agrega controles 2^{3^{2}}=512 y (2^{3})^{2}=64 para detectar asociación incorrecta. Lite prueba fuente LaTeX → parser → compileNumeric; Plus prueba POST /api/v1/evaluate con expresión explícita traducida. No implica MathLive/teclado/UI de Plus.
- CI: acumulativo bilateral y build Lite ahora incluyen pull_request además de push y workflow_dispatch. H1d bilateral conserva eventos y añade exclusión documental en PR. push y PR excluyen cambios solo qa/certification/** o **/*.md; cambios mixtos técnicos sí ejecutan gates. Los nuevos push del SHA correcto fueron observados; el comportamiento PR todavía no tiene evento nuevo de evidencia.
- SY-E-06 publicado: Lite SHA aa577a47c189f4ab5289addbf006a6d6b90099d9 en tests/syntax309SyEExponent.audit.test.ts; Plus SHA 824175e28213055ac913b20b141acb70f96c4a6b en backend/tests/test_syntax309_sye_exponent.py. Comparar ambas representaciones contra ocho anclas independientes: x=0,1/16,1/4,1,4,9,16,100; raíces 0,0.25,0.5,1,2,3,4,10.
- Gates SY-E-06: Lite cumulative 38512329462, H1d 38512329538, build 38512329554; Plus cumulative 38512334793, H1d 38512334857. Última observación IN_PROGRESS: NO declarar PASS aún.
- Alcance SY-E-06: testigos finitos sobre x>=0, no demostración simbólica general ni certificación de ramas complejas. Plus usa backend explícito, sin acreditar fuente LaTeX de UI.
- Syntax309 OPEN; IN625 H2/SG28 OPEN y DIST multinodo BLOCKED hasta evidencia de nodos independientes. SY-P-23 XFAIL y TODO permanecen abiertos.

### Siguiente paso exacto
1. Consultar los gates SY-E-06 anteriores y jobs/logs del SHA correcto; diagnosticar y corregir cualquier rojo sin alterar anclas matemáticas.
2. Solo con CI verificada registrar PASS de estos testigos reales acotados. Mantener los gaps de UI/teclado y dominios no probados.
3. Iniciar SY-E-07 oficial x^{0.5} equivalente a sqrt(x), usando las mismas anclas reales independientes y trazabilidad desde syntax309_cases.jsonl; validar fuente en Lite y distinguir traducción backend de Plus.
4. Sincronizar CURRENT_STATE y EXECUTION_LOG; los commits solo documentales no deben relanzar CI.


Actualizado: 2026-10-14 (UTC)
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


## SG28 UI run 38026545558 — 2026-10-09
- Plus run 38026545558 at commit 4bb96be5f222dea0574c448918ced022d795feb9: SUCCESS, Chromium Playwright 4 passed (10.7s), job 114138483037. Opt-in SG28_CI_OBSERVE instrumentation configured, but fetched job output did not expose SG28_CHILD_START / SG28_CHILD_FINISH. Therefore PID-to-browser-stop causality is still NOT evidenced. https://github.com/c2melendez/precision-lab-plus/actions/runs/38026545558
- Next require correlated child PID lifecycle captured as test artifact or assertion, not console-only logging; deterministic active compute before clicking Stop, then same child PID confirmed absent/reaped after. Backend previous 37 PASS on 38025649681; H2 OPEN; production flag OFF.


## SG28 CI verification 2026-10-09 — run 38027501493
- Plus UI workflow SUCCESS at commit 4b941c7730916758fb64f8b0af7b98122b81e489, job 114141360937: Chromium Playwright 4 PASS (8.3s), 0 FAIL. The webserver env propagation change did not regress tests.
- In the fetched job log, zero `SG28_CHILD_START` and zero `SG28_CHILD_FINISH` lines appear. This is absence of log evidence, not proof processes did not run. Browser Stop -> specific live PID -> reaped causal proof remains OPEN, as do cumulative gates. https://github.com/c2melendez/precision-lab-plus/actions/runs/38027501493
- Backend last verified SG28 37 PASS run 38025649681. Keep SG28 flag default OFF; H2 OPEN. Next capture explicit backend process evidence as test artifact or observable assertion, not just stdout.


## SG28 correlated browser-to-child PID CI gate — 2026-10-09 (PENDING CI)
- Plus commits `8d09cb985d154da60001bc7068a9cdfa91378059` records opt-in JSONL child lifecycle events with pid and monotonic time; `fa6fdd02554a60d62d92b8ed73fa68cd0b4af78b` introduces slow 7+11 real evaluate test-only workload protected by SG28_CI_SLOW and SG28_CI_OBSERVE; `58947610e39cdafd283c0151bbff684d64e1fe6d` propagates CI flags/file path to Playwright webserver; `c6af3494122a785107c9b42fc7772b3817ff4c01` configures CI event file; `09f343be89f93c77649270730878c150e1ea181a` adds browser real Stop test observing live child PID, same pid finish, PID not alive, recovery; `46042803756ef4fb4ca2c292174b80f8c4dc5f0c` forces --workers=1 to correlate; `ec5c59e2ea3f3c5d3ec2ee70288b97eb694003d5` additionally requires PID finish <3.8s from start of 4s slow workload.
- CI NOT VERIFIED. Latest credited Plus UI 4 PASS run 38027501493, backend 37 PASS run 38025649681. Next inspect `IN625 SG28 Plus UI Cancellation E2E` run for SHA ec5c59e and diagnose any failure. Do not certify causal PID gate before PASS. H2 OPEN, default isolation OFF; cumulative gates still pending.


## 2026-10-09 — SG28 CI fail-closed PID evidence gate
- Plus commit `47ea91fa5238dbb377015035ee9cfbe5b308f1d6` modifica `frontend/e2e/in625-h2-sg28-cancel.spec.ts`: si la prueba Linux CI carece de `SG28_CI_EVENT_FILE`, falla explícitamente en lugar de SKIP silencioso. Fuera de Linux se mantiene SKIP de la prueba específica de PID.
- Clasificación: mejora del oráculo/gate de certificación; sin cambios en motor matemático ni producción. No acredita terminación de PID hasta verificar el run SG28 UI del SHA técnico, logs y aserciones.
- Bloque siguiente: verificar corrida SG28 UI de Plus para SHA `47ea91fa`, analizar fallo si aparece, y acreditar cancelación correlacionada + gates acumulativos Lite/Plus. H2 sigue OPEN. Aislamiento de Plus continúa OFF por defecto.


## 2026-10-09 — SG28 Plus browser-to-child PID causality and cumulative gates VERIFIED
- Verified Plus run `38028402692` at technical SHA `47ea91fa5238dbb377015035ee9cfbe5b308f1d6` (`qa/syntax-audit-in625-a1`): `IN625 SG28 Plus UI Cancellation E2E` SUCCESS, job `114144039947`, Chromium desktop **5/5 PASS, zero skip**. Fifth test explicitly observes same live PID after browser evaluation, clicks Stop, asserts matching finish and PID no longer alive, checks short termination interval, and verifies successful `4+5=9` recovery. CI env contains `SG28_CI_EVENT_FILE=/tmp/sg28-plus-e2e-events.jsonl` and isolation/observe/slow flags enabled only in CI. This closes the missing causal PID evidence for this isolated Linux setup, not production rollout.
- Same SHA Plus H1d run `38028402704` SUCCESS, job `114144039643`. Plus cumulative run `38028402702` SUCCESS; frontend job `114144039687` Vitest **751 passed / 28 TODO**, backend job `114144039789` pytest **599 passed / 1 warning**. Logs show jsdom nonblocking `Not implemented: navigation (except hash changes)` warning output; no test failure reported.
- Status: SG28 Plus causal worker cancellation E2E **VERIFIED** and Plus cumulative **PASS**. Do not certify H2 bilaterally until verifying Lite full relevant gates, required tablet/mobile scope and contract-level coverage; do not infer cross-replica resource guarantee. `SG28_EVALUATE_ISOLATION` remains opt-in and OFF by default; no production change authorized.
- Next exact step: inspect Lite SG28 real-worker and cumulative gates on current technical SHA, reconcile Plus tablet/mobile scope and cross-replica resource limitation, then record H2 bilateral outcome or precise BLOCKED/MANUAL exceptions. Do not rerun historic Plus jobs merely to prove environment; current SHA provides evidence.


## 2026-10-09 — H2 SG28 responsive E2E expansion (CI verification pending)
- Lite technical commit `59fe42e578c06b591e4ddf77dfbf99f06a742760` updates `.github/workflows/in625-sg28-scientific-cancel.yml` to run existing E2E across `desktop-chromium`, `tablet-chromium`, `mobile-chromium` instead of desktop only. Observed Lite SG28 run `38028833165` in progress for this SHA; Lite cumulative `38028833158`, H1d `38028833081` and build `38028833072` also in progress when queried. No PASS declared.
- Plus technical commit `b8152edff7c8f043c5dd3477914854fb2ef5ad28` updates `.github/workflows/in625-sg28-plus-ui-cancel.yml` to run all three Chromium projects with `--workers=1`; PID evidence flags remain test-only (`SG28_CI_EVENT_FILE`, OBSERVE, SLOW, ISOLATION). New Plus run not yet discovered at last query; previous desktop 5/5 PASS run `38028402692` retained as evidence.
- Next step: inspect GitHub Actions run IDs and full logs for these technical SHA, classify responsive failures (product versus harness/viewport), correct and re-run; finish bilateral H2 gate reconciliation. Do not interpret an in-progress run as PASS or activate Plus isolation in production.


## 2026-10-10 — IN625 H2 SG28 responsive and cumulative CI VERIFIED
- Lite SG28 `38028833165` SHA `59fe42e578c06b591e4ddf77dfbf99f06a742760`: SUCCESS **12 Playwright passed** on desktop/tablet/mobile (4 cases x 3 profiles), job `114145311338`. Lite cumulative `38028833158` same SHA SUCCESS **1036 Vitest passed / 30 TODO** (job `114145311200`). Lite Build `38028862032` SHA `668d638abc6e974623a647b8a062a9b80673a485` SUCCESS; is docs build, not standalone SG28 evidence.
- Plus SG28 `38028840428` SHA `b8152edff7c8f043c5dd3477914854fb2ef5ad28`: SUCCESS **15 Playwright passed** (5 cases x 3 viewport profiles), job `114145334232`; includes causal browser Stop -> same PID finish + process exit + recovery under CI-only isolation. Plus cumulative `38028840443` same SHA SUCCESS frontend **751 passed / 28 TODO** job `114145334293` and backend **599 passed / 1 warning** job `114145334391`; Plus H1d `38028840455` same SHA SUCCESS **5 passed** job `114145334341`.
- Existing capabilities outside automated test coverage and multireplica resource limitations must remain explicitly documented; no production flag changes. Next: reconcile H2 bilateral acceptance and exceptions with original SG28 contract; decide if functional CI certification can close with deploy limitations separated, then proceed in execution order to Syntax 309 only if contract permits.


## 2026-10-10 — SG28 final-edge coverage added; CI PENDING
- Plus technical commit `28299c2c50ea8726b10555ee231e528b4ddb9960`: backend `tests/test_in625_sg28_request_cancellation.py` adds 4 sequential cycles of real child worker cancellation via request disconnect, asserting subsequent isolated request executes and no admission capacity leaks. Target SG28-E2E-07 (backend component evidence; not full UI navigation).
- Plus technical commit `ff60d28e50ca3128afe3e50760e0669591b02f61`: backend `tests/test_in625_sg28_loopback_http.py` adds baseline vs isolation real `/api/v1/evaluate` MathResponse field parity for arithmetic, symbolic, and parse-invalid expressions. Target SG28-E2E-06/09 limited examples. Neither technical commit changes production defaults; SG28 flag OFF.
- CI started for Plus SHA `ff60d28e`: SG28 Backend Isolation Prototype run `38030359435`, cumulative `38030359443`, H1d `38030359453` all observed IN_PROGRESS. Do not count newly added tests PASS until results/logs verified. Previous bilateral responsive CI results remain credited.
- Remaining: inspect latest gates and fix regressions, explicit UI module-change/close-view case, bounded multi-cancel resource check, post-result SymPy work budget, multi-replica manual risk, contract matrix reconciled. H2 remains OPEN.


## 2026-10-10 — SG28 added backend regression verified
- Plus SG28 backend prototype run `38030343425` SHA `28299c2c` SUCCESS **38 passed / 1 warning**, including newly added four repeated cancellation/recovery cycles.
- Plus SG28 backend prototype run `38030359435` SHA `ff60d28e` SUCCESS **39 passed / 1 warning**, including public `/api/v1/evaluate` default-vs-isolated MathResponse parity for `2+3`, `x+x`, `x+(`. Backend evidence for SG28-E2E-06/07/09 is expanded, not exhaustive; UI navigation and cross-replica deployment resource limitations remain open.
- Plus cumulative `38030359443` was IN_PROGRESS at last job check; no PASS attributed until completed. H2 stays OPEN. Isolation flag remains OFF by default.


## 2026-10-10 — SG28 Plus latest cumulative and H1d VERIFIED
- Plus technical SHA `ff60d28e50ca3128afe3e50760e0669591b02f61`: SG28 backend prototype `38030359435` SUCCESS **39 passed / 1 warning**. Plus cumulative `38030359443` SUCCESS frontend job `114149804454` **751 passed / 28 TODO** and backend job `114149804590` **601 passed / 1 warning**. H1d `38030359453` SUCCESS job `114149804465` **5 Playwright passed**. The previously pending gates are now reconciled, no failures.
- Classification: additional SG28-E2E-06/07/09 backend evidence accepted on SHA ff60d28e; remaining UI change/close-view and resource/runtime/multi-replica limits remain open. SG28 isolation remains OFF in default production path; no production rollout implied. Next required implementation is independent UI navigation/close-view cancellation coverage and bounded resource validation before H2 closure.


## 2026-10-10 — SG28 Plus module-unmount cancellation and E2E causal navigation gate (CI PENDING)
- Plus commit `d51cffb5637913656f7094b562e169d3e2de86a9` modifies `frontend/src/components/BasicMode.tsx` with unmount cleanup invalidating latestSubmissionRef and aborting activeBasicRequest. This ensures module change cancels the pending fetch, preventing stale local response state; default backend isolation remains OFF in production.
- Plus commit `50e20a35bad9ef3aa0f8da65bb9ebf5864a59067` adds Plus Playwright SG28-E2E-08 navigation scenario: real slow `/api/v1/evaluate` operation in isolated CI, observe live child PID, switch from Científica to Gráficas, assert same PID finishes and exits, navigate back, real `4+5=9` recovery. CI gate includes desktop/tablet/mobile. Technical SHA `50e20a35` runs queued when checked: SG28 Plus UI `38030638346`, cumulative `38030638560`, H1d `38030638362`. NO PASS claimed yet.
- Prior verified Plus SHA `ff60d28e` cumulative `38030359443` SUCCESS **751 frontend passed/28 TODO, 601 backend passed/1 warning**, H1d `38030359453` SUCCESS 5 PASS. H2 remains OPEN pending new navigation E2E result and resource/cross-replica limitations; do not deploy flags.


## 2026-10-10 — SG28 Plus navigation cancellation VERIFIED on CI
- Plus technical SHA `50e20a35bad9ef3aa0f8da65bb9ebf5864a59067`: UI SG28 run `38030638346` SUCCESS, job `114150652122`: **18 Playwright PASS** across desktop/tablet/mobile, including NEW navigation-away live backend worker PID reaped and subsequent `4+5=9` recovery on each profile. This accepts SG28-E2E-08 module-change scope, NOT yet separate tab-close/browser-close coverage.
- Same SHA Plus cumulative `38030638560` SUCCESS backend job `114150653097` **601 passed / 1 warning**, frontend job `114150653204` **751 passed / 28 TODO**. H1d `38030638362` SUCCESS job `114150652415`, **5 Playwright passed**.
- No production flag changes; SG28_EVALUATE_ISOLATION still OFF by default. SG28/H2 remains OPEN for post-worker bounded resource work, deployment/multi-replica resource reconciliation and remaining contract-level gaps. New UI behavior and test PASS at technical SHA recorded.


## 2026-10-10 — SG28 bounded admission recovery after timeout (CI PENDING)
- Plus technical commit `dc7d51ad70b92668c9963301155ac5af59495e44` adds `test_timeout_releases_single_slot_and_allows_recovery` in backend request-cancellation tests: constrained `BoundedSemaphore(1)`, first real spawned child active, second request rejected for capacity, first times out, fresh child runs `4+5=9`. This tests timeout-to-admission release without production changes and does NOT itself prove multi-replica quota enforcement.
- Plus CI triggered SHA dc7d51ad: SG28 backend `38030889672`, cumulative `38030889710`, H1d `38030889678` observed QUEUED; no PASS counted yet. Prior Plus navigation E2E `38030638346` 18/18 PASS remains accredited. Still OPEN: resource quotas across multiple app replicas, CPU/memory limits and post-worker SymPy processing, browser tab close coverage, contractual closure. Isolation flag OFF by default.


## 2026-10-10 — SG28 timeout/admission recovery verified on Plus CI
- Technical Plus SHA `dc7d51ad70b92668c9963301155ac5af59495e44`: SG28 backend run `38030889672` SUCCESS **40 passed / 1 warning**; cumulative `38030889710` SUCCESS frontend **751 passed / 28 TODO**, backend **602 passed / 1 warning** (including `test_timeout_releases_single_slot_and_allows_recovery`); H1d run `38030889678` SUCCESS **5 Playwright passed**.
- The new evidence verifies single-process bounded admission occupancy, timeout cleanup and recovery, NOT global enforcement across multiple deployed replicas. Remaining SG28/H2 concerns: CPU/memory budgets, work after isolated child returns, browser close coverage, deployment topology; production isolation flag unchanged OFF.


## 2026-10-10 — SG28 Plus tab-close real PID termination test published (CI PENDING)
- Plus commit `bfcba2228bf0542998d9e9fbed6a5fe51ca7fef3` adds `frontend/e2e/in625-h2-sg28-cancel.spec.ts` real browser page.close during live isolated `7+11` calculation; observes PID start, asserts same PID finish + no process after closing browser tab, creates fresh tab in same context and checks actual `/api/v1/evaluate` `4+5=9`. Tests run desktop/tablet/mobile under existing SG28 CI-only flags; no production behavior modified.
- Plus workflows SHA bfcba222 triggered (QUEUED at last observation): SG28 E2E `38031257190`, cumulative `38031257228`, H1d `38031257160`. DO NOT claim tab-close PASS before checking full logs and run conclusion.
- Prior SG28 timeout recovery SHA dc7d51ad passed backend 40, cumulative frontend 751/backend 602, H1d 5. SG28/H2 OPEN pending tab-close proof and remaining resource/deployment limits. Isolation OFF by default.


## 2026-10-10 — SG28 Plus browser-tab-close end-to-end cancellation VERIFIED
- Technical Plus SHA `bfcba2228bf0542998d9e9fbed6a5fe51ca7fef3`: SG28 UI run `38031257190` SUCCESS, job `114152498345`, **21/21 Playwright PASS** (7 tests across desktop/tablet/mobile). New `closing browser tab reaps active isolated worker and recovers` passed on all three profiles; test checks live PID start, page.close, same PID finish and process absent, new tab real `4+5=9` response. This certifies SG28-E2E-08 tab-close within isolated CI, plus previous module-change E2E.
- Same SHA cumulative `38031257228` SUCCESS backend job `114152498379` **602 passed / 1 warning**, frontend job `114152498493` **751 passed / 28 TODO**. H1d `38031257160` SUCCESS job `114152498350` **5 Playwright passed**.
- SG28/H2 remains OPEN strictly for bounded CPU/memory/resource behavior of remaining post-worker work and multi-replica production admission topology/deployment policy. No automatic production activation; SG28_EVALUATE_ISOLATION OFF by default.


## 2026-10-10 — SG28 POSIX CPU exhaustion gate VERIFIED
- Plus technical SHA `1e90909ae5c246db0840d46f0a941d53c378b484`: `IN625 SG28 Plus Backend Isolation Prototype` run `38033336262` SUCCESS, **42 passed / 1 warning**, including real CPU-bound worker terminated by opt-in POSIX `RLIMIT_CPU=1` and new isolated `4+5=9` success. Cumulative `38033336323` SUCCESS frontend **751 passed / 28 TODO**, backend **604 passed / 1 warning**; H1d `38033336300` SUCCESS **5 passed**. CPU test wall duration ~2.31s.
- Classification: CPU ceiling + worker recovery proven in isolated Linux CI; still no proof of public HTTP `MathResponse` classification for CPU signal exit. Remaining SG28/H2: public CPU-limit error-code semantic, resident memory budget, post-worker simplify/latex outside child, multireplica concurrency/production rollout; SG28_EVALUATE_ISOLATION OFF by default.


## 2026-10-10 — SG28 CPU exhaustion typed timeout fix (CI PENDING)
- Previous SHA `1e90909ae5c246db0840d46f0a941d53c378b484`: SG28 backend 42 PASS run `38033336262`, cumulative frontend 751/backend 604 PASS run `38033336323`, H1d 5 PASS run `38033336300` already verified.
- Plus technical commit `52b48f02ed5063a0a9a5c8c50e9dfd4da9d56f60`: `backend/app/services/interruptible.py` joins child on EOF, and if opt-in POSIX CPU limit is configured and exitcode is negative SIGXCPU, raises `ComputationTimedOut` instead of generic `ComputationFailed`. Public `/evaluate` already maps that exception to MathResponse error_code TIMEOUT. Plus commit `f0105637ee59c835bd8606233e557b1c6006126f` updates real CPU-exhaustion regression to assert typed timeout and recovery. Does not alter production flags.
- New SHA `f0105637` CI runs initially IN_PROGRESS: SG28 backend `38033933770`, cumulative `38033933785`, H1d `38033933760`. Do not mark PASS until checking logs. SG28/H2 OPEN for resource and deployment controls.


## 2026-10-10 — SG28 CPU typed-timeout regression VERIFIED
- Plus technical SHA `f0105637ee59c835bd8606233e557b1c6006126f`: SG28 backend `38033933770` SUCCESS **42 passed / 1 warning**. Plus cumulative `38033933785` SUCCESS frontend **751 passed /28 TODO** backend **604 passed /1 warning**. H1d `38033933760` SUCCESS **5 passed**. POSIX SIGXCPU now raises typed `ComputationTimedOut`; public HTTP path not yet tested with actual CPU signal, so no public contract claim.
- SG28/H2 OPEN for HTTP response to CPU exhaustion, memory ceiling, post-worker SymPy formatting and multi-replica policy. Experimental isolation OFF by default.


## 2026-10-10 — SG28 public HTTP CPU-exhaustion MathResponse contract (PENDING CI)
- Plus technical commit `c71ab6fa88cec8b9a6e21bf0ace43e95e5f4427a` adds `test_public_evaluate_cpu_exhaustion_returns_timeout_mathresponse` to `backend/tests/test_in625_sg28_loopback_http.py`, testing real CPU-bound isolated spawned worker under opt-in POSIX RLIMIT_CPU via actual `/api/v1/evaluate` TestClient endpoint; requires HTTP 200, MathResponse success=false, operation=evaluate, error_code=TIMEOUT, no detailed steps, request_id. Linux-only test, env flags via monkeypatch; no production change.
- Plus SHA c71ab6fa CI observed IN_PROGRESS: SG28 backend `38061012872`, cumulative `38061012884`, H1d `38061012865`; do not mark PASS before logs. Prior SHA f0105637 remained green backend 42, frontend 751/backend 604, H1d 5. SG28/H2 OPEN for HTTP proof, memory quota, post-worker formatting, multi-replica deployment policy.


## 2026-10-10 — SG28 public CPU response VERIFIED; opt-in POSIX child memory ceiling PENDING
- Plus SHA `c71ab6fa88cec8b9a6e21bf0ace43e95e5f4427a`: backend SG28 `38061012872` SUCCESS **43 passed /1 warning**, cumulative `38061012884` SUCCESS frontend **751 passed /28 TODO**, backend **605 passed /1 warning**, H1d `38061012865` SUCCESS **5 passed**. Public `MathResponse` on CPU SIGXCPU tested actual `/api/v1/evaluate` TestClient with error_code TIMEOUT.
- New Plus SHA `afbbabc5d365199f7102504a892dbf84e4a015fc` adds opt-in `SG28_ISOLATED_MEMORY_MB` POSIX child RLIMIT_AS with 256..4096 MiB bounds, unset by default. Plus SHA `b1b315d1b12e5f7a8234238f8d3ef34b547434d6` adds POSIX regression asserting spawned child's `(1024MiB,1024MiB)` RLIMIT_AS, parent unaffected, subsequent `4+5=9` with flag removed. No production environment or deployment changed. RLIMIT_AS is address-space limit, not total server RSS/cgroup budget; exhaustion case and deployment compatibility unverified.
- Pending Plus CI on b1b315d1: SG28 backend `38061758410`, cumulative `38061758455`, H1d `38061758440`, initially queued/running; no success claim. SG28/H2 remains OPEN for memory exhaustion classification, post-child SymPy presentation bounds, cross-replica budgets and deployment policy.


## 2026-10-10 — SG28 memory ceiling install VERIFIED; memory exhaustion regression PENDING
- Plus SHA `b1b315d1b12e5f7a8234238f8d3ef34b547434d6`: SG28 backend `38061758410` SUCCESS 44 PASS/1 warning; cumulative `38061758455` SUCCESS frontend 751 PASS/28 TODO and backend 606 PASS/1 warning; H1d `38061758440` SUCCESS 5 PASS. RLIMIT_AS opt-in isolated child installs correctly and leaves API parent unaffected.
- New Plus commit `f4d0829cebc52944339fc3340aa7f887b2ea9f50` adds real virtual address space ceiling exhaustion test: under SG28_ISOLATED_MEMORY_MB=1024, child tries 2GiB allocation, expects child `MemoryError` wrapped by `ComputationFailed`, then unsets limit and confirms `4+5=9`. CI queued: SG28 backend `38062172534`, cumulative `38062172528`, H1d `38062172538`. No PASS claimed for memory exhaustion yet. RLIMIT_AS limits address space, not physical RSS, and no production activation.
- H2 still OPEN: public MathResponse mapping for exhausted memory, display SymPy post-worker unbounded simplify/latex, multireplica quotas/deployment configuration.


## 2026-10-10 SG28 Plus memory exhaustion certified
Plus SHA f4d0829cebc52944339fc3340aa7f887b2ea9f50: SG28 backend run 38062172534 45 PASS, cumulative 38062172528 frontend 751 PASS and backend 607 PASS, H1d 38062172538 5 PASS. Child-only RLIMIT_AS memory exhaustion returns MemoryError and another computation succeeds. Public HTTP error classification and remaining post-child resource scope still OPEN; no production changes.


## 2026-10-10 — SG28 memory exhaustion public MathResponse gate (CI PENDING)
- Plus technical commit `b772b393dbd4d92e9ce77794f6738dd4f3b23be6` maps isolated child `MemoryError` in public `/api/v1/evaluate` to typed `ErrorCode.COMPLEXITY_LIMIT` (previous generic INTERNAL_ERROR). Plus commit `f00590c4d014e51e94f2f4def45b017f4a266029` adds public HTTP TestClient regression with real 2GiB child allocation under opt-in POSIX 1GiB RLIMIT_AS, asserting HTTP 200 `MathResponse` success=false, operation=evaluate, error_code COMPLEXITY_LIMIT, no detailed steps and request_id. No production environment flags changed.
- Latest Plus SHA f00590c4 CI initially QUEUED: SG28 backend `38063222854`, cumulative `38063222947`, H1d `38063222988`. No PASS claimed for this public memory contract until logs reviewed. Prior SHA f4d0829c backend 45 PASS, cumulative frontend 751/backend 607 PASS, H1d 5 PASS.
- SG28/H2 remains OPEN for post-worker unbounded SymPy simplify/latex work, distributed admission budgets, and deployment rollout. Isolation stays OFF by default.


## 2026-10-10 — SG28 post-worker presentation isolated (CI PENDING)
- Previous Plus SHA `f00590c4d014e51e94f2f4def45b017f4a266029`: SG28 backend `38063222854` SUCCESS **46 passed /1 warning**, cumulative `38063222947` SUCCESS **751 frontend /28 TODO** and **608 backend /1 warning**, H1d `38063222988` SUCCESS **5 passed**. Public MemoryError MathResponse mapped COMPLEXITY_LIMIT verified.
- Plus technical commit `412cca385389ebd72b2b3a6846dd4ab05c24f185` refactors `backend/app/routers/evaluate.py` to move H1 display `sympy.simplify`, LaTeX and string rendering into top-level picklable presentation helper; when SG28_EVALUATE_ISOLATION=1 invokes bounded child `run_for_request` with 4s deadline, admission quota, CPU/memory caps and disconnect; otherwise preserves synchronous legacy rendering. Corrective commit `741da670590e9a5c1b11ef1e769bfaad5e44d448` fixes indentation in first commit before certification.
- Latest SHA 741da670 CI IN_PROGRESS/QUEUED: SG28 backend `38064395509`, cumulative `38064395541`, H1d `38064395472`, SG28 UI E2E `38064395516`. DO NOT count refactor PASS until checked; first commit is known syntax-broken. SG28/H2 OPEN for test gate, formatting isolation parity/stress, distributed per-replica admission and deployment roll-out. Production isolation OFF by default.


## 2026-10-10 — SG28 two-stage presentation gate verified baseline and parity test pending
- Plus SHA `741da670590e9a5c1b11ef1e769bfaad5e44d448` VERIFIED: SG28 backend `38064395509` 46 PASS, SG28 UI E2E `38064395516` 21 PASS, cumulative `38064395541` frontend 751 PASS/28 TODO and backend 608 PASS/1 warning, H1d `38064395472` 5 PASS. Opt-in two-phase isolated presentation implementation passes existing CI, production default OFF.
- Plus new SHA `236db02d3c36e5f16b3f4180847a508b5988a8bd`: added public `/evaluate` test comparing display fields `input_latex`, `result_latex`, `result_text`, `warnings`, approximation, result type and error on default vs SG28 isolated routes for 2+3, x+x, 1/3, sin(30), invalid x+(. Bridge wrapper counts actual `evaluate` and `_render_evaluate_presentation` isolated worker invocations on success and evaluate-only on failures. CI SG28 backend `38064682811`, cumulative `38064682845`, H1d `38064682783` running/queued, NOT yet PASS. H2 OPEN for this validation and distributed admission policy.


## 2026-10-10 — SG28 isolated display input LaTeX parity regression and fix
- Plus SHA `236db02d3c36e5f16b3f4180847a508b5988a8bd` FAILED SG28 backend run `38064682811` (1 failed / 46 passed), cumulative `38064682845` backend 1 failed / 608 passed, frontend 751 passed, while H1d `38064682783` 5 passed. Actual failure: public `input_latex` for `2+3` is `2 + 3` legacy vs `5` isolated, caused by roundtrip pickling of unevaluated SymPy input AST.
- Plus fix SHA `ddc0f7d93fc420c25a8dddf033c800974b249941` reconstructs input AST from the source expression *inside* the bounded presentation child, avoiding parent unbounded processing and preserving original input latex. Existing strict 2-phase parity assertion remains; do not call fixed until CI verifies.
- Plus SHA ddc0f7d9 runs queued: SG28 backend `38064885494`, UI `38064885491`, cumulative `38064885580`, H1d `38064885453`. H2 OPEN for gate and cross-replica admission. Isolation OFF in production.


## 2026-10-10 — SG28 two-stage display parity accredited; multi-replica rollout blocked
- Plus SHA `ddc0f7d93fc420c25a8dddf033c800974b249941`: SG28 backend run `38064885494` **47 PASS**, SG28 UI `38064885491` **21 PASS**, cumulative `38064885580` frontend **751 PASS / 28 TODO**, backend **609 PASS / 1 warning**; H1d `38064885453` **5 PASS**. Exact `input_latex` round-trip regression from SHA 236db02d now passes; legacy and opt-in two-phase evaluation presentation parity verified.
- Lite run `38064921941` Build Diagnostic SUCCESS at docs SHA df0a6b46. This is a build diagnostic only, not a fresh mathematical suite certification.
- Deployment limitation (OPEN): SG28_MAX_ISOLATED_REQUESTS uses a Python-module-local BoundedSemaphore; with N app workers/replicas, there are N independent quotas and potential sum N*K active isolated child tasks. Both evaluate and rendering phases independently use the admission mechanism but do not reserve an end-to-end request slot. No global/distributed admission, cluster-wide CPU/RSS budget, or deployment proof. Do not enable SG28_EVALUATE_ISOLATION in production until deployment topology, capacity and admission coordination are explicitly validated and authorized. H2 remains OPEN despite CI parity.


## 2026-10-10 — SG28 multi-process admission test pending
- Plus test commit `febe6754312b5ea1bc352b2e4c7ad7e116f42373` adds two spawned-process admission probe in `backend/tests/test_in625_sg28_request_cancellation.py`: two distinct processes independently admit one task each under local K=1, while rejecting a second slot within each. Test documents that aggregate two admitted tasks exceed the incorrect assumption of global K=1. It does NOT implement a cluster-wide gate or authorize deployment.
- Latest Plus SHA febe6754 CI in progress: SG28 backend `38065673505`, cumulative `38065673488`, H1d `38065673504`; no PASS claim for new test. Baseline Plus SHA ddc0f7d9 verified SG28 backend 47, UI E2E 21, cumulative frontend 751/backend 609, H1d 5.
- SG28/H2 OPEN: formulate deployment model with global budget or per-worker allocated quota; test realistic replicas, fail-closed/cancellation and recovery. Production SG28 isolation remains OFF by default.


## 2026-10-10 — SG28 two-process quota proof VERIFIED; static fleet partition test pending
- Plus SHA `febe6754312b5ea1bc352b2e4c7ad7e116f42373`: SG28 backend `38065673505` SUCCESS 48 PASS /1 warning, cumulative `38065673488` SUCCESS frontend 751 PASS/28 TODO, backend 610 PASS/1 warning, H1d `38065673504` 5 PASS. Two independent Python processes each admit a task with local quota K=1; global quota is NOT enforced.
- New Plus SHA `a0986e5f6c61efcf636f0eaa3c1ac7355ff5c032` adds explanatory capacity planning regressions of static fleet quota partition (e.g. 5 units split 3+2, 7 split 3+2+2) and unsafe case global capacity K=2 with R=3 processes each minimum 1. These are static planning assertions, NOT a distributed coordinator implementation or real multi-replica deployment test.
- New Plus runs queued SG28 backend `38066012191`, cumulative `38066012196`, H1d `38066012213`; NOT certified until execution/log verification. SG28/H2 remains OPEN. Need choose actual production deployment topology, bounded workers/repls, and implement cluster-wide admission or guaranteed sum of per-worker quotas, plus real replicated deployment load testing. SG28 OFF by default.


## 2026-10-10 — SG28 static fleet partition CI VERIFIED (bilateral reconciliation)
- Plus technical SHA `a0986e5f6c61efcf636f0eaa3c1ac7355ff5c032` verified by GitHub Actions jobs/logs: SG28 backend run `38066012191` SUCCESS **50 passed / 1 warning** (job `114253687940`); cumulative run `38066012196` SUCCESS, backend **612 passed / 1 warning** (job `114253687906`), frontend job `114253687761` SUCCESS (typecheck, tests, production build); H1d run `38066012213` SUCCESS (job `114253687886`).
- Tests certify static partition arithmetic and independent local admissions, NOT globally coordinated admission, a realistic replicated environment, or safe production rollout. Remain OPEN: cluster-wide budget/replica topology, saturation and fail-closed behavior, end-to-end quota spanning evaluate and presentation, representative deployment load test. `SG28_EVALUATE_ISOLATION` stays OFF by default; do not enable in production.
- Lite build diagnostic `38065410599` SUCCESS (job `114251924445`), not an H2 mathematical or cancellation gate. Previous Lite SG28 evidence retained without implying new bilateral H2 certification.
- **Next executable step:** inspect `backend/app/services/request_cancellation.py` and `backend/tests/test_in625_sg28_request_cancellation.py` for a safe production-independent admission contract. Add bounded, deterministic regression for exhaustion/recovery and two-stage request occupancy, with explicit single-process scope, before considering distributed coordination; run SG28 and cumulative Plus gates. Any actual deployment/topology decision remains blocked pending authorization and capacity evidence.
- No product modification or production flag change in this documentation reconciliation.


## 2026-10-10 — SG28 prueba de admisión por fases publicada (CI pendiente)
- Plus commit técnico `33efe8df09c3a2e38d3d15bd408c78d40f72bea2` incorpora `test_two_stage_request_admission_is_phase_scoped_not_end_to_end` en `backend/tests/test_in625_sg28_request_cancellation.py`.
- Gate determinista single-process con BoundedSemaphore(1) y eventos: durante evaluación se rechaza presentación concurrente; al liberar evaluación se admite presentación, que rechaza otra evaluación; tras ambas fases se recupera la capacidad.
- La prueba usa `run_bounded` instrumentado y **NO** acredita cancelación real de SymPy, reserva de cupo end-to-end, coordinación entre procesos ni despliegue seguro.
- CI en el SHA nuevo todavía SIN VERIFICAR en esta operación; no declarar PASS hasta leer runs/logs de SG28 backend, cumulative y H1d.
- H2 sigue ABIERTO; `SG28_EVALUATE_ISOLATION` permanece OFF por defecto. Próximo paso: verificar las ejecuciones de ese commit, corregir cualquier fallo del harness, e investigar reserva end-to-end/aislamiento de admisión compartida sin activar producción.


## 2026-10-10 — SG28 cancelled-handler admission cleanup regression (CI PENDING)
- Plus technical commit `567ae15c3f0cb157a132c855ea8c85c678cf6d04` adds `test_cancelled_handler_retains_slot_until_coordinator_thread_finishes` to `backend/tests/test_in625_sg28_request_cancellation.py`.
- Deterministic single-process test: cancel handler while mocked coordinator thread remains occupied; verify another request is rejected immediately without execution, then release cleanup and verify admission and successful computation recover.
- This is a test-only commit; no backend admission algorithm, production flags, deployment or Lite product code modified.
- CI evidence for this SHA NOT YET VERIFIED. Do not count as PASS before GitHub Actions SG28 and cumulative gates finish and logs are inspected.
- SG28/H2 remains OPEN: per-process quotas are not global quotas; end-to-end request reservation and multi-replica topology/deployment tests remain unresolved. Keep `SG28_EVALUATE_ISOLATION` OFF in production.
- Next: verify SG28 and cumulative Plus Actions for SHA 567ae15c, diagnose failures without modifying product prematurely; then add evidence to both repo logs.


## 2026-10-10 — User-provided GitHub Actions reconciliation (H1d and Lite build only)
- Plus H1d run `38066424850`, job `114254888779`: SUCCESS, Playwright **5 passed (25.9s)**. This run proves H1d reentry only, NOT the newly added SG28 cancellation-slot regression.
- Lite build diagnostic run `38066465197`, job `114255006676`: SUCCESS; Vite build completed, 119 modules transformed. This is a build check, not SG28 mathematical/cancellation evidence.
- The Plus test `test_cancelled_handler_retains_slot_until_coordinator_thread_finishes` remains present on the canonical branch, but **its SG28 backend gate and cumulative gate have not been verified in this reconciliation**. Do not mark SG28 certified based on these two runs.
- Next exact step: obtain SG28 backend and cumulative Plus workflow runs for the test commit or a descendant containing it; inspect job logs for explicit test result and cumulative totals, then diagnose any failure. Keep production SG28 isolation OFF; distributed topology and global admission remain open.


## 2026-10-10 — Lite build diagnostic run 38066789305 verified
- Lite GitHub Actions run `38066789305`, job `114255948559`: completed SUCCESS. TypeScript/Vite production build transformed 119 modules; build completed in 6.59s. This is build-only evidence, not a mathematical or SG28 backend cancellation gate.
- Plus H1d run `38066424850` was already recorded: 5/5 Playwright PASS, and remains H1d-only evidence.
- Still PENDING: Plus SG28 backend and cumulative gates for commit `567ae15c3f0cb157a132c855ea8c85c678cf6d04` or descendant containing the same test. Do not certify unobserved jobs. H2 OPEN; isolation disabled in production.


## 2026-10-10 — SG28 cumulative gate failure diagnosed; test ordering fix published
- Plus cumulative run `38066424800` backend job `114254888809` FAILURE: **613 passed, 1 failed, 1 warning**, coverage **85.67%** (threshold 75%). The only failure was `test_cancelled_handler_retains_slot_until_coordinator_thread_finishes` with `TimeoutError` from awaiting a cancelled ASGI handler before releasing its deliberately blocked coordinator. Plus frontend job `114254888979` SUCCESS.
- Root cause: test orchestration deadlock. `run_for_request` deliberately awaits shielded coordinator cleanup on coroutine cancellation. The old test awaited the handler cancellation before releasing its worker; that contradicts this contract and times out.
- Plus fix commit `962b2bb89aa74635b1f214393c9c802d9c836613`: after cancel request, first assert handler pending and capacity fail-closed, then release worker, await cancellation acknowledgment, confirm cleanup and recovery. Only the test changed, not production.
- FIX **NOT YET CI VERIFIED**. Next: inspect SG28 backend and cumulative Plus runs for SHA 962b2bb8 or descendant; if green record exact tests/jobs, else diagnose. H2 OPEN, cluster-wide admission and deployment unresolved; SG28 isolation OFF by default.


## 2026-10-10 — SG28 cancelled-handler cleanup test VERIFIED, cumulative gate GREEN
- Plus technical SHA `962b2bb89aa74635b1f214393c9c802d9c836613`: SG28 backend run `38067270241` SUCCESS **52 passed /1 warning**, job `sg28-backend-isolation`; cumulative run `38067270248` SUCCESS backend **614 passed /1 warning**, backend coverage **85.65%** (threshold 75%) and frontend **751 passed/28 TODO**; H1d run `38067270260` SUCCESS **5 passed**.
- The former cancelled-handler coordinator cleanup test deadlock was a test sequencing bug and is resolved. Single-process fail-closed admission while cleanup is pending and successful recovery are now confirmed in CI; no product admission algorithm was changed.
- Lite Build Diagnostic run `38067293912` SUCCESS; Vite 119 modules transformed, built in 5.48 seconds. This is build evidence only.
- H2 / SG28 GLOBAL remains OPEN: local per-process semaphore does not implement global admission, and evaluation/presentation still acquire slots separately rather than an end-to-end reservation. Fleet topology, distributed capacity limits and deployment-specific validation remain pending. Production `SG28_EVALUATE_ISOLATION` remains OFF.
- Next step: design a deliberately bounded, single-process, end-to-end occupancy regression or admission lifetime contract, then evaluate whether a controlled implementation is warranted; do not enable production or claim distributed guarantee.


## 2026-10-10 — SG28 verified green; interleaving gap regression PENDING
- Verified Plus commit `962b2bb89aa74635b1f214393c9c802d9c836613`: SG28 `38067270241` SUCCESS 52 passed /1 warning; cumulative `38067270248` SUCCESS backend 614 passed /1 warning, 85.65% coverage, frontend 751 passed /28 TODO; H1d `38067270260` SUCCESS 5 passed. Lite build `38067293912` SUCCESS.
- New Plus test-only commit `8291757372c0f86dd05fdb43b1bb0dd39e39e8ad` adds `test_interleaving_request_can_take_slot_between_evaluation_and_presentation` to make the lack of end-to-end local admission reservation explicit: another request takes K=1 between phases, presentation is rejected, then recovers when the slot is released. Mocked work, single-process only; no deployment changes.
- New test CI PENDING; do not treat it as passing before SG28 and cumulative run evidence. SG28/H2 global remains OPEN for end-to-end guarantees and distributed fleet admission. Production isolation OFF.
- Next: verify SG28/cumulative Actions for commit 82917573 or a descendant, then decide whether a request-scoped lease implementation is compatible with cancellation, timeouts and public error semantics.


## 2026-10-10 — Latest supplied Plus H1d and Lite build verified
- Plus run `38067586889` job `114258275069`: SUCCESS H1d Playwright 5 passed in 22.4s. Not an SG28 backend test.
- Lite run `38067609997` job `114258343250`: SUCCESS Build Diagnostic, 119 modules transformed, 6.62s. Not an SG28 test.
- Plus interleaving admission test SHA `8291757372c0f86dd05fdb43b1bb0dd39e39e8ad` is still pending targeted SG28/cumulative CI evidence; no claim of PASS from these two runs. Global SG28/H2 remains OPEN, production isolation OFF.
- Next: locate and inspect Plus SG28 backend and cumulative CI on this SHA or descendant; verify the test result, then proceed to bounded end-to-end capacity semantics.


## 2026-10-10 — Lite build run 38067966929 verified
- Lite `38067966929`, job `114259381319`: SUCCESS, Vite production build 119 modules transformed in 6.53s.
- Plus H1d `38067586889`, job `114258275069`: reconfirmed SUCCESS 5 passed (22.4s), already recorded in prior checkpoint.
- Neither run verifies Plus SG28 interleaving test from technical commit `8291757372c0f86dd05fdb43b1bb0dd39e39e8ad`. Continue to require SG28 and cumulative backend evidence; H2 global OPEN and production isolation OFF.


## 2026-10-10 — SG28 interleaving regression VERIFIED; Lite diagnostic confirmed
- Plus technical SHA `8291757372c0f86dd05fdb43b1bb0dd39e39e8ad` SG28 Backend `38067586874` job `114258274995` SUCCESS **53 passed/1 warning**; cumulative `38067586872` backend job `114258275087` SUCCESS **615 passed/1 warning**, **85.70% coverage**; frontend job `114258274972` SUCCESS **751 passed/28 TODO**. H1d `38067586889` job `114258275069` SUCCESS **5 passed**.
- Lite Build Diagnostic `38068207343` job `114260079734` SUCCESS, 119 modules transformed, Vite built in **6.88s**. Build-only evidence.
- The single-process mocked interleaving regression is accredited: local quota is released between evaluate and presentation, permitting another request to take the slot and rejection/retry of presentation. This is a documented gap, NOT a proof of end-to-end reservation or distributed enforcement.
- **Next technical task**: design and test a bounded request-scoped admission lease spanning evaluate and presentation; keep cancellation/timeout cleanup and API error semantics. Global admission/topology remains a separate unresolved deployment requirement. `SG28_EVALUATE_ISOLATION` stays OFF in production. H2 remains OPEN.


## 2026-10-10 — SG28 request-scoped lease target contract added (CI pending)
- Plus test-only SHA `027baf4d2b9867ff0318a8b7f12a7248aa732d77` adds `test_request_scoped_admission_lease_blocks_interleaving_and_releases` to encode local K=1 quota lifetime spanning both logical phases; verifies other admission denied until lease exit then recovery. This is a conceptual executable target contract using a semaphore acquired directly by the test. **It does NOT exercise a new router implementation** and does not resolve cancellation cleanup, distributed quotas, or production readiness.
- Previous current-router interleaving demonstration at SHA `82917573` verified SG28 53 passed and cumulative backend 615 / frontend 751. New target test is NOT CI verified yet.
- Next engineering step: design a real router-integrated request-scoped admission API that preserves ownership until both child coordinators clean up (including cancellation/timeouts) and maps capacity to HTTP 503. Test with actual public endpoint and concurrent requests; ensure backward-compatible default behavior. No production isolation enabled. H2 OPEN.


## 2026-10-10 — SG28 lease primitive and exception regression (CI PENDING)
- Verified Plus target-contract SHA `027baf4d2b9867ff0318a8b7f12a7248aa732d77`: SG28 run `38068655871` SUCCESS 54 passed/1 warning; cumulative run `38068655831` SUCCESS backend 616 passed/1 warning coverage 85.60%, frontend 751 passed/28 TODO; H1d run `38068655828` SUCCESS 5 passed.
- Plus commit `114acfe00c6436618d5dfc4db53da1f5a730d518` introduces opt-in `request_admission_lease()` context manager in `backend/app/services/request_cancellation.py`; Plus commit `c261d5f7b04ad32d723f7b8c749661c7ac49d710` adds two tests of local lease occupancy and release on exception. These commits have NOT yet been CI verified.
- IMPORTANT: lease is not wired into `/api/v1/evaluate`, and current `run_for_request` continues to acquire/release per phase. Tests do not prove two-phase worker cancellation safety, HTTP 503, distributed admission or real deployment compatibility. Only after designing coordinator ownership and cleanup before lease exit should route integration be attempted. Default production isolation remains OFF. SG28/H2 global OPEN.
- Next: verify new SG28/cumulative Plus CI on SHA c261d5f7 or later; then design non-double-acquiring, request-scoped worker cancellation integration and public endpoint concurrency E2E.


## 2026-10-10 — SG28 reserved bridge integration primitive pending CI
- Verified Plus SHA `c261d5f7b04ad32d723f7b8c749661c7ac49d710`: SG28 run `38068936575` SUCCESS **56 passed/1 warning**; cumulative `38068936585` SUCCESS backend **618 passed/1 warning**, coverage **85.68%**, frontend **751 passed/28 TODO**; H1d `38068936597` SUCCESS **5 passed**.
- Plus commit `fc132860d967d0f40d4d67075e518d131fa3dbc8` adds opt-in `admission_reserved=False` to `run_for_request` so a caller owning `request_admission_lease()` can execute both phases without reacquiring or releasing the same semaphore. Default calls preserve previous behavior. Plus test commit `2d14bead5d90258b1340f1e253d28471c8acabfd` tests two real reserved bridge calls and exception ownership/recovery.
- **PENDING CI** for new bridge and tests. No public router changes, no production flags modified; reserved option must only be used within caller-held lease after ensuring child cleanup before lease release. This local API does not enforce global quotas nor itself prove public endpoint occupancy. SG28/H2 OPEN.
- Next exact step: verify SG28/cumulative CI for SHA 2d14bead or descendant; then design request-scoped HTTP router integration with cancellation-safe asynchronous lease lifecycle and tests before enabling usage.


## 2026-10-10 — Reserved SG28 bridge CI verified; cancellation cleanup contract pending
- Plus SHA `2d14bead5d90258b1340f1e253d28471c8acabfd`: SG28 run `38069176431` SUCCESS **58 passed/1 warning**; cumulative `38069176442` SUCCESS backend **620 passed/1 warning**, coverage **85.66%**, frontend **751 passed/28 TODO**; H1d `38069176447` SUCCESS **5 passed**. Caller-held admission bridge behavior now CI accredited at isolated service/test level.
- New Plus test-only commit `3942294fabc3538b557b39f2061d34fce2dffcbf` adds `test_reserved_bridge_cancellation_retains_lease_until_worker_cleanup`: verifies that a cancelled handler remains pending during coordinator cleanup and an outer reserved lease rejects competing admissions, then permits recovery after cleanup. **CI pending**, no PASS claim yet.
- Public `/api/v1/evaluate` still NOT wired to request-scoped lease. No production change to isolation activation. Multi-process global admission and representative deployment verification remain OPEN. Next: verify SG28/cumulative Plus Actions at 3942294f or descendant; only after gate, implement safe router lifecycle with explicit scope and correct cancellation semantics.


## 2026-10-10 — SG28 request-scoped public HTTP lease integration (CI PENDING)
- Verified Plus SHA `3942294fabc3538b557b39f2061d34fce2dffcbf`: SG28 `38069611829` SUCCESS **59 passed/1 warning**; cumulative `38069611774` SUCCESS backend **621 passed/1 warning**, 85.71% coverage, frontend gate SUCCESS; H1d `38069611755` SUCCESS **5 passed**.
- Plus implementation commit `b7ef7ccb64f9e8002ebbd2d58f75d31802b531af` wraps opt-in public `/api/v1/evaluate` with one local `request_admission_lease()` and passes `admission_reserved=True` to both evaluation and presentation child coordinators. Default SG28 isolation OFF retains former legacy route. Existing typed error / 503 handling intended unchanged; actual CI verification pending.
- Plus regression commit `0c74a9ee96e7be08447b99f05150b141a1ff556a` asserts actual public TestClient opt-in HTTP request traverses two reserved worker calls while local K=1 is held, followed by quota recovery. **PENDING targeted SG28/cumulative gate and UI E2E**; do not declare this feature certified until logs pass.
- SG28/H2 global OPEN: this is per Python-process admission, not cross-worker/replica quota; fleet topology/load and operational capacity still unverified. No deployment configuration changed; isolation remains OFF in production.
- Next: inspect GitHub Actions SG28, cumulative, H1d and UI on SHA 0c74a9ee or descendant; fix any regression at its source; test capacity HTTP 503 and cancellation across complete request before expansion.


## 2026-10-10 — SG28 public two-phase admission verified; HTTP saturation regression pending
- Plus SHA `0c74a9ee96e7be08447b99f05150b141a1ff556a`: SG28 run `38069899326` SUCCESS **60 passed/1 warning**; cumulative `38069899325` SUCCESS **622 backend passed/1 warning**, **85.59% coverage**, **751 frontend passed/28 TODO**; H1d `38069899342` SUCCESS **5 passed**. Experimental HTTP evaluation and presentation use same local capacity lease in tested scenario.
- Plus test-only SHA `a97f18ddbaab53b6a18ef5fb61b5c85e16eb03cf` adds `test_opt_in_http_evaluate_returns_503_when_local_lease_is_exhausted`, testing real HTTP 503, typed MathResponse, no worker launch during saturation, and subsequent local quota recovery. **New test pending CI**, no pass asserted.
- Next: verify SG28 and cumulative gates for a97f18dd or descendant; inspect logs and fix at correct layer if red. SG28/H2 globally OPEN for multi-process coordinated admission, topology, fleet load and cancellation while HTTP requests compete. SG28 isolation remains OFF by default; no production deployment changes.


## 2026-10-10 — SG28 HTTP saturation certified; recovery HTTP test pending
- Plus SHA `a97f18ddbaab53b6a18ef5fb61b5c85e16eb03cf`: SG28 `38070240399` SUCCESS 61 passed/1 warning; cumulative `38070240406` SUCCESS backend 623 passed/1 warning and 85.59% coverage, frontend gate SUCCESS; H1d `38070240440` SUCCESS 5 passed. `test_opt_in_http_evaluate_returns_503_when_local_lease_is_exhausted` explicitly PASSED.
- New Plus test-only commit `e45b120acdfe6e145e28d7c588c6c376abc85934` exercises the actual public HTTP sequence: while local K=1 is held, `/api/v1/evaluate` returns 503, then after release the request `4+5` succeeds with numeric 9.0. **New regression CI PENDING**, not yet counted PASS.
- H2 global remains OPEN for concurrency cancellation/disconnect and global multi-process admission/topology. Isolation stays OFF in production. Next: SG28/cumulative verification for e45b120 or descendant, then expand to real concurrent HTTP requests with bounded coordination and recovery.


## 2026-10-10 — SG28 HTTP recovery verified; concurrent requests CI pending
- Plus SHA `e45b120acdfe6e145e28d7c588c6c376abc85934`: SG28 run `38070485185` SUCCESS **62 passed/1 warning**; cumulative `38070485175` SUCCESS backend **624 passed/1 warning**, **85.59% coverage**, frontend **751 passed/28 TODO**; H1d `38070485166` SUCCESS **5 passed**. HTTP 503-to-recovery regression explicitly PASSED.
- New Plus test-only commit `25a0124f404a7d590c34b68d6ac75b4096d51e69` adds `test_opt_in_http_concurrent_requests_reject_then_recover`: two real TestClient HTTP requests contend for local K=1, with deterministic hold on the first; second gets 503, first completes, retry succeeds. **CI pending** for this new test; do not claim it passed.
- SG28/H2 fleet-wide admission and multi-replica topology remain OPEN. Per-process quota cannot guarantee global K. Experimental isolation remains OFF in production. Next: inspect SG28/cumulative Actions for commit 25a0124 or descendant, resolve any CI failure, then exercise cancellation on concurrent real HTTP requests.


## 2026-10-10 — SG28 concurrent HTTP K=1 verified; failure recovery regression pending
- Plus SHA `25a0124f404a7d590c34b68d6ac75b4096d51e69`: SG28 `38070902993` SUCCESS 63 passed/1 warning; cumulative `38070902965` SUCCESS backend 625 passed/1 warning, coverage 85.69%, frontend 751 passed/28 TODO; H1d `38070903019` SUCCESS 5 passed. Real TestClient concurrent HTTP contention/recovery test included in passing backend gate.
- New Plus test-only SHA `f79b0c5286cbdb7b826366bf3e7cb5a3e477c601` adds `test_opt_in_http_capacity_recovers_after_first_request_failure`: malformed isolated expression followed by successful HTTP evaluation, testing local reservation cleanup on calculation failure. **PENDING new SG28/cumulative CI**, no claim of pass yet.
- SG28/H2 global OPEN: process-local budget is not fleet-wide; real disconnect/cancellation and deployment topology tests still pending. Isolation remains OFF in production. Next: verify run logs for f79b0c52, then broaden to concurrency with cancellation and eventual recovery.


## 2026-10-10 — SG28 invalid-request recovery VERIFIED, Lite build verified
- Plus technical commit `f79b0c5286cbdb7b826366bf3e7cb5a3e477c601`: SG28 run `38071216643` job `114268842287` SUCCESS **64 passed/1 warning**. Cumulative run `38071216637` SUCCESS backend **626 passed/1 warning**, **85.64% coverage**; frontend **751 passed/28 TODO**. H1d `38071216642` SUCCESS **5 passed**. `test_opt_in_http_capacity_recovers_after_first_request_failure` explicitly PASSED in cumulative backend job.
- Lite `38071240399` Build Diagnostic job `114268914677` SUCCESS, 119 modules transformed, built in 6.79s. Lite build is not backend SG28 certification.
- Previous concurrent HTTP K=1 admission and 503/retry tests remain green in this cumulative gate. Local per-process admission is NOT a global multi-replica quota. SG28/H2 stays OPEN pending real concurrent disconnect and fleet topology/load validation; isolation remains OFF in production.
- Next: construct deterministic HTTP disconnect/concurrent-admission tests with correct coordinator cleanup ordering; avoid claiming global isolation or enabling rollout.


## 2026-10-10 — SG28 reserved disconnect/concurrent-admission regression PENDING
- Last verified Plus technical SHA `f79b0c5286cbdb7b826366bf3e7cb5a3e477c601`: SG28 `38071216643` SUCCESS **64 passed/1 warning**, cumulative `38071216637` SUCCESS backend **626 passed/1 warning**, **85.64% coverage**, frontend **751 passed/28 TODO**; H1d `38071216642` SUCCESS 5 passed. Lite diagnostic `38071240399` SUCCESS build 119 modules/6.79s.
- New Plus test-only commit `4d31fff702dfa4f39829dc2ed9b40d1fc3b28d40`: `test_reserved_disconnect_denies_competitor_until_coordinator_reaped` checks a simulated ASGI bridge disconnect under K=1, retaining caller-owned admission through mocked worker cleanup, competitor denied until cleanup completes, and slot recovery after exit. **New regression CI PENDING**; NOT an actual socket disconnect, real HTTP concurrent cancellation, or global quota test.
- Next inspect SG28/cumulative gates for 4d31fff or descendant, fix red tests if any; then build real ASGI/request-route disconnect and contention tests. SG28/H2 OPEN for fleet topology/distributed quotas; production isolation OFF.


## 2026-10-10 — SG28 K=1 disconnect cleanup verified; ASGI receive-channel case pending
- Plus SHA `4d31fff702dfa4f39829dc2ed9b40d1fc3b28d40`: SG28 run `38071766133` SUCCESS 65 passed/1 warning, cumulative `38071766098` SUCCESS backend 627 passed/1 warning, 85.69% coverage; frontend 751 passed/28 TODO; H1d `38071766120` SUCCESS 5 passed.
- New Plus test-only SHA `c263f87dd70d38fbfdc04b6d35530cd8e92c65e6` adds `test_reserved_starlette_asgi_disconnect_blocks_competitor_then_recovers`: uses Starlette Request and an ASGI `http.disconnect` receive message while mocked coordinator cleanup remains blocked. Validates single-process K=1 competing admission denied during cleanup and successful capacity recovery. **CI pending**; this is in-process ASGI receive testing, not a real network socket nor distributed admission.
- Next verify SG28 and cumulative gates on c263f87 or descendant; inspect and fix regressions. H2 remains OPEN for fleet-wide admission, production topology and representative deployment. Isolation default OFF.


## 2026-10-10 — SG28 ASGI disconnect/competitor CI VERIFIED, Lite diagnostic green
- Plus technical SHA `c263f87dd70d38fbfdc04b6d35530cd8e92c65e6`: SG28 `38072123470` job `114271509347` SUCCESS **66 passed/1 warning**; cumulative `38072123455` SUCCESS backend **628 passed/1 warning**, **85.59% coverage**, frontend SUCCESS; H1d `38072123457` SUCCESS **5 passed**. `test_reserved_starlette_asgi_disconnect_blocks_competitor_then_recovers` explicitly PASSED in backend logs.
- Lite `38072149298` job `114271586079` SUCCESS Build Diagnostic, 119 modules transformed and built in 4.26s. This is build-only validation.
- Scope: in-process ASGI `http.disconnect`, mocked coordinator and single-process K=1 competition; NOT a real network transport, distributed quota or production rollout proof. SG28/H2 global stays OPEN, isolation OFF by default. Next: review real HTTP disconnect middleware and deployment topology and add independently bounded integration evidence rather than declaring fleet-wide safety.


## 2026-10-10 — SG28 middleware disconnect path reviewed, next integration test identified
- Reviewed Plus `backend/app/main.py`, `backend/app/services/disconnect_tracking.py` and `backend/app/services/request_cancellation.py` on working branch. Outer `DisconnectTrackingMiddleware` records `http.disconnect` in shared ASGI scope; inner bridge observes `sg28_http_disconnected` and waits for child coordinator cleanup. Current per-process `_ADMISSION` remains a bounded semaphore; admission is not global across replicas.
- Proposed next test: use actual `DisconnectTrackingMiddleware` with an ASGI receive channel, have an intermediate receiver consume the disconnect, assert the shared scope event is set, a K=1 competing reservation is rejected until child cleanup, and later admission recovers. This must be described as an in-process ASGI test, not a physical socket disconnect.
- Attempt to publish that new test was blocked by tooling in this session; **no code commit and no new CI evidence** resulted. Latest verified Plus SHA `c263f87dd70d38fbfdc04b6d35530cd8e92c65e6`: SG28 66 passed (`38072123470`), cumulative backend 628 passed (`38072123455`), frontend success, H1d 5 passed (`38072123457`). Lite diagnostic `38072149298` success.
- SG28/H2 still OPEN; keep production isolation OFF. Next: retry gated test publishing only when permitted, verify CI, then audit deployment topology before distributed admission claims.


## 2026-10-10 — Outer ASGI disconnect event regression awaiting CI
- Plus test-only commit `02398a4a5f53fa069442c5f5633bb1449f91b48d` adds `test_outer_disconnect_tracker_sets_scope_event_when_consumed`, exercising actual `DisconnectTrackingMiddleware` and asserting `sg28_http_disconnected` remains set when downstream consumes `http.disconnect`. In-process ASGI test only; no socket or end-to-end coordinator admission assertion. **CI PENDING**.
- Last verified Plus SG28 66 passed (`38072123470`), cumulative backend 628 passed (`38072123455`), frontend gate successful; H1d 5 passed (`38072123457`). Lite build `38072149298` success. Next: check SG28 and cumulative CI for new commit, then expand test to competing K=1 admission during cleanup.
- SG28/H2 global OPEN; production isolation OFF.


## 2026-10-10 — Outer middleware SG28 green; combined tracker/lease regression CI pending
- Verified Plus SHA `02398a4a5f53fa069442c5f5633bb1449f91b48d`: SG28 `38073928404` SUCCESS **67 passed/1 warning**, cumulative `38073928403` SUCCESS **629 backend passed/1 warning**, coverage **85.64%**, frontend gate SUCCESS; H1d `38073928400` SUCCESS **5 passed**. `test_outer_disconnect_tracker_sets_scope_event_when_consumed` explicitly PASSED.
- New Plus test-only SHA `4654cd937b68b15e30c0047f4b75a6674bafba0b` adds `test_outer_tracker_disconnect_holds_reserved_slot_until_cleanup`. Uses actual outer `DisconnectTrackingMiddleware`, shared ASGI scope event, an inner consumer of `http.disconnect`, and mocked coordinator; checks K=1 competing local admission denied during cleanup and recovery after completion. **CI PENDING**; in-process ASGI rather than external socket or fleet-wide isolation.
- SG28/H2 OPEN: global admission, fleet topology, and deployment validation remain outstanding. Production isolation OFF. Next: inspect SG28/cumulative gates for SHA 4654cd9 or descendant and address any failures before further engineering.


## 2026-10-10 — Combined outer disconnect tracker and lease gate VERIFIED
- Plus SHA `4654cd937b68b15e30c0047f4b75a6674bafba0b`: SG28 run `38074280892` SUCCESS **68 passed/1 warning**, cumulative `38074280914` SUCCESS backend **630 passed/1 warning**, coverage **85.69%**, frontend job SUCCESS; H1d `38074280878` SUCCESS **5 passed**. The combined middleware/lease regression `test_outer_tracker_disconnect_holds_reserved_slot_until_cleanup` is explicitly PASSED in cumulative CI.
- Scope: in-process ASGI, mocked coordinator, local K=1; does not prove socket disconnect behavior, distributed quota or deployment fitness. H2 OPEN; experimental production isolation OFF.
- Next: audit actual deployment configuration/topology, record replica/process assumptions, then choose safe observable production-disabled external transport validation without enabling isolation.


## 2026-10-10 — SG28 deployment topology audit (documentary; no new test PASS)
- Published `qa/certification/SG28_DEPLOYMENT_TOPOLOGY_AUDIT.md` in both repositories. Plus commit `5dafc9983c17dc38a6392315c65506dea5380ad0`; Lite commit `067b165ff353a854efc4c647a41a754fb8cbdd1c`.
- Source-confirmed: Plus `_ADMISSION` is a process-local bounded semaphore (default K=2, bounded 1..16). No tracked Render blueprint/Dockerfile/Procfile or deploy manifest establishes live instance/process count. Runtime topology and global admission remain NOT VERIFIED.
- Last previously certified technical SHA Plus `4654cd937b68b15e30c0047f4b75a6674bafba0b`: SG28 `38074280892` 68 PASS; cumulative `38074280914` 630 backend PASS; H1d `38074280878` 5 PASS. This documentary audit is not a new technical gate or certification.
- H2/SG28 OPEN; real socket-disconnect / multi-process admission / deployment capacity not yet certified; opt-in isolation stays OFF in production.
- **Next exact step:** inspect Render deployment properties read-only in a user-confirmed workspace; obtain replica count, worker/start command and effective flag safely; then implement bounded external-transport + multiprocess CI validation in a dedicated isolated test environment, verify SG28/cumulative gates and update both logs.


## 2026-10-10 — H2 admission-scope regression published; CI pending
- Plus test `backend/tests/test_sg28_admission_scope.py` at `adceca5af08dda8a48622b478387f9fb61bb704c` checks K=1 local denial/recovery and independent in-memory semaphore pools. **Not** a real multiprocess or global-quota integration test.
- Updated topology audit is available in Plus at `qa/certification/SG28_H2_TOPOLOGY_AUDIT.md` (`920f9add`). Execution-log checkpoints synchronized to Lite and Plus.
- New test CI **UNVERIFIED**: do not count as certified until exact run/job logs confirm passing. Last recorded successful gates: Plus SG28 `38074280892` (68 passed), cumulative `38074280914` (630 backend passed), H1d `38074280878` (5 passed).
- Next: inspect CI for `adceca5` or descendant; fix failures, then add true multi-process and disposable external HTTP transport evidence. Render deployment workspace remains unconfirmed; fleet-topology check blocked pending user workspace selection. H2 OPEN and isolation OFF.


## 2026-10-10 — Local admission scope regression VERIFIED
- Plus run `38076842089` jobs backend `114285492589` and frontend `114285492490`: SUCCESS; backend **632 passed / 1 warning**, coverage **85.64%**; frontend **751 passed / 28 TODO** and successful build.
- Lite run `38076878958` build job `114285601202`: SUCCESS; 119 modules transformed, built in 7.07s. Build-only, not backend SG28 certification.
- H2 is still **OPEN**. Two added unit regressions check K=1 and separate in-memory pools but do not validate real process boundaries, distributed admission, physical HTTP disconnects, or production topology. Production isolation remains OFF.
- Next: create true process-isolation characterization in a disposable CI environment and compare with deployment topology once Render workspace is confirmed. Do not report fleet-wide certification until evidence is obtained.


## 2026-10-10 — SG28/H2 CURRENT VERIFIED BASELINE (supersedes older gates above)
- Plus technical SHA `c36608ab11e5264ed759af510721d67d0532b2c1` cumulative run `38082715108` GREEN: backend **636 passed / 1 warning / coverage 85.67%**, including `test_real_child_cancelled_under_reserved_k1_then_reusable` PASS; frontend **751 passed / 28 TODO**, build GREEN. SG28 isolation run `38082715115` GREEN **69 passed / 1 warning**; H1d `38082715138` GREEN **5 passed**.
- Prior Plus run `38080591813`: real loopback TCP disconnect with K=1 retained through **simulated coordinator** cleanup PASS (635 backend). Process-local K=1 independent worker test previously passed.
- Lite last confirmed diagnostic run `38079463421` GREEN, 119 modules built in 6.67s. Latest evidence for Lite remains build-only.
- H2 OPEN: no single verified end-to-end physical TCP-disconnect + actual spawned child process lifecycle test; no shared fleet admission coordinator, verified global quota, or Render runtime topology. Preserve `SG28_EVALUATE_ISOLATION=0` in production.
- Next: complete nonproduction end-to-end real TCP + spawned child safety gate only through supported tool controls; check global admission requirements after read-only confirmation of Render workspace and actual worker/replica layout. Record the exact run/commit results; do not promote H2 to PASS prematurely.


## 2026-10-10 — H2 physical TCP + actual SymPy child integration CI GREEN
- Plus technical SHA `08f70c1b7aa6f894f5595b95afcd2a13a9001725`: cumulative run `38084223803` backend job `114307212013` SUCCESS **637 passed, 1 warning, coverage 85.69%**. `test_real_tcp_disconnect_cancels_actual_sympy_child_and_recovers` explicitly PASSED. Frontend job `114307212222` SUCCESS **751 passed / 28 TODO**, 102 modules, build 21.40s. Sibling H1d run `38084223804` SUCCESS.
- Verified CI-only integration of real loopback TCP disconnect, actual spawned SymPy child and local K=1 capacity recovery. Does NOT certify globally coordinated capacity, multi-replica topology, or production configuration. H2 global OPEN, experimental isolation OFF in production.


## 2026-10-10 — Shared K=1 multiprocess gate VERIFIED
- Plus technical SHA `167d0335197c624186e24ce486ccec1a8fa39366` cumulative run `38084981053`: backend job `114309506476` SUCCESS **638 passed / 1 warning / coverage 85.74%**; `test_shared_gate_denies_second_interpreter_and_recovers` explicitly PASSED. Frontend job `114309506744` SUCCESS **751 passed / 28 TODO**, 102 modules, build 22.88s. H1d `38084981061` job `114309506931` SUCCESS **5 passed**.
- The shared semaphore uses multiprocessing Manager and is **test-only**, not a durable global lease or production distributed admission coordinator. SG28/H2 global OPEN pending failure/expiry/fencing handling and actual Render topology. Production SG28 opt-in remains OFF.


## 2026-10-10 — SG28 lease model regression CI GREEN (641 backend)
- Plus technical SHA `463888bce05ce968b7ecee688e473c43cb34eae3`; cumulative run `38085561575` backend job `114311204439` SUCCESS **641 passed / 1 warning / coverage 85.69%**. All three tests in `test_sg28_lease_contract.py` explicitly PASSED (expiry successor fencing, renew/double release, reject expired renewal). Frontend job `114311204636` SUCCESS **751 passed / 28 TODO**; 102 modules, build 19.80s. H1d run `38085561630` SUCCESS.
- These are deterministic in-memory CI-only lease contract tests, NOT proof of atomic distributed grant or lease safety after crashes/network partitions. Global H2 remains OPEN. Production experimental isolation OFF.


## 2026-10-10 — SG28 lease replay regression CI GREEN: 644 backend
- Plus technical SHA `591900282da7ef96a154439f034eccffb9ce0de4`, cumulative run `38086974503`: backend job `114315404149` SUCCESS **644 passed / 1 warning / 85.59% coverage**; all three newest lease contract tests explicitly PASSED. Frontend job `114315404272` SUCCESS 751 passed / 28 TODO, 102 modules, built in 21.22s. H1d `38086974500` job `114315404288` SUCCESS 5 passed.
- Tests remain deterministic in-memory lease model, not production distributed coordination. Global H2 OPEN; isolation OFF in production.


## 2026-10-10 — SG28 multiple-generation fencing and renewal boundary GREEN
- Plus technical SHA `5bbc8cdd23870a7ef66931940a1b119467e25ff9`, cumulative run `38087686939`: backend job `114317512686` SUCCESS **646 passed / 1 warning / coverage 85.64%**; `test_old_lease_cannot_release_current_even_after_multiple_turnovers` and `test_renewed_lease_blocks_successor_until_new_deadline` explicitly PASSED. Frontend job `114317512517` SUCCESS **751 passed / 28 TODO**, 102 modules, build 23.03s.
- Model-only CI; no production distributed lease implementation. H2 global OPEN, isolation OFF in production.


## 2026-10-10 — Lease generation stress CI GREEN (648 backend)
- Plus technical SHA `15e9fa1c7c52d6f5d95f29064d6517e78db42e07`, cumulative run `38088648047`: backend job `114320351634` SUCCESS **648 passed, 1 warning, coverage 85.69%**; 50-generation stale lease fencing and exact-expiry renewal boundary explicitly PASSED. Frontend job `114320351445` SUCCESS 751 passed / 28 TODO. H1d run `38088648072` job `114320351577` SUCCESS 5 passed.
- These remain deterministic in-memory lease model tests; crash-resilient distributed coordinator and Render topology NOT certified. H2 OPEN, isolation production OFF.


## 2026-10-10 — Shared lease expiry CI GREEN: Plus 649 backend
- Plus technical SHA `e68d7d7f66156775be3427230cdacfc9217cb8e8`: cumulative run `38090329207` backend SUCCESS **649 passed / 1 warning / coverage 85.59%**, `test_expired_shared_lease_is_replaced_across_interpreters` explicitly PASSED. Frontend SUCCESS 751 passed / 28 TODO. H1d run `38090329193` SUCCESS 5 passed.
- Manager-backed shared dict/lock and clock steps are a CI-only characterization. Independent interpreter participation per operation, coordinator crash recovery and production fleet quota are NOT proven. SG28/H2 OPEN; production isolation OFF.


## 2026-10-10 — SG28 concurrent distinct-worker shared admission VERIFIED
- Plus SHA `d5a9b678a9eb7168aad7ca572d16e83da239edde` cumulative run `38093468330` backend `114334463820` SUCCESS **650 passed / 1 warning / 85.64% coverage**. `test_two_distinct_workers_contend_atomically_for_shared_k1` explicitly PASSED with distinct PIDs and exactly one shared K=1 grant. Frontend `114334463552` SUCCESS 751 passed / 28 TODO. H1d run `38093468338` SUCCESS.
- This proves CI Manager-backed atomic shared fixture across processes, NOT actual production distributed lease, crash-recovery or Render topology. H2 OPEN; production isolation OFF.


## 2026-10-10 — Shared silent-owner lease expiry VERIFIED in CI
- Plus SHA `ebb5d2a1931de3ce461d968070a75ca492a074fe` cumulative run `38096115207`: backend `114342238976` SUCCESS **651 passed / 1 warning / coverage 85.59%**, `test_shared_lease_recovers_after_owner_becomes_unresponsive` explicitly PASSED. Frontend `114342239231` SUCCESS 751 passed / 28 TODO; H1d `38096115318` `114342239392` SUCCESS 5 passed.
- Simulated TTL expiration with Manager-backed shared state only; NOT a coordinator crash or durable remote lease system. H2 global OPEN; SG28 production opt-in OFF.


## 2026-10-10 — Coordinator outage fail-closed model VERIFIED (655 backend)
- Plus technical SHA `af791596fcd5b2a46e3372d959df76f2786d25ed`; cumulative run `38096742454`: backend **655 passed / 1 warning / 85.69% coverage**, including 4 tests in `test_sg28_coordinator_failure_contract.py` explicitly PASSED; frontend **751 passed / 28 TODO**. H1d run `38096742451` **5 passed**.
- Fail-closed behavior was verified against an injected fake-store/model adapter only, NOT a deployed shared admission coordinator or actual network partition/crash. H2 OPEN, SG28 production opt-in OFF.


## 2026-10-10 — Coordinator outage recovery model GREEN, 657 backend
- Plus technical SHA `b56a48b3d0ff3c88f56289e70951d7e3bd39cffa`, cumulative run `38097699581`: backend **657 passed / 1 warning / 85.59% coverage**, tests `test_coordinator_recovers_without_granting_during_outage` and `test_coordinator_outage_does_not_erase_preexisting_owner` explicitly PASSED; frontend **751 passed / 28 TODO**. H1d run `38097699574` **5 passed**.
- Tests operate on in-memory injected fake coordinator, not a production distributed service or actual coordinator crash. H2 OPEN; production isolation OFF.


## 2026-10-10 — SQLite atomic admission fixture GREEN: 659 backend
- Plus SHA `17bcb0a488a98f97b7e966ff062806e4ebc0666e`: cumulative `38098388465` backend SUCCESS **659 passed / 1 warning / 85.69% coverage**, `test_atomic_storage_gate_denies_racing_k1_claims` and `test_storage_gate_expiry_fences_stale_release` both PASSED. Frontend SUCCESS 751 passed / 28 TODO. H1d run `38098388480` SUCCESS 5 passed.
- Test-only SQLite with threads and transactional K=1; NOT multi-host distributed admission, not real coordinator crash. H2 global OPEN, production SG28 OFF.


## 2026-10-10 — SQLite shared-file K=1 distinct processes GREEN: 660 backend
- Plus technical SHA `df10011434b426c42993335f64f641685a07d89d`, cumulative `38098850426`: backend **660 passed / 1 warning / 85.69% coverage**, `test_atomic_storage_gate_across_distinct_spawned_processes` explicitly PASSED; frontend 751 passed / 28 TODO. H1d `38098850420`: 5 passed.
- This verifies distinct spawned PIDs and atomic K=1 access to one local SQLite file; it does NOT prove cross-host distributed admission. H2 OPEN, production isolation OFF.


## 2026-10-10 — Atomic SQLite exact-expiry successor race GREEN: 661 backend
- Plus technical SHA `894087ed7a8dd6b603cb9f4e9c34c7e27243442b`, cumulative run `38099409315`: backend **661 passed / 1 warning / 85.77% coverage**, `test_storage_gate_concurrent_expiry_has_single_successor` explicitly PASSED; frontend **751 passed / 28 TODO**. H1d `38099409317`: **5 passed**.
- SQLite test-only same-host transactional state, NOT distributed coordinator/multi-host certification. H2 OPEN; production isolation OFF.


## 2026-10-10 — SG28 stale-owner release fence: CI VERIFIED (662 backend)
- Plus technical SHA `dd968bca8981d4c9ef124c4342bf97dfdd1c7a19`; cumulative run `38100438228`, backend job `114355088048` SUCCESS **662 passed / 1 warning / coverage 85.59%**; frontend job `114355087936` SUCCESS **751 passed / 28 TODO**, build SUCCESS. H1d run `38100438231`, job `114355087880`, SUCCESS **5 passed**.
- `test_stale_owner_release_cannot_revoke_live_successor` is included in the successful backend suite. This is a test-only same-host SQLite lease fixture; no distributed multi-host coordinator, global quota, coordinator crash recovery or Render production topology has been certified. SG28/H2 remains OPEN and SG28 isolation stays OFF in production.
- Next: characterize real cross-host admission with a suitable isolated coordinator and verify actual deployment topology before any production change; retain fail-closed behavior and fencing tests. Do not treat local SQLite tests as fleet-wide certification.


## 2026-10-10 — SG28 Render topology read-only verification
- Render workspace service inventory checked read-only. Plus production backend `precision-lab-plus-api` (service `srv-dap5siu0tbcc738gs4ug`): web service, `numInstances=1`, `plan=free`, branch `main`; start command `cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT` (no explicit `--workers`). Plus S26 backend `precision-lab-plus-s26-api` (service `srv-daqsn5h42hec73c48nbg`): also `numInstances=1`, `plan=free`, branch `qa/s26-execution`, same command form. Both are distinct services, not proof of a coordinated fleet or dynamic in-process worker count.
- No change to Render settings, deployments, or environment variables. The certification branch `qa/syntax-audit-in625-a1` is not the deployed Render service branch; CI-only SQLite coverage cannot be promoted to a production claim.
- SG28/H2 stays OPEN. Next: add an isolated test of independent process/service participants and real coordinator failure conditions before approving global admission; do not activate `SG28_EVALUATE_ISOLATION` in production without explicit authorization.


## 2026-10-10 — SG28 same-owner generation fencing regression PENDING CI
- Plus technical commit `1fbab66062f958f573f7c37f45aac7c90fa4d91f` updates `backend/tests/test_sg28_sqlite_admission_characterization.py` with `test_same_owner_stale_generation_cannot_release_reacquired_lease`.
- Scenario: the same owner reacquires after TTL with generation 2; delayed release of generation 1 must not revoke the current lease; an unrelated contender remains denied until current generation is released, and generation then advances to 3.
- CI result for this commit is not yet confirmed. Last verified cumulative Plus result remains 662 backend PASS, 751 frontend PASS / 28 TODO, H1d 5 PASS (run `38100438228`, `38100438231`). This is still a test-only SQLite fixture, NOT real multi-host coordination. H2 OPEN, SG28 production opt-in OFF.
- Next: verify cumulative and H1d runs for commit `1fbab66062f958f573f7c37f45aac7c90fa4d91f`, inspect logs and remediate if red; continue isolated distributed-admission characterization.


## 2026-10-10 — SG28 same-owner lease fencing CI GREEN (663 backend)
- Plus technical SHA `1fbab66062f958f573f7c37f45aac7c90fa4d91f` verified against push runs: cumulative `38102364408` backend job `114360748215` SUCCESS **663 passed / 1 warning / 85.64% coverage**, frontend job `114360748404` SUCCESS **751 passed / 28 TODO** and build SUCCESS. H1d run `38102364417` job `114360748279` SUCCESS **5 passed**.
- `test_same_owner_stale_generation_cannot_release_reacquired_lease` explicitly PASSED; this is a CI-only same-host SQLite characterization, not a distributed coordinator. SG28/H2 global remains OPEN; keep production experimental isolation OFF.
- Next: design and validate independent-host shared admission in a disposable environment, with coordinator outage/recovery, fencing and global K enforcement; record deployed topology and obtain explicit authorization before changing production.


## 2026-10-10 — SG28 abrupt owner process death fixture: CI pending
- Plus commit `478bc431df9701a7c6dbe86bcf35fc8f449fd23d` adds `test_storage_lease_expires_after_abrupt_owner_process_exit` to `backend/tests/test_sg28_sqlite_admission_characterization.py`. A separate spawned process acquires the test-only SQLite lease and exits abruptly; the main process checks denial before TTL, admission at expiry, increased generation and stale-release fencing.
- Automated Plus cumulative run `38103566886` observed QUEUED; H1d `38103566950` observed IN_PROGRESS. NO PASS claimed for new SHA. Previous Plus baseline: cumulative `38102364408` SUCCESS 663 backend / 751 frontend, H1d `38102364417` SUCCESS 5.
- No production coordinator or distributed cross-host guarantee: CI-only local SQLite fixture. SG28/H2 OPEN and production isolation OFF.
- Next: inspect outcomes and exact logs for `38103566886` and `38103566950`, fix any failure, then advance isolated coordination characterization.


## 2026-10-10 — SG28 abrupt owner exit verified (664 backend)
- Plus SHA `478bc431df9701a7c6dbe86bcf35fc8f449fd23d`: cumulative run `38103566886` backend job `114364280322` SUCCESS **664 passed / 1 warning / 85.69% coverage**, including `test_storage_lease_expires_after_abrupt_owner_process_exit` explicit PASS; frontend job `114364280495` SUCCESS **751 passed / 28 TODO**, build SUCCESS. H1d run `38103566950`, job `114364280562`, SUCCESS **5 passed**.
- This is a SQLite test fixture on one CI host with a spawned child that exits abruptly; it does not simulate loss of a shared remote coordinator, cross-host atomicity or production service deployment. H2 OPEN, production isolation OFF.
- Next: implement independently hosted coordinator/admission characterization in a disposable environment and verify fail-closed response and fencing when remote coordination fails; avoid production changes.


## 2026-10-10 — SG28 networked coordinator characterization: CI PENDING
- Plus technical commit `d59db5ad34acf350379b0bea89c6ef3f1b93d259` creates `backend/tests/test_sg28_tcp_admission_characterization.py`. Test-only loopback TCP coordinator backed by local SQLite checks K=1 denial, fail-closed network outage, post-restart lease expiry, and stale-release fencing.
- Auto-triggered Plus cumulative run `38104163070` and H1d run `38104163083` observed QUEUED; no PASS asserted for this SHA. Last verified: Plus 664 backend PASS, 751 frontend PASS / 28 TODO, H1d 5 PASS (runs `38103566886` and `38103566950`).
- This is a single-host loopback transport model and does NOT certify multi-host distributed admission, real coordinator persistence or production topology. SG28/H2 OPEN; production isolation OFF.
- Next: verify logs/jobs of both queued runs and correct any test failure; subsequently pursue actual independent-host disposable test topology before global certification.


## 2026-10-10 — SG28 TCP harness import failure fixed; rerun pending
- Plus SHA `d59db5ad34acf350379b0bea89c6ef3f1b93d259`: cumulative `38104163070` backend job `114366009320` FAIL at pytest collection: `ModuleNotFoundError` importing `test_sg28_sqlite_admission_characterization`; 664 tests collected but no backend test execution. Frontend job `114366009491` SUCCESS 751 PASS / 28 TODO; H1d run `38104163083` job `114366009395` SUCCESS 5 PASS.
- Root classification HARNESS/IMPORT, not confirmed product failure. Plus technical fix SHA `accab13a081e2ba659fd8f9f55ed72ba9a780ad7` makes `backend/tests/test_sg28_tcp_admission_characterization.py` self-contained with local disposable SQLite helpers. Exact CI result of fix still PENDING; no PASS claim. Previous confirmed backend baseline 664 PASS.
- Next: inspect cumulative and H1d runs for fix SHA, debug/repair if red, certify only with green backend log. Single-host loopback test is not global cross-host H2 certification; production SG28 isolation OFF.


## 2026-10-10 — SG28 TCP coordinator loopback CI GREEN (665 backend)
- Plus SHA `accab13a081e2ba659fd8f9f55ed72ba9a780ad7`: cumulative `38105067955` backend job `114368722480` SUCCESS **665 passed / 1 warning / coverage 85.59%**; `test_network_admission_fails_closed_during_coordinator_outage_and_recovers` PASSED. Frontend job `114368722306` SUCCESS **751 passed / 28 TODO** and build SUCCESS. H1d `38105067915` job `114368722286` SUCCESS **5 passed**.
- Previous RED `38104163070` was harness collection/import only; resolved in corrected SHA. Single-host TCP loopback and SQLite are not independent-host or deployed shared coordinator evidence. H2 remains OPEN, experimental production isolation OFF.
- Next: advance to separately running coordinator/client in an isolated CI process and then genuine cross-host network fault testing with an authorized ephemeral environment; verify global K and fencing before production consideration.


## 2026-10-10 — SG28 distinct spawned TCP coordinator/client PIDs: CI pending
- Plus technical SHA `a011a64bb4a4dc450275d031e5cc6996c26b7220` extends `backend/tests/test_sg28_tcp_admission_characterization.py` with `test_spawned_coordinator_and_distinct_clients_enforce_network_k1`: coordinator and two contending clients run as separate spawned Python processes over TCP; expected exactly one K=1 grant and denial of a subsequent contender.
- Auto-triggered cumulative run `38105661428` and H1d run `38105661406` observed QUEUED; no PASS claimed for new SHA. Previous Plus backend 665 PASS / frontend 751 PASS, H1d 5 PASS, SHA `accab13a081e2ba659fd8f9f55ed72ba9a780ad7`.
- Single-host disposable CI fixture, not cross-host distributed coordinator or production certification. SG28/H2 OPEN; isolation OFF in production.
- Next: verify the two run job logs, repair harness or product issues without weakening gates; pursue independent-host coordinator faults only when safely provisioned.


## 2026-10-10 — SG28 separate TCP process admission CI GREEN (666 backend)
- Plus technical SHA `a011a64bb4a4dc450275d031e5cc6996c26b7220`: cumulative run `38105661428`, backend job `114370542038` SUCCESS **666 passed / 1 warning / 85.64% coverage**; new `test_spawned_coordinator_and_distinct_clients_enforce_network_k1` PASSED. Frontend job `114370541881` SUCCESS **751 passed / 28 TODO** and build SUCCESS. H1d run `38105661406`, job `114370541842`, SUCCESS **5 passed**.
- Proven in isolated single-host CI: independent spawned coordinator and client PIDs connect by loopback TCP, with K=1 granted once. Not cross-host or production distributed coordination. SG28/H2 OPEN; experimental production isolation OFF.
- Next: characterize independent-host transport failure and coordinator restart in a disposable environment; explicitly verify fail-closed and fencing. Do not promote production changes without authorization.


## 2026-10-10 — SG28 abrupt coordinator TCP process termination characterization PENDING CI
- Plus technical commit `c8713a1cece7c1fef9982d3bb1bae4a0be41e52b` adds `test_abrupt_tcp_coordinator_process_death_fails_closed_and_fences_restart` in `backend/tests/test_sg28_tcp_admission_characterization.py`: spawned coordinator process terminated abruptly after granting lease; network admission must fail closed, a fresh coordinator reusing test-only SQLite must reject until TTL, advance fencing generation and deny stale release.
- No CI run was yet visible for this head SHA at time of recording; result PENDING. Previous verified Plus CI remains 666 backend PASS, 751 frontend PASS / 28 TODO, H1d 5 PASS (runs `38105661428`, `38105661406`).
- Loopback/one CI host, not proof of multi-host coordinator or production distributed admission. SG28/H2 OPEN and production experimental isolation OFF. Next verify triggered workflow, investigate and fix failures before recording PASS.


## 2026-10-10 — SG28 coordinator death/restart CI GREEN (667 backend)
- Plus technical SHA `c8713a1cece7c1fef9982d3bb1bae4a0be41e52b`: cumulative run `38106669590` backend SUCCESS **667 passed / 1 warning / 85.69% coverage**, including explicit PASS `test_abrupt_tcp_coordinator_process_death_fails_closed_and_fences_restart`; frontend SUCCESS **751 passed / 28 TODO**, build SUCCESS. H1d run `38106669540` SUCCESS **5 passed**.
- CI characterization covers terminating spawned TCP coordinator, fail-closed during outage, restart with local SQLite lease and generation fencing. All actors reside on one CI host. H2 globally OPEN; not deployed/independent-host distributed coordination. Production feature OFF.
- Next: independent-host fault testing with disposable coordinator and clients, without changing production; collect objective K/fencing/partition evidence before any closure claim.


## 2026-10-10 — SG28 lost TCP grant acknowledgement characterization PENDING CI
- Plus technical SHA `b7de156736fd035b83cff79e74de57be3085f48c` extends `backend/tests/test_sg28_tcp_admission_characterization.py` with `test_lost_grant_acknowledgement_fails_closed_and_preserves_fencing`. The test-only TCP handler `grant_disconnect` commits a lease to SQLite but deliberately drops the response. The client must fail closed, a second contender must be denied before TTL, a new generation must be granted at expiry and stale release denied.
- CI for this SHA NOT YET VERIFIED. Previous successful backend baseline: 667 PASS / 85.69% coverage, frontend 751 PASS / 28 TODO, H1d 5 PASS, Plus technical SHA `c8713a1cece7c1fef9982d3bb1bae4a0be41e52b`.
- This is local TCP fault injection, not a genuine independent-host partition. H2 OPEN; no production changes, SG28 experimental feature OFF.
- Next: inspect push-triggered cumulative/H1d runs for SHA `b7de156736fd035b83cff79e74de57be3085f48c`, fix red gates without weakening checks.


## 2026-10-10 — SG28 lost TCP grant acknowledgement CI GREEN (668 backend)
- Plus SHA `b7de156736fd035b83cff79e74de57be3085f48c`: cumulative run `38107214359`, backend SUCCESS **668 passed / 1 warning / 85.64% coverage**, with `test_lost_grant_acknowledgement_fails_closed_and_preserves_fencing` explicitly PASSED. Frontend SUCCESS **751 passed / 28 TODO** and build SUCCESS. H1d run `38107214301` SUCCESS **5 passed**.
- In disposable single-host CI fixture, a committed grant with deliberately dropped TCP response causes fail-closed client admission; another client is excluded until TTL and stale release remains fenced. Not proof of independently hosted coordination or distributed partition tolerance. H2 OPEN and production experimental isolation OFF.
- Next: advance independently hosted shared-coordinator checks only in an authorized isolated environment; record K=1, timeout, loss of response and fencing evidence before closure.


## 2026-10-10 — SG28 same-owner retry after lost TCP ACK: CI pending
- Plus technical commit `2737d46f130a0ef122bc48e1d3ae27db26e46553` adds `test_tcp_duplicate_retry_after_lost_ack_remains_unadmitted` to the disposable `backend/tests/test_sg28_tcp_admission_characterization.py` fixture. An unacknowledged grant must fail closed; same-owner retry and competing owner must remain denied before TTL, new generation granted only at expiry; stale release cannot remove successor.
- New SHA CI not yet observable as completed. Previous verified cumulative Plus `38107214359` SUCCESS 668 backend PASS / 751 frontend PASS (28 TODO), H1d `38107214301` 5 PASS.
- CI loopback, not proof of multi-host coordinator. SG28/H2 OPEN; production feature OFF. Next check CI for SHA `2737d46f130a0ef122bc48e1d3ae27db26e46553` and repair failed gate if needed.


## 2026-10-10 — SG28 TCP duplicate retry after lost ACK CI GREEN (669 backend)
- Plus SHA `2737d46f130a0ef122bc48e1d3ae27db26e46553`: cumulative run `38108184872` backend SUCCESS **669 passed / 1 warning / 85.59% coverage** including `test_tcp_duplicate_retry_after_lost_ack_remains_unadmitted` PASSED; frontend SUCCESS **751 passed / 28 TODO**, build SUCCESS. H1d run `38108184868` SUCCESS **5 passed**.
- This proves same-owner retries and other contenders cannot bypass single-host test-only K=1 admission after lost TCP ACK. Not proof of real multi-host global coordination; H2 OPEN, production isolation OFF.
- Next: independent-host ephemeral coordinator validation, transport partitions and fenced recovery without production changes.


## 2026-10-10 — SG28 TCP duplicate release retry fencing PENDING CI
- Plus technical commit `b5282acae8981c969bd22a19829b66b649bd0017` adds `test_tcp_lost_release_ack_does_not_revoke_successor` to test-only `backend/tests/test_sg28_tcp_admission_characterization.py`: after a first release permits successor generation 2, a duplicate old-generation release must be denied and third contender remains excluded. This models a retry due to a lost release acknowledgement; the reply itself is not actively dropped in this scenario.
- CI status for this SHA still unverified. Previous verified Plus cumulative `38108184872` SUCCESS 669 backend PASS, 751 frontend PASS / 28 TODO; H1d `38108184868` SUCCESS 5 PASS.
- Scope is single-host loopback, not cross-host distributed certification. SG28/H2 OPEN, production isolation OFF. Next verify auto-triggered cumulative and H1d CI, repair any failure before recording PASS.


## 2026-10-10 — SG28 TCP duplicate release fencing GREEN (670 backend)
- Plus technical SHA `b5282acae8981c969bd22a19829b66b649bd0017`: cumulative `38108867379` backend SUCCESS **670 passed / 1 warning / coverage 85.69%**; `test_tcp_lost_release_ack_does_not_revoke_successor` explicitly PASSED. Frontend SUCCESS **751 passed / 28 TODO**, build SUCCESS. H1d `38108867385` SUCCESS **5 passed**.
- Test covers retry of old-generation release after successor admission on loopback TCP with disposable SQLite, not actual lost reply injection or independent-host distributed coordination. SG28/H2 OPEN, production isolation OFF.
- Next: test-only actual lost release acknowledgement, coordinator response uncertainty and idempotent fencing; then genuine cross-host test in authorized disposable deployment.


## 2026-10-10 — SG28 lost TCP release acknowledgement injection: CI pending
- Plus SHA `a4f81a9f58dac62c77b339174ac1462492093166` extends test-only `backend/tests/test_sg28_tcp_admission_characterization.py`: `release_disconnect` commits SQLite release then drops TCP reply; `test_tcp_lost_release_ack_retry_remains_fenced` checks ambiguous client outcome, successor generation 2, denied stale release retry and continued K=1 admission.
- Plus cumulative workflow `38109176704` observed QUEUED; latest verified baseline 670 backend PASS / 751 frontend PASS / H1d 5 PASS (runs `38108867379`, `38108867385`). New SHA PASS not yet confirmed.
- Single-host CI fault injection, not independent-host coordination. SG28/H2 OPEN, production feature OFF. Next check new cumulative/H1d jobs and logs, fix any failure.


## 2026-10-10 — SG28 lost TCP release acknowledgment CI GREEN (671 backend)
- Plus technical SHA `a4f81a9f58dac62c77b339174ac1462492093166`: cumulative run `38109176704` backend SUCCESS **671 passed / 1 warning / 85.69% coverage** with `test_tcp_lost_release_ack_retry_remains_fenced` explicitly PASSED; frontend SUCCESS **751 passed / 28 TODO** and build SUCCESS. H1d run `38109176705` SUCCESS **5 passed**.
- Test-only single-host TCP injected dropped release acknowledgement; stale retry cannot revoke later-generation lease. Does NOT certify independent-host distributed admission. SG28/H2 OPEN; experimental production isolation OFF.
- Next: independent-host disposable topology and coordination fault tests, without modifying production. Verify global K=1 under partitions before considering closure.


## 2026-10-10 — SG28 unsupported coordinator operation denial: CI pending
- Plus technical SHA `3ec5c052e9ec154de921204d29cd982bd470e1e7` adds `test_tcp_unknown_release_response_keeps_client_fail_closed` to single-host TCP characterization. The test covers the valid-JSON error `unsupported operation` (NOT malformed JSON), and verifies it is not interpreted as a grant and cannot displace an active lease.
- Plus cumulative `38110549495` and H1d `38110549461` observed QUEUED. Last verified Plus cumulative `38109176704` SUCCESS 671 backend PASS / 751 frontend PASS (28 TODO); H1d `38109176705` 5 PASS.
- Still no independent-host coordinator or production validation. SG28/H2 OPEN; isolation production OFF. Next confirm queued CI results and pursue genuine cross-host testing in approved disposable environment.


## 2026-10-10 — SG28 unsupported coordinator operation CI GREEN (672 backend)
- Plus SHA `3ec5c052e9ec154de921204d29cd982bd470e1e7`: cumulative `38110549495` backend SUCCESS **672 passed / 1 warning / 85.64% coverage**, with `test_tcp_unknown_release_response_keeps_client_fail_closed` PASSED; frontend SUCCESS **751 passed / 28 TODO** and build SUCCESS. H1d run `38110549461` SUCCESS **5 passed**.
- Validation concerns a valid JSON error for unsupported operation; not arbitrary malformed JSON or cross-host partition. H2 OPEN; no distributed coordinator deployment, production isolation OFF.
- Next: advance independent-host disposable coordinator verification and real K=1 partition/fail-closed evidence before H2 closure.


## 2026-10-10 — SG28 truncated TCP JSON request regression: CI pending
- Plus technical commit `3486aa5f6ac62dcb8f106034a1011bfe2ddc8b01` adds `test_tcp_lease_does_not_authorize_other_owner_after_malformed_request` in `backend/tests/test_sg28_tcp_admission_characterization.py`. A truncated TCP JSON request is sent while a valid K=1 lease is active. Test asserts no successful admission response and unchanged owner/generation/deadline, with subsequent contender denied. Test-only loopback fixture.
- No new SHA workflow was observable when checked; CI result PENDING. Last verified Plus `38110549495` SUCCESS 672 backend PASS / 751 frontend PASS (28 TODO), H1d `38110549461` SUCCESS 5 PASS.
- This is not cross-host coordination and does not close H2; experimental production feature OFF. Next verify push-triggered cumulative/H1d CI and repair failures before claiming PASS.


## 2026-10-10 — SG28 truncated TCP frame regression GREEN (673 backend)
- Plus technical commit `3486aa5f6ac62dcb8f106034a1011bfe2ddc8b01`: cumulative run `38111145338`, backend SUCCESS **673 passed / 1 warning / 85.64% coverage**, including explicit PASS `test_tcp_lease_does_not_authorize_other_owner_after_malformed_request`; frontend SUCCESS **751 passed / 28 TODO**, build successful. H1d run `38111145485` SUCCESS **5 passed**.
- Local disposable TCP test confirms a truncated JSON frame cannot change a pre-existing lease or yield a successful admission. This is not cross-host certification. SG28/H2 OPEN; production isolation OFF.
- Next: obtain cross-host shared-coordinator evidence in disposable authorized infrastructure before closure; do not conflate CI loopback tests with multi-host guarantees.


## 2026-10-10 — SG28 lost grant ACK then TCP coordinator restart: CI pending
- Plus technical commit `cf2e04e90bf512753dfddb7eed57f4590a6f272a` adds `test_tcp_coordinator_restart_preserves_fence_after_lost_grant_ack` in disposable `backend/tests/test_sg28_tcp_admission_characterization.py`: failed acknowledgment after persisted grant; coordinator is restarted using same test SQLite file; same owner and other contender must be denied before TTL, successor generation 2 admitted at expiry, stale release fenced.
- No auto-run yet visible by exact SHA at time of check; outcome PENDING CI. Last verified Plus cumulative `38111145338` SUCCESS 673 backend PASS / 751 frontend PASS / 28 TODO, H1d `38111145485` 5 PASS.
- Local single-host TCP/SQLite restart only. No independent-host multi-region or real shared coordinator verification. SG28/H2 OPEN, production experimental isolation OFF.
- Next: inspect newly triggered cumulative/H1d actions, fix any failure before claiming PASS; plan authorized disposable independent-host validation.

## 2026-10-10 — SG28 lost-ACK restart: persisted lease assertions added; CI unverified
- Plus technical commit `c435bcfd6f35cdd39334754a319d168377116fae`, test-only change in `backend/tests/test_sg28_tcp_admission_characterization.py` (`test_tcp_coordinator_restart_preserves_fence_after_lost_grant_ack`).
- Adds explicit SQLite lease assertions after dropped grant acknowledgement and after restart/fenced stale release: original owner/generation/deadline = (`worker-a`,1,5); successor = (`worker-b`,2,10). Product and production configuration unchanged.
- The preceding technical commit `cf2e04e90bf512753dfddb7eed57f4590a6f272a` was retrieved and inspected. The available commit-associated workflow query returned no PR-triggered runs; it does not list push-triggered runs. Neither that SHA nor the new SHA has a verified completed cumulative run in this session. **CI: PENDING/UNVERIFIED, not PASS.**
- Last directly verified cumulative Plus run remains `38111145338` (backend and frontend jobs both SUCCESS) on the preceding known baseline; prior recorded 673 backend PASS / 751 frontend PASS / 28 TODO. Do not transfer its PASS to new SHA.
- Next exact action: obtain Plus cumulative workflow run for SHA `c435bcfd6f35cdd39334754a319d168377116fae`, inspect backend/front-end jobs and pytest logs, fix actual failures, then progress isolated independent-host K=1/fencing validation. SG28/H2 stays OPEN and production isolation OFF.

## 2026-10-10 — SG28 competing TCP clients after lost-ACK restart (CI PENDING)
- Plus test-only commit `faf35e824ee60c77a8c6a2498996787dd8e9d3dd` extends `backend/tests/test_sg28_tcp_admission_characterization.py` with `test_tcp_restart_after_lost_grant_ack_keeps_k1_for_competing_clients`.
- The test uses a disposable loopback TCP/SQLite coordinator, drops the initial grant acknowledgement, restarts the server, and races two client threads at the lease deadline. Required oracle: exactly one K=1 grant in generation 2; stale generation 1 release denied; SQLite row matches winner.
- This commit is **published but NOT CI verified**. Earlier technical commit `c435bcfd6f35cdd39334754a319d168377116fae` also has no run/job evidence retrievable via the connector, whose commit workflow listing omits push runs. User reported CI finished, but that report alone does not authorize PASS.
- No production code, Render configuration, or isolation flag changed; genuine independent-host K=1/distributed coordinator verification remains outstanding. SG28/H2 OPEN.
- Next exact action: locate push-run of `faf35e824ee60c77a8c6a2498996787dd8e9d3dd` through GitHub Actions or supplied run URL; inspect backend and frontend jobs and pytest detailed output; if red, diagnose/correct; only after confirmed green proceed to disposable independent-host validation.

## 2026-10-10 local / 2026-10-11 UTC — SG28 K=1 after lost-ACK restart: CI GREEN
- Plus technical SHA `faf35e824ee60c77a8c6a2498996787dd8e9d3dd` verified through **IN625 Cumulative Certification Gate** run `38114270937` (push, branch `qa/syntax-audit-in625-a1`, completed SUCCESS).
- Backend job `114395923208` SUCCESS, log: **675 passed, 1 warning**, 85.69% coverage (threshold 75%); includes `test_tcp_restart_after_lost_grant_ack_keeps_k1_for_competing_clients`.
- Frontend job `114395923314` SUCCESS: **69 test files PASS, 751 passed / 28 TODO**, typecheck and build SUCCESS.
- The test confirms only loopback TCP/SQLite admission of exactly one contender after restart/lost grant acknowledgment, generation fencing and persisted winner; **not** an independent-host/global distributed admission test. No production changes; experimental isolation remains OFF. SG28/H2 OPEN.
- Next precise gate: design and execute genuinely independent-host shared-coordinator checks in explicitly authorized disposable infrastructure with K=1 under concurrent calls, partition fail-closed, TTL and stale-release fencing, failure and recovery records. Do not claim global certification until evidence exists.

## 2026-10-10 local / 2026-10-11 UTC — Lite documentation-only CI noise corrected
- Verified Plus cumulative run `38114270937` SUCCESS and H1d run `38114270939` SUCCESS on technical SHA `faf35e824ee60c77a8c6a2498996787dd8e9d3dd`; previous Plus cumulative runs `38112999237` and `38113187088` also SUCCESS on `cf2e04e` and `c435bcf` respectively.
- Found Lite workflow `.github/workflows/in625-lite-build-diagnostic.yml` fired on documentation-only push (run `38114591038`, SHA `f02f5a6`, SUCCESS), contrary to automation policy.
- Published Lite workflow fix commit `42b504a3f2517f3c01650a139e41339a0864c6f7`: add `push.paths-ignore` for `qa/certification/**` and `**/*.md` while preserving manual dispatch and technical-change push triggers.
- This YAML is published; **trigger-filter verification still pending** (technical YAML push should run build, subsequent docs-only push should not). Do not mark filter behavior validated without observations.
- SG28/H2 remains OPEN: loopback tests cannot establish independent-host global K=1 or partition fail-closed. Experimental production mode OFF. Next: verify Lite workflow trigger behavior and prepare independent-host test environment before distributed certification.

## 2026-10-10 local / 2026-10-11 UTC — Lite build filter technical push verified GREEN
- Lite technical YAML SHA `42b504a3f2517f3c01650a139e41339a0864c6f7` completed three `push` workflows: build diagnostic `38114956941` SUCCESS; cumulative certification `38114956929` SUCCESS (85 files, 1036 tests PASS / 30 TODO); H1d `38114956970` SUCCESS (5 Playwright PASS).
- On later documentation commits `aff8b36` and `9d5c025`, the latest 12 branch-scoped GitHub Actions runs included no runs for these docs-only SHAs; the branch HEAD was `9d5c025`. This is observed evidence of no additional listed runs from these commits, not a promise about every future push filter condition.
- The corrected `in625-lite-build-diagnostic.yml` retains `workflow_dispatch` and ignores `qa/certification/**` plus `**/*.md` on push. No production change. Plus technical gate `38114270937` remains SUCCESS (675 backend PASS, 751 frontend PASS / 28 TODO).
- SG28/H2 remains OPEN pending independent-host distributed K=1 and network partition/fail-closed evidence; do not equate loopback TCP/SQLite with distributed production coordination.

## 2026-10-10 local — SG28 spawned-process lost-ACK restart concurrency: CI pending
- Plus test-only SHA `afc69c38403d2abef8d1f9be3590a2d349bdc89b`, file `backend/tests/test_sg28_tcp_admission_characterization.py`.
- Adds `test_spawned_clients_compete_at_expiry_after_lost_ack_restart`: real separate spawned client PIDs race for K=1 over TCP after an earlier grant acknowledgment is lost and coordinator is restarted with a retained SQLite lease. Oracles: exactly one generation-2 grant, stale generation-1 release denied, persisted row matches sole winner.
- Extends helper `_independent_client` with optional `now=0`, preserving existing test behavior by default. No product, Render, or production configuration changes.
- **Status PENDING CI** for new SHA; no PASS claimed. Single CI host with multiple processes is not proof of independent-host distributed admission.
- Next: verify Plus cumulative and H1d workflows for this SHA, inspect pytest case/log and frontend jobs; repair failures if present. True multi-host fail-closed/partition checks remain BLOCKED pending separate authorized disposable infrastructure. SG28/H2 OPEN.

## 2026-10-10 local / 2026-10-11 UTC — SG28 spawned-process lost ACK restart GREEN
- Plus technical commit `afc69c38403d2abef8d1f9be3590a2d349bdc89b`: cumulative workflow run `38115393470` completed SUCCESS, backend job `114399170437` PASS **676 passed / 1 warning / 85.72% coverage**, including explicit PASSED `test_spawned_clients_compete_at_expiry_after_lost_ack_restart`. Frontend job `114399170567` SUCCESS **751 passed / 28 TODO**, 69 test files. H1d run `38115393420`, job `114399170411`, SUCCESS **5 passed**.
- This is evidence of separate spawned client PIDs, local TCP, SQLite lease persistence, lost grant acknowledgment, restart, K=1 and generation fencing **on one GitHub runner host only**. It is NOT independent-host/multi-region certification.
- SG28/H2 remains OPEN; experimental isolation OFF in production. Next action: use explicitly authorized disposable separate-host environment for network partition/fail-closed and global K=1 or record capability/deployment blocker; do not relabel local CI as distributed PASS.

## 2026-10-10 local — SG28 spawned pre-expiry admission must fail closed (CI PENDING)
- Plus test-only SHA `e8aea05a63daf67cb07a647a9ad351d7f395cdfb` modifies `backend/tests/test_sg28_tcp_admission_characterization.py`, test `test_spawned_clients_compete_at_expiry_after_lost_ack_restart`.
- Added a spawned independent PID making a pre-expiry grant request at logical time 4 after lost grant ACK and coordinator restart. Test requires denial and retained SQLite lease (`original`, generation 1, deadline 5) before two separate PIDs race at logical expiry 5; exactly one must receive generation 2. This is a single-host, disposable TCP+SQLite characterization, NOT a distributed multi-host proof.
- CI for this new SHA is PENDING until exact cumulative backend/frontend and H1d workflows finish. Previous Plus run `38115393470` SUCCESS 676 backend PASS / 85.72% coverage, 751 frontend PASS / 28 TODO; H1d `38115393420` SUCCESS 5/5. Neither result certifies the new commit.
- SG28/H2 OPEN, production experimental isolation OFF; independent-host admission and network partition validation remains separate capability/deployment gap.

## 2026-10-10 local / 2026-10-11 UTC — SG28 spawned pre-expiry denial CI GREEN
- Plus technical SHA `e8aea05a63daf67cb07a647a9ad351d7f395cdfb`: cumulative run `38115617774` completed SUCCESS, backend job `114399811404` **676 passed / 1 warning / 85.69% coverage**, including explicit PASS `test_spawned_clients_compete_at_expiry_after_lost_ack_restart`. Frontend job `114399811536` **69 test files PASS, 751 passed / 28 TODO**. H1d run `38115617835` job `114399811454` **5 passed**.
- Verified scenario: after lost TCP grant ACK and coordinator restart, separate spawned client requesting grant before expiry is denied, original SQLite lease persists; after expiry, a single competing spawned process receives generation 2 and stale generation 1 release is fenced. All participants remained on one CI host.
- SG28/H2 OPEN: independent-host global K=1, network partitions and fail-closed behavior remain unverified. No production modification, isolation OFF. Next: prepare authorized disposable multi-host infrastructure and actual transport fault evidence, avoiding more loopback tests as substitute for multi-host proof.

## 2026-10-10 local — SG28 stale release from separate spawned process (CI pending)
- Plus technical SHA `5e1ec807ad3beb8317f6d615383e691569720003` modifies `backend/tests/test_sg28_tcp_admission_characterization.py`: the previously validated lost-ACK coordinator restart / K=1 race test now submits the stale generation-1 release from an independently spawned client process; requires `released=False`, an additional contender denied at logical time 6 and unchanged generation-2 SQLite lease.
- Change is test-only, with no production/backend service configuration changes. Previous Plus CI green: cumulative `38115617774` (676 backend PASS, 751 frontend PASS / 28 TODO), H1d `38115617835` (5 PASS); these runs DO NOT certify the new SHA.
- Next: verify cumulative/H1d push CI for `5e1ec807ad3beb8317f6d615383e691569720003`, inspect test and logs, correct failures if any. Genuine multi-host shared-coordinator tests remain BLOCKED by lack of verified independent-host disposable topology; SG28/H2 OPEN, production isolation OFF.

## 2026-10-10 local / 2026-10-11 UTC — SG28 separate-process stale-release CI GREEN
- Plus technical SHA `5e1ec807ad3beb8317f6d615383e691569720003`: cumulative run `38116009014` SUCCESS (backend job `114400923956`: **676 passed / 1 warning / 85.64% coverage**, explicit PASS `test_spawned_clients_compete_at_expiry_after_lost_ack_restart`; frontend job `114400923861`: **751 passed / 28 TODO**, 69 files). H1d run `38116009037` SUCCESS (job `114400923856`: **5 passed**).
- Stale generation-1 release from a separately spawned process did not revoke generation-2 lease; third contender denied. Scope is single-host, local TCP and SQLite. Genuine independent-host K=1/fault-tolerance evidence remains absent.
- SG28/H2 remains OPEN; production isolation OFF. Next: independent-host disposable topology validation, global capacity enforcement and transport failures. Do not infer distributed PASS from local CI.

## 2026-10-10 local — SG28 distributed acceptance contract formalized
- Published `qa/certification/SG28_DISTRIBUTED_ACCEPTANCE.md` in both canonical branches (Lite `09847abd8a82f11e292372a39488b763eab49c83`, Plus `0927533c91047a9ec980f5dd7fd221b89b94b28c`).
- The contract defines DIST-01..08 covering independently hosted K=1, lost ACK, partition fail-closed, restart, fencing, TTL recovery, saturation and public opt-in endpoint cancellation and MathResponse parity. These are acceptance criteria only, **not executed PASSES**.
- Architectural blocker verified in Plus `backend/app/services/request_cancellation.py`: bounded semaphore is process-local. TCP/SQLite server presently exists only as test fixture, not integrated production coordinator.
- Render service discovery requires the user to select/confirm a workspace; no workspace was selected and no services were modified. An authorized disposable two-host topology is not currently established. **DIST-01..08 BLOCKED/NOT CERTIFIED**; SG28/H2 remains OPEN and production opt-in OFF.
- Next exact executable step: verify whether a disposable workspace/topology is available after explicit workspace confirmation and implement integrated coordinator contract in a separate technical branch, then run independent-host tests. Meanwhile independent non-distributed certification blocks may proceed under EXECUTION_PROTOCOL without counting DIST tests as PASS.

## 2026-10-10 local — SG28 reserved admission releases slot on exception (CI pending)
- Plus technical commit `232b253798baa36051bce07e6d98bd695d690679` adds `test_sg28_local_admission_released_after_exception` to `backend/tests/test_sg28_admission_scope.py`.
- Test injects a one-slot local semaphore, asserts competing request denied while reserved, forces request-body exception, and asserts admission recovers on exit. No product implementation change; the test is local-process scope only.
- Previous verified Plus cumulative CI `38116009014` SUCCESS and H1d `38116009037` SUCCESS; those are not evidence for the new SHA. CI PENDING until run/log verification.
- SG28 distributed acceptance remains BLOCKED: process-local semaphore does not implement global admission; `qa/certification/SG28_DISTRIBUTED_ACCEPTANCE.md` DIST-01..08 are not PASS. No deployment, Render workspace change, or production flag change.
- Next: verify cumulative/H1d for `232b253798baa36051bce07e6d98bd695d690679`, repair any red, then proceed with independent remaining certification work while distributed prerequisites remain blocked.

## 2026-10-10 local / 2026-10-11 UTC — SG28 exception admission recovery CI GREEN
- Plus SHA `232b253798baa36051bce07e6d98bd695d690679`: cumulative `38116482798` SUCCESS, backend job `114402265778`: **677 passed / 1 warning / 85.69% coverage**, explicit PASS `test_sg28_local_admission_released_after_exception`; frontend job `114402266148`: 69 files / **751 passed / 28 TODO**. H1d run `38116482788`, job `114402265679`: **5 passed**.
- Scope: unit regression confirming release of local `threading.BoundedSemaphore` capacity after a request-body exception. Does not certify multi-host admission; DIST-01..08 remain blocked pending separate authorized staging topology, real shared-coordinator implementation and fault-injection evidence.
- This revision of documentation does not change code, production flags or staging services.

## 2026-10-10 local — SG28 async cancellation releases reserved local slot (CI pending)
- Plus technical SHA `e6e7f61e8910caff95ad329475766ffe9c3ef014` extends `backend/tests/test_sg28_admission_scope.py` with `test_sg28_local_admission_released_after_async_task_cancellation`.
- An asyncio task acquires a single local lease and awaits indefinitely. Concurrent local admission must be refused. Cancelling the task must propagate `CancelledError` and release the slot, allowing a subsequent lease. This guards the actual context manager without a service implementation change.
- Prior Plus cumulative `38116482798` SUCCESS (677 backend PASS, 751 frontend PASS / 28 TODO), H1d `38116482788` SUCCESS (5 PASS); those runs do not certify this new SHA.
- Local-process unit scope only; DIST-01..08 separate-host gates remain BLOCKED/NOT CERTIFIED. Production flag OFF. Next verify CI on SHA and repair any failures.

## 2026-10-11 UTC — SG28 asyncio cancellation capacity regression GREEN
- Plus technical SHA `e6e7f61e8910caff95ad329475766ffe9c3ef014`: cumulative run `38116673229` SUCCESS (backend job `114402805729`: **678 passed / 1 warning / 85.74% coverage**, explicit PASS `test_sg28_local_admission_released_after_async_task_cancellation`; frontend job `114402805926`: **751 passed / 28 TODO**, 69 files). H1d run `38116673269`, job `114402805954`: **5 passed**.
- Scope: local admission lease freed after cancelling an asyncio task; no evidence of global K=1 across hosts. SG28 distributed acceptance DIST-01..08 remains BLOCKED pending independent staging topology and shared coordinator implementation. Production flag OFF.

## 2026-10-11 — SG28 grouped phase failure lease cleanup (CI pending)
- Plus technical commit `feb8cfd4fa24676bd91be88286c972a9329d4a1a` adds a local admission regression in `backend/tests/test_sg28_admission_scope.py`: a reserved slot is released when an `ExceptionGroup` representing evaluation/render failures escapes its scope. The group must retain both original exception types and a subsequent request must acquire the slot.
- This is a context-manager cleanup test only; no production code changes or new multi-host evidence. Previous Plus green SHA `e6e7f61e8910caff95ad329475766ffe9c3ef014`, cumulative `38116673229` 678 backend PASS / 751 frontend PASS / 28 TODO, H1d `38116673269` 5 PASS. New technical commit remains **CI PENDING**.
- SG28/H2 OPEN. Distributed DIST-01..08 not yet certified; production SG28 opt-in remains OFF.

## 2026-10-11 UTC — SG28 grouped phase exception cleanup CI GREEN
- Plus SHA `feb8cfd4fa24676bd91be88286c972a9329d4a1a`: cumulative run `38116952183` SUCCESS; backend job `114403617094`: **679 passed / 1 warning / 85.69% coverage**, explicit PASS `test_sg28_local_admission_released_after_nested_exception_group`; frontend job `114403617004`: **751 passed / 28 TODO**, 69 files; H1d run `38116952184` job `114403616714`: **5 passed**.
- Scope: local context manager exception-group cleanup, not actual multi-host admission. SG28 DIST-01..08 remain unverified until a shared production-relevant coordinator and authorized disposable multi-host topology exist. Production opt-in OFF.

## 2026-10-11 UTC — SG28 shared admission fail-closed contract introduced; CI PENDING
- Plus technical commits `b33da3f34b2215f01740c7936a4a3b50f7a34de3` and `c0c4fa1e58fecafec1deeebd6411d15541561399` add `backend/app/services/shared_admission_contract.py` and `backend/tests/test_sg28_shared_admission_contract.py`.
- New strictly unused/experimental adapter defines shared lease protocol, validates owner/generation/deadline, rejects unavailable/invalid grants and uncertain releases, and differentiates contention from coordinator failures. Tests cover refusal under contention, outage fail-closed with retained lease, stale release, invalid acknowledgements and bounds. **Not wired to public evaluate route; no actual network coordinator implemented.**
- CI is PENDING for final technical SHA `c0c4fa1e58fecafec1deeebd6411d15541561399`. Earlier 679-backend green run `38116952183` does not verify this change.
- DIST-01..08 remain **BLOCKED**, requiring explicit disposable independent-host infrastructure, coordinator implementation and integration, plus observed fault/partition tests. Production opt-in OFF.

## 2026-10-11 UTC — SG28 shared admission adapter contract CI GREEN
- Plus technical SHA `c0c4fa1e58fecafec1deeebd6411d15541561399`: cumulative run `38117204625` SUCCESS; backend job `114404363647` **691 PASS / 1 warning / 85.76% coverage**, explicitly PASS all 12 shared admission contract cases; frontend job `114404363484` **751 PASS / 28 TODO**, 69 files. H1d run `38117204618`, job `114404363602` **5 PASS**.
- Verified new `SharedAdmissionClient` boundary with fake stores only. No actual remote coordinator, no public /evaluate connection. DIST-01..08 remain BLOCKED/NOT CERTIFIED.
- Next work: implement an isolated real network transport and bounded, fenced shared lease backing for disposable integration, then use authorized independent-host topology for distributed acceptance; maintain production opt-in OFF.

## 2026-10-11 UTC — SG28 isolated TCP shared lease transport and smoke tests CI pending
- Plus technical SHA `f3d0e177243c8d72cad1898f63461570228dc7a3` creates `backend/app/services/sg28_tcp_shared_store.py`, a bounded-timeout, bounded-reply, line-delimited JSON TCP transport implementing the unused experimental `SharedLeaseStore` interface. SHA `3e4cb36fe2f0185c3246e1a6f56a063628775777` adds seven TCP smoke/fail-closed tests in `backend/tests/test_sg28_tcp_shared_store.py`.
- New transport is NOT routed into /evaluate and has no TLS, authentication, server coordinator implementation, or independent-host evidence; for disposable experiments only, never deploy in production. A reply without valid ACK must not authorize math work. The tests use loopback fixture and do NOT close DIST-01..08.
- Latest prior PASS: Plus `38117204625` backend 691 PASS and frontend 751 PASS / 28 TODO; H1d `38117204618` 5 PASS. Technical SHA `3e4cb36fe2f0185c3246e1a6f56a063628775777` CI PENDING.

## 2026-10-11 UTC — SG28 experimental TCP transport CI GREEN
- Plus SHA `3e4cb36fe2f0185c3246e1a6f56a063628775777`: cumulative run `38118714975` SUCCESS; backend job `114408821119`: **698 passed / 1 warning / 85.89% coverage**, seven TCP transport smoke test cases explicitly PASS; frontend job `114408821263`: **751 passed / 28 TODO**, 69 files. H1d run `38118714981`, job `114408821231`: **5 passed**.
- Scope: isolated local TCP client over loopback, validates good grant/release, missing or bad ACK fail-closed. Transport has NO TLS/authentication and is NOT wired to /evaluate. No real remote coordinator or independent host certification. DIST-01..08 remain OPEN/BLOCKED; production isolation OFF.

## 2026-10-11 UTC — SG28 shared grant generation strictness (CI PENDING)
- Plus technical commits `8d480564390e5ec3e68630bd1c3a1a411991e47f` and `61545e3757fdf4943032c59d9ad126bff6b1f3fa`: shared admission contract now rejects non-integer generation fields, including Python `bool` and fractional values, with two added parametrized regression cases. Previous TCP transport CI `38118714975` 698 backend PASS and `38118714981` H1d 5 PASS; these do not certify new SHA.
- This is a strict client response validation fix, not a coordinator server or multi-host proof. New cumulative + H1d results PENDING; no /evaluate or production changes. DIST-01..08 remain BLOCKED.

## 2026-10-11 UTC — SG28 strict lease generation CI GREEN
- Plus technical SHA `61545e3757fdf4943032c59d9ad126bff6b1f3fa`: cumulative `38118952991` SUCCESS; backend job `114409525088` **700 PASS / 1 warning / 85.81% coverage**, including all eight parameterized invalid-lease reply cases; frontend job `114409525219` **751 PASS / 28 TODO**, 69 files. H1d `38118952975`, job `114409525027` **5 PASS**.
- The shared-admission facade rejects boolean and fractional generation values; transport not connected to public endpoint; experimental service remains opt-in OFF. No independent-host DIST-01..08 pass inferred.


## 2026-10-11 — SG28 TCP JSON ambiguity fail-closed (CI pending)
- Verified Plus SHA `ad7afc2aa24ee1e138523ae1bfd46b93a3164dc1`: cumulative `38123493739` SUCCESS, backend **727 passed / 1 warning / 85.87% coverage**, frontend **751 passed / 28 TODO**, H1d `38123493734` **5 passed**.
- Plus technical SHA `cac5cc2fe90029d1800636418eeefd30e7a4ccb8`: isolated experimental TCP transport rejects duplicate JSON keys (including conflicting grant fields) and nonfinite JSON constants.
- Plus test SHA `b82f883f5a8540d95f4efbcadd2b9073f888e000`: four raw TCP ACK regression cases. Cumulative run `38131653940` and H1d `38131653937` started; **CI PENDING** at time of recording, not PASS.
- Experimental client only, not connected to `/evaluate`; no TLS, authentication, production rollout or independently hosted coordinator. DIST-01..08 and SG28/H2 remain OPEN/BLOCKED.
- Next: inspect those two runs and per-case backend logs for the final SHA. Correct any confirmed failures. Continue toward disposable shared coordinator and independent-host fencing evidence, keeping production isolation OFF.


## 2026-10-11 — SG28 TCP malformed ACK regression repaired after failed collection
- Plus SHA `b82f883f5a8540d95f4efbcadd2b9073f888e000`: H1d `38131653937` SUCCESS (5 PASS); cumulative `38131653940` **FAIL** because Python SyntaxError at line 40 of `backend/app/services/sg28_tcp_shared_store.py` during pytest collection, caused by a literal escaped newline in the decoder call. Frontend job succeeded; backend regression tests did NOT run on this SHA.
- Repair published Plus `de2dc57f35ef812fc0e6ff644a5903324e4dac25` fixes the decoder syntax. Plus `50768893776664d3d545c127076c62561ff7ef01` repairs raw fixture newline termination in the four new ACK tests.
- Latest technical SHA `50768893776664d3d545c127076c62561ff7ef01`: cumulative `38132891941` and H1d `38132891912` queued when observed. **Results PENDING** and no new PASS asserted.
- Strict duplicate JSON field and nonfinite ACK rejection remain experimental, not routed into /evaluate. Production OFF. DIST-01..08 and SG28/H2 OPEN.
- Next exact step: retrieve cumulative and H1d results for SHA `50768893776664d3d545c127076c62561ff7ef01`, classify and repair any red, then continue coordinator integration safely in an isolated test topology.


## 2026-10-11 — SG28 TCP ACK recovery and framing regressions
- Plus SHA `50768893776664d3d545c127076c62561ff7ef01`: cumulative run `38132891941` SUCCESS (backend **731 passed / 1 warning / 85.85% coverage**, four raw ACK cases individually PASS; frontend **751 passed / 28 TODO**). H1d `38132891912` SUCCESS (**5 passed**). This resolves the earlier Python collection SyntaxError at `b82f883`.
- Plus technical test SHA `1ded7c7b2cf775d3df1352b6d21117b99a92d5f0`: adds two permanently retained regression cases for absent newline and oversized TCP coordinator ACK. No product/production route changed.
- Cumulative `38133090382` and H1d `38133090408` started for that SHA; **CI PENDING**, no additional PASS inferred.
- SG28/H2 distributed acceptance DIST-01..08 remains OPEN/BLOCKED: transport is unauthenticated experimental loopback and is not connected to public /evaluate.
- Next action: obtain completion and per-case evidence for the current SHA, repair any red, continue with bounded shared-coordinator design and independent-host topology only when authorized.


## 2026-10-11 — SG28 contradictory TCP ACK regression (pending CI)
- Verified Plus SHA `1ded7c7b2cf775d3df1352b6d21117b99a92d5f0`: cumulative `38133090382` SUCCESS (**733 backend PASS / 1 warning / 85.92% coverage**, frontend **751 PASS / 28 TODO**); H1d `38133090408` SUCCESS (**5 PASS**). Two bounded-framing tests passed individually.
- Plus implementation SHA `d1ccda8b4c80e67b341234ad5d58d60249efd13f` rejects contradictory TCP coordinator responses containing both successful grant and an `error` key. New test SHA `7927ac62467b0153a29fa0290484b8a75ab23f5f` adds two fail-closed cases, including null error payload.
- Final-SHA cumulative `38133313328` and H1d `38133313384` queued initially; **NOT CERTIFIED until runs and logs finish**.
- Experimental transport remains disconnected from `/evaluate`; no production configuration changes. SG28/H2 and DIST-01..08 still OPEN/BLOCKED.
- Next: inspect final-SHA jobs and case results, repair any red, then prioritize real bounded coordinator semantics and independent-host disposable acceptance.


## 2026-10-11 — SG28 release ACK contradiction guard
- Plus SHA `7927ac62467b0153a29fa0290484b8a75ab23f5f`: cumulative `38133313328` SUCCESS (**735 backend passed / 1 warning / 85.88% coverage; frontend 751 passed / 28 TODO**), H1d `38133313384` SUCCESS (**5 passed**). Two TCP grant-error contradiction cases explicitly PASS.
- Plus code commit `5cdcc474b61b4dde936faacba372387c5b2714a6` adds release-side fail-closed validation for acknowledgements containing both boolean `released` and `error` key. Test commit `34b21372f897f765c8746b4d135d9959489d9250` adds two permanent regression cases.
- New final-SHA cumulative `38133623785` and H1d `38133623804` queued when observed. **CI PENDING; do not claim PASS**.
- Changes affect isolated TCP experiment only; no public /evaluate integration or production deployment. DIST-01..08 OPEN/BLOCKED. Next: verify both final-SHA runs, classify failures and continue independent-host coordinator work only with authorized disposable topology.


## 2026-10-11 — SG28 isolated lease coordinator prototype
- Verified Plus SHA `34b21372f897f765c8746b4d135d9959489d9250`: cumulative `38133623785` SUCCESS (**737 backend PASS / 1 warning / 85.91% coverage; frontend 751 PASS / 28 TODO**); H1d `38133623804` SUCCESS (**5 PASS**), two release ACK ambiguity regressions PASS.
- Plus commits `7e604c307fe745c55a48315e2e1a93974ebfe71d` and `4103d6b185236c9e9f044c97a5291b093a105f8d`: add `backend/app/services/sg28_experimental_lease_coordinator.py` and local concurrency, expiry, stale-generation fencing and invalid-clock tests. This in-memory single-process reference is **not** durable, networked, authenticated or integrated with public /evaluate and cannot certify global multi-host K=1.
- Final-SHA cumulative `38134065358` and H1d `38134065318` began on push; **PENDING** until result and logs confirmed.
- SG28/H2 and DIST-01..08 remain OPEN/BLOCKED. Production remains unchanged. Next: verify final SHA, fix any red and develop a disposable authenticated shared durable coordinator design prior to independently hosted acceptance.


## 2026-10-11 — SG28 local coordinator fencing edge cases
- Plus SHA `4103d6b185236c9e9f044c97a5291b093a105f8d`: cumulative `38134065358` SUCCESS (backend **741 passed / 1 warning / 86.04% coverage**; frontend **751 passed / 28 TODO**); H1d `38134065318` SUCCESS (**5 passed**). Four single-process coordinator tests PASS.
- Plus technical SHA `9781ca2e25b8c68d3b5a9865f82679f956dee017` adds two local fencing edge regressions: generation must not be reused even for same owner after release, and an expired lease cannot release its successor exactly at expiry boundary. No production or public evaluate changes.
- Final SHA cumulative `38134409132` and H1d `38134409066` started and **CI PENDING**. Do not declare two new cases PASS yet.
- DIST-01..08 remain OPEN/BLOCKED. Prototype holds only process-local state and cannot certify global multi-host K=1. Next: verify final-SHA jobs, repair any red, then progress to disposable persistent network-coordinator proof with authorization.


## 2026-10-11 — SG28 local lease deadline representability
- Plus SHA `9781ca2e25b8c68d3b5a9865f82679f956dee017`: cumulative `38134409132` SUCCESS (backend **743 PASS / 1 warning / 86.04% coverage**, frontend **751 PASS / 28 TODO**) and H1d `38134409066` SUCCESS (**5 PASS**). Both fencing edge-case regressions individually passed.
- Plus experimental single-process coordinator now rejects finite but **unrepresentable** lease deadlines when `now + ttl <= now` because of floating point precision loss; this prevents granting leases with zero effective lifetime. Technical final SHA `792604eacf4557c64e47ffb70522014915d3c320`; new permanent regression `test_unrepresentable_deadline_fails_closed_without_consuming_generation` checks fail-closed and unchanged fencing generation. Intermediate commits `839194f`, `a7759c8`, `19773e1` superseded by final SHA.
- Plus final-SHA cumulative `38134627726` and H1d `38134627722` were **IN PROGRESS** when checked; new test NOT counted as PASS yet.
- No release, production, public endpoint or shared infra modifications. DIST-01..08 remain BLOCKED/NOT CERTIFIED, SG28/H2 OPEN. Next: verify both runs, diagnose regressions, proceed with independent shared coordinator only within authorized disposable infrastructure.


## 2026-10-11 — SG28 local repeated fencing and release integrity
- Plus technical SHA `792604eacf4557c64e47ffb70522014915d3c320`: cumulative `38134627726` SUCCESS (backend **744 passed / 1 warning / 85.92% coverage**, frontend **751 passed / 28 TODO**); H1d `38134627722` SUCCESS (**5 passed**). Deadline precision regression explicitly PASS.
- Plus test commit `4dd626229515af70749b4d37eea14f7ae1a0cf4a` adds two local single-process cases for repeated expiry generations (stale release cannot revoke each successor) and wrong owner/generation release (must not mutate active lease). No production or endpoint changes.
- New cumulative `38134902415` and H1d `38134902440` queued at observation; **PENDING CI** for final SHA, not PASS yet.
- SG28/H2 and DIST-01..08 remain OPEN/BLOCKED pending authorized independent-host coordinator acceptance.
- Next: verify final SHA jobs/logs, diagnose failures, and prioritize durable shared-coordinator design and authorized staging over further microtests.


## 2026-10-11 — SG28 disposable SQLite persistence reference
- Plus SHA `4dd626229515af70749b4d37eea14f7ae1a0cf4a`: cumulative `38134902415` SUCCESS (**746 backend PASS / 1 warning / 86.02% coverage, frontend 751 PASS / 28 TODO**), H1d `38134902440` SUCCESS (**5 PASS**). Both local fencing integrity regressions PASS.
- Plus commits `3e4dd90bf9196530aabc869d07c9e98ec53fe685` and `59b02c258d888ed96c080675dfb55461fd6fab43`: isolated SQLite persistent lease reference with transactional BEGIN IMMEDIATE, generation fencing, expiry/restart behavior; three tests cover restart persistence, concurrent separate local connections and clock exception rollback. Only single-host disposable reference; not a networked/HA coordinator; time origin, durability and multiple-host acceptance not proven.
- Latest final-SHA cumulative `38135167901` and H1d `38135168069` were **IN PROGRESS** when observed; no new PASS inferred.
- Production isolated mode remains OFF; no public evaluate route or deployment modified. DIST-01..08 and SG28/H2 are OPEN/BLOCKED pending authorized independent-host staging.
- Next: check final-SHA CI/logs, fix any failure and proceed to bounded network coordinator only within authorized disposable environment.


## 2026-10-11 — SG28 persistent SQLite generation recovery
- Verified Plus SHA `59b02c258d888ed96c080675dfb55461fd6fab43`: cumulative `38135167901` SUCCESS (**749 backend PASS / 1 warning / 86.01% coverage**, frontend **751 PASS / 28 TODO**); H1d `38135168069` SUCCESS (**5 PASS**); all three SQLite local reference tests PASS.
- Plus SHA `509ef7fc4d0c5e4af5e8d83593c3d47a03ad53b3` adds two SQLite persistence fencing regression tests: stale release after expiry/reopen cannot revoke successor, and generation remains strictly increasing after early release plus reopen.
- Latest-SHA cumulative `38135620898`, H1d `38135620884` **IN PROGRESS** at observation. Do not infer any new PASS until logs checked.
- Single-host SQLite reference only: not shared network, not production, not public /evaluate. SG28/H2 + DIST-01..08 still OPEN/BLOCKED.
- Next: verify current runs, then prioritize explicitly authorized disposable network/staging infrastructure for independent-host acceptance; avoid treating process-local reference as distributed proof.


## 2026-10-11 — SG28 SQLite reference path-validation gate
- Verified Plus SHA `509ef7fc4d0c5e4af5e8d83593c3d47a03ad53b3`: cumulative `38135620898` SUCCESS (backend **751 PASS / 1 warning / 86.04% coverage**; frontend **751 PASS / 28 TODO**); H1d `38135620884` SUCCESS (**5 PASS**). SQLite restart/fencing cases each PASS.
- Plus implementation commit `1ad14172f1d37e0e3e2e9b1b582991802bb9e745` rejects null, empty, non-path or bool database paths in isolated SQLite lease reference. Plus test commit `388b483551ea44b04e7163b9418ee837891ac583` adds permanent parameterized invalid-path regression.
- Latest final-SHA cumulative `38136323933` and H1d `38136324050` queued at observation. Results **PENDING**, no additional passing test claimed.
- This local SQLite reference is not a networked or distributed coordinator, not wired into public evaluate, and not production. DIST-01..08 / SG28 H2 remain OPEN/BLOCKED. Next: validate these two runs and prioritize a formally bounded shared-coordinator implementation in an approved disposable environment.


## 2026-10-11 — SG28 SQLite connection lifecycle correction
- Plus SHA `388b483551ea44b04e7163b9418ee837891ac583`: cumulative `38136323933` SUCCESS (**752 backend PASS / 1 warning / 86.00% coverage**, frontend **751 PASS / 28 TODO**); H1d `38136324050` SUCCESS (**5 PASS**). Database path validation regression individually PASS.
- Plus technical SHA `b3f6c42cd09da6a9bcaf1c4b5cc5115fea550858` closes SQLite reference connections explicitly with contextlib.closing (sqlite3 connection context-manager commits/rolls back but does not close handles). Test SHA `59d60a2a1b2719de05c3e27de989685a53c68e48` verifies handles close on grant, rejection, release, stale release, and exception/rollback.
- Final-SHA cumulative `38136569169` and H1d `38136569172` queued at observation, **CI PENDING**. New test NOT certified yet.
- Scope is disposable single-host SQLite reference only; no API wiring or production deploy. SG28/H2 and DIST-01..08 remain OPEN/BLOCKED.
- Next: inspect two final-SHA jobs and logs, fix confirmed failures, prioritize authorized independent-host topology and coordinator architecture.


## 2026-10-11 — SG28 SQLite release field strictness
- Verified Plus SHA `59d60a2a1b2719de05c3e27de989685a53c68e48`: cumulative `38136569169` SUCCESS (**753 backend PASS / 1 warning / 86.05% coverage**, frontend **751 PASS / 28 TODO**); H1d `38136569172` SUCCESS (**5 PASS**); connection-close lifecycle regression individually PASS.
- Plus SHA `bfcb289029ee6b6fd73b4931295903d6bd446e5d` validates SQLite reference release lease owner, generation and deadline before SQL; prevents Python boolean/number equality aliasing for malicious or malformed releases. Test SHA `9125e67f0db8c8c52a12563cbe2dddc91984d8d1` adds a permanent reproduction using a deadline of exactly 1.0 and generation 1.
- Latest final-SHA cumulative `38136888265` and H1d `38136888290` queued at observation; **CI PENDING**, no additional PASS asserted.
- This is isolated single-host SQLite reference only, NOT shared network certification or production. SG28/H2, DIST-01..08 OPEN/BLOCKED pending authorized disposable independent-host test infrastructure. Next check final-SHA runs, logs, repair any red.


## 2026-10-11 — SG28 SQLite generation overflow fail-closed
- Plus SHA `9125e67f0db8c8c52a12563cbe2dddc91984d8d1`: cumulative `38136888265` SUCCESS (**754 backend PASS / 1 warning / 86.10% coverage**, frontend **751 PASS / 28 TODO**); H1d `38136888290` SUCCESS (**5 PASS**). Boolean/numeric alias release regression individually PASS.
- Plus implementation SHA `64f1f47ceb683f720508e2c6758ae65cb5108d03` guards lease-generation counter exhaustion at SQLite signed 64-bit maximum; test SHA `83fe1bcaef78f451a63ba25a68e2404d4744ea3e` verifies fail-closed rejection and unchanged state.
- Latest cumulative `38137245241` and H1d `38137245280` queued when checked; **CI PENDING** at this checkpoint.
- Single-host SQLite reference only, not globally shared across hosts and not linked to public /evaluate. SG28/H2, DIST-01..08 remain OPEN/BLOCKED. No production changes. Next: verify final-SHA CI and move toward authorized independent-host acceptance.


## 2026-10-11 — SG28 SQLite cross-process local characterization
- Plus SHA `83fe1bcaef78f451a63ba25a68e2404d4744ea3e`: cumulative `38137245241` SUCCESS (**755 backend PASS / 1 warning / 86.08% coverage**, frontend **751 PASS / 28 TODO**); H1d `38137245280` SUCCESS (**5 PASS**); SQLite generation exhaustion test individually passed.
- Plus commit `f532174b6790b712e181d4c384044dcc2d96a8f4` introduces subprocess-based characterization of persistent SQLite lease across **independent local Python processes**, checking single-slot rejection before expiration, generation increment at deadline and continued rejection while next lease is live.
- Latest-SHA cumulative `38137696801` and H1d `38137696802` were queued when checked; **CI PENDING**, no new PASS claimed.
- This is explicitly **same host and same SQLite file**, not independent hosts, not a network coordinator, not public /evaluate. DIST-01..08, SG28/H2 remain OPEN/BLOCKED. No production changes.
- Next: inspect final SHA CI outcomes, repair red, then build authorized disposable network topology for true independent-host acceptance.


## 2026-10-11 — SG28 disposable TCP plus SQLite local integration
- Verified Plus SHA `f532174b6790b712e181d4c384044dcc2d96a8f4`: cumulative `38137696801` SUCCESS (**756 backend PASS / 1 warning / 86.08% coverage**, frontend **751 PASS / 28 TODO**); H1d `38137696802` SUCCESS (**5 PASS**). Independent Python local subprocess SQLite persistence test individually PASS.
- Plus commits `5db3348a877ab889703c291fbf6b415c60904046`, `48144ea24ce15958e96ec02c50340eea894c7640`: add a disposable **loopback TCP** integration test joining `TcpSharedLeaseStore` clients and `SqliteLeaseReference` coordinator; covers K=1 rejection, simulated coordinator object restart, lease expiry/generation fencing, stale release, and connection cleanup. Test server exists only in tests and is not deployed.
- Final-SHA cumulative `38138252954` and H1d `38138252983` were queued at observation, **CI PENDING**.
- Still same-host local integration with no TLS/auth, independent-host topology or public /evaluate route. SG28/H2 and DIST-01..08 stay OPEN/BLOCKED; production unchanged.
- Next: check the final-SHA workflows and logs; diagnose any red and do not infer multi-host PASS from loopback.


## 2026-10-11 — SG28 loopback outage and persistent restart recovery
- Verified Plus SHA `48144ea24ce15958e96ec02c50340eea894c7640`: cumulative `38138252954` SUCCESS (**757 backend PASS / 1 warning / 86.06% coverage**, frontend **751 PASS / 28 TODO**); H1d `38138252983` SUCCESS (**5 PASS**). TCP + SQLite loopback integration regression individually passed.
- Plus test SHA `401ae7cc2e40370d6e452a3ea9843b0d258c1d88` adds local server outage/restart simulation: no coordinator connection -> SharedAdmissionUnavailable (fail-closed), durable active lease is retained on same-port restart, request rejected before expiry, next generation granted at expiry, stale release rejected. This is same-host loopback only.
- Cumulative `38138716340`, H1d `38138716335` queued at observation. **CI PENDING**, no new PASS credited.
- No public /evaluate wiring or production deploy. SG28/H2 and DIST-01..08 remain OPEN/BLOCKED because independent-host topology and secure authenticated coordinator remain unproven. Next: inspect final-SHA jobs and repair any red.


## 2026-10-11 — SG28 lost ACK after persisted grant (loopback)
- Verified Plus SHA `401ae7cc2e40370d6e452a3ea9843b0d258c1d88`: cumulative `38138716340` SUCCESS (**758 backend PASS / 1 warning / 86.03% coverage**, frontend **751 PASS / 28 TODO**), H1d `38138716335` SUCCESS (**5 PASS**). Loopback outage/restart integration regression individually PASS.
- Plus SHA `51021b55cb23839916d78317400faa9002adbc26` adds disposable loopback fault-injection test: a coordinator persists a lease but closes the TCP socket before ACK; uncertain client must fail closed and second client must be denied until expiry; next generation granted at expiry. **Same-host test only**, not DIST-02 certification.
- Final-SHA cumulative `38139175065` and H1d `38139175059` queued when checked; **CI PENDING**, no new PASS inferred.
- Public /evaluate and production unchanged. SG28/H2 and DIST-01..08 remain OPEN/BLOCKED; independent-host authorized staging and secure coordinator are outstanding. Next: verify final CI runs, repair any red, then progress toward independent-host topology.


## 2026-10-11 — SG28 concurrent TCP clients on disposable loopback
- Verified Plus SHA `51021b55cb23839916d78317400faa9002adbc26`: cumulative `38139175065` SUCCESS (**759 backend PASS / 1 warning / 86.06% coverage**, frontend **751 PASS / 28 TODO**); H1d `38139175059` SUCCESS (**5 PASS**). Lost grant ACK fail-closed test individually passed.
- Plus test SHA `4f467674e5ab3d686a6954303697ea2062d9e64b` adds a local TCP integration race of eight clients against a persisted SQLite coordinator to verify exactly one lease granted for global capacity K=1 within **one CI host**. Cumulative run `38139751806` and H1d `38139751787` queued; **CI PENDING**.
- No deployed coordinator, no TLS/auth, no public /evaluate opt-in, no production changes. DIST-01..08 and SG28/H2 remain OPEN/BLOCKED until an authorized disposable independent-host topology exists.
- Next: verify latest SHA runs, repair failure if any, and prioritize the missing independent-host security and staging architecture over repeated local microtests.


## 2026-10-11 — SG28 eight-client TCP backlog failure and repair
- Plus SHA `4f467674e5ab3d686a6954303697ea2062d9e64b`: cumulative `38139751806` **FAIL** (backend **1 failed / 759 passed**, frontend SUCCESS), while H1d `38139751787` SUCCESS. CI traceback confirms `TimeoutError` on `socket.connect` for one of eight simultaneous test TCP clients (default socket server accept backlog and client timeout 1s). This does **not** indicate a double grant.
- Plus test fixture fix SHA `18ff893399bb0192d994a6e1ff141615d483a832`: sets explicitly bounded `_Server.request_queue_size = 16` and raises only the concurrency-test TCP timeout to the client maximum 5s; no production code or API modifications. Cumulative `38140121960` and H1d `38140121981` queued when observed; **CI PENDING**, not a new PASS.
- Last fully certified Plus baseline remains SHA `51021b55cb23839916d78317400faa9002adbc26`: backend **759 PASS / 1 warning / 86.06% coverage**, frontend **751 PASS / 28 TODO**, H1d **5 PASS**.
- Loopback on a single runner is not independent-host DIST-01 evidence. SG28/H2 and DIST-01..08 OPEN/BLOCKED; production unchanged. Next: verify latest SHA and classify red.


## 2026-10-11 — Verificación CI de reparación TCP (sesión de continuidad)
- Plus SHA técnico `18ff893399bb0192d994a6e1ff141615d483a832`: gate acumulativo run `38140121960` finalizó con jobs backend y frontend SUCCESS. Logs backend: **760 passed, 1 warning, 86.06% coverage**; frontend **751 passed / 28 TODO**.
- Plus H1d run `38140121981`: job SUCCESS, **5 passed**.
- El timeout del fixture TCP de ocho clientes quedó resuelto en CI; evidencia acotada a loopback/runner único, sin acreditar servidores independientes, TLS/autenticación ni `/evaluate` público.
- SG28/H2 y DIST-01..08 continúan OPEN/BLOCKED. No se modificó producción ni se activó `SG28_EVALUATE_ISOLATION`.
- Siguiente acción: especificar y validar un entorno de aceptación autorizado, desechable, con coordinador autenticado y clientes en hosts aislados; preservar la comprobación fail-closed y el fencing generacional sin extrapolar las pruebas locales.


## 2026-10-11 — SG28 endurecimiento del cliente TCP de caracterización (CI pendiente)
- Plus test-only `backend/tests/test_sg28_tcp_admission_characterization.py`, SHA técnico final `67c2ba037b91d240b17055183acd82ed283271cc`, rechaza respuestas de concesión TCP incompletas, tipos falsos y generaciones no enteras positivas antes de admitir trabajo. Incluye un test de loopback con respuestas malformadas y una concesión bien formada como control.
- El cambio solo afecta fixture y cliente de tests; **NO** agrega autenticación/TLS al coordinador, no modifica `request_cancellation.py`, no conecta `/evaluate` ni acredita DIST-01..08. Sin despliegue.
- **CI PENDING/UNVERIFIED**: falta obtener los runs de `push` del SHA final y sus logs; la consulta GitHub por SHA del conector no abarca corridas push. No marcar PASS hasta la ejecución real.
- Siguiente paso exacto: inspeccionar gate acumulativo y H1d del SHA final, solucionar rojos y después abordar autenticación/transporte de un coordinador aislado de forma explícita.


## 2026-10-11 — SG28 schema-binding del grant TCP (CI pendiente)
- Plus commit técnico `93f344f9b6c858753eed7fe05ec227ce36329c4f`: reforzado cliente TCP exclusivamente de pruebas. Una respuesta `granted=true` solo es válida para operación `grant`, con claves exactas `granted`/`generation` y entero positivo; se rechaza una concesión asociada a `release` o con campos extraños. Nueva cobertura negativa y control positivo en `test_tcp_untrusted_grant_reply_requires_positive_integer_generation`.
- El cambio **NO** autentica servidor, no protege transporte, no conecta el coordinador a producto y no constituye certificación distribuida; fixture local únicamente. CI para este SHA **no verificado**. Consulta de `fetch_commit_workflow_runs` en el SHA anterior `67c2ba0` retornó cero porque solo muestra eventos pull_request, lo que no descarta ejecución push.
- Siguiente acción: obtener run/job/log real de gate acumulativo Plus para SHA `93f344f9` y H1d, clasificar cualquier fallo. Mantener DIST-01..08 SG28/H2 abiertos hasta prueba autorizada multinodo con TLS/autenticación.


## 2026-10-11 — SG28 TCP response operation binding
- Plus commit técnico `4f7b8c05bf99eb98040ff868d0a9ec56ddd8603d` mejora el **cliente de caracterización de pruebas**, validando que una respuesta `released` solo corresponda a `release`, y que `granted=false` no sea aceptada como respuesta normal a una liberación; una respuesta con mezcla de campos `released/granted` se rechaza. Incluye casos de regresión.
- **No** representa autenticación TLS, un servicio de coordinación desplegado, ni integración a `/evaluate`; SG28/H2 y DIST-01..08 siguen OPEN/BLOCKED. Las pruebas del SHA nuevo todavía no tienen CI verificado. La consulta de runs por SHA solo cubre PR, no push.
- Siguiente acción: localizar y verificar Actions acumulativo/H1d para `4f7b8c05` con logs y reparar rojos antes de continuar con el entorno distribuido autorizado.


## 2026-10-11 — SG28 denied-grant schema hardening
- Plus commit técnico `9d80909324ed3225dcd5a6520d25de05208cbf0b` refuerza el cliente TCP de **tests** para que una denegación de concesión requiera campos exactos `{granted:false,generation:null}`. Las respuestas denegadas con campos ausentes/extraños o generación positiva ya no se consideran estructura válida. Se añadieron variantes de regresión de loopback junto con el caso de control válido.
- SHA `4f7b8c05` consultado por `fetch_commit_workflow_runs`: lista vacía, **no acredita ausencia de push CI**, ya que ese conector solo enumera PR. La consulta web de Actions no fue accesible. Nuevos runs para `9d809093` siguen SIN VERIFICAR; no declarar PASS.
- Se mantiene SG28/H2 y DIST-01..08 OPEN/BLOCKED: fixture local sin TLS/autenticación ni integración `/evaluate`; producción intacta.
- Siguiente: verificar corrida acumulativa y H1d del último SHA, obtener logs y detener nuevas microcorrecciones hasta contar con evidencia CI; continuar después con integración aislada/autenticada o matrices independientes según contrato.


## 2026-10-11 — SG28 test-only clock and authenticated ownership characterization
- Plus test commit `0966187a0fac65cad0647fe327ccc120b1b6dff1` adds `test_server_clock_and_authenticated_owner_reject_client_time_spoofing` in `backend/tests/test_sg28_tcp_admission_characterization.py`. The isolated loopback handler uses server-managed clock/TTL and credential-to-owner mapping; regression asserts spoofed client `now`/`ttl`/`owner` cannot bypass K=1, invalid credentials cannot alter state, stale releases remain fenced, and expiry produces next generation.
- **Test-only prototype:** no TLS, no production auth, no public `/evaluate` wiring, no staging deployment. This is not DIST-01..08 or SG28/H2 PASS.
- CI for this technical SHA: PENDING/UNVERIFIED. Next exact step: check Plus cumulative and H1d `push` runs for SHA `0966187a`, review jobs/logs and correct failures; then continue security integration only after verified baseline.


## 2026-10-11 — SG28 malformed credential type rejection (CI not yet verified)
- Plus technical SHA `7607290131eeca27bc83a2637fce11fcd01eb9e9` modifies **test-only** `backend/tests/test_sg28_tcp_admission_characterization.py`: the experimental credential-to-identity mapping now accepts only string credentials, preventing an unhashable list/dict JSON credential from crashing the fixture handler. Regression covers null, numeric, boolean, array and object credentials and asserts unchanged persisted lease.
- Review of SHA `0966187a` via the available pull-request-only workflow-runs endpoint yielded no matching runs; it cannot exclude push-triggered CI. Latest technical SHA CI remains UNVERIFIED; no PASS recorded. Prior verified baseline: cumulative `38140121960` 760 backend PASS/751 frontend PASS and H1d `38140121981` 5 PASS (earlier SHA).
- This is not deployed authentication/TLS, nor public `/evaluate` wiring; DIST-01..08 and SG28/H2 remain OPEN/BLOCKED. Next: retrieve the actual push CI jobs/logs for technical SHA `76072901` before more security fixture changes.


## 2026-10-11 — Reproducción local independiente de SG28 credential/clock
- Se ejecutó localmente `python -m pytest -q /tmp/test_sg28_local.py` sobre una reproducción acotada del handler test-only del commit Plus `7607290131eeca27bc83a2637fce11fcd01eb9e9`, usando SQLite temporal y TCP loopback: **1 PASS, 0 FAIL, 0.56 s**.
- Alcance: credenciales inválidas, reloj/TTL administrados por servidor, identidad del lease, fencing de release y expiración. **No se ejecutó el archivo íntegro clonado desde GitHub**, ni gate acumulativo/H1d de GitHub Actions; CI para el SHA continúa UNVERIFIED y SG28/H2, DIST-01..08 OPEN/BLOCKED.
- Siguiente paso: obtener run/log real de `push` de `76072901` y ejecutar suite original de repo; no extrapolar esta reproducción a certificación multi-host o seguridad TLS.


## 2026-10-11 — SG28 local scoped verification of clock/identity
- Ran pytest locally against a scoped reconstruction of Plus `test_server_clock_and_authenticated_owner_reject_client_time_spoofing` from technical SHA `7607290131eeca27bc83a2637fce11fcd01eb9e9`: **1 PASS in 0.54s**, isolated temporary SQLite and TCP loopback.
- This is **not the entire original repository file**, does not certify GitHub Actions, TLS/multi-host DIST-01..08 or `/evaluate`; no product or production changes. Direct raw GitHub download unavailable in this environment.
- Next mandatory action: verify actual CI push run at latest technical SHA, then full source pytest and cumulative gates; SG28/H2 remains OPEN/BLOCKED.


## 2026-10-11 — Evidencia CI acumulativa reconciliada (Plus SHA 76072901)
- Workflow `IN625 Cumulative Certification Gate`: https://github.com/c2melendez/precision-lab-plus/actions/runs/38156404356 (push, rama `qa/syntax-audit-in625-a1`, head SHA `7607290131eeca27bc83a2637fce11fcd01eb9e9`), SUCCESS; jobs backend `114520184153` SUCCESS y frontend `114520184037` SUCCESS.
- Log backend: **762 passed, 1 warning, 85.99% coverage**. Incluye archivo `tests/test_sg28_tcp_admission_characterization.py`. Log frontend: **751 passed, 28 TODO, 69 test files passed**; typecheck y build SUCCESS.
- Workflow H1d paralelo: https://github.com/c2melendez/precision-lab-plus/actions/runs/38156404358, job `114520184264` SUCCESS, **5 E2E passed**.
- Se resuelve la ausencia de evidencia CI para esta corrección, anteriormente marcada UNVERIFIED; no confundir con certificación SG28/H2 distribuida: DIST-01..08 continúa BLOCKED/OPEN; autenticación y TLS de producción siguen pendientes.
- Las corridas automáticas de push pueden descubrirse por `GitHub.fetch` a `https://api.github.com/repos/c2melendez/precision-lab-plus/actions/runs?branch=qa%2Fsyntax-audit-in625-a1&per_page=100`, en lugar del método `fetch_commit_workflow_runs` que filtra pull_request.


## 2026-10-11 — SG28 mTLS characterization CI verified
- Plus SHA `c54f173363b1a4c59799a68d2238fbcb133b6a94`: cumulative run https://github.com/c2melendez/precision-lab-plus/actions/runs/38159711316, backend job `114529884663` **763 PASS / 1 warning / coverage 86.06%**, including `test_sg28_mtls_transport_characterization.py::test_mtls_requires_trusted_client_and_verified_server_identity PASSED`; frontend job `114529884839` **751 PASS / 28 TODO**; both SUCCESS.
- H1d run https://github.com/c2melendez/precision-lab-plus/actions/runs/38159711340, job `114529884869`, **5 PASS**, SUCCESS.
- The mTLS test uses ephemeral certificates and loopback only. It does NOT prove production credential lifecycle, real distributed authorization, real coordinator integration or DIST-01..08. SG28/H2 remains OPEN; no production changes or deployment.


## 2026-10-11 — Primer contrato de adaptación distribuida SG28
- Plus SHA `8ef7bb61d4c325f5f7316d4d4e00a1337889fb8d`: añadido `backend/app/services/distributed_admission.py`, opt-in `SG28_DISTRIBUTED_ADMISSION=1` desactivado por defecto, límite de integración fail-closed con validación estricta de `granted=true` y generation entera positiva. La función requiere inyección externa de transporte autenticado; **NO implementa red/mTLS, release lifecycle ni integración `/evaluate`**.
- Plus SHA `5b4c0ee7dd94f8c2ff9faa5d137328e1570fa4bf`: añadido `backend/tests/test_sg28_distributed_admission_contract.py` con casos negativos de ausencia de transporte, timeout y replies malformados, más caso de grant sintácticamente válido.
- GitHub push CI iniciado automáticamente para SHA `5b4c0ee7`: cumulative `38160778651` y H1d `38160778664`, pendientes de conclusión al registrar. No atribuir PASS prematuro.
- DIST-01..08 y SG28/H2 siguen OPEN/BLOCKED; cero cambios al router público, producción, Render o infraestructura.


## 2026-10-11 — SG28 disposable persistent lease store phase
- Verified Plus SHA `d1f24452fdd8f49e05c99f5e4a284bc0292d6d60`: cumulative `38161515679` SUCCESS backend **787 passed, 1 warning, 86.19% coverage**, frontend **751 passed, 28 TODO**; H1d `38161515623` SUCCESS **5 passed**.
- Plus SHA `9e35cc95e2c1f38ec54e67e3434dc2b47d912ff8` adds unwired disposable `backend/app/services/sg28_sqlite_lease_store.py`, fenced SQLite lease generations and K=1 transaction. Caller-provided trusted `now` is NOT itself a validated server clock; should never take it from remote input.
- Plus SHA `794cdbd2b045fac90d12fef65904d1fbc806c3f6` adds `backend/tests/test_sg28_sqlite_lease_store.py` concurrent contenders, restart persistence, and stale-release tests. Latest push CI cumulative `38162538161` / H1d `38162538173` were QUEUED when checked; do not claim PASS yet.
- Test-only shared-host SQLite, not distributed hosts, no `/evaluate` wiring, no external service and no production deploy. SG28/H2 and DIST-01..08 remain OPEN/BLOCKED.


## 2026-10-11 — SG28 disposable mTLS coordinator integration
- Verified Plus SHA `794cdbd2b045fac90d12fef65904d1fbc806c3f6`: cumulative `38162538161` SUCCESS **790 backend passed, 1 warning, 86.28% coverage**, **751 frontend PASS / 28 TODO**; H1d `38162538173` SUCCESS **5 PASS**.
- Plus SHA `20639665aef6f05e7d02fb89a512cc4371270689` adds disposable loopback-only mTLS coordinator `backend/app/services/sg28_disposable_mtls_coordinator.py`, with authenticated certificate CN allowlist and shared SQLite fenced leases. Test-only; **not production-ready**, not independent host.
- Plus SHA `8eb033febcbe7e1cd69d73a551b10c6ed76fb2e1` adds integration test `backend/tests/test_sg28_disposable_mtls_coordinator.py`: real TLS exchange, serial K=1 acquisition, owner fencing, lease release, and binding restriction. Auto CI cumulative run `38162834871` and H1d `38162834838` detected queued/in-progress when consulted; do not mark PASS until logs verified.
- No public `/evaluate` routing, no cross-host deployment. DIST-01..08 and SG28/H2 remain OPEN/BLOCKED; server certificate identity tied to CN only in disposable fixture.


## 2026-10-11 — SG28 mTLS restart, outage and fencing gate
- Verified Plus SHA `8eb033febcbe7e1cd69d73a551b10c6ed76fb2e1`: cumulative `38162834871` SUCCESS, backend **792 PASS / 1 warning / 86.22% coverage**, frontend **751 PASS / 28 TODO**; H1d `38162834838` SUCCESS **5 PASS**.
- Plus SHA `a81e54c9eac0bd5c82642c9e5d5f71f8164949e1` added `backend/tests/test_sg28_mtls_restart_recovery.py` for a disposable loopback TLS coordinator restart with persisted SQLite fencing, coordinator outage failure closed, expiry, stale release and recovery. GitHub cumulative `38163237650` / H1d `38163237612` queued when discovered, **not yet CI-verified**.
- Entire integration remains a **single-host test-only prototype**, no production `/evaluate` integration or authenticated multi-host shared DB. DIST-01..08 and SG28/H2 OPEN/BLOCKED.


## 2026-10-11 — SG28 dropped mTLS grant/release acknowledgements
- Verified Plus SHA `a81e54c9eac0bd5c82642c9e5d5f71f8164949e1`: cumulative `38163237650` SUCCESS backend **793 PASS / 1 warning / 86.22% coverage**, frontend **751 PASS / 28 TODO**; H1d `38163237612` **5 PASS**.
- Plus SHA `74e17396f6f51748dfcf49fd08851b9c5a70ef57` adds disposable loopback test `backend/tests/test_sg28_mtls_lost_ack.py` for persisted grant with dropped TLS ACK, lost release ACK, fencing and fail-closed client. This is fixture fault injection, not production-grade coordinator handling. Cumulative run `38163731581` and H1d `38163731611` IN_PROGRESS when observed; **CI NOT YET VERIFIED for newest SHA**.
- No `/evaluate` integration, no remote hosts, no deployment. DIST-01..08 and SG28/H2 remain OPEN/BLOCKED.


## 2026-10-11 — SG28 mTLS spawned process certification gate
- Verified Plus SHA `150fc0940cc23c0226668d6dc36aab1faa7b4b73`: cumulative `38164060470` SUCCESS **795 backend PASS / 1 warning / 86.15% coverage**, frontend **751 PASS / 28 TODO**; H1d `38164060549` SUCCESS **5 PASS**.
- Plus SHA `bec444781c91174fec67e2735cceaf14b31fd03e` introduces `backend/tests/test_sg28_mtls_spawned_processes.py`: independent spawned coordinator PID and two competing client PIDs with TLS client certs, K=1 over real loopback sockets and shared SQLite on **one CI host**. Not cross-host proof or DIST-01 PASS.
- Auto GitHub Actions cumulative `38164513251` / H1d `38164513248` detected in progress; **CI pending for newest test**. No public endpoint wiring, no production changes; SG28/H2 and DIST-01..08 remain OPEN/BLOCKED.


## 2026-10-11 — SG28 multiprocess PASS and TLS allowlist regression
- Plus SHA `bec444781c91174fec67e2735cceaf14b31fd03e`: cumulative GitHub Actions run `38164513251` SUCCESS backend **796 PASS / 1 warning / 86.26% coverage**, frontend **751 PASS / 28 TODO**. H1d run `38164513248` SUCCESS **5 PASS**. Separate processes on same CI host: NOT independent hosts or DIST PASS.
- Plus SHA `08243b349c52958a212122e8d44cb94dcc8a09f5`: added `backend/tests/test_sg28_mtls_authorization_boundary.py` testing client whose TLS certificate is trusted by server CA bundle but whose identity is NOT in coordinator allowlist; unauthorized grant/release cannot mutate held lease. Cumulative run `38165043777` and H1d `38165043768` queued when queried, not yet verified.
- Cross-host distributed acceptance requires explicitly authorized disposable infrastructure and independent host IDs per `SG28_DISTRIBUTED_ACCEPTANCE.md`. No external services, public `/evaluate` wiring or production modifications. SG28/H2 and DIST-01..08 remain OPEN/BLOCKED.


## 2026-10-11 — SG28 mTLS authorization boundary: CI verificado y siguiente gate
- Plus SHA técnico `08243b349c52958a212122e8d44cb94dcc8a09f5`: acumulativo https://github.com/c2melendez/precision-lab-plus/actions/runs/38165043777 SUCCESS; backend job `114545739949`, **797 PASS / 1 warning / 86.33% coverage**, incluyendo `test_sg28_mtls_authorization_boundary.py`; frontend job `114545740067` **751 PASS / 28 TODO**; typecheck/build SUCCESS. H1d https://github.com/c2melendez/precision-lab-plus/actions/runs/38165043768, job `114545740052`, **5 PASS**. Lite build diagnostic https://github.com/c2melendez/precision-lab-lite/actions/runs/38093982237 SUCCESS en SHA `22be3d5546dd8a645c586900bba21651cc223b8c`, evidencia antigua solo de build (no equivale al gate acumulativo Lite).
- La prueba demuestra que una identidad mTLS confiada por CA pero fuera de allowlist NO obtiene ni libera un lease dentro del fixture loopback. No certifica hosts separados, servicio desplegado ni ruta pública.
- **SG28/H2 OPEN y DIST-01..08 BLOCKED**. No habilitar producción ni declarar aceptación distribuida. Advertencias frontend no bloqueantes (React act, JSDOM navigation, Node 20 deprecation) merecen seguimiento independiente.
- **Siguiente fase exacta:** completar gate de aceptación DIST-01 con dos hosts realmente independientes y un coordinador autenticado compartido en entorno desechable autorizado; registrar host IDs, SHA, K=1, grants, rechazos, logs y run. Si la infraestructura no está disponible, mantener DIST-01..08 BLOCKED y continuar la matriz independiente siguiente según EXECUTION_PROTOCOL; no fabricar PASS con múltiples procesos en un único runner.


## 2026-10-11 — SG28 finite coordinator clock validation
- Plus SHA técnico `71d9039baa1ed51a622c9aa0e6d92600d39fb699` (preceded by `5625192`, `03ccebc`) hardens only the disposable `backend/app/services/sg28_sqlite_lease_store.py`: validates finite trusted `now` and `now + ttl` before touching the SQLite lease. Added regression in `backend/tests/test_sg28_sqlite_lease_store.py` for `NaN`, +/-infinity, bool: active lease persists, release then next generation works.
- On inspection, final-SHA Actions Plus cumulative `38165988599` QUEUED and H1d `38165988593` IN_PROGRESS. **CI NOT YET VERIFIED for this SHA**. Do not count new PASS; check jobs/logs and repair red before closing.
- Last independently verified previous SHA `08243b349c52958a212122e8d44cb94dcc8a09f5`: cumulative `38165043777` backend 797 PASS/86.33% coverage, frontend 751 PASS/28 TODO; H1d `38165043768` 5 PASS.
- Scope is disposable same-host test only, not public `/evaluate`, production network, DIST-01..08 or SG28/H2 closure; remain OPEN/BLOCKED pending authorized independent hosts and distributed acceptance.
- Next exact execution: inspect Plus `38165988599` + `38165988593` by SHA and logs; address failures; then pursue authorized multi-host DIST-01 evidence rather than claim it from one runner.


## 2026-10-11 — SG28 finite deadline precision guard, automatic CI pending
- Verified previous Plus technical SHA `71d9039baa1ed51a622c9aa0e6d92600d39fb699`: cumulative `38165988599` SUCCESS, backend 798 PASS / 1 warning / 86.31% coverage, frontend 751 PASS / 28 TODO; H1d `38165988593` SUCCESS, 5 PASS; invalid-clock test PASS.
- Follow-up Plus change `f5eab6b1280f2bbf27ba09a7dcd65318c39229db` rejects finite extreme trusted clocks when `now+ttl <= now` due to floating-point resolution; test commit `56271a925a4e9e131a5952ba9be2d8158aa0bb6b` extends SQLite lease regression with `1e308`. Technical change limited to disposable test-only lease store; no public endpoint, production change, or multihost deployment.
- Latest-SHA cumulative `38166265878` and H1d `38166265797` were QUEUED at observation, **CI PENDING**. Ignore intermediate-red SHA `03ccebc` as superseded by the later verified `71d9039`, but never infer latest SHA PASS until logs confirm.
- SG28/H2 OPEN, DIST-01..08 BLOCKED, pending authorized independent-host staging. Next exact step: fetch final-SHA `38166265878`/`38166265797`, review jobs/logs and correct red; then pursue authenticated cross-host acceptance without assuming a single CI runner is distributed proof.


## 2026-10-11 — SG28 disposable store TTL policy type validation
- Previous Plus technical SHA `56271a925a4e9e131a5952ba9be2d8158aa0bb6b` CERTIFIED in CI: cumulative `38166265878` SUCCESS with backend **798 PASS / 1 warning / 86.34% coverage** (finite-clock + deadline advancement regression PASS), frontend **751 PASS / 28 TODO**; H1d `38166265797` SUCCESS **5 PASS**.
- New Plus technical change `6781ecc2a2c77cd10e42a7047c864712bf34f1e9` rejects bool, None, nonnumeric, nonfinite, negative or out-of-policy TTLs before creating SQLite lease state; test commit `88c34d4e72820d231cf0e3d48feb7cf5003ee0c0` adds permanent invalid-config cases with valid TTL control. Files `backend/app/services/sg28_sqlite_lease_store.py`, `backend/tests/test_sg28_sqlite_lease_store.py` only; public `/evaluate` and production unchanged.
- Final-SHA automatic CI Plus cumulative `38166490487` and H1d `38166490504` **IN_PROGRESS** when queried: not PASS yet. Next exact step inspect final SHA job logs, repair failures if any; then advance toward authorized independent-host DIST-01 architecture. One CI host/loopback cannot certify DIST-01..08. SG28/H2 remains OPEN; DIST-01..08 BLOCKED.


## 2026-10-11 — SG28 TTL input-policy gate verified
- Plus technical SHA `88c34d4e72820d231cf0e3d48feb7cf5003ee0c0` cumulative workflow `38166490487` SUCCESS: backend job `114550015761` **799 passed / 1 warning / 86.34% coverage**, including `test_store_rejects_unsafe_ttl_configuration_before_creating_database PASSED`; frontend job `114550015510` **751 passed / 28 TODO**. H1d `38166490504`, job `114550015628` SUCCESS **5 passed**.
- The disposable single-host SQLite store now enforces valid numeric finite TTL policy before opening the database. This does not certify the distributed service or public `/evaluate` and did not change Render/production.
- SG28/H2 OPEN and DIST-01..08 BLOCKED pending independently provisioned and authorized separate hosts with authenticated shared coordinator. Next step: prioritize preparation of genuine DIST-01 multi-host acceptance and identification of the independent Syntax 309 suite per EXECUTION_PROTOCOL; do not mark skipped capability or fixture-only tests as PASS.


## 2026-10-11 — Inicio preparación independiente Syntax 309 (sin certificación de casos)
- Se localizó la fuente de la matriz `matriz_sintaxis_entrada.md` en la biblioteca del proyecto: **309 ejercicios** (N1=104, N2=183, N3=22); distribución en 12 secciones SY-P..SY-X. La presencia del JSONL mencionado por la fuente NO ha sido validada.
- Creado `qa/certification/SYNTAX309_EXECUTION_MATRIX.md` en Lite commit `368caa10dffee91d97fd7ed4f51f6e48f9e8d637` y Plus commit `a6a359b6308597d935d746062090891a79333154`. Contiene inventario, tipos de oráculo oficiales, gates de integridad y siguiente lote SY-P de 33 casos. Estado: **PREPARACIÓN; 0/309 casos ejecutados por esta fase**, no certificación.
- SG28 Plus baseline confirmado: SHA `88c34d4e72820d231cf0e3d48feb7cf5003ee0c0`, acumulativo `38166490487` SUCCESS backend 799 PASS / frontend 751 PASS/28 TODO, H1d `38166490504` 5 PASS. DIST-01..08 siguen BLOCKED; ninguna simulación local valida dos hosts independientes.
- Siguiente paso exacto: recuperar datos completos de 309 filas originales, versionar fixture preservando IDs y oráculos, validar 309 IDs únicos y niveles 104/183/22; implementar y correr lote SY-P en CI de Lite/Plus. No declarar IN625 cerrado por esta preparación.


## 2026-10-11 — Syntax309 bilateral dataset + integrity CI PASS
- Official `matriz_sintaxis_entrada.md` source materialized and parsed without fabricated expectations: 309 IDs unique, distribution N1=104/N2=183/N3=22. Published exact `qa/certification/syntax309_cases.jsonl` and independent 33-case `syntax309_sy_p_cases.jsonl` on both Lite and Plus. Published `check_syntax309_fixture.py` and `.github/workflows/syntax309-integrity.yml` on both canonical branches.
- Lite technical HEAD for fixture/workflow `36b5312682897361d2865ab06d1187723eb2bd91`: data integrity workflow `38168081306` job `114554723811` SUCCESS, log `Syntax309 FULL integrity PASS: 309 IDs; SY-P 33`.
- Plus technical HEAD for fixture/workflow `bdbe59378936f188c3ae787588a032fb44609afe`: data integrity workflow `38168084690` job `114554733423` SUCCESS, same assertion.
- **Only source/schema/data integrity is certified; 0/33 SY-P mathematical execution cases certified in this phase**. Cumulative/H1d gates also started by workflow commits but their latest outcomes must be verified separately. No production changes.
- Exact next step: implement data-driven, per-ID SY-P mathematical evaluator and oracle (preserve original comparison types and structural interpretation), execute Lite and Plus gates and classify PASS/FAIL/BLOCKED by case; do not conflate data integrity PASS with 309 math PASS. SG28/H2 DIST-01..08 remain blocked on authorized multihost acceptance.


## 2026-10-11 — Syntax309 SY-P primera suite matemática real (Lite CI pendiente)
- Ambas corridas de integridad siguen verificadas: Lite `38168081306`, Plus `38168084690`, 309 IDs únicos y 33 SY-P exactos. Cumulative/H1d previos también se activaron con fixtures.
- Nuevo test técnico Lite `tests/syntax309SyPNumeric.audit.test.ts` commit `362820efa81d29af227a04e56018701a6a70e205`: carga 33 filas oficiales de `syntax309_sy_p_cases.jsonl`, prueba 15 IDs de **valor** contra el parser/motor con oráculo numérico, incluyendo precedencia y potencias; separa 18 filas de interpretación/convención/equivalencia (NO se cuentan como PASS matemático). No modifica código de producto.
- Gate acumulativo Lite `38168514700`, H1d `38168514778`, build `38168514707` creados para ese SHA, **CI PENDING** al registrar. Los logs solo se evaluarán cuando terminen; un gate rojo se clasifica y se corrige, no se suaviza el esperado.
- Próximo paso exacto: verificar job/log del acumulativo Lite para `362820ef`, reparar cualquier fallo demostrado, instrumentar comparador de estructura/convención y suite matemática equivalente en Plus; registrar cada SY-P ID antes de cerrar 33/33. IN625 SG28/H2 y DIST-01..08 siguen OPEN/BLOCKED por certificación independiente-host.


## 2026-10-11 — Syntax309 SY-P numeric first CI and targeted comparator repair
- Lite commit `362820efa81d29af227a04e56018701a6a70e205` added `tests/syntax309SyPNumeric.audit.test.ts`, data-driven official 15 numeric IDs out of 33 SY-P cases (other 18 require structure/convention/equivalence). Lite cumulative run `38168514700` FAILED: 1051 passed, 2 failed, 30 TODO. Fail IDs `SY-P-02` (`2\\pi`) and `SY-P-10` (`2^{-1}`): harness used `Number(evaluate(...))` on symbolic Algebrite results (nonfinite) rather than a numeric approximation; build `38168514707` SUCCESS; H1d `38168514778` still in progress at inspection. **These 2 are harness conversion failures, not confirmed product defects.**
- Lite test-only repair commit `cacbe34759c4bb8fdbf16ba689c746edeea211f3`: retains original numeric oracles, tries numeric form `float(parsed)` only when symbolic evaluate result cannot be parsed as Number. No product/engine edit. **CI for repaired SHA not verified; do not mark repaired tests PASS yet.**
- Exact next step: locate final-SHA Lite cumulative run for `cacbe347`, review job logs and fix any red; add Plus real mathematical SY-P tests and then 18 structural/convention/equivalence cases, preserving comparison categories and case-ID status. SG28/H2 remains OPEN/BLOCKED pending independent host DIST evidence.


## 2026-10-11 — Syntax309 SY-P diagnostic: 14 numeric PASS, 1 unresolved pi
- Lite cumulative `38168514700` for commit `362820efa81d29af227a04e56018701a6a70e205` FAILED 2 official numeric IDs, SY-P-02 (2\\pi), SY-P-10 (2^-1), because first harness used `Number` on symbolic responses. Total gate 1051 PASS/2 FAIL/30 TODO; other tests unaffected.
- Lite harness adjustment commit `cacbe34759c4bb8fdbf16ba689c746edeea211f3` (numeric `float` fallback) yielded cumulative `38168605642` FAILED **one case SY-P-02 only**, 1052 PASS/1 FAIL/30 TODO, with SY-P-10 now PASS. No math engine code modified.
- Diagnostic-only commit `5ccf74c0cd11fa0a2530bb67e4ce68bb309d23a1` enriches SY-P-02 failure with original parser syntax, symbolic result and float result to classify parser/engine versus harness. Latest cumulative run `38168669605`, build `38168669663`, H1d `38168669641` QUEUED at observation. **14/15 targeted numeric cases PASS in previous SHA, one OPEN; SY-P 33/33 NOT certified**, remaining 18 structural/convention/equivalence cases not yet run mathematically.
- Next exact: inspect diagnostic run's SY-P-02 error intermediates, fix the correct layer, rerun final SHA and expand Plus/structural per-ID gates. SG28/H2 DIST remains BLOCKED pending authorized distinct hosts.


## 2026-10-11 — SY-P-02 exact symbolic pi comparator correction
- Diagnostic Lite run `38168669605` for SHA `5ccf74c0cd11fa0a2530bb67e4ce68bb309d23a1` FAIL exactly `SY-P-02`, with logged pipeline `parser=2*pi; symbolic=2*pi; float=6.283185...`; this identifies an **abbreviated decimal display/harness conversion**, not an incorrect interpretation of π.
- Test-only follow-up commit `5999bdd6afbccf48fe84f0f675fe12750258b8be` in Lite asserts exact symbolic form `2*pi` for SY-P-02, and retains original strict numeric expectations for the other 14 cases. No product/engine changes, no fabricated PASS. Final-SHA CI **pending verification**.
- Next exact: retrieve cumulative/H1d/build runs for `5999bdd6`, inspect job logs, repair if red; then implement math/structure and convention oracles for SY-P's 18 remaining official cases and comparable Plus gate. No SY-P closure before every case is evidenced.


## 2026-10-11 — Syntax309 SY-P 15 numeric cases PASS Lite
- Lite commit `5999bdd6afbccf48fe84f0f675fe12750258b8be` cumulative `38168745939` SUCCESS, job `114556679622`: **1053 PASS / 30 TODO; 86 test files PASS**, including `tests/syntax309SyPNumeric.audit.test.ts` **17/17 PASS** (15 official numeric case IDs and 2 integrity/classification controls). Lite build `38168745947` SUCCESS on same SHA. H1d `38168745921` was IN_PROGRESS at observation; not yet counted.
- Regression note: SY-P-02 exact `2*pi` is correctly preserved by parser and symbolic evaluator; abbreviated `float(2*pi)` display `6.283185...` is not parseable with `Number()`. Strict symbolic assertion fixes harness without weakening source expectation or changing product. SY-P-10 (`2^-1`) handled by numerical fallback. Prior failed runs remain correctly recorded, superseded by this final SUCCESS.
- **Scope: 15/33 SY-P math case IDs PASS on Lite; 18/33 structural/convention/equivalence IDs still unevaluated; Plus math suite not yet implemented. No bilateral SY-P closure.** SG28/H2 DIST still blocked on authorized independent-host environment.
- Next exact: implement Plus mathematical SY-P per-ID gate preserving its parser/HTTP semantics, then Lite/Plus structural and convention gates for remaining 18, and confirm full same-SHA regression workflows.


## 2026-10-11 — Syntax309 SY-P Plus backend HTTP numeric gate
- Plus commit `d9248d00c0e16a856de5bbf5e94723f7dbd50c18` adds `backend/tests/test_syntax309_syp_numeric.py`: 15 official `SY-P-*` numeric IDs read from `qa/certification/syntax309_sy_p_cases.jsonl`, verified via real FastAPI `POST /api/v1/evaluate` TestClient, with explicitly reviewed backend-syntax adapter per ID; the 18 structure/convention/equivalence cases remain outside numeric gate. This tests Plus backend HTTP only, not MathLive/LaTeX frontend channel. No product code changed.
- Plus final-SHA cumulative run `38169312106` and H1d `38169312242` IN_PROGRESS at observation; **NO PASS yet for new suite**. Baseline Lite SHA `5999bdd6afbccf48fe84f0f675fe12750258b8be`: cumulative run `38168745939` SUCCESS, 1053 PASS/30 TODO, with 15/15 numeric SY-P IDs and 2 controls passing.
- Next exact step: verify Plus cumulative job/log for SHA `d9248d00`, diagnose each red using ID, correct appropriate adapter/harness versus product and rerun; after bilateral 15-case PASS begin structural, equivalent and declared-convention gates for remaining 18 official cases, preserving source semantics. IN625 H2/DIST remains BLOCKED.


## 2026-10-11 — Syntax309 SY-P numeric bilateral PASS and Plus algebraic equivalence gate
- Plus commit `d9248d00c0e16a856de5bbf5e94723f7dbd50c18` cumulative `38169312106` SUCCESS: backend 815 PASS/1 warning/86.31% coverage; all 15 official SY-P numeric IDs `SY-P-01,02,06..17,33` PASS through `/api/v1/evaluate` HTTP (backend syntax adapter), frontend 751 PASS/28 TODO. H1d `38169312242` SUCCESS. Lite previously certified same 15 numeric IDs on SHA `5999bdd6afbccf48fe84f0f675fe12750258b8be` cumulative `38168745939`, 1053 PASS/30 TODO. Note Lite validates its local parser/motor; Plus validates backend HTTP, not full MathLive frontend chain.
- Plus new test-only commit `97084bad53dac19eafd188704302fd25c926c282`: added `backend/tests/test_syntax309_syp_equivalence.py` covering original SY-P-29,30,31 sampled equivalence with substitutions x=-3,-1,0,2,5 through HTTP. Inputs/oracles mapped explicitly from source syntax. This is *sampled equivalence*, not structural echo or full symbolic proof. New cumulative `38170145877` QUEUED, H1d `38170145881` IN_PROGRESS at observation; **new gates not yet PASS**.
- 15/33 SY-P numeric cases bilaterally PASS; 18/33 remain for further evaluation, three under active test in Plus only. Next exact step: inspect final-SHA Plus CI logs, diagnose/fix failures; add Lite equivalence and then structural/convention gates in BOTH engines. SG28/H2 DIST-01..08 remain BLOCKED pending authorized separate hosts.


## 2026-10-11 — SY-P equivalence Plus PASS, Lite gate en curso
- Plus SHA `97084bad53dac19eafd188704302fd25c926c282` cumulative run `38170145877` SUCCESS: backend **831 PASS / 1 warning / 86.41% coverage**, frontend **751 PASS/28 TODO**; `test_syntax309_syp_equivalence.py` verified **15/15 sampled substitutions** for official SY-P-29/30/31 plus one provenance check. Equivalence is tested at five x values, not a full symbolic/structural proof.
- Lite new test-only commit `3efbed840a6aa888831a7e94b121ea4ceb9e38d3`: `tests/syntax309SyPEquivalence.audit.test.ts` maps official same three IDs, evaluates source and expected mathematical expressions across x=-3,-1,0,2,5 with existing Lite parser+Algebrite motor, plus one fixture provenance assertion. Lite cumulative `38171068701`, H1d `38171068659`, build `38171068672` **IN_PROGRESS/QUEUED at review; NOT CERTIFIED yet**.
- Bilateral SY-P numeric subset remains 15/15 PASS; symbolic equivalence three IDs Plus PASS/Lite pending. Remaining structural and declared convention rows not certified; no code of product modified. Next exact action: inspect Lite final-SHA CI and fix any failed IDs, then introduce structural/declared-convention gates preserving official oracle and visibility requirements. SG28/H2 DIST-01..08 remains BLOCKED on authorized independent hosts.


## 2026-10-11 — Syntax309 SY-P equivalence bilateral PASS; structural probes started
- Lite SHA `3efbed840a6aa888831a7e94b121ea4ceb9e38d3`, cumulative `38171068701` SUCCESS: `tests/syntax309SyPEquivalence.audit.test.ts` 16/16 PASS (3 SY-P case IDs 29/30/31 each tested at five x values + provenance assertion); cumulative **1069 PASS, 30 TODO**. Plus same official three cases PASS at SHA `97084bad53dac19eafd188704302fd25c926c282`, cumulative `38170145877`: backend 831 PASS, frontend 751 PASS, 86.41% backend coverage. These certify *sampled equivalence* only, not symbolic proof or UI echo.
- New Lite test-only commit `064644bf3df958996a3038309d0df397d1e9b573`: `tests/syntax309SyPInterpretation.audit.test.ts` adds five numeric interpretation witnesses by official ID SY-P-04 (x=3 =>18), 05 (x=3 =>-9), 20 (x=6 =>3), 22 (x=2=>1/4), 26 (x=3=>9); runtime uses real Lite parser/Algebrite. New Lite cumulative `38171817076`, H1d `38171817034`, build `38171817061` IN_PROGRESS at observation, **not yet certified**. These probes do NOT replace echo/structure or declaration of ambiguous conventions.
- Current bilateral official SY-P completed coverage: 15 numeric + 3 sampled-equivalence IDs; five additional interpretation witnesses Lite awaiting CI, Plus not yet created. Remaining structural/declared-convention cases remain pending. No product changes, production unchanged, SG28/DIST blocked pending authorized multi-host infrastructure.
- Next exact action: review `38171817076` results and diagnose any failing ID; implement Plus five probes and remaining structural/echo/explicit-convention cases in both, then certify by ID (not merely test count).


## 2026-10-11 — Syntax309 SY-P structural witness: fixture/harness bug corrected
- Lite equivalence SHA `3efbed840a6aa888831a7e94b121ea4ceb9e38d3`, cumulative `38171068701` SUCCESS: 1069 PASS / 30 TODO including 16/16 sampled-equivalence checks for official SY-P-29,30,31. Plus equivalence baseline also SUCCESS run `38170145877` (831 backend PASS, 751 frontend PASS, 86.41% coverage).
- Lite first five interpretation probes commit `064644bf3df958996a3038309d0df397d1e9b573`, cumulative `38171817076` FAILED: 1074 PASS, 1 FAIL, 30 TODO. SY-P-04/05/20/22 PASS, SY-P-26 failed to become numeric because x was substituted but original `x^2 y` still had free y. **Test fixture error, not confirmed motor defect.**
- Lite test-only correction commit `6895054fc766489e2fe7a2088d7b115d6bcffca2` explicitly substitutes y=2 and x=3 on SY-P-26, expected 18. Final-SHA cumulative `38171901128`, H1d `38171901170`, build `38171901184` QUEUED at observation. Do not mark correction PASS until real CI logs. These are numeric interpretation witnesses only, NOT conclusive structural/echo validation.
- Next exact step inspect final-SHA Lite CI; if green, implement equivalent plus backend interpretation probes and remaining SY-P convention/structure oracle with actual UI feedback; preserve SG28/H2 DIST blocked pending authorized multi-host environment.


## 2026-10-11 — SY-P cinco testigos de interpretación Lite PASS, Plus CI pendiente
- Lite commit `6895054fc766489e2fe7a2088d7b115d6bcffca2`: cumulative `38171901128` SUCCESS **1075 PASS / 30 TODO**, including `tests/syntax309SyPInterpretation.audit.test.ts` **6/6 PASS** (IDs SY-P-04/05/20/22/26 and one source check). H1d `38171901170` SUCCESS, Lite build `38171901184` SUCCESS. SY-P-26 checks x=3 and y=2 yielding 18; earlier failure was incomplete test substitution, not product bug.
- Plus new test-only SHA `caa3d577f5b7ee81cdb21a18916cffd58e3be026` adds `backend/tests/test_syntax309_syp_interpretation.py`: five matched official-ID numerical interpretation witnesses via real `/api/v1/evaluate` TestClient; includes explicit backend adapter and two-variable substitution for SY-P-26. Plus cumulative `38173788391` queued and H1d `38173788331` in progress at observation. **No Plus PASS claimed pending job logs.**
- SY-P bilateral certified numeric=15 IDs and sampled equivalence=3 IDs; five extra structural interpretation *numeric witnesses* PASS on Lite/Plus pending. Echo/structural fidelity, channels and publicly declared ambiguity convention still unverified. SG28/H2 DIST-01..08 remain BLOCKED pending authorized independent hosts.
- Next exact: verify Plus SHA `caa3d57` cumulative job logs, repair red if necessary, and implement authoritative structural/echo and declared-convention assertions for the remaining SY-P IDs without treating mere approximate values as semantic proof.


## 2026-10-11 — SY-P interpretation witnesses bilateral PASS; parser structural tests begin
- Plus technical SHA `caa3d577f5b7ee81cdb21a18916cffd58e3be026`, cumulative `38173788391` SUCCESS: 837 backend PASS / 1 warning / 86.34% coverage; original ID SY-P-04/05/20/22/26 five numeric interpretation witnesses all PASS (plus fixture integrity control). H1d `38173788331` SUCCESS. Lite baseline commit `6895054fc766489e2fe7a2088d7b115d6bcffca2`, cumulative `38171901128` SUCCESS 1075 PASS / 30 TODO, same five probes PASS.
- Bilateral partial mathematical evidence exists for 15 numeric + 3 sampled-equivalence + 5 interpretation numerical witness IDs = 23/33 official SY-P IDs. Echo and conventions not certified by these numerical tests.
- Lite test-only commit `5365bb51abb913c81c4e353ecf5a4cc0ee9b6e26` adds `tests/syntax309SyPStructuralEcho.audit.test.ts` for exact parser structure on official SY-P-03/27/28 (sin call and exp multiplication) and source metadata. Does NOT cover rendered UI echo, ambiguous conventions, or concatenated xy/xyz; source IDs 24/25 are metadata checked only. Lite cumulative `38176349064`, build `38176349078`, H1d `38176349080` IN_PROGRESS at observation; **do not mark parser structural tests PASS before CI**.
- Next exact step inspect Lite CI for SHA `5365bb5`, classify fixes, then add robust per-ID structural/echo tests in Plus frontend and Lite and convention declaration for SY-P-18/19/21/23/32 without silently accepting any numeric result. DIST-01..08 remains BLOCKED on authorized external multi-host evidence.


## 2026-10-11 — Lite SY-P structural parser assertions PASS
- Lite SHA `5365bb51abb913c81c4e353ecf5a4cc0ee9b6e26` cumulative `38176349064` SUCCESS: **1079 PASS / 30 TODO**, new `tests/syntax309SyPStructuralEcho.audit.test.ts` **4/4 PASS**, including source membership control and parser-shape checks on SY-P-03, 27, 28. These are **parser-structure** assertions, not proof of rendered UI echo; SY-P-24 and 25 are only included in a metadata control, not their own semantic tests.
- Next: add Plus equivalent frontend structure checks, account per-ID coverage without double-counting, and verify declared ambiguous conventions. Bilateral math witness scope stays 23/33; don't certify overall SY-P yet.


## 2026-10-11 — siguiente fase Syntax309 SY-P: evidencia reconciliada
- Plus cumulative run https://github.com/c2melendez/precision-lab-plus/actions/runs/38173788391 SUCCESS en SHA caa3d577f5b7ee81cdb21a18916cffd58e3be026 (jobs backend/frontend SUCCESS); H1d run 38173788331 SUCCESS.
- Lite H1d run https://github.com/c2melendez/precision-lab-lite/actions/runs/38176349080 SUCCESS en SHA 5365bb51abb913c81c4e353ecf5a4cc0ee9b6e26. Su cumulative run 38176349064, documentado previamente como SUCCESS, es la evidencia del gate de ese SHA; no confundir H1d con cumulative.
- Se añadió test de frontend Plus `frontend/src/__tests__/syntax309SyPStructuralEcho.audit.test.ts` mediante commit 6b7bd05e693a97bb79187a6cb96903215a2095c0 en rama canónica. Cubre metadatos oficiales SY-P-03/24/25/27/28 y comprobaciones de presencia estructural de los operandos, función trigonométrica y exponente de SY-P-03/27/28. Es una verificación parcial de conversión, NO AST completo ni echo UI. 24/25 continúan metadata-only.
- CI del nuevo SHA Plus pendiente de evidencia al momento de este registro. NO certificar el nuevo test como PASS sin run/log propio.
- SIGUIENTE PASO EXACTO: localizar en Actions los nuevos runs del SHA 6b7bd05e; revisar logs de frontend y gate acumulativo, corregir fallos de harness/producto según evidencia. Después ampliar oráculos de AST y representación UI por ID, empezando SY-P-24/25 y convenciones SY-P-18/19/21/23/32. Mantener SG28 DIST bloqueado sin entornos multi-host independientes autorizados.

- CI recién detectado para commit técnico Plus 6b7bd05e: cumulative https://github.com/c2melendez/precision-lab-plus/actions/runs/38177936712 (backend/frontend in_progress al consultar), H1d https://github.com/c2melendez/precision-lab-plus/actions/runs/38177936704 (in_progress). Estos IDs verifican disparo automático push pero NO PASS. Evaluar conclusiones y logs al terminar.


## 2026-10-11 — Syntax309 SY-P Plus CI regression classified and corrected
- Plus SHA 6b7bd05e: cumulative run 38177936712 FAILED in frontend unit/parity suite; backend SUCCESS. H1d 38177936704 SUCCESS. Exact failing suite `frontend/src/__tests__/syntax309SyPStructuralEcho.audit.test.ts`: Vite denied loading `qa/certification/syntax309_sy_p_cases.jsonl?raw` outside frontend root. Classification HARNESS/fixture loading, not a demonstrated product mathematical failure.
- Plus correction SHA `4d6218271e96110cd443dd8750e856c54d48fa6b` changes only fixture loading to Node `readFileSync(new URL(..., import.meta.url), 'utf8')` in same test. It does NOT relax mathematical assertions. CI evidence for corrected SHA PENDING. Next: obtain H1d and cumulative runs matching 4d621827, inspect unit test results, and only then advance further SY-P ID-specific AST/echo assertions.


## 2026-10-11 — SY-P harness follow-up TypeScript correction
- Plus commit 4d621827: cumulative 38181398861 frontend Typecheck FAILED, TS2345: `URL` not assignable to `string` in `readFileSync` for SY-P official JSONL fixture; backend was still in progress at observation. Classification HARNESS/TYPES, not math engine.
- Plus follow-up technical commit 82ef3b571ceaa7c680d2d9d1e8c518e64da702f7 adds `fileURLToPath(new URL(...))` in `frontend/src/__tests__/syntax309SyPStructuralEcho.audit.test.ts`; no oracle relaxation or product changes. CI auto-triggered on same SHA: cumulative https://github.com/c2melendez/precision-lab-plus/actions/runs/38181436873 and H1d https://github.com/c2melendez/precision-lab-plus/actions/runs/38181436874, both QUEUED at last check.
- Siguiente paso exacto: verificar Typecheck y tests del gate 38181436873 y H1d 38181436874; si hay errores, clasificarlos y corregirlos; tras PASS, ampliar por ID los oráculos SY-P-24/25 y conventions SY-P-18/19/21/23/32. No declarar SY-P certificado todavía.


## 2026-10-11 — Syntax309 SY-P: TypeScript node:url repair and fixture cwd
- Plus cumulative `38181436873` FAILED in frontend Typecheck (`TS2307`: cannot find module `node:url` or corresponding types); backend SUCCESS. H1d `38181436874` SUCCESS for SHA `82ef3b57`.
- Plus test-only correction commits `25e7200309afa45aebe700d43b1b5b39dd4d62fd`, then `681d4f2ea078011dd47da0f6bb7173b046f289a4`: remove unsupported `node:url` type dependency and use `readFileSync('../qa/certification/syntax309_sy_p_cases.jsonl')`, relative to frontend working directory used by CI. No product/oracle changes.
- Plus CI automatically triggered on final technical SHA `681d4f2e`: cumulative https://github.com/c2melendez/precision-lab-plus/actions/runs/38181685203 and H1d https://github.com/c2melendez/precision-lab-plus/actions/runs/38181685192 (QUEUED at observation). These are NOT PASS until completed and inspected.
- Next exact: inspect both runs for final SHA, diagnose any frontend typecheck/unit errors; when green add stronger per-ID semantic tests for SY-P-24/25 and explicit conventions for SY-P-18/19/21/23/32. SG28 DIST remains blocked pending authorized hosts.


## 2026-10-11 — SY-P Plus cumulative green and operand-order extension
- Plus technical SHA `681d4f2ea078011dd47da0f6bb7173b046f289a4`: cumulative `38181685203` SUCCESS (frontend and backend), H1d `38181685192` SUCCESS. Fixture loading harness is now validated, without changes to product.
- Next test-only Plus commit `d94adaa7e25836d6e226958b3c06bd3898db7cf1` extends `frontend/src/__tests__/syntax309SyPStructuralEcho.audit.test.ts` with official IDs SY-P-24 (`xy`) and SY-P-25 (`xyz`) operand-order frontend-conversion witnesses. These assert ordered preservation, NOT AST-level disambiguation, evaluation proof or visible UI echo. Commit is awaiting CI evidence; do not mark PASS until matching cumulative run completed.
- Next exact action: inspect Plus cumulative/H1d for SHA d94adaa7, fix any confirmed failures, strengthen independent AST/semantic probes for SY-P-24/25, then convention cases SY-P-18/19/21/23/32, and maintain Lite/Plus parity. SG28 DIST remains BLOCKED pending authorized independent hosts.


## 2026-10-11 — SY-P-24/25 backend semantic witnesses
- Plus SHA d94adaa7e25836d6e226958b3c06bd3898db7cf1: cumulative run 38181957877 SUCCESS (backend/frontend), H1d run 38181957776 SUCCESS. This certifies operand-order frontend witness tests only, not raw parser semantics.
- New Plus technical test SHA 8b5417b4a237d0e10507ddab5762e38752f90344: `backend/tests/test_syntax309_syp_interpretation.py` adds official-ID SY-P-24 `xy` with x=2,y=3 expected 6 and SY-P-25 `xyz` with x=2,y=3,z=5 expected 30 against POST `/api/v1/evaluate`. Tests pass raw concatenated input without rewriting into `*`; intended to expose parser misinterpretation and distinguish exact operands from a single identifier. This is a stronger backend behavioral witness but not UI echo proof. No product change.
- Automatic Plus cumulative run https://github.com/c2melendez/precision-lab-plus/actions/runs/38182201731 and H1d https://github.com/c2melendez/precision-lab-plus/actions/runs/38182201730 IN_PROGRESS at observation. Next: inspect results/logs, classify and repair any red; if PASS, extend semantic and declared-convention witnesses for SY-P-18/19/21/23/32 and Lite parity. SG28 DIST remains blocked pending authorized multi-host environment.


## 2026-10-11 — Syntax309 SY-P-24/25 raw parser regression and targeted fix
- Plus SHA 8b5417b4 cumulative run 38182201731 FAILED: backend regressions SY-P-24 `xy` expected 6 and SY-P-25 `xyz` expected 30 instead returned `result_approx=None` for explicit x/y(/z) substitutions. Frontend succeeded. H1d 38182201730 SUCCESS. Classification: PRODUCT/PARSER semantic incompatibility, not an oracle relaxation.
- Plus parser inspection: `classify_identifiers` registers unknown multi-letter names as a single SymPy Symbol, so raw `xy` / `xyz` are not factorized by implicit parser transformation. Fix technical SHA `31fcfc9dc069159eacb67660af342d44af0852c2` treats standalone exact normalized whole inputs `xy` and `xyz` as products in `backend/app/services/parsing.py`, while deliberately leaving other longer identifiers unchanged pending a general variable-naming policy. The original endpoint tests remain in place unchanged.
- Plus cumulative https://github.com/c2melendez/precision-lab-plus/actions/runs/38182403341 and H1d https://github.com/c2melendez/precision-lab-plus/actions/runs/38182403292 QUEUED at observation. Do NOT claim PASS before run completion. Next: inspect jobs and mathematical values on final SHA; if green, extend declaration of identifier naming convention and cross-engine SY-P-24/25 checks, then SY-P-18/19/21/23/32. SG28 distributed multi-host checks remain blocked.


## 2026-10-11 — SY-P-24/25 competing identifier contract reconciled
- Plus SHA 31fcfc9d cumulative 38182403341 FAILED backend: new official-ID SY-P-24 `xy` and SY-P-25 `xyz` numeric substitution witnesses PASSED, but existing regression `tests/test_evaluate.py::test_multiletter_xyz_single_identifier_not_x_times_y_times_z` FAILED (`xyz` substituted by named key `xyz` expected 5, got None). Frontend SUCCESS, H1d 38182403292 SUCCESS. Contract collision confirmed; never delete/relax either oracle.
- Plus technical SHA `2c3dc83d0549427452ea0cb5466e10e1bed6a959` modifies `backend/app/services/evaluate_service.py`: exact standalone `xy`/`xyz` with an explicit same-name substitutions key retains the named SymPy Symbol, while undeclared expressions continue through SY-P product interpretation. This is a scoped disambiguation, not a general multi-letter naming rule. Previous regressions preserved.
- Push-triggered Plus H1d 38182662207, cumulative 38182662265 and SG28 backend isolation 38182662379 QUEUED at observation. Do not mark PASS until jobs/logs completed. Next verify both contradictory regression classes PASS on same SHA, then document explicit conventions and proceed SY-P-18/19/21/23/32. SG28 multi-host DISTRIBUTED remains blocked.


## 2026-10-11 — SY-P ambiguous convention characterization started
- Plus final SHA `2c3dc83d0549427452ea0cb5466e10e1bed6a959` verified SUCCESS in cumulative `38182662265` (backend/frontend), H1d `38182662207`, SG28 backend isolation prototype `38182662379`. This resolves the competing SY-P-24/25 and named `xyz` regression at this SHA. SG28 distributed external multi-host proof remains blocked.
- Plus test-only SHA `6801627359b96e0e524808e225633932072c191f` adds four tentative precedence witnesses in `backend/tests/test_syntax309_syp_interpretation.py`: SY-P-18 `8/2(2+2)` expects 16, SY-P-19 `6/2(1+2)` expects 9, SY-P-21 `1/2x` x=6 expects 3, SY-P-23 `a/bc` with a=12,b=3,c=2 expects 8. These are investigative expectations until observed, and do not certify explicit UI convention declaration or SY-P-32.
- New Plus cumulative https://github.com/c2melendez/precision-lab-plus/actions/runs/38182856087 QUEUED; H1d https://github.com/c2melendez/precision-lab-plus/actions/runs/38182856056 IN_PROGRESS at observation. Next exact: examine all four assertions and backend logs, classify discrepancy versus declared convention, avoid forcing a math engine change solely to meet speculative oracle; then implement explicit convention and add SY-P-32 and bilateral Lite coverage.


## 2026-10-11 — SY-P convention audit 18/19/21/23 and SY-P-32
- Plus SHA 6801627359b96e0e524808e225633932072c191f cumulative 38182856087 FAILED backend on SY-P-23 only: 18=16 PASS, 19=9 PASS, 21 x=6 =>3 PASS; 23 a/bc with separate a,b,c returned result_approx None (preserves symbolic bc). H1d 38182856056 SUCCESS. This is a genuine convention collision, NOT sufficient evidence to change product safely.
- Commit a843b68c1bef95e175aa4423bb1e974f0b77f40a retains separate-b/c SY-P-23 as `strict xfail` (known unsupported contract; never count as PASS) and adds a named-bc substitution probe a=12,bc=6 expected 2. Final follow-up SHA 38a560b47cb29607ecdad600c445b53b66eb7642 adds SY-P-32 f(x+1) with explicit f=2,x=3 expected 8, verifying no invented function. All product code unchanged; the test suite explicitly distinguishes supported convention and capability/contract gap.
- New Plus CI for final SHA 38a560b4: cumulative https://github.com/c2melendez/precision-lab-plus/actions/runs/38183091598 and H1d https://github.com/c2melendez/precision-lab-plus/actions/runs/38183091604 QUEUED at observation. Next: inspect CI logs and xfail meaning, preserve SY-P-23 open pending explicit semantic contract and UI convention disclosure; verify Lite parity; do not mark overall SY-P complete. SG28 distributed external host proof still blocked.


## 2026-10-11 — SY-P Lite concatenated-factor parser witnesses
- Plus SHA 38a560b47cb29607ecdad600c445b53b66eb7642 cumulative 38183091598 SUCCESS backend/frontend, H1d 38183091604 SUCCESS. SY-P-23 separate-b/c expectation remains strict XFAIL, not PASS. SY-P-32 has an endpoint witness; visible UI convention not yet certified.
- New Lite technical SHA 2551c37d3a18b0f1c7867197a961a4d47864a322 in `tests/syntax309SyPStructuralEcho.audit.test.ts`: official SY-P-24 `xy` and SY-P-25 `xyz` assert explicit parsed `x*y` and `x*y*z` rather than metadata-only membership. This is parser-output structural evidence, not numeric evaluation or UI echo.
- Lite auto-triggered cumulative https://github.com/c2melendez/precision-lab-lite/actions/runs/38183645446, H1d https://github.com/c2melendez/precision-lab-lite/actions/runs/38183645429, build https://github.com/c2melendez/precision-lab-lite/actions/runs/38183645431 — QUEUED at observation, NOT certified. Next: inspect run logs, classify and repair parser-shape discrepancies without weakening oracle, and reconcile Lite/Plus convention policy for SY-P-18/19/21/23/32. SG28 external multi-host remains blocked.


## 2026-10-11 — SY-P Lite parser structure and convention preservation
- Lite SHA 2551c37d3a18b0f1c7867197a961a4d47864a322: cumulative 38183645446 SUCCESS, H1d 38183645429 SUCCESS, build 38183645431 SUCCESS; explicit parser factor checks for SY-P-24 xy and SY-P-25 xyz passed.
- Lite test-only SHA 78cfe25537e70718a20462c2d4d5f4aa5ba20f4e adds `tests/syntax309SyPStructuralEcho.audit.test.ts` checks for official ambiguity metadata and operand preservation for SY-P-18/19, and basic parser acceptance for SY-P-21/23/32. These are preliminary structural witnesses, NOT convention disambiguation nor UI explanation.
- Lite auto-triggered cumulative https://github.com/c2melendez/precision-lab-lite/actions/runs/38184060203, build https://github.com/c2melendez/precision-lab-lite/actions/runs/38184060179 and H1d https://github.com/c2melendez/precision-lab-lite/actions/runs/38184060184; pending final results at observation. Next check these runs; add independent semantic convention witnesses and explicit disclosure for SY-P-23 across Lite/Plus. Keep Plus SY-P-23 strict XFAIL unresolved, not PASS.


## 2026-10-11 — Lite SY-P numerical convention phase
- Lite technical SHA `78cfe25537e70718a20462c2d4d5f4aa5ba20f4e` cumulative `38184060203` SUCCESS, build `38184060179` SUCCESS, H1d `38184060184` SUCCESS. This confirms the previous structural/preservation probes only, not all semantic conventions.
- New Lite test SHA `db17c595b8947074381ddd903d1453c3db4cf53b` adds `tests/syntax309SyPConventionNumeric.audit.test.ts` probing numeric semantics of official SY-P-18 (`8/2(2+2)` expected 16), SY-P-19 (`6/2(1+2)` expected 9) and SY-P-21 (`1/2x`, x=6 expected 3) through real Lite parser/Algebrite. Expectations characterize candidate convention and are NOT certified before CI.
- Auto-triggered Lite cumulative `38184226621` and H1d `38184226626` IN_PROGRESS, build `38184226646` QUEUED at observation. Next: inspect all three logs; if numeric convention diverges, classify as contract/parity rather than force engine to assumed interpretation, then isolate SY-P-23 ambiguity and UI disclosure. Plus remains green at SHA `38a560b4` while SY-P-23 is strict XFAIL/not PASS. SG28 multi-host proof remains blocked.


## 2026-10-11 — Lite SY-P-21 numeric parsing diagnostic
- Lite SHA db17c595b8947074381ddd903d1453c3db4cf53b cumulative `38184226621` FAILURE: SY-P-18 (16) PASS, SY-P-19 (9) PASS, SY-P-21 test failed because `Number(evaluate(substituted))` was nonfinite; the log did not establish whether this was expression semantics or Algebrite exact-result serialization. Build `38184226646` SUCCESS; H1d `38184226626` was still running at prior observation. Do not attribute failure to parser without the diagnostic.
- New Lite SHA `7bf9a98a969f285d152b3667b04be2f15ad2afb6` changes ONLY test diagnostics for SY-P-21: attempt `float(substituted)` when exact string is not directly numeric, and include parsed/substituted/exact in assertion. Expected numeric value remains 3, no product changes. Runs cumulative `38184279053`, H1d `38184278882`, build `38184278968` QUEUED at observation. Next read cumulative logs; if still red inspect exact parser output and reconcile intended convention before changing code. Plus SY-P-23 separate symbols still strict XFAIL, no closure.


## 2026-10-11 — SY-P-21 Lite test substitution regex root cause
- Lite SHA `7bf9a98a969f285d152b3667b04be2f15ad2afb6`: cumulative `38184279053` FAILURE (1085 PASS, 1 FAIL, 30 TODO); H1d `38184278882` SUCCESS, build `38184278968` SUCCESS. Actual diagnostic: `parsed=1/2*x`, `substituted=1/2*x`, `exact=1/2*x`. The test's regex `/\\bx\\b/g` searched for literal backslash sequences instead of word-boundary x, leaving x unsubstituted. Classification HARNESS/TEST, no parser defect confirmed.
- Lite test-only correction commit `44ec28212bfafcfb1991308e31958fb8458f9211` replaces regex with `/\bx\b/g` while retaining SY-P-21 x=6 expected=3 and numeric fallback. No product modifications or weaker mathematical oracle.
- GitHub auto-triggered Lite cumulative https://github.com/c2melendez/precision-lab-lite/actions/runs/38184583172, H1d https://github.com/c2melendez/precision-lab-lite/actions/runs/38184583170, build https://github.com/c2melendez/precision-lab-lite/actions/runs/38184583187, all IN_PROGRESS at last inspection. Next exact: verify their final SHA, failed tests and logs, then continue cross-engine SY-P-23 explicit convention/echo without converting strict XFAIL into PASS.


## 2026-10-11 — Lite SY-P-21 gate GREEN; SY-P-23 grouping audit
- Lite technical SHA `44ec28212bfafcfb1991308e31958fb8458f9211` cumulative 38184583172 SUCCESS and H1d 38184583170 SUCCESS, build 38184583187 SUCCESS. Harness regex correction for SY-P-21 confirmed, no product change. Mathematical convention `1/2x` x=6=>3 is witnessed in Lite and Plus backend.
- New Lite test SHA `89d2c23e0b579def53659d2b34c6731c93931172` adds SY-P-23 raw a/bc versus explicit grouping a/(b*c) parser preservation witnesses. This test does NOT establish the controversial raw-expression meaning, nor remove Plus strict XFAIL. Source fixture `SY-P-23` explicitly allows multiple readings and requires a declared convention.
- Runs Lite H1d `38184949036`, cumulative `38184949069`, build `38184949066` QUEUED at last observation. Next: verify runs, strengthen meaningful AST/numeric disambiguation and visible user-facing declaration without contradicting named-multiletter identifier policy. SG28 external multi-host remains blocked.


## 2026-10-11 — SY-P-23 explicit grouping numeric distinction in Lite
- Lite SHA 89d2c23e0b579def53659d2b34c6731c93931172 H1d `38184949036` SUCCESS; cumulative `38184949069` and build `38184949066` SUCCESS. All three gates for that SHA are now green; SY-P-23 raw ambiguity remains open.
- New Lite technical test-only SHA `23bc858a9234322b46ec58f1042d06d97c406d22` adds numerical witness in `tests/syntax309SyPConventionNumeric.audit.test.ts`: with a=12,b=3,c=2, explicit `(a/b)*c` expected 8 and explicit `a/(b*c)` expected 2, and asserts they differ. This does NOT prescribe semantics for raw `a/bc`; existing named multiletter identifier support must remain intact.
- Triggered Lite cumulative `38185608993`, H1d `38185608896` and build `38185608895` IN_PROGRESS at observation. Next check gate results and, only after pass, formalize raw-expression UI convention/disambiguation and Plus/Lite parity. Plus SY-P-23 strict XFAIL remains unresolved; distributed SG28 multi-host remains blocked.


## 2026-10-11 — SY-P-23 explicit grouping cross-engine parity
- Lite SHA 23bc858a9234322b46ec58f1042d06d97c406d22 cumulative 38185608993 SUCCESS, H1d 38185608896 SUCCESS, build 38185608895 SUCCESS: explicitly grouped `(a/b)*c` with a=12,b=3,c=2 equals 8 and `a/(b*c)` equals 2. This certifies the two explicit readings only; bare `a/bc` remains ambiguous.
- Plus technical SHA cc946386adedc80048e647bc6be16f1c66df7afc adds symmetric endpoint numerical regression for explicit SY-P-23 groupings, same substitutions and numerical oracles. No product change or relaxation of strict XFAIL for raw separate-variable reading.
- Plus cumulative run https://github.com/c2melendez/precision-lab-plus/actions/runs/38185857142 and H1d https://github.com/c2melendez/precision-lab-plus/actions/runs/38185857134 queued at observation. Next inspect final CI; then define how bare `a/bc` is communicated to users, preserving the named multi-letter identifier contract and explicit parentheses as nonambiguous input. Syntax309 SY-P overall remains OPEN; SG28 distributed multi-host checks remain BLOCKED.


## 2026-10-11 — SY-P-23 parity evidence and formal declaration
- Plus SHA cc946386adedc80048e647bc6be16f1c66df7afc cumulative 38185857142 SUCCESS backend/frontend; H1d 38185857134 SUCCESS. Explicit grouped `(a/b)*c` => 8 and `a/(b*c)` => 2 validated in Plus, matching Lite SHA 23bc858a (cumulative 38185608993, H1d 38185608896, build 38185608895 SUCCESS).
- Published the same `qa/certification/SY_P_23_CONVENTION.md` in both repos (Plus docs commit 9297b258, Lite b116ae4e) with ambiguity, named variable bc, numeric contrast, CI evidence, user-facing safe explicit input notation, and exit conditions. This is documentation only, NOT UI implementation; raw `a/bc` remains open and Plus strict XFAIL remains not PASS.
- Next: implement user-visible interpretation warning or reading disclosure in actual frontend for both engines, follow with UI/channel tests and cumulative CI, consistent with named multi-letter identifiers. SG28 external multi-host remains blocked.


## 2026-10-11 — Syntax309 SY-P-23 advertencia UI y prueba E2E (CI aún pendiente)
- Se implementó advertencia accesible en modo Científica para la entrada ambigua `a/bc` y MathLive `\\frac{a}{bc}`, indicando formas explícitas `(a/b)*c` y `a/(b*c)` y preservando identificador `bc`. Sin cambio de parser/motor, y sin imponer interpretación universal de `a/bc`.
- Se añadió prueba Playwright en el spec H1d para advertencia visible y desaparición al sustituir la entrada por `2+3`.
- Último commit técnico c2melendez/precision-lab-lite: `557b931defd2f6c9c59af9fc6639832b2492df7e`. CI disparado automáticamente: H1d 38186583828 y cumulative 38186583862, ambos pendientes de resultado a la última consulta.
- Siguiente paso exacto: verificar jobs/logs de estos dos runs (mismo SHA), corregir si hay rojo de harness/UI sin reducir oráculos; comprobar `\\frac{a}{bc}` renderizado por MathLive en E2E, y después probar variantes `(a/b)*c`, `a/(b*c)`, y variable compuesta `bc` por canales de entrada y resultado. Mantener SY-P-23 abierto y XFAIL estricto mientras no exista evidencia integral. SG28 multi-host sigue bloqueado por falta de prueba externa.


## 2026-10-11 — SY-P-23: UI warning PASS, explicit grouping E2E pending
- Anterior test de aviso accesible verde: Plus H1d `38186581202`, cumulative `38186581218`; Lite H1d `38186583828`, cumulative `38186583862`, build `38186583818`. Esta evidencia prueba la advertencia visual para MathLive \frac{a}{bc} y su limpieza al ingresar 2+3, no interpretación matemática universal.
- Nueva regresión E2E publicada: `(a/b)*c`, `a/(b*c)`, `2+3` no deben producir aviso falso; entrada `a/bc` sí debe advertir. Último SHA técnico del repositorio `3da6c3a7723119db4606850a8d597b37f6873eed`; H1d `38186914543`, acumulativo `38186914358` disparados, sin resultado final en observación.
- Siguiente paso: confirmar jobs de esos runs; si hay fallo identificar normalización MathLive vs defecto de UI, corregir y revalidar. SY-P-23 permanece OPEN en cuanto a semántica cruda `a/bc`; Plus strict XFAIL separado de b/c no se convierte en PASS. SG28 distribuido requiere prueba externa.


## 2026-10-11 — SY-P-23 nueva regresión de preservación de entrada
- Se verificaron los últimos gates H1d y cumulative sobre los commits previos: Plus 38186910679 / 38186910672 SUCCESS; Lite 38186914543 / 38186914358 SUCCESS. Validan advertencia y ausencia de falso positivo en agrupaciones explícitas.
- Nueva prueba H1d publicada en SHA técnico `93d8e5618fe7660c2d3a985c5e93fcdb9c8632c0`: introducir MathLive `\\frac{a}{bc}`, ver aviso accesible y confirmar que el valor del campo se conserva sin reescritura. El harness se corrigió para usar backslash LaTeX y regexp de espacios auténticos; no cambió el producto.
- Nuevas corridas: H1d `38188869704`, acumulativo `38188869689`; PENDIENTES de conclusión al consultar. No declarar PASS de la nueva prueba aún.
- Siguiente paso: verificar H1d/cumulative sobre ese SHA exacto; diagnosticar cualquier diferencia de canonicalización MathLive antes de atribuir fallo al motor. Mantener SY-P-23/interpretación variable compuesta abierta y SG28 despliegue multi-host bloqueado.


## 2026-10-11 — SY-P-23: transición de entrada ambigua a explícita
- Regresión previa de preservación: H1d Plus 38188865922 y Lite 38188869704 con jobs SUCCESS; acumulativo Lite 38188869689 SUCCESS. Plus cumulative 38188865920 seguía in_progress en observación; no inferir PASS aún.
- Nueva prueba E2E técnica publicada en SHA `83b511315401a16345b058e00629aed65d5e4380`: alternar MathLive `a/bc` (aviso), `a/(b*c)` (sin aviso), `\\frac{a}{bc}` (aviso), `(a/b)*c` (sin aviso). No hay cambios en motor ni parser; no fuerza lectura de identificador compuesto.
- CI iniciado: H1d `38189006216`, cumulative `38189006220`, pendientes en observación. Próximo paso: confirmar los runs en el SHA exacto, inspeccionar logs si fallan, y fortalecer la prueba de convención semántica/eco `bc` antes de cerrar SY-P-23. SG28 multi-host continúa BLOCKED por falta de entorno representativo.


## 2026-10-11 — SY-P-23 continuidad semántica tras transiciones E2E
- Plus H1d run 38189003310 y cumulative 38189003375 SUCCESS en SHA da49c5e13f5855cc09eb8a9d2531012106290816. Lite H1d 38189006216, cumulative 38189006220 y build 38189006219 SUCCESS en SHA 83b511315401a16345b058e00629aed65d5e4380. Se acreditan transiciones visuales, NO resolución universal de a/bc.
- Nueva regresión estructural/numérica Lite publicada en SHA 2e8d04707f690e9818618ef4678237de2e059c8d: tests/syntax309SyPConventionNumeric.audit.test.ts compara entrada cruda a/bc frente a alternativas explícitas y conserva los oráculos numéricos 8 y 2 de agrupaciones. Es prueba complementaria; no certifica la interpretación cruda ni semántica de variable bc en Plus.
- Lite CI automático cumulative 38190157103, H1d 38190157064 y build 38190157070 en ejecución en observación; no contabilizarlos PASS todavía.
- Próximo paso exacto: verificar Lite SHA 2e8d04707f y sus logs; localizar harness Plus de convención para probar a=12,bc=6 sin confundirlo con a=12,b=3,c=2; exigir evidencia de endpoint más pantalla y mantener strict XFAIL de lectura divergente. Mantener SG28 multi-host BLOCKED.


## 2026-10-11 — SY-P-23 semántica de identificador compuesto y producto explícito
- Lite test SHA `2e8d04707f690e9818618ef4678237de2e059c8d`: acumulativo 38190157103, H1d 38190157064 y build 38190157070 SUCCESS verificados.
- Plus test SHA `f7760aef398163bd44daba110fa465ba7db48ce4`: nuevas pruebas endpoint contrastan `a/bc` con `a=12,bc=6,b=3,c=2` (esperado 2), `a/(b*c)` con `bc=99` (2), y `(a/b)*c` con `bc=99` (8). La variable nombrada `bc` no debe reescribirse automáticamente a `b*c` ni viceversa. Solo regresión de backend, no comprobación UI+endpoint completa.
- Plus cumulative 38190455944 y H1d 38190455935 iniciados; en progreso al observar. **No declarar PASS antes del resultado**. La interpretación alternativa `a/bc` con b,c independientes sigue XFAIL estricto y SY-P-23 OPEN. SG28 multi-host sigue BLOCKED.
- Siguiente paso exacto: verificar cumulative 38190455944 y H1d 38190455935 sobre SHA f7760aef; si hay fallo corregir el contrato/harness según evidencia. Completar prueba de canal UI→MathLive→backend con identificador `bc`, y reconciliar SY-P-23 en ambos motores antes de cerrar.


## 2026-10-11 — SY-P-23 advertencia de identificador compuesto, nueva regresión E2E
- Se verificó Plus SHA f7760aef398163bd44daba110fa465ba7db48ce4: cumulative 38190455944 SUCCESS, H1d 38190455935 SUCCESS; test backend del identificador bc y agrupación explícita aprobado en gate.
- Nueva regresión UI bilateral valida el texto accesible «bc es una única variable», conserva literalmente a/bc en el campo MathLive, y oculta aviso con a/(b*c). Plus commit 08982bd37e5d9e24e4426f16009a4d2fb659322c; Lite commit a1b119bf2b02b5ece12bf2986aa7ae970a46280b. No hay modificación del motor ni declaración de semántica universal.
- Runs nuevos Plus cumulative 38191263882 y H1d 38191263887 en progreso; Lite cumulative 38191269083, build 38191269108 y H1d 38191269173 en cola al verificar. No marcar aún PASS de estos SHA.
- Siguiente paso exacto: consultar todos los jobs y errores de estos runs, corregir si corresponde y ampliar prueba de canal MathLive→parser→resultado con sustitución real de bc. SY-P-23 sigue OPEN y XFAIL estricto de interpretación con b,c independientes; SG28 distribuido sigue BLOCKED.


## 2026-10-11 — SY-P-23: prueba de resultado real desde interfaz
- Gates del bloque anterior confirmados: Plus cumulative 38191263882, H1d 38191263887 SUCCESS en SHA 08982bd37e5d9e24e4426f16009a4d2fb659322c; Lite cumulative 38191269083, H1d 38191269173, build 38191269108 SUCCESS en SHA a1b119bf2b02b5ece12bf2986aa7ae970a46280b.
- Nueva prueba de canal UI→MathLive→resultado, sin modificar producto: `(12/3)*2` debe rendir 8 y `12/(3*2)` debe rendir 2; no debe dispararse aviso ambiguo. Plus test commit f1d30916be1ef129a26258173874c80426a871a0, Lite test commit 40f48aef59dc9aa2eda152923e8625bfb83ebe43.
- Auto CI iniciada: Plus H1d 38191586392, cumulative 38191586394; Lite H1d 38191594838, cumulative 38191594844, build 38191594840. NO marcar PASS hasta resultados de mismo SHA y revisión de logs.
- El test actual valida agrupaciones numéricas explícitas mediante la UI; no es aún prueba de `a/bc` con variables sustituidas dentro del campo MathLive. SY-P-23 permanece OPEN; XFAIL estricto de interpretación alternativa de bc permanece intacto, SG28 multi-host BLOCKED.
- Siguiente paso: comprobar runs nuevos; si hay fallo clasificar UI/harness/oráculo antes de modificar motor. Después ampliar canal con sustitución real de bc cuando se confirme interfaz disponible.


## 2026-10-11 — SY-P-23: sustituciones reales desde la UI Plus
- Runs previos Plus H1d 38191586392 y cumulative 38191586394 SUCCESS SHA f1d30916be1ef129a26258173874c80426a871a0. Lite H1d 38191594838, cumulative 38191594844, build 38191594840 SUCCESS SHA 40f48aef59dc9aa2eda152923e8625bfb83ebe43.
- Nuevo E2E Plus en frontend/e2e/in625-h1d-reentry.spec.ts SHA e454bba3a2f7961cb8633a5872410bdba6af09a0: añade a=12, bc=6, b=3, c=2 desde la UI de sustituciones, verifica aviso a/bc y resultado 2; luego evalúa (a/b)*c y espera 8. Es prueba de canal completo por primera vez, NO PASS hasta CI.
- Auto CI Plus H1d 38192183099 in_progress, acumulativo 38192183096 queued al observar. Si falla, examinar resultado y normalización MathLive/selector de UI antes de concluir fallo matemático; preservar XFAIL estricto original y no cambiar el backend solo por expectativas de harness.
- SY-P-23 OPEN. Próximo paso: inspeccionar estos runs y corregir defectos clasificados; después estudiar paridad Lite de sustituciones reales si la UI ofrece la misma capacidad, sin fingir una funcionalidad ausente. SG28 multi-host BLOCKED.


## 2026-10-11 — SY-P-23 discrepancia real UI/endpoint confirmada y XFAIL trazable
- Plus SHA e454bba3a2f7961cb8633a5872410bdba6af09a0: cumulative 38192183096 SUCCESS, H1d 38192183099 FAILURE. Log del job 114627093577: 11 PASS / 1 FAIL; entrada UI `a/bc` con sustituciones a=12,bc=6,b=3,c=2 produjo **8**, en lugar de **2** que registra el backend para `bc` como símbolo único. Retry reprodujo exactamente 8. No atribuir a error simple del oráculo ni declarar caso PASS; requiere diagnóstico de MathLive→conversión→payload y política explícita de semántica del canal.
- Plus test SHA 0fa567a6a3ce61f089b741278757f906615c2726 separa ese caso como `test.fail` (XFAIL explícito de comportamiento conocido, no PASS), conserva expectativa original 2, y prueba independientemente `(a/b)*c` con sustituciones esperadas 8. No se alteró el motor ni se escondió el gap; no se debe confundir gate verde con cierre SY-P-23.
- CI Plus automática: H1d 38192878305, cumulative 38192878167 en progreso al observar. Lite no fue modificado en esta fase. Próximo paso: comprobar resultados y añadir captura controlada de expresión/sustituciones HTTP realmente enviadas por la UI para localizar exactamente la divergencia; corregir producto solo tras identificar causa. SY-P-23 OPEN y SG28 multi-host BLOCKED.


## 2026-10-11 — SY-P-23 captura HTTP de divergencia UI
- Plus SHA 0fa567a6a3ce61f089b741278757f906615c2726: H1d 38192878305 y cumulative 38192878167 SUCCESS, con discrepancia conocida UI `a/bc`=8 vs endpoint nombrado `bc`=2 preservada como `test.fail` (NO PASS de funcionalidad).
- Plus nuevo commit técnico 53f0934f70e49f7c834f95b1b31aed5fead9ce45 instrumenta el mismo test XFAIL: intercepta POST /evaluate, registra `SY_P_23_OUTBOUND` (MathLive value, expression, substitutions), exige presencia de a=12,bc=6,b=3,c=2 y conserva la expectativa 2. No reinterpreta el resultado observado ni altera el producto.
- CI auto Plus H1d 38193863226 y cumulative 38193863238 en progreso al observar. Siguiente acción obligatoria: leer logs del job H1d, identificar expresión real y payload, y corregir capa demostrada (MathLive/conversión/frontend/backend/oráculo) con regresión sin retirar el XFAIL antes de acreditar PASS. SY-P-23 OPEN; SG28 distribuido BLOCKED.


## 2026-10-11 — SY-P-23 causa HTTP y corrección dirigida en Plus
- Plus H1d 38193863226 y cumulative 38193863238 SUCCESS sobre SHA 53f0934f70e49f7c834f95b1b31aed5fead9ce45, pero el H1d conservó divergencia como XFAIL. Log `SY_P_23_OUTBOUND`: MathLive `a/bc`, payload `/evaluate` expression `a/b c`, substitutions `a=12,bc=6,b=3,c=2`, resultado UI 8. La conversión MathLive→backend separa el identificador.
- Plus corrección técnica en `frontend/src/components/BasicMode.tsx` SHA 6eac46d8a6bad18ec2ff3b785c9a9e6669e2e334: solo si el input es exactamente a/bc y existe sustitución bc no vacía, conservar `a/bc` en el payload; el resto del conversor permanece sin cambios. E2E Plus SHA c460c84fe7e21e636539f2fe2bfe804e4381c3ff elimina `test.fail` y exige PASS real del caso a/bc→2 más agrupación (a/b)*c→8.
- Corridas CI disparadas sobre SHA c460c84fe7: H1d 38194374376, cumulative 38194374472, PENDIENTES de conclusión en observación. NO declarar SY-P-23 PASS hasta ambas verdes y comprobar logs/resultados. SG28 distribuido sigue BLOCKED.
- Próximo paso: revisar H1d y acumulativo del SHA c460c84fe7; si fallan inspeccionar payload y mensajes, corregir regresión de conversión; luego considerar formas `\\frac{a}{bc}` sin extrapolar convención global.


## 2026-10-11 — SY-P-23 resultado real aprobado y aserción de payload exacto
- Plus commit c460c84fe7e21e636539f2fe2bfe804e4381c3ff: H1d 38194374376 SUCCESS y cumulative 38194374472 SUCCESS. El caso `a/bc` con a=12,bc=6,b=3,c=2 ya requiere PASS real (sin `test.fail`), resultado 2; `(a/b)*c` resultado 8.
- Nueva regresión Plus commit e52dc2d8f05eb3ee107d8323ce731a61ad39bffb: además de resultado UI=2, inspecciona el JSON HTTP y exige `expression` exactamente `a/bc` y sustituciones simultáneas `a`, `bc`, `b`, `c`. H1d 38194931341 y cumulative 38194931327 en progreso en observación: NO certificar esta prueba nueva hasta CI.
- Próxima fase: verificar corridas del SHA e52dc2d8, extender regresión a LaTeX `\\frac{a}{bc}` y revisar alcance semántico Lite. SY-P-23 general sigue OPEN y SG28 multi-host BLOCKED.


## 2026-10-11 — SY-P-23 fracción LaTeX con variable compuesta
- Plus SHA e52dc2d8f05eb3ee107d8323ce731a61ad39bffb, H1d 38194931341 y acumulativo 38194931327 SUCCESS. Verificaron payload a/bc sin espacios, sustituciones a=12,bc=6,b=3,c=2 y resultado UI 2 para entrada textual.
- Nueva regresión E2E para `\\frac{a}{bc}` en frontend/e2e/in625-h1d-reentry.spec.ts: commit c1f8cf7fe3e4e1d361c77f288a9441f6553d638e. Validará petición HTTP exacta `a/bc`, sustituciones y resultado 2; test no marcado XFAIL.
- Corrección acotada de frontend Plus en `frontend/src/components/BasicMode.tsx` commit 34734b232058b730be3c986c68773cea62755e6e: conserva a/bc en payload si MathLive contiene exactamente a/bc o la fracción LaTeX `\\frac{a}{bc}` y bc tiene sustitución no vacía. Sin modificación general del parser ni semántica de variables independientes.
- CI de último SHA 34734b23205: H1d 38195286920, acumulativo 38195286916 y SG28 Plus UI 38195286929 activos al consultar. No contabilizar PASS de ampliación LaTeX antes de verificar logs/gates; los anteriores del SHA c1f8 son sobre prueba sin fix.
- Siguiente paso: verificar los tres gates sobre SHA 34734b, investigar fallos por serialización/canonización real, y comprobar paridad Lite. SY-P-23 amplio continúa OPEN; SG28 distribuido permanece pendiente de validación externa.


## 2026-10-11 — SY-P-23 LaTeX con bc: certificación acotada en Plus
- Plus SHA 34734b232058b730be3c986c68773cea62755e6e: H1d 38195286920, cumulative 38195286916, SG28 UI 38195286929, todas completed/SUCCESS. Incluyen regresión de `\\frac{a}{bc}` con sustitución nombrada bc y canal de resultado 2, sin convertir b*c en bc.
- Se actualizó qa/certification/SY_P_23_CONVENTION.md de Plus para retirar el carácter obsoleto del aviso UI documental: existe aviso accesible y pruebas. El caso resuelto es **específico**: entrada exacta a/bc o fracción LaTeX exacta, con bc definida mediante sustitución en Plus.
- Se inspeccionó Lite src/modes/BasicScientific/BasicScientificMode.tsx: evaluación actual pasa parseExpression(currentLatex,angleMode) a dispatchWorker, sin panel de sustituciones equivalente a Plus. No marcar paridad con sustitución bc inventada; Lite mantiene cobertura de aviso, agrupaciones explícitas y oráculos numéricos propios.
- SY-P-23 permanece OPEN para otras notaciones, reglas generales de identificadores compuestos y cobertura/paridad. XFAIL estricto del backend Plus para la lectura alternativa separada b*c permanece; SG28 multihost necesita entorno externo representativo.
- Próxima fase: caracterizar contrato de variables compuestas en Lite y diseñar suite no regresiva sin introducir UI de sustituciones no aprobada; verificar nuevas representaciones Plus con entradas agrupadas.


## 2026-10-11 — SY-P-23 Lite: caracterización de bc por tokenización
- Se inspeccionó `src/engine/parsing/tokenize.ts`: variables multi-letra desconocidas se separan deliberadamente como identificadores de una letra (regla IN625 C10); `bc` no es variable nombrada genérica como en Plus. Lite no tiene panel equivalente de sustituciones en Científica.
- Nueva regresión Lite `tests/syntax309SyPConventionNumeric.audit.test.ts` commit `ee7f94e01c75e6c227132f11546add3d90f6b618`: `tokenize('a/bc')` debe generar a, /, b, c, y `parseExpression('a/bc')` coincide con `a/b*c` pero no con `a/(b*c)`. Esto caracteriza un contrato actual; no afirma que exista interpretación universal de texto ambiguo.
- Lite workflows disparados: build 38196914401, H1d 38196914448, acumulativo 38196914403, inicialmente en cola; verificar resultados antes de declarar PASS.
- Plus SHA 34734b232058b730be3c986c68773cea62755e6e tiene H1d 38195286920, cumulative 38195286916 y SG28 UI 38195286929 SUCCESS. La diferencia de semántica Lite/Plus es un pendiente de paridad/contrato, no un error matemático resuelto. SY-P-23 sigue OPEN y SG28 multi-host BLOCKED.


## 2026-10-11 — SY-P-23 Lite: fracción LaTeX y agrupación de denominador
- Lite commit ee7f94e01c75e6c227132f11546add3d90f6b618: cumulative 38196914403, H1d 38196914448, build 38196914401 completados SUCCESS; valida tokenización de a/bc en letras a, b, c separadas.
- Nueva prueba Lite `tests/syntax309SyPConventionNumeric.audit.test.ts`, commit 8646b965b9193f1bf44a0545af906a376dc321fa: `parseExpression(String.raw\`\\frac{a}{bc}\`)` debe coincidir con `parseExpression('a/(b*c)')` y producir 2 al reemplazar a=12, b=3, c=2. Este es contrato específico de fracción con denominador agrupado, no interpretación universal de a/bc ni variable bc nombrada.
- CI en curso sobre 8646b965: build 38197444104, cumulative 38197444071, H1d 38197444084. No contabilizar PASS de esta nueva prueba antes de verificación.
- Plus conserva interpretación bc nombrada en entrada específica textual o fracción, aprobada CI anterior; diferencia Lite/Plus sigue documentada. SY-P-23 global OPEN; SG28 multihost BLOCKED.
- Próximo paso: verificar logs del nuevo Lite cumulative; si falla, comparar normalización de fracción y ajustar oráculo según convención documentada, sin esconder discrepancia.


## 2026-10-11 — SY-P-23 Lite: corrección de oráculo LaTeX y recertificación
- Lite SHA 8646b965: build 38197444104 SUCCESS y H1d 38197444084 SUCCESS; cumulative 38197444071 FAILURE (1090 PASS, 1 FAIL, 30 TODO). Falló aserción textual `((a)/(b*c))` vs `a/(b*c)` en `tests/syntax309SyPConventionNumeric.audit.test.ts:99`; se trata de agrupación redundante del parser, no evidencia de discrepancia matemática.
- Publicado en Lite commit 9f2fc0d678f099fa9d0d95499f30d32cbeae54af: elimina igualdad textual frágil; verifica estructura b*c y equivalencia por evaluación numérica a 2 de fracción LaTeX y agrupación explícita. No altera el producto.
- Auto CI de Lite mismo SHA: cumulative 38198136978, H1d 38198136883, build 38198136988, IN_PROGRESS al consultar. No marcar PASS hasta verificación de logs y conclusión.
- Plus SHA 34734b232058b730be3c986c68773cea62755e6e: cumulative 38195286916, H1d 38195286920, SG28 UI 38195286929 SUCCESS.
- Siguiente paso exacto: verificar tres runs Lite del SHA 9f2fc0d y sus logs; si cumulative pasa, ampliar SY-P-23 para otras representaciones agrupadas sin suponer semántica compartida de variables compuestas. SY-P-23 global OPEN, SG28 multi-host BLOCKED.


## 2026-10-11 — SY-P-23: ampliación de regresión de agrupaciones LaTeX
- Lite commit 9f2fc0d678f099fa9d0d95499f30d32cbeae54af validado con cumulative 38198136978, H1d 38198136883 y build 38198136988: los tres SUCCESS; la corrección fue exclusivamente del oráculo textual.
- Nueva prueba numérica diferenciadora de agrupación explícita LaTeX `\\frac{a}{b}*c`→8 frente a `\\frac{a}{b*c}`→2 (a=12,b=3,c=2), añadida a `tests/syntax309SyPConventionNumeric.audit.test.ts` en Lite commit eef5d027381620b2be84274cc35537d5c5159f30. Esta fase amplía cobertura del contrato Lite sin definir universalmente a/bc ni copiar semántica de Plus.
- Auto CI Lite: cumulative 38199690970, H1d 38199691011, build 38199691057, inicialmente QUEUED. PENDIENTE verificar logs y outcomes de este SHA; no se reclama PASS prematuro.
- Próximo paso exacto: revisar tres corridas Lite de eef5d027 y corregir según capa si falla; luego comprobar paridad de agrupaciones explícitas en Plus, manteniendo diferencia documentada de identificadores compuestos. SY-P-23 OPEN; SG28 multihost BLOCKED.


## 2026-10-11 — SY-P-23: corrección de escape de nueva prueba
- Lite cumulative 38199690970 del SHA eef5d027381620b2be84274cc35537d5c5159f30 FAILURE: 1091 PASS, 1 FAIL, 30 TODO. El test nuevo enviaba `\\\\frac` (doble backslash efectivo en String.raw) y regex escapadas de más, provocando `Carácter no reconocido: "\\"`; clasificado como error de harness/test, no motor matemático. Build 38199691057 SUCCESS; H1d 38199691011 aún en progreso a la consulta.
- Publicado fix Lite SHA a63eb1456c4149f0a00cc0a523ea6327dae82d8f: `String.raw` con un solo backslash para `\\frac`, y expresiones regulares correctas para reemplazar variables. Aún SIN resultado CI de este nuevo SHA al registrar.
- Siguiente paso exacto: obtener las corridas correspondientes a a63eb145, verificar el acumulativo, H1d y build, y si hay fallo revisar test de agrupación `\\frac{a}{b}*c` vs `\\frac{a}{b*c}`; SY-P-23 OPEN, SG28 multihost BLOCKED.


## 2026-10-11 — SY-P-23: agrupación redundante y sombra de variable compuesta
- Lite SHA a63eb1456c4149f0a00cc0a523ea6327dae82d8f certificado mediante cumulative 38199756567, H1d 38199756566 y build 38199756600, todos SUCCESS. Pruebas LaTeX para `\\frac{a}{b}*c`=8 y `\\frac{a}{b*c}`=2 con valores a=12,b=3,c=2 aprobadas.
- Inspección Plus `backend/tests/test_syntax309_syp_interpretation.py`: ya existen pruebas de `(a/b)*c` y `a/(b*c)` y protección contra variable `bc` que opaque producto `b*c`; no duplicar indiscriminadamente oráculos existentes.
- Nueva regresión Plus SHA d8487f1ab8f09b885e337fdb32dadc318d1b16a5: misma semántica numérica para `a/(b*c)` y `((a)/(b*c))` aun con una variable compuesta `bc=99` coexistiendo con b=3,c=2; espera 2 en ambos. Cubre redundancia de paréntesis y sombra de variable compuesta mediante endpoint real. CI de este SHA pendiente de localizar y verificar: NO PASS todavía.
- Siguiente paso exacto: encontrar el gate acumulativo Plus del SHA d8487f1, comprobar resultados y corregir solo la capa demostrada; continuar cobertura SY-P-23 y documentar diferencias intencionales Lite/Plus. SY-P-23 OPEN; SG28 multihost BLOCKED.


## 2026-10-11 — SY-P-23 Plus: agrupación adicional de numerador y protección de bc
- Plus SHA d8487f1ab8f09b885e337fdb32dadc318d1b16a5: cumulative 38201537383 y H1d 38201537376 completed/SUCCESS. Se certifica acotadamente agrupación redundante de denominador `a/(b*c)` y `((a)/(b*c))` con bc nombrada sin afectar producto explícito.
- Nueva regresión Plus `backend/tests/test_syntax309_syp_interpretation.py` commit 9497663f533ca95aee52b16db6695ef83901f233: `(a/b)*c` y `(((a)/(b)))*c` deben producir 8 con sustituciones a=12, b=3, c=2 y bc=99; nunca absorber c en denominador ni sustituir `b*c` por bc. No altera motor ni cambia el XFAIL estricto del caso ambiguo.
- CI automática Plus de SHA 9497663: H1d 38202166537 y acumulativo 38202166540 inicialmente QUEUED. No registrar PASS hasta revisar logs y resultados.
- Siguiente paso exacto: verificar ambos workflows del SHA 9497663, clasificar cualquier fallo por capa, corregir y reejecutar; luego avanzar cobertura canal UI y reconciliación SY-P-23 con Lite. SY-P-23 global OPEN; SG28 multihost BLOCKED.


## 2026-10-11 — SY-P-23: paridad numérica de paréntesis redundantes Lite/Plus
- Plus SHA 9497663f533ca95aee52b16db6695ef83901f233: cumulative 38202166540 y H1d 38202166537 SUCCESS. La prueba protege (a/b)*c frente a paréntesis redundantes y variable bc explícita.
- Nuevo test de Lite `tests/syntax309SyPConventionNumeric.audit.test.ts` commit c73e61a81308d2bd536efd9b4a79edf1998cd337 verifica sobre el parser/evaluador real que `((a)/(b*c))`=2 y `(((a)/(b)))*c`=8, al sustituir a=12,b=3,c=2. Paridad matemática de agrupación explícita sin inventar bc como variable nombrada en Lite.
- Siguiente paso exacto: localizar corridas CI de Lite del SHA c73e61a, comprobar cumulative, H1d y build, corregir fallos y continuar pruebas UI canal MathLive si proceden. SY-P-23 OPEN; SG28 multihost BLOCKED.


## 2026-10-11 — SY-P-23 valores decimales y agrupación explícita
- Lite commit c73e61a81308d2bd536efd9b4a79edf1998cd337 verificado: cumulative 38202494901, H1d 38202494921 y build 38202494902, todos SUCCESS.
- Nueva prueba en Lite `tests/syntax309SyPConventionNumeric.audit.test.ts` commit 0b2505a205b816c57167c0d1f59f7d4047ddb8cd: a=9, b=3, c=2.5; `(a/b)*c`=7.5 y `a/(b*c)` / fracción LaTeX explícita =1.2. Evita depender solo de valores enteros; no declara semántica universal de `a/bc`.
- CI del SHA 0b2505 pendiente de comprobar (commit publicado). Próximo paso exacto: localizar cumulative/H1d/build de Lite para SHA 0b2505, revisar resultados y corregir test/parser según evidencia; luego añadir caso comparable de factor decimal en Plus. SY-P-23 OPEN; SG28 multihost BLOCKED.


## 2026-10-11 — SY-P-23 decimales: Lite aprobado y nueva paridad Plus
- Lite SHA 0b2505a205b816c57167c0d1f59f7d4047ddb8cd: cumulative 38203176477, H1d 38203176469, build 38203176452 todos completed/SUCCESS. Se acredita agrupación explícita `(a/b)*c`=7.5 y `a/(b*c)` / fracción LaTeX=1.2 con a=9,b=3,c=2.5.
- Nueva prueba de backend HTTP Plus en `backend/tests/test_syntax309_syp_interpretation.py` SHA 7f9b4fec9b012616afdd71fbae87520296b8c78b: `(a/b)*c`=7.5, `a/(b*c)` y `((a)/(b*c))`=1.2 con a=9,b=3,c=2.5 y bc=99. Protege producto explícito ante variable compuesta coexistente. No modifica motor ni XFAIL del ambiguo `a/bc`.
- CI Plus del SHA 7f9b4fe: pendiente de comprobación y evidencia; no marcar PASS de la prueba nueva hasta concluir el gate correspondiente.
- Siguiente paso exacto: consultar workflow acumulativo y H1d del SHA Plus 7f9b4fe, revisar jobs/logs, corregir según evidencia y extender cobertura UI SY-P-23. SY-P-23 OPEN; SG28 multihost BLOCKED.


## 2026-10-11 — SY-P-23 Plus: test E2E de agrupaciones decimales explícitas
- Plus SHA 7f9b4fec9b012616afdd71fbae87520296b8c78b validado: cumulative 38204597912 y H1d 38204598026 SUCCESS. Pruebas backend con a=9,b=3,c=2.5 y bc=99 acreditadas.
- Nueva regresión frontend real `frontend/e2e/in625-h1d-reentry.spec.ts` Plus commit 5ed05f4c8be2d355ef00f5ccd264345e4f07d5fb: expresiones `(9/3)*2.5`=7.5 y `9/(3*2.5)`=1.2 desde MathLive/UI, sin mostrar aviso de a/bc. No modifica el motor ni interpreta entrada ambigua automáticamente.
- Auto CI Plus: H1d 38205311838 y cumulative 38205311913 inicialmente QUEUED; ninguna aprobación de este nuevo test hasta revisar resultado. Lite mantiene gates verdes previos.
- Próximo paso exacto: consultar conclusiones y logs del H1d/cumulative Plus del SHA 5ed05f4, corregir discrepancias UI/MathLive/oráculo demostradas y continuar SY-P-23 sin declarar cierre; SG28 multihost BLOCKED.


## 2026-10-11 — SY-P-23 E2E decimal: formato racional exacto
- Plus SHA 5ed05f4c8be2d355ef00f5ccd264345e4f07d5fb: cumulative 38205311913 SUCCESS, H1d 38205311838 FAILURE. Log job 114667384154 indica `(9/3)*2.5` resultó `\\frac{15}{2}` frente a oráculo decimal `7.5`. Se clasificó como formato/oráculo, no error matemático: resultado correcto exacto.
- Se publicó fix del oráculo en `frontend/e2e/in625-h1d-reentry.spec.ts` SHA Plus 52a36dc53fc2ff904042255211881c9922bc380b: para los casos explícitos decimales requiere 7.5 o 15/2 en LaTeX, y 1.2 o 6/5 respectivamente; preserva alerta ausente y resultado real. No modifica producto.
- GitHub Actions disparados automáticamente sobre 52a36dc: H1d 38205648204, cumulative 38205648220, inicialmente QUEUED; NO certificar este SHA sin resultados.
- Siguiente paso exacto: verificar H1d y cumulative de Plus sobre SHA 52a36dc, diagnosticar cualquier fallo residual; luego continuar SY-P-23 en canal UI Lite y reconciliación de convenciones. SY-P-23 OPEN; SG28 multi-host BLOCKED.


## 2026-10-11 — SY-P-23: Lite E2E decimal de agrupaciones explícitas
- Plus SHA 52a36dc53fc2ff904042255211881c9922bc380b: H1d 38205648204 y cumulative 38205648220 completed/SUCCESS. La UI Plus admite resultado racional exacto `\\frac{15}{2}` para 7.5 y `\\frac{6}{5}` para 1.2 sin sacrificar el oráculo matemático.
- Publicada nueva regresión Lite `e2e/in625-h1d-reentry.spec.ts` commit 3d1560551da68ab5e4de3adf9ce7fab232f82ba2: `(9/3)*2.5` espera 7.5 o `\\frac{15}{2}`, y `9/(3*2.5)` espera 1.2 o `\\frac{6}{5}`. Verifica además ausencia del aviso de `a/bc`. Este es test de UI real y no modifica el motor.
- CI del último SHA Lite pendiente de verificar; no certificar PASS hasta jobs/logs.
- Siguiente paso exacto: localizar y analizar cumulative, H1d y build de Lite para SHA 3d156055; diagnosticar cualquier fallo y corregir sin debilitar criterios. SY-P-23 global OPEN; SG28 multihost BLOCKED.


## 2026-10-11 — SY-P-23 Lite: E2E decimal y paréntesis redundantes
- Lite SHA 3d1560551da68ab5e4de3adf9ce7fab232f82ba2: H1d 38205933326, cumulative 38205933348, build 38205933343 completed/SUCCESS. Quedó aprobada prueba UI de agrupación decimal explícita sin aviso falso.
- Publicado nuevo E2E Lite commit 0690d47592b063e0542a38b2f80d2ce6b1de0cdc en `e2e/in625-h1d-reentry.spec.ts`: comprueba `((9)/(3*2.5))` = 1.2 y `(((9)/(3)))*2.5` = 7.5 mediante UI; acepta fracciones exactas correspondientes y exige ausencia de aviso ambiguo. No cambia el motor.
- Siguiente paso exacto: comprobar gates automáticos cumulative/H1d/build del SHA 0690d475 y analizar cualquier fallo; continuar reconciliación SY-P-23 con Plus. SY-P-23 OPEN; SG28 multihost BLOCKED.


## 2026-10-11 — SY-P-23 paridad E2E con agrupaciones redundantes
- Lite SHA 0690d47592b063e0542a38b2f80d2ce6b1de0cdc: H1d 38207655199, cumulative 38207655164 y build 38207655170 completados SUCCESS; se aprueba E2E para `((9)/(3*2.5))`=1.2 y `(((9)/(3)))*2.5`=7.5 en UI Lite.
- Nueva regresión Plus en `frontend/e2e/in625-h1d-reentry.spec.ts` commit 19daac09e6f98d4429ceeca904bcfdd5b7efd46b: mismos casos desde MathLive, respuesta exacta o decimal, sin advertencia falsa de `a/bc`. No modifica motor.
- CI Plus para SHA 19daac09: H1d 38207857573 y cumulative 38207857516 inicialmente QUEUED. No contabilizar como PASS sin evidencia de conclusión.
- Siguiente paso exacto: revisar ambos runs de Plus sobre 19daac09, solucionar si hay FAIL de harness/UI/oráculo, y avanzar criterios pendientes de SY-P-23. SG28 multihost BLOCKED, SY-P-23 global OPEN.


## 2026-10-11 — Reconciliación de evidencia UI y criterios de salida
- Las advertencias SY-P-23 ya están implementadas en Científica Lite y Plus y cuentan con pruebas E2E que comprueban aparición con `a/bc`, desaparición con agrupaciones explícitas y preservación de entrada; no es correcto seguir afirmando en presente que la UI aún no tiene advertencia.
- Lite: agrupaciones decimales redundantes E2E aprobadas en SHA 0690d47592b063e0542a38b2f80d2ce6b1de0cdc, H1d 38207655199, cumulative 38207655164 y build 38207655170.
- Plus: agrupaciones decimales redundantes E2E aprobadas en SHA 19daac09e6f98d4429ceeca904bcfdd5b7efd46b, H1d 38207857573 y cumulative 38207857516.
- Criterio de aviso y pruebas discriminantes de interpretaciones explícitas tienen evidencia favorable; pendiente definir formalmente semántica universal de entrada ambigua y gestión de identificador compuesto bc frente a b*c sin sustituciones. El XFAIL estricto de lectura alternativa Plus permanece y no se convierte en PASS. No cerrar SY-P-23 ni SG28 multihost.


## 2026-10-11 — SY-P-23: bloqueo de ambigüedad no resuelta en UI Plus
- Implementación Plus: `frontend/src/components/BasicMode.tsx` SHA 941ae5a62011b0467f157d270f0bd61c5e3fa539. Si se introduce exactamente `a/bc` o `\\frac{a}{bc}` SIN sustitución no vacía `bc`, la UI exige definir bc o agrupar `(a/b)*c` / `a/(b*c)` antes de enviar al endpoint. Con bc definida, conserva el flujo existente de variable compuesta. No cambia backend, ni corrige XFAIL de variables separadas.
- Nueva prueba UI E2E Plus `frontend/e2e/in625-h1d-reentry.spec.ts` SHA 121914ba4320fa7bf4924f576e392fb4a10ddd9d comprueba ambas formas ambiguas, error accesible y que no salga solicitud POST `/evaluate`. Pendiente CI de los últimos cambios, NO PASS todavía.
- Alcance acotado: bloqueo solo para entrada completa exacta; no declarar un detector general de ambigüedad en toda expresión. Lite conserva advertencia y su convención parser; no imponer identificadores compuestos en Lite. SY-P-23 OPEN hasta validación CI + aceptación de la convención y extensión general; SG28 multihost BLOCKED.


## 2026-10-12 — SY-P-23: reanudación tras bloqueo de entrada ambigua
- Plus SHA 121914ba4320fa7bf4924f576e392fb4a10ddd9d: H1d 38209139811 y cumulative 38209139936 = SUCCESS. Protege `a/bc` y fracción LaTeX exacta sin bc definida: exige aclarar, sin POST `/evaluate`. La detección sigue acotada a esas formas completas.
- Nueva regresión UI Plus en `frontend/e2e/in625-h1d-reentry.spec.ts` commit f3f97d896fabd2edaac04ba616de1ace25c11735: tras bloquear `a/bc`, usuario introduce `(12/3)*2` y puede obtener 8, sin aviso de ambigüedad. Verifica que el bloqueo no inutiliza el flujo de cálculo explícito.
- Plus H1d 38237911465 y cumulative 38237911588 iniciados en CI, inicialmente IN_PROGRESS; pendiente confirmar resultado, no marcar verde preventivamente. Lite sin cambios funcionales en esta fase.
- Siguiente paso: revisar ambos gates y tratar cualquier fallo demostrado, luego expandir detección de ambigüedad de forma conservadora y con pruebas discriminantes. SY-P-23 OPEN; SG28 multihost BLOCKED.


## 2026-10-12 — SY-P-23 protección de paréntesis exteriores en Plus
- Commit Plus f3f97d896fabd2edaac04ba616de1ace25c11735 validado con H1d 38237911465 y cumulative 38237911588 SUCCESS: se puede recuperar y evaluar `(12/3)*2` tras bloqueo `a/bc`.
- Ampliación funcional Plus `frontend/src/components/BasicMode.tsx` commit 0322fff7980321860f96b9680b6270142452addd: también exige desambiguación para `(a/bc)` si `bc` no tiene sustitución; no reescribe parser ni altera casos agrupados. Cobertura E2E nueva `frontend/e2e/in625-h1d-reentry.spec.ts` commit 03408a40fdd7c2c00645f7831b39ec3f9e88227a verifica que no se envía POST `/evaluate` para `(a/bc)` sin `bc`.
- Nuevos runs automáticos Plus del SHA 03408a40: H1d 38238269445 y cumulative 38238269495 inicialmente QUEUED; revisar resultado antes de certificar. Alcance detector todavía acotado a formas específicas, no dar por completo SY-P-23. SG28 multihost sigue BLOCKED.


## 2026-10-12 — SY-P-23: bc definida y paréntesis exteriores en Plus
- Commit Plus 03408a40fdd7c2c00645f7831b39ec3f9e88227a: H1d 38238269445 y cumulative 38238269495 SUCCESS, confirmado el bloqueo de `(a/bc)` cuando bc no está definida.
- Nueva regresión de UI Plus `frontend/e2e/in625-h1d-reentry.spec.ts` commit 0131472e7b3a89ac8a741640ee8371ec23cff2a7: `(a/bc)` con sustituciones a=12, bc=6, b=3, c=2 debe devolver 2, demostrando que bc compuesta se mantiene aun con paréntesis externos. No cambia motor ni relaja XFAIL.
- Nuevos gates Plus H1d 38239078917 y cumulative 38239078947 IN_PROGRESS al consultar; resultados pendientes, no declarar PASS todavía. El objetivo siguiente es verificar logs, diagnosticar si el canal MathLive introduce separación de identificadores, corregir en capa pertinente. SY-P-23 OPEN y SG28 multihost BLOCKED.


## 2026-10-12 — SY-P-23: regresión con bc definido y paréntesis exteriores
- Plus cumulative run 38239078947 SUCCESS en SHA 0131472e; H1d run 38239078917 FAILURE: 20 PASS, 1 FAIL, en E2E `(a/bc)` con a=12, bc=6, b=3, c=2. Se observó 8, esperado 2. Clasificación: defecto de normalización UI (interpretación b*c), no fallo del motor ni de la referencia matemática.
- Corrección Plus publicada: commit `7935bda7e852889511d4c0589322c75f4a7f5ee7`, archivo `frontend/src/components/BasicMode.tsx`. Amplía exclusivamente el guard del identificador compuesto definido para admitir `(a/bc)`; conserva rechazo del caso sin bc definida y las agrupaciones explícitas.
- Acciones automáticas generadas por el push: Plus H1d `38244599384`, acumulativo `38244599396` y SG28 UI `38244599369`; inicialmente IN_PROGRESS. No declarar PASS del nuevo commit hasta comprobar su conclusión y logs.
- Lite: sin cambios de producto necesarios por esta corrección específica de Plus; mantener criterios funcionales de paridad y registrar excepción de convención de identificadores compuestos.
- Siguiente paso exacto: verificar H1d/acumulativo/SG28 UI en Plus SHA 7935bda; si H1d falla, inspeccionar payload enviado al endpoint para `(a/bc)` y corregir la capa confirmada; si pasa, continuar ampliación conservadora SY-P-23 y registrar evidencia bilateral. SY-P-23 OPEN; SG28 multihost BLOCKED.


## 2026-10-12 — SY-P-23: comprobar payload de bc parentetizada
- Se publicó Plus `7fe8b75ca5b9cb3c789475a8cb70e86a7ddb2c34` sobre la corrección funcional previa `7935bda7e852889511d4c0589322c75f4a7f5ee7`.
- Archivo: `frontend/e2e/in625-h1d-reentry.spec.ts`. Ahora exige también request POST `/evaluate` con `expression: a/bc` y sustituciones `{a:12, bc:6, b:3, c:2}` para entrada `(a/bc)`, antes de comprobar resultado 2. Evita falso PASS por igualdad accidental de resultados de otras interpretaciones.
- CI técnico Plus para 7fe8b75: H1d `38244778067` (IN_PROGRESS), cumulative `38244778168` (QUEUED) al consultar. SG28 UI `38244599369` corresponde al SHA anterior `7935bda`, no al test-only posterior.
- Las corridas anteriores H1d `38244599384` y cumulative `38244599396` del SHA `7935bda` seguían IN_PROGRESS al consultar. No se declara PASS nuevo sin conclusión.
- Próxima acción: verificar jobs y logs H1d/cumulative de 7fe8b75 y SG28 UI 7935bda; ante fallo corregir origen demostrado. SY-P-23 OPEN; SG28 multihost BLOCKED. No se alteró Lite funcionalmente.


## 2026-10-12 — SY-P-23: paréntesis redundantes balanceados
- Evidencia previa Plus: SHA 7fe8b75, H1d 38244778067 SUCCESS y cumulative 38244778168 SUCCESS; SG28 UI en SHA 7935bda run 38244599369 SUCCESS. Estos runs no cierran SG28 multihost.
- Corrección Plus `frontend/src/components/BasicMode.tsx` commit 88ddbfca83e09c3120a6333ac241a58d6beb4b02: desempaqueta únicamente paréntesis balanceados que envuelven toda la expresión; reconoce a/bc con bc definida o exige desambiguación cuando no está definida. No modifica el parser backend ni interpretaciones explícitas.
- Regresiones Plus `frontend/e2e/in625-h1d-reentry.spec.ts` commit 6657316709bbca2a5ef0f397ecc10b1f5b72d955: entradas ((a/bc)) y (((a/bc))) deben bloquear POST cuando bc no existe; con bc=6 y a=12, b=3, c=2 deben mandar expression a/bc y dar resultado 2.
- GitHub Actions nuevos SHA 665731670: H1d 38245250585 y cumulative 38245250562 inicialmente QUEUED. SHA intermedio 88ddbfca: H1d 38245192109, cumulative 38245192123, SG28 UI 38245192246 inicialmente IN_PROGRESS. No confundir SHAs ni contar PASS sin resultado final.
- Siguiente paso: verificar H1d y cumulative del SHA 665731670 y SG28 UI del SHA 88ddbfca, analizar fallos de MathLive o harness y corregir según evidencia. SY-P-23 OPEN; SG28 multihost BLOCKED. Lite no requiere cambio funcional para esta excepción particular de identificador compuesto Plus.


## 2026-10-12 — SY-P-23: fracción LaTeX con paréntesis externos
- Plus SHA 6657316709bbca2a5ef0f397ecc10b1f5b72d955: H1d 38245250585 SUCCESS y cumulative 38245250562 SUCCESS. SG28 UI run 38245192246 SUCCESS en SHA funcional previo 88ddbfca83e09c3120a6333ac241a58d6beb4b02; no confundir esto con SG28 multihost.
- Se añadió test E2E Plus para `(\\frac{a}{bc})` con y sin variable bc definida: el caso sin bc debe bloquear el POST; con a=12, bc=6, b=3 y c=2 debe enviar expression a/bc y devolver 2. Commit 17d86363a37718682df434b33335308897015a65, archivo frontend/e2e/in625-h1d-reentry.spec.ts. No hubo cambio del motor en este paso.
- H1d run 38245669432 de SHA 17d86363 fue creado en estado QUEUED. Confirmar conclusión y jobs/logs; buscar también el cumulative correspondiente al SHA. El test no se declara PASS antes de esa evidencia.
- Estado: SY-P-23 OPEN, SG28 multihost BLOCKED. Siguiente paso: verificar ambos gates y diagnosticar cualquier error del canal MathLive y del payload de fracciones parentetizadas; reforzar cobertura solo cuando exista evidencia.


## 2026-10-12 — SY-P-23: fracciones LaTeX con paréntesis anidados
- Plus SHA 17d86363a37718682df434b33335308897015a65: H1d 38245669432 SUCCESS y cumulative 38245669433 SUCCESS; valida el caso `(\\frac{a}{bc})` en UI con bc ausente/definida.
- Nueva regresión Plus `frontend/e2e/in625-h1d-reentry.spec.ts` commit `3f233f9dbc9cdfe4737a022a80ad570f03f288d0` cubre `((\\frac{a}{bc}))` y `(((\\frac{a}{bc})))`: sin bc exige error y ningún POST; con a=12, bc=6, b=3, c=2 exige payload `expression=a/bc` y resultado 2. No cambia el motor.
- H1d run 38246087850 se disparó por push, inicialmente QUEUED; revisar conclusión, logs y gate acumulativo del mismo SHA. No marcar PASS antes de verificarlo. SG28 multihost permanece BLOCKED y SY-P-23 OPEN.
- Siguiente paso exacto: verificar H1d y cumulative del SHA 3f233f9, corregir fallos de serialización/oráculo si aparecen, y reconciliar progresión y convenciones con Lite según contrato.


## 2026-10-12 — SY-P-23: prueba discriminante de agrupaciones explícitas con bc definida
- Plus SHA 3f233f9dbc9cdfe4737a022a80ad570f03f288d0: H1d 38246087850 SUCCESS y cumulative 38246087835 SUCCESS; fracciones LaTeX anidadas verificadas.
- Nuevo commit técnico Plus 60190f013ad6de79c0051d670f3b8d152e171650, archivo frontend/e2e/in625-h1d-reentry.spec.ts: prueba que con a=12, bc=6, b=3, c=2 las entradas ((a/b)*c) y ((a/(b*c))) no son reescritas a a/bc en el payload, mantienen sustituciones y producen respectivamente 8 y 2. No se modifica motor.
- Se requiere comprobar corridas H1d y cumulative sobre SHA 60190f, analizar errores con logs antes de PASS. SY-P-23 OPEN; SG28 multihost BLOCKED.
- Siguiente paso exacto: verificar ambos gates de 60190f y la semántica explícita de división; si un fallo demuestra error del producto o del harness, corregir la capa real, preservar contrato y actualizar evidencia bilateral.


## 2026-10-12 — SY-P-23: protección frente a falsos positivos de división numérica
- Plus SHA 60190f013ad6de79c0051d670f3b8d152e171650: H1d 38246460975 SUCCESS, cumulative 38246460880 SUCCESS. Valida distinción de agrupaciones explícitas con bc definida.
- Publicada regresión Plus `frontend/e2e/in625-h1d-reentry.spec.ts` commit daff340d92480153690ca2950b3c220593138872 para entradas numéricas `(12/3)*2`, `((12/3))*2`, `12/((3*2))` y `((12/(3*2)))`, sin aviso SY-P-23 y con resultados 8/8/2/2. Ajuste posterior del oráculo numérico (sin cambiar motor) commit 50ba0110bec5016614168979c428e04608e8f94e.
- Runs correspondientes al SHA final 50ba0110: H1d 38247059261, cumulative 38247059467, inicialmente QUEUED. Runs del SHA intermedio daff340d: H1d 38247034032, cumulative 38247034066, inicialmente IN_PROGRESS. La certificación debe basarse en el SHA final y sus logs.
- SY-P-23 OPEN y SG28 multihost BLOCKED. Siguiente paso: comprobar conclusión H1d/cumulative 50ba0110, clasificar cualquier rojo y continuar auditoría de casos discriminantes, sin concluir certificación global a partir de SUCCESS aislado.


## 2026-10-12 — SY-P-23: fracciones numéricas LaTeX y falsos positivos
- Plus SHA `50ba0110bec5016614168979c428e04608e8f94e`: H1d `38247059261` y acumulativo `38247059467` completados SUCCESS. Protege división numérica con paréntesis sin falso aviso.
- Nuevo test Plus en `frontend/e2e/in625-h1d-reentry.spec.ts`, commit `fd55b41a7a15e60f60ded48a6d3311bea7497306`: `(\\frac{12}{3})*2` debe devolver 8 y `(\\frac{12}{3*2})` debe devolver 2; ninguno debe mostrar advertencia de variable compuesta `bc`. Sin cambios al motor.
- CI automático nuevo SHA: H1d `38247671320`, acumulativo `38247671293`, inicialmente QUEUED. No declarar PASS sin conclusión de esos runs. SY-P-23 OPEN; SG28 multihost BLOCKED.
- Siguiente paso: comprobar conclusión y logs de estos dos gates, corregir cualquier fallo confirmado y avanzar al contrato SY-P-23 sin convertir casos puntuales en cierre global.


## 2026-10-12 — SY-P-23: reconciliación bilateral de criterios (sin cierre)
- Plus último cambio técnico `fd55b41a7a15e60f60ded48a6d3311bea7497306`: H1d `38247671320` SUCCESS y cumulative `38247671293` SUCCESS, ambos mismo SHA.
- Se inspeccionó cobertura real: Lite `e2e/in625-h1d-reentry.spec.ts` posee aviso informativo para `a/bc`, preservación de entrada, edición y agrupaciones numéricas/decimales; Plus `frontend/src/components/BasicMode.tsx` tiene bloqueo de envío cuando `bc` no está definida y reconocimiento acotado a denominador `bc` y numerador `a` con paréntesis exteriores balanceados; Plus E2E controla el payload para `bc` definida. Esta diferencia es de contrato de entrada, no paridad universal demostrada.
- Matriz de salida SY-P-23: (1) `(a/b)*c` y `a/(b*c)` explícitas: cobertura Plus y Lite; (2) `a/bc` sin definición: advertencia Lite, bloqueo Plus; requiere decisión/contrato de interpretación común; (3) `a/bc` con `bc` definida: cobertura endpoint Plus, capacidad equivalente Lite no acreditada; (4) otras variables compuestas (`xy`, `mn`) y `\\left(\\frac{a}{bc}\\right)`: NO acreditadas; (5) visualización y aviso para toda variante MathLive: NO acreditados por gates parciales.
- Decisión: NO cerrar SY-P-23 por SUCCESS del gate; NO copiar a Lite la política de identificadores compuestos de Plus sin revisar contrato de parser y matriz Syntax309. No activar ninguna bandera SG28 de producción. SG28 multihost sigue BLOCKED.
- Siguiente paso ejecutable: localizar el caso oficial SY-P-23 en las matrices Syntax309, fijar precedencia y semántica contractual de `bc` vs `b*c` para ambos motores, agregar una prueba discriminante bilateral basada en ese contrato; después ejecutar H1d y cumulative de los SHA técnicos correspondientes. Registrar PASS/BLOCKED diferenciadamente.


## 2026-10-12 — Revisión contractual de SY-P-23 tras validación de 38247671320 / 38247671293
- Se verificó en GitHub que Plus H1d `38247671320` y cumulative `38247671293` finalizaron SUCCESS sobre SHA técnico `fd55b41a7a15e60f60ded48a6d3311bea7497306`.
- La fuente oficial en ambos repositorios `qa/certification/syntax309_sy_p_cases.jsonl` establece para SY-P-23 (N2, `convencion`, `a/bc`) dos lecturas admitidas por convención declarada; NO prescribe universalmente una. Se comprobó la existencia de `qa/certification/SY_P_23_CONVENTION.md` en ambos proyectos; conservar ese contrato, no crear duplicados.
- Evidencia de implementaciones divergentes: Lite `tests/syntax309SyPConventionNumeric.audit.test.ts` demuestra tokens `a / b c` y equivalencia estructural con `a/b*c`; Plus `backend/tests/test_syntax309_syp_interpretation.py` conserva `bc` nombrada, y la lectura alternativa separada continúa `xfail(strict=True)`. Plus UI requiere bc definida o agrupación explícita en entradas exactas reconocidas. No son dos certificaciones de semántica universal iguales.
- Decisión: mantener SY-P-23 OPEN para paridad de convención y casos compuestos generales; SG28 multihost BLOCKED. No modificar parseadores ni transformar XFAIL en PASS sin autorización contractual y evidencia matemática. Próximo paso ejecutable: añadir cobertura de paridad centrada en salida/aviso y en las entradas con valores discriminantes para las convenciones reales; verificar Syntax309 y cumulative por motor antes del cierre.


## 2026-10-12 — SY-P-23: paridad de fracciones LaTeX explícitas en UI Lite
- Matriz oficial `qa/certification/syntax309_sy_p_cases.jsonl` verificada bilateralmente: SY-P-23 N2 exige convención declarada para `a/bc`, no una lectura universal. Plus último SHA técnico `fd55b41a7a15e60f60ded48a6d3311bea7497306`: H1d `38247671320` SUCCESS y cumulative `38247671293` SUCCESS.
- Nueva prueba Lite `e2e/in625-h1d-reentry.spec.ts`, commit `faf7bf1f30a8c2d05ef38a955db9f5fe751a694d`: confirma mediante UI real `(\\frac{12}{3})*2` = 8 y `(\\frac{12}{3*2})` = 2, sin falso aviso `a/bc`. Misma propiedad observable previamente validada en Plus; no se altera parser.
- CI automática Lite en SHA faf7bf1f: H1d `38271843361`, cumulative `38271843321`, build `38271843282`, inicialmente IN_PROGRESS; resultados pendientes, NO PASS aún.
- SY-P-23 OPEN: no se ha certificado aún la convención general compartida para letras contiguas ni resuelto el XFAIL estricto de Plus. SG28 multihost BLOCKED.
- Siguiente paso exacto: revisar conclusiones y logs de las tres corridas Lite SHA faf7bf1f; corregir fallo de oráculo/harness/producto demostrado y registrar resultado. Después avanzar casos discriminantes de mensajes y salida para entradas ambiguas de ambos motores.


## 2026-10-12 — SY-P-23 Lite: aviso MathLive parentetizado y agrupaciones explícitas
- Lite SHA técnico faf7bf1f30a8c2d05ef38a955db9f5fe751a694d: H1d 38271843361, cumulative 38271843321 y build 38271843282 completados SUCCESS.
- Nuevo cambio técnico Lite e2e/in625-h1d-reentry.spec.ts commit 79a1bf93cd6ec8253d8e57c1e48592d6f886005e: prueba aviso accesible ante `(a/bc)`, `((a/bc))`, `(\\frac{a}{bc})`, conservación exacta del valor MathLive y ausencia de aviso para `(a/b)*c`, `a/(b*c)` y `((a/(b*c)))`. Protege la política informativa existente de Lite; no transforma la expresión ni modifica parser.
- GitHub Actions SHA 79a1bf93: H1d 38274443504, acumulativo 38274443523, build 38274443477, todos IN_PROGRESS en última consulta. No declarar PASS hasta conclusión y logs verificados.
- Próximo paso: verificar esas tres corridas y corregir cualquier fallo demostrado. Después comparar el aviso entre Lite y Plus y decidir brecha contractual, sin debilitar el XFAIL de Plus. SY-P-23 OPEN; SG28 multihost BLOCKED.


## 2026-10-12 — SY-P-23: paridad bilateral de advertencias MathLive parentetizadas
- Lite SHA técnico `79a1bf93cd6ec8253d8e57c1e48592d6f886005e`: H1d `38274443504`, cumulative `38274443523` y build `38274443477` = SUCCESS, verificados directamente por SHA.
- Plus incorporó test homólogo en `frontend/e2e/in625-h1d-reentry.spec.ts`, commit `b4df99c70a9238216aadc4e5b0324d40cbe19813`: comprueba advertencia visible sin reescritura MathLive para `(a/bc)`, `((a/bc))` y `(\\frac{a}{bc})`; desaparece con `(a/b)*c`, `a/(b*c)` y `((a/(b*c)))`. Sin cambios en parser ni UI.
- GitHub Actions Plus en SHA b4df99c70: H1d `38277095820` y cumulative `38277095768` fueron creados (QUEUED en la consulta). No declarar PASS antes de verificar conclusiones y logs.
- Diferencia persistente: Lite advertencia informativa; Plus puede bloquear POST para entrada completa ambigua si falta bc. SY-P-23 OPEN y SG28 multihost BLOCKED; no contar paridad total por alertas coincidentes.
- Próxima acción: comprobar ambos gates Plus de b4df99c70, diagnosticar cualquier fallo real y avanzar cobertura de aviso/validación en entrada extendida, según matriz oficial.


## 2026-10-12 — SY-P-23: ambigüedad dentro de expresiones extendidas (E2E bilateral)
- Plus SHA anterior b4df99c70a9238216aadc4e5b0324d40cbe19813: H1d 38277095820 y cumulative 38277095768 SUCCESS, comprobados por GitHub.
- Nuevos tests E2E bilaterales: Plus frontend/e2e/in625-h1d-reentry.spec.ts commit ebec72aa9e8f9fc2cffb3ab3b0d0976890d96f09; Lite e2e/in625-h1d-reentry.spec.ts commit 17d6161439ba02017329ec6013da20274502e39a. Comprueban aviso y conservación exacta de MathLive para `1+a/bc`, `2*(a/bc)` y `a/bc+3`; ausencia de aviso para `1+(a/b)*c`, `2*(a/(b*c))`, `a/(b*c)+3`. No cambian motores ni contratos.
- CI de Plus SHA ebec72aa: H1d 38280397277 y cumulative 38280397315 IN_PROGRESS. Lite SHA 17d61614: build 38280406600 IN_PROGRESS, H1d 38280406666 y cumulative 38280406591 QUEUED en consulta. No declarar PASS de tests nuevos hasta finalizar y revisar fallos.
- SY-P-23 OPEN: aviso no es equivalente a bloqueo del POST para expresiones más largas; ese flujo de evaluación sigue pendiente de contrato. SG28 multihost BLOCKED.
- Próximo objetivo: verificar las cinco corridas, analizar fallos de los tests de aviso y resolver detección de falsas alarmas según evidencia; ampliar después bloqueo/evaluación de entradas compuestas extendidas si el contrato lo requiere.


## 2026-10-12 — SY-P-23: bloquear POST ambiguo en expresiones extendidas (Plus)
- Cinco gates previos verificados SUCCESS: Plus H1d 38280397277, cumulative 38280397315 SHA ebec72aa; Lite H1d 38280406666, cumulative 38280406591, build 38280406600 SHA 17d61614.
- Plus `frontend/src/components/BasicMode.tsx`: guardia acotada detecta `a/bc` o `\\frac{a}{bc}` sin sustitución bc incluso dentro de expresiones mayores, en vez de mostrar solo una advertencia y enviar interpretación no declarada. Corrección técnica final SHA 4bb5d22273300197bf8590296771c7a15e1af042 (SHA previo de edición 2b20706a sustituido por ajuste de escapes); no se cambia parser backend.
- Plus prueba permanente en `frontend/e2e/in625-h1d-reentry.spec.ts`, SHA b8815fe399eaae3721cbf9daa4457e74c0b29acd: `1+a/bc`, `2*(a/bc)` y `a/bc+3` sin bc deben impedir POST `/evaluate` y mostrar desambiguación. No se impone política de Plus a Lite.
- CI Plus último SHA b8815fe: H1d 38287488895 y cumulative 38287488771 IN_PROGRESS al consultar; SG28 UI SHA funcional anterior 4bb5d22: 38287467750 IN_PROGRESS. Ningún PASS nuevo hasta conclusión.
- Estado SY-P-23 OPEN, SG28 multihost BLOCKED. Siguiente acción: verificar jobs/logs de los gates SHA b8815fe; reparar fallos demostrados y añadir casos negativos de identificadores ajenos si corresponde.


## 2026-10-12 — SY-P-23: regresión de fronteras de identificadores
- Se verificaron Plus H1d `38287488895` y cumulative `38287488771` SUCCESS para SHA `b8815fe399eaae3721cbf9daa4457e74c0b29acd`; SG28 UI `38287467750` SUCCESS para SHA `4bb5d22273300197bf8590296771c7a15e1af042` (no es prueba multihost).
- Nueva prueba E2E Plus `frontend/e2e/in625-h1d-reentry.spec.ts`, commit `912b1db3f0cb188dd64d267a26976b1d1bd7f969`: entradas `aa/bc`, `a/bcd`, `xa/bc`, `a/bcx` NO deben mostrar aviso ni error específico `SY-P-23: define la variable bc...`; preserva delimitación de identificadores. No se altera el motor.
- GitHub Actions en SHA 912b1db3: H1d `38288711373` y cumulative `38288711377`, inicialmente QUEUED. No declarar PASS antes de observar conclusión. Lite sin cambios funcionales en esta prueba acotada Plus.
- SY-P-23 OPEN; SG28 multihost BLOCKED. Siguiente paso: verificar estos dos gates, revisar logs ante FAIL y corregir según su causa. Si pasan, evaluar ambigüedad en subexpresiones LaTeX con identificadores vecinos y discrepancia declarada Lite/Plus.

 
## 2026-10-12 — SY-P-23: frontera de tokens LaTeX, continuación verificada
- Plus SHA 912b1db3f0cb188dd64d267a26976b1d1bd7f969: H1d 38288711373 SUCCESS y acumulativo 38288711377 SUCCESS (jobs backend/frontend PASS). Lite SHA 17d6161439ba02017329ec6013da20274502e39a: H1d 38280406666 SUCCESS.
- Plus: nueva prueba permanente de identificadores vecinos en fracciones LaTeX y subexpresiones extendidas, archivo frontend/e2e/in625-h1d-reentry.spec.ts, commit 4d772d156d274ac764566b873f9e261fff59b6c3. Prueba que aa/bc, a/bcd, xa/bc y a/bcx, también con \\frac y contexto aritmético, no generen advertencia ni validación SY-P-23 y mantengan MathLive. Sin cambios en motor, parser o políticas de Lite.
- Nuevas corridas automáticas Plus SHA 4d772d15: H1d 38289477109 y acumulativo 38289477051, ambas QUEUED en consulta inicial, resultado aún NO VERIFICADO.
- SY-P-23 continúa OPEN por convención compartida y XFAIL estricto; SG28 multihost continúa BLOCKED. Próximo objetivo: verificar los dos nuevos gates en el SHA exacto, diagnosticar fallos si existen y ampliar pruebas semánticas de variantes agrupadas sin equiparar warning Lite con bloqueo Plus.


## 2026-10-12 — SY-P-23: evaluación numérica de fracciones compuestas
- Plus SHA 4d772d156d274ac764566b873f9e261fff59b6c3: H1d 38289477109 SUCCESS; cumulative 38289477051 SUCCESS (backend y frontend), verificados en GitHub.
- Plus añadió test E2E permanente de resultado matemático real para cuatro variantes de fracciones LaTeX numéricas con agrupación explícita y contexto aritmético; archivo frontend/e2e/in625-h1d-reentry.spec.ts, commit fe1d2c1ecaf9c5a2e176936743670b05bf783fc4. No debe aparecer aviso SY-P-23 y se exige el valor numérico correcto (3, 8, 5, 9). Sin cambios en UI, parser o motor.
- CI automática Plus SHA fe1d2c1: H1d 38290056699 y cumulative 38290056657, inicialmente QUEUED. No declarar PASS hasta obtener conclusión y jobs.
- SY-P-23 OPEN: pendiente convención compartida de identificadores contiguos y XFAIL estricto; SG28 multihost BLOCKED. Siguiente paso: revisar jobs/logs en SHA fe1d2c1 y corregir cualquier regresión demostrada antes de ampliar cobertura.


## 2026-10-12 — SY-P-23 resultado de fracción numérica: fallo H1d y diagnóstico
- Plus SHA fe1d2c1ecaf9c5a2e176936743670b05bf783fc4: H1d 38290056699 FAILURE (34 PASS, 1 FAIL con retry); cumulative 38290056657 SUCCESS, jobs backend y frontend. Primera expresión 1+\\frac{12}{3*2}: Number(canonical(output.value)) dio NaN aunque readOutcome devolvió kind=result. Esto no prueba valor matemático incorrecto: la salida original no se incluía en assertion.
- Corrección acotada del oráculo E2E Plus frontend/e2e/in625-h1d-reentry.spec.ts: reconoce fracciones exactas enteras mediante conversión numérica y en cualquier fallo adjunta valor crudo y normalizado para distinguir problema de producto vs formato. No se cambia motor ni parser; se sigue exigiendo resultado esperado 3/8/5/9.
- Commit técnico Plus fb20e144967dc9f32d619d83bc971c489ef30799; Actions H1d 38290470544 y cumulative 38290470553, inicialmente QUEUED. Verificar conclusions/jobs/logs de ambos en ese SHA; si H1d continúa FAIL, inspeccionar el valor real registrado y corregir SOLO capa demostrada.
- SY-P-23 OPEN y SG28 multihost BLOCKED. No certificar esta nueva regresión antes de comprobar CI.

## 2026-10-12 — SY-P-23: corrección LaTeX mal escapado en test E2E
- Plus SHA fb20e144: H1d 38290470544 FAILURE, cumulative 38290470553 SUCCESS. El log mostró 34 PASS, 1 FAIL y salida `6 a c_{12} f r + 1` causada por cuatro comandos String.raw con doble barra invertida (harness).
- Se corrigieron cuatro valores de entrada LaTeX en Plus frontend/e2e/in625-h1d-reentry.spec.ts, commit 018c1489b5e27050e274ef530a7bf5bb6b440dfd. Oráculo numérico sigue exigiendo 3, 8, 5, 9; no se tocó motor ni parser.
- CI nueva Plus para SHA 018c1489: H1d 38290844352 y cumulative 38290844430 en progreso en primera consulta. No declarar PASS sin evidencia final.
- SY-P-23 OPEN; SG28 multihost BLOCKED. Próximo objetivo: inspeccionar resultados y logs de ambos gates en este SHA antes de ampliar la matriz.

## 2026-10-12 — SY-P-23: estabilidad de evaluación repetida
- Plus SHA 018c1489b5e27050e274ef530a7bf5bb6b440dfd: H1d 38290844352 SUCCESS; cumulative 38290844430 SUCCESS (backend/frontend). Se confirmó corrección del escape LaTeX en CI.
- Nuevo test Playwright Plus: repetir dos veces la evaluación del mismo LaTeX numérico explícito y comparar resultados, sin advertencia falsa; commit técnico 4d58281e462d92dcfa33f5abe84b13a9091d6452 en frontend/e2e/in625-h1d-reentry.spec.ts. No se cambian parser ni motores.
- Nuevos CI Plus SHA 4d58281e: H1d 38291245207 y cumulative 38291245267, QUEUED en consulta. Falta verificar conclusión y logs.
- SY-P-23 continúa OPEN por convención entre identificadores y XFAIL estricto; SG28 multihost BLOCKED. Siguiente paso concreto: verificar ambas corridas del SHA 4d58281e, diagnosticar regresiones y abordar XFAIL de contrato con evidencia independiente.

## 2026-10-12 — SY-P-23: evidencia semántica backend para contextos aritméticos
- Plus SHA 4d58281e462d92dcfa33f5abe84b13a9091d6452: H1d 38291245207 SUCCESS; cumulative 38291245267 SUCCESS, jobs frontend/backend.
- Inspección XFAIL: backend/tests/test_syntax309_syp_interpretation.py contiene @pytest.mark.xfail(strict=True) para evaluar a/bc con sustituciones a,b,c sin variable bc. Continúa siendo un conflicto de convención del contrato; no se retiró ni reinterpretó como PASS.
- Plus añadió seis test cases parametrizados del endpoint real con subexpresiones agrupadas explícitas en contextos aritméticos (sumas y productos) y variable bc sombra definida. Esperados matemáticos independientes 9,3,16,4,11,5. Archivo backend/tests/test_syntax309_syp_interpretation.py, commit 6d0755147f8928192112c73dbebd7198ef701a18.
- CI Plus SHA 6d075514: H1d 38291827066 y cumulative 38291827067 inicialmente QUEUED. No declarar PASS hasta concluir y revisar jobs/logs; comprobar que el acumulativo ejecutó realmente la prueba backend.
- SY-P-23 OPEN, SG28 multihost BLOCKED. Próximo paso: verificar ambos gates exactos, inspeccionar si el acumulativo incluye test_syntax309_syp_interpretation.py; de no incluirlo, ejecutar un gate específico adecuado sin confundir éxito de workflow con cobertura de estos seis casos.

## 2026-10-12 — SY-P-23: evidencias CI y extensión de bc definida
- Plus SHA 6d0755147f8928192112c73dbebd7198ef701a18: H1d 38291827066 SUCCESS; cumulative 38291827067 SUCCESS. Log backend job 114953494947: 862 passed, 1 xfailed; seis casos nuevos test_syp_23_compound_context_preserves_explicit_grouping_with_bc_shadow pasaron individualmente. XFAIL estricto test_syp_23_separate_b_c_substitutions_pending persiste sin modificar.
- Nuevo commit técnico Plus 1c2b8a3ffb4dbd0b1aa7fbf34caf33f3fec24acd agrega tres casos backend para 1+a/bc, 2*(a/bc) y a/bc+3 con bc explícita 6 además de b=3,c=2: exige 3,4,5 y protege semántica del identificador compuesto en contexto aritmético.
- CI disparada automáticamente para SHA 1c2b8a3f: H1d 38292882821 y cumulative 38292882817, inicialmente QUEUED. Solo la evidencia posterior del job backend permitirá afirmar PASS de los tres nuevos casos.
- SY-P-23 OPEN: convención de división sin variable bc sigue XFAIL; SG28 multihost BLOCKED. Siguiente objetivo: comprobar ambas corridas nuevas y sus logs y preservar la distinción entre bc definida, bc no definida y agrupaciones explícitas sin alterar parser injustificadamente.

## 2026-10-12 — SY-P-23: paréntesis exteriores con bc definida
- Plus commit anterior 1c2b8a3ffb4dbd0b1aa7fbf34caf33f3fec24acd: H1d 38292882821 SUCCESS y cumulative 38292882817 SUCCESS. Backend job 114956922147 confirmó 865 passed, 1 xfailed y tres casos nuevos individualmente PASS.
- Nuevo commit técnico Plus f412cd427b0226fcf54cfe11324cc04bf4d8713a en backend/tests/test_syntax309_syp_interpretation.py: tres variantes con paréntesis exteriores y bc definida simultáneamente con b y c, esperados 3, 4 y 5. XFAIL estricto no alterado.
- CI automática Plus SHA f412cd42: H1d 38295821311 y acumulativo 38295821318 QUEUED en consulta inicial. Comprobar resultados y log backend para acreditar ejecución de los tres nuevos casos.
- SY-P-23 OPEN y SG28 multihost BLOCKED. Próximo paso: verificar estos gates y seguir con convención de identificadores sin eliminar el XFAIL artificialmente.

## 2026-10-12 — SY-P-23: bc independiente de b*c en contextos extendidos
- Plus SHA f412cd427b0226fcf54cfe11324cc04bf4d8713a: H1d 38295821311 SUCCESS y cumulative 38295821318 SUCCESS. Log backend job 114966518741: 868 passed, 1 xfailed; tres casos de paréntesis exteriores individualmente PASSED.
- Nuevo commit técnico Plus 02dc6bfcc5418a86b01523c12cafa3767a9656ca: tres pruebas backend de `1+a/bc`, `2*(a/bc)` y `a/bc+3`, con bc=4 independiente de b*c=6; oráculos independientes 4/6/6. Archivo backend/tests/test_syntax309_syp_interpretation.py. No altera parser, motor ni XFAIL.
- CI Plus SHA 02dc6bfc disparado: H1d 38296248718 y cumulative 38296248713 QUEUED en primera consulta. Comprobar que los tres nuevos casos se ejecutan en job backend antes de acreditarlos.
- SY-P-23 OPEN: XFAIL de a/bc sin bc definida permanece legítimo. SG28 multihost BLOCKED; no activar aislamiento en producción. Próximo objetivo: analizar ambos gates y continuar la decisión contractual evitando microtests repetidos sin justificación.

## 2026-10-12 — SY-P-23: CI cerrada para bc independiente y contrato bilateral formalizado
- Plus SHA 02dc6bfcc5418a86b01523c12cafa3767a9656ca: H1d 38296248718 SUCCESS y cumulative 38296248713 SUCCESS (backend/frontend). Job backend 114967928868: 871 passed, 1 xfailed; los tres casos de independencia bc != b*c pasaron individualmente.
- Se añadió una sección contractual a qa/certification/SYNTAX309_EXECUTION_MATRIX.md en ambos repositorios: conserva la alternativa oficial ac/b o a/(bc), distingue comportamiento Plus demostrado de convención bilateral aprobada, y exige decisión de paridad UI/API antes de cierre. Commits Plus 93fd2bf216bb0364f53ed783459142333a6d081f, Lite baada47e3b1a9c4272544c0834da1308309f8c70.
- No se modificaron parsers ni tests funcionales; este cambio exclusivamente documental no requiere relanzar CI. El XFAIL estricto continúa como límite explícito; SY-P-23 OPEN, SG28 multihost BLOCKED.
- Siguiente objetivo: establecer convención de identificadores concatenados y división de forma compartida, resolver la política advertir/bloquear Lite/Plus mediante pruebas de contrato antes de levantar el XFAIL, sin desplegar cambios de SG28.

## 2026-10-12 — SY-P-23: alineación inicial de bloqueo Lite/Plus para bc indefinida
- Se confirmó divergencia: Plus bloqueaba evaluación ambigua no definida mientras Lite solo advertía antes de evaluar. Lite no expone una tabla de sustituciones de bc en el módulo Científica examinado.
- Lite src/modes/BasicScientific/BasicScientificMode.tsx ahora rechaza a/bc ambiguo y expresiones extendidas, mediante fail(ErrorCode.PARSE_ERROR), antes de enviar el trabajo al motor, con indicación de escribir (a/b)*c o a/(b*c). Commit técnico Lite 4091e107dc96b9042659cc3cf9e089c13d462890.
- Lite e2e/in625-h1d-reentry.spec.ts agrega regresión con a/bc, 1+a/bc y fracción LaTeX: advertencia accesible, error SY-P-23 y valor MathLive preservado. Commit 5c8e16976a411c4e54b9cd0b90efc8da459b8984.
- CI Lite SHA 5c8e1697: H1d 38297110216, cumulative 38297110215, build 38297110206 QUEUED al consultar. Comprobar además SG28 activado por cambio funcional SHA anterior 4091e107 (run 38297071506). No certificar la nueva política hasta analizar resultados E2E y acumulativos.
- Contrato SY-P-23 permanece OPEN: paridad parcial en bc indefinida; todavía no se ha resuelto regla general de identificadores contiguos, XFAIL de alternativa ac/b ni paridad con variables definidas. SG28 multihost BLOCKED.

## 2026-10-12 — SY-P-23: bloqueo Lite verificado y fronteras de identificador
- Lite SHA 5c8e16976a411c4e54b9cd0b90efc8da459b8984: H1d 38297110216 SUCCESS, cumulative 38297110215 SUCCESS. Log H1d job 114970732945: 17 passed, incluido test SY-P-23 Lite `la ambigüedad detiene cálculo sin alterar MathLive` PASSED.
- Nueva prueba E2E Lite sobre identificadores vecinos (aa/bc, a/bcd, xa/bc, a/bcx y extensiones) que exige ausencia de advertencia/bloqueo específico SY-P-23; commit b0c65a467452fe433515a5e0468019adf3985499, archivo e2e/in625-h1d-reentry.spec.ts. No se tocó motor/parser.
- CI automática Lite SHA b0c65a: H1d 38297627578, cumulative 38297627586 y build 38297627588, inicialmente QUEUED. Pendiente verificar resultado y logs en SHA exacto.
- SY-P-23 OPEN por convención general de concatenación y XFAIL Plus; SG28 multihost BLOCKED. Próximo objetivo: comprobar tres gates Lite y clasificar fallos por producto/harness/oráculo.

## 2026-10-12 — SY-P-23 Lite: recuperación después del bloqueo
- Lite SHA b0c65a467452fe433515a5e0468019adf3985499: H1d 38297627578 SUCCESS (18/18 Playwright, incluida prueba de identificadores vecinos) y acumulativo 38297627586 SUCCESS.
- Nueva regresión funcional Lite `e2e/in625-h1d-reentry.spec.ts`: después de rechazar a/bc, comprobar cálculo exitoso de (12/3)*2=8 y 12/(3*2)=2; commit d6792d00c44c64a65dd960442fde610e939250cd. No se altera parser/motor.
- CI Lite SHA d6792d00: H1d 38298082148, acumulativo 38298082176, build 38298082395, IN_PROGRESS al consultar. No declarar PASS sin resultados completos.
- SY-P-23 OPEN por convención general y XFAIL Plus. SG28 multihost BLOCKED. Próximo paso: verificar tres gates y confirmar recuperación en log H1d.

## 2026-10-12 — SY-P-23: diagnóstico de flaky al recuperar tras bloqueo
- Lite SHA d6792d00c44c64a65dd960442fde610e939250cd: H1d 38298082148 SUCCESS y cumulative 38298082176 SUCCESS. Sin embargo, log H1d 114973956644 registró primer intento FALLIDO en recuperación (esperaba result para (12/3)*2, recibió error), retry PASSED; 18 passed y 1 flaky. No clasificar esto como prueba estable.
- Se identificó riesgo de que el helper submit() interprete un alert anterior como respuesta a la petición nueva; el log no prueba por sí solo un fallo del motor. Se cambió solo la prueba de recuperación para esperar un status con request-id tras hacer click, antes de leer el resultado; commit Lite 802879171d8ba1596c31f28d4fb7fc0b7467da17. Sigue exigiendo 8 y 2, sin relajar el oráculo.
- CI Lite SHA 80287917: H1d 38298622842, cumulative 38298622859, build 38298622743 inicialmente QUEUED. Pendiente comprobar los resultados y el log H1d para verificar ausencia de flaky.
- SY-P-23 OPEN por contrato general y XFAIL Plus, SG28 multihost BLOCKED. Siguiente objetivo: diagnosticar y corregir si el nuevo gate aún reproduce race/error real.

## 2026-10-12 — SY-P-23: estabilidad H1d y requisito de request-id nuevo
- Lite SHA 802879171d8ba1596c31f28d4fb7fc0b7467da17: H1d 38298622842 SUCCESS (19 passed, sin retries), acumulativo 38298622859 SUCCESS y build 38298622743 SUCCESS. Recuperación tras bloqueo SY-P-23 confirmó PASS individual.
- Auditoría del nuevo oráculo E2E detectó una debilidad: esperaba request-id no vacío, pero podía aceptar un request-id antiguo. Commit Lite 52a25c9be8f627dcf90dab28391f40783614648a exige request-id distinto al previo para el cálculo posterior al error, manteniendo verificación matemática 8/2.
- Gates nuevos Lite SHA 52a25c9: H1d 38299092558, cumulative 38299092743, build 38299092512, inicialmente QUEUED. Verificar que pasan sin retries.
- SY-P-23 OPEN y SG28 multihost BLOCKED. No atribuir estabilidad permanente a una sola corrida.

## 2026-10-12 — SY-P-23: corregir timeout en la prueba de request-id posterior a error
- Lite SHA 52a25c9be8f627dcf90dab28391f40783614648a: H1d 38299092558 FAILURE (18 passed, 1 failed, también falló retry), cumulative 38299092743 SUCCESS, build 38299092512 SUCCESS. El log H1d job 114977326569 muestra timeout 30 s previo a click, provocado por getAttribute en locator inexistente tras error bloqueado.
- Corrección de prueba Lite commit 190ed5ac528d939fc1d2e8c14bfafbc77b86f971: usar locator.count() antes de consultar ID anterior; null cuando no existe, y exigir ID no vacío nuevo tras evaluación. No se modificó producto ni oráculos (8 y 2).
- CI SHA 190ed5ac: H1d 38299836244, cumulative 38299836203, build 38299836197 inicialmente QUEUED. Próximo objetivo: validar que H1d pasa sin retry y que resultado nuevo es realmente diferente del anterior.
- SY-P-23 OPEN y SG28 multihost BLOCKED.

## 2026-10-12 — SY-P-23: H1d Lite restablecido, evidencia del SHA corregido
- Se verificó el SHA técnico Lite `190ed5ac528d939fc1d2e8c14bfafbc77b86f971` en GitHub Actions: H1d [38299836244](https://github.com/c2melendez/precision-lab-lite/actions/runs/38299836244) SUCCESS (job 114979782474, **19 passed, sin flaky/retry**); acumulativo [38299836203](https://github.com/c2melendez/precision-lab-lite/actions/runs/38299836203) SUCCESS (job 114979782600); build [38299836197](https://github.com/c2melendez/precision-lab-lite/actions/runs/38299836197) SUCCESS (job 114979783041).
- El test `SY-P-23 Lite: tras bloquear ambigüedad se recupera evaluación explícita` pasó individualmente. Exige request-id nuevo y valores matemáticos 8 y 2. La causa del fallo previo fue harness/oráculo (consulta getAttribute sobre locator inexistente) y se resolvió con count() antes de leer ID. No se cambió el motor.
- La corrida Plus aportada [38247671320](https://github.com/c2melendez/precision-lab-plus/actions/runs/38247671320) fue SUCCESS en H1d, **no equivale a un gate acumulativo del HEAD Plus**.
- SY-P-23 continúa **OPEN**: decisión contractual bilateral de identificadores concatenados/división, posible lectura ac/b, paridad de identificadores definidos/no definidos y XFAIL estricto Plus sin levantar. SG28 multihost permanece **BLOCKED**.
- **Siguiente paso exacto:** revisar `qa/certification/SYNTAX309_EXECUTION_MATRIX.md`, fixture `syntax309_sy_p_cases.jsonl`, `backend/tests/test_syntax309_syp_interpretation.py` y pruebas E2E de ambas UIs; establecer política general de nombres concatenados y lectura ac/b frente a a/(bc), con evidencia de oráculo y canal por separado. No reinterpretar el XFAIL ni activar aislamiento SG28 en producción.

## 2026-10-12 — SY-P: contrato de identificadores publicado
- La matriz bilateral fue actualizada en Lite (a82d8fa25d1be7c4759e6a2624011193f9250275) y Plus (ded6d83b71a0c6e2c155ecbca4b37da2f6fdea98). Conserva los casos SY-P-24 xy=x*y, SY-P-25 xyz=x*y*z y la ambigüedad SY-P-23 sin reinterpretar el XFAIL.
- SY-P-23 OPEN y SG28 multihost BLOCKED. Siguiente objetivo: añadir evidencia por canal para SY-P-23/24/25, comprobar gates H1d y acumulativo por SHA técnico.

## 2026-10-12 — SY-P-24/25: frontera UI instrumentada en Lite y Plus
- Se sincronizó CURRENT_STATE Lite (2716f492c459907fd2977367f80df669be662b2f) tras el bloqueo previo de validación GitHub.
- Pruebas E2E nuevas en H1d: Plus frontend/e2e/in625-h1d-reentry.spec.ts commit 449baeb3cbb6132ed2219eec9f1d7692df3c72f2 y Lite e2e/in625-h1d-reentry.spec.ts commit fc8d1a5aeac7f2419745ed4508dff4d320f672da. Verifican que xy/xyz preservan valor MathLive, no activan alerta específica a/bc, y que a/bc sigue advirtiendo. No pretenden acreditar semántica numérica de multiplicación.
- CI automática detectada para SHA Plus 449baeb3c: H1d 38302175916 IN_PROGRESS y acumulativo 38302175917 QUEUED; Lite SHA fc8d1a5ae: H1d 38302181089, build 38302181140, acumulativo 38302181314 IN_PROGRESS al consultar.
- No declarar PASS sin revisar los jobs finales. Próximo objetivo: verificar conclusión y logs de estos cinco gates; corregir regresiones, y ampliar test de xy/xyz a semántica numérica por canal según contrato original.
- SY-P-23 OPEN; SG28 multihost BLOCKED.

## 2026-10-12 — SY-P-24/25: CI anterior verificada y procedencia del fixture
- Para SHA Plus 449baeb3: H1d 38302175916 SUCCESS (37 passed; test SY-P-24/25 individual PASS) y acumulativo 38302175917 SUCCESS, backend 871 passed, 1 xfailed. Para SHA Lite fc8d1a5a: H1d 38302181089 SUCCESS (20 passed; test SY-P-24/25 individual PASS), acumulativo 38302181314 SUCCESS y build 38302181140 SUCCESS.
- Se publicaron pruebas de procedencia que comparan entradas, IDs, operación y LaTeX esperado de SY-P-24/25 con el JSONL original: Plus commit 1f078c608c7ee42208436f022f90e727127861ba (frontend/e2e/in625-h1d-reentry.spec.ts); Lite commit 7c5249c4082293dafc32d86184a06bf5746b1b90 (e2e/in625-h1d-reentry.spec.ts). Las versiones definitivas corrigen escape de regex y LaTeX antes de certificación.
- Gates nuevos Plus H1d 38302648984, cumulative 38302648982; Lite H1d 38302654642, cumulative 38302654495, build 38302654462: en progreso en consulta; no declarar PASS sin evidencia final.
- Esto verifica procedencia y alcance UI, NO demuestra aún sustitución matemática xy/xyz en Lite. Plus ya conserva pruebas HTTP con sustituciones 2,3 y 2,3,5. SY-P-23 OPEN; SG28 multihost BLOCKED.
- Siguiente paso: verificar los cinco gates del SHA final, corregir cualquier error de test/fixture, después acreditar aritmética Lite mediante un canal válido, sin inventar soporte de sustituciones inexistente.

## 2026-10-12 — SY-P-24/25: certificados fixture/UI y test numérico real Lite
- CI del SHA Plus 1f078c608c7ee42208436f022f90e727127861ba: H1d 38302648984 SUCCESS, 38 passed sin fallos; acumulativo 38302648982 SUCCESS. CI del SHA Lite 7c5249c4082293dafc32d86184a06bf5746b1b90: H1d 38302654642 SUCCESS, 21 passed sin fallos; acumulativo 38302654495 SUCCESS y build 38302654462 SUCCESS.
- Añadido test de regresión UNITARIO matemático para Lite en src/engine/parsing/syntax309SyPProducts.test.ts: evalúa entradas originales xy/xyz mediante parseExpression, tokenización y Algebrite con sustituciones (x=2,y=3 -> 6; x=2,y=3,z=5 -> 30). Commit técnico final Lite 5db7781334421eff56f681fe0f07f406a348ceea. No se cambió producto.
- Los workflows del último SHA deben comprobarse; los runs consultados para SHA previo 656c6e932 fueron 38303701989 build, 38303701940 acumulativo y 38303701820 H1d IN_PROGRESS antes de la corrección final. Ningún PASS atribuido al nuevo test hasta confirmar SHA exacto en CI.
- SY-P-23 OPEN; SG28 multihost BLOCKED. Siguiente paso: verificar ejecución npm test y resultados unitarios de Lite para SHA 5db77813, H1d/build; corregir fallo del oráculo o implementación si aparece; contrastar Plus HTTP SY-P-24/25 sin levantar XFAIL de SY-P-23.

## 2026-10-12 — SY-P-24/25: regresión numérica Lite y diagnóstico TS7016
- Se añadió prueba unitaria Lite para parseExpression('xy') y parseExpression('xyz'), tokenización e interpretación con Algebrite y testigos numéricos 6/30, sin modificar producto: src/engine/parsing/syntax309SyPProducts.test.ts.
- El primer SHA numérico 5db77813 falló en cumulative 38303721272 y build 38303721286 por TS7016: Algebrite no incluye declaración TypeScript; es un error de tipado del harness, no resultado matemático.
- Corrección técnica publicada Lite SHA eacb90aebc95e1c971cd47f623c80232b2a46f24: anotación TS de importación sin rebajar valores esperados. Gates automáticos H1d 38303828515, build 38303828547, cumulative 38303828580 IN_PROGRESS en última consulta.
- Plus y Lite cerraron correctamente pruebas de procedencia del fixture con SHAs 1f078c60 y 7c5249c4 (Plus H1d 38 PASS; Lite H1d 21 PASS), acumulativos y build aplicable SUCCESS. Este éxito previo no certifica la nueva prueba unitaria.
- Próximo paso: consultar los tres gates del SHA eacb90ae; revisar unit test SY-P-24/25 en log acumulativo y corregir cualquier fallo real (tipado, parser, resultado). No certificar el resultado por runs anteriores. SY-P-23 OPEN; SG28 multihost BLOCKED.

## 2026-10-12 — SY-P-24/25: Lite numeric gate PASS and additional witnesses
- Lite SHA eacb90aebc95e1c971cd47f623c80232b2a46f24: H1d 38303828515 SUCCESS (21 passed), build 38303828547 SUCCESS y acumulativo 38303828580 SUCCESS (90 archivos, 1094 passed, 30 todo). La regresión original de Lite xy=6 y xyz=30 quedó acreditada en el gate acumulativo; 30 TODO no son PASS.
- Se amplió src/engine/parsing/syntax309SyPProducts.test.ts con cuatro testigos independientes: xy=-20, xy=0, xyz=-24, xyz=0, para cubrir signo y cero a través de parser y Algebrite. Commit técnico Lite 386d7e73baee81a493ae77bacae082e6ee3ee38f; sin cambios del motor.
- GitHub Actions disparó automáticamente para SHA 386d7e73: H1d 38304165494, cumulative 38304165554, build 38304165601 inicialmente QUEUED. Requieren conclusión y evidencia en logs antes de certificar los cuatro nuevos testigos.
- SY-P-23 OPEN y SG28 multihost BLOCKED. Siguiente objetivo: verificar gates nuevos en SHA exacto, examinar el test unitario en log acumulativo, corregir eventuales fallos y continuar la paridad del contrato de símbolos concatenados sin alterar el XFAIL.

## 2026-10-12 — SY-P-24/25: discovered coverage gap in Vitest
- Lite SHA 386d7e73: acumulativo 38304165554 SUCCESS (1094 passed, 30 todo) y build 38304165601 SUCCESS, pero conteo idéntico pese a 4 testigos añadidos. Inspección vite.config.ts confirmó `test.include: ["tests/**/*.test.ts"]`; la prueba en src/engine/parsing/ NO era descubierta. El verde previo NO certificaba los testigos, tampoco los dos originales de esa ruta.
- Se creó `tests/syntax309SyPProducts.test.ts` con testigos originales y cuatro adicionales (6 en total), commit Lite d6c2601b42f3c1e78e7c2dcd4d5a16aeabcbfc76. Se eliminó el duplicado fuera del scope, commit Lite 2500f11f8deae17fa5a6fd5a63d93ca37fe7edcd. No hubo cambio del motor.
- CI para SHA final 2500f11f: H1d 38304304314, acumulativo 38304304285, build 38304304274 QUEUED al consultar. Para acreditar se requiere ver `Test Files` aumentar de 90 a 91 y `Tests passed` aumentar al menos de 1094 a 1100, además del resultado del test concreto. Ante fallo, clasificar parser/oráculo/harness. No declarar PASS antes de ver los logs.
- SY-P-23 OPEN y SG28 multihost BLOCKED. Siguiente paso exacto: verificar 38304304285/38304304314/38304304274 para SHA final y corregir los fallos; luego comparar Plus HTTP.

## 2026-10-12 — SY-P-24/25: seis testigos numéricos CERTIFICADOS en Lite
- Lite SHA final 2500f11f8deae17fa5a6fd5a63d93ca37fe7edcd: acumulativo run 38304304285 SUCCESS, job 114994497580. Evidencia textual CI: `tests/syntax309SyPProducts.test.ts (6 tests)` PASS; 91 archivos aprobados, 1100 tests passed y 30 todo. Build 38304304274 SUCCESS. H1d 38304304314 IN_PROGRESS en última consulta, no marcar PASS todavía.
- Se corrigió el gap del harness: Vitest configuraba `include: tests/**/*.test.ts`; la ubicación anterior en src/engine/parsing no se ejecutaba. Los seis testigos acreditan productos xy,xyz con positivos, negativos y ceros a través de parseExpression y Algebrite.
- SY-P-23 OPEN por convención y XFAIL Plus; SG28 multihost BLOCKED. Siguiente objetivo: verificar H1d del mismo SHA; ampliar certificación bilateral de semántica de nombres declarados/no declarados sin alterar motor indebidamente.

## 2026-10-12 — SG28: preflight de runners independientes sin atribuir DIST PASS
- Se releyó qa/certification/SG28_DISTRIBUTED_ACCEPTANCE.md. El test existente backend/tests/test_sg28_mtls_spawned_processes.py demuestra PIDs separados con mTLS sobre un solo runner, no hosts autónomos ni aceptación DIST-01.
- Plus commit técnico 2efe7e8c7cb28fe0a882e84f77467eb5bba309b8 agrega .github/workflows/sg28-independent-runner-preflight.yml. Ejecuta dos jobs de GitHub Actions en runners aislados, guarda hashes SHA-256 de boot ID (sin publicar IDs en texto plano), compara el SHA y comprueba fingerprints distintos; es un gate de infraestructura preliminar, NO una coordinación K=1 compartida.
- GitHub detectó automáticamente Plus preflight 38333976164, H1d 38333976122 y cumulative 38333976115 inicialmente QUEUED/IN_PROGRESS. No declarar PASS hasta logs del SHA exacto.
- DIST-01..08 y SG28/H2 siguen BLOCKED/OPEN: falta servicio coordinador durable autenticado accesible entre hosts y su integración opt-in al endpoint, más inyección de fallos y prueba de cancelación HTTP. No se modificó Render, producción ni SG28_EVALUATE_ISOLATION.
- Siguiente acción exacta: verificar el preflight y sus artefactos; en caso de éxito, preparar en entorno desechable autorizado un coordinador compartido seguro entre dos hosts separados, primero DIST-01 K=1, manteniendo estados restantes BLOCKED.

## 2026-10-12 — SG28 preflight CI confirmado
- Plus SHA 2efe7e8c7cb28fe0a882e84f77467eb5bba309b8: SG28 Independent Runner Preflight run 38333976164 SUCCESS. Jobs host_identity (a) 115089811933 y (b) 115089811762 SUCCESS; verify_distinct_runners 115089845401 SUCCESS. Log: `SG28 host-isolation preflight PASS: two distinct runner boot identities; DIST-01..08 remain BLOCKED`.
- Evidencia: runners distintos verificados, NO hay prueba de grant global K=1, coordinador de red compartido, ni /evaluate. DIST-01..08 permanecen BLOCKED.
- H1d Plus 38333976122 y cumulative Plus 38333976115 aún IN_PROGRESS en última consulta; comprobar sus resultados antes de acreditarlos.
- Próxima acción: validar jobs H1d/cumulative sobre SHA; diseñar mecanismo de coordinación compartido y autenticado para dos runners independientes en sandbox sin producción y ejecutar DIST-01 con logs por nodo.

## 2026-10-12 — SG28 DIST-01: readiness de staging remoto fail-closed
- Se verificaron los gates Plus de SHA 2efe7e8c: H1d 38333976122 SUCCESS y acumulativo 38333976115 SUCCESS, además de preflight runners separados 38333976164 SUCCESS. No son DIST-01 PASS.
- En Plus se publicaron `backend/qa/sg28_remote_readiness.py` y `backend/tests/test_sg28_remote_readiness.py`; commit técnico final 569814e2482f8713928c42b8638f7d7d96b9413d. Validan que el futuro staging tenga autorización explícita, coordinador no-loopback, archivos de credenciales mTLS presentes, y reporte `network_test_executed=false`, `dist01_certified=false`. La comprobación actual es exclusivamente estática y no contacta ningún servidor.
- CI automática SHA 569814e2: preflight 38335185919, H1d 38335185922, cumulative 38335185926 QUEUED en primera consulta. Revisar logs para demostrar 4 tests nuevos; sin evidencia no declarar PASS.
- DIST-01..08 siguen BLOCKED, SG28/H2 OPEN: el coordinador existente solo acepta loopback, falta servicio seguro compartido en hosts diferentes, conexión opt-in al endpoint y evidencia de K=1. No se crearon servicios ni se cambió Render/producción.
- Próximo objetivo exacto: revisar gate acumulativo del SHA 569814e2, remediar fallos; después preparar protocolo de comunicación segura y autorización para staging verdaderamente multinodo. No interpretar readiness estático como conexión mTLS establecida.

## 2026-10-12 — SG28 DIST-01: comprobación de readiness y límites negativos
- Plus SHA 569814e2482f8713928c42b8638f7d7d96b9413d: preflight de dos runners 38335185919 SUCCESS, H1d 38335185922 SUCCESS (38 passed), acumulativo 38335185926 SUCCESS (backend 875 passed, 1 xfailed; cuatro pruebas `test_sg28_remote_readiness.py` PASS). No es aceptación de DIST-01.
- Nueva ampliación de regresión Plus `backend/tests/test_sg28_remote_readiness.py`, commit 6216b8f0dbec01f4bb51168791ff65a40423b1d1: rechazo de localhost/127.0.0.1/::1, puertos 0/-1/65536 y garantía de ausencia de conexión de red durante validación estática. No se cambiaron transportes ni endpoints.
- CI para SHA 6216b8f0: cumulative 38335907494, H1d 38335907512, preflight 38335907533 inicialmente QUEUED. Verificar tres gates antes de declararlos PASS.
- DIST-01..08 BLOCKED y SG28/H2 OPEN: sigue pendiente coordinador realmente compartido entre hosts con autenticación y evidencia de K=1; SG28_EVALUATE_ISOLATION de producción sigue OFF. Siguiente fase: verificar los nuevos gates y pasar a un diseño de conectividad remota segura en entorno desechable autorizado, sin etiquetar readiness como test distribuido.

## 2026-10-12 — SG28 readiness: restricción de identidad TLS remota
- Plus SHA 6216b8f0: cumulative 38335907494 SUCCESS (backend 882 PASS, 1 XFAIL, 1 warning; 11 tests `test_sg28_remote_readiness.py` PASS); H1d 38335907512 SUCCESS y preflight 38335907533 SUCCESS.
- Se identificó brecha de configuración: readiness admitía coordinador DNS remoto con `server_name` loopback en TLS. Plus commit técnico 7b3fca7e61fc8febea516f2af48f693025a6c7b5 modifica backend/qa/sg28_remote_readiness.py para rechazar server_name `localhost`, `127.0.0.1`, `::1` y añade cuatro casos negativos en backend/tests/test_sg28_remote_readiness.py. No se abrió red ni se cambió producción.
- Gates automáticos del SHA final: preflight 38338232847, H1d 38338232932, cumulative 38338233557 QUEUED al consultar. No registrar PASS hasta resultado y logs del SHA.
- DIST-01..08 BLOCKED y SG28/H2 OPEN; todavía no hay coordinador compartido autenticado conectado a hosts separados ni endpoint público opt-in.


## 2026-10-12 — SY-P y SG28: verificación de CI y refuerzo readiness remoto
- Lite SHA `2500f11f8deae17fa5a6fd5a63d93ca37fe7edcd`: H1d run `38304304314` SUCCESS (21 Playwright passed); cumulative `38304304285` SUCCESS (91 test files, 1100 passed, 30 todo), según evidencia anterior del gate. No implica cierre SY-P-23.
- Plus SHA `7b3fca7e61fc8febea516f2af48f693025a6c7b5`: cumulative run `38338233557` SUCCESS; backend 886 passed / 1 xfailed / 1 warning y frontend 757 passed / 28 todo. H1d `38338232932` y independent-runner preflight `38338232847` SUCCESS. La preflight no certifica DIST-01.
- Plus refuerzo técnico `backend/qa/sg28_remote_readiness.py` y tests `backend/tests/test_sg28_remote_readiness.py`, HEAD técnico `55645549f9edbf4fcb420421feb20dca6481f19e`: rechaza loopback extendido, direcciones unspecified/link-local, IPv4-mapped IPv6 y DNS .localhost tanto en host como identidad TLS. Readiness sigue sin conexión de red ni emisión de grants. No hay cambios de producción.
- CI del HEAD técnico Plus: preflight `38338612248`, H1d `38338612256`, cumulative `38338612293` QUEUED en primera consulta; resultados no acreditados todavía. Los runs anteriores de SHAs intermedios no sustituyen el gate del HEAD.
- SY-P-23 conserva XFAIL de convención sin declarar: `test_syp_23_separate_b_c_substitutions_pending`. SG28 DIST-01..08 permanecen BLOCKED; readiness de configuración no acredita hosts coordinados ni K=1.

### Siguiente paso exacto
1. Consultar Plus runs `38338612248`, `38338612256`, `38338612293` y sus jobs/logs para SHA `55645549f`. Corregir el gate afectado si falla (especialmente tests de variantes de host), no declarar PASS anticipado.
2. Comparar los contratos y pruebas Lite/Plus de SY-P-23, y mantener explícita la semántica de identificadores declarados frente a multiplicación hasta decidir convención contractual, sin eliminar XFAIL injustificadamente.
3. Mantener DIST-01..08 BLOCKED hasta prueba real de coordinador autenticado entre hosts separados en staging autorizado; nunca usar preflight estático como prueba K=1.


## 2026-10-12 — SG28 readiness hardening: CI del SHA final confirmado
- Plus SHA técnico `55645549f9edbf4fcb420421feb20dca6481f19e`: preflight `38338612248` SUCCESS (host_identity a/b + verify_distinct_runners); H1d `38338612256` SUCCESS; cumulative `38338612293` SUCCESS (backend 901 PASS, 1 XFAIL, 1 warning; frontend 757 PASS y 28 TODO).
- Refuerzo confirmado en `backend/qa/sg28_remote_readiness.py` y `backend/tests/test_sg28_remote_readiness.py`: controles contra loopback IPv4/IPv6, IPv4-mapped IPv6, local DNS y direcciones sin alcance apropiado. Readiness permanece estático y fail-closed; no se probó red remota ni servidor compartido.
- El contrato `SG28_DISTRIBUTED_ACCEPTANCE.md` exige coordinador durable autenticado, dos hosts verdaderamente separados, K=1 global, pruebas de fallos y ruta opt-in. El preflight valida identidad de runners, no la coordinación y no constituye DIST-01 PASS.
- SY-P-23 sigue OPEN con un XFAIL de convención de identificadores; no confundir 901 PASS con cierre de SY-P-23.
- **Siguiente paso exacto**: fortalecer transporte/pruebas negativas de identidad mTLS sin exposición en producción; ejecutar gate de ese SHA. DIST-01..08 BLOCKED hasta que exista staging desechable autorizado con coordinador realmente compartido y evidencia por nodo. Mantener `SG28_EVALUATE_ISOLATION` desactivado.


## 2026-10-12 — SG28 mTLS timeout validation (bloque técnico posterior)
- Plus transport `backend/app/services/distributed_tls_transport.py`: commit `d05afb817a77bd9d342440bec93050abc3461229` valida timeout numérico finito dentro de (0,10] y rechaza bool, NaN, infinitos y tipos ajenos; sin tocar `/evaluate` ni producción.
- Plus tests `backend/tests/test_sg28_distributed_tls_transport.py`: commit técnico final `16090fdc37821c3645efa9da2681d04488d94fb8`, diez variantes negativas nuevas, prohíben establecer conexión bajo configuración inválida.
- GitHub Actions automáticos en SHA final: H1d `38339086098`, independent runner preflight `38339086099`, cumulative `38339086145` IN_PROGRESS al consultar; resultados pendientes, NO PASS anticipado.
- Línea base anterior `55645549f`: Plus cumulative `38338612293` SUCCESS (901 backend PASS, 1 XFAIL, 757 frontend PASS, 28 TODO); H1d `38338612256` SUCCESS; preflight `38338612248` SUCCESS.
- SG28 DIST-01..08 sigue BLOCKED por ausencia de coordinación K=1 verdaderamente multinodo; SY-P-23 conserva XFAIL de convención. Siguiente paso: verificar las tres corridas sobre `16090fdc`, inspeccionar los diez testigos y corregir cualquier fallo confirmado; no activar staging remoto ni producción sin autorización.


## 2026-10-12 — SG28 mTLS cierre del gate timeout y nueva prueba de hostname
- Plus SHA `16090fdc37821c3645efa9da2681d04488d94fb8` verificado: H1d `38339086098` SUCCESS; independent runner preflight `38339086099` SUCCESS; cumulative `38339086145` SUCCESS. Logs backend: 911 PASS, 1 XFAIL, 1 warning; frontend 757 PASS y 28 TODO. Los 10 parámetros de timeout inválido pasaron explícitamente.
- Siguiente prueba de seguridad en Plus: `backend/tests/test_sg28_distributed_tls_transport.py`, commit `a74ade1b6f1d0844f2cea90fcf60a502baf72346`, añade caso de servidor con CA de confianza pero hostname TLS incorrecto. Aún no hay CI confirmado para ese SHA; no atribuirle PASS.
- Siguiente paso: localizar la corrida cumulative del SHA `a74ade1b`, verificar el caso TLS nuevo y gates asociados, diagnosticar cualquier fallo. SG28 DIST-01..08 sigue BLOCKED: no se ha ejecutado coordinación K=1 entre hosts independientes; SY-P-23 mantiene XFAIL contractual.


## 2026-10-12 — SG28 mTLS identity y multicast readiness
- Plus SHA `a74ade1b6f1d0844f2cea90fcf60a502baf72346`: preflight `38339620404`, H1d `38339620357` y cumulative `38339620407` SUCCESS. Backend 911 passed, 1 xfailed, 1 warning; frontend 757 passed, 28 todo. Se añadió comprobación de fallo de autenticación TLS con CA confiable y hostname erróneo en la suite de integración.
- Nuevo control estático remoto Plus `backend/qa/sg28_remote_readiness.py`: rechaza multicast IPv4/IPv6 para host e identidad TLS (sin red ni grants). Regresión en `backend/tests/test_sg28_remote_readiness.py`: cinco casos negativos. SHA técnico final `37940d57cd38e9c1146d0d29d55589804b677ed4`.
- Auto CI SHA final: H1d `38339993689`, cumulative `38339993688`, independent-runner preflight `38339993742`; inicialmente QUEUED, no se acredita PASS de este SHA todavía.
- Siguiente paso exacto: comprobar conclusiones y logs de los tres workflows SHA `37940d57`, aislar y reparar cualquier fallo. SG28 DIST-01..08 sigue BLOCKED por falta de coordinador durable compartido entre hosts y aceptación K=1; no desplegar ni habilitar opt-in productivo. SY-P-23 XFAIL de convención pendiente.


## 2026-10-12 — SG28 rechazo estricto de identidad mTLS malformada
- Plus commit técnico final `d52faf432c887659d0f35cece8510754b8d73d9e`: `backend/app/services/distributed_tls_transport.py` rechaza host y server_name no-string o whitespace-only mediante `DistributedAdmissionUnavailable` antes de acceder a red. Regresión en `backend/tests/test_sg28_remote_readiness.py`: 14 casos parametrizados (2 campos x 7 valores).
- Predecesor SHA `37940d57cd38e9c1146d0d29d55589804b677ed4`: cumulative `38339993688` SUCCESS, backend 916 PASS, 1 XFAIL, 1 warning, frontend 757 PASS/28 TODO; H1d `38339993689` SUCCESS y runner preflight `38339993742` SUCCESS. Los 5 casos multicast pasaron según logs.
- Nuevos workflows para SHA final: H1d `38340323640`, cumulative `38340323691`, independent runner `38340323717`, QUEUED al consultar. **No declarar PASS en ese SHA sin logs**.
- Siguiente paso: verificar nuevas corridas e inspeccionar específicamente los 14 testigos, corregir fallos sin alterar contrato de DIST. DIST-01..08 sigue BLOCKED por ausencia de prueba coordinador realmente multinodo K=1. SY-P-23 XFAIL de convención pendiente.


## 2026-10-12 — SG28 identidad mTLS: rojo clasificado y fixture corregido
- Plus SHA `d52faf432c887659d0f35cece8510754b8d73d9e`: cumulative `38340323691` FAILURE en backend: 928 PASS, 2 FAIL, 1 XFAIL, 1 warning. Los fallos fueron exclusivamente `test_remote_probe_invalid_identity_types_fail_closed[host-\\t]` y `[server_name-\\t]`: el fixture pasó la secuencia literal backslash+t en lugar de carácter TAB; no acreditan defecto de producto. Otros 12 testigos PASS. H1d `38340323640` SUCCESS; preflight `38340323717` SUCCESS.
- Plus corrección de HARNESS `backend/tests/test_sg28_remote_readiness.py`: commit técnico `98c93c34c0125ad02d5e1c676778f3ca873dd406`, sustituye el parámetro por escape Python `"\\t"` (TAB en runtime), no modifica motor ni relaja el oráculo.
- CI disparado automáticamente SHA final: SG28 preflight `38340643630`, cumulative `38340643631`, H1d `38340643638` IN_PROGRESS al consultar. No declarar verde hasta comprobar jobs/logs del mismo SHA. Siguiente acción exacta: verificar los 14 casos y gates; corregir solo fallos genuinos. DIST-01..08 permanecen BLOCKED sin coordinación global K=1 verificada.


## 2026-10-12 — SG28 readiness: legacy IPv4 loopback aliases
- Plus SHA `98c93c34c0125ad02d5e1c676778f3ca873dd406`: cumulative `38340643631` SUCCESS, backend 930 PASS / 1 XFAIL / 1 warning, frontend 757 PASS / 28 TODO. Los 14 casos de identidad malformada pasan en logs. H1d `38340643638` SUCCESS; independent runner `38340643630` SUCCESS.
- Plus cambios técnicos `backend/qa/sg28_remote_readiness.py` y `backend/tests/test_sg28_remote_readiness.py`: normalización sin DNS de variantes numéricas/abreviadas IPv4 con `socket.inet_aton` antes de la política de loopback, sin interacción con servidores; 8 casos negativos nuevos. SHA técnico final `b448e93dfb870c0d941a297c94b06de30abfa781`.
- Gate nuevo en SHA final: H1d `38341093068`, cumulative `38341093045`, independent runner `38341093062` QUEUED en primera observación. Comprobar logs y clasificar rojos; no declarar PASS anticipadamente.
- DIST-01..08 siguen BLOCKED: el preflight estático no sustituye coordinador durable autenticado y prueba multinodo K=1; SY-P-23 mantiene convención pendiente.


## 2026-10-12 — SG28 handshake-only preflight preparado
- Plus SHA `b448e93dfb870c0d941a297c94b06de30abfa781`: cumulative `38341093045` SUCCESS (backend 938 PASS, 1 XFAIL, 1 warning; frontend 757 PASS/28 TODO), H1d `38341093068` SUCCESS, preflight runners `38341093062` SUCCESS. Ocho casos IPv4 legacy PASS en logs.
- Plus implementó `backend/qa/sg28_remote_handshake.py` (commit `96016f546a0ddd3ccc6e0b2bd8f45db2fc7ed3e4`) como CLI opt-in: exige `SG28_DISPOSABLE_STAGING_AUTHORIZED=1`, evalúa readiness estático, realiza solo handshake mTLS con verificación de hostname, cierra la conexión sin enviar grants/release ni mensajes de aplicación; reporta siempre `dist01_certified=false` y `dist08_certified=false`. No se ha conectado a staging ni desplegado producción.
- Plus `backend/tests/test_sg28_remote_handshake.py` commit técnico final `feb31df0e44c14e9844bf519196f9f462221f4fe`: tests mockeados contra conexiones no autorizadas y tráfico de admisión, éxito sintético y fallo de TCP. Solo se acreditan cuando CI del SHA final concluya.
- Auto CI: cumulative `38341452978`, H1d `38341452969`, independent runner `38341453050`, inicialmente QUEUED.
- Siguiente paso exacto: inspeccionar esos tres gates, corregir errores confirmados y preparar prueba de handshake real únicamente en staging desechable autorizado, registrando fingerprint remoto y evidencias no sensibles. **DIST-01..08 BLOCKED** hasta K=1 auténtico multinodo y ejecución HTTP/cancelación; SY-P-23 conserva XFAIL contractual.


## 2026-10-12 — SG28 handshake mTLS: cierre de CI y negativos de certificado ausente
- Plus SHA `feb31df0e44c14e9844bf519196f9f462221f4fe`: cumulative `38341452978` SUCCESS (942 backend PASS, 1 XFAIL, 1 warning; 757 frontend PASS y 28 TODO), H1d `38341452969` SUCCESS, preflight `38341453050` SUCCESS. Los cuatro tests mock de `test_sg28_remote_handshake.py` pasaron; no hubo conexión remota real.
- Plus `backend/tests/test_sg28_remote_handshake.py` agrega dos pruebas parametrizadas del rechazo fail-closed cuando `getpeercert()` devuelve None o diccionario vacío, sin enviar mensajes de admisión. Commit técnico `e85eeae7f5cb7866a6a5e7ca6a6b455034668e91`; sin cambio de producto ni producción.
- Auto CI SHA final: cumulative `38342062667`, H1d `38342062723`, SG28 preflight `38342062675` QUEUED en primera consulta. No se declara PASS de este SHA hasta revisar logs.
- Siguiente objetivo exacto: verificar estos runs y los dos testigos negativos. SG28 DIST-01..08 permanece BLOCKED por falta de coordinador duradero multinodo y K=1 con pruebas reales, y DIST-08 sin HTTP/cancelación distribuidos. SY-P-23 XFAIL contractual permanece abierto.


## 2026-10-12 — SG28 handshake: errores de transporte fail-closed
- Plus SHA `e85eeae7f5cb7866a6a5e7ca6a6b455034668e91`: cumulative `38342062667` SUCCESS (backend 944 PASS, 1 XFAIL, 1 warning; frontend 757 PASS, 28 TODO), H1d `38342062723` SUCCESS, independent runner preflight `38342062675` SUCCESS. Ambos casos nuevos de peer certificate ausente PASS en logs.
- Plus `backend/tests/test_sg28_remote_handshake.py` commit técnico final `e8e5efda13502dfd3d86e5b900e39662d5ed7296`: 4 negativos adicionales para TimeoutError, ConnectionResetError, ssl.SSLError, OSError; exige DistributedAdmissionUnavailable en handshake sin grants. Son mocks aislados, NO conexión real a staging ni DIST PASS.
- CI SHA final: H1d `38342862183`, cumulative `38342862079`, SG28 preflight `38342862017` IN_PROGRESS/QUEUED en primera consulta. Siguiente paso: revisar esos tres gates y logs, corregir cualquier fallo confirmado y mantener DIST-01..08 BLOCKED hasta coordinación global K=1 multinodo y cancelación HTTP real.


## 2026-10-12 — SG28 fallo de import en tests y corrección
- Plus SHA e8e5efda13502dfd3d86e5b900e39662d5ed7296: cumulative run 38342862079 FAILURE por error en collection tests/test_sg28_remote_handshake.py (`NameError: ssl is not defined`), no por producto; frontend SUCCESS; H1d 38342862183 y independent runner 38342862017 SUCCESS.
- Corrección de harness: agregar import ssl en backend/tests/test_sg28_remote_handshake.py, commit b1c9d9e3921eb7f3819265523e84d2989b41a019. Mantiene los cuatro casos de fallo de transporte, no debilita oráculos.
- CI automática nuevo SHA: cumulative 38344516486, H1d 38344516489, preflight 38344516478 IN_PROGRESS. Pendiente verificar logs/resultados sobre este SHA antes de PASS.
- DIST-01..08 siguen BLOCKED sin coordinador compartido K=1 verificado ni cancelación HTTP real en multinodo. Siguiente objetivo exacto: verificar el gate corregido, diagnosticar cualquier fallo restante y continuar pruebas seguras aisladas.


## 2026-10-12 — SG28 handshake mTLS: carga de certificados fail-closed
- Plus SHA b1c9d9e3921eb7f3819265523e84d2989b41a019: cumulative 38344516486 SUCCESS (backend 948 PASS, 1 XFAIL, 1 warning; frontend 757 PASS, 28 TODO); H1d 38344516489 SUCCESS; independent runner 38344516478 SUCCESS. Cuatro tests de errores de red/TLS PASS individualmente.
- Nueva regresión Plus backend/tests/test_sg28_remote_handshake.py: rechaza falla de carga del certificado de cliente y error de creación de contexto SSL/CA antes de abrir red (2 casos). Commit técnico a69a31dfd2e9f095598da7530b011f35a10f9105; no se ha desplegado ni activado staging/producción.
- Auto CI SHA final: preflight 38345110390, cumulative 38345110483, H1d 38345110470 inicialmente QUEUED; resultados no acreditados. Siguiente paso: revisar conclusión y logs del SHA y corregir cualquier rojo. DIST-01..08 BLOCKED hasta prueba de K=1 entre hosts independientes y cancelación HTTP distribuida.


## 2026-10-12 — SG28 handshake hostname verification
- Plus SHA a69a31dfd2e9f095598da7530b011f35a10f9105: cumulative 38345110483 SUCCESS (backend 950 PASS, 1 XFAIL, 1 warning; frontend 757 PASS, 28 TODO), H1d 38345110470 SUCCESS, SG28 independent runner 38345110390 SUCCESS; los dos tests de fallo de certificado/CA PASS individuales.
- Plus test nuevo backend/tests/test_sg28_remote_handshake.py SHA aa9901bfeec105b477defe51b9e65557904e789c simula SSLCertVerificationError por hostname incorrecto y exige fallo cerrado sin mensajes de admisión; pendiente CI.
- Nuevas corridas: cumulative 38345453316, H1d 38345453304, preflight 38345453370 inicialmente QUEUED. Siguiente objetivo exacto: consultar y clasificar estas corridas SHA aa9901bf y reparar fallos. DIST-01..08 permanece BLOCKED hasta prueba K=1 entre hosts reales y cancelación HTTP distribuida.


## 2026-10-12 — SG28 comprobación estricta de validación TLS
- Plus SHA aa9901bfeec105b477defe51b9e65557904e789c: cumulative 38345453316 SUCCESS (backend 951 PASS, 1 XFAIL y 1 warning; frontend 757 PASS/28 TODO), H1d 38345453304 SUCCESS, independent-runner preflight 38345453370 SUCCESS. Caso negativo de hostname TLS PASS.
- Plus backend/tests/test_sg28_remote_handshake.py commit técnico 46661d782fb25ec7ade2369f044ed947cd48a79f: nuevo test verifica explícitamente SSLContext verify_mode=CERT_REQUIRED, check_hostname=True y server_hostname esperado antes de autorizar éxito de handshake simulado. No prueba certificado real ni multinodo.
- Nuevas corridas SHA final: H1d 38345870222 IN_PROGRESS, preflight 38345870195 IN_PROGRESS, cumulative 38345870240 QUEUED al consultar. Próximo paso: verificar los tres gates y prueba añadida; corregir cualquier rojo y continuar hacia aceptación distribuida real solo en staging autorizado. DIST-01..08 BLOCKED, SG28/H2 OPEN.


## 2026-10-12 — SG28 remote handshake CA/timeout regression
- Se verificó Plus SHA `46661d782fb25ec7ade2369f044ed947cd48a79f`: cumulative `38345870240` SUCCESS (backend 952 PASS, 1 XFAIL, 1 warning); H1d `38345870222` SUCCESS; independent runner `38345870195` SUCCESS. El H1d Lite de referencia `38304304314` fue SUCCESS, pero corresponde a SHA distinto y no prueba paridad de este cambio específico.
- Plus commit técnico `24b51da9bbe3adcfb2a54a5a8ba9604148879c59` agrega `test_tls_uses_configured_ca_and_bounded_tcp_timeout` en `backend/tests/test_sg28_remote_handshake.py`: oráculo aislado que exige CA explícita, SERVER_AUTH, certificado/key del cliente, hostname verificado, timeout de socket y cero mensajes de admisión.
- Runs push automáticos de Plus para ese SHA: cumulative `38346307824`, H1d `38346307758`, independent runner `38346307820` (en curso/cola al observar). **Sin PASS acreditado aún para el SHA nuevo**.
- Siguiente paso: comprobar los tres resultados y logs para SHA `24b51da`, corregir errores genuinos, luego preparar pruebas reales exclusivamente en staging desechable autorizado. DIST-01..08 BLOCKED y SG28/H2 OPEN hasta coordinación multinodo global K=1 y cancelación HTTP verificada. No se ejecutó conexión externa ni despliegue.


## 2026-10-12 — SG28 timeout de socket TLS (continuación)
- Plus SHA `24b51da9bbe3adcfb2a54a5a8ba9604148879c59`: cumulative run `38346307824` SUCCESS (backend 953 PASS, 1 XFAIL, 1 warning), H1d `38346307758` SUCCESS y preflight `38346307820` SUCCESS. La prueba de CA y timeout fue acreditada en ese SHA.
- Nuevo commit de prueba Plus `b94e34c4d507eb38a830a863e27fc5e1c31bd57c` agrega regresión para excepción de timeout al configurar el socket TLS seguro; exige fallo cerrado y ninguna admisión. No se modificó producto ni se conectó a staging real.
- Corridas automáticas del nuevo SHA: cumulative `38346643512`, H1d `38346643517`, preflight `38346643587`, inicialmente QUEUED. Ningún PASS atribuido anticipadamente al nuevo SHA.
- Siguiente acción exacta: verificar esos tres gates y logs; si falla, clasificar y corregir. Después, continuar pruebas de protocolo y coordinación real únicamente en staging desechable autorizado. DIST-01..08 y SG28/H2 siguen BLOCKED/OPEN en su alcance multinodo auténtico.


## 2026-10-12 — SG28 lectura del certificado del peer
- Verificado Plus SHA `b94e34c4d507eb38a830a863e27fc5e1c31bd57c`: cumulative `38346643512` SUCCESS (backend 954 PASS, 1 XFAIL, 1 warning; frontend 757 PASS y 28 TODO); H1d `38346643517` SUCCESS; independent preflight `38346643587` SUCCESS. El caso de timeout de socket fue validado.
- Nuevo test Plus `backend/tests/test_sg28_remote_handshake.py::test_peer_certificate_read_failure_closes_without_admission`, commit `758575fcdc7642f92100bc232b9a6bb09d34a7b8`: si `getpeercert()` falla con `ssl.SSLError`, exigir `DistributedAdmissionUnavailable` y ausencia de comunicaciones de admisión; simulación local sin tráfico externo.
- Corridas automáticas del nuevo SHA: cumulative `38347193008`, H1d `38347192927`, independent preflight `38347193104` (QUEUED al comprobar). No atribuir PASS antes de cierre.
- Siguiente paso: verificar las tres corridas y los logs del SHA `758575f`; clasificar cualquier rojo antes de corregir. DIST-01..08 BLOCKED y SG28/H2 OPEN para multinodo real y cancelación HTTP distribuida. No hubo despliegue ni uso de certificados reales.


## 2026-10-12 — Decisión persistente: doble frente SG28/DIST + matrices matemáticas

- Decisión expresa del responsable: **no detener certificación matemática independiente por el bloqueo multinodo**, y continuar en paralelo el trabajo de ingeniería de SG28/DIST.
- Norma bilateral permanente publicada en `qa/certification/EXECUTION_PROTOCOL.md`: Frente A SG28/DIST (sin PASS hasta staging real y cancelación HTTP entre hosts independientes), Frente B matrices matemáticas en orden contractual (empezando por Syntax 309), sin saltar gates, ni declarar IN625 cerrado antes de H2.
- Evidencia CI consolidada previa a la decisión: Plus SHA `758575fcdc7642f92100bc232b9a6bb09d34a7b8`: acumulativo `38347193008` SUCCESS (backend 955 PASS, 1 XFAIL, 1 warning; frontend 757 PASS, 28 TODO); H1d `38347192927` SUCCESS; SG28 preflight `38347193104` SUCCESS. Lite SHA técnico `2500f11f8deae17fa5a6fd5a63d93ca37fe7edcd`: cumulative `38304304285`, H1d `38304304314`, build `38304304274` SUCCESS. No son evidencia DIST real.
- Próxima acción Frente A: diseñar/probar un coordinador K=1 con fencing durable para staging aislado y la integración de cancelación HTTP; mantener flags opt-in OFF por defecto, sin deployment de producción.
- Próxima acción Frente B: recuperar matriz Syntax 309 y los tests existentes, identificar primer caso no certificado independiente de H2; implementar corrección/regresión y ejecutar gates adecuados, conservando SY-P-23 como XFAIL contractual hasta definir convención para símbolo `bc`.
- Registro exclusivamente documental: no requiere disparar cálculos costosos de CI. Futuros LLM deben leer el protocolo canónico, no depender de este chat.


## 2026-10-12 — Syntax309 SY-P-23 bilateral signed witnesses
- Plus commit `5afdead008ac1bf7c46fab57f0652b51450ab052`: cumulative `38348411161` SUCCESS y H1d `38348411111` SUCCESS. Test con signos para identificador `bc` y productos explícitos.
- Lite commit `9976ce9e51991ddf557a671450880bb9bc9e15b5`: prueba signed de `(a/b)*c=8` y `a/(b*c)=2`, con `a=12,b=-3,c=-2`; confirma tokenización raw `a/bc` como letras separadas. No se falsea paridad semántica: Plus admite identificador nombrado `bc` y Lite actualmente lo separa. SY-P-23 no se declara cerrado.
- CI Lite nuevo SHA: build `38348692189`, cumulative `38348692114`, H1d `38348692139`, IN_PROGRESS al observar; pendiente verificar logs/conclusión.
- Siguiente objetivo Frente B: revisar gates Lite; diagnosticar rojos si aparecen y establecer contrato explícito para ambigüedad `a/bc` antes de cerrar SY-P-23. Frente A DIST/SG28 continúa bloqueado solo respecto a certificación real multinodo.


## 2026-10-12 — SY-P-23 signed witness: corrección de harness Lite
- Plus SHA `5afdead008ac1bf7c46fab57f0652b51450ab052`: cumulative `38348411161` y H1d `38348411111` SUCCESS.
- Lite SHA `9976ce9e51991ddf557a671450880bb9bc9e15b5`: cumulative `38348692114` FAILURE: 1 test nuevo falla porque regex de sustitución conserva barras duplicadas, produce NaN (1100 PASS, 1 FAIL, 30 TODO). Build `38348692189` SUCCESS. Clasificación: HARNESS, no producto.
- Corregidos límites regex en Lite commit `c2931d06faa0b6743491f969c888cf3fd835b6de`, sin modificar motor ni oráculos matemáticos. Nuevos gates automáticos cumulative `38348772586`, H1d `38348772610`, build `38348772605` IN_PROGRESS al observar. Aún no declarar PASS de la corrección.
- Semántica raw `a/bc` sigue discrepante Lite (separa letras) vs Plus (identificador `bc`); la prueba nueva cubre agrupaciones explícitas, no certifica paridad raw ni cierra SY-P-23. Siguiente paso: verificar los 3 gates y documentar una convención de desambiguación antes de certificar el caso.


## 2026-10-13 — Syntax309 integrity full fixture required
- Lite SHA `c2931d06faa0b6743491f969c888cf3fd835b6de`: cumulative `38348772586`, H1d `38348772610`, build `38348772605` SUCCESS. Cumulative 1101 PASS, 30 TODO; regresión SY-P-23 signed grouping validada.
- Verificado en ambos repositorios el fixture `qa/certification/syntax309_cases.jsonl`: mismo blob `fd5d8d05ea8b799039cc45e6a4cd88587aab4f8f`, 309 filas, niveles N1=104/N2=183/N3=22 y secciones P33 F48 E31 N31 D14 U25 V28 Q23 M20 S20 R14 X22.
- Se reforzó `check_syntax309_fixture.py` bilateralmente: exigir archivo completo, distribución de niveles y secciones, IDs sin repetición y concordancia con subconjunto SY-P. Antes podía imprimir un PASS parcial cuando faltaba la matriz completa; ahora falla cerrado.
- Commits: Lite `10603595cbcc42b6e4ea26a8fc1f5153b7cb4e5c`; Plus `b36dd3ffc7cda676ce91421243118bd4b02cda3f`. CI Syntax309 Integrity: Lite `38381288099`, Plus `38381293409`, pendientes de conclusión al observar. Sin declarar certificada matemática toda Syntax309; SY-P-23 mantiene decisión de ambigüedad pendiente.
- Siguiente paso exacto: verificar ambos gates de integridad y abordar SY-F (48 casos) con oráculos por capa y CI, conservando el flujo paralelo SG28/DIST aislado. No cerrar IN625 ni Syntax309 completa prematuramente.


## 2026-10-13 — Syntax309 SY-F iniciado: primeros testigos HTTP Plus
- Se verificó que `syntax309_cases.jsonl` contiene los 48 registros oficiales SY-F en ambos repositorios. Primeros dos casos con oráculo numérico independiente: SY-F-09 `sin(pi/6)=1/2` y SY-F-06 `(sin(pi/6))^-1=2`, traducidos expresamente del LaTeX del fixture a sintaxis del backend.
- Plus nuevo test `backend/tests/test_syntax309_syf_numeric.py`, commit técnico `97178705a78d570b06aa0e9c8bbb238eec16a0c0`. No cubre conversión MathLive, UI ni demás 46 casos, y no modifica producto.
- CI automático Plus SHA técnico: cumulative `38381825940` QUEUED y H1d `38381826053` IN_PROGRESS al observar. No atribuir PASS anticipado.
- Siguiente paso exacto Frente B: verificar resultados/logs del SHA, diagnosticar fallos; añadir testigos equivalentes en Lite para SY-F-06/09 y continuar SY-F según matriz, con pruebas de parser/MathLive y UI separadas. Frente A DIST/SG28 conserva su bloqueo multinodo sin impedir este trabajo.


## 2026-10-13 — SY-F primeras pruebas: discrepancia Lite detectada, no ocultar
- Plus commit `97178705a78d570b06aa0e9c8bbb238eec16a0c0` gates cumulative `38381825940` y H1d `38381826053` SUCCESS. Plus acumulativo backend 961 PASS/1 XFAIL/1 warning; frontend 757 PASS/28 TODO.
- Lite commit `d0501408c4450147b0cac0e8bc5bc0a79a388a03` añadió casos SY-F-06 y SY-F-09 desde el LaTeX oficial, con parser + motor. Gates build `38384832377` y H1d `38384832433` SUCCESS; cumulative `38384832390` FAILURE: SY-F-09 `\\sin\\frac{\\pi}{6}` devuelve NaN, SY-F-06 pasa. 1103 PASS, 1 FAIL, 30 TODO. No clasificar aún el NaN como parser o motor sin diagnóstico.
- Lite commit `ecd6ae6683ea002a8f3437af4ed046b21aa1d903` añadió assertion diagnóstica con input/parsed/raw/numeric conservando test FAIL si el error persiste. Nuevos gates `38385126363` build, `38385126389` H1d, `38385126660` cumulative, inicialmente QUEUED. Esta intervención no pretende arreglar ni silenciar la discrepancia.
- Próximo objetivo: leer el log de la nueva corrida y corregir la causa identificada en Lite, protegiendo SY-F-06 y otros canales, después revalidar CI; SY-F global sigue abierto. SG28/DIST sigue su frente independiente.


## 2026-10-13 — SY-F-09 diagnostic exact rational and correction
- Plus baseline initial SY-F `97178705a78d570b06aa0e9c8bbb238eec16a0c0`: cumulative `38381825940` SUCCESS (backend 961 PASS, 1 XFAIL, 1 warning; frontend 757 PASS, 28 TODO), H1d `38381826053` SUCCESS.
- Lite first test SHA `d0501408c4450147b0cac0e8bc5bc0a79a388a03`: cumulative `38384832390` FAIL on SY-F-09 NaN (1103 PASS, 1 FAIL, 30 TODO), build `38384832377` and H1d `38384832433` SUCCESS.
- Diagnostic Lite SHA `ecd6ae6683ea002a8f3437af4ed046b21aa1d903`, cumulative `38385126660` FAIL confirmed parsed=`sin((pi)/(6))`, raw=`1/2`, numeric=`NaN`. Thus parser and engine delivered correct exact rational; failure is numeric formatting/normalization inside test harness.
- Corrective Lite commit `6f3f13573664cd50ccc1df159eba7f2357e3175f` uses `evaluate(float(raw))` for rational fallback rather than `float(parsed)`; preserves original LaTeX input and numeric expectations for SY-F-06/09, no product change. Gates cumulative `38385242490`, build `38385242481`, H1d `38385242583` IN_PROGRESS when checked. PASS not assumed.
- Next: check these new gates, investigate any red, then progress SY-F remaining 46 IDs with separate channel/oracle evidence. SG28/DIST unchanged.


## 2026-10-13 — SY-F-03 argumento potenciado vs función potenciada
- Baseline Lite SHA `6f3f13573664cd50ccc1df159eba7f2357e3175f`: build `38385242481`, cumulative `38385242490`, H1d `38385242583` SUCCESS. El caso SY-F-09 devuelve exacto `1/2`; corrección del harness validada.
- Nuevos testigos SY-F-03: `sin(x^2)` con x=2 = sin(4), y NO `sin(2)^2`. Lite original LaTeX desde el fixture SY-F-03 + parser + motor, commit `086688e1f75f017bbe47293dabaa2a63b531bc13`; Plus backend sintaxis adaptada + `/api/v1/evaluate` con substitución, commit `0965e4acfd6bb31cc298857f4588c4a3d64707f1`.
- CI Lite: build `38385733419` SUCCESS, cumulative `38385733495` y H1d `38385733477` IN_PROGRESS; CI Plus cumulative `38385778326` y H1d `38385778379` QUEUED al registrar. No atribuir PASS del nuevo test todavía.
- Siguiente: verificar ambos acumulativos, diagnosticar fallo si existe, extender SY-F a potencia de función `sin^2`, inversa `sin^-1` y recíproco entre paréntesis en sus canales respectivos. 48 SY-F siguen sin certificación integral; SG28/DIST separado.


## 2026-10-13 — SY-F-03 witnessed argument-vs-function exponent; diagnostic CI
- Lite baseline `6f3f13573664cd50ccc1df159eba7f2357e3175f`: cumulative `38385242490`, build `38385242481`, H1d `38385242583` SUCCESS.
- New SY-F-03 discriminating witness x=2: sin(x^2)=sin(4), not sin(x)^2. Lite LaTeX fixture parser+engine commit `086688e1f75f017bbe47293dabaa2a63b531bc13`; Plus HTTP backend expression `sin(x^2)` with substitutions commit `0965e4acfd6bb31cc298857f4588c4a3d64707f1`.
- Lite first cumulative `38385733495` FAIL (1104 PASS, 1 FAIL, 30 TODO), parser produced `sin(x^(2))` but numeric `float(...)` witness yielded NaN; build `38385733419` SUCCESS. Classification not product until the numeric conversion path is isolated.
- Corrective Lite harness SHA `c646093fd0423fad86e6582d5e49d2dc134de368` separates `evaluate(substituted)` symbolic result and `evaluate(float(exact))` fallback, following SY-F-09. Gates new SHA: cumulative `38385919300`, H1d `38385919268`, build `38385919258` QUEUED at observation; no PASS assumed. Plus cumulative `38385778326`, H1d `38385778379` IN_PROGRESS at observation.
- Next task: inspect both cumulative logs on these exact technical SHAs, fix regressions if any; then SY-F-04/05 function exponent vs arcsine, with distinct oracles and declared channels. SY-F 48 total still OPEN, SG28/DIST separately BLOCKED.


## 2026-10-13 — SY-F-03 CI diagnostic and targeted harness correction
- Plus SHA `0965e4acfd6bb31cc298857f4588c4a3d64707f1`: H1d run `38385778379` SUCCESS; cumulative `38385778326` SUCCESS. These runs verify their respective gates only, not full Syntax309 or DIST.
- Lite SHA `c646093fd0423fad86e6582d5e49d2dc134de368`: cumulative `38385919300` FAILURE, 1104 PASS / 1 FAIL / 30 TODO; failure `tests/syntax309SyFNumeric.audit.test.ts` SY-F-03, parsed `sin(x^(2))` and numeric witness not finite. H1d `38385919268` and build `38385919258` SUCCESS.
- Lite technical fix `32dc8000627ee4995d1e3e84dbb2339e8adc4f34`: test-only normalization of Algebrite displayed floats with trailing `...` or `…`, keeping independent numeric comparator `sin(4)` versus `sin(2)^2` and recording substituted/exact/floated diagnostics. This is a harness hypothesis pending CI, not a product fix and not yet a PASS.
- Automatically triggered Lite runs for fix SHA: cumulative `38387086026`, H1d `38387086047`, build `38387086025`, initially QUEUED. Do not promote to PASS until job/log conclusion.
- Next executable action: inspect those three Lite runs on fix SHA, diagnose failures and rerun by real technical commit if necessary; then begin SY-F-04/05 function exponent versus inverse function using fixture-linked independent numeric witnesses, respecting separation of parser, mathematical engine and HTTP/UI. SG28/DIST remains BLOCKED for real multinode evidence; Syntax309 SY-F 48-case certification remains OPEN.


### 2026-10-13 — SY-F-03 second diagnostic (literal ellipsis regex)
- Lite first fix SHA `32dc8000627ee4995d1e3e84dbb2339e8adc4f34`, cumulative `38387086026` FAILED (1104 PASS, 1 FAIL, 30 TODO): diagnostic confirmed `parsed=sin(x^(2))`, `substituted=sin((2)^(2))`, `exact=sin(4)`, `floated=-0.756802...`. The regex for removing the trailing literal `...` accidentally used doubled backslashes; this is a HARNESS regex error, not mathematical engine failure. Build `38387086025` SUCCESS; H1d `38387086047` was in progress at last query.
- Lite second test-only fix SHA `cd5edeaeba532e0ac3cc37573edc39708f7312ab`: regex corrected to recognize three literal periods or Unicode ellipsis; independent numeric oracles remain unchanged. CI automatically triggered cumulative `38387187815`, H1d `38387187838`, build `38387187784` (initially QUEUED). PASS pending actual run/log results.
- Next: verify gates of the second SHA, continue SY-F-04/05 only after classifying regressions; SG28/DIST multinode remains BLOCKED, and Syntax309 full certification OPEN.


## 2026-10-13 — SY-F-03 validated and SY-F-04/05 new test witnesses
- Lite SY-F-03 harness correction `cd5edeaeba532e0ac3cc37573edc39708f7312ab`: cumulative `38387187815` SUCCESS and build `38387187784` SUCCESS. Earlier red `38387086026` was a regex escape defect in a test normalization of Algebrite trailing `...`; no mathematical engine change.
- SY-F-04 official fixture `\\sin^{2}\\frac{\\pi}{6}` expected `1/4` (function power) and SY-F-05 `\\sin^{-1}\\frac{1}{2}` expected `pi/6` (inverse function, not reciprocal). New Lite tests use fixture LaTeX → parser → evaluator and independent numeric anchors; technical SHA `0591b1b399f17c4289b9cac36f3d521a950e759b`. Lite cumulative `38387355192`, build `38387355153`, H1d `38387355236` IN_PROGRESS at initial inspection.
- Plus backend HTTP tests for explicit backend syntax `(sin(pi/6))^2` and `asin(1/2)` added at SHA `acfed7d28ba49677b80ed131736ccc5dd5c886ef`; cumulative `38387325797` and H1d `38387325758` IN_PROGRESS at initial inspection. Backend translation alone does NOT certify Plus MathLive input or UI.
- Next executable step: inspect new CI logs on both test SHAs, classify reds at parser/harness/engine/HTTP, correct defects and rerun; expand SY-F coverage only with fixture-grounded assertions. SY-F remains OPEN; SG28/DIST distributed acceptance remains BLOCKED.


## 2026-10-13 — SY-F-04/05 gates verified and SY-F-07 regression introduced
- Lite SHA `0591b1b399f17c4289b9cac36f3d521a950e759b`: cumulative run `38387355192`, build `38387355153` and H1d `38387355236` all SUCCESS. Tests include original LaTeX fixture and engine numerical witnesses for function squared versus arcsine.
- Plus SHA `acfed7d28ba49677b80ed131736ccc5dd5c886ef`: cumulative `38387325797` and H1d `38387325758` SUCCESS. HTTP backend witnesses are not an E2E assertion for the original MathLive LaTeX.
- Next case SY-F-07 from official fixture: `\\tan^{-1}1` expected `\\pi/4`, not reciprocal tangent. New tests: Lite `tests/syntax309SyFNumeric.audit.test.ts` SHA `9e04a54431ffc960fb0c72dea0d5fa6af1d5faa4`; Plus `backend/tests/test_syntax309_syf_numeric.py` SHA `4d1997272d407c7c49f1c21bbaaa3244c5483f3b`. Numerical oracle anchored to Math.PI/4 or math.pi/4 and explicitly rejects reciprocal tangent.
- Automatically triggered Lite cumulative `38388159600`, H1d `38388159478`, build `38388159524`; Plus cumulative `38388166545`, H1d `38388166509`. At initial query these runs were in progress/queued, NOT yet certified PASS.
- Next action: inspect these exact SHA gates, diagnose/fix any regression, then continue SY-F-01/02/08 interpretation with explicit parser channel, independently of multinode SG28/DIST BLOCKED.


## 2026-10-13 — SY-F scope CI follow-up
- SY-F-07 PASS gates: Lite cumulative 38388159600, H1d 38388159478, build 38388159524; Plus cumulative 38388166545 and H1d 38388166509.
- SY-F-01/02/08 parser+engine witnesses added in Lite SHA d990ae722477f6a08484050a11291f8e018e980a. Cumulative 38388911993, H1d 38388911908, build 38388911881 were running at check time.
- Plus explicit-backend-syntax HTTP controls added in SHA 28ebeed5080e36dcda9b3d9c593074f76cee3a84. Cumulative 38388936829, H1d 38388936816 were queued. This does not certify Plus frontend LaTeX interpretation.
- Next: inspect gates for both latest SHAs and fix regressions, keeping Syntax309 SY-F open and SG28/DIST blocked pending real multinode evidence.


## 2026-10-13 — SY-F-01/02/08 green; SY-F-10/11/12 tests published
- Previous scope tests SY-F-01/02/08 gates confirmed SUCCESS on Lite SHA d990ae722477f6a08484050a11291f8e018e980a: cumulative 38388911993, H1d 38388911908, build 38388911881. Plus SHA 28ebeed5080e36dcda9b3d9c593074f76cee3a84: cumulative 38388936829, H1d 38388936816 SUCCESS. HTTP explicit syntax witnesses in Plus do not certify MathLive LaTeX parsing.
- Next fixture cases: SY-F-10 explicit sine of 30 degrees = 1/2; SY-F-11 unparenthesized 30-degree sine = 1/2; SY-F-12 cos^2(x)+sin^2(x)=1. Lite parser + engine tests at technical SHA ae4efd09f4beb9ef7fc3691756b4a42554f1fbd5; Plus backend HTTP controls at SHA 19c65d7efafc5f15fc3e60b2d9544cb1807ec839. Independent numeric witnesses used without product modifications. Plus HTTP cases test explicitly translated backend syntax, not degree-glyph UI input.
- New Lite cumulative run 38390792684, H1d 38390792766, build 38390792697 in progress at observation. Plus cumulative 38390827207, H1d 38390827147 queued at observation. Do not mark this batch PASS without logs and gate conclusions.
- Next: verify runs by exact technical SHA, classify red as engine/parser/harness/oracle/capability, preserve permanent regression; then progress SY-F-13/14. Syntax309 and IN625 remain OPEN; SG28/DIST real independent-node certification remains BLOCKED.


## 2026-10-13 — SY-F-13/14 log power witnesses
- SY-F-10/11/12 fully verified before this change: Lite cumulative 38390792684, H1d 38390792766, build 38390792697 SUCCESS on SHA ae4efd09f4beb9ef7fc3691756b4a42554f1fbd5; Plus cumulative 38390827207 and H1d 38390827147 SUCCESS on SHA 19c65d7efafc5f15fc3e60b2d9544cb1807ec839.
- Official Syntax309 SY-F-13 is ln(x^2), not ln(x)^2; SY-F-14 convention is (ln(x))^2. Independent discriminating numeric substitution x=2 added to Lite fixture-LaTeX parser/engine test at SHA fbc6ffa3c0c588101be70f68f60ba274dcd6773c; and Plus backend explicit log syntax HTTP controls at SHA 4c8f0591a7102c62fcede19fed7442a6ad0d37a1. Both tests reject the other interpretation. No production changes.
- New Lite cumulative 38441960257, build 38441960218, H1d 38441960505; Plus cumulative 38441985642 and H1d 38441985509 started automatically and were IN_PROGRESS at first inspection. Not a PASS until complete.
- Next executable step: verify the two gates on these SHAs, diagnose/fix any regressions, then continue SY-F-15/16/17 with declared base10 versus natural logarithm contract. Plus explicit backend log means ln, but original LaTeX MathLive parsing has not been certified by these backend tests. Syntax309 remains OPEN; SG28/DIST real multinode certification remains BLOCKED.


## 2026-10-13 — SY-F-13/14 Plus red diagnosed, SY-F-15/16/17 introduced
- Prior Lite SY-F-13/14 SHA fbc6ffa3c0c588101be70f68f60ba274dcd6773c: cumulative 38441960257, H1d 38441960505, build 38441960218 all SUCCESS.
- Plus SY-F-13/14 prior SHA 4c8f0591a7102c62fcede19fed7442a6ad0d37a1: cumulative 38441985642 FAILURE (973 PASS, 2 FAIL, 1 XFAIL in backend; frontend and H1d 38441985509 SUCCESS). The tests mistakenly used log(x) expecting natural logarithm; HTTP log is base 10, giving 0.60205999 versus expected ln(4)=1.38629 and 0.090619 versus expected ln(2)^2=0.480453. Classification ORACLE/HARNESS, not product regression. Corrected to explicit ln at Plus SHA 0d37c272af8124dc88655de0fb6d0bb38f08ea10. CI cumulative 38444539787 and H1d 38444539565 were running at observation. Do not mark that fix PASS until logs conclude.
- Next Syntax309 SY-F-15: common log(100)=2; SY-F-16 log base 2 of 8=3; SY-F-17 log base 10 of 1000=3, derived from official fixture. Lite original LaTeX parser/engine witnesses technical SHA 097a9c8b46904eedc636ef509b23d4f88f635754, cumulative 38444579750, build 38444579680, H1d 38444579824 in progress. Plus explicit backend HTTP syntax test SHA a8f5f841a5c9d8ea132b6f61b2d35b3f1029500e, cumulative 38444610175 and H1d 38444610469 in progress. Plus backend witnesses do not establish editor MathLive parsing.
- Next: check both latest cumulative jobs/logs on exact SHA; diagnose failures (especially supported log base syntax) and fix without weakening contract; then proceed to SY-F-18 onward. SG28/DIST remains BLOCKED for real distributed multi-host cancellation proof, Syntax309 overall OPEN.


## 2026-10-13 — SY-F-18/19/20 test witnesses published
- Previous batch SY-F-15/16/17: Lite SHA 097a9c8b46904eedc636ef509b23d4f88f635754 cumulative 38444579750, H1d 38444579824 and build 38444579680 SUCCESS. Plus SHA a8f5f841a5c9d8ea132b6f61b2d35b3f1029500e cumulative 38444610175 and H1d 38444610469 SUCCESS. Plus corrected natural-log oracle SHA 0d37c272af8124dc88655de0fb6d0bb38f08ea10 cumulative 38444539787 SUCCESS.
- Next official cases SY-F-18: log base2 x plus one (x=8 expected 4, not log2(9)); SY-F-19: change of base log_a(b) (a=2,b=8 expected 3); SY-F-20: ln(e)=1. Lite original LaTeX parser-to-engine witnesses commit 237ad964cc65a8057933d298dab67d76f3d24f08; Plus explicitly translated HTTP backend witnesses commit bf8de04029dde8c04dbce5cf4ced36195ceae6a8. Plus backend tests do not certify LaTeX editor or MathLive.
- Auto CI Lite cumulative 38447892977, build 38447892954, H1d 38447893072 in progress at initial check. Plus cumulative 38447931604 and H1d 38447931380 queued at initial check. No PASS claimed until verified. Next inspect these gates and logs, diagnose/fix regressions, then continue SY-F-21 onward; SY-F and Syntax309 remain open and SG28/DIST real multinode still BLOCKED.


## 2026-10-13 — SY-F-18 parser regression and scoped correction
- Original new Lite witness SHA 237ad964cc65a8057933d298dab67d76f3d24f08 cumulative 38447892977 FAIL (1121 PASS, 1 FAIL, 30 TODO), H1d 38447893072 and build 38447892954 SUCCESS. SY-F-18 original LaTeX `\\log_{2}x+1` threw `Carácter no reconocido: "_"`; SY-F-19 and SY-F-20 passed. Root: normalize.ts base-log rewrite expected the bare argument at expression end, so an additive tail prevented rewriting and left underscore for tokenizer. Classification PRODUCT PARSER, not a numeric oracle failure.
- Narrow correction Lite `src/engine/parsing/normalize.ts` SHA 5b62c0dfdf58a60d53396a5c98e4cc003d2bee02: rewrite base-log immediately followed by a bare letter and additive tail, preserving the tail; original fixture test SY-F-18 stays unchanged. New cumulative 38448248216, build 38448248275, H1d 38448247962 QUEUED on first check. Verify gate and check side effects before closing.
- Plus test SHA bf8de04029dde8c04dbce5cf4ced36195ceae6a8: H1d 38447931380 SUCCESS; cumulative 38447931604 IN_PROGRESS at last check. Plus cases represent backend-translated syntax, not MathLive glyphs.
- Next exact task: inspect latest Lite and Plus cumulative results/logs and correct any further failures, add a regression for additive and subtractive base-log scope if needed, then continue SY-F-21+. Syntax309 is OPEN; SG28/DIST real multinode BLOCKED.


## 2026-10-13 — SY-F-21/22/23 hyperbolic witnesses
- Baseline SY-F-18/19/20: Lite SHA 5b62c0dfdf58a60d53396a5c98e4cc003d2bee02 cumulative 38448248216, build 38448248275, H1d 38448247962 all SUCCESS. Plus SHA bf8de04029dde8c04dbce5cf4ced36195ceae6a8 cumulative 38447931604 and H1d 38447931380 SUCCESS.
- Published official fixture-backed Lite numerical tests SY-F-21 arsinh(1), SY-F-22 sinh^-1(1), SY-F-23 cosh^2(x)-sinh^2(x)=1 at SHA 80521538ea7b4af36e94916bf6ab673872f7429f. Lite CI for this SHA was not yet discoverable through Actions list at inspection: no run/PASS asserted.
- Published Plus explicitly translated HTTP backend witnesses for same cases at SHA 8dd6a03d8bf7b37f52c209fd029e2b12ca4ea80c. Plus cumulative run 38449665940 QUEUED, H1d 38449665893 IN_PROGRESS at initial inspection. These do not certify original MathLive LaTeX.
- Next: verify or diagnose Lite push-triggering CI, inspect both SHA-specific logs/results, fix mathematical/parser issues without weakening oracles, then advance SY-F-24 onward. Syntax309 remains OPEN; SG28/DIST multinode remains BLOCKED.


## 2026-10-13 — SY-F-21/22/23 CI reconciliation
- Confirmed SY-F-18/19/20 after Lite parser fix 5b62c0dfdf58a60d53396a5c98e4cc003d2bee02: cumulative 38448248216, H1d 38448247962, build 38448248275 SUCCESS. Plus SHA bf8de04029dde8c04dbce5cf4ced36195ceae6a8: cumulative 38447931604, H1d 38447931380 SUCCESS.
- SY-F-21 arsinh(1), SY-F-22 sinh^(-1)(1) as inverse hyperbolic sine, SY-F-23 cosh^2(x)-sinh^2(x)=1: existing new Lite test commit 80521538ea and Plus 8dd6a03d8b confirmed on canonical branch. Lite cumulative 38449725664, build 38449725830, H1d 38449725564 IN_PROGRESS at last check; Plus cumulative 38449665940 and H1d 38449665893 IN_PROGRESS at last check. No PASS claimed for this batch yet.
- Next: inspect those gates by SHA, diagnose regressions, then proceed to official SY-F-24/25/26 (sech(0)=1, exp(2)=e^2, exp(ln3)=3) preserving original LaTeX path in Lite and backend-only classification in Plus. Overall Syntax309 OPEN, SG28/DIST real multinode BLOCKED.


## 2026-10-13 — SY-F-21/22/23 CI diagnostics (do not certify)
- Lite SHA 80521538ea7b4af36e94916bf6ab673872f7429f cumulative run 38449725664 FAILED: 1122 PASS, 3 FAIL, 30 TODO. Build 38449725830 SUCCESS, H1d 38449725564 was still in progress at last check.
- Lite SY-F-21 original `\\operatorname{arsinh}1` parsed `a*r*sinh*1` instead of inverse hyperbolic sine. SY-F-22 `\\sinh^{-1}1` parsed `sinh^(-1)*1` rather than inverse function. SY-F-23 `\\cosh^{2}x-\\sinh^{2}x` produced numeric 0 instead of 1 at some witness. These are real parser/engine routing regressions, not proof of oracle error. Do not mark PASS or replace official LaTeX with easier backend notation.
- Plus SHA 8dd6a03d8bf7b37f52c209fd029e2b12ca4ea80c cumulative 38449665940 and H1d 38449665893 initially in progress; Plus backend-only tests cannot certify input MathLive syntax.
- Next executable: inspect Plus results, implement isolated normalization for operatorname arsinh and unparenthesized sinh^-1 on Lite, then diagnose powered hyperbolic expression SY-F-23; keep discriminating independent numerical oracles; rerun cumulative and H1d on technical SHA. SG28/DIST multinode remains BLOCKED, Syntax309 remains OPEN.


### 2026-10-13 — Late CI reconciliation SY-F-21/22/23
- Plus SHA 8dd6a03d8bf7b37f52c209fd029e2b12ca4ea80c: cumulative 38449665940 and H1d 38449665893 both SUCCESS. This certifies backend-translation witnesses only, not original MathLive LaTeX.
- Lite SHA 80521538ea7b4af36e94916bf6ab673872f7429f: H1d 38449725564 SUCCESS and build 38449725830 SUCCESS, but cumulative 38449725664 FAILURE with SY-F-21/22/23 3 red. Thus bilateral case closure BLOCKED on Lite original LaTeX parser/engine. Next: repair parser routing for hyperbolic inverses and powered hyperbolic identity, preserve tests and rerun gates.


### 2026-10-13 — Parser patch for inverse hyperbolics submitted
- Technical Lite parser SHA 01ff12eebcd122f08979eeaf41e63691aea0cef3 added explicit operatorname arsinh and bare-number sinh^{-1} handling without modifying mathematical oracles; cumulative 38450004786, H1d 38450004783, build 38450005092 were in progress at observation. This is not an accepted PASS yet. SY-F-23 powered cosh/sinh remains independently unresolved.


## 2026-10-13 — SY-F-21/22/23 follow-up fixes and CI
- Plus SHA 8dd6a03d8b cumulative 38449665940 and H1d 38449665893 SUCCESS (backend explicit syntax only).
- Lite initial hyperbolic SHA 80521538ea cumulative 38449725664 FAILURE: SY-F-21 operatorname arsinh parsed as a*r*sinh*1, SY-F-22 unparenthesized inverse sinh misrouted, SY-F-23 powered hyperbolic identity evaluated incorrectly. Earlier parser patch 01ff12eebcd122f08979eeaf41e63691aea0cef3 restored `asinh(1)` parsing for SY-F-21/22, but cumulative 38450004786 FAILURE remained because Algebrite does not evaluate asinh numerically and SY-F-23 still failed. The true calculator uses numericFallback for asinh, documented in numericFallback.ts.
- Product parser patch Lite 7e62c12111d47c69f8068009c59f27173e619cf7 extends normalizePoweredFunctions to sinh/cosh/tanh/csch/sech/coth. Test correction Lite 4cd09cb6f89f2df5891ad438a09ed376a1d4172e validates asinh via compileNumeric(parsed) used by actual fallback, preserving independent Math.asinh(1) and full SY-F-23 identity witnesses. No oracles weakened, no Plus code change. Latest Lite SHA cumulative 38450262114, build 38450262198, H1d 38450261923 initially QUEUED; must inspect results before PASS.
- Next: inspect latest Lite gates/logs and fix any true parser/numeric regressions, verify cumulative and H1d at exact SHA, then advance SY-F-24/25/26. Syntax309 OPEN; SG28/DIST multinode BLOCKED.


### 2026-10-13 — SY-F-23 numeric display diagnostic
- Lite SHA 4cd09cb6f89f2df5891ad438a09ed376a1d4172e cumulative 38450262114 FAILURE: only SY-F-23 red (1124 PASS, 1 FAIL, 30 TODO); parsed grouping correct `(cosh(x))^(2)-(sinh(x))^(2)` and Algebrite exact display `1.000000...` at x=1; Number on display ellipsis incorrectly yielded NaN. SY-F-21/22 now PASS, using compileNumeric for inverse hyperbolic sine.
- Follow-up harness correction SHA aee5eb3509ae35ec086244668f40df9c5a6c8506 evaluates the original parsed hyperbolic identity using compileNumeric(parsed,'x')(x) at 0,1,2 and still demands result 1. Cumulative 38450427712, H1d 38450427659, build 38450427540 IN_PROGRESS at observation. No PASS presumed until conclusion.


## 2026-10-13 — SY-F-21/23 validated; SY-F-24/25/26 submitted
- Lite hyperbolic parser/fallback and harness final technical SHA aee5eb3509ae35ec086244668f40df9c5a6c8506: cumulative 38450427712, H1d 38450427659 and build 38450427540 SUCCESS. Plus explicit HTTP backend test SHA 8dd6a03d8b: cumulative 38449665940 and H1d 38449665893 SUCCESS. Earlier Lite red cases SY-F-21/22/23 resolved without relaxing independent oracles. No claim of Plus MathLive original input certification.
- Official next SY-F-24 sech(0)=1, SY-F-25 exp(2)=e^2, SY-F-26 exp(ln3)=3 now have permanent regression witnesses: Lite original LaTeX parser + compileNumeric test SHA a3c1be6ccdf858618aac017892a23b0f173bbf16; Plus explicit backend HTTP test SHA 8d970f9a76e8a066a4c373bfe4b101266eec5fdb. New Lite cumulative 38474832855, H1d 38474832864, build 38474832913; Plus cumulative 38474867350, H1d 38474867405. Build Lite SUCCESS, other gates in progress at check. PASS not assumed.
- Next: inspect latest technical SHA gate outcomes/logs, repair any red at the proper layer, then move to subsequent official SY-F cases. Syntax309 and IN625 OPEN; SG28/DIST real multinode BLOCKED.


## 2026-10-13 — SY-F-24/25/26 initial CI and Lite harness repair
- Lite test SHA a3c1be6ccdf858618aac017892a23b0f173bbf16 cumulative 38474832855 FAILURE: 1127 PASS, 1 FAIL, 30 TODO; only SY-F-24 `sech(0)` reported unknown function in direct compileNumeric(parsed). SY-F-25/26 passed. Build 38474832913 SUCCESS. This is a test routing issue pending verification; parser has a production rewriteReciprocalFunctions() primitive for sech to 1/cosh, and numerical oracle sech(0)=1 unchanged.
- Lite targeted witness patch SHA 7f91f8f6bf42a8480a9a8f991af5af64b453724e invokes production rewriteReciprocalFunctions(parsed) before compileNumeric. Auto cumulative 38475131488, H1d 38475131512, build 38475131742 initially QUEUED; do not declare PASS before logs.
- Plus SHA 8d970f9a76e8a066a4c373bfe4b101266eec5fdb cumulative 38474867350 and H1d 38474867405 SUCCESS. Plus verifies translated backend syntax only. Next: verify Lite latest gate and proceed official SY-F-27 onward, while SY-F global OPEN and DIST multinode BLOCKED.


### 2026-10-13 — SY-F-24 original LaTeX parser regression
- Lite SHA a3c1be6ccdf858618aac017892a23b0f173bbf16 cumulative 38474832855 FAILED: one case SY-F-24 unknown numeric function `sech`, whereas SY-F-25/26 passed. Plus SHA 8d970f9a76e8a066a4c373bfe4b101266eec5fdb cumulative 38474867350 and H1d 38474867405 SUCCESS for explicit HTTP syntax.
- Lite test-only attempt 7f91f8f6bf42a8480a9a8f991af5af64b453724e reused production reciprocal rewrite but cumulative 38475131488 still FAILED for SY-F-24, build 38475131742 and H1d 38475131512 SUCCESS. Therefore not a formatting issue or certified resolution; original `\\operatorname{sech}0` requires parser normalization.
- Lite product-parser patch `src/engine/parsing/normalize.ts` SHA 5f6894bd5d21836b26860555b68adf5c241e7e2a converts the official bare-numeral operatorname sech to a function call before generic alias expansion. Auto cumulative 38475327031, H1d 38475326881 and build 38475326959 in progress at first observation. No PASS assumed; keep independent sech(0)=1 test.
- Next: verify those gates and inspect SY-F-24 failure if persistent; preserve regression and sync both repositories. Only then continue SY-F-27 onward. Syntax309 OPEN and SG28/DIST independent hosts BLOCKED.


## 2026-10-13 — SY-F-24 gate validated; SY-F-27/28 tests introduced
- Latest Lite parser technical SHA 5f6894bd5d21836b26860555b68adf5c241e7e2a: cumulative 38475327031, H1d 38475326881 and build 38475326959 all SUCCESS. Plus previously published SY-F-24/25/26 backend test SHA 8d970f9a76e8a066a4c373bfe4b101266eec5fdb: cumulative 38474867350 and H1d 38474867405 SUCCESS. Classification: source LaTeX parser+numeric witnesses Lite; translated backend controls Plus.
- Next official cases SY-F-27 sin(x)sin(x)=sin(x)^2 and SY-F-28 sin(cos(tan(0)))=sin(1) added with independent numerical oracles. Lite original fixture LaTeX parser-to-compileNumeric technical SHA 430631ab044adade53058b8f0878e06e367aaca2, cumulative 38480098881, H1d 38480098957, build 38480098978 in progress at first observation. Plus explicit backend HTTP test SHA df4aa7cffa7e599cfb45d32a636163fa75796c2b, cumulative 38480129508, H1d 38480129369 queued. Do not declare PASS until verifying jobs/logs at those SHA.
- SY-F-29 arcsin(2) domain behavior remains next mandatory case; must check public error/complex contract rather than assume HTTP 200 or complex. Syntax309 OPEN; SG28/DIST multinational acceptance remains BLOCKED.


## 2026-10-13 — SY-F-27/28 verified; SY-F-29 regression submitted
- Confirmed Lite SHA 430631ab044adade53058b8f0878e06e367aaca2 cumulative 38480098881, H1d 38480098957, build 38480098978 SUCCESS.
- Confirmed Plus SHA df4aa7cffa7e599cfb45d32a636163fa75796c2b cumulative 38480129508 and H1d 38480129369 SUCCESS. Plus witnesses are backend translations, not source MathLive LaTeX.
- Added SY-F-29 original LaTeX real-domain diagnostic in Lite tests/syntax309SyFNumeric.audit.test.ts at SHA 6a82a4749727df5f24a2353a260f61cf85bb93b4. New push-triggered cumulative run 38487203521, H1d 38487203614, build 38487203883 (initially QUEUED).
- Added Plus translated HTTP SY-F-29 contract regression in backend/tests/test_syntax309_syf_numeric.py at SHA 0df8bc5cca5e06b356a301c92de02173a7a179aa. New cumulative 38487186347 and H1d 38487186068 (initially IN_PROGRESS).
- No PASS claimed on SY-F-29 before completion/log verification; classify red as product/parser/harness and correct accordingly. Next: verify these SHA-specific runs, reconcile official SY-F-29 semantics, then proceed to SY-F-30 and SY-F-31. Syntax309 OPEN; SG28/DIST real independent hosts BLOCKED.


### 2026-10-13 — SY-F-29 first red classified and regression revised
- Lite first cumulative on SHA 6a82a4749727df5f24a2353a260f61cf85bb93b4 run 38487203521 FAILURE: 1130 PASS / 1 FAIL / 30 TODO. The failing assertion incorrectly double-escaped its JS regex; parsed source `\\arcsin2` was correctly recognized as `arcsin(2)`. Classify this first red as HARNESS, not product.
- Corrected parser assertion at Lite technical test SHA f6cb2cde5f64099dee9f07b031590fd1bc3c567a; new cumulative 38487294016, H1d 38487293967, build 38487294111 queued initially. Independent real-domain check unchanged.
- Plus SY-F-29 translated-backend test SHA 0df8bc5cca5e06b356a301c92de02173a7a179aa, cumulative 38487186347 and H1d 38487186068 in progress at last observation. No SY-F-29 PASS until logs verified on both SHA. Next: verify gates, diagnose any remaining real-domain handling red, then SY-F-30/31.


## 2026-10-13 — SY-F-29 PASS and SY-F-30/31 regression submitted
- Lite original LaTeX SY-F-29 technical SHA f6cb2cde5f64099dee9f07b031590fd1bc3c567a cumulative 38487294016, H1d 38487293967 and build 38487294111 all SUCCESS. Plus translated HTTP SY-F-29 SHA 0df8bc5cca5e06b356a301c92de02173a7a179aa cumulative 38487186347 and H1d 38487186068 SUCCESS. Prior Lite red was a test regex escape defect, repaired without oracle weakening.
- Published SY-F-30 and SY-F-31 original fixture-LaTeX numeric witnesses (root scope sqrt(x)*y != sqrt(x*y), bare sqrt3) Lite SHA 389e35dfa30f8a476bfa3264d5e81e4a7a79a646: cumulative 38487550871, build 38487550905, H1d 38487550870 IN_PROGRESS initially.
- Published corresponding explicit HTTP backend witnesses Plus SHA ea3d248eea8c4d54da7b06969f19436842d46df8: cumulative 38487574532, H1d 38487574472 IN_PROGRESS initially. Plus still does not certify source MathLive syntax.
- Next executable: verify new runs and logs, fix any parser/product/harness red with permanent regression; proceed to SY-F-32 per official matrix. Syntax309 OPEN; H2/SG28/DIST real multinode BLOCKED, no global IN625 closure.


## 2026-10-13 — SY-F-30/31 CI PASS; SY-F-32/33/34 indexed root regressions
- Confirmed Lite SY-F-30/31 SHA 389e35dfa30f8a476bfa3264d5e81e4a7a79a646 cumulative 38487550871, H1d 38487550870, build 38487550905 SUCCESS; Plus SHA ea3d248eea8c4d54da7b06969f19436842d46df8 cumulative 38487574532 and H1d 38487574472 SUCCESS.
- Official next fixtures SY-F-32 cube root 8 => 2, SY-F-33 cube root -8 => -2 real odd-root convention, SY-F-34 fourth root 16 => 2.
- Published permanent source LaTeX parser/numeric witnesses Lite SHA 22a2211bdbbfd502a53399302531e8b0214b10fb, cumulative 38488740551, H1d 38488739395, build 38488739412 in progress initially.
- Published explicit backend-only root(8,3), root(-8,3), root(16,4) HTTP controls Plus SHA 17345bfa9caee3381c9ebec642832b0359e06e41; cumulative 38488746945 and H1d 38488746890 queued initially. Plus controls are not original MathLive LaTeX E2E.
- Do not claim SY-F-32/33/34 PASS before SHA-matched logs and jobs complete. Next: classify potential red at correct layer, preserve real cube-root -8 oracle, rerun gates, then proceed official SY-F-35. Syntax309 OPEN; IN625/SG28/DIST multinode remains BLOCKED.


## 2026-10-13 — SY-F-32/34 CI reconciliation, SY-F-33 complex branch and SY-F-35
- Lite root fixtures SY-F-32/33/34 SHA 22a2211bdbbfd502a53399302531e8b0214b10fb: cumulative 38488740551, H1d 38488739395, build 38488739412 SUCCESS. This validates Lite original LaTeX numeric witnesses.
- Plus SHA 17345bfa9caee3381c9ebec642832b0359e06e41 cumulative 38488746945 FAILURE: backend 998 PASS, 1 FAIL, 1 XFAIL; SY-F-33 root(-8,3) returned result_approx=None rather than -2. Frontend and H1d SUCCESS. Root cause: explicit Plus `root` preserves complex principal branch by preexisting documented contract; real odd cube root is separate `cbrt` function. This is a translation/semantic contract mismatch in the test, not evidence to change generic complex root behavior.
- Added SY-F-35 nested sqrt(sqrt(16))=2 original LaTeX Lite SHA b0da60b69e7aea39dd295b8523a2c05c61ed0444; cumulative 38495623321, H1d 38495623299, build 38495623224 initially IN_PROGRESS. Added Plus explicit HTTP nested sqrt witness SHA 90750c0bfb4d88a906f46d13066aa3c96925b830.
- Plus follow-up SHA 583c6522dbfbcecdd901a4a22960554cda0ae037 tests `cbrt(-8)=-2` for real odd index and separately protects generic `root(-8,3)` complex principal behavior; cumulative 38495656506 and H1d 38495656445 initially IN_PROGRESS. Must verify logs; original Plus MathLive indexed-radical UI routing remains uncovered: do not certify full source LaTeX SY-F-33 by backend translated notation alone.
- Next: inspect gates on latest technical SHA, diagnose remaining reds, then study official SY-F-36 sqrt[n](x^n) parity/assumption contract without relaxing oracles. Syntax309 OPEN; IN625 H2/SG28/DIST independent-node certification BLOCKED.


### 2026-10-13 — SY-F-36 handoff
- Plus previous cumulative 38495656506 FAILED on text-only `I` oracle for root(-8,3); actual expression `2*(-1)**(1/3)` is complex principal with null real approximation. Corrected to independent SymPy numerical imaginary-part check in commit 20c6272d79f5d8377fcf39a8cf83c4c8d17b0119.
- Plus SY-F-36 concrete root parity test commit ff261e5ad5ecea2c9dd6e1c51b75cfaa5a00600d; cumulative 38499417987 / H1d 38499417816 pending.
- Lite SY-F-36 original indexed-root LaTeX test commit b67a7b86b62f1c01f8f369e5f418e948a62b2d0f; cumulative 38499448647 / H1d 38499448638 / build 38499448739 pending.
- These tests are concrete witnesses, not proof of symbolic generic n nor Plus original MathLive UI; no SY-F-36 PASS until SHA-specific results. Next: inspect CI, diagnose reds, then SY-F-37. Syntax309 OPEN; SG28/DIST BLOCKED.


## 2026-10-13 — SY-F-36 root regression diagnosed; SY-F-37 published
- Plus SY-F-36 backend concrete witnesses SHA ff261e5ad5ecea2c9dd6e1c51b75cfaa5a00600d cumulative 38499417987 and H1d 38499417816 SUCCESS. Original Plus MathLive symbolic-index coverage remains unverified.
- Lite SHA d1eccdbe9dd37e99967b2270e55f7087969e1f63 cumulative 38499593260 FAILURE (1141 pass, 1 fail, 30 TODO), H1d 38499593140 and build 38499593269 SUCCESS. Remaining case: source LaTeX sqrt[3]{(-3)^3} parsed as ((-3)^3)^(1/3), numeric fallback Math.pow(negative, fraction)=>NaN. Other SY-F-36 witnesses passed; this is real parser/numeric-routing defect, not a reason to relax the oracle.
- Lite parser patch SHA 4b7177ce3bbaaa5aa325e73e93e80fc53b6cc604 specifically handles a parenthesized negative numeric base with odd integer power under odd indexed root, preserving negative real result. Pending CI for that SHA: cumulative 38502030498, H1d 38502030501, build 38502030613.
- Added permanent SY-F-37 abs(-3)=3 regression on original LaTeX Lite SHA 196748e27af77865a5ee2d74082badf2e716f30c; cumulative 38502049649, H1d 38502049642, build 38502049660 initially IN_PROGRESS. Plus explicit backend HTTP test SHA fd829698f648b49fed343329b71a24f70e6d1886; cumulative 38502056646 and H1d 38502056839 initially QUEUED.
- No SY-F-36/37 Lite PASS or SY-F-37 Plus PASS asserted before SHA-specific CI. Generic symbolic n and Plus original MathLive routing still require independent testing. Next: verify all latest gates, diagnose regression if red, then official SY-F-38. Syntax309 OPEN; SG28/DIST multinode BLOCKED.


## 2026-10-13 — SY-F-37 CI reconciliation and SY-F-38/39 witnesses
- Confirmed Lite SHA 196748e27af77865a5ee2d74082badf2e716f30c cumulative 38502049649, H1d 38502049642, build 38502049660 SUCCESS, including previous SY-F-36 parser correction and SY-F-37 original LaTeX witness.
- Confirmed Plus SHA fd829698f648b49fed343329b71a24f70e6d1886 cumulative 38502056646 and H1d 38502056839 SUCCESS for translated backend tests.
- Added official source-LaTeX abs witnesses SY-F-38 left/right vert -3 and SY-F-39 operatorname abs(-3) in Lite tests/syntax309SyFNumeric.audit.test.ts SHA b72d070648b73443757602e9e63a3e77af7b63a0, cumulative 38503229851, H1d 38503229854, build 38503229842 initially IN_PROGRESS.
- Added corresponding backend-only explicit abs(-3) controls Plus backend/tests/test_syntax309_syf_numeric.py SHA 757c94423335df7372ec4cc319f02df9ae090cf4, cumulative 38503240594 and H1d 38503240614 initially QUEUED. Do not claim source MathLive paths certified by these Plus backend tests.
- Next exact objective: verify latest SHA-specific CI outcomes and logs, fix any red without weakening expected abs=3; proceed official SY-F-40 ambiguous nested bars with explicit convention/feedback oracle. Syntax309 OPEN; SG28/DIST real multinode BLOCKED.


### 2026-10-13 — SY-F-38/39 parser correction
- Lite original LaTeX witness SHA b72d070648b73443757602e9e63a3e77af7b63a0 cumulative 38503229851 failed only SY-F-38: unsupported `\\left\\vert ... \\right\\vert` delimiters; SY-F-39 passed (1144 pass, 1 fail, 30 TODO).
- Corrected Lite delimiter normalization to handle `\\left\\vert` and `\\right\\vert` as absolute bars before scanning; parser commit ef95355556749af4ed43aa4f22f86fc6e6e98ece. Push-triggered cumulative 38503390859, H1d 38503390756 and build 38503390748 queued at initial check; PASS pending.
- Plus SY-F-38/39 backend translated abs(-3) tests SHA 757c94423335df7372ec4cc319f02df9ae090cf4; cumulative 38503240594, H1d 38503240614 in progress. Plus does not certify source LaTeX delimiters.
- Next: inspect latest gate results by SHA; fix red and then address official SY-F-40 ambiguity. Syntax309 OPEN; SG28/DIST multinode BLOCKED.


### 2026-10-13 — SY-F-38/39 green and SY-F-40 started
- Lite parser fix ef95355556749af4ed43aa4f22f86fc6e6e98ece cumulative 38503390859 SUCCESS (source LaTeX delimiters); Plus translated backend absolute-value SHA 757c94423335df7372ec4cc319f02df9ae090cf4 cumulative 38503240594 SUCCESS. Both only attest to their respective test layers.
- Published official SY-F-40 nested absolute bar tests Lite SHA 93603c2ad1bd5a9588f515ddd826a0e071d892d2: test accepts mathematically correct | |x|-2 | across x=-3,0,5, or meaningful ambiguity/delimiter feedback. CI cumulative 38503507177, H1d 38503507167, build 38503507118 in progress initially.
- Plus backend-only explicit abs(abs(x)-2) witnesses SHA 97880a23a694ea92f4bb8dea64d1a3d56690faf4, cumulative 38503514125 and H1d 38503514179 queued initially. Cannot use this to claim keyboard typed-bar handling.
- Next: diagnose latest CI, refine SY-F-40 semantic error discrimination if needed, then advance SY-F-41 per official matrix. Syntax309 OPEN; SG28/DIST multinode BLOCKED.


### 2026-10-13 — SY-F-40 diagnostic and parser fix
- Lite SY-F-40 initial SHA 93603c2ad1bd5a9588f515ddd826a0e071d892d2 cumulative 38503507177 FAILURE: one nested-bar case failed; test observed non-informative parsing/expectation error rather than accepted numeric meaning or clear ambiguity signal. Other 1145 tests passed, 30 TODO. H1d and build separately.
- Lite parser fix e480f2e6082058a76d3f339eb24859b9020d9665 normalizes generic LaTeX \\vert bars for nested absolute values, preserving official numeric oracle at x=-3,0,5. New cumulative 38503643938, H1d 38503643929 and build 38503643931 queued/in progress initially; do not declare PASS before logs.
- Plus backend-only SY-F-40 SHA 97880a23a694ea92f4bb8dea64d1a3d56690faf4 cumulative 38503514125 and H1d 38503514179 in progress. It validates explicit abs(abs(x)-2) and NOT raw typed bars.
- Next: verify exact SHA CI results, resolve any red, then SY-F-41. Syntax309 OPEN; SG28/DIST blocked pending independent-node evidence.


### 2026-10-13 — SY-F-40 latest CI checkpoint
- Plus SHA 97880a23a694ea92f4bb8dea64d1a3d56690faf4 cumulative 38503514125 and H1d 38503514179 SUCCESS, but backend-only explicit abs(abs(x)-2), not typed original bars.
- Lite first SY-F-40 SHA 93603c2ad1bd5a9588f515ddd826a0e071d892d2 cumulative 38503507177 FAILURE. Parser update e480f2e6082058a76d3f339eb24859b9020d9665 added generic \\vert translation, but cumulative 38503643938 still FAILURE. Diagnostic problem: error object stringified as [object Object] in test, concealing cause.
- Lite test diagnostic SHA c21ab4e058a92c5e99e031b5fa233453b7c754d0 now surfaces actual error.message; cumulative 38503798382, H1d 38503798264, build 38503798331 in progress at last check. Do not certify Lite SY-F-40 until passing CI and correct semantic behavior or useful explicit ambiguity feedback.
- Next: inspect Lite current failure details and fix correct layer, then official SY-F-41. Syntax309 OPEN; SG28/DIST independent-host certification BLOCKED.


### 2026-10-13 — SY-F-40 original Lite source oracle correction
- Lite cumulative 38503798382 FAILED due an actual diagnostic `No se puede evaluar numéricamente la variable/función desconocida "x"`; the test did not substitute x, because its regex matched literal backslashes rather than word boundaries. This is a HARNESS bug, not proof that nested-bar mathematics is incorrect. The prior generic error message obscured the true source.
- Corrected numeric witness substitution to a proper word-boundary regex in test commit 169d1135c03ce75431d0fc9ca32bbef3f729e889. New cumulative 38503933639, H1d 38503933638, build 38503933720 in progress at first check. Must verify results before Lite SY-F-40 PASS.
- Plus explicit HTTP SY-F-40 at SHA 97880a23a694ea92f4bb8dea64d1a3d56690faf4 cumulative 38503514125 and H1d 38503514179 SUCCESS; typed-bar frontend remains unverified.
- Next: verify Lite latest SHA CI, fix any genuine residual failure, move SY-F-41. Syntax309 OPEN; SG28/DIST multinode BLOCKED.


### 2026-10-13 — SY-F-40 verified, SY-F-41 floor witness published
- SY-F-40 Lite SHA 169d1135c03ce75431d0fc9ca32bbef3f729e889: cumulative 38503933639 SUCCESS, H1d 38503933638 SUCCESS, build 38503933720 SUCCESS. Source-LaTeX parser and x-substitution harness regression validated. Plus backend-only SHA 97880a23a694ea92f4bb8dea64d1a3d56690faf4: cumulative 38503514125 SUCCESS, H1d 38503514179 SUCCESS; no claim about raw frontend typed bars.
- Next official fixture SY-F-41: \\lfloor3.7\\rfloor -> 3. Lite source-LaTeX test commit c8f7d1965d3922d6c8cb39255a30292dae0e95c6 in tests/syntax309SyFNumeric.audit.test.ts; Plus backend-only floor(3.7) HTTP test commit fefd125f7e3beb782a9bd1f6c95ba6484423d4fe in backend/tests/test_syntax309_syf_numeric.py.
- Auto-triggered CI Lite cumulative 38506901133, H1d 38506901131, build 38506901124; Plus cumulative 38506904043, H1d 38506904076. These runs were QUEUED/IN_PROGRESS at initial observation, not yet certified. Await verified job results; classify failures PRODUCT vs HARNESS/ORACLE, repair without weakening floor=3, then advance official SY-F-42 ceiling(3.2)=4.
- Syntax309 OPEN; IN625 H2/SG28 and DIST multinode remain OPEN/BLOCKED without independent-node evidence. Documentation-only commits must not trigger CI.


### 2026-10-13 — SY-F-41 Plus failure diagnosed; floor/ceiling implementation and SY-F-42 witnesses
- Lite SY-F-41 source LaTeX SHA c8f7d1965d3922d6c8cb39255a30292dae0e95c6 cumulative 38506901133, H1d 38506901131 and build 38506901124 SUCCESS.
- Plus SY-F-41 backend test SHA fefd125f7e3beb782a9bd1f6c95ba6484423d4fe cumulative 38506904043 FAILURE (backend 1012 passed, 1 failed, 1 xfailed; frontend SUCCESS). Failure: floor(3.7) returned success=false because floor was missing from ALLOWED_FUNCTIONS. Classified PRODUCT (parser whitelist), not oracle.
- Plus parser fix SHA 0fee409f4a681897e10e81d9ea20f19fe90667c3 in backend/app/services/parsing.py: explicit SymPy floor/ceiling whitelisted plus ceil alias; gate 38507337647 (in progress initially). No relaxation of oracle or parsing safety.
- Official SY-F-42 ceiling(3.2)=4 introduced as independent regression Lite source LaTeX test SHA 727262763c23b97c620237fecad60d5f8b27935f; Plus explicit backend HTTP test SHA 83f19516227fbc942e4b2bb1ade8007b499d5f3c. Auto CI Lite cumulative 38507353149, H1d 38507353195, build 38507353301; Plus cumulative 38507357259, H1d 38507357247; QUEUED/IN_PROGRESS at initial query, not PASS yet.
- Next exact action: inspect latest SHA-specific cumulative/job logs and results, fix any floor/ceiling regression in the affected layer, do not claim original Plus MathLive LaTeX covered by HTTP test, then advance official SY-F-43 sign(-5)=-1. Syntax309 OPEN, SG28/DIST multinode BLOCKED.


### 2026-10-13 — SY-F-42 bilateral gates verified; SY-F-43 sign witness underway
- SY-F-42 Lite cumulative 38507353149 SUCCESS at SHA 727262763c23b97c620237fecad60d5f8b27935f; Plus cumulative 38507357259 SUCCESS at SHA 83f19516227fbc942e4b2bb1ade8007b499d5f3c. Plus previous parser whitelist fix for floor/ceil/ceiling is included in successful gate.
- SY-F-43 official fixture: \\operatorname{sgn}(-5) expects -1. Published source LaTeX numeric oracle in Lite tests/syntax309SyFNumeric.audit.test.ts SHA af2c98f95c744bf79f4ed55e29da87312c0606d5; backend-only HTTP sign(-5) oracle in Plus backend/tests/test_syntax309_syf_numeric.py SHA e3f0af35442c065071d040eec4dff125a776e1cb. Plus does not yet test original MathLive LaTeX route.
- Push-triggered new gates: Lite cumulative 38508046721, H1d 38508046723, build 38508046693 (in progress at first check); Plus cumulative 38508051426 and H1d 38508051415 (queued at first check). Do not count SY-F-43 PASS before actual results.
- Next: inspect SHA-specific CI, classify/fix any SY-F-43 parser or oracle failure, then proceed official SY-F-44 modulo. Syntax309 OPEN; SG28/DIST real multinode still BLOCKED.


### 2026-10-13 — SY-F-43 red diagnosed and Lite parser repair
- Original SY-F-43 test Lite SHA af2c98f95c744bf79f4ed55e29da87312c0606d5 cumulative run 38508046721 FAILURE: 1148 PASS, 1 FAIL, 30 TODO. Failure exact: "No se puede evaluar numéricamente la variable/función desconocida \"s\""; \\operatorname{sgn}(-5) was not mapped to existing sign function. Classified PRODUCT / source LaTeX normalization, not mathematical-oracle failure.
- Lite patch src/engine/parsing/normalize.ts SHA 29dc6f5370d247e8cf08d558d2b243b60894cddc adds explicit localized operator alias sgn -> sign. Same input and expected -1 remain untouched. Auto-triggered cumulative 38508156912, H1d 38508156917, build 38508156999 queued at initial observation; verify outcome before PASS.
- Plus independent backend-only sign(-5) SHA e3f0af35442c065071d040eec4dff125a776e1cb cumulative 38508051426 / H1d 38508051415 in progress at observation; original MathLive operatorname route not covered.
- Next: inspect latest bilateral CI and logs, repair any genuine regression, then proceed official SY-F-44 modulo 10 mod 3 = 1. SG28/DIST multinode still BLOCKED; Syntax309 OPEN.


### 2026-10-13 — SY-F-43 CI reconciled, SY-F-44 modulo witnesses published
- SY-F-43 Lite SHA 29dc6f5370d247e8cf08d558d2b243b60894cddc cumulative 38508156912 SUCCESS; Plus SHA e3f0af35442c065071d040eec4dff125a776e1cb cumulative 38508051426 SUCCESS. Source-LaTeX original in Lite and explicit backend sign(-5) in Plus passed their distinct scopes. Plus original UI MathLive path remains unverified.
- Next official fixture SY-F-44: 10\\bmod3 expects 1. Lite source LaTeX test in tests/syntax309SyFNumeric.audit.test.ts published SHA 70d637bbe928e2c7309ddab21c148865c5f33599; Plus backend-only HTTP mod(10,3) test in backend/tests/test_syntax309_syf_numeric.py SHA 9438850508e5b3c618f285532b98e517c619fb7b.
- Auto CI Lite cumulative 38508432359, H1d 38508432358, build 38508432394; Plus cumulative 38508436382, H1d 38508436392. First observation: Lite IN_PROGRESS, Plus QUEUED. Do not claim SY-F-44 PASS without SHA-specific results. Next exact step: review failed tests/logs and fix correct layer, then proceed official SY-F-45 gcd(12,18)=6. Syntax309 OPEN; SG28/DIST real multinode BLOCKED.


### 2026-10-13 — SY-F-44 first CI failure and Lite modulo fallback correction
- Lite SY-F-44 original LaTeX 10\\bmod3 test SHA 70d637bbe928e2c7309ddab21c148865c5f33599, cumulative 38508432359 FAILURE: 1149 PASS, 1 FAIL, 30 TODO, specifically numericFallback could not evaluate known binary function "mod"; this is PRODUCT gap in numeric fallback, not an oracle error.
- Lite src/engine/numericFallback.ts fix SHA eee74756705b42b2512eb7d9c85ea78d0be9bda9 adds two-argument modulo evaluation with zero-divisor and finite-domain checks; retains 10 mod 3 = 1 independent assertion. CI cumulative 38508533913, H1d 38508533996, build 38508533870 IN_PROGRESS at initial observation.
- Plus backend-only explicit mod(10,3) test SHA 9438850508e5b3c618f285532b98e517c619fb7b cumulative 38508436382 IN_PROGRESS at last observation. No claim of original typed \\bmod MathLive route in Plus.
- Next: verify SHA-specific CI, repair any remaining red without relaxing oracle, then SY-F-45 gcd(12,18)=6. Syntax309 OPEN; SG28/DIST independent-node BLOCKED.


### 2026-10-13 — SY-F-44 Lite fix green; SY-F-45 gcd regression published
- Lite numeric modulo correction SHA eee74756705b42b2512eb7d9c85ea78d0be9bda9 cumulative 38508533913 SUCCESS, validating source 10\\bmod3 -> 1 in its unit-test path. Plus SY-F-44 cumulative 38508436382 still IN_PROGRESS at last query, not yet PASS.
- Official SY-F-45 gcd(12,18)=6: Lite original source-LaTeX test SHA f8bde6dbd0fb47c605ee88e358df5a01c24c5a70 in tests/syntax309SyFNumeric.audit.test.ts; Plus backend-only HTTP explicit gcd test SHA 8920e3147bc33049f9b1a60c1314d826dc0f3427 in backend/tests/test_syntax309_syf_numeric.py.
- New CI: Lite cumulative 38508635431, H1d 38508635531, build 38508635427; Plus cumulative 38508639355, H1d 38508639366; all IN_PROGRESS/QUEUED on first check. Next action inspect job logs and correct exact layer on failure. No SY-F-45 PASS until confirmed; Plus original LaTeX frontend never inferred from backend HTTP. Syntax309 OPEN; SG28/DIST real multinode BLOCKED.


### 2026-10-13 — SY-F-44/45 gates reconciled and SY-F-46 LCM introduced
- SY-F-44 Lite cumulative 38508533913 SUCCESS (SHA eee74756705b42b2512eb7d9c85ea78d0be9bda9); Plus cumulative 38508436382 SUCCESS (SHA 9438850508e5b3c618f285532b98e517c619fb7b).
- SY-F-45 Lite cumulative 38508635431 SUCCESS (SHA f8bde6dbd0fb47c605ee88e358df5a01c24c5a70); Plus cumulative 38508639355 SUCCESS (SHA 8920e3147bc33049f9b1a60c1314d826dc0f3427). Evidence is source-LaTeX unit semantics in Lite and explicit backend HTTP in Plus, not frontend E2E Plus.
- Official SY-F-46 case from syntax309_cases.jsonl: \\operatorname{lcm}(4,6) expects 12. Published Lite source test tests/syntax309SyFNumeric.audit.test.ts SHA 270dd14259be04b516068fd7acc6c4fcd58e7242; Plus backend HTTP lcm(4,6) test backend/tests/test_syntax309_syf_numeric.py SHA 855ae9b05a19c0e82375be26a7d93f6771233bc1.
- Auto-triggered Lite cumulative 38508973764, H1d 38508973742, build 38508973747; Plus cumulative 38508978167, H1d 38508978177. First observation IN_PROGRESS / QUEUED, NOT SY-F-46 PASS. Next action inspect latest SHA-specific CI results and logs; fix failures without relaxing mathematical oracle, then official SY-F-47 max(1,5,3)=5. Syntax309 OPEN; SG28/DIST multinode BLOCKED.


### 2026-10-13 — SY-F-46 Lite green, SY-F-47 max witness published
- SY-F-46 Lite SHA 270dd14259be04b516068fd7acc6c4fcd58e7242 cumulative 38508973764 SUCCESS (original LaTeX lcm(4,6)=12 via parser and Algebrite). Plus backend-only lcm SHA 855ae9b05a19c0e82375be26a7d93f6771233bc1 cumulative 38508978167 IN_PROGRESS at observation, not formally closed bilaterally.
- SY-F-47 official fixture \\max(1,5,3) expected 5. Lite source LaTeX evaluation regression SHA ad2cd15d06ce67c539034a24c530da113b5960b0 in tests/syntax309SyFNumeric.audit.test.ts. Plus backend-only explicit max(1,5,3) HTTP regression SHA fdbbf02ad9dd5cdd1698e0bcafe324ef95a7c18c in backend/tests/test_syntax309_syf_numeric.py.
- Auto CI: Lite cumulative 38509065880, H1d 38509065870, build 38509065929; Plus cumulative 38509070451 and H1d 38509070426. Initially IN_PROGRESS/QUEUED. Do not infer PASS without SHA-specific logs. Next inspect gates for both SY-F-46 Plus and SY-F-47, fix regressions then proceed SY-F-48 min(1,5,3)=1. Syntax309 OPEN; SG28/DIST multinode remains BLOCKED.


### 2026-10-13 — SY-F-46 bilateral PASS and SY-F-47 Lite oracle route repair
- SY-F-46 Lite cumulative 38508973764 SUCCESS SHA 270dd14259be04b516068fd7acc6c4fcd58e7242 and Plus cumulative 38508978167 SUCCESS SHA 855ae9b05a19c0e82375be26a7d93f6771233bc1.
- SY-F-47 first Lite cumulative 38509065880 FAILED only source-LaTeX max(1,5,3): parser correctly produced max(1,5,3), but test incorrectly called Algebrite directly. Canonical product min/max implementation is tryStatFunction() in src/engine/statFunctions.ts; issue is HARNESS/ORACLE routing, not proof of product defect. Corrected test SHA c0e65d6924626b16afc170a2f00c5f931b13af88, preserving expected 5, cumulative 38509219981, H1d 38509219582, build 38509219658 IN_PROGRESS at initial check.
- Plus backend-only max(1,5,3) SHA fdbbf02ad9dd5cdd1698e0bcafe324ef95a7c18c cumulative 38509070451 still IN_PROGRESS at last check. Do not claim Plus original LaTeX UI route.
- Next check latest SHA-specific CI, classify any residual red and then official SY-F-48 min(1,5,3)=1. Syntax309 OPEN; SG28/DIST multinode BLOCKED.


### 2026-10-13 — SY-F-47 bilateral green and official SY-F-48 introduced
- SY-F-47 Lite cumulative 38509219981 SUCCESS SHA c0e65d6924626b16afc170a2f00c5f931b13af88 after harness correction to use actual product tryStatFunction. Plus cumulative 38509070451 SUCCESS SHA fdbbf02ad9dd5cdd1698e0bcafe324ef95a7c18c for backend-only explicit max. Neither proves Plus raw MathLive UI routing.
- Official SY-F-48 source fixture \\min(1,5,3) expected 1. Lite parser-to-statistics-route test SHA 53bd4267d6b30d4fbc3033163318bc668be72937 in tests/syntax309SyFNumeric.audit.test.ts; Plus backend-only HTTP explicit min test SHA 2d97d46e50f152fc0223c404f55b15c49713822a in backend/tests/test_syntax309_syf_numeric.py.
- Push-triggered Lite cumulative 38509326801, H1d 38509326771, build 38509326770; Plus cumulative 38509334308 and H1d 38509334231. Status initially IN_PROGRESS/QUEUED, not PASS. Next: inspect exact SHA outcomes and logs, then review section F aggregate traceability (48 records) and next block established by official matrix. Syntax309 OPEN, SG28/DIST multinode BLOCKED.


### 2026-10-13 — SY-F-48 bilateral confirmed and 48-case section audit; SY-E-01 started
- Lite SY-F-48 cumulative run 38509326801 SUCCESS on SHA 53bd4267d6b30d4fbc3033163318bc668be72937; Plus cumulative run 38509334308 SUCCESS on SHA 2d97d46e50f152fc0223c404f55b15c49713822a (frontend and backend jobs SUCCESS).
- New bilateral qa/certification/SY_F_48_COVERAGE_AUDIT.md records 48 unique SY-F IDs in fixture and 48 ID references in test suites. This does NOT establish all 48 as contractually certified across MathLive/UI/keyboard: Plus tests largely use translated explicit backend input, and several symbolic/general conventions need stronger oracles. Syntax309 remains OPEN.
- Next official section SY-E: first SY-E-01 from fixture is 2^{10}=1024. Lite original LaTeX regression test tests/syntax309SyEExponent.audit.test.ts commit a911a039bd382e00317c4be20f797f0f6c132644; Plus backend-only HTTP 2^10 regression backend/tests/test_syntax309_sye_exponent.py commit c9c11ff17d62442688224ac5cd06e21e4f82eb9f. Auto-triggered Lite cumulative 38510272111, H1d 38510272117, build 38510272109 and Plus cumulative 38510279086, H1d 38510279087, initially IN_PROGRESS / QUEUED. No SY-E-01 PASS until result verified.
- Next exact action: inspect CI SHA and logs, fix layer-specific issues, then SY-E-02 (ASCII 2^10=1024). Preserve unresolved SG28/DIST multinode BLOCKED and gaps in SY-P.


### 2026-10-13 — SY-E-01 bilateral green; SY-E-02 original ASCII witnesses published
- SY-E-01 Lite cumulative 38510272111 SUCCESS SHA a911a039bd382e00317c4be20f797f0f6c132644, Plus cumulative 38510279086 SUCCESS SHA c9c11ff17d62442688224ac5cd06e21e4f82eb9f (backend/frontend green). Scope Lite source LaTeX parser/numeric; Plus backend translated expression, not MathLive E2E.
- SY-E-02 original fixture ASCII `2^10`, expected 1024, historical counterexample 2^1*0. Lite test in tests/syntax309SyEExponent.audit.test.ts commit 0996b93ba515d00d6bee3227ee192f88dd340eb2. Plus backend HTTP test in backend/tests/test_syntax309_sye_exponent.py commit 3ce1f26cdb (resolve full SHA from GitHub), preserving exact row input.
- Push CI Lite cumulative 38510821961, H1d 38510821960, build 38510821984; Plus cumulative 38510798815, H1d 38510798912; first observation queued/in progress. Next: verify SHA-specific outcomes, classify/fix any failure, proceed SY-E-03 substitution of x=2 in x^12=4096. Syntax309 OPEN; SG28/DIST real multinode BLOCKED.


2026-10-13 SY-E-03: SY-E-02 gates green Lite 38510821961, Plus 38510798815. SY-E-03 x^12 with x=2 expects 4096; source fixture contains a textual substitution annotation, which is not certified as directly parsable. Tests committed Lite 2f617b1906b3eb60bcd4a687379f1a94d8748c92 (cumulative 38511233712 SUCCESS) and Plus 4651ed12b5735d58a9e67072e4af75eebba7a460 (cumulative 38511248173 in progress at last observation). Next verify Plus and proceed SY-E-04. Syntax309 OPEN; SG28/DIST BLOCKED.


2026-10-13 SY-E-03 bilateral gates confirmed: Lite SHA 2f617b1906b3eb60bcd4a687379f1a94d8748c92 cumulative 38511233712 SUCCESS; Plus SHA 4651ed12b5735d58a9e67072e4af75eebba7a460 cumulative 38511248173 SUCCESS. This validates x^12 at x=2 =4096 as expression + independent substitution, NOT direct natural-language LaTeX annotation parsing. Official SY-E-04 10^{-3}=0.001 tests published Lite SHA b24d252e8e4c9ea2e2600179a086adfd67342045 cumulative 38511416734, H1d 38511416741, build 38511416781; Plus SHA f5624448180965193488de1b1f6596d807bf9abb cumulative 38511428018, H1d 38511427856. CI initially running/queued. Verify SHA-specific outcomes and correct failures; next SY-E-05. Syntax309 OPEN, SG28/DIST independent-host BLOCKED.
