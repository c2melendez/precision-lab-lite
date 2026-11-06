# Algebra229 AS-B-11 — aceptación scoped bilateral (Lite)

**Resultado: PASS_SCOPED bilateral.** Esta aceptación cubre exclusivamente AS-B-11; no certifica la matriz completa de 229 filas ni la certificación global.

## Contrato y fuente
- Fila congelada: AS-B-11, N2, `factorizar`, `ax+ay+bx+by` → `\left(a + b\right) \left(x + y\right)`.
- Fuente: `qa/certification/legacy_sources/matriz_algebra_simbolica.md.gz`.
- Test: `tests/algebra229AsB11.audit.test.ts`, blob `12bcd4c874b31927f4d3bc9fd4123aecb6af5adb`.
- El test coteja las siete celdas de contrato, exige forma `(a+b)*(x+y)` (variantes conmutativas), verifica identidad algebraica y valida diez sustituciones multi-variable independientes con `compileNumeric`, sin usar Algebrite como oráculo numérico.

## Evidencia ejecutada sobre el SHA Lite
- SHA: `b99a50dda74a2d6882947bd00c4194b8d18e7689`.
- Acumulativo [42153075457](https://github.com/c2melendez/precision-lab-lite/actions/runs/42153075457): **SUCCESS**.
- H1d [42153075474](https://github.com/c2melendez/precision-lab-lite/actions/runs/42153075474): **SUCCESS**.
- Scientific UI [42153075443](https://github.com/c2melendez/precision-lab-lite/actions/runs/42153075443): **SUCCESS**.
- Runner [42153075527](https://github.com/c2melendez/precision-lab-lite/actions/runs/42153075527): **SUCCESS**.
- CI estándar [42153075483](https://github.com/c2melendez/precision-lab-lite/actions/runs/42153075483): **FAILURE** únicamente en npm audit.

## Decisión
AS-B-11 queda **PASS_SCOPED para Lite** y, junto con Plus, **PASS_SCOPED bilateral**. No hubo cambio de producto.
