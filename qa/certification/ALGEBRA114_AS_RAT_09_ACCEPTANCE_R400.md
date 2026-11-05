# Algebra114 AS-RAT-09 — aceptación acotada (r400)

**Estado: PASS_SCOPED — Precision Lab Lite únicamente.** No acredita paridad con Plus ni certificación global.

## Identidad técnica

- Repositorio: c2melendez/precision-lab-lite.
- Rama canónica: qa/syntax-audit-in625-a1.
- SHA técnico probado: `aa3bd34cb20fac49e86cebb598ec69058e714a9e`.
- Fuente original: `qa/certification/algebra114_source.md`, fila AS-RAT-09; blob `b30ca7fcec641334ce8128ca25bec542a9d04e79`.
- Test: `tests/algebra114AsRat09.audit.test.ts`; blob `c8e9bcde6d716eb6f017c3cb7e9cbdaba4098739`.

## Contrato y oráculo independiente

La prueba fija la fila completa de la matriz, incluidas las condiciones reales `x,y >= 0` y `x != y`. Comprueba simbólicamente que el motor transforma `1/(sqrt(x)+sqrt(y))` en `(sqrt(x)-sqrt(y))/(x-y)`.

En seis pares válidos, calcula `Math.sqrt` de forma independiente del CAS y compara por separado la evaluación de la expresión original y la forma racionalizada con ambos valores esperados. Incluye puntos con un radicando cero y pares positivos; conserva explícitamente la exclusión `x == y`.

El cambio modifica únicamente la prueba; no altera motor, parser, dependencias ni workflows.

## Evidencia sobre el mismo SHA

- Acumulativo [41999027290](https://github.com/c2melendez/precision-lab-lite/actions/runs/41999027290): **SUCCESS**. El log muestra explícitamente `tests/algebra114AsRat09.audit.test.ts (1 test)`; 366 archivos aprobados, 2,259 passed, 8 expected fail y 34 TODO. Typecheck, regresión/paridad y build del gate acumulativo fueron SUCCESS.
- H1d [41999027294](https://github.com/c2melendez/precision-lab-lite/actions/runs/41999027294): **SUCCESS**, 22/22 Playwright.
- Certification Runner [41999027296](https://github.com/c2melendez/precision-lab-lite/actions/runs/41999027296): **SUCCESS** push-only. No acredita `workflow_dispatch`, despacho de gate ni persistencia.
- CI estándar [41999027317](https://github.com/c2melendez/precision-lab-lite/actions/runs/41999027317): **FAILURE** en `QA dependency audit (hard gate)` por 4 vulnerabilidades moderadas. Typecheck, unit/parity y build fueron omitidos tras el fallo. El umbral no se modificó.
- Scientific UI [41999027309](https://github.com/c2melendez/precision-lab-lite/actions/runs/41999027309): **IN_PROGRESS** al corte de aceptación; es complementario, no el gate matemático de esta fila.

## Límite de aceptación

- Aprobación exclusiva para AS-RAT-09 en Lite.
- No se afirma paridad con Plus.
- Siguiente fila Lite: AS-RAT-10.
- La CI estándar y Scientific UI conservan sus estados separados; no se convierten en PASS por el acumulativo.
- La certificación global permanece **OPEN**.
