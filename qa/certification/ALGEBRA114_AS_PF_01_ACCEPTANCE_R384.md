# Algebra114 AS-PF-01 — aceptación acotada (r384)

**Estado: PASS_SCOPED — Precision Lab Lite únicamente.** No acredita paridad con Plus, cierre de Algebra114 ni certificación global.

## Identidad técnica

- Repositorio: c2melendez/precision-lab-lite.
- Rama canónica: qa/syntax-audit-in625-a1.
- SHA técnico probado: `070c5e9a5e36ef7cc0c75d525cbff56572046a89`.
- Fuente original: `qa/certification/algebra114_source.md`, fila AS-PF-01.
- Blob de fuente: `b30ca7fcec641334ce8128ca25bec542a9d04e79`.
- Test: `tests/algebra114AsPf01.audit.test.ts`.
- Blob del test: `172f43277971982dfccae81838bd80d32d0a20d9`.

## Caso y oráculo independiente

Identidad contractual:

`(3x+5)/((x+1)(x+2))=2/(x+1)+1/(x+2)`

El test comprueba:
1. Fixture exacta de AS-PF-01.
2. El resultado no conserva `partfrac(...)` ni devuelve el cociente original; se comprueban dos denominadores distintos, x+1 y x+2.
3. Nueve sustituciones enteras no singulares `[-5,-4,-3,0,1,3,4,5,6]`, comparadas con el oráculo independiente `2/(x+1)+1/(x+2)` en JavaScript.

El primer intento de refuerzo añadió valores decimales y falló en el parser numérico con caracteres sobrantes. Se sustituyeron por enteros no singulares y se repitió el gate en el SHA de aceptación. No se cambió el motor.

El cambio modifica únicamente el test; no modifica el motor matemático, parser, dependencias ni workflow.

## Evidencia de ejecución sobre el mismo SHA

- Acumulativo [41984143490](https://github.com/c2melendez/precision-lab-lite/actions/runs/41984143490): **SUCCESS**. El log contiene explícitamente `tests/algebra114AsPf01.audit.test.ts`; 366 archivos aprobados, 2,259 passed, 8 expected fail y 34 TODO. Typecheck, regresiones unitarias/paridad y production build terminaron correctamente.
- H1d [41984143650](https://github.com/c2melendez/precision-lab-lite/actions/runs/41984143650): **SUCCESS**, 22/22 pruebas Playwright.
- Certification Runner [41984143542](https://github.com/c2melendez/precision-lab-lite/actions/runs/41984143542): **SUCCESS** en evento push; resolución de rama, checkout y fingerprint. El camino de dispatch/persistencia fue omitido en push y no se certifica aquí.
- CI estándar [41984143529](https://github.com/c2melendez/precision-lab-lite/actions/runs/41984143529): **FAILURE** en `QA dependency audit (hard gate)` por 8 findings moderados. No se modificó el umbral. Este bloqueo de seguridad es distinto de la evidencia matemática acumulativa y H1d.

## Límite de aceptación

- Aprobación solo para AS-PF-01 en Lite.
- Plus no ejecutó este caso sobre el mismo contrato/fixture; no se declara paridad.
- Global certification permanece **OPEN**.
