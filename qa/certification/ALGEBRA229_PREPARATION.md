# Algebra 229 — preparación de matriz y trazabilidad

Estado: **PREPARATORY / SOURCE_NOT_LOCATED** (2026-10-20). Certificación global **OPEN**.

## Autoridad y límites

El protocolo `qa/certification/EXECUTION_PROTOCOL.md` ordena Syntax 309 → Algebra 114 → **Algebra 229** → Trigonometría → … Algebra 114 (114 filas AS-* en `algebra114_source.md`) quedó en recorrido completo con certificación **parcial** bilateral (secciones L/M y gaps de motor documentados). Esta preparación es Frente B independiente; no cierra Algebra114 global ni inventa filas 229.

## Inventario observado (rama canónica `qa/syntax-audit-in625-a1`, 2026-10-20)

Búsquedas de código y listado de `qa/certification/` en Lite y Plus:

| Señal buscada | Resultado |
|---|---|
| `algebra229_source.md`, `Algebra229`, `ALGEBRA229` | **No encontrado** |
| IDs tipo `A229-*` / matriz 229 filas | **No encontrado** |
| Referencias numéricas “229” en certificación | Solo conteos de tests/CI ajenos |
| Module 2 algebra tests | Presentes en ambos productos; **no son** la matriz 229 |

**Resultado: SOURCE_NOT_LOCATED** dentro de los repositorios. No prueba inexistencia fuera de GitHub (documento de usuario, issue, adjunto).

## Qué no hacer

- No fabricar 229 filas a partir de Algebra114, Module 2 o capacidades del motor.
- No declarar porcentaje de cobertura Algebra229.
- No despachar CI solo por esta documentación.
- No relajar oráculos de Algebra114 gaps (`it.fails`/`it.todo`/`xfail`) para “cerrar” la matriz anterior.

## Próximo objetivo exacto

1. **Localizar la fuente normativa** de Algebra 229: ruta externa o interna, versión, conteo de filas, esquema de IDs, columnas (ejercicio + resultado esperado + dominio/convenciones).
2. Versionar el fixture verbatim en `qa/certification/` (ambos repos) solo cuando la fuente sea verificable.
3. Añadir validador de integridad de fixture (conteo + IDs únicos) antes del primer caso test-first.
4. Elegir el **primer caso** con oráculo explícito; test-first bilateral; gates exact-SHA.

Hasta entonces: `next_action = ALGEBRA229-SOURCE-LOCATE` (bloqueado en ausencia de fuente). Conservar bloqueos SY-P-23, SY-X-04/14 Plus, S25, S19, H2/SG28/DIST; global OPEN.

## Algebra114 — recordatorio de cierre parcial (contexto)

AS-CONV y AS-LIM cerrados 2026-10-20 como PARTIAL_BILATERAL; ver `CURRENT_STATE.md` cabecera. Gaps Lite AS-LIM-02/05/06 y AS-CONV-05..08 permanecen registrados y no cuentan como PASS.
