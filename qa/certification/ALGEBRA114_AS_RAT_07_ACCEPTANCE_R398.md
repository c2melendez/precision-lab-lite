# Algebra114 AS-RAT-07 — aceptación acotada (r398)

**Estado: PASS_SCOPED — Precision Lab Lite únicamente.** No acredita paridad global con Plus, cierre de Algebra114 ni certificación global.

## Identidad técnica

- Repositorio: c2melendez/precision-lab-lite.
- Rama canónica: qa/syntax-audit-in625-a1.
- SHA técnico probado: `0f7daaeb73485465809c66e20ac03ea121a26d23`.
- Fuente original: `qa/certification/algebra114_source.md`, fila AS-RAT-07.
- Blob de fuente: `b30ca7fcec641334ce8128ca25bec542a9d04e79`.
- Test: `tests/algebra114AsRat07.audit.test.ts`.
- Blob del test: `b536e8976b6604191233caa981012daa07562d93`.

## Caso y oráculo independiente

La fila original exige:

`sqrt(2+sqrt(3)) = (sqrt(6)+sqrt(2))/2`.

El test verifica la fila exacta, exige la forma simbólica denestada, calcula Math.sqrt(2), Math.sqrt(3) y Math.sqrt(6) fuera del CAS, comprueba positividad y compara el resultado con los oráculos del radical original y de la forma denestada. También verifica que el cuadrado del resultado sea 2+sqrt(3).

El cambio modifica únicamente el test; no altera el motor, parser, dependencias ni workflows.

## Evidencia de ejecución sobre el mismo SHA

- Acumulativo [41994849117](https://github.com/c2melendez/precision-lab-lite/actions/runs/41994849117): **SUCCESS**. El log muestra explícitamente `tests/algebra114AsRat07.audit.test.ts (1 test)`; 366 archivos aprobados, 2,259 passed, 8 expected fail y 34 TODO. Typecheck, unit/parity y production build terminaron correctamente.
- H1d [41994848997](https://github.com/c2melendez/precision-lab-lite/actions/runs/41994848997): **SUCCESS**, 22/22 Playwright.
- Certification Runner [41994848968](https://github.com/c2melendez/precision-lab-lite/actions/runs/41994848968): **SUCCESS** en evento push, rama/checkout/fingerprint; no certifica workflow_dispatch, dispatch ni persistencia.
- CI estándar [41994848966](https://github.com/c2melendez/precision-lab-lite/actions/runs/41994848966): **FAILURE** únicamente en `QA dependency audit (hard gate)`, por 4 findings moderados. No se modificó el umbral.
- Scientific UI [41994849059](https://github.com/c2melendez/precision-lab-lite/actions/runs/41994849059): **IN_PROGRESS** al corte; complementario y no usado como gate matemático.

## Límite de aceptación

- Aprobación exclusiva para AS-RAT-07 en Lite.
- Plus está validando AS-RAT-03 con sus propios gates; no se infiere paridad.
- Global certification permanece **OPEN**.
