# Manual / Capability Gaps

Estos puntos NO deben marcarse automáticamente como fallo del producto mientras el runner no pueda reproducir fielmente la capacidad requerida.

## G1
- TC17: carácter decimal enviado por teclado numérico real de teléfono. Depende de SO/locale/IME.
- TC23: tecla muerta `^` y composición de teclado físico español. Playwright no reproduce fielmente este comportamiento.

## Otros gaps ya documentados
- C4 CV13–18: persistencia de funciones definidas por usuario; Plus backend es stateless y Lite no tiene registry persistente.
- D2 EN-PC-09: `7%3` ambiguo como porcentaje postfix; validación UI/manual.
- D2 EN-CI-04: renderizado exacto de Avogadro; backend/display manual.
- D3 PN15–17: decimales periódicos; semántica manual/TODO.
- E1c EN-CA-07: integral impropia 0..∞.
- E1c EN-CA-11: integral doble.
- E1d EN-CA-27, EN-CA-29, EN-CA-31, EN-CA-32: límite simbólico/series/eval bar/guard >10k.
- E2a: routing E2E de intención matricial directa aún requiere cobertura explícita.
- E3d3 Plus: posible registro en historial antes del filtrado de restricciones.
- F1 PG15: principalmente estructural.
- F2b UC25: semántica backend/worker adicional recomendable.
- F3a/F3b/F3c: parte de cobertura es estructural/permisiva; revisar semántica externa en reconciliación final.
- AS26: conflicto de semántica `\\log` SymPy natural vs contrato PL base10 requiere advertencia/echo explícito en auditoría final.


## EN-CH-11 — coma decimal regional
- Estado: manual / config-dependent.
- Requiere entorno regional donde la coma decimal sea interpretada según configuración del SO/navegador/MathLive.
- No se debe marcar como automatizado únicamente con locale fijo del runner CI.


## EN-RE-22 — historial restaura entrada idéntica
- Estado: CAPABILITY GAP confirmado durante IN625 H1c.
- Contrato: al seleccionar/reusar una entrada del historial, el campo principal debe recuperar el LaTeX original exactamente, sin wrappers ni espacios añadidos.
- Estado actual: el historial muestra entradas pero no ofrece una acción para restaurarlas al campo principal.
- No se contabiliza como PASS automático hasta implementar el flujo de restauración o validarlo manualmente tras su implementación.


## EN-RE-29 — enlace para compartir
- Estado: CAPABILITY GAP no bloqueante durante IN625 H1d.
- Contrato: validar round-trip de caracteres reservados en URL si existe función de compartir.
- Estado actual: no se detectó una función de share/permalink del campo matemático en el producto actual.


## EN-RE-30 — persistencia del campo tras recarga
- Estado: CAPABILITY GAP no bloqueante durante IN625 H1d.
- Contrato: conservar la entrada del campo tras reload si existe persistencia de entrada.
- Estado actual: existen persistencias auxiliares en algunos módulos/configuraciones, pero no se detectó persistencia del campo matemático principal.


## EN-SG-28 — Detener cálculo prolongado y recuperar operación (H2, pendiente)
- Contrato de origen: IN625 H2, EN-SG-28: detener durante cálculo largo y verificar recuperación desde la interfaz.
- Cobertura identificada en Plus: frontend/src/api/client.ts aplica timeout de 15 segundos con AbortController, incluyendo lectura JSON, y hay pruebas simuladas de recuperación y señales independientes. Esto no demuestra que el backend detenga un trabajo matemático ya iniciado.
- Cobertura faltante: acción explícita de detener desde el flujo del usuario si existe o debe implementarse, interrupción del proceso o worker en un entorno aislado y posterior recuperación de la interfaz. Nunca ejecutar cargas extremas contra producción.
- Estado: REQUIERE EVIDENCIA; no certificar como PASS por timeout simulado. Lite necesita revisión equivalente del worker y la interfaz para clasificar su estado.
- Bloqueo de evidencia: aún no se recuperaron jobs ni logs de gates recientes de Plus; el listado disponible por commit solo cubre PR, no corridas push.


## 2026-10-09 — SG28 auditoría de accesibilidad funcional (sesión de continuidad)
- EN-SG-28 Lite: `CalculusMode` contiene botón de cancelación y limpieza de worker, pero `src/App.tsx` no lo publica dentro de `VISIBLE_MODES`. La navegación normal muestra `BasicScientificMode`, cuya instancia del hook utiliza solamente `getWorker()`, no `cancelWorker()`. Se requiere distinguir «implementado en componente oculto» de «disponible para el usuario»; interfaz pública no acreditada. ESTADO: PRODUCT/CAPABILITY GAP abierto, pendiente de E2E en Científica.
- EN-SG-28 Plus: abortar fetch por timeout de 15 s no garantiza detener cálculo backend. ESTADO: CAPABILITY GAP abierto hasta demostrar interrupción y recuperación en entorno aislado.
- Ninguno es PASS automático por tests de hook, builds o solicitudes abortadas. No probar carga extrema contra producción.


## 2026-10-09 — SG28 Lite PASS acotado y gap restante precisado
- Las notas anteriores de «botón de cancelación no accesible en Científica Lite» reflejan el estado PREVIO y **quedan superadas**. Ahora `src/modes/BasicScientific/BasicScientificMode.tsx` expone «Detener cálculo» e invalida respuestas tardías.
- Evidencia GitHub Actions: Lite SHA `8091c4f72739776575524e90c04890d6eeebb1bd`, run SG28 `37999350568`, job `114053353730`: **2/2 Playwright PASS**; 1) cancelación/recuperación UI con worker simulado; 2) cálculo ordinario `2+3=5` con Web Worker auténtico. Gates cumulative `37999350602`, build `37999350623` y H1d `37999350567` todos SUCCESS para ese SHA.
- GAP REMANENTE Lite: la prueba con worker verdadero **no cancela una operación matemática real mientras está ocupada**. Se necesita test controlado con carga acotada que demuestre terminación efectiva y posterior operación correcta, sin abusar de producción.
- GAP REMANENTE Plus: timeout y `AbortController` del cliente **no demuestran cancelación del trabajo del servidor**. Requiere instrumentación/prueba aislada que confirme terminación del cómputo y recuperación; no inferirlo de un HTTP abort.
- Estado global EN-SG-28: **PARCIALMENTE ACREDITADO**, H2 permanece abierto. La evidencia ya demostrada no debe perderse por referencias a estados anteriores.


## 2026-10-09 — SG28 native worker CI verified run 38000982016
- Lite 3/3 Playwright PASS en run `38000982016`, SHA `3191e9d296deec42a7946a73b5e1dfa686b94748`. La tercera prueba acredita `Worker.terminate()` con trabajo controlado en un worker real de navegador; el motor matemático no está ejecutando una tarea compleja en ese test.
- GAP persistente: terminación real de operación matemática larga y recuperación posterior en Lite; evidencia de detención del cómputo servidor de Plus, no solo `AbortController` de cliente. SG28/H2 no cerrados.


## 2026-10-09 — SG28 four Playwright tests verified PASS
- GitHub Actions Lite SG28 run https://github.com/c2melendez/precision-lab-lite/actions/runs/38001591613, SHA `d9f36bde5759d2394ce6e9014137127e7d91c0b4`, job `114060683879`: **4/4 Playwright PASS (18.5s)**. Nueva prueba acredita terminación/recreación del worker matemático compilado con operación ordinaria. Gates del mismo SHA cumulative `38001591557`, build `38001591646`, H1d `38001591596`: SUCCESS.
- Acreditado: ciclo de vida de workers, cancelación bajo mock, worker nativo ocupado acotado y reinicio de worker matemático. Sin acreditar: cancelación de cómputo matemático prolongado ya iniciado y cancelación efectiva del servidor Plus. SG28/H2 abiertos a efectos integrales.


## 2026-10-14 — SY-E-11..13: fuente y recuperación de componentes
- Fuente LaTeX original: rechazo automatizado verificado en Lite parser y Plus conversor (SY-E-11 doble superíndice, SY-E-12 exponente vacío, SY-E-13 falta base).
- Plus Científica/Simple: seis pruebas de componente verifican alerta, ausencia de llamadas al helper HTTP, carga desactivada y recuperación con 2+3; el editor es un input simulado, guard y conversión reales.
- Límite pendiente: la serialización/canonicalización de estas entradas crudas por MathLive nativo y su error visible en navegador real. No contabilizarlo como PASS por el test del editor simulado. Preservar validación antes del editor/conversión cuando MathLive reformatea la fuente.
- SG28 E2E de cancelación 38514811429 acredita su propia regresión 21/21 desktop/tablet/mobile; no sustituye la evidencia de exponentes ni la coordinación multinodo independiente.


## 2026-10-14 — SY-E-17: convención compleja y alcances pendientes
- PASS acotado: rama compleja principal sqrt(2)*i. Lite fuente original + Algebrite + handler worker verdadero con transporte self/postMessage simulado; Plus HTTP backend + MathResponse/representación y anclas complejas.
- Pendiente: modo real y error claro al usuario, si existe tal modo; EvaluateRequest no expone selector de dominio. No inventar campo de API ni convertir NaN interno en PASS de error humano.
- Pendiente: Worker nativo / MathLive / teclado/UI de esta fuente en Lite y ruta original LaTeX de Plus; el harness de worker y traducción backend no los sustituyen.
- Esta limitación no elimina la evidencia matemática ya acreditada y no cierra Syntax309 global ni H2/DIST.


## 2026-10-14 — SY-E-18: rama y representación
- PASS acotado de rama principal 1+sqrt(3)*i en ambos caminos probados; Lite corrige la salida numérica compleja para no convertirla en una raíz impar real al reingresar.
- Lite handler verdadero usa transporte self/postMessage simulado; no acredita un Worker/MathLive/browser E2E de SY-E-18. Plus prueba traducción backend original equivalente, no la conversión UI original ni su reentrada MathLive.
- La preparación rectangular del renderizador Lite se aplica a potencias negativas/fraccionarias cuyo Re/Im se evalúan como números reales finitos. Potencias complejas simbólicas/dependientes de variables conservan el camino anterior y no quedan certificadas por esta regresión.
- Las raíces impares reales explícitas mantienen su convención; se corrige su agrupación con coeficientes. No confundir esos otros inputs con el caso de potencia original SY-E-18.


2026-10-15 SY-Q-06: Lite inequality regression SHA 8a49b7de5f3517383afe6ec8878a90f4dd838482; Plus oracle-only SHA 7b3284aca8125f9f337ef49f6117d184d0f3de51. Plus public inequality solving not yet certified; mark CAPABILITY/BLOCKED rather than PASS. New cumulative CI Lite 38721683568 and Plus 38721690451 pending first verdict.


### 2026-10-15 — SY-Q-16 nonlinear 2-variable systems in Lite
- OFFICIAL fixture `\\begin{cases}x^{2}+y^{2}=25\\\\ x+y=7\\end{cases}` requires both `(3,4)` and `(4,3)`.
- Verified Lite real scientific `runSystem` dispatches `linearSystem` worker; `src/engine/stepEngine/linearSystem.ts` explicitly only extracts linear coefficients and Gauss-Jordan. Existing routing cannot be counted as nonlinear two-solution support. `tests/syntax309SyQ16.intake.test.ts` is only an intake/fixture test, NOT a passing nonlinear solver or end-to-end result.
- Classification: PRODUCT/CAPABILITY GAP, SY-Q-16 Lite BLOCKED pending legitimate nonlinear system solver, full two-root oracle and real MathLive+worker E2E. Plus `/api/v1/solve/system` nonlinear solver has targeted two-root HTTP regression; check SHA-specific gates. Do not weaken oracle to a single result.


## 2026-10-15 — Actualización SY-Q-16: capacidad acotada verificada
- La clasificación histórica Lite BLOCKED para este fixture queda superada por solver afín/cuadrático y prueba nativa de ambas raíces en desktop/tablet/mobile. Lite SHA f211e8935dcb543482ddaeeafcdddb20d135d2bf, cumulative 38787638040 y browser 38787637795 SUCCESS (6 comprobaciones específicas de Q16).
- Plus SHA 28ab5abdc7a0db03de78c9268a8d18ee4b793b9f, cumulative 38786503451 y H1d 38786503536 SUCCESS; ambas soluciones probadas en HTTP. Plus ingreso cases por interfaz MathLive sigue SIN ACREDITAR.
- Capacidad Lite limitada a dos ecuaciones polinómicas racionales, una afín y otra hasta grado dos, soluciones reales; no certifica sistemas generales, raíces complejas de sistemas, familias infinitas o cualquier sistema con dos ecuaciones no lineales. Los rechazos no equivalen a resolución.
- El test intake histórico no demuestra solución; la evidencia actual está en syntax309SyQ16.solver.test.ts y e2e/syntax309-syq16.spec.ts. Teclado virtual por pulsación y otros navegadores pendientes. H2/SG28 OPEN, DIST multinodo BLOCKED.


## 2026-10-16 — Alcance de canales SY-S-19/20 y SY-R-01..03
- SY-S-19/20 Lite: pruebas nativas MathLive + Worker, en RAD/GRAD y desktop/tablet/mobile, usan asignación de fuente LaTeX y evento input. No acreditan cada tecla física/virtual ni comportamiento regional de teclado.
- SY-S-19/20 Plus: conversor real de grados/alias y HTTP traducido exacto probados por separado en rad/deg. Sin prueba nativa integral de este flujo Plus; no contar ese canal como PASS por sumar ambas capas.
- SY-R-01..03 Plus: HTTP usa testigos de backend equivalentes sqrt(2)/2, 2*sqrt(3), pi/6 y reentrada del result_text. La conversión de su LaTeX original, UI integral y nueva acción Reusar no quedan acreditadas por esos tests.
- SY-R-01..03 Lite: distinguir harness del handler Worker (transporte self/postMessage simulado) de los specs e2e/syntax309-syr01.spec.ts..syr03.spec.ts. Estos últimos, run 38871060466 SUCCESS en SHA 3995f8f0, prueban reentrada real del LaTeX resultado mediante nuevo cálculo; no prueban una pulsación del botón Reusar.
- H2/SG28 y DIST conservan sus requisitos independientes. Estos avances matemáticos no cierran IN625/Syntax309 globalmente.


## 2026-10-16 — SY-R-04: alcance del binding escalar y de los canales
- Lite PASS nativo en run 38877487918, SHA 7889b6e7, incluye fuente original, decimal visible y recálculo del LaTeX de salida con solicitud nueva en desktop/tablet/mobile. Usa asignación de fuente + evento input; no acredita botón Reusar ni cada tecla física/virtual.
- Plus PASS: conversor real original con cuerpo/exponente/valor comprobados y HTTP de fuente original o testigo emitido por conversor. Comparación completa MathResponse off/on en CI incluye input_latex, texto exacto y aproximación; no demuestra flujo UI MathLive integral Plus.
- Feature deliberadamente acotada a un binding numérico real finito y temporal. No múltiples sustituciones escalares inline, RHS con símbolos libres/no finito, ni mezcla con substitutions de API. No afirmar lenguaje natural general o toda entrada LaTeX raw del endpoint.
- Las declaraciones matriciales/vectoriales con con conservan su gramática propia y prioridad. Regresión SY-M-14/16 verificada como restaurada por doce pruebas nativas en el run final; el nuevo helper no sustituye su parser.
- La bandera de aislamiento permanece off por defecto. La paridad R04 off/on no certifica cancelación distribuida SG28/H2/DIST.


## 2026-10-16 — SY-R-05: alcance de arsinh y reentrada
- Lite: fuente original operatorname{arsinh}(1), aproximación y nuevo cálculo del LaTeX resultado probados en MathLive + Worker, desktop/tablet/mobile. La respuesta usa NUMERIC_FALLBACK y conserva valor numérico, no una forma simbólica exacta de asinh(1). No se atribuye pulsación Reusar ni certificación de cada tecla física/virtual.
- Plus: conversor real de la fuente original y variantes -1/2 produce un identificador asinh íntegro; tests HTTP separados verifican testigos asinh(1), asinh(-1), asinh(2), texto exacto sin Float, aproximación finita y reentrada del result_text. No demuestra UI MathLive integral Plus ni aceptación de LaTeX original raw por HTTP.
- El primer oráculo eliminaba todos los espacios y ocultaba a s i n h (1). El oráculo reforzado solo permite espacios entre tokens; el producto recompone asinh antes de HTTP. No confundir normalización textual en el test con conversión válida de producto.
- H2/SG28 OPEN, DIST-01..08 multinodo BLOCKED. Sin cambio de aislamiento por defecto ni producción.


## 2026-10-16 — SY-R-06: canales de logaritmo natural y reentrada
- Lite: fixture original ln(2), salida simbólica LaTeX ln(2), aproximación finita y recálculo del resultado con nueva solicitud probados en MathLive + Worker desktop/tablet/mobile. Asignación de LaTeX/evento input; no acredita botón Reusar ni cada tecla física/virtual.
- Plus: conversor real de fuente original y controles ln(3)/log(2), junto con HTTP separado de testigos equivalentes; oráculos verifican identificador íntegro, texto exacto sin Float, aproximación y valor conservado al reingresar result_text. No afirmar flujo UI MathLive integral Plus ni aceptación de LaTeX raw original por HTTP.
- La distinción ln natural / log base diez se comprueba en cálculo y reentrada; no basta comparar texto quitando espacios ni suponer la base a partir del nombre emitido por un CAS.
- SG28/H2 permanece OPEN y DIST multinodo BLOCKED; sin cambio de flags/producción. TODO/XFAIL no cuentan como PASS.


## 2026-10-16 — SY-R-07: número pequeño y reentrada
- Lite: fuente original 1.5 por 10 elevado a -7, valor decimal no cero y nuevo cálculo del LaTeX resultado probados con MathLive + Worker desktop/tablet/mobile. La salida exacta es 3/20000000. Asignación de fuente/evento input; no acredita botón Reusar ni cada tecla física/virtual.
- Plus: conversor de la fuente original y variantes de coeficiente/signo, junto con HTTP separado de testigos equivalentes. Se exige estructura completa de multiplicación/potencia negativa, texto numérico real finito, aproximación y reentrada, todos distintos de cero y con tolerancia estrictamente relativa; control racional exacto adicional.
- No acreditar UI MathLive integral Plus, aceptación de LaTeX raw original por HTTP ni todo rango de exponentes/subnormales a partir de estos casos. Una representación científica del valor no es un error si conserva valor y se distingue del LaTeX de reentrada probado.
- H2/SG28 OPEN, DIST multinodo BLOCKED; TODO/XFAIL excluidos de PASS. Sin cambio de aislamiento por defecto ni producción.


## 2026-10-16 — SY-R-08: complejo binómico y reentrada
- Lite: fuente original 1+2i visible y recálculo del LaTeX resultado con solicitud nueva en MathLive + Worker desktop/tablet/mobile. Handler Worker añade controles 3-4i, -2+3i y (1+2i)^2 = -3+4i, comprobando componentes y reentrada. No se convierte el complejo completo con Number ni se exige aproximación real.
- Plus: conversor original y variantes de signos/coeficientes, más HTTP separado de fuente original y testigos equivalentes. MathResponse escalar, texto exacto sin símbolos libres/Float, componentes real/imaginaria y reentrada; control de cuadrado acredita i^2=-1. No afirmar UI MathLive integral Plus.
- El oráculo del campo de salida visible, leído mediante su propiedad value, admite espacios, signo menos Unicode y orden equivalente de términos en el binomio oficial; no acepta cualquier texto que contenga 1, 2 e i. No acredita pulsación Reusar, cada tecla física/virtual ni todas las formas polares/ramas complejas.
- H2/SG28 OPEN, DIST multinodo BLOCKED; TODO/XFAIL excluidos de PASS. Sin cambio de aislamiento ni producción.


## 2026-10-16 — SY-R-09: antiderivada, constante y derivación
- Lite navegador: fuente original x^3/3+C evaluada; su LaTeX de salida se reingresa en d/dx explícita en la pantalla científica, se comprueba x^2 en math-field read-only visible y se recalcula la salida con nueva solicitud. No acredita generación de la integral mediante botones ni el formulario Cálculo dedicado.
- Lite harness Worker añade cadena integral indefinida real x^2 → x^3/3+C → derivada x^2, equivalencia simbólica exacta, controles con variable y/coeficiente 7C, derivada respecto a C y derivadas naturales parentizadas con variable declarada. Transporte self/postMessage simulado se distingue del Worker real de los E2E.
- Plus conversor/intent y HTTP dedicados por separado: se conserva el cuerpo íntegro, variable explícita y C; respuestas evaluate/integral se reingresan en derivative y la salida vuelve a evaluate. Sin acreditar flujo UI MathLive integral Plus.
- C se considera independiente de la variable declarada; d/dC comprueba su coeficiente, no una sustitución numérica de C. No inferir que la constante de integración sea independiente de todo parámetro de una familia general.
- Lite asigna LaTeX/evento input; no botón Reusar ni cada tecla física/virtual. H2/SG28 OPEN, DIST multinodo BLOCKED; TODO/XFAIL excluidos de PASS. Sin producción ni cambios de aislamiento.

## 2026-10-16 — SY-R-12 alcance de canales
- Lite: científica 38947347738 SUCCESS, SHA 2f536493b767d90378dd5e70234cdbdb80803088, 375/375; rechazo y recuperación 5 en MathLive/Worker Chromium desktop/tablet/mobile, sin pageerrors. No valida cada tecla física/virtual ni cada SO.
- Plus: cumulative 38946778492 SUCCESS, SHA efc361275ef760886d45077585f42cef156496bd; conversor unitario y rechazo/recuperación reales vía HTTP. UI nativa Plus R12 pendiente; no se infiere del HTTP.
- H2/SG28 OPEN; DIST-01..08 BLOCKED hasta evidencia multinodo real. TODO/XFAIL no son PASS.

## 2026-10-16 — SY-R-13 alcance acotado
- Lite SHA f8f0a44f85fc533d5f3bfaaaf33aca26451b5714, científica 38949824189 SUCCESS (378/378): MathLive/Worker real en Chromium desktop/tablet/mobile, valor 3 y reentrada; asignación de LaTeX/evento input, no cada tecla ni cada SO.
- Plus SHA 0b14bacf60c1e495fcfb83a3df22dc660e20ec54, cumulative 38950436675 SUCCESS: conversor y HTTP original/testigo ASCII/substitutions/reentrada exacta; UI nativa Plus R13 pendiente. Normalización nueva acotada a raíces indexadas de radicandos atómicos y fracciones numéricas; no soporte general LaTeX ni acreditación de ramas complejas/radicandos negativos.
- TODO/XFAIL no son PASS; H2/SG28 OPEN y DIST-01..08 multinodo BLOCKED.

## 2026-10-16 — SY-R-14 alcance acotado
- Lite SHA 07da1be79dbe2f0ffd82134ae6bc530f5c913cb2, científica 38952417593 SUCCESS (381/381): valor absoluto y control |x|+x negativo, resultados 4 y 0 con reentrada en Chromium desktop/tablet/mobile. MathLive y Worker reales mediante asignación de LaTeX/evento input; no cada tecla física/virtual ni cada SO.
- Plus SHA d132c5ce1a95c520cbf18c88e493a6549893f1c6, cumulative 38952224765 SUCCESS: conversor y HTTP original/testigo/substitutions/reentrada exacta; UI nativa Plus R14 pendiente. Conversión backend de barras con sizing acotada a una variable de una letra, sin acreditar todas las expresiones entre barras.
- TODO/XFAIL no son PASS; H2/SG28 OPEN y DIST-01..08 multinodo BLOCKED.

## 2026-10-16 — SY-X-01 alcance acotado
- Lite SHA 238442fdd742f3c194ced2d689c35a8efb0dac2c, científica 38954833821 SUCCESS (384/384): campo realmente vacío, Calcular deshabilitado, conservación del resultado al borrar y recuperación 5 en Chromium desktop/tablet/mobile, sin pageerrors. MathLive/Worker reales con asignación de valor y evento input; no prueba cada tecla/SO ni envío por Enter vacío.
- Plus SHA b139dd22ff0fc969e3bceed68fee88d10d88e5b3, cumulative 38954842181 SUCCESS: conversor y API TestClient real, dos rechazos 422 VALIDATION_ERROR alternados con recuperación 5; UI nativa Plus X01 pendiente. No se deduce UI del HTTP.
- Espacios puros o LaTeX escapados se evalúan en SY-X-02; no se acreditan por probar el string vacío. H2/SG28 OPEN; DIST-01..08 multinodo BLOCKED. TODO/XFAIL no son PASS.

## 2026-10-16 — SY-X-02 alcance acotado
- Lite SHA 9891620f5143b3752289ab2a75462f894c757950, científica 38962952706 SUCCESS (387/387): MathLive conserva los cuatro espacios escapados, Calcular está habilitado y muestra aviso explícito de vacío; dos recuperaciones 5 en desktop/tablet/mobile, sin pageerrors. MathLive/Worker reales mediante asignación de LaTeX/evento input, no cada tecla/SO ni envío por Enter.
- Plus SHA 9f7459676d9d46c77df232842cd5360b6cfd4c12, cumulative 38963054983 SUCCESS: conversor produce "" y API valida fuente original con HTTP 200 PARSE_ERROR de vacío, testigo "" con HTTP 422 VALIDATION_ERROR; recuperaciones 5 en TestClient real. UI nativa Plus X02 pendiente; no inferida del HTTP.
- La normalización no acredita cualquier comando como vacío ni resuelve SY-X-03. TODO/XFAIL no son PASS; H2/SG28 OPEN, DIST-01..08 multinodo BLOCKED.

## 2026-10-16 — SY-X-03 alcance acotado
- Lite SHA b86ae0ff98f4b9e6c36986b069a9a9cf13584f03, científica 38964686825 SUCCESS (393/393, sin SKIP): MathLive conserva las dos barras originales, Calcular habilitado, rechazo claro PARSE_ERROR de sintaxis y dos recuperaciones 5 por perfil Chromium desktop/tablet/mobile, sin pageerrors. No hay límite de ingesta observado para este fixture en la corrida; la rama condicional de CAPABILITY no se activó.
- Plus SHA f3d43319ca7c46c951ceed36b67bd665399939de, cumulative 38964550443 SUCCESS: conversor rechaza antes de borrar el separador en ASCII; backend HTTP real rechaza las tres fuentes y recupera 5. UI nativa Plus X03 pendiente; no inferida del conversor/API.
- Lite E2E usa asignación de LaTeX/evento input y Worker real, no cada tecla/SO. TODO/XFAIL/SKIP no son PASS; H2/SG28 OPEN, DIST-01..08 multinodo BLOCKED.


## 2026-10-16 — actualización de gaps X01–03 nativo Plus
Las notas previas de UI Plus X01–03 pendiente quedan superadas por SHA6d594187e241d6a2491590e13582999ac0b9fd3c, run38983949600,9/9 en desktop/tablet/mobile Chromium. MathLive yHTTP reales, rechazo local, recuperación y reentrada. No cierra cada tecla/SO ni otros casos R. SY-X-04 Plus permanece BLOCKED porlongitudHTTP/parser500 yAST200; se conserva oráculo500x enXFAILestricto,noPASS. S25 conserva5highcadauno yS19initialrun noequivale amutation score. H2/SG28/DISTsin cierre.

## 2026-10-17 UTC — cierre acotado SY-R-12 nativo Plus
La nota previa de UI Plus R12 pendiente queda superada por SHAf4f909ed373f10e631d2ccb575268017ba983b07,run38985749703:12/12 X01–03/R12 en desktop/tablet/mobile Chromium. R12 conserva fuente original, rechazo local explícito sin POST, dos ciclos recuperación y reentrada HTTP real, sin pageerrors. MathLive setValue/evento input; no cada tecla física/virtual, cada SO, otros motores ni botón Reusar. R13/R14 nativos Plus pendientes. Lite no se reejecutó; bloqueos globales sin cierre.

## 2026-10-17 UTC — cierre acotado SY-R-13 nativo Plus
La nota previa deUI PlusR13pendiente queda superada porSHAb90f15e11d6b48a953aa37319afda711dcf58e2e,run38986979759:15/15 X01–03/R12/R13 en3perfilesChromium. Originalraíz cúbica conx27→3,controlesx8→2/y64→4,HTTP real yreentrada,recuperación5,sinpageerrors. Corregido intentUI que interpretaba«con»como relación. MathLive setValue/input,no cada tecla/SO/otro motor ni botónReusar. R14nativoPluspendiente;Lite sin nuevaejecución;bloqueos globales abiertos.

## 2026-10-17 UTC — cierre acotado SY-R-14 nativo Plus
La nota previa de UI Plus R14 pendiente queda superada por SHA f4b4f68203d8154ae4de9d5ca275589707cad654,run38989356810:18/18 X01–03/R12–14 en tres perfiles Chromium. Fuente original íntegra en editor, ruta escalar existente abs(-4)→4; controles compuestos negativo0/positivo8 y variabley=-7→7;HTTP real,reentrada yrecuperación5,sinpageerrors. No se acredita backend recibiendo el LaTeX original en la ruta escalar simple. MathLive setValue/input,no cada tecla/SO/otro motor ni botón Reusar. Lite conserva evidencia previa sin reejecución; bloqueos globales abiertos. Próximo SY-X-05 bilateral independiente.
