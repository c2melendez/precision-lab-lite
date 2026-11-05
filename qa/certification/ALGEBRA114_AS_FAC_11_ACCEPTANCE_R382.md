# Algebra114 AS-FAC-11 — aceptación acotada (r382)

**Estado: PASS_SCOPED — Precision Lab Lite únicamente.** No acredita paridad con Plus, cierre de Algebra114 ni certificación global.

## Identidad técnica

- Repositorio: c2melendez/precision-lab-lite.
- Rama canónica: qa/syntax-audit-in625-a1.
- SHA técnico probado: `0f8dcc3497d231cfbe6aad963d8102cbb4ab71e3`.
- Fuente original: `qa/certification/algebra114_source.md`, fila AS-FAC-11.
- Blob de fuente: `b30ca7fcec641334ce8128ca25bec542a9d04e79`.
- Test: `tests/algebra114AsFac11.audit.test.ts`.
- Blob del test: `34b2bb856cefa6ce3547523ea66a8c59c4c2f5d3`.

## Caso y oráculo independiente

Identidad contractual:

`x^3+x^2+x+1=(x+1)(x^2+1)`

El test comprueba:
1. Fixture exacta de AS-FAC-11.
2. Presencia del factor lineal x+1 y del factor cuadrático x²+1; se rechaza la expresión sin factorizar.
3. Siete sustituciones enteras contra el oráculo JavaScript independiente `(x+1)*(x*x+1)`.

Una primera implementación de la prueba tenía escapes de regex incorrectos; fue corregida antes del SHA aceptado. Solo se acepta la versión final del test en este SHA.

El cambio modifica únicamente el test; no modifica el motor matemático, parser, dependencias ni workflow.

## Evidencia de ejecución sobre el mismo SHA

- Acumulativo [41983335147](https://github.com/c2melendez/precision-lab-lite/actions/runs/41983335147): **SUCCESS**. El log contiene explícitamente `tests/algebra114AsFac11.audit.test.ts`; 366 archivos aprobados, 2,259 passed, 8 expected fail y 34 TODO. Typecheck, regresiones unitarias/paridad y production build terminaron correctamente.
- H1d [41983335288](https://github.com/c2melendez/precision-lab-lite/actions/runs/41983335288): **SUCCESS**, 22/22 pruebas Playwright.
- Certification Runner [41983335273](https://github.com/c2melendez/precision-lab-lite/actions/runs/41983335273): **SUCCESS** en evento push; resolución de rama, checkout y fingerprint. El camino de dispatch/persistencia fue omitido en push y no se certifica aquí.
- CI estándar [41983335251](https://github.com/c2melendez/precision-lab-lite/actions/runs/41983335251): **FAILURE** en `QA dependency audit (hard gate)` por 8 findings moderados. No se modificó el umbral. Este bloqueo de seguridad es distinto de la evidencia matemática acumulativa y H1d.

## Límite de aceptación

- Aprobación solo para AS-FAC-11 en Lite.
- Plus no ejecutó este caso sobre el mismo contrato/fixture; no se declara paridad.
- Global certification permanece **OPEN**.
