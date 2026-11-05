# Algebra114 AS-RAT-04 — aceptación acotada (r395)

**Estado: PASS_SCOPED — Precision Lab Lite únicamente.** No acredita paridad global con Plus, cierre de Algebra114 ni certificación global.

## Identidad técnica

- Repositorio: c2melendez/precision-lab-lite.
- Rama canónica: qa/syntax-audit-in625-a1.
- SHA técnico probado: `5b55169fa9a695a03075264f86da8384e84246f4`.
- Fuente original: `qa/certification/algebra114_source.md`, fila AS-RAT-04.
- Blob de fuente: `b30ca7fcec641334ce8128ca25bec542a9d04e79`.
- Test: `tests/algebra114AsRat04.audit.test.ts`.
- Blob del test: `d855ab0b743595c10c50cb0f724a736e58d50e92`.

## Caso y oráculo independiente

La fila original exige:

`1/cuberoot(2) = cuberoot(4)/2`.

El test comprueba la fila exacta, exige salida simbólica normalizada `4^(1/3)/2), rechaza el denominador radical original, exige valor positivo y compara contra `Math.cbrt(4)/2`. También verifica que el cubo del resultado es 1/2. El expected numérico no se calcula con Algebrite.

## Evidencia de ejecución sobre el mismo SHA

- Acumulativo [41991375614](https://github.com/c2melendez/precision-lab-lite/actions/runs/41991375614): **SUCCESS**. Log focal `tests/algebra114AsRat04.audit.test.ts (1 test)`; 366 archivos aprobados, 2,259 passed, 8 expected fail y 34 TODO; typecheck, regresiones y build correctos.
- H1d [41991375334](https://github.com/c2melendez/precision-lab-lite/actions/runs/41991375334): **SUCCESS**, 22/22 Playwright.
- Certification Runner [41991375332](https://github.com/c2melendez/precision-lab-lite/actions/runs/41991375332): **SUCCESS**, push-only; no certifica dispatch ni persistencia.
- CI estándar [41991375289](https://github.com/c2melendez/precision-lab-lite/actions/runs/41991375289): **FAILURE** en `QA dependency audit (hard gate)`, por 4 findings moderados; no se cambió el umbral.
- Scientific UI [41991375311](https://github.com/c2melendez/precision-lab-lite/actions/runs/41991375311): **IN_PROGRESS** al corte; complementario.

## Límite de aceptación

- PASS_SCOPED solo para AS-RAT-04 en Lite.
- Plus sigue su propia validación backend; no se infiere paridad UI.
- Global certification permanece **OPEN**.
