# Precision Lab — Certification System

Este directorio es la fuente canónica de continuidad del sistema de certificación.

## Regla de autoridad
Las instrucciones operativas, el estado actual, el historial de ejecución, las excepciones y el siguiente paso viven versionados en el repositorio. Un prompt externo NO debe duplicar ni sustituir esta información.

## Prompt único
El único prompt externo necesario para iniciar una nueva sesión es:
- `qa/certification/CONTINUATION_PROMPT.md`

Ese prompt es deliberadamente estable. El estado variable del proyecto NO debe copiarse dentro del prompt.

## Orden de lectura obligatorio para cualquier LLM
1. `qa/certification/README.md`
2. `qa/certification/CURRENT_STATE.md`
3. `qa/certification/EXECUTION_PROTOCOL.md`
4. `qa/certification/MANUAL_CAPABILITY_GAPS.md`
5. `qa/certification/EXECUTION_LOG.md`
6. El spec/test indicado en CURRENT_STATE.
7. Los logs de GitHub Actions de la última corrida indicada en CURRENT_STATE.

## Repositorios coordinados
- Lite: c2melendez/precision-lab-lite
- Plus: c2melendez/precision-lab-plus
- Rama activa actual: `qa/syntax-audit-in625-a1`

## Principio de continuidad
No reconstruir el contexto desde el chat, ZIPs ni handoffs históricos. Leer estos archivos, verificar HEAD/runs reales y continuar desde el “Siguiente paso exacto” de CURRENT_STATE.

## Regla de sincronización
Toda modificación sustantiva del estado de certificación debe reflejarse en ambos repositorios durante la misma operación lógica. `CURRENT_STATE.md` debe describir Lite y Plus conjuntamente aunque el archivo exista duplicado en ambos repositorios.

## Tablero global
Consultar [GLOBAL_CERTIFICATION_DASHBOARD.md](GLOBAL_CERTIFICATION_DASHBOARD.md) para alcance por módulo, evidencia, bloqueos y pendientes. Actualizarlo con los cierres bilaterales; sus conteos de tests no son porcentajes de requisitos certificados.


## Hoja de ruta obligatoria
Leer [ROADMAP_CONTINUITY.md](ROADMAP_CONTINUITY.md) en cada sesión junto con continuity.json y CONTINUITY.md. La hoja coordina P1–P5 y RUN/WAIT/REUSE/DIAGNOSE/REVIEW; no reemplaza contratos ni cambia criterios de aceptación. El siguiente objetivo válido sigue siendo el de continuity.json.

## Continuidad entre sesiones
Tras resolver la rama canónica, leer [continuity.json](continuity.json) y [CONTINUITY.md](CONTINUITY.md) antes de lanzar Actions. CURRENT_STATE y el tablero muestran solo el corte vigente; la historia anterior está archivada con enlaces en EXECUTION_LOG. No confundir un run REUSE con una ejecución de tests nueva.


## Si README de la rama predeterminada no contiene el puntero canónico
1. Consultar metadatos del repositorio y del run de Actions aportado por el usuario: obtener default_branch y head_branch reales, sin asumir que main es la rama de certificación.
2. Leer qa/certification/continuity.json en la rama candidata del run y en el producto pareado. Exigir que canonical_branch coincida con la candidata en ambos y verificar HEAD, runs recientes, protocolo y siguiente tarea. Los IDs antiguos solo permiten descubrir la rama; no acreditan el estado actual.
3. Si no hay run de referencia, enumerar ramas y buscar el índice y README de certificación. Elegir solo con evidencia bilateral consistente y vigente. Si hay varios candidatos incompatibles, continuar la inspección y aclarar la ambigüedad antes de publicar; no escoger por memoria del chat o número de revisión aislado.
4. No reiniciar desde el estado S26 histórico de main ni repetir pruebas por ausencia del puntero. No cambiar default_branch, mover referencias ni lanzar CI para descubrir dónde estamos.
5. El puntero en README predeterminado puede corregirse mediante un cambio documental acotado; mientras falte, la recuperación por Actions + índices bilaterales verificados mantiene la continuidad. Esta regla es genérica, no un snapshot de un caso o SHA.


## Excepción autorizada: certificación paralela mediante Compass

- [Excepción: certificación paralela mediante Compass Bridge](EXCEPTION_PARALLEL_CERTIFICATION_WITH_COMPASS_BRIDGE.md) — autorización acotada para continuar la certificación original mientras se certifica la conexión.

## Prioridad P0 — Conexión alternativa a GitHub

Antes de retomar la certificación general de motores matemáticos, leer y ejecutar en orden:
1. [HANDOFF_GITHUB_ALTERNATIVE_CONNECTION.md](HANDOFF_GITHUB_ALTERNATIVE_CONNECTION.md)
2. [ROADMAP_GITHUB_ALTERNATIVE_CONNECTION.md](ROADMAP_GITHUB_ALTERNATIVE_CONNECTION.md)

El Prompt maestro `CONTINUATION_PROMPT.md` impone esta prioridad. Estado vigente al 2026-10-27: Cert Runner Compass está implementado y su certificación v1.1 permanece OPEN/no certificada. Fase 1 completada (9/9, cero runs; E1/E4 simuladas). Fase 2 autorizada: primero verificar por lectura el despliegue de la corrección HTTP 204/rechazos; después B3 y secuencia B4/B5, B6, C1-C3. La persistencia de Compass está en Lovable Cloud, no en Supabase `oqlzftercvraprnvjifo`; la API Render sigue siendo read-only. Leer el corte actual en `HANDOFF_GITHUB_ALTERNATIVE_CONNECTION.md`, `ROADMAP_GITHUB_ALTERNATIVE_CONNECTION.md`, `LEDGER_GITHUB_ALTERNATIVE_CONNECTION.md` y `CURRENT_STATE.md`. No usar `GET /api/run`, que puede despachar. La auditoría D-01 de Supabase sigue siendo un trabajo separado y bloqueado.
