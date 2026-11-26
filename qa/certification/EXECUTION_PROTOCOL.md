# Execution Protocol — Precision Lab Certification

## Objetivo
Certificar Lite y Plus con evidencia reproducible, acumulativa y comparable, separando fallos reales de producto de fallos de harness/oráculo.

## Reglas obligatorias
- Ejecutar y cerrar los bloques en orden.
- Diagnosticar raíz antes de modificar producto.
- Un fallo de serialización equivalente de MathLive no es un fallo matemático.
- Un fallo de harness/oráculo no autoriza cambios al motor.
- Toda corrección debe quedar cubierta por regresión permanente.
- Comparar Lite y Plus; evitar divergir contratos salvo diferencia intencional documentada.
- GitHub Actions es la evidencia principal de ejecución.
- No bloquear IN625 por deuda independiente de S25/security/npm/mutation/CI salvo regresión causada por el cambio actual.
- No declarar certificación global por pruebas estructurales.
- Casos dependientes de SO/hardware se registran como manual/capability; no se simula soporte que Playwright no puede demostrar.
- Si una matriz posterior descubre una fuga de sintaxis anterior, agregar caso permanente al contrato y recertificar el subbloque afectado.
- No usar chat, ZIP o handoff histórico como autoridad cuando `qa/certification/` contiene el estado aplicable.

## IN625 — orden
A1 → A2 → A3 → A4 → B1 → B2 → B3 → B4 → C1 → C2 → C3 → C4 → D1 → D2 → D3 → E1a → E1b → E1c → E1d → E2a → E2b → E2c → E3a → E3b → E3c → E3d1 → E3d2 → E3d3 → F1 → F2a → F2b → F3a → F3b → F3c → G1a/G1b → G2 → G3 → H1 → H2.

## Después de IN625
Syntax 309 → Algebra 114 → Algebra 229 → Trigonometría → Log/Exp/Radicales → Matrices/Vectores → EDO/Complejos → Gráficas → reconciliación/paridad final.

## Política de cambios
1. Reproducir.
2. Clasificar: producto / harness / oráculo / capability.
3. Corregir la capa correcta.
4. Ejecutar el bloque.
5. Ejecutar gate acumulativo relevante.
6. Registrar commit, run, evidencia y decisión en `CURRENT_STATE.md`.
7. Añadir una entrada acumulativa a `EXECUTION_LOG.md`.
8. Sincronizar esos cambios en Lite y Plus antes de considerar cerrado el paso.

## Regla de estado vivo
- `CURRENT_STATE.md` = fotografía autoritativa actual.
- `EXECUTION_LOG.md` = historial acumulativo de ejecución/decisiones.
- `MANUAL_CAPABILITY_GAPS.md` = excepciones y límites reproducibles.
- `CONTINUATION_PROMPT.md` = bootstrap estable; nunca debe contener el estado variable.
- Si GitHub Actions o HEAD contradicen CURRENT_STATE, prevalece la evidencia real; después se corrige CURRENT_STATE inmediatamente.

## Interpretación de G2
G2 comprueba invariancia de canal: LaTeX, texto y teclado deben converger a la misma interpretación matemática. No exigir igualdad textual cuando existen representaciones equivalentes válidas.


## Política de continuidad en dos frentes — decisión aprobada 2026-10-12

**Autoridad:** decisión del responsable del proyecto; aplica a Lite y Plus y a todas las sesiones futuras de LLM. Esta política define el orden de trabajo ante el bloqueo externo de la certificación SG28/DIST, sin modificar criterios de aceptación matemáticos ni de seguridad.

**Frente A — SG28/H2 y DIST-01..08:** desarrollar el coordinador compartido de staging, mTLS, admisión global K=1, fencing duradero y cancelación real del worker a través de HTTP en nodos independientes. Mantener el modo distribuido desactivado por defecto y la ruta de evaluación existente como control. Preparar pruebas locales y CI aisladas sin tocar producción. Solo declarar PASS DIST cuando haya evidencia verificable de hosts independientes, grants globales, cancelación, recuperación, logs y SHA. Hasta entonces: SG28/H2 OPEN y DIST-01..08 BLOCKED; no confundir simulaciones, múltiples procesos o jobs de runners independientes con una ejecución multinodo completa.

**Frente B — matrices matemáticas independientes:** avanzar simultáneamente en trabajo preparatorio, detección de fallos, implementación y regresiones que no dependan de SG28/DIST. Seguir el orden canónico posterior a IN625: Syntax 309 → Algebra 114 → Algebra 229 → Trigonometría → Log/Exp/Radicales → Matrices/Vectores → EDO/Complejos → Gráficas → paridad final. En Gráficas contemplar raíces en Argand, coloreado del dominio complejo, superficies 3D Re/Im y módulo con fase, con oráculos independientes. Respetar todas las dependencias de cada bloque y la paridad Lite/Plus.

**Regla de gates:** no declarar IN625 cerrado contractualmente, ni cambiar el estado PASS de un bloque, cuando falten H2/SG28 o gates obligatorios. El trabajo del Frente B se registra como preparación/validación independiente o certificación parcial donde el contrato lo permita, sin fingir que el bloqueo fue resuelto. Una regresión cruzada reabre el bloque afectado. Los gates relevantes de CI deben pasar en el SHA correcto. No relajar oráculos ni atribuir PASS a TODO, XFAIL o pruebas manuales.

**Autonomía y traspaso:** toda sesión debe leer el README de main para resolver la rama canónica, luego CURRENT_STATE, EXECUTION_PROTOCOL, MANUAL_CAPABILITY_GAPS y EXECUTION_LOG; verificar HEAD y Actions antes de actuar. Seleccionar una tarea accionable en cualquiera de los dos frentes sin esperar desbloqueo externo del otro; publicar cambios y pruebas pertinentes, sincronizar trazabilidad bilateral y consignar commit, run, estado y siguiente paso exacto. Evitar relanzar CI con commits solo documentales. No pedir confirmación rutinaria; no desplegar ni alterar permisos/producción o certificados reales sin autorización correspondiente.

**Condición de salida de esta política:** cuando DIST/SG28 obtenga evidencia real suficiente se continúa el cierre IN625 y se reconcilian las matrices del Frente B con los gates acumulativos, sin perder el trabajo independiente registrado.


## Continuidad y no repetición — 2026-10-16
Leer `continuity.json` y `CONTINUITY.md` al reanudar. Esta regla concreta la selección de gates: recuperar observaciones frescas, comparar huellas, reutilizar solo evidencia real revisada, esperar corridas equivalentes y diagnosticar fallos sin repetir inputs idénticos. Una actualización documental no requiere nueva CI. Si HEAD avanzó sin reconciliación, no heredar el siguiente objetivo del ledger obsoleto. Antes de publicar, refrescar HEAD y usar expected_sha; no sobrescribir otro trabajo. El índice/estado son fotografías; el log y su archivo conservan historia. Los contratos de aceptación y fixtures siguen siendo insumos técnicos, aunque residan en qa. Una decisión REUSE no acredita ejecución nueva ni convierte omisiones en PASS. Seguridad depende de advisories externos y requiere revisión fresca, no reutilización automática por igualdad de SHA.

## Filas con valor aproximado (`\approx`) — 2026-10-21

Las filas de matriz cuyo resultado se documenta con `\approx` (EV-D-08 en adelante) certifican una aproximación redondeada, no un valor exacto. Reglas:

1. El valor de la matriz es la referencia redondeada a los dígitos que muestra la fila (EV-D-08: `0.841470985`, 9 decimales).
2. El motor debe conservar una forma exacta de la expresión (p. ej. `sin(1)`); una salida que solo imprima el decimal no certifica la fila.
3. La comprobación numérica exige que el valor exacto evaluado coincida con la referencia dentro de media unidad del último dígito documentado (5e-10 para 9 decimales).
4. Si el canal solo expone flotantes de 6 decimales (Lite `float`), esa comprobación secundaria usa tolerancia 1e-6; la exactitud simbólica sigue siendo obligatoria.
5. Una fila `\approx` nunca relaja el oráculo de una fila exacta ni autoriza sustituir formas exactas por decimales.


## Política operativa de lotes de certificación — 80 casos (2026-11-23)

Esta política, autorizada por el responsable, define la escala de trabajo sin modificar contratos matemáticos, criterios de aceptación, orden de dependencias ni las restricciones de seguridad. Aplica a Lite y Plus y a toda sesión o ejecutor futuro.

1. **Unidad y meta.** Un caso es una fila con identificador único dentro de una matriz fuente congelada. La meta de cada ciclo técnico completo es abordar 80 casos distintos; 60 es umbral operativo orientativo, no requisito para inventar trabajo ni declarar éxito. Si la complejidad, una falla, capacidad, evidencia pendiente, fin de matriz o tiempo impide alcanzar el umbral, conservar los resultados reales, explicar causa y proseguir de forma viable. Agrupar por sección o capacidad y, al cerrar una matriz, completar con la siguiente solo si respeta dependencias y contratos. Evitar commits por caso.
2. **Reconciliación inicial, obligatoria y progresiva.** Antes de asignar un lote, consultar en ambos repositorios HEAD, `continuity.json`, `CURRENT_STATE.md`, `EXECUTION_LOG.md`, contratos, matrices congeladas y los runs/jobs/logs vigentes. Hay nueve fuentes y un inventario preliminar de 3451 identificadores únicos por matriz: IN625 625; IN309 309; AS114 114; AS229 229; TR324 324; LER 540; MV153 153; EDCX 638; GR519 519. Los identificadores repetidos dentro de una matriz no suman dos casos; ejercicios en matrices distintas se mantienen separados hasta comprobar equivalencia. Este inventario no atribuye resultados ni cierres. Reconstruir de manera incremental el estado por fila desde evidencia auténtica; si faltan datos, marcar DESCONOCIDO/PENDIENTE, no PASS. Registrar cobertura del lote y progreso por matriz antes de afirmar porcentajes o estimar corridas restantes. No esperar al inventario perfecto para desarrollar casos independientes.
3. **Tablero y trazabilidad por caso.** Registrar para cada `(matriz, ID)` fuente y hash; estado (PENDIENTE, EN_CURSO, PASS, PASS_SCOPED, FAIL, BLOCKED, MANUAL o REVIEW); canal y dominio, oráculo, prueba, producto y SHA, workflow/run/job y enlace, ejecución real o reutilización con fuente, y evidencia faltante. Mantener Lite y Plus por separado. La disponibilidad de una prueba o un workflow verde no equivale a una fila certificada. Versionar el índice como documento o datos adecuados y conservar el historial; no reemplazar registros históricos con resultados incompletos. El tablero no puede alterar fixtures, aceptación ni guardias para conseguir verde.
4. **Preparación del lote.** Reutilizar parser y cobertura existentes de sintaxis cuando aplique, después de verificar fuente, canal, dominio y huellas; esa cobertura no demuestra por sí sola resultados matemáticos. Agrupar pruebas parametrizadas con aserciones matemáticas independientes, valores y signos, dominios, límites, controles negativos y metamórficos pertinentes. Una comparación de texto o LaTeX sola no demuestra equivalencia. Validar igualdad simbólica independiente o numérica con tolerancia justificada y muestras seguras; comprobar comportamiento observable, canal original y paridad cuando los contratos lo exijan. Mantener pruebas específicas de regresión ante fallos reales.
5. **Ejecución y economía.** Ejecutar primero pruebas focales; corregir y volver a probar únicamente lo afectado. Publicar en bloques coherentes y consultar runs push/PR por SHA y huellas antes de disparar nada. Aplicar RUN/WAIT/REUSE/DIAGNOSE/REVIEW; esperar corridas equivalentes en curso y reutilizar solo evidencia ejecutada y revisada de insumos y aceptación equivalentes. Ejecutar una vez por bloque los gates acumulativos y de interfaz aplicables; nuevas correcciones técnicas exigen volver a verificar lo afectado. Seguridad y advisories tienen controles propios. Nunca relajar gates, cancelar evidencia necesaria, crear commits vacíos ni usar prosa documental para forzar CI.
6. **Cierre por caso y por matriz.** PASS exige todos los criterios contractuales, canales y productos aplicables con evidencia ejecutada en el SHA pertinente y logs revisados. PASS_SCOPED identifica exactamente capas/canales demostrados y pendientes, sin contarlos como cierre completo. FAIL, BLOCKED, MANUAL, TODO, SKIP, XFAIL y REVIEW no son PASS. La matriz solo cierra con todas sus filas y gates obligatorios aceptados, incluidos bloqueos transversales que apliquen. Conservar S25, SG28/DIST y EV-D-01 hasta evidencia de salida verificable; no activar aislamiento en producción.
7. **Reporte por ciclo.** Informar matriz/sección, IDs y objetivo, número de filas examinadas, nuevas con PASS completo, PASS_SCOPED, FAIL, BLOCKED/MANUAL y pendientes, sin duplicar categorías; correcciones, SHA, runs/jobs y enlaces, tiempo y siguiente lote. Separar casos nuevos de pruebas acumulativas y de resultados heredados. Si el CI sigue en curso, informar WAIT y continuar trabajo independiente sin duplicarlo.
8. **Continuidad.** Al arrancar, resolver rama canónica desde README y reconciliar HEAD y runs; no partir de identificadores o porcentajes del chat. Completar primero el trabajo publicado aún no verificado. Actualizar estado y log sin borrar historia, publicar con protección de HEAD y realizar verificación. No desactivar la automatización hasta que todos los criterios estén efectivamente satisfechos; informar bloqueos y continuar trabajo viable.

## Política operativa vigente v2.0

Por decisión del responsable, [SYSTEM_V2.md](SYSTEM_V2.md) sustituye las cuotas y selección serial anteriores, conserva contratos y prevalece en decisiones operativas. Aplicar P0–P3. Gates existentes no se retiran. La política de 80 queda histórica.
