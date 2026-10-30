# Algebra 114 — aceptación acotada AS-EXP-03 (r361)

**Estado:** PASS_SCOPED — Lite únicamente. No certifica la sección EXP completa ni implica paridad con Plus.

## Caso y oráculo

Fuente normativa: `qa/certification/algebra114_source.md`, fila AS-EXP-03:

`(2x-1)(3x+4) = 6x^2+5x-4`.

Test: `tests/algebra114AsExp03.audit.test.ts`, blob SHA `c3585658febba9c8acc4c2b71e46f6f4fb6ac90d`.

- Verifica la fila exacta del fixture normativo.
- Expande el producto original y exige salida simbólica normalizada `6*x^2+5*x-4`; la normalización elimina whitespace con `/\s+/g`.
- Comprueba cinco sustituciones (`x=-4,-1,0,2,5`) contra el oráculo aritmético independiente `6*x*x+5*x-4`; Algebrite no calcula el expected.
- No se añadió ninguna restricción de dominio no presente en la fila fuente.

## Evidencia exacta

SHA técnico: `0a85b448298df0691b043269648d327d0a7aec0b`, rama `qa/syntax-audit-in625-a1`.

- CI [41141038026](https://github.com/c2melendez/precision-lab-lite/actions/runs/41141038026): SUCCESS; el log confirma el test focalizado (1 test PASS), 366 archivos y 2,259 passed; el job frontend completó sus pasos y build.
- Cumulative [41141037941](https://github.com/c2melendez/precision-lab-lite/actions/runs/41141037941): SUCCESS; el log confirma explícitamente `tests/algebra114AsExp03.audit.test.ts` (1 test PASS), 366 archivos, 2,259 passed, 8 expected fail y 34 todo.
- H1d [41141037866](https://github.com/c2melendez/precision-lab-lite/actions/runs/41141037866): SUCCESS; 22 E2E passed.
- Certification Runner [41141037836](https://github.com/c2melendez/precision-lab-lite/actions/runs/41141037836): SUCCESS en el mismo SHA, evento push; rama canónica, checkout y fingerprint correctos. Dispatch, wait, registro y persistencia SKIPPED; no es un despacho real.
- Scientific UI [41141038013](https://github.com/c2melendez/precision-lab-lite/actions/runs/41141038013): seguía IN_PROGRESS al momento de esta aceptación. Es una comprobación complementaria y no uno de los tres gates exigidos para esta aceptación algebraica; no se presenta como PASS ni se oculta su estado.

## Decisión y continuidad

PASS_SCOPED solo para AS-EXP-03 en Lite. No certifica AS-EXP-04..10, la sección EXP completa, Plus ni la certificación global.

Siguiente: AS-EXP-04, identidad `(x+1)(x^2-x+1)=x^3+1`; exigir salida simbólica normalizada y oráculo aritmético independiente `x*x*x+1` en cinco sustituciones.

**Global certification: OPEN.**
