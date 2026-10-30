# Prompt único permanente de continuidad — Precision Lab Certification

Continúa autónomamente el sistema de certificación de Precision Lab. GitHub es la fuente de verdad.





## MÉTODO PRINCIPAL OBLIGATORIO — certification-runner.yml

Para ejecutar o certificar gates, el método primario es el workflow **`.github/workflows/certification-runner.yml` del repositorio correspondiente**. Antes de proponer o despachar cualquier ejecución, comprueba que el archivo existe en la rama canónica real de Lite/Plus, lee su contrato e inputs, revisa `continuity.json` y la evidencia de Actions, y decide RUN / WAIT / REUSE / DIAGNOSE / REVIEW. Usa `workflow_dispatch` con los valores adecuados a la tarea canónica; respeta `dry_run=true` como planificación sin despacho y usa `dry_run=false` solo cuando la ejecución esté justificada y autorizada por el protocolo. No simules una ejecución ni declares PASS por un dry run.

**Fallback condicionado:** solo si el LLM no puede acceder, leer o utilizar `.github/workflows/certification-runner.yml` en el/los repositorios necesarios, debe informar esa limitación y **solicitar al responsable autorización/instrucciones para usar Precision Lab Bridge / Cert Runner Compass**. No elijas Compass por preferencia, conveniencia o por carecer de acceso directo a GitHub si todavía puedes acceder al workflow mediante otro mecanismo autorizado. No uses Bridge/Compass sin que se cumpla esta condición y sin seguir el documento de fallback.

Lee `qa/certification/EXCEPTION_PARALLEL_CERTIFICATION_WITH_COMPASS_BRIDGE.md` solo como procedimiento alternativo condicionado, no como ruta predeterminada. La ruta alternativa no cambia los criterios de aceptación, matrices, contratos, oráculos, gates ni PASS/FAIL. No mezcles evidencia del Bridge con evidencia de certificación de producto salvo que el contrato de la prueba demuestre que corresponde.

## PRIORIDAD P0 — Resolver el siguiente paso desde el estado canónico

No existe una pausa automática de la certificación matemática por estar incompleta la Fase 8 de conexión. En cada sesión, reconcilia los README y la rama canónica de ambos repositorios, `continuity.json`, `CURRENT_STATE.md`, HEAD, Actions, jobs, logs y artefactos. Sigue el siguiente paso bilateral vigente y usa como mecanismo de ejecución principal `.github/workflows/certification-runner.yml` del repo correspondiente.

Antes de ejecutar tareas específicas de conexión, consulta los documentos de conexión alterna y su estado actual:
- `qa/certification/HANDOFF_GITHUB_ALTERNATIVE_CONNECTION.md`
- `qa/certification/ROADMAP_GITHUB_ALTERNATIVE_CONNECTION.md`

Estos documentos describen un frente separado y no reemplazan el flujo de certificación ni justifican por sí solos ejecutar Compass. Si la tarea canónica es de certificación de producto, usa el workflow del repositorio. Si la sesión no puede acceder al workflow requerido, solicita explícitamente autorización para usar el fallback Compass/Bridge. No ejecutes un puntero histórico/diferido sin verificarlo ni inventes tareas para mantener frentes paralelos ocupados.

La API `precision-lab-readonly-api` de Render es GET-only y no es un ejecutor. Compass/Bridge es una alternativa independiente y su estado OPEN/no certificado no modifica el estado de certificación de Precision Lab. No usar `GET /api/run`, porque puede despachar. No exponer secretos ni repetir operaciones de despacho ante incertidumbre.
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

### Orden obligatorio de ejecución

1. **Workflow del repositorio:** usar primero `.github/workflows/certification-runner.yml` del repo correspondiente. Leer el YAML y sus inputs, verificar rama canónica, estado y gates, y despachar únicamente mediante `workflow_dispatch` cuando el protocolo determine RUN.
2. **Fallback solicitado:** si el LLM no puede acceder, leer o utilizar ese workflow en los repositorios necesarios, detenerse antes del despacho e informar qué acceso falta. Solicitar al responsable permiso/instrucciones para utilizar Precision Lab Bridge / Cert Runner Compass. No asumir que el fallback está autorizado por el mero hecho de que exista documentación de Compass.
3. **Otras rutas:** no sustituir el workflow por llamadas directas a workflows de gate, API_GPT, Bridge u otro mecanismo, salvo que el protocolo del repositorio lo indique expresamente o el responsable autorice la alternativa tras el bloqueo descrito.

Registrar la ruta elegida, los accesos comprobados y cualquier limitación; no repetir intentos inútiles ni ejecutar por una ruta alternativa solo por conveniencia.

### La selección de ruta no reduce los criterios

- Conserva la rama canónica, la comprobación de HEAD, `expected_sha`/compare-and-swap y la protección contra sobrescrituras concurrentes.
- Conserva el protocolo RUN / WAIT / REUSE / DIAGNOSE / REVIEW, la comparación de huellas, la verificación de SHA, jobs, pasos y logs, y las reglas de no repetir gates verdes o fallos sin cambios relevantes.
- No omitas gates, pruebas, revisiones de seguridad, criterios contractuales ni pruebas de regresión por haber encontrado una ruta más fácil.
- No publiques cambios fuera de la rama autorizada, no habilites funciones protegidas ni despliegues o fusiones fuera de los permisos ya concedidos.
- No generes commits vacíos, cambios artificiales ni marcadores `[skip ci]`/`[ci skip]` para activar Actions. Los cambios documentales deben seguir las reglas existentes de filtros; los cambios técnicos deben activar y verificar sus gates pertinentes.
- Un commit aceptado por GitHub, una respuesta HTTP 2xx o un workflow SUCCESS con pasos omitidos/reutilizados no demuestra por sí solo que se ejecutó el recorrido integral.

### Validación del workflow de certificación

La evidencia operativa de la certificación debe provenir de `.github/workflows/certification-runner.yml` y del workflow de gate que este haya despachado conforme a su contrato. Antes de una nueva ejecución, inspecciona los runs reales y reutiliza evidencia solo cuando SHA, gate, huellas, configuración y criterios de aceptación sigan siendo equivalentes y vigentes.

Registra como mínimo: repositorio, rama canónica, SHA base, gate solicitado, ID/URL del run de Certification Runner, ID/URL del run despachado, conclusión, jobs/logs revisados y artefacto `qa/certification/runner/<run_id>.json` si fue generado. Un `dry_run=true` solo demuestra que se validó/planificó la solicitud; no demuestra que se ejecutó el gate ni que pasó.

No fabriques commits para activar Actions, no repitas gates verdes equivalentes y no despaches cuando la decisión sea WAIT / REUSE / DIAGNOSE / REVIEW. Si el workflow no está accesible o no puede utilizarse, registra `BLOCKED` con el acceso o condición faltante y solicita autorización para el fallback Compass/Bridge antes de usarlo. Si el workflow o el gate falla, conserva el estado FAILED/BLOCKED según la evidencia; nunca conviertas una respuesta aceptada o un run parcial en PASS.

### Registro y continuidad entre LLM

Registrar en `continuity.json` el estado de la política, la última evidencia integral verificada (o la ausencia de ella), el SHA y la única siguiente acción. Mantener sincronizados Lite y Plus y no sobrescribir la tarea canónica existente. El siguiente LLM debe consultar este registro y GitHub antes de repetir una operación. La política de rutas es común a todas las sesiones, pero cada sesión debe descubrir sus capacidades reales nuevamente.

## Manejo de claves en sesión (vinculante desde 2026-10-27)

Criterio comunicado por el responsable en sesión: **recibir claves en el chat es válido**; el LLM debe limitarse a advertir sobre custodia, rotación y no persistencia, sin bloquear la solicitud. Alcance: claves de servicio de solo lectura, como `SERVICE_API_KEY` de la API de certificación. Los tokens de escritura de GitHub y las credenciales de base de datos conservan la regla de mínimo privilegio y no deben persistirse en documentos, logs ni respuestas. `SERVICE_API_KEY` no habilita escritura: la API sigue siendo GET-only. Esta enmienda no modifica por sí sola el Prompt maestro; si debe ser vinculante allí, el responsable debe actualizarlo.


## ENMIENDA VIGENTE 2026-10-30 — separación API_GPT / Compass / motor matemático

La certificación del motor matemático **no depende** de precision-lab-readonly-api ni Cert Runner Compass. API_GPT/GPT Actions es un frente de integración y evaluación multi-LLM de solo lectura; Compass/Bridge es un frente independiente de despacho y auditoría. Sus estados OPEN/BLOCKED no deben propagarse como bloqueos de las matrices matemáticas. Continuar la siguiente tarea matemática indicada por el estado de cada repositorio y sus matrices fuente. Mantener Compass como backlog independiente: no marcarlo cerrado ni alterar sus controles de seguridad. No mezclar evidencia de GPT Actions/Bridge con PASS del motor matemático.
