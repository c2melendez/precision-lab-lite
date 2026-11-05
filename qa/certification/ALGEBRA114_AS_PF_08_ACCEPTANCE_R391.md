# Algebra114 AS-PF-08 — aceptación acotada (r391)

**Estado: PASS_SCOPED — Precision Lab Lite únicamente.** No acredita paridad global con Plus, cierre de Algebra114 ni certificación global.

## Identidad técnica

- Repositorio: c2melendez/precision-lab-lite.
- Rama canónica: qa/syntax-audit-in625-a1.
- SHA técnico probado: `e8692ea53ccfb1b09ba50dbd3ecf71f473cc6aca`.
- Fuente original: `qa/certification/algebra114_source.md`, fila AS-PF-08.
- Blob de fuente: `b30ca7fcec641334ce8128ca25bec542a9d04e79`.
- Test: `tests/algebra114AsPf08.audit.test.ts`.
- Blob del test: `ac8a3385dce4f7a9600ea326e4469041ad48bdf6`.

## Caso y oráculo independiente

La fila original exige:

`x^4/(x^2-1) = x^2+1+1/(2(x-1))-1/(2(x+1))`, con `x != ±1`.

El test comprueba la fila exacta, ejecuta `partfrac`, exige la salida normalizada, verifica que el denominador original se anula en `x=-1` y `x=1`, y evalúa siete sustituciones válidas `[-5,-3,-2,0,2,3,5]` contra dos oráculos JavaScript independientes: la suma descompuesta y la fracción original.

El cambio modifica únicamente el test; no cambia el motor, parser, dependencias ni workflows.

## Evidencia de ejecución sobre el mismo SHA

- Acumulativo [41989337913](https://github.com/c2melendez/precision-lab-lite/actions/runs/41989337913): **SUCCESS**. El log muestra explícitamente `tests/algebra114AsPf08.audit.test.ts (1 test)`; 366 archivos aprobados, 2,259 passed, 8 expected fail y 34 TODO. Typecheck, regresiones y build terminaron correctamente.
- H1d [41989337908](https://github.com/c2melendez/precision-lab-lite/actions/runs/41989337908): **SUCCESS**, 22/22 Playwright.
- Certification Runner [41989337892](https://github.com/c2melendez/precision-lab-lite/actions/runs/41989337892): **SUCCESS**, push-only; no certifica dispatch ni persistencia.
- CI estándar [41989337844](https://github.com/c2melendez/precision-lab-lite/actions/runs/41989337844): **FAILURE** en `QA dependency audit (hard gate)`, por 4 findings moderados; no se cambió el umbral.
- Scientific UI [41989338015](https://github.com/c2melendez/precision-lab-lite/actions/runs/41989338015): **IN_PROGRESS** al corte; complementario.

## Límite de aceptación

- PASS_SCOPED solo para AS-PF-08 en Lite.
- Plus cuenta con una ejecución backend independiente de PF-01..PF-08; PF-03..05 también fueron reforzadas con oráculos Fraction.
- Global certification permanece **OPEN**.
