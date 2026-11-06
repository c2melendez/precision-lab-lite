# Algebra229 AS-B-07 — aceptación scoped bilateral (Lite)

**Resultado: PASS_SCOPED bilateral.** Esta aceptación cubre exclusivamente AS-B-07; no certifica la matriz completa de 229 filas ni la certificación global.

## Contrato y fuente
- Fila congelada: AS-B-07, N2, `factorizar`, `x^{6}-1` → `\left(x - 1\right) \left(x + 1\right) \left(x^{2} - x + 1\right) \left(x^{2} + x + 1\right)`.
- Fuente: `qa/certification/legacy_sources/matriz_algebra_simbolica.md.gz`; SHA-256 descomprimido `8cd36ff08343f98f92abd83e2b162d565e0cbe5c59dc73f26b1c018f77d663c7`.
- Test: `tests/algebra229AsB07.audit.test.ts`, blob `338fe82092fc501fb970b9c5e0c09603d4517dfb`.
- El test coteja las siete celdas de contrato, exige la forma exacta `(x-1)*(x+1)*(x^2-x+1)*(x^2+x+1)`, cuatro factores (dos lineales y dos cuadráticos irreducibles) y valida diez sustituciones enteras con `compileNumeric` y el esperado nativo `x**6-1`, sin usar Algebrite como oráculo numérico.

## Evidencia ejecutada sobre el SHA Lite
- SHA: `63fbef834a1fdd7bf0c969c4a8ae0f41a84060be`.
- Acumulativo [42145939069](https://github.com/c2melendez/precision-lab-lite/actions/runs/42145939069): **SUCCESS**, guard `skip=false`; test focal 2/2; 366 archivos, 2,259 passed, 8 expected fail y 34 todo.
- H1d [42145939097](https://github.com/c2melendez/precision-lab-lite/actions/runs/42145939097): **SUCCESS**, 22/22.
- Scientific UI [42145939299](https://github.com/c2melendez/precision-lab-lite/actions/runs/42145939299): **SUCCESS**, 456/456, desktop/tablet/mobile.
- Runner [42145939287](https://github.com/c2melendez/precision-lab-lite/actions/runs/42145939287): **SUCCESS**.
- CI estándar [42145939134](https://github.com/c2melendez/precision-lab-lite/actions/runs/42145939134): **FAILURE** únicamente en npm audit, cuatro vulnerabilidades moderadas; artifact `13470057091`. Gate de seguridad intacto y separado de la aceptación matemática.

## Decisión
AS-B-07 queda **PASS_SCOPED para Lite** y, junto con Plus, **PASS_SCOPED bilateral**. No hubo cambio de producto.
