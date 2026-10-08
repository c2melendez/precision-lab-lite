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
