# Algebra114 AS-PF-07 — aceptación acotada (r390)

**Estado: PASS_SCOPED — Precision Lab Lite únicamente.** No acredita paridad con Plus, cierre de Algebra114 ni certificación global.

## Identidad técnica

- Repositorio: c2melendez/precision-lab-lite.
- Rama canónica: qa/syntax-audit-in625-a1.
- SHA técnico probado: `34e4e77d699d3c73e15dda533fbfaa17e82c8b67`.
- Fuente original: `qa/certification/algebra114_source.md`, fila AS-PF-07.
- Blob de fuente: `b30ca7fcec641334ce8128ca25bec542a9d04e79`.
- Test: `tests/algebra114AsPf07.audit.test.ts`.
- Blob del test: `3e27e51c7452ff3b11f98de0a807f0d7c906aa4d`.

## Caso y oráculo independiente

La fila original exige:

`x/((x^2+1)(x^2+4)) = x/(3(x^2+1)) - x/(3(x^2+4))`.

El test:
1. Comprueba la fila original exacta.
2. Ejecuta `partfrac`, rechaza la llamada sin evaluar y exige los dos términos con numerador lineal (x), denominadores (x^2+1), (x^2+4) y signos correctos.
3. Comprueba siete sustituciones enteras `[-5,-2,-1,0,1,2,5]`.
4. Compara con dos oráculos JavaScript independientes: la forma descompuesta y la fracción original `x/((x*x+1)*(x*x+4))).

El cambio modifica únicamente el test; no cambia motor, parser, dependencias ni workflows.

## Evidencia sobre el mismo SHA

- Acumulativo [41988713632](https://github.com/c2melendez/precision-lab-lite/actions/runs/41988713632): **SUCCESS**. El log muestra `tests/algebra114AsPf07.audit.test.ts (1 test)`; 366 archivos aprobados, 2,259 passed, 8 expected fail y 34 TODO. Typecheck, regresiones y build terminaron correctamente.
- H1d [41988713569](https://github.com/c2melendez/precision-lab-lite/actions/runs/41988713569): **SUCCESS**, 22/22 Playwright.
- Certification Runner [41988713657](https://github.com/c2melendez/precision-lab-lite/actions/runs/41988713657): **SUCCESS**, push-only; no certifica dispatch ni persistencia.
- CI estándar [41988713436](https://github.com/c2melendez/precision-lab-lite/actions/runs/41988713436): **FAILURE** en `QA dependency audit (hard gate)`, por 4 findings moderados; no se cambió el umbral.
- Scientific UI [41988713564](https://github.com/c2melendez/precision-lab-lite/actions/runs/41988713564): **IN_PROGRESS** al corte, complementario.

## Límite de aceptación

- PASS_SCOPED solo para AS-PF-07 en Lite.
- Plus tiene ejecución backend independiente de PF-01..08; las filas PF-03..05 están aceptadas con oráculos Fraction, sin afirmar paridad UI.
- Global certification permanece **OPEN**.
