# Algebra229 AS-B-02 — aceptación scoped bilateral (Lite)

**Resultado: PASS_SCOPED bilateral.** Esta aceptación cubre exclusivamente AS-B-02; no certifica la matriz completa de 229 filas ni la certificación global.

## Contrato y fuente
- Fila congelada: AS-B-02, N1, `factorizar`, `x^{2}-9` → `\left(x - 3\right) \left(x + 3\right)`.
- Fuente: `qa/certification/legacy_sources/matriz_algebra_simbolica.md.gz`; SHA-256 descomprimido `8cd36ff08343f98f92abd83e2b162d565e0cbe5c59dc73f26b1c018f77d663c7`.
- Test: `tests/algebra229AsB02.audit.test.ts`, blob `38f2aed6e2830c3fb2849d5adc6f0e72109bd8a0`.
- El test coteja las seis celdas contractuales exactas y diez sustituciones enteras mediante `compileNumeric`, con esperado nativo `x*x-9`; no usa Algebrite para calcular el oráculo.

## Evidencia ejecutada sobre el SHA Lite
- SHA: `4a5bb09703c527a0ddd68a33749fc228748d2060`.
- Acumulativo [42135018417](https://github.com/c2melendez/precision-lab-lite/actions/runs/42135018417): **SUCCESS**, guard `skip=false`; test focal 2/2; 366 archivos y 2,259 passed, 8 expected fail y 34 todo.
- H1d [42135018449](https://github.com/c2melendez/precision-lab-lite/actions/runs/42135018449): **SUCCESS**, 22/22.
- Scientific UI [42135018517](https://github.com/c2melendez/precision-lab-lite/actions/runs/42135018517): **SUCCESS**, 456/456, proyectos Playwright desktop/tablet/mobile.
- Runner [42135018349](https://github.com/c2melendez/precision-lab-lite/actions/runs/42135018349): **SUCCESS**.
- CI estándar [42135018389](https://github.com/c2melendez/precision-lab-lite/actions/runs/42135018389): **FAILURE** únicamente en `QA dependency audit (hard gate)`, cuatro vulnerabilidades moderadas; artifact `13465385686`. No se alteró el umbral. Este bloqueo de seguridad queda separado de la aceptación matemática.

## Decisión
AS-B-02 queda **PASS_SCOPED para Lite** y, junto con Plus, **PASS_SCOPED bilateral**. No hubo cambio de producto.
