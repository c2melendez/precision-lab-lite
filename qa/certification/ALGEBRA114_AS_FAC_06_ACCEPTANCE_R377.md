# Algebra114 AS-FAC-06 — aceptación acotada (r377)

**Estado: PASS_SCOPED — Precision Lab Lite únicamente.** No acredita paridad con Plus, cierre de Algebra114 ni certificación global.

## Identidad técnica

- Repositorio: c2melendez/precision-lab-lite.
- Rama canónica: qa/syntax-audit-in625-a1.
- SHA técnico probado: `867accddd1e8395e737b5d3c482d367ce2fda132`.
- Fuente original: `qa/certification/algebra114_source.md`, fila AS-FAC-06.
- Blob de fuente: `b30ca7fcec641334ce8128ca25bec542a9d04e79`.
- Test: `tests/algebra114AsFac06.audit.test.ts`.
- Blob del test: `363731b4642a338d62ce64b34db63191e04a95e2`.

## Caso y oráculo independiente

La fila original exige:

`x^3-6x^2+11x-6 = (x-1)(x-2)(x-3)`.

El test:
1. Comprueba el contenido exacto de la fila original.
2. Ejecuta `factor(x^3-6*x^2+11*x-6)`, exige al menos dos operadores de multiplicación (tres factores lineales) y rechaza el polinomio expandido `x^3`.
3. Comprueba siete sustituciones: `x = -4, -1, 0, 1, 2, 3, 4`.
4. Evalúa numéricamente la salida factorizada y la compara con el oráculo JavaScript independiente `(x-1)*(x-2)*(x-3)`. El expected no se calcula con Algebrite ni con otra llamada CAS.

El cambio modifica únicamente el test; no cambia el motor matemático.

## Evidencia de ejecución sobre el mismo SHA

- Acumulativo [41617198488](https://github.com/c2melendez/precision-lab-lite/actions/runs/41617198488): **SUCCESS**. El log muestra explícitamente `tests/algebra114AsFac06.audit.test.ts (1 test)`; 366 archivos aprobados, 2,259 passed, 8 expected fail y 34 TODO. Typecheck, unit/parity y build terminaron correctamente.
- H1d [41617198436](https://github.com/c2melendez/precision-lab-lite/actions/runs/41617198436): **SUCCESS**, 22/22 pruebas Playwright aprobadas.
- Certification Runner [41617198446](https://github.com/c2melendez/precision-lab-lite/actions/runs/41617198446): **SUCCESS**. Resolución de la rama canónica desde `main`, checkout y fingerprint del gate completados. El dispatch fue omitido correctamente en el evento push; este run no pretende certificar dispatch/persistencia.
- CI [41617198393](https://github.com/c2melendez/precision-lab-lite/actions/runs/41617198393): **FAILURE** exclusivamente en `QA dependency audit (hard gate)`; el log informa 8 vulnerabilidades moderadas. Typecheck, unit/parity y build quedaron omitidos por la parada temprana. No se cambió el umbral ni se suprimió el audit.

## Decisión y límites

AS-FAC-06 queda **PASS_SCOPED para Lite**: fixture exacta, tres factores lineales, siete sustituciones contra aritmética JavaScript independiente y gates acumulativo/H1d ejecutados sobre el mismo SHA.

Plus no ejecutó AS-FAC-06; no se infiere paridad. Plus mantiene su siguiente acción bloqueada en VC-FE-45 por el conflicto contractual con EV-I-12. No se debilita ese contrato. La CI estándar de Lite conserva la deuda independiente de npm audit.

**Certificación global: OPEN.**

Siguiente tarea matemática Lite: AS-FAC-07 test-first, fila exacta `x^4-5x^2+4=(x-1)(x+1)(x-2)(x+2)`, fixture exacta, salida de cuatro factores lineales y ocho sustituciones contra el oráculo JavaScript independiente `(x-1)*(x+1)*(x-2)*(x+2)`. Sin cambiar el motor salvo defecto reproducible.
