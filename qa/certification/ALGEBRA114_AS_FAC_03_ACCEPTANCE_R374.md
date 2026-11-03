# Algebra114 AS-FAC-03 — aceptación acotada (r374)

**Estado: PASS_SCOPED — Precision Lab Lite únicamente.** No acredita paridad con Plus, cierre de Algebra114 ni certificación global.

## Identidad técnica

- Repositorio: c2melendez/precision-lab-lite.
- Rama canónica: qa/syntax-audit-in625-a1.
- SHA técnico probado: `5b665763f0b470d9c253a4bf46c56996fcd04667`.
- Fuente original: `qa/certification/algebra114_source.md`, fila AS-FAC-03.
- Blob de fuente: `b30ca7fcec641334ce8128ca25bec542a9d04e79`.
- Test: `tests/algebra114AsFac03.audit.test.ts`.
- Blob del test: `88aab40681955277a57b4ee523e7a3a3df240559`.

## Caso y oráculo independiente

La fila original exige:

`6x^2-11x+3 = (3x-1)(2x-3)`.

El test:
1. Comprueba el contenido exacto de la fila original.
2. Ejecuta `factor(6*x^2-11*x+3)` y exige una salida de producto, sin la llamada `factor(...)` sin evaluar ni el polinomio expandido `x^2`.
3. Comprueba siete sustituciones: `x = -4, -1, 0, 1, 2, 4, 6`.
4. Evalúa numéricamente la salida factorizada y la compara con el oráculo JavaScript independiente `(3*x-1)*(2*x-3)`. El expected no se calcula con Algebrite ni con otra llamada CAS.

El cambio modifica únicamente el test; no cambia el motor matemático.

## Evidencia de ejecución sobre el mismo SHA

- Acumulativo [41616101242](https://github.com/c2melendez/precision-lab-lite/actions/runs/41616101242): **SUCCESS**. El log muestra explícitamente `tests/algebra114AsFac03.audit.test.ts (1 test)`; 366 archivos aprobados, 2,259 passed, 8 expected fail y 34 TODO. Typecheck, unit/parity y build terminaron correctamente.
- H1d [41616101231](https://github.com/c2melendez/precision-lab-lite/actions/runs/41616101231): **SUCCESS**, 22/22 pruebas Playwright aprobadas.
- Certification Runner [41616101369](https://github.com/c2melendez/precision-lab-lite/actions/runs/41616101369): **SUCCESS**. Resolución de la rama canónica desde `main`, checkout y fingerprint del gate completados. El dispatch fue omitido correctamente en el evento push; este run no pretende certificar dispatch/persistencia.
- CI [41616101188](https://github.com/c2melendez/precision-lab-lite/actions/runs/41616101188): **FAILURE** exclusivamente en `QA dependency audit (hard gate)`; el log de la campaña anterior y la actual identifica 8 vulnerabilidades moderadas. Typecheck, unit/parity y build quedaron omitidos por la parada temprana. No se cambió el umbral ni se suprimió el audit.
- La campaña científica complementaria [41616101064](https://github.com/c2melendez/precision-lab-lite/actions/runs/41616101064) no es un gate requerido para esta aceptación y no se utiliza como sustituto de H1d.

## Decisión y límites

AS-FAC-03 queda **PASS_SCOPED para Lite**: fixture exacta, salida factorizada, siete sustituciones contra aritmética JavaScript independiente y gates acumulativo/H1d ejecutados sobre el mismo SHA.

Plus no ejecutó AS-FAC-03; no se infiere paridad. Plus mantiene su siguiente acción bloqueada en VC-FE-45 por el conflicto contractual con EV-I-12. No se debilita ese contrato. La CI estándar de Lite conserva la deuda independiente de npm audit.

**Certificación global: OPEN.**

Siguiente tarea matemática Lite: AS-FAC-04 test-first, fila exacta `x^3-1=(x-1)(x^2+x+1)`, fixture exacta, salida factorizada y siete sustituciones contra el oráculo JavaScript independiente `(x-1)*(x*x+x+1)`. Sin cambiar el motor salvo defecto reproducible.
