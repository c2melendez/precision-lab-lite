# Algebra229 AS-B-03 — aceptación scoped bilateral (Lite)

**Resultado: PASS_SCOPED bilateral.** Esta aceptación cubre exclusivamente AS-B-03; no certifica la matriz completa de 229 filas ni la certificación global.

## Contrato y fuente
- Fila congelada: AS-B-03, N1, `factorizar`, `x^{3}-8` → `\left(x - 2\right) \left(x^{2} + 2 x + 4\right)`.
- Nota contractual: “Diferencia de cubos: factor cuadrático irreducible.”
- Fuente: `qa/certification/legacy_sources/matriz_algebra_simbolica.md.gz`; SHA-256 descomprimido `8cd36ff08343f98f92abd83e2b162d565e0cbe5c59dc73f26b1c018f77d663c7`.
- Test Lite: `tests/algebra229AsB03.audit.test.ts`, blob `e02c7c16db2b014685ab8ff28f876c70b5a8fb54`. Coteja todas las celdas, incluida la nota, y diez sustituciones enteras mediante `compileNumeric`, con aritmética JS independiente.

## Evidencia ejecutada
- SHA: `fe78fd9a1061a66f5f0a05280ed65fea13cefa30`.
- Acumulativo [42136026980](https://github.com/c2melendez/precision-lab-lite/actions/runs/42136026980): **SUCCESS**, guard `skip=false`; test focal 2/2, 366 archivos / 2,259 passed, 8 expected fail y 34 todo.
- H1d [42136027012](https://github.com/c2melendez/precision-lab-lite/actions/runs/42136027012): **SUCCESS**, 22/22.
- Scientific UI [42136027006](https://github.com/c2melendez/precision-lab-lite/actions/runs/42136027006): **SUCCESS**, 456/456, proyectos Playwright desktop/tablet/mobile.
- Runner [42136027069](https://github.com/c2melendez/precision-lab-lite/actions/runs/42136027069): **SUCCESS**.
- CI estándar [42136026913](https://github.com/c2melendez/precision-lab-lite/actions/runs/42136026913): **FAILURE** únicamente por npm audit (cuatro vulnerabilidades moderadas; artifact `13466271200`). Este bloqueo de seguridad se conserva separado.

## Decisión
AS-B-03 queda **PASS_SCOPED para Lite** y, junto con Plus, **PASS_SCOPED bilateral**. No hubo cambio de producto.
