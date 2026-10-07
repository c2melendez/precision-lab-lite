# Precision Lab — Certification System

Este directorio es la fuente canónica de continuidad del sistema de certificación.

## Regla de autoridad
A partir de esta migración, las instrucciones operativas, el estado actual, las excepciones y el siguiente paso viven versionados en el repositorio. Un prompt externo NO debe duplicar ni sustituir esta información.

## Orden de lectura obligatorio para cualquier LLM
1. `qa/certification/README.md`
2. `qa/certification/CURRENT_STATE.md`
3. `qa/certification/EXECUTION_PROTOCOL.md`
4. `qa/certification/MANUAL_CAPABILITY_GAPS.md`
5. El spec/test indicado en CURRENT_STATE.
6. Los logs de GitHub Actions de la última corrida indicada en CURRENT_STATE.

## Repositorios coordinados
- Lite: c2melendez/precision-lab-lite
- Plus: c2melendez/precision-lab-plus
- Rama activa: `qa/syntax-audit-in625-a1`

## Principio de continuidad
No reconstruir el contexto desde el chat. Leer estos archivos y continuar desde el "Siguiente paso exacto" de CURRENT_STATE.
