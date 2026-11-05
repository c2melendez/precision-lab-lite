# Algebra114 AS-RAT-05 — aceptación acotada (r396)

**Estado: PASS_SCOPED — Precision Lab Lite únicamente.** No acredita paridad global con Plus, cierre de Algebra114 ni certificación global.

## Identidad técnica

- Repositorio: c2melendez/precision-lab-lite.
- Rama canónica: qa/syntax-audit-in625-a1.
- SHA técnico probado: `fa6cf7132921c8d5a1c99d0bcbd1975058372115`.
- Fuente original: `qa/certification/algebra114_source.md`, fila AS-RAT-05.
- Blob de fuente: `b30ca7fcec641334ce8128ca25bec542a9d04e79`.
- Test: `tests/algebra114AsRat05.audit.test.ts`.
- Blob del test: `4feeae1fa74cc449c69ee827c01e1809a15f73f8`.

## Caso y oráculo independiente

La fila original exige la racionalización de:

`1/(cuberoot(2)+1) = (cuberoot(4)-cuberoot(2)+1)/3`.

El test:
1. Verifica la fila original exacta AS-RAT-05.
2. Comprueba que la salida simbólica normalizada sea `(4^(1/3)-2^(1/3)+1)/3` y no conserva el denominador radical original.
3. Calcula `Math.cbrt(2)` y `Math.cbrt(4)` fuera del CAS para formar el expected numérico independiente.
4. Exige positividad, compara la salida numérica del motor contra ese valor y verifica la identidad del conjugado `(cuberoot(2)+1)*(cuberoot(4)-cuberoot(2)+1)=3`.

El cambio modifica únicamente el test; no altera el motor, parser, dependencias ni workflows.

## Evidencia de ejecución sobre el mismo SHA

- Acumulativo [41991904550](https://github.com/c2melendez/precision-lab-lite/actions/runs/41991904550): **SUCCESS**. Log focal explícito `tests/algebra114AsRat05.audit.test.ts (1 test)`; 366 archivos aprobados, 2,259 passed, 8 expected fail y 34 TODO. Typecheck, unit/parity y production build terminaron correctamente.
- H1d [41991904595](https://github.com/c2melendez/precision-lab-lite/actions/runs/41991904595): **SUCCESS**, 22/22 Playwright.
- Scientific UI [41991904726](https://github.com/c2melendez/precision-lab-lite/actions/runs/41991904726): **SUCCESS**, 456 pruebas.
- Certification Runner [41991904549](https://github.com/c2melendez/precision-lab-lite/actions/runs/41991904549): **SUCCESS** en evento push; solo camino push/fingerprint. No certifica dispatch ni persistencia.
- CI estándar [41991904623](https://github.com/c2melendez/precision-lab-lite/actions/runs/41991904623): **FAILURE** únicamente en `QA dependency audit (hard gate)`, por 4 findings moderados. No se modificó el umbral.

## Límite de aceptación

- Aprobación exclusiva para AS-RAT-05 en Lite.
- La validación independiente de Plus sigue en ejecución y requiere evidencia propia.
- Global certification permanece **OPEN**.
