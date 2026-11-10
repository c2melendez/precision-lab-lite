# Acta de aceptación — TRIG-EC-I-02

**Estado: PASS_SCOPED bilateral.**

## Contrato congelado

Fuente: `qa/certification/legacy_sources/ejercicios_trigonometria.md.gz`, blob `3a41b0c2e0d79f2eef48e4684dc1324689d0a0fb`.

| ID | Ejercicio | Resultado esperado |
|---|---|---|
| EC-I-02 | \(\arccos x=\frac{\pi}{3}\) | \(x=\frac{1}{2}\) |

La fila original tiene tres columnas. No existe una nota separada y no se inventa.

Conjunto de soluciones reales esperado: \(\{1/2\}\). El oráculo exige exactamente una raíz, verificada por sustitución en \(\arccos x=\pi/3\) y contenida en \([-1,1]\).

## Evidencia Lite

Primer intento test-first: SHA `ecfc2eb2ebdb2734c215352c58b228863bac3475`. El test focal falló con «No se encontró una solución algebraica para x» (CI 42799259561 y Cumulative 42799259668 FAILURE). Es un hueco de producto, no de la prueba.

SHA técnico final: `d11a8429f075a4cd96171f544bf9247c84fcbc43`.

- Cambio de producto: `solveInverseCosineEquation` en `src/engine/stepEngine/trigonometricEquation.ts`, enrutado desde `src/engine/stepEngine/algebra.ts` tras la rama de arcsin. Restringe la constante a [0, π], verifica x=cos(c) en la ecuación original y acepta la forma invertida.
- Test focal `tests/trigonometryEcI02.audit.test.ts`: 2/2 PASS en Cumulative.
- Regresión `tests/trigonometryInverseCosineRegression.audit.test.ts`: 3/3 PASS en Cumulative (`arccos(x)=π/3`, `π/3=arccos(x)` y `arccos(x)=4` sin raíz real).
- CI [42800767008](https://github.com/c2melendez/precision-lab-lite/actions/runs/42800767008) SUCCESS.
- Cumulative [42800766990](https://github.com/c2melendez/precision-lab-lite/actions/runs/42800766990) SUCCESS (2426 passed, 8 expected fail, 34 todo).
- H1d [42800767370](https://github.com/c2melendez/precision-lab-lite/actions/runs/42800767370) SUCCESS.
- Scientific UI (Syntax309) [42800766911](https://github.com/c2melendez/precision-lab-lite/actions/runs/42800766911) SUCCESS.
- Runner [42800767136](https://github.com/c2melendez/precision-lab-lite/actions/runs/42800767136) SUCCESS, push-only; sin dispatch manual.

## Evidencia Plus

SHA técnico: `aa28a790478058d1a9ff8e26e030ce1af2c46dbb`. Commit solo de prueba; Plus ya resolvía el caso sin cambio de producto.

- Tests `backend/tests/test_trigonometry_ec_i02.py`: 2/2 PASSED en el job backend de Cumulative [42799271495](https://github.com/c2melendez/precision-lab-plus/actions/runs/42799271495) SUCCESS (2945 passed, 1 skipped, 11 xfailed).
- CI [42799271134](https://github.com/c2melendez/precision-lab-plus/actions/runs/42799271134) SUCCESS; H1d [42799271230](https://github.com/c2melendez/precision-lab-plus/actions/runs/42799271230) SUCCESS; Runner [42799271368](https://github.com/c2melendez/precision-lab-plus/actions/runs/42799271368) SUCCESS, push-only.

## Alcance y límites

- PASS_SCOPED cubre exclusivamente `arccos(x)=π/3` en radianes con variable `x`; en Lite incluye también la forma invertida `π/3=arccos(x)` y el caso fuera de rango `arccos(x)=4`. No es un resolvedor general de arccos.
- No certifica la ingesta LaTeX literal en Plus `/api/v1/evaluate`.
- No cierra la matriz de inversas.

**Resultado: PASS_SCOPED bilateral. Certificación global: OPEN.**

EV-D-01 en Plus `/api/v1/evaluate` permanece BLOCKED; EV-HI conserva PASS_SCOPED; S25, SG28, H2 y DIST siguen abiertos.
