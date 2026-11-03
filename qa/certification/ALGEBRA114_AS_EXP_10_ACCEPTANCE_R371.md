# Algebra114 AS-EXP-10 — aceptación acotada (r371)

**Estado: PASS_SCOPED — Precision Lab Lite únicamente.** No acredita paridad con Plus, cierre de Algebra114 ni certificación global.

## Identidad técnica

- Repositorio: c2melendez/precision-lab-lite.
- Rama canónica: qa/syntax-audit-in625-a1.
- SHA técnico probado: 5a6662e03e413063f9e73ca1f4210b7a155da5ca.
- Fuente original: qa/certification/algebra114_source.md, fila AS-EXP-10.
- Blob de fuente: b30ca7fcec641334ce8128ca25bec542a9d04e79.
- Test: tests/algebra114AsExp10.audit.test.ts.
- Blob final del test: 921e144418a73af451e4c6de17bcba5cb953365a.

## Caso y oráculo independiente

La fila original exige expandir:

-(x-1)(x+2) = -x^2-x+2.

El test:
1. Comprueba el texto exacto de la fila fuente.
2. Expande la expresión y compara el multiconjunto simbólico de los tres términos: -x^2, -x y 2.
3. Comprueba siete sustituciones: x = -4, -2, -1, 0, 1, 3 y 5.
4. Calcula el expected con aritmética JavaScript independiente: -(x-1)*(x+2). Algebrite no genera el expected.

El cambio solo fortalece el test: sustituye la comparación CAS-vs-CAS y la comprobación parcial del fixture por fixture exacta, términos simbólicos y oráculo externo. El motor no cambió.

## Evidencia de ejecución en el mismo SHA

- Acumulativo [41613294097](https://github.com/c2melendez/precision-lab-lite/actions/runs/41613294097): SUCCESS. Typecheck, test unitario/paridad y build aprobados. Ejecutó 366 archivos de prueba: 2,259 passed, 8 expected fail y 34 TODO. AS-EXP-10 aparece explícitamente aprobado.
- H1d [41613294038](https://github.com/c2melendez/precision-lab-lite/actions/runs/41613294038): SUCCESS, 22/22 pruebas Playwright aprobadas.
- CI [41613294023](https://github.com/c2melendez/precision-lab-lite/actions/runs/41613294023): FAILURE exclusivamente en QA dependency audit (hard gate). El artefacto npm audit conserva 8 vulnerabilidades moderadas, 0 altas y 0 críticas. No se modificaron dependencias ni se relajó el gate; no se declara CI SUCCESS.
- Certification Runner [41613294032](https://github.com/c2melendez/precision-lab-lite/actions/runs/41613294032): FAILURE en la resolución inicial de rama desde el README predeterminado. No llegó a checkout ni despachó gates; no se usa como evidencia matemática.
- Scientific UI [41613294123](https://github.com/c2melendez/precision-lab-lite/actions/runs/41613294123): complementario; no requerido para la aceptación Algebra114.

## Decisión y límites

AS-EXP-10 queda PASS_SCOPED para Lite por fixture exacta, multiconjunto simbólico, siete sustituciones con expected independiente y gates acumulativo/H1d ejecutados sobre el mismo SHA. La deuda de npm audit y el problema independiente de resolución del Certification Runner permanecen abiertos y no se convierten en PASS.

Plus no ejecutó AS-EXP-10 en esta aceptación. No se infiere paridad. En Plus, VC-FE-45 continúa BLOCKED por el conflicto versionado con EV-I-12. Certificación global: OPEN.

Siguiente tarea matemática Lite: AS-FAC-01 test-first; fortalecer el test actual de x^2-9 para verificar la forma factorizada y siete sustituciones con oráculo JavaScript independiente (x-3)*(x+3).
