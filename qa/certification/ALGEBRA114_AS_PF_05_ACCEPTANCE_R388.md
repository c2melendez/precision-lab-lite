# Algebra114 AS-PF-05 — aceptación acotada (r388)

**Estado: PASS_SCOPED — Precision Lab Lite únicamente.** No acredita paridad con Plus, cierre de Algebra114 ni certificación global.

## Identidad técnica

- Repositorio: c2melendez/precision-lab-lite.
- Rama canónica: qa/syntax-audit-in625-a1.
- SHA técnico probado: `29dee8bcbd78d3d7b009864fe167fdd4db74ee65`.
- Fuente original: `qa/certification/algebra114_source.md`, fila AS-PF-05.
- Blob de fuente: `b30ca7fcec641334ce8128ca25bec542a9d04e79`.
- Test: `tests/algebra114AsPf05.audit.test.ts`.
- Blob del test: `02692846100f4d87362d2cb42fa834f56ed4f0bf`.

## Caso y oráculo independiente

La fila original exige:

`(x^3+1)/(x^2-1) = x + 1/(x-1)`, con `x != ±1`.

El test:
1. Comprueba la fila exacta, incluida la condición de dominio.
2. Ejecuta `partfrac` y exige la salida normalizada `x+1/(x-1)`.
3. Comprueba directamente que el denominador original `x^2-1` se anula en `x=-1` y `x=1`; no extiende el dominio del original por la cancelación del factor `x+1`.
4. Evalúa seis sustituciones válidas `[-4,-2,0,2,3,5]`.
5. Compara cada valor con dos oráculos JavaScript independientes: la forma simplificada `x+1/(x-1)` y el cociente original `(x^3+1)/(x^2-1)`.

El cambio modifica únicamente el test; no modifica motor, parser, dependencias ni workflows.

## Evidencia de ejecución sobre el mismo SHA

- Acumulativo [41987534768](https://github.com/c2melendez/precision-lab-lite/actions/runs/41987534768): **SUCCESS**. Log focal `tests/algebra114AsPf05.audit.test.ts (1 test)`; 366 archivos aprobados, 2,259 passed, 8 expected fail y 34 TODO. Typecheck, regresiones y production build terminaron correctamente.
- H1d [41987534717](https://github.com/c2melendez/precision-lab-lite/actions/runs/41987534717): **SUCCESS**, 22/22 Playwright.
- Certification Runner [41987534812](https://github.com/c2melendez/precision-lab-lite/actions/runs/41987534812): **SUCCESS**, push-only; no certifica dispatch ni persistencia.
- CI estándar [41987534734](https://github.com/c2melendez/precision-lab-lite/actions/runs/41987534734): **FAILURE** en `QA dependency audit (hard gate)`, por 4 findings moderados; no se cambió el umbral.
- Scientific UI [41987534758](https://github.com/c2melendez/precision-lab-lite/actions/runs/41987534758): **IN_PROGRESS** al corte; complementario y no requerido para la aceptación matemática focalizada.

## Límite de aceptación

- PASS_SCOPED solo para AS-PF-05 en Lite.
- Plus mantiene cobertura independiente bajo su backend; la paridad entre motores no se declara aquí.
- Global certification permanece **OPEN**.
