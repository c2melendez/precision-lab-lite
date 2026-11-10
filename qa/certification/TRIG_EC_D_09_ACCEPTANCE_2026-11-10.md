# Acta de aceptación — TRIG-EC-D-09

**Estado: PASS_SCOPED bilateral.**

## Contrato congelado

Fuente: `qa/certification/legacy_sources/ejercicios_trigonometria.md.gz`, blob `3a41b0c2e0d79f2eef48e4684dc1324689d0a0fb`.

Fila original:

| ID | Ejercicio | Resultado esperado |
|---|---|---|
| EC-D-09 | \(\cot x=1,\quad x\in[0,2\pi)\) | \(x=\frac{\pi}{4},\ \frac{5\pi}{4}\) |

La fila original tiene tres columnas. No existe una nota separada y no se inventa.

Conjunto de raíces esperado:

\[
\left\{\frac{\pi}{4},\frac{5\pi}{4}\right\}
\]

El oráculo exige exactamente dos raíces distintas, ambas dentro del intervalo semiabierto \([0,2\pi)\), y verifica cada una por sustitución en la ecuación cotangente original.

## Evidencia Lite

SHA técnico: `b5cbbd727a9493c3606378a007f44350e550b3f2`.

- Test `tests/trigonometryEcD09.audit.test.ts`: anclaje de la fila congelada y resolución focal; 2/2 PASS explícitos tanto en CI como en Cumulative.
- CI [42765580144](https://github.com/c2melendez/precision-lab-lite/actions/runs/42765580144) SUCCESS: typecheck, auditoría de dependencias, unit/parity y build SUCCESS; 402 archivos de prueba, 2,414 passed, 8 expected fail y 34 TODO.
- Cumulative [42765579797](https://github.com/c2melendez/precision-lab-lite/actions/runs/42765579797) SUCCESS: EC-D-09 2/2; 402 archivos, 2,414 passed, 8 expected fail y 34 TODO. Guard skip=false, `evidence_run_id` vacío; no se reutilizó evidencia.
- H1d [42765579607](https://github.com/c2melendez/precision-lab-lite/actions/runs/42765579607) SUCCESS: 22/22. Guard skip=false, sin reutilización.
- Scientific UI [42765579621](https://github.com/c2melendez/precision-lab-lite/actions/runs/42765579621) SUCCESS: 456/456 desktop/tablet/mobile. Guard skip=false, sin reutilización.
- Runner [42765579737](https://github.com/c2melendez/precision-lab-lite/actions/runs/42765579737) SUCCESS, push-only; no hubo dispatch manual.

Implementación estrictamente acotada: el parser normaliza `cot(x)` como `cos(x)/sin(x)`. `solveCotangentEqualsOneEquation` reconoce únicamente `cos(x)/sin(x)=1`, reutiliza la rama `arctan(1)`, enumera ambas ramas dentro de \([0,2\pi)\) y vuelve a verificar cada raíz en la ecuación cotangente original. No es un resolvedor general de cotangentes.

## Evidencia Plus

SHA técnico: `0b18ddf9f7ca0a94e905867ea83d62d88e07b656`.

- Test `backend/tests/test_trigonometry_ec_d09.py`: anclaje de la fila congelada y POST `/api/v1/solve` con la entrada ASCII `cot(x)=1`.
- CI [42765601827](https://github.com/c2melendez/precision-lab-plus/actions/runs/42765601827) SUCCESS: backend y frontend completos.
- Cumulative [42765602623](https://github.com/c2melendez/precision-lab-plus/actions/runs/42765602623) SUCCESS: ambos tests EC-D-09 PASSED explícitamente; backend y frontend completos. Guard skip=false, `evidence_run_id` vacío; no se reutilizó evidencia.
- H1d [42765602038](https://github.com/c2melendez/precision-lab-plus/actions/runs/42765602038) SUCCESS: 38/38. Guard skip=false, sin reutilización.
- Native Syntax [42765602152](https://github.com/c2melendez/precision-lab-plus/actions/runs/42765602152) SUCCESS: 26 pruebas desktop y 52 tablet/mobile. Guard skip=false, sin reutilización.
- Runner [42765601905](https://github.com/c2melendez/precision-lab-plus/actions/runs/42765601905) SUCCESS, push-only; no hubo dispatch manual.

El primer test-first de Plus detectó que el resolvedor genérico devolvía únicamente la rama principal \(\pi/4\), omitiendo \(5\pi/4\) dentro del intervalo congelado. El helper `_cotangent_equals_one_interval_result` resuelve la ecuación equivalente `tan(x)=1` directamente sobre \([0,2\pi)\), valida exactamente dos raíces y comprueba ambas en la ecuación cotangente original. El SHA inicial fallido no se usa como evidencia de aceptación; sólo se acepta el SHA final `0b18ddf9`.

## Alcance y límites

- PASS_SCOPED cubre exclusivamente `cot(x)=1`, las raíces exactas \(\pi/4\) y \(5\pi/4\), su pertenencia a \([0,2\pi)\) y la sustitución en la ecuación original.
- No se afirma un resolvedor general de cotangentes ni una familia periódica sobre toda la recta real.
- Las pruebas usan entrada ASCII/normalizada y anclan por separado la fila fuente. Este caso no certifica la ingesta literal LaTeX en Plus `/api/v1/evaluate`.
- La aceptación de EC-D-09 no cierra la matriz trigonométrica ni la certificación global.

**Resultado: PASS_SCOPED bilateral. Certificación global: OPEN.**

EV-D-01 en Plus `/api/v1/evaluate` permanece BLOCKED; EV-HI conserva PASS_SCOPED; S25, SG28, H2 y DIST siguen abiertos.

## Siguiente objetivo

TRIG-EC-D-10. Recuperar primero la fila exacta del gzip original (`sin x=2`), fijar la expectativa de ausencia de soluciones reales y continuar test-first bilateral. No repetir los gates verdes de EC-D-01..09.
