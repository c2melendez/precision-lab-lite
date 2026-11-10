# Acta de aceptación — TRIG-EC-I-01

**Estado: PASS_SCOPED bilateral.**

## Contrato congelado

Fuente: `qa/certification/legacy_sources/ejercicios_trigonometria.md.gz`, blob `3a41b0c2e0d79f2eef48e4684dc1324689d0a0fb`.

| ID | Ejercicio | Resultado esperado |
|---|---|---|
| EC-I-01 | \(\arcsin x=\frac{\pi}{6}\) | \(x=\frac{1}{2}\) |

La fila original tiene tres columnas. No existe una nota separada y no se inventa.

Conjunto de soluciones reales esperado: \(\{1/2\}\). El oráculo exige exactamente una raíz, verificada por sustitución en \(\arcsin x=\pi/6\) y contenida en \([-1,1]\).

## Evidencia Lite

SHA técnico final: `5eb357d1d5e944777b2a0b392de8aab3e2de70d7`.

- Test focal `tests/trigonometryEcI01.audit.test.ts` y regresión `tests/trigonometryInverseSineRegression.audit.test.ts` en verde en Cumulative.
- Cambio de producto: `solveInverseSineEquation` en `src/engine/stepEngine/trigonometricEquation.ts`, enrutado desde `src/engine/stepEngine/algebra.ts`. Antes del cambio, el solver no encontraba la raíz de `arcsin(x)=π/6`.
- CI [42796690318](https://github.com/c2melendez/precision-lab-lite/actions/runs/42796690318) SUCCESS.
- Cumulative [42796690519](https://github.com/c2melendez/precision-lab-lite/actions/runs/42796690519) SUCCESS.
- H1d [42796690060](https://github.com/c2melendez/precision-lab-lite/actions/runs/42796690060) SUCCESS.
- Scientific UI (Syntax309) [42796690585](https://github.com/c2melendez/precision-lab-lite/actions/runs/42796690585) SUCCESS.
- Runner [42796690081](https://github.com/c2melendez/precision-lab-lite/actions/runs/42796690081) SUCCESS, push-only; sin dispatch manual.

## Evidencia Plus

SHA técnico: `b51612f19bab96e11c51f24644e991301a07d673`. Commit solo de prueba; sin cambio de producto.

- Test `backend/tests/test_trigonometry_ec_i01.py`: focales en verde en Cumulative [42793636117](https://github.com/c2melendez/precision-lab-plus/actions/runs/42793636117) SUCCESS.
- CI [42793636114](https://github.com/c2melendez/precision-lab-plus/actions/runs/42793636114) SUCCESS; H1d [42793636399](https://github.com/c2melendez/precision-lab-plus/actions/runs/42793636399) SUCCESS; Runner [42793636120](https://github.com/c2melendez/precision-lab-plus/actions/runs/42793636120) SUCCESS, push-only.

## Alcance y límites

- PASS_SCOPED cubre exclusivamente `arcsin(x)=π/6` en radianes con variable `x`; en Lite incluye también la forma invertida `π/6=arcsin(x)` y el caso `arcsin(x)=2` sin raíz real. No es un resolvedor general de arcsin.
- No certifica la ingesta LaTeX literal en Plus `/api/v1/evaluate`.
- No cierra la matriz de inversas.

**Resultado: PASS_SCOPED bilateral. Certificación global: OPEN.**

EV-D-01 en Plus `/api/v1/evaluate` permanece BLOCKED; EV-HI conserva PASS_SCOPED; S25, SG28, H2 y DIST siguen abiertos.
