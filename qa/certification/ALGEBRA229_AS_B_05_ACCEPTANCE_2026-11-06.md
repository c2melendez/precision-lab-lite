# Algebra229 AS-B-05 — aceptación scoped bilateral (Lite)

**Resultado: PASS_SCOPED bilateral.** Esta aceptación cubre exclusivamente AS-B-05; no certifica la matriz completa de 229 filas ni la certificación global.

## Contrato y fuente
- Fila congelada: AS-B-05, N2, `factorizar`, `x^{4}-1` → `\left(x - 1\right) \left(x + 1\right) \left(x^{2} + 1\right)`. Nota de fuente: `Sobre ℚ: (x-1)(x+1)(x^{2}+1)`.
- Fuente: `qa/certification/legacy_sources/matriz_algebra_simbolica.md.gz`; SHA-256 descomprimido `8cd36ff08343f98f92abd83e2b162d565e0cbe5c59dc73f26b1c018f77d663c7`.
- Test: `tests/algebra229AsB05.audit.test.ts`, blob `742800652765164b791d0a20c34a4450d79ea3d4`.
- El test coteja las siete celdas de contrato, exige los tres factores `(x-1)(x+1)(x^2+1)`, dos lineales y un cuadrático irreducible, y valida diez sustituciones enteras con `compileNumeric` y el esperado nativo `x*x*x*x-1`, sin usar Algebrite como oráculo numérico.

## Evidencia ejecutada sobre el SHA Lite
- SHA: `9a4352732241a6d97c2a21686b4618cb069d8144`.
- Acumulativo [42143597700](https://github.com/c2melendez/precision-lab-lite/actions/runs/42143597700): **SUCCESS**, guard `skip=false`; test focal `tests/algebra229AsB05.audit.test.ts` 2/2; 366 archivos, 2,259 passed, 8 expected fail y 34 todo.
- H1d [42143597591](https://github.com/c2melendez/precision-lab-lite/actions/runs/42143597591): **SUCCESS**, 22/22.
- Scientific UI [42143597597](https://github.com/c2melendez/precision-lab-lite/actions/runs/42143597597): **SUCCESS**, 456/456, desktop/tablet/mobile.
- Runner [42143597781](https://github.com/c2melendez/precision-lab-lite/actions/runs/42143597781): **SUCCESS**.
- CI estándar [42143597848](https://github.com/c2melendez/precision-lab-lite/actions/runs/42143597848): **FAILURE** únicamente en npm audit, cuatro vulnerabilidades moderadas; artifact `13468508244`. El gate de seguridad no se relajó y queda separado de la aceptación matemática.

## Decisión
AS-B-05 queda **PASS_SCOPED para Lite** y, junto con Plus, **PASS_SCOPED bilateral**. No hubo cambio de producto.
