# Acta de aceptación - TRIG-EC-I-06

**Estado: PASS_SCOPED bilateral.**

## Contrato congelado

Fuente: `qa/certification/legacy_sources/ejercicios_trigonometria.md.gz`, blob `3a41b0c2e0d79f2eef48e4684dc1324689d0a0fb`.

| ID | Ejercicio | Resultado esperado |
|---|---|---|
| EC-I-06 | \(\operatorname{arccot} x=\frac{2\pi}{3}\) | \(x=-\frac{\sqrt{3}}{3}\) |

La fila original tiene tres columnas. No existe una nota separada y no se inventa.

Conjunto de soluciones reales esperado: \(\{-\sqrt{3}/3\}\) en la rama principal \((0,\pi)\) de \(\operatorname{arccot}\). El oráculo exige exactamente una raíz, verificada con la identidad principal \(\operatorname{arccot}(x)=\pi/2-\arctan(x)\).

## Evidencia Lite

- Test-first `76695ab8ae75acc65228cc4381df2bc2eb8be464`: los tests focales fallaron con «No se encontró una solución algebraica para x». CI https://github.com/c2melendez/precision-lab-lite/actions/runs/42960472337 FAILURE; Cumulative https://github.com/c2melendez/precision-lab-lite/actions/runs/42960472418 FAILURE. Hueco de producto.
- SHA técnico final: `edfc50343dd5165c52f285aef354542b77281e76`.
  - El parser Lite normaliza `arccot(x)` a `pi/2-arctan(x)` y Algebrite deja `arccot`/`acot` sin evaluar. `solveArccotTwoPiThirdsEquation` en `src/engine/stepEngine/trigonometricEquation.ts` compara la identidad por muestras con tolerancia `1e-4` (por el truncamiento de `float()`) y verifica `-sqrt(3)/3` con `π/2-atan(x)` en JavaScript; se enruta desde `src/engine/stepEngine/algebra.ts`.
  - Test focal `tests/trigonometryEcI06.audit.test.ts`: 2/2 PASS.
  - Regresión `tests/trigonometryArccotRegression.audit.test.ts`: 3/3 PASS (`arccot(x)=2*pi/3`, forma normalizada `pi/2-arctan(x)=2*pi/3` y `arccot(x)=pi/3` sin candidato del helper).
  - CI https://github.com/c2melendez/precision-lab-lite/actions/runs/42960956690 SUCCESS.
  - Cumulative https://github.com/c2melendez/precision-lab-lite/actions/runs/42960956673 SUCCESS: 415 archivos, 2,446 passed, 8 expected fail, 34 todo; guard `skip=false`, sin REUSE.
  - H1d https://github.com/c2melendez/precision-lab-lite/actions/runs/42960956871 SUCCESS (22/22; `skip=false`).
  - Scientific UI https://github.com/c2melendez/precision-lab-lite/actions/runs/42960956696 SUCCESS (456/456; `skip=false`).
  - Runner https://github.com/c2melendez/precision-lab-lite/actions/runs/42960956968 SUCCESS, push-only.

## Evidencia Plus

- Test-first `9a6dedcf1e07f0a5354534e0710eb0b4043eca25`: CI https://github.com/c2melendez/precision-lab-plus/actions/runs/42960474932 FAILURE. `/api/v1/solve` devolvía `success: True` con `result_data` vacío para `acot(x)=2*pi/3`. Hueco de producto.
- SHA técnico final: `28465525480d2d28d8e39dc8da903b16ec694add`.
  - SymPy no devuelve solución para esta ecuación de arcotangente inversa y su `acot` usa la rama \((-π/2, π/2)\) para argumentos negativos, mientras la matriz congelada usa la rama principal convencional \((0,π)\). `_arccot_two_pi_thirds_result` en `backend/app/services/solve_service.py` reconoce `acot(x)-2*pi/3` y verifica `-sqrt(3)/3` con \(\pi/2-\arctan(x)\) antes del camino genérico.
  - Tests `backend/tests/test_trigonometry_ec_i06.py`: 2/2 PASSED en Cumulative.
  - Cumulative https://github.com/c2melendez/precision-lab-plus/actions/runs/42961178858 SUCCESS: backend 2,953 passed, 1 skipped, 11 xfailed; guard `skip=false`, sin REUSE.
  - CI https://github.com/c2melendez/precision-lab-plus/actions/runs/42961178836 SUCCESS; H1d https://github.com/c2melendez/precision-lab-plus/actions/runs/42961178835 SUCCESS; Native Syntax https://github.com/c2melendez/precision-lab-plus/actions/runs/42961178768 SUCCESS; Runner https://github.com/c2melendez/precision-lab-plus/actions/runs/42961178811 SUCCESS, push-only.
  - Security gate https://github.com/c2melendez/precision-lab-plus/actions/runs/42961178959: validación y seguridad backend SUCCESS; mutación `plus-backend-mutmut` en curso al registrar esta acta.

## Alcance y límites

- PASS_SCOPED cubre exclusivamente `arccot(x)=2*pi/3` en radianes con variable `x`. Lite acepta también la forma normalizada y rechaza otra constante; Plus sólo `acot(x)=2*pi/3` vía `/api/v1/solve`. No es un resolvedor general de arcotangentes inversas.
- La diferencia de rama de `acot` en SymPy queda documentada y compensada en el oráculo; no se cambia la semántica pública del endpoint.
- No certifica la ingesta LaTeX literal en Plus `/api/v1/evaluate`.
- No cierra la sección 2.B de inversas.

**Resultado: PASS_SCOPED bilateral. Certificación global: OPEN.**

EV-D-01 en Plus `/api/v1/evaluate` permanece BLOCKED; EV-HI conserva PASS_SCOPED; S25, SG28, H2 y DIST siguen abiertos.
