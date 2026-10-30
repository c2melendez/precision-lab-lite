# Algebra 114 — aceptación acotada AS-SIM-01 (r358)

**Estado:** PASS_SCOPED — Lite únicamente. No certifica Algebra 114 completa ni implica paridad con Plus.

## Caso y oráculo

Fuente normativa: `qa/certification/algebra114_source.md`, fila AS-SIM-01, N1:

`3x + 2y - x + 5y → 2x + 7y`.

Test: `tests/algebra114AsSim01.audit.test.ts`, blob SHA `0af3d63cf797d0acfef92b3af664ad7c2616ea40`.

- Comprueba que la fila original sigue presente en la fuente.
- Comprueba la forma simbólica normalizada `2*x+7*y`.
- Usa cinco pares de sustitución: (2,3), (-5,7), (0,-4), (11,0), (-3,-4).
- El valor esperado se calcula mediante aritmética JavaScript `2*x + 7*y`, no evaluando una segunda expresión con Algebrite.

## Evidencia exacta

SHA técnico: `30b0b03120faa5252dbb7b090c81d37a8c16452a`.

- CI [41135927030](https://github.com/c2melendez/precision-lab-lite/actions/runs/41135927030): SUCCESS.
- Cumulative [41135926842](https://github.com/c2melendez/precision-lab-lite/actions/runs/41135926842): SUCCESS; Vitest 365 archivos, 2,258 passed, 8 expected fail, 34 todo. El log confirma que `algebra114AsSim01.audit.test.ts` se incluyó.
- H1d [41135926938](https://github.com/c2melendez/precision-lab-lite/actions/runs/41135926938): SUCCESS.
- Runner [41135926862](https://github.com/c2melendez/precision-lab-lite/actions/runs/41135926862): SUCCESS. Es evidencia de su propio workflow, no sustituye los gates matemáticos.
- Scientific UI [41135926885](https://github.com/c2melendez/precision-lab-lite/actions/runs/41135926885): workflow separado, no requisito de aceptación para este caso algebraico; no se usa como evidencia del caso.

## Límite y continuidad

PASS_SCOPED solo para la simplificación lineal y cinco sustituciones declaradas. No acredita la matriz de 114 filas ni otras identidades.

Siguiente caso ausente en la batería Lite: **AS-SIM-05**, `(x^2-1)/(x-1) = x+1` con `x != 1`. La aceptación exige preservar explícitamente la restricción original; cancelar y perder el punto excluido no será PASS.

Lite H2/EN-SG sigue PARTIAL según `H2_EN_SG_LITE_RECONCILIATION_R358.md`; no se mezcla con este caso. Certificación global OPEN.
