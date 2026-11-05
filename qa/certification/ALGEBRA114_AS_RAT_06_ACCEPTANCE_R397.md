# Algebra114 AS-RAT-06 — aceptación acotada (r397)

**Estado: PASS_SCOPED — Precision Lab Lite únicamente.** No acredita paridad global con Plus, cierre de Algebra114 ni certificación global.

## Identidad técnica

- Repositorio: c2melendez/precision-lab-lite.
- Rama canónica: qa/syntax-audit-in625-a1.
- SHA técnico probado: `292646eea1bab498084730f8ec06cefe02dffb25`.
- Fuente original: `qa/certification/algebra114_source.md`, fila AS-RAT-06.
- Blob de fuente: `b30ca7fcec641334ce8128ca25bec542a9d04e79`.
- Test: `tests/algebra114AsRat06.audit.test.ts`.
- Blob del test: `9abf3882005ddeb231e7189d2e92564a58890fc2`.

## Caso y oráculo independiente

La fila original exige:

`(sqrt(x+h)-sqrt(x))/h = 1/(sqrt(x+h)+sqrt(x))`

bajo las condiciones `x>0`, `h>-x` y `h!=0`.

El test:
1. Verifica la fila original exacta, incluidas las tres restricciones.
2. Ejecuta la expresión original y exige la forma simbólica racionalizada exacta `1/(sqrt(x+h)+sqrt(x))`.
3. Comprueba siete pares válidos de `(x,h)`, incluidos incrementos negativos que siguen respetando `h>-x`.
4. Compara el resultado del motor con dos cálculos de oráculo independientes basados en `Math.sqrt`: el cociente original y la forma conjugada.

La aceptación se limita al dominio declarado por la fila. No afirma que la respuesta simplificada codifique por sí sola restricciones de dominio adicionales.

El cambio modifica únicamente el test; no altera el motor, parser, dependencias ni workflows.

## Evidencia de ejecución sobre el mismo SHA

- Acumulativo [41993306207](https://github.com/c2melendez/precision-lab-lite/actions/runs/41993306207): **SUCCESS**. El log muestra explícitamente `tests/algebra114AsRat06.audit.test.ts (1 test)`; 366 archivos aprobados, 2,259 passed, 8 expected fail y 34 TODO. Typecheck, regresiones unitarias/paridad y production build terminaron correctamente.
- H1d [41993306397](https://github.com/c2melendez/precision-lab-lite/actions/runs/41993306397): **SUCCESS**, 22/22 Playwright.
- Certification Runner [41993306421](https://github.com/c2melendez/precision-lab-lite/actions/runs/41993306421): **SUCCESS** en evento push, rama/checkout/fingerprint; no certifica dispatch ni persistencia.
- CI estándar [41993306652](https://github.com/c2melendez/precision-lab-lite/actions/runs/41993306652): **FAILURE** únicamente en `QA dependency audit (hard gate)`, por 4 findings moderados. No se modificó el umbral.
- Scientific UI [41993306414](https://github.com/c2melendez/precision-lab-lite/actions/runs/41993306414): **IN_PROGRESS** al corte; complementario y no usado como gate de aceptación matemática.

## Límite de aceptación

- Aprobación exclusiva para AS-RAT-06 en Lite.
- Plus tiene su propia prueba AS-RAT-06 con oráculo independiente, pendiente de gates en el SHA corregido.
- Global certification permanece **OPEN**.
