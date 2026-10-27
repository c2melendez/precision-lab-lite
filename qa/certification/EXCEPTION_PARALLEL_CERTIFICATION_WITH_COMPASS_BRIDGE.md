# Excepción de continuidad: certificación Precision Lab en paralelo con Cert Runner Compass

**Fecha de registro:** 2026-10-27 UTC  
**Ámbito:** Precision Lab Lite y Precision Lab Plus  
**Estado:** AUTORIZACIÓN OPERATIVA ACOTADA — no equivale a certificar Compass ni Precision Lab.

## 1. Decisión y propósito

El responsable autoriza una excepción a la prioridad temporal de conexión alternativa indicada en `CONTINUATION_PROMPT.md`: se permite que un LLM que no disponga de acceso directo a GitHub continúe la **certificación original de Precision Lab** utilizando directamente Cert Runner Compass Bridge, siempre que disponga legítimamente de las credenciales necesarias mediante un canal seguro.

La certificación se trabajará en dos frentes paralelos:

1. **Frente principal — certificación de Precision Lab:** continuar los criterios, matrices, contratos, oráculos, pruebas, gates y bloqueos que ya estaban vigentes antes de priorizar los mecanismos de conexión. El objetivo principal no cambia.
2. **Frente habilitador — Compass y otros mecanismos de conexión:** seguir verificando, corrigiendo y documentando la conexión externa para aumentar su seguridad, idempotencia, trazabilidad y disponibilidad. Este frente no debe congelar innecesariamente el primero cuando Compass pueda usarse de forma acotada.

Esta excepción cambia la **ruta de ejecución disponible**, no los criterios de aceptación de Precision Lab, la definición de PASS, los contratos matemáticos, las matrices fuente, los oráculos ni las decisiones de alcance ya registradas. No permite inventar resultados ni tratar una conexión parcial como certificación completa.

## 2. Precedencia de esta excepción

Para las sesiones que reciban este documento junto con el prompt permanente:

- Esta excepción prevalece únicamente sobre la instrucción de **esperar a completar toda la Fase 8 de conexión antes de retomar la certificación matemática**.
- Las demás reglas del prompt permanente continúan vigentes: resolver la rama canónica con los punteros de ambos repositorios, consultar `continuity.json`, `CURRENT_STATE.md`, `ROADMAP_CONTINUITY.md`, `EXECUTION_PROTOCOL.md`, `MANUAL_CAPABILITY_GAPS.md`, los logs y la evidencia real de GitHub; evitar repeticiones; clasificar fallos; mantener Lite/Plus coordinados; y actualizar los registros.
- GitHub y los artefactos de certificación siguen siendo la fuente de verdad sobre el estado de producto. Este documento no reemplaza la secuencia canónica ni convierte referencias históricas en evidencia vigente.
- Si el prompt, el índice bilateral o la evidencia real discrepan, no se debe escoger una versión por conveniencia. Registrar la discrepancia y reconciliarla antes de ejecutar pruebas que puedan alterar el estado.


### Regla operativa para resolver conflictos y elegir el siguiente paso

1. **La excepción vigente prevalece sobre la pausa de P0** en `CONTINUATION_PROMPT.md`: no es necesario esperar al cierre de la Fase 8 para continuar la certificación matemática original. La Fase 8 sigue siendo necesaria para declarar certificada la ruta de conexión.
2. **El índice canónico sigue decidiendo el trabajo concreto.** Lee y reconcilia `continuity.json`, `CURRENT_STATE.md`, Actions y artefactos reales en Lite y Plus. Ejecuta únicamente el siguiente paso respaldado por esa reconciliación; no inventes una tarea ni uses el puntero matemático histórico como si fuera vigente.
3. **Si el siguiente paso canónico es de conexión**, trabaja en ese frente. **Si corresponde continuar la certificación de producto**, continúa con sus criterios originales; si falta acceso directo a GitHub, Compass es una ruta autorizada solo bajo las salvaguardas de este documento. No se requiere terminar un frente para avanzar en el otro cuando sus prerrequisitos y evidencia permitan trabajar en paralelo.
4. Si el prompt, el índice bilateral, el estado de los repositorios o las ejecuciones reales se contradicen, no despaches una prueba potencialmente mutante hasta reconciliar la discrepancia. Documenta qué fuente discrepa y qué evidencia resolvería el conflicto.
5. Los cambios exclusivamente documentales no constituyen evidencia de ejecución ni deben disparar CI según los filtros vigentes.

## 3. Uso autorizado de Cert Runner Compass Bridge

El LLM puede conectarse directamente a Cert Runner Compass en:

- Bridge: `https://cert-runner-compass.lovable.app`
- Proyecto Lovable: `57b9141d-9f69-4fef-9b7f-0f81f2eaec2f`
- Autenticación de cliente: `X-Bridge-Key`
- Idempotencia: `Idempotency-Key`

La API `precision-lab-readonly-api` alojada en Render es un componente distinto, de solo lectura. No debe convertirse en ejecutor ni confundirse con Compass. La persistencia de Compass está en Lovable Cloud; no se debe asumir que el proyecto Supabase `oqlzftercvraprnvjifo` es su backend.

### Límites y salvaguardas

1. No revelar, imprimir, registrar en Markdown ni pegar en la conversación valores de claves, tokens o secretos. Obtenerlos solo de la integración o almacén autorizado disponible para esa sesión. Si no están disponibles de forma segura, detenerse y pedir al responsable que configure el acceso; no pedir que publique una clave en el chat.
2. No usar `GET /api/run`: esa ruta puede despachar un workflow. Usar la ruta Bridge documentada y su contrato vigente.
3. Antes del primer POST de una sesión, verificar por lectura el despliegue que contiene la corrección de HTTP 204 y la clasificación de rechazos definitivos frente a resultados inciertos (commit reportado `f051a4b1` o posterior). El despliegue se reportó, pero la verificación independiente figura pendiente en el corte de 2026-10-27.
4. Generar una `Idempotency-Key` por tarea lógica y reutilizarla en reintentos de esa misma tarea. No repetir un POST después de 409, error de red o `DISPATCH_OUTCOME_UNKNOWN`; consultar primero el estado disponible. No crear una clave nueva para eludir una incertidumbre.
5. Antes y después de cada despacho, revisar y registrar los runs relevantes. `dry_run=true` **sí ejecuta el Runner**; no significa “cero runs”. El destino `both` puede generar un run por repositorio. Elegir repo, gate, branch/SHA y modo según la tarea canónica y el protocolo.
6. Ejecutar únicamente pruebas justificadas por el siguiente objetivo y sus prerrequisitos. Esta excepción no es permiso para lanzar campañas completas, duplicar gates verdes, probar en producción de forma indiscriminada ni ampliar el alcance.
7. Si la respuesta del Bridge es incierta, la correlación no se puede demostrar, aparece un rechazo inesperado o las credenciales no funcionan, registrar BLOCKED/REVIEW y detener el despacho. Nunca convertir ausencia de evidencia en PASS.
8. Compass v1.1 sigue **OPEN / NO CERTIFICADO** hasta cerrar sus criterios. Su uso autorizado no es una afirmación de que el Bridge, su seguridad o la ruta Push → API → Bridge → Runner ya estén completamente certificados.

## 4. Cómo retomar la certificación original

Al iniciar una sesión, el LLM debe:

1. Resolver la rama canónica actual siguiendo los README predeterminados de Lite y Plus. No asumir que la rama mencionada en este documento seguirá siendo canónica.
2. Leer en ambos repositorios los documentos de continuidad y comprobar HEAD, commits, workflow runs, jobs, logs y artefactos actuales antes de reutilizar cualquier dato de este corte.
3. Leer `continuity.json`. La acción de Compass puede ocupar el campo `next_action` mientras se trabaja en el mecanismo de conexión. Para recuperar el punto matemático que se dejó en pausa, revisar `prior_math_next_action_deferred_2026_10_27` si sigue presente y contrastarlo con la historia y los artefactos actuales. **No ejecutar el puntero diferido a ciegas ni reemplazar el `next_action` vigente sin reconciliación.**
4. Retomar la certificación original desde el último criterio realmente ejecutado y demostrado. Mantener sin alteración los estados BLOCKED, ON_HOLD, OUT_OF_SCOPE_SINGLE_HOST y cualquier otro estado documentado hasta que exista evidencia suficiente para cambiarlo.
5. Aplicar el protocolo original de decisión por gate (RUN / WAIT / REUSE / DIAGNOSE / REVIEW). No repetir una prueba equivalente ya satisfactoria en el mismo SHA/configuración; no interpretar un run SUCCESS como aceptación global si faltan criterios.
6. Mantener el trabajo coordinado entre Lite y Plus. Una tarea cuyo responsable/artefacto sea Plus no se debe ejecutar de nuevo en Lite solo para “mantener simetría”; en Lite se puede registrar el hito como espejo documental cuando corresponda. Si la tarea es bilateral, exigir evidencia en ambos repositorios.
7. Después de un avance sustantivo, actualizar el estado, el log y el índice de continuidad en ambos repositorios cuando proceda, dejando claro qué se ejecutó, qué solo se inspeccionó y qué quedó simulado. Los cambios puramente documentales no deben disparar CI.

## 5. Punto de continuación matemático preservado en el corte del 2026-10-27

El índice de continuidad contenía estos punteros diferidos al priorizar Compass. Son referencias para orientar la reconciliación, no sustituyen la comprobación de estado actual:

- **Plus:** `H2-EN-SG-CASE-EVIDENCE-AUDIT-R314` — construir la tabla de evidencia por caso `EN-SG-01..32` (test, archivo, run/job ligado al SHA exacto y clasificación PASS/FAIL/GAP/MANUAL) a partir de las pruebas backend/frontend y los runs reales. Confirmar primero si cada GAP es real o si ya existe cobertura sin etiqueta; añadir pruebas test-first solo para brechas confirmadas. No ejecutar cargas extremas en producción ni activar `SG28_EVALUATE_ISOLATION` en producción.
- **Lite:** `LITE-WAIT-PLUS-H2-EVIDENCE-AUDIT-R301` — estado WAIT: la acción descrita era continuar el inventario `EN-SG-01..32` en Plus y actualizar Lite solo como espejo documental de hitos bilaterales; no repetir gates en Lite para el arreglo ya validado.

Antes de proceder, recuperar de nuevo estos campos en ambos `continuity.json` y verificar si hay avances posteriores. Si se mantienen, continuar la auditoría de evidencia de Plus como tarea primaria y reflejar en Lite únicamente los hitos que correspondan. Los bloqueos registrados —entre ellos `SECURITY-S25`, `SY-X-04-PLUS-HTTP`, `ALGEBRA229-AS-B-29`, `EDCX-B5` y `H2-SG28-DIST-01..08`— no se cierran por el mero hecho de cambiar el mecanismo de conexión.

## 6. Separación de registros y doble vía de trabajo

Cada sesión debe etiquetar explícitamente sus acciones como una de estas categorías:

- **CERTIFICACIÓN PL:** criterios y evidencias del producto Precision Lab.
- **CONEXIÓN COMPASS:** Bridge, autenticación, idempotencia, despacho, correlación, seguridad y trazabilidad.
- **DOCUMENTACIÓN / RECONCILIACIÓN:** actualización de estado o historial sin ejecución de pruebas.

No mezclar runs del Runner usados para certificar Compass con evidencia de un criterio matemático, salvo que el artefacto y el contrato demuestren que ese run satisface ese criterio concreto. Tampoco considerar una prueba de conexión como sustituto de los gates matemáticos acumulativos.

## 7. Criterio de salida

La excepción permanece vigente mientras el responsable no la revoque. El LLM puede continuar el frente principal a través de Compass dentro de las salvaguardas anteriores, mientras sigue registrando el estado de certificación de Compass por separado. La certificación global de Precision Lab solo puede declararse completa cuando sus criterios originales y bloqueos se resuelvan con la evidencia exigida por los contratos, oráculos y protocolos vigentes.

**Registro de esta actualización:** documentar esta excepción no dispara GitHub Actions, no envía POST al Bridge y no crea evidencia de ejecución.
