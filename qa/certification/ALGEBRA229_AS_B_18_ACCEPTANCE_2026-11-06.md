# Algebra229 AS-B-18 — aceptación scoped bilateral (Lite)

**Resultado: PASS_SCOPED bilateral.**

## Contrato
- AS-B-18, N2, `factorizar`, `x^{8}-1` → `\left(x - 1\right) \left(x + 1\right) \left(x^{2} + 1\right) \left(x^{4} + 1\right)`.
- Test Lite: `tests/algebra229AsB18.audit.test.ts`: fila exacta contra la matriz congelada, equivalencia con `evaluate` y oráculo entero independiente en 10 muestras.
- Test Plus (par bilateral): `backend/tests/test_algebra229_as_b18.py`.

## Evidencia Plus SHA `1fab6d5507822c922288c63ba9454f7536d3aead`
- Cumulative [42199349315] SUCCESS; focal `test_algebra229_as_b18.py` 2/2 PASSED; backend 2,800 passed, 1 skipped, 10 xfailed.
- H1d [42199349400] SUCCESS; CI [42199349335] SUCCESS; Runner [42199349956] SUCCESS.

## Evidencia Lite (par bilateral) SHA `bb159a449f2d320d607b65503310bb8741cf16b2`
- Cumulative [42199356489] SUCCESS; focal `tests/algebra229AsB18.audit.test.ts` 2/2 PASSED; 366 archivos, 2,259 tests passed.
- H1d [42199356467] SUCCESS; Scientific UI [42199356498] SUCCESS; Runner [42199356546] SUCCESS; CI [42199356505] SUCCESS.

## Nota de procedimiento
- Los tests existentes solo comprobaban la fila como texto y la equivalencia algebraica. Se reforzaron al patrón de AS-B-16/17 (`1fab6d55` en Plus, `bb159a44` en Lite).
- No hubo fase roja: el reforzado pasó con el motor sin cambios. Sin cambio de producto.

Siguiente: AS-B-19 `x^{2}y-xy^{2}` → `x y \left(x - y\right)`. Global OPEN.
