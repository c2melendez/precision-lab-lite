# Algebra114 AS-FAC-02 — aceptación acotada (r373)

**Estado: PASS_SCOPED — Precision Lab Lite únicamente.** No acredita paridad con Plus, cierre de Algebra114 ni certificación global.

## Identidad técnica

- Repositorio: c2melendez/precision-lab-lite.
- Rama canónica: qa/syntax-audit-in625-a1.
- SHA técnico probado: `4a14dd0bd6c1797a5415b93ced37d53425d68908`.
- Fuente original: `qa/certification/algebra114_source.md`, fila AS-FAC-02.
- Blob de fuente: `b30ca7fcec641334ce8128ca25bec542a9d04e79`.
- Test: `tests/algebra114AsFac02.audit.test.ts`.
- Blob del test: `4bd7a2b2e6d4a80dc99821f29cb95a94be6cc87a`.

## Caso y oráculo independiente

La fila original exige:

`x^2+5x+6 = (x+2)(x+3)`.

El test:
1. Comprueba el contenido exacto de la fila original.
2. Ejecuta `factor(x^2+5*x+6)` y exige una salida de producto, sin la llamada `factor(...)` sin evaluar ni el polinomio expandido `x^2`.
3. Comprueba siete sustituciones: `x = -6, -3, -2, -1, 0, 2, 4`.
4. Evalúa numéricamente la salida factorizada y la compara con el oráculo JavaScript independiente `(x + 2) * (x + 3)`. El expected no se calcula con Algebrite ni con otra llamada CAS.

El cambio modifica únicamente el test; no cambia el motor matemático.

## Evidencia de ejecución sobre el mismo SHA

- Acumulativo [41615433227](https://github.com/c2melendez/precision-lab-lite/actions/runs/41615433227): **SUCCESS**. El log muestra explícitamente `tests/algebra114AsFac02.audit.test.ts (1 test)`; 366 archivos aprobados, 2,259 passed, 8 expected fail y 34 TODO. Typecheck, unit/parity y build terminaron correctamente.
- H1d [41615433418](https://github.com/c2melendez/precision-lab-lite/actions/runs/41615433418): **SUCCESS**, 22/22 pruebas Playwright aprobadas.
- Certification Runner [41615433272](https://github.com/c2melendez/precision-lab-lite/actions/runs/41615433272): **SUCCESS**. Resolución de la rama canónica desde `main`, checkout y fingerprint del gate completados. El dispatch fue omitido correctamente en el evento push; este run no pretende certificar dispatch/persistencia.
- CI [41615433266](https://github.com/c2melendez/precision-lab-lite/actions/runs/41615433266): **FAILURE** exclusivamente en `QA dependency audit (hard gate)`; el log informa 8 vulnerabilidades moderadas. Typecheck, unit/parity y build quedaron omitidos por la parada temprana. No se cambió el umbral ni se suprimió el audit.
- La corrección de autenticación del Runner usa `${{ github.token }}` con permisos de workflow `contents: write` y `actions: write`, siguiendo el patrón que ya funcionaba en Plus. No se modificaron secretos.

## Decisión y límites

AS-FAC-02 queda **PASS_SCOPED para Lite**: fixture exacta, salida factorizada, siete sustituciones contra aritmética JavaScript independiente y gates acumulativo/H1d ejecutados sobre el mismo SHA.

Plus no ejecutó AS-FAC-02; no se infiere paridad. Plus mantiene su siguiente acción bloqueada en VC-FE-45 por el conflicto contractual con EV-I-12. No se debilita ese contrato. La CI estándar de Lite conserva la deuda independiente de npm audit.

**Certificación global: OPEN.**

Siguiente tarea matemática Lite: AS-FAC-03 test-first, fila exacta `6x^2-11x+3 = (3x-1)(2x-3)`, forma factorizada y siete sustituciones contra el oráculo JavaScript independiente `(3*x-1)*(2*x-3)`. Sin cambiar el motor salvo defecto reproducible.
