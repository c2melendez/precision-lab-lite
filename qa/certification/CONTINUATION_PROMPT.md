# Prompt único permanente de continuidad — Precision Lab Certification

Continúa autónomamente el sistema de certificación de Precision Lab. GitHub es la fuente de verdad.





## EXCEPCIÓN AUTORIZADA — Continuar certificación Precision Lab mediante Compass en paralelo

Antes de aplicar la pausa matemática de la sección P0 siguiente, lee `qa/certification/EXCEPTION_PARALLEL_CERTIFICATION_WITH_COMPASS_BRIDGE.md`. El responsable autorizó mantener dos frentes paralelos: (1) la certificación original de Precision Lab y (2) la certificación de los mecanismos de conexión. Esta excepción prevalece solo sobre la condición de esperar a que toda la Fase 8 de conexión esté demostrada antes de reanudar la certificación original; **no** cambia criterios, matrices, oráculos, gates, reglas de evidencia ni criterios PASS/FAIL.

Un LLM sin acceso directo a GitHub puede usar Cert Runner Compass Bridge si dispone de credenciales por un canal seguro y sigue el documento de excepción. No exponer secretos; no usar `GET /api/run`; no repetir POST ante incertidumbre; consultar el estado y reconciliar los runs. Compass v1.1 sigue OPEN/no certificado. Para retomar la tarea matemática, comprobar la rama/HEAD y la evidencia actuales en ambos repos y reconciliar el puntero matemático diferido de `continuity.json`; no ejecutar ese puntero sin verificarlo ni confundir un run de conexión con evidencia matemática.

## PRIORIDAD P0 — Frente de conexión en paralelo (sin congelar la certificación matemática)

**Regla de precedencia obligatoria:** mientras `qa/certification/EXCEPTION_PARALLEL_CERTIFICATION_WITH_COMPASS_BRIDGE.md` esté vigente, la Fase 8 de conexión **no es un requisito previo para reanudar ni continuar la certificación matemática original**. La excepción modifica únicamente esa pausa temporal; no cambia los criterios de aceptación, las matrices, los contratos, los oráculos, los gates ni las reglas PASS/FAIL. La Fase 8 sí sigue siendo necesaria para declarar certificada la ruta de conexión completa.

Antes de ejecutar tareas específicas del frente de conexión, lee en la rama canónica vigente:
- `qa/certification/HANDOFF_GITHUB_ALTERNATIVE_CONNECTION.md`
- `qa/certification/ROADMAP_GITHUB_ALTERNATIVE_CONNECTION.md`

No uses esta prioridad para detener automáticamente el frente matemático. En cada sesión, reconcilia `continuity.json`, `CURRENT_STATE.md`, la evidencia de Actions y el documento de excepción. Sigue el `next_action` bilateral vigente; si corresponde a conexión, avanza ese frente. Si la certificación matemática debe continuar y la sesión carece de acceso directo a GitHub, usa Compass solo conforme al documento de excepción y con las salvaguardas vigentes. No ejecutes un puntero matemático histórico/diferido sin verificarlo ni inventes una tarea para mantener ambos frentes ocupados.

La ruta a certificar es `Push → API → Bridge → Runner → resultado verificable`. La API `precision-lab-readonly-api` de Render sigue siendo GET-only y no debe convertirse en ejecutor. El Bridge separado existente es Cert Runner Compass (Lovable project `57b9141d-9f69-4fef-9b7f-0f81f2eaec2f`), con persistencia en Lovable Cloud, no en Supabase. La certificación Compass v1.1 está OPEN: Fase 1 pasó sin runs y la Fase 2 fue autorizada por el responsable el 2026-10-27. Verifica por lectura el despliegue de `f051a4b1` o posterior antes del primer POST; después sigue B3, B4/B5, B6 y C1-C3 en orden. Nunca usar `GET /api/run`, porque puede despachar. El proyecto Supabase `oqlzftercvraprnvjifo` está separado, `ACTIVE_HEALTHY` según el inventario del 2026-10-27, pero su propósito/consumidores y la configuración efectiva de Data API no están completamente verificados; D-01 permanece bloqueado. No hacer DDL ni cambios de permisos sin auditoría y aprobación.

Antes de cualquier ejecución diaria, consulta el ledger común/idempotencia. Se exige al menos una validación integral satisfactoria por día de trabajo, compartida entre sesiones LLM. No repetir una validación equivalente ya satisfactoria para el mismo HEAD/configuración. Si API, Bridge, Runner o persistencia fallan/no se pueden confirmar, el estado es BLOCKED/FAILED, nunca PASS. No crear commits artificiales, no usar [skip ci], no despachar gates verdes ni exponer secretos. Mantén evidencia con validation/correlation ID, repo, branch, SHA, PR/commit si aplica, run/job, logs y resultado. Al cerrar cada avance, sincroniza el handoff/roadmap y el estado operativo sin alterar contratos matemáticos ni falsear el next_action canónico.

Cuando la ruta de conexión alcance PASS con todas las evidencias, actualiza su estado por separado. Eso no inicia ni reinicia por sí solo la certificación matemática: continúa siempre desde el `next_action` bilateral vigente y la evidencia real, sin duplicar pruebas ni sustituir el índice canónico por este prompt.

## Repositorios
- Lite: `c2melendez/precision-lab-lite`
- Plus: `c2melendez/precision-lab-plus`

## Resolución de la rama activa (sin nombres de rama fijos)
1. Consulta la rama predeterminada de cada repositorio mediante sus metadatos de GitHub.
2. Lee `qa/certification/README.md` en esa rama predeterminada, **indicando explícitamente esa rama o usando la lectura por defecto**. Ese archivo es el punto de entrada permanente que señala la rama canónica activa.
3. Confirma que los dos puntos de entrada indican la misma rama. Si difieren o falta alguno, examina las ramas/historial y reporta la discrepancia; no inventes una rama ni reconstruyas el estado desde el chat.
4. Verifica que la rama señalada existe en ambos repositorios y que contiene `qa/certification/README.md`.

## Continuación canónica
5. En la rama señalada, lee en ambos repositorios y en este orden:
   - `qa/certification/README.md`
   - `qa/certification/CURRENT_STATE.md`
   - `qa/certification/ROADMAP_CONTINUITY.md` (reglas de reconciliación, decisión por gate y prioridades P1–P5)
   - `qa/certification/EXECUTION_PROTOCOL.md`
   - `qa/certification/MANUAL_CAPABILITY_GAPS.md`
   - `qa/certification/EXECUTION_LOG.md`
6. Comprueba los HEAD reales, últimos commits y GitHub Actions antes de asumir que SHA, runs o estados documentados siguen vigentes.
7. Ejecuta el “Siguiente paso exacto” de `CURRENT_STATE.md` y sigue el protocolo. Clasifica cada rojo como producto / harness / oráculo / capability antes de modificar código.
8. Mantén Lite y Plus coordinados, registra toda decisión basada en evidencia y evita divergencias no documentadas.
9. Después de cada avance sustantivo, actualiza `CURRENT_STATE.md` y `EXECUTION_LOG.md` en ambos repositorios; actualiza `MANUAL_CAPABILITY_GAPS.md` si corresponde. Verifica que la sincronización fue efectiva.
10. Si la rama canónica cambia, publica/valida primero toda la documentación en la nueva rama; después actualiza el puntero del README de la rama predeterminada en **ambos** repositorios. No cambies este prompt por un cambio de rama.
11. No utilices el chat, ZIPs ni handoffs históricos como fuente de verdad mientras la documentación canónica esté disponible.

**Objetivo:** que este mismo prompt funcione en todas las sesiones, sin tener que conocer ni editar manualmente la rama activa.

## Regla obligatoria de decisión y ahorro de Actions
Antes de despachar, aplica `qa/certification/ROADMAP_CONTINUITY.md` en ambos repositorios. Reconcilia HEAD y Actions para eventos push y pull_request; comprueba SHA, jobs, pasos, logs, huellas y revisión de aceptación. Decide por gate: RUN / WAIT / REUSE / DIAGNOSE / REVIEW según las definiciones de la hoja. No despaches evidencia verde vigente ni una corrida equivalente en curso; no repitas un fallo idéntico sin cambiar una precondición relevante. S25 no permite reutilización automática. Mantén SG28/DIST y las capacidades no implementadas abiertas hasta que su contrato tenga evidencia suficiente. La siguiente tarea se toma siempre del `next_action` bilateral de `continuity.json`; la hoja no sustituye ese índice ni altera contratos, matrices u oráculos. Antes de publicar, vuelve a leer HEAD para no pisar cambios concurrentes.

## Política permanente de CI automática y ahorro de corridas
1. Resolver SIEMPRE la rama canónica por los README de las ramas predeterminadas; nunca fijarla en este prompt. Inspeccionar en ambos repositorios los YAML de los workflows del bloque activo y gates acumulativos.
2. Garantizar que los workflows pertinentes admitan `push` limitado a la rama canónica verificada, conservando `pull_request` y `workflow_dispatch` donde correspondan. Para cambios exclusivamente documentales, usar en push `paths-ignore: ['qa/certification/**', '**/*.md']`, o filtros más específicos justificados. No excluir archivos técnicos, tests, workflows, dependencias ni cambios que afecten las pruebas. No sobrescribir otros disparadores existentes.
3. No generar commits vacíos o artificiales para activar CI. Un commit exclusivamente de log, estado, README u otra documentación NO debe lanzar E2E. Un commit mixto técnico/documental SÍ debe activar el workflow relevante. Evitar ejecuciones duplicadas; usar concurrency con prudencia sin cancelar gates distintos ni evidencias obligatorias.
4. Después de cada push técnico, comprobar en Actions un nuevo run del workflow pertinente asociado a SHA y rama actuales. Registrar ID, URL, evento, resultado y logs. No confundir compilación exitosa con certificación E2E; tampoco contar runs anteriores al último cambio de tests. Ante ausencia de corrida, diagnosticar filtros YAML, permisos, cuotas o workflow deshabilitado y usar alternativas autorizadas, sin requerir despacho manual cuando push funciona.
5. Tras cambios de rama, actualizar y verificar filtros de push en ambos repositorios antes de mover los punteros canónicos. Mantener paridad funcional, adaptando rutas de Lite/Plus individualmente. Registrar decisiones y evidencias mediante commits documentales que no relancen CI.
6. Un prompt NO activa GitHub Actions por sí mismo: modificar, publicar y validar el YAML real cuando sea necesario. Antes de declarar operativa la automatización, confirmar al menos un disparo por modificación técnica y ausencia de disparo por modificación puramente documental. Continuar diagnóstico, corrección y gates acumulativos según el protocolo, sin fabricar PASS.


## Contrato permanente de continuidad IN625 H2/SG28 (activación condicional)

Cuando CURRENT_STATE indique SG28 abierto, EJECUTA su integración progresiva completa, no solo pruebas unitarias repetidas. GitHub manda sobre cualquier SHA o run escrito aquí.

1. Recupera en ambos repos los HEAD y la evidencia Actions del SHA técnico más reciente; inspecciona Plus `backend/app/routers/evaluate.py`, `backend/app/services/{interruptible,request_cancellation}.py`, `backend/tests/test_in625_sg28_*.py`, workflows SG28 y acumulativos, frontend «Detener cálculo» y E2E.
2. Referencia histórica: Plus SG28 run 38018275394 aprobó 23 pruebas en SHA 0457e1e, ANTERIOR a nuevas pruebas de MathResponse y conexión opt-in. No atribuyas ese PASS al HEAD. `fetch_commit_workflow_runs` puede mostrar solamente PR: una lista vacía no descarta corridas push; buscar workflows/branch o jobs de IDs concretos.
3. El endpoint real `/api/v1/evaluate` en Plus añadió ruta aislada opt-in con `SG28_EVALUATE_ISOLATION=1`, apagada por defecto. Verifica el HEAD; NO activar en producción/Render sin autorización. Mantén comparación bandera off/on y rollback hasta superar gates.
4. Cierra brechas de contrato: comparar respuestas MathResponse completas y status HTTP de éxito/error (numérico, simbólico, grados, sustituciones, parser, dominio, complejidad, timeout, LaTeX), request_id, historial e invariancia matemática. Acreditar clasificación de errores reales, no mapeos locales inventados.
5. Validar desconexión/cancelación del cliente con servidor HTTP real, detención del cálculo servidor, cleanup y recuperación. Un AbortController cliente o proceso simulado no constituye evidencia integral. Si la desconexión no se propaga, diseñar cancelación explícita segura por solicitud.
6. Asegurar cuotas y límites de concurrencia para procesos aislados, timeouts, prevención de procesos huérfanos y sobrecarga; observar operaciones costosas que aún ejecutan en el proceso principal, como simplificación y LaTeX.
7. Ejecutar E2E botón «Detener cálculo» → HTTP → backend → proceso → recuperación, incluyendo cancelación simultánea A/B, repetida, timeout, resultados tardíos, desktop/tablet/móvil; correr regresión, gate acumulativo y paridad Lite/Plus apropiada, sin asumir arquitectura idéntica.
8. No declarar SG28/H2 cerrado sin evidencia por test/caso, SHA, workflow, job/log y criterio contractual. PASS previo del prototipo NO certifica el endpoint ni el frontend. Registrar bloqueos MANUAL/BLOCKED honestamente.
9. Tras cada avance técnico, actualizar CURRENT_STATE con siguiente paso EXACTO ejecutable y rutas/gates/evidencia pendiente; anexar historial a EXECUTION_LOG en ambos repos; no activar CI con commits exclusivamente documentales. Después de cierre, avanzar inmediatamente al siguiente bloque canónico.

Este es un procedimiento permanente, NO un snapshot: verificar siempre los detalles dinámicos en GitHub. Realizar las operaciones técnicas disponibles en la sesión sin pedir permiso por cada commit y sin prometer trabajo asíncrono.


## Continuidad obligatoria antes de ejecutar
Resolver README de main y luego `continuity.json` + `CONTINUITY.md`. Verificar HEAD y Actions (push y PR), huellas, jobs/pasos realmente ejecutados y logs. Aplicar RUN/WAIT/REUSE/DIAGNOSE/REVIEW/REFRESH; si state_status=RECONCILE, resolver el estado antes de heredar próximo objetivo. No despachar un gate equivalente en curso, ni repetir un verde vigente o fallo inalterado por cambiar de sesión. Conservar run/SHA de origen cuando se reutilice. Actualizar el índice con SHA técnico conocido mediante un commit documental posterior, sin autorreferencia. Los bloqueos solo se reensayan si cambian sus precondiciones.


## Si README de la rama predeterminada no contiene el puntero canónico
1. Consultar metadatos del repositorio y del run de Actions aportado por el usuario: obtener default_branch y head_branch reales, sin asumir que main es la rama de certificación.
2. Leer qa/certification/continuity.json en la rama candidata del run y en el producto pareado. Exigir que canonical_branch coincida con la candidata en ambos y verificar HEAD, runs recientes, protocolo y siguiente tarea. Los IDs antiguos solo permiten descubrir la rama; no acreditan el estado actual.
3. Si no hay run de referencia, enumerar ramas y buscar el índice y README de certificación. Elegir solo con evidencia bilateral consistente y vigente. Si hay varios candidatos incompatibles, continuar la inspección y aclarar la ambigüedad antes de publicar; no escoger por memoria del chat o número de revisión aislado.
4. No reiniciar desde el estado S26 histórico de main ni repetir pruebas por ausencia del puntero. No cambiar default_branch, mover referencias ni lanzar CI para descubrir dónde estamos.
5. El puntero en README predeterminado puede corregirse mediante un cambio documental acotado; mientras falte, la recuperación por Actions + índices bilaterales verificados mantiene la continuidad. Esta regla es genérica, no un snapshot de un caso o SHA.


## Política obligatoria de descubrimiento de capacidades y selección dinámica de rutas

Esta política cambia únicamente **cómo** se ejecutan las operaciones; no cambia los requisitos, las matrices, los contratos, los oráculos, los umbrales, las reglas de seguridad ni los criterios de aceptación existentes. Si esta sección parece entrar en conflicto con una regla de certificación, prevalecen los requisitos de certificación y seguridad ya establecidos.

### Descubrimiento de capacidades por sesión

Al iniciar cada sesión, identifica qué herramientas, conectores, credenciales y permisos están realmente disponibles. Distingue entre capacidad confirmada, capacidad aún no probada y capacidad no disponible. No presupongas que otra cuenta o sesión del mismo modelo tiene las mismas capacidades. No declares imposible una operación solo porque no conozcas la herramienta; inspecciona las herramientas disponibles y prueba una vía autorizada de forma controlada. Nunca inventes credenciales ni eludas controles de acceso.

### Orden preferente de rutas

Evalúa estas rutas en el siguiente orden, pasando rápidamente a la siguiente cuando la anterior no esté disponible o no pueda completar la operación:

1. **Acceso directo al repositorio:** credenciales/herramientas Git o GitHub para consultar, editar, crear commits y publicar en la rama autorizada.
2. **Acceso directo al Runner:** utilizar su interfaz autorizada cuando permita preparar/publicar el cambio o ejecutar la operación requerida.
3. **Bridge:** transmitir la operación mediante el intermediario documentado cuando la ruta directa al repositorio o al Runner no sea viable.
4. **API_GPT:** utilizar la API documentada como alternativa para las sesiones con restricciones mayores, dentro de sus permisos y capacidades reales.

Este orden es preferente, no una obligación de insistir indefinidamente. Se puede comenzar en una ruta posterior cuando la evidencia confirme que las anteriores no están disponibles o son incompatibles con la operación. Registrar la ruta elegida y los fallos relevantes, sin repetir intentos inútiles.

### La selección de ruta no reduce los criterios

- Conserva la rama canónica, la comprobación de HEAD, `expected_sha`/compare-and-swap y la protección contra sobrescrituras concurrentes.
- Conserva el protocolo RUN / WAIT / REUSE / DIAGNOSE / REVIEW, la comparación de huellas, la verificación de SHA, jobs, pasos y logs, y las reglas de no repetir gates verdes o fallos sin cambios relevantes.
- No omitas gates, pruebas, revisiones de seguridad, criterios contractuales ni pruebas de regresión por haber encontrado una ruta más fácil.
- No publiques cambios fuera de la rama autorizada, no habilites funciones protegidas ni despliegues o fusiones fuera de los permisos ya concedidos.
- No generes commits vacíos, cambios artificiales ni marcadores `[skip ci]`/`[ci skip]` para activar Actions. Los cambios documentales deben seguir las reglas existentes de filtros; los cambios técnicos deben activar y verificar sus gates pertinentes.
- Un commit aceptado por GitHub, una respuesta HTTP 2xx o un workflow SUCCESS con pasos omitidos/reutilizados no demuestra por sí solo que se ejecutó el recorrido integral.

### Salvaguarda obligatoria: validación diaria end-to-end

La salvaguarda diaria sigue siendo obligatoria e independiente de la ruta seleccionada. En cada día de trabajo debe existir evidencia comprobable de una validación integral del recorrido:

`PUSH / evento autorizado → API → Bridge → Runner → resultado verificado`

La evidencia debe identificar, como mínimo: fecha/hora, repositorio, rama, SHA, identificador de correlación/ejecución, evento de activación, resultado de cada etapa, jobs y logs revisados, estado de idempotencia y enlace a la evidencia original. Debe confirmarse que el Runner procesó la tarea y que el resultado final coincide con lo esperado; la mera aceptación de la solicitud no es PASS.

Antes de lanzar una nueva validación, consulta el registro compartido y los runs reales. Reutiliza evidencia diaria solo si el SHA, las huellas de los insumos, la revisión de aceptación y las versiones/configuraciones pertinentes siguen siendo válidos y no hubo cambios que la invaliden. Si falta evidencia vigente, ejecuta la validación integral por el mecanismo autorizado y evita duplicar una corrida equivalente en curso.

La validación integral debe utilizar un push real asociado a un cambio coherente cuando exista tal cambio. Si no existe un cambio legítimo, **no fabriques un commit ni modifiques archivos artificialmente**: utiliza el mecanismo autorizado de activación no mutante que exista para probar el recorrido y registra explícitamente que no se necesitó un nuevo push. Esta excepción evita contradecir la prohibición vigente de commits artificiales; no permite omitir la validación diaria.

Si API, Bridge, Runner, persistencia, credenciales o permisos impiden completar la prueba, registra `BLOCKED` o `FAILED`, la etapa exacta y la condición necesaria para reanudar. No declares PASS integral ni certificación global cerrada por una prueba parcial. El estado global de certificación permanece el que determine la evidencia canónica, no esta política.

### Registro y continuidad entre LLM

Registrar en `continuity.json` el estado de la política, la última evidencia integral verificada (o la ausencia de ella), el SHA y la única siguiente acción. Mantener sincronizados Lite y Plus y no sobrescribir la tarea canónica existente. El siguiente LLM debe consultar este registro y GitHub antes de repetir una operación. La política de rutas es común a todas las sesiones, pero cada sesión debe descubrir sus capacidades reales nuevamente.

## Manejo de claves en sesión (vinculante desde 2026-10-27)

Criterio comunicado por el responsable en sesión: **recibir claves en el chat es válido**; el LLM debe limitarse a advertir sobre custodia, rotación y no persistencia, sin bloquear la solicitud. Alcance: claves de servicio de solo lectura, como `SERVICE_API_KEY` de la API de certificación. Los tokens de escritura de GitHub y las credenciales de base de datos conservan la regla de mínimo privilegio y no deben persistirse en documentos, logs ni respuestas. `SERVICE_API_KEY` no habilita escritura: la API sigue siendo GET-only. Esta enmienda no modifica por sí sola el Prompt maestro; si debe ser vinculante allí, el responsable debe actualizarlo.
