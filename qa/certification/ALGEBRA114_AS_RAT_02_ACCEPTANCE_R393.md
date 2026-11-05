# Algebra114 AS-RAT-02 — aceptación acotada (r393)

**Estado: PASS_SCOPED — Precision Lab Lite únicamente.** No acredita paridad global con Plus, cierre de Algebra114 ni certificación global.

## Identidad técnica

- Repositorio: c2melendez/precision-lab-lite.
- Rama canónica: qa/syntax-audit-in625-a1.
- SHA técnico probado: `32888aacbfbc56c2e633c245377c012b381e8045`.
- Fuente original: `qa/certification/algebra114_source.md`, fila AS-RAT-02.
- Blob de fuente: `b30ca7fcec641334ce8128ca25bec542a9d04e79`.
- Test: `tests/algebra114AsRat02.audit.test.ts`.
- Blob del test: `c8fd6b30fa765de132adeea717cfb5ad861fccba`.

## Caso y oráculo independiente

La fila original exige:

`1/(sqrt(2)+1) = sqrt(2)-1`.

El test comprueba la fila exacta, exige la salida simbólica racionalizada `sqrt(2)-1), rechaza la expresión recíproca original, exige positividad y compara con `Math.sqrt(2)-1`. Además verifica la identidad de conjugados `(sqrt(2)-1)*(sqrt(2)+1)=1`. El expected numérico no se calcula con Algebrite.

El cambio modifica únicamente el test; no cambia motor, parser, dependencias ni workflows.

## Evidencia de ejecución sobre el mismo SHA

- Acumulativo [41990320058](https://github.com/c2melendez/precision-lab-lite/actions/runs/41990320058): **SUCCESS**. Log focal `tests/algebra114AsRat02.audit.test.ts (1 test)`; 366 archivos, 2,259 passed, 8 expected fail y 34 TODO. Typecheck, regresiones y build correctos.
- H1d [41990320041](https://github.com/c2melendez/precision-lab-lite/actions/runs/41990320041): **SUCCESS**, 22/22 Playwright.
- Certification Runner [41990319989](https://github.com/c2melendez/precision-lab-lite/actions/runs/41990319989): **SUCCESS**, push-only; no certifica dispatch ni persistencia.
- CI estándar [41990320030](https://github.com/c2melendez/precision-lab-lite/actions/runs/41990320030): **FAILURE** en `QA dependency audit (hard gate)`, por 4 findings moderados; no se cambió el umbral.
- Scientific UI [41990320118](https://github.com/c2melendez/precision-lab-lite/actions/runs/41990320118): **IN_PROGRESS** al corte; complementario.

## Límite de aceptación

- PASS_SCOPED solo para AS-RAT-02 en Lite.
- Plus tiene backend SymPy y se está completando la segunda campaña PF con oráculos Fraction; no se infiere paridad UI.
- Global certification permanece **OPEN**.
