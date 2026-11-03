# Algebra114 AS-EXP-09 — aceptación acotada (r370)

**Estado: PASS_SCOPED — Precision Lab Lite únicamente.** No acredita paridad con Plus, cierre de Algebra114 ni certificación global.

## Identidad técnica

- Repositorio: c2melendez/precision-lab-lite.
- Rama canónica: qa/syntax-audit-in625-a1.
- SHA técnico probado: 13bf8b535a00b40c464057dc663b2d97ea6c44bd.
- Fuente original: qa/certification/algebra114_source.md, fila AS-EXP-09.
- Blob de la fuente: b30ca7fcec641334ce8128ca25bec542a9d04e79.
- Test: tests/algebra114AsExp09.audit.test.ts.
- Blob final del test: 9ca2c77978836221bebb44b3a8401cf344c0550b.

## Caso y oráculo independiente

La fila original exige expandir:

(a+b+c)^2 = a^2+b^2+c^2+2ab+2ac+2bc.

El test:
1. Comprueba el texto exacto de la fila fuente.
2. Expande el producto con Algebrite y compara el multiconjunto simbólico de seis monomios, incluidos los tres términos cruzados.
3. Comprueba seis sustituciones multivariables: (1,2,3), (-2,3,5), (0,-1,2), (-3,-4,-5), (1,-1,0) y (4,-2,1).
4. Calcula el expected con aritmética JavaScript independiente: (a+b+c)*(a+b+c). Algebrite no genera el expected.

El test se corrigió en el commit 13bf8b535a00b40c464057dc663b2d97ea6c44bd: se eliminaron escapes duplicados que impedían la sustitución de variables y la normalización de espacios. El motor de cálculo no cambió.

## Evidencia de ejecución en el mismo SHA

- CI [41612413592](https://github.com/c2melendez/precision-lab-lite/actions/runs/41612413592): FAILURE exclusivamente en el paso QA dependency audit (hard gate). El artefacto npm audit registra 8 vulnerabilidades moderadas, 0 altas y 0 críticas. No se modificaron dependencias ni se relajó/suprimió el gate. Este resultado queda como asunto de seguridad/dependencias separado; no se declara CI SUCCESS.
- Acumulativo [41612413595](https://github.com/c2melendez/precision-lab-lite/actions/runs/41612413595): SUCCESS. Typecheck, test unitario/paridad y build aprobados. Ejecutó 366 archivos de prueba: 2,259 passed, 8 expected fail y 34 TODO. AS-EXP-09 figura explícitamente aprobado en los logs.
- H1d [41612413591](https://github.com/c2melendez/precision-lab-lite/actions/runs/41612413591): SUCCESS, 22/22 pruebas Playwright aprobadas.
- Scientific UI [41612413794](https://github.com/c2melendez/precision-lab-lite/actions/runs/41612413794): complementario; no forma parte de los gates requeridos para esta aceptación.
- Certification Runner [41612413677](https://github.com/c2melendez/precision-lab-lite/actions/runs/41612413677): FAILURE en la resolución inicial de rama desde el README de la rama predeterminada. No llegó a checkout ni despachó gates; no se usa como evidencia matemática.

## Decisión y límites

AS-EXP-09 queda PASS_SCOPED para Lite por la fixture exacta, el multiconjunto simbólico, el oráculo aritmético independiente y los gates acumulativo/H1d ejecutados sobre el mismo SHA. La deuda de npm audit y el problema independiente de resolución del Certification Runner permanecen abiertos y no se ocultan ni se convierten en PASS.

Plus no ejecutó AS-EXP-09 en esta aceptación. No se infiere paridad. En Plus, VC-FE-45 continúa BLOCKED por el conflicto versionado con EV-I-12. Certificación global: OPEN.

Siguiente tarea matemática Lite: AS-EXP-10 test-first; sustituir el expected CAS-vs-CAS existente por un multiconjunto simbólico y un oráculo JavaScript independiente para -(x-1)*(x+2).
