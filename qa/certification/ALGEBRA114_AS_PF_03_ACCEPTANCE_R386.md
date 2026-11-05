# Algebra114 AS-PF-03 — aceptación acotada (r386)

**Estado: PASS_SCOPED — Precision Lab Lite únicamente.** No acredita paridad con Plus, cierre de Algebra114 ni certificación global.

## Identidad técnica

- Repositorio: c2melendez/precision-lab-lite.
- Rama canónica: qa/syntax-audit-in625-a1.
- SHA técnico probado: `91f3cd4f97bf712b778d4a803a952a59e4dea7e4`.
- Fuente original: `qa/certification/algebra114_source.md`, fila AS-PF-03.
- Blob de fuente: `b30ca7fcec641334ce8128ca25bec542a9d04e79`.
- Test: `tests/algebra114AsPf03.audit.test.ts`.
- Blob del test: `bccfbd4e3460d36d8054f3e193943bc6d4db9e1b`.

## Caso y oráculo independiente

La fila original exige:

`(x+1)/(x*(x^2+1)) = 1/x + (1-x)/(x^2+1)`.

El test:
1. Comprueba la fila exacta de la matriz.
2. Ejecuta la descomposición con `partfrac`, rechaza la llamada sin evaluar y el cociente original sin descomponer.
3. Exige la salida simbólica normalizada exacta `1/x+(1-x)/(x^2+1)`, preservando el polo simple y el denominador cuadrático irreducible.
4. Comprueba ocho sustituciones enteras no nulas `[-5,-4,-2,-1,1,2,4,6]`.
5. Compara con el oráculo JavaScript independiente `1/x + (1-x)/(x*x+1)`; los valores expected no son generados por Algebrite.

El cambio modifica únicamente el test; no cambia el motor, parser, dependencias ni workflows.

## Evidencia de ejecución sobre el mismo SHA

- Acumulativo [41985243812](https://github.com/c2melendez/precision-lab-lite/actions/runs/41985243812): **SUCCESS**. El log contiene `tests/algebra114AsPf03.audit.test.ts (1 test)`; 366 archivos aprobados, 2,259 passed, 8 expected fail y 34 TODO. Typecheck, unit/parity y production build terminaron correctamente.
- H1d [41985243959](https://github.com/c2melendez/precision-lab-lite/actions/runs/41985243959): **SUCCESS**, 22/22 Playwright.
- Scientific UI [41985243868](https://github.com/c2melendez/precision-lab-lite/actions/runs/41985243868): **SUCCESS**, 456 passed.
- Certification Runner [41985243862](https://github.com/c2melendez/precision-lab-lite/actions/runs/41985243862): **SUCCESS** en push-only. No certifica dispatch ni persistencia.
- CI estándar [41985243810](https://github.com/c2melendez/precision-lab-lite/actions/runs/41985243810): **FAILURE** en `QA dependency audit (hard gate)`, con 8 findings moderados. No se modificó el umbral.

## Límite de aceptación

- PASS_SCOPED solo para AS-PF-03 en Lite.
- Plus no ejecutó esta fila; no se declara paridad.
- Global certification permanece **OPEN**.
