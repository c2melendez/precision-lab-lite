# Acta de aceptación — TRIG-EC-I-03

**Estado: PASS_SCOPED bilateral.**

## Contrato congelado

Fuente: `qa/certification/legacy_sources/ejercicios_trigonometria.md.gz`, blob `3a41b0c2e0d79f2eef48e4684dc1324689d0a0fb`.

| ID | Ejercicio | Resultado esperado |
|---|---|---|
| EC-I-03 | \(\arctan x=\frac{\pi}{4}\) | \(x=1\) |

La fila original tiene tres columnas. No existe una nota separada y no se inventa.

Conjunto de soluciones reales esperado: \(\{1\}\). El oráculo exige exactamente una raíz, verificada por sustitución en \(\arctan x=\pi/4\).

## Evidencia Lite

Primer intento test-first: SHA `11b0038f2ac1f9bcf378c775ba1cd2249a44507c`. El test focal `tests/trigonometryEcI03.audit.test.ts` falló con «No se encontró una solución algebraica para x» (CI 42930765664 y Cumulative 42930765708 FAILURE). Es un hueco de producto, no de la prueba: el solver no tenía rama para arctan.

SHA técnico final: `238b1e8d1fb9b8fc1745044ebca8c72db4f4915a`.

- Cambio de producto: `solveInverseTangentEquation` en `src/engine/stepEngine/trigonometricEquation.ts`, enrutado desde `src/engine/stepEngine/algebra.ts` tras la rama de arccos. Restringe la constante al intervalo abierto (-π/2, π/2), verifica x=tan(c) en la ecuación original y acepta la forma invertida.
- Test focal `tests/trigonometryEcI03.audit.test.ts`: 2/2 PASS en Cumulative.
- Regresión `tests/trigonometryInverseTangentRegression.audit.test.ts`: 3/3 PASS en Cumulative (`arctan(x)=π/4`, `π/4=arctan(x)` y `arctan(x)=π` sin candidato).
- CI [42931990369](https://github.com/c2melendez/precision-lab-lite/actions/runs/42931990369) SUCCESS.
- Cumulative [42931990398](https://github.com/c2melendez/precision-lab-lite/actions/runs/42931990398) SUCCESS (2431 passed, 8 expected fail, 34 todo).
- H1d [42931990364](https://github.com/c2melendez/precision-lab-lite/actions/runs/42931990364) SUCCESS.
- Scientific UI (Syntax309) [42931990451](https://github.com/c2melendez/precision-lab-lite/actions/runs/42931990451) SUCCESS.
- Runner [42931990385](https://github.com/c2melendez/precision-lab-lite/actions/runs/42931990385) SUCCESS, push-only; sin dispatch manual.

## Evidencia Plus

SHA técnico: `167fa2f05` (commit de prueba `backend/tests/test_trigonometry_ec_i03.py`). Plus ya resolvía el caso sin cambio de producto.

- Tests `backend/tests/test_trigonometry_ec_i03.py`: 2/2 PASSED en el job backend de Cumulative [42930769666](https://github.com/c2melendez/precision-lab-plus/actions/runs/42930769666) SUCCESS (2947 passed, 1 skipped, 11 xfailed).
- CI [42930769742](https://github.com/c2melendez/precision-lab-plus/actions/runs/42930769742) SUCCESS; H1d [42930769513](https://github.com/c2melendez/precision-lab-plus/actions/runs/42930769513) SUCCESS; Runner [42930769515](https://github.com/c2melendez/precision-lab-plus/actions/runs/42930769515) SUCCESS, push-only.

## Alcance y límites

- PASS_SCOPED cubre exclusivamente `arctan(x)=π/4` en radianes con variable `x`; en Lite incluye también la forma invertida `π/4=arctan(x)` y el caso `arctan(x)=π` fuera del rango principal. No es un resolvedor general de arctan.
- No certifica la ingesta LaTeX literal en Plus `/api/v1/evaluate`.
- No cierra la matriz de inversas.

**Resultado: PASS_SCOPED bilateral. Certificación global: OPEN.**

EV-D-01 en Plus `/api/v1/evaluate` permanece BLOCKED; EV-HI conserva PASS_SCOPED; S25, SG28, H2 y DIST siguen abiertos.
