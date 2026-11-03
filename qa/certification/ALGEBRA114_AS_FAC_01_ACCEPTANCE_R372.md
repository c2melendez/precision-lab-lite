# Algebra114 AS-FAC-01 — aceptación acotada (r372)

**Estado: PASS_SCOPED — Precision Lab Lite únicamente.** No acredita paridad con Plus, cierre de Algebra114 ni certificación global.

## Identidad técnica

- Repositorio: c2melendez/precision-lab-lite.
- Rama canónica: qa/syntax-audit-in625-a1.
- SHA técnico probado: e738a0650bf3156eea40ad58c328a86d10e6be0d.
- Fuente original: qa/certification/algebra114_source.md, fila AS-FAC-01.
- Blob de fuente: b30ca7fcec641334ce8128ca25bec542a9d04e79.
- Test: tests/algebra114AsFac01.audit.test.ts.
- Blob final del test: a6f6ebfe43b7e131dfc80ef960b1f542dac4d2f9.

## Caso y oráculo independiente

La fila original exige factorizar:

x^2-9 = (x-3)(x+3).

El test:
1. Comprueba el texto exacto de la fila fuente.
2. Invoca factor(x^2-9) y exige que el resultado sea una forma de producto: contiene el operador de multiplicación, no conserva x^2 ni devuelve la llamada factor(...) sin evaluar.
3. Comprueba siete sustituciones: x = -5, -3, -2, 0, 3, 4 y 7.
4. Compara el valor numérico calculado desde la forma factorizada contra el oráculo JavaScript independiente (x-3)*(x+3). El expected no se genera con Algebrite.

El cambio fortalece exclusivamente el test; no modifica el motor matemático.

## Evidencia de ejecución en el mismo SHA

- Acumulativo [41614055867](https://github.com/c2melendez/precision-lab-lite/actions/runs/41614055867): SUCCESS. Typecheck, unit/parity y build SUCCESS. Ejecutó 366 archivos de prueba: 2,259 passed, 8 expected fail y 34 TODO. AS-FAC-01 figura explícitamente aprobado en el log.
- H1d [41614055846](https://github.com/c2melendez/precision-lab-lite/actions/runs/41614055846): SUCCESS, 22/22 pruebas Playwright aprobadas.
- CI [41614055833](https://github.com/c2melendez/precision-lab-lite/actions/runs/41614055833): FAILURE exclusivamente en QA dependency audit (hard gate). Se mantiene el hallazgo previo de 8 vulnerabilidades moderadas, 0 altas y 0 críticas. Typecheck, unit/parity y build quedaron skipped por la parada temprana del audit; no se declara CI SUCCESS ni se relajó el umbral.
- Certification Runner [41614055823](https://github.com/c2melendez/precision-lab-lite/actions/runs/41614055823): FAILURE en la resolución de rama desde el README de la rama predeterminada. No llegó a checkout ni despachó gates; no es evidencia matemática.
- Scientific UI [41614055873](https://github.com/c2melendez/precision-lab-lite/actions/runs/41614055873): complementario y no requerido para esta aceptación.

## Decisión y límites

AS-FAC-01 queda PASS_SCOPED para Lite por fixture exacta, salida factorizada verificable, siete sustituciones con expected independiente y gates acumulativo/H1d ejecutados sobre el mismo SHA. La deuda de npm audit y el problema independiente de resolución del Certification Runner permanecen abiertos y no se convierten en PASS.

Plus no ejecutó AS-FAC-01 en esta aceptación. No se infiere paridad. En Plus, VC-FE-45 continúa BLOCKED por el conflicto versionado con EV-I-12. Certificación global: OPEN.

Siguiente tarea matemática Lite: AS-FAC-02 test-first; fixture x^2+5x+6 = (x+2)(x+3), afirmar la forma factorizada y probar siete sustituciones contra el oráculo JavaScript independiente (x+2)*(x+3).
