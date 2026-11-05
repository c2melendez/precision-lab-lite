# Algebra229 AS-A-15 — aceptación bilateral (Lite)

**Resultado: PASS_SCOPED bilateral.** Este registro certifica únicamente AS-A-15; no certifica el cierre de las 229 filas ni la certificación global.

## Contrato y oráculo
- Caso: `(x+1/x)^3 = x^3 + 3x + 3/x + 1/x^3`, con dominio explícito `x != 0`.
- Fuente normativa: `legacy_sources/matriz_algebra_simbolica.md.gz`, SHA-256 descomprimido `8cd36ff08343f98f92abd83e2b162d565e0cbe5c59dc73f26b1c018f77d663c7`.
- Test: `tests/algebra229AsA15.audit.test.ts`, blob `73fbfefffdb2aad625df2676806fcd5aaaf8d8f0`. Verifica fila fuente completa con nota `Exponentes negativos tras expandir.`, igualdad simbólica y siete muestras racionales firmadas no nulas con aritmética JavaScript independiente.

## Evidencia ejecutada
- Checkout técnico Lite: `ea3d3901b97d3720e644c288cb66cffbceefdc24`.
- Acumulativo [42035481349](https://github.com/c2melendez/precision-lab-lite/actions/runs/42035481349): **SUCCESS**, guard `skip=false`, 2 tests focales PASSED, 366 archivos / 2,259 tests PASSED / 8 expected fail / 34 TODO.
- H1d [42035481377](https://github.com/c2melendez/precision-lab-lite/actions/runs/42035481377): **SUCCESS**, 22/22.
- Scientific UI [42035481394](https://github.com/c2melendez/precision-lab-lite/actions/runs/42035481394): **SUCCESS**, 456/456 (desktop/tablet/móvil).
- CI estándar [42035481443](https://github.com/c2melendez/precision-lab-lite/actions/runs/42035481443): **FAILURE** únicamente en `QA dependency audit (hard gate)`, cuatro vulnerabilidades moderadas; no se relajó el umbral. Este bloqueo de seguridad permanece registrado por separado.
- Runner [42035481516](https://github.com/c2melendez/precision-lab-lite/actions/runs/42035481516): SUCCESS, push-only.

## Cierre
AS-A-15 queda **PASS_SCOPED** para Lite y, junto con el registro Plus, bilateralmente aceptado. La suite matemática de Lite está verde para este checkout; el fallo de auditoría de dependencias no se marca como aprobado. Siguiente caso: AS-A-16. Certificación global: **OPEN**.
