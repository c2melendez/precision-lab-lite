# Algebra229 AS-B-19 — aceptación scoped bilateral (Lite)

**Resultado: PASS_SCOPED bilateral.**

## Contrato
- AS-B-19, N2, `factorizar`, `x^{2}y-xy^{2}` → `x y \left(x - y\right)`.
- Test Lite: `tests/algebra229AsB19.audit.test.ts`: fila exacta contra la matriz congelada (siete celdas), factorización verificada por aritmética entera independiente en 10 pares `(x, y)`.
- Test Plus (par bilateral): `backend/tests/test_algebra229_as_b19.py`.

## Evidencia Lite SHA `7cec57d31bdc78ce5ba0d48c1f7a6f42d7608977`
- Cumulative [42202183460] SUCCESS; focal `tests/algebra229AsB19.audit.test.ts` 2/2 PASSED; 366 archivos, 2,259 tests passed.
- H1d [42202183400] SUCCESS; Scientific UI [42202183396] SUCCESS; Runner [42202183405] SUCCESS; CI [42202183478] SUCCESS.

## Evidencia Plus (par bilateral) SHA `f5109b537005943738ad9797908bef340d23a5b6`
- Cumulative [42202185841] SUCCESS; focal `test_algebra229_as_b19.py` 2/2 PASSED; backend 2,800 passed, 1 skipped, 10 xfailed.
- H1d [42202185915] SUCCESS; CI [42202185876] SUCCESS; Runner [42202185863] SUCCESS.

## Nota de procedimiento
- Los tests previos comprobaban la fila como texto y la equivalencia algebraica, pero no las siete celdas exactas ni evaluaban pares `(x, y)`. Se reforzaron al patrón de AS-B-16/17/18.
- No hubo fase roja: el reforzado pasó con el motor sin cambios. Sin cambio de producto.

Siguiente: AS-B-20 `x^{4}+x^{2}y^{2}+y^{4}` → `(x^2 - x y + y^2)(x^2 + x y + y^2)`. Global OPEN.
