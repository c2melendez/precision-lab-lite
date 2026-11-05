# Algebra114 AS-PF-06 — aceptación acotada (r389)

**Estado: PASS_SCOPED — Precision Lab Lite únicamente.** No acredita paridad con Plus, cierre de Algebra114 ni certificación global.

## Identidad técnica

- Repositorio: c2melendez/precision-lab-lite.
- Rama canónica: qa/syntax-audit-in625-a1.
- SHA técnico probado: `5d64673455743a3bc50a4ce7975100c280cc644d`.
- Fuente original: `qa/certification/algebra114_source.md`, fila AS-PF-06.
- Blob de fuente: `b30ca7fcec641334ce8128ca25bec542a9d04e79`.
- Test: `tests/algebra114AsPf06.audit.test.ts`.
- Blob del test: `aeb967285bfd5e6112cb02642f0d4c1aa066833e`.

## Caso y oráculo independiente

La fila original exige:

`1/((x^2+1)(x^2+4)) = 1/3*(1/(x^2+1)-1/(x^2+4))`.

El test:
1. Comprueba la fila exacta de la matriz.
2. Ejecuta `partfrac` y rechaza la llamada sin evaluar o la expresión original sin descomponer.
3. Exige la forma simbólica normalizada `1/(3*(x^2+1))-1/(3*(x^2+4))), conservando ambos denominadores cuadráticos.
4. Evalúa siete sustituciones enteras `[-5,-2,-1,0,1,2,5]`.
5. Compara los valores contra dos oráculos JavaScript independientes: la descomposición esperada y el racional original. Algebrite no calcula los expected.

El cambio modifica únicamente el test; no cambia el motor, parser, dependencias ni workflows.

## Evidencia de ejecución sobre el mismo SHA

- Acumulativo [41988271867](https://github.com/c2melendez/precision-lab-lite/actions/runs/41988271867): **SUCCESS**. El log muestra explícitamente `tests/algebra114AsPf06.audit.test.ts (1 test)`; 366 archivos aprobados, 2,259 passed, 8 expected fail y 34 TODO. Typecheck, regresiones unitarias/paridad y build terminaron correctamente.
- H1d [41988271747](https://github.com/c2melendez/precision-lab-lite/actions/runs/41988271747): **SUCCESS**, 22/22 Playwright.
- Certification Runner [41988271724](https://github.com/c2melendez/precision-lab-lite/actions/runs/41988271724): **SUCCESS** en push-only; no certifica dispatch ni persistencia.
- CI estándar [41988271717](https://github.com/c2melendez/precision-lab-lite/actions/runs/41988271717): **FAILURE** en `QA dependency audit (hard gate)`, por 4 findings moderados. No se modificó el umbral.
- Scientific UI [41988271723](https://github.com/c2melendez/precision-lab-lite/actions/runs/41988271723): **IN_PROGRESS** al corte; complementario y no requerido para esta aceptación focalizada.

## Límite de aceptación

- PASS_SCOPED solo para AS-PF-06 en Lite.
- Plus tiene su suite backend PF-01..08; la revisión de oráculos PF-03..05 está en ejecución en otro SHA y no se declara paridad aquí.
- Global certification permanece **OPEN**.
