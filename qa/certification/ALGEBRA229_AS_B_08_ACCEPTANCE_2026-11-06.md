# Algebra229 AS-B-08 — aceptación scoped bilateral (Lite)

**Resultado: PASS_SCOPED bilateral.** Esta aceptación cubre exclusivamente AS-B-08; no certifica la matriz completa de 229 filas ni la certificación global.

## Contrato y fuente
- Fila congelada: AS-B-08, N2, `factorizar`, `x^{4}-5x^{2}+4` → `\left(x - 2\right) \left(x - 1\right) \left(x + 1\right) \left(x + 2\right)`.
- Fuente: `qa/certification/legacy_sources/matriz_algebra_simbolica.md.gz`; SHA-256 descomprimido `8cd36ff08343f98f92abd83e2b162d565e0cbe5c59dc73f26b1c018f77d663c7`.
- Test: `tests/algebra229AsB08.audit.test.ts`, blob `a883794a96ad74ffd6ca2fe99cacaed6bb60717f`.
- El test coteja las siete celdas de contrato, exige la forma exacta `(x-2)*(x-1)*(x+1)*(x+2)`, cuatro factores lineales y valida diez sustituciones enteras con `compileNumeric` y el esperado nativo `x**4-5*x**2+4`, sin usar Algebrite como oráculo numérico.

## Evidencia ejecutada sobre el SHA Lite
- SHA: `8cb03f920fab0d5e5b665eeef1fefb6807131529`.
- Acumulativo [42147149489](https://github.com/c2melendez/precision-lab-lite/actions/runs/42147149489): **SUCCESS**, guard `skip=false`; test focal 2/2; 366 archivos, 2,259 passed, 8 expected fail y 34 todo.
- H1d [42147149472](https://github.com/c2melendez/precision-lab-lite/actions/runs/42147149472): **SUCCESS**, 22/22.
- Scientific UI [42147149512](https://github.com/c2melendez/precision-lab-lite/actions/runs/42147149512): **SUCCESS**, 456/456, desktop/tablet/mobile.
- Runner [42147149478](https://github.com/c2melendez/precision-lab-lite/actions/runs/42147149478): **SUCCESS**.
- CI estándar [42147149533](https://github.com/c2melendez/precision-lab-lite/actions/runs/42147149533): **FAILURE** únicamente en npm audit, cuatro vulnerabilidades moderadas; artifact `13470881892`. Gate de seguridad intacto y separado de la aceptación matemática.

## Decisión
AS-B-08 queda **PASS_SCOPED para Lite** y, junto con Plus, **PASS_SCOPED bilateral**. No hubo cambio de producto.
