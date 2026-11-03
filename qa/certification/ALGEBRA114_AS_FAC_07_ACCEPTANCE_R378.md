# Algebra114 AS-FAC-07 — aceptación acotada (r378)

**Estado: PASS_SCOPED — Precision Lab Lite únicamente.** No acredita paridad con Plus, cierre de Algebra114 ni certificación global.

## Identidad técnica

- Repositorio: c2melendez/precision-lab-lite.
- Rama canónica: qa/syntax-audit-in625-a1.
- SHA técnico probado: `a6f45dde0625abd807538791264799c9112648ed`.
- Fuente original: `qa/certification/algebra114_source.md`, fila AS-FAC-07.
- Blob de fuente: `b30ca7fcec641334ce8128ca25bec542a9d04e79`.
- Test: `tests/algebra114AsFac07.audit.test.ts`.
- Blob del test: `38e8f12d8b48ffab019cdfa9ca5abee5becd1aaf`.

## Caso y oráculo independiente

La fila original exige:

`x^4-5x^2+4 = (x-1)(x+1)(x-2)(x+2)`.

El test:
1. Comprueba el contenido exacto de la fila original.
2. Ejecuta `factor(x^4-5*x^2+4)` y exige al menos tres operadores de multiplicación, correspondientes a cuatro factores lineales; rechaza la llamada `factor(...)` sin evaluar y el polinomio expandido `x^4`.
3. Comprueba ocho sustituciones: `x = -4, -2, -1, 0, 1, 2, 3, 4`.
4. Evalúa numéricamente la salida factorizada y la compara con el oráculo JavaScript independiente `(x-1)*(x+1)*(x-2)*(x+2)`. El expected no se calcula con Algebrite ni con otra llamada CAS.

El cambio modifica únicamente el test; no cambia el motor matemático.

## Evidencia de ejecución sobre el mismo SHA

- Acumulativo [41617678117](https://github.com/c2melendez/precision-lab-lite/actions/runs/41617678117): **SUCCESS**. El log muestra explícitamente `tests/algebra114AsFac07.audit.test.ts (1 test)`; 366 archivos aprobados, 2,259 passed, 8 expected fail y 34 TODO. Typecheck, unit/parity y build terminaron correctamente.
- H1d [41617678044](https://github.com/c2melendez/precision-lab-lite/actions/runs/41617678044): **SUCCESS**, 22/22 pruebas Playwright aprobadas.
- Certification Runner [41617678059](https://github.com/c2melendez/precision-lab-lite/actions/runs/41617678059): **SUCCESS**. Resolución de la rama canónica desde `main`, checkout y fingerprint del gate completados. El dispatch fue omitido correctamente en el evento push; este run no pretende certificar dispatch/persistencia.
- CI [41617678130](https://github.com/c2melendez/precision-lab-lite/actions/runs/41617678130): **FAILURE** exclusivamente en `QA dependency audit (hard gate)`; el log del audit informa 8 vulnerabilidades moderadas. Typecheck, unit/parity y build quedaron omitidos por la parada temprana. No se cambió el umbral ni se suprimió el audit.

## Decisión y límites

AS-FAC-07 queda **PASS_SCOPED para Lite**: fixture exacta, cuatro factores lineales, ocho sustituciones contra aritmética JavaScript independiente y gates acumulativo/H1d ejecutados sobre el mismo SHA.

Plus no ejecutó AS-FAC-07; no se infiere paridad. Plus mantiene su siguiente acción bloqueada en VC-FE-45 por el conflicto contractual con EV-I-12. No se debilita ese contrato. La CI estándar de Lite conserva la deuda independiente de npm audit.

**Certificación global: OPEN.**

Siguiente tarea matemática Lite: AS-FAC-08 test-first, fila exacta `x^4+4=(x^2-2x+2)(x^2+2x+2)`, fixture exacta, salida de dos factores cuadráticos reales y ocho sustituciones contra el oráculo JavaScript independiente `(x*x-2*x+2)*(x*x+2*x+2)`. Sin cambiar el motor salvo defecto reproducible.
