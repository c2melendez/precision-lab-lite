# Algebra229 AS-B-06 — aceptación scoped bilateral (Lite)

**Resultado: PASS_SCOPED bilateral.** Esta aceptación cubre exclusivamente AS-B-06; no certifica la matriz completa de 229 filas ni la certificación global.

## Contrato y fuente
- Fila congelada: AS-B-06, N3, `factorizar`, `x^{4}+4` → `\left(x^{2} - 2 x + 2\right) \left(x^{2} + 2 x + 2\right)`. Nota: identidad de Sophie Germain.
- Fuente: `qa/certification/legacy_sources/matriz_algebra_simbolica.md.gz`; SHA-256 descomprimido `8cd36ff08343f98f92abd83e2b162d565e0cbe5c59dc73f26b1c018f77d663c7`.
- Test: `tests/algebra229AsB06.audit.test.ts`, blob `27babf708372588a4fb57135d9c513198c2108de`.
- El test coteja las siete celdas de contrato, exige la forma exacta `(x^2-2*x+2)*(x^2+2*x+2)` y valida diez sustituciones enteras con `compileNumeric` y el esperado nativo `x*x*x*x+4`, sin usar Algebrite como oráculo numérico.

## Evidencia ejecutada sobre el SHA Lite
- SHA: `8c27e459a45e30c10f1e944582f2c25d7874d0f1`.
- Acumulativo [42144769755](https://github.com/c2melendez/precision-lab-lite/actions/runs/42144769755): **SUCCESS**, guard `skip=false`; test focal 2/2; 366 archivos, 2,259 passed, 8 expected fail y 34 todo.
- H1d [42144769861](https://github.com/c2melendez/precision-lab-lite/actions/runs/42144769861): **SUCCESS**, 22/22.
- Scientific UI [42144769670](https://github.com/c2melendez/precision-lab-lite/actions/runs/42144769670): **SUCCESS**, 456/456, desktop/tablet/mobile.
- Runner [42144769740](https://github.com/c2melendez/precision-lab-lite/actions/runs/42144769740): **SUCCESS**.
- CI estándar [42144769724](https://github.com/c2melendez/precision-lab-lite/actions/runs/42144769724): **FAILURE** únicamente en npm audit, cuatro vulnerabilidades moderadas. Gate de seguridad intacto y separado de la aceptación matemática.

## Decisión
AS-B-06 queda **PASS_SCOPED para Lite** y, junto con Plus, **PASS_SCOPED bilateral**. No hubo cambio de producto.
