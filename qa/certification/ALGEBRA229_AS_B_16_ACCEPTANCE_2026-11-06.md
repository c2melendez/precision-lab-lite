# Algebra229 AS-B-16 — aceptación scoped bilateral (Lite)

**Resultado: PASS_SCOPED bilateral.**

## Contrato
- AS-B-16, N2, `factorizar`, `a^{3}-b^{3}` → `\left(a - b\right) \left(a^{2} + a b + b^{2}\right)`.
- Test Lite: `tests/algebra229AsB16.audit.test.ts`. Test Plus: `backend/tests/test_algebra229_as_b16.py`.

## Evidencia Lite SHA `e2007be51f848a33e0b9881dff3c6a2689991672`
- Cumulative [42194172938] SUCCESS; focal `tests/algebra229AsB16.audit.test.ts` 2/2 PASS (366 archivos).
- H1d [42194172980] SUCCESS; Scientific UI [42194172930] SUCCESS; Runner [42194172934] SUCCESS; CI [42194172999] SUCCESS.

## Evidencia Plus SHA `481cb08d99d95124d4e8528162fe787d89206244`
- Cumulative [42159166321] SUCCESS; focal `test_algebra229_as_b16.py` 2/2 PASS (2800 backend passed).
- H1d [42159166336] SUCCESS; CI [42159166327] SUCCESS; Runner [42159166344] SUCCESS.

## Nota de procedimiento
- No se observó fase roja: el test reforzado ya pasaba en HEAD, con el motor sin cambios. Se conserva como regresión permanente.
- Sin cambio de producto.

Siguiente: AS-B-17 `a^{3}+b^{3}`. Global OPEN.
