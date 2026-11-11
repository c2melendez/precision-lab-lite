# Acta de aceptación - TRIG-EC-I-07

**Estado: PASS_SCOPED bilateral.**

## Contrato congelado

Fuente: `qa/certification/legacy_sources/ejercicios_trigonometria.md.gz`, blob `3a41b0c2e0d79f2eef48e4684dc1324689d0a0fb`.

| ID | Ejercicio | Resultado esperado |
|---|---|---|
| EC-I-07 | \(\operatorname{arcsec} x=\frac{\pi}{3}\) | \(x=2\) |

La fila original tiene tres columnas. No existe una nota separada y no se inventa.

Conjunto de soluciones reales esperado: \(\{2\}\) en la rama principal de \(\operatorname{arcsec}\). El oráculo exige exactamente una raíz, verificada con \(\sec(\pi/3)=2\); en Lite la identidad se evalúa como \(\arccos(1/2)=\pi/3\) porque el parser normaliza `arcsec(x)` a `arccos(1/x)`.

## Evidencia Lite

- Test-first `5b0e501bb2351aba59ca5d74e83fb0e53bc9537a`: el test focal falló con «No se encontró una solución algebraica para x». CI https://github.com/c2melendez/precision-lab-lite/actions/runs/42962913097 FAILURE; Cumulative https://github.com/c2melendez/precision-lab-lite/actions/runs/42962913015 FAILURE. Hueco de producto.
- SHA técnico final: `3d74fb4953310b9179a139fce6decc1b3704e718`.
  - El parser Lite normaliza `arcsec(x)` a `arccos(1/x)` y Algebrite no evalúa `arcsec`. `solveArcsecEqualsPiThirdsEquation` en `src/engine/stepEngine/trigonometricEquation.ts` compara la identidad por muestras con tolerancia `1e-4` (por el truncamiento de `float()`) y verifica `x=2` con \(\arccos(1/2)=\pi/3\) en JavaScript; se enruta desde `src/engine/stepEngine/algebra.ts`. Otras constantes y formas siguen el camino genérico.
  - Test focal `tests/trigonometryEcI07.audit.test.ts`: 2/2 PASS.
  - CI https://github.com/c2melendez/precision-lab-lite/actions/runs/42963305101 SUCCESS.
  - Cumulative https://github.com/c2melendez/precision-lab-lite/actions/runs/42963305029 SUCCESS: 416 archivos, 2,448 passed, 8 expected fail, 34 todo; guard `skip=false`, sin REUSE.
  - H1d https://github.com/c2melendez/precision-lab-lite/actions/runs/42963305042 SUCCESS (22/22; `skip=false`).
  - Scientific UI https://github.com/c2melendez/precision-lab-lite/actions/runs/42963305033 SUCCESS (456/456; `skip=false`).
  - Runner https://github.com/c2melendez/precision-lab-lite/actions/runs/42963305152 SUCCESS, push-only.

## Evidencia Plus

- SHA técnico `cb66602a9bbde41204dfc990b019b3b95eebee05`, sólo prueba `backend/tests/test_trigonometry_ec_i07.py`; sin cambio de producto. La ruta existente de `/api/v1/solve` ya resolvía `asec(x)=pi/3` con la raíz exacta `2`.
- Tests focales `backend/tests/test_trigonometry_ec_i07.py`: 2/2 PASSED en Cumulative.
- CI https://github.com/c2melendez/precision-lab-plus/actions/runs/42962916200 SUCCESS; Cumulative https://github.com/c2melendez/precision-lab-plus/actions/runs/42962916532 SUCCESS (backend 2,955 passed, 1 skipped, 11 xfailed; guard `skip=false`, sin REUSE); H1d https://github.com/c2melendez/precision-lab-plus/actions/runs/42962916326 SUCCESS; Runner https://github.com/c2melendez/precision-lab-plus/actions/runs/42962916227 SUCCESS, push-only.
- Security Plus https://github.com/c2melendez/precision-lab-plus/actions/runs/42961178959 (EC-I-06): validación y seguridad backend SUCCESS; mutación `plus-backend-mutmut` en curso al registrar esta acta.

## Alcance y límites

- PASS_SCOPED cubre exclusivamente `arcsec(x)=pi/3` en radianes con variable `x` en Lite y `asec(x)=pi/3` vía `/api/v1/solve` en Plus. No es un resolvedor general de arcosecantes inversas.
- No certifica la ingesta LaTeX literal en Plus `/api/v1/evaluate`.
- No cierra la sección 2.B de inversas.

**Resultado: PASS_SCOPED bilateral. Certificación global: OPEN.**

EV-D-01 en Plus `/api/v1/evaluate` permanece BLOCKED; EV-HI conserva PASS_SCOPED; S25, SG28, H2 y DIST siguen abiertos.
