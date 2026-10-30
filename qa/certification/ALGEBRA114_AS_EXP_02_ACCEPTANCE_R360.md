# Algebra 114 — aceptación acotada AS-EXP-02 (r360)

**Estado:** PASS_SCOPED — Lite únicamente. No certifica la sección EXP completa ni implica paridad con Plus.

## Caso y oráculo

Fuente normativa: `qa/certification/algebra114_source.md`, fila AS-EXP-02:

`(x+2)^2 = x^2+4x+4`.

Test: `tests/algebra114AsExp02.audit.test.ts`, blob SHA `9d4cd2e8fb1e70ce37a3aa47ef05cbf78083cc04`.

- Verifica que la fila original permanezca en el fixture normativo.
- Expande el miembro original y comprueba la salida simbólica normalizada `x^2+4*x+4`.
- Comprueba cinco sustituciones (`x=-4,-2,-1,0,3`) contra el oráculo aritmético independiente `x*x + 4*x + 4`; Algebrite no calcula el expected.
- La fila no introduce una exclusión de dominio; no se añadió ninguna condición artificial.

## Evidencia exacta

SHA técnico: `c8c29d820e5bd16ab4df8a528bcea9b4a72f8acc`, rama `qa/syntax-audit-in625-a1`.

- CI [41138509410](https://github.com/c2melendez/precision-lab-lite/actions/runs/41138509410): SUCCESS; QA dependency audit, typecheck, unit/parity y production build SUCCESS.
- Cumulative [41138509481](https://github.com/c2melendez/precision-lab-lite/actions/runs/41138509481): SUCCESS; 366 archivos, 2,259 passed, 8 expected fail, 34 todo. El log confirma explícitamente `tests/algebra114AsExp02.audit.test.ts` (1 test PASS).
- H1d [41138509536](https://github.com/c2melendez/precision-lab-lite/actions/runs/41138509536): SUCCESS; 22 E2E passed.
- Scientific UI [41138509494](https://github.com/c2melendez/precision-lab-lite/actions/runs/41138509494): SUCCESS; 456 passed. Evidencia complementaria, no sustituye el oráculo algebraico.
- Certification Runner [41138509571](https://github.com/c2melendez/precision-lab-lite/actions/runs/41138509571): SUCCESS en el mismo SHA. Evento push; resolvió la rama canónica y calculó la huella. Dispatch, espera, registro y persistencia fueron SKIPPED por diseño; no se inició otro gate.

## Decisión y continuidad

PASS_SCOPED solo para AS-EXP-02 en Lite. No certifica AS-EXP-03..10, la sección EXP completa, Plus ni la certificación global.

Siguiente: AS-EXP-03, fila fuente `(2x-1)(3x+4)=6x^2+5x-4`; sustituir cualquier expected CAS-vs-CAS por oráculo aritmético independiente y validar salida simbólica normalizada.

**Global certification: OPEN.**
