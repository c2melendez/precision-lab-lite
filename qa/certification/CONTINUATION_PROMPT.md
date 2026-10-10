# Prompt único permanente de continuidad — Precision Lab Certification

Continúa autónomamente el sistema de certificación de Precision Lab. GitHub es la fuente de verdad.

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
