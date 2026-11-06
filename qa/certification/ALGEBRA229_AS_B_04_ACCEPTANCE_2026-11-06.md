# Algebra229 AS-B-04 — aceptación scoped bilateral (Lite)

**Resultado: PASS_SCOPED bilateral.** Esta aceptación cubre exclusivamente AS-B-04; no certifica la matriz completa de 229 filas ni la certificación global.

## Contrato y fuente
- Fila congelada: AS-B-04, N1, `factorizar`, `x^{3}+27` → `\left(x + 3\right) \left(x^{2} - 3 x + 9\right)`.
- Fuente: `qa/certification/legacy_sources/matriz_algebra_simbolica.md.gz`; SHA-256 descomprimido `8cd36ff08343f98f92abd83e2b162d565e0cbe5c59dc73f26b1c018f77d663c7`.
- Test: `tests/algebra229AsB04.audit.test.ts`, blob `be56ddb3ecd74ced31d237cd854fb81bfabd2e4a`.
- El test coteja las seis celdas de contrato y diez sustituciones enteras con `compileNumeric` y el esperado nativo `x*x*x+27`, sin usar Algebrite como oráculo numérico.

## Evidencia ejecutada sobre el SHA Lite
- SHA: `8229e0961b4bae6d0f7dbd07d3521939a76bf508`.
- Acumulativo [42137517887](https://github.com/c2melendez/precision-lab-lite/actions/runs/42137517887): **SUCCESS**, guard `skip=false`; test focal 2/2; 366 archivos, 2,259 passed, 8 expected fail y 34 todo.
- H1d [42137518068](https://github.com/c2melendez/precision-lab-lite/actions/runs/42137518068): **SUCCESS**, 22/22.
- Scientific UI [42137517759](https://github.com/c2melendez/precision-lab-lite/actions/runs/42137517759): **SUCCESS**, 456/456, desktop/tablet/mobile.
- Runner [42137517842](https://github.com/c2melendez/precision-lab-lite/actions/runs/42137517842): **SUCCESS**.
- CI estándar [42137518118](https://github.com/c2melendez/precision-lab-lite/actions/runs/42137518118): **FAILURE** únicamente en npm audit, cuatro vulnerabilidades moderadas; artifact `13465288525`. El gate de seguridad no se relajó y queda separado de la aceptación matemática.

## Decisión
AS-B-04 queda **PASS_SCOPED para Lite** y, junto con Plus, **PASS_SCOPED bilateral**. No hubo cambio de producto.
