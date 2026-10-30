# Algebra 114 — aceptación acotada AS-EXP-05 (r364)

**Estado:** PASS_SCOPED — Lite únicamente. No certifica la sección EXP completa ni implica paridad con Plus.

## Caso y oráculo

Fuente normativa: `qa/certification/algebra114_source.md`, fila AS-EXP-05:

`(x-1)(x^2+x+1) = x^3-1`.

Test: `tests/algebra114AsExp05.audit.test.ts`, blob SHA `b6985e7139ca77edc78faa48f6d55104d76a2627`.

- Verifica la fila exacta del fixture normativo.
- Expande el producto original y exige salida simbólica normalizada `x^3-1`, eliminando whitespace con `/\s+/g`.
- Comprueba seis sustituciones (`x=-4,-1,0,1,2,5`) contra el oráculo aritmético independiente `x*x*x-1`; Algebrite no calcula el expected.
- No se añadió ninguna restricción de dominio no presente en la fila fuente.

## Evidencia exacta

SHA técnico: `4341955335d6898c4979063520432f82a6d129ba`, rama `qa/syntax-audit-in625-a1`.

- CI [41142010457](https://github.com/c2melendez/precision-lab-lite/actions/runs/41142010457): SUCCESS; el log confirma el test focalizado (1 test PASS), 366 archivos y 2,259 passed.
- Cumulative [41142010406](https://github.com/c2melendez/precision-lab-lite/actions/runs/41142010406): SUCCESS; el log confirma explícitamente `tests/algebra114AsExp05.audit.test.ts` (1 test PASS), 366 archivos, 2,259 passed, 8 expected fail y 34 todo.
- H1d [41142010389](https://github.com/c2melendez/precision-lab-lite/actions/runs/41142010389): SUCCESS; 22 E2E passed.
- Certification Runner [41142010410](https://github.com/c2melendez/precision-lab-lite/actions/runs/41142010410): SUCCESS en el mismo SHA, evento push; rama canónica, checkout y fingerprint correctos. Dispatch, wait, registro y persistencia SKIPPED; no es un despacho real.
- Scientific UI [41142010385](https://github.com/c2melendez/precision-lab-lite/actions/runs/41142010385): seguía IN_PROGRESS al momento de esta aceptación. Es una comprobación complementaria, no uno de los tres gates exigidos para esta aceptación algebraica; no se presenta como PASS.

## Decisión y continuidad

PASS_SCOPED solo para AS-EXP-05 en Lite. No certifica AS-EXP-06..10, la sección EXP completa, Plus ni la certificación global.

Siguiente: AS-EXP-06, recuperar la fila original y verificar su salida simbólica con un oráculo aritmético independiente; no inferir equivalencia ni dominio desde casos vecinos.

**Global certification: OPEN.**
