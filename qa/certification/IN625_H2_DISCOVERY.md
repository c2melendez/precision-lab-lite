# IN625 H2 — Discovery / provenance gate

Fecha: 2026-10-09. Alcance: Lite + Plus. Rama: `qa/syntax-audit-in625-a1`.

## Estado
**DISCOVERY — matriz original no localizada.** Este archivo no sustituye la matriz canónica de entrada ni autoriza inventar EN-H2, rangos o resultados.

## Evidencia consultada
- `qa/certification/EXECUTION_PROTOCOL.md`: IN625 progresa H1 → H2 → Syntax 309.
- `qa/certification/IN625_H1_MATRIX.md`: define exclusivamente H1 (EN-RE-01..30) y remite a `matriz_entrada_sintaxis_calculadora`, Parte H.1.
- Listados de `qa/certification/` en ambas ramas activas: README, CURRENT_STATE, EXECUTION_PROTOCOL, EXECUTION_LOG, CONTINUATION_PROMPT, MANUAL_CAPABILITY_GAPS, IN625_H1_MATRIX. No existe `IN625_H2_MATRIX.md` en las rutas verificadas.
- Directorio de tests Lite examinado por nombres: numerosos casos IN625 A..G, sin un artefacto `H2` identificado. La ausencia en este directorio no demuestra ausencia en todos los subárboles.
- GitHub code search sobre rama default para `H2`, `Parte H.2` y `matriz_entrada_sintaxis_calculadora` no aportó resultados; la búsqueda no garantiza cobertura de la rama QA.

## Criterio de entrada a ejecución
1. Recuperar la fuente original Parte H.2, su enumeración exacta, entradas, resultados esperados y categoría de cada caso.
2. Versionar la matriz H2 sin reescribir sus criterios, con procedencia identificable.
3. Localizar o implementar un harness verificable en Lite y Plus, distinguir pruebas de producto de oráculos/harness y manual/capability.
4. Ejecutar H2 y gates acumulativos, verificar run IDs, SHA, logs, y documentar PASS/FAIL/GAP; conservar evidencia de los gates verdes anteriores.

## No hacer
- No fabricar IDs de prueba, escenarios o PASS para H2.
- No declarar IN625 completo basándose únicamente en el éxito de H1.

## Baseline acreditada antes de H2
- Lite gate 37926844320 SUCCESS (1014 PASS, 0 FAIL, 30 TODO), H1d 37926844177 SUCCESS.
- Plus gate 37909986582 SUCCESS, H1d 37909986581 SUCCESS.
- H1d clasificado 5 PASS automatizados (EN-RE-24..28) + 2 GAP (EN-RE-29/30); EN-RE-22 es GAP histórico H1c.
