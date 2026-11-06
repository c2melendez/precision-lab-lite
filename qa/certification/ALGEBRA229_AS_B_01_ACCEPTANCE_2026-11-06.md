# Algebra229 AS-B-01 — aceptación scoped bilateral (Lite)

**Resultado: PASS_SCOPED bilateral.** Esta aceptación cubre exclusivamente la fila AS-B-01. No certifica la matriz completa de 229 filas ni la certificación global.

## Contrato y fuente
- Fila congelada: AS-B-01, N1, `factorizar`, `x^{2}-5x+6` → `\left(x - 3\right) \left(x - 2\right)`.
- Fuente: `qa/certification/legacy_sources/matriz_algebra_simbolica.md.gz`; SHA-256 del contenido descomprimido `8cd36ff08343f98f92abd83e2b162d565e0cbe5c59dc73f26b1c018f77d663c7`.
- Test: `tests/algebra229AsB01.audit.test.ts`, blob `792dc12c825ac9752a6a2e07958182edad6883ef`.
- El test coteja las seis celdas de la fila fuente y verifica diez sustituciones enteras contra `x*x-5*x+6` mediante `compileNumeric`, sin usar Algebrite como oráculo numérico.
- Falso negativo corregido: el primer test confundía `-0` IEEE-754 con `+0` mediante `Object.is`. La corrección normaliza solamente el signo del cero; conserva igualdad entera exacta y no introduce tolerancia.

## Evidencia ejecutada sobre el SHA Lite
- SHA: `7e21f3f9d9bebaab2741a76f4cc533992e56d76a`.
- Acumulativo [42134131999](https://github.com/c2melendez/precision-lab-lite/actions/runs/42134131999): **SUCCESS**, guard `skip=false`; test focal 2/2; 366 archivos y 2,259 passed, 8 expected fail y 34 todo.
- H1d [42134131938](https://github.com/c2melendez/precision-lab-lite/actions/runs/42134131938): **SUCCESS**, 22/22.
- Scientific UI [42134132036](https://github.com/c2melendez/precision-lab-lite/actions/runs/42134132036): **SUCCESS**, 456/456, ejecución Playwright con proyectos desktop, tablet y mobile.
- Runner [42134131871](https://github.com/c2melendez/precision-lab-lite/actions/runs/42134131871): **SUCCESS**.
- CI estándar [42134131960](https://github.com/c2melendez/precision-lab-lite/actions/runs/42134131960): **FAILURE** únicamente en `QA dependency audit (hard gate)`, cuatro vulnerabilidades moderadas; artifact `13464163830`. El workflow se detiene en la auditoría antes de typecheck/unit/build. Este bloqueo de seguridad se conserva separado y no convierte en FAIL el gate matemático acumulativo que sí ejecutó y pasó.

## Decisión
AS-B-01 queda **PASS_SCOPED para Lite** y, junto con la evidencia equivalente de Plus, **PASS_SCOPED bilateral**. No hubo cambio de producto. La deuda npm audit Lite sigue abierta como bloqueo de seguridad independiente.
