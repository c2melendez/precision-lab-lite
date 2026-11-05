# Algebra114 AS-RAT-08 — aceptación acotada (r399)

**Estado: PASS_SCOPED — Precision Lab Lite únicamente.** No acredita paridad global con Plus, cierre de Algebra114 ni certificación global.

## Identidad técnica

- Repositorio: c2melendez/precision-lab-lite.
- Rama canónica: qa/syntax-audit-in625-a1.
- SHA técnico probado: `8016196304e1c561f4f12831f65fcbe05d4ee8e5`.
- Fuente original: `qa/certification/algebra114_source.md`, fila AS-RAT-08.
- Blob de fuente: `b30ca7fcec641334ce8128ca25bec542a9d04e79`.
- Test: `tests/algebra114AsRat08.audit.test.ts`.
- Blob del test: `48c40e14041fd761ed95ac7e6feff14dd621e18a`.

## Caso y oráculo independiente

La fila original exige:

`sqrt(5+2*sqrt(6)) = sqrt(3)+sqrt(2)`.

El test:
1. Comprueba la fila original exacta.
2. Ejecuta la expresión original y exige la forma simbólica `sqrt(3)+sqrt(2)`.
3. Calcula `Math.sqrt(2)`, `Math.sqrt(3)` y `Math.sqrt(6)` fuera del CAS.
4. Exige positividad y compara el resultado con dos oráculos independientes: la expresión original `Math.sqrt(5+2*Math.sqrt(6))` y la forma denestada `Math.sqrt(3)+Math.sqrt(2)`.
5. Verifica la identidad del cuadrado: el resultado elevado al cuadrado equivale a `5+2*Math.sqrt(6)`.

El cambio modifica únicamente el test; no altera motor, parser, dependencias ni workflows.

## Evidencia de ejecución sobre el mismo SHA

- Acumulativo [41995778782](https://github.com/c2melendez/precision-lab-lite/actions/runs/41995778782): **SUCCESS**. El log muestra explícitamente `tests/algebra114AsRat08.audit.test.ts (1 test)`; 366 archivos aprobados, 2,259 passed, 8 expected fail y 34 TODO. Typecheck, regresión/paridad y build terminaron correctamente.
- H1d [41995778648](https://github.com/c2melendez/precision-lab-lite/actions/runs/41995778648): **SUCCESS**, 22/22 Playwright.
- Certification Runner [41995778927](https://github.com/c2melendez/precision-lab-lite/actions/runs/41995778927): **SUCCESS**, push-only; no certifica workflow_dispatch, dispatch ni persistencia.
- CI estándar [41995778596](https://github.com/c2melendez/precision-lab-lite/actions/runs/41995778596): **FAILURE** en `QA dependency audit (hard gate)`, 4 findings moderados. No se modificó el umbral.
- Scientific UI [41995778671](https://github.com/c2melendez/precision-lab-lite/actions/runs/41995778671): **IN_PROGRESS** al corte; complementario, no gate matemático.

## Límite de aceptación

- Aprobación exclusiva para AS-RAT-08 en Lite.
- Plus RAT-04 mantiene una validación independiente en curso; no se infiere paridad.
- Global certification permanece **OPEN**.
