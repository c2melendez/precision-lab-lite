# Algebra 114 — aceptación acotada AS-EXP-04 (r362)

**Estado:** PASS_SCOPED — Lite únicamente. No certifica la sección EXP completa ni implica paridad con Plus.

## Caso y oráculo

Fuente normativa: `qa/certification/algebra114_source.md`, fila AS-EXP-04:

`(x+1)(x^2-x+1) = x^3+1`.

Test: `tests/algebra114AsExp04.audit.test.ts`, blob SHA `753c1d83b7a44fb166fd502ccb545259d331c697`.

- Verifica la fila exacta del fixture normativo.
- Expande el producto original y exige salida simbólica normalizada `x^3+1`, eliminando whitespace con `/\s+/g`.
- Comprueba cinco sustituciones (`x=-4,-1,0,2,5`) contra el oráculo aritmético independiente `x*x*x+1`; Algebrite no calcula el expected.
- No se añadió ninguna restricción de dominio no presente en la fila fuente.

## Evidencia exacta

SHA técnico: `933fad5c3e55db06db9de6ff21e02cd96070da0f`, rama `qa/syntax-audit-in625-a1`.

- CI [41141571381](https://github.com/c2melendez/precision-lab-lite/actions/runs/41141571381): SUCCESS; el log confirma el test focalizado (1 test PASS), 366 archivos y 2,259 passed.
- Cumulative [41141571350](https://github.com/c2melendez/precision-lab-lite/actions/runs/41141571350): SUCCESS; el log confirma explícitamente `tests/algebra114AsExp04.audit.test.ts` (1 test PASS), 366 archivos, 2,259 passed, 8 expected fail y 34 todo.
- H1d [41141571338](https://github.com/c2melendez/precision-lab-lite/actions/runs/41141571338): SUCCESS; 22 E2E passed.
- Certification Runner [41141571479](https://github.com/c2melendez/precision-lab-lite/actions/runs/41141571479): SUCCESS en el mismo SHA, evento push; rama canónica, checkout y fingerprint correctos. Dispatch, wait, registro y persistencia SKIPPED; no es un despacho real.
- Scientific UI [41141571351](https://github.com/c2melendez/precision-lab-lite/actions/runs/41141571351): seguía IN_PROGRESS al momento de esta aceptación. Es una comprobación complementaria, no uno de los tres gates exigidos para esta aceptación algebraica; no se presenta como PASS.

## Decisión y continuidad

PASS_SCOPED solo para AS-EXP-04 en Lite. No certifica AS-EXP-05..10, la sección EXP completa, Plus ni la certificación global.

Siguiente: AS-EXP-05, recuperar la fila original y auditar la expansión con salida simbólica normalizada y oráculo aritmético independiente; no asumir equivalencia por nombre de test ni aceptar CAS-vs-CAS.

**Global certification: OPEN.**
