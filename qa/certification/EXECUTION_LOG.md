## 2026-11-27 UTC — TR324: cuatro reparaciones Plus verificadas y cinco correcciones Lite publicadas

Plus SHA `630f1e4bfe9d985a6c35822fd3231d490bc9c138`: [TR324 46039903624](https://github.com/c2melendez/precision-lab-plus/actions/runs/46039903624), job 140644681473/artifact 15218543886: 733 PASS/1 XFAIL/1 warning; JSON/JUnit descargados y SHA256 JUnit validado 0a0b1e35f1ffe56d41dc050bc33dded2ffadf5cdd4ba811202e0fcb5ba4a6a21; 324 IDs, nueve fuentes iguales al artefacto previo y Lite. Transiciones exactas IT-I-04/05/06 e IT-HI-09 REVIEW_SKIPPED→REVIEW_TEST_OK; 167 REVIEW_TEST_OK, 70 REVIEW_CONTEXT_ONLY, 86 sin mapeo, 1 REVIEW_SKIPPED (EV-D-01). certification_pass_count=0. Acumulativo 46039903541/jobs 140644681798 y 140644681418: backend 3628 PASS/1 SKIP/11 XFAIL/1 warning, frontend 1055 PASS/28 TODO. H1d 46039903513/job 140644680537: 38 PASS; sintaxis nativa 46039903577/job 140644681442: 26+52 PASS. CI estándar 46039903575 backend en curso, frontend SUCCESS al observar. Seguridad 46039903658 backend-security SUCCESS, frontend omitido, mutación job 140644949790 en progreso. S25 BLOCKED, no duplicar.

Lite artefacto anterior 15172893111, SHA 63e0abf7: 135 REVIEW_TEST_OK incluye IT-I-05/06/11 con it.fails (fallo esperado) y IT-HI-05/06 que solo verificaban UNSUPPORTED_OPERATION. Se comparó JUnit y test fuente exacto: esos 5 IDs no acreditan resultado matemático; 130 observaciones OK restantes según conteo conservador, no nuevos PASS completos; preservar los 135 históricos sin reetiquetar el artefacto. El generador no distingue it.fails de test exitoso en JUnit. Registrar deuda de mapeo/clasificación: revisar contratos de pruebas y declarar explícitamente capability negativa; no inferir resultado matemático desde estado verde.

Lite reparación publicada `1660f2026bd60a2fe03746cfbca3c6f3b84cdf89`: se agregaron cinco primitivas reales acotadas al argumento recíproco exacto y variable elegida: IT-I-05 x*acos(1/x)-ln(|x|+sqrt(x²-1)); IT-I-06 x*asin(1/x)+ln(|x|+sqrt(x²-1)); IT-I-11 atan(sqrt(x²-1)) para |x|>1; IT-HI-05 x*ln((1+sqrt(1-x²))/x)+asin(x) para 0<x<=1; IT-HI-06 |x|*ln((1+sqrt(1+x²))/|x|)+ln(|x|+sqrt(1+x²)) para x≠0. 28 puntos comprobados por Node independiente de Algebrite (diferencia central h=1e-6, máximo error 7.32e-10), no ejecución del producto local: npm no recupera paquete, git/DNS no disponible. Pruebas permanentes reemplazan it.fails y UNSUPPORTED por comprobación de derivada numérica del resultado Algebrite, ambas ramas reales, variable y; 11 instancias adicionales (cinco variable y, dos impropias, cuatro controles de intervalo). Se protege FTC frente a intervalos no reales; asech en 0 y arcsch a través de 0 se evalúan mediante límites finitos, sin valor principal. Conserva fuentes, tolerancias y otras rutas; no afirmar ramas complejas, UI, ni equivalencia de todos los canales. Cinco archivos técnicos modificados; no cambios de producción.

[TR324 Lite 46042450137](https://github.com/c2melendez/precision-lab-lite/actions/runs/46042450137) job 140653316067, acumulativo 46042450257, H1d 46042450293, CI 46042450256, UI científica 46042450311 en curso al observar; runner 46042450298/job 140653316920 SUCCESS solo huella acumulativa 3089883892172f71432996626061febe517066b86298ef3bbbcbc1e6fa257871. No duplicar. Próximo paso: revisar logs/artefactos de Lite SHA 1660f20, verificar 5 IDs reales y guards/CI, corregir fallos; revisar CI Plus todavía activo, luego abordar brechas de mapeo/canales por familias (70 Lite, 86 Plus sin mapeo; source anchors y pruebas negativas de capability). S25, SG28/DIST, EV-D-01 BLOCKED; global OPEN.

## 2026-11-27 UTC — TR324: verificación IT-HI-04/06 y reparación de cuatro primitivas Plus

Evidencia revisada Plus SHA `edbd2f18e71a7a3d69a2e02acca36b83afa556c8`: [TR324 45945338885](https://github.com/c2melendez/precision-lab-plus/actions/runs/45945338885), job 140328630039/artifact 15173773505, JSON/JUnit descargados; SHA256 JUnit 034c13f2790a1923e1b36f3a552214c75c96131d0a1ff389de5a99874bcc294c, 324 IDs únicos, nueve fuentes idénticas al artefacto anterior, 714 PASS/9 XFAIL/1 warning. Exactamente IT-HI-04 e IT-HI-06 cambian REVIEW_SKIPPED→REVIEW_TEST_OK. Total 163 REVIEW_TEST_OK, 70 REVIEW_CONTEXT_ONLY, 86 REVIEW_NO_MAPPED_TEST, 5 REVIEW_SKIPPED (EV-D-01, IT-I-04/05/06, IT-HI-09); certification_pass_count=0. Pruebas de literal/HTTP, variable, límites y discrepancia fuente ejecutadas. Acumulativo 45945338973/jobs 140328630702 y 140328630473: backend 3609 PASS, 1 SKIP, 19 XFAIL; frontend 1055 PASS, 28 TODO. H1d 45945338878/job 140328629979: 38 PASS; sintaxis nativa 45945338977/job 140328630432: 26+52 PASS; CI 45945338887 SUCCESS. Lite conserva evidencia de SHA 63e0abf7; no ejecutar de nuevo. Seguridad 45945338882: backend-security SUCCESS, frontend omitido, mutación job 140328800156 terminó por shutdown de runner a 10:43:33Z, sin resultado final; run anterior 45923556047 cancelado. S25 BLOCKED, no relanzar manualmente.

Reparación Plus publicada `630f1e4bfe9d985a6c35822fd3231d490bc9c138`: IT-I-04 arccot principal (0,pi) conforme a EV-I-07 y test Lite, x*(pi/2-atan(x))+log(1+x²)/2; referencia definida del integrando acot exacto usa misma convención; no cambiar parser general. IT-I-05 x*acos(1/x)-acosh(abs(x)), IT-I-06 x*asin(1/x)+acosh(abs(x)), ambos para |x|>=1 con derivada en |x|>1; IT-HI-09 log(abs((1+x)/(1-x)))/2 en los tres intervalos separados por ±1, conserva polos. SymPy 1.14 local: diferenciación por ramas, 29 comprobaciones independientes de diferencias centrales con h=1e-6 (error máximo 2.64e-10); AST no evaluado de racional confirmado localmente. Se quitan 4 XFAIL estrictos y se añaden 11 instancias permanentes: HTTP variable y, endpoints, singularidades y definida arccot cruzando 0. Sin reducir tolerancias. No se pudo ejecutar servicio completo local (DNS GitHub), ni recuperar contenido binario comprimido directamente por conector; se conservan fixtures y tests existentes que anclan filas, más evidencia Lite/EV-I-07. No se afirma ingreso literal nuevo, ramas complejas, definida general o UI. Solo dos archivos técnicos modificados.

[TR324 Plus 46039903624](https://github.com/c2melendez/precision-lab-plus/actions/runs/46039903624) job 140644681473 en progreso, acumulativo 46039903541, H1d 46039903513, CI 46039903575, syntax 46039903577 y security 46039903658 en progreso al observar. Runner 46039903542 job 140644681307 SUCCESS solo huella acumulativa 591b6a56c4380baddfad0a3df8419a5e8bb1f18fb703414a9e0327b5bdb517df. No duplicar corridas. Global OPEN. Próximo: revisar artefacto por ID y gates SHA 630f1e4; corregir si falla; después discrepancias de soporte Lite IT-I-05/06/11 e IT-HI-05/06, y mapeo por canal (incluye 86 IDs sin mapeo Plus, 70 Lite); conservar EV-D-01, S25 y SG28/DIST BLOCKED. No modificar producción.

## 2026-11-27 UTC — TR324: evidencia diferencial y reparación IT-HI-04/06 Plus

Corridas posteriores a corrección del disparador revisadas: Lite SHA `63e0abf73fd83c7edeec210dc76d94863193ce8e`, [TR324 45942624538](https://github.com/c2melendez/precision-lab-lite/actions/runs/45942624538), job 140320115612/artifact 15172893111: 135 REVIEW_TEST_OK, 119 REVIEW_CONTEXT_ONLY, 70 sin mapeo; ningún cambio de estado por ID respecto del artefacto anterior. Acumulativo 45942624470/job 140320115435: 3070 tests PASS, 13 XFAIL, 34 TODO, typecheck/build ejecutados; H1d 45942624490/job 140320115739: 22 PASS.

Plus SHA `5acc018da87cfbcd7299152c1593b0b09cd3ed1e`, [TR324 45942633766](https://github.com/c2melendez/precision-lab-plus/actions/runs/45942633766), job 140320145171/artifact 15173685360: 703 PASS, 13 XFAIL, 1 warning; 161 REVIEW_TEST_OK, 70 REVIEW_CONTEXT_ONLY, 86 sin mapeo, 7 REVIEW_SKIPPED. Se descargaron y comprobaron ZIP/JSON/JUnit de ambos productos (324 IDs únicos, hashes JUnit y fuentes iguales al corte anterior). Transición REVIEW_SKIPPED→REVIEW_TEST_OK exactamente en IT-D-08/10/14 e IT-H-04/08/13. No equivale a PASS completo. Acumulativo Plus 45942633674/jobs 140320143679 y 140320144244: backend 3598 PASS, 1 SKIP, 23 XFAIL; frontend 1055 PASS, 28 TODO, typecheck/build ejecutados. H1d 45942633921/job 140320143986: 38 PASS. CI estándar SUCCESS bilateral en esos SHA. No duplicar estas corridas.

Reparación publicada Plus `edbd2f18e71a7a3d69a2e02acca36b83afa556c8`: primitivas reales exactas de IT-HI-04 (x acoth(x)+log(x²-1)/2, |x|>1) y IT-HI-06 (x acsch(x)+asinh(abs(x)), x≠0). Se conserva la fuente original; para x<0, la derivada de su fórmula x acsch(x)+asinh(x) excede al integrando en 2/sqrt(1+x²). Verificación local aislada SymPy 1.14.0: derivadas simbólicas en ambas ramas, 22 puntos por diferencias centrales con h=1e-6 (máx. error IT-HI-04 7.54e-8, IT-HI-06 1.67e-9), límites laterales log(2) y 0 respectivamente; identidad de discrepancia comprobada. Normalizador acotado de dos integrandos LaTeX (2 positivos y 4 negativos de regex local), preserva validación estructural y pipeline seguro. Se quitaron XFAIL de estos dos IDs únicamente y se agregaron 7 instancias de pruebas permanentes (HTTP literal del integrando/alias y variable, discrepancia fuente, límites laterales). No se probó localmente el servicio completo: git ls-remote falla por DNS; la verificación real de parser/HTTP y producto corresponde al CI. Sin cambios a fuentes congeladas, Lite, producción ni umbrales. No extender el resultado a ramas complejas, integral impropia general, UI ni literal de integral completa.

[TR324 Plus 45945338885](https://github.com/c2melendez/precision-lab-plus/actions/runs/45945338885) job 140328630039 iniciado por push, acumulativo 45945338973, H1d 45945338878, CI 45945338887, native syntax 45945338977 y security 45945338882 en curso al observar; runner 45945338886 SUCCESS de planificación. Seguridad previa 45923556047 en curso al observar; no declarar PASS S25 ni despachar manualmente. Global OPEN. Siguiente acción: revisar logs/artefactos del nuevo SHA (especialmente las dos filas y pruebas de parser, HTTP y límites); corregir si falla; después IT-HI-09, IT-I-04/05/06, mapeo faltante y canales pendientes según contrato. EV-D-01, S25, SG28/DIST BLOCKED.

## 2026-11-27 UTC — corrección bilateral del disparador TR324 v2

Se agregaron únicamente filtros push de insumos relevantes a .github/workflows/certification-tr324-v2.yml: fuentes congeladas (.gz y MANIFEST), fixture MV153 requerido por guard, motor/parser, suites/helpers y dependencias/configuración correspondientes. Se comprobó sintaxis YAML de filtros y ejemplos positivos/negativos localmente; diffs remotos solo contienen 12 líneas añadidas Lite y 7 Plus. Sin modificar motores, oráculos, thresholds ni producción. Los commits documentales se mantienen fuera de los filtros de TR324.

Lite técnico `63e0abf73fd83c7edeec210dc76d94863193ce8e`: [TR324 45942624538](https://github.com/c2melendez/precision-lab-lite/actions/runs/45942624538), acumulativo 45942624470, H1d 45942624490, CI 45942624483 en progreso al observar; runner 45942624542 SUCCESS solo huella, no despacho. Plus técnico `5acc018da87cfbcd7299152c1593b0b09cd3ed1e`: [TR324 45942633766](https://github.com/c2melendez/precision-lab-plus/actions/runs/45942633766), acumulativo 45942633674, H1d 45942633921, CI 45942633776 en progreso; runner 45942633687 SUCCESS solo huella. Seguridad Plus 45923556047 sigue en progreso (SHA previo); no reiniciar ni atribuir PASS S25.

Decisión WAIT/RECONCILE, preservar baseline previamente revisado hasta recuperar logs/artefactos de la nueva ejecución. Próximo paso: revisar los cuatro gates acumulativo/H1d y los dos TR324 por SHA, comparar JSON/JUnit por ID (especialmente seis reparaciones Plus), no duplicar. Después reparar IT-HI-06/04 Plus y preservar fuente congelada, dominio, ramas complejas y canales literal/UI. Sin nuevos PASS completos; global OPEN; S25, SG28/DIST y EV-D-01 BLOCKED.

## 2026-11-27 UTC — reconciliación bilateral v2 (sin nuevos PASS completos)

Lite HEAD técnico `aa89238d114f42f12b648ca420c8c29f253cf5c6`: [TR324 45920446553](https://github.com/c2melendez/precision-lab-lite/actions/runs/45920446553), job 140249641103/artifact 15164392007, 324 IDs únicos: 135 REVIEW_TEST_OK, 119 REVIEW_CONTEXT_ONLY, 70 REVIEW_NO_MAPPED_TEST. [MV153 45920446530](https://github.com/c2melendez/precision-lab-lite/actions/runs/45920446530), job 140249641318/artifact 15164457066: 127 REVIEW_TEST_OK, 26 sin mapeo. [Acumulativo 45920446566](https://github.com/c2melendez/precision-lab-lite/actions/runs/45920446566), job 140249641059: 3070 PASS de tests, 13 XFAIL, 34 TODO; typecheck/build ejecutados. H1d 45920446591: 22 PASS.

Plus HEAD técnico `1342b0f0d28cb77080933fa959735c19ac7ed421`: [acumulativo 45923550286](https://github.com/c2melendez/precision-lab-plus/actions/runs/45923550286), jobs 140259598731/140259598578: backend 3598 PASS, 1 SKIP, 23 XFAIL; frontend 1055 PASS, 28 TODO. H1d 45923550310: 38 PASS. Las seis reparaciones reales IT-D-08/10/14 e IT-H-04/08/13 tienen pruebas ejecutadas; no certifican ramas complejas/UI. [TR324 45920455889](https://github.com/c2melendez/precision-lab-plus/actions/runs/45920455889), SHA f78fc86d3c9baa4c736ed3db0e6eb6d31be2e3c7, job 140249671215/artifact 15163938695: 155 REVIEW_TEST_OK, 70 REVIEW_CONTEXT_ONLY, 13 REVIEW_SKIPPED, 86 sin mapeo; anterior a la reparación. MV153 45920455897, job 140249671098/artifact 15163588175: 148 REVIEW_TEST_OK, 5 sin mapeo. Los cuatro ZIP se descargaron: JSON/JUnit coinciden por SHA256, IDs únicos y nueve fuentes registradas; no asignan PASS de certificación. S25 Plus run 45923556047 en curso; no duplicar ni cerrar. SG28/DIST y EV-D-01 permanecen BLOCKED.

Siguiente acción única TR324-V2-REFRESH-REPAIR: los filtros push de certification-tr324-v2.yml solo incluyen batch_v2.py, su test y el YAML: omiten cambios del motor que alteran observaciones. Corregir ese alcance de manera bilateral, sin tocar producción; verificar TR324 Plus actualizado. IT-HI-06 Plus sigue XFAIL en servicio y HTTP; la fuente congelada x acsch(x)+asinh(x) solo deriva correctamente para x>0 bajo rama real. Se comprobó localmente por diferenciación simbólica en ambas ramas y diferencias centrales (8 puntos, error máximo 2.17e-10 con h=1e-6) la candidata x acsch(x)+asinh(abs(x)); falta integrar y ejecutar en producto, revisar contrato de dominio y complejos, sin alterar la fuente. IT-HI-04 también sigue XFAIL en Plus. No se modificó motor ni se lanzó CI en este checkpoint. Global OPEN.

## 2026-11-26 — recuperación del módulo de cálculo Lite

El HEAD previo contenía `src/engine/stepEngine/calculus.ts` truncado a 141 bytes; [acumulativo 45743828212](https://github.com/c2melendez/precision-lab-lite/actions/runs/45743828212), job 139654976344 falló en typecheck por cuatro exportaciones ausentes y omitió las pruebas. SHA técnico `333098d03dbc740fdd5015f2e30705deb7d2413c` restaura íntegramente el archivo de `58e369e5ec84c571bf540af591df90770819e5fe`; verificado blob local/remoto `24189bfad1b1ed7df3ba2348ab45240c7495f546` (41674 caracteres). Typecheck local PASS; tres suites locales 55 PASS, 4 FAIL en `trigonometryItHiDomain.audit.test.ts`: helper `itHiDomainGuards.ts` aún no está conectado. La guarda propuesta también rechaza extremos integrables de atanh y arcoth; resolver el contrato de integrales impropias y conectar solo con oráculo matemático correcto. [Acumulativo 45746796485](https://github.com/c2melendez/precision-lab-lite/actions/runs/45746796485) en curso; no declarar CI PASS. No se abordaron 80 IDs ni se cerraron matrices; S25, SG28/DIST y EV-D-01 permanecen BLOCKED. Próximo paso: revisar CI, corregir los cuatro fallos de dominio y cubrir extremos integrables sin alterar el soporte complejo.

## 2026-11-26 — IT-HI-01/10: alcance complejo requiere revisión

La corrección Lite `8b130c1ed3abc2935dbf4d910649c006b0d1c445` reescribe en `derivative()` la forma de la primitiva antes de derivarla. La ausencia de dirac en esa salida no demuestra que la primitiva efectivamente devuelta con `sgn(x)` y `abs(x)` conserve la rama analítica compleja; esas operaciones no son holomorfas en general. Exploración local: Algebrite evalúa `float(sgn(1+i))` como aproximadamente `0.697647-1.230158i`; se requiere un oráculo complejo independiente aplicado a la primitiva real devuelta, mediante diferencias finitas en varias direcciones. La afirmación previa de analiticidad compleja debe leerse como limitada al resultado del adaptador de derivación, no como validación de la primitiva. IT-HI-01/10 permanecen REVIEW para ramas complejas; no se modifica la evidencia de estabilidad real ni se declara cierre. Siguiente: diseñar una representación o tratamiento que preserve explícitamente rama compleja y estabilidad real, validarla por derivadas numéricas complejas y pruebas de regresión. S25, SG28/DIST y EV-D-01 siguen BLOCKED.

## 2026-11-26 — TR324 IT-HI-01/10 analiticidad compleja y estabilidad en Lite

SHA técnico Lite `8b130c1ed3abc2935dbf4d910649c006b0d1c445`: normaliza las formas estabilizadas `sgn(x)*log(|x|+sqrt(x^2+1))` a `log(x+sqrt(x^2+1))` dentro de `expandInverseHyperbolicForDerivative` antes de la diferenciación simbólica en Algebrite. Elimina distribuciones espurias `dirac(1+i)` en derivadas complejas y preserva la estabilidad numérica real en `±1e6` y `±1e8` para antiderivadas e integrales definidas. Pruebas focales: 39 PASS, 0 XFAIL (`trigonometryItHiComplexBranch.audit.test.ts` y `trigonometryItHIBatch.audit.test.ts`). [Acumulativo 45737280683](https://github.com/c2melendez/precision-lab-lite/actions/runs/45737280683) job 139633455505 completó SUCCESS: 532 archivos de prueba passed, 3056 PASS, 13 XFAIL, 34 TODO (reducción de 2 XFAIL por la habilitación en PASS de las ramas complejas). CI 45737280803, Certification Runner 45737280689 y H1d 45737280830 todos SUCCESS. Dos IDs abordados (IT-HI-01 e IT-HI-10) con PASS_SCOPED; no son 80 IDs ni cierre de matriz; faltan canales completos de UI, parsing literal de matriz y paridad bilateral. S25, SG28/DIST y EV-D-01 permanecen BLOCKED; certificación global OPEN. Siguiente: paridad y verificación bilateral en Plus o avanzar en los siguientes casos de la matriz TR324 (IT-HI-02/03/05/06).

## 2026-11-25 — regresión compleja IT-HI-01/10

SHA técnico Lite `183ecd91c32c1100965ed3c0de81e7608522a223` modifica primitivas asinh con sgn/abs para estabilidad real. En exploración local, derivar ambas primitivas y sustituir x=1+i produce términos `dirac(1+i)`: la compatibilidad de rama compleja no está preservada/acreditada; clasificación FAIL de regresión, no cierre. SHA `7da131f302f2246aa5c072da7122e656965665e3` añade dos pruebas XFAIL estrictas, una por función, para impedir su contabilización como PASS. Dos suites focales 37 PASS y 2 XFAIL; [acumulativo 45733164085](https://github.com/c2melendez/precision-lab-lite/actions/runs/45733164085) en curso. IT-HI-01/10 son dos IDs investigados, no 80; falta corregir sin perder estabilidad real ni ramas complejas, y comprobar dominios/canales. S25, SG28/DIST y EV-D-01 permanecen BLOCKED.

## 2026-11-25 — TR324 IT-HI-04 canal literal

Lite `1541136f276e854cab2cc57a12b1a07ba1a446c2`: [acumulativo 45717635630](https://github.com/c2melendez/precision-lab-lite/actions/runs/45717635630) SUCCESS, job 139567686333 log revisado: 3044 PASS, 15 XFAIL, 34 TODO; ejecutada suite IT-HI.

Lite técnico `f7f31512e1dfb7742027aad3596c77724cb1de91`: corrige parser de arcoth con argumento sin paréntesis y envolturas adicionales del operando de integral. Antes, el texto de la matriz producía acoth*x y UNSUPPORTED_OPERATION; ahora prueba extrae la expresión integral de la fuente y verifica por diferencias finitas en ambas ramas reales. Tres suites focales 39 PASS, 2 XFAIL; typecheck PASS. [Acumulativo 45726266843](https://github.com/c2melendez/precision-lab-lite/actions/runs/45726266843) en cola. Un ID abordado, no 80; condición de dominio anotada en la matriz no se interpreta como parte de la entrada, faltan extremos, ramas complejas, UI y paridad. Siguiente: revisar CI del SHA técnico y avanzar IT-HI-01/10. S25, SG28/DIST y EV-D-01 permanecen BLOCKED.

## 2026-11-25 — TR324 IT-HI-04 primitiva Lite

Lite SHA técnico `1541136f276e854cab2cc57a12b1a07ba1a446c2`: primitiva para arcoth en la forma normalizada atanh(1/x), antes no admitida. Pruebas focales: 54 PASS, 2 XFAIL existentes; oráculo numérico y derivada en ramas reales |x|>1 con variables x/y, y parser del operador. Typecheck PASS. [Acumulativo 45717635630](https://github.com/c2melendez/precision-lab-lite/actions/runs/45717635630) en cola; no declarar PASS de CI. Un ID de matriz abordado, no 54 IDs ni lote de 80. Faltan ejecución literal completa de integral, extremos, ramas complejas, paridad y UI; no se cierra el caso. Siguiente: revisar CI, completar pruebas de dominio y paridad, y estabilidad IT-HI-01/10. S25, SG28/DIST y EV-D-01 permanecen BLOCKED; global OPEN.

## 2026-11-25 — CI Plus: integrales impropias

SHA técnico Plus `c3f0f528e6e8a58ab729d67474ab52003fec5bc4`: [acumulativo 45699808846](https://github.com/c2melendez/precision-lab-plus/actions/runs/45699808846), backend job 139506627225 SUCCESS, log revisado: 3578 PASS, 1 SKIP, 35 XFAIL, 1 advertencia; se ejecutaron seis pruebas HTTP `test_improper_integral_domains.py`. Frontend job 139506626602 SUCCESS. Se cubren cuatro polos interiores divergentes y dos controles convergentes, incluida una singularidad integrable; no se acredita convergencia general ni 80 IDs nuevos. Siguiente: estabilidad IT-HI-01/10 preservando ramas complejas, y ampliar evidencia por caso sin duplicar gates. S25, SG28/DIST y EV-D-01 siguen BLOCKED; global OPEN.

## 2026-11-25 — CI Plus verificado para formas equivalentes

Plus SHA técnico `ea4222d7d803dc3088131f4211b84c771b95c366`: [acumulativo 45680944720](https://github.com/c2melendez/precision-lab-plus/actions/runs/45680944720), backend job 139440992937 SUCCESS con logs revisados: 3572 PASS, 1 SKIP, 35 XFAIL, 1 advertencia; 12 pruebas HTTP `test_reciprocal_square_equivalence.py` ejecutadas. Frontend job 139440993402 SUCCESS. Cubre cuatro representaciones de 1/x², extremos invertidos y un intervalo seguro; no certifica convergencia general. Lite: [acumulativo 45661127323](https://github.com/c2melendez/precision-lab-lite/actions/runs/45661127323), SHA `58e369e5ec84c571bf540af591df90770819e5fe`, evidencia anteriormente revisada. No son 80 IDs nuevos ni cierre de matriz. Siguiente: IT-HI-01/10, paridad de ramas complejas y evidencia por caso; conservar S25, SG28/DIST y EV-D-01 BLOCKED.

## 2026-11-25 — paridad de formas equivalentes de 1/x²

Plus SHA técnico `ea4222d7d803dc3088131f4211b84c771b95c366`: pruebas HTTP para `(1/x)^2`, `x^(-2)`, `1/(x*x)` y `1/(x)^2` sobre [-1,1], [1,-1] y [1,2]. Resultado local 12 PASS, una advertencia de dependencia; [acumulativo 45680944720](https://github.com/c2melendez/precision-lab-plus/actions/runs/45680944720) en curso. Lite ya cubre estas formas en `58e369e5ec84c571bf540af591df90770819e5fe`, [CI 45661127323](https://github.com/c2melendez/precision-lab-lite/actions/runs/45661127323) verificado. No se asignaron IDs de matriz nuevos ni se verifica convergencia general. Siguiente: revisar CI Plus sin duplicarlo y continuar IT-HI-01/10 y cobertura por caso. S25, SG28/DIST y EV-D-01 permanecen bloqueados.

## 2026-11-25 — CI verificado para formas equivalentes

Lite SHA técnico `58e369e5ec84c571bf540af591df90770819e5fe`: [acumulativo 45661127323](https://github.com/c2melendez/precision-lab-lite/actions/runs/45661127323), job 139370918071 SUCCESS; log revisado, 3042 PASS, 15 XFAIL, 34 TODO; ejecutó las 8 pruebas definiteIntegralEquivalentPoles. CI, H1d, Scientific UI y Certification Runner reportaron SUCCESS para el mismo SHA. Alcance: cuatro representaciones de 1/x², cruces de cero y controles finitos; no demuestra convergencia general. No son 80 IDs nuevos ni cierre de matriz. Siguiente: abordar IT-HI-01/10 preservando ramas complejas y ampliar evidencia por caso sin duplicar gates. S25, SG28/DIST y EV-D-01 permanecen BLOCKED; certificación global OPEN.

## 2026-11-25 — polos en formas equivalentes de 1/x²

Lite SHA técnico `58e369e5ec84c571bf540af591df90770819e5fe`: al cruzar cero, `(1/x)^2`, `x^(-2)`, `1/(x*x)` y `1/(x)^2` devolvían -2 en [-1,1]; ahora se rechazan con DOMAIN_ERROR, con controles finitos y límites invertidos. Cuatro suites focales 34 PASS (ocho pruebas nuevas); typecheck PASS. [Acumulativo 45661127323](https://github.com/c2melendez/precision-lab-lite/actions/runs/45661127323) y gates asociados en cola; no declarar CI PASS. Estas formas son casos de regresión, no 80 IDs nuevos; no demuestra ausencia de singularidades generales ni cierra matriz. Sigue pendiente estabilidad IT-HI-01/10 preservando ramas, paridad y bloqueos S25, SG28/DIST y EV-D-01. Siguiente: revisar gates por SHA, reconciliar índices y continuar lote sin duplicar.

## 2026-11-25 — paridad parcial para polos de potencias recíprocas

Lite `b16665e621dac4e3e4850d902d997d024e3ade43`: [acumulativo 45629401854](https://github.com/c2melendez/precision-lab-lite/actions/runs/45629401854), job 139258227146 SUCCESS, log revisado: 3034 PASS, 15 XFAIL, 34 TODO, con 9 pruebas de `definiteIntegralInversePower` ejecutadas.

Plus `5897cdc4e341d98aa410029187d760b731461c6c`: 6 pruebas HTTP adicionales para 1/x² y 1/x³, cruces, límites invertidos y controles finitos; suite local 14 PASS, 1 advertencia de dependencia. [Acumulativo 45639907561](https://github.com/c2melendez/precision-lab-plus/actions/runs/45639907561) en curso; no declarar CI PASS hasta revisar logs. [Seguridad 45582006420](https://github.com/c2melendez/precision-lab-plus/actions/runs/45582006420) terminó CANCELLED; no acredita seguridad ni cierre S25. No se asignaron nuevos IDs de matriz; no son 80 casos nuevos ni cierre global. Las guardas no demuestran convergencia general. Siguiente: revisar CI Plus y reconciliar índices; continuar IT-HI-01/10, cobertura de singularidades y paridad. S25, SG28/DIST y EV-D-01 permanecen bloqueados.

## 2026-11-25 — polos de potencias recíprocas y CI previo

Lite `7cd7e31a8340413536e042864cb4ab18cfb475a4`: [acumulativo 45618692308](https://github.com/c2melendez/precision-lab-lite/actions/runs/45618692308), job 139220751446 SUCCESS; log ejecutado: 3025 PASS, 15 XFAIL, 34 TODO, incluidas las cinco pruebas definiteIntegralNonfinite. No acredita cierre global.

Lite `b16665e621dac4e3e4850d902d997d024e3ade43` rechaza integrales de formas reconocidas 1/x^n con n entero positivo si el intervalo contiene cero, en lugar de devolver valores finitos falsos; pruebas locales 26 PASS (9 nuevas y 17 regresiones), typecheck PASS. [Acumulativo 45629401854](https://github.com/c2melendez/precision-lab-lite/actions/runs/45629401854) y demás gates en cola. Estas pruebas no son 26 casos de matriz ni un lote nuevo de 80. La guarda no detecta toda singularidad, formas equivalentes, ni demuestra convergencia general. Quedan pendientes IT-HI-01/10, paridad Plus, interfaz, y bloqueos S25, SG28/DIST y EV-D-01. Siguiente: revisar CI del SHA técnico, reconciliar índices y continuar detección de polos/paridad sin duplicar corridas.

## 2026-11-25 — Lite: rechazo de resultados no finitos (CI pendiente)

SHA técnico `7cd7e31a8340413536e042864cb4ab18cfb475a4`: `calcDefiniteIntegral` rechaza resultados simbólicos o numéricos no finitos con DOMAIN_ERROR y preserva resultados complejos finitos. Pruebas locales: 17 PASS (5 regresiones nuevas y 12 polos existentes); typecheck PASS. Acumulativo [45618692308](https://github.com/c2melendez/precision-lab-lite/actions/runs/45618692308) y demás gates en cola; no se declara PASS de CI. No son 17 filas de matriz ni 80 casos nuevos.

Limitación reproducida en prueba exploratoria: integral de `1/x^2` en [-1,1] devuelve -2 pese al polo interior; la nueva guarda solo detecta resultados no finitos y no certifica convergencia. Siguiente: revisar CI del SHA técnico y abordar detección general de singularidades, estabilidad IT-HI-01/10 y paridad, sin repetir gates en curso. S25, SG28/DIST y EV-D-01 permanecen bloqueados.

## TR324 Reconciliación de índices bilaterales y CI verificado — 2026-11-25 UTC

Evidencia de CI verificada bilateralmente para los SHAs técnicos vigentes:
- Plus SHA técnico `c2d66e7124ce7f2bbc652009e610293f30044ab4`: acumulativo [45582006410](https://github.com/c2melendez/precision-lab-plus/actions/runs/45582006410) completó SUCCESS. Job backend [139094132064](https://github.com/c2melendez/precision-lab-plus/actions/runs/45582006410/job/139094132064): 3554 passed, 1 skipped, 35 xfailed. Job frontend [139094131945](https://github.com/c2melendez/precision-lab-plus/actions/runs/45582006410/job/139094131945): 150 archivos de test passed, 1055 passed, 28 todo. Reconciliación HTTP de los 80 casos originales: 70 PASSED (parcial) y 10 XFAIL. H1d [45582006239](https://github.com/c2melendez/precision-lab-plus/actions/runs/45582006239) job 139094131149 completó SUCCESS.
- Lite SHA técnico `0000dbfcb0006e26d198f979fd2ee393bba41f1e`: acumulativo [45572462518](https://github.com/c2melendez/precision-lab-lite/actions/runs/45572462518) completó SUCCESS. Job [139062212120](https://github.com/c2melendez/precision-lab-lite/actions/runs/45572462518/job/139062212120): 3020 PASS, 15 XFAIL, 34 TODO con 12 pruebas de polos IT-D ejecutadas. H1d [45572462464](https://github.com/c2melendez/precision-lab-lite/actions/runs/45572462464) job 139062212137 completó SUCCESS. Scientific UI [45572462594](https://github.com/c2melendez/precision-lab-lite/actions/runs/45572462594) job 139062212076 completó SUCCESS.

Índices actualizados: `continuity.json` (revisión 643 en Lite, 639 en Plus), `CURRENT_STATE.md` y `BATCH_80_01.md`. Bloqueos S25, SG28/DIST y EV-D-01 permanecen activos; certificación global OPEN.

Siguiente: extender en Lite las guardas de integral definida para rechazar resultados no finitos (DOMAIN_ERROR) en paridad con Plus, y resolver estabilidad numérica IT-HI-01/10 preservando ramas complejas.


## TR324 IT-D-08/14: respuestas no finitas en Plus — 2026-11-25 UTC

Plus SHA técnico `c2d66e7124ce7f2bbc652009e610293f30044ab4` evita devolver success=true con nan, oo, -oo o zoo para una integral definida; responde DOMAIN_ERROR con mensaje de valor no finito o indeterminado. Pruebas HTTP: cot(x) en intervalos que incluyen 0 y sec(x)^3 cruzando pi/2, normales y reversos; dos intervalos válidos conservan resultados finitos. La integral formal no resuelta csch(x)^2 conserva aviso y representación existente, no se considera PASS de convergencia. Pruebas locales de integral: 17 PASS; derivadas: 10 PASS. [Acumulativo Plus 45582006410](https://github.com/c2melendez/precision-lab-plus/actions/runs/45582006410) en curso. No detecta toda singularidad si el motor reporta un valor finito; no declara cierre ni lote de 80. S25, SG28/DIST y EV-D-01 siguen bloqueados.

Lite [acumulativo 45572462518](https://github.com/c2melendez/precision-lab-lite/actions/runs/45572462518), job 139062212120, SHA `0000dbfcb0006e26d198f979fd2ee393bba41f1e`: 3020 PASS, 15 XFAIL, 34 TODO; 12 pruebas de polos IT-D ejecutadas. Siguiente: revisar CI Plus, probar más formas y singularidades, y abordar estabilidad IT-HI-01/10 sin alterar ramas complejas.

## TR324 IT-D-08/14: polos en integrales definidas — 2026-11-25 UTC

Lite SHA técnico `0000dbfcb0006e26d198f979fd2ee393bba41f1e` rechaza con DOMAIN_ERROR intervalos que incluyen polos de cot(x) o sec(x)^3 en las formas específicas reconocidas. Antes se devolvía un valor para cot en [-1,1] y [0,1] y sec³ en [1,2]. Pruebas focales locales: 18 PASS, incluyendo 12 pruebas de polos, límites invertidos, intervalos seguros y canal literal, más seis regresiones IT-D-08/14. [Acumulativo 45572462518](https://github.com/c2melendez/precision-lab-lite/actions/runs/45572462518) en curso. La guarda no cubre todas las formas equivalentes ni certifica dominios generales; faltan paridad Plus y UI integral. S25, SG28/DIST y EV-D-01 siguen bloqueados.

[Acumulativo previo 45566202691](https://github.com/c2melendez/precision-lab-lite/actions/runs/45566202691), job 139041497275, SHA `a0ee07119bab8562c56dced033241014be6f9bf0`: 3008 PASS, 15 XFAIL y 34 TODO; ejecutó seis pruebas IT-D-08/14 y 26 pruebas del lote IT-D. [45565408211](https://github.com/c2melendez/precision-lab-lite/actions/runs/45565408211), job 139038865470: 3000 PASS, 17 XFAIL y 34 TODO; los dos XFAIL de estabilidad IT-HI-01/10 continúan abiertos. Siguiente: revisar CI 45572462518, ampliar paridad y resolver estabilidad sin alterar ramas.

## TR324 IT-HI-01/10: regresión de estabilidad — 2026-11-25 UTC

Lite SHA técnico `721cad1b3935fc14289c5675cedad26c33eb32b2` amplía `tests/trigonometryItHIBatch.audit.test.ts`: pruebas independientes de primitivas para x=+1e8 pasan; para x=-1e8 ambas devuelven infinito y son XFAIL estricto por cancelación. Prueba focal 26 PASS, 2 XFAIL; no se ha corregido el producto. [Acumulativo 45565408211](https://github.com/c2melendez/precision-lab-lite/actions/runs/45565408211) en curso. IT-HI-01/10 siguen FAIL de estabilidad; falta encontrar representación estable que preserve ramas complejas, y validar literalidad, dominios y paridad. S25, SG28/DIST y EV-D-01 siguen bloqueados.

Lite [acumulativo 45563389626](https://github.com/c2melendez/precision-lab-lite/actions/runs/45563389626), job 139032242023, SHA `a60650d74653530abd362bf6781c0a4b355a5c9c`: 2998 PASS, 15 XFAIL, 34 TODO, incluidas 10 pruebas del canal literal. La cobertura de ese canal no cierra la matriz. Siguiente: revisar CI 45565408211 y corregir estabilidad sin modificar ramas complejas.

## TR324 canal literal de Cálculo — 2026-11-25 UTC

Lite SHA técnico `a60650d74653530abd362bf6781c0a4b355a5c9c`. Diagnóstico reproducible sobre el HEAD previo (`05ff3946`): `\frac{d}{dx}(x^2)` → `2`; `\int x^2\,dx` → `1/12*x^4`; `\int_0^1 x^2\,dx` → rechazo por `defintegral` desconocido; `\lim_{x\to 0}\frac{\sin x}{x}` → rechazo por `limit` desconocido; los resultados definidos arrastraban la elipsis de Algebrite. Causa: el motor recibía el texto parseado de la plantilla completa y no el operando.

Corrección: módulo `src/engine/stepEngine/calculusOperators.ts` (desenvolvimiento estricto de la llamada y guarda de funciones desaplicadas) y cambios en los cuatro puntos de entrada de `calculus.ts` (operando, límites/punto literales, limpieza de elipsis, rechazo fail-closed). Pruebas `tests/calculusLiteralChannel.audit.test.ts` 10/10 y oráculo `tests/support/latexNumeric.ts` (falla cerrado ante LaTeX no modelado).

Evidencia ejecutada en `a60650d7`: acumulativo [45563389626](https://github.com/c2melendez/precision-lab-lite/actions/runs/45563389626) job 139032242023, 525 archivos / 2998 PASS / 15 XFAIL / 34 TODO, `calculusLiteralChannel` ejecutado; H1d [45563389578](https://github.com/c2melendez/precision-lab-lite/actions/runs/45563389578) job 139032241694, 22 PASS; Scientific UI E2E [45563389644](https://github.com/c2melendez/precision-lab-lite/actions/runs/45563389644) job 139032241954, 456 PASS; CI [45563389748](https://github.com/c2melendez/precision-lab-lite/actions/runs/45563389748) job 139032241973; Certification Runner [45563389586](https://github.com/c2melendez/precision-lab-lite/actions/runs/45563389586). Los tres fallos de álgebra observados en la suite local pasan aislados y en CI: flaqueo por carga, no regresión. No se declara cierre de IT-D-08/14, dominios ni paridad. S25, SG28/DIST y EV-D-01 bloqueados.

Siguiente: primitivas IT-D-08 (∫cot) e IT-D-14 (∫sec³) con canal literal y dominio; después paridad.

## TR324 IT-HI-02 y estabilidad IT-HI-01 — 2026-11-25 UTC

Lite SHA técnico `39b1cd185716b4f4e50eda0c99447d25340b3bd5` agrega primitiva específica para acosh (IT-HI-02) usando raíces separadas; pruebas locales IT-HI e IT-D: 44 PASS y 2 XFAIL, incluyendo derivación y diferencias finitas en puntos interiores, x/y. [Acumulativo 45557928390](https://github.com/c2melendez/precision-lab-lite/actions/runs/45557928390) en curso. Falta validación de ramas complejas, extremos y canal literal; no se declara cierre.

Hallazgo independiente: la primitiva previa IT-HI-01, evaluada mediante Algebrite en x=-100000000, devuelve Infinity.0 por cancelación numérica; la misma expresión en x=-100 es finita. No atribuir PASS de estabilidad; corregir y añadir regresión antes del cierre. IT-HI-04/05/06 siguen sin implementar; S25, SG28/DIST y EV-D-01 bloqueados.

[Acumulativo previo 45550227135](https://github.com/c2melendez/precision-lab-lite/actions/runs/45550227135), job 138989382550, SHA `94e8ac22e7608ee79ba6ad0d4bfdc93496b1c320`: 2987 PASS, 15 XFAIL, 34 TODO; 23 pruebas IT-HI ejecutadas. Siguiente: corregir estabilidad IT-HI-01/10, revisar CI nuevo y probar ramas/literalidad bilateral.

## TR324 IT-HI-01/03/10: primitivas Lite — 2026-11-25 UTC

Lite SHA técnico `94e8ac22e7608ee79ba6ad0d4bfdc93496b1c320` incorpora primitivas en formas específicas para IT-HI-01, IT-HI-03 e IT-HI-10 usando logaritmos; el último caso está fuera del lote de 80. La prueba focal comprueba derivada simbólica y diferencias finitas numéricas en puntos interiores, variables x/y: IT-HI e IT-D acumulan 43 PASS y 2 XFAIL; el recuento incluye anclajes y comprobaciones de error, no son 43 casos certificados. IT-HI-02/04/05/06 permanecen sin implementar. [Acumulativo 45550227135](https://github.com/c2melendez/precision-lab-lite/actions/runs/45550227135) en curso. Faltan dominios completos, ramas, entrada literal, interfaz y paridad; S25, SG28/DIST y EV-D-01 siguen bloqueados.

El [acumulativo anterior 45543566207](https://github.com/c2melendez/precision-lab-lite/actions/runs/45543566207), job 138967653535, SHA `17f66fcb7f6f61d58c35e93095de408cf537f80e`, ejecutó 20 pruebas IT-HI; 2984 PASS, 15 XFAIL y 34 TODO globales. Siguiente: revisar CI nuevo y completar ramas, polos y literalidad bilateral.

## TR324 IT-HI-01..10: evitar resultados falsos Lite — 2026-11-25 UTC

Lite SHA técnico `17f66fcb7f6f61d58c35e93095de408cf537f80e`: Algebrite devolvía texto `Unsupported function` como si fuera una primitiva; se convierte en UNSUPPORTED_OPERATION. Auditoría local de 10 IDs IT-HI: 01–06 y 10 son capacidades no implementadas, respuesta de error verificada; 07–09 dan resultado numérico parcial en puntos interiores. Cuatro IDs 01–04 pertenecen al lote 80 y 05–10 son adicionales. Focal IT-HI e IT-D: 40 PASS (incluyen validaciones de error/anclajes, no significan 40 casos certificados), 2 XFAIL IT-D. [Acumulativo 45543566207](https://github.com/c2melendez/precision-lab-lite/actions/runs/45543566207) en curso. Falta CI, capacidades, entrada literal, dominio y UI. S25, SG28/DIST y EV-D-01 siguen bloqueados.

[Acumulativo previo 45537278744](https://github.com/c2melendez/precision-lab-lite/actions/runs/45537278744), job 138946852174, SHA `b94a96b56ec0746fcd8d7b7335ce07359a6ffa19`: 2964 PASS, 15 XFAIL, 34 TODO; prueba IT-I de 24 tests ejecutada. Siguiente: revisar CI nuevo, implementar capacidades hiperbólicas inversas y validar paridad, literalidad y dominios.

## TR324 IT-I-01..11: integrales inversas Lite — 2026-11-25 UTC

Lite SHA técnico `b94a96b56ec0746fcd8d7b7335ce07359a6ffa19`: auditoría de 11 IDs y soporte específico para IT-I-07/08; comparación numérica en cuatro puntos interiores y variables x/y para las dos reglas nuevas. IT-I-05/06 permanecen XFAIL por integral sin resolver; IT-I-11 XFAIL porque la derivada de la primitiva quedó sin resolver, no demuestra por sí solo error del resultado. Pruebas focales IT-I e IT-D: 41 PASS y 5 XFAIL (3 de IT-I y 2 de IT-D); CI acumulativo [45537278744](https://github.com/c2melendez/precision-lab-lite/actions/runs/45537278744) en curso. No se verifica literalidad, dominio completo ni UI; no hay cierre contractual. S25, SG28/DIST y EV-D-01 siguen bloqueados.

[Acumulativo previo 45530232061](https://github.com/c2melendez/precision-lab-lite/actions/runs/45530232061), job 138923412619, SHA `c4bedba0b8ee6bcf73ea37ed552884f2b94cc1a1`: 2943 PASS, 12 XFAIL y 34 TODO; 12 pruebas de polos IT-H ejecutadas. Siguiente: revisar CI 45537278744 y resolver XFAIL, validar literalidad y dominio bilateral.

## TR324 IT-H-06/10: polos en integrales definidas — 2026-11-25 UTC

Lite SHA técnico `c4bedba0b8ee6bcf73ea37ed552884f2b94cc1a1` rechaza con DOMAIN_ERROR las dos formas específicas csch(x)^2 y csch(x)*coth(x) cuando el intervalo incluye cero, evitando un valor finito incorrecto por aplicación del teorema fundamental a través de un polo. Antes de corregir: 2 pruebas fallidas. Después: 32 PASS y 2 XFAIL en pruebas focales IT-H y regresión IT-D; incluye intervalos cruzados, invertidos, extremo cero, intervalos positivos y variables x/y. Typecheck local PASS. [Acumulativo 45530232061](https://github.com/c2melendez/precision-lab-lite/actions/runs/45530232061) en curso; esta guarda cubre solo las formas exactas y no certifica dominios generales ni entrada literal. S25, SG28/DIST y EV-D-01 siguen bloqueados.

[Acumulativo previo 45522841583](https://github.com/c2melendez/precision-lab-lite/actions/runs/45522841583), job 138898750735, SHA `f2caf06a985770703493e9cdb6d07438ac63feb5`: 2931 PASS, 12 XFAIL y 34 TODO; archivo IT-H 39 pruebas ejecutadas. Siguiente: revisar CI del nuevo SHA; ampliar análisis de polos, canal literal y paridad Plus.

## TR324 IT-H: siete primitivas Lite — 2026-11-25 UTC

Lite SHA técnico `f2caf06a985770703493e9cdb6d07438ac63feb5`: agrega primitivas de formas específicas para IT-H-05/06/07/09/10/15/16. Pruebas focales locales IT-H e IT-D: 57 PASS y 4 XFAIL, incluyendo variables x e y; typecheck local PASS. IT-H-04/08 permanecen XFAIL; CI acumulativo [45522841583](https://github.com/c2melendez/precision-lab-lite/actions/runs/45522841583) en curso. La cobertura es interior y acotada: siguen pendientes entrada literal, dominios/polos, UI y paridad; no se declara PASS contractual. S25, SG28/DIST y EV-D-01 permanecen bloqueados.

El acumulativo previo [45515093710](https://github.com/c2melendez/precision-lab-lite/actions/runs/45515093710), job 138872356042, ejecutó el test IT-H de 32 pruebas; 2917 PASS, 19 XFAIL y 34 TODO globales.

Siguiente: revisar CI del SHA técnico; probar dominios y literalidad y resolver IT-H-04/08 y fallos Plus.

## TR324 IT-H-01..16: auditoría Lite — 2026-11-25 UTC

Lite `2a78f07a856a55ead3212fa9612b5b132da659ee` agrega `tests/trigonometryItHBatch.audit.test.ts`: 16 anclajes de ID a matriz y derivación numérica en cuatro puntos interiores; 7 casos con resultado parcial y 9 XFAIL estrictos (04–10, 15–16) por integral sin resolver. Prueba focal local 23 PASS, 9 XFAIL; no valida entradas literales ni dominios completos. Acumulativo [45515093710](https://github.com/c2melendez/precision-lab-lite/actions/runs/45515093710) en espera. No hay cierre contractual ni lote nuevo de 80. Se conservan S25, SG28/DIST y EV-D-01.

Acumulativo anterior Lite [45506641836](https://github.com/c2melendez/precision-lab-lite/actions/runs/45506641836), job 138843445758, SHA `98bd2ee792ddc079012cdf5ba32887d8979c8db9`: pruebas ejecutadas, 2894 PASS, 10 XFAIL y 34 TODO; test IT-D 26 pruebas. No equivale a cierre de la matriz.

Siguiente: revisar CI 45515093710 y resolver primitivas IT-H, dominios y paridad sin duplicar gates.

## TR324 IT-D: oráculo Lite reforzado — 2026-11-24 UTC

Lite técnico `98bd2ee792ddc079012cdf5ba32887d8979c8db9`: se evita que parseFloat acepte un prefijo numérico seguido de términos complejos o simbólicos, conservando decimales truncados de Algebrite. Prueba focal local: 24 PASS y 2 XFAIL, incluidos cuatro controles negativos; typecheck local PASS. CI acumulativo [45506641836](https://github.com/c2melendez/precision-lab-lite/actions/runs/45506641836) en curso; no hay cierre adicional ni corrida nueva de 80 casos. No cambia Plus. IT-D-08/14 siguen XFAIL en Lite; S25, SG28/DIST y EV-D-01 siguen bloqueados.

Siguiente: revisar logs del acumulativo del SHA técnico, resolver integrales y validar canal literal y dominios en ambos productos.

## 2026-11-24 — reconciliación CI TR324

Evidencia por ID añadida a BATCH_80_01.md para 18 filas; ver CURRENT_STATE.md. No se ejecutaron nuevas corridas ni se declararon cierres. Se conservan los bloqueos contractuales.

## TR324 IT-D: cuatro primitivas Lite — 2026-11-24 UTC

Lite SHA `acb736dcf0540c640fb6ffc4cc68c28e5c83865e` añade primitivas para IT-D-05/13/16/18 en formas delimitadas; regresiones locales para variables x e y: 20 PASS, 2 XFAIL en 22 pruebas; typecheck PASS. IT-D-08/14 siguen XFAIL sin resolver. No declara cierre: CI, canales literales y dominios completos pendientes. S25, SG28/DIST, EV-D-01 conservados.

Siguiente: revisar CI del SHA nuevo, cubrir entradas literales y dominio, resolver IT-D-08/14 y ampliar paridad bilateral.

## TR324 IT-D-01..18: primera auditoría Lite — 2026-11-24 UTC

Lite SHA `b965462f568451f65efa3fe42d0a69e467aba268`: doce pruebas locales comparan la derivada de la primitiva con oráculo numérico interior; seis fallos esperados estrictos por integral sin resolver: IT-D-05/08/13/14/16/18. La prueba ancla el ID, no verifica entrada literal ni ramas de la primitiva. CI pendiente. No hay cierre completo; conservar S25, SG28/DIST, EV-D-01.

Siguiente: revisar CI SHA nuevo, corregir las seis capacidades no resueltas en bloque, validar dominios y paridad Plus.

## DV-H-01..12: anclaje de entrada y CI — 2026-11-23 UTC

Lite SHA técnico `7fdadaf9289eb1ccf911884900ad80d79311daaf`: entradas y resultados de las 12 filas anclados a la fuente en `tests/trigonometryDvHBatch.audit.test.ts`, con oráculo numérico en puntos interiores. [Acumulativo 45228151225](https://github.com/c2melendez/precision-lab-lite/actions/runs/45228151225), job 137880145675: pruebas ejecutadas, 2870 PASS, 8 expected fail y 34 TODO. Pendientes: verificar canal literal completo, dominios, extremos, UI y paridad; no declarar cierre. S25, SG28/DIST y EV-D-01 continúan bloqueados.

Siguiente: ampliar el lote de 80 y completar dominios y canales, evitando repetir el acumulativo ya verificado.

## TR324 DV-H-01..12: CI revisado — 2026-11-23 UTC

El acumulativo Lite [45217595942](https://github.com/c2melendez/precision-lab-lite/actions/runs/45217595942), job 137842841206, ejecutó `tests/trigonometryDvHBatch.audit.test.ts` en el SHA técnico `fa355ca500beddda6f81330785428ef1542f2552`: 2870 PASS, 8 expected fail y 34 TODO en el acumulativo. La evidencia cubre resultados numéricos interiores y anclaje de resultado de las doce filas, no comprueba entrada literal, límites, dominios ni UI. Las filas siguen EN_CURSO; no hay cierre completo nuevo. S25, SG28/DIST y EV-D-01 siguen bloqueados.

Siguiente: reforzar anclaje de entradas y dominios DV-H/DV-HI y ampliar el resto de las 80 filas, evitando corridas equivalentes.

## TR324 DV-H-01..12: paridad funcional en curso — 2026-11-23 UTC

Lite commit técnico `fa355ca500beddda6f81330785428ef1542f2552`: 12 pruebas parametrizadas de derivadas hiperbólicas directas, ancladas al resultado de cada fila y comparadas con fórmulas numéricas independientes en puntos interiores; 23 pruebas focales y typecheck locales aprobados. Acumulativo [45217595942](https://github.com/c2melendez/precision-lab-lite/actions/runs/45217595942) en curso. Falta CI, anclaje de entrada por fila, canales de usuario y pruebas de dominios/extremos. Para DV-HI-01..10, acumulativo anterior Lite [45215179382](https://github.com/c2melendez/precision-lab-lite/actions/runs/45215179382), job 137834283625, ejecutó las pruebas y terminó con 2858 aprobadas, 8 expected fail y 34 TODO; no acredita cierre de dominio o UI. Certificación global abierta; S25, SG28/DIST y EV-D-01 siguen bloqueados.

Siguiente: revisar CI del nuevo SHA, reforzar anclaje de entradas y verificar dominios, extremos y estabilidad de DV-H/DV-HI sin duplicar corridas.

## TR324 DV-HI-01..10: implementación en verificación — 2026-11-23 UTC

Lite commit técnico `7cbbed39b3b15608da407e420b4a90442ec0ad29` introduce reescritura de funciones hiperbólicas inversas para derivación y conserva la guarda de derivadas sin resolver. Diez expresiones pasan comprobaciones numéricas en puntos interiores, con fórmulas independientes y tolerancia acorde a la salida decimal de Algebrite; 29 pruebas focales y typecheck locales PASS. El acumulativo [45215179382](https://github.com/c2melendez/precision-lab-lite/actions/runs/45215179382) está en curso. No es cierre: pendientes CI, entradas literales y UI, dominio y extremos, estabilidad numérica y paridad completa. El acumulativo anterior [45212128253](https://github.com/c2melendez/precision-lab-lite/actions/runs/45212128253) es SUCCESS para el SHA de la protección anterior, no demuestra este cambio. Bloqueos S25, SG28/DIST y EV-D-01 conservados.

Siguiente: revisar CI del SHA 7cbbed39; verificar límites, fuera de dominio, estabilidad y canales de DV-HI-01..10; continuar DV-H-01..12 Lite.

## TR324: derivadas hiperbólicas inversas — 2026-11-23 UTC

Lite devolvía derivadas sin resolver como SYMBOLIC para DV-HI-01..10. El commit técnico `649c068f9d4d41f9a8a1bb07b2c7cb484f802a44` rechaza expresamente el resultado no resuelto con UNSUPPORTED_OPERATION; 29 pruebas focales y typecheck locales aprobados. Esto no implementa las derivadas: los 10 casos siguen bloqueados en Lite hasta una solución matemática con dominio y paridad. Acumulativo previo Lite [45210932463](https://github.com/c2melendez/precision-lab-lite/actions/runs/45210932463), job 137819215611, SUCCESS con 2847 PASS, 8 expected fail y pruebas DV-I-07..12 ejecutadas; no demuestra el nuevo SHA. Verificar CI del nuevo SHA sin duplicarlo. Plus conserva evidencia parcial de servicio y HTTP, no cierre bilateral. S25, SG28/DIST y EV-D-01 permanecen bloqueados; certificación global abierta.

Siguiente: implementar y verificar derivación hiperbólica inversa real con dominios y reglas de cadena, completar paridad DV-H/DV-HI y reconciliar gates del nuevo SHA.

## Reconciliación de acumulativos — 2026-11-23 UTC

Acumulativo previo 45201778979 SUCCESS, job 137786875509: 2847 pruebas aprobadas; 18 pruebas DV-I-07..12 ejecutadas. Detectado y corregido anclaje por línea de matriz en commit técnico a9285c438ef434b8855b5f6b284f1ec6474e3cab; 18/18 focales locales. CI del nuevo SHA pendiente de verificación. No declarar cierre completo. S25, SG28/DIST y EV-D-01 permanecen bloqueados; certificación global abierta.

Siguiente: Revisar CI del SHA a9285c438ef434b8855b5f6b284f1ec6474e3cab y completar pruebas Lite de DV-H-01..12 y DV-HI-01..10, dominios y paridad; no duplicar corridas.

# r586 — LM-D-04 verificado funcionalmente en gates acumulativos

Lite 304515c8b9536327f0e5a267875776c0369c0979: Cumulative 44638506529 success, H1d 44638506297 success, Scientific 44638506458 success, CI 44638506888 success, Certification Runner 44638506841 success. Fix for LaTeX escaping in special-case resultLatex for sin(3x)/sin(5x)=3/5. Logs confirm success. Classification: product (symbolic limit). PASS_SCOPED funcional.

S19 REVIEW; S25, SG28/DIST y EV-D-01 BLOCKED; global OPEN. Siguiente acción: reconciliar continuity.json con SHA técnicos y huellas vigentes, sincronizar a Plus si el fix es bilateral, avanzar a siguiente caso de la matriz de límites.

---

# r584 — LM-D-03 verificado funcionalmente

Lite 567c2459dab6e3b568063d84547e33a51474b657 acumulativo 44202237843/job 134459002131 ejecutó 2678 pruebas aprobadas, incluidas cinco LM-D-03; H1d 44202237915/job 134459001668 ejecutó 22 y Scientific 44202240173/job 134459007569 ejecutó 456. Plus 2fb197e317f3a84cf405ec7027e60f1a11b623b6 acumulativo 44202243228/backend 134459017665 ejecutó 3195 aprobadas, 1 skipped y 11 xfailed; fuente, servicio bilateral y HTTP LM-D-03 pasaron; frontend 134459017183 aprobó 1055. H1d 44202243381/job 134459017335 aprobó 38. Logs revisados; PASS_SCOPED funcional, sin afirmar E2E visual específico ni certificación global.

S19 REVIEW; S25, SG28/DIST y EV-D-01 BLOCKED; global OPEN. Siguiente acción: reconciliar continuity.json con SHA técnicos y huellas vigentes, revisar mutación sin duplicar y avanzar a LM-D-04.

---

# r583 — LM-D-03 fix applied; gates in progress on 17d48908

Lite fix SHA 17d4890854ce81132a24eeb8f293c54cb5fb7c0d: Certification Runner 44200198238 SUCCESS. CI 44200198222 failure on npm audit (independent S25, not blocking). Cumulative 44200198258, H1d 44200198209, Scientific 44200198232 all in_progress. Prior classification harness/oracle. Next: WAIT and confirm on completion before advancing.

Plus prior LM-D-02 retained. S19 REVIEW; S25, SG28/DIST and EV-D-01 BLOCKED; global OPEN.

---

# r582 — LM-D-03 cumulative failed on regex; H1d success; fix applied

Lite 58a4e56029c881629c8be2dd42ae42253a9bf912: H1d 44199284871/job 134448862692 success (22 tests). Cumulative 44199284597/job 134448860902 failed in Unit and parity regression: tests/trigonometryLmD03.audit.test.ts threw Invalid regular expression /^limit\(/ Unterminated group. Classification: harness/oracle (test regex). Fix committed 17d4890854ce81132a24eeb8f293c54cb5fb7c0d changing toContain('limit('). Awaiting new CI runs on the fix SHA.

Plus status from prior: LM-D-02 evidence retained. S19 REVIEW; S25, SG28/DIST and EV-D-01 BLOCKED; global OPEN. Next action: confirm new cumulative/H1d/Scientific on the fix SHA, then reconcile continuity.json and advance matrix if PASS_SCOPED.

---

# r581 — LM-D-02 verificado en parser y motor

Lite fc078ef17dd0b0f33c889162227fcb588aa3fa8f acumulativo 44182693887/job 134390920241 ejecutó 2673 pruebas aprobadas, incluidas cinco LM-D-02; la nueva prueba conecta la expresión parseada al resultado exacto del motor. H1d 44182693960/job 134390921037 ejecutó 22 y Scientific 44182693935/job 134390921924 ejecutó 456. Logs revisados.

Plus conserva evidencia en abcba4291f0550144185eb5277c94802872d411f, acumulativo 44172880652/backend 134356367273 3192 aprobadas, 1 skipped y 11 xfailed, incluyendo fuente, servicio bilateral y HTTP LM-D-02. Resultado funcional PASS_SCOPED, sin afirmar E2E visual específico ni certificación global.

S19 REVIEW; S25, SG28/DIST y EV-D-01 BLOCKED; global OPEN. Siguiente acción: reconciliar continuity.json con SHA técnicos y huellas vigentes, revisar mutación sin duplicar y avanzar a LM-D-03.

# r594 — LM-D-07 evidencia funcional bilateral verificada

Lite 9eda9e25fedc3216ad7e2e7ec8ac26d295be147a: acumulativo 44877376791/job 136764951590: 2698 PASS, 8 expected fail, 34 TODO, cinco pruebas LM-D-07; H1d 44877376794: 22 PASS; Scientific 44877376833: 456 PASS. Plus f891c28724d0f1c5ea7b64e3bb9ceb1a941b6236: acumulativo 44877379711/backend 136764962060: 3207 PASS, 1 skipped, 11 xfail, tres pruebas LM-D-07; frontend 136764961865: 1055 PASS, 28 TODO; H1d 44877379707: 38 PASS. Logs y ejecución verificados. PASS_SCOPED funcional, sin afirmar E2E visual específico ni certificación global.

S19 REVIEW; S25, SG28/DIST y EV-D-01 BLOCKED; global OPEN. Siguiente: TRIG-LM-D-08, reproducir fila congelada y agregar regresión bilateral.

---


# r595 — LM-D-08 evidencia funcional bilateral verificada

Lite 28a310099d4e0362e4f6decc1bb6d0116eb7b3a4: acumulativo 44886101598/job 136791606966: 2703 PASS, 8 expected fail, 34 TODO, cinco pruebas LM-D-08; H1d 44886101584: 22 PASS; Scientific 44886101578: 456 PASS. Plus 67d78cdb2a2bd73e526cf37098168abb49b6ab7b: acumulativo 44886103994/backend 136791613319: 3210 PASS, 1 skipped, 11 xfail, tres pruebas LM-D-08; frontend 136791613209: 1055 PASS, 28 TODO; H1d 44886104008: 38 PASS. Logs y ejecución verificados. PASS_SCOPED funcional, sin afirmar E2E visual específico ni certificación global.

S19 REVIEW; S25, SG28/DIST y EV-D-01 BLOCKED; global OPEN. Siguiente: TRIG-LM-D-09, reproducir fila congelada y agregar regresión bilateral.

---


# r596 — LM-D-09 evidencia funcional bilateral verificada

Lite 7786044bc991b4b09aa1768ff9720b799b517ca5: acumulativo 44895512883/job 136820188708: 2706 PASS, 8 expected fail, 34 TODO, tres pruebas LM-D-09; H1d 44895512895: 22 PASS; Scientific 44895512950: 456 PASS. Plus 2b90f7804d379ee5b4ab938554ac29f9fc4d2557: acumulativo 44895518107/backend 136820204502: 3213 PASS, 1 skipped, 11 xfail, tres pruebas LM-D-09; frontend 136820204753: 1055 PASS, 28 TODO; H1d 44895518077: 38 PASS. Logs y ejecución verificados. PASS_SCOPED funcional en servicio y HTTP Plus, sin afirmar E2E visual ni ejecución literal completa.

S19 REVIEW; S25, SG28/DIST y EV-D-01 BLOCKED; global OPEN. Siguiente: TRIG-LM-D-10, anclar fila congelada, reproducir y agregar regresión bilateral.

---


# r597 — LM-D-10 evidencia funcional bilateral verificada

Lite 203ad96c06f0c4d8a9b470b65e0b4c22da5f0d40: acumulativo 44905544709/job 136850206737: 2710 PASS, 8 expected fail, 34 TODO, cuatro pruebas LM-D-10; H1d 44905544663: 22 PASS; Scientific 44905544661: 456 PASS. Plus 60df05ce753a8240c3dcf5fafbd3ceaf6c57cb1f: acumulativo 44905548435/backend 136850218348: 3216 PASS, 1 skipped, 11 xfail, tres pruebas LM-D-10; frontend 136850218582: 1055 PASS, 28 TODO; H1d 44905548422: 38 PASS. Logs y ejecución verificados. PASS_SCOPED funcional; análisis literal Lite y HTTP Plus cubiertos separadamente, sin afirmar E2E visual ni ejecución literal completa.

S19 REVIEW; S25, SG28/DIST y EV-D-01 BLOCKED; global OPEN. Siguiente: TRIG-LM-D-11, anclar fila congelada, reproducir y agregar regresión bilateral.

---


# r598 — LM-D-11 evidencia funcional bilateral verificada

Lite fcd4d6b1c871b10c7176064b2a41a2a823bb6512: acumulativo 44915926473/job 136881406162: 2714 PASS, 8 expected fail, 34 TODO, cuatro pruebas LM-D-11; H1d 44915926547: 22 PASS; Scientific 44915926527: 456 PASS. Plus 9b560a82a1e7337c47afef6702b8da9beba8eeee: acumulativo 44915931400/backend 136881419643: 3219 PASS, 1 skipped, 11 xfail, tres pruebas LM-D-11; frontend 136881419291: 1055 PASS, 28 TODO; H1d 44915931380: 38 PASS. Logs y ejecución verificados. PASS_SCOPED funcional; sin afirmar E2E visual ni ejecución literal completa.

S19 REVIEW; S25, SG28/DIST y EV-D-01 BLOCKED; global OPEN. Siguiente: TRIG-LM-D-12, anclar fila congelada, reproducir y agregar regresión bilateral.

---


# r599 — LM-D-12 evidencia funcional bilateral verificada

Lite efeb824f4c5b10b0b98f383043fefcec947d69d7: acumulativo 44926001095/job 136912108473: 2718 PASS, 8 expected fail, 34 TODO, cuatro pruebas LM-D-12; H1d 44926001120: 22 PASS; Scientific 44926001051: 456 PASS. Plus 606de33e6a50407f7f462fa794d72af74a77dec3: acumulativo 44926004559/backend 136912118112: 3222 PASS, 1 skipped, 11 xfail, tres pruebas LM-D-12; frontend 136912117937: 1055 PASS, 28 TODO; H1d 44926004655: 38 PASS. Logs y ejecución verificados. PASS_SCOPED funcional; sin afirmar E2E visual ni ejecución literal completa.

S19 REVIEW; S25, SG28/DIST y EV-D-01 BLOCKED; global OPEN. Siguiente: TRIG-LM-D-13, anclar fila congelada, verificar inexistencia bilateral y agregar regresión.

---


# r600 — LM-D-13 evidencia funcional bilateral verificada

Lite f42c666faaccbddd6b8eedd84a04704ef3ea5866: acumulativo 44936787647/job 136945053152: 2721 PASS, 8 expected fail, 34 TODO, tres pruebas LM-D-13; H1d 44936787571: 22 PASS; Scientific 44936787575: 456 PASS. Plus d83bd906a1b595a5c76075a052b9a480b72f165f: acumulativo 44936790898/backend 136945063184: 3225 PASS, 1 skipped, 11 xfail, tres pruebas LM-D-13; frontend 136945063407: 1055 PASS, 28 TODO; H1d 44936790901: 38 PASS. Logs y ejecución verificados. PASS_SCOPED funcional; sin afirmar E2E visual ni ejecución literal completa.

S19 REVIEW; S25, SG28/DIST y EV-D-01 BLOCKED; global OPEN. Siguiente: TRIG-LM-I-01, anclar fila congelada, reproducir y agregar regresión bilateral.

---


# r601 — LM-I-01 evidencia funcional bilateral verificada

Lite a97c41fdea3f9ef6c2961e7306aec2ae619cad50: acumulativo 44947644577/job 136978376164: 2725 PASS, 8 expected fail, 34 TODO, cuatro pruebas LM-I-01; H1d 44947644605: 22 PASS; Scientific 44947644783: 456 PASS. Plus e444b8cfae28acaf0d0b61e54fe6da4230485385: acumulativo 44947648970/backend 136978389141: 3228 PASS, 1 skipped, 11 xfail, tres pruebas LM-I-01; frontend 136978389426: 1055 PASS, 28 TODO; H1d 44947649026: 38 PASS. Logs y ejecución verificados. PASS_SCOPED funcional; sin afirmar E2E visual ni ejecución literal completa.

S19 REVIEW; S25, SG28/DIST y EV-D-01 BLOCKED; global OPEN. Siguiente: TRIG-LM-I-02, anclar fila congelada, reproducir y agregar regresión bilateral.

---


# r602 — LM-I-02 evidencia funcional bilateral verificada

Lite 4e6e8af2acbf46e5041fce18d1f3af250dcb075c: acumulativo 44957993270/job 137010262355: 2729 PASS, 8 expected fail, 34 TODO, cuatro pruebas LM-I-02; H1d 44957993266: 22 PASS; Scientific 44957993300: 456 PASS. Plus 425aca92ced04bef34f88089fc4e8b3e29ee2b0f: acumulativo 44957997426/backend 137010274909: 3231 PASS, 1 skipped, 11 xfail, tres pruebas LM-I-02; frontend 137010275056: 1055 PASS, 28 TODO; H1d 44957997427: 38 PASS. Logs y ejecución verificados. PASS_SCOPED funcional; sin afirmar E2E visual ni ejecución literal completa.

S19 REVIEW; S25, SG28/DIST y EV-D-01 BLOCKED; global OPEN. Siguiente: TRIG-LM-I-03, anclar fila congelada, reproducir y agregar regresión bilateral.

---

# r603 — LM-I-03 evidencia funcional Lite en progreso (Scientific pendiente)

Lite c4e2f35bf68d04989a731f56d9a96954500d3c78: acumulativo 44968070163/job 137041494405 SUCCESS (Unit/parity + build); H1d 44968070149 SUCCESS; CI 44968070233 SUCCESS; Certification Runner 44968070227 SUCCESS. Scientific UI 44968070170 aún in_progress. Fix: exact inverse trig ratio in calculus.ts + audit test. Logs confirman success en gates completados. PASS_SCOPED funcional parcial; sin afirmar E2E visual completo ni bilateral Plus.

S19 REVIEW; S25, SG28/DIST y EV-D-01 BLOCKED; global OPEN. Siguiente: confirmar Scientific, reconciliar continuidad y avanzar matriz si bilateral verde.

---

# r605 — TRIG-LM-I-04 evidencia funcional bilateral verificada

Lite a5192de4be9bd32fc67749a67475f0053703dec0: acumulativo 44973192915/job 137057227623: 2737 PASS, 8 expected fail, 34 TODO; H1d 44973192903/job 137057226911: 22 PASS; Scientific UI 44973192920/job 137057226810: 456 PASS. La prueba LM-I-04 ejecutó cuatro casos.

Plus 0c05fa3bfdaa8f643923aee11c87d2e53f788aa5: acumulativo 44973195708/backend 137057236581: 3237 PASS, 1 skipped, 11 xfail; frontend 137057236186: 1055 PASS, 28 TODO; H1d 44973195775/job 137057236705: 38 PASS. La prueba LM-I-04 ejecutó tres casos. Logs revisados, ejecución sin reutilización para estos SHA. Clasificación PASS_SCOPED funcional bilateral; no implica certificación global ni ejecución literal completa.

S19 REVIEW; S25, SG28/DIST y EV-D-01 BLOCKED; global OPEN. Siguiente: TRIG-LM-I-05, anclar fila congelada, reproducir y verificar paridad y regresiones. No duplicar corridas.

---


# r606 — TRIG-LM-I-05 evidencia funcional bilateral verificada

Lite df21d12eb33f4cdbacd6873c60746f2a7e637e1c: acumulativo 44978022624/job 137072160252, 2741 PASS, 8 expected fail y 34 TODO; LM-I-05 cuatro pruebas. H1d 44978022683/job 137072160263: 22 PASS; científico 44978022635/job 137072160282: 456 PASS.

Plus 519209b4728a4257d6d8e00396432781c5c17495: acumulativo 44978026221, frontend job 137072170936: 1055 PASS y 28 TODO; backend job 137072171106: 3240 PASS, 1 skipped y 11 xfail, incluidas tres pruebas LM-I-05. H1d 44978026185/job 137072170917: 38 PASS. Logs revisados y ejecución real de los gates verificada. PASS_SCOPED funcional bilateral, no certificación global ni cobertura visual específica de la fila.

S19 REVIEW; S25, SG28/DIST y EV-D-01 BLOCKED; global OPEN. Siguiente: TRIG-LM-I-06, verificar la fila de arctan(x) en infinito y paridad bilateral. Evitar corridas duplicadas.

---


# r607 — TRIG-LM-I-06 evidencia funcional bilateral verificada

Lite 8fa9c64bd0952c66942e776e70d1448b36711acf: acumulativo 44986607827/job 137098443001: 2743 PASS, 8 expected fail, 34 TODO, incluidas dos pruebas LM-I-06; H1d 44986607711/job 137098442715: 22 PASS; científico 44986607815/job 137098442924: 456 PASS.

Plus 168c8c9c0b45dcb61da98fcb20e23bb660644591: acumulativo 44986611272, frontend job 137098453810: 1055 PASS, 28 TODO; backend job 137098453963: 3243 PASS, 1 skipped y 11 xfail, incluidas tres pruebas LM-I-06. H1d 44986611264/job 137098453794: 38 PASS. Logs revisados y ejecución real verificada. PASS_SCOPED funcional bilateral, sin afirmar cobertura visual específica ni certificación global.

S19 REVIEW; S25, SG28/DIST y EV-D-01 BLOCKED; global OPEN. Siguiente: TRIG-LM-I-07, anclar fila y verificar límite de arctan(x) en menos infinito y paridad bilateral. Evitar corridas duplicadas.

---


# r608 — TRIG-LM-I-07 evidencia funcional bilateral verificada

Lite cc3eae31250bca83d0a1f2b6c431d498434cf327: acumulativo 44991030677/job 137111904093: 2746 PASS, 8 expected fail, 34 TODO, incluidas tres pruebas LM-I-07; H1d 44991030682/job 137111904029: 22 PASS; científico 44991030656/job 137111903943: 456 PASS.

Plus 77a8aea1580494cb71bf96dbd6d5c6fdbfb907eb: acumulativo 44991034388, frontend job 137111916348: 1055 PASS, 28 TODO; backend job 137111916547: 3246 PASS, 1 skipped y 11 xfail, incluidas tres pruebas LM-I-07. H1d 44991034408/job 137111916540: 38 PASS. Logs revisados y ejecución real verificada. PASS_SCOPED funcional bilateral, sin afirmar cobertura visual específica ni certificación global.

S19 REVIEW; S25, SG28/DIST y EV-D-01 BLOCKED; global OPEN. Siguiente: TRIG-LM-I-08, anclar fila y verificar límite lateral izquierdo de arccos(x) en 1 y paridad bilateral. Evitar corridas duplicadas.

---


# r609 — TRIG-LM-I-08 evidencia funcional bilateral verificada

Lite 75f40eb5b6a867fb784c0d14556cbac90d0dd7fc: acumulativo 44995054105/job 137124186001: 2749 PASS, 8 expected fail, 34 TODO, incluidas tres pruebas LM-I-08; H1d 44995054086/job 137124185732: 22 PASS; científico 44995054102/job 137124185884: 456 PASS.

Plus 6d20c5cbf5b88ea9f6efcf899d4df58f876f86e8: acumulativo 44995057605, frontend job 137124197716: 1055 PASS, 28 TODO; backend job 137124197492: 3249 PASS, 1 skipped y 11 xfail, incluidas tres pruebas LM-I-08. H1d 44995057644/job 137124197637: 38 PASS. Logs revisados y ejecución real verificada. PASS_SCOPED funcional bilateral, sin afirmar cobertura visual específica ni certificación global.

S19 REVIEW; S25, SG28/DIST y EV-D-01 BLOCKED; global OPEN. Siguiente: TRIG-LM-I-09, anclar fila y verificar límite x(π/2−arctan x) en infinito y paridad bilateral. Evitar corridas duplicadas.

---


# r610 — TRIG-LM-I-09 evidencia funcional bilateral verificada

Lite f18bdd3c87a1948f0021af038fe6c36f41295238: acumulativo 44999616715/job 137138059860: 2752 PASS, 8 expected fail, 34 TODO, incluidas tres pruebas LM-I-09; H1d 44999616804/job 137138059704: 22 PASS; científico 44999616714/job 137138059786: 456 PASS.

Plus 3100fdff843ad05bfff5909b9cd083519e2be5a7: acumulativo 44999619904, frontend job 137138070510: 1055 PASS, 28 TODO; backend job 137138070750: 3252 PASS, 1 skipped y 11 xfail, incluidas tres pruebas LM-I-09. H1d 44999619908/job 137138070652: 38 PASS. Logs revisados y ejecución real verificada. PASS_SCOPED funcional bilateral, sin afirmar cobertura visual específica ni certificación global.

S19 REVIEW; S25, SG28/DIST y EV-D-01 BLOCKED; global OPEN. Siguiente: TRIG-LM-I-10, anclar fila y verificar límite de arccot(x) en infinito y paridad bilateral. Evitar corridas duplicadas.

---


# r611 — TRIG-LM-I-10 evidencia funcional bilateral verificada

Lite 331209607d5559a0d62f162744584be79571eb70: acumulativo 45004266796/job 137152248710: 2754 PASS, 8 expected fail, 34 TODO, incluidas dos pruebas LM-I-10; H1d 45004266761/job 137152249133: 22 PASS; científico 45004266751/job 137152248843: 456 PASS.

Plus e5ab1fe7c80c207111455cd0075b82794891627b: acumulativo 45004271106, frontend job 137152260812: 1055 PASS, 28 TODO; backend job 137152261046: 3255 PASS, 1 skipped y 11 xfail, incluidas tres pruebas LM-I-10. H1d 45004271083/job 137152260611: 38 PASS. Logs revisados y ejecución real verificada. PASS_SCOPED funcional bilateral, sin afirmar cobertura visual específica ni certificación global.

S19 REVIEW; S25, SG28/DIST y EV-D-01 BLOCKED; global OPEN. Siguiente: TRIG-LM-I-11, anclar fila y verificar límite de arccot(x) en menos infinito y paridad bilateral. Evitar corridas duplicadas.

---


# r612 — TRIG-LM-I-11 evidencia funcional bilateral verificada

Lite 1bac2c68d8272d52aa4e30236c5846c8ac640ad6: acumulativo 45009391761/job 137168113613: 2756 PASS, 8 expected fail, 34 TODO, incluidas dos pruebas LM-I-11; H1d 45009391723/job 137168113482: 22 PASS; científico 45009391647/job 137168113282: 456 PASS.

Plus 1a60e92781f10387a4d09d096cc5ac9042a46c0c: acumulativo 45009396590, frontend job 137168129723: 1055 PASS, 28 TODO; backend job 137168129603: 3258 PASS, 1 skipped y 11 xfail, incluidas tres pruebas LM-I-11. H1d 45009396555/job 137168129616: 38 PASS. Logs acumulativos revisados y ejecución real verificada. PASS_SCOPED funcional bilateral, sin afirmar cobertura visual específica ni certificación global. Gate de mutación/seguridad Plus 45009396612 sigue en curso; no se declara PASS ni se duplica.

S19 REVIEW; S25, SG28/DIST y EV-D-01 BLOCKED; global OPEN. Siguiente: TRIG-LM-H-01, anclar fila y verificar límite sinh(x)/x en cero y paridad bilateral. Evitar corridas duplicadas.

---


# r613 — TRIG-LM-H-01 evidencia funcional bilateral verificada

Lite 6f2558a358ca641893a9969cd71f381e155dd74d: acumulativo 45013965105/job 137182166202: 2758 PASS, 8 expected fail, 34 TODO, incluidas dos pruebas LM-H-01; H1d 45013965102/job 137182166295: 22 PASS; científico 45013965162/job 137182166008: 456 PASS.

Plus a200e6f74c100fa1400079941abb4e041c9eba7d: acumulativo 45013968670, frontend job 137182176336: 1055 PASS, 28 TODO; backend job 137182176715: 3261 PASS, 1 skipped y 11 xfail, incluidas tres pruebas LM-H-01. H1d 45013968694/job 137182176226: 38 PASS. Logs revisados y ejecución real verificada. PASS_SCOPED funcional bilateral, sin afirmar cobertura visual específica ni certificación global. Gate de mutación/seguridad Plus 45009396612, job 137168236451, sigue en curso; no se declara PASS ni se duplica.

S19 REVIEW; S25, SG28/DIST y EV-D-01 BLOCKED; global OPEN. Siguiente: TRIG-LM-H-02, anclar fila y verificar límite (cosh(x)−1)/x² en cero y paridad bilateral. Evitar corridas duplicadas.

---


# r614 — TRIG-LM-H-02 evidencia funcional bilateral verificada

Lite 34e43bac6b248f594641531443225217de3abae4: acumulativo 45018816016/job 137196952016: 2761 PASS, 8 expected fail, 34 TODO, incluidas tres pruebas LM-H-02; H1d 45018816022/job 137196952180: 22 PASS; científico 45018816009/job 137196952251: 456 PASS.

Plus 1895c86e1b48d8d6ef63dc78d26b625faa736f6b: acumulativo 45018819582, frontend job 137196963231: 1055 PASS, 28 TODO; backend job 137196963409: 3264 PASS, 1 skipped y 11 xfail, incluidas tres pruebas LM-H-02. H1d 45018819615/job 137196963094: 38 PASS. Logs revisados y ejecución real verificada. PASS_SCOPED funcional bilateral, sin afirmar cobertura visual específica ni certificación global. Gate de mutación/seguridad Plus 45009396612, job 137168236451, sigue en curso; no se declara PASS ni se duplica.

S19 REVIEW; S25, SG28/DIST y EV-D-01 BLOCKED; global OPEN. Siguiente: TRIG-LM-H-03, anclar fila y verificar límite tanh(x)/x en cero y paridad bilateral. Evitar corridas duplicadas.

---


# r615 — TRIG-LM-H-03 evidencia funcional bilateral verificada

Lite b42a9fbd963f4e900f6421afbe89c9aa8305e5f8: acumulativo 45023786554/job 137212245781: 2764 PASS, 8 expected fail, 34 TODO, incluidas tres pruebas LM-H-03; H1d 45023786547/job 137212246093: 22 PASS; científico 45023786611/job 137212245858: 456 PASS.

Plus d9df7e6370114c3cc9cca195f180377aa304eea8: acumulativo 45023790877, frontend job 137212260245: 1055 PASS, 28 TODO; backend job 137212259949: 3267 PASS, 1 skipped y 11 xfail, incluidas tres pruebas LM-H-03. H1d 45023790847/job 137212260013: 38 PASS. Logs revisados y ejecución real verificada. PASS_SCOPED funcional bilateral, sin afirmar cobertura visual específica ni certificación global. Gate de mutación/seguridad Plus 45009396612, job 137168236451, sigue en curso; no se declara PASS ni se duplica.

S19 REVIEW; S25, SG28/DIST y EV-D-01 BLOCKED; global OPEN. Siguiente: TRIG-LM-H-04, anclar fila y verificar límite (sinh(x)−x)/x³ en cero y paridad bilateral. Evitar corridas duplicadas.

---


# r616 — TRIG-LM-H-04 evidencia funcional bilateral verificada

Lite 7d207b75a9cc91f6750c722c7e802103ea72a9c6: acumulativo 45029298778/job 137229104956: 2767 PASS, 8 expected fail, 34 TODO, incluidas tres pruebas LM-H-04; H1d 45029298774/job 137229104995: 22 PASS; científico 45029298792/job 137229104847: 456 PASS.

Plus 91fd5be846535868d7a2ac9d3446566169eea94c: acumulativo 45029304571, frontend job 137229121006: 1055 PASS, 28 TODO; backend job 137229121261: 3270 PASS, 1 skipped y 11 xfail, incluidas tres pruebas LM-H-04. H1d 45029304532/job 137229121044: 38 PASS. Logs revisados y ejecución real verificada. PASS_SCOPED funcional bilateral, sin afirmar cobertura visual específica ni certificación global. Gate de mutación/seguridad Plus 45009396612, job 137168236451, sigue en curso; no se declara PASS ni se duplica.

S19 REVIEW; S25, SG28/DIST y EV-D-01 BLOCKED; global OPEN. Siguiente: TRIG-LM-H-05, anclar fila y verificar límite tanh(x) en infinito y paridad bilateral. Evitar corridas duplicadas.

---


# r617 — TRIG-LM-H-05 evidencia funcional bilateral verificada

Lite 2e9facd6bdb031c06c8a62cdb6b473eb73466357: acumulativo 45034736640/job 137245849357: 2769 PASS, 8 expected fail, 34 TODO, incluidas dos pruebas LM-H-05; H1d 45034736689/job 137245849508: 22 PASS; científico 45034736697/job 137245849414: 456 PASS.

Plus cc966f95bb674814b721cd7dd79e387aeb44bf54: acumulativo 45034741018, frontend job 137245863058: 1055 PASS, 28 TODO; backend job 137245863280: 3273 PASS, 1 skipped y 11 xfail, incluidas tres pruebas LM-H-05. H1d 45034741069/job 137245862882: 38 PASS. Logs revisados y ejecución real verificada. PASS_SCOPED funcional bilateral, sin afirmar cobertura visual específica ni certificación global. Gate de mutación Plus 45009396612, job 137168236451, fue cancelado a las 15:30 UTC sin informe final; no es PASS. Security backend pasó, frontend omitido; no equivale a certificación integral.

S19 REVIEW; S25, SG28/DIST y EV-D-01 BLOCKED; global OPEN. Siguiente: TRIG-LM-H-06, anclar fila y verificar límite tanh(x) en menos infinito y paridad bilateral. Evitar corridas duplicadas.

---


# r618 — TRIG-LM-H-06 evidencia funcional bilateral verificada

Lite 0adeece25ab2c54a008b671c6335da330d4a5a96: acumulativo 45040360975/job 137263205078: 2772 PASS, 8 expected fail, 34 TODO, incluidas tres pruebas LM-H-06; H1d 45040361049/job 137263204575: 22 PASS; científico 45040360997/job 137263204762: 456 PASS.

Plus 90cf75578e2863c6ad402606958055bc051c854e: acumulativo 45040364920, frontend job 137263216189: 1055 PASS, 28 TODO; backend job 137263216383: 3276 PASS, 1 skipped y 11 xfail, incluidas tres pruebas LM-H-06. H1d 45040364842/job 137263215910: 38 PASS. Logs revisados y ejecución real verificada. PASS_SCOPED funcional bilateral, sin afirmar cobertura visual específica ni certificación global. Gate de mutación Plus 45009396612/job 137168236451 cancelado sin informe final, no es PASS.

S19 REVIEW; S25, SG28/DIST y EV-D-01 BLOCKED; global OPEN. Siguiente: TRIG-LM-H-07, anclar fila y verificar límite sinh(x)/exp(x) en infinito y paridad bilateral. Evitar corridas duplicadas.

---


# r619 — TRIG-LM-H-07 evidencia funcional bilateral verificada

Lite a159758b45d91cb8e42d1ade0e0088e8187dfa72: acumulativo 45046142023/job 137281066515: 2775 PASS, 8 expected fail, 34 TODO, incluidas tres pruebas LM-H-07; H1d 45046142000/job 137281066645: 22 PASS; científico 45046142012/job 137281066211: 456 PASS.

Plus 8fa92d7e265d622a41768d822247b025ac9c06d6: acumulativo 45046146669, frontend job 137281081651: 1055 PASS, 28 TODO; backend job 137281081916: 3279 PASS, 1 skipped y 11 xfail, incluidas tres pruebas LM-H-07. H1d 45046146698/job 137281082101: 38 PASS. Logs revisados y ejecución real verificada. PASS_SCOPED funcional bilateral, sin afirmar cobertura visual específica ni certificación global. Gate de mutación Plus 45009396612/job 137168236451 cancelado sin informe final, no es PASS.

S19 REVIEW; S25, SG28/DIST y EV-D-01 BLOCKED; global OPEN. Siguiente: TRIG-LM-H-08, anclar fila y verificar límite cosh(x)/sinh(x) en infinito y paridad bilateral. Evitar corridas duplicadas.

---


# r620 — TRIG-LM-H-08 evidencia funcional bilateral verificada

Lite cb06ee99ed1b1acc0e5f78b8990e19c296a19218: acumulativo 45051750585/job 137298170875: 2778 PASS, 8 expected fail, 34 TODO, incluidas tres pruebas LM-H-08; H1d 45051750579/job 137298170719: 22 PASS; científico 45051750582/job 137298170802: 456 PASS.

Plus e2871174472c1f20c90b55f8fa4d79277f8d6f6c: acumulativo 45051755374, frontend job 137298187689: 1055 PASS, 28 TODO; backend job 137298187555: 3282 PASS, 1 skipped y 11 xfail, incluidas tres pruebas LM-H-08. H1d 45051755405/job 137298187721: 38 PASS. Logs revisados y ejecución real verificada. PASS_SCOPED funcional bilateral, sin afirmar cobertura visual específica ni certificación global. Gate de mutación Plus 45009396612/job 137168236451 cancelado sin informe final, no es PASS.

S19 REVIEW; S25, SG28/DIST y EV-D-01 BLOCKED; global OPEN. Siguiente: TRIG-LM-H-09, anclar fila y verificar límite cosh(x)−sinh(x) en infinito y paridad bilateral. Evitar corridas duplicadas.

---


# r621 — TRIG-LM-H-09 evidencia funcional bilateral verificada

Lite fb711458539a334f2da40c7db03067a6845e859c: acumulativo 45057386135/job 137315516726: 2780 PASS, 8 expected fail, 34 TODO, incluidas dos pruebas LM-H-09; H1d 45057386172/job 137315516486: 22 PASS; científico 45057386137/job 137315516535: 456 PASS.

Plus f59a83f418fd70636ca36cffb96510b404ccf74f: acumulativo 45057390013, frontend job 137315528794: 1055 PASS, 28 TODO; backend job 137315528583: 3285 PASS, 1 skipped y 11 xfail, incluidas tres pruebas LM-H-09. H1d 45057389968/job 137315528508: 38 PASS. Logs revisados y ejecución real verificada. PASS_SCOPED funcional bilateral, sin afirmar cobertura visual específica ni certificación global. Gate de mutación Plus 45009396612/job 137168236451 cancelado sin informe final, no es PASS.

S19 REVIEW; S25, SG28/DIST y EV-D-01 BLOCKED; global OPEN. Siguiente: TRIG-LM-H-10, anclar fila y verificar límite derecho de coth(x) en cero y paridad bilateral. Evitar corridas duplicadas.

---


# r622 — TRIG-LM-H-10 evidencia funcional bilateral verificada

Lite 46df082b8c1bbefd936642b7848b06da3a59d996: acumulativo 45062439474/job 137331132037: 2782 PASS, 8 expected fail, 34 TODO, incluidas dos pruebas LM-H-10; H1d 45062439602/job 137331132315: 22 PASS; científico 45062439478/job 137331132108: 456 PASS.

Plus 87496114d766e4e68fcad6eeb99a5ca3579adc93: acumulativo 45062445190, frontend job 137331149614: 1055 PASS, 28 TODO; backend job 137331149863: 3288 PASS, 1 skipped y 11 xfail, incluidas tres pruebas LM-H-10. H1d 45062445155/job 137331149386: 38 PASS. Logs revisados y ejecución real verificada. PASS_SCOPED funcional bilateral, sin afirmar cobertura visual específica ni certificación global. Gate de mutación Plus 45009396612/job 137168236451 cancelado sin informe final, no es PASS.

S19 REVIEW; S25, SG28/DIST y EV-D-01 BLOCKED; global OPEN. Siguiente: TRIG-LM-H-11, anclar fila y verificar límite cosh(x) en infinito y paridad bilateral. Evitar corridas duplicadas.

---


# r623 — TRIG-LM-H-11 evidencia funcional bilateral verificada

Lite 11a767332daca2c02aa1dba0d42754985c09851a: acumulativo 45068258369/job 137349186124: 2784 PASS, 8 expected fail, 34 TODO, incluidas dos pruebas LM-H-11; H1d 45068258308/job 137349186204: 22 PASS; científico 45068258354/job 137349186351: 456 PASS.

Plus 0ae294bb9f5cd129ae4c30d09051d5b072daa18a: acumulativo 45068264001, frontend job 137349201526: 1055 PASS, 28 TODO; backend job 137349201279: 3291 PASS, 1 skipped y 11 xfail, incluidas tres pruebas LM-H-11. H1d 45068263915/job 137349201143: 38 PASS. Logs revisados y ejecución real verificada. PASS_SCOPED funcional bilateral, sin afirmar cobertura visual específica ni certificación global. Gate de mutación Plus 45009396612/job 137168236451 cancelado sin informe final, no es PASS.

S19 REVIEW; S25, SG28/DIST y EV-D-01 BLOCKED; global OPEN. Siguiente: TRIG-LM-HI-01, anclar fila y verificar límite arsinh(x)/x en cero y paridad bilateral. Evitar corridas duplicadas.

---


# r624 — TRIG-LM-HI-01 evidencia funcional bilateral verificada

Lite 5b14e059b586f55b7c560b6d6dc9f0b15d454c97: acumulativo 45073550458/job 137365669114: 2786 PASS, 8 expected fail, 34 TODO, incluidas dos pruebas LM-HI-01; H1d 45073550396/job 137365669031: 22 PASS; científico 45073550408/job 137365668852: 456 PASS.

Plus b0d051461d1a08922f1474dc7e0617c55807f907: acumulativo 45073553372, frontend job 137365678335: 1055 PASS, 28 TODO; backend job 137365678543: 3294 PASS, 1 skipped y 11 xfail, incluidas tres pruebas LM-HI-01. H1d 45073553446/job 137365678375: 38 PASS. Logs revisados y ejecución real verificada. PASS_SCOPED funcional bilateral, sin afirmar cobertura visual específica ni certificación global. Gate de mutación Plus 45009396612/job 137168236451 cancelado sin informe final, no es PASS.

S19 REVIEW; S25, SG28/DIST y EV-D-01 BLOCKED; global OPEN. Siguiente: TRIG-LM-HI-02, anclar fila y verificar límite artanh(x)/x en cero y paridad bilateral. Evitar corridas duplicadas.

---


# r625 — TRIG-LM-HI-02 evidencia funcional bilateral verificada

Lite 54d2c35915970223de7c14c10d81d13bc7fbc8b9: acumulativo 45079857725/job 137385340269: 2788 PASS, 8 expected fail, 34 TODO, incluidas dos pruebas LM-HI-02; H1d 45079857733/job 137385340478: 22 PASS; científico 45079857715/job 137385340409: 456 PASS.

Plus f9444ccfed1a202f7ba72cb57986ec5aae795539: acumulativo 45079862334, frontend job 137385354547: 1055 PASS, 28 TODO; backend job 137385354798: 3297 PASS, 1 skipped y 11 xfail, incluidas tres pruebas LM-HI-02. H1d 45079862271/job 137385354389: 38 PASS. Logs revisados y ejecución real verificada. PASS_SCOPED funcional bilateral, sin afirmar cobertura visual específica ni certificación global. Gate de mutación Plus 45009396612/job 137168236451 cancelado sin informe final, no es PASS.

S19 REVIEW; S25, SG28/DIST y EV-D-01 BLOCKED; global OPEN. Siguiente: TRIG-LM-HI-03, anclar fila y verificar límite (artanh(x)−x)/x³ en cero y paridad bilateral. Evitar corridas duplicadas.

---



## LM-HI-05 — PASS_SCOPED (2026-11-23 UTC)

SHA técnico `3fc7245fa71207f92de06149edc0688592943bc6`; cumulative: run 45107803042, jobs [137472990981], h1d: run 45107803158, jobs [137472991081], scientific: run 45107803065, jobs [137472990897]. Registros de ejecución revisados. Siguiente caso: LM-HI-06. Certificación global OPEN; bloqueos conservados.



## LM-HI-06 — PASS_SCOPED (2026-11-23 UTC)

SHA técnico `92f8decf8727d2820a1b24f2121f56b133623d4a`; cumulative: run 45113929052, jobs [137492298279], h1d: run 45113928988, jobs [137492298373], scientific: run 45113929037, jobs [137492298396]. Registros revisados. Siguiente: LM-HI-07. Certificación global OPEN; bloqueos conservados.



## LM-HI-07 — PASS_SCOPED (2026-11-23 UTC)

SHA técnico `b9e499e2ebfb1054aa5fb8a169cdd1b40baedb94`; cumulative: run 45119556526, jobs [137509952984], h1d: run 45119556614, jobs [137509952988], scientific: run 45119556645, jobs [137509953127]. Registros revisados. Siguiente: LM-HI-08. Certificación global OPEN; bloqueos conservados.



## LM-HI-08 — PASS_SCOPED (2026-11-23 UTC)

SHA técnico `e1e2fcf9a3e6fc58873de3d1193e4c3a33bfac3b`; cumulative: run 45125902335, jobs [137530045826], h1d: run 45125902286, jobs [137530045818], scientific: run 45125902309, jobs [137530045857]. Registros revisados. Siguiente: DV-D-01, sujeto a revisión de cobertura. Certificación global OPEN; bloqueos conservados.



## DV-D-01 — PASS_SCOPED (2026-11-23 UTC)

SHA técnico `74eef18606fa38863edee5288f8dbe42cb363b52`; cumulative: run 45133376143, jobs [137553792319], h1d: run 45133376250, jobs [137553792662], scientific: run 45133376121, jobs [137553792299]. Registros revisados. Siguiente: DV-D-02. Certificación global OPEN; bloqueos conservados.



## DV-D-02..06 — PASS_SCOPED (2026-11-23 UTC)

SHA técnico `7a84eebb15bec7688fab8305677fd2543783dffd`; cumulative: run 45141109317, jobs [137579046723], h1d: run 45141109396, jobs [137579047385], scientific: run 45141109344, jobs [137579047351]. Registros revisados. Siguiente: DV-D-07. Certificación global OPEN; bloqueos conservados.



## DV-D-07..10 — PASS_SCOPED (2026-11-23 UTC)

SHA técnico `fb51031b007f560bb1f108cb41e3807afa76b74d`; cumulative: run 45149260776, jobs [137606181430], h1d: run 45149260472, jobs [137606180353], scientific: run 45149260593, jobs [137606180466]. Registros revisados. Siguiente: DV-D-11. Certificación global OPEN; bloqueos conservados.



## DV-D-11..14 — PASS_SCOPED (2026-11-23 UTC)

SHA técnico `5ebc065bc2e315d954eaff5a17cda697e85fd0af`; cumulative: run 45158499483, jobs [137637495346], h1d: run 45158499531, jobs [137637497626], scientific: run 45158499491, jobs [137637495186]. Registros revisados. Siguiente: DV-I-01. Certificación global OPEN; bloqueos conservados.



## DV-I-01..03 — PASS_SCOPED (2026-11-23 UTC)

SHA técnico `3b58199f6f67fe0abbee511e72889ee3556ebcaa`; cumulative: run 45167432554, jobs [137667912614], h1d: run 45167432506, jobs [137667912307], scientific: run 45167432247, jobs [137667910897]. Registros revisados. Siguiente: DV-I-04. Certificación global OPEN; bloqueos conservados.



## Política de lotes de 80 casos — 2026-11-23 UTC

Nueva política operativa añadida a EXECUTION_PROTOCOL.md. Meta 80 casos; 60 orientativo; exige tablero por caso, oráculos independientes, trazabilidad bilateral y deduplicación CI. No cambia estados ni certifica filas; reconstruir evidencia pendiente antes de declarar PASS. Mantener bloqueos vigentes.



## DV-I-04..06 y lote 80 — 2026-11-23 UTC

PASS_SCOPED de DV-I-04..06 para las pruebas ejecutadas; SHA técnico `87630eb3f8e9e9533f0419bfe9652006c505f619`; cumulative: run 45185735176, jobs [137730716065], h1d: run 45185735217, jobs [137730715728], scientific: run 45185735144, jobs [137730715706]. Los canales no cubiertos continúan pendientes. Preparado BATCH_80_01.md con 80 IDs; la asignación no acredita ejecución. Certificación global OPEN y bloqueos conservados.



## Lote 80-01: verificación en curso — 2026-11-23 UTC

SHA técnico `e9e57d7897d355d538cb15018397bdbfe3bc544e`; acumulativo [45201778979](https://github.com/c2melendez/precision-lab-lite/actions/runs/45201778979) en curso. Lite: el acumulativo 45196484977 falló por tres errores del evaluador del test; 45201208750 falló por timeout de 5s en DV-I-07. Corrección y timeout acotado sin relajar oráculos; 18/18 focales locales, tsc aprobado. No declarar PASS hasta revisar CI y canales aplicables. Conservar bloqueos globales.

