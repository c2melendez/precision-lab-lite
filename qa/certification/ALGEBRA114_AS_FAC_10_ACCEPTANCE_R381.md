# Algebra114 AS-FAC-10 — aceptación acotada (r381)

**Estado: PASS_SCOPED — Precision Lab Lite únicamente.** No acredita paridad con Plus, cierre de Algebra114 ni certificación global.

## Identidad técnica

- Repositorio: c2melendez/precision-lab-lite.
- Rama canónica: qa/syntax-audit-in625-a1.
- SHA técnico probado: `6312a16de6959f1f7c739a4b9c59274b77fab86e`.
- Fuente original: `qa/certification/algebra114_source.md`, fila AS-FAC-10.
- Blob de fuente: `b30ca7fcec641334ce8128ca25bec542a9d04e79`.
- Test: `tests/algebra114AsFac10.audit.test.ts`.
- Blob del test: `27c70add37494f1163cf626af62c5b8adfb6a621`.

## Caso y oráculo independiente

Identidad contractual:

`x^3+y^3=(x+y)(x^2-xy+y^2)`

El test comprueba:
1. Fixture exacta de la fila original AS-FAC-10.
2. Estructura del resultado con un factor lineal y uno cuadrático.
3. Sustituciones numéricas comparadas con el oráculo JavaScript independiente; el motor CAS no genera los valores expected.

La aceptación cubre solo esta identidad y las sustituciones listadas en el test; no representa una certificación general de factorización.

El cambio modifica únicamente el test; no modifica el motor matemático, parser, dependencias ni workflow.

## Evidencia de ejecución sobre el mismo SHA

- Acumulativo [41619183893](https://github.com/c2melendez/precision-lab-lite/actions/runs/41619183893): **SUCCESS**. El log contiene explícitamente `tests/algebra114AsFac10.audit.test.ts`; 366 archivos aprobados, 2,259 passed, 8 expected fail y 34 TODO. Typecheck, regresiones unitarias/paridad y production build terminaron correctamente.
- H1d [41619183741](https://github.com/c2melendez/precision-lab-lite/actions/runs/41619183741): **SUCCESS**, 22/22 pruebas Playwright.
- Certification Runner [41619183775](https://github.com/c2melendez/precision-lab-lite/actions/runs/41619183775): **SUCCESS** en evento push; resolución de rama, checkout y fingerprint. El camino de dispatch/persistencia fue omitido en push y no se certifica aquí.
- CI estándar [41619183745](https://github.com/c2melendez/precision-lab-lite/actions/runs/41619183745): **FAILURE** en `QA dependency audit (hard gate)` por 8 findings moderados. No se modificó el umbral. Este bloqueo de seguridad es distinto de la evidencia matemática acumulativa y H1d.

## Límite de aceptación

- Aprobación solo para AS-FAC-10 en Lite.
- Plus no ejecutó este caso sobre el mismo contrato/fixture; no se declara paridad.
- Global certification permanece **OPEN**.
