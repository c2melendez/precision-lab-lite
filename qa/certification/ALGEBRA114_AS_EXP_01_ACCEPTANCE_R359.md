# Algebra 114 — aceptación acotada AS-EXP-01 (r359)

**Estado: PASS_SCOPED — Lite únicamente.** No es aceptación de toda la sección EXP ni de Algebra114 completa.

## Fuente y caso

- Fuente normativa: qa/certification/algebra114_source.md.
- Fila AS-EXP-01, nivel N1.
- Ejercicio original: (x+1)(x-1).
- Resultado esperado: x^2-1.
- Test: tests/algebra114AsExp01.audit.test.ts, blob SHA 373593e7216e1d3e710963bb7431cc96a208eca9.
- SHA técnico exacto: a48496d5da441589c3ca5e231761654dc5566b6b.

## Método y oráculo

1. Se comprueba que la fila exacta permanece en el fixture original.
2. El producto se expande y se verifica la forma simbólica normalizada exacta x^2-1.
3. Se evalúan cinco sustituciones x = -3, -1, 0, 1, 4.
4. El resultado esperado se calcula con aritmética JavaScript independiente: x*x - 1. Algebrite participa en la expansión/evaluación del producto, pero no calcula el esperado numérico.
5. Comparación numérica con precisión de nueve decimales.

Los cinco valores esperados son 8, 0, -1, 0 y 15 respectivamente.

## Gates verificados en el SHA exacto

- CI [41137239350](https://github.com/c2melendez/precision-lab-lite/actions/runs/41137239350): SUCCESS. Job frontend; auditoría de dependencias, typecheck, unit/parity y producción build SUCCESS.
- Cumulative [41137239432](https://github.com/c2melendez/precision-lab-lite/actions/runs/41137239432): SUCCESS; 366 archivos, 2,259 pruebas aprobadas, 8 expected fail y 34 todo. El log incluye explícitamente el test focalizado con 1 test aprobado.
- H1d [41137239316](https://github.com/c2melendez/precision-lab-lite/actions/runs/41137239316): SUCCESS; 22 E2E passed.
- Runner [41137239337](https://github.com/c2melendez/precision-lab-lite/actions/runs/41137239337): SUCCESS; dispatch y persistencia omitidos conforme a la política. No acredita despacho real.

Los cuatro workflows corresponden al SHA técnico exacto indicado arriba.

## Decisión y límites

- AS-EXP-01: PASS_SCOPED en Lite.
- No se acepta AS-EXP-02 ni las demás filas EXP por extrapolación.
- Plus no ejecutó esta fila; no hay paridad bilateral.
- H2/EN-SG permanece PARTIAL y la certificación global permanece OPEN.
