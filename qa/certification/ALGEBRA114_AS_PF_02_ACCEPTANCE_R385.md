# Algebra114 AS-PF-02 — aceptación acotada (r385)

**Estado: PASS_SCOPED — Precision Lab Lite únicamente.** No acredita paridad con Plus, cierre de Algebra114 ni certificación global.

## Identidad técnica

- Repositorio: c2melendez/precision-lab-lite.
- Rama canónica: qa/syntax-audit-in625-a1.
- SHA técnico probado: `da10b65e69add69795e64a9389625a6f36aa7dcb`.
- Fuente original: `qa/certification/algebra114_source.md`, fila AS-PF-02.
- Blob de fuente: `b30ca7fcec641334ce8128ca25bec542a9d04e79`.
- Test: `tests/algebra114AsPf02.audit.test.ts`.
- Blob del test: `92b15148a906f22a988c0135f0c67863e3e05dd1`.

## Caso y oráculo independiente

La fila original exige:

`1/(x*(x-1)^2) = 1/x - 1/(x-1) + 1/(x-1)^2`.

El test:
1. Comprueba el contenido exacto de la fila AS-PF-02.
2. Ejecuta `partfrac(1/(x*(x-1)^2),x)`; rechaza la llamada sin evaluar y la expresión racional original sin descomponer.
3. Comprueba tres términos y conserva explícitamente el polo simple `1/x`, el término `1/(x-1)` y el polo repetido `1/(x-1)^2`.
4. Evalúa ocho sustituciones enteras no singulares `[-5,-4,-2,-1,2,3,5,7]`.
5. Compara cada valor con el oráculo JavaScript independiente `1/x - 1/(x-1) + 1/((x-1)*(x-1))`. Algebrite no calcula los valores expected.

El cambio modifica únicamente el test; no cambia el motor matemático, parser, dependencias ni workflows.

## Evidencia de ejecución sobre el mismo SHA

- Acumulativo [41984780552](https://github.com/c2melendez/precision-lab-lite/actions/runs/41984780552): **SUCCESS**. El log muestra explícitamente `tests/algebra114AsPf02.audit.test.ts (1 test)`; 366 archivos aprobados, 2,259 passed, 8 expected fail y 34 TODO. Typecheck, unit/parity y production build terminaron correctamente.
- H1d [41984780532](https://github.com/c2melendez/precision-lab-lite/actions/runs/41984780532): **SUCCESS**, 22/22 pruebas Playwright.
- Certification Runner [41984780510](https://github.com/c2melendez/precision-lab-lite/actions/runs/41984780510): **SUCCESS** en evento push. Resolución de rama, checkout y fingerprint; dispatch/persistencia omitidos en push, por lo que no quedan certificados.
- CI estándar [41984780602](https://github.com/c2melendez/precision-lab-lite/actions/runs/41984780602): **FAILURE** en `QA dependency audit (hard gate)` por 8 findings moderados. No se modificó el umbral; es un bloqueo de seguridad separado de esta aceptación matemática.

## Límite de aceptación

- Aprobación exclusiva para AS-PF-02 en Lite.
- Plus no ejecutó esta fila; no se declara paridad.
- Global certification permanece **OPEN**.
