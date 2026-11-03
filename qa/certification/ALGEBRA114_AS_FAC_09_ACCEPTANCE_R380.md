# Algebra114 AS-FAC-09 — aceptación acotada (r380)

**Estado: PASS_SCOPED — Precision Lab Lite únicamente.** No acredita paridad con Plus, cierre de Algebra114 ni certificación global.

## Identidad técnica

- Repositorio: c2melendez/precision-lab-lite.
- Rama canónica: qa/syntax-audit-in625-a1.
- SHA técnico probado: `537a84bbaa7538a33c0e5fa0c2ebb36485821c8f`.
- Fuente original: `qa/certification/algebra114_source.md`, fila AS-FAC-09.
- Blob de fuente: `b30ca7fcec641334ce8128ca25bec542a9d04e79`.
- Test: `tests/algebra114AsFac09.audit.test.ts`.
- Blob del test: `bfc15ba512815375439f827aad2dfa6678ccac22`.

## Caso y oráculo independiente

La fila original exige:

`x^4+1` sobre `R` con factores reales `(x^2+sqrt(2)*x+1)(x^2-sqrt(2)*x+1)`.

El test:
1. Comprueba el contenido exacto de la fila original, incluida la restricción a los reales.
2. Ejecuta `factor(x^4+1)`, exige un operador de producto y al menos dos apariciones de `x^2` (dos factores cuadráticos), y rechaza la llamada `factor(...)` sin evaluar y el polinomio expandido `x^4`.
3. Comprueba siete sustituciones: `x = -3, -2, -1, 0, 1, 2, 3`.
4. Evalúa numéricamente la salida factorizada y la compara con el oráculo JavaScript independiente `(x*x+sqrt(2)*x+1)*(x*x-sqrt(2)*x+1)`, calculando `sqrt(2)` con `Math.sqrt(2)`. El expected no se calcula con Algebrite ni con otra llamada CAS.

El cambio modifica únicamente el test; no cambia el motor matemático.

## Evidencia de ejecución sobre el mismo SHA

- Acumulativo [41618685099](https://github.com/c2melendez/precision-lab-lite/actions/runs/41618685099): **SUCCESS**. El log muestra explícitamente `tests/algebra114AsFac09.audit.test.ts (1 test)`; 366 archivos aprobados, 2,259 passed, 8 expected fail y 34 TODO. Typecheck, unit/parity y build terminaron correctamente.
- H1d [41618685297](https://github.com/c2melendez/precision-lab-lite/actions/runs/41618685297): **SUCCESS**, 22/22 pruebas Playwright aprobadas.
- Certification Runner [41618685066](https://github.com/c2melendez/precision-lab-lite/actions/runs/41618685066): **SUCCESS**. Resolución de la rama canónica desde `main`, checkout y fingerprint del gate completados. El dispatch fue omitido correctamente en el evento push; este run no pretende certificar dispatch/persistencia.
- CI [41618685195](https://github.com/c2melendez/precision-lab-lite/actions/runs/41618685195): **FAILURE** en `QA dependency audit (hard gate)`; el flujo no alcanzó typecheck, unit/parity ni build en la CI estándar. El audit se mantiene como bloqueo de seguridad independiente. No se cambió el umbral ni se suprimió el audit.

## Decisión y límites

AS-FAC-09 queda **PASS_SCOPED para Lite**: fixture exacta sobre los reales, dos factores cuadráticos reales con `sqrt(2)`, siete sustituciones contra aritmética JavaScript independiente y gates acumulativo/H1d ejecutados sobre el mismo SHA.

Plus no ejecutó AS-FAC-09; no se infiere paridad. Plus mantiene su siguiente acción bloqueada en VC-FE-45 por el conflicto contractual con EV-I-12. No se debilita ese contrato. La CI estándar de Lite conserva la deuda independiente de npm audit.

**Certificación global: OPEN.**

Siguiente tarea matemática Lite: AS-FAC-10 test-first, validar la fila original exacta, estructura de la factorización y sustituciones contra un oráculo JavaScript independiente. Sin cambiar el motor salvo defecto reproducible.
