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

## 2026-10-17 UTC — SY-X-05 bilateral: alcance verificado
Expansión determinista fiel del fixture descriptivo:30pares deparéntesis,61caracteres alrededor de1;controles7/5. Lite SHAcdcaefb8d317e2303b4b89da92afb7a7a994f698,nativo38990035597:399/399;Plus SHA9e054de4e68621cf06c2a72236e585e6c9a5387c,nativo38990031387:21/21. Fuente íntegra en ambos MathLive y enPOSTPlus;resultados visibles,reentrada yrecuperación conIDs nuevos,sinpageerrors. HTTPcrudoPlus cubierto aparte;handlerWorkerLite unitario usatransporte simulado,distinto delWorkerE2Ereal. No cada tecla/SO/otrosmotores/botónReusar. Profundidad deagrupación30 no significa AST30. No se cambiaron límites de seguridad;X04Plus ybloqueosglobales abiertos. SiguienteX06exactamente10000caracteres conprocesamiento o aviso explícito y recuperación segúnoráculo.

## 2026-10-17 UTC — SY-X-06 bilateral: alternativas admitidas
LiteSHA227ad7513a199dee984b0b1e48fb7550b98d5c8d,nativo38990826311:402/402;PlusSHA2d6434b7b7216efa6aaf2ca30d1a277960398c2e,nativo38991052824:24/24. Fuente real10000 ('1+'×4999+'11') comprobada enambosMathLive yPOSTPlus. Liteprocesa5010;Plusrechaza422conaviso500;ambosrecuperan5yreingresan salidaconIDs nuevos,sinpageerrors. Límite500intacto,mensaje corregidoylogs sininputcrudo. Nocada tecla/SO/otromotor/botónReusar niSLAdecálculo. Campaña38990822464:S25frontend5high,backendseguridadPASS,mutaciónpendiente;selección sobreLitepinneadosincambios esdeudaCIabierta. Siguiente:separardisparadoresantesdeX07;nodeclararS19/SG28/globalcerrados.

## 2026-10-17 UTC — selección de campañas validada
CI-CAMPAIGN-OVERSCOPE RESOLVED_SCOPED:run38991931463 ejecutóselector y56tests,sin campañas nuevas;ningúnSKIP esPASSdeS19/S25. Evidencia porjob requierehuella+pasos+reviewdelogs,Litepin6cbec764esdistinto deHEADLite. Actualcampaña38990822464confrontendsencurso yS25frontendfallido conservaIDs;no scoreintegralanticipado. PR/main ymanualcompleto conservados;seguridadseleccionada fresca. No cambios de motor/fixtures/criterios matemáticos;SYX07siguiente.

## 2026-10-17 UTC — SY-X-07 bilateral: alcance verificado
LiteSHAf0d3106d351aebc49b6a5715efd92690c44ec843,nativo38992883919:405/405;PlusSHAcc89d7ccd36dfdfe15b14e72215920c62508ab00,nativo38992878912:27/27. Original∞−∞ conservado;rechazo explícitolocal enUI,controlfinito0,recuperación5yreentradareal,IDs nuevos,cero pageerrors. RawHTTPPlusyhandlerWorkerLiteindependientes,nocanalesinventadospararechazolocal. DefectoLiteCASoo-oo→0corregido medianteguardliteral;no theoremgeneraldeindeterminaciones. MathLiveasignación/input,no cadatecla/SO/otromotor/botónReusar. Sourcefixtureyseguridadintactos;S25/S19/X04Plus/SG28/globalabiertos.SiguienteX08segúncontrato real/complejo.


## 2026-10-17 UTC — SY-X-08 bilateral verificado
Lite SHA `378510f0092d4c50c321fc59ce1abb87e732aa72`; Plus SHA `948d6dbb501e79b9e4fca13548586ca7a88d9a80` (solo corrección de oráculo nativo sobre `122711fc0161468d8cb619b6ad2aa9a88295b5eb`).
Fixture original `\sqrt{-1}`, esperado «en ℝ: error claro; en ℂ: i». Los canales generales ensayados ya son complejos principales: antecedentes SY-E-17/18 y SY-R-08, Algebrite Lite y servicio evaluate Plus. No existe un selector ℝ aplicado a estos flujos; no se cambió el dominio ni se inventó un rechazo real. Otros canales restringidos a reales conservan su contrato y no reciben PASS de esta evidencia.
Ingesta exacta MathLive de la fuente original; salida exacta i visible y reentrada del resultado real; control i²=-1 y recuperación 2+3=5 con reentrada, cinco IDs distintos y cero pageerrors por perfil. Lite usa Worker real en navegador; Plus HTTP real y resultado MathResponse, aproximación real nula para i. Pruebas locales independientes añaden sqrt(-4)=2i y ausencia de símbolos libres/Float en HTTP.
- Lite [acumulativo38995803426](https://github.com/c2melendez/precision-lab-lite/actions/runs/38995803426):1601 PASS/30 TODO,183 archivos,typecheck/build,34 pruebas del mecanismo. [Nativo38995803418](https://github.com/c2melendez/precision-lab-lite/actions/runs/38995803418):408/408 PASS,desktop/tablet/mobile Chromium,sin reintentos. [H1d38995803385](https://github.com/c2melendez/precision-lab-lite/actions/runs/38995803385):21 PASS.
- Plus [acumulativo38995949507](https://github.com/c2melendez/precision-lab-plus/actions/runs/38995949507):frontend1005 PASS/28 TODO,146 archivos,typecheck/build;backend1468 PASS/2 XFAIL,cobertura88.00%;56 pruebas del mecanismo. [Nativo38995949534](https://github.com/c2melendez/precision-lab-plus/actions/runs/38995949534):30/30 PASS (10desktop+20tablet/mobile),sin reintentos. [H1d38995949509](https://github.com/c2melendez/precision-lab-plus/actions/runs/38995949509):38 PASS.
El primer nativo Plus38995800956 falló9PASS/1FAIL porque KaTeX mostró U+2212 frente a menos ASCII en el control -1, después de aprobar i y reentrada. Clasificado harness; se normaliza únicamente el signo visible, sin cambiar motor, respuesta ni oráculo matemático.
Campaña previa38992878940 ya completada: backendmutmut117278929669SUCCESS con mutaciones ejecutadas y logs revisados; frontend117278929718CANCELLED, logs contienen Vitest Worker exit1 en BasicModeConversionError.test.tsx y cancelación posterior, sin informe final. No se infiere score ni causa última de la cancelación. Misma huella cancelada requiere DIAGNOSE, no retry automático.
Campaña X08 [38995800990](https://github.com/c2melendez/precision-lab-plus/actions/runs/38995800990):nuevos insumos de pruebas en frontend/backend; audit56PASS, seguridadbackend117288027634PASS (pip-audit sin vulnerabilidades conocidas,Bandit sin incidencias,24tests); backendmutmut117288029927 SUCCESS con mutaciones reales y logs revisados (sin score global inferido); frontend117288029860 sigue en curso al corte. Frontendnpm yLitepin SKIPPED por alcance, no PASS. La corrección posterior e2e-only no activó otra campaña. Conservar los IDs e inspeccionar sus resultados, sin dispatch duplicado.
Gaps: MathLive asignación/input en tres perfiles Chromium, no cada tecla/SO/otro motor/botónReusar. Ningún TODO/XFAIL/SKIP es PASS. S25 (5high), S19 integral, SY-P23, SY-X04 Plus, H2/SG28/DIST y certificación global continúan abiertos. Próximo único SY-X-09-BILATERAL: potencia99999999999^{99999999999}, límites anunciados y recuperación; no ejecutar la potencia sin límites de recursos.


## 2026-10-17 UTC — SY-X-13 bilateral verificado
Fuente original `\frac{d}{dx}x^{x^{x}}` y oráculo `x^{x^{x}}\left(x^{x}(\ln x+1)\ln x+x^{x-1}\right)` intactos.
Alcance matemático **x>0**: derivada de la potencia anidada, no (x^x)^x ni ramas complejas. Sin cambios al motor en este lote.
MathLive ingiere la fuente original; las normalizaciones de espacios/llaves se admiten solo tras verificar contenido matemático. Lite usa Worker real, compara el LaTeX visible y su salida reintroducida por simplificación exacta frente al oráculo y controles numéricos en1.25,1.5,2. Plus usa POST/derivative real y POST/evaluate con el LaTeX real devuelto; verifica cada resultado con equivalencia SymPy exacta y la precedencia del payload original. Ambos recuperan2+3=5 y reintroducen5; cuatro IDs distintos y cero pageerrors por perfil.
- Lite SHA `76edee1a40df93d3945acb1b426d0bc190a67e2c`: [acumulativo39013568346](https://github.com/c2melendez/precision-lab-lite/actions/runs/39013568346)1607PASS/30TODO,188archivos,typecheck/build,34pruebas del mecanismo; [H1d39013568238](https://github.com/c2melendez/precision-lab-lite/actions/runs/39013568238)21PASS; [nativo39013568233](https://github.com/c2melendez/precision-lab-lite/actions/runs/39013568233)423/423PASS, incluidos X13 desktop/tablet/mobile,sin reintentos observados.
- Plus SHA `acd55e4b3cadf37b4c2e81dd044a5a95ad08d3c7`: [acumulativo39013565024](https://github.com/c2melendez/precision-lab-plus/actions/runs/39013565024)frontend1005PASS/28TODO,146archivos,typecheck/build;backend1478PASS/2XFAIL,cobertura88.11%;56pruebas del mecanismo. [Nativo39013565049](https://github.com/c2melendez/precision-lab-plus/actions/runs/39013565049)45/45PASS (15desktop+30tablet/mobile),sin reintentos. [H1d39013564974](https://github.com/c2melendez/precision-lab-plus/actions/runs/39013564974)38PASS.
La prueba HTTP separada traduce explícitamente el texto interno SymPy log→ln: **no** acredita reentrada literal de result_text(log), pues la gramática pública reserva log para base10. La reentrada nativa sí usa el result_latex(ln) real, sin traducciones del test. El Worker handler real Lite, con transporte simulado, se acredita aparte del navegador real.
No se repitieron X09–12 ni campañas de dependencias/mutación. Los encabezados obsoletos de CURRENT_STATE(X09) fueron archivados; el ledger y la nueva fotografía acuerdan X13 y el siguiente paso.
Campaña38995800990 reconciliada: frontend117288029860CANCELLED, initialrun693testsSUCCESS y cancelación posterior, sin informe final. No se infiere score ni causa no verificada. Backendmutmut117288029927SUCCESS ya revisado. Campaña39001980867: backendmutmut yseguridadSUCCESS según jobs; componentes ajenosSKIPPED. S19integral sigueOPEN; misma huella cancelada requiere diagnóstico y ninguna omisión equivale aPASS.
Limitaciones: asignación/input MathLive en desktop/tablet/mobile Chromium, no cada tecla/SO/otro motor/botónReusar; no identidad global en ramas complejas. TODO/XFAIL/SKIP no son PASS. GlobalOPEN; porcentaje reconciliadoND. S25, S19, SY-P23, SY-X04Plus y H2/SG28/DIST abiertos. Siguiente único: **SY-X-14-BILATERAL**,50recíprocos anidados, paridad y dominiox≠0 sin presimplificar; revisar presupuestos de longitud/AST antes de ejecutar.


## 2026-10-17 UTC — SY-X-14: Lite validado, matemática Plus bloqueada
El fixture descriptivo se conserva intacto. Su expansión operativa usa 50 fracciones recíprocas reales: 501 caracteres LaTeX. El testigo HTTP de 50 divisiones mide 201 caracteres; el árbol SymPy sin evaluar tiene 201 nodos y profundidad 101. No se sustituyó la fuente por x antes de validar.
**Lite:** paridad 49/50/51 comprobada con Algebrite y el handler Worker real; 50 devuelve x y los vecinos impares1/x. La restricción original x≠0 se verifica en los metadatos. El navegador prueba MathLive con 50 niveles y control49, salida exacta visible, restricción x≠0 visible, rechazo de cero anidado, recuperación5 y reentrada; cinco IDs exitosos distintos y cero pageerrors. Pegar solo el LaTeX x inicia una expresión nueva: no se acredita persistencia automática de restricciones sin sus metadatos ni el botónReusar.
**Plus:** el original traducido conserva las50divisiones y cabe en la longitud HTTP500. El AST excede profundidad30 y también nodos200. HTTP y MathLive muestran COMPLEXITY_LIMIT por profundidad, sin resultado ficticio, y se recuperan con5 y reentrada en tres perfiles. **Esto no resuelve el caso matemático:** el oráculo x con x≠0 queda BLOCKED y XFAIL estricto. Elevar solo profundidad tampoco solventaría nodos. [Contrato](SY_X_14_DEPTH_CONTRACT.md). No se cambian motor ni límites.
- Lite SHA `7decaedce18874cb8d81c7137761f69b860cca22`: [acumulativo39014331621](https://github.com/c2melendez/precision-lab-lite/actions/runs/39014331621)1612PASS/30TODO,189archivos,typecheck/build,34pruebas del mecanismo; [nativo39014331682](https://github.com/c2melendez/precision-lab-lite/actions/runs/39014331682)426/426PASS,incluidos X14 y49niveles en3perfiles,sin reintentos observados; [H1d39014331642](https://github.com/c2melendez/precision-lab-lite/actions/runs/39014331642)21PASS.
- Plus SHA `a66dac769c3212cb8e3dfe9951030eec0bd4711d`: [acumulativo39014327670](https://github.com/c2melendez/precision-lab-plus/actions/runs/39014327670)frontend1005PASS/28TODO,146archivos,typecheck/build; backend1479PASS/3XFAIL,cobertura88.07%;56pruebas del mecanismo. [Nativo39014327763](https://github.com/c2melendez/precision-lab-plus/actions/runs/39014327763)48/48PASS (16desktop+32tablet/mobile),incluye rechazo/recuperación deX14,no resolución. [H1d39014327685](https://github.com/c2melendez/precision-lab-plus/actions/runs/39014327685)38PASS.
Pruebas locales nuevas: Lite5PASS; Plus HTTP1PASS+1XFAILestricto. No campañas nuevas de mutación/dependencias, no dispatch manual ni repetición de gates equivalentes. Los commits documentales no acreditan nueva ejecución.
Continuidad: default_branch=main en ambos; sus README no contienen el puntero canónico. La rama qa/syntax-audit-in625-a1 se verificó mediante head_branch de las corridas reales y canonical_branch de los índices bilaterales. Se documenta recuperación genérica por esos metadatos y, si hace falta, búsqueda de ramas con índice, sin regresar al S26 histórico ni cambiar default_branch. El puntero raíz sigue ausente; la guía alternativa no lo convierte en existente.
Chromium desktop/tablet/mobile y asignación/input MathLive no certifican todas las teclas/SO/motores ni persistencia universal del dominio. TODO/XFAIL/SKIP no son PASS. Global OPEN, porcentaje ND. S25,S19,SY-P23,SY-X04Plus y H2/SG28/DIST permanecen abiertos. X14Plus es un bloqueo adicional explícito; no volver a ejecutar el mismo rechazo hasta cambiar la precondición contractual. **Siguiente único: SY-X-15-BILATERAL**, texto con script tratado como texto o error, nunca HTML ejecutable, con recuperación y evidencia por canal.


## 2026-10-17 UTC — SY-X-15 bilateral verificado
Fixture original `\text{<script>alert(1)</script>}` y oráculo intactos: texto inerte o error claro; nunca ejecución ni inserción del payload como HTML.
En los tres perfiles Chromium se ingiere la fuente original en MathLive y se exige texto completo inerte o aviso claro, sin resultado matemático falso. Se observa el documento y los ShadowRoot creados por MathLive, incluidos los cerrados; se verifica ausencia de nodos script del payload, diálogos y pageerrors antes de calcular, tras el resultado/error y después de recuperar. La sonda no sustituye alert ni bloquea inserción/ejecución: registra los diálogos y el test falla si aparecen, aunque los cierre para evitar un bloqueo del runner.
Un test separado comprueba el detector: inserta deliberadamente un script application/json inerte con el texto alert(1) en un ShadowRoot cerrado y exige una detección y cero diálogos. Es control del harness, no ejecución del payload de producto. Los contextos están aislados. Las dos copias del helper son idénticas y sus rutas están incluidas en los filtros nativos.
Recuperación real Worker Lite/HTTP Plus:2+3=5 y reentrada del5 con dos IDs exitosos distintos. Local, Lite parser y handler Worker real con transporte simulado rechazan el original; Plus HTTP real responde application/json con PARSE_ERROR/VALIDATION_ERROR, resultados nulos y recuperación/reentrada con tresIDsdistintos. No se acredita una llamada HTTP/Worker inválida desde UI cuando el rechazo pueda ser local.
Inspección de render: errores como texto React; Lite matemática mediante MathLive readonly; Plus MathRenderer usa salida KaTeX o texto React de fallback. Este lote no cambia motor, renderizadores, dependencias ni límites.
- Lite SHA `102bc45292f449854dc30bbdedaaac88d1cb64cc`: [acumulativo39015627360](https://github.com/c2melendez/precision-lab-lite/actions/runs/39015627360)1614PASS/30TODO,190archivos,typecheck/build y34pruebas del mecanismo; [nativo39015627406](https://github.com/c2melendez/precision-lab-lite/actions/runs/39015627406)432/432PASS,incluidos fixture y control de sonda en3perfiles,sin reintentos observados; [H1d39015627425](https://github.com/c2melendez/precision-lab-lite/actions/runs/39015627425)21PASS.
- Plus SHA `298a3c48a9cc140142852242aa88a481d4dcc311`: [acumulativo39015624925](https://github.com/c2melendez/precision-lab-plus/actions/runs/39015624925)frontend1005PASS/28TODO,146archivos,typecheck/build;backend1480PASS/3XFAIL,cobertura88.11%,56pruebas del mecanismo. [Nativo39015624985](https://github.com/c2melendez/precision-lab-plus/actions/runs/39015624985)54/54PASS (18desktop+36tablet/mobile),sin reintentos. [H1d39015624876](https://github.com/c2melendez/precision-lab-plus/actions/runs/39015624876)38PASS.
Las pruebas nuevas añaden3ejecuciones del fixture y3del control del detector por producto; los totales son tests, no requisitos independientes ni porcentaje de certificación. Logs y pasos revisados por SHA. Sin nueva campaña de mutación/dependencias ni dispatch manual duplicado. Las regresiones de los bloqueos previos permanecen en el acumulativo; no se abrió una campaña dirigida a repetir X14 sin cambiar sus precondiciones.
Alcance: este fixture y rutas instrumentadas en desktop/tablet/mobile Chromium; no auditoría universal de XSS, otros payloads, teclas/SO/motores o botónReusar. S25 yS19 integrales siguen abiertos; TODO/XFAIL/SKIP no son PASS. X04Plus y X14Plus continúan BLOCKED, SY-P23 y H2/SG28/DIST abiertos. El puntero ausente en README de main mantiene su guía alternativa, sin mover default_branch. Global OPEN, porcentaje ND.
**Siguiente único: SY-X-16-BILATERAL**, fuente original input de /etc/passwd: rechazada/ignorada sin lectura de archivos. Inspeccionar el contrato y usar instrumentación que detecte intentos sin leer el archivo real del host, con recuperación y evidencia por SHA; no repetir campañas equivalentes.


## 2026-10-17 UTC — SY-X-16 bilateral verificado
Fixture original `\input{/etc/passwd}` y oráculo intactos: comando ignorado/rechazado, sin lectura del archivo objetivo. No se abre ni se lee ese archivo para preparar el test o comparar su contenido.
Lite rechaza el comando desconocido en parser y en handler Worker real con transporte simulado. Plus HTTP real responde JSON de error, sin resultado, bajo una guarda de eventos Python open: cero intentos observados sobre el objetivo y recuperación5/reentrada con tresIDs distintos. El control positivo emite solo sys.audit(open,objetivo), sin llamar a open ni leer archivos; exige detección y bloqueo. Los hooks quedan inactivos al salir de cada contexto.
En navegador, MathLive ingiere el comando y conserva el identificador y la ruta en la serialización. Se exige aviso claro y ausencia de resultado matemático, solicitudes al objetivo, diálogos, descargas, filechooser y pageerrors, antes de calcular, tras el rechazo y tras recuperar. Worker Lite/HTTP Plus reales recuperan2+3=5 y reintroducen5 con dosIDs exitosos distintos.
La guarda de red bloquea preventivamente cualquier solicitud al objetivo y la registra: un intento, aunque bloqueado, haría fallar el caso. La aprobación exige cero intentos, no se infiere seguridad del bloqueo por sí solo. Un control aislado solicita únicamente una ruta sintética inexistente y exige una detección; nunca intenta obtener el archivo real. Las copias del helper son idénticas y están incluidas en los filtros de push/PR pertinentes.
- Lite SHA `b12aecc02f06086f1d4d8da91a26bd7b3bc3ae4f`: [acumulativo39016377044](https://github.com/c2melendez/precision-lab-lite/actions/runs/39016377044)1616PASS/30TODO,191archivos,typecheck/build,34pruebas del mecanismo. [Nativo39016377039](https://github.com/c2melendez/precision-lab-lite/actions/runs/39016377039)438/438PASS,incluidos fixture y control sintético en3perfiles,sin reintentos observados. [H1d39016377064](https://github.com/c2melendez/precision-lab-lite/actions/runs/39016377064)21PASS.
- Plus SHA `7bca63077a2225103c515c53d94a6002293835d6`: [acumulativo39016375092](https://github.com/c2melendez/precision-lab-plus/actions/runs/39016375092)frontend1005PASS/28TODO,146archivos,typecheck/build;backend1482PASS/3XFAIL,cobertura88.11%,56pruebas del mecanismo. [Nativo39016375110](https://github.com/c2melendez/precision-lab-plus/actions/runs/39016375110)60/60PASS (20desktop+40tablet/mobile),sin reintentos. [H1d39016375096](https://github.com/c2melendez/precision-lab-plus/actions/runs/39016375096)38PASS.
Nuevos tests locales:2Lite y2PlusPASS. Cada suite nativa incorpora3ejecuciones del fixture y3controles sintéticos; los totales son pruebas, no requisitos independientes. Se revisaron pasos/logs por SHA, incluida ejecución efectiva. No se inventa una llamada inválida HTTP/Worker desde UI si el rechazo es local; el rechazo raw del servicio/handler se acredita aparte.
Sin cambios al motor, renderizadores, dependencias, permisos ni límites. Sin campaña nueva de dependencias/mutación ni dispatch duplicado; las regresiones de bloqueos anteriores siguen en el gate acumulativo sin campaña dirigida a reintentar sus precondiciones invariables.
Alcance: fuente canónica y rutas examinadas, eventos Python open y solicitudes del navegador; no auditoría universal del filesystem/kernel, comandos, teclas/SO/motores ni botónReusar. Global OPEN, porcentaje ND; S25/S19 integrales, SY-P23, X04Plus/X14Plus y H2/SG28/DIST mantienen sus bloqueos. TODO/XFAIL/SKIP no son PASS.
**Siguiente único: SY-X-17-BILATERAL**, fuente write18{ls}, ignorada/rechazada sin ejecución. Instrumentar intentos de iniciar procesos/shell con controles sintéticos, sin ejecutar el comando para probarlo; preservar fuente, recuperación y evidencia nativa por SHA.

## 2026-10-17 UTC — SY-X-17 bilateral verificado con alcance acotado
Fixture original `\write18{ls}` y oráculo intactos: ignorado o rechazado; sin ejecución. El test nunca invoca ls, shell, subprocess, exec, spawn o fork como control positivo.
**Defecto encontrado y corregido en Plus:** nativo39017066935/job117351282488 sobre67b9ca8eb32edf282608e73fcf225ebdd06fda4b:20PASS/1FAILdesktop, perfiles posteriores no ejecutados. Artefacto12094727679 y reproducción directa confirman que MathLive convertía el comando en18l s y Plus mostraba un producto algebraico. No es prueba de ejecución de shell. Se clasifica PRODUCT_CONVERSION: el conversor rechaza ahora el comando TeX write antes de convertir a ASCII. Regresión frontend reproducida roja antes de corregir y aprobada después;10pruebas locales pertinentes ytypecheckPASS. No se relajó el oráculo ni se repitieron inputs idénticos: la nueva validación corresponde al código corregido.
Lite parser rechaza el original como carácter no reconocido; el handler Worker real con transporte simulado lo rechaza y recupera5/reentrada5 conIDs nuevos. Plus endpoint real vía TestClient rechaza el original bajo guarda de eventos Python de lanzamiento: subprocess.Popen,os.system,os.posix_spawn,os.exec,os.spawn,os.fork,pty.spawn. Cada evento tiene control positivo independiente que solo emite sys.audit con argumento sintético inexistente, sin llamar a las APIs de ejecución. La guarda registra y bloquea el intento antes de ejecutarlo; el caso exige cero intentos, aunque fueran capturados. Hooks inactivos al salir del contexto. HTTP recupera2+3=5 y reentrada5 con3IDs distintos.
MathLive ingiere el fixture original. Lite muestra rechazo claro sin resultado; Plus conserva write,18,ls en serialización y muestra Comando TeX no permitido sin POST inválido. UI recupera mediante Worker Lite/HTTP Plus reales y reintroduce5 con2IDs exitosos distintos. Cero diálogos,descargas,filechooser,pageerrors y accesos al objetivo de la sonda anterior; esa sonda de navegador no mide procesos del servidor. La ausencia de lanzamientos se acredita por la guarda HTTP separada y el alcance de las rutas examinadas, no por inferencia desde una UI local.
- Lite SHA `82a83c430a779eaa344be5be7644c9a38bfedc26`: [acumulativo39017068699](https://github.com/c2melendez/precision-lab-lite/actions/runs/39017068699)1618PASS/30TODO,192archivos,typecheck/build,34pruebas del mecanismo; [nativo39017068701](https://github.com/c2melendez/precision-lab-lite/actions/runs/39017068701)441/441PASS,147porperfil,5.8min,sin reintentos observados; [H1d39017068708](https://github.com/c2melendez/precision-lab-lite/actions/runs/39017068708)21PASS.
- Plus SHA `02a8f689aac5d4583a35edaa722851d344b27419`: [acumulativo39017316970](https://github.com/c2melendez/precision-lab-plus/actions/runs/39017316970)frontend1006PASS/28TODO,147archivos,typecheck/build,56pruebas del mecanismo;backend1490PASS/3XFAIL,cobertura88.13%,incluidos8testsX17; [nativo39017316988](https://github.com/c2melendez/precision-lab-plus/actions/runs/39017316988)63/63PASS,21desktop+42tablet/mobile,sin reintentos; [H1d39017316999](https://github.com/c2melendez/precision-lab-plus/actions/runs/39017316999)38PASS.
- [Preflight frontend39017316967](https://github.com/c2melendez/precision-lab-plus/actions/runs/39017316967)/job117351992865SUCCESS:760tests iniciales bajo instrumentación;2627mutantes instrumentados, **ninguna mutación ejecutada por dryRunOnly**, sin puntuación. No cierra S19.
- [Campaña afectada39017317053](https://github.com/c2melendez/precision-lab-plus/actions/runs/39017317053): router/job117351993121 revisado,mutation_frontendRUN con huella82373a097f9762093ad1fa9620f3b3c9695f55c361ab2156d134a518b5a78d73;job117352038619 en curso al corte. Seguridad,backend yLiteNOT_SELECTED/SKIP,noPASS. No cancelar ni relanzar esta campaña equivalente: consultar su resultado/jobs/logs existentes al reanudar. No inferir puntuación del preflight ni del estado en curso.
Alcance: fixture canónico, rutas predeterminadas examinadas y3perfilesChromium. Guarda de eventos de auditoría Python, no auditoría universal del kernel/C/extensiones ni prueba de todos los comandos,SO,motores,teclas o botónReusar. SG28_EVALUATE_ISOLATION permanece0 por defecto; el proceso de cálculo aislado opt-in no se certifica con esta guarda. Corrección solo en conversión frontend de Plus; sin motor matemático,dependencias,permisos ni límites modificados.
GlobalOPEN,porcentajeND. S25/S19integrales,SY-P23,X04Plus/X14Plus,H2/SG28/DIST y punteroREADME de main conservan estado. TODO/XFAIL/SKIP no sonPASS. Los checkpoints documentales no activaron Actions.
**Siguiente único: SY-X-18-BILATERAL**, fuente `__import__('os').system('ls')`, error de sintaxis sin ejecutar nada. Primero actualizar estado de la campaña39017317053 existente; después probar el caso independiente con detección/guardas de ejecución y controles sintéticos, sin invocar el comando ni evaluar código Python no confiable. Preservar fuente/oráculo,recuperación/reentrada y3perfiles; no repetir bloqueos sin cambio de precondición.

## 2026-10-17 UTC — SY-X-18 bilateral verificado con alcance acotado
Fixture original `__import__('os').system('ls')` y oráculo intactos: error de sintaxis sin ejecutar nada. Se trata la cadena como datos; las pruebas no la evalúan como Python ni invocan ls, shell, subprocess, exec, spawn o fork como control.
Lite parser y handler Worker real con transporte simulado rechazan el original y recuperan2+3=5/reentrada5 conIDs nuevos. Plus endpoint real vía TestClient responde JSON de error, sin resultado, bajo guarda de eventos de lanzamiento; cero intentos observados. Para el original se sustituye únicamente la frontera SymPy parse_expr por un detector que falla si se alcanza: **cero llamadas**, de modo que el rechazo precede al evaluador; se restaura antes de recuperación real y reentrada. TresIDsHTTP distintos.
La guarda Python compartida cubre subprocess.Popen,os.system,os.posix_spawn,os.exec,os.spawn,os.fork,pty.spawn, registra y bloquea antes del lanzamiento. Los7controles sintéticos existentes deX17 se mantienen una sola vez en el gate acumulativo y validan el helper extraído; no se duplican paraX18. Emiten solo sys.audit con argumento inexistente; nunca llaman a APIs de lanzamiento. Un intento capturado haría fallar el caso; cero intentos no se infiere solo del bloqueo. Hooks inactivos al salir del contexto.
Nativo: MathLive ingiere la fuente canónica; la serialización puede expresar subíndices/primas pero conserva todas las letras import,os,system,ls en orden (normalización solo en la aserción, no en la entrada de producto). Se exige rechazo visible sin resultado y cero diálogos,descargas,filechooser,pageerrors y solicitudes al objetivo de la sonda de red anterior. Esta sonda no mide procesos del servidor; la prueba de guarda HTTP es separada. Recuperación y reentrada usan Worker Lite/HTTP Plus reales con2IDs exitosos distintos. No se inventa una llamada inválida Worker/HTTP desde UI cuando el rechazo es local.
- Lite SHA `b2d11c62ca7c2c1305ccbbdfe7a603fcc285f9d4`: [acumulativo39047968609](https://github.com/c2melendez/precision-lab-lite/actions/runs/39047968609)1620PASS/30TODO,193archivos,typecheck/build,34pruebas del mecanismo. [Nativo39047968619](https://github.com/c2melendez/precision-lab-lite/actions/runs/39047968619)444/444PASS,148porperfil,5.7min,sin reintentos observados; [H1d39047968611](https://github.com/c2melendez/precision-lab-lite/actions/runs/39047968611)21PASS.
- Plus SHA `6cf267b479c290905c2c1188fc8e11d818ccc861`: [acumulativo39047964640](https://github.com/c2melendez/precision-lab-plus/actions/runs/39047964640)frontend1006PASS/28TODO,147archivos,typecheck/build,56pruebas del mecanismo;backend1491PASS/3XFAIL,cobertura88.07%,incluidoX18y7controlesdelhelper. [Nativo39047964663](https://github.com/c2melendez/precision-lab-plus/actions/runs/39047964663)66/66PASS,22desktop+44tablet/mobile,sin reintentos; [H1d39047964674](https://github.com/c2melendez/precision-lab-plus/actions/runs/39047964674)38PASS.
Nuevos tests locales:2LitePASS y9PlusPASS (X18+X17y7controlesexistentes). Logs revisados porSHA, ejecución efectiva y pasos obligatorios. Los totales son pruebas, no requisitos únicos ni porcentajes certificados.
Solo tests,helper compartido y workflowLite para incluir el nuevo spec; sin motor,conversión de producto,dependencias,permisos ni límites modificados. No nueva campaña de mutación ni dependencias, no dispatch manual ni reintento equivalente.
**S19 reconciliado:** campaña39017317053/job117352038619 sobre02a8f689 COMPLETED/CANCELLED. Logs:2627mutantes instrumentados;initialrun693testsPASS; después errores repetidos Workerexit1/ChildProcessCrashedError en BasicModeConversionError.test.tsx y cancelación. No informe final ni artefactos de mutación; scoreND. Preflight39017316967 con760tests fue dryRunOnly y no midió mutaciones. No se atribuye causa definitiva de cancelación ni se inventa score. S19OPEN; diagnosticar fallo instrumentado/recursos antes de relanzar inputs equivalentes. Se retiró la marca obsoleta de campaña en curso y se conservó el run histórico cancelado; no queda una espera indefinida ni se repite automáticamente.
Alcance: fixture y rutas predeterminadas examinadas,3perfilesChromium,eventos Pythonaudit y fronteraSymPy señalada; no auditoría universal del kernel/C/extensiones,otras APIs/entradas,teclas/SO/motores ni botónReusar. SG28_EVALUATE_ISOLATION opt-in permanece fuera de este caso. GlobalOPEN,porcentajeND; S25/S19integrales,SY-P23,X04Plus/X14Plus,H2/SG28/DIST y punteroREADME de main conservan bloqueos. TODO/XFAIL/SKIP no sonPASS. Checkpoints documentales sin Actions.
**Siguiente único: SY-X-19-BILATERAL**, fuente `open('/etc/passwd').read()`, error de sintaxis sin ejecutar nada. Inspeccionar rutas y probar rechazo antes de evaluadores, con guardas de acceso/lectura y lanzamiento, controles sintéticos que jamás abran/lean el objetivo ni ejecuten comandos, fuenteMathLive y recuperación/reentrada en3perfiles. Reutilizar evidencia equivalente revisada; no repetir S19 o bloqueos sin cambio de precondición.

## 2026-10-17 UTC — SY-X-19 bilateral verificado con alcance acotado
Fixture original `open('/etc/passwd').read()` y oráculo intactos: error de sintaxis sin ejecutar nada. La cadena es dato, no código Python del test. No se abre ni se lee el archivo objetivo para preparar la prueba, verificar contenido o realizar controles positivos.
Lite parser y handler Worker real con transporte simulado rechazan el original y recuperan2+3=5/reentrada5 conIDs nuevos. Plus endpoint real vía TestClient responde JSON de error sin resultado bajo guardas compartidas de apertura del objetivo y lanzamiento de procesos. Cero intentos auditados de open del objetivo y cero lanzamientos. Para el original, la frontera SymPy parse_expr se sustituye por un detector que falla si se alcanza: cero llamadas; el evaluador se restaura antes de recuperación real y reentrada. TresIDsHTTP distintos.
La guarda de apertura se extrajo a helper compartido; el control existenteX16 emite solo sys.audit(open,objetivo), sin llamar aopen ni leer archivo. Los7controles sintéticos existentesX17 verifican la guarda de procesos:subprocess.Popen,os.system,os.posix_spawn,os.exec,os.spawn,os.fork,pty.spawn. Se conserva un único juego de8controles en el gate acumulativo, no se duplican paraX19. Los hooks registran y bloquean antes del acceso/lanzamiento, quedan inactivos al salir; un intento capturado haría fallar el caso. Cero intentos no se infiere solo del bloqueo.
Nativo: MathLive ingiere la fuente original; sus cambios de formato no pueden borrar las letras open,etc,passwd,read ni alterar su orden (normalización solo en la aserción). Se exige rechazo visible sin resultado, cero solicitudes al objetivo de la sonda de red,diálogos,descargas,filechooser ypageerrors antes y después del rechazo/recuperación. La sonda abortaría y registraría cualquier petición al objetivo, que haría fallar el caso. Los controles del navegador existentes usan una ruta sintética inexistente, nunca el archivo real. No se atribuye a la sonda de navegador auditoría de filesystem o procesos del servidor; el endpoint original se verifica por separado. Recuperación/reentrada conWorkerLite/HTTPPlus reales y2IDs exitosos distintos. No se inventa una invocación inválidaHTTP/Worker desdeUI si el rechazo es local.
- Lite SHA `121a64f539f03c3034674a897c34db563b6752e6`: [acumulativo39051773589](https://github.com/c2melendez/precision-lab-lite/actions/runs/39051773589)1622PASS/30TODO,194archivos,typecheck/build,34pruebas del mecanismo. [Nativo39051773497](https://github.com/c2melendez/precision-lab-lite/actions/runs/39051773497)447/447PASS,149porperfil,6.0min,sin reintentos observados; [H1d39051773331](https://github.com/c2melendez/precision-lab-lite/actions/runs/39051773331)21PASS.
- Plus SHA `4ee6a9db00dbd49790f661715ca53d5ed3995071`: [acumulativo39051770401](https://github.com/c2melendez/precision-lab-plus/actions/runs/39051770401)frontend1006PASS/28TODO,147archivos,typecheck/build,56pruebas del mecanismo;backend1492PASS/3XFAIL,cobertura88.13%,incluidosX19y8controlescompartidos. [Nativo39051770310](https://github.com/c2melendez/precision-lab-plus/actions/runs/39051770310)69/69PASS,23desktop+46tablet/mobile,sin reintentos; [H1d39051770321](https://github.com/c2melendez/precision-lab-plus/actions/runs/39051770321)38PASS.
Pruebas locales:2LitePASS y11PlusPASS (X19+X16/X17con8controlesexistentes). Logs revisados porSHA y pasos obligatorios ejecutados, sin inferirPASS de metadatos solos. Los totales son pruebas, no requisitos únicos ni porcentajes certificados.
Solo tests,helper compartido yworkflowLite; sin cambios a producto,motor,conversores,dependencias,permisos ni límites. No nueva campañaS19/S25 ni dispatch manual, no reintento de inputs equivalentes o bloqueos sin cambio. S19 conserva campaña39017317053/job117352038619CANCELLED,Workerexit1instrumentado ysin informe/score; diagnosticar antes de repetir. No existe una espera activa obsoleta.
Alcance: fixture canónico,rutas predeterminadas y3perfilesChromium,eventos auditadosopen/procesos yfronteraSymPy señalada. No auditoría universal del kernel,C/extensiones,descriptores yaabiertos,aliasesdearchivo,otrasAPIs/entradas,teclas/SO/motores ni botónReusar. El modoSG28aisladoopt-in queda fuera. GlobalOPEN,porcentajeND;S25/S19integrales,SY-P23,X04Plus/X14Plus,H2/SG28/DIST ypunteroREADME de main conservan bloqueos. TODO/XFAIL/SKIP no sonPASS. Prosa sin Actions.
**Siguiente único: SY-X-20-BILATERAL**, fuente `😀+1`, error claro de carácter no válido. Preservar el punto de código yla fuente enMathLive, verificar rechazo legible enparser/Worker/HTTP según canal, ausencia de resultado ficticio,recuperación/reentrada conIDsdistintos y3perfilesChromium. No confundir inserción programática con todas las teclas/IME/SO; no repetir campañas o bloqueos ajenos sin cambiar sus precondiciones.


## 2026-10-19 UTC — AS-PAR-10: parámetro simbólico libre no implementado

`x/(x-a)=1` con `a` sin valor numérico no tiene análisis por casos: Plus devuelve `equation_solutions []` (lista vacía sin explicación de dominio) y Lite lanza unsupported-operation. El contrato oficial (a≠0 sin solución; a=0 toda x≠0) solo está acreditado para las instancias a=3 y a=0. No contar como PASS; requiere extender la clasificación racional a numeradores con parámetros (condicionales en a) en ambos productos antes de reclasificar. Los gates de CI no leen logs crudos en esta sesión por política de egreso; ver CURRENT_STATE.

## 2026-10-19 UTC — AS-AVS-01: reescritura real de |u|^2 acotada en Plus

Plus solo reescribe la entrada original exacta `Abs(x)**2` (símbolo `x`) a `x**2`, tras confirmar con `refine` bajo `Q.real(x)`; SymPy no asume variables reales, por lo que `|y|^2`, `|x+1|^2` u otras subexpresiones siguen devolviendo `Abs(...)**2`. No se afirma una política general «variables reales» en el simplificador. Lite (Algebrite) reduce `|x|^2` nativamente. Condición de salida: decisión de producto sobre el dominio real por defecto del simplificador Plus y pruebas originales que la cubran.

## 2026-10-19 UTC — AS-AVS-10: soluciones en intervalo y parámetro `c` simbólico no implementados

`|x-1|+|x-5|=4` tiene solución `x∈[1,5]`; ambos motores devuelven `UNSUPPORTED_OPERATION` en lugar de inventar raíces finitas. `c` simbólico tampoco está soportado. AS-AVS-10 queda PARTIAL_BILATERAL.

## 2026-10-19 UTC — AS-RAD: alcance acotado del solver de radicales

Soportado: una variable, radicandos polinómicos de coeficientes racionales, índices 2..4, hasta 2 radicales distintos (Lite) / 3 (Plus), sin anidamiento. En Plus `cbrt(...)` se parsea como `Piecewise` y no entra en el solver; AS-RAD-07 se certifica con `root(x-1,3)` y `(x-1)**(1/3)`.

## 2026-10-20 UTC — AS-MUL: factorización multivariable, supuestos y suma de cuadrados

- **Lite (Algebrite 1.4):** `factor` no factoriza polinomios multivariables (AS-MUL-02 devuelve la forma expandida; AS-MUL-03 no termina en tiempo acotado) y `gcd` multivariable devuelve 1, por lo que `(x-y)/(x^2-y^2)` no se reduce a `1/(x+y)` (AS-MUL-04; el dominio `x^2-y^2≠0` sí se conserva). Registrados como `it.fails`/`it.todo`. Las reescrituras por cadena exacta introducidas en `a564285e`/`08b81dec` se revirtieron: no son capacidad.
- **Ambos motores:** ninguna operación acepta supuestos del usuario (AS-MUL-05 `x+y+z=0 ⇒ 3xyz`); los tests solo comprueban que no se afirma `3xyz` incondicionalmente. No existe reescritura a `½((x−y)²+(y−z)²+(z−x)²)` (AS-MUL-06); Plus la registra como `xfail(strict)`.
- Salida: capacidad general (no por entrada exacta) con test original verde y gates exact-SHA.

## 2026-10-21 UTC — TRIG EV-D-11: identidad pitagórica no colapsada en el canal primario (Lite)

`evaluate()` de Lite conserva la forma exacta `cos(1/8*pi)^2+sin(1/8*pi)^2` para `sin²(π/8)+cos²(π/8)`; `simplify(...)` sí devuelve `1`. EV-D-11 se certifica como PASS_SCOPED_EQUIVALENT (equivalencia exacta + valor numérico, regla G2), no como igualdad textual. Plus devuelve `1` literal. Condición de salida: decisión de producto sobre simplificación automática de identidades pitagóricas en `evaluate()` y pruebas que la cubran.

## 2026-10-21 UTC — TRIG EV-I-09/EV-I-10: alcance declarado de la reescritura de composiciones

`engine/inverseTrigComposition.ts` (Lite) reescribe **solo** una composición completa inversa↔directa cuyo argumento es numérico: `arcsin(sin t)`, `arccos(cos t)`, `arctan(tan t)`, `sin(arccos u)`, `cos(arcsin u)`, `tan(arcsin u)`, `tan(arccos u)`.

- Una composición **anidada dentro de una expresión mayor** (por ejemplo `arcsin(sin 2)+1` o `2*sin(arccos 3/5)`) no se reescribe y conserva el comportamiento previo del motor (Algebrite colapsa la rama). Condición de salida: generalizar la reescritura a subexpresiones con pruebas de no regresión.
- Los argumentos simbólicos (`arcsin(sin x)`) no se tocan: la identidad depende del rango y no se asume.
- El canal LaTeX contractual (`\arcsin`, `\arccos`, `\arctan`, `\arcsec`, `\arccsc`, `\arccot` y las inversas hiperbólicas) ya se acepta en G3; antes abortaba con «Comando desconocido» y las filas EV-I solo eran certificables por el canal ASCII.

## 2026-10-21 UTC — LOG/EXP EV-E: diagnóstico r229 y decisiones r230

- **EV-E-14 `0^{0}`:** ambos motores devuelven `1`. Se **declara** la convención `0^0 = 1`, que la fila admite explícitamente («o `1` por convención declarada»). No es un fallo: queda registrada como decisión, revisable si el contrato cambia.
- **EV-E-12 `(1+1/1000)^{1000}`:** ambos motores devuelven como `result_text` una fracción exacta de ~3600 dígitos, mientras `result_approx` sí es `2.716923932`. Defecto **bilateral** de presentación/complejidad, no matemático. **Decisión declarada en r230:** la fila se certifica por su oráculo numérico (`result_approx = 2.716923932`) y se conserva la forma exacta como `result_text`; la explosión textual queda registrada como limitación de presentación, revisable si el contrato exige una forma acotada.
- **EV-E-10 `e^{\ln 2+\ln 3}`:** Plus devolvía `6`; Lite conservaba `exp(log(2)+log(3))`. **Corregido en r230** (Lite `16e5ca75`): `engine/expLogSimplify.ts` aplica la identidad exacta `exp(±log r1 ± log r2 …) = producto/cociente` de racionales literales con enteros seguros; las formas no soportadas quedan intactas. Fila cerrada.

## 2026-10-21 UTC — RADICALES EV-R: convenciones declaradas (antes de certificar)

- **Notación radical con índice impar = raíz real.** `\sqrt[3]{-8} = -2` y `\sqrt[5]{-32} = -2` (EV-R-03/EV-R-05). Es la convención de ambos motores tras el arreglo de r231 en Plus; Lite ya la aplicaba en el parser.
- **Potencia con exponente fraccionario = rama principal.** `(-8)^{1/3} = 2(-1)^{1/3} = 1+\sqrt{3}i` (EV-R-14). La fila exige declarar real o principal: se declara **principal** para la notación de potencia, coherente con la regla anterior (la notación determina la rama).
- **`\sqrt{-4} = 2i` (rama compleja)** (EV-R-13). La fila admite la rama compleja en ℂ solo si se declara; se declara. No se emite error de dominio porque el motor es complejo por contrato y la variante de error claro corresponde al dominio real.
- **Alcance de la racionalización EV-R-08.** Solo resultados completos `1/(a±√b)` con enteros literales y `|b−a²| = 1`; no se reescriben denominadores con coeficiente en el radical (`1/(3+2√2)`), sumas mayores ni subexpresiones anidadas.
- **Alcance del denesting EV-R-11/EV-R-12.** Solo una raíz cuadrada completa cuyo radicando ya contiene otra raíz cuadrada; no se generaliza a raíces de índice superior ni a subexpresiones.

## 2026-10-21 UTC - Auditoría lógica r232: alcance de convenciones y defectos abiertos

- **`0^0 = 1` (EV-E-14) - alcance.** La convención se limita a la evaluación escalar directa y a la fila que la admite. No se aplica a límites ni a formas indeterminadas (bloque 4.M): esas filas deben calcular el límite por su propia vía y no reutilizar la sustitución `0^0 = 1`.
- **EV-T-11 - fuga de dominio semántica en Plus (ABIERTA).** `ln(1-1)` y `ln(cos(pi/2))` devuelven `success=true` con `result_text="zoo"`; `ln(0)`, `ln(0+0)`, `ln(sin(0))` y `log(0,10)` sí devuelven `DOMAIN_ERROR`. La guarda es sintáctica/parcial. Lite devuelve `DOMAIN_ERROR` en ambos casos. Corrección obligatoria antes de certificar EV-T; la prueba de EV-T-11 debe exigir `DOMAIN_ERROR`, no solo `success`.
- **Manifiesto de fuentes no cableado en CI (ABIERTA).** `check_legacy_sources.py` verifica el SHA-256 del manifiesto y da PASS local en ambos repos (`LER sha256_raw=bb7030e2...`, 47710 bytes), pero ningún workflow lo ejecuta. Pendiente incorporarlo al gate acumulativo.
- **Oráculos anclados (r232).** Las filas `\approx` de EV-E anclan la referencia congelada presente en la fila y prohíben una salida solo decimal (regla 2); EV-E-10/11 y EV-R-03/05/06/07/08/09/10/11/12 anclan sus oráculos. Sin cambio de producto.

## 2026-10-21 UTC — LOG/EXP EV-M: cierre r234 y alcances declarados

- **EV-M-01..13 (mixtas) — PASS_SCOPED_BILATERAL.** Cerrado sobre el SHA técnico Lite `737a82d4eacf6bd6e4c22e719fa7f75df2de3410` y Plus `16df9f6e5e1edc8303c2f66bc7154c93c54e67ef`; gates acumulativos verdes por `head_sha` exacto y `attempt=1` (Lite 2063 passed; Plus 1831 passed, cobertura 88.05%). Blockers independientes sin cambios; certificación global `OPEN`.
- **Alcance de `exp(k·log r) = r^k` (EV-M-02).** Lite aplica la identidad exacta solo cuando el resultado completo es `exp(k*log(r))` con `k` entero (`|k| ≤ 400`) y `r` racional positivo; el producto BigInt queda acotado por `MAX_SAFE_PRODUCT` y, si lo excede, la forma original se conserva. No se generaliza a exponentes simbólicos, sumas no logarítmicas ni bases no racionales.
- **Alcance de la suma de conjugados (EV-M-13).** Lite reduce `log(a−√b)+log(a+√b)` a `0` solo para pares conjugados con `a>0`, `b≥0` y `a²−b = 1` (ambos argumentos positivos). La suma general de logaritmos no se colapsa: `\ln(3-\sqrt5)+\ln(3+\sqrt5)` (producto 4) queda simbólica en Lite y `ln(4)` en Plus; ninguna de las dos es `0`, y la fila congelada no lo exige.
- **Definición-llamada efímera (EV-M-04).** Ambos motores leen `f(x)=…; f(arg)` como una sustitución local al request, con argumento equilibrado (`f(sqrt(e-1))`). No hay registro global de funciones. Lite acepta la forma LaTeX congelada con `\left`/`\right`; Plus consume la **traducción plana documentada** (`f(x)=ln(x^2+1); f(sqrt(e-1))`) y el test ancla la fila LaTeX original del `.gz`; el API de Plus no consume LaTeX crudo, igual que en EV-E/EV-R.
- **Semántica de logaritmos en Plus.** La sustitución conserva la convención de calculadora: `log` es base 10 y `ln` es natural. `_rewrite_natural_logs` reemite como `ln(...)` los logaritmos de un argumento que SymPy imprime como `log(...)`; `log(x)` base 10 sigue siendo `ln(x)/ln(10)`, de modo que `f(x)=log(x); f(100) = 2`.
- **Notación científica (Plus).** Se rechaza solo el literal numérico `dígito[eE][+-]?dígitos` (`1e5`, `2.5E-3`); la constante `e` seguida de signo (`e−1`) ya no se bloquea, requisito de la fila EV-M-04.
- **Evidencia bilateral.** Lite `tests/logExpEvM01to13.audit.test.ts` 7/7; Plus `tests/test_log_exp_matrix_ev_m01_l13.py` 6/6 PASSED; ambos anclan la fila congelada de `legacy_sources/matriz_log_exp_radicales.md.gz`.

## 2026-10-21 UTC — TRIG/LOG/EXP EV-T: cierre r235 y convenciones declaradas

- **EV-T-01..12 (trigonométricas, hiperbólicas e inversas) — PASS_SCOPED_BILATERAL.** Cerrado sobre Lite `e8b1def62e2ef1249ffccbde0dfbf09868ca5f0e` y Plus `d1e387536713bc057109e2fec1af2846a2c1b36b`; gates por `head_sha` exacto y `attempt=1` (Lite cumulative 2071 passed, EV-T 8/8; Plus backend 1838 passed, cobertura 88.05%, EV-T 7/7). Blockers independientes sin cambios; certificación global `OPEN`.
- **EV-T-05 — canal numérico (limitación declarada).** `\ln(\cosh 1) \approx 0.433780830`: el CAS no produce una forma cerrada mejor. Lite imprime el flotante de 6 decimales (`0.433781`, tolerancia 1e-6, reglas 3–4); Plus conserva la forma exacta `ln(cosh(1))` y expone `result_approx=0.4337808304830272`. Misma limitación ya registrada para EV-H-10/11.
- **EV-T-07 — reducción de argumento.** Ambos motores conservan la forma exacta `sin(10000000000000000000000)` (regla 2) y el canal aproximado coincide con la referencia `-0.852200850` (Plus `result_approx`; Lite `float` de 6 decimales).
- **Equivalencia exacta admitida (G2).** EV-T-02 se certifica con `exp(1/2)≡√e`; EV-T-10 con `3^(1/2)≡√3` (identidad exacta `exp(atanh x)=√((1+x)/(1-x))`). No se exige igualdad textual cuando existe una representación exacta equivalente.
- **EV-T-08/EV-T-12 — rama compleja.** La fila documenta `i` en ℂ; la salida de SymPy es `I`. Convención `i`(entrada)≡`I`(salida) ya aceptada. En ℝ, EV-T-12 exige error claro; ambos motores toman la rama compleja declarada.
- **EV-T-09/EV-T-10 — alcance de las reducciones de Lite.** `engine/inverseHyperbolicExact.ts` actúa solo sobre (a) un resultado completo `asinh/acosh/atanh(<numérico>)` cuyo valor real es exactamente entero y (b) `exp(atanh(a/b))` con enteros `0≤a<b`. Cualquier otra forma se devuelve intacta: sin aproximación ni heurística.
- **EV-T-11 — fuga de dominio cerrada en Plus.** `ln(1-1)`, `ln(0)`, `ln(0+0)`, `ln(cos(pi/2))`, `log(0,10)` → `DOMAIN_ERROR`; `ln(-1)=I*pi`, `ln(e)=1`, `log(100)=2` intactos. La guarda se acota a logaritmos cuyo argumento no está demostrado distinto de cero.
- **Alias hiperbólicos inversos (Plus).** `\operatorname{arsinh}`/`\operatorname{artanh}` se evalúan en Plus mediante la traducción plana documentada `asinh`/`atanh` (el frontend mapea `arsinh→\operatorname{asinh}`). Plus mantiene el rechazo documentado de `arcsinh/arccosh/arctanh` (capacidad sin cambio).
- **Evidencia bilateral.** Lite `tests/logExpEvT01to12.audit.test.ts` 8/8; Plus `tests/test_log_exp_matrix_ev_t01_l12.py` 7/7 PASSED; ambos anclan la fila congelada de `legacy_sources/matriz_log_exp_radicales.md.gz`.

## 2026-10-22 UTC — MATRICES MV-B: cierre r237 y convenciones declaradas

- **MV-B-01..22 (determinantes) — PASS_SCOPED_BILATERAL.** Cerrado sobre Lite `09ac205f7716994a2a04a222c5d276f35cef78fa` y Plus `c31e54091302acd102945858cfbbce7d70e034ed`; gates de alcance por `head_sha` exacto y `attempt=1` (Lite cumulative 2127 passed, MV-B 27/27; Plus backend 1891 passed, cobertura 88.28%, MV-B 26/26). Blockers independientes sin cambios; certificación global `OPEN`.
- **Determinantes numéricos (01–15).** El camino exacto existente se conserva: Fraction en Lite y SymPy en Plus. Las filas cubren 1×1, 2×2, 3×3, 4×4, Hilbert 4×4/5×5 (`1/6048000`, `1/266716800000`), tridiagonal 6×6 (`7`), matrices singulares/proporcionales (`0`), propiedades `det(2A)`/`det(AB)` y el decimal exacto `-0.02`.
- **Determinantes simbólicos (Lite, 16–21).** Nuevo `src/engine/symbolicDeterminant.ts`: expansión por cofactores acotada a 4×4 y `simplify` de Algebrite; `compute.worker.ts` enruta Fraction → constantes → simbólico. 16=`a*d-b*c`; 17=`-x^2+1`; 18/19 se aceptan por equivalencia algebraica exacta con la forma expandida; 20=`1`; 21=`0`. El camino numérico exacto no cambia.
- **Determinantes simbólicos (Plus, 16–21).** `parse_matrix(..., allow_symbolic=True)` y `_parse_matrix_cell(..., allow_symbolic=True)` aceptan variables libres y trigonométricas elementales (`sqrt/abs/sin/cos/tan`); `determinant()` aplica `trigsimp`+`simplify` y `factor` si el resultado es polinómico. **Solo** `/matrix/determinant` activa el modo simbólico; el resto de `/matrix/*` mantiene el contrato numérico estricto. 16=`a*d - b*c`; 17=`-(x-1)*(x+1)`; 18=`-(a-b)*(a-c)*(b-c)`; 19=`(a-1)^2*(a+2)`; 20=`1`; 21=`0`; `result_approx=None` cuando hay variables libres.
- **Traducciones de harness.** Lite numérico: `\frac{a}{b}` → `a/b`. Plus simbólico: `a^{2}` → `a^2` y `\cos\theta` → `cos(theta)`. MV-B-13/14 se componen con operaciones del producto (`det(2A)`, `det(AB)`), no con un oráculo paralelo. 18/19 se aceptan por equivalencia algebraica exacta; 18 y 19 se verifican además como producto factorizado.
- **Fila de error 22.** `\det` de una matriz 2×3 exige `DIMENSION_MISMATCH` con mensaje no vacío; ambos motores lo cumplen.
- **Evidencia bilateral.** Lite `tests/matricesMvB01to22.audit.test.ts` 27/27; Plus `tests/test_matrices_mv_b01_l22.py` 26/26 PASSED; ambos anclan la fila congelada de `legacy_sources/matriz_matrices_vectores.md.gz` y el JSONL derivado (153 filas). `toLatex` de Lite elimina `*`, por eso los tests comparan la expresión exacta y no el texto LaTeX.
- **Gate de seguridad (independiente).** El push no tocó rutas del filtro `certification-dependency-gates`; no hubo corrida de security/dependency. **SECURITY-S25** sigue como blocker independiente y no es evidencia de MV-B.

## 2026-10-22 UTC — MATRICES MV-A: cierre r236 y convenciones declaradas

- **MV-A-01..25 (operaciones básicas con matrices) — PASS_SCOPED_BILATERAL.** Cerrado sobre Lite `c191bcc2cea091ac18342418ae8ed0369f6760c2` y Plus `dfdf7d1a87043901b10ff1e6926fafe835e65bca`; gates de alcance por `head_sha` exacto y `attempt=1` (Lite cumulative 2100 passed, MV-A 29/29; Plus backend 1865 passed, cobertura 88.16%, MV-A 27/27). Blockers independientes sin cambios; certificación global `OPEN`.
- **Celdas LaTeX en Lite (traducción de harness).** La tabla congelada escribe `\frac{a}{b}`; la grilla del módulo Matrices es un `<input>` ASCII y recibe `a/b`. El camino del calculador (`detectMatrixIntent`) normaliza la misma forma; la traducción no altera el valor ni el oráculo.
- **Escalar × matriz en Plus (ruta del producto).** `/matrix/*` no expone una operación `scale`; el frontend (`BasicMode.tsx`) la ejecuta como `(k·I)×A` con `multiply`. El test de MV-A-03/04 replica esa ruta, no una multiplicación inventada por el harness.
- **MV-A-24 (expresión con nombres).** `(A+B)^2-(A^2+2AB+B^2)` con A y B «como arriba» se compone con las operaciones del producto: Lite usa `matrixExpression` (que ahora acepta escalares numéricos) y Plus usa `multiply`/`subtract` (`= BA-AB`). La fila no se evalúa con un oráculo paralelo.
- **Potencias negativas (Lite).** `powerMatrix` acepta enteros negativos: invierte primero y eleva el valor absoluto; una matriz singular sigue dando `DOMAIN_ERROR` y un exponente no entero sigue rechazado. La UI del módulo Matrices permite exponente negativo (mínimo −10). Plus ya soportaba exponentes negativos vía SymPy.
- **Filas de error 20–23.** El contrato es `DIMENSION_MISMATCH` con mensaje no vacío: suma 2×2+2×3, producto 2×3·2×3, inversa de 2×3 y potencia de 2×3. Ambos motores lo cumplen.
- **Evidencia bilateral.** Lite `tests/matricesMvA01to25.audit.test.ts` 29/29; Plus `tests/test_matrices_mv_a01_l25.py` 27/27 PASSED; ambos anclan la fila congelada de `legacy_sources/matriz_matrices_vectores.md.gz` y el JSONL derivado (153 filas).
- **Gate de seguridad (independiente).** El job Stryker de Plus tiene un límite de 35 min y expiró; la revalidación expuso advisories npm pre-existentes (SECURITY-S25). No es un gap de capacidad matemática ni evidencia de MV-A.

## 2026-10-22 UTC — MATRICES MV-C: cierre r238 y convenciones declaradas

- **MV-C-01..19 (inversa, adjunta, cofactores y ecuaciones matriciales) — PASS_SCOPED_BILATERAL.** Cerrado sobre Lite `3aec2c258c2fbe5e2c2c11f50d3db74aa8d610ec` y Plus `9083811b04609489fa26973cbec90e3aa2238769`; gates de alcance por `head_sha` exacto y `attempt=1` (Lite cumulative 2152 passed, MV-C 24/24; Plus backend 1915 passed, cobertura 88.08%, MV-C 25/25). Blockers independientes sin cambios; certificación global `OPEN`.
- **Inversa numérica exacta (01–07, 09, 17).** Lite conserva Fraction en `matrixOps`; Plus conserva la ruta SymPy exacta. Las celdas decimales se racionalizan de forma exacta (09=`[[2,-4],[-4,10]]`). La inversa de la matriz parentetizada 17 no se confunde con una expresión escalar.
- **Inversa simbólica/compleja (08, 10, 11).** Lite intenta primero Fraction y cae a `symbolicMatrix.ts` solo si hay celdas no racionales; la expansión simbólica está acotada a 4×4. Plus acepta variables libres y trigonométricas elementales en `/matrix/inverse` con `SYMBOLIC_MATRIX_LIMIT=4`; fuera del límite devuelve `UNSUPPORTED_OPERATION`, sin resultado ficticio. 08 usa la convención `i` de entrada ≡ `I` de SymPy y conserva el valor complejo exacto; 10 y 11 se aceptan por equivalencia algebraica exacta.
- **Adjunta y cofactores (14–16).** Lite calcula cofactores exactos con el mismo determinante de `matrixOps` y obtiene la adjunta por transpuesta; si hay celdas no racionales usa la ruta simbólica acotada. Plus mantiene `/matrix/adjugate` y `/matrix/cofactor` con contrato **estrictamente numérico**: no se amplía el modo simbólico de determinante/inversa a estas rutas. La relación `cof(A)=adj(A)^T` se verifica contra la fila congelada; 16 no es la adjunta.
- **Ecuaciones matriciales (18–19).** Lite `solveMatrixEquation(a,b,xOnLeft)` usa `B·A⁻¹` cuando `X` está a la izquierda y `A⁻¹·B` cuando está a la derecha; es estrictamente numérico. Plus expone `/matrix/solve-equation` con `x_side="left"` (`X·A=B`) o `x_side="right"` (`A·X=B`), también estrictamente numérico. 18=`[[-1,2],[-2,3]]`; 19=`[[-3,-4],[4,5]]`. No se usa un oráculo paralelo para el orden del producto.
- **Errores 12–13.** Ambas matrices son singulares; el contrato es un error claro de matriz no invertible (`SINGULAR_MATRIX`/`DOMAIN_ERROR` según motor), sin devolver una inversa ficticia.
- **UI bilateral.** Lite `MatrixMode` expone adjunta, cofactores y ecuación matricial con el selector de lado (`xOnLeft`); Plus `MatrixMode` expone adjunta, cofactores y `x_side`. La capacidad ya no se documenta como gap de UI. `frontend/src/types/api.ts` de Plus solo actualiza el union manual de `OperationType`; el contrato HTTP generado no se regeneró ni cambió.
- **Traducciones de harness.** Lite convierte `\frac{a}{b}` → `a/b` para la grilla ASCII. Plus convierte `\cos\theta` → `cos(theta)` y `a^{2}` → `a^2`; el API no consume LaTeX crudo. Las filas simbólicas se aceptan por equivalencia algebraica exacta; 08/10/11 se contrastaron contra matrices SymPy explícitas. Las ecuaciones usan el contrato `x_side`/`xOnLeft` del producto.
- **Evidencia bilateral.** Lite `tests/matricesMvC01to19.audit.test.ts` 24/24 y `tests/matrixModeParity.test.ts` 2/2; Plus `tests/test_matrices_mv_c01_l19.py` 25/25 PASSED y `src/__tests__/MatrixMode.test.tsx` 7/7. Ambos anclan la fila congelada de `legacy_sources/matriz_matrices_vectores.md.gz` y el JSONL derivado (153 filas).
- **Gate de seguridad (independiente).** El push técnico disparó `39732103637`; `security/backend-security` y `mutation/plus-backend-mutmut` pasaron, pero `mutation/plus-frontend-stryker` agotó el timeout duro de 35 min y el run terminó `cancelled` sin informe. No se usó como evidencia de MV-C y no se relanzó el mismo input. **SECURITY-S25** sigue como blocker independiente; la certificación global permanece `OPEN`.

## 2026-10-23 UTC — EDCX A1+A2 (r254): Lite NO_EJECUTADO

- **Alcance real del motor Lite.** `src/engine/stepEngine/ode.ts` resuelve `y'=f(x)`
  (RHS sin `y`) y EDO lineales de 2.º orden con coeficientes constantes. No cubre
  separables, lineales de primer orden con factor integrante, Bernoulli, Riccati,
  Clairaut/Lagrange, Wronskianos ni condiciones iniciales múltiples.
- **A1 (53 filas) y A2 (50 filas): 0 ejecutadas en Lite.** No se declara PASS ni
  FAIL: el bloque queda `NO_EJECUTADO` hasta ampliar el motor. La certificación
  r254 es **Plus-scoped** (76 PASS / 27 BLOCKED); el detalle de límites y la
  evidencia CI viven en el repo Plus (`MANUAL_CAPABILITY_GAPS.md`, r254).
- **Paridad.** No se acredita paridad Lite/Plus en EDCX con evidencia no ejecutada;
  la fila de inventario EDCX queda `PARCIAL` y la certificación global `OPEN`.

