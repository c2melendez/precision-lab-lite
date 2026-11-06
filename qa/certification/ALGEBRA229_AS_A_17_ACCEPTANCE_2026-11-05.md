# Algebra229 AS-A-17 — aceptación scoped bilateral

**Resultado: PASS_SCOPED bilateral.** Esta aceptación cubre solo AS-A-17; no certifica el cierre de las 229 filas ni la certificación global.

## Contrato y fuente
- Entrada: `(2x-y)^5`.
- Salida contractual: `32x^5 - 80x^4y + 80x^3y^2 - 40x^2y^3 + 10xy^4 - y^5`.
- Fixture congelado: `qa/certification/legacy_sources/matriz_algebra_simbolica.md.gz`; SHA-256 del contenido descomprimido `8cd36ff08343f98f92abd83e2b162d565e0cbe5c59dc73f26b1c018f77d663c7`.
- Test Lite: `tests/algebra229AsA17.audit.test.ts`, blob `39b34eed4107e88a520a154cc2a4d4867d38dc85`; coteja las celdas de contrato y siete pares enteros con coeficientes nativos independientes.

## Evidencia ejecutada
- Lite SHA: `b37502c5713bddabae6a022e6e1cb788ee72a87d`.
- Acumulativo [42039943541](https://github.com/c2melendez/precision-lab-lite/actions/runs/42039943541): **SUCCESS**, guard `skip=false`, 2 focales PASSED y 2,259 tests passed.
- H1d [42039943721](https://github.com/c2melendez/precision-lab-lite/actions/runs/42039943721): **SUCCESS**, 22/22.
- Scientific UI [42039943566](https://github.com/c2melendez/precision-lab-lite/actions/runs/42039943566): **SUCCESS**, 456/456.
- CI estándar [42039944052](https://github.com/c2melendez/precision-lab-lite/actions/runs/42039944052): **FAILURE** únicamente en `QA dependency audit (hard gate)`, cuatro vulnerabilidades moderadas. El job termina en la auditoría antes de typecheck/unit/build; no se relaja ni se cuenta como PASS.
- Runner [42039943836](https://github.com/c2melendez/precision-lab-lite/actions/runs/42039943836): job `certification-cycle` **SUCCESS**.

## Alcance y decisión
Los gates matemáticos y UI de Lite aprobaron la fila; la auditoría de dependencias es un bloqueo de seguridad independiente y permanece abierto. No se modificó código de producto. La aceptación es scoped a AS-A-17.
