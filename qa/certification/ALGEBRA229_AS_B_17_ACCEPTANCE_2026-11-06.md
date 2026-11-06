# Algebra229 AS-B-17 — aceptación scoped bilateral (Lite)

**Resultado: PASS_SCOPED bilateral.**

## Contrato
- AS-B-17, N2, `factorizar`, `a^{3}+b^{3}` → `\left(a + b\right) \left(a^{2} - a b + b^{2}\right)`.
- Test Lite: `tests/algebra229AsB17.audit.test.ts`: fila exacta contra la matriz congelada, motor `factor` de Lite, equivalencia con `evaluate` y oráculo entero independiente en 10 muestras.
- Test Plus (par bilateral): `backend/tests/test_algebra229_as_b17.py`.

## Evidencia Plus SHA `5d3df39fbfb19bc209b47f5f5bedb02a7212c19a`
- Cumulative [42197922106] SUCCESS; focal `test_algebra229_as_b17.py` 2/2 PASSED; backend 2,800 passed, 1 skipped, 10 xfailed.
- H1d [42197922135] SUCCESS; CI [42197922387] SUCCESS; Runner [42197922120] SUCCESS.

## Evidencia Lite (par bilateral) SHA `47b381c81f899dd9f5e3a073b4de6cd726ccda1c`
- Cumulative [42197934523] SUCCESS; focal `tests/algebra229AsB17.audit.test.ts` 2/2 PASSED; 366 archivos, 2,259 tests passed.
- H1d [42197934472] SUCCESS; Scientific UI [42197934467] SUCCESS; Runner [42197934461] SUCCESS; CI [42197934400] SUCCESS.

## Nota de procedimiento
- Los tests existentes eran más débiles que el estándar de AS-B-16: no comprobaban la fila exacta ni tenían oráculo entero independiente. Se reforzaron al mismo patrón (`5d3df39f` en Plus, `47b381c8` en Lite).
- No hubo fase roja: el reforzado pasó con el motor sin cambios. Sin cambio de producto.

Siguiente: AS-B-18 `x^{8}-1` → `\left(x - 1\right) \left(x + 1\right) \left(x^{2} + 1\right) \left(x^{4} + 1\right)`. Global OPEN.
