# Algebra114 AS-FAC-12 — aceptación acotada (r383)

**Estado: PASS_SCOPED — Precision Lab Lite únicamente.** No acredita paridad con Plus, cierre de Algebra114 ni certificación global.

## Identidad técnica

- Repositorio: c2melendez/precision-lab-lite.
- Rama canónica: qa/syntax-audit-in625-a1.
- SHA técnico probado: `960cfb4abb8e1f0dfaed50a90d6cdf8d91f5d1a5`.
- Fuente original: `qa/certification/algebra114_source.md`, fila AS-FAC-12.
- Blob de fuente: `b30ca7fcec641334ce8128ca25bec542a9d04e79`.
- Test: `tests/algebra114AsFac12.audit.test.ts`.
- Blob del test: `a2428ffe9aa6d9ad39e799c6f7b0580aaa05eea9`.

## Caso y oráculo independiente

Identidad contractual:

`x²(y-z)+y²(z-x)+z²(x-y)=(x-y)(x-z)(y-z)`

El test comprueba:
1. Fixture exacta de la fila AS-FAC-12.
2. Estructura de tres factores lineales y rechazo de la forma cuadrática original no factorizada.
3. 216 ternas de sustituciones, con valores de `[-3,-1,0,1,2,4]` para cada variable, comparadas con `(x-y)*(x-z)*(y-z)` calculado en JavaScript.

La aceptación es acotada a la identidad alternante y a las 216 combinaciones ensayadas.

El cambio modifica únicamente el test; no modifica el motor matemático, parser, dependencias ni workflow.

## Evidencia de ejecución sobre el mismo SHA

- Acumulativo [41983612691](https://github.com/c2melendez/precision-lab-lite/actions/runs/41983612691): **SUCCESS**. El log contiene explícitamente `tests/algebra114AsFac12.audit.test.ts`; 366 archivos aprobados, 2,259 passed, 8 expected fail y 34 TODO. Typecheck, regresiones unitarias/paridad y production build terminaron correctamente.
- H1d [41983612688](https://github.com/c2melendez/precision-lab-lite/actions/runs/41983612688): **SUCCESS**, 22/22 pruebas Playwright.
- Certification Runner [41983612674](https://github.com/c2melendez/precision-lab-lite/actions/runs/41983612674): **SUCCESS** en evento push; resolución de rama, checkout y fingerprint. El camino de dispatch/persistencia fue omitido en push y no se certifica aquí.
- CI estándar [41983612649](https://github.com/c2melendez/precision-lab-lite/actions/runs/41983612649): **FAILURE** en `QA dependency audit (hard gate)` por 8 findings moderados. No se modificó el umbral. Este bloqueo de seguridad es distinto de la evidencia matemática acumulativa y H1d.

## Límite de aceptación

- Aprobación solo para AS-FAC-12 en Lite.
- Plus no ejecutó este caso sobre el mismo contrato/fixture; no se declara paridad.
- Global certification permanece **OPEN**.
