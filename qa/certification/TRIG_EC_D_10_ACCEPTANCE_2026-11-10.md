# Acta de aceptación — TRIG-EC-D-10

**Estado: PASS_SCOPED bilateral.**

## Contrato congelado

Fuente: `qa/certification/legacy_sources/ejercicios_trigonometria.md.gz`, blob `3a41b0c2e0d79f2eef48e4684dc1324689d0a0fb`.

Fila original:

| ID | Ejercicio | Resultado esperado |
|---|---|---|
| EC-D-10 | \(\sin x=2\) | sin solución real |

La fila original tiene tres columnas. No existe una nota separada y no se inventa.

Conjunto de soluciones reales esperado: \(\varnothing\). El oráculo exige resultado de contradicción, lista de soluciones vacía y verificación por sondas de que \(\sin x\in[-1,1]\).

## Evidencia Lite

SHA técnico: `d32c724afca7159280758ed12eaf1d87baa75549`.

- Test `tests/trigonometryEcD10.audit.test.ts`: 2/2 PASS en Cumulative; el log del job confirma el test EC-D-10.
- CI [42767488254](https://github.com/c2melendez/precision-lab-lite/actions/runs/42767488254) SUCCESS.
- Cumulative [42767488183](https://github.com/c2melendez/precision-lab-lite/actions/runs/42767488183) SUCCESS.
- H1d [42767488334](https://github.com/c2melendez/precision-lab-lite/actions/runs/42767488334) SUCCESS.
- Scientific UI (Syntax309) [42767488416](https://github.com/c2melendez/precision-lab-lite/actions/runs/42767488416) SUCCESS.
- Runner [42767488196](https://github.com/c2melendez/precision-lab-lite/actions/runs/42767488196) SUCCESS, push-only; no hubo dispatch manual.

El commit solo añade el test `tests/trigonometryEcD10.audit.test.ts`. Lite no requirió cambio de producto: el test pasa con el motor existente.

## Evidencia Plus

SHA técnico: `fea4d7c6c94ce15b28954f64bfb0423b90e17982`.

- Tests `backend/tests/test_trigonometry_ec_d10.py`: ambos PASSED en el job backend de Cumulative; el log confirma los dos tests.
- CI [42768654580](https://github.com/c2melendez/precision-lab-plus/actions/runs/42768654580) SUCCESS.
- Cumulative [42768654446](https://github.com/c2melendez/precision-lab-plus/actions/runs/42768654446) SUCCESS.
- H1d [42768654442](https://github.com/c2melendez/precision-lab-plus/actions/runs/42768654442) SUCCESS.
- Native Syntax [42768654659](https://github.com/c2melendez/precision-lab-plus/actions/runs/42768654659) SUCCESS.
- Certification dependency [42768654564](https://github.com/c2melendez/precision-lab-plus/actions/runs/42768654564) SUCCESS.
- Runner [42768654622](https://github.com/c2melendez/precision-lab-plus/actions/runs/42768654622) SUCCESS, push-only; no hubo dispatch manual.

El primer intento de Plus (`704fce9`, CI 42767510829 y Cumulative 42767510903 FAILURE) no se usa como evidencia de aceptación. La corrección `fea4d7c` acota el guard de dominio real de `_sine_out_of_range_contradiction` (`backend/app/services/solve_service.py`) a la variable `x`; las soluciones complejas para otras variables conservan la ruta genérica.

## Alcance y límites

- PASS_SCOPED cubre exclusivamente `sin(x)=2` como contradicción con conjunto real vacío, en radianes y variable `x`.
- No es un resolvedor general de ecuaciones trigonométricas.
- No certifica la ingesta LaTeX literal en Plus `/api/v1/evaluate`.
- No cierra la matriz trigonométrica ni la certificación global.

**Resultado: PASS_SCOPED bilateral. Certificación global: OPEN.**

EV-D-01 en Plus `/api/v1/evaluate` permanece BLOCKED; EV-HI conserva PASS_SCOPED; S25, SG28, H2 y DIST siguen abiertos.
