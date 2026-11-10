# Acta de aceptación — TRIG-EC-D-07

**Estado: PASS_SCOPED bilateral.**

## Contrato congelado

Fuente: qa/certification/legacy_sources/ejercicios_trigonometria.md.gz, blob 3a41b0c2e0d79f2eef48e4684dc1324689d0a0fb.

Fila original (tres columnas: ID, ejercicio y resultado esperado; no existe una nota separada):

\[
\csc x=2,\qquad x\in[0,2\pi)
\]

Conjunto esperado:

\[
\left\{\frac{\pi}{6},\frac{5\pi}{6}\right\}
\]

El oráculo exige exactamente dos raíces distintas, ambas dentro del intervalo semiabierto, y verifica cada raíz en la ecuación recíproca original.

## Evidencia Lite

SHA técnico: 3ad626602b3639310921ba6fd27952293732be39.

- Test tests/trigonometryEcD07.audit.test.ts: anclaje de la fila fuente y resolución focal; 2/2 PASS explícitos tanto en CI como en Cumulative.
- CI [42748347965](https://github.com/c2melendez/precision-lab-lite/actions/runs/42748347965) SUCCESS: typecheck, auditoría de dependencias, unit/parity y build SUCCESS; 400 archivos de prueba, 2,410 passed, 8 expected fail y 34 TODO.
- Cumulative [42748348152](https://github.com/c2melendez/precision-lab-lite/actions/runs/42748348152) SUCCESS: EC-D-07 2/2; 400 archivos, 2,410 passed, 8 expected fail y 34 TODO. Guard skip=false, evidence_run_id vacío; no se reutilizó evidencia.
- H1d [42748347964](https://github.com/c2melendez/precision-lab-lite/actions/runs/42748347964) SUCCESS: 22/22. Guard skip=false, sin reutilización.
- Scientific UI [42748348035](https://github.com/c2melendez/precision-lab-lite/actions/runs/42748348035) SUCCESS: 456/456 desktop/tablet/mobile. Guard skip=false, sin reutilización.
- Runner [42748348237](https://github.com/c2melendez/precision-lab-lite/actions/runs/42748348237) SUCCESS, push-only; no hubo dispatch manual.

Implementación estrictamente acotada: solveCosecantEqualsTwoEquation reconoce la forma normalizada 1/sin(x)=2 que resulta del parser para csc(x), reutiliza la ruta del caso sin(x)=1/2 y verifica cada candidata en 1/sin(x)=2. No constituye un resolvedor general de funciones trigonométricas recíprocas.

## Evidencia Plus

SHA de prueba: 864c4cf68bb88e331b6df3b64a0ddb2354b047af. No hubo cambio de producto Plus.

- Test backend/tests/test_trigonometry_ec_d07.py: ambos tests PASSED explícitamente en Cumulative: anclaje de la fila fuente y POST /api/v1/solve con csc(x)=2, las dos raíces exactas, intervalo y sustitución.
- Cumulative [42748028770](https://github.com/c2melendez/precision-lab-plus/actions/runs/42748028770) SUCCESS: backend 2,935 passed, 1 skipped, 11 xfailed; frontend SUCCESS. Guard skip=false, evidence_run_id vacío; no se reutilizó evidencia.
- CI [42748028579](https://github.com/c2melendez/precision-lab-plus/actions/runs/42748028579) SUCCESS: backend 2,935 passed, 1 skipped, 11 xfailed; frontend 150 archivos y 1,055 passed, 28 TODO.
- H1d [42748028455](https://github.com/c2melendez/precision-lab-plus/actions/runs/42748028455) SUCCESS: 38/38. Guard skip=false, sin reutilización.
- Runner [42748028867](https://github.com/c2melendez/precision-lab-plus/actions/runs/42748028867) SUCCESS, push-only; no hubo dispatch manual.
- Plus resolvió el caso sin cambios del motor; la validación pública se hizo por POST /api/v1/solve usando entrada ASCII.

## Alcance y límites

- PASS_SCOPED cubre exclusivamente csc(x)=2, las raíces exactas π/6 y 5π/6, su pertenencia a [0,2π) y la sustitución en la ecuación original.
- No se afirma un resolvedor general de funciones recíprocas ni una familia periódica sobre toda la recta real.
- Las pruebas usan entrada ASCII/normalizada y anclan por separado la fila fuente. Este caso no certifica la ingesta literal LaTeX en Plus /api/v1/evaluate.
- La aceptación de EC-D-07 no cierra la matriz trigonométrica ni la certificación global.

**Resultado: PASS_SCOPED bilateral. Certificación global: OPEN.**

EV-D-01 en Plus /api/v1/evaluate permanece BLOCKED; EV-HI conserva PASS_SCOPED; S25, SG28, H2 y DIST siguen abiertos.

## Siguiente objetivo

TRIG-EC-D-08. Recuperar primero la fila exacta del gzip original, incluyendo ecuación, intervalo y resultado esperado. No inferir el contrato por el nombre del caso ni repetir los gates verdes de EC-D-01..07.
