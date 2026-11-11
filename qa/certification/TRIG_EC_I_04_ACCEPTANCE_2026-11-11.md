# Acta de aceptación — TRIG-EC-I-04

**Estado: PASS_SCOPED bilateral.**

## Contrato congelado

Fuente: `qa/certification/legacy_sources/ejercicios_trigonometria.md.gz`, blob `3a41b0c2e0d79f2eef48e4684dc1324689d0a0fb`.

| ID | Ejercicio | Resultado esperado |
|---|---|---|
| EC-I-04 | \(\arcsin x=\arccos x\) | \(x=\frac{\sqrt{2}}{2}\) |

La fila original tiene tres columnas. No existe una nota separada y no se inventa.

Conjunto de soluciones reales esperado: \(\{\sqrt{2}/2\}\). El oráculo exige exactamente una raíz, verificada por sustitución en \(\arcsin x=\arccos x\).

## Evidencia Lite

Primer intento test-first: SHA `0cd7bc71a40b3a35c6163a996bc175975ab7acc3`. El test focal `tests/trigonometryEcI04.audit.test.ts` falló con «No se encontró una solución algebraica para x» (Cumulative https://github.com/c2melendez/precision-lab-lite/actions/runs/42946133423 FAILURE). Es un hueco de producto.

SHA técnico final: `3b1483a745cff6de4bbbd28c5718765b75b43df6`.

- Cambio de producto: `solveInverseSineCosineEqualEquation` en `src/engine/stepEngine/trigonometricEquation.ts`, enrutado desde `src/engine/stepEngine/algebra.ts` tras la rama de arctan. Usa arccos(x)=π/2−arcsin(x), reduce a arcsin(x)=π/4, toma x=sin(π/4) y verifica arcsin y arccos en ese candidato.
- Test focal `tests/trigonometryEcI04.audit.test.ts`: 2/2 PASS en Cumulative.
- Regresión `tests/trigonometryInverseSineCosineRegression.audit.test.ts`: 3/3 PASS en Cumulative (`arcsin(x)=arccos(x)`, forma invertida y `arcsin(x)=arccos(x)+1` sin candidato).
- CI https://github.com/c2melendez/precision-lab-lite/actions/runs/42947355930 SUCCESS.
- Cumulative https://github.com/c2melendez/precision-lab-lite/actions/runs/42947355901 SUCCESS (2436 passed, 8 expected fail, 34 todo).
- H1d https://github.com/c2melendez/precision-lab-lite/actions/runs/42947355958 SUCCESS.
- Scientific UI (Syntax309) https://github.com/c2melendez/precision-lab-lite/actions/runs/42947355931 SUCCESS.
- Runner https://github.com/c2melendez/precision-lab-lite/actions/runs/42947355971 SUCCESS, push-only; sin dispatch manual.

## Evidencia Plus

Primer intento test-first: SHA `92ad6a31`. Falló `test_ec_i04_http_solve_returns_exactly_one_root_verified_in_original_equation` porque `/api/v1/solve` devolvió `success: False` para `asin(x)=acos(x)` (CI https://github.com/c2melendez/precision-lab-plus/actions/runs/42946135416 FAILURE). SymPy lanza `NotImplementedError` con dos funciones inversas de la misma variable. Es un hueco de producto.

SHA técnico final: `0c269122b` (`backend/app/services/solve_service.py`). Helper `_inverse_sine_equals_cosine_result`, consultado antes del camino genérico de SymPy, sólo en radianes y sólo para la forma exacta asin(x)=acos(x).

- Tests `backend/tests/test_trigonometry_ec_i04.py`: 2/2 PASSED en Cumulative backend https://github.com/c2melendez/precision-lab-plus/actions/runs/42947360512 SUCCESS (2949 passed, 1 skipped, 11 xfailed).
- CI https://github.com/c2melendez/precision-lab-plus/actions/runs/42947360649 SUCCESS; H1d https://github.com/c2melendez/precision-lab-plus/actions/runs/42947360563 SUCCESS; Native Syntax https://github.com/c2melendez/precision-lab-plus/actions/runs/42947360577 SUCCESS; Runner https://github.com/c2melendez/precision-lab-plus/actions/runs/42947360521 SUCCESS, push-only.
- Security gate https://github.com/c2melendez/precision-lab-plus/actions/runs/42947360677: validate-request, backend-security y audit-request SUCCESS; mutación `plus-backend-mutmut` seguía en curso al registrar esta acta. Pendiente de confirmar.

## Alcance y límites

- PASS_SCOPED cubre exclusivamente `arcsin(x)=arccos(x)` en radianes con variable `x` (Lite: también la forma invertida y el caso desplazado sin candidato; Plus: sólo `asin(x)=acos(x)` vía `/api/v1/solve`). No es un resolvedor general de funciones inversas.
- No certifica la ingesta LaTeX literal en Plus `/api/v1/evaluate`.
- No cierra la matriz de inversas.

**Resultado: PASS_SCOPED bilateral. Certificación global: OPEN.**

EV-D-01 en Plus `/api/v1/evaluate` permanece BLOCKED; EV-HI conserva PASS_SCOPED; S25, SG28, H2 y DIST siguen abiertos.
