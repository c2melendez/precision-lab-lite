# Algebra229 AS-B-20 — aceptación scoped bilateral (Lite)

**Resultado: PASS_SCOPED bilateral.**

## Contrato
- AS-B-20, N3, `factorizar`, `x^{4}+x^{2}y^{2}+y^{4}` → `\left(x^{2} - x y + y^{2}\right) \left(x^{2} + x y + y^{2}\right)`.
- Test Lite: `tests/algebra229AsB20.audit.test.ts`: fila exacta contra la matriz congelada (siete celdas), factorización en dos cuadráticos verificada por aritmética entera independiente en 10 pares `(x, y)`, y guarda de forma (la regla cuártica no se aplica a `x^4+x^2y^2+y^5`).
- Test Plus (par bilateral): `backend/tests/test_algebra229_as_b20.py`.

## Evidencia Lite SHA `b92f75b9121462bb4e720f554a6b440ea5fef64b`
- Cumulative [42206950541] SUCCESS; focal `tests/algebra229AsB20.audit.test.ts` 3/3 PASSED; 366 archivos, 2,259 tests passed.
- H1d [42206950644] SUCCESS; Scientific UI [42206950607] SUCCESS; Runner [42206950545] SUCCESS; CI [42206950542] SUCCESS.

## Evidencia Plus (par bilateral) SHA `fecbf483992095a937f680a1ddab8807b065f166`
- Cumulative [42206944853] SUCCESS; focal `test_algebra229_as_b20.py` 2/2 PASSED; backend 2,800 passed, 1 skipped, 10 xfailed.
- H1d [42206944896] SUCCESS; CI [42206944888] SUCCESS; Runner [42206944815] SUCCESS.

## Nota de procedimiento
- Los tests previos comprobaban la fila como texto y la equivalencia algebraica, pero no las siete celdas exactas ni evaluaban pares `(x, y)`. Se reforzaron al patrón de AS-B-16..19.
- No hubo fase roja: el reforzado pasó con el motor sin cambios. Sin cambio de producto.

Siguiente: AS-B-21 `(x^{2}+1)^{2}-4x^{2}` → `(x - 1)^{2} (x + 1)^{2}`. Global OPEN.
