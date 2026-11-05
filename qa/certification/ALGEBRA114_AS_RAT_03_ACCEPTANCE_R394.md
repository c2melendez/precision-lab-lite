# Algebra114 AS-RAT-03 — aceptación acotada (r394)

**Estado: PASS_SCOPED — Precision Lab Lite únicamente.** No acredita paridad global con Plus, cierre de Algebra114 ni certificación global.

## Identidad técnica

- Repositorio: c2melendez/precision-lab-lite.
- Rama canónica: qa/syntax-audit-in625-a1.
- SHA técnico probado: `7120357932156987632af4c3cec1cd0dac1d70e0`.
- Fuente original: `qa/certification/algebra114_source.md`, fila AS-RAT-03.
- Blob de fuente: `b30ca7fcec641334ce8128ca25bec542a9d04e79`.
- Test: `tests/algebra114AsRat03.audit.test.ts`.
- Blob del test: `fc5d79aa5f2100b2056b3fb1d839d94de68f6a4d`.

## Caso y oráculo independiente

La fila original exige:

`1/(sqrt(2)+sqrt(3)) = sqrt(3)-sqrt(2)`.

El test comprueba la fila exacta, exige la forma simbólica racionalizada `sqrt(3)-sqrt(2)`, rechaza el denominador recíproco original, exige valor positivo y verifica contra `Math.sqrt(3)-Math.sqrt(2)`. También comprueba la identidad de conjugados `(sqrt(3)-sqrt(2))*(sqrt(3)+sqrt(2))=1`. El expected numérico no se calcula con Algebrite.

## Evidencia de ejecución sobre el mismo SHA

- Acumulativo [41990773477](https://github.com/c2melendez/precision-lab-lite/actions/runs/41990773477): **SUCCESS**. Log focal `tests/algebra114AsRat03.audit.test.ts (1 test)`; 366 archivos, 2,259 passed, 8 expected fail y 34 TODO; typecheck, regresiones y build correctos.
- H1d [41990773429](https://github.com/c2melendez/precision-lab-lite/actions/runs/41990773429): **SUCCESS**, 22/22 Playwright.
- Certification Runner [41990773581](https://github.com/c2melendez/precision-lab-lite/actions/runs/41990773581): **SUCCESS**, push-only; no certifica dispatch ni persistencia.
- CI estándar [41990773497](https://github.com/c2melendez/precision-lab-lite/actions/runs/41990773497): **FAILURE** en `QA dependency audit (hard gate)`, por 4 findings moderados; no se cambió el umbral.
- Scientific UI [41990773596](https://github.com/c2melendez/precision-lab-lite/actions/runs/41990773596): **IN_PROGRESS** al corte; complementario.

## Límite de aceptación

- PASS_SCOPED solo para AS-RAT-03 en Lite.
- Plus ejecuta un backend SymPy con su propia suite; no se infiere paridad UI.
- Global certification permanece **OPEN**.
