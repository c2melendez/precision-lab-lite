# Acta de aceptación - TRIG-EC-I-05

**Estado: PASS_SCOPED bilateral.**

## Contrato congelado

Fuente: `qa/certification/legacy_sources/ejercicios_trigonometria.md.gz`, blob `3a41b0c2e0d79f2eef48e4684dc1324689d0a0fb`.

| ID | Ejercicio | Resultado esperado |
|---|---|---|
| EC-I-05 | \(\arctan x+\arctan(2x)=\frac{\pi}{4}\) | \(x=\frac{\sqrt{17}-3}{4}\) (descartar \(\frac{-3-\sqrt{17}}{4}\)) |

La fila original tiene tres columnas. No existe una nota separada y no se inventa.

Conjunto de soluciones reales esperado: \(\{\frac{\sqrt{17}-3}{4}\}\). El oráculo exige exactamente una raíz, verificada por sustitución en la ecuación original; la otra raíz de \(2x^2+3x-1=0\) produce una suma principal de \(-3\pi/4\) y se descarta.

## Evidencia Lite

- Test-first `3e4ec259ffb5c39eaca06d22e9a9f9b6e774ce30`: los tests focales fallaron con «No se encontró una solución algebraica para x». CI https://github.com/c2melendez/precision-lab-lite/actions/runs/42952105467 FAILURE; Cumulative https://github.com/c2melendez/precision-lab-lite/actions/runs/42952105658 FAILURE. Hueco de producto.
- Intentos de corrección `22e7d1fdf6960e59524f4f66a0d86a175def56de` y `d60ccad19263a5752f80f678a9b06f617a5bd4e4`: siguieron en FAILURE (Cumulative 42953160786 y 42954182834). El helper ya existía, pero su verificación por muestras comparaba el `float()` de Algebrite, truncado a seis decimales (`0.046478...`), con una tolerancia de `1e-9`; el error de truncamiento (~5e-7) hacía que la ecuación correcta se rechazara. Defecto de oráculo interno, no del contrato.
- Diagnóstico temporal `88d5f438abb3395fc950ac5f616d14a17a7aee0b` (`tests/trigonometryEcI05Diagnostic.audit.test.ts`): registró las formas del parser y los valores numéricos; CI 42955131313 y Cumulative 42955131340 FAILURE por el `throw` diagnóstico. Se eliminó en el commit final.
- SHA técnico final: `d837434ee9910aa28affc3830af24830bed182c5`.
  - Cambio de producto: `solveArctanSumQuarterPiEquation` en `src/engine/stepEngine/trigonometricEquation.ts` con tolerancia de muestras `1e-4`, por encima del truncamiento de `float()` y muy por debajo de la separación entre las dos identidades posibles; enrutado desde `src/engine/stepEngine/algebra.ts`.
  - Test focal `tests/trigonometryEcI05.audit.test.ts`: 2/2 PASS en Cumulative.
  - Regresión `tests/trigonometryArctanSumRegression.audit.test.ts`: 3/3 PASS (suma directa, suma invertida y `pi/2` sin candidato).
  - CI https://github.com/c2melendez/precision-lab-lite/actions/runs/42959213697 SUCCESS.
  - Cumulative https://github.com/c2melendez/precision-lab-lite/actions/runs/42959213535 SUCCESS: 413 archivos, 2,441 passed, 8 expected fail, 34 todo; guard `skip=false`, `evidence_run_id` vacío, sin REUSE.
  - H1d https://github.com/c2melendez/precision-lab-lite/actions/runs/42959213530 SUCCESS (22/22; guard `skip=false`).
  - Scientific UI https://github.com/c2melendez/precision-lab-lite/actions/runs/42959213568 SUCCESS (456/456 desktop/tablet/mobile; guard `skip=false`).
  - Runner https://github.com/c2melendez/precision-lab-lite/actions/runs/42959213608 SUCCESS, push-only; sin dispatch manual.

## Evidencia Plus

- Test-first `3782aae6fabdfba73d7d1d69ce0cd9303d085b71` (`backend/tests/test_trigonometry_ec_i05.py`): `/api/v1/solve` devolvió `success: False` para `atan(x)+atan(2*x)=pi/4`. CI https://github.com/c2melendez/precision-lab-plus/actions/runs/42952108168 FAILURE; Cumulative https://github.com/c2melendez/precision-lab-plus/actions/runs/42952108029 FAILURE. Hueco de producto.
- SHA técnico final: `3daa9f2dab3354d8d1e3a525a2f0331d96982bc7`. Helper `_arctan_sum_quarter_pi_result` en `backend/app/services/solve_service.py`, consultado antes del camino genérico de SymPy, sólo en radianes y sólo para la forma congelada.
  - Tests `backend/tests/test_trigonometry_ec_i05.py`: 2/2 PASSED en Cumulative.
  - Cumulative https://github.com/c2melendez/precision-lab-plus/actions/runs/42953170568 SUCCESS: backend 2,951 passed, 1 skipped, 11 xfailed; guard `skip=false`, sin REUSE.
  - CI https://github.com/c2melendez/precision-lab-plus/actions/runs/42953170611 SUCCESS; H1d https://github.com/c2melendez/precision-lab-plus/actions/runs/42953170622 SUCCESS; Native Syntax https://github.com/c2melendez/precision-lab-plus/actions/runs/42953170572 SUCCESS; Runner https://github.com/c2melendez/precision-lab-plus/actions/runs/42953170442 SUCCESS, push-only.
  - Security gate https://github.com/c2melendez/precision-lab-plus/actions/runs/42953170861 SUCCESS, incluido `mutation / plus-backend-mutmut`.

## Alcance y límites

- PASS_SCOPED cubre exclusivamente `arctan(x)+arctan(2x)=pi/4` en radianes con variable `x` (Lite: también la suma invertida y el rechazo de `pi/2`; Plus: vía `/api/v1/solve` con `atan`). No es un resolvedor general de sumas de arcotangentes.
- No certifica la ingesta LaTeX literal en Plus `/api/v1/evaluate`.
- No cierra la sección 2.B de inversas.

**Resultado: PASS_SCOPED bilateral. Certificación global: OPEN.**

EV-D-01 en Plus `/api/v1/evaluate` permanece BLOCKED; EV-HI conserva PASS_SCOPED; S25, SG28, H2 y DIST siguen abiertos.
