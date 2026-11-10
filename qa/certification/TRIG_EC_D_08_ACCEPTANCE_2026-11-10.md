# Acta de aceptación — TRIG-EC-D-08

**Estado: PASS_SCOPED bilateral.**

## Contrato congelado

Fuente: qa/certification/legacy_sources/ejercicios_trigonometria.md.gz, blob 3a41b0c2e0d79f2eef48e4684dc1324689d0a0fb.

Fila original:

| ID | Ejercicio | Resultado esperado |
|---|---|---|
| EC-D-08 | \(\sec x=-2,\quad x\in[0,2\pi)\) | \(x=\frac{2\pi}{3},\ \frac{4\pi}{3}\) |

La fila original tiene tres columnas. No existe una nota separada y no se inventa.

Conjunto de raíces esperado:

\[
\left\{\frac{2\pi}{3},\frac{4\pi}{3}\right\}
\]

El oráculo exige exactamente dos raíces distintas, ambas dentro del intervalo semiabierto [0,2π), y verifica cada una por sustitución en la ecuación secante original.

## Evidencia Lite

SHA técnico: 3ad626602b3639310921ba6fd27952293732be39.

- Test tests/trigonometryEcD08.audit.test.ts: anclaje de la fila congelada y resolución focal; 2/2 PASS explícitos tanto en CI como en Cumulative.
- CI [42754588522](https://github.com/c2melendez/precision-lab-lite/actions/runs/42754588522) SUCCESS: typecheck, auditoría de dependencias, unit/parity y build SUCCESS; 401 archivos de prueba, 2,412 passed, 8 expected fail y 34 TODO.
- Cumulative [42754588411](https://github.com/c2melendez/precision-lab-lite/actions/runs/42754588411) SUCCESS: EC-D-08 2/2; 401 archivos, 2,412 passed, 8 expected fail y 34 TODO. Guard skip=false, evidence_run_id vacío; no se reutilizó evidencia.
- H1d [42754588566](https://github.com/c2melendez/precision-lab-lite/actions/runs/42754588566) SUCCESS: 22/22. Guard skip=false, sin reutilización.
- Scientific UI [42754588396](https://github.com/c2melendez/precision-lab-lite/actions/runs/42754588396) SUCCESS: 456/456 desktop/tablet/mobile. Guard skip=false, sin reutilización.
- Runner [42754588787](https://github.com/c2melendez/precision-lab-lite/actions/runs/42754588787) SUCCESS, push-only; no hubo dispatch manual.

Implementación estrictamente acotada: el parser normaliza sec(x) como 1/cos(x). solveSecantEqualsMinusTwoEquation reconoce únicamente 1/cos(x)=-2, reutiliza el resolvedor directo de cos(x)=-1/2 y vuelve a verificar cada raíz en la ecuación recíproca original. No es un resolvedor general de secantes.

## Evidencia Plus

SHA técnico: fb430768589eabfb930b03790d135b879ddf9109.

- Test backend/tests/test_trigonometry_ec_d08.py: anclaje de la fila congelada y POST /api/v1/solve con la entrada ASCII sec(x)=-2; ambos tests PASSED explícitamente en Cumulative.
- Cumulative [42755121582](https://github.com/c2melendez/precision-lab-plus/actions/runs/42755121582) SUCCESS: ambos tests EC-D-08 PASSED; backend 2,937 passed, 1 skipped, 11 xfailed; frontend SUCCESS. Guard skip=false, evidence_run_id vacío; no se reutilizó evidencia.
- CI [42755121784](https://github.com/c2melendez/precision-lab-plus/actions/runs/42755121784) SUCCESS: backend 2,937 passed, 1 skipped, 11 xfailed; frontend 150 archivos, 1,055 passed y 28 TODO.
- H1d [42755121628](https://github.com/c2melendez/precision-lab-plus/actions/runs/42755121628) SUCCESS: 38/38. Guard skip=false, sin reutilización.
- Native Syntax [42755121609](https://github.com/c2melendez/precision-lab-plus/actions/runs/42755121609) SUCCESS: 26 pruebas desktop y 52 tablet/mobile. Guard skip=false, sin reutilización.
- Runner [42755121603](https://github.com/c2melendez/precision-lab-plus/actions/runs/42755121603) SUCCESS, push-only; no hubo dispatch manual.

El primer test-first de Plus detectó que el resolvedor genérico devolvía -2π/3, coterminal con 4π/3 pero fuera del intervalo congelado. El helper _secant_minus_two_interval_result resuelve cos(x)=-1/2 directamente sobre [0,2π), valida exactamente dos raíces y comprueba ambas en la ecuación secante original. El SHA inicial fallido no se usa como evidencia de aceptación; sólo se acepta el SHA final fb430768....

## Alcance y límites

- PASS_SCOPED cubre exclusivamente sec(x)=-2, las raíces exactas \(2\pi/3\) y \(4\pi/3\), su pertenencia a [0,2π) y la sustitución en la ecuación original.
- No se afirma un resolvedor general de secantes ni una familia periódica sobre toda la recta real.
- Las pruebas usan entrada ASCII/normalizada y anclan por separado la fila fuente. Este caso no certifica la ingesta literal LaTeX en Plus /api/v1/evaluate.
- La aceptación de EC-D-08 no cierra la matriz trigonométrica ni la certificación global.

**Resultado: PASS_SCOPED bilateral. Certificación global: OPEN.**

EV-D-01 en Plus /api/v1/evaluate permanece BLOCKED; EV-HI conserva PASS_SCOPED; S25, SG28, H2 y DIST siguen abiertos.

## Siguiente objetivo

TRIG-EC-D-09. Recuperar primero la fila exacta del gzip original, incluyendo ecuación, intervalo y resultado esperado. No inferir el contrato por el nombre del caso ni repetir los gates verdes de EC-D-01..08.
