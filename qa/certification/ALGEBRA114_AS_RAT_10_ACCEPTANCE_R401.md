# Algebra114 AS-RAT-10 — aceptación acotada (r401)

**Estado: PASS_SCOPED — Precision Lab Lite únicamente.** No acredita paridad con Plus ni certificación global.

## Identidad técnica

- Repositorio: c2melendez/precision-lab-lite.
- Rama canónica: qa/syntax-audit-in625-a1.
- SHA técnico probado: `6a8d1b7d586b4ad4e939fc9601be4498d7bd8aa9`.
- Fuente original: `qa/certification/algebra114_source.md`, fila AS-RAT-10; blob `b30ca7fcec641334ce8128ca25bec542a9d04e79`.
- Test: `tests/algebra114AsRat10.audit.test.ts`; blob `34f349104607d808d5aeba165b51965107bcdbaf`.

## Contrato y oráculo independiente

La prueba fija la fila completa y verifica la salida simbólica `3-sqrt(6)`. Con `Math.sqrt` calcula independientemente el valor de la expresión original y el de la forma racionalizada, comprueba positividad y contrasta ambos resultados de `compileNumeric` contra los valores esperados. También verifica la identidad conjugada `(3-sqrt(6))*(3+sqrt(6))=3`.

El cambio modifica únicamente el test; no altera motor, parser, dependencias ni workflows.

## Evidencia sobre el mismo SHA

- Acumulativo [41999844182](https://github.com/c2melendez/precision-lab-lite/actions/runs/41999844182): **SUCCESS**. El log muestra explícitamente `tests/algebra114AsRat10.audit.test.ts (1 test)`; 366 archivos aprobados, 2,259 passed, 8 expected fail y 34 TODO. Typecheck, regresión/paridad y build SUCCESS.
- H1d [41999844363](https://github.com/c2melendez/precision-lab-lite/actions/runs/41999844363): **SUCCESS**, gate completo.
- Certification Runner [41999844233](https://github.com/c2melendez/precision-lab-lite/actions/runs/41999844233): **SUCCESS_PUSH_ONLY**. Resolución canónica, checkout y fingerprint verificados; dispatch, espera, recibo y persistencia omitidos.
- CI estándar [41999844221](https://github.com/c2melendez/precision-lab-lite/actions/runs/41999844221): **FAILURE** en `QA dependency audit (hard gate)` por 4 vulnerabilidades moderadas. Typecheck, unit/parity y build fueron omitidos en este workflow. El umbral no se modificó.
- Scientific UI [41999844229](https://github.com/c2melendez/precision-lab-lite/actions/runs/41999844229): **IN_PROGRESS** al corte; E2E complementario separado, no confundido con el gate matemático.

## Límite de aceptación

- Aprobación exclusiva para AS-RAT-10 en Lite.
- No se afirma paridad con Plus.
- La CI estándar mantiene su bloqueo de dependencias; el resultado SUCCESS del acumulativo no convierte ese gate en PASS.
- La siguiente acción es reconciliar el inventario y comenzar Algebra229 según el protocolo canónico.
- La certificación global permanece **OPEN**.
