# Algebra229 AS-B-09 — aceptación scoped bilateral (Lite)

**Resultado: PASS_SCOPED bilateral.** Esta aceptación cubre exclusivamente AS-B-09; no certifica la matriz completa de 229 filas ni la certificación global.

## Contrato y fuente
- Fila congelada: AS-B-09, N2, `factorizar`, `6x^{2}+5x-4` → `\left(2 x - 1\right) \left(3 x + 4\right)`.
- Fuente: `qa/certification/legacy_sources/matriz_algebra_simbolica.md.gz`; SHA-256 descomprimido `8cd36ff08343f98f92abd83e2b162d565e0cbe5c59dc73f26b1c018f77d663c7`.
- Test: `tests/algebra229AsB09.audit.test.ts`, blob `c682435ca383d7df6ce40ad8831160fe0cca7a24`.
- El test coteja las siete celdas de contrato, exige la forma exacta `(2*x-1)*(3*x+4)`, dos factores lineales de coeficientes enteros y valida diez sustituciones enteras con `compileNumeric` y el esperado nativo `6*x**2+5*x-4`, sin usar Algebrite como oráculo numérico.

## Evidencia ejecutada sobre el SHA Lite
- SHA: `e08f0710e39a62bd95dc2edb2856469ac62365c4`.
- Acumulativo [42148191887](https://github.com/c2melendez/precision-lab-lite/actions/runs/42148191887): **SUCCESS**, guard `skip=false`; 366 archivos, 2,259 passed, 8 expected fail y 34 todo.
- H1d [42148191829](https://github.com/c2melendez/precision-lab-lite/actions/runs/42148191829): **SUCCESS**, 22/22.
- Scientific UI [42148191724](https://github.com/c2melendez/precision-lab-lite/actions/runs/42148191724): **SUCCESS**, 456/456, desktop/tablet/mobile.
- Runner [42148191919](https://github.com/c2melendez/precision-lab-lite/actions/runs/42148191919): **SUCCESS**.
- CI estándar [42148191791](https://github.com/c2melendez/precision-lab-lite/actions/runs/42148191791): **FAILURE** únicamente en npm audit, cuatro vulnerabilidades moderadas. Gate de seguridad intacto y separado de la aceptación matemática.

## Decisión
AS-B-09 queda **PASS_SCOPED para Lite** y, junto con Plus, **PASS_SCOPED bilateral**. No hubo cambio de producto.
