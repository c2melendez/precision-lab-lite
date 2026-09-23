# S26 — Política de integridad matemática

## Baseline protegido

SHA previo a S26: `e175f3d98e8b2eeea130faa5287e5927666befb6`

## Rutas protegidas

- `src/engine/**`
- `src/workers/compute.worker.ts`
- `src/hooks/useComputeWorker.ts`
- `src/modes/BasicScientific/latexToAlgebrite.ts`

## Regla de cambio

Durante S26 estas rutas se consideran congeladas.

Un cambio dentro de una ruta protegida solo puede hacerse si:
1. existe un defecto reproducible;
2. se documenta por qué un cambio visual no basta;
3. se agrega o actualiza un regression test;
4. se ejecutan nuevamente los gates matemáticos correspondientes;
5. el log S26 registra archivo, causa, test y resultado.

## Gate de integridad post-rediseño

Antes del cierre:
- tests unitarios completos;
- Playwright E2E;
- regresiones conocidas;
- teclado↔motor;
- recorridos funcionales por científica, gráfica, matrices, estadística y conversión;
- comparación con baseline previo cuando aplique.

## Principio de separación

Los cambios visuales deben concentrarse en componentes, estilos, layout y presentación. No se mezclará una refactorización matemática con una refactorización visual en el mismo bloque salvo defecto explícito.

## Resultado esperado

No se promete imposibilidad absoluta de regresión. La garantía operativa de S26 será:
- aislamiento de capas;
- detección de cambios sensibles;
- cobertura funcional;
- recertificación completa antes del merge final.
