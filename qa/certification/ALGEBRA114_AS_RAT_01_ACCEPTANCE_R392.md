# Algebra114 AS-RAT-01 — aceptación acotada (r392)

**Estado: PASS_SCOPED — Precision Lab Lite únicamente.** No acredita paridad global con Plus, cierre de Algebra114 ni certificación global.

## Identidad técnica

- Repositorio: c2melendez/precision-lab-lite.
- Rama canónica: qa/syntax-audit-in625-a1.
- SHA técnico probado: `3d0c3997fc8338f9fd8c2fc4bfd31406e48d604f`.
- Fuente original: `qa/certification/algebra114_source.md`, fila AS-RAT-01.
- Blob de fuente: `b30ca7fcec641334ce8128ca25bec542a9d04e79`.
- Test: `tests/algebra114AsRat01.audit.test.ts`.
- Blob del test: `757d5dccc09b0661a37df3f88d65ff04601eb703`.

## Caso y oráculo independiente

La fila original exige:

`1/sqrt(2) = sqrt(2)/2`.

El test comprueba la fila exacta, restringe la forma de salida a una forma racionalizada aceptable, rechaza que siga como `1/sqrt(2)`, exige valor positivo y verifica el valor numérico contra `Math.sqrt(2)/2`. También comprueba que el cuadrado del resultado es 1/2. El expected numérico no se calcula con Algebrite.

El cambio modifica únicamente el test; no cambia motor, parser, dependencias ni workflows.

## Evidencia de ejecución sobre el mismo SHA

- Acumulativo [41989838821](https://github.com/c2melendez/precision-lab-lite/actions/runs/41989838821): **SUCCESS**. Log focal `tests/algebra114AsRat01.audit.test.ts (1 test)`; 366 archivos aprobados, 2,259 passed, 8 expected fail y 34 TODO; typecheck, regresiones y build correctos.
- H1d [41989838733](https://github.com/c2melendez/precision-lab-lite/actions/runs/41989838733): **SUCCESS**, 22/22 Playwright.
- Certification Runner [41989838670](https://github.com/c2melendez/precision-lab-lite/actions/runs/41989838670): **SUCCESS**, push-only; no certifica dispatch ni persistencia.
- CI estándar [41989838641](https://github.com/c2melendez/precision-lab-lite/actions/runs/41989838641): **FAILURE** en `QA dependency audit (hard gate)`, por 4 findings moderados; no se cambió el umbral.
- Scientific UI [41989838750](https://github.com/c2melendez/precision-lab-lite/actions/runs/41989838750): **IN_PROGRESS** al corte; complementario.

## Límite de aceptación

- PASS_SCOPED solo para AS-RAT-01 en Lite.
- Plus sigue una ruta backend con SymPy; no se infiere paridad de UI.
- Global certification permanece **OPEN**.
