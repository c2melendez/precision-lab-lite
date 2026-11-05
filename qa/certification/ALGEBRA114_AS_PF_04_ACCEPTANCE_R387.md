# Algebra114 AS-PF-04 — aceptación acotada (r387)

**Estado: PASS_SCOPED — Precision Lab Lite únicamente.** No acredita paridad con Plus, cierre de Algebra114 ni certificación global.

## Identidad técnica

- Repositorio: c2melendez/precision-lab-lite.
- Rama canónica: qa/syntax-audit-in625-a1.
- SHA técnico probado: `62b9afb1869c2b357d9b9bf01ae8a4f80474f848`.
- Fuente original: `qa/certification/algebra114_source.md`, fila AS-PF-04.
- Blob de fuente: `b30ca7fcec641334ce8128ca25bec542a9d04e79`.
- Test: `tests/algebra114AsPf04.audit.test.ts`.
- Blob del test: `bd9680dc3e7b9cbe6a991f1bc1aaf01436c384b8`.

## Caso y oráculo independiente

La fila original exige:

`(2x+3)/(x^2-4) = 7/(4(x-2)) + 1/(4(x+2))`.

El test:
1. Comprueba la fila exacta de la matriz.
2. Ejecuta `partfrac((2*x+3)/(x^2-4),x)`, rechaza la llamada sin evaluar y el cociente original sin descomponer.
3. Exige la salida normalizada exacta `7/(4*(x-2))+1/(4*(x+2))`, preservando ambos polos simples y sus coeficientes.
4. Comprueba ocho sustituciones enteras no singulares `[-5,-3,-1,0,1,3,5,6]`.
5. Compara cada valor con el oráculo JavaScript independiente `(2*x+3)/(x*x-4)`; el expected no es generado por Algebrite.

El cambio modifica únicamente el test; no modifica motor, parser, dependencias ni workflows.

## Evidencia de ejecución sobre el mismo SHA

- Acumulativo [41987091228](https://github.com/c2melendez/precision-lab-lite/actions/runs/41987091228): **SUCCESS**. El log muestra explícitamente `tests/algebra114AsPf04.audit.test.ts (1 test)`; 366 archivos aprobados, 2,259 passed, 8 expected fail y 34 TODO. Typecheck, regresiones unitarias/paridad y production build terminaron correctamente.
- H1d [41987091032](https://github.com/c2melendez/precision-lab-lite/actions/runs/41987091032): **SUCCESS**, 22/22 Playwright.
- Certification Runner [41987091131](https://github.com/c2melendez/precision-lab-lite/actions/runs/41987091131): **SUCCESS** en evento push, push-only. No certifica dispatch ni persistencia.
- CI estándar [41987091076](https://github.com/c2melendez/precision-lab-lite/actions/runs/41987091076): **FAILURE** en `QA dependency audit (hard gate)` por 4 findings moderados. No se modificó el umbral.
- Scientific UI [41987091086](https://github.com/c2melendez/precision-lab-lite/actions/runs/41987091086): seguía **IN_PROGRESS** al registrar esta aceptación; es complementario y no forma parte del gate mínimo de esta aceptación matemática.

## Límite de aceptación

- PASS_SCOPED solo para AS-PF-04 en Lite.
- Plus no ejecutó esta fila; no se declara paridad.
- Global certification permanece **OPEN**.
