# Algebra229 AS-B-21 — aceptación scoped bilateral (Lite)

**Resultado: PASS_SCOPED bilateral.**

## Contrato
- AS-B-21, N3, `factorizar`, `\left(x^{2}+1\right)^{2}-4x^{2}` → `\left(x - 1\right)^{2} \left(x + 1\right)^{2}`.
- Test Lite: `tests/algebra229AsB21.audit.test.ts` (3 tests): fila exacta contra la matriz congelada (siete celdas), factorización verificada por aritmética entera independiente en 10 muestras, y guarda para `x^2+1`.
- Test Plus (par bilateral): `backend/tests/test_algebra229_as_b21.py`.

## Evidencia Lite SHA `4ab22e5565255bc0d0a451dfae3debf24f8521fa`
- Cumulative [42209065420] SUCCESS; focal `tests/algebra229AsB21.audit.test.ts` 3/3 PASSED; 366 archivos, 2,259 tests passed.
- H1d [42209065464] SUCCESS; Scientific UI [42209065501] SUCCESS; Runner [42209065402] SUCCESS; CI [42209065433] SUCCESS.

## Evidencia Plus (par bilateral) SHA `768c7539650c91ffb1f51e85ff292aabd8e9a6a6`
- Cumulative [42209061963] SUCCESS; focal `test_algebra229_as_b21.py` 2/2 PASSED; backend 2,800 passed, 1 skipped, 10 xfailed.
- H1d [42209061958] SUCCESS; CI [42209062038] SUCCESS; Runner [42209061955] SUCCESS.

## Nota de procedimiento
- Los tests previos comprobaban la factorización, pero no las siete celdas exactas de la fila ni un oráculo entero independiente. Se reforzaron al patrón de AS-B-16..20.
- No hubo fase roja: el reforzado pasó con el motor sin cambios. Sin cambio de producto.

Siguiente: AS-B-22 `x^{2}+1` → `x^{2} + 1` (N1, irreducible sobre ℚ y ℝ: debe quedar igual). Global **OPEN**.
